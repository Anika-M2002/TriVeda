import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error("Missing DIRECT_URL or DATABASE_URL in environment");
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };

// import { PrismaClient } from '@prisma/client';
// import { Pool, neonConfig } from '@neondatabase/serverless';
// import { PrismaNeon } from '@prisma/adapter-neon';
// import ws from 'ws';
// import 'dotenv/config';

// // 1. Tell Neon to use standard WebSockets in a Node environment
// neonConfig.webSocketConstructor = ws;

// // 2. Initialize the Neon connection pool
// const connectionString = process.env.DATABASE_URL;
// const pool = new Pool({ connectionString });

// // 3. Wrap it in the Prisma 7 Adapter
// const adapter = new PrismaNeon(pool);

// // 4. Export the perfectly configured Prisma 7 Client
// export const prisma = new PrismaClient({ adapter });