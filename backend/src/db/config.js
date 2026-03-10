// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);

// const { PrismaClient } = require('@prisma/client');
// const { PrismaNeon } = require('@prisma/adapter-neon');
// const { Pool, neonConfig } = require('@neondatabase/serverless');
// const ws = require('ws');

// // 1. Force Neon to use WebSockets
// neonConfig.webSocketConstructor = ws;

// // 2. HARDCODED URL: Bypassing the corrupted .env file entirely!
// const connectionString = "postgresql://neondb_owner:npg_aBAl1X2huHmr@ep-billowing-wind-ajr958hx.c-3.us-east-2.aws.neon.tech/neondb?sslmode=require";

// // 3. Connect using Neon's official Serverless Pool
// const pool = new Pool({ connectionString });

// // 4. Wrap the pool in the official Neon Adapter
// const adapter = new PrismaNeon(pool);
// export const prisma = new PrismaClient({ adapter });

// prisma.$connect()
//   .then(() => console.log('✅ Prisma connected natively to NeonDB via WebSockets!'))
//   .catch((err) => {
//     console.error('❌ Prisma Connection Error:', err);
//     process.exit(1);
//   });

import 'dotenv/config'
import { PrismaClient } from './generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
})

export const prisma = new PrismaClient({ adapter })