import React, { useState, useEffect } from "react";
import {
  User,
  Search,
  TrendingUp,
  Heart,
  Calendar,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  X,
  Stethoscope,
  Users,
  FileText,
  Activity,
  Settings,
  Bell,
  Video,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Pill,
  Droplets,
  Brain,
  Monitor,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Filter,
  SortAsc,
  RefreshCw,
  Share,
  Download,
  Eye,
  Star,
  StarOff,
  Target,
  Award,
  Shield,
  Thermometer,
  Save,
  Wind,
  Flame,
  Droplet,
  Utensils,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import GuidelineModal from "./GuidelineModal";
import { useDoctorProfile, useUpdatePatientProfile } from "@/hooks/useProfile";
import { useDoctorPatients } from "@/hooks/useDoctorPatients";
import { useDoctorAppointments } from "@/hooks/useAppointments";
import { useSaveDoctorPlan } from "@/hooks/useAppointments";
import { useLatestPrakritiAssessment, useSavePrakritiAssessment } from "@/hooks/useAppointments";
import { useTreatmentCatalogs } from "@/hooks/useTreatmentCatalogs";
import type {
  AsanaCatalogItem,
  FoodCatalogItem,
  MedicineCatalogItem,
} from "@/api/catalog.api";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  AppointmentBooking,
  categoryLabelMap,
  downloadAppointmentPdf,
  getStoredAppointments,
} from "@/lib/appointment-booking";

const mockRecentActivities = [
  {
    id: "1",
    action: "Diet chart approved for Priya Sharma",
    type: "approval",
    time: "2 hours ago",
    icon: CheckCircle,
  },
  {
    id: "2",
    action: "New patient registered: Anjali Reddy",
    type: "registration",
    time: "4 hours ago",
    icon: User,
  },
  {
    id: "3",
    action: "Rohit Kumar logged meal compliance - 100%",
    type: "compliance",
    time: "6 hours ago",
    icon: TrendingUp,
  },
  {
    id: "4",
    action: "Video consultation scheduled with Dr. Vikram Patel",
    type: "appointment",
    time: "1 day ago",
    icon: Video,
  },
  {
    id: "5",
    action: "Lab results uploaded for Priya Sharma",
    type: "lab",
    time: "2 days ago",
    icon: FileText,
  },
];

const complianceData = [
  { month: "Jan", compliance: 78, target: 85 },
  { month: "Feb", compliance: 82, target: 85 },
  { month: "Mar", compliance: 85, target: 85 },
  { month: "Apr", compliance: 88, target: 85 },
  { month: "May", compliance: 85, target: 85 },
  { month: "Jun", compliance: 90, target: 85 },
];

const prakritiDistribution = [
  { name: "Vata", value: 35, color: "#8b5cf6" },
  { name: "Pitta", value: 40, color: "#06d6a0" },
  { name: "Kapha", value: 25, color: "#ffd166" },
];

const prakritiQuestions = [
  { id: "body-frame", label: "Body Frame" },
  { id: "skin-type", label: "Skin Type" },
  { id: "appetite", label: "Appetite" },
  { id: "sleep", label: "Sleep Pattern" },
  { id: "energy", label: "Energy Levels" },
  { id: "digestion", label: "Digestion" },
  { id: "temperament", label: "Temperament" },
  { id: "weather", label: "Weather Preference" },
];

