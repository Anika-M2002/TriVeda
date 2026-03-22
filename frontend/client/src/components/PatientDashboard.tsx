import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Heart,
  Activity,
  Bell,
  MessageSquare,
  BarChart3,
  Pill,
  Utensils,
  Target,
  FileText,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Leaf,
  Sun,
  Moon,
  Droplets,
  Wind,
  Edit3,
  Trash2,
  Plus,
  Eye,
  Star,
  Award,
  Sparkles,
  Shield,
  Zap,
  Coffee,
  Sunset,
  Sunrise,
  X,
  Video,
  MapPin,
  Download,
  Share2,
  ChevronRight,
  ChevronLeft,
  CalendarRange,
  ListTodo,
  PieChart,
  TrendingUp as TrendUp,
  Flame,
  Brain,
  Dumbbell,
  Salad,
  Moon as MoonIcon,
  Sun as SunIcon,
  Coffee as CoffeeIcon,
} from "lucide-react";

// Mock Data (unchanged)
const initialPatient = {
  name: "Priya Sharma",
  id: "AYU12345",
  age: 45,
  condition: "Pitta Imbalance",
  constitution: "Vata-Pitta",
  avatar: "PS",
  lastVisit: "2025-09-15",
};

const initialDietChart = {
  date: "2025-09-17",
  meals: {
    breakfast: ["Warm Oat Porridge", "Fresh Berries", "Herbal Tea"],
    lunch: ["Quinoa Bowl", "Steamed Vegetables", "Turmeric Rice"],
    dinner: ["Lentil Soup", "Sautéed Greens", "Chamomile Tea"],
  },
};

const initialAppointments = [
  {
    id: 1,
    doctor: "Dr. Ayesha Kumar",
    specialty: "Ayurvedic Physician",
    time: "10:00 AM",
    date: "2025-09-20",
    type: "Consultation",
    location: "Clinic - Room 101",
    status: "confirmed",
    notes: "Follow-up on treatment progress",
  },
  {
    id: 2,
    doctor: "Dr. Rajesh Patel",
    specialty: "Panchakarma Specialist",
    time: "02:30 PM",
    date: "2025-09-22",
    type: "Therapy",
    location: "Panchakarma Center",
    status: "pending",
    notes: "First therapy session",
  },
  {
    id: 3,
    doctor: "Dr. Meera Singh",
    specialty: "Nutritionist",
    time: "11:15 AM",
    date: "2025-09-23",
    type: "Diet Review",
    location: "Video Call",
    status: "confirmed",
    notes: "Review diet progress",
  },
  {
    id: 4,
    doctor: "Dr. Suresh Iyer",
    specialty: "Yoga Therapist",
    time: "09:00 AM",
    date: "2025-09-24",
    type: "Yoga Session",
    location: "Yoga Studio",
    status: "confirmed",
    notes: "Bring yoga mat",
  },
  {
    id: 5,
    doctor: "Dr. Kavita Rao",
    specialty: "Herbalist",
    time: "03:00 PM",
    date: "2025-09-25",
    type: "Herbal Consultation",
    location: "Herbal Garden",
    status: "pending",
    notes: "Discuss new herbal remedies",
  },
  {
    id: 6,
    doctor: "Dr. Anil Gupta",
    specialty: "General Physician",
    time: "01:30 PM",
    date: "2025-09-26",
    type: "Follow-up",
    location: "Clinic - Room 105",
    status: "confirmed",
    notes: "Monthly checkup",
  },
  {
    id: 7,
    doctor: "Dr. Priya Sharma",
    specialty: "Lifestyle Coach",
    time: "04:45 PM",
    date: "2025-09-27",
    type: "Lifestyle Advice",
    location: "Video Call",
    status: "cancelled",
    notes: "Reschedule requested",
  },
];

const initialHealthRecords = [
  {
    id: 1,
    type: "Blood Pressure",
    value: "120/80 mmHg",
    date: "2025-09-15",
    status: "Normal",
  },
  {
    id: 2,
    type: "Pulse Rate",
    value: "72 bpm",
    date: "2025-09-16",
    status: "Good",
  },
  {
    id: 3,
    type: "Body Temperature",
    value: "98.6°F",
    date: "2025-09-17",
    status: "Normal",
  },
];

const initialMedications = [
  {
    id: 1,
    name: "Triphala Churna",
    dose: "1 tsp",
    time: "Before Sleep",
    type: "Herbal Powder",
  },
  {
    id: 2,
    name: "Ashwagandha Capsules",
    dose: "500mg",
    time: "Morning",
    type: "Capsule",
  },
  { id: 3, name: "Brahmi Oil", dose: "5 drops", time: "Evening", type: "Oil" },
];

const initialGoals = [
  { id: 1, goal: "Balance Dosha", progress: 75, target: "3 months", category: "health", milestones: ["Reduce Pitta symptoms", "Improve digestion", "Better sleep"] },
  { id: 2, goal: "Stress Reduction", progress: 60, target: "2 months", category: "mental", milestones: ["Daily meditation", "Reduce anxiety", "Better mood"] },
  { id: 3, goal: "Weight Management", progress: 85, target: "4 months", category: "fitness", milestones: ["Lose 5 kg", "Build muscle", "Improve metabolism"] },
];

// Modern color palette
const gradients = {
  primary: "from-[#1F5C3F] to-[#10B981]",
  secondary: "from-[#10B981] to-[#0D9488]",
  accent: "from-[#1F5C3F] via-[#10B981] to-[#0D9488]",
  success: "from-green-400 to-emerald-600",
  warning: "from-amber-400 to-amber-600",
  info: "from-[#1F5C3F] to-[#10B981]",
};

export default function AyurvedicPatientDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [patient] = useState(initialPatient);
  const [dietChart] = useState(initialDietChart);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<typeof initialAppointments[number] | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentFilter, setAppointmentFilter] = useState<"all" | "upcoming" | "past" | "cancelled">("upcoming");
  const [appointmentView, setAppointmentView] = useState<"list" | "calendar">("list");
  
  const [rescheduleData, setRescheduleData] = useState<{
    id: number;
    date: string;
    time: string;
    reason: string;
  } | null>(null);
  const [rescheduleStatus, setRescheduleStatus] = useState<
    Record<string, { submitted: boolean; doctor: string; newDate?: string; newTime?: string; status: string }>
  >({});
  
  const [healthRecords] = useState(initialHealthRecords);
  const [medications] = useState(initialMedications);
  const [goals, setGoals] = useState(initialGoals);
  const [selectedGoal, setSelectedGoal] = useState<typeof initialGoals[number] | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalFilter, setGoalFilter] = useState<"all" | "health" | "mental" | "fitness">("all");
  
  const [notifications, setNotifications] = useState(3);

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const dailySchedule = [
    { time: "06:00", label: "Morning Pranayama", icon: Wind, category: "yoga", color: "emerald", instruction: "Anulom Vilom breathing — 15 mins" },
    { time: "07:00", label: "Yoga Session", icon: SunIcon, category: "yoga", color: "teal", instruction: "As prescribed by Dr. Suresh Iyer" },
    { time: "08:00", label: "Breakfast", icon: CoffeeIcon, category: "meal", color: "amber", instruction: "Warm Oat Porridge, Fresh Berries, Herbal Tea" },
    { time: "09:00", label: "Morning Medication", icon: Pill, category: "medicine", color: "blue", instruction: "Ashwagandha Capsules — 500mg" },
    { time: "12:30", label: "Lunch", icon: Salad, category: "meal", color: "lime", instruction: "Quinoa Bowl, Steamed Vegetables, Turmeric Rice" },
    { time: "18:00", label: "Evening Oil", icon: Droplets, category: "medicine", color: "purple", instruction: "Brahmi Oil — 5 drops on scalp" },
    { time: "19:30", label: "Evening Walk", icon: Activity, category: "yoga", color: "green", instruction: "20-min gentle walk in fresh air" },
    { time: "20:00", label: "Dinner", icon: Utensils, category: "meal", color: "orange", instruction: "Lentil Soup, Sautéed Greens, Chamomile Tea" },
    { time: "21:30", label: "Night Medication", icon: Pill, category: "medicine", color: "indigo", instruction: "Triphala Churna — 1 tsp (Before Sleep)" },
    { time: "22:00", label: "Meditation", icon: MoonIcon, category: "yoga", color: "violet", instruction: "Guided meditation before sleep — 10 mins" },
  ];

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const upcomingActivities = dailySchedule.filter(item => {
    const [h, m] = item.time.split(':').map(Number);
    return (h * 60 + m) >= currentMinutes;
  });

  // Appointment Modal Component
  function AppointmentDetailModal({ 
    appointment, 
    open, 
    onClose 
  }: { 
    appointment: typeof initialAppointments[number] | null; 
    open: boolean; 
    onClose: () => void;
  }) {
    if (!open || !appointment) return null;

    const statusColors = {
      confirmed: "emerald",
      pending: "amber",
      cancelled: "rose",
    };

    const statusColor = statusColors[appointment.status as keyof typeof statusColors] || "gray";

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden"
        >
          {/* Header with gradient */}
          <div className={`bg-gradient-to-r from-${statusColor}-500 to-${statusColor}-600 p-6 text-white`}>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{appointment.doctor}</h3>
                <p className="text-white/90">{appointment.specialty}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white`}>
                    {appointment.type}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <Calendar className="w-5 h-5 text-gray-600 mb-2" />
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold text-gray-900">{appointment.date}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <Clock className="w-5 h-5 text-gray-600 mb-2" />
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-semibold text-gray-900">{appointment.time}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <MapPin className="w-5 h-5 text-gray-600 mb-2" />
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-semibold text-gray-900">{appointment.location}</p>
            </div>

            {appointment.notes && (
              <div className="p-4 bg-emerald-50 rounded-xl">
                <MessageSquare className="w-5 h-5 text-[#1F5C3F] mb-2" />
                <p className="text-sm text-gray-600">Notes</p>
                <p className="text-gray-900">{appointment.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              {appointment.status !== "cancelled" && (
                <>
                  <button
                    onClick={() => {
                      setRescheduleData({
                        id: appointment.id,
                        date: appointment.date,
                        time: appointment.time,
                        reason: "",
                      });
                      onClose();
                    }}
                    className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors"
                  >
                    Reschedule
                  </button>
                  {appointment.location.includes("Video") && (
                    <button className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                      <Video className="w-4 h-4" />
                      Join Call
                    </button>
                  )}
                </>
              )}
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Reschedule Modal Component
  function RescheduleModal({
    open,
    onClose,
    onSubmit,
    appointment,
  }: {
    open: boolean;
    onClose: () => void;
    onSubmit: (id: number, date: string, time: string, reason: string) => void;
    appointment?: typeof initialAppointments[number];
  }) {
    const [date, setDate] = useState<string>("");
    const [time, setTime] = useState<string>("");
    const [reason, setReason] = useState<string>("");
    const [step, setStep] = useState<1 | 2>(1);

    useEffect(() => {
      if (open && appointment) {
        setDate("");
        setTime("");
        setReason("");
        setStep(1);
      }
    }, [open, appointment]);

    if (!open || !appointment) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>
              {step === 1 ? '1' : <CheckCircle className="w-4 h-4" />}
            </div>
            <div className={`h-1 w-12 ${step === 2 ? 'bg-emerald-500' : 'bg-gray-200'} rounded`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
                  Select New Date & Time
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Date
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-amber-500"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Time
                    </label>
                    <input
                      type="time"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-amber-500"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                    disabled={!date || !time}
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
                  Reason for Reschedule
                </h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 rounded-xl">
                    <p className="text-sm text-gray-600">New Appointment:</p>
                    <p className="font-medium text-gray-900">{date} at {time}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason
                    </label>
                    <textarea
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-amber-500"
                      rows={4}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Please explain why you need to reschedule..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      onSubmit(appointment.id, date, time, reason);
                      onClose();
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                    disabled={!reason.trim()}
                  >
                    Submit Request
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    );
  }

  // Goal Details Modal Component
  function GoalDetailsModal({
    goal,
    open,
    onClose,
  }: {
    goal: typeof initialGoals[number] | null;
    open: boolean;
    onClose: () => void;
  }) {
    if (!open || !goal) return null;

    const getCategoryIcon = () => {
      switch(goal.category) {
        case "health": return <Heart className="w-6 h-6" />;
        case "mental": return <Brain className="w-6 h-6" />;
        case "fitness": return <Dumbbell className="w-6 h-6" />;
        default: return <Target className="w-6 h-6" />;
      }
    };

    const getCategoryColor = () => {
      switch(goal.category) {
        case "health": return "emerald";
        case "mental": return "purple";
        case "fitness": return "blue";
        default: return "amber";
      }
    };

    const color = getCategoryColor();
    const nextMilestone = goal.milestones.find((_, i) => {
      const progressPerMilestone = 100 / goal.milestones.length;
      const completedMilestones = Math.floor(goal.progress / progressPerMilestone);
      return i === completedMilestones;
    });

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden"
        >
          {/* Header */}
          <div className={`bg-gradient-to-r from-${color}-500 to-${color}-600 p-6 text-white`}>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                {getCategoryIcon()}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{goal.goal}</h3>
                <p className="text-white/90">Target: {goal.target}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Progress Circle */}
            <div className="flex justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    fill="none"
                    stroke={`var(--${color}-500)`}
                    strokeWidth="8"
                    strokeDasharray={339.3}
                    strokeDashoffset={339.3 - (339.3 * goal.progress) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-bold text-${color}-600`}>{goal.progress}%</span>
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-gray-600" />
                Milestones
              </h4>
              {goal.milestones.map((milestone, index) => {
                const progressPerMilestone = 100 / goal.milestones.length;
                const isCompleted = (index + 1) * progressPerMilestone <= goal.progress;
                const isCurrent = !isCompleted && index * progressPerMilestone < goal.progress;
                
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-xl flex items-center gap-3 ${
                      isCompleted ? 'bg-emerald-50' : isCurrent ? 'bg-amber-50' : 'bg-gray-50'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : isCurrent ? (
                      <div className="w-5 h-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={`flex-1 text-sm ${
                      isCompleted ? 'text-gray-900' : isCurrent ? 'text-amber-700' : 'text-gray-500'
                    }`}>
                      {milestone}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Recommendations */}
            <div className={`bg-gradient-to-r from-${color}-50 to-${color}-100 p-4 rounded-xl`}>
              <h4 className={`font-semibold text-${color}-800 mb-2 flex items-center gap-2`}>
                <TrendUp className="w-4 h-4" />
                Next Steps
              </h4>
              <p className="text-sm text-gray-700">
                {nextMilestone 
                  ? `Focus on: ${nextMilestone}`
                  : "Congratulations! You've completed all milestones. Consider setting a new goal."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                className={`flex-1 px-4 py-2 bg-gradient-to-r from-${color}-500 to-${color}-600 text-white rounded-xl hover:shadow-lg transition-all`}
              >
                Update Progress
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const tabs = [
    { id: 0, label: "Overview", icon: BarChart3, color: "emerald" },
    { id: 1, label: "Diet Plan", icon: Utensils, color: "green" },
    { id: 2, label: "Medications", icon: Pill, color: "purple" },
    { id: 3, label: "Appointments", icon: Calendar, color: "blue" },
    { id: 4, label: "Progress", icon: Target, color: "amber" },
    { id: 5, label: "Reports", icon: FileText, color: "indigo" },
    { id: 6, label: "Feedback", icon: MessageSquare, color: "pink" },
  ];

  // Feedback State
  const [feedback, setFeedback] = useState({
    doctor: appointments[0]?.doctor || "",
    rating: 5,
    title: "",
    message: "",
    submitted: false,
  });
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const handleRescheduleSubmit = (appointmentId: number, date: string, time: string, reason: string) => {
    const apt = appointments.find((a) => a.id === appointmentId);
    if (apt) {
      setRescheduleStatus((prev) => ({
        ...prev,
        [String(appointmentId)]: { 
          submitted: true, 
          doctor: apt.doctor,
          newDate: date,
          newTime: time,
          status: "pending"
        },
      }));
      
      // Update appointment status
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: "pending" as const }
            : apt
        )
      );
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    switch(appointmentFilter) {
      case "upcoming":
        return apt.date >= today && apt.status !== "cancelled";
      case "past":
        return apt.date < today;
      case "cancelled":
        return apt.status === "cancelled";
      default:
        return true;
    }
  });

  const filteredGoals = goals.filter(goal => {
    switch(goalFilter) {
      case "health":
        return goal.category === "health";
      case "mental":
        return goal.category === "mental";
      case "fitness":
        return goal.category === "fitness";
      default:
        return true;
    }
  });

  const renderFeedback = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/50">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Share Your Feedback
            </h2>
            <p className="text-gray-600">Help us improve your care experience</p>
          </div>
        </div>

        {feedback.submitted ? (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center py-12"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
              <CheckCircle className="h-16 w-16 text-emerald-500 relative" />
            </div>
            <h3 className="text-xl font-bold text-emerald-800 mt-4">Thank you for your feedback!</h3>
            <p className="text-gray-600 text-center max-w-md mt-2">
              Your feedback helps us improve your care experience and supports your doctor in providing the best holistic treatment.
            </p>
            <button
              className="mt-6 px-6 py-2 bg-gradient-to-r from-emerald-500 to-[#10B981] text-white rounded-xl hover:shadow-lg transition-all"
              onClick={() => setFeedback({ ...feedback, submitted: false, title: "", message: "" })}
            >
              Submit Another Feedback
            </button>
          </motion.div>
        ) : (
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              setFeedbackLoading(true);
              setTimeout(() => {
                setFeedback((f) => ({ ...f, submitted: true }));
                setFeedbackLoading(false);
              }, 1200);
            }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
              <select
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-amber-500 bg-white"
                value={feedback.doctor}
                onChange={(e) => setFeedback((f) => ({ ...f, doctor: e.target.value }))}
                required
              >
                {appointments.map((a) => (
                  <option key={a.id} value={a.doctor}>
                    {a.doctor} ({a.specialty})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    type="button"
                    key={star}
                    whileTap={{ scale: 0.9 }}
                    className={`focus:outline-none transition-colors ${
                      star <= feedback.rating ? "text-amber-400" : "text-gray-300"
                    }`}
                    onClick={() => setFeedback((f) => ({ ...f, rating: star }))}
                  >
                    <Star className="w-8 h-8" fill={star <= feedback.rating ? "#f59e42" : "none"} />
                  </motion.button>
                ))}
                <span className="ml-2 text-sm font-medium text-gray-600">{feedback.rating}/5</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-amber-500"
                placeholder="e.g. Excellent Consultation Experience"
                value={feedback.title}
                onChange={(e) => setFeedback((f) => ({ ...f, title: e.target.value }))}
                required
                maxLength={60}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Feedback</label>
              <textarea
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-amber-500"
                rows={5}
                placeholder="Share your experience, suggestions, or concerns..."
                value={feedback.message}
                onChange={(e) => setFeedback((f) => ({ ...f, message: e.target.value }))}
                required
                maxLength={500}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                disabled={feedbackLoading || !feedback.title.trim() || !feedback.message.trim()}
              >
                {feedbackLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
      <p className="text-center text-gray-400 text-xs mt-4">
        Your feedback is confidential and will be shared only with your doctor and the care team.
      </p>
    </motion.div>
  );

  type StatCardProps = {
    icon: React.ElementType;
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: string;
    color?: string;
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = "emerald" }: StatCardProps) => (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${color}-100 to-${color}-200 flex items-center justify-center`}>
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-500">{trend}</span>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Patient Info Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-emerald-500 to-[#10B981] rounded-2xl p-4 sm:p-6 lg:p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start sm:items-center gap-3 sm:gap-6 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl sm:text-2xl border-2 border-white/30 shrink-0">
              {patient.avatar}
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight break-words">{patient.name}</h2>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-white/90 text-sm sm:text-base">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" /> ID: {patient.id}
                </span>
                <span className="hidden sm:inline">•</span>
                <span>Age: {patient.age}</span>
                <span className="hidden sm:inline">•</span>
                <span>Constitution: {patient.constitution}</span>
              </div>
            </div>
          </div>
          <div className="text-left lg:text-right self-start lg:self-auto">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 inline-block">
              <p className="text-sm font-medium">{patient.condition}</p>
            </div>
            <p className="text-white/80 text-sm mt-2">Last Visit: {patient.lastVisit}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Heart} title="Overall Health" value="Good" subtitle="Stable vitals" trend="+5%" color="emerald" />
        <StatCard icon={Activity} title="Dosha Balance" value="75%" subtitle="Improving" trend="+12%" color="blue" />
        <StatCard icon={Target} title="Goals Progress" value="3/4" subtitle="On track" trend="+8%" color="purple" />
        <StatCard icon={Star} title="Compliance" value="92%" subtitle="Excellent" trend="+3%" color="amber" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              Upcoming Appointments
            </h3>
            <button 
              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
              onClick={() => setActiveTab(3)}
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {appointments.filter(apt => apt.date >= new Date().toISOString().split('T')[0] && apt.status !== "cancelled").slice(0, 2).map((apt, index) => (
              <motion.div
                key={apt.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 cursor-pointer hover:shadow-md transition-all"
                onClick={() => {
                  setSelectedAppointment(apt);
                  setShowAppointmentModal(true);
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-100 flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{apt.doctor}</p>
                  <p className="text-sm text-gray-600">{apt.specialty}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{apt.date}</p>
                  <p className="text-sm text-gray-600">{apt.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Health Records */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              Today's Schedule
            </h3>
            <span className="text-xs text-gray-500 font-medium">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          {upcomingActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
              <CheckCircle className="w-10 h-10 text-emerald-400 mb-2" />
              <p className="font-semibold text-gray-700">All done for today!</p>
              <p className="text-sm text-gray-500">Great job following your schedule.</p>
            </div>
          ) : (
          <div className="space-y-3">
            {upcomingActivities.slice(0, 4).map((item, index) => {
              const Icon = item.icon;
              const isNext = index === 0;
              return (
              <motion.div
                key={item.label}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  isNext
                    ? "bg-gradient-to-r from-emerald-50 to-[#10B981]/10 border-emerald-200 shadow-sm"
                    : "bg-gradient-to-r from-gray-50 to-white border-gray-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isNext ? "bg-gradient-to-br from-emerald-100 to-[#10B981]/20" : "bg-gray-100"
                  }`}>
                    <Icon className={`w-5 h-5 ${isNext ? "text-[#1F5C3F]" : "text-gray-500"}`} />
                  </div>
                  <div>
                    <p className={`font-semibold ${ isNext ? "text-[#1F5C3F]" : "text-gray-900"}`}>{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.instruction}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className={`font-bold text-sm ${ isNext ? "text-[#1F5C3F]" : "text-gray-700"}`}>{item.time}</p>
                  {isNext && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mt-1">
                      Up next
                    </span>
                  )}
                </div>
              </motion.div>
              );
            })}
          </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );

  const renderDietPlan = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-emerald-50/50 via-emerald-50 to-emerald-50 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-[#10B981] bg-clip-text text-transparent flex items-center gap-2">
              <Leaf className="w-6 h-6 text-emerald-600" />
              Personalized Diet Plan
            </h2>
            <p className="text-gray-600 mt-1">
              Customized according to your Vata-Pitta constitution
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
            <Calendar className="w-4 h-4 inline mr-2 text-emerald-600" />
            <span className="text-sm font-medium text-gray-700">{dietChart.date}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(dietChart.meals).map(([mealType, items], index) => {
            const mealIcons = {
              breakfast: Sunrise,
              lunch: Sun,
              dinner: Sunset,
            };
            type MealType = keyof typeof mealIcons;
            const MealIcon = mealIcons[mealType as MealType] || Utensils;

            return (
              <motion.div
                key={mealType}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-r from-emerald-100 to-emerald-100 rounded-lg">
                    <MealIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="capitalize">{mealType}</span>
                </h3>
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-gray-800">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Ayurvedic Guidelines */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 sm:p-6 lg:p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Droplets className="w-5 h-5 text-[#1F5C3F]" />
          Ayurvedic Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[
              { text: "Eat warm, cooked foods", desc: "Supports Vata balance", icon: CoffeeIcon },
              { text: "Avoid spicy foods", desc: "Reduces Pitta aggravation", icon: Flame },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <item.icon className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{item.text}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {[
              { text: "Eat at regular times", desc: "Maintains digestive fire", icon: Clock },
              { text: "Practice mindful eating", desc: "Improves digestion", icon: Brain },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-[#10B981]/5 rounded-xl">
                <item.icon className="w-5 h-5 text-[#10B981] mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{item.text}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderMedications = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-emerald-50 via-[#10B981]/5 to-[#0D9488]/5 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/50">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="p-3 bg-gradient-to-r from-[#1F5C3F] to-[#10B981] rounded-xl shadow-lg">
            <Pill className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#1F5C3F] to-[#10B981] bg-clip-text text-transparent">
              Herbal Medications
            </h2>
            <p className="text-gray-600">Natural remedies prescribed for your constitution</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medications.map((med, index) => (
            <motion.div
              key={med.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-50 to-[#10B981]/10 flex items-center justify-center">
                  <Pill className="w-7 h-7 text-[#1F5C3F]" />
                </div>
                <span className="px-3 py-1 bg-gradient-to-r from-emerald-50 to-[#10B981]/10 text-[#1F5C3F] rounded-full text-xs font-medium">
                  {med.type}
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 text-lg mb-3">{med.name}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Dose:</span>
                  <span className="font-medium text-gray-900">{med.dose}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Time:
                  </span>
                  <span className="font-medium text-gray-900">{med.time}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                  View Details
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderAppointments = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8"
    >
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#1F5C3F] to-[#10B981] bg-clip-text text-transparent">
          Appointments
        </h2>
        
        <div className="flex flex-wrap items-center gap-2 justify-start sm:justify-end">
          {/* View toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setAppointmentView("list")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                appointmentView === "list" 
                  ? "bg-white text-[#1F5C3F] shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ListTodo className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAppointmentView("calendar")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                appointmentView === "calendar" 
                  ? "bg-white text-[#1F5C3F] shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <CalendarRange className="w-4 h-4" />
            </button>
          </div>

          {/* Filter */}
          <select
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:border-[#10B981] focus:ring-[#10B981]/20 w-full sm:w-auto"
            value={appointmentFilter}
            onChange={(e) => setAppointmentFilter(e.target.value as any)}
          >
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="cancelled">Cancelled</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No appointments found</p>
          </div>
        ) : (
          filteredAppointments.map((apt, index) => {
            const statusColors = {
              confirmed: "emerald",
              pending: "amber",
              cancelled: "rose",
            };
            const statusColor = statusColors[apt.status as keyof typeof statusColors] || "gray";
            const isRescheduled = rescheduleStatus[String(apt.id)]?.submitted;

            return (
              <motion.div
                key={apt.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all bg-gradient-to-r from-white to-gray-50 cursor-pointer"
                onClick={() => {
                  setSelectedAppointment(apt);
                  setShowAppointmentModal(true);
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${statusColor}-100 to-${statusColor}-200 flex items-center justify-center`}>
                      <User className={`w-7 h-7 text-${statusColor}-600`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{apt.doctor}</h3>
                      <p className="text-gray-600">{apt.specialty}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
                          {apt.status}
                        </span>
                        <span className="text-xs text-gray-500">{apt.type}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{apt.date}</p>
                      <p className="text-gray-600">{apt.time}</p>
                      <p className="text-xs text-gray-500 mt-1">{apt.location}</p>
                    </div>
                    
                    {isRescheduled ? (
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span className="text-xs text-emerald-600 font-medium">
                            Reschedule Requested
                          </span>
                        </div>
                        {rescheduleStatus[String(apt.id)].newDate && (
                          <p className="text-xs text-gray-500">
                            New: {rescheduleStatus[String(apt.id)].newDate} at {rescheduleStatus[String(apt.id)].newTime}
                          </p>
                        )}
                      </div>
                    ) : apt.status !== "cancelled" && (
                      <button
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRescheduleData({
                            id: apt.id,
                            date: apt.date,
                            time: apt.time,
                            reason: "",
                          });
                        }}
                      >
                        Request Reschedule
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
      
      {/* Modals */}
      <AppointmentDetailModal
        appointment={selectedAppointment}
        open={showAppointmentModal}
        onClose={() => {
          setShowAppointmentModal(false);
          setSelectedAppointment(null);
        }}
      />

      <RescheduleModal
        open={rescheduleData !== null}
        onClose={() => setRescheduleData(null)}
        onSubmit={(id, date, time, reason) => {
          handleRescheduleSubmit(id, date, time, reason);
        }}
        appointment={appointments.find((a) => a.id === rescheduleData?.id)}
      />
    </motion.div>
  );

  const renderProgress = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/50">
        {/* Header with filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Treatment Goals & Progress
              </h2>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex bg-white/80 backdrop-blur-sm rounded-xl p-1">
            <button
              onClick={() => setGoalFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                goalFilter === "all" 
                  ? "bg-amber-500 text-white shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setGoalFilter("health")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                goalFilter === "health" 
                  ? "bg-emerald-500 text-white shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Heart className="w-4 h-4" /> Health
            </button>
            <button
              onClick={() => setGoalFilter("mental")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                goalFilter === "mental" 
                  ? "bg-[#10B981] text-white shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Brain className="w-4 h-4" /> Mental
            </button>
            <button
              onClick={() => setGoalFilter("fitness")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                goalFilter === "fitness" 
                  ? "bg-emerald-500 text-white shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Dumbbell className="w-4 h-4" /> Fitness
            </button>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal, index) => {
            const categoryColors = {
              health: "emerald",
              mental: "purple",
              fitness: "blue",
            };
            const color = categoryColors[goal.category as keyof typeof categoryColors] || "amber";

            return (
              <motion.div
                key={goal.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 cursor-pointer"
                onClick={() => {
                  setSelectedGoal(goal);
                  setShowGoalModal(true);
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${color}-100 to-${color}-200 flex items-center justify-center`}>
                    {goal.category === "health" && <Heart className={`w-6 h-6 text-${color}-600`} />}
                    {goal.category === "mental" && <Brain className={`w-6 h-6 text-${color}-600`} />}
                    {goal.category === "fitness" && <Dumbbell className={`w-6 h-6 text-${color}-600`} />}
                  </div>
                  <span className={`px-3 py-1 bg-${color}-100 text-${color}-800 rounded-full text-xs font-medium`}>
                    {goal.category}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 text-lg mb-2">{goal.goal}</h3>
                <p className="text-sm text-gray-600 mb-4">Target: {goal.target}</p>

                {/* Progress Circle */}
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="6"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      fill="none"
                      stroke={`var(--${color}-500)`}
                      strokeWidth="6"
                      strokeDasharray={201.1}
                      strokeDashoffset={201.1 - (201.1 * goal.progress) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-lg font-bold text-${color}-600`}>{goal.progress}%</span>
                  </div>
                </div>

                {/* Milestone Preview */}
                <div className="space-y-2 mt-4">
                  {goal.milestones.slice(0, 2).map((milestone, idx) => {
                    const progressPerMilestone = 100 / goal.milestones.length;
                    const isCompleted = (idx + 1) * progressPerMilestone <= goal.progress;
                    
                    return (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        {isCompleted ? (
                          <CheckCircle className={`w-3 h-3 text-${color}-500`} />
                        ) : (
                          <div className={`w-3 h-3 rounded-full border-2 border-${color}-200`} />
                        )}
                        <span className="text-gray-600 truncate">{milestone}</span>
                      </div>
                    );
                  })}
                  {goal.milestones.length > 2 && (
                    <p className="text-xs text-gray-400">+{goal.milestones.length - 2} more</p>
                  )}
                </div>

                {/* Status Badge */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {goal.progress >= 75 ? (
                      <>
                        <CheckCircle className={`w-4 h-4 text-${color}-500`} />
                        <span className={`text-xs font-medium text-${color}-600`}>On Track</span>
                      </>
                    ) : goal.progress >= 50 ? (
                      <>
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-medium text-amber-600">In Progress</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                        <span className="text-xs font-medium text-rose-600">Needs Attention</span>
                      </>
                    )}
                  </div>
                  <button className="text-sm text-gray-400 hover:text-gray-600">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Goal Details Modal */}
      <GoalDetailsModal
        goal={selectedGoal}
        open={showGoalModal}
        onClose={() => {
          setShowGoalModal(false);
          setSelectedGoal(null);
        }}
      />
    </motion.div>
  );

  const renderReports = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8"
    >
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="p-3 bg-gradient-to-r from-[#1F5C3F] to-[#10B981] rounded-xl shadow-lg">
          <FileText className="h-8 w-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#1F5C3F] to-[#10B981] bg-clip-text text-transparent">
            Health Reports
          </h2>
          <p className="text-gray-600">Summary of your health metrics and progress</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
        {/* Vitals Card */}
        <motion.div
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-lg border border-white/50"
        >
          <div className="flex flex-col items-center">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mb-3">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Vitals</h3>
            <div className="space-y-2 text-center">
              <p className="text-gray-700">BP: 120/80 mmHg</p>
              <p className="text-gray-700">Pulse: 72 bpm</p>
              <p className="text-gray-700">Temp: 98.6°F</p>
            </div>
          </div>
        </motion.div>

        {/* Dosha Balance Card */}
        <motion.div
          className="bg-gradient-to-br from-emerald-50 to-[#10B981]/5 rounded-xl p-6 shadow-lg border border-white/50"
        >
          <div className="flex flex-col items-center">
            <div className="p-3 bg-gradient-to-r from-[#1F5C3F] to-[#10B981] rounded-xl mb-3">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Dosha Balance</h3>
            <div className="relative w-24 h-24 mb-2">
              <svg width="96" height="96" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="42" fill="#e0f2fe" />
                <path
                  d="M48 8 A40 40 0 1 1 47.9 8"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset="62.8"
                  strokeLinecap="round"
                />
                <text x="48" y="56" textAnchor="middle" fontSize="1.2em" fill="#3b82f6" fontWeight="bold">
                  75%
                </text>
              </svg>
            </div>
            <p className="text-sm text-gray-700">Vata-Pitta (Stable)</p>
          </div>
        </motion.div>

        {/* Compliance Card */}
        <motion.div
          className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 shadow-lg border border-white/50"
        >
          <div className="flex flex-col items-center">
            <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl mb-3">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Compliance</h3>
            <div className="w-full flex flex-col items-center">
              <div className="w-full h-3 bg-gray-200 rounded-full mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "92%" }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
                />
              </div>
              <span className="text-sm text-gray-700">92% this month</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recommendations & Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-gradient-to-br from-emerald-50 to-emerald-50 rounded-xl p-6 shadow-lg border border-white/50"
        >
          <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            Recommendations
          </h3>
          <ul className="space-y-2">
            {[
              "Continue your current diet and exercise plan.",
              "Practice daily meditation for stress reduction.",
              "Monitor your vitals weekly.",
              "Schedule a follow-up with your doctor next month.",
            ].map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></span>
                {rec}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-gradient-to-br from-emerald-50 to-[#10B981]/5 rounded-xl p-6 shadow-lg border border-white/50"
        >
          <h3 className="text-lg font-bold text-[#1F5C3F] mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#10B981]" />
            Recent Activity
          </h3>
          <ul className="space-y-3">
            {[
              { text: "All meals on plan", date: "2025-09-16", status: "success" },
              { text: "Completed yoga session", date: "2025-09-15", status: "success" },
              { text: "Missed evening walk", date: "2025-09-14", status: "warning" },
              { text: "Vitals normal", date: "2025-09-13", status: "success" },
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                {item.status === "success" ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                )}
                <span className="flex-1 text-gray-700">{item.text}</span>
                <span className="text-gray-400 text-xs">{item.date}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <motion.div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-[#10B981] to-[#10B981] bg-clip-text text-transparent mb-2 leading-tight break-words">
                {patient.name}'s Journey
              </h1>
              <p className="text-gray-600 text-base sm:text-lg">Holistic health management for mind, body, and spirit</p>
            </div>

            {/* Notification Bell */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setNotifications(0)}
              className="relative w-11 h-11 rounded-full bg-white border border-emerald-100 shadow-sm hover:bg-emerald-50 transition-colors flex items-center justify-center self-end sm:self-auto shrink-0"
              aria-label="Open notifications"
            >
              <Bell className="w-5 h-5 text-[#1F5C3F]" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold leading-none">
                  {notifications}
                </span>
              )}
            </motion.button>
          </div>
        </motion.div>

        {renderOverview()}
      </div>
    </div>
  );
}