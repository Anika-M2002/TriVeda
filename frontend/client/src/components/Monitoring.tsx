import React, { useState } from "react";
import {
  User,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  MessageCircle,
  Calendar,
  Plus,
  X,
  Zap,
  Activity,
  Heart,
  Shield,
  TrendingUp,
  Clock,
  Bell,
  Search,
  Filter,
  Eye,
} from "lucide-react";

// Mock patient monitoring data
interface MonitoringPatient {
  id: string;
  name: string;
  adherence: number;
  mealPlan: number;
  recommendations: number;
  deviation: boolean;
  aiMessage: string;
  lastUpdate: string;
  aiSuggestions?: string[];
  notificationSent?: boolean;
  riskLevel?: "low" | "medium" | "high";
  vitalSigns: {
    heartRate: number;
    bloodPressure: string;
    glucose: number;
  };
}

const mockMonitoringData: MonitoringPatient[] = [
  {
    id: "1",
    name: "Priya Sharma",
    adherence: 92,
    mealPlan: 88,
    recommendations: 95,
    deviation: false,
    aiMessage:
      "Excellent progress! Maintain current dietary patterns for optimal metabolic health.",
    lastUpdate: "2025-09-18",
    riskLevel: "low",
    vitalSigns: { heartRate: 72, bloodPressure: "120/80", glucose: 95 },
  },
  {
    id: "2",
    name: "Rohit Kumar",
    adherence: 68,
    mealPlan: 60,
    recommendations: 70,
    deviation: true,
    aiMessage:
      "Critical deviation detected. Immediate clinical intervention recommended.",
    lastUpdate: "2025-09-17",
    riskLevel: "high",
    vitalSigns: { heartRate: 88, bloodPressure: "140/95", glucose: 165 },
  },
  {
    id: "3",
    name: "Anjali Reddy",
    adherence: 80,
    mealPlan: 75,
    recommendations: 85,
    deviation: false,
    aiMessage:
      "Good therapeutic compliance. Consider optimizing meal timing for enhanced outcomes.",
    lastUpdate: "2025-09-16",
    riskLevel: "medium",
    vitalSigns: { heartRate: 78, bloodPressure: "128/82", glucose: 110 },
  },
];

