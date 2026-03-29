import React, { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Calendar, Clock, Download, FileText, Plus, X } from "lucide-react";
import { usePatientAppointments } from "@/hooks/useAppointments";
import { appointmentApi } from "@/api/appointment.api";
import { AppointmentBooking, createBookingId, downloadAppointmentPdf } from "@/lib/appointment-booking";

type DbAppointment = {
  id: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | string;
  scheduledAt: string;
  patientSymptoms?: string | null;
  medications?: any;
  doctorNotes?: string | null;
  dietChart?: any;
  routinePlan?: any;
  doctor?: {
    id?: string;
    name?: string;
    doctorProfile?: {
      specialty?: string;
      department?: {
        name?: string;
      } | null;
    } | null;
  } | null;
  treatmentPlan?: {
    doctorNotes?: string | null;
    dietChart?: any;
    routinePlan?: any;
    medications?: Array<{
      name?: string;
      dosage?: string | null;
      timing?: string | null;
      medicineType?: string | null;
      durationDays?: number | null;
      doctorNotes?: string | null;
    }>;
    dietPlan?: {
      items?: Array<{
        mealTime?: string;
        itemName?: string;
        notes?: string | null;
        isAvoid?: boolean;
      }>;
    } | null;
  } | null;
};

const toText = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

const normalizeTextList = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object") {
        const candidate =
          toText((item as any).name) ||
          toText((item as any).itemName) ||
          toText((item as any).title) ||
          toText((item as any).label) ||
          toText((item as any).value);
        return candidate;
      }
      return "";
    })
    .filter(Boolean);
};

const buildMedicationLines = (appointment: DbAppointment): string[] => {
  const fromPlan = Array.isArray(appointment?.treatmentPlan?.medications)
    ? appointment.treatmentPlan!.medications!
        .map((medication) => {
          const name = toText(medication?.name);
          if (!name) return "";
          const dosage = toText(medication?.dosage);
          const timing = toText(medication?.timing);
          const duration = medication?.durationDays ? `${medication.durationDays} day(s)` : "";
          const suffix = [dosage, timing, duration].filter(Boolean).join(" | ");
          return suffix ? `${name} - ${suffix}` : name;
        })
        .filter(Boolean)
    : [];

  const medicationsRaw = appointment?.medications;
  const fromAppointment = Array.isArray(medicationsRaw)
    ? medicationsRaw
        .map((entry) => {
          if (typeof entry === "string") return entry.trim();
          if (!entry || typeof entry !== "object") return "";
          const name =
            toText((entry as any).name) ||
            toText((entry as any).medicineName) ||
            toText((entry as any).label);
          if (!name) return "";
          const dosage = toText((entry as any).dosage);
          const timing = toText((entry as any).timing);
          const suffix = [dosage, timing].filter(Boolean).join(" | ");
          return suffix ? `${name} - ${suffix}` : name;
        })
        .filter(Boolean)
    : typeof medicationsRaw === "string"
      ? medicationsRaw
          .split(/\n|,/)
          .map((text) => text.trim())
          .filter(Boolean)
      : [];

  return Array.from(new Set([...fromPlan, ...fromAppointment]));
};

const buildRoutineLines = (appointment: DbAppointment): string[] => {
  const source = appointment?.treatmentPlan?.routinePlan || appointment?.routinePlan;
  if (!source || typeof source !== "object") {
    return normalizeTextList(source);
  }

  const routineLines = normalizeTextList((source as any).exercisesAndAsanas);
  const therapyLines = normalizeTextList((source as any).therapy).map((line) => `Therapy: ${line}`);
  const testLines = normalizeTextList((source as any).tests).map((line) => `Test: ${line}`);

  return Array.from(new Set([...routineLines, ...therapyLines, ...testLines]));
};

