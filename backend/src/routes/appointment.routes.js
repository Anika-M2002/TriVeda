import {Router} from 'express';
import {bookAppointment, diagnoseSymptoms, getAvailableSlots, saveDoctorPlan, getDoctorAppointments} from "../controllers/appointment.controller.js";

const router = Router();

router.post("/diagnose", diagnoseSymptoms);
router.get("/slots", getAvailableSlots);
router.post("/book", bookAppointment);
router.get("/:appointmentId/plan", saveDoctorPlan);
router.get("/doctor/:doctorId", getDoctorAppointments);

export default router;