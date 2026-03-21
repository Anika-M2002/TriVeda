import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const prisma = new PrismaClient();

export const diagnoseSymptoms = asyncHandler(async (req, res) => {
    // 1. Accept BOTH raw text and explicit dropdown data from the frontend
    const { 
        problemDescription, // The natural language text box
        providedSymptoms,   // Array of symptoms they checked (optional)
        providedSeverity,   // Dropdown selection (optional)
        providedDuration    // Dropdown selection (optional)
    } = req.body;

    // Validate that they gave us at least something to work with
    if (!problemDescription || problemDescription.trim() === "") {
        throw new ApiError(400, "Please describe your Problem. Problem Description is required for diagnosis."); // We require the raw text for AI processing, but the others are optional
    }

    // 2. Fetch Departments (Express does this, NOT Python!)
    const departments = await prisma.department.findMany({
        select: { id: true, name: true, description: true }
    });

    if (departments.length === 0) {
        throw new ApiError(500, "No hospital departments found in the database.");
    }

    try {
        const aiMicroserviceUrl = process.env.AI_MICROSERVICE_URL || 'http://localhost:8000';
        
        // 3. Send EVERYTHING to the AI, including the user's explicit choices
        const aiResponse = await axios.post(`${aiMicroserviceUrl}/api/triage`, {
            raw_symptoms: problemDescription || "",
            explicit_symptoms: providedSymptoms || [],
            explicit_severity: providedSeverity || null,
            explicit_duration: providedDuration || null,
            available_departments: departments
        });

        const { 
            final_symptoms, // AI merges provided ones with extracted ones
            final_severity, // AI uses provided, or extracts if missing
            final_duration, // AI uses provided, or extracts if missing
            dosha_indicator, 
            recommended_department_id 
        } = aiResponse.data;

        // 4. Send the finalized profile back to the frontend to lock in the booking
        return res.status(200).json(
            new ApiResponse(200, {
                departmentId: recommended_department_id,
                symptoms: final_symptoms,
                severity: final_severity,
                duration: final_duration,
                doshaIndicator: dosha_indicator
            }, "Diagnosis complete.")
        );

    } catch (error) {
        console.error("AI Microservice Error:", error.message);
        throw new ApiError(503, "The AI Triage service is currently unavailable.");
    }
});


export const getAvailableSlots=asyncHandler(async(req,res)=>{
    const {departmentId, date} = req.query;

    if(!departmentId || !date){
        throw new ApiError(400, "Department ID and Date are required to find slots.");
    }

    const doctors=await prisma.doctorProfile.findMany({
        where: {departmentId: departmentId, isAvailable: true},
        select: {userId: true}
    });

    if(doctors.length===0){
        throw new ApiError(404, "No doctors are currently available in this department.");
    }

    const doctorIds=doctors.map(doc=>doc.userId);

    const allPossibleSlots=[
        "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
        "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
    ];

    const startOfDay=new Date(`${date}T00:00:00.000Z`);
    const endOfDay=new Date(`${date}T23:59:59.999Z`);

    const bookedAppointments=await prisma.appointment.findMany({
        where: {
            doctorId: {in: doctorIds},
            scheduledAt: {gte: startOfDay, lte: endOfDay},
            status: {not: 'CANCELLED'}
        },
        select: {scheduledAt: true}
    });

    const bookingsPerSlot={};

    bookedAppointments.forEach(app=>{
        const timeString=app.scheduledAt.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', timeZone: 'UTC'
        });
        bookingsPerSlot[timeString]=(bookingsPerSlot[timeString] || 0) + 1;
    });

    const availableSlots=allPossibleSlots.filter(slot=>{
        const totalBookingsForThisSlot=bookingsPerSlot[slot] || 0;
        return totalBookingsForThisSlot < doctorIds.length;
    });

    return res.status(200).json(
        new ApiResponse(200, {
            date,
            departmentId,
            totalDoctorsAvailable: doctorIds.length,
            availableSlots
        }, "Available slots fetched successfully.")
    );
});

