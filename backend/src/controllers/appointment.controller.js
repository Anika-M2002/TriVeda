import { prisma } from "../db/config.js";
import axios from "axios";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const ALL_POSSIBLE_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

const toTitleCase = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const toSafeString = (value, fieldName, maxLength = 2000) => {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") {
    throw new ApiError(400, `${fieldName} must be a string.`);
  }
  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    throw new ApiError(400, `${fieldName} exceeds maximum length of ${maxLength}.`);
  }
  return trimmed;
};

const toStringArray = (value, fieldName, maxItems = 200, maxItemLength = 300) => {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) {
    throw new ApiError(400, `${fieldName} must be an array.`);
  }
  if (value.length > maxItems) {
    throw new ApiError(400, `${fieldName} exceeds maximum items (${maxItems}).`);
  }

  return value.map((item, index) => {
    if (typeof item !== "string") {
      throw new ApiError(400, `${fieldName}[${index}] must be a string.`);
    }
    const trimmed = item.trim();
    if (trimmed.length > maxItemLength) {
      throw new ApiError(
        400,
        `${fieldName}[${index}] exceeds maximum length of ${maxItemLength}.`
      );
    }
    return trimmed;
  });
};

const parseDurationDays = (medication, index) => {
  const raw = medication.durationDays ?? medication.duration;
  if (raw === undefined || raw === null || raw === "") return null;

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new ApiError(
      400,
      `medications[${index}].duration/durationDays must be a non-negative number.`
    );
  }

  return Math.round(parsed);
};

const normalizeDoctorPlanPayload = (payload) => {
  const doctorNotes = toSafeString(payload?.doctorNotes, "doctorNotes", 5000);

  const diagnosisInput = payload?.diagnosis;
  if (
    diagnosisInput !== undefined &&
    diagnosisInput !== null &&
    typeof diagnosisInput !== "object"
  ) {
    throw new ApiError(400, "diagnosis must be an object.");
  }

  const diagnosis = diagnosisInput
    ? {
        finalPrakriti: toSafeString(
          diagnosisInput.finalPrakriti,
          "diagnosis.finalPrakriti",
          120
        ),
        finalVikriti: toSafeString(
          diagnosisInput.finalVikriti,
          "diagnosis.finalVikriti",
          120
        ),
        chiefComplaint: toSafeString(
          diagnosisInput.chiefComplaint,
          "diagnosis.chiefComplaint",
          4000
        ),
      }
    : null;

  const dietInput = payload?.dietChart;
  if (dietInput !== undefined && dietInput !== null && typeof dietInput !== "object") {
    throw new ApiError(400, "dietChart must be an object.");
  }

  const dietChart = dietInput
    ? {
        items: toStringArray(dietInput.items, "dietChart.items"),
        pathya: toStringArray(dietInput.pathya, "dietChart.pathya"),
        apathya: toStringArray(dietInput.apathya, "dietChart.apathya"),
      }
    : { items: [], pathya: [], apathya: [] };

  const routineInput = payload?.routinePlan;
  if (
    routineInput !== undefined &&
    routineInput !== null &&
    typeof routineInput !== "object"
  ) {
    throw new ApiError(400, "routinePlan must be an object.");
  }

  const routinePlan = routineInput
    ? {
        mode: toSafeString(routineInput.mode, "routinePlan.mode", 80) || "manual",
        sleepSchedule: toSafeString(
          routineInput.sleepSchedule,
          "routinePlan.sleepSchedule",
          2000
        ),
        exercisesAndAsanas: toStringArray(
          routineInput.exercisesAndAsanas,
          "routinePlan.exercisesAndAsanas"
        ),
        therapy: toStringArray(routineInput.therapy, "routinePlan.therapy"),
        tests: toStringArray(routineInput.tests, "routinePlan.tests"),
      }
    : {
        mode: "manual",
        sleepSchedule: "",
        exercisesAndAsanas: [],
        therapy: [],
        tests: [],
      };

  const medicationsInput = payload?.medications;
  if (medicationsInput !== undefined && !Array.isArray(medicationsInput)) {
    throw new ApiError(400, "medications must be an array.");
  }

  const medications = (medicationsInput || [])
    .map((medication, index) => {
      if (!medication || typeof medication !== "object") {
        throw new ApiError(400, `medications[${index}] must be an object.`);
      }

      const name = toSafeString(medication.name, `medications[${index}].name`, 180);
      const dosage = toSafeString(medication.dosage, `medications[${index}].dosage`, 180);
      const timing = toSafeString(medication.timing, `medications[${index}].timing`, 120);
      const medicineType = toSafeString(
        medication.medicineType,
        `medications[${index}].medicineType`,
        120
      );
      const doctorNotesText = toSafeString(
        medication.doctorNotes,
        `medications[${index}].doctorNotes`,
        2000
      );
      const durationDays = parseDurationDays(medication, index);

      const isCompletelyEmpty =
        !name &&
        !dosage &&
        !timing &&
        !medicineType &&
        !doctorNotesText &&
        durationDays === null;

      if (isCompletelyEmpty) {
        return null;
      }

      if (!name) {
        throw new ApiError(400, `medications[${index}].name is required when medication details are provided.`);
      }

      return {
        name,
        dosage,
        timing,
        medicineType,
        durationDays,
        doctorNotes: doctorNotesText,
      };
    })
    .filter(Boolean);

  const isCompleted = Boolean(payload?.isCompleted);

  return {
    doctorNotes,
    diagnosis,
    dietChart,
    routinePlan,
    medications,
    isCompleted,
  };
};

