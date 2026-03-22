import { Router } from 'express';
import { staffLogin, patientLogin, logout } from '../controllers/auth.controller.js';

const router = Router();

// ==========================================
// LOGIN ROUTES
// ==========================================
router.post("/staff/login",staffLogin);
router.post("/patient/login",patientLogin);
router.post("/logout",logout);

export default router;