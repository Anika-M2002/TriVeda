import { prisma } from '../db/config.js';
import axios from 'axios';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// ==========================================
// 1. SMART INTAKE
// ==========================================
export const diagnoseSymptoms = asyncHandler(async (req, res) => {
    const { problemDescription, providedSymptoms, providedSeverity, providedDuration } = req.body;

    if (!problemDescription && (!providedSymptoms || providedSymptoms.length === 0)) {
        throw new ApiError(400, "Please describe your problem or select symptoms.");
    }

    const departments = await prisma.department.findMany({
        select: { id: true, name: true, description: true }
    });

    try {
        const aiMicroserviceUrl = process.env.AI_MICROSERVICE_URL || 'http://localhost:8000';
        const aiResponse = await axios.post(`${aiMicroserviceUrl}/api/triage`, {
            raw_symptoms: problemDescription || "",
            explicit_symptoms: providedSymptoms || [],
            explicit_severity: providedSeverity || null,
            explicit_duration: providedDuration || null,
            available_departments: departments
        });

        return res.status(200).json(new ApiResponse(200, aiResponse.data, "Diagnosis complete."));
    } catch (error) {
        throw new ApiError(503, "The AI Triage service is currently unavailable.");
    }
});

// ==========================================
// 2. TIME SLOTS
// ==========================================
export const getAvailableSlots = asyncHandler(async (req, res) => {
    const { departmentId, date, doctorId } = req.query;

    if (!departmentId || !date) {
        throw new ApiError(400, "Department ID and Date are required.");
    }

    // REFACTOR: We now query DoctorProfile which is linked to HospitalStaff
    const whereClause = { departmentId: departmentId, isAvailable: true };
    if (doctorId) whereClause.staffId = doctorId; // Hybrid Manual Flow support

    const doctors = await prisma.doctorProfile.findMany({
        where: whereClause,
        select: { staffId: true }
    });

    if (doctors.length === 0) {
        throw new ApiError(404, "No doctors available.");
    }

    const doctorIds = doctors.map(doc => doc.staffId);
    const allPossibleSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const bookedAppointments = await prisma.appointment.findMany({
        where: { doctorId: { in: doctorIds }, scheduledAt: { gte: startOfDay, lte: endOfDay }, status: { not: "CANCELLED" } },
        select: { scheduledAt: true }
    });

    const bookingsPerSlot = {};
    bookedAppointments.forEach(app => {
        const timeString = app.scheduledAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
        bookingsPerSlot[timeString] = (bookingsPerSlot[timeString] || 0) + 1;
    });

    const availableSlots = allPossibleSlots.filter(slot => (bookingsPerSlot[slot] || 0) < doctorIds.length);

    return res.status(200).json(new ApiResponse(200, { date, availableSlots }, "Slots fetched."));
});

// ==========================================
// 3. BOOK APPOINTMENT 
// ==========================================
export const bookAppointment = asyncHandler(async (req, res) => {
    const { patientId, departmentId, selectedTimeSlots, date, finalSymptoms, doctorId } = req.body;

    if (!patientId || !departmentId || !selectedTimeSlots || selectedTimeSlots.length === 0 || !date) {
        throw new ApiError(400, "Missing booking details.");
    }

    // REFACTOR: Check the new Patient table
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) throw new ApiError(404, "Patient not found.");

    let finalDoctorId = doctorId;
    let aiSummaryText = doctorId ? "Manually selected by patient." : "Assigned based on availability.";

    // If no doctor was manually selected, run the AI Matchmaker
    if (!doctorId) {
        const availableDoctors = await prisma.doctorProfile.findMany({
            where: { departmentId: departmentId, isAvailable: true },
            include: { staff: true } // We need the staff info (name, etc)
        });

        if (availableDoctors.length === 0) throw new ApiError(404, "No doctors available.");
        finalDoctorId = availableDoctors[0].staffId; // Fallback

        try {
            const aiMicroserviceUrl = process.env.AI_MICROSERVICE_URL || 'http://localhost:8000';
            const aiResponse = await axios.post(`${aiMicroserviceUrl}/api/matchmaker`, {
                patient_profile: { symptoms: finalSymptoms, prakriti: patient.prakriti || "Unknown", age: patient.age || "Unknown" },
                available_doctors: availableDoctors.map(doc => ({ doctor_id: doc.staffId, experience_years: doc.experienceYrs, specialty: doc.specialty }))
            });
            finalDoctorId = aiResponse.data.top_doctor_id;
            aiSummaryText = aiResponse.data.match_reason;
        } catch (error) {
            console.warn("AI Matchmaker offline, using fallback.");
        }
    }

    const timeParts = selectedTimeSlots[0].match(/(\d+):(\d+)\s(AM|PM)/);
    let hours = parseInt(timeParts[1]);
    if (timeParts[3] === 'PM' && hours < 12) hours += 12;
    if (timeParts[3] === 'AM' && hours === 12) hours = 0;
    const scheduledAt = new Date(`${date}T${hours.toString().padStart(2, '0')}:${timeParts[2]}:00.000Z`);

    const appointment = await prisma.appointment.create({
        data: {
            patientId,
            doctorId: finalDoctorId,
            scheduledAt,
            patientSymptoms: Array.isArray(finalSymptoms) ? finalSymptoms.join(", ") : finalSymptoms,
            aiSummary: aiSummaryText
        }
    });

    return res.status(201).json(new ApiResponse(201, { appointmentId: appointment.id }, "Appointment locked."));
});

// ==========================================
// 4. FETCH DOCTOR APPOINTMENTS 
// ==========================================
export const getDoctorAppointments = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;

    const appointments = await prisma.appointment.findMany({
        where: { doctorId: doctorId, status: { not: "CANCELLED" } },
        orderBy: { scheduledAt: 'asc' },
        include: {
  
            patient: { select: { id: true, name: true, phoneNumber: true, age: true, gender: true, prakriti: true, vikriti: true } }
        }
    });

    return res.status(200).json(new ApiResponse(200, appointments, "Appointments fetched."));
});

// ==========================================
// 5. SAVE DOCTOR PLAN 
// ==========================================
export const saveDoctorPlan = asyncHandler(async (req, res) => {
    const { appointmentId } = req.params;
    const { doctorNotes, dietChart, routinePlan, medications, isCompleted } = req.body;

    const appointment = await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
            doctorNotes, dietChart, routinePlan, medications, isCompleted,
            status: isCompleted ? "COMPLETED" : undefined
        }
    });

    return res.status(200).json(new ApiResponse(200, { appointmentId: appointment.id }, "Plan saved."));
});