import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Building2,
  Users,
  Stethoscope,
  User,
  Plus,
  Search,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  UserCog,
  Activity,
  Heart,
  Shield,
  Calendar,
  FileText,
  Bell,
  Home,
  LogOut,
  Clock,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Sparkles,
  Menu,
  X,
  Download,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Award,
  Target,
  Zap,
  Globe,
  Lock,
  Unlock,
  RefreshCw,
  PieChart,
  LineChart,
  Users2,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  CircleDollarSign,
  Ambulance,
  Pill,
  Thermometer,
  Droplet,
  Brain,
  Bone,
  Leaf,
  Flower2,
  Wind,
  Flame,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

// Mock data with enhanced details
const mockClinicStats = {
  totalDoctors: 12,
  totalPatients: 348,
  activeCharts: 256,
  complianceRate: 82,
  monthlyGrowth: 15,
  revenue: 1245000,
  patientSatisfaction: 94,
  emergencyCases: 23,
  appointmentsToday: 45,
};

const mockDoctors = [
  {
    id: 1,
    name: "Dr. Anjali Verma",
    specialization: "Ayurvedic Medicine",
    patients: 45,
    experience: "8 years",
    rating: 4.8,
    status: "active",
    joinDate: "2023-01-15",
    phone: "+91 98765 43210",
    email: "anjali.verma@trivedacare.com",
    location: "Clinic A",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    achievements: ["Top Performer 2024", "Patient Choice Award"],
    consultations: 1250,
    revenue: 450000,
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    specialization: "Panchakarma",
    patients: 38,
    experience: "12 years",
    rating: 4.9,
    status: "active",
    joinDate: "2022-08-20",
    phone: "+91 98765 43211",
    email: "rajesh.kumar@trivedacare.com",
    location: "Clinic B",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    achievements: ["Panchakarma Expert", "15 Years Excellence"],
    consultations: 2100,
    revenue: 680000,
  },
  {
    id: 3,
    name: "Dr. Priya Singh",
    specialization: "Women's Health",
    patients: 52,
    experience: "6 years",
    rating: 4.7,
    status: "active",
    joinDate: "2023-03-10",
    phone: "+91 98765 43212",
    email: "priya.singh@trivedacare.com",
    location: "Clinic C",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    achievements: ["Women's Health Specialist", "Rising Star"],
    consultations: 890,
    revenue: 320000,
  },
  {
    id: 4,
    name: "Dr. Vikram Patel",
    specialization: "Digestive Health",
    patients: 41,
    experience: "10 years",
    rating: 4.6,
    status: "inactive",
    joinDate: "2022-11-05",
    phone: "+91 98765 43213",
    email: "vikram.patel@trivedacare.com",
    location: "Clinic A",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    achievements: ["Digestive Health Expert", "Research Contributor"],
    consultations: 1560,
    revenue: 520000,
  },
];

const mockPatients = [
  {
    id: 1,
    name: "Priya Sharma",
    doctor: "Dr. Anjali Verma",
    lastVisit: "2025-01-15",
    status: "active",
    condition: "Digestive Issues",
    priority: "medium",
    age: 34,
    phone: "+91 98765 54321",
    nextAppointment: "2025-01-22",
    image: "https://images.unsplash.com/photo-1494790108777-296fd5c5c7b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    treatmentProgress: 65,
    lastVitals: { bp: "120/80", hr: 72, temp: 98.6 },
  },
  {
    id: 2,
    name: "Rohit Kumar",
    doctor: "Dr. Rajesh Kumar",
    lastVisit: "2025-01-14",
    status: "active",
    condition: "Stress Management",
    priority: "low",
    age: 28,
    phone: "+91 98765 54322",
    nextAppointment: "2025-01-25",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    treatmentProgress: 80,
    lastVitals: { bp: "118/78", hr: 68, temp: 98.4 },
  },
  {
    id: 3,
    name: "Anjali Reddy",
    doctor: "Dr. Priya Singh",
    lastVisit: "2025-01-10",
    status: "needs-attention",
    condition: "Chronic Fatigue",
    priority: "high",
    age: 42,
    phone: "+91 98765 54323",
    nextAppointment: "2025-01-18",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    treatmentProgress: 35,
    lastVitals: { bp: "130/85", hr: 82, temp: 99.1 },
  },
  {
    id: 4,
    name: "Vikram Patel",
    doctor: "Dr. Anjali Verma",
    lastVisit: "2025-01-12",
    status: "active",
    condition: "Joint Pain",
    priority: "medium",
    age: 56,
    phone: "+91 98765 54324",
    nextAppointment: "2025-01-20",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    treatmentProgress: 50,
    lastVitals: { bp: "125/82", hr: 75, temp: 98.7 },
  },
];

