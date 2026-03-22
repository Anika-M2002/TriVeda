import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { prisma } from './db/config.js';

//Routes
import authRoutes from './routes/auth.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();
const port = process.env.PORT || 8000;

// Configurations
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true, limit: '16kb'}));
app.use(express.static('public'));
app.use(cookieParser());

// Health Check
app.get('/', async (req, res) => {
    try {
        const connection = await prisma.$connect;
        res.status(200).json({
            message: 'Prisma connected to NeonDB successfully!',
            connection: connection ? 'Connected' : 'Not Connected',
        });
    } catch (err) {
        console.error(`Database Connection Error`, err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// ==========================================
// MOUNT ROUTES
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});