import {Router} from 'express';
import {bookAppointment, diagnoseSymptoms, getAvailableSlots} from "../controllers/appointment.controller.js";

const router = Router();

router.post("/diagnose", diagnoseSymptoms);
router.get("/slots", getAvailableSlots);
router.post("/book", bookAppointment);

export default router;