const mockAppointments = [
  { time: "09:00 AM", patient: "Priya Sharma", doctor: "Dr. Anjali Verma", type: "Consultation" },
  { time: "10:30 AM", patient: "Rohit Kumar", doctor: "Dr. Rajesh Kumar", type: "Follow-up" },
  { time: "11:45 AM", patient: "Anjali Reddy", doctor: "Dr. Priya Singh", type: "Emergency" },
  { time: "02:00 PM", patient: "Vikram Patel", doctor: "Dr. Anjali Verma", type: "Check-up" },
  { time: "03:30 PM", patient: "Neha Gupta", doctor: "Dr. Rajesh Kumar", type: "Consultation" },
];

const mockRevenueData = [
  { month: "Jan", revenue: 320000, patients: 45 },
  { month: "Feb", revenue: 380000, patients: 52 },
  { month: "Mar", revenue: 420000, patients: 58 },
  { month: "Apr", revenue: 480000, patients: 63 },
  { month: "May", revenue: 520000, patients: 71 },
  { month: "Jun", revenue: 580000, patients: 78 },
];

const mockConditionDistribution = [
  { name: "Digestive Issues", value: 35, color: "#3b82f6" },
  { name: "Stress", value: 28, color: "#10b981" },
  { name: "Joint Pain", value: 22, color: "#f59e0b" },
  { name: "Chronic Fatigue", value: 15, color: "#ef4444" },
];

const mockActivityData = [
  { day: "Mon", consultations: 12, newPatients: 5 },
  { day: "Tue", consultations: 15, newPatients: 7 },
  { day: "Wed", consultations: 18, newPatients: 9 },
  { day: "Thu", consultations: 14, newPatients: 6 },
  { day: "Fri", consultations: 20, newPatients: 11 },
  { day: "Sat", consultations: 10, newPatients: 4 },
  { day: "Sun", consultations: 5, newPatients: 2 },
];

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const glowPulse = {
  animate: {
    boxShadow: ["0 0 0 0 rgba(59, 130, 246, 0.4)", "0 0 0 10px rgba(59, 130, 246, 0)", "0 0 0 0 rgba(59, 130, 246, 0)"],
    transition: { duration: 2, repeat: Infinity }
  }
};

