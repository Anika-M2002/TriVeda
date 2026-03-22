import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  BarChart3,
  User,
  Award,
  Flame,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Star,
  Target,
  MapPin,
  Globe,
  Droplets,
  Wind,
  Leaf,
  Sparkles,
  Activity,
  TrendingUp,
  Shield,
  Clock,
  Edit3,
  Settings,
  Bell,
  ChevronRight,
  FileText,
  Upload,
  Brain,
  Trash2,
  AlertCircle,
  Pill,
  History,
  Plus,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// Mock data (updated with array for allergies)
const mockProfile = {
  name: "Priya Sharma",
  age: 34,
  gender: "Female",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  prakriti: "Pitta",
  bmi: 24.5,
  weight: 72,
  height: 165,
  email: "priya.sharma@example.com",
  phone: "+91-9000000000",
  dietary_habits: "Vegetarian",
  allergies: ["Peanuts", "Dust"], // Converted to array
  chronic_conditions: ["None"],
  goals: ["Weight Management", "Better Digestion"],
  compliance: 85,
  streak: 12,
  doshaScores: [
    { dosha: "Vata", score: 60 },
    { dosha: "Pitta", score: 90 },
    { dosha: "Kapha", score: 40 },
  ],
  recentActivity: [
    {
      type: "meal",
      label: "Logged Lunch",
      date: "2025-09-16",
      status: "on-plan",
      icon: "Flame",
    },
    {
      type: "reminder",
      label: "Took Evening Snack",
      date: "2025-09-15",
      status: "on-plan",
      icon: "CheckCircle",
    },
    {
      type: "feedback",
      label: "Received feedback: Great compliance!",
      date: "2025-09-15",
      status: "positive",
      icon: "Award",
    },
    {
      type: "meal",
      label: "Logged Dinner",
      date: "2025-09-14",
      status: "off-plan",
      icon: "XCircle",
    },
  ],
  languages: ["English", "Hindi"],
};

// Icon mapping
const activityIcons = {
  Flame: Flame,
  CheckCircle: CheckCircle,
  Award: Award,
  XCircle: XCircle,
};

