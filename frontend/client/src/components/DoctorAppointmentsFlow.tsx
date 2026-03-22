import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Pill,
  RefreshCw,
  Stethoscope,
  User,
} from "lucide-react";
import {
  AppointmentBooking,
  categoryLabelMap,
  downloadAppointmentPdf,
  getStoredAppointments,
} from "@/lib/appointment-booking";

export default function DoctorAppointmentsFlow() {
  const [appointments, setAppointments] = useState<AppointmentBooking[]>([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [dietChartItems, setDietChartItems] = useState("");
  const [mealTimings, setMealTimings] = useState("");
  const [ayurvedicType, setAyurvedicType] = useState("");
  const [dietStats, setDietStats] = useState("");
  const [routineMode, setRoutineMode] = useState<"manual" | "ai">("manual");
  const [routinePlan, setRoutinePlan] = useState("");
  const [medicationName, setMedicationName] = useState("");
  const [medicationTime, setMedicationTime] = useState("");
  const [medicationProperties, setMedicationProperties] = useState("");
  const [doctorNotes, setDoctorNotes] = useState("");
  const [doctorAnalysis, setDoctorAnalysis] = useState("");
  const [planConfirmed, setPlanConfirmed] = useState(false);

  useEffect(() => {
    setAppointments(getStoredAppointments());

    const sync = () => setAppointments(getStoredAppointments());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const getAppointmentDateTime = (appointment: AppointmentBooking) => {
    const [hourRaw, minuteRaw] = appointment.selectedTime.split(":");
    if (!hourRaw || !minuteRaw) return new Date(appointment.selectedDate);
    const minutePart = Number((minuteRaw || "0").replace(/[^0-9]/g, ""));
    const ampm = appointment.selectedTime.toLowerCase().includes("pm") ? "pm" : "am";
    let hour = Number(hourRaw);
    if (ampm === "pm" && hour < 12) hour += 12;
    if (ampm === "am" && hour === 12) hour = 0;

    const date = new Date(appointment.selectedDate);
    date.setHours(hour, minutePart, 0, 0);
    return date;
  };

  const isAppointmentStarted = (appointment: AppointmentBooking) => new Date() >= getAppointmentDateTime(appointment);

  const isAppointmentOngoing = (appointment: AppointmentBooking) => {
    const now = new Date();
    const start = getAppointmentDateTime(appointment);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    return now >= start && now <= end;
  };

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort(
      (a, b) => getAppointmentDateTime(a).getTime() - getAppointmentDateTime(b).getTime()
    );
  }, [appointments]);

  const selectedAppointment = sortedAppointments.find((appointment) => appointment.id === selectedAppointmentId) || null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Appointments Workflow</h2>
            <button
              className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 w-full sm:w-auto"
              onClick={() => setAppointments(getStoredAppointments())}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2 space-y-4">
              {sortedAppointments.length === 0 ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-sm text-[#1F5C3F]">
                  No patient-booked appointments found yet.
                </div>
              ) : (
                sortedAppointments.map((appointment) => {
                  const started = isAppointmentStarted(appointment);
                  const ongoing = isAppointmentOngoing(appointment);
                  return (
                    <div
                      key={appointment.id}
                      className={`bg-white border rounded-xl p-5 ${
                        selectedAppointmentId === appointment.id
                          ? "border-emerald-400 shadow-md"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-gray-900">{appointment.patientName}</p>
                          <p className="text-sm text-gray-600">{appointment.bookingId}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            Approved
                          </span>
                          {ongoing ? (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 inline-flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                              Ongoing
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                              Upcoming
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <p><Calendar className="w-4 h-4 inline mr-1 text-[#1F5C3F]" /> {appointment.selectedDate}</p>
                        <p><Clock className="w-4 h-4 inline mr-1 text-[#1F5C3F]" /> {appointment.selectedTime}</p>
                        <p><User className="w-4 h-4 inline mr-1 text-[#1F5C3F]" /> {appointment.patientAge}y, {appointment.patientGender}</p>
                        <p><Stethoscope className="w-4 h-4 inline mr-1 text-[#1F5C3F]" /> {appointment.assignedDoctor.name}</p>
                        <p className="md:col-span-2"><span className="font-medium">Diagnosis:</span> {appointment.diagnosis}</p>
                        <p className="md:col-span-2"><span className="font-medium">Category:</span> {categoryLabelMap[appointment.doctorCategory]}</p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          className="px-3 py-2 rounded-lg bg-[#1F5C3F] text-white text-sm"
                          onClick={() => {
                            setSelectedAppointmentId(appointment.id);
                            setPlanConfirmed(false);
                          }}
                        >
                          Open During Appointment
                        </button>
                        <button
                          className="px-3 py-2 rounded-lg border border-[#1F5C3F]/30 text-[#1F5C3F] text-sm"
                          onClick={() => downloadAppointmentPdf(appointment)}
                        >
                          <Download className="w-4 h-4 inline mr-1" /> Download PDF
                        </button>
                      </div>

                      {!started && (
                        <p className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                          Patient details and diet chart tools unlock automatically when appointment time starts.
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Doctor Notes & Analysis</h3>
                <textarea
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                  placeholder="Write notes during consultation..."
                />
                <textarea
                  value={doctorAnalysis}
                  onChange={(e) => setDoctorAnalysis(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg p-2 mt-3 text-sm"
                  placeholder="Clinical analysis and follow-up plan..."
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Diet Chart Creation</h3>
                <textarea
                  value={dietChartItems}
                  onChange={(e) => setDietChartItems(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                  placeholder="Food items (e.g., mung khichdi, warm water, fruits)"
                  disabled={!selectedAppointment || !isAppointmentStarted(selectedAppointment)}
                />
                <input
                  value={mealTimings}
                  onChange={(e) => setMealTimings(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2 mt-2 text-sm"
                  placeholder="Meal timings (e.g., 9 AM breakfast, 1 PM lunch)"
                  disabled={!selectedAppointment || !isAppointmentStarted(selectedAppointment)}
                />
                <input
                  value={ayurvedicType}
                  onChange={(e) => setAyurvedicType(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2 mt-2 text-sm"
                  placeholder="Ayurvedic type (Vata/Pitta/Kapha)"
                  disabled={!selectedAppointment || !isAppointmentStarted(selectedAppointment)}
                />
                <input
                  value={dietStats}
                  onChange={(e) => setDietStats(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2 mt-2 text-sm"
                  placeholder="Other stats (calories, digestion score, hydration target)"
                  disabled={!selectedAppointment || !isAppointmentStarted(selectedAppointment)}
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Routine Plans (Yoga / Asan)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setRoutineMode("manual")}
                    className={`py-2 text-sm rounded-lg border ${routineMode === "manual" ? "bg-[#1F5C3F] text-white border-[#1F5C3F]" : "border-gray-200"}`}
                    disabled={!selectedAppointment || !isAppointmentStarted(selectedAppointment)}
                  >
                    Manual
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoutineMode("ai")}
                    className={`py-2 text-sm rounded-lg border ${routineMode === "ai" ? "bg-[#10B981] text-white border-[#10B981]" : "border-gray-200"}`}
                    disabled={!selectedAppointment || !isAppointmentStarted(selectedAppointment)}
                  >
                    AI Suggest
                  </button>
                </div>
                <textarea
                  value={routinePlan}
                  onChange={(e) => setRoutinePlan(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                  placeholder={
                    routineMode === "manual"
                      ? "Enter yoga/asan schedule manually"
                      : "AI model suggestions placeholder (to be integrated later)"
                  }
                  disabled={!selectedAppointment || !isAppointmentStarted(selectedAppointment)}
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Medication / Remedy</h3>
                <input
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                  placeholder="Medicine / remedy name"
                  disabled={!selectedAppointment || !isAppointmentStarted(selectedAppointment)}
                />
                <input
                  value={medicationTime}
                  onChange={(e) => setMedicationTime(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2 mt-2 text-sm"
                  placeholder="Medicine time (e.g., 8 AM, 8 PM)"
                  disabled={!selectedAppointment || !isAppointmentStarted(selectedAppointment)}
                />
                <input
                  value={medicationProperties}
                  onChange={(e) => setMedicationProperties(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2 mt-2 text-sm"
                  placeholder="Type and properties"
                  disabled={!selectedAppointment || !isAppointmentStarted(selectedAppointment)}
                />
              </div>

              <button
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#1F5C3F] to-[#10B981] text-white font-semibold disabled:opacity-50"
                disabled={!selectedAppointment || !isAppointmentStarted(selectedAppointment)}
                onClick={() => setPlanConfirmed(true)}
              >
                Confirm Plan by Doctor
              </button>
              {planConfirmed && (
                <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                  Plan confirmed and ready for patient view.
                </p>
              )}

              {!selectedAppointment && (
                <p className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-2">
                  Select an appointment from the list to start diagnosis and treatment workflow.
                </p>
              )}

              {selectedAppointment && !isAppointmentStarted(selectedAppointment) && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 flex items-start gap-1">
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                  Workflow inputs are disabled until the appointment start time.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