const mealTimeAliases = {
  "early morning": "EARLY_MORNING",
  breakfast: "BREAKFAST",
  "mid morning": "MID_MORNING",
  lunch: "LUNCH",
  evening: "EVENING",
  dinner: "DINNER",
};

const normalizeMealTime = (value = "") => {
  const normalized = String(value).trim().toLowerCase().replace(/[_-]+/g, " ");
  return mealTimeAliases[normalized] || "OTHER";
};

const buildDietItemsFromChart = (dietChart) => {
  const entries = [];

  const parseMealLine = (line, isAvoid = false, fallbackMealTime = "OTHER") => {
    const raw = String(line || "").trim();
    if (!raw) return;

    const splitIndex = raw.indexOf(":");
    let mealTime = fallbackMealTime;
    let itemsText = raw;

    if (splitIndex >= 0) {
      const mealLabel = raw.slice(0, splitIndex).trim();
      itemsText = raw.slice(splitIndex + 1).trim();
      mealTime = normalizeMealTime(mealLabel);
    }

    const foods = itemsText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (foods.length === 0 && itemsText) {
      foods.push(itemsText);
    }

    foods.forEach((itemName) => {
      entries.push({
        mealTime,
        itemName,
        notes: null,
        isAvoid,
      });
    });
  };

  (dietChart?.items || []).forEach((line) => parseMealLine(line, false, "OTHER"));
  (dietChart?.pathya || []).forEach((line) => parseMealLine(line, false, "OTHER"));
  (dietChart?.apathya || []).forEach((line) => parseMealLine(line, true, "OTHER"));

  return entries;
};

