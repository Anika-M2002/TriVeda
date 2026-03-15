import { jsPDF } from "jspdf";

export type DoctorCategory =
  | "dentist"
  | "dermatology"
  | "cardiology"
  | "orthopedics"
  | "gastroenterology"
  | "ent"
  | "general";

export interface AppointmentBooking {
  id: string;
  bookingId: string;
  createdAt: string;
  diagnosis: string;
  symptoms: string;
  duration: string;
  severity: "mild" | "moderate" | "severe";
  doctorCategory: DoctorCategory;
  selectedDate: string;
  selectedTime: string;
  consultationMode: "clinic" | "video";
  patientName: string;
  patientAge: string;
  patientGender: string;
  currentMedications: string;
  allergies: string;
  medicalHistory: string;
  additionalNotes: string;
  assignedDoctor: {
    id: number;
    name: string;
    department: string;
    experience: number;
    clinic: string;
  };
  status: "confirmed" | "pending";
}

const STORAGE_KEY = "triveda:patient-appointments";

export const categoryLabelMap: Record<DoctorCategory, string> = {
  dentist: "Dentistry",
  dermatology: "Dermatology",
  cardiology: "Cardiology",
  orthopedics: "Orthopedics",
  gastroenterology: "Gastroenterology",
  ent: "ENT",
  general: "General Medicine",
};

export function createBookingId() {
  return `APT-${Date.now().toString().slice(-6)}`;
}

export function getStoredAppointments(): AppointmentBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AppointmentBooking[];
    if (!Array.isArray(parsed)) return [];
    return parsed.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return [];
  }
}

export function saveStoredAppointment(booking: AppointmentBooking) {
  if (typeof window === "undefined") return;
  const current = getStoredAppointments();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([booking, ...current]));
}

export function inferDoctorCategory(text: string): DoctorCategory {
  const input = text.toLowerCase();

  if (/tooth|teeth|gum|jaw|dental|cavity/.test(input)) return "dentist";
  if (/skin|rash|acne|eczema|itch|psoriasis/.test(input)) return "dermatology";
  if (/heart|chest pain|bp|blood pressure|palpitation/.test(input)) return "cardiology";
  if (/joint|knee|back pain|bone|neck|spine/.test(input)) return "orthopedics";
  if (/stomach|digestion|acidity|gas|constipation|liver/.test(input)) return "gastroenterology";
  if (/ear|nose|throat|sinus|hearing/.test(input)) return "ent";

  return "general";
}

export function downloadAppointmentPdf(booking: AppointmentBooking) {
  const pdf = new jsPDF();
  const lineHeight = 8;
  let y = 16;

  const line = (label: string, value: string) => {
    pdf.setFont("helvetica", "bold");
    pdf.text(`${label}:`, 14, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(value || "-", 70, y);
    y += lineHeight;
  };

  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("TriVeda Appointment Booking", 14, y);
  y += 10;

  pdf.setFontSize(11);
  line("Booking ID", booking.bookingId);
  line("Status", booking.status);
  line("Booked On", new Date(booking.createdAt).toLocaleString());
  line("Patient Name", booking.patientName);
  line("Age / Gender", `${booking.patientAge} / ${booking.patientGender}`);
  line("Diagnosis", booking.diagnosis);
  line("Symptoms", booking.symptoms || "-" );
  line("Doctor Category", categoryLabelMap[booking.doctorCategory]);
  line("Assigned Doctor", booking.assignedDoctor.name);
  line("Department", booking.assignedDoctor.department);
  line("Consultation", booking.consultationMode === "video" ? "Video" : "In-Clinic");
  line("Date", booking.selectedDate);
  line("Time", booking.selectedTime);
  line("Current Medications", booking.currentMedications || "-" );
  line("Allergies", booking.allergies || "-" );
  line("Medical History", booking.medicalHistory || "-" );
  line("Additional Notes", booking.additionalNotes || "-" );

  pdf.save(`${booking.bookingId}.pdf`);
}
