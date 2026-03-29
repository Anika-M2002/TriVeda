import React, { useMemo, useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Activity,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Pill,
  Stethoscope,
  User,
  Video,
  MapPin,
  AlertCircle,
  Loader,
} from "lucide-react";
import {
  AppointmentBooking,
  DoctorCategory,
  categoryLabelMap,
  createBookingId,
  downloadAppointmentPdf,
} from "@/lib/appointment-booking";
import { appointmentApi, DiagnosisResponse } from "@/api/appointment.api";

type ApiDoctor = {
  id: string;
  name: string;
  email: string;
  specialty: string;
  experienceYrs: number;
  departmentId: string;
  departmentName: string;
};

type DoctorProfile = ApiDoctor & {
  department: DoctorCategory;
};

function formatTimeLabel(time24: string) {
  const raw = String(time24 || "").trim();
  if (!raw) return "";

  const twelveHourMatch = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (twelveHourMatch) {
    const hour = Number(twelveHourMatch[1]);
    const minute = twelveHourMatch[2];
    const period = twelveHourMatch[3].toUpperCase();
    if (!Number.isNaN(hour)) {
      const normalizedHour = hour % 12 === 0 ? 12 : hour % 12;
      return `${normalizedHour}:${minute} ${period}`;
    }
    return raw;
  }

  const twentyFourHourMatch = raw.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFourHourMatch) {
    const h = Number(twentyFourHourMatch[1]);
    const m = Number(twentyFourHourMatch[2]);
    if (Number.isNaN(h) || Number.isNaN(m)) return raw;
    const period = h >= 12 ? "PM" : "AM";
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${String(m).padStart(2, "0")} ${period}`;
  }

  return raw;
}

function toDateInputValue(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

type PatientAppointmentsProps = {
  showSidebar?: boolean;
};

function PatientAppointments({ showSidebar = false }: PatientAppointmentsProps) {
  const [, setLocation] = useLocation();
  const loggedInUser = JSON.parse(localStorage.getItem("triveda_user") || "{}");
  const patientId = loggedInUser?.id || "";
  const patientName = loggedInUser?.name || "Patient User";
  const patientAge = loggedInUser?.age ? String(loggedInUser.age) : "-";
  const patientGender = loggedInUser?.gender || "-";

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  const [diagnosis, setDiagnosis] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [triageSymptoms, setTriageSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState<"mild" | "moderate" | "severe">("moderate");
  const [isDiagnosisLoading, setIsDiagnosisLoading] = useState(false);
  const [diagnosisError, setDiagnosisError] = useState("");

  const [matchedDepartmentId, setMatchedDepartmentId] = useState("");
  const [matchedDepartmentName, setMatchedDepartmentName] = useState("");
  const [availableDepartments, setAvailableDepartments] = useState<any[]>([]);
  
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [doctorError, setDoctorError] = useState("");

  const [doctorCategory, setDoctorCategory] = useState<DoctorCategory | "">("");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [autoAssignedDoctorId, setAutoAssignedDoctorId] = useState<string | null>(null);
  
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState("");

  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [consultationMode, setConsultationMode] = useState<"clinic" | "video">("clinic");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [confirmedBooking, setConfirmedBooking] = useState<AppointmentBooking | null>(null);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Fetch doctors when department changes
  useEffect(() => {
    if (!matchedDepartmentId && !doctorCategory) return;

    const deptId = matchedDepartmentId || doctorCategory;
    if (!deptId) return;

    const fetchDoctors = async () => {
      setIsLoadingDoctors(true);
      setDoctorError("");
      try {
          const res = await appointmentApi.getDoctorsByDepartment({ departmentId: deptId });
          console.log("Doctor API response (already unwrapped):", res);
          const doctorList = Array.isArray(res) ? res : [];
        console.log(`Doctors found: ${doctorList.length}`);
        setDoctors(doctorList);
        if (doctorList.length === 0) {
          setDoctorError("No doctors available in this department.");
        }
      } catch (error: any) {
        setDoctorError("Failed to fetch doctors. Please try again.");
        console.error("Error fetching doctors:", error);
      } finally {
        setIsLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [matchedDepartmentId, doctorCategory]);

  // Fetch slots when date or doctor changes
  useEffect(() => {
    if (!selectedDate || (!selectedDoctorId && !autoAssignedDoctorId) || !matchedDepartmentId) return;

    const doctorId = selectedDoctorId || autoAssignedDoctorId;
    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      setSlotsError("");
      try {
        const res: any = await appointmentApi.getAvailableSlots(matchedDepartmentId, selectedDate, doctorId || undefined);
        console.log("Slots API response:", res);
        const slots = (res?.availableSlots) || [];
        setAvailableSlots(slots);
        if (slots.length === 0) {
          setSlotsError("No slots available for this date. Please select another date.");
        }
      } catch (error: any) {
        setSlotsError("Failed to fetch available slots. Please try again.");
        console.error("Error fetching slots:", error);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate, selectedDoctorId, autoAssignedDoctorId, matchedDepartmentId]);

  const dayName = useMemo(() => {
    if (!selectedDate) return "";
    return new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long" });
  }, [selectedDate]);

  const selectedDoctor = useMemo(() => {
    const doctorId = selectedDoctorId ?? autoAssignedDoctorId;
    if (!doctorId) return null;
    return doctors.find((doctor) => doctor.id === doctorId) || null;
  }, [selectedDoctorId, autoAssignedDoctorId, doctors]);

  const calendarCells = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();

    const cells: Array<Date | null> = [];
    for (let index = 0; index < startOffset; index += 1) cells.push(null);
    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      cells.push(new Date(year, month, day));
    }

    return cells;
  }, [calendarMonth]);

  const isDateSelectable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return false;
    return true; // All future dates are selectable; slots are checked at fetch time
  };

  const stepTitles: Record<number, string> = {
    1: "Diagnosis",
    2: "Doctor Category",
    3: "Available Time Slots",
    4: "Assigning Doctor",
    5: "Downloadable PDF",
  };

  const detectCategory = async () => {
    if (!diagnosis.trim() && !symptoms.trim()) return;
    setIsDiagnosisLoading(true);
    setDiagnosisError("");
    try {
      console.log("=== DIAGNOSIS REQUEST ===");
      console.log("Problem:", diagnosis);
      console.log("Symptoms:", symptoms);

      const res: DiagnosisResponse = await appointmentApi.diagnoseSymptoms({
        problemDescription: diagnosis,
        providedSymptoms: symptoms ? symptoms.split(",").map((s) => s.trim()) : [],
        providedSeverity: severity,
        providedDuration: duration,
      });
      
      console.log("=== API RESPONSE ===");
      console.log("res:", res);
      console.log("res.matchedDepartment:", res.matchedDepartment);
      console.log("res.matchedDepartment?.id:", res.matchedDepartment?.id);
      console.log("Available departments:", res.availableDepartments?.length);
      
      if (res.matchedDepartment?.id) {
        console.log("✅ Department matched! ID:", res.matchedDepartment.id);
        const aiSymptoms = Array.isArray(res.final_symptoms)
          ? res.final_symptoms.map((item) => String(item).trim()).filter(Boolean)
          : [];
        setTriageSymptoms(aiSymptoms);

        setMatchedDepartmentId(res.matchedDepartment.id);
        setMatchedDepartmentName(res.matchedDepartment.name);
        setAvailableDepartments(res.availableDepartments || []);
        setDoctorCategory(res.matchedDepartment.id as DoctorCategory);
        setSelectedDoctorId(null);
        setAutoAssignedDoctorId(null);
        setSelectedDate("");
        setSelectedTime("");
        setStep(2);
      } else {
        console.log("❌ No matchedDepartment.id found");
        console.log("Full response:", res);
        
        if (res.availableDepartments?.length === 0) {
          setDiagnosisError("No departments available in the system. Please contact support.");
        } else {
          setDiagnosisError("Could not determine department from diagnosis. Please try again.");
        }
      }
    } catch (error: any) {
      console.error("❌ Diagnosis error:", error);
      setDiagnosisError(`Failed to process diagnosis: ${error.message}`);
    } finally {
      setIsDiagnosisLoading(false);
    }
  };

  const handleAutoAssignDoctor = () => {
    if (doctors.length === 0) return;

    const sorted = [...doctors].sort((a, b) => (b.experienceYrs || 0) - (a.experienceYrs || 0));
    const assigned =
      severity === "severe"
        ? sorted[0]
        : severity === "mild"
          ? sorted[sorted.length - 1] || sorted[0]
          : sorted[Math.floor(sorted.length / 2)] || sorted[0];

    setAutoAssignedDoctorId(assigned.id);
    setSelectedDoctorId(null);
    setSelectedDate("");
    setSelectedTime("");
    setStep(3);
  };

  const handleSelectDoctor = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setAutoAssignedDoctorId(null);
    setSelectedDate("");
    setSelectedTime("");
  };

  const handleConfirmBooking = async () => {
    if (!matchedDepartmentId || !selectedDate || !selectedTime || !selectedDoctor) return;

    if (!patientId) {
      alert("Patient session not found. Please login again.");
      return;
    }

    setIsSubmittingBooking(true);

    const formattedTime = formatTimeLabel(selectedTime);
    const manualSymptoms = symptoms
      ? symptoms.split(",").map((item) => item.trim()).filter(Boolean)
      : [];
    const resolvedSymptoms =
      manualSymptoms.length > 0
        ? manualSymptoms
        : triageSymptoms.length > 0
          ? triageSymptoms
          : diagnosis.trim()
            ? [diagnosis.trim()]
            : [];

    const booking: AppointmentBooking = {
      id: String(Date.now()),
      bookingId: createBookingId(),
      createdAt: new Date().toISOString(),
      diagnosis,
      symptoms,
      duration,
      severity,
      doctorCategory: matchedDepartmentId as DoctorCategory,
      selectedDate,
      selectedTime: formattedTime,
      consultationMode,
      patientName,
      patientAge,
      patientGender,
      currentMedications: "",
      allergies: "",
      medicalHistory: "",
      additionalNotes,
      assignedDoctor: {
        id: selectedDoctor.id as string | number,
        name: selectedDoctor.name,
        department: matchedDepartmentName,
        experience: selectedDoctor.experienceYrs || 0,
        clinic: `TriVeda ${matchedDepartmentName} Center`,
      },
      status: "confirmed",
    };

    try {
      const bookingResponse: any = await appointmentApi.bookAppointment({
        patientId,
        departmentId: matchedDepartmentId,
        selectedTimeSlots: [formattedTime],
        date: selectedDate,
        finalSymptoms: resolvedSymptoms,
        problemDescription: diagnosis.trim(),
        severity,
        duration,
        doctorId: String(selectedDoctor.id),
      });

      const appointmentId = bookingResponse?.appointmentId;
      const storedBooking = appointmentId
        ? { ...booking, id: String(appointmentId) }
        : booking;

      setConfirmedBooking(storedBooking);
      setStep(5);
    } catch (error: any) {
      alert(error?.message || "Failed to book appointment. Please try again.");
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-[#10B981] rounded-full shadow-lg mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-[#10B981] bg-clip-text text-transparent mb-2 leading-tight break-words">
            Appointment Booking Flow
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            Diagnosis to AI doctor assignment, with a downloadable PDF summary for every confirmed booking.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-start sm:justify-center gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5].map((current) => (
              <React.Fragment key={current}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step >= current ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {current}
                  </div>
                  <span className={`text-xs sm:text-sm font-medium ${step >= current ? "text-emerald-700" : "text-gray-500"}`}>
                    {stepTitles[current]}
                  </span>
                </div>
                {current < 5 && <ChevronRight className="hidden sm:block w-4 h-4 text-gray-400" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className={`grid gap-4 sm:gap-6 lg:gap-8 ${showSidebar ? "lg:grid-cols-3" : ""}`}>
          <div className={showSidebar ? "lg:col-span-2" : ""}>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-[#10B981] p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight break-words">Step {step}: {stepTitles[step]}</h2>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                {step === 1 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Describe your problem in detail *</label>
                      <textarea
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        rows={5}
                        placeholder="Explain all symptoms, triggers, and concerns..."
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
                        <textarea
                          value={symptoms}
                          onChange={(e) => setSymptoms(e.target.value)}
                          rows={4}
                          placeholder="e.g. tooth pain, gum swelling"
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Problem duration</label>
                          <input
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            placeholder="e.g. 2 weeks"
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                          <select
                            value={severity}
                            onChange={(e) => setSeverity(e.target.value as "mild" | "moderate" | "severe")}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="mild">Mild</option>
                            <option value="moderate">Moderate</option>
                            <option value="severe">Severe</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={detectCategory}
                      disabled={!diagnosis.trim() || isDiagnosisLoading}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-[#10B981] text-white rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isDiagnosisLoading && <Loader className="w-4 h-4 animate-spin" />}
                      {isDiagnosisLoading ? "Processing..." : "Determine Doctor Category"}
                    </button>
                    {diagnosisError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">{diagnosisError}</div>}
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Auto-detected category</p>
                      <p className="text-lg font-semibold text-emerald-800">{matchedDepartmentName || "Not detected"}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Available doctors in this category</p>
                      {isLoadingDoctors ? (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 flex items-center gap-2">
                          <Loader className="w-4 h-4 animate-spin" />
                          Loading doctors...
                        </div>
                      ) : doctorError ? (
                        <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-sm text-red-800">
                          {doctorError}
                        </div>
                      ) : doctors.length === 0 ? (
                        <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 text-sm text-amber-800">
                          No doctors available in this category right now.
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          {doctors.map((doctor) => {
                            const isSelected = selectedDoctorId === doctor.id;
                            return (
                              <button
                                key={doctor.id}
                                type="button"
                                onClick={() => handleSelectDoctor(doctor.id)}
                                className={`w-full rounded-xl border p-3 text-left transition ${
                                  isSelected
                                    ? "border-emerald-500 bg-emerald-50"
                                    : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/40"
                                }`}
                              >
                                <p className="font-semibold text-gray-900">{doctor.name}</p>
                                <p className="text-sm text-gray-600">{doctor.experienceYrs} years • {doctor.specialty}</p>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Change category (if needed)</label>
                      <select
                        value={matchedDepartmentId}
                        onChange={(e) => {
                          setMatchedDepartmentId(e.target.value);
                          setDoctorCategory(e.target.value as DoctorCategory);
                          setSelectedDoctorId(null);
                          setAutoAssignedDoctorId(null);
                          setSelectedDate("");
                          setSelectedTime("");
                        }}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Select a department...</option>
                        {availableDepartments.map((dept) => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(1)} className="px-5 py-2 border rounded-lg">Back</button>
                      <button
                        type="button"
                        onClick={handleAutoAssignDoctor}
                        disabled={!matchedDepartmentId || doctors.length === 0}
                        className="flex-1 py-2 bg-emerald-500 text-white rounded-lg disabled:opacity-50"
                      >
                        Assign Doctor For Me
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        disabled={!selectedDoctorId}
                        className="flex-1 py-2 bg-gradient-to-r from-[#1F5C3F] to-emerald-700 text-white rounded-lg disabled:opacity-50"
                      >
                        Continue with Selected Doctor
                      </button>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50">
                      <p className="text-sm text-gray-600">Selected doctor</p>
                      <p className="text-lg font-semibold text-emerald-800">{selectedDoctor?.name || "No doctor selected"}</p>
                      {selectedDoctor && (
                        <p className="text-sm text-gray-600">{selectedDoctor.experienceYrs} years • {selectedDoctor.specialty}</p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-700">Pick a date from calendar</p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setCalendarMonth(
                                (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
                              )
                            }
                            className="px-3 py-1.5 border rounded-lg text-sm"
                          >
                            Prev
                          </button>
                          <p className="min-w-[140px] text-center text-sm font-semibold text-gray-800">
                            {calendarMonth.toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              setCalendarMonth(
                                (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
                              )
                            }
                            className="px-3 py-1.5 border rounded-lg text-sm"
                          >
                            Next
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-2 text-xs sm:text-sm">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((weekday) => (
                          <div key={weekday} className="text-center font-semibold text-gray-500">
                            {weekday}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-2">
                        {calendarCells.map((dateCell, index) => {
                          if (!dateCell) {
                            return <div key={`empty-${index}`} className="h-20 rounded-lg bg-gray-50" />;
                          }

                          const selectable = isDateSelectable(dateCell);
                          const dateValue = toDateInputValue(dateCell);
                          const isSelected = selectedDate === dateValue;

                          return (
                            <button
                              key={dateValue}
                              type="button"
                              disabled={!selectable}
                              onClick={() => {
                                setSelectedDate(dateValue);
                                setSelectedTime("");
                              }}
                              className={`h-20 rounded-lg border p-2 text-left transition ${
                                isSelected
                                  ? "border-emerald-500 bg-emerald-100"
                                  : selectable
                                    ? "border-emerald-200 bg-emerald-50 hover:border-emerald-400"
                                    : "border-gray-200 bg-gray-50 text-gray-400"
                              }`}
                            >
                              <p className="text-xs font-semibold">{dateCell.getDate()}</p>
                              <p className="mt-1 text-[11px]">
                                {selectable ? "Available" : "Unavailable"}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {selectedDate && (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">Available slots for {dayName}</p>
                        {isLoadingSlots ? (
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 flex items-center gap-2">
                            <Loader className="w-4 h-4 animate-spin" />
                            Loading available slots...
                          </div>
                        ) : slotsError ? (
                          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                            {slotsError}
                          </div>
                        ) : availableSlots.length === 0 ? (
                          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm">
                            No slots available on this date. Please pick another available day.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                            {availableSlots.map((slot) => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setSelectedTime(slot)}
                                className={`py-2 rounded-lg border text-sm font-medium ${
                                  selectedTime === slot
                                    ? "bg-emerald-500 border-emerald-500 text-white"
                                    : "bg-emerald-50 border-emerald-200 text-emerald-800"
                                }`}
                              >
                                <Clock className="w-4 h-4 inline mr-1" />
                                {formatTimeLabel(slot)}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(2)} className="px-5 py-2 border rounded-lg">Back</button>
                      <button
                        type="button"
                        onClick={() => setStep(4)}
                        disabled={!selectedDate || !selectedTime}
                        className="flex-1 py-2 bg-emerald-500 text-white rounded-lg disabled:opacity-50"
                      >
                        Continue to Assigning Doctor
                      </button>
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                      <p className="text-sm text-blue-800">
                        Doctor is assigned from your manual selection or smart assignment, based on severity and category.
                      </p>
                    </div>

                    {selectedDoctor ? (
                      <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50">
                        <h3 className="text-lg font-semibold text-emerald-800 mb-2">Assigned Doctor</h3>
                        <p className="font-semibold text-gray-900">{selectedDoctor.name}</p>
                        <p className="text-sm text-gray-700">{selectedDoctor.specialty} • {selectedDoctor.experienceYrs} years</p>
                        <p className="text-sm text-gray-600">{matchedDepartmentName}</p>
                        <div className="mt-3 text-sm text-gray-700 space-y-1">
                          <p><span className="font-medium">Date:</span> {selectedDate}</p>
                          <p><span className="font-medium">Time:</span> {formatTimeLabel(selectedTime)}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-800">
                        No doctor is available for the selected slot. Please go back and select another doctor/date.
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Consultation mode *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button type="button" onClick={() => setConsultationMode("clinic")} className={`py-2 border rounded-lg ${consultationMode === "clinic" ? "bg-emerald-500 text-white border-emerald-500" : "border-gray-200"}`}>
                          <MapPin className="w-4 h-4 inline mr-1" /> In-Clinic
                        </button>
                        <button type="button" onClick={() => setConsultationMode("video")} className={`py-2 border rounded-lg ${consultationMode === "video" ? "bg-emerald-500 text-white border-emerald-500" : "border-gray-200"}`}>
                          <Video className="w-4 h-4 inline mr-1" /> Video
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Additional notes</label>
                      <textarea value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} rows={3} className="w-full p-3 border border-gray-200 rounded-lg" />
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(3)} className="px-5 py-2 border rounded-lg">Back</button>
                      <button
                        type="button"
                        onClick={handleConfirmBooking}
                        disabled={!selectedDoctor || isSubmittingBooking}
                        className="flex-1 py-2 bg-emerald-500 text-white rounded-lg disabled:opacity-50"
                      >
                        {isSubmittingBooking ? "Confirming..." : "Confirm Appointment"}
                      </button>
                    </div>
                  </>
                )}

                {step === 5 && confirmedBooking && (
                  <>
                    <div className="p-4 rounded-xl border border-green-200 bg-green-50">
                      <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                        <CheckCircle className="w-5 h-5" /> Appointment Booked Successfully
                      </div>
                      <p className="text-sm text-gray-700">Booking ID: {confirmedBooking.bookingId}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="p-4 border rounded-lg">
                        <p className="font-semibold mb-2">Appointment Details</p>
                        <p>Date: {confirmedBooking.selectedDate}</p>
                        <p>Time: {confirmedBooking.selectedTime}</p>
                        <p>Mode: {confirmedBooking.consultationMode === "video" ? "Video" : "In-Clinic"}</p>
                        <p>Category: {confirmedBooking.assignedDoctor.department}</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="font-semibold mb-2">Assigned Doctor</p>
                        <p>{confirmedBooking.assignedDoctor.name}</p>
                        <p>{confirmedBooking.assignedDoctor.department}</p>
                        <p>{confirmedBooking.assignedDoctor.experience} years experience</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => downloadAppointmentPdf(confirmedBooking)}
                        className="flex-1 py-3 bg-[#1F5C3F] text-white rounded-lg font-semibold"
                      >
                        <Download className="w-4 h-4 inline mr-1" /> Download PDF Copy
                      </button>
                      <button
                        type="button"
                        onClick={() => setLocation("/patient/appointments")}
                        className="px-5 py-3 border border-emerald-200 text-emerald-700 rounded-lg font-medium"
                      >
                        Back to Appointments List
                      </button>
                      <button type="button" onClick={() => setStep(1)} className="px-5 py-3 border rounded-lg">
                        Book Another
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PatientAppointments;