export const bookAppointment = asyncHandler(async (req, res) => {
    const {
        patientId,
        departmentId,
        selectedTimeSlots,
        date,
        finalSymptoms
    } = req.body;

    if(!patientId || !departmentId || !selectedTimeSlots || selectedTimeSlots.length === 0 || !date){
        throw new ApiError(400, "Missing required booking details.");
    }

    const patient=await prisma.user.findUnique({
        where: {id: patientId},
        include: {patientProfile: true}
    });

    if(!patient){
        throw new ApiError(404, "Patient not found in the system.");
    }

    const doctors=await prisma.doctorProfile.findMany({
        where: {departmentId: departmentId, isAvailable: true}
    });

    if(doctors.length===0){
        throw new ApiError(404, "No doctors are currently available for this department.");
    }

    let topDoctorId=doctors[0].userId;
    let aiSummaryText="Assigned based on general availability.";

    try {
        const aiMicroserviceUrl = process.env.AI_MICROSERVICE_URL || 'http://localhost:8000';

        const aiResponse = await axios.post(`${aiMicroserviceUrl}/api/matchmaker`, {
            patient_profile: {
                symptoms: finalSymptoms,
                prakriti: patient.patientProfile?.prakriti || "Unknown",
                age: patient.patientProfile?.age || "Unknown",
            },
            available_doctors: doctors.map(doc => ({
                doctorId: doc.userId,
                experience_years: doc.experienceYrs,
                speciality: doc.specialty
            }))
        });
        
        topDoctorId=aiResponse.data.top_doctor_id;
        aiSummaryText=aiResponse.data.match_reason;
    } catch (error) {
        console.warn("AI Matchmaker unavailable, using fallback doctor.");
        console.log("AI Matchmaker Error:", error.message);
    }

    const assignedSlot=selectedTimeSlots[0];
    const timeParts=assignedSlot.match(/(\d+):(\d+)\s(AM|PM)/);
    let hours = parseInt(timeParts[1]);
    const minutes = parseInt(timeParts[2]);
    if (timeParts[3] === 'PM' && hours < 12) hours += 12;
    if (timeParts[3] === 'AM' && hours === 12) hours = 0;
    
    const scheduledAt = new Date(`${date}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00.000Z`);

    // 6. Lock it into the Database!
    const appointment = await prisma.appointment.create({
        data: {
            patientId,
            doctorId: topDoctorId,
            scheduledAt,
            status: "SCHEDULED",
            patientSymptoms: Array.isArray(finalSymptoms) ? finalSymptoms.join(", ") : finalSymptoms,
            aiSummary: aiSummaryText,
            paymentStatus: "PENDING" // This perfectly sets up your mock payment screen
        }
    });

    // 7. Send the success payload back to React to trigger the "Success / Mock Payment" screen
    return res.status(201).json(
        new ApiResponse(201, { 
            appointmentId: appointment.id, 
            doctorId: topDoctorId, 
            scheduledAt 
        }, "Matchmaking complete! Appointment locked. Proceed to payment.")
    );
});

export const saveDoctorPlan = asyncHandler(async (req, res) => {
    const { appointmentId } = req.params;
    const { 
        doctorNotes, 
        dietChart,      // Expecting a JSON object from React
        routinePlan,    // Expecting a JSON object from React
        medications,    // Expecting a JSON object from React
        isCompleted     // Boolean: Did the doctor finish the call?
    } = req.body;

    // 1. Verify the appointment exists
    const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId }
    });

    if (!appointment) {
        throw new ApiError(404, "Appointment not found.");
    }

    // 2. Update the appointment with the new JSON data
    const updatedAppointment = await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
            doctorNotes: doctorNotes !== undefined ? doctorNotes : appointment.doctorNotes,
            dietChart: dietChart !== undefined ? dietChart : appointment.dietChart,
            routinePlan: routinePlan !== undefined ? routinePlan : appointment.routinePlan,
            medications: medications !== undefined ? medications : appointment.medications,
            isCompleted: isCompleted !== undefined ? isCompleted : appointment.isCompleted,
            status: isCompleted ? "COMPLETED" : appointment.status // Auto-update status
        }
    });

    // 3. Send Success back to React
    return res.status(200).json(
        new ApiResponse(200, {
            appointmentId: updatedAppointment.id,
            isCompleted: updatedAppointment.isCompleted
        }, "Treatment plan securely saved.")
    );
});

export const getDoctorAppointments = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;

    if (!doctorId) {
        throw new ApiError(400, "Doctor ID is required.");
    }

    // Fetch appointments with all the nested patient data the frontend needs
    const appointments = await prisma.appointment.findMany({
        where: { 
            doctorId: doctorId,
            // Optional: You can filter out CANCELLED appointments here if you want
            status: { not: "CANCELLED" } 
        },
        orderBy: {
            scheduledAt: 'asc' // Oldest/Closest appointments first
        },
        include: {
            // This is the Prisma magic. We pull the Patient's details in the same query.
            patient: {
                select: {
                    name: true,
                    phoneNumber: true,
                    patientProfile: {
                        select: {
                            age: true,
                            gender: true,
                            prakriti: true,
                            vikriti: true,
                            bloodGroup: true
                        }
                    }
                }
            }
        }
    });

    if (!appointments || appointments.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [], "No upcoming appointments found.")
        );
    }

    // Format the data so it perfectly matches what the React frontend expects
    const formattedAppointments = appointments.map(app => ({
        appointmentId: app.id,
        scheduledAt: app.scheduledAt,
        status: app.status,
        isCompleted: app.isCompleted,
        paymentStatus: app.paymentStatus,
        patientSymptoms: app.patientSymptoms,
        aiSummary: app.aiSummary,
        
        // Flatten the patient data for easier frontend mapping
        patient: {
            id: app.patientId,
            name: app.patient.name,
            phone: app.patient.phoneNumber,
            age: app.patient.patientProfile?.age || "N/A",
            gender: app.patient.patientProfile?.gender || "N/A",
            prakriti: app.patient.patientProfile?.prakriti || "Assessment Pending",
            vikriti: app.patient.patientProfile?.vikriti || "N/A"
        }
    }));

    return res.status(200).json(
        new ApiResponse(200, formattedAppointments, "Doctor appointments fetched successfully.")
    );
});