type ActivityIconKey = keyof typeof activityIcons;

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function PatientProfile() {
  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "history">("overview");

  // Patient History States
  const [allergies, setAllergies] = useState<string[]>(mockProfile.allergies);
  const [conditions, setConditions] = useState<string[]>(mockProfile.chronic_conditions);
  const [reports, setReports] = useState<any[]>([]);
  
  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState("");

  // Patient History Handlers
  const handleAddAllergy = () => {
    if (!newAllergy.trim()) return;
    setAllergies([...allergies, newAllergy.trim()]);
    setNewAllergy("");
  };

  const handleRemoveAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const handleAddCondition = () => {
    if (!newCondition.trim()) return;
    setConditions([...conditions, newCondition.trim()]);
    setNewCondition("");
  };

  const handleRemoveCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleUploadReport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newReport = {
      name: file.name,
      summary: "AI analyzing report...",
      date: new Date().toLocaleDateString(),
    };

    setReports([...reports, newReport]);

    // Simulate AI analysis
    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) =>
          r.name === file.name
            ? {
                ...r,
                summary:
                  "Analysis complete: No critical abnormalities detected. Recommended: Follow up on Vitamin D levels and maintain current diet plan.",
              }
            : r
        )
      );
    }, 2000);
  };

  // Get dosha color
  const getDoshaColor = (dosha: string) => {
    switch(dosha) {
      case "Vata": return "purple";
      case "Pitta": return "amber";
      case "Kapha": return "emerald";
      default: return "blue";
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground">

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-[#10B981] flex items-center justify-center">
                  <User className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-[#10B981] to-[#0D9488] bg-clip-text text-transparent leading-tight break-words">
                  Patient Profile
                </h1>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">View and manage your health journey</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap w-full lg:w-auto gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:bg-white transition-all"
              >
                <Bell className="w-5 h-5 text-gray-600" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:bg-white transition-all"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-[#10B981] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm sm:text-base"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </motion.button>
            </div>
          </div>

          {/* Tab Navigation - Updated with History Tab */}
          <div className="mt-6 w-full">
            <div className="grid grid-cols-3 gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-1 w-full">
            <button
              onClick={() => setActiveTab("overview")}
              className={`h-11 px-2 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center whitespace-nowrap ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-emerald-500 to-[#10B981] text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`h-11 px-2 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center whitespace-nowrap ${
                activeTab === "activity"
                  ? "bg-gradient-to-r from-emerald-500 to-[#10B981] text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span className="sm:hidden">Timeline</span>
              <span className="hidden sm:inline">Activity Timeline</span>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`h-11 px-2 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 whitespace-nowrap ${
                activeTab === "history"
                  ? "bg-gradient-to-r from-emerald-500 to-[#10B981] text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <History className="hidden sm:block w-4 h-4 shrink-0" />
              <span className="sm:hidden">History</span>
              <span className="hidden sm:inline">Patient History</span>
            </button>
            </div>
          </div>
        </motion.div>

        {/* Profile Header Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-emerald-500/5"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-200/20 rounded-full blur-3xl"></div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-4 sm:gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-[#10B981] rounded-full blur-xl opacity-50"></div>
              <img
                src={mockProfile.avatar}
                alt="avatar"
                className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-xl object-cover"
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-[#10B981] text-white rounded-full px-4 py-1.5 text-xs font-bold shadow-lg border-2 border-white"
              >
                Patient
              </motion.div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 break-words">{mockProfile.name}</h2>
              
              <div className="flex flex-wrap gap-2 mb-3 justify-center md:justify-start">
                {mockProfile.languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-emerald-100 text-[#1F5C3F] rounded-full text-xs font-medium border border-emerald-200"
                  >
                    <Globe className="w-3 h-3 inline mr-1" />
                    {lang}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 sm:gap-4 text-sm text-gray-600 justify-center md:justify-start">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  Age: {mockProfile.age}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4 text-emerald-500" />
                  {mockProfile.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  {mockProfile.phone}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-center gap-3 w-full md:w-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{mockProfile.prakriti}</div>
                <div className="text-xs text-gray-500">Prakriti</div>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{mockProfile.bmi}</div>
                <div className="text-xs text-gray-500">BMI</div>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === "overview" ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats Cards */}
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              >
                <motion.div
                  variants={fadeInUp}
                  className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl">
                      <Flame className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">BMI</p>
                      <p className="text-2xl font-bold text-gray-900">{mockProfile.bmi}</p>
                      <p className="text-xs text-gray-400">Body Mass Index</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl">
                      <Target className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Compliance</p>
                      <p className="text-2xl font-bold text-gray-900">{mockProfile.compliance}%</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${mockProfile.compliance}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-[#10B981]"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl">
                      <Award className="w-6 h-6 text-[#10B981]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Streak</p>
                      <p className="text-2xl font-bold text-gray-900">{mockProfile.streak} days</p>
                      <p className="text-xs text-gray-400">Current streak</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl">
                      <Star className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Prakriti</p>
                      <p className="text-2xl font-bold text-amber-600">{mockProfile.prakriti}</p>
                      <p className="text-xs text-gray-400">Ayurvedic Constitution</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Profile Details & Dosha Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Profile Overview */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-gradient-to-r from-rose-100 to-rose-50 rounded-lg">
                      <Heart className="w-5 h-5 text-rose-500" />
                    </div>
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent">
                      Profile Overview
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <InfoRow label="Gender" value={mockProfile.gender} />
                      <InfoRow label="Weight" value={`${mockProfile.weight} kg`} />
                      <InfoRow label="Height" value={`${mockProfile.height} cm`} />
                      <InfoRow label="Dietary Habits" value={mockProfile.dietary_habits} />
                      
                      <div>
                        <span className="text-sm font-medium text-gray-700">Allergies:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {allergies.map((allergy, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gradient-to-r from-rose-100 to-rose-50 text-rose-700 rounded-full text-xs font-medium border border-rose-200"
                            >
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-700">Chronic Conditions:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {conditions.map((condition, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 rounded-full text-xs font-medium border border-amber-200"
                            >
                              {condition}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-700">Goals:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {mockProfile.goals.map((g) => (
                            <span
                              key={g}
                              className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 rounded-full text-xs font-medium border border-emerald-200"
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Dosha Radar Chart */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={mockProfile.doshaScores}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="dosha" stroke="#6b7280" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#6b7280" />
                            <Radar
                              name="Dosha"
                              dataKey="score"
                              stroke="#f59e42"
                              fill="#f59e42"
                              fillOpacity={0.3}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "white",
                                border: "none",
                                borderRadius: "12px",
                                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                              }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Prakriti Dosha Profile
                      </p>
                    </div>
                  </div>

                  {/* Dosha Details */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {mockProfile.doshaScores.map((dosha) => {
                      const color = getDoshaColor(dosha.dosha);
                      return (
                        <div key={dosha.dosha} className="text-center">
                          <div className={`text-sm font-medium text-${color}-700 mb-1`}>
                            {dosha.dosha}
                          </div>
                          <div className={`text-2xl font-bold text-${color}-600`}>
                            {dosha.score}%
                          </div>
                          <div className={`w-full h-1.5 bg-${color}-100 rounded-full mt-2`}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${dosha.score}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className={`h-full rounded-full bg-${color}-500`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Quick Stats Card */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-emerald-500 to-[#10B981] rounded-2xl shadow-xl p-6 text-white relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                  
                  <div className="relative">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Health Summary
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-white/80 text-sm">Overall Health</p>
                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-bold">Good</div>
                          <span className="px-2 py-1 bg-white/20 rounded-full text-xs">+5%</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-white/80 text-sm">Dosha Balance</p>
                        <div className="text-2xl font-bold">75%</div>
                      </div>

                      <div>
                        <p className="text-white/80 text-sm">Next Checkup</p>
                        <div className="text-lg font-semibold">Oct 15, 2025</div>
                      </div>

                      <div className="pt-4 border-t border-white/20">
                        <button className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all text-sm font-medium">
                          View Full Report
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : activeTab === "activity" ? (
            <motion.div
              key="activity"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Activity Timeline */}
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-emerald-100 to-emerald-100 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-[#1F5C3F]" />
                    </div>
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-[#1F5C3F] to-[#10B981] bg-clip-text text-transparent">
                      Recent Activity
                    </h2>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200 transition-colors">
                      This Week
                    </button>
                    <button className="px-3 py-1.5 bg-gradient-to-r from-[#1F5C3F] to-[#10B981] text-white rounded-lg text-sm shadow-md">
                      All Time
                    </button>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {mockProfile.recentActivity.map((a, i) => {
                    const Icon = activityIcons[a.icon as ActivityIconKey] || Flame;
                    const statusColor = 
                      a.status === "on-plan" ? "emerald" :
                      a.status === "off-plan" ? "rose" :
                      "blue";

                    return (
                      <motion.div
                        key={i}
                        variants={fadeInUp}
                        className="flex items-start gap-4 group"
                      >
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-${statusColor}-100 to-${statusColor}-200 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                            <Icon className={`w-5 h-5 text-${statusColor}-600`} />
                          </div>
                          {i !== mockProfile.recentActivity.length - 1 && (
                            <div className="absolute top-10 left-1/2 w-0.5 h-12 bg-gradient-to-b from-gray-200 to-transparent -translate-x-1/2"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 bg-gray-50 rounded-xl p-4 group-hover:bg-white group-hover:shadow-md transition-all">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-gray-900">{a.label}</span>
                            <span className={`text-xs px-2 py-1 rounded-full bg-${statusColor}-100 text-${statusColor}-700 font-medium`}>
                              {a.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {a.date}
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="capitalize">{a.type}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Activity Stats */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="text-center p-4 bg-emerald-50 rounded-xl">
                    <div className="text-2xl font-bold text-emerald-600">85%</div>
                    <div className="text-xs text-gray-600">On-Plan Rate</div>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-xl">
                    <div className="text-2xl font-bold text-[#1F5C3F]">12</div>
                    <div className="text-xs text-gray-600">Total Activities</div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-xl">
                    <div className="text-2xl font-bold text-amber-600">3</div>
                    <div className="text-xs text-gray-600">This Week</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            // PATIENT HISTORY TAB
            <motion.div
              key="history"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Allergies Section */}
              <motion.div
                variants={fadeInUp}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-gradient-to-r from-rose-100 to-rose-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent break-words">
                    Allergies
                  </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
                  <input
                    type="text"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Add allergy (e.g., Peanuts, Dust)"
                    className="flex-1 px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white/50 min-w-0"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddAllergy()}
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddAllergy}
                    className="px-3 sm:px-4 py-2 whitespace-nowrap bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </motion.button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {allergies.map((allergy, index) => (
                    <motion.span
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="group relative px-4 py-2 bg-gradient-to-r from-rose-100 to-rose-50 text-rose-700 rounded-full text-sm font-medium border border-rose-200 flex items-center gap-2 shadow-sm"
                    >
                      {allergy}
                      <button
                        onClick={() => handleRemoveAllergy(index)}
                        className="hover:text-rose-900 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </motion.span>
                  ))}
                  {allergies.length === 0 && (
                    <p className="text-gray-400 text-sm">No allergies added yet</p>
                  )}
                </div>
              </motion.div>

              {/* Previous Medical Conditions */}
              <motion.div
                variants={fadeInUp}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg">
                    <Heart className="w-5 h-5 text-amber-600" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent break-words">
                    Previous Medical Conditions
                  </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
                  <input
                    type="text"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    placeholder="Add condition (e.g., Diabetes, Hypertension)"
                    className="flex-1 px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/50 min-w-0"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCondition()}
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddCondition}
                    className="px-3 sm:px-4 py-2 whitespace-nowrap bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </motion.button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {conditions.map((condition, index) => (
                    <motion.span
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="group relative px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 rounded-full text-sm font-medium border border-amber-200 flex items-center gap-2 shadow-sm"
                    >
                      {condition}
                      <button
                        onClick={() => handleRemoveCondition(index)}
                        className="hover:text-amber-900 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </motion.span>
                  ))}
                  {conditions.length === 1 && conditions[0] === "None" && (
                    <p className="text-gray-400 text-sm">No conditions added yet</p>
                  )}
                </div>
              </motion.div>

              {/* Medical Report Upload */}
              <motion.div
                variants={fadeInUp}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-lg">
                    <Upload className="w-5 h-5 text-[#1F5C3F]" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-[#1F5C3F] to-[#10B981] bg-clip-text text-transparent break-words">
                    Upload Medical Report
                  </h2>
                </div>

                <div className="relative">
                  <input
                    type="file"
                    onChange={handleUploadReport}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <div className="border-2 border-dashed border-emerald-200 rounded-xl p-4 sm:p-8 text-center hover:border-emerald-400 transition-colors bg-emerald-50/30">
                    <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 mx-auto mb-3" />
                    <p className="text-sm sm:text-base text-[#1F5C3F] font-medium break-words">Click to upload or drag and drop</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">PDF, JPG, PNG (Max 10MB)</p>
                  </div>
                </div>
              </motion.div>

              {/* AI Health Report Analyzer */}
              <motion.div
                variants={fadeInUp}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-gradient-to-r from-emerald-100 to-emerald-100 rounded-lg">
                    <Brain className="w-5 h-5 text-[#1F5C3F]" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-[#1F5C3F] to-[#10B981] bg-clip-text text-transparent break-words">
                    AI Health Report Analyzer
                  </h2>
                </div>

                {reports.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50/50 rounded-xl">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">
                      Upload a medical report to see AI-powered analysis
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-emerald-100 rounded-xl p-4 bg-gradient-to-r from-emerald-50 to-emerald-50/70"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[#1F5C3F]" />
                            <span className="font-semibold text-gray-900">{report.name}</span>
                          </div>
                          <span className="text-xs text-gray-500">{report.date}</span>
                        </div>
                        <p className="text-sm text-gray-700 bg-white/80 rounded-lg p-3">
                          {report.summary}
                        </p>
                        {report.summary.includes("analyzing") && (
                          <div className="flex items-center gap-2 mt-2">
                            <div className="w-4 h-4 border-2 border-[#1F5C3F] border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs text-[#1F5C3F]">Processing...</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

// Helper component for info rows
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <span className="text-sm font-medium text-gray-700">{label}:</span>
    <span className="text-sm text-gray-900">{value}</span>
  </div>
);