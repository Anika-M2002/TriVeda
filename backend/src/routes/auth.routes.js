import { Router } from 'express';
import { registerPatient, loginUser, createDoctor } from '../controllers/auth.controllers.js';

const router = Router();

// These will automatically be prefixed with /api/auth in app.js
router.post('/register', registerPatient);
router.post('/login', loginUser);
router.post('/admin/doctors', createDoctor); // Full URL: /api/auth/admin/doctors

export default router;