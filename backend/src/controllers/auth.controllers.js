import { prisma } from '../db/config.js';

// ==========================================
// 1. PATIENT REGISTRATION
// ==========================================
export const registerPatient = async (req, res) => {
    try {
        const { email, password, name, age, gender, bloodGroup } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered." });
        }

        const newUser = await prisma.user.create({
            data: {
                email, password, name, role: 'PATIENT',
                patientProfile: {
                    create: {
                        age: age ? parseInt(age) : null,
                        gender, bloodGroup
                    }
                }
            },
            include: { patientProfile: true }
        });

        res.status(201).json({
            success: true, message: "Patient registered successfully!",
            user: {
                id: newUser.id, name: newUser.name, email: newUser.email,
                role: newUser.role, profile: newUser.patientProfile
            }
        });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Failed to register patient." });
    }
};

// ==========================================
// 2. USER LOGIN
// ==========================================
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
            include: { patientProfile: true, doctorProfile: true }
        });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        res.status(200).json({
            success: true, message: "Login successful!",
            user: {
                id: user.id, name: user.name, email: user.email, role: user.role,
                profile: user.role === 'PATIENT' ? user.patientProfile : user.doctorProfile
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Failed to login." });
    }
};

// ==========================================
// 3. CREATE DOCTOR
// ==========================================
export const createDoctor = async (req, res) => {
    try {
        const { email, password, name, specialty, experienceYrs } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered." });
        }

        const newDoctor = await prisma.user.create({
            data: {
                email, password, name, role: 'DOCTOR',
                doctorProfile: {
                    create: { specialty, experienceYrs: parseInt(experienceYrs) }
                }
            },
            include: { doctorProfile: true }
        });

        res.status(201).json({
            success: true, message: "Doctor profile created successfully!",
            doctor: {
                id: newDoctor.id, name: newDoctor.name,
                role: newDoctor.role, profile: newDoctor.doctorProfile
            }
        });
    } catch (error) {
        console.error("Doctor Creation Error:", error);
        res.status(500).json({ error: "Failed to create doctor." });
    }
};