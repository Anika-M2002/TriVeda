import React, { useMemo, useState } from "react";
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
} from "lucide-react";
import {
  AppointmentBooking,
  DoctorCategory,
  categoryLabelMap,
  createBookingId,
  downloadAppointmentPdf,
  getStoredAppointments,
  inferDoctorCategory,
  saveStoredAppointment,
} from "@/lib/appointment-booking";

type DoctorProfile = {
  id: number;
  name: string;
  department: DoctorCategory;
  experience: number;
  clinic: string;
  availability: Record<string, string[]>;
};

const doctorPool: DoctorProfile[] = [
  {
    id: 1,
    name: "Dr. Meera Kulkarni",
    department: "dentist",
    experience: 11,
    clinic: "TriVeda Dental & Oral Care",
    availability: { Monday: ["09:00", "11:00", "16:00"], Wednesday: ["10:00", "14:00"], Friday: ["09:30", "15:00"] },
  },
  {
    id: 2,
    name: "Dr. Arjun Nair",
    department: "dermatology",
    experience: 13,
    clinic: "TriVeda Skin Wellness",
    availability: { Tuesday: ["10:00", "12:00", "17:00"], Thursday: ["09:30", "13:00"], Saturday: ["11:30", "16:30"] },
  },
  {
    id: 3,
    name: "Dr. Kavita Rao",
    department: "cardiology",
    experience: 18,
    clinic: "TriVeda Cardio Care",
    availability: { Monday: ["10:00", "12:00"], Wednesday: ["09:30", "15:00"], Friday: ["11:00", "14:30"] },
  },
  {
    id: 4,
    name: "Dr. Suresh Iyer",
    department: "orthopedics",
    experience: 16,
    clinic: "TriVeda Joint & Mobility Center",
    availability: { Tuesday: ["09:00", "11:00", "15:30"], Thursday: ["10:30", "13:30"], Saturday: ["09:30", "12:30"] },
  },
  {
    id: 5,
    name: "Dr. Ayesha Khan",
    department: "gastroenterology",
    experience: 14,
    clinic: "TriVeda Digestive Health",
    availability: { Monday: ["08:30", "13:00"], Wednesday: ["11:00", "16:30"], Friday: ["10:30", "14:00"] },
  },
  {
    id: 6,
    name: "Dr. Rohit Sharma",
    department: "ent",
    experience: 12,
    clinic: "TriVeda ENT Specialty",
    availability: { Tuesday: ["09:30", "12:00", "17:00"], Thursday: ["11:00", "15:30"], Saturday: ["10:00", "14:30"] },
  },
  {
    id: 7,
    name: "Dr. Neha Verma",
    department: "general",
    experience: 10,
    clinic: "TriVeda General Medicine",
    availability: {
      Monday: ["09:00", "10:00", "11:00", "15:00"],
      Tuesday: ["09:30", "12:00", "16:00"],
      Wednesday: ["10:30", "14:30"],
      Thursday: ["09:00", "13:00", "17:00"],
      Friday: ["11:30", "16:30"],
    },
  },
];

