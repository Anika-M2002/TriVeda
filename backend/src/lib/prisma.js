import 'dotenv/config';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../../generated/prisma/client.ts';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Tell Neon to use standard WebSockets in a Node environment
neonConfig.webSocketConstructor = ws;

// Initialize the Neon connection pool
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

// Wrap it in the Prisma Neon Adapter
const adapter = new PrismaNeon(pool);

// Export the Prisma Client
export const prisma = new PrismaClient({ adapter });

export default prisma;
