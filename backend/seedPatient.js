import 'dotenv/config';
import { prisma } from './src/db/config.js';
import bcrypt from 'bcryptjs';

async function seed() {
    try {
        console.log("🧑‍⚕️ Creating Dummy Patient Account...");
        
        const hashedPassword = await bcrypt.hash("patient123", 10);

        // We use upsert so if you run this twice, it doesn't crash
        const patient = await prisma.patient.upsert({
            where: { email: "rahul@example.com" },
            update: {},
            create: {
                name: "Rahul Sharma",
                email: "rahul@example.com",
                password: hashedPassword,
                phoneNumber: "+919876543210",
                age: 28,
                gender: "Male",
                prakriti: "Pitta-Vata", // Setting up Dosha for the AI Matchmaker later!
                isAppRegistered: true
            }
        });

        console.log("✅ Success! You can now test patient login with:");
        console.log("Email: rahul@example.com | Password: patient123");
        
    } catch (error) {
        console.error("❌ Failed:", error);
    } finally {
        process.exit(0);
    }
}

seed();