const doshaReviewConfig = {
  vata: {
    name: "Vata",
    icon: Wind,
    color: "text-[#1F5C3F]",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  pitta: {
    name: "Pitta",
    icon: Flame,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  kapha: {
    name: "Kapha",
    icon: Droplet,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
} as const;


type MedicationSlot = {
  id: string;
  remedyId: string | null;
  timing: string;
  dosage: string;
  doctorNotes: string;
  importantDetails: string;
};

type ExerciseSlot = {
  id: string;
  exerciseId: string | null;
  timing: string;
  duration: string;
  doctorNotes: string;
  importantDetails: string;
};

type FoodSlot = {
  id: string;
  foodId: string | null;
  mealType: "Breakfast" | "Lunch" | "Snack" | "Dinner" | "Other";
  portion: string;
  timing: string;
  doctorNotes: string;
  calories: number;
};

interface DoctorDashboardProps {
  onNavigate?: (view: string) => void;
  patientId?: string;
}

export default function DoctorDashboard({
  onNavigate,
  patientId,
}: DoctorDashboardProps) {
  const loggedInUser = JSON.parse(localStorage.getItem("triveda_user") || "{}");
  const doctorId =
    loggedInUser?.portal === "DOCTOR" || loggedInUser?.role === "DOCTOR"
      ? loggedInUser?.id || ""
      : "";
  const { data: doctorProfileData, isLoading: isDoctorProfileLoading } = useDoctorProfile(doctorId);
  const { data: doctorPatientsData, isLoading: isDoctorPatientsLoading } = useDoctorPatients(doctorId);
  const {
    data: doctorAppointmentsData,
    isLoading: isDoctorAppointmentsLoading,
    refetch: refetchDoctorAppointments,
  } = useDoctorAppointments(doctorId);
  const doctorPayload: any = (doctorProfileData as any)?.data || doctorProfileData || {};
  const patientsPayload: any = (doctorPatientsData as any)?.data || doctorPatientsData || [];
  const appointmentsPayload: any[] = (doctorAppointmentsData as any)?.data || doctorAppointmentsData || [];
  const doctorDisplayName = doctorPayload?.name || loggedInUser?.name || "Doctor";
  const doctorSpecialty = doctorPayload?.doctorProfile?.specialty || "Ayurvedic Doctor";
  const saveDoctorPlanMutation = useSaveDoctorPlan();
  const savePrakritiAssessmentMutation = useSavePrakritiAssessment();
  const updatePatientProfileMutation = useUpdatePatientProfile();
  const { data: treatmentCatalogData } = useTreatmentCatalogs();

  const treatmentCatalogPayload: any = treatmentCatalogData || {};
  const foodCatalog: FoodCatalogItem[] = Array.isArray(treatmentCatalogPayload?.foods)
    ? treatmentCatalogPayload.foods
    : [];
  const asanaCatalog: AsanaCatalogItem[] = Array.isArray(treatmentCatalogPayload?.asanas)
    ? treatmentCatalogPayload.asanas
    : [];
  const medicineCatalog: MedicineCatalogItem[] = Array.isArray(treatmentCatalogPayload?.medicines)
    ? treatmentCatalogPayload.medicines
    : [];

  const [sharedAppointments, setSharedAppointments] = useState<AppointmentBooking[]>([]);
  // Reschedule Modal State
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleForm, setRescheduleForm] = useState({
    patientId: "",
    date: "",
    time: "",
  });
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);
  const [reschedulePatientName, setReschedulePatientName] = useState("");

  const handleOpenRescheduleModal = (patient: any) => {
    setRescheduleForm({
      patientId: patient.id,
      date: patient.nextAppointment || "",
      time: "10:00",
    });
    setReschedulePatientName(patient.name);
    setRescheduleSuccess(false);
    setShowRescheduleModal(true);
  };
  const handleCloseRescheduleModal = () => {
    setShowRescheduleModal(false);
    setRescheduleSuccess(false);
  };
  const handleRescheduleFormChange = (field: string, value: string) => {
    setRescheduleForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleRescheduleAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setRescheduleSuccess(true);
    // Here you would update the appointment in state/db
  };
  // Appointment Modal State
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    patientId: "",
    date: "",
    time: "",
    details: "",
  });
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);

  const handleOpenAppointmentModal = () => {
    setAppointmentForm({ patientId: "", date: "", time: "", details: "" });
    setAppointmentSuccess(false);
    setShowAppointmentModal(true);
  };
  const handleCloseAppointmentModal = () => {
    setShowAppointmentModal(false);
    setAppointmentSuccess(false);
  };
  const handleAppointmentFormChange = (field: string, value: string) => {
    setAppointmentForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleScheduleAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentSuccess(true);
    // Here you would add logic to actually schedule the appointment
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(
    null
  );
  const [tab, setTab] = useState<number>(0);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [notificationCount, setNotificationCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  // Notification dropdown state
  const [showNotifications, setShowNotifications] = useState(false);
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    location: "",
    need: "",
    phone: "",
  });
  const [addSuccess, setAddSuccess] = useState(false);
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
  const [profileMode, setProfileMode] = useState<"view" | "consult">("view");
  const [prakritiEditMode, setPrakritiEditMode] = useState(false);
  const [prakritiEditState, setPrakritiEditState] = useState<{
    finalDosha: "vata" | "pitta" | "kapha" | "";
    doctorNotes: string;
    answers: string[];
  }>({
    finalDosha: "",
    doctorNotes: "",
    answers: Array(8).fill("Not specified"),
  });

  const {
    data: latestPrakritiAssessmentData,
    isLoading: isLatestPrakritiLoading,
    refetch: refetchLatestPrakriti,
  } = useLatestPrakritiAssessment(selectedPatient?.id);

  const [showDietFlowModal, setShowDietFlowModal] = useState(false);
  const [dietFlowStep, setDietFlowStep] = useState(1);
  const [dietFlowSearch, setDietFlowSearch] = useState("");
  const [dietFlowSelectedMealIdx, setDietFlowSelectedMealIdx] = useState(0);
  const [dietFlowChart, setDietFlowChart] = useState<any>({
    patientName: "",
    prakriti: "",
    meals: [
      { meal: "Breakfast", foods: [], time: "8:00 AM", rationale: "", calories: 0 },
      { meal: "Lunch", foods: [], time: "1:00 PM", rationale: "", calories: 0 },
      { meal: "Snack", foods: [], time: "4:30 PM", rationale: "", calories: 0 },
      { meal: "Dinner", foods: [], time: "7:00 PM", rationale: "", calories: 0 },
    ],
    recommendations: [],
  });

  const [showFieldFlowModal, setShowFieldFlowModal] = useState(false);
  const [fieldFlowType, setFieldFlowType] = useState<"medications" | "asanas" | "therapy" | "tests" | "notes" | null>(null);
  const [fieldFlowDraft, setFieldFlowDraft] = useState("");
  const [fieldFlowStep, setFieldFlowStep] = useState(1);
  const [medicationSlots, setMedicationSlots] = useState<MedicationSlot[]>([]);
  const [medicationSlotsDraft, setMedicationSlotsDraft] = useState<MedicationSlot[]>([]);
  const [activeMedicationSlotId, setActiveMedicationSlotId] = useState<string | null>(null);
  const [exerciseSlots, setExerciseSlots] = useState<ExerciseSlot[]>([]);
  const [exerciseSlotsDraft, setExerciseSlotsDraft] = useState<ExerciseSlot[]>([]);
  const [activeExerciseSlotId, setActiveExerciseSlotId] = useState<string | null>(null);
  const [foodSlots, setFoodSlots] = useState<FoodSlot[]>([]);
  const [foodSlotsDraft, setFoodSlotsDraft] = useState<FoodSlot[]>([]);
  const [activeFoodSlotId, setActiveFoodSlotId] = useState<string | null>(null);
  const [therapyFlowText, setTherapyFlowText] = useState("");
  const [testsFlowText, setTestsFlowText] = useState("");
  const [dietQuickSearch, setDietQuickSearch] = useState("");
  const [dietQuickPortion, setDietQuickPortion] = useState("");
  const [asanaQuickSearch, setAsanaQuickSearch] = useState("");
  const [exerciseDraftInputs, setExerciseDraftInputs] = useState<
    Record<string, { duration: string; timing: string }>
  >({});
  const [medicineSearch, setMedicineSearch] = useState("");

  // Seasonal Guidelines Modal State
  const [showGuidelineModal, setShowGuidelineModal] = useState(false);
  const [guidelinePatient, setGuidelinePatient] = useState<any>(null);
  const handleOpenGuidelineModal = (patient: any) => {
    setGuidelinePatient(patient);
    setShowGuidelineModal(true);
  };
  const handleCloseGuidelineModal = () => {
    setShowGuidelineModal(false);
    setGuidelinePatient(null);
  };
  const handleSendGuideline = (guideline: any) => {
    // Here you would save/link guideline to patient profile in DB
    setShowGuidelineModal(false);
    setGuidelinePatient(null);
  };

  useEffect(() => {
    if (!selectedPatient) return;

    const resolvedName = selectedPatient.name || "Patient";
    const resolvedPrakriti = selectedPatient.prakriti || "Not Assessed";

    setDietFlowChart((previousChart: any) => {
      if (
        previousChart.patientName === resolvedName &&
        previousChart.prakriti === resolvedPrakriti
      ) {
        return previousChart;
      }

      return {
        ...previousChart,
        patientName: resolvedName,
        prakriti: resolvedPrakriti,
      };
    });
  }, [selectedPatient?.id, selectedPatient?.name, selectedPatient?.prakriti]);

  useEffect(() => {
    if (!patientId) {
      setSelectedPatient(null);
      setProfileMode("view");
      setPrakritiEditMode(false);
      return;
    }

    const storedMode = window.sessionStorage.getItem(`doctor:patient-mode:${patientId}`);
    setProfileMode(storedMode === "consult" ? "consult" : "view");
    const storedAppointmentId = window.sessionStorage.getItem(`doctor:patient-appointment:${patientId}`);
    if (storedAppointmentId) {
      setSelectedAppointmentId(storedAppointmentId);
    }

    const patientFromRoute = patients.find((patient) => patient.id === patientId) || null;
    setSelectedPatient(patientFromRoute);
  }, [patientId, patients]);

  useEffect(() => {
    if (!Array.isArray(patientsPayload)) return;

    const normalizedPatients = patientsPayload.map((patient: any) => ({
      ...patient,
      prakriti: patient?.prakriti || "Not Assessed",
      location: patient?.location || "-",
      issues: Array.isArray(patient?.issues) ? patient.issues : [],
      medications: Array.isArray(patient?.medications) ? patient.medications : [],
      allergies: Array.isArray(patient?.allergies)
        ? patient.allergies
        : typeof patient?.allergies === "string" && patient.allergies.trim() && patient.allergies !== "-"
        ? [patient.allergies]
        : [],
      vitalSigns: patient?.vitalSigns || { bp: "-", pulse: 0, weight: "-", temp: "-" },
      phone: patient?.phone || "-",
      email: patient?.email || "-",
      age: Number(patient?.age ?? 0),
      compliance: Number(patient?.compliance ?? 0),
      riskScore: Number(patient?.riskScore ?? 0),
      priority: patient?.priority || "low",
      status: patient?.status || "active",
      starred: Boolean(patient?.starred),
    }));

    setPatients(normalizedPatients);
  }, [patientsPayload]);

  useEffect(() => {
    if (!Array.isArray(appointmentsPayload)) {
      setSharedAppointments([]);
      return;
    }

    const mapped: AppointmentBooking[] = appointmentsPayload.map((appointment: any) => {
      const scheduledAt = appointment?.scheduledAt ? new Date(appointment.scheduledAt) : new Date();
      const safeDate = Number.isNaN(scheduledAt.getTime()) ? new Date() : scheduledAt;

      const selectedDate = safeDate.toISOString().split("T")[0];
      const selectedTime = safeDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

      const severityRaw = String(appointment?.severity || "").toLowerCase();
      const severity: "mild" | "moderate" | "severe" =
        severityRaw === "severe" ? "severe" : severityRaw === "moderate" ? "moderate" : "mild";

      return {
        id: appointment?.id,
        patientId: appointment?.patient?.id,
        bookingId: `APT-${String(appointment?.id || "").slice(0, 6).toUpperCase()}`,
        createdAt: appointment?.createdAt || safeDate.toISOString(),
        diagnosis: appointment?.problemDescription || appointment?.aiSummary || "Consultation",
        symptoms: appointment?.patientSymptoms || "-",
        duration: appointment?.duration || "-",
        severity,
        doctorCategory: "general",
        selectedDate,
        selectedTime,
        consultationMode: "clinic",
        patientName: appointment?.patient?.name || "Patient",
        patientAge: String(appointment?.patient?.age ?? "-"),
        patientGender: appointment?.patient?.gender || "-",
        currentMedications: "-",
        allergies: "-",
        medicalHistory: appointment?.patient?.vikriti || "-",
        additionalNotes: appointment?.doctorNotes || "",
        assignedDoctor: {
          id: doctorId,
          name: doctorDisplayName,
          department: doctorSpecialty,
          experience: Number(doctorPayload?.doctorProfile?.experienceYrs ?? 0),
          clinic: "TriVeda",
        },
        status: "confirmed",
      };
    });

    setSharedAppointments(mapped);
  }, [appointmentsPayload, doctorDisplayName, doctorId, doctorPayload?.doctorProfile?.experienceYrs, doctorSpecialty]);

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

  const isAppointmentStarted = (appointment: AppointmentBooking) => {
    const now = new Date();
    return now >= getAppointmentDateTime(appointment);
  };

  const isAppointmentOngoing = (appointment: AppointmentBooking) => {
    const now = new Date();
    const start = getAppointmentDateTime(appointment);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    return now >= start && now <= end;
  };

  const selectedAppointment = sharedAppointments.find(
    (appointment) => appointment.id === selectedAppointmentId
  ) || null;

  useEffect(() => {
    if (selectedAppointmentId || !selectedPatient?.id || sharedAppointments.length === 0) {
      return;
    }

    const patientAppointments = sharedAppointments
      .filter((appointment) => appointment.patientId === selectedPatient.id)
      .sort(
        (appointmentA, appointmentB) =>
          getAppointmentDateTime(appointmentA).getTime() -
          getAppointmentDateTime(appointmentB).getTime()
      );

    if (patientAppointments.length > 0) {
      setSelectedAppointmentId(patientAppointments[0].id);
    }
  }, [selectedAppointmentId, selectedPatient?.id, sharedAppointments]);

  const openPatientProfile = (patientIdToOpen: string, mode: "view" | "consult", appointmentId?: string) => {
    if (!patientIdToOpen) return;
    window.sessionStorage.setItem(`doctor:patient-mode:${patientIdToOpen}`, mode);
    if (appointmentId) {
      window.sessionStorage.setItem(`doctor:patient-appointment:${patientIdToOpen}`, appointmentId);
    } else {
      window.sessionStorage.removeItem(`doctor:patient-appointment:${patientIdToOpen}`);
    }
    window.location.href = `/doctor/${patientIdToOpen}`;
  };

  const handleSaveTreatmentPlan = async () => {
    if (!selectedAppointmentId) {
      alert("No appointment selected for plan update.");
      return;
    }

    const dietLines = dietChartItems
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const routineLinesFromEditor = routinePlan
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const routineLinesFromSlots = compileRoutinePlanFromSlots(exerciseSlots)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const routineLines = routineLinesFromSlots.length > 0
      ? routineLinesFromSlots
      : routineLinesFromEditor;

    const dosLines = dietStats
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const dontsLines = doctorAnalysis
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const medicationsFromSlots = medicationSlots
      .map((slot) => {
        const selectedRemedy = medicineCatalog.find((remedy) => remedy.id === slot.remedyId);
        if (!selectedRemedy) return null;

        return {
          name: selectedRemedy.medicineName,
          timing: slot.timing,
          dosage: slot.dosage,
          doctorNotes: slot.doctorNotes,
          importantDetails: slot.importantDetails,
          herbsUsed: selectedRemedy.herbsUsed,
          properties: selectedRemedy.ayurvedicProperties.join(", "),
          type: selectedRemedy.medicineType,
        };
      })
      .filter(Boolean) as any[];

    const medications = medicationsFromSlots.length > 0
      ? medicationsFromSlots
      : [
          {
            name: medicationName,
            timing: medicationTime,
            properties: medicationProperties,
          },
        ].filter((item) => item.name || item.timing || item.properties);

    const foodsFromSlots = foodSlots
      .map((slot) => {
        const selectedFood = foodCatalog.find((food) => food.id === slot.foodId);
        if (!selectedFood) return null;

        return {
          name: selectedFood.name,
          mealType: slot.mealType,
          portion: slot.portion,
          timing: slot.timing,
          doctorNotes: slot.doctorNotes,
          calories: slot.calories,
          category: selectedFood.category,
          dosha: selectedFood.dosha,
        };
      })
      .filter(Boolean) as any[];

    try {
      await saveDoctorPlanMutation.mutateAsync({
        appointmentId: selectedAppointmentId,
        planData: {
          doctorNotes,
          dietChart: {
            items: dietLines,
            pathya: dosLines,
            apathya: dontsLines,
            selectedFoods: foodsFromSlots,
          },
          routinePlan: {
            exercisesAndAsanas: routineLines,
            mode: routineMode,
            therapy: therapyFlowText
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean),
            tests: testsFlowText
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean),
          },
          medications,
        },
      });
      setPlanConfirmed(true);
    } catch (_error) {
      setPlanConfirmed(false);
    }
  };

  const filteredPatients = patients
    .filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.prakriti.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.issues.some((issue: string) =>
          issue.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesFilter =
        filterStatus === "all" || patient.status === filterStatus;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "lastVisit":
          return (
            new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
          );
        case "compliance":
          return b.compliance - a.compliance;
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (
            priorityOrder[b.priority as keyof typeof priorityOrder] -
            priorityOrder[a.priority as keyof typeof priorityOrder]
          );
        default:
          return 0;
      }
    });

  const stats = {
    totalPatients: patients.length,
    activeCharts: patients.filter((p) => p.status === "active").length,
    needsAttention: patients.filter((p) => p.status === "needs-attention")
      .length,
    avgCompliance:
      patients.length > 0
        ? Math.round(
            patients.reduce((sum, p) => sum + p.compliance, 0) / patients.length
          )
        : 0,
    upcomingAppointments: patients.filter(
      (p) =>
        new Date(p.nextAppointment) <=
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    ).length,
    highRiskPatients: patients.filter((p) => p.riskScore >= 4).length,
  };

  const handleCreateDietChart = (patientId: string) => {
    const patient = patients.find((entry) => entry.id === patientId) || selectedPatient;
    setDietFlowChart({
      patientName: patient?.name || "Patient",
      prakriti: patient?.prakriti || "Vata",
      meals: [
        { meal: "Breakfast", foods: [], time: "8:00 AM", rationale: "", calories: 0 },
        { meal: "Lunch", foods: [], time: "1:00 PM", rationale: "", calories: 0 },
        { meal: "Snack", foods: [], time: "4:30 PM", rationale: "", calories: 0 },
        { meal: "Dinner", foods: [], time: "7:00 PM", rationale: "", calories: 0 },
      ],
      recommendations: [],
    });
    setDietFlowStep(1);
    setDietFlowSearch("");
    setDietFlowSelectedMealIdx(0);
    setShowDietFlowModal(true);
  };

  const handleDietFlowAddFood = (food: any) => {
    setDietFlowChart((prev: any) => {
      const nextMeals = [...prev.meals];
      nextMeals[dietFlowSelectedMealIdx].foods = [...nextMeals[dietFlowSelectedMealIdx].foods, food.name];
      nextMeals[dietFlowSelectedMealIdx].calories += Number(food.calories || 0);
      return { ...prev, meals: nextMeals };
    });
  };

  const handleDietFlowRemoveFood = (foodIndex: number) => {
    setDietFlowChart((prev: any) => {
      const nextMeals = [...prev.meals];
      const foodName = nextMeals[dietFlowSelectedMealIdx].foods[foodIndex];
      const food = foodCatalog.find((item) => item.name === foodName);
      if (food) nextMeals[dietFlowSelectedMealIdx].calories -= Number(food.calories || 0);
      nextMeals[dietFlowSelectedMealIdx].foods = nextMeals[dietFlowSelectedMealIdx].foods.filter(
        (_item: string, index: number) => index !== foodIndex
      );
      return { ...prev, meals: nextMeals };
    });
  };

  const handleDietFlowRationale = (value: string) => {
    setDietFlowChart((prev: any) => {
      const nextMeals = [...prev.meals];
      nextMeals[dietFlowSelectedMealIdx].rationale = value;
      return { ...prev, meals: nextMeals };
    });
  };

  const handleDietFlowRecommendations = (value: string) => {
    setDietFlowChart((prev: any) => ({
      ...prev,
      recommendations: value
        .split("\n")
        .map((line: string) => line.trim())
        .filter(Boolean),
    }));
  };

  const handleDietFlowPublish = () => {
    const compiledMealLines = dietFlowChart.meals
      .map((meal: any) => `${meal.meal}: ${meal.foods.join(", ") || "No foods selected"}`)
      .join("\n");
    const compiledTimings = dietFlowChart.meals
      .map((meal: any) => `${meal.meal}: ${meal.time}`)
      .join("\n");

    setDietChartItems(compiledMealLines);
    setMealTimings(compiledTimings);
    setShowDietFlowModal(false);
  };

  const openFieldFlowModal = (type: "medications" | "asanas" | "therapy" | "tests" | "notes") => {
    setFieldFlowType(type);
    setFieldFlowStep(1);
    if (type === "medications") {
      setFieldFlowDraft([medicationName, medicationTime, medicationProperties].filter(Boolean).join("\n"));
      const initialSlots = medicationSlots.length > 0
        ? medicationSlots
        : [{
            id: `slot-${Date.now()}`,
            remedyId: null,
            timing: "",
            dosage: "",
            doctorNotes: "",
            importantDetails: "",
          }];
      setMedicationSlotsDraft(initialSlots);
      setActiveMedicationSlotId(initialSlots[0]?.id || null);
    } else if (type === "asanas") {
      setFieldFlowDraft(routinePlan);
      const initialSlots = exerciseSlots.length > 0
        ? exerciseSlots
        : [{
            id: `slot-${Date.now()}`,
            exerciseId: null,
            timing: "",
            duration: "",
            doctorNotes: "",
            importantDetails: "",
          }];
      setExerciseSlotsDraft(initialSlots);
      setActiveExerciseSlotId(initialSlots[0]?.id || null);
    } else if (type === "therapy") {
      setFieldFlowDraft(therapyFlowText);
    } else if (type === "tests") {
      setFieldFlowDraft(testsFlowText);
    } else {
      setFieldFlowDraft(doctorNotes);
    }
    setShowFieldFlowModal(true);
  };

  const saveFieldFlowModal = () => {
    if (!fieldFlowType) return;

    if (fieldFlowType === "medications") {
      const normalizedSlots = [...medicationSlotsDraft]
        .filter((slot) => slot.remedyId && slot.timing)
        .sort((slotA, slotB) => slotA.timing.localeCompare(slotB.timing));

      setMedicationSlots(normalizedSlots);

      const firstSlot = normalizedSlots[0];
      const firstRemedy = medicineCatalog.find((remedy) => remedy.id === firstSlot?.remedyId);
      if (firstSlot && firstRemedy) {
        setMedicationName(firstRemedy.medicineName);
        setMedicationTime(firstSlot.timing);
        setMedicationProperties(
          `${firstSlot.dosage || ""}${firstSlot.doctorNotes ? `; ${firstSlot.doctorNotes}` : ""}`.trim()
        );
      }
    } else if (fieldFlowType === "asanas") {
      const normalizedSlots = [...exerciseSlotsDraft]
        .filter((slot) => slot.exerciseId && slot.timing)
        .sort((slotA, slotB) => slotA.timing.localeCompare(slotB.timing));

      setExerciseSlots(normalizedSlots);
      setRoutinePlan(
        normalizedSlots
          .map((slot) => {
            const selectedExercise = asanaCatalog.find((exercise) => exercise.id === slot.exerciseId);
            return selectedExercise
              ? `${slot.timing} - ${selectedExercise.name} (${slot.duration || "duration not set"})`
              : null;
          })
          .filter(Boolean)
          .join("\n")
      );
    } else if (fieldFlowType === "therapy") {
      setTherapyFlowText(fieldFlowDraft);
    } else if (fieldFlowType === "tests") {
      setTestsFlowText(fieldFlowDraft);
    } else {
      setDoctorNotes(fieldFlowDraft);
    }

    setShowFieldFlowModal(false);
    setFieldFlowType(null);
    setFieldFlowDraft("");
    setFieldFlowStep(1);
    setActiveMedicationSlotId(null);
    setActiveExerciseSlotId(null);
  };

  const fieldFlowLabel =
    fieldFlowType === "medications"
      ? "Current Medications / Remedies"
      : fieldFlowType === "asanas"
      ? "Asanas / Exercises"
      : fieldFlowType === "therapy"
      ? "Therapy"
      : fieldFlowType === "tests"
      ? "Tests"
      : "Doctor Notes";

  const parsedFieldFlowItems = fieldFlowDraft
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const updateMedicationSlot = (slotId: string, key: keyof MedicationSlot, value: string | null) => {
    setMedicationSlotsDraft((previousSlots) =>
      previousSlots.map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              [key]: value,
            }
          : slot
      )
    );
  };

  const createMedicationSlot = () => {
    const newSlot: MedicationSlot = {
      id: `slot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      remedyId: null,
      timing: "",
      dosage: "",
      doctorNotes: "",
      importantDetails: "",
    };
    setMedicationSlotsDraft((previousSlots) => [...previousSlots, newSlot]);
    setActiveMedicationSlotId(newSlot.id);
  };

  const removeMedicationSlot = (slotId: string) => {
    setMedicationSlotsDraft((previousSlots) => previousSlots.filter((slot) => slot.id !== slotId));
    setActiveMedicationSlotId((previousSlotId) => (previousSlotId === slotId ? null : previousSlotId));
  };

  const medicationAiAnalysis = (() => {
    const findings: Array<{ level: "good" | "warning"; text: string }> = [];
    const selectedSlots = medicationSlotsDraft.filter((slot) => slot.remedyId && slot.timing);

    if (selectedSlots.length === 0) {
      findings.push({ level: "warning", text: "No fully configured medication slots yet." });
      return findings;
    }

    const selectedRemedies = selectedSlots
      .map((slot) => medicineCatalog.find((remedy) => remedy.id === slot.remedyId))
      .filter((remedy): remedy is MedicineCatalogItem => Boolean(remedy));

    findings.push({ level: "good", text: `${selectedSlots.length} medication slot(s) configured and ready for timeline sorting.` });

    const allergies = Array.isArray(selectedPatient?.allergies)
      ? selectedPatient.allergies.map((item: string) => item.toLowerCase())
      : [];

    selectedRemedies.forEach((remedy) => {
      const conflictHerb = remedy.herbsUsed.find((herb) =>
        allergies.some((allergy: string) => herb.toLowerCase().includes(allergy))
      );
      if (conflictHerb) {
        findings.push({
          level: "warning",
          text: `${remedy.medicineName} may conflict with reported allergy pattern (${conflictHerb}).`,
        });
      }
    });

    const hasWarming = selectedRemedies.some((remedy) =>
      remedy.ayurvedicProperties.some((property) => property.toLowerCase().includes("warming"))
    );
    const prakritiText = String(selectedPatient?.prakriti || "").toLowerCase();
    if (prakritiText.includes("pitta") && hasWarming) {
      findings.push({
        level: "warning",
        text: "Pitta patient with warming remedies detected; review dosage/timing carefully.",
      });
    }

    const sameTimeCount: Record<string, number> = {};
    selectedSlots.forEach((slot) => {
      sameTimeCount[slot.timing] = (sameTimeCount[slot.timing] || 0) + 1;
    });
    Object.entries(sameTimeCount).forEach(([time, count]) => {
      if (count > 2) {
        findings.push({
          level: "warning",
          text: `${count} remedies scheduled at ${time}; consider staggering to reduce pill burden.`,
        });
      }
    });

    const sleepSensitive =
      String(selectedPatient?.issues || "").toLowerCase().includes("sleep") ||
      String(selectedPatient?.vikriti || "").toLowerCase().includes("sleep");
    if (sleepSensitive) {
      findings.push({
        level: "good",
        text: "Sleep-related condition detected; prefer calming/night-safe timings where possible.",
      });
    }

    return findings;
  })();

  const updateExerciseSlot = (slotId: string, key: keyof ExerciseSlot, value: string | null) => {
    setExerciseSlotsDraft((previousSlots) =>
      previousSlots.map((slot) => (slot.id === slotId ? { ...slot, [key]: value } : slot))
    );
  };

  const createExerciseSlot = () => {
    const newSlot: ExerciseSlot = {
      id: `slot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      exerciseId: null,
      timing: "",
      duration: "",
      doctorNotes: "",
      importantDetails: "",
    };
    setExerciseSlotsDraft((previousSlots) => [...previousSlots, newSlot]);
    setActiveExerciseSlotId(newSlot.id);
  };

  const removeExerciseSlot = (slotId: string) => {
    setExerciseSlotsDraft((previousSlots) => previousSlots.filter((slot) => slot.id !== slotId));
    setActiveExerciseSlotId((previousSlotId) => (previousSlotId === slotId ? null : previousSlotId));
  };

  const exerciseAiAnalysis = (() => {
    const findings: Array<{ level: "good" | "warning"; text: string }> = [];
    const selectedSlots = exerciseSlotsDraft.filter((slot) => slot.exerciseId && slot.timing);

    if (selectedSlots.length === 0) {
      findings.push({ level: "warning", text: "No fully configured exercise slots yet." });
      return findings;
    }

    const selectedExercises = selectedSlots
      .map((slot) => asanaCatalog.find((exercise) => exercise.id === slot.exerciseId))
      .filter((exercise): exercise is AsanaCatalogItem => Boolean(exercise));

    findings.push({ level: "good", text: `${selectedSlots.length} exercise slot(s) configured with timing.` });

    const isLightSleeper =
      String(selectedPatient?.issues || "").toLowerCase().includes("sleep") ||
      String(selectedPatient?.vikriti || "").toLowerCase().includes("sleep");

    const hasLateStimulating = selectedSlots.some((slot) => {
      const exercise = selectedExercises.find((item) => item.id === slot.exerciseId);
      const hour = Number(slot.timing.split(":")[0] || "0");
      const stimulating = exercise?.effectProfile.some((effect) => effect.toLowerCase().includes("metabolism"));
      return hour >= 20 && stimulating;
    });

    if (isLightSleeper && hasLateStimulating) {
      findings.push({ level: "warning", text: "Late stimulating exercise may affect this patient's sleep quality." });
    }

    const hasHeatGenerating = selectedExercises.some((exercise) =>
      exercise.ayurvedicProperties.some((property) => property.toLowerCase().includes("warming") || property.toLowerCase().includes("agni"))
    );
    if (String(selectedPatient?.prakriti || "").toLowerCase().includes("pitta") && hasHeatGenerating) {
      findings.push({ level: "warning", text: "Heat-generating practices selected for Pitta patient; monitor intensity/time." });
    }

    if (selectedExercises.some((exercise) => exercise.name.toLowerCase().includes("shavasana"))) {
      findings.push({ level: "good", text: "Restorative asana included; supports recovery and stress regulation." });
    }

    return findings;
  })();

  const compileRoutinePlanFromSlots = (slots: ExerciseSlot[]) =>
    slots
      .map((slot) => {
        const selectedExercise = asanaCatalog.find(
          (exercise) => exercise.id === slot.exerciseId
        );
        return selectedExercise
          ? `${slot.timing} - ${selectedExercise.name} (${slot.duration || "duration not set"})`
          : null;
      })
      .filter(Boolean)
      .join("\n");

  const filteredDietOptions = foodCatalog.filter((food) =>
    food.name.toLowerCase().includes(dietQuickSearch.toLowerCase())
  );

  const filteredExerciseOptions = asanaCatalog.filter((exercise) =>
    exercise.name.toLowerCase().includes(asanaQuickSearch.toLowerCase())
  );

  const filteredRemedies = medicineCatalog.filter((remedy) =>
    remedy.medicineName.toLowerCase().includes(medicineSearch.toLowerCase())
  );

  const addDietItemQuick = (food: FoodCatalogItem) => {
    const withPortion = dietQuickPortion.trim()
      ? `${food.name} (${dietQuickPortion.trim()})`
      : food.name;

    setDietChartItems((previousItems) =>
      previousItems.trim().length > 0
        ? `${previousItems}\n${withPortion}`
        : withPortion
    );
    setDietQuickPortion("");
  };

  const addExerciseSlotQuick = (exerciseId: string) => {
    const draft = exerciseDraftInputs[exerciseId] || { duration: "", timing: "" };
    const normalizedTiming = draft.timing.trim() || "Not specified";
    const normalizedDuration = draft.duration.trim() || "Not specified";

    const nextSlot: ExerciseSlot = {
      id: `slot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      exerciseId,
      timing: normalizedTiming,
      duration: normalizedDuration,
      doctorNotes: "",
      importantDetails: "",
    };

    setExerciseSlots((previousSlots) => {
      const alreadyExists = previousSlots.some(
        (slot) => slot.exerciseId === nextSlot.exerciseId && slot.timing === nextSlot.timing
      );
      if (alreadyExists) {
        return previousSlots;
      }

      const nextSlots = [...previousSlots, nextSlot];
      setRoutinePlan(compileRoutinePlanFromSlots(nextSlots));
      return nextSlots;
    });

    setExerciseDraftInputs((prev) => ({
      ...prev,
      [exerciseId]: { duration: "", timing: "" },
    }));
  };

  const removeExerciseSlotQuick = (slotId: string) => {
    setExerciseSlots((previousSlots) => {
      const nextSlots = previousSlots.filter((slot) => slot.id !== slotId);
      setRoutinePlan(compileRoutinePlanFromSlots(nextSlots));
      return nextSlots;
    });
  };

  const addMedicationSlotQuick = (remedyId: string) => {
    const selectedRemedy = medicineCatalog.find((item) => item.id === remedyId);
    if (!selectedRemedy) return;

    const nextSlot: MedicationSlot = {
      id: `slot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      remedyId,
      timing: "",
      dosage: "",
      doctorNotes: "",
      importantDetails: "",
    };

    setMedicationSlots((previousSlots) => [...previousSlots, nextSlot]);
    setMedicationName(selectedRemedy.medicineName);
    setMedicineSearch("");
  };

  const updateMedicationSlotQuick = (
    slotId: string,
    key: keyof MedicationSlot,
    value: string
  ) => {
    setMedicationSlots((previousSlots) =>
      previousSlots.map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              [key]: value,
            }
          : slot
      )
    );
  };

  const removeMedicationSlotQuick = (slotId: string) => {
    setMedicationSlots((previousSlots) =>
      previousSlots.filter((slot) => slot.id !== slotId)
    );
  };

  const addFoodSlotQuick = (foodId: string, mealType: "Breakfast" | "Lunch" | "Snack" | "Dinner" | "Other" = "Breakfast") => {
    const selectedFood = foodCatalog.find((item) => item.id === foodId);
    if (!selectedFood) return;

    const nextSlot: FoodSlot = {
      id: `food-slot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      foodId,
      mealType,
      portion: "",
      timing: "",
      doctorNotes: "",
      calories: Number(selectedFood.calories || 0),
    };

    setFoodSlots((previousSlots) => [...previousSlots, nextSlot]);
    setDietQuickSearch("");
    setDietQuickPortion("");
  };

  const updateFoodSlotQuick = (
    slotId: string,
    key: keyof FoodSlot,
    value: string | number
  ) => {
    setFoodSlots((previousSlots) =>
      previousSlots.map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              [key]: value,
            }
          : slot
      )
    );
  };

  const removeFoodSlotQuick = (slotId: string) => {
    setFoodSlots((previousSlots) =>
      previousSlots.filter((slot) => slot.id !== slotId)
    );
  };

  const latestAssessmentPayload: any =
    (latestPrakritiAssessmentData as any)?.data || latestPrakritiAssessmentData || null;

  const resolvedAssessmentAnswers = Array.isArray(latestAssessmentPayload?.answers)
    ? latestAssessmentPayload.answers
    : Array(8).fill("Not specified");

  const resolvedPrakritiScores = {
    vata: Number(latestAssessmentPayload?.vataScore ?? selectedPatient?.vataScore ?? 0),
    pitta: Number(latestAssessmentPayload?.pittaScore ?? selectedPatient?.pittaScore ?? 0),
    kapha: Number(latestAssessmentPayload?.kaphaScore ?? selectedPatient?.kaphaScore ?? 0),
  };

  const resolvedPrimaryDosha =
    String(latestAssessmentPayload?.primaryDosha || selectedPatient?.prakriti || "")
      .toLowerCase()
      .includes("pitta")
      ? "pitta"
      : String(latestAssessmentPayload?.primaryDosha || selectedPatient?.prakriti || "")
          .toLowerCase()
          .includes("kapha")
      ? "kapha"
      : "vata";

  const startPrakritiReview = () => {
    setPrakritiEditMode(true);
    setPrakritiEditState({
      finalDosha: resolvedPrimaryDosha,
      doctorNotes: selectedPatient?.vikriti || "",
      answers: resolvedAssessmentAnswers,
    });
  };

  const cancelPrakritiReview = () => {
    setPrakritiEditMode(false);
  };

  const handleSavePrakritiReview = async () => {
    if (!selectedPatient?.id) return;

    const payloadAnswers = prakritiEditState.answers.length === 8
      ? prakritiEditState.answers
      : Array(8).fill("Not specified");

    const primaryDoshaCapitalized =
      prakritiEditState.finalDosha.length > 0
        ? `${prakritiEditState.finalDosha.charAt(0).toUpperCase()}${prakritiEditState.finalDosha.slice(1)}`
        : "Vata";

    const vataScore = resolvedPrakritiScores.vata || (prakritiEditState.finalDosha === "vata" ? 5 : 2);
    const pittaScore = resolvedPrakritiScores.pitta || (prakritiEditState.finalDosha === "pitta" ? 5 : 2);
    const kaphaScore = resolvedPrakritiScores.kapha || (prakritiEditState.finalDosha === "kapha" ? 5 : 2);

    await savePrakritiAssessmentMutation.mutateAsync({
      patientId: selectedPatient.id,
      payload: {
        answer1: payloadAnswers[0] || "Not specified",
        answer2: payloadAnswers[1] || "Not specified",
        answer3: payloadAnswers[2] || "Not specified",
        answer4: payloadAnswers[3] || "Not specified",
        answer5: payloadAnswers[4] || "Not specified",
        answer6: payloadAnswers[5] || "Not specified",
        answer7: payloadAnswers[6] || "Not specified",
        answer8: payloadAnswers[7] || "Not specified",
        vataScore,
        pittaScore,
        kaphaScore,
        primaryDosha: primaryDoshaCapitalized,
      },
    });

    await updatePatientProfileMutation.mutateAsync({
      id: selectedPatient.id,
      payload: {
        prakriti: primaryDoshaCapitalized,
        vikriti: prakritiEditState.doctorNotes,
        vataScore,
        pittaScore,
        kaphaScore,
      },
    });

    setPatients((prevPatients) =>
      prevPatients.map((patient) =>
        patient.id === selectedPatient.id
          ? {
              ...patient,
              prakriti: primaryDoshaCapitalized,
              vikriti: prakritiEditState.doctorNotes,
              vataScore,
              pittaScore,
              kaphaScore,
            }
          : patient
      )
    );

    setSelectedPatient((previousSelected: any) =>
      previousSelected
        ? {
            ...previousSelected,
            prakriti: primaryDoshaCapitalized,
            vikriti: prakritiEditState.doctorNotes,
            vataScore,
            pittaScore,
            kaphaScore,
          }
        : previousSelected
    );

    setPrakritiEditMode(false);
    refetchLatestPrakriti();
  };

  // Add Patient Modal Handlers
  const openAddModal = () => {
    setAddForm({ name: "", location: "", need: "", phone: "" });
    setAddSuccess(false);
    setShowAddModal(true);
  };
  const closeAddModal = () => {
    setShowAddModal(false);
    setAddSuccess(false);
  };
  const handleAddFormChange = (field: string, value: string) => {
    setAddForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock add: append to patients
    setPatients((prev) => [
      {
        id: Date.now().toString(),
        name: addForm.name,
        location: addForm.location,
        issues: [addForm.need],
        phone: addForm.phone,
        email: "-",
        age: 0,
        gender: "-",
        prakriti: "-",
        lastVisit: "-",
        nextAppointment: "-",
        compliance: 0,
        status: "active",
        priority: "low",
        avatar: null,
        vitalSigns: { bp: "-", pulse: 0, weight: "-", temp: "-" },
        allergies: [],
        medications: [],
        riskScore: 1,
        starred: false,
      },
      ...prev,
    ]);
    setAddSuccess(true);
    setAddForm({ name: "", location: "", need: "", phone: "" });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "needs-attention":
        return "bg-red-100 text-red-800 border-red-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const tabNames = ["Appointments", "Patients", "Analytics"];

  const renderPatientProfile = () => {
    if (!selectedPatient) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Not Found</h2>
          <p className="text-gray-600 mb-6">
            We could not find a patient for the selected doctor profile route.
          </p>
          <button
            onClick={() => {
              window.location.href = "/doctor/dashboard";
            }}
            className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white px-5 py-2 rounded-lg font-semibold"
          >
            Back to Doctor Dashboard
          </button>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-3 sm:p-6 lg:p-7 max-w-[1500px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
          <div className="flex items-start sm:items-center space-x-4 min-w-0">
            <div className="w-20 h-20 bg-gradient-to-br from-[#1F5C3F] to-[#10B981] rounded-full flex items-center justify-center text-white text-2xl font-semibold">
              {selectedPatient.name[0]}
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                {selectedPatient.name}
              </h2>
              <div className="flex flex-wrap gap-3 mt-3">
                <span className="px-3 py-1 bg-emerald-100 text-[#1F5C3F] rounded-full text-sm font-medium">
                  {selectedPatient.prakriti}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                    selectedPatient.priority
                  )}`}
                >
                  {selectedPatient.priority}
                </span>
              </div>
              <p className="text-gray-600 mt-1">
                {selectedPatient.age} years • {selectedPatient.gender}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-3 w-full sm:w-auto sm:justify-end">
            <button className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 w-full sm:w-auto">
              <Video className="w-4 h-4" />
              <span>Video Call</span>
            </button>
            <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 w-full sm:w-auto">
              <MessageCircle className="w-4 h-4" />
              <span>Message</span>
            </button>
            <span className={`px-3 py-2.5 rounded-lg text-xs font-semibold inline-flex items-center justify-center ${
                  profileMode === "consult" ? "bg-[#1F5C3F] text-white" : "bg-gray-100 text-gray-700"
                }`}>
                  {profileMode === "consult" ? "Consultation Mode" : "View Mode"}
                </span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-7 xl:gap-7 items-start">
          <div className="space-y-7 xl:col-span-4 2xl:col-span-3 self-start">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-[#1F5C3F]" />
                Patient Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{selectedPatient.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{selectedPatient.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{selectedPatient.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Last Visit: {selectedPatient.lastVisit}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Next: {selectedPatient.nextAppointment}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-5 border border-red-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold flex items-center">
                    <span className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center mr-2">
                      <Monitor className="w-4 h-4" />
                    </span>
                    Vital Signs
                  </h3>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-200">
                    4 metrics
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-white rounded-lg border border-red-100">
                    <div className="text-lg font-bold text-gray-900">{selectedPatient.vitalSigns.bp || "-"}</div>
                    <div className="text-[11px] text-gray-600">Blood Pressure</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-red-100">
                    <div className="text-lg font-bold text-gray-900">{selectedPatient.vitalSigns.pulse || "-"}</div>
                    <div className="text-[11px] text-gray-600">Pulse</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-red-100">
                    <div className="text-lg font-bold text-gray-900">{selectedPatient.vitalSigns.weight || "-"}</div>
                    <div className="text-[11px] text-gray-600">Weight</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-red-100">
                    <div className="text-lg font-bold text-gray-900">{selectedPatient.vitalSigns.temp || "-"}</div>
                    <div className="text-[11px] text-gray-600">Temp</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-5 border border-amber-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold flex items-center">
                    <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mr-2">
                      <AlertTriangle className="w-4 h-4" />
                    </span>
                    Allergies
                  </h3>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                    {Array.isArray(selectedPatient.allergies) ? selectedPatient.allergies.length : 0} reported
                  </span>
                </div>
                {Array.isArray(selectedPatient.allergies) && selectedPatient.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.allergies.map((allergy: string, index: number) => (
                      <span
                        key={`${allergy}-${index}`}
                        className="px-2.5 py-1 rounded-full text-xs bg-white border border-amber-200 text-amber-800"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-amber-100 rounded-lg px-3 py-2">
                    <p className="text-sm text-amber-800/80">No known allergies</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="xl:col-span-8 2xl:col-span-9 space-y-7">
            <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-5 md:p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Stethoscope className="w-5 h-5 mr-2 text-[#1F5C3F]" />
                Health Issues & Treatment
              </h3>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Primary Health Goals</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.issues.map((issue: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-emerald-100 text-[#1F5C3F] rounded-full text-sm border border-emerald-200"
                    >
                      {issue}
                    </span>
                  ))}
                </div>
              </div>

              {Array.isArray(selectedPatient.medications) && selectedPatient.medications.length > 0 && (
                <>
                  <hr className="my-6" />

                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Current Medications</h4>
                    <div className="space-y-3">
                      {selectedPatient.medications.map((med: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-lg"
                        >
                          <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center">
                            <Pill className="w-5 h-5 text-[#1F5C3F]" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{med}</div>
                            <div className="text-sm text-gray-600">Take as prescribed</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <hr className="my-6" />

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Treatment Compliance</h4>
                  <span className="text-2xl font-bold text-[#1F5C3F]">
                    {selectedPatient.compliance}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-[#1F5C3F] h-4 rounded-full"
                    style={{ width: `${selectedPatient.compliance}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Weekly compliance rate based on logged activities
                </p>
              </div>

              {profileMode === "consult" ? (
                <div className="mt-6 grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4">
                  {/* Diet Flow Interface - Step-based */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-5 md:p-6 xl:col-span-8 w-full">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Utensils className="w-5 h-5 text-emerald-600" />
                        Create Diet Chart
                      </h4>
                      <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                        Step {dietFlowStep} of 4
                      </span>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex flex-wrap items-center gap-2 mb-5 sm:mb-6">
                      {[
                        { step: 1, title: "Food Selection", icon: Utensils },
                        { step: 2, title: "Meal Planning", icon: Clock },
                        { step: 3, title: "Recommendations", icon: BookOpen },
                        { step: 4, title: "Review & Publish", icon: CheckCircle },
                      ].map(({ step, title, icon: Icon }) => (
                        <div key={step} className="flex items-center space-x-1.5">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                            dietFlowStep === step
                              ? "bg-emerald-600 text-white"
                              : dietFlowStep > step
                              ? "bg-green-600 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}>
                            {dietFlowStep > step ? <CheckCircle className="h-4 w-4" /> : step}
                          </div>
                          <span className={`text-xs font-medium whitespace-nowrap ${
                            dietFlowStep === step
                              ? "text-emerald-600"
                              : dietFlowStep > step
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}>
                            {title}
                          </span>
                          {step < 4 && <ChevronRight className="h-3 w-3 text-gray-400 shrink-0" />}
                        </div>
                      ))}
                    </div>

                    {/* Diet Flow Content - Steps */}
                    {dietFlowStep === 1 && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Select Foods for Meals</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-gray-100 p-1.5 rounded-lg">
                          {["Breakfast", "Lunch", "Snack", "Dinner"].map((meal, index) => (
                            <button
                              key={meal}
                              onClick={() => setDietFlowSelectedMealIdx(index)}
                              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                                dietFlowSelectedMealIdx === index 
                                  ? "bg-white shadow-sm text-gray-900" 
                                  : "text-gray-600 hover:text-gray-900"
                              }`}
                            >
                              {meal}
                            </button>
                          ))}
                        </div>
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                          placeholder="Search foods by name, category, or properties..."
                          value={dietFlowSearch}
                          onChange={(event) => setDietFlowSearch(event.target.value)}
                        />
                        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Available Foods</h4>
                            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto space-y-2">
                              {foodCatalog
                                .filter((food) =>
                                  food.name.toLowerCase().includes(dietFlowSearch.toLowerCase()) ||
                                  String(food.category || "").toLowerCase().includes(dietFlowSearch.toLowerCase())
                                )
                                .map((food) => (
                                  <div key={food.id} className="bg-white rounded-lg p-3 border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition">
                                    <div className="flex items-center justify-between mb-2">
                                      <div>
                                        <h5 className="font-medium text-gray-900">{food.name}</h5>
                                        <div className="text-xs text-gray-600">{food.category} • {food.calories} kcal</div>
                                      </div>
                                      <button
                                        onClick={() => handleDietFlowAddFood(food)}
                                        className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded transition"
                                      >
                                        Add
                                      </button>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                      <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700">{food.rasa}</span>
                                      <span className="px-2 py-1 rounded bg-green-100 text-green-700">{food.dosha}</span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Selected for {dietFlowChart.meals[dietFlowSelectedMealIdx]?.meal}</h4>
                            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-emerald-900">Total Calories</span>
                                <span className="text-lg font-bold text-emerald-600">{dietFlowChart.meals[dietFlowSelectedMealIdx]?.calories || 0} kcal</span>
                              </div>
                              {(dietFlowChart.meals[dietFlowSelectedMealIdx]?.foods || []).length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                  <Utensils className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                  <p className="text-sm">No foods selected yet</p>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {(dietFlowChart.meals[dietFlowSelectedMealIdx]?.foods || []).map((food: string, index: number) => (
                                    <div key={`${food}-${index}`} className="flex items-center justify-between bg-white rounded-lg p-3 border border-emerald-200">
                                      <span className="font-medium text-gray-900 text-sm">{food}</span>
                                      <button
                                        onClick={() => handleDietFlowRemoveFood(index)}
                                        className="px-3 py-1 text-xs border border-red-300 text-red-700 hover:bg-red-50 rounded transition"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t">
                          <button
                            onClick={() => setDietFlowStep(2)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition"
                          >
                            Next: Meal Planning <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {dietFlowStep === 2 && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Add Therapeutic Rationale</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-gray-100 p-1.5 rounded-lg mb-4">
                          {["Breakfast", "Lunch", "Snack", "Dinner"].map((meal, index) => (
                            <button
                              key={meal}
                              onClick={() => setDietFlowSelectedMealIdx(index)}
                              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                                dietFlowSelectedMealIdx === index 
                                  ? "bg-white shadow-sm text-gray-900" 
                                  : "text-gray-600"
                              }`}
                            >
                              {meal} ({dietFlowChart.meals[index]?.foods?.length || 0})
                            </button>
                          ))}
                        </div>
                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-2">{dietFlowChart.meals[dietFlowSelectedMealIdx]?.meal} - {dietFlowChart.meals[dietFlowSelectedMealIdx]?.time}</h4>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {(dietFlowChart.meals[dietFlowSelectedMealIdx]?.foods || []).map((food: string, index: number) => (
                              <span key={`${food}-${index}`} className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs">{food}</span>
                            ))}
                          </div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Therapeutic Rationale</label>
                          <Textarea
                            value={dietFlowChart.meals[dietFlowSelectedMealIdx]?.rationale || ""}
                            onChange={(event) => handleDietFlowRationale(event.target.value)}
                            rows={4}
                            className="border-gray-300"
                            placeholder="Explain the therapeutic benefits of this meal combination..."
                          />
                        </div>
                        <div className="flex justify-between gap-3 pt-4 border-t">
                          <button
                            onClick={() => setDietFlowStep(1)}
                            className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm transition"
                          >
                            Back
                          </button>
                          <button
                            onClick={() => setDietFlowStep(3)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition"
                          >
                            Next: Recommendations <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {dietFlowStep === 3 && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">General Lifestyle Recommendations</h3>
                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Dietary and Lifestyle Guidelines</label>
                          <Textarea
                            value={dietFlowChart.recommendations.join("\n")}
                            onChange={(event) => handleDietFlowRecommendations(event.target.value)}
                            rows={8}
                            className="border-gray-300"
                            placeholder="Enter personalized recommendations, one per line"
                          />
                        </div>
                        <div className="flex justify-between gap-3 pt-4 border-t">
                          <button
                            onClick={() => setDietFlowStep(2)}
                            className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm transition"
                          >
                            Back
                          </button>
                          <button
                            onClick={() => setDietFlowStep(4)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition"
                          >
                            Review & Publish <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {dietFlowStep === 4 && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Review Diet Chart</h3>
                        <div className="bg-gray-50 rounded-lg p-6 space-y-6 border border-gray-200">
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-3">Patient Information</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                              <div><span className="text-gray-600">Name:</span> <span className="ml-2 font-medium">{dietFlowChart.patientName}</span></div>
                              <div><span className="text-gray-600">Constitution:</span> <span className="ml-2 px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-medium">{dietFlowChart.prakriti}</span></div>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-3">Daily Meal Plan</h4>
                            <div className="space-y-3">
                              {dietFlowChart.meals.map((meal: any, index: number) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-medium text-gray-900">{meal.meal}</h5>
                                    <div className="text-sm text-gray-600">{meal.time} • {meal.calories} kcal</div>
                                  </div>
                                  <div className="text-sm text-gray-700"><span className="text-gray-600">Foods: </span>{meal.foods.join(", ") || "None selected"}</div>
                                  {meal.rationale && <div className="text-sm text-gray-700 italic bg-gray-50 p-2 rounded mt-2">{meal.rationale}</div>}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-3">Lifestyle Recommendations</h4>
                            {dietFlowChart.recommendations.length > 0 ? (
                              <ul className="space-y-1 text-sm text-gray-700">
                                {dietFlowChart.recommendations.map((rec: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-500">No recommendations added</p>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between gap-3 pt-4 border-t">
                          <button
                            onClick={() => setDietFlowStep(3)}
                            className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm transition"
                          >
                            Back
                          </button>
                          <button
                            onClick={handleDietFlowPublish}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition"
                          >
                            <CheckCircle className="h-4 w-4" /> Publish Diet Chart
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* E-commerce Style Consultation Cards */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-5 md:p-6 xl:col-span-4 w-full">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Quick Add Consultations</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {/* Yoga & Asanas Card */}
                    <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-3 sm:p-4 shadow-sm hover:shadow-md transition">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-lg bg-sky-100">
                          <Activity className="w-5 h-5 text-sky-700" />
                        </div>
                        <h5 className="text-base font-semibold text-sky-900">Yoga & Asanas</h5>
                      </div>
                      <input
                        value={asanaQuickSearch}
                        onChange={(event) => setAsanaQuickSearch(event.target.value)}
                        placeholder="Search asana"
                        className="w-full mb-3 px-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                      />
                      <div className="flex-1 space-y-2 max-h-64 overflow-y-auto">
                        {filteredExerciseOptions.slice(0, 6).map((exercise) => {
                          const draftInput = exerciseDraftInputs[exercise.id] || { duration: "", timing: "" };
                          return (
                            <div key={exercise.id} className="bg-white border border-sky-100 rounded-lg p-3 hover:border-sky-300 transition">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0">
                                  <Activity className="w-3 h-3" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">{exercise.name}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-2 mb-2">
                                <input
                                  value={draftInput.duration}
                                  onChange={(event) =>
                                    setExerciseDraftInputs((prev) => ({
                                      ...prev,
                                      [exercise.id]: {
                                        ...draftInput,
                                        duration: event.target.value,
                                      },
                                    }))
                                  }
                                  placeholder="Duration"
                                  className="px-2 py-1.5 text-xs border border-sky-200 rounded"
                                />
                                <input
                                  value={draftInput.timing}
                                  onChange={(event) =>
                                    setExerciseDraftInputs((prev) => ({
                                      ...prev,
                                      [exercise.id]: {
                                        ...draftInput,
                                        timing: event.target.value,
                                      },
                                    }))
                                  }
                                  placeholder="Timing"
                                  className="px-2 py-1.5 text-xs border border-sky-200 rounded"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => addExerciseSlotQuick(exercise.id)}
                                className="w-full text-xs bg-sky-700 hover:bg-sky-800 text-white py-1.5 rounded transition"
                              >
                                Add Asana
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Foods & Nutrition Card */}
                    <div className="hidden rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-3 sm:p-4 shadow-sm hover:shadow-md transition">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-lg bg-emerald-100">
                          <Utensils className="w-5 h-5 text-emerald-700" />
                        </div>
                        <h5 className="text-base font-semibold text-emerald-900">Foods & Nutrition</h5>
                      </div>
                      <input
                        value={dietQuickSearch}
                        onChange={(event) => setDietQuickSearch(event.target.value)}
                        placeholder="Search food"
                        className="w-full mb-3 px-3 py-2 text-sm border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                      <div className="flex-1 space-y-2 max-h-64 overflow-y-auto">
                        {filteredDietOptions.slice(0, 6).map((food) => (
                          <div key={food.id} className="bg-white border border-emerald-100 rounded-lg p-3 hover:border-emerald-300 transition">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                                <Utensils className="w-3 h-3" />
                              </div>
                              <p className="text-sm font-medium text-gray-900">{food.name}</p>
                            </div>
                            <div className="flex gap-2 mb-2">
                              <input
                                value={dietQuickPortion}
                                onChange={(event) => setDietQuickPortion(event.target.value)}
                                placeholder="Portion"
                                className="flex-1 px-2 py-1.5 text-xs border border-emerald-200 rounded"
                              />
                              <select
                                defaultValue="Breakfast"
                                onChange={(event) => {
                                  const mealType = event.target.value as "Breakfast" | "Lunch" | "Snack" | "Dinner" | "Other";
                                  addFoodSlotQuick(food.id, mealType);
                                }}
                                className="px-2 py-1.5 text-xs border border-emerald-200 rounded"
                              >
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Snack">Snack</option>
                                <option value="Dinner">Dinner</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <p className="text-xs text-emerald-700 mb-2 font-medium">{food.calories} cal</p>
                            <button
                              type="button"
                              onClick={() => addFoodSlotQuick(food.id, "Breakfast")}
                              className="w-full text-xs bg-emerald-700 hover:bg-emerald-800 text-white py-1.5 rounded transition"
                            >
                              Add Food
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Remedies & Medicines Card */}
                    <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-3 sm:p-4 shadow-sm hover:shadow-md transition">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-lg bg-amber-100">
                          <Pill className="w-5 h-5 text-amber-700" />
                        </div>
                        <h5 className="text-base font-semibold text-amber-900">Remedies & Medicines</h5>
                      </div>
                      <input
                        value={medicineSearch}
                        onChange={(event) => setMedicineSearch(event.target.value)}
                        placeholder="Search medicine"
                        className="w-full mb-3 px-3 py-2 text-sm border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                      <div className="flex-1 space-y-2 max-h-64 overflow-y-auto">
                        {filteredRemedies.slice(0, 6).map((remedy) => (
                          <div key={remedy.id} className="bg-white border border-amber-100 rounded-lg p-3 flex items-center justify-between gap-2 hover:border-amber-300 transition">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{remedy.medicineName}</p>
                              <p className="text-xs text-gray-500">{remedy.medicineType}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => addMedicationSlotQuick(remedy.id)}
                              className="shrink-0 whitespace-nowrap text-[11px] bg-amber-700 hover:bg-amber-800 text-white px-2 py-1.5 rounded transition"
                            >
                              Add Rx
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  </div>

                  {/* Selected Items Summary Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xl:col-span-6">
                    <div className="bg-white border border-sky-200 rounded-2xl p-5 min-h-[220px] flex flex-col">
                      <h5 className="text-base font-semibold text-sky-900 mb-3 flex items-center justify-center gap-2">
                        <Activity className="w-4 h-4" />
                        Selected Asanas
                      </h5>
                      {exerciseSlots.length === 0 ? (
                        <p className="text-xs text-gray-500">No asana selected yet.</p>
                      ) : (
                        <div className="space-y-2 flex-1 overflow-y-auto">
                          {exerciseSlots.map((slot) => {
                            const exercise = asanaCatalog.find((item) => item.id === slot.exerciseId);
                            return (
                              <div key={slot.id} className="flex items-center justify-between bg-sky-50 border border-sky-100 rounded-lg px-3 py-2 hover:bg-sky-100 transition">
                                <p className="text-xs font-medium text-sky-900 pr-2 break-words">
                                  {exercise?.name || "Asana"} • {slot.duration || "—"} • {slot.timing || "—"}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => removeExerciseSlotQuick(slot.id)}
                                  className="text-red-600 hover:text-red-700 shrink-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="bg-white border border-emerald-200 rounded-2xl p-5 min-h-[220px] flex flex-col">
                      <h5 className="text-base font-semibold text-emerald-900 mb-3 flex items-center justify-center gap-2">
                        <Utensils className="w-4 h-4" />
                        Selected Foods
                      </h5>
                      {foodSlots.length === 0 ? (
                        <p className="text-xs text-gray-500">No food selected yet.</p>
                      ) : (
                        <div className="space-y-3 flex-1 overflow-y-auto max-h-96 pr-1">
                          {foodSlots.map((slot) => {
                            const food = foodCatalog.find((item) => item.id === slot.foodId);
                            return (
                              <div key={slot.id} className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 space-y-2 hover:bg-emerald-100 transition">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-sm font-medium text-emerald-900">{food?.name || "Food"}</p>
                                  <button
                                    type="button"
                                    onClick={() => removeFoodSlotQuick(slot.id)}
                                    className="text-red-600 hover:text-red-700 shrink-0"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  <select
                                    value={slot.mealType}
                                    onChange={(event) => updateFoodSlotQuick(slot.id, "mealType", event.target.value as any)}
                                    className="px-2.5 py-1.5 border border-emerald-200 rounded-md"
                                  >
                                    <option>Breakfast</option>
                                    <option>Lunch</option>
                                    <option>Snack</option>
                                    <option>Dinner</option>
                                    <option>Other</option>
                                  </select>
                                  <input
                                    value={slot.portion}
                                    onChange={(event) => updateFoodSlotQuick(slot.id, "portion", event.target.value)}
                                    placeholder="Portion"
                                    className="px-2.5 py-1.5 border border-emerald-200 rounded-md"
                                  />
                                  <input
                                    value={slot.timing}
                                    onChange={(event) => updateFoodSlotQuick(slot.id, "timing", event.target.value)}
                                    placeholder="Timing"
                                    className="px-2.5 py-1.5 border border-emerald-200 rounded-md"
                                  />
                                  <input
                                    value={slot.doctorNotes}
                                    onChange={(event) => updateFoodSlotQuick(slot.id, "doctorNotes", event.target.value)}
                                    placeholder="Notes"
                                    className="px-2.5 py-1.5 border border-emerald-200 rounded-md"
                                  />
                                </div>
                                <p className="text-xs text-emerald-700 font-medium">Calories: {slot.calories}</p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="bg-white border border-amber-200 rounded-2xl p-5 min-h-[220px] flex flex-col">
                      <h5 className="text-base font-semibold text-amber-900 mb-3 flex items-center justify-center gap-2">
                        <Pill className="w-4 h-4" />
                        Selected Prescriptions
                      </h5>
                      {medicationSlots.length === 0 ? (
                        <p className="text-xs text-gray-500">No medicine selected yet.</p>
                      ) : (
                        <div className="space-y-3 flex-1 overflow-y-auto max-h-72 pr-1">
                          {medicationSlots.map((slot) => {
                            const remedy = medicineCatalog.find((item) => item.id === slot.remedyId);
                            return (
                              <div key={slot.id} className="bg-amber-50 border border-amber-100 rounded-lg p-3 space-y-2 hover:bg-amber-100 transition">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-sm font-medium text-amber-900">{remedy?.medicineName || "Medicine"}</p>
                                  <button
                                    type="button"
                                    onClick={() => removeMedicationSlotQuick(slot.id)}
                                    className="text-red-600 hover:text-red-700 shrink-0"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  <input
                                    value={slot.dosage}
                                    onChange={(event) => updateMedicationSlotQuick(slot.id, "dosage", event.target.value)}
                                    placeholder="Dosage"
                                    className="px-2.5 py-1.5 border border-amber-200 rounded-md"
                                  />
                                  <input
                                    value={slot.doctorNotes}
                                    onChange={(event) => updateMedicationSlotQuick(slot.id, "doctorNotes", event.target.value)}
                                    placeholder="Frequency"
                                    className="px-2.5 py-1.5 border border-amber-200 rounded-md"
                                  />
                                  <input
                                    value={slot.timing}
                                    onChange={(event) => updateMedicationSlotQuick(slot.id, "timing", event.target.value)}
                                    placeholder="Timing"
                                    className="px-2.5 py-1.5 border border-amber-200 rounded-md"
                                  />
                                  <input
                                    value={slot.importantDetails}
                                    onChange={(event) => updateMedicationSlotQuick(slot.id, "importantDetails", event.target.value)}
                                    placeholder="Details"
                                    className="px-2.5 py-1.5 border border-amber-200 rounded-md"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Treatment Summary and Save */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 xl:col-span-6 space-y-5">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-800 space-y-1">
                    <p className="font-semibold mb-2">Treatment Configuration Summary:</p>
                    <p><span className="font-medium">Diet Chart:</span> {dietFlowChart.meals.some((m: any) => m.foods.length > 0) ? "✓ Configured" : "○ Not configured"}</p>
                    <p><span className="font-medium">Foods:</span> {foodSlots.length > 0 ? `✓ ${foodSlots.length} selected` : "○ Not configured"}</p>
                    <p><span className="font-medium">Asanas:</span> {exerciseSlots.length > 0 ? `✓ ${exerciseSlots.length} selected` : "○ Not configured"}</p>
                    <p><span className="font-medium">Medicines:</span> {medicationSlots.length > 0 ? `✓ ${medicationSlots.length} selected` : "○ Not configured"}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pathya (Do's)</label>
                      <Textarea
                        value={dietStats}
                        onChange={(event) => setDietStats(event.target.value)}
                        placeholder="Write Pathya (beneficial recommendations)..."
                        rows={4}
                        className="border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Apathya (Don'ts)</label>
                      <Textarea
                        value={doctorAnalysis}
                        onChange={(event) => setDoctorAnalysis(event.target.value)}
                        placeholder="Write Apathya restrictions"
                        rows={4}
                        className="border-gray-300"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleSaveTreatmentPlan}
                      className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saveDoctorPlanMutation.isPending ? "Saving..." : "Save & Generate Plan"}</span>
                    </button>
                    {planConfirmed && (
                      <span className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
                        Plan saved successfully
                      </span>
                    )}
                  </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#1F5C3F]" />
                      Prakriti Assessment
                    </h4>
                    {!prakritiEditMode ? (
                      <button
                        onClick={startPrakritiReview}
                        className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" /> Review & Update
                      </button>
                    ) : null}
                  </div>

                  {isLatestPrakritiLoading ? (
                    <Skeleton className="h-40 w-full rounded-xl" />
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {Object.entries(doshaReviewConfig).map(([key, config]) => {
                          const IconComp = config.icon;
                          const value = key === "vata"
                            ? resolvedPrakritiScores.vata
                            : key === "pitta"
                            ? resolvedPrakritiScores.pitta
                            : resolvedPrakritiScores.kapha;
                          const percentage = Math.min(100, Math.max(0, (Number(value) / 8) * 100));

                          return (
                            <div key={key} className={`p-3 rounded-lg border ${config.borderColor} ${config.bgColor}`}>
                              <div className="flex items-center gap-2 mb-2">
                                <IconComp className={`w-4 h-4 ${config.color}`} />
                                <span className={`font-medium text-sm ${config.color}`}>{config.name}</span>
                              </div>
                              <div className="flex justify-between items-center mb-1">
                                <span className={`text-lg font-bold ${config.color}`}>{Number(value) || 0}</span>
                                <span className="text-xs text-slate-500">{percentage.toFixed(0)}%</span>
                              </div>
                              <div className="w-full bg-white/80 rounded-full h-1.5 border border-slate-200">
                                <div className="h-1.5 rounded-full bg-[#1F5C3F]" style={{ width: `${percentage}%` }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium text-slate-900">Assessment Response</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {prakritiQuestions.map((question, index) => (
                            <div
                              key={question.id}
                              className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200"
                            >
                              <span className="font-medium text-slate-600">{question.label}:</span>
                              <span className="text-slate-800 capitalize ml-auto text-right break-words">
                                {resolvedAssessmentAnswers[index] || "Not specified"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {prakritiEditMode ? (
                        <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                          <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                            <Edit className="w-4 h-4 text-[#1F5C3F]" /> Medical Review & Verification
                          </h4>

                          <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">
                              Final Constitutional Type
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {Object.entries(doshaReviewConfig).map(([key, config]) => {
                                const IconComp = config.icon;
                                return (
                                  <label key={key} className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg bg-white cursor-pointer">
                                    <input
                                      type="radio"
                                      name="final-dosha"
                                      value={key}
                                      checked={prakritiEditState.finalDosha === key}
                                      onChange={() =>
                                        setPrakritiEditState((prev) => ({
                                          ...prev,
                                          finalDosha: key as "vata" | "pitta" | "kapha",
                                        }))
                                      }
                                    />
                                    <IconComp className={`w-4 h-4 ${config.color}`} />
                                    <span className="text-sm font-medium text-slate-800">{config.name}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">
                              Clinical Notes & Vikriti Observations
                            </label>
                            <Textarea
                              value={prakritiEditState.doctorNotes}
                              onChange={(event) =>
                                setPrakritiEditState((prev) => ({
                                  ...prev,
                                  doctorNotes: event.target.value,
                                }))
                              }
                              placeholder="Add your clinical observations and Vikriti notes..."
                              rows={4}
                              className="border-slate-300"
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3">
                            <button
                              onClick={handleSavePrakritiReview}
                              disabled={
                                !prakritiEditState.finalDosha ||
                                savePrakritiAssessmentMutation.isPending ||
                                updatePatientProfileMutation.isPending
                              }
                              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                            >
                              <Save className="w-4 h-4" />
                              {savePrakritiAssessmentMutation.isPending || updatePatientProfileMutation.isPending
                                ? "Saving..."
                                : "Verify & Save"}
                            </button>
                            <button
                              onClick={cancelPrakritiReview}
                              className="w-full sm:w-auto border border-slate-300 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                            >
                              <X className="w-4 h-4" /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-slate-600">Final Constitution:</span>
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-[#1F5C3F] border border-emerald-200">
                              {String(selectedPatient.prakriti || resolvedPrimaryDosha).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-slate-600">Vikriti Notes:</span>
                            <p className="text-sm text-slate-800 bg-white p-3 rounded border border-slate-200 mt-1">
                              {selectedPatient.vikriti || "No clinical Vikriti notes recorded yet."}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {showDietFlowModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#1F5C3F] rounded-lg">
                      <Edit className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Create Diet Chart</h2>
                      <p className="text-sm text-slate-600">{dietFlowChart.patientName} • {dietFlowChart.prakriti} Constitution</p>
                    </div>
                  </div>
                  <button onClick={() => setShowDietFlowModal(false)} className="text-slate-500 hover:text-slate-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center space-x-4 mt-4 overflow-x-auto">
                  {[
                    { step: 1, title: "Food Selection", icon: Utensils },
                    { step: 2, title: "Meal Planning", icon: Clock },
                    { step: 3, title: "Recommendations", icon: BookOpen },
                    { step: 4, title: "Review & Publish", icon: CheckCircle },
                  ].map(({ step, title, icon: Icon }) => (
                    <div key={step} className="flex items-center space-x-2">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        dietFlowStep === step
                          ? "bg-[#1F5C3F] text-white"
                          : dietFlowStep > step
                          ? "bg-green-600 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}>
                        {dietFlowStep > step ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </div>
                      <span className={`text-sm font-medium ${
                        dietFlowStep === step
                          ? "text-[#1F5C3F]"
                          : dietFlowStep > step
                          ? "text-green-600"
                          : "text-slate-500"
                      }`}>
                        {title}
                      </span>
                      {step < 4 && <ChevronRight className="h-4 w-4 text-slate-400" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {dietFlowStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-900">Select Foods for Meals</h3>
                    <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
                      {["Breakfast", "Lunch", "Snack", "Dinner"].map((meal, index) => (
                        <button
                          key={meal}
                          onClick={() => setDietFlowSelectedMealIdx(index)}
                          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium ${
                            dietFlowSelectedMealIdx === index ? "bg-white shadow-sm text-slate-900" : "text-slate-600"
                          }`}
                        >
                          {meal}
                        </button>
                      ))}
                    </div>

                    <input
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
                      placeholder="Search foods by name, category, or therapeutic properties..."
                      value={dietFlowSearch}
                      onChange={(event) => setDietFlowSearch(event.target.value)}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-3">Available Foods</h4>
                        <div className="bg-slate-50 rounded-lg p-4 max-h-96 overflow-y-auto space-y-2">
                          {foodCatalog
                            .filter((food) =>
                              food.name.toLowerCase().includes(dietFlowSearch.toLowerCase()) ||
                              String(food.category || "").toLowerCase().includes(dietFlowSearch.toLowerCase()) ||
                              String(food.rasa || "").toLowerCase().includes(dietFlowSearch.toLowerCase()) ||
                              String(food.dosha || "").toLowerCase().includes(dietFlowSearch.toLowerCase())
                            )
                            .map((food) => (
                              <div key={food.id} className="bg-white rounded-lg p-3 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <h5 className="font-medium text-slate-900">{food.name}</h5>
                                    <div className="text-xs text-slate-600">{food.category} • {food.calories} kcal</div>
                                  </div>
                                  <button
                                    onClick={() => handleDietFlowAddFood(food)}
                                    className="px-3 py-1.5 text-xs bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white rounded"
                                  >
                                    Add
                                  </button>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="px-2 py-1 rounded bg-emerald-100 text-[#1F5C3F]">{food.rasa}</span>
                                  <span className="px-2 py-1 rounded bg-green-100 text-green-700">{food.dosha}</span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-slate-900 mb-3">Selected for {dietFlowChart.meals[dietFlowSelectedMealIdx]?.meal}</h4>
                        <div className="bg-emerald-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-[#1F5C3F]">Total Calories</span>
                            <span className="text-lg font-bold text-[#1F5C3F]">{dietFlowChart.meals[dietFlowSelectedMealIdx]?.calories || 0} kcal</span>
                          </div>

                          {(dietFlowChart.meals[dietFlowSelectedMealIdx]?.foods || []).length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                              <Utensils className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p>No foods selected for this meal</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {(dietFlowChart.meals[dietFlowSelectedMealIdx]?.foods || []).map((food: string, index: number) => (
                                <div key={`${food}-${index}`} className="flex items-center justify-between bg-white rounded-lg p-3">
                                  <span className="font-medium text-slate-900">{food}</span>
                                  <button
                                    onClick={() => handleDietFlowRemoveFood(index)}
                                    className="px-3 py-1.5 text-xs border border-red-300 text-red-700 hover:bg-red-50 rounded"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                      <button
                        onClick={() => setDietFlowStep(2)}
                        className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                      >
                        Next: Meal Planning <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                )}

                {dietFlowStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-900">Add Therapeutic Rationale</h3>
                    <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg mb-4">
                      {["Breakfast", "Lunch", "Snack", "Dinner"].map((meal, index) => (
                        <button
                          key={meal}
                          onClick={() => setDietFlowSelectedMealIdx(index)}
                          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium ${
                            dietFlowSelectedMealIdx === index ? "bg-white shadow-sm text-slate-900" : "text-slate-600"
                          }`}
                        >
                          {meal} ({dietFlowChart.meals[index]?.foods?.length || 0})
                        </button>
                      ))}
                    </div>

                    <div className="bg-slate-50 rounded-lg p-6">
                      <h4 className="font-medium text-slate-900 mb-2">{dietFlowChart.meals[dietFlowSelectedMealIdx]?.meal} - {dietFlowChart.meals[dietFlowSelectedMealIdx]?.time}</h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {(dietFlowChart.meals[dietFlowSelectedMealIdx]?.foods || []).map((food: string, index: number) => (
                          <span key={`${food}-${index}`} className="px-2 py-1 rounded bg-emerald-100 text-[#1F5C3F] text-xs">{food}</span>
                        ))}
                      </div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Therapeutic Rationale *</label>
                      <Textarea
                        value={dietFlowChart.meals[dietFlowSelectedMealIdx]?.rationale || ""}
                        onChange={(event) => handleDietFlowRationale(event.target.value)}
                        rows={4}
                        className="border-slate-300"
                        placeholder="Explain the therapeutic benefits of this meal combination..."
                      />
                    </div>

                    <div className="flex justify-between pt-4 border-t">
                      <button
                        onClick={() => setDietFlowStep(1)}
                        className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm"
                      >
                        Back to Food Selection
                      </button>
                      <button
                        onClick={() => setDietFlowStep(3)}
                        className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                      >
                        Next: Recommendations <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                )}

                {dietFlowStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-900">General Lifestyle Recommendations</h3>
                    <div className="bg-slate-50 rounded-lg p-6">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Dietary and Lifestyle Guidelines *</label>
                      <Textarea
                        value={dietFlowChart.recommendations.join("\n")}
                        onChange={(event) => handleDietFlowRecommendations(event.target.value)}
                        rows={8}
                        className="border-slate-300"
                        placeholder="Enter personalized recommendations, one per line"
                      />
                    </div>
                    <div className="flex justify-between pt-4 border-t">
                      <button
                        onClick={() => setDietFlowStep(2)}
                        className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm"
                      >
                        Back to Meal Planning
                      </button>
                      <button
                        onClick={() => setDietFlowStep(4)}
                        className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                      >
                        Review & Publish <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                )}

                {dietFlowStep === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-900">Review Diet Chart</h3>
                    <div className="bg-slate-50 rounded-lg p-6 space-y-6">
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-slate-900 mb-3">Patient Information</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><span className="text-slate-600">Name:</span> <span className="ml-2 font-medium">{dietFlowChart.patientName}</span></div>
                          <div><span className="text-slate-600">Constitution:</span> <span className="ml-2 px-2 py-1 rounded bg-emerald-100 text-[#1F5C3F] text-xs font-medium">{dietFlowChart.prakriti}</span></div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-slate-900 mb-3">Daily Meal Plan</h4>
                        <div className="space-y-4">
                          {dietFlowChart.meals.map((meal: any, index: number) => (
                            <div key={index} className="border border-slate-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-slate-900">{meal.meal}</h5>
                                <div className="text-sm text-slate-600">{meal.time} • {meal.calories} kcal</div>
                              </div>
                              <div className="mb-2 text-sm"><span className="text-slate-600">Foods: </span>{meal.foods.join(", ") || "None selected"}</div>
                              {meal.rationale ? <div className="text-sm text-slate-700 italic bg-slate-50 p-2 rounded">{meal.rationale}</div> : null}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-slate-900 mb-3">Lifestyle Recommendations</h4>
                        {dietFlowChart.recommendations.length > 0 ? (
                          <ul className="space-y-1 text-sm text-slate-700">
                            {dietFlowChart.recommendations.map((recommendation: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                {recommendation}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-slate-500">No recommendations added</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t">
                      <button
                        onClick={() => setDietFlowStep(3)}
                        className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm"
                      >
                        Back to Recommendations
                      </button>
                      <button
                        onClick={handleDietFlowPublish}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" /> Publish Diet Chart
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showFieldFlowModal && fieldFlowType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">{fieldFlowLabel}</h3>
                  <button
                    onClick={() => {
                      setShowFieldFlowModal(false);
                      setFieldFlowType(null);
                      setFieldFlowStep(1);
                    }}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  {((fieldFlowType === "medications" || fieldFlowType === "asanas") ? [1, 2] : [1, 2, 3]).map((step) => (
                    <div key={step} className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                          fieldFlowStep === step
                            ? "bg-[#1F5C3F] text-white"
                            : fieldFlowStep > step
                            ? "bg-green-600 text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {fieldFlowStep > step ? <CheckCircle className="w-3 h-3" /> : step}
                      </div>
                      <span className="text-xs text-slate-600">
                        {(fieldFlowType === "medications" || fieldFlowType === "asanas")
                          ? step === 1
                            ? "Create Slots"
                            : "Summary & AI"
                          : step === 1
                          ? "Input"
                          : step === 2
                          ? "Organize"
                          : "Confirm"}
                      </span>
                      {step < ((fieldFlowType === "medications" || fieldFlowType === "asanas") ? 2 : 3) && <ChevronRight className="w-3 h-3 text-slate-400" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 space-y-4">
                {fieldFlowType === "medications" && (
                  <>
                    {fieldFlowStep === 1 && (
                      <>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-slate-600">
                            Create medication slots, choose remedies from cards, and set exact dosage/timing details.
                          </p>
                          <button
                            onClick={createMedicationSlot}
                            className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white px-3 py-2 rounded-lg text-xs font-semibold"
                          >
                            + Create Slot
                          </button>
                        </div>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                          {medicationSlotsDraft.length === 0 ? (
                            <div className="border border-dashed border-slate-300 rounded-lg p-4 text-sm text-slate-500 text-center">
                              No slots created yet.
                            </div>
                          ) : (
                            medicationSlotsDraft
                              .slice()
                              .sort((slotA, slotB) => (slotA.timing || "99:99").localeCompare(slotB.timing || "99:99"))
                              .map((slot, index) => {
                                const selectedRemedy = medicineCatalog.find((remedy) => remedy.id === slot.remedyId);
                                return (
                                  <div key={slot.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="text-sm font-semibold text-slate-900">Slot {index + 1}</h4>
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => setActiveMedicationSlotId(slot.id)}
                                          className={`px-2 py-1 rounded text-xs ${
                                            activeMedicationSlotId === slot.id
                                              ? "bg-emerald-200 text-[#1F5C3F]"
                                              : "bg-white text-slate-700 border border-slate-300"
                                          }`}
                                        >
                                          Browse Remedies
                                        </button>
                                        <button
                                          onClick={() => removeMedicationSlot(slot.id)}
                                          className="px-2 py-1 rounded text-xs border border-red-300 text-red-700 hover:bg-red-50"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div className="text-xs text-slate-600 bg-white border border-slate-200 rounded p-2">
                                        <div className="font-semibold text-slate-800 mb-1">Selected Remedy</div>
                                        {selectedRemedy ? (
                                          <>
                                            <div className="font-medium">{selectedRemedy.medicineName}</div>
                                            <div>Type: {selectedRemedy.medicineType}</div>
                                            <div>Properties: {selectedRemedy.ayurvedicProperties.join(", ")}</div>
                                          </>
                                        ) : (
                                          <div>No remedy selected.</div>
                                        )}
                                      </div>

                                      <div className="space-y-2">
                                        <input
                                          type="time"
                                          value={slot.timing}
                                          onChange={(event) => updateMedicationSlot(slot.id, "timing", event.target.value)}
                                          className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
                                        />
                                        <input
                                          value={slot.dosage}
                                          onChange={(event) => updateMedicationSlot(slot.id, "dosage", event.target.value)}
                                          placeholder="Dosage (e.g. 1 tsp after meal)"
                                          className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                      <Textarea
                                        value={slot.doctorNotes}
                                        onChange={(event) => updateMedicationSlot(slot.id, "doctorNotes", event.target.value)}
                                        placeholder="Doctor notes for this medicine"
                                        rows={2}
                                        className="border-slate-300"
                                      />
                                      <Textarea
                                        value={slot.importantDetails}
                                        onChange={(event) => updateMedicationSlot(slot.id, "importantDetails", event.target.value)}
                                        placeholder="Additional important details"
                                        rows={2}
                                        className="border-slate-300"
                                      />
                                    </div>
                                  </div>
                                );
                              })
                          )}
                        </div>

                        <div className="border border-slate-200 rounded-lg p-3 bg-white">
                          <div className="text-sm font-semibold text-slate-900 mb-2">Remedy Browser</div>
                          <p className="text-xs text-slate-500 mb-3">
                            Select a slot first, then choose a remedy card to attach it.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto pr-1">
                            {medicineCatalog.map((remedy) => (
                              <button
                                key={remedy.id}
                                disabled={!activeMedicationSlotId}
                                onClick={() => {
                                  if (!activeMedicationSlotId) return;
                                  updateMedicationSlot(activeMedicationSlotId, "remedyId", remedy.id);
                                }}
                                className={`text-left border rounded-lg p-3 transition-colors ${
                                  !activeMedicationSlotId
                                    ? "opacity-60 cursor-not-allowed border-slate-200"
                                    : "border-emerald-200 hover:bg-emerald-50"
                                }`}
                              >
                                <div className="font-semibold text-slate-900 text-sm">{remedy.medicineName}</div>
                                <div className="text-xs text-slate-600 mt-1">Type: {remedy.medicineType}</div>
                                <div className="text-xs text-slate-600 mt-1">Herbs: {remedy.herbsUsed.join(", ")}</div>
                                <div className="text-xs text-slate-600 mt-1">Properties: {remedy.ayurvedicProperties.join(", ")}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between gap-3 pt-2">
                          <button
                            onClick={() => {
                              setShowFieldFlowModal(false);
                              setFieldFlowType(null);
                              setFieldFlowStep(1);
                            }}
                            className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => setFieldFlowStep(2)}
                            disabled={medicationSlotsDraft.filter((slot) => slot.remedyId && slot.timing).length === 0}
                            className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                          >
                            Next: Summary & AI <ChevronRight className="w-4 h-4 ml-1" />
                          </button>
                        </div>
                      </>
                    )}

                    {fieldFlowStep === 2 && (
                      <>
                        <p className="text-sm text-slate-600">
                          Review sorted medicine schedule, dosage summaries, and AI conflict analysis before locking.
                        </p>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                          {medicationSlotsDraft
                            .filter((slot) => slot.remedyId && slot.timing)
                            .slice()
                            .sort((slotA, slotB) => slotA.timing.localeCompare(slotB.timing))
                            .map((slot, index) => {
                              const selectedRemedy = medicineCatalog.find((remedy) => remedy.id === slot.remedyId);
                              if (!selectedRemedy) return null;
                              return (
                                <div key={slot.id} className="border border-emerald-200 bg-emerald-50 rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-semibold text-sm text-[#1F5C3F]">#{index + 1} {selectedRemedy.medicineName}</h4>
                                    <span className="text-xs font-semibold text-slate-700">{slot.timing}</span>
                                  </div>
                                  <div className="text-xs text-slate-700">Dosage: {slot.dosage || "Not specified"}</div>
                                  <div className="text-xs text-slate-700">Type: {selectedRemedy.medicineType}</div>
                                  <div className="text-xs text-slate-700">Herbs: {selectedRemedy.herbsUsed.join(", ")}</div>
                                  <div className="text-xs text-slate-700">Ayurvedic Properties: {selectedRemedy.ayurvedicProperties.join(", ")}</div>
                                  {slot.doctorNotes ? <div className="text-xs text-slate-700">Doctor Notes: {slot.doctorNotes}</div> : null}
                                  {slot.importantDetails ? <div className="text-xs text-slate-700">Important: {slot.importantDetails}</div> : null}
                                </div>
                              );
                            })}
                        </div>

                        <div className="border border-slate-200 rounded-lg p-3 bg-white">
                          <h4 className="text-sm font-semibold text-slate-900 mb-2">AI Analysis</h4>
                          <div className="space-y-2">
                            {medicationAiAnalysis.map((analysis, index) => (
                              <div
                                key={`${analysis.text}-${index}`}
                                className={`text-xs rounded p-2 border ${
                                  analysis.level === "warning"
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : "bg-emerald-50 text-[#1F5C3F] border-emerald-200"
                                }`}
                              >
                                {analysis.text}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between gap-3 pt-2">
                          <button
                            onClick={() => setFieldFlowStep(1)}
                            className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm"
                          >
                            Back to Slot Setup
                          </button>
                          <button
                            onClick={saveFieldFlowModal}
                            className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white px-4 py-2 rounded-lg text-sm font-medium"
                          >
                            Confirm & Lock
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}

                {fieldFlowType === "asanas" && (
                  <>
                    {fieldFlowStep === 1 && (
                      <>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-slate-600">
                            Create asana/yoga/exercise slots, choose routines from cards, and set timing and instructions.
                          </p>
                          <button
                            onClick={createExerciseSlot}
                            className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white px-3 py-2 rounded-lg text-xs font-semibold"
                          >
                            + Create Slot
                          </button>
                        </div>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                          {exerciseSlotsDraft.length === 0 ? (
                            <div className="border border-dashed border-slate-300 rounded-lg p-4 text-sm text-slate-500 text-center">
                              No slots created yet.
                            </div>
                          ) : (
                            exerciseSlotsDraft
                              .slice()
                              .sort((slotA, slotB) => (slotA.timing || "99:99").localeCompare(slotB.timing || "99:99"))
                              .map((slot, index) => {
                                const selectedExercise = asanaCatalog.find((exercise) => exercise.id === slot.exerciseId);
                                return (
                                  <div key={slot.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="text-sm font-semibold text-slate-900">Slot {index + 1}</h4>
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => setActiveExerciseSlotId(slot.id)}
                                          className={`px-2 py-1 rounded text-xs ${
                                            activeExerciseSlotId === slot.id
                                              ? "bg-emerald-200 text-[#1F5C3F]"
                                              : "bg-white text-slate-700 border border-slate-300"
                                          }`}
                                        >
                                          Browse Activities
                                        </button>
                                        <button
                                          onClick={() => removeExerciseSlot(slot.id)}
                                          className="px-2 py-1 rounded text-xs border border-red-300 text-red-700 hover:bg-red-50"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div className="text-xs text-slate-600 bg-white border border-slate-200 rounded p-2">
                                        <div className="font-semibold text-slate-800 mb-1">Selected Activity</div>
                                        {selectedExercise ? (
                                          <>
                                            <div className="font-medium">{selectedExercise.name}</div>
                                            <div>Category: {selectedExercise.category}</div>
                                            <div>Effects: {selectedExercise.effectProfile.join(", ")}</div>
                                          </>
                                        ) : (
                                          <div>No activity selected.</div>
                                        )}
                                      </div>

                                      <div className="space-y-2">
                                        <input
                                          type="time"
                                          value={slot.timing}
                                          onChange={(event) => updateExerciseSlot(slot.id, "timing", event.target.value)}
                                          className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
                                        />
                                        <input
                                          value={slot.duration}
                                          onChange={(event) => updateExerciseSlot(slot.id, "duration", event.target.value)}
                                          placeholder="Duration (e.g. 20 min)"
                                          className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                      <Textarea
                                        value={slot.doctorNotes}
                                        onChange={(event) => updateExerciseSlot(slot.id, "doctorNotes", event.target.value)}
                                        placeholder="Doctor notes for this activity"
                                        rows={2}
                                        className="border-slate-300"
                                      />
                                      <Textarea
                                        value={slot.importantDetails}
                                        onChange={(event) => updateExerciseSlot(slot.id, "importantDetails", event.target.value)}
                                        placeholder="Precautions / important details"
                                        rows={2}
                                        className="border-slate-300"
                                      />
                                    </div>
                                  </div>
                                );
                              })
                          )}
                        </div>

                        <div className="border border-slate-200 rounded-lg p-3 bg-white">
                          <div className="text-sm font-semibold text-slate-900 mb-2">Asana/Yoga/Exercise Browser</div>
                          <p className="text-xs text-slate-500 mb-3">Select a slot first, then choose an activity card.</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto pr-1">
                            {asanaCatalog.map((exercise) => (
                              <button
                                key={exercise.id}
                                disabled={!activeExerciseSlotId}
                                onClick={() => {
                                  if (!activeExerciseSlotId) return;
                                  updateExerciseSlot(activeExerciseSlotId, "exerciseId", exercise.id);
                                }}
                                className={`text-left border rounded-lg p-3 transition-colors ${
                                  !activeExerciseSlotId
                                    ? "opacity-60 cursor-not-allowed border-slate-200"
                                    : "border-emerald-200 hover:bg-emerald-50"
                                }`}
                              >
                                <div className="font-semibold text-slate-900 text-sm">{exercise.name}</div>
                                <div className="text-xs text-slate-600 mt-1">Category: {exercise.category}</div>
                                <div className="text-xs text-slate-600 mt-1">Properties: {exercise.ayurvedicProperties.join(", ")}</div>
                                <div className="text-xs text-slate-600 mt-1">Effect: {exercise.effectProfile.join(", ")}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between gap-3 pt-2">
                          <button
                            onClick={() => {
                              setShowFieldFlowModal(false);
                              setFieldFlowType(null);
                              setFieldFlowStep(1);
                            }}
                            className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => setFieldFlowStep(2)}
                            disabled={exerciseSlotsDraft.filter((slot) => slot.exerciseId && slot.timing).length === 0}
                            className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                          >
                            Next: Summary & AI <ChevronRight className="w-4 h-4 ml-1" />
                          </button>
                        </div>
                      </>
                    )}

                    {fieldFlowStep === 2 && (
                      <>
                        <p className="text-sm text-slate-600">Review the activity schedule and AI consequences before locking.</p>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                          {exerciseSlotsDraft
                            .filter((slot) => slot.exerciseId && slot.timing)
                            .slice()
                            .sort((slotA, slotB) => slotA.timing.localeCompare(slotB.timing))
                            .map((slot, index) => {
                              const selectedExercise = asanaCatalog.find((exercise) => exercise.id === slot.exerciseId);
                              if (!selectedExercise) return null;
                              return (
                                <div key={slot.id} className="border border-emerald-200 bg-emerald-50 rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-semibold text-sm text-[#1F5C3F]">#{index + 1} {selectedExercise.name}</h4>
                                    <span className="text-xs font-semibold text-slate-700">{slot.timing}</span>
                                  </div>
                                  <div className="text-xs text-slate-700">Duration: {slot.duration || "Not specified"}</div>
                                  <div className="text-xs text-slate-700">Category: {selectedExercise.category}</div>
                                  <div className="text-xs text-slate-700">Properties: {selectedExercise.ayurvedicProperties.join(", ")}</div>
                                  {slot.doctorNotes ? <div className="text-xs text-slate-700">Doctor Notes: {slot.doctorNotes}</div> : null}
                                  {slot.importantDetails ? <div className="text-xs text-slate-700">Precautions: {slot.importantDetails}</div> : null}
                                </div>
                              );
                            })}
                        </div>

                        <div className="border border-slate-200 rounded-lg p-3 bg-white">
                          <h4 className="text-sm font-semibold text-slate-900 mb-2">AI Consequences (Pros & Cons)</h4>
                          <div className="space-y-2">
                            {exerciseAiAnalysis.map((analysis, index) => (
                              <div
                                key={`${analysis.text}-${index}`}
                                className={`text-xs rounded p-2 border ${
                                  analysis.level === "warning"
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : "bg-emerald-50 text-[#1F5C3F] border-emerald-200"
                                }`}
                              >
                                {analysis.text}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between gap-3 pt-2">
                          <button
                            onClick={() => setFieldFlowStep(1)}
                            className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm"
                          >
                            Back to Slot Setup
                          </button>
                          <button
                            onClick={saveFieldFlowModal}
                            className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white px-4 py-2 rounded-lg text-sm font-medium"
                          >
                            Confirm & Lock
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}

                {fieldFlowType !== "medications" && fieldFlowType !== "asanas" && (
                  <>
                {fieldFlowStep === 1 && (
                  <>
                    <p className="text-sm text-slate-600">Enter details line-by-line for this treatment section.</p>
                    <Textarea
                      value={fieldFlowDraft}
                      onChange={(event) => setFieldFlowDraft(event.target.value)}
                      rows={10}
                      className="border-slate-300"
                      placeholder="Add details, one item per line"
                    />
                    <div className="flex justify-between gap-3 pt-2">
                      <button
                        onClick={() => {
                          setShowFieldFlowModal(false);
                          setFieldFlowType(null);
                          setFieldFlowStep(1);
                        }}
                        className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setFieldFlowStep(2)}
                        className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                      >
                        Next <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </>
                )}

                {fieldFlowStep === 2 && (
                  <>
                    <p className="text-sm text-slate-600">Review organized items and adjust if needed.</p>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 min-h-[180px]">
                      {parsedFieldFlowItems.length === 0 ? (
                        <p className="text-sm text-slate-500">No items entered yet.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {parsedFieldFlowItems.map((item, index) => (
                            <span
                              key={`${item}-${index}`}
                              className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-[#1F5C3F] border border-emerald-200"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Textarea
                      value={fieldFlowDraft}
                      onChange={(event) => setFieldFlowDraft(event.target.value)}
                      rows={5}
                      className="border-slate-300"
                    />
                    <div className="flex justify-between gap-3 pt-2">
                      <button
                        onClick={() => setFieldFlowStep(1)}
                        className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setFieldFlowStep(3)}
                        className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                      >
                        Review & Confirm <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </>
                )}

                {fieldFlowStep === 3 && (
                  <>
                    <p className="text-sm text-slate-600">Confirm this section and attach it to the consultation treatment plan.</p>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-slate-800 mb-2">{fieldFlowLabel} Summary</h4>
                      {parsedFieldFlowItems.length === 0 ? (
                        <p className="text-sm text-slate-500">No content entered.</p>
                      ) : (
                        <ul className="space-y-1 text-sm text-slate-700 list-disc pl-5">
                          {parsedFieldFlowItems.map((item, index) => (
                            <li key={`${item}-${index}`}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="flex justify-between gap-3 pt-2">
                      <button
                        onClick={() => setFieldFlowStep(2)}
                        className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm"
                      >
                        Back
                      </button>
                      <button
                        onClick={saveFieldFlowModal}
                        className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        Save Flow
                      </button>
                    </div>
                  </>
                )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (selectedPatient) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {renderPatientProfile()}
        </div>
      </div>
    );
  }

  if (isDoctorProfileLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 space-y-4">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  if (isDoctorPatientsLoading && patients.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 space-y-4">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-white border border-gray-200 rounded-xl">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-4">
            <div className="flex items-start sm:items-center space-x-4 min-w-0">
              <div className="w-12 h-12 bg-gradient-to-br from-[#1F5C3F] to-[#10B981] rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                  Hello {doctorDisplayName}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 break-words">
                  Dr. {doctorDisplayName} - {doctorSpecialty}
                </p>
              </div>
            </div>

            <div className="flex items-center self-end sm:self-auto space-x-4">
              <div className="relative">
                <Bell
                  className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-900"
                  onClick={() => setShowNotifications((v) => !v)}
                  aria-label="Show notifications"
                />
                {notificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
                {/* Notification Dropdown */}
                {showNotifications && (
                  <>
                    <button
                      type="button"
                      className="fixed inset-0 z-40 bg-black/10"
                      onClick={() => setShowNotifications(false)}
                      aria-label="Close notifications overlay"
                    />
                    <div className="fixed left-3 right-3 top-24 sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-96 max-w-[24rem] bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-fade-in">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <span className="font-semibold text-gray-800 text-base sm:text-lg flex items-center gap-2">
                          <Bell className="w-5 h-5 text-[#1F5C3F]" />
                          Notifications
                        </span>
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => setShowNotifications(false)}
                          aria-label="Close notifications"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="max-h-[65vh] sm:max-h-80 overflow-y-auto divide-y divide-gray-100">
                        {mockRecentActivities.length === 0 ? (
                          <div className="p-6 text-center text-gray-500">
                            No notifications
                          </div>
                        ) : (
                          mockRecentActivities.map((activity) => {
                            const IconComponent = activity.icon;
                            return (
                              <div
                                key={activity.id}
                                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition"
                              >
                                <div className="flex-shrink-0 w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center">
                                  <IconComponent className="w-5 h-5 text-[#1F5C3F]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900">
                                    {activity.action}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {activity.time}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={openAddModal}
                className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Patient</span>
              </button>
              {/* Add Patient Modal */}
              {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white rounded-xl shadow-xl p-4 sm:p-8 w-full max-w-md mx-4 relative max-h-[85vh] overflow-y-auto">
                    <button
                      onClick={closeAddModal}
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <h2 className="text-2xl font-bold mb-4 text-[#1F5C3F] flex items-center gap-2">
                      <User className="w-6 h-6" /> Add New Patient
                    </h2>
                    {addSuccess ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
                        <p className="text-lg font-semibold text-green-700 mb-2">
                          Details submitted to TrivedaCare!
                        </p>
                        <p className="text-gray-600 mb-4">
                          Patient has been added successfully. Admin will soon
                          send him/her the login credentials.
                        </p>
                        <button
                          onClick={closeAddModal}
                          className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white px-6 py-2 rounded-lg font-semibold mt-2"
                        >
                          Close
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleAddPatient} className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            value={addForm.name}
                            onChange={(e) =>
                              handleAddFormChange("name", e.target.value)
                            }
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#10B981]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            value={addForm.location}
                            onChange={(e) =>
                              handleAddFormChange("location", e.target.value)
                            }
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#10B981]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Need
                          </label>
                          <input
                            type="text"
                            value={addForm.need}
                            onChange={(e) =>
                              handleAddFormChange("need", e.target.value)
                            }
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#10B981]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={addForm.phone}
                            onChange={(e) =>
                              handleAddFormChange("phone", e.target.value)
                            }
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#10B981]"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white px-6 py-2 rounded-lg font-semibold mt-2"
                        >
                          Submit
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Alert Banner */}
      {showAlert && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 mx-4 sm:mx-6 lg:mx-8 mt-4 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-[#10B981]" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-[#1F5C3F]">
                System Update
              </h3>
              <p className="mt-1 text-sm text-[#1F5C3F]">
                New features available: AI-powered treatment recommendations and
                enhanced patient analytics.
              </p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setShowAlert(false)}
                className="text-[#10B981] hover:text-[#1F5C3F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Dashboard */}
      <div className="px-4 sm:px-6 lg:px-8 mt-8 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-gradient-to-br from-[#1F5C3F] to-[#1F5C3F]/90 rounded-xl p-6 text-white transform hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-200 text-sm">Total Patients</p>
                <p className="text-3xl font-bold">{stats.totalPatients}</p>
              </div>
              <User className="w-8 h-8 text-emerald-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#10B981] to-[#0D9488] rounded-xl p-6 text-white transform hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-200 text-sm">Active Charts</p>
                <p className="text-3xl font-bold">{stats.activeCharts}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1F5C3F]/80 to-[#10B981] rounded-xl p-6 text-white transform hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-200 text-sm">This Week</p>
                <p className="text-3xl font-bold">
                  {stats.upcomingAppointments}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-emerald-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-white transform hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-sm">Need Attention</p>
                <p className="text-3xl font-bold">{stats.needsAttention}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white transform hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">Avg. Compliance</p>
                <p className="text-3xl font-bold">{stats.avgCompliance}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white transform hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200 text-sm">High Risk</p>
                <p className="text-3xl font-bold">{stats.highRiskPatients}</p>
              </div>
              <Monitor className="w-8 h-8 text-red-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        {selectedPatient ? (
          renderPatientProfile()
        ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-4 sm:gap-8 px-4 sm:px-6 pt-4 overflow-x-auto whitespace-nowrap">
              {tabNames.map((name, index) => (
                <button
                  key={index}
                  onClick={() => setTab(index)}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    tab === index
                      ? "border-[#1F5C3F] text-[#1F5C3F]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Appointments Tab */}
          {tab === 0 && (
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Upcoming Appointments</h2>
                <button
                  className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 w-full sm:w-auto"
                  onClick={() => {
                    refetchDoctorAppointments();
                  }}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>

              {isDoctorAppointmentsLoading && (
                <div className="mb-4">
                  <Skeleton className="h-24 w-full rounded-xl" />
                </div>
              )}

              {sharedAppointments.filter((appointment) => 
                getAppointmentDateTime(appointment) >= new Date() && 
                appointment.assignedDoctor?.id === doctorId
              ).length === 0 ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-sm text-[#1F5C3F]">
                  No upcoming appointments assigned to you yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {sharedAppointments
                    .filter((appointment) => 
                      getAppointmentDateTime(appointment) >= new Date() && 
                      appointment.assignedDoctor?.id === doctorId
                    )
                    .sort(
                      (a, b) => getAppointmentDateTime(a).getTime() - getAppointmentDateTime(b).getTime()
                    )
                    .map((appointment) => {
                      const isStarted = isAppointmentStarted(appointment);
                      const isOngoing = isAppointmentOngoing(appointment);
                      
                      return (
                        <div 
                          key={appointment.id} 
                          className="bg-gradient-to-br from-emerald-50 via-white to-green-50 border border-emerald-200 rounded-2xl p-5 hover:shadow-xl transition-shadow h-full group"
                        >
                          {/* Header with Name and Status */}
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#1F5C3F] to-[#10B981] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                                {appointment.patientName[0]}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-gray-900 group-hover:text-[#10B981] transition-colors line-clamp-2">
                                  {appointment.patientName}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{appointment.bookingId}</p>
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${
                              isOngoing 
                                ? "bg-green-100 text-green-700 border border-green-200" 
                                : isStarted
                                ? "bg-orange-100 text-orange-700 border border-orange-200"
                                : "bg-blue-100 text-blue-700 border border-blue-200"
                            }`}>
                              {isOngoing ? "Ongoing" : isStarted ? "Started" : "Scheduled"}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-[#1F5C3F] border border-emerald-200">
                              {appointment.patientAge}y • {appointment.patientGender}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                                appointment.severity === "severe"
                                  ? "bg-red-100 text-red-700 border-red-200"
                                  : appointment.severity === "moderate"
                                  ? "bg-amber-100 text-amber-700 border-amber-200"
                                  : "bg-green-100 text-green-700 border-green-200"
                              }`}
                            >
                              {appointment.severity.charAt(0).toUpperCase() + appointment.severity.slice(1)} Priority
                            </span>
                          </div>

                          {/* Details Grid */}
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Calendar className="w-4 h-4 text-[#1F5C3F] shrink-0" />
                              <span className="font-medium">{appointment.selectedDate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Clock className="w-4 h-4 text-[#1F5C3F] shrink-0" />
                              <span className="font-medium">{appointment.selectedTime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Stethoscope className="w-4 h-4 text-[#1F5C3F] shrink-0" />
                              <span className="font-medium">{appointment.assignedDoctor.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <User className="w-4 h-4 text-[#1F5C3F] shrink-0" />
                              <span>{appointment.patientAge} years, {appointment.patientGender}</span>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                              <p className="text-xs font-medium text-[#1F5C3F]">
                                {categoryLabelMap[appointment.doctorCategory] || "General Consultation"}
                              </p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-1">Assessment</p>
                              <p className="text-sm font-medium text-gray-800 line-clamp-2">
                                {appointment.diagnosis || "Consultation follow-up"}
                              </p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-1">Symptoms / Notes</p>
                              <p className="text-sm text-gray-700 line-clamp-2">
                                {appointment.symptoms || appointment.additionalNotes || "No additional notes"}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="pt-4 border-t border-emerald-200 space-y-2">
                            <button
                              type="button"
                              onClick={() => downloadAppointmentPdf(appointment)}
                              className="w-full py-2 px-3 border border-[#1F5C3F]/30 text-[#1F5C3F] rounded-lg text-sm font-medium hover:bg-[#1F5C3F]/5 transition-colors flex items-center justify-center gap-2"
                            >
                              <Download className="w-4 h-4" /> Download PDF
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const resolvedPatientId =
                                  appointment.patientId ||
                                  patients.find((patient) => patient.name === appointment.patientName)?.id;
                                if (resolvedPatientId) {
                                  openPatientProfile(String(resolvedPatientId), "view");
                                }
                              }}
                              className="w-full py-2 px-3 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                            >
                              <Eye className="w-4 h-4" /> View Profile
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const resolvedPatientId =
                                  appointment.patientId ||
                                  patients.find((patient) => patient.name === appointment.patientName)?.id;
                                if (resolvedPatientId) {
                                  openPatientProfile(String(resolvedPatientId), "consult", appointment.id);
                                }
                              }}
                              className="w-full py-2 px-3 bg-gradient-to-r from-[#1F5C3F] to-[#10B981] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            >
                              <Video className="w-4 h-4" /> Start Appointment
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* Patients Tab */}
          {tab === 1 && (
            <div className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-[#1F5C3F]" /> Patients
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6 h-full min-h-[500px] group grid grid-rows-[auto_auto_auto_1fr_auto]"
                  >
                    {/* Patient Avatar & Name */}
                    <div className="flex items-start gap-4 min-w-0">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#1F5C3F] to-[#10B981] rounded-full flex items-center justify-center text-white text-xl font-bold border-4 border-white shadow shrink-0">
                          {patient.name[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-2 min-w-0">
                            <span className="text-lg font-semibold text-gray-900 group-hover:text-[#10B981] transition-colors leading-tight line-clamp-2">
                              {patient.name}
                            </span>
                            {patient.starred && (
                              <Star className="w-4 h-4 text-yellow-400 shrink-0" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-500 block mt-1 whitespace-normal break-words leading-snug">
                            {patient.prakriti} • {patient.age}y • {patient.gender}
                          </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold shadow ${getPriorityColor(
                            patient.priority
                          )}`}
                        >
                          {patient.priority.toUpperCase()}
                        </span>
                        {patient.riskScore >= 4 && (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-600 text-white shadow whitespace-nowrap">
                            HIGH RISK
                          </span>
                        )}
                    </div>

                    {/* Status & Compliance */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          patient.status
                        )}`}
                      >
                        {patient.status.replace("-", " ").toUpperCase()}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                        <TrendingUp className="w-3 h-3" /> {patient.compliance}%
                        Compliance
                      </span>
                    </div>
                    {/* Issues */}
                    <div className="mt-4 flex flex-wrap gap-2 min-h-[96px] max-h-[96px] content-start overflow-hidden">
                      {patient.issues.map((issue: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-emerald-100 text-[#1F5C3F] rounded-full text-xs border border-emerald-200"
                        >
                          {issue}
                        </span>
                      ))}
                    </div>
                    {/* Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-2">
                      <button
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white rounded-lg text-xs font-semibold shadow transition-colors"
                        onClick={() => {
                          openPatientProfile(String(patient.id), "view");
                        }}
                        title="View Profile"
                      >
                        <User className="w-4 h-4" /> Profile
                      </button>
                      <button
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold shadow transition-colors"
                        onClick={() => handleOpenGuidelineModal(patient)}
                        title="Suggest Seasonal Guidelines"
                      >
                        <Shield className="w-4 h-4" /> Guidelines
                      </button>
                      <button
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-[#10B981] hover:bg-[#10B981]/90 text-white rounded-lg text-xs font-semibold shadow transition-colors"
                        title="Call Patient"
                        onClick={() => window.open(`tel:${patient.phone}`)}
                      >
                        <Phone className="w-4 h-4" /> Call
                      </button>
                      <button
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-semibold shadow transition-colors"
                        title="Send Message"
                        onClick={() => window.open(`mailto:${patient.email}`)}
                      >
                        <Mail className="w-4 h-4" /> Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {tab === 2 && (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Compliance Trends */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Compliance Trends
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Monthly patient compliance rates
                  </p>
                  <div className="h-64 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={complianceData}>
                        <defs>
                          <linearGradient
                            id="complianceGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#8b5cf6"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#8b5cf6"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <RechartsTooltip />
                        <Area
                          type="monotone"
                          dataKey="compliance"
                          stroke="#8b5cf6"
                          fillOpacity={1}
                          fill="url(#complianceGradient)"
                          strokeWidth={3}
                        />
                        <Area
                          type="monotone"
                          dataKey="target"
                          stroke="#06d6a0"
                          fillOpacity={0}
                          strokeDasharray="5 5"
                          strokeWidth={2}
                        />
                        <Legend />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Prakriti Distribution */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Prakriti Distribution
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Patient constitution types
                  </p>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prakritiDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {prakritiDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Patient Compliance */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-6">
                    Patient Compliance by Individual
                  </h3>
                  <div className="h-64 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={patients}>
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar
                          dataKey="compliance"
                          name="Compliance %"
                          fill="#8b5cf6"
                          radius={[4, 4, 0, 0]}
                        />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-6">
                    Key Performance Indicators
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          Patient Satisfaction
                        </span>
                        <span className="text-lg font-semibold">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#1F5C3F] h-2 rounded-full"
                          style={{ width: "92%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          Treatment Effectiveness
                        </span>
                        <span className="text-lg font-semibold">87%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: "87%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          Appointment Adherence
                        </span>
                        <span className="text-lg font-semibold">94%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#10B981] h-2 rounded-full"
                          style={{ width: "94%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          Follow-up Rate
                        </span>
                        <span className="text-lg font-semibold">78%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: "78%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
        )}

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-8">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-[#1F5C3F]" />
              Recent Activities
            </h3>

            <div className="space-y-4">
              {mockRecentActivities.slice(0, 5).map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-[#1F5C3F]" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F5C3F] mx-auto mb-4"></div>
            <p className="text-gray-700">Processing...</p>
          </div>
        </div>
      )}

      {/* Seasonal Guideline Modal */}
      {showGuidelineModal && guidelinePatient && (
        <GuidelineModal
          patient={{
            id: guidelinePatient.id,
            name: guidelinePatient.name,
            prakriti: guidelinePatient.prakriti,
            location: guidelinePatient.location,
            vikriti: guidelinePatient.vikriti || undefined,
          }}
          onClose={handleCloseGuidelineModal}
          onSend={handleSendGuideline}
        />
      )}
    </div>
  );
}