// ==========================================
// 1. SMART INTAKE
// ==========================================
export const diagnoseSymptoms = asyncHandler(async (req, res) => {
  const {
    problemDescription,
    providedSymptoms,
    providedSeverity,
    providedDuration,
  } = req.body;

  if (!problemDescription || problemDescription.length === 0) {
    throw new ApiError(
      400,
      "Please describe your problem in detail for an accurate diagnosis."
    );
  }

  const departments = await prisma.department.findMany({
    select: { id: true, name: true, description: true },
  });

  console.log("Total departments in DB:", departments.length);
  console.log("Department names:", departments.map(d => d.name));

  try {
    const aiMicroserviceUrl =
      process.env.AI_MICROSERVICE_URL || "http://localhost:8000";
    const aiResponse = await axios.post(`${aiMicroserviceUrl}/api/triage`, {
      raw_symptoms: problemDescription || "",
      explicit_symptoms: providedSymptoms || [],
      explicit_severity: providedSeverity || null,
      explicit_duration: providedDuration || null,
      available_departments: departments,
    });

    const aiPayload = aiResponse?.data || {};
    console.log("AI RESPONSE:", JSON.stringify(aiPayload, null, 2));
    
    const departmentHint =
      aiPayload?.recommended_department_name ||
      aiPayload?.departmentName ||
      aiPayload?.department ||
      aiPayload?.predicted_department ||
      aiPayload?.recommended_department ||
      aiPayload?.top_department ||
      aiPayload?.triage_department ||
      "";

    console.log("Department hint extracted:", departmentHint);
    console.log("Available departments in memory:", departments.map(d => d.name));

    let matchedDepartment = null;

    if (departmentHint) {
      const normalizedHint = String(departmentHint).trim().toLowerCase();
      console.log("Normalized hint:", normalizedHint);
      
      // First try exact match
      matchedDepartment = departments.find((dept) => {
        const deptNameLower = dept.name.toLowerCase();
        const isMatch = deptNameLower === normalizedHint;
        console.log(`Exact match check: "${normalizedHint}" vs "${deptNameLower}" = ${isMatch}`);
        return isMatch;
      });

      // If no exact match, try partial match
      if (!matchedDepartment) {
        console.log("=== GET DOCTORS BY DEPARTMENT ===");
        console.log("departmentId:", departmentId);
        console.log("departmentName:", departmentName);

        throw new ApiError(400, "departmentId or departmentName is required.");
        console.log("No exact match found, trying partial match...");
        matchedDepartment = departments.find((dept) => {
          const deptNameLower = dept.name.toLowerCase();
          const hintsIncludesDeptName = normalizedHint.includes(deptNameLower);
          const deptNameIncludesHint = deptNameLower.includes(normalizedHint);

      console.log("Query filter:", {
        isAvailable: true,
        departmentId: departmentId || undefined,
        departmentName: normalizedDepartmentName || undefined,
      });
          const isMatch = hintsIncludesDeptName || deptNameIncludesHint;
          console.log(`Partial match: "${normalizedHint}" vs "${deptNameLower}" = ${isMatch}`);
          return isMatch;
        });
      }
    }

    console.log("Final matched department:", matchedDepartment);

    // If no match found in database but NLP returned a department name, try to create or return a meaningful response
    if (!matchedDepartment && departments.length === 0) {
      console.warn("WARNING: No departments found in database! Departments might not be seeded.");
      throw new ApiError(500, "No departments available in the system. Please contact support.");
    }

    const responsePayload = {
      ...aiPayload,
      matchedDepartment: matchedDepartment
        ? { id: matchedDepartment.id, name: matchedDepartment.name }
        : null,
      availableDepartments: departments,
      debug: {
        departmentHint: departmentHint,
        departmentsFound: departments.length,
        matchedFound: !!matchedDepartment,
      },
    };

    console.log("Response payload matchedDepartment:", responsePayload.matchedDepartment);
    console.log("Full response payload:", JSON.stringify(responsePayload, null, 2));

    return res
      .status(200)
      .json(new ApiResponse(200, responsePayload, "Diagnosis complete."));
  } catch (error) {
    throw new ApiError(503, "The AI Triage service is currently unavailable.");
  }
      console.log(`Found ${doctors.length} doctors for departmentId: ${departmentId || departmentName}`);
      console.log("Doctors data:", doctors);
});

export const getDepartments = asyncHandler(async (_req, res) => {
  console.log("Fetching all departments...");
  const departments = await prisma.department.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
      _count: {
        select: { doctors: true },
      },
    },
  });
  console.log("Mapped doctors response:", mappedDoctors);
  console.log(`Found ${departments.length} departments:`, departments.map(d => d.name));

  return res
    .status(200)
    .json(new ApiResponse(200, departments, "Departments fetched."));
});

export const askVaidyaAssist = asyncHandler(async (req, res) => {
  const query = toSafeString(req.body?.query, "query", 2000);
  if (!query) {
    throw new ApiError(400, "query is required.");
  }

  const parsedTopK = Number(req.body?.topK ?? req.body?.top_k ?? 5);
  const topK = Number.isFinite(parsedTopK)
    ? Math.min(Math.max(Math.trunc(parsedTopK), 1), 10)
    : 5;

  try {
    const aiMicroserviceUrl =
      process.env.AI_MICROSERVICE_URL || "http://localhost:8000";

    const aiResponse = await axios.post(
      `${aiMicroserviceUrl}/api/rag/ask`,
      {
        query,
        top_k: topK,
      },
      {
        timeout: 120000,
      }
    );

    const payload = aiResponse?.data || {};
    return res
      .status(200)
      .json(new ApiResponse(200, payload, "Vaidya Assist response generated."));
  } catch (error) {
    const statusCode = Number(error?.response?.status) || 502;
    const detail =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      "Vaidya Assist service is currently unavailable.";

    throw new ApiError(statusCode, String(detail));
  }
});

