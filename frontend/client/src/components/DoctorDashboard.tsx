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
import {
  AppointmentBooking,
  categoryLabelMap,
  downloadAppointmentPdf,
  getStoredAppointments,
} from "@/lib/appointment-booking";

const mockPatients = [
  {
    id: "1",
    name: "Priya Sharma",
    age: 34,
    gender: "Female",
    prakriti: "Pitta",
    lastVisit: "2024-01-15",
    nextAppointment: "2024-01-22",
    compliance: 85,
    status: "active",
    priority: "medium",
    avatar: null,
    phone: "+91 98765 43210",
    email: "priya.sharma@email.com",
    location: "Mumbai, Maharashtra",
    issues: ["Weight Management", "Digestion", "Hypertension"],
    vitalSigns: { bp: "120/80", pulse: 72, weight: "65kg", temp: "98.6°F" },
    medications: ["Triphala", "Ashwagandha", "Custom Herbal Mix"],
    riskScore: 3,
    starred: true,
  },
  {
    id: "2",
    name: "Rohit Kumar",
    age: 42,
    gender: "Male",
    prakriti: "Vata-Kapha",
    lastVisit: "2024-01-10",
    nextAppointment: "2024-01-25",
    compliance: 92,
    status: "active",
    priority: "low",
    avatar: null,
    phone: "+91 87654 32109",
    email: "rohit.kumar@email.com",
    location: "Delhi, Delhi",
    issues: ["Stress Management", "Sleep Quality", "Joint Pain"],
    vitalSigns: { bp: "118/76", pulse: 68, weight: "78kg", temp: "98.2°F" },
    medications: ["Brahmi", "Jatamansi", "Guggulu"],
    riskScore: 2,
    starred: false,
  },
  {
    id: "3",
    name: "Anjali Reddy",
    age: 28,
    gender: "Female",
    prakriti: "Kapha",
    lastVisit: "2024-01-08",
    nextAppointment: "2024-01-20",
    compliance: 67,
    status: "needs-attention",
    priority: "high",
    avatar: null,
    phone: "+91 76543 21098",
    email: "anjali.reddy@email.com",
    location: "Hyderabad, Telangana",
    issues: ["PCOD", "Weight Loss", "Irregular Periods"],
    vitalSigns: { bp: "125/82", pulse: 78, weight: "72kg", temp: "98.4°F" },
    medications: ["Shatavari", "Lodhra", "Kanchanar Guggulu"],
    riskScore: 4,
    starred: true,
  },
  {
    id: "4",
    name: "Dr. Vikram Patel",
    age: 38,
    gender: "Male",
    prakriti: "Pitta-Vata",
    lastVisit: "2024-01-12",
    nextAppointment: "2024-01-28",
    compliance: 78,
    status: "active",
    priority: "medium",
    avatar: null,
    phone: "+91 65432 10987",
    email: "vikram.patel@email.com",
    location: "Pune, Maharashtra",
    issues: ["Hypertension", "Stress", "Insomnia"],
    vitalSigns: { bp: "135/88", pulse: 82, weight: "85kg", temp: "98.8°F" },
    medications: ["Arjuna", "Brahmi", "Saraswatarishta"],
    riskScore: 3,
    starred: false,
  },
];

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

interface DoctorDashboardProps {
  onNavigate?: (view: string) => void;
  patientId?: string;
}

export default function DoctorDashboard({
  onNavigate,
  patientId,
}: DoctorDashboardProps) {
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
  const [patients, setPatients] = useState([...mockPatients]);
  const [selectedPatient, setSelectedPatient] = useState<
    (typeof mockPatients)[0] | null
  >(null);
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
    if (!patientId) {
      setSelectedPatient(null);
      return;
    }
    const patientFromRoute = patients.find((patient) => patient.id === patientId) || null;
    setSelectedPatient(patientFromRoute);
  }, [patientId, patients]);

  useEffect(() => {
    setSharedAppointments(getStoredAppointments());

    const syncSharedAppointments = () => setSharedAppointments(getStoredAppointments());
    window.addEventListener("storage", syncSharedAppointments);

    return () => {
      window.removeEventListener("storage", syncSharedAppointments);
    };
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

  const filteredPatients = patients
    .filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.prakriti.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.issues.some((issue) =>
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
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log("Creating diet chart for patient:", patientId);
      if (onNavigate) onNavigate("diet-chart-creation");
    }, 1000);
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-[#1F5C3F] to-[#10B981] rounded-full flex items-center justify-center text-white text-2xl font-semibold">
              {selectedPatient.name[0]}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {selectedPatient.name}
              </h2>
              <div className="flex space-x-2 mt-2">
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

          <div className="flex space-x-3">
            <button className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Video className="w-4 h-4" />
              <span>Video Call</span>
            </button>
            <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Message</span>
            </button>
            <button
              onClick={() => {
                window.location.href = "/doctor/dashboard";
              }}
              className="text-gray-400 hover:text-gray-600 p-2"
              aria-label="Back to dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-[#1F5C3F]" />
                Patient Information
              </h3>
              <div className="space-y-3">
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

            <div className="bg-red-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Monitor className="w-5 h-5 mr-2 text-red-600" />
                Vital Signs
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-xl font-bold text-gray-900">
                    {selectedPatient.vitalSigns.bp}
                  </div>
                  <div className="text-xs text-gray-600">Blood Pressure</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-xl font-bold text-gray-900">
                    {selectedPatient.vitalSigns.pulse}
                  </div>
                  <div className="text-xs text-gray-600">Pulse (bpm)</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-xl font-bold text-gray-900">
                    {selectedPatient.vitalSigns.weight}
                  </div>
                  <div className="text-xs text-gray-600">Weight</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-xl font-bold text-gray-900">
                    {selectedPatient.vitalSigns.temp}
                  </div>
                  <div className="text-xs text-gray-600">Temperature</div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-yellow-600" />
                Risk Assessment
              </h3>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Risk Score</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedPatient.riskScore >= 4
                      ? "bg-red-100 text-red-800"
                      : selectedPatient.riskScore >= 3
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {selectedPatient.riskScore}/5
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    selectedPatient.riskScore >= 4
                      ? "bg-red-500"
                      : selectedPatient.riskScore >= 3
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${(selectedPatient.riskScore / 5) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Based on current health conditions and compliance history
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Stethoscope className="w-5 h-5 mr-2 text-[#1F5C3F]" />
                Health Issues & Treatment
              </h3>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Primary Health Issues</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.issues.map((issue, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-emerald-100 text-[#1F5C3F] rounded-full text-sm border border-emerald-200"
                    >
                      {issue}
                    </span>
                  ))}
                </div>
              </div>

              <hr className="my-6" />

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Current Medications</h4>
                <div className="space-y-3">
                  {selectedPatient.medications.map((med, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg"
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

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleCreateDietChart(selectedPatient.id)}
                  className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Create Diet Chart</span>
                </button>
                <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Edit className="w-4 h-4" />
                  <span>Update Treatment</span>
                </button>
                <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>View Reports</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (selectedPatient) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {renderPatientProfile()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-white border border-gray-200 rounded-xl">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#1F5C3F] to-[#10B981] rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Hello Lifeline
                </h1>
                <p className="text-sm text-gray-600">
                  Dr. Anjali Verma - Senior Ayurvedic Doctor
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
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
                  <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-fade-in">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <span className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                        <Bell className="w-5 h-5 text-[#1F5C3F]" />{" "}
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
                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
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
                  <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
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
            <div className="flex space-x-8 px-6 pt-4">
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
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Upcoming Appointments</h2>
                <button
                  className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  onClick={() => setSharedAppointments(getStoredAppointments())}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>

              {sharedAppointments.filter((appointment) => getAppointmentDateTime(appointment) >= new Date()).length === 0 ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-sm text-[#1F5C3F]">
                  No upcoming patient-booked appointments found yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {sharedAppointments
                    .filter((appointment) => getAppointmentDateTime(appointment) >= new Date())
                    .sort(
                      (a, b) => getAppointmentDateTime(a).getTime() - getAppointmentDateTime(b).getTime()
                    )
                    .map((appointment) => (
                      <div key={appointment.id} className="bg-white border border-gray-200 rounded-xl p-5">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-gray-900">{appointment.patientName}</p>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">Approved</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">{appointment.bookingId}</p>

                        <div className="space-y-2 text-sm text-gray-700">
                          <p><Calendar className="w-4 h-4 inline mr-1 text-[#1F5C3F]" /> {appointment.selectedDate}</p>
                          <p><Clock className="w-4 h-4 inline mr-1 text-[#1F5C3F]" /> {appointment.selectedTime}</p>
                          <p><Stethoscope className="w-4 h-4 inline mr-1 text-[#1F5C3F]" /> {appointment.assignedDoctor.name}</p>
                          <p><User className="w-4 h-4 inline mr-1 text-[#1F5C3F]" /> {appointment.patientAge}y, {appointment.patientGender}</p>
                          <p><span className="font-medium">Category:</span> {categoryLabelMap[appointment.doctorCategory]}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => downloadAppointmentPdf(appointment)}
                          className="mt-4 w-full py-2 border border-[#1F5C3F]/30 text-[#1F5C3F] rounded-lg text-sm font-medium hover:bg-[#1F5C3F]/5"
                        >
                          <Download className="w-4 h-4 inline mr-1" /> Download PDF
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Patients Tab */}
          {tab === 1 && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
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
                      {patient.issues.map((issue, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-emerald-100 text-[#1F5C3F] rounded-full text-xs border border-emerald-200"
                        >
                          {issue}
                        </span>
                      ))}
                    </div>
                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-2">
                      <button
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white rounded-lg text-xs font-semibold shadow transition-colors"
                        onClick={() => {
                          window.location.href = `/doctor/${patient.id}`;
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
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Compliance Trends */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Compliance Trends
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Monthly patient compliance rates
                  </p>
                  <div className="h-80">
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
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={mockPatients}>
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
