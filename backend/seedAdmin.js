import 'dotenv/config';
import { prisma } from './src/db/config.js';
import bcrypt from 'bcryptjs';

async function seed() {
    try {
        console.log("🏥 Creating City Hospital & Admin Account...");
        
        const hashedPassword = await bcrypt.hash("admin123", 10);

        // 1. Create a Hospital first
        const hospital = await prisma.hospital.create({
            data: { name: "City Ayurvedic Hospital", address: "Ahmedabad, Gujarat" }
        });

        // 2. Create the Master Admin
        const admin = await prisma.hospitalStaff.create({
            data: {
                name: "Master Admin",
                email: "admin@cityhospital.com",
                password: hashedPassword,
                role: "ADMIN",
                hospitalId: hospital.id
            }
        });

        console.log("✅ Success! You can now log in with:");
        console.log("Email: admin@cityhospital.com | Password: admin123");
        console.log(`Hospital ID (Save this for later): ${hospital.id}`);
        
    } catch (error) {
        console.error("❌ Failed:", error);
    } finally {
        process.exit(0);
    }
}

seed();