export const getDoctorsByDepartment = asyncHandler(async (req, res) => {
  const departmentId = req.query?.departmentId
    ? String(req.query.departmentId)
    : "";
  const departmentName = req.query?.departmentName
    ? String(req.query.departmentName)
    : "";

  if (!departmentId && !departmentName) {
    throw new ApiError(400, "departmentId or departmentName is required.");
  }

  const normalizedDepartmentName = departmentName
    ? toTitleCase(departmentName.trim())
    : "";

  const doctors = await prisma.doctorProfile.findMany({
    where: {
      isAvailable: true,
      ...(departmentId
        ? { departmentId }
        : {
            department: {
              name: {
                equals: normalizedDepartmentName,
                mode: "insensitive",
              },
            },
          }),
    },
    orderBy: [{ experienceYrs: "desc" }, { staff: { name: "asc" } }],
    select: {
      staffId: true,
      specialty: true,
      experienceYrs: true,
      departmentId: true,
      department: {
        select: {
          id: true,
          name: true,
        },
      },
      staff: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const mappedDoctors = doctors.map((doctor) => ({
    id: doctor.staff.id,
    name: doctor.staff.name,
    email: doctor.staff.email,
    specialty: doctor.specialty,
    experienceYrs: doctor.experienceYrs,
    departmentId: doctor.departmentId,
    departmentName: doctor.department?.name || null,
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, mappedDoctors, "Doctors fetched."));
});

// ==========================================
// 2. TIME SLOTS
// ==========================================
export const getAvailableSlots = asyncHandler(async (req, res) => {
  const { departmentId, date, doctorId } = req.query;

  if (!departmentId || !date) {
    throw new ApiError(400, "Department ID and Date are required.");
  }

  const requestedDate = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(requestedDate.getTime())) {
    throw new ApiError(400, "Invalid date format. Use YYYY-MM-DD.");
  }

  // REFACTOR: We now query DoctorProfile which is linked to HospitalStaff
  const whereClause = { departmentId: departmentId, isAvailable: true };
  if (doctorId) whereClause.staffId = doctorId; // Hybrid Manual Flow support

  const doctors = await prisma.doctorProfile.findMany({
    where: whereClause,
    select: { staffId: true },
  });

  if (doctors.length === 0) {
    throw new ApiError(404, "No doctors available.");
  }

  const doctorIds = doctors.map((doc) => doc.staffId);

  if (doctorId && doctorIds.length !== 1) {
    throw new ApiError(404, "Selected doctor is not available in this department.");
  }

  const startOfDay = new Date(`${date}T00:00:00.000Z`);
  const endOfDay = new Date(`${date}T23:59:59.999Z`);

  const bookedAppointments = await prisma.appointment.findMany({
    where: {
      doctorId: { in: doctorIds },
      scheduledAt: { gte: startOfDay, lte: endOfDay },
      status: { not: "CANCELLED" },
    },
    select: { scheduledAt: true },
  });

  const bookingsPerSlot = {};
  bookedAppointments.forEach((app) => {
    const timeString = app.scheduledAt.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
    bookingsPerSlot[timeString] = (bookingsPerSlot[timeString] || 0) + 1;
  });

  const now = new Date();
  const availableSlots = ALL_POSSIBLE_SLOTS.filter((slot) => {
    const [time, meridiem] = slot.split(" ");
    const [hourRaw, minuteRaw] = time.split(":").map(Number);
    let hour = hourRaw;

    if (meridiem === "PM" && hour < 12) hour += 12;
    if (meridiem === "AM" && hour === 12) hour = 0;

    const slotDate = new Date(`${date}T00:00:00.000Z`);
    slotDate.setUTCHours(hour, minuteRaw, 0, 0);

    const isFutureSlot = slotDate.getTime() > now.getTime();
    const hasCapacity = (bookingsPerSlot[slot] || 0) < doctorIds.length;

    return isFutureSlot && hasCapacity;
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          date,
          doctorCount: doctorIds.length,
          availableSlots,
        },
        "Slots fetched."
      )
    );
});

// ==========================================
// 3. BOOK APPOINTMENT
// ==========================================
export const bookAppointment = asyncHandler(async (req, res) => {
  const {
    patientId,
    departmentId,
    selectedTimeSlots,
    date,
    finalSymptoms,
    doctorId,
    problemDescription,
    severity,
    duration,
  } = req.body;

  if (
    !patientId ||
    !departmentId ||
    !selectedTimeSlots ||
    selectedTimeSlots.length === 0 ||
    !date
  ) {
    throw new ApiError(400, "Missing booking details.");
  }

  // REFACTOR: Check the new Patient table
  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient) throw new ApiError(404, "Patient not found.");

  let finalDoctorId = doctorId;
  let aiSummaryText = doctorId
    ? "Manually selected by patient."
    : "Assigned based on availability.";

  if (doctorId) {
    const selectedDoctorProfile = await prisma.doctorProfile.findFirst({
      where: {
        staffId: doctorId,
        departmentId,
        isAvailable: true,
      },
      select: { staffId: true },
    });

    if (!selectedDoctorProfile) {
      throw new ApiError(400, "Selected doctor is not available for this department.");
    }
  }

  // If no doctor was manually selected, run the AI Matchmaker
  if (!doctorId) {
    const availableDoctors = await prisma.doctorProfile.findMany({
      where: { departmentId: departmentId, isAvailable: true },
      include: { staff: true }, // We need the staff info (name, etc)
    });

    if (availableDoctors.length === 0)
      throw new ApiError(404, "No doctors available.");
    finalDoctorId = availableDoctors[0].staffId; // Fallback

    try {
      const aiMicroserviceUrl =
        process.env.AI_MICROSERVICE_URL || "http://localhost:8000";
      const aiResponse = await axios.post(
        `${aiMicroserviceUrl}/api/matchmaker`,
        {
          patient_profile: {
            symptoms: finalSymptoms,
            prakriti: patient.prakriti || "Unknown",
            age: patient.age || "Unknown",
          },
          available_doctors: availableDoctors.map((doc) => ({
            doctor_id: doc.staffId,
            experience_years: doc.experienceYrs,
            specialty: doc.specialty,
          })),
        }
      );
      finalDoctorId = aiResponse.data.top_doctor_id;
      aiSummaryText = aiResponse.data.match_reason;
    } catch (error) {
      console.warn("AI Matchmaker offline, using fallback.");
    }
  }

  const timeParts = selectedTimeSlots[0].match(/(\d+):(\d+)\s(AM|PM)/);
  let hours = parseInt(timeParts[1]);
  if (timeParts[3] === "PM" && hours < 12) hours += 12;
  if (timeParts[3] === "AM" && hours === 12) hours = 0;
  const scheduledAt = new Date(
    `${date}T${hours.toString().padStart(2, "0")}:${timeParts[2]}:00.000Z`
  );

  const existingAppointment = await prisma.appointment.findFirst({
    where: {
      doctorId: finalDoctorId,
      scheduledAt,
      status: { not: "CANCELLED" },
    },
    select: { id: true },
  });

  if (existingAppointment) {
    throw new ApiError(409, "This slot is already booked. Please choose another slot.");
  }

  const resolvedPatientSymptoms =
    Array.isArray(finalSymptoms) && finalSymptoms.length > 0
      ? finalSymptoms.map((item) => String(item).trim()).filter(Boolean).join(", ")
      : typeof finalSymptoms === "string" && finalSymptoms.trim().length > 0
        ? finalSymptoms.trim()
        : typeof problemDescription === "string" && problemDescription.trim().length > 0
          ? problemDescription.trim()
          : "Not provided";

  const appointment = await prisma.appointment.create({
    data: {
      patientId,
      doctorId: finalDoctorId,
      scheduledAt,
      problemDescription:
        typeof problemDescription === "string" && problemDescription.trim().length > 0
          ? problemDescription.trim()
          : null,
      patientSymptoms: resolvedPatientSymptoms,
      severity:
        typeof severity === "string" && severity.trim().length > 0
          ? severity.trim().toLowerCase()
          : null,
      duration:
        typeof duration === "string" && duration.trim().length > 0
          ? duration.trim()
          : null,
      aiSummary: aiSummaryText,
    },
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { appointmentId: appointment.id },
        "Appointment locked."
      )
    );
});

// ==========================================
// 4. FETCH DOCTOR APPOINTMENTS
// ==========================================
export const getDoctorAppointments = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;

  const appointments = await prisma.appointment.findMany({
    where: { doctorId: doctorId, status: { not: "CANCELLED" } },
    orderBy: { scheduledAt: "asc" },
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          phoneNumber: true,
          age: true,
          gender: true,
          prakriti: true,
          vikriti: true,
        },
      },
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, appointments, "Appointments fetched."));
});