function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addUserType, setAddUserType] = useState<"Doctor" | "patient">(
    "Doctor"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New patient registered", time: "5 min ago", read: false },
    { id: 2, message: "Appointment reminder: Priya Sharma", time: "30 min ago", read: false },
    { id: 3, message: "Lab results available", time: "2 hours ago", read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    specialization: "",
    phone: "",
  });

  const filteredDoctors = mockDoctors.filter(
    (Doctor) =>
      Doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPatients = mockPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = (type: string) => {
    setAddUserType(type === "patient" ? "patient" : "Doctor");
    setAddUserOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Added ${addUserType}: ${form.name}`);
    setForm({ name: "", email: "", specialization: "", phone: "" });
    setAddUserOpen(false);
  };

  const handleUserAction = (action: string, userId: number) => {
    console.log(action, userId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white";
      case "medium":
        return "bg-gradient-to-r from-yellow-500 to-amber-500 text-white";
      case "low":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0 shadow-lg">Inactive</Badge>;
      case "needs-attention":
        return <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg animate-pulse">Needs Attention</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const StatCard = ({ icon: Icon, title, value, trend, color, delay }: any) => (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
        <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Icon className="h-6 w-6" />
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${trend > 0 ? 'bg-green-500/30' : 'bg-red-500/30'} backdrop-blur-sm`}>
              {trend > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              <span className="text-sm font-medium">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <h3 className="text-4xl font-bold mb-1">{value}</h3>
        <p className="text-white/80 text-sm font-medium">{title}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Enhanced Header with Glassmorphism */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative z-40 border-b border-white/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </motion.button>
              
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#1F5C3F] via-[#10B981] to-[#0D9488] rounded-2xl shadow-2xl"
              >
                <Heart className="h-7 w-7 text-white" />
              </motion.div>
              
              <div className="min-w-0">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="truncate text-2xl font-bold bg-gradient-to-r from-[#1F5C3F] via-[#10B981] to-[#0D9488] bg-clip-text text-transparent sm:text-3xl"
                >
                  TrivedaCare
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="hidden text-sm font-medium text-gray-500 dark:text-gray-400 sm:flex sm:items-center"
                >
                  <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />
                  Healthcare Management System
                </motion.p>
              </div>
            </div>

            <div className="flex w-full flex-wrap items-center justify-end gap-3 lg:w-auto">
              {/* Search Bar */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative hidden md:block md:w-56 lg:w-64"
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Quick search..."
                  className="w-full rounded-full border-gray-200 bg-white/50 pl-10 backdrop-blur-sm focus:border-[#10B981] focus:ring-[#10B981]/20 dark:border-gray-700 dark:bg-gray-800/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </motion.div>

              {/* Notifications */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-50"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors relative"
                >
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                    />
                  )}
                </motion.button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[120]"
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notif, index) => (
                          <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${!notif.read ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}
                          >
                            <p className="text-sm text-gray-800 dark:text-gray-200">{notif.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.time}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden md:flex items-center gap-3"
              >
                <Button
                  className="bg-gradient-to-r from-[#1F5C3F] to-[#10B981] hover:from-[#1F5C3F]/90 hover:to-[#10B981]/90 text-white shadow-lg hover:shadow-xl rounded-xl transition-all duration-300"
                  data-testid="button-add-user"
                  onClick={() => setAddUserOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sidebar for Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <motion.div className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-2xl">
              {/* Sidebar content */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="mx-auto w-full max-w-7xl overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8">

        {/* Tabs Section */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-6"
        >
          <TabsList className="h-auto w-full flex-wrap justify-start gap-2 rounded-2xl border border-gray-200 bg-white/80 p-1 shadow-lg backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/80">
            {["overview", "Doctors", "patients", "analytics"].map((tab, index) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="flex-1 min-w-[140px] rounded-xl px-4 py-2.5 font-medium capitalize transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#1F5C3F] data-[state=active]:to-[#10B981] data-[state=active]:text-white data-[state=active]:shadow-md sm:flex-none sm:min-w-0 sm:px-6"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              {/* Today's Schedule */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="min-w-0 xl:col-span-2"
              >
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-2xl rounded-2xl overflow-hidden">
                  <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center space-x-2">
                        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                          <CalendarDays className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="truncate text-gray-900 dark:text-white">Today's Schedule</CardTitle>
                      </div>
                      <Badge className="bg-gradient-to-r from-[#1F5C3F] to-[#10B981] text-white border-0">
                        {mockAppointments.length} Appointments
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {mockAppointments.map((appointment, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex cursor-pointer flex-col gap-3 rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex min-w-0 items-center space-x-4">
                            <div className="w-20 shrink-0 text-sm font-semibold text-gray-900 dark:text-white">{appointment.time}</div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{appointment.patient}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{appointment.doctor}</p>
                            </div>
                          </div>
                          <Badge className={
                            appointment.type === "Emergency" 
                              ? "bg-gradient-to-r from-red-500 to-red-600 text-white border-0"
                              : appointment.type === "Follow-up"
                              ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0"
                              : "bg-gradient-to-r from-[#1F5C3F] to-[#10B981] text-white border-0"
                          }>
                            {appointment.type}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-2xl rounded-2xl overflow-hidden h-full">
                  <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-[#10B981]/10 dark:bg-[#10B981]/10 rounded-lg">
                        <Activity className="h-5 w-5 text-[#0D9488] dark:text-[#10B981]" />
                      </div>
                      <CardTitle className="text-gray-900 dark:text-white">Weekly Activity</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockActivityData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                          <XAxis dataKey="day" stroke="#6b7280" />
                          <YAxis stroke="#6b7280" />
                          <Tooltip />
                          <Bar dataKey="consultations" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="newPatients" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="Doctors" className="space-y-6">
            <motion.div variants={staggerContainer} initial="initial" animate="animate">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-2xl rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex min-w-0 items-center space-x-2">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                        <UserCog className="h-5 w-5 text-[#1F5C3F] dark:text-[#10B981]" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="truncate text-gray-900 dark:text-white">Doctor Management</CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400">
                          Manage Doctor profiles and access permissions
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto lg:justify-end">
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search Doctors..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full rounded-xl border-gray-200 bg-white/50 pl-10 focus:border-[#10B981] focus:ring-[#10B981]/20 dark:border-gray-600 dark:bg-gray-700/50"
                          data-testid="input-search-Doctors"
                        />
                      </div>
                      <Button
                        onClick={() => handleAddUser("Doctor")}
                        className="bg-gradient-to-r from-[#1F5C3F] to-[#10B981] hover:from-[#1F5C3F]/90 hover:to-[#10B981]/90 text-white shadow-lg hover:shadow-xl rounded-xl transition-all duration-300"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Doctor
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredDoctors.map((Doctor, index) => (
                      <motion.div
                        key={Doctor.id}
                        variants={fadeInUp}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer min-h-[520px]"
                        onClick={() => setSelectedDoctor(Doctor)}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#1F5C3F] to-[#10B981] rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                        <div className="p-6 flex h-full flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center space-x-4">
                              <Avatar className="h-16 w-16 border-4 border-white dark:border-gray-700 shadow-xl">
                                <AvatarImage src={Doctor.image} />
                                <AvatarFallback className="bg-gradient-to-br from-[#1F5C3F] to-[#10B981] text-white text-lg">
                                  {Doctor.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#1F5C3F] dark:group-hover:text-[#10B981] transition-colors leading-tight break-words">
                                  {Doctor.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 font-medium flex items-start mt-1">
                                  <Stethoscope className="h-4 w-4 mr-1 mt-0.5 shrink-0" />
                                  <span className="break-words leading-snug">{Doctor.specialization}</span>
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0">
                                    ⭐ {Doctor.rating}
                                  </Badge>
                                  {getStatusBadge(Doctor.status)}
                                </div>
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                            >
                              <MoreVertical className="h-5 w-5 text-gray-500" />
                            </motion.button>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                              <p className="text-2xl font-bold text-[#1F5C3F] dark:text-[#10B981]">{Doctor.patients}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Patients</p>
                            </div>
                            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{Doctor.experience}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Experience</p>
                            </div>
                            <div className="text-center p-3 bg-[#10B981]/10 dark:bg-[#10B981]/10 rounded-xl">
                              <p className="text-2xl font-bold text-[#1F5C3F] dark:text-emerald-400">₹{Doctor.revenue/1000}K</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Revenue</p>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                            <div className="flex flex-wrap items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex min-w-0 items-start flex-1">
                                <Mail className="h-4 w-4 mr-1 mt-0.5 shrink-0" />
                                <span className="break-all leading-snug">{Doctor.email}</span>
                              </span>
                              <span className="flex items-center shrink-0">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span className="break-words">{Doctor.location}</span>
                              </span>
                            </div>
                            <div className="flex justify-end">
                              <motion.button
                                whileHover={{ x: 5 }}
                                className="text-[#1F5C3F] dark:text-[#10B981] font-medium text-sm flex items-center"
                              >
                                View Profile
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </motion.button>
                            </div>
                          </div>

                          {Doctor.achievements && (
                            <div className="flex flex-wrap gap-2 mt-4 min-h-[32px] content-start">
                              {Doctor.achievements.map((achievement, i) => (
                                <Badge key={i} variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
                                  <Award className="h-3 w-3 mr-1" />
                                  {achievement}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="patients" className="space-y-6">
            <motion.div variants={staggerContainer} initial="initial" animate="animate">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-2xl rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="truncate text-gray-900 dark:text-white">Patient Management</CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400">
                          View and manage patient records
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto lg:justify-end">
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search patients..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full rounded-xl border-gray-200 bg-white/50 pl-10 focus:border-[#10B981] focus:ring-[#10B981]/20 dark:border-gray-600 dark:bg-gray-700/50"
                          data-testid="input-search-patients"
                        />
                      </div>
                      <Button
                        onClick={() => handleAddUser("patient")}
                        className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl rounded-xl transition-all duration-300"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Register Patient
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredPatients.map((patient, index) => (
                      <motion.div
                        key={patient.id}
                        variants={fadeInUp}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -2, scale: 1.01 }}
                        className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer p-6"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <Avatar className="h-14 w-14 border-2 border-white dark:border-gray-700 shadow-lg">
                              <AvatarImage src={patient.image} />
                              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-green-500 text-white">
                                {patient.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#1F5C3F] dark:group-hover:text-[#10B981] transition-colors">
                                    {patient.name}
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Assigned to <span className="font-medium text-[#1F5C3F] dark:text-[#10B981]">{patient.doctor}</span>
                                  </p>
                                </div>
                                <Badge className={getPriorityColor(patient.priority)}>
                                  {patient.priority.charAt(0).toUpperCase() + patient.priority.slice(1)} Priority
                                </Badge>
                              </div>

                              <div className="grid grid-cols-4 gap-4 mt-4">
                                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                  <Calendar className="h-4 w-4" />
                                  <span>Age {patient.age}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                  <Phone className="h-4 w-4" />
                                  <span>{patient.phone}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                  <Clock className="h-4 w-4" />
                                  <span>Last: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                  <Calendar className="h-4 w-4" />
                                  <span>Next: {new Date(patient.nextAppointment).toLocaleDateString()}</span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-4 mt-4">
                                <Badge variant="outline" className="bg-[#10B981]/10 dark:bg-[#10B981]/10 text-[#1F5C3F] dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                                  <Thermometer className="h-3 w-3 mr-1" />
                                  BP: {patient.lastVitals.bp}
                                </Badge>
                                <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20 text-[#1F5C3F] dark:text-[#10B981] border-emerald-200 dark:border-emerald-800">
                                  <Heart className="h-3 w-3 mr-1" />
                                  HR: {patient.lastVitals.hr}
                                </Badge>
                                <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800">
                                  <Flame className="h-3 w-3 mr-1" />
                                  Temp: {patient.lastVitals.temp}°F
                                </Badge>
                              </div>

                              <div className="mt-4">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Treatment Progress</span>
                                  <span className="text-sm font-medium text-[#1F5C3F] dark:text-[#10B981]">{patient.treatmentProgress}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${patient.treatmentProgress}%` }}
                                    transition={{ duration: 1, delay: index * 0.1 }}
                                    className="h-full bg-gradient-to-r from-[#1F5C3F] to-[#10B981] rounded-full"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start space-x-2 ml-4">
                            {getStatusBadge(patient.status)}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              <MoreVertical className="h-4 w-4 text-gray-500" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-8">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5"
            >
              <StatCard icon={Stethoscope} title="Total Doctors" value={mockClinicStats.totalDoctors} trend={8} color="from-[#1F5C3F] to-[#1F5C3F]/90" delay={0} />
              <StatCard icon={Users} title="Total Patients" value={mockClinicStats.totalPatients} trend={12} color="from-emerald-600 to-emerald-700" delay={0.1} />
              <StatCard icon={Activity} title="Active Charts" value={mockClinicStats.activeCharts} trend={5} color="from-[#10B981] to-[#0D9488]" delay={0.2} />
              <StatCard icon={Shield} title="Compliance Rate" value={`${mockClinicStats.complianceRate}%`} trend={2} color="from-[#0D9488] to-[#1F5C3F]" delay={0.3} />
              <StatCard icon={TrendingUp} title="Monthly Growth" value={`${mockClinicStats.monthlyGrowth}%`} trend={15} color="from-[#1F5C3F]/80 to-[#10B981]/80" delay={0.4} />
            </motion.div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="min-w-0 xl:col-span-2"
              >
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-2xl rounded-2xl overflow-hidden">
                  <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center space-x-2">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                          <LineChart className="h-5 w-5 text-[#1F5C3F] dark:text-[#10B981]" />
                        </div>
                        <CardTitle className="truncate text-gray-900 dark:text-white">Revenue Overview</CardTitle>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockRevenueData}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                          <XAxis dataKey="month" stroke="#6b7280" />
                          <YAxis stroke="#6b7280" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                              borderRadius: '12px',
                              border: 'none',
                              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                            }} 
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-2xl rounded-2xl overflow-hidden h-full">
                  <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <PieChart className="h-5 w-5 text-[#1F5C3F] dark:text-emerald-400" />
                      </div>
                      <CardTitle className="text-gray-900 dark:text-white">Condition Distribution</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie
                            data={mockConditionDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {mockConditionDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RePieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {mockConditionDistribution.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white ml-auto">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Enhanced Footer */}
        <motion.footer 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={glowPulse.animate}
                    className="w-3 h-3 bg-green-500 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">System Status: <span className="text-green-600 dark:text-green-400">Operational</span></span>
                </div>
                
                <div className="flex items-center space-x-6">
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Heart className="h-4 w-4 mr-1 text-red-500" />
                    TrivedaCare v2.1.0
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Last updated: {new Date().toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Lock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <RefreshCw className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>

      {/* Add User Modal */}
      <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent className="max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Plus className="h-6 w-6 mr-2 text-[#1F5C3F]" />
              Add New User
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Choose user type and fill the form to add a new user.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mb-6">
            <RadioGroup
              value={addUserType}
              onValueChange={(v) => setAddUserType(v as "Doctor" | "patient")}
              className="flex gap-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex-1">
                <RadioGroupItem value="Doctor" id="add-Doctor" className="peer sr-only" />
                <label
                  htmlFor="add-Doctor"
                  className="flex items-center justify-center p-2 text-sm font-medium rounded-md cursor-pointer peer-data-[state=checked]:bg-white peer-data-[state=checked]:dark:bg-gray-700 peer-data-[state=checked]:text-[#1F5C3F] peer-data-[state=checked]:shadow-sm transition-all"
                >
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Doctor
                </label>
              </div>
              <div className="flex-1">
                <RadioGroupItem value="patient" id="add-patient" className="peer sr-only" />
                <label
                  htmlFor="add-patient"
                  className="flex items-center justify-center p-2 text-sm font-medium rounded-md cursor-pointer peer-data-[state=checked]:bg-white peer-data-[state=checked]:dark:bg-gray-700 peer-data-[state=checked]:text-[#1F5C3F] peer-data-[state=checked]:shadow-sm transition-all"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Patient
                </label>
              </div>
            </RadioGroup>
          </div>

          <form onSubmit={handleUserSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <Input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                placeholder="Enter full name"
                required
                className="rounded-xl border-gray-300 dark:border-gray-600 focus:border-[#10B981] focus:ring-[#10B981]/20"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleFormChange}
                placeholder="Enter email address"
                required
                className="rounded-xl border-gray-300 dark:border-gray-600 focus:border-[#10B981] focus:ring-[#10B981]/20"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleFormChange}
                placeholder="Enter phone number"
                required
                className="rounded-xl border-gray-300 dark:border-gray-600 focus:border-[#10B981] focus:ring-[#10B981]/20"
              />
            </div>
            
            {addUserType === "Doctor" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Specialization
                </label>
                <Input
                  name="specialization"
                  value={form.specialization}
                  onChange={handleFormChange}
                  placeholder="Enter specialization"
                  required
                  className="rounded-xl border-gray-300 dark:border-gray-600 focus:border-[#10B981] focus:ring-[#10B981]/20"
                />
              </div>
            )}

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline" type="button" className="rounded-xl">
                  Cancel
                </Button>
              </DialogClose>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-[#1F5C3F] to-[#10B981] hover:from-[#1F5C3F]/90 hover:to-[#10B981]/90 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Add {addUserType.charAt(0).toUpperCase() + addUserType.slice(1)}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminDashboard;