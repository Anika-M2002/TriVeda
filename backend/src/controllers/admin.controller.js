import { prisma } from '../db/config.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getDepartments = asyncHandler(async (req, res) => {
    const departments = await prisma.department.findMany({
        select: { id: true, name: true, description: true }
    });

    return res.status(200).json(new ApiResponse(200, departments, "Departments fetched successfully."));
});

export const createDoctor = asyncHandler(async (req, res) => {
    const { name, email, specialization, departmentId, hospitalId } = req.body;

    if (!name || !email || !specialization || !departmentId) {
        throw new ApiError(400, "Missing required fields.");
    }

    let finalHospitalId = hospitalId;

    if (!finalHospitalId) {
        const token = req.cookies?.triveda_auth;

        if (token) {
            try {
                const decoded = jwt.verify(
                    token,
                    process.env.JWT_SECRET || "fallback_super_secret_triveda_key_do_not_use_in_prod"
                );

                const loggedInStaff = await prisma.hospitalStaff.findUnique({
                    where: { id: decoded.id },
                    select: { hospitalId: true, role: true }
                });

                if (loggedInStaff?.role === "ADMIN") {
                    finalHospitalId = loggedInStaff.hospitalId;
                }
            } catch (error) {
                // If token verification fails, we keep finalHospitalId as-is and fail validation below.
            }
        }
    }

    if (!finalHospitalId) {
        throw new ApiError(400, "Hospital ID is required. Please log in again.");
    }

    // 1. Check if email exists
    const existingStaff = await prisma.hospitalStaff.findUnique({ where: { email } });
    if (existingStaff) throw new ApiError(400, "Email is already registered.");

    // 2. Auto-Generate the Password (e.g. Doc-4f8a2b)
    const randomHex = crypto.randomBytes(3).toString('hex');
    const generatedPassword = `Doc-${randomHex}`;
    
    // Hash it before saving to the database
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // 3. Use the departmentId provided from the frontend
    let finalDepartmentId = departmentId;
    
    // If departmentId is provided, verify it exists
    if (departmentId) {
        const department = await prisma.department.findUnique({ where: { id: departmentId } });
        if (!department) {
            throw new ApiError(404, "Department not found.");
        }
    }

    // 4. Create the Doctor in a single transaction
    const newDoctor = await prisma.hospitalStaff.create({
        data: {
            name, 
            email, 
            password: hashedPassword, 
            role: "DOCTOR", 
            hospitalId: finalHospitalId,
            doctorProfile: {
                create: { 
                    specialty: specialization, 
                    departmentId: finalDepartmentId || null,
                    experienceYrs: 0 // Default skipped value
                }
            }
        }
    });

    // 5. Send the RAW generated password back in the response so the Admin UI can display it
    return res.status(201).json(new ApiResponse(201, { 
        doctorId: newDoctor.id,
        temporaryPassword: generatedPassword 
    }, "Doctor added successfully."));
});