// ==========================================
// 5. SAVE DOCTOR PLAN
// ==========================================
export const saveDoctorPlan = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  if (!appointmentId) {
    throw new ApiError(400, "appointmentId is required.");
  }

  const normalized = normalizeDoctorPlanPayload(req.body || {});

  const appointmentRecord = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    select: { id: true, patientId: true, doctorId: true },
  });

  if (!appointmentRecord) {
    throw new ApiError(404, "Appointment not found.");
  }

  const normalizedDietItems = buildDietItemsFromChart(normalized.dietChart);

  const appointment = await prisma.$transaction(async (tx) => {
    const updatedAppointment = await tx.appointment.update({
      where: { id: appointmentId },
      data: {
        doctorNotes: normalized.doctorNotes,
        diagnosis: normalized.diagnosis,
        dietChart: normalized.dietChart,
        routinePlan: normalized.routinePlan,
        medications: normalized.medications,
        isCompleted: normalized.isCompleted,
        status: normalized.isCompleted ? "COMPLETED" : undefined,
      },
    });

    const treatmentPlan = await tx.treatmentPlan.upsert({
      where: { appointmentId },
      create: {
        appointmentId,
        patientId: appointmentRecord.patientId,
        doctorId: appointmentRecord.doctorId,
        doctorNotes: normalized.doctorNotes,
        diagnosis: normalized.diagnosis,
        dietChart: normalized.dietChart,
        routinePlan: normalized.routinePlan,
        isCompleted: normalized.isCompleted,
      },
      update: {
        doctorNotes: normalized.doctorNotes,
        diagnosis: normalized.diagnosis,
        dietChart: normalized.dietChart,
        routinePlan: normalized.routinePlan,
        isCompleted: normalized.isCompleted,
      },
    });

    const dietPlan = await tx.dietPlan.upsert({
      where: { treatmentPlanId: treatmentPlan.id },
      create: {
        treatmentPlanId: treatmentPlan.id,
        title: "Doctor Prescribed Diet Plan",
      },
      update: {},
    });

    await tx.dietItem.deleteMany({
      where: { dietPlanId: dietPlan.id },
    });

    if (normalizedDietItems.length > 0) {
      await tx.dietItem.createMany({
        data: normalizedDietItems.map((item) => ({
          dietPlanId: dietPlan.id,
          mealTime: item.mealTime,
          itemName: item.itemName,
          notes: item.notes,
          isAvoid: item.isAvoid,
        })),
      });
    }

    await tx.treatmentMedication.deleteMany({
      where: { treatmentPlanId: treatmentPlan.id },
    });

    if (normalized.medications.length > 0) {
      await tx.treatmentMedication.createMany({
        data: normalized.medications.map((medication) => ({
          treatmentPlanId: treatmentPlan.id,
          name: medication.name,
          dosage: medication.dosage || null,
          timing: medication.timing || null,
          medicineType: medication.medicineType || null,
          durationDays: medication.durationDays,
          doctorNotes: medication.doctorNotes || null,
        })),
      });
    }

    return updatedAppointment;
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { appointmentId: appointment.id }, "Plan saved.")
    );
});

export const getLatestTreatmentPlan = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  if (!patientId) {
    throw new ApiError(400, "patientId is required.");
  }

  const treatmentPlan = await prisma.treatmentPlan.findFirst({
    where: { patientId },
    orderBy: { createdAt: "desc" },
    include: {
      dietPlan: {
        include: {
          items: true,
        },
      },
      doctor: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!treatmentPlan) {
    throw new ApiError(404, "No treatment plan found for this patient.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, treatmentPlan, "Latest treatment plan fetched."));
});

export const markAppointmentLive = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;

  if (!appointmentId) {
    throw new ApiError(400, "appointmentId is required.");
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    select: { id: true, status: true },
  });

  if (!appointment) {
    throw new ApiError(404, "Appointment not found.");
  }

  if (appointment.status === "CANCELLED") {
    throw new ApiError(400, "Cancelled appointment cannot be marked live.");
  }

  if (appointment.status === "COMPLETED") {
    throw new ApiError(400, "Completed appointment cannot be marked live.");
  }

  const updated = await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: "LIVE" },
    select: { id: true, status: true },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Appointment marked live."));
});

// ==========================================
// 6. FETCH PATIENT APPOINTMENTS
// ==========================================
export const getPatientAppointments = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  const appointments = await prisma.appointment.findMany({
    where: { patientId: patientId },
    orderBy: { scheduledAt: "desc" }, // Show newest first
    include: {
      doctor: {
        select: {
          id: true,
          name: true,
          doctorProfile: {
            select: {
              specialty: true,
              department: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      treatmentPlan: {
        include: {
          medications: true,
          dietPlan: {
            include: {
              items: true,
            },
          },
        },
      },
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, appointments, "Patient appointments fetched."));
});

export const reschedulePatientAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { patientId, date, time } = req.body;

  if (!appointmentId || !patientId || !date || !time) {
    throw new ApiError(400, "appointmentId, patientId, date and time are required.");
  }

  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, patientId },
    select: { id: true, doctorId: true, status: true },
  });

  if (!appointment) {
    throw new ApiError(404, "Appointment not found for this patient.");
  }

  if (appointment.status === "CANCELLED") {
    throw new ApiError(400, "Cancelled appointment cannot be rescheduled.");
  }

  const normalizedTime = String(time).trim();
  let hh = 0;
  let mm = 0;

  const time12hMatch = normalizedTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  const time24hMatch = normalizedTime.match(/^(\d{1,2}):(\d{2})$/);

  if (time12hMatch) {
    hh = Number(time12hMatch[1]);
    mm = Number(time12hMatch[2]);
    const period = time12hMatch[3].toUpperCase();
    if (period === "PM" && hh < 12) hh += 12;
    if (period === "AM" && hh === 12) hh = 0;
  } else if (time24hMatch) {
    hh = Number(time24hMatch[1]);
    mm = Number(time24hMatch[2]);
  } else {
    throw new ApiError(400, "Invalid time format. Use HH:mm or HH:mm AM/PM.");
  }

  if (
    Number.isNaN(hh) ||
    Number.isNaN(mm) ||
    hh < 0 ||
    hh > 23 ||
    mm < 0 ||
    mm > 59
  ) {
    throw new ApiError(400, "Invalid time value.");
  }

  const scheduledAt = new Date(
    `${date}T${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}:00.000Z`
  );

  if (Number.isNaN(scheduledAt.getTime())) {
    throw new ApiError(400, "Invalid date/time provided.");
  }

  const conflict = await prisma.appointment.findFirst({
    where: {
      id: { not: appointment.id },
      doctorId: appointment.doctorId,
      scheduledAt,
      status: { not: "CANCELLED" },
    },
    select: { id: true },
  });

  if (conflict) {
    throw new ApiError(409, "Selected slot is already booked. Please choose another time.");
  }

  const updated = await prisma.appointment.update({
    where: { id: appointment.id },
    data: {
      scheduledAt,
      status: "SCHEDULED",
    },
    select: {
      id: true,
      scheduledAt: true,
      status: true,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Appointment rescheduled."));
});

export const cancelPatientAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { patientId } = req.body;

  if (!appointmentId || !patientId) {
    throw new ApiError(400, "appointmentId and patientId are required.");
  }

  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, patientId },
    select: { id: true, status: true },
  });

  if (!appointment) {
    throw new ApiError(404, "Appointment not found for this patient.");
  }

  if (appointment.status === "CANCELLED") {
    return res
      .status(200)
      .json(new ApiResponse(200, { id: appointment.id }, "Appointment already cancelled."));
  }

  await prisma.appointment.update({
    where: { id: appointment.id },
    data: { status: "CANCELLED" },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { id: appointment.id }, "Appointment cancelled."));
});

export const deletePatientAppointment = cancelPatientAppointment;

// ==========================================
// 7. FETCH PATIENT DASHBOARD DATA
// ==========================================
export const getPatientDashboardData = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    select: {
      id: true,
      name: true,
      age: true,
      prakriti: true,
      vikriti: true,
      clinicalData: true,
      createdAt: true,
    },
  });

  if (!patient) {
    throw new ApiError(404, "Patient not found.");
  }

  const appointments = await prisma.appointment.findMany({
    where: { patientId },
    orderBy: { scheduledAt: "desc" },
    include: {
      doctor: {
        select: {
          name: true,
          doctorProfile: { select: { specialty: true } },
        },
      },
    },
  });

  const latestPlannedAppointment = appointments.find(
    (appointment) => appointment.dietChart || appointment.medications
  );

  const clinicalData =
    patient.clinicalData && typeof patient.clinicalData === "object"
      ? patient.clinicalData
      : {};

  const mappedAppointments = appointments.map((appointment) => {
    const scheduledAt = new Date(appointment.scheduledAt);

    let status = "pending";
    if (appointment.status === "COMPLETED") {
      status = "confirmed";
    }
    if (appointment.status === "CANCELLED") {
      status = "cancelled";
    }

    return {
      id: appointment.id,
      doctor: appointment.doctor?.name || "Doctor",
      specialty: appointment.doctor?.doctorProfile?.specialty || "General",
      time: scheduledAt.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      date: scheduledAt.toISOString().split("T")[0],
      type: "Consultation",
      location: "Clinic",
      status,
      notes: appointment.doctorNotes || appointment.aiSummary || "",
    };
  });

  const responsePayload = {
    patient: {
      id: patient.id,
      name: patient.name,
      age: patient.age,
      condition: patient.vikriti || "Under Observation",
      constitution: patient.prakriti || "Not Assessed",
      avatar: patient.name
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase(),
      lastVisit:
        appointments[0]?.scheduledAt?.toISOString?.().split("T")[0] ||
        patient.createdAt.toISOString().split("T")[0],
    },
    appointments: mappedAppointments,
    dietChart:
      latestPlannedAppointment?.dietChart ||
      clinicalData?.dietChart || {
        date: new Date().toISOString().split("T")[0],
        meals: { breakfast: [], lunch: [], dinner: [] },
      },
    medications:
      latestPlannedAppointment?.medications || clinicalData?.medications || [],
    healthRecords: clinicalData?.healthRecords || [],
    goals: clinicalData?.goals || [],
    dailySchedule: clinicalData?.dailySchedule || [],
    notifications: clinicalData?.notifications || 0,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, responsePayload, "Patient dashboard data fetched."));
});

// ==========================================
// 8. SAVE PRAKRITI ASSESSMENT
// ==========================================
export const savePrakritiAssessment = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const {
    answer1,
    answer2,
    answer3,
    answer4,
    answer5,
    answer6,
    answer7,
    answer8,
    vataScore,
    pittaScore,
    kaphaScore,
    primaryDosha,
    timeSpentSec,
  } = req.body;

  const requiredAnswers = [
    answer1,
    answer2,
    answer3,
    answer4,
    answer5,
    answer6,
    answer7,
    answer8,
  ];

  if (!patientId || requiredAnswers.some((answer) => !answer)) {
    throw new ApiError(400, "Patient ID and all 8 answers are required.");
  }

  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient) {
    throw new ApiError(404, "Patient not found.");
  }

  const assessment = await prisma.prakritiAssessment.create({
    data: {
      patientId,
      answer1,
      answer2,
      answer3,
      answer4,
      answer5,
      answer6,
      answer7,
      answer8,
      vataScore: Number(vataScore) || 0,
      pittaScore: Number(pittaScore) || 0,
      kaphaScore: Number(kaphaScore) || 0,
      primaryDosha,
      timeSpentSec: timeSpentSec ? Number(timeSpentSec) : null,
    },
  });

  await prisma.patient.update({
    where: { id: patientId },
    data: {
      prakriti: primaryDosha ? String(primaryDosha).toUpperCase() : null,
      vataScore: Number(vataScore) || 0,
      pittaScore: Number(pittaScore) || 0,
      kaphaScore: Number(kaphaScore) || 0,
    },
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { assessmentId: assessment.id },
        "Prakriti assessment saved successfully."
      )
    );
});

// ==========================================
// 9. FETCH PRAKRITI ASSESSMENTS
// ==========================================
export const getPatientPrakritiAssessments = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const { latest } = req.query;

  if (!patientId) {
    throw new ApiError(400, "Patient ID is required.");
  }

  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient) {
    throw new ApiError(404, "Patient not found.");
  }

  const assessments = await prisma.prakritiAssessment.findMany({
    where: { patientId },
    orderBy: { createdAt: "desc" },
    take: latest === "true" ? 1 : undefined,
    select: {
      id: true,
      createdAt: true,
      primaryDosha: true,
      vataScore: true,
      pittaScore: true,
      kaphaScore: true,
      timeSpentSec: true,
      answer1: true,
      answer2: true,
      answer3: true,
      answer4: true,
      answer5: true,
      answer6: true,
      answer7: true,
      answer8: true,
    },
  });

  const mappedAssessments = assessments.map((assessment) => ({
    ...assessment,
    answers: [
      assessment.answer1,
      assessment.answer2,
      assessment.answer3,
      assessment.answer4,
      assessment.answer5,
      assessment.answer6,
      assessment.answer7,
      assessment.answer8,
    ],
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      latest === "true" ? mappedAssessments[0] || null : mappedAssessments,
      latest === "true"
        ? "Latest Prakriti assessment fetched."
        : "Prakriti assessment history fetched."
    )
  );
});