function formatTimeLabel(time24: string) {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function PatientAppointments() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  const [diagnosis, setDiagnosis] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState<"mild" | "moderate" | "severe">("moderate");

  const [doctorCategory, setDoctorCategory] = useState<DoctorCategory | "">("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [consultationMode, setConsultationMode] = useState<"clinic" | "video">("clinic");

  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [bookings, setBookings] = useState<AppointmentBooking[]>(() => getStoredAppointments());
  const [confirmedBooking, setConfirmedBooking] = useState<AppointmentBooking | null>(null);

  const dayName = useMemo(() => {
    if (!selectedDate) return "";
    return new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long" });
  }, [selectedDate]);

  const availableSlots = useMemo(() => {
    if (!doctorCategory || !dayName) return [];

    const unique = new Set<string>();
    doctorPool
      .filter((doctor) => doctor.department === doctorCategory)
      .forEach((doctor) => {
        (doctor.availability[dayName] || []).forEach((slot) => unique.add(slot));
      });

    return Array.from(unique).sort();
  }, [doctorCategory, dayName]);

  const aiAssignedDoctor = useMemo(() => {
    if (!doctorCategory || !selectedTime || !dayName) return null;

    const candidates = doctorPool
      .filter((doctor) => doctor.department === doctorCategory)
      .filter((doctor) => (doctor.availability[dayName] || []).includes(selectedTime));

    if (candidates.length === 0) return null;

    const sorted = [...candidates].sort((a, b) => b.experience - a.experience);
    if (severity === "severe") return sorted[0];
    if (severity === "mild") return sorted[sorted.length - 1] || sorted[0];

    return sorted[Math.floor(sorted.length / 2)] || sorted[0];
  }, [doctorCategory, selectedTime, dayName, severity]);

  const stepTitles: Record<number, string> = {
    1: "Diagnosis",
    2: "Doctor Category",
    3: "Available Time Slots",
    4: "Patient Details",
    5: "Assigning Doctor",
    6: "Downloadable PDF",
  };

  const detectCategory = () => {
    if (!diagnosis.trim() && !symptoms.trim()) return;
    const inferred = inferDoctorCategory(`${diagnosis} ${symptoms}`);
    setDoctorCategory(inferred);
    setStep(2);
  };

  const handleConfirmBooking = () => {
    if (!doctorCategory || !selectedDate || !selectedTime || !aiAssignedDoctor) return;
    if (!patientName || !patientAge || !patientGender) return;

    const booking: AppointmentBooking = {
      id: String(Date.now()),
      bookingId: createBookingId(),
      createdAt: new Date().toISOString(),
      diagnosis,
      symptoms,
      duration,
      severity,
      doctorCategory,
      selectedDate,
      selectedTime: formatTimeLabel(selectedTime),
      consultationMode,
      patientName,
      patientAge,
      patientGender,
      currentMedications,
      allergies,
      medicalHistory,
      additionalNotes,
      assignedDoctor: {
        id: aiAssignedDoctor.id,
        name: aiAssignedDoctor.name,
        department: categoryLabelMap[aiAssignedDoctor.department],
        experience: aiAssignedDoctor.experience,
        clinic: aiAssignedDoctor.clinic,
      },
      status: "confirmed",
    };

    saveStoredAppointment(booking);
    setConfirmedBooking(booking);
    setBookings(getStoredAppointments());
    setStep(6);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-[#10B981] rounded-full shadow-lg mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-[#10B981] bg-clip-text text-transparent mb-2">
            Appointment Booking Flow
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Diagnosis to AI doctor assignment, with a downloadable PDF summary for every confirmed booking.
          </p>
        </div>

        <div className="mb-8 overflow-x-auto">
          <div className="flex items-center justify-center min-w-[820px] gap-2">
            {[1, 2, 3, 4, 5, 6].map((current) => (
              <React.Fragment key={current}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step >= current ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {current}
                  </div>
                  <span className={`text-sm font-medium ${step >= current ? "text-emerald-700" : "text-gray-500"}`}>
                    {stepTitles[current]}
                  </span>
                </div>
                {current < 6 && <ChevronRight className="w-4 h-4 text-gray-400" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-[#10B981] p-6">
                <h2 className="text-2xl font-bold text-white">Step {step}: {stepTitles[step]}</h2>
              </div>

              <div className="p-6 space-y-6">
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
                      disabled={!diagnosis.trim()}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-[#10B981] text-white rounded-lg font-semibold disabled:opacity-50"
                    >
                      Determine Doctor Category
                    </button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Auto-detected category</p>
                      <p className="text-lg font-semibold text-emerald-800">{doctorCategory ? categoryLabelMap[doctorCategory] : "Not detected"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Change category (if needed)</label>
                      <select
                        value={doctorCategory}
                        onChange={(e) => setDoctorCategory(e.target.value as DoctorCategory)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      >
                        {Object.entries(categoryLabelMap).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(1)} className="px-5 py-2 border rounded-lg">Back</button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        disabled={!doctorCategory}
                        className="flex-1 py-2 bg-emerald-500 text-white rounded-lg disabled:opacity-50"
                      >
                        Continue to Time Slots
                      </button>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select date *</label>
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={selectedDate}
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                          setSelectedTime("");
                        }}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {selectedDate && (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">Available slots for {dayName}</p>
                        {availableSlots.length === 0 ? (
                          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm">
                            No slots available for this day in selected category. Please choose another date.
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
                        Continue to Patient Details
                      </button>
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Patient name *</label>
                        <input value={patientName} onChange={(e) => setPatientName(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                        <input value={patientAge} onChange={(e) => setPatientAge(e.target.value)} type="number" min="1" max="120" className="w-full p-3 border border-gray-200 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                        <select value={patientGender} onChange={(e) => setPatientGender(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg">
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Consultation mode *</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button type="button" onClick={() => setConsultationMode("clinic")} className={`py-2 border rounded-lg ${consultationMode === "clinic" ? "bg-emerald-500 text-white border-emerald-500" : "border-gray-200"}`}>
                            <MapPin className="w-4 h-4 inline mr-1" /> In-Clinic
                          </button>
                          <button type="button" onClick={() => setConsultationMode("video")} className={`py-2 border rounded-lg ${consultationMode === "video" ? "bg-emerald-500 text-white border-emerald-500" : "border-gray-200"}`}>
                            <Video className="w-4 h-4 inline mr-1" /> Video
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current medications</label>
                        <textarea value={currentMedications} onChange={(e) => setCurrentMedications(e.target.value)} rows={3} className="w-full p-3 border border-gray-200 rounded-lg" placeholder="Medicine name, dose, frequency" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Allergies history</label>
                        <textarea value={allergies} onChange={(e) => setAllergies(e.target.value)} rows={3} className="w-full p-3 border border-gray-200 rounded-lg" placeholder="Drug, food, seasonal allergies" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Medical history and other details</label>
                      <textarea value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} rows={3} className="w-full p-3 border border-gray-200 rounded-lg" placeholder="Past diagnosis, surgeries, chronic history" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Additional notes</label>
                      <textarea value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} rows={3} className="w-full p-3 border border-gray-200 rounded-lg" />
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(3)} className="px-5 py-2 border rounded-lg">Back</button>
                      <button
                        type="button"
                        onClick={() => setStep(5)}
                        disabled={!patientName || !patientAge || !patientGender}
                        className="flex-1 py-2 bg-emerald-500 text-white rounded-lg disabled:opacity-50"
                      >
                        Continue to AI Assignment
                      </button>
                    </div>
                  </>
                )}

                {step === 5 && (
                  <>
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                      <p className="text-sm text-blue-800">
                        AI assignment placeholder: final AI model will rank doctors by specialty match, severity, slot availability, and follow-up history.
                      </p>
                    </div>

                    {aiAssignedDoctor ? (
                      <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50">
                        <h3 className="text-lg font-semibold text-emerald-800 mb-2">Assigned Doctor</h3>
                        <p className="font-semibold text-gray-900">{aiAssignedDoctor.name}</p>
                        <p className="text-sm text-gray-700">{categoryLabelMap[aiAssignedDoctor.department]} • {aiAssignedDoctor.experience} years</p>
                        <p className="text-sm text-gray-600">{aiAssignedDoctor.clinic}</p>
                        <div className="mt-3 text-sm text-gray-700 space-y-1">
                          <p><span className="font-medium">Date:</span> {selectedDate}</p>
                          <p><span className="font-medium">Time:</span> {formatTimeLabel(selectedTime)}</p>
                          <p><span className="font-medium">Patient:</span> {patientName}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-800">
                        No doctor is available for the selected slot. Please go back and select another time.
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(4)} className="px-5 py-2 border rounded-lg">Back</button>
                      <button
                        type="button"
                        onClick={handleConfirmBooking}
                        disabled={!aiAssignedDoctor}
                        className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-[#10B981] text-white rounded-lg disabled:opacity-50"
                      >
                        Confirm Appointment
                      </button>
                    </div>
                  </>
                )}

                {step === 6 && confirmedBooking && (
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
                        <p>Category: {categoryLabelMap[confirmedBooking.doctorCategory]}</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="font-semibold mb-2">Assigned Doctor</p>
                        <p>{confirmedBooking.assignedDoctor.name}</p>
                        <p>{confirmedBooking.assignedDoctor.department}</p>
                        <p>{confirmedBooking.assignedDoctor.clinic}</p>
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
                      <button type="button" onClick={() => setStep(1)} className="px-5 py-3 border rounded-lg">
                        Book Another
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-[#10B981] to-emerald-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>My Appointments</span>
                </h2>
              </div>

              <div className="p-5 space-y-4 max-h-[640px] overflow-y-auto">
                {bookings.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    No bookings yet.
                  </div>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex justify-between gap-2">
                        <p className="font-semibold text-gray-900">{booking.patientName}</p>
                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">{booking.status}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{booking.bookingId}</p>

                      <div className="text-sm text-gray-700 space-y-1">
                        <p><Calendar className="w-3 h-3 inline mr-1" /> {booking.selectedDate}</p>
                        <p><Clock className="w-3 h-3 inline mr-1" /> {booking.selectedTime}</p>
                        <p><Stethoscope className="w-3 h-3 inline mr-1" /> {booking.assignedDoctor.name}</p>
                        <p><AlertCircle className="w-3 h-3 inline mr-1" /> {categoryLabelMap[booking.doctorCategory]}</p>
                        <p><Pill className="w-3 h-3 inline mr-1" /> {booking.currentMedications || "No medications shared"}</p>
                        <p>Allergies: {booking.allergies || "None specified"}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => downloadAppointmentPdf(booking)}
                        className="mt-3 w-full py-2 border border-emerald-200 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-50"
                      >
                        <Download className="w-4 h-4 inline mr-1" /> Download PDF
                      </button>
                    </div>
                  ))
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