const buildDietLines = (appointment: DbAppointment): string[] => {
  const dietPlanItems = Array.isArray(appointment?.treatmentPlan?.dietPlan?.items)
    ? appointment.treatmentPlan!.dietPlan!.items!
        .map((item) => {
          const name = toText(item?.itemName);
          if (!name) return "";
          const meal = toText(item?.mealTime);
          const notes = toText(item?.notes);
          const avoidLabel = item?.isAvoid ? "Avoid" : "Include";
          const prefix = meal ? `${meal}: ` : "";
          const suffix = notes ? ` (${notes})` : "";
          return `${prefix}${name} - ${avoidLabel}${suffix}`;
        })
        .filter(Boolean)
    : [];

  const source = appointment?.treatmentPlan?.dietChart || appointment?.dietChart;
  if (!source || typeof source !== "object") {
    return Array.from(new Set(dietPlanItems));
  }

  const items = normalizeTextList((source as any).items);
  const pathya = normalizeTextList((source as any).pathya).map((line) => `Pathya: ${line}`);
  const apathya = normalizeTextList((source as any).apathya).map((line) => `Apathya: ${line}`);
  const selectedFoods = Array.isArray((source as any).selectedFoods)
    ? (source as any).selectedFoods
        .map((entry: any) => {
          if (!entry || typeof entry !== "object") return "";
          const foodName = toText(entry?.name);
          if (!foodName) return "";
          const mealType = toText(entry?.mealType);
          const timing = toText(entry?.timing);
          const portion = toText(entry?.portion);
          const meta = [mealType, timing, portion].filter(Boolean).join(" | ");
          return meta ? `${foodName} - ${meta}` : foodName;
        })
        .filter(Boolean)
    : [];

  return Array.from(new Set([...dietPlanItems, ...items, ...pathya, ...apathya, ...selectedFoods]));
};

const formatStatus = (status: string) => {
  const normalized = String(status || "").toUpperCase();
  if (normalized === "SCHEDULED") return "Scheduled";
  if (normalized === "COMPLETED") return "Completed";
  if (normalized === "CANCELLED") return "Cancelled";
  return normalized || "Unknown";
};

const statusBadgeClass = (status: string) => {
  const normalized = String(status || "").toUpperCase();
  if (normalized === "COMPLETED") return "bg-emerald-100 text-emerald-700";
  if (normalized === "CANCELLED") return "bg-red-100 text-red-700";
  return "bg-blue-100 text-blue-700";
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });

const toUtcDateInput = (iso: string) => {
  const date = new Date(iso);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toUtcTimeInput = (iso: string) => {
  const date = new Date(iso);
  const hour = String(date.getUTCHours()).padStart(2, "0");
  const minute = String(date.getUTCMinutes()).padStart(2, "0");
  return `${hour}:${minute}`;
};

const doctorAvatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10B981&color=ffffff&size=128&rounded=true`;

const shortAppointmentRef = (id: string) => `APT-${id.slice(0, 8).toUpperCase()}`;

export default function PatientAppointmentsMain() {
  const [, setLocation] = useLocation();
  const loggedInUser = JSON.parse(localStorage.getItem("triveda_user") || "{}");
  const patientId = loggedInUser?.id || "";
  const patientName = loggedInUser?.name || "Patient";

  const { data, isLoading, refetch } = usePatientAppointments(patientId);
  const appointments: DbAppointment[] = Array.isArray(data) ? data : [];

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");
  const [editingAppointmentId, setEditingAppointmentId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [viewingCompletedAppointment, setViewingCompletedAppointment] = useState<DbAppointment | null>(null);

  const departments = useMemo(() => {
    const names = appointments
      .map((appointment) => appointment?.doctor?.doctorProfile?.department?.name || appointment?.doctor?.doctorProfile?.specialty || "General")
      .filter(Boolean);
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const appointmentStatus = String(appointment.status || "").toUpperCase();
      const appointmentDepartment =
        appointment?.doctor?.doctorProfile?.department?.name ||
        appointment?.doctor?.doctorProfile?.specialty ||
        "General";

      const statusMatch = statusFilter === "ALL" || appointmentStatus === statusFilter;
      const departmentMatch = departmentFilter === "ALL" || appointmentDepartment === departmentFilter;

      return statusMatch && departmentMatch;
    });
  }, [appointments, statusFilter, departmentFilter]);

  const scheduledAppointments = useMemo(() => {
    return filteredAppointments
      .filter((appointment) => String(appointment.status || "").toUpperCase() === "SCHEDULED")
      .slice()
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  }, [filteredAppointments]);

  const completedAppointments = useMemo(() => {
    return filteredAppointments
      .filter((appointment) => String(appointment.status || "").toUpperCase() === "COMPLETED")
      .slice()
      .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
  }, [filteredAppointments]);

  const handleDownloadPdf = (appointment: DbAppointment) => {
    const departmentName =
      appointment?.doctor?.doctorProfile?.department?.name ||
      appointment?.doctor?.doctorProfile?.specialty ||
      "General";

    const bookingForPdf: AppointmentBooking = {
      id: appointment.id,
      bookingId: createBookingId(),
      createdAt: new Date().toISOString(),
      diagnosis: appointment.patientSymptoms || "-",
      symptoms: appointment.patientSymptoms || "-",
      duration: "-",
      severity: "moderate",
      doctorCategory: "general",
      selectedDate: formatDate(appointment.scheduledAt),
      selectedTime: formatTime(appointment.scheduledAt),
      consultationMode: "clinic",
      patientName,
      patientAge: loggedInUser?.age ? String(loggedInUser.age) : "-",
      patientGender: loggedInUser?.gender || "-",
      currentMedications: "",
      allergies: "",
      medicalHistory: "",
      additionalNotes: "",
      assignedDoctor: {
        id: appointment.id,
        name: appointment?.doctor?.name || "Doctor",
        department: departmentName,
        experience: 0,
        clinic: `TriVeda ${departmentName} Center`,
      },
      status: "confirmed",
    };

    downloadAppointmentPdf(bookingForPdf);
  };

  const startReschedule = (appointment: DbAppointment) => {
    setEditingAppointmentId(appointment.id);
    setRescheduleDate(toUtcDateInput(appointment.scheduledAt));
    setRescheduleTime(toUtcTimeInput(appointment.scheduledAt));
  };

  const handleReschedule = async (appointmentId: string) => {
    if (!rescheduleDate || !rescheduleTime) {
      alert("Please select both date and time.");
      return;
    }

    try {
      setActionLoadingId(appointmentId);
      await appointmentApi.reschedulePatientAppointment(patientId, appointmentId, {
        date: rescheduleDate,
        time: rescheduleTime,
      });
      await refetch();
      setEditingAppointmentId(null);
      setRescheduleDate("");
      setRescheduleTime("");
    } catch (error: any) {
      alert(error?.message || "Failed to reschedule appointment.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    const confirmed = window.confirm("Cancel this appointment?");
    if (!confirmed) return;

    try {
      setActionLoadingId(appointmentId);
      await appointmentApi.cancelPatientAppointment(patientId, appointmentId);
      await refetch();
      if (editingAppointmentId === appointmentId) {
        setEditingAppointmentId(null);
        setRescheduleDate("");
        setRescheduleTime("");
      }
    } catch (error: any) {
      alert(error?.message || "Failed to cancel appointment.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const selectedMedicationLines = useMemo(
    () => (viewingCompletedAppointment ? buildMedicationLines(viewingCompletedAppointment) : []),
    [viewingCompletedAppointment]
  );

  const selectedRoutineLines = useMemo(
    () => (viewingCompletedAppointment ? buildRoutineLines(viewingCompletedAppointment) : []),
    [viewingCompletedAppointment]
  );

  const selectedDietLines = useMemo(
    () => (viewingCompletedAppointment ? buildDietLines(viewingCompletedAppointment) : []),
    [viewingCompletedAppointment]
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 lg:py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            type="button"
            onClick={() => setLocation("/patient/appointments/new")}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1F5C3F] to-emerald-600 text-white rounded-lg font-medium"
          >
            <Plus className="w-4 h-4" />
            New Appointment
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="ALL">All Statuses</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <select
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="ALL">All Departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-[#10B981] p-4 sm:p-6">
            <h2 className="text-2xl font-bold text-white">All Appointments</h2>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            {isLoading ? (
              <p className="text-gray-500">Loading appointments...</p>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                No appointments found.
              </div>
            ) : (
              <>
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Scheduled Appointments</h3>
                    <span className="text-xs font-semibold rounded-full bg-blue-100 text-blue-700 px-2 py-1">
                      {scheduledAppointments.length}
                    </span>
                  </div>

                  {scheduledAppointments.length === 0 ? (
                    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-sm text-blue-700">
                      No scheduled appointments for the selected filters.
                    </div>
                  ) : (
                    scheduledAppointments.map((appointment) => {
                      const doctorName = appointment?.doctor?.name || "Doctor";
                      const departmentName =
                        appointment?.doctor?.doctorProfile?.department?.name ||
                        appointment?.doctor?.doctorProfile?.specialty ||
                        "General";

                      const normalizedStatus = String(appointment.status || "").toUpperCase();
                      const isEditing = editingAppointmentId === appointment.id;
                      const isActionLoading = actionLoadingId === appointment.id;
                      const medicationText = buildMedicationLines(appointment).join(", ");

                      return (
                        <div key={appointment.id} className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40 p-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={doctorAvatarUrl(doctorName)}
                                alt={doctorName}
                                className="w-14 h-14 rounded-full border-2 border-white shadow-md object-cover"
                              />
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{doctorName}</p>
                                <p className="text-sm text-emerald-700 truncate">{departmentName}</p>
                                <p className="text-xs text-gray-500">{shortAppointmentRef(appointment.id)}</p>
                              </div>
                            </div>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium w-fit ${statusBadgeClass(appointment.status)}`}>
                              {formatStatus(appointment.status)}
                            </span>
                          </div>

                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                            <p className="rounded-lg bg-white/70 border border-emerald-100 px-3 py-2">
                              <Calendar className="w-3 h-3 inline mr-1" /> {formatDate(appointment.scheduledAt)}
                            </p>
                            <p className="rounded-lg bg-white/70 border border-emerald-100 px-3 py-2">
                              <Clock className="w-3 h-3 inline mr-1" /> {formatTime(appointment.scheduledAt)}
                            </p>
                          </div>

                          {appointment.patientSymptoms && appointment.patientSymptoms.trim() && (
                            <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                              {appointment.patientSymptoms}
                            </p>
                          )}

                          <div className="mt-3 text-sm text-gray-700 space-y-1">
                            {normalizedStatus !== "SCHEDULED" && medicationText && (
                              <p className="rounded-lg bg-white/70 border border-emerald-100 px-3 py-2">Medications: {medicationText}</p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDownloadPdf(appointment)}
                            className="mt-3 w-full py-2 border border-emerald-200 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-50"
                          >
                            <Download className="w-4 h-4 inline mr-1" /> Download PDF
                          </button>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={normalizedStatus === "CANCELLED" || isActionLoading}
                              onClick={() => (isEditing ? setEditingAppointmentId(null) : startReschedule(appointment))}
                              className="px-3 py-1.5 text-sm rounded-lg border border-blue-200 text-blue-700 disabled:opacity-50"
                            >
                              {isEditing ? "Cancel Reschedule" : "Reschedule"}
                            </button>
                            <button
                              type="button"
                              disabled={normalizedStatus === "CANCELLED" || isActionLoading}
                              onClick={() => handleCancel(appointment.id)}
                              className="px-3 py-1.5 text-sm rounded-lg border border-red-200 text-red-700 disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>

                          {isEditing && (
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input
                                type="date"
                                value={rescheduleDate}
                                onChange={(event) => setRescheduleDate(event.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                              />
                              <input
                                type="time"
                                value={rescheduleTime}
                                onChange={(event) => setRescheduleTime(event.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => handleReschedule(appointment.id)}
                                disabled={isActionLoading}
                                className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium disabled:opacity-50"
                              >
                                {isActionLoading ? "Saving..." : "Save New Slot"}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </section>

                <section className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Completed Appointments</h3>
                    <span className="text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 px-2 py-1">
                      {completedAppointments.length}
                    </span>
                  </div>

                  {completedAppointments.length === 0 ? (
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-emerald-700">
                      No completed appointments for the selected filters.
                    </div>
                  ) : (
                    completedAppointments.map((appointment) => {
                      const doctorName = appointment?.doctor?.name || "Doctor";
                      const departmentName =
                        appointment?.doctor?.doctorProfile?.department?.name ||
                        appointment?.doctor?.doctorProfile?.specialty ||
                        "General";

                      const normalizedStatus = String(appointment.status || "").toUpperCase();
                      const isEditing = editingAppointmentId === appointment.id;
                      const isActionLoading = actionLoadingId === appointment.id;
                      const medicationText = buildMedicationLines(appointment).join(", ");

                      return (
                        <div key={appointment.id} className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40 p-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={doctorAvatarUrl(doctorName)}
                                alt={doctorName}
                                className="w-14 h-14 rounded-full border-2 border-white shadow-md object-cover"
                              />
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{doctorName}</p>
                                <p className="text-sm text-emerald-700 truncate">{departmentName}</p>
                                <p className="text-xs text-gray-500">{shortAppointmentRef(appointment.id)}</p>
                              </div>
                            </div>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium w-fit ${statusBadgeClass(appointment.status)}`}>
                              {formatStatus(appointment.status)}
                            </span>
                          </div>

                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                            <p className="rounded-lg bg-white/70 border border-emerald-100 px-3 py-2">
                              <Calendar className="w-3 h-3 inline mr-1" /> {formatDate(appointment.scheduledAt)}
                            </p>
                            <p className="rounded-lg bg-white/70 border border-emerald-100 px-3 py-2">
                              <Clock className="w-3 h-3 inline mr-1" /> {formatTime(appointment.scheduledAt)}
                            </p>
                          </div>

                          {appointment.patientSymptoms && appointment.patientSymptoms.trim() && (
                            <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                              {appointment.patientSymptoms}
                            </p>
                          )}

                          <div className="mt-3 text-sm text-gray-700 space-y-1">
                            {normalizedStatus !== "SCHEDULED" && medicationText && (
                              <p className="rounded-lg bg-white/70 border border-emerald-100 px-3 py-2">Medications: {medicationText}</p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDownloadPdf(appointment)}
                            className="mt-3 w-full py-2 border border-emerald-200 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-50"
                          >
                            <Download className="w-4 h-4 inline mr-1" /> Download PDF
                          </button>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => setViewingCompletedAppointment(appointment)}
                              className="px-3 py-1.5 text-sm rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </section>
              </>
            )}
          </div>
        </div>
      </div>

      {viewingCompletedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4 sm:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden">
            <div className="flex items-start justify-between gap-4 p-4 sm:p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Appointment Details</h3>
                <p className="text-sm text-gray-600 mt-1">{shortAppointmentRef(viewingCompletedAppointment.id)}</p>
              </div>
              <button
                type="button"
                onClick={() => setViewingCompletedAppointment(null)}
                className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                  <p className="text-xs uppercase tracking-wide text-emerald-700">Doctor</p>
                  <p className="font-semibold text-gray-900 mt-1">{viewingCompletedAppointment?.doctor?.name || "Doctor"}</p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                  <p className="text-xs uppercase tracking-wide text-emerald-700">Department</p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {viewingCompletedAppointment?.doctor?.doctorProfile?.department?.name ||
                      viewingCompletedAppointment?.doctor?.doctorProfile?.specialty ||
                      "General"}
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                  <p className="text-xs uppercase tracking-wide text-emerald-700">Taken On</p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {formatDate(viewingCompletedAppointment.scheduledAt)} at {formatTime(viewingCompletedAppointment.scheduledAt)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Symptoms / Assessment</p>
                <p className="text-sm text-gray-700">
                  {toText(viewingCompletedAppointment.patientSymptoms) || "No symptoms/assessment recorded."}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Medicines Recommended</p>
                  {selectedMedicationLines.length === 0 ? (
                    <p className="text-sm text-gray-500">No medicines recorded.</p>
                  ) : (
                    <ul className="space-y-2">
                      {selectedMedicationLines.map((line, index) => (
                        <li key={`${line}-${index}`} className="text-sm text-gray-700 rounded-lg bg-gray-50 px-3 py-2 border border-gray-100">
                          {line}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Asanas / Routine / Timeline</p>
                  {selectedRoutineLines.length === 0 ? (
                    <p className="text-sm text-gray-500">No routine recommendations recorded.</p>
                  ) : (
                    <ul className="space-y-2">
                      {selectedRoutineLines.map((line, index) => (
                        <li key={`${line}-${index}`} className="text-sm text-gray-700 rounded-lg bg-gray-50 px-3 py-2 border border-gray-100">
                          {line}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Diet Recommendations</p>
                {selectedDietLines.length === 0 ? (
                  <p className="text-sm text-gray-500">No diet recommendations recorded.</p>
                ) : (
                  <ul className="space-y-2">
                    {selectedDietLines.map((line, index) => (
                      <li key={`${line}-${index}`} className="text-sm text-gray-700 rounded-lg bg-gray-50 px-3 py-2 border border-gray-100">
                        {line}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Doctor Notes</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {toText(viewingCompletedAppointment?.treatmentPlan?.doctorNotes) ||
                    toText(viewingCompletedAppointment?.doctorNotes) ||
                    "No notes recorded."}
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setViewingCompletedAppointment(null)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#1F5C3F] to-emerald-600 text-white font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
