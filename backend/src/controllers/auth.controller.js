import { prisma } from '../db/config.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// Helper function to generate the token and set the cookie
const generateTokenAndSetCookie = (user, role, res) => {
    // 1. Create the JWT Payload (The data hidden inside the token)
    const payload = {
        id: user.id,
        role: role,
        email: user.email
    };

    // 2. Sign the token (Make sure you add JWT_SECRET to your .env!)
    const token = jwt.sign(
        payload, 
        process.env.JWT_SECRET || "fallback_super_secret_triveda_key_do_not_use_in_prod", 
        { expiresIn: '7d' }
    );

    // 3. Set the HTTP-Only Cookie
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only true if HTTPS
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    res.cookie('triveda_auth', token, cookieOptions);
    return token;
};

// ==========================================
// HOSPITAL STAFF LOGIN (B2B)
// ==========================================
export const staffLogin = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        throw new ApiError(400, "Email, password, and role are required.");
    }

    // 1. Find the staff member
    const staff = await prisma.hospitalStaff.findUnique({
        where: { email },
        include: { doctorProfile: true, therapistProfile: true }
    });

    if (!staff) {
        throw new ApiError(404, "Staff member not found.");
    }

    // 2. Verify their role matches the portal they are using
    if (staff.role !== role) {
        throw new ApiError(403, `Access denied. This portal is for ${role}s only.`);
    }

    // 3. Check the password
    // NOTE: In a real app, passwords MUST be hashed. For the MVP, if they aren't hashed in DB, use direct compare.
    const isPasswordValid = await bcrypt.compare(password, staff.password).catch(() => password === staff.password);
    
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials.");
    }

    // 4. Generate Token & Cookie
    generateTokenAndSetCookie(staff, staff.role, res);

    // 5. Send safe user data back to React
    const safeUserData = {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        hospitalId: staff.hospitalId,
        // If they are a doctor, send their specific profile ID too!
        profileId: staff.doctorProfile?.id || staff.therapistProfile?.id || null 
    };

    return res.status(200).json(
        new ApiResponse(200, { user: safeUserData }, "Login successful.")
    );
});

// ==========================================
// PATIENT LOGIN (B2C)
// ==========================================
export const patientLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required.");
    }

    const patient = await prisma.patient.findUnique({ where: { email } });

    if (!patient || !patient.isAppRegistered) {
        throw new ApiError(404, "Patient account not found. Please register.");
    }

    const isPasswordValid = await bcrypt.compare(password, patient.password).catch(() => password === patient.password);
    
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials.");
    }

    generateTokenAndSetCookie(patient, "PATIENT", res);

    const safeUserData = {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        prakriti: patient.prakriti
    };

    return res.status(200).json(
        new ApiResponse(200, { user: safeUserData }, "Login successful.")
    );
});

// ==========================================
// LOGOUT (Clears the cookie)
// ==========================================
export const logout = asyncHandler(async (req, res) => {
    res.clearCookie('triveda_auth', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    return res.status(200).json(new ApiResponse(200, {}, "Logged out successfully."));
});