export default function HealthcareMonitoring() {
  const [data, setData] = useState<MonitoringPatient[]>(
    mockMonitoringData.map((p) => ({
      ...p,
      aiSuggestions: getAISuggestions(p),
      notificationSent: false,
    }))
  );
  const [search, setSearch] = useState("");
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<{ [id: string]: string }>({});
  const [aiLoading, setAiLoading] = useState<{ [id: string]: boolean }>({});
  // New state for doctor recommendation and modal
  const [doctorRecommendation, setDoctorRecommendation] = useState<{
    [id: string]: string;
  }>({});
  const [showRecommendationsModal, setShowRecommendationsModal] =
    useState(false);
  const [modalPatientId, setModalPatientId] = useState<string | null>(null);
  const [filterRisk, setFilterRisk] = useState<string>("all");

  // AI-driven suggestions generator
  function getAISuggestions(patient: MonitoringPatient): string[] {
    const suggestions: string[] = [];

    if (patient.riskLevel === "high") {
      suggestions.push(
        "🔴 URGENT: Schedule immediate clinical assessment within 24 hours"
      );
      suggestions.push("📊 Monitor vitals every 4 hours until stabilized");
    }

    if (patient.adherence < 75) {
      suggestions.push(
        "📱 Implement digital adherence monitoring with real-time alerts"
      );
      suggestions.push(
        "👥 Consider patient education program or care coordinator assignment"
      );
    } else if (patient.adherence >= 90) {
      suggestions.push(
        "🏆 Exemplary adherence - eligible for reduced monitoring frequency"
      );
    }

    if (patient.mealPlan < 70) {
      suggestions.push(
        "🍽️ Nutritionist consultation recommended for meal plan optimization"
      );
      suggestions.push("📲 Deploy continuous glucose monitoring if diabetic");
    } else if (patient.mealPlan >= 90) {
      suggestions.push(
        "✅ Excellent nutritional compliance - maintain current protocols"
      );
    }

    if (patient.vitalSigns?.glucose && patient.vitalSigns.glucose > 140) {
      suggestions.push(
        "⚠️ Hyperglycemia detected - consider medication adjustment"
      );
    }

    if (patient.recommendations < 80) {
      suggestions.push("📋 Review treatment protocol adherence barriers");
    }

    if (suggestions.length === 0) {
      suggestions.push("🎯 Patient maintaining optimal therapeutic targets");
    }

    return suggestions;
  }

  // Filtered data by search and risk level
  const filteredData = data.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterRisk === "all" || p.riskLevel === filterRisk;
    return matchesSearch && matchesFilter;
  });

  // Risk level statistics
  const riskStats = {
    high: data.filter((p) => p.riskLevel === "high").length,
    medium: data.filter((p) => p.riskLevel === "medium").length,
    low: data.filter((p) => p.riskLevel === "low").length,
    total: data.length,
  };

  // Simulate AI response for custom queries
  function handleAskAI(patient: MonitoringPatient) {
    if (!aiQuery.trim()) return;
    setAiLoading((prev) => ({ ...prev, [patient.id]: true }));
    setTimeout(() => {
      let resp = "";
      let doctor = "Dr. Aarav Mehta (Endocrinologist)";
      if (aiQuery.toLowerCase().includes("improve")) {
        resp = `Clinical AI: ${patient.name.split(" ")[0]} shows ${
          patient.adherence
        }% adherence. Recommend behavioral intervention protocols and enhanced monitoring.`;
      } else if (aiQuery.toLowerCase().includes("risk")) {
        resp = `Risk Assessment: ${
          patient.name.split(" ")[0]
        } classified as ${patient.riskLevel?.toUpperCase()} risk. Current glucose: ${
          patient.vitalSigns?.glucose
        }mg/dL, BP: ${patient.vitalSigns?.bloodPressure}`;
      } else if (aiQuery.toLowerCase().includes("appointment")) {
        resp = `Scheduling AI: ${patient.name.split(" ")[0]} requires ${
          patient.riskLevel === "high" ? "urgent" : "routine"
        } clinical assessment. Priority: ${patient.riskLevel?.toUpperCase()}`;
      } else {
        resp = `Clinical Summary: ${patient.name.split(" ")[0]} - Adherence: ${
          patient.adherence
        }%, Nutrition: ${patient.mealPlan}%, Protocol: ${
          patient.recommendations
        }%. Risk Level: ${patient.riskLevel?.toUpperCase()}`;
      }
      // Practitioner recommendation (could be dynamic based on risk)
      let docRec = "";
      if (patient.riskLevel === "high") {
        docRec = `Recommended Practitioner: Dr. Aarav Mehta (Endocrinologist)\nContact: +91-9876543210\nSpecialty: Critical care for metabolic disorders.`;
      } else if (patient.riskLevel === "medium") {
        docRec = `Recommended Practitioner: Dr. Kavya Singh (General Physician)\nContact: +91-9123456780\nSpecialty: Preventive medicine and lifestyle management.`;
      } else {
        docRec = `Recommended Practitioner: Dr. Rohan Patel (Family Physician)\nContact: +91-9988776655\nSpecialty: Routine monitoring and wellness.`;
      }
      setAiResponse((prev) => ({ ...prev, [patient.id]: resp }));
      setDoctorRecommendation((prev) => ({ ...prev, [patient.id]: docRec }));
      setAiLoading((prev) => ({ ...prev, [patient.id]: false }));
    }, 1500);
  }

  const [selectedPatient, setSelectedPatient] =
    useState<MonitoringPatient | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageSuccess, setMessageSuccess] = useState(false);

  // CRUD state
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editMode, setEditMode] = useState<null | MonitoringPatient>(null);
  const [form, setForm] = useState<MonitoringPatient>({
    id: "",
    name: "",
    adherence: 0,
    mealPlan: 0,
    recommendations: 0,
    deviation: false,
    aiMessage: "",
    lastUpdate: new Date().toISOString().slice(0, 10),
    riskLevel: "low",
    vitalSigns: { heartRate: 72, bloodPressure: "120/80", glucose: 95 },
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MonitoringPatient | null>(
    null
  );

  const handleOpenAdd = () => {
    setEditMode(null);
    setForm({
      id: (Date.now() + Math.random()).toString(),
      name: "",
      adherence: 0,
      mealPlan: 0,
      recommendations: 0,
      deviation: false,
      aiMessage: "",
      lastUpdate: new Date().toISOString().slice(0, 10),
      riskLevel: "low",
      vitalSigns: { heartRate: 72, bloodPressure: "120/80", glucose: 95 },
    });
    setShowAddEditModal(true);
  };

  const handleOpenEdit = (patient: MonitoringPatient) => {
    setEditMode(patient);
    setForm({ ...patient });
    setShowAddEditModal(true);
  };

  const handleCloseAddEdit = () => {
    setShowAddEditModal(false);
    setEditMode(null);
  };

  const handleFormChange = (field: keyof MonitoringPatient, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleVitalSignsChange = (
    field: keyof MonitoringPatient["vitalSigns"],
    value: any
  ) => {
    setForm((prev) => ({
      ...prev,
      vitalSigns: {
        ...prev.vitalSigns!,
        [field]: value,
      },
    }));
  };

  const handleAddEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editMode) {
      setData((prev) => prev.map((p) => (p.id === form.id ? { ...form } : p)));
    } else {
      setData((prev) => [{ ...form }, ...prev]);
    }
    setShowAddEditModal(false);
    setEditMode(null);
  };

  const handleOpenDelete = (patient: MonitoringPatient) => {
    setDeleteTarget(patient);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      setData((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleSendMessage = (patient: MonitoringPatient) => {
    setSelectedPatient(patient);
    setShowMessageModal(true);
    setMessageText("");
    setMessageSuccess(false);
  };

  const handleSubmitMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessageSuccess(true);
    if (selectedPatient) {
      setData((prev) =>
        prev.map((p) =>
          p.id === selectedPatient.id ? { ...p, notificationSent: true } : p
        )
      );
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "from-red-500 to-red-600";
      case "medium":
        return "from-amber-500 to-orange-500";
      case "low":
        return "from-emerald-500 to-green-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getRiskBorder = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "border-red-200 shadow-red-100";
      case "medium":
        return "border-amber-200 shadow-amber-100";
      case "low":
        return "border-emerald-200 shadow-emerald-100";
      default:
        return "border-gray-200 shadow-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#1F5C3F] to-[#10B981] rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Clinical Patient Monitoring
                </h1>
                <p className="text-sm text-slate-600">
                  AI-Powered Healthcare Analytics Dashboard
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-gradient-to-r from-emerald-500 to-[#10B981] p-3 rounded-lg text-white text-center">
                <div className="text-lg font-bold">{riskStats.total}</div>
                <div className="text-xs opacity-90">Total Patients</div>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-lg text-white text-center">
                <div className="text-lg font-bold">{riskStats.high}</div>
                <div className="text-xs opacity-90">High Risk</div>
              </div>
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-lg text-white text-center">
                <div className="text-lg font-bold">{riskStats.medium}</div>
                <div className="text-xs opacity-90">Medium Risk</div>
              </div>
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-3 rounded-lg text-white text-center">
                <div className="text-lg font-bold">{riskStats.low}</div>
                <div className="text-xs opacity-90">Low Risk</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-all duration-200 min-w-[300px]"
                  placeholder="Search patients by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <select
                  className="pl-10 pr-8 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-all duration-200"
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                >
                  <option value="all">All Risk Levels</option>
                  <option value="high">High Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="low">Low Risk</option>
                </select>
              </div>
            </div>
            <button
              className="bg-gradient-to-r from-[#1F5C3F] to-[#10B981] hover:from-[#1F5C3F]/90 hover:to-[#10B981]/90 text-white px-6 py-2.5 rounded-lg flex items-center space-x-2 shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={handleOpenAdd}
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Patient</span>
            </button>
          </div>

          {/* AI Query Section */}
          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50/30 to-emerald-50/30 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-[#1F5C3F]" />
              <span className="font-semibold text-[#1F5C3F]">
                AI Clinical Assistant
              </span>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                className="flex-1 border border-emerald-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] bg-white"
                placeholder="Ask AI about patient progress, risk assessment, treatment optimization..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
              />
              <span className="text-sm text-[#1F5C3F] self-center">
                💡 Try: "improve", "risk assessment", "appointment scheduling"
              </span>
            </div>
          </div>
        </div>

        {/* Patient Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredData.map((patient, index) => (
            <div
              key={patient.id}
              className={`bg-white rounded-xl shadow-lg border-2 ${getRiskBorder(
                patient.riskLevel!
              )} p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Patient Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${getRiskColor(
                      patient.riskLevel!
                    )} rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg`}
                  >
                    {patient.name[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {patient.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Clock className="h-4 w-4" />
                      <span>Updated {patient.lastUpdate}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    className="p-2 text-[#1F5C3F] hover:bg-emerald-50 rounded-lg transition-colors duration-200"
                    title="View Details"
                    onClick={() => handleOpenEdit(patient)}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Remove Patient"
                    onClick={() => handleOpenDelete(patient)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Risk Level Badge */}
              <div className="mb-4">
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
                    patient.riskLevel === "high"
                      ? "bg-red-100 text-red-800 border border-red-200"
                      : patient.riskLevel === "medium"
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  }`}
                >
                  <Shield className="w-4 h-4 mr-1.5" />
                  {patient.riskLevel?.toUpperCase()} RISK LEVEL
                </span>
              </div>

              {/* Vital Signs */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-gradient-to-br from-red-50 to-pink-50 p-3 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between">
                    <Heart className="h-5 w-5 text-red-600" />
                    <span className="text-xs text-red-600 font-medium">HR</span>
                  </div>
                  <div className="text-lg font-bold text-red-900 mt-1">
                    {patient.vitalSigns?.heartRate}
                  </div>
                  <div className="text-xs text-red-600">bpm</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-50 p-3 rounded-lg border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <TrendingUp className="h-5 w-5 text-[#1F5C3F]" />
                    <span className="text-xs text-[#1F5C3F] font-medium">
                      BP
                    </span>
                  </div>
                  <div className="text-sm font-bold text-[#1F5C3F] mt-1">
                    {patient.vitalSigns?.bloodPressure}
                  </div>
                  <div className="text-xs text-[#1F5C3F]">mmHg</div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-3 rounded-lg border border-amber-200">
                  <div className="flex items-center justify-between">
                    <Activity className="h-5 w-5 text-amber-600" />
                    <span className="text-xs text-amber-600 font-medium">
                      GLU
                    </span>
                  </div>
                  <div className="text-lg font-bold text-amber-900 mt-1">
                    {patient.vitalSigns?.glucose}
                  </div>
                  <div className="text-xs text-amber-600">mg/dL</div>
                </div>
              </div>

              {/* Progress Metrics */}
              <div className="space-y-4 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">
                      Treatment Adherence
                    </span>
                    <span className="text-sm font-bold text-[#1F5C3F]">
                      {patient.adherence}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-[#10B981] h-2.5 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${patient.adherence}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">
                      Nutrition Plan
                    </span>
                    <span className="text-sm font-bold text-emerald-600">
                      {patient.mealPlan}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-green-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${patient.mealPlan}%`,
                        animationDelay: "200ms",
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">
                      Protocol Compliance
                    </span>
                    <span className="text-sm font-bold text-[#1F5C3F]">
                      {patient.recommendations}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-[#10B981] to-emerald-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${patient.recommendations}%`,
                        animationDelay: "400ms",
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div
                className={`flex items-center space-x-3 mb-4 p-3 rounded-lg ${
                  patient.deviation
                    ? "bg-red-50 border border-red-200"
                    : "bg-emerald-50 border border-emerald-200"
                }`}
              >
                {patient.deviation ? (
                  <AlertTriangle className="h-5 w-5 text-red-600 animate-pulse" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                )}
                <span
                  className={`font-semibold ${
                    patient.deviation ? "text-red-700" : "text-emerald-700"
                  }`}
                >
                  {patient.deviation
                    ? "CLINICAL ATTENTION REQUIRED"
                    : "STABLE - ON TRACK"}
                </span>
              </div>

              {/* AI Message */}
              <div className="bg-gradient-to-r from-slate-50 to-emerald-50/30 rounded-lg p-4 mb-4 border border-slate-200">
                <div className="flex items-start space-x-2">
                  <Zap className="h-4 w-4 text-[#1F5C3F] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-[#1F5C3F] mb-1">
                      AI Clinical Assessment
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {patient.aiMessage}
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Query Section */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <button
                    className="bg-gradient-to-r from-[#1F5C3F] to-[#10B981] hover:from-[#1F5C3F]/90 hover:to-[#10B981]/90 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2 shadow-md transform hover:scale-105 transition-all duration-200"
                    onClick={() => handleAskAI(patient)}
                    disabled={aiLoading[patient.id]}
                  >
                    {aiLoading[patient.id] ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <Zap className="h-4 w-4" />
                    )}
                    <span>
                      {aiLoading[patient.id] ? "Analyzing..." : "Ask AI"}
                    </span>
                  </button>
                  {/* Show Recommendations button if AI has responded for this patient */}
                  {aiResponse[patient.id] && (
                    <button
                      className="ml-2 bg-gradient-to-r from-emerald-500 to-emerald-500 hover:from-[#1F5C3F]/90 hover:to-[#10B981]/90 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2 shadow-md transform hover:scale-105 transition-all duration-200"
                      onClick={() => {
                        setModalPatientId(patient.id);
                        setShowRecommendationsModal(true);
                      }}
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>Recommendations</span>
                    </button>
                  )}
                </div>
                {aiResponse[patient.id] && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 animate-slide-in">
                    <div className="text-xs font-semibold text-[#1F5C3F] mb-1">
                      AI Response
                    </div>
                    <p className="text-sm text-[#1F5C3F]">
                      {aiResponse[patient.id]}
                    </p>
                    {/* Practitioner Recommendation UI */}
                    <div className="mt-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50/30 border border-green-200 rounded-lg">
                      <div className="text-xs font-semibold text-green-800 mb-1 flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Practitioner Recommendation
                      </div>
                      <div className="text-sm text-green-700 whitespace-pre-line">
                        {doctorRecommendation[patient.id]}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Recommendations Modal */}
              {showRecommendationsModal && modalPatientId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 animate-slide-up">
                    <div className="p-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#1F5C3F] to-[#10B981] rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-slate-900">
                            AI Full Recommendations
                          </h2>
                          <p className="text-sm text-slate-600">
                            For:{" "}
                            {data.find((p) => p.id === modalPatientId)?.name}
                          </p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="text-xs font-semibold text-[#1F5C3F] mb-1">
                          AI Clinical Assessment
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {aiResponse[modalPatientId]}
                        </p>
                      </div>
                      <div className="mb-4">
                        <div className="text-xs font-semibold text-green-800 mb-1 flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          Practitioner Recommendation
                        </div>
                        <div className="text-sm text-green-700 whitespace-pre-line">
                          {doctorRecommendation[modalPatientId]}
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="text-xs font-semibold text-slate-800 mb-1 flex items-center">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Clinical Recommendations
                        </div>
                        <ul className="list-disc pl-6 text-sm text-slate-700">
                          {data
                            .find((p) => p.id === modalPatientId)
                            ?.aiSuggestions?.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                        </ul>
                      </div>
                      <button
                        onClick={() => setShowRecommendationsModal(false)}
                        className="w-full bg-gradient-to-r from-[#1F5C3F] to-[#10B981] hover:from-[#1F5C3F]/90 hover:to-[#10B981]/90 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 mt-4"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Clinical Recommendations */}
              <div className="mb-6">
                <div className="text-xs font-semibold text-slate-600 mb-2 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  CLINICAL RECOMMENDATIONS
                </div>
                <div className="space-y-2">
                  {patient.aiSuggestions?.slice(0, 2).map((suggestion, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-700 leading-relaxed">
                        {suggestion}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {patient.deviation && (
                  <button
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center space-x-2 shadow-md transform hover:scale-105 transition-all duration-200"
                    onClick={() => handleSendMessage(patient)}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>URGENT BOOKING</span>
                  </button>
                )}
                <button
                  className="border-2 border-slate-300 hover:border-emerald-400 hover:bg-emerald-50 text-slate-700 hover:text-[#1F5C3F] px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center space-x-2 transition-all duration-200"
                  onClick={() => handleSendMessage(patient)}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>

              {/* Notification Status */}
              {patient.notificationSent && (
                <div className="mt-4 flex items-center justify-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-lg p-3 animate-bounce-in">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">
                    Patient Notified Successfully
                  </span>
                  <Bell className="h-4 w-4 text-emerald-600" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="h-10 w-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No Patients Found
            </h3>
            <p className="text-slate-600 mb-6">
              Try adjusting your search criteria or risk level filter.
            </p>
            <button
              onClick={handleOpenAdd}
              className="bg-gradient-to-r from-[#1F5C3F] to-[#10B981] hover:from-[#1F5C3F]/90 hover:to-[#10B981]/90 text-white px-6 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-200"
            >
              Add First Patient
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${
                      editMode
                        ? "from-[#1F5C3F] to-[#10B981]"
                        : "from-emerald-600 to-green-600"
                    } rounded-lg flex items-center justify-center`}
                  >
                    {editMode ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Plus className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {editMode ? "Edit Patient Record" : "Add New Patient"}
                    </h2>
                    <p className="text-sm text-slate-600">
                      {editMode
                        ? "Update patient monitoring data"
                        : "Create comprehensive patient profile"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseAddEdit}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form
              onSubmit={handleAddEditSubmit}
              className="px-8 py-6 space-y-8"
            >
              {/* Patient Information */}
              <div className="space-y-6">
                <div className="border-l-4 border-[#10B981] pl-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Patient Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Patient Name *
                    </label>
                    <input
                      className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-all duration-200"
                      placeholder="Enter patient full name"
                      value={form.name}
                      onChange={(e) => handleFormChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Risk Level *
                    </label>
                    <select
                      className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-all duration-200"
                      value={form.riskLevel}
                      onChange={(e) =>
                        handleFormChange(
                          "riskLevel",
                          e.target.value as "low" | "medium" | "high"
                        )
                      }
                      required
                    >
                      <option value="low">Low Risk</option>
                      <option value="medium">Medium Risk</option>
                      <option value="high">High Risk</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Last Update *
                    </label>
                    <input
                      type="date"
                      className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-all duration-200"
                      value={form.lastUpdate}
                      onChange={(e) =>
                        handleFormChange("lastUpdate", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Vital Signs */}
              <div className="space-y-6">
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Vital Signs
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Heart Rate (bpm) *
                    </label>
                    <input
                      type="number"
                      min={40}
                      max={200}
                      className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                      placeholder="72"
                      value={form.vitalSigns?.heartRate || ""}
                      onChange={(e) =>
                        handleVitalSignsChange(
                          "heartRate",
                          Number(e.target.value)
                        )
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Blood Pressure *
                    </label>
                    <input
                      type="text"
                      className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-all duration-200"
                      placeholder="120/80"
                      value={form.vitalSigns?.bloodPressure || ""}
                      onChange={(e) =>
                        handleVitalSignsChange("bloodPressure", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Glucose (mg/dL) *
                    </label>
                    <input
                      type="number"
                      min={50}
                      max={400}
                      className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                      placeholder="95"
                      value={form.vitalSigns?.glucose || ""}
                      onChange={(e) =>
                        handleVitalSignsChange(
                          "glucose",
                          Number(e.target.value)
                        )
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Clinical Metrics */}
              <div className="space-y-6">
                <div className="border-l-4 border-emerald-500 pl-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Clinical Compliance Metrics
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Treatment Adherence (%) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-all duration-200"
                      placeholder="85"
                      value={form.adherence}
                      onChange={(e) =>
                        handleFormChange("adherence", Number(e.target.value))
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nutrition Plan (%) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      placeholder="80"
                      value={form.mealPlan}
                      onChange={(e) =>
                        handleFormChange("mealPlan", Number(e.target.value))
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Protocol Compliance (%) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-all duration-200"
                      placeholder="90"
                      value={form.recommendations}
                      onChange={(e) =>
                        handleFormChange(
                          "recommendations",
                          Number(e.target.value)
                        )
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Clinical Assessment */}
              <div className="space-y-6">
                <div className="border-l-4 border-[#10B981] pl-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Clinical Assessment
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Clinical Deviation Status *
                    </label>
                    <select
                      className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-all duration-200"
                      value={form.deviation ? "yes" : "no"}
                      onChange={(e) =>
                        handleFormChange("deviation", e.target.value === "yes")
                      }
                    >
                      <option value="no">No Deviation - Stable</option>
                      <option value="yes">
                        Deviation Detected - Requires Attention
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    AI Clinical Assessment *
                  </label>
                  <textarea
                    rows={4}
                    className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-all duration-200 resize-none"
                    placeholder="Enter detailed clinical assessment and AI-generated recommendations..."
                    value={form.aiMessage}
                    onChange={(e) =>
                      handleFormChange("aiMessage", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="border-t border-slate-200 pt-6">
                <button
                  type="submit"
                  className={`w-full bg-gradient-to-r ${
                    editMode
                      ? "from-[#1F5C3F] to-[#10B981] hover:from-[#1F5C3F]/90 hover:to-[#10B981]/90"
                      : "from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  } text-white px-6 py-4 rounded-lg font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-200`}
                >
                  {editMode ? "Update Patient Record" : "Add Patient to System"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slide-up">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-red-600 animate-pulse" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Remove Patient Record
              </h2>
              <p className="text-slate-600 mb-2">
                Are you sure you want to permanently remove
              </p>
              <p className="text-lg font-semibold text-red-700 mb-6">
                {deleteTarget?.name}
              </p>
              <p className="text-sm text-slate-500 mb-8">
                This action cannot be undone and will remove all associated
                medical data.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 border-2 border-slate-300 hover:border-slate-400 text-slate-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Remove Patient
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 animate-slide-up">
            {!messageSuccess ? (
              <div>
                <div className="border-b border-slate-200 px-8 py-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1F5C3F] to-[#10B981] rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        Send Clinical Message
                      </h2>
                      <p className="text-sm text-slate-600">
                        To: {selectedPatient?.name}
                      </p>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmitMessage}
                  className="px-8 py-6 space-y-6"
                >
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Message Content
                    </label>
                    <textarea
                      className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-all duration-200 resize-none"
                      rows={6}
                      placeholder="Enter your message to the patient..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowMessageModal(false)}
                      className="flex-1 border-2 border-slate-300 hover:border-slate-400 text-slate-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-[#1F5C3F] to-[#10B981] hover:from-[#1F5C3F]/90 hover:to-[#10B981]/90 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-600 animate-bounce" />
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  Message Delivered
                </h2>
                <p className="text-slate-600 mb-2">
                  Your message has been successfully sent to
                </p>
                <p className="text-lg font-semibold text-emerald-700 mb-6">
                  {selectedPatient?.name}
                </p>
                <p className="text-sm text-slate-500 mb-8">
                  The patient will receive a notification and can respond
                  through the patient portal.
                </p>

                <button
                  onClick={() => setShowMessageModal(false)}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
