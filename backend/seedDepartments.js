import 'dotenv/config'; 
import { prisma } from './src/db/config.js'; 

const departments = [
    {
        name: "Cardiology",
        description: "Heart problems, chest pain, high blood pressure. Keywords: heart, chest pain, palpitations, bp, blood pressure"
    },
    {
        name: "Gastroenterology",
        description: "Stomach issues, acidity, digestion problems. Keywords: stomach, acidity, digestion, burning, vomiting, nausea"
    },
    {
        name: "Neurology",
        description: "Headaches, migraines, dizziness, nerve problems. Keywords: headache, dizziness, blurred vision, migraine, nerve"
    },
    {
        name: "Pulmonology",
        description: "Breathing issues, cough, asthma. Keywords: cough, breathing, asthma, lungs, respiratory"
    },
    {
        name: "Orthopedics",
        description: "Bone, joint, muscle pain. Keywords: joint, bone, muscle, back pain, knee, spine"
    },
    {
        name: "Dermatology",
        description: "Skin problems, rashes, allergies. Keywords: skin, rash, itching, acne, hair"
    },
    {
        name: "Psychiatry",
        description: "Mental health, anxiety, depression. Keywords: anxiety, depression, stress, sleep, mental"
    },
    {
        name: "ENT",
        description: "Ear, nose, throat problems. Keywords: ear, nose, throat, hearing, sinus"
    },
    {
        name: "Ophthalmology",
        description: "Eye problems. Keywords: eye, vision, blurred, sight"
    },
    {
        name: "Urology",
        description: "Urinary tract issues. Keywords: urine, kidney, bladder, uti"
    },
    {
        name: "Gynecology",
        description: "Women's health. Keywords: period, pregnancy, women, menstrual"
    },
    {
        name: "General Medicine",
        description: "General health concerns not specific to other departments."
    }
];

async function seed() {
    console.log("🌱 Starting department seed process...");
    
    try {
        // Clear existing departments just in case you run this twice
        await prisma.department.deleteMany({});
        console.log("🧹 Cleared old departments.");

        // Insert all new departments
        for (const dept of departments) {
            const created = await prisma.department.create({
                data: dept
            });
            console.log(`✅ Added: ${created.name}`);
        }

        console.log("🎉 Seeding complete! You can now test the API.");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
    } finally {
        process.exit(0);
    }
}

seed();