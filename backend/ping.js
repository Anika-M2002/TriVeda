import { prisma } from './src/db/config.js';

async function testConnection() {
    try {
        console.log("🔄 Pinging NeonDB...");
        const departments = await prisma.department.findMany();
        
        console.log(`✅ Success! Found ${departments.length} departments.`);
        console.log("Here is the first one:", departments[0].name);
    } catch (error) {
        console.error("❌ Connection failed:", error);
    } finally {
        process.exit(0);
    }
}

testConnection();