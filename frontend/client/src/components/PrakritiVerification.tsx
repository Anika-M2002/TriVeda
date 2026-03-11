import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  Edit,
  User,
  Shield,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Send,
  ClipboardCheck,
  Cloud,
  Flame,
  Droplet,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  UserCheck,
  Clock,
  Eye,
  Trash2,
  Save,
  X,
  FileText,
  Activity,
  Heart,
  Brain,
  Zap,
  Wind,
  Settings,
  Download,
  /* Print, */
  Share,
  ChevronDown,
  Info,
  TrendingUp,
  BarChart3,
  Stethoscope,
} from "lucide-react";

// Enhanced patient data with medical details
const mockPatients = [
  {
    id: "MED-001",
    name: "Aarav Sharma",
    age: 28,
    gender: "Male",
    phone: "+91 98765 43210",
    email: "aarav.sharma@email.com",
    lastVisit: "2024-01-15",
    medicalId: "AYU-2024-001",
    priority: "high",
    assessment: {
      vata: 3,
      pitta: 2,
      kapha: 3,
      status: "pending",
      confidence: 75,
      completedDate: "2024-01-15",
      answers: {
        "body-frame": "thin",
        "skin-type": "dry",
        appetite: "irregular",
        sleep: "light",
        energy: "bursts",
        digestion: "variable",
        temperament: "creative",
        weather: "warm",
      },
      finalDosha: null,
      doctorNotes: "",
      riskFactors: ["stress", "irregular_sleep"],
      recommendations: [],
    },
  },
  {
    id: "MED-002",
    name: "Priya Verma",
    age: 34,
    gender: "Female",
    phone: "+91 87654 32109",
    email: "priya.verma@email.com",
    lastVisit: "2024-01-10",
    medicalId: "AYU-2024-002",
    priority: "medium",
    assessment: {
      vata: 1,
      pitta: 5,
      kapha: 2,
      status: "verified",
      confidence: 92,
      completedDate: "2024-01-10",
      answers: {
        "body-frame": "medium",
        "skin-type": "warm",
        appetite: "strong",
        sleep: "moderate",
        energy: "intense",
        digestion: "strong",
        temperament: "focused",
        weather: "cool",
      },
      finalDosha: "pitta",
      doctorNotes:
        "Assessment matches patient features. Finalized as Pitta dominant. Recommend cooling therapies and stress management.",
      riskFactors: ["heat_sensitivity"],
      recommendations: ["cooling_diet", "meditation", "avoid_spicy_foods"],
    },
  },
  {
    id: "MED-003",
    name: "Rohit Sen",
    age: 41,
    gender: "Male",
    phone: "+91 76543 21098",
    email: "rohit.sen@email.com",
    lastVisit: "2024-01-12",
    medicalId: "AYU-2024-003",
    priority: "low",
    assessment: {
      vata: 2,
      pitta: 2,
      kapha: 4,
      status: "pending",
      confidence: 68,
      completedDate: "2024-01-12",
      answers: {
        "body-frame": "large",
        "skin-type": "thick",
        appetite: "steady",
        sleep: "deep",
        energy: "steady",
        digestion: "slow",
        temperament: "calm",
        weather: "warm-dry",
      },
      finalDosha: null,
      doctorNotes: "",
      riskFactors: ["sedentary_lifestyle"],
      recommendations: [],
    },
  },
];

const doshaConfig = {
  vata: {
    icon: <Wind className="h-4 w-4" />,
    name: "Vata",
    element: "Air + Space",
    color: "text-[#1F5C3F]",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    badgeColor: "bg-emerald-100 text-[#1F5C3F]",
  },
  pitta: {
    icon: <Flame className="h-4 w-4" />,
    name: "Pitta",
    element: "Fire + Water",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    badgeColor: "bg-orange-100 text-orange-800",
  },
  kapha: {
    icon: <Droplet className="h-4 w-4" />,
    name: "Kapha",
    element: "Water + Earth",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    badgeColor: "bg-emerald-100 text-emerald-800",
  },
};

const priorityConfig = {
  high: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: <AlertCircle className="h-3 w-3" />,
  },
  medium: {
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: <Clock className="h-3 w-3" />,
  },
  low: {
    color: "bg-slate-100 text-slate-600 border-slate-200",
    icon: <Info className="h-3 w-3" />,
  },
};

const questions = [
  { id: "body-frame", label: "Body Frame", icon: <User className="h-3 w-3" /> },
  { id: "skin-type", label: "Skin Type", icon: <Heart className="h-3 w-3" /> },
  { id: "appetite", label: "Appetite", icon: <Activity className="h-3 w-3" /> },
  { id: "sleep", label: "Sleep Pattern", icon: <Clock className="h-3 w-3" /> },
  { id: "energy", label: "Energy Levels", icon: <Zap className="h-3 w-3" /> },
  {
    id: "digestion",
    label: "Digestion",
    icon: <Activity className="h-3 w-3" />,
  },
  {
    id: "temperament",
    label: "Temperament",
    icon: <Brain className="h-3 w-3" />,
  },
  {
    id: "weather",
    label: "Weather Preference",
    icon: <Cloud className="h-3 w-3" />,
  },
];

export default function ProfessionalPrakritiVerification() {
  const [patients, setPatients] = useState(mockPatients);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<any>({});
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [viewDetailsId, setViewDetailsId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditingId(id);
    const patient = patients.find((p) => p.id === id);
    if (patient) {
      setEditState({
        finalDosha: patient.assessment.finalDosha || "",
        doctorNotes: patient.assessment.doctorNotes || "",
        recommendations: patient.assessment.recommendations || [],
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditState({});
  };

  const handleSave = (id: string) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              assessment: {
                ...p.assessment,
                finalDosha: editState.finalDosha,
                doctorNotes: editState.doctorNotes,
                recommendations: editState.recommendations,
                status: "verified",
                confidence: 95,
              },
            }
          : p
      )
    );
    setEditingId(null);
    setEditState({});
  };

  const handleInputChange = (field: string, value: string) => {
    setEditState((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this patient record?")) {
      setPatients((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setEditState({});
      }
    }
  };

  const getDominantDosha = (assessment: any) => {
    const { vata, pitta, kapha } = assessment;
    const max = Math.max(vata, pitta, kapha);
    if (vata === max) return "vata";
    if (pitta === max) return "pitta";
    return "kapha";
  };

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.medicalId.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || p.assessment.status === filterStatus;
      const matchesPriority =
        filterPriority === "all" || p.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [patients, search, filterStatus, filterPriority]);

  const stats = {
    total: patients.length,
    pending: patients.filter((p) => p.assessment.status === "pending").length,
    verified: patients.filter((p) => p.assessment.status === "verified").length,
    highPriority: patients.filter((p) => p.priority === "high").length,
  };

  return (
  <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Stethoscope className="h-8 w-8 text-[#1F5C3F]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Prakriti Assessment Center
                </h1>
                <p className="text-slate-600 mt-1">
                  Medical constitutional analysis and verification system
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="text-slate-600 border-slate-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              {/* Print button removed due to missing icon */}
              <Button
                size="sm"
                className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <User className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Patients</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-amber-700">Pending Review</p>
                  <p className="text-2xl font-bold text-amber-800">
                    {stats.pending}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-emerald-700">Verified</p>
                  <p className="text-2xl font-bold text-emerald-800">
                    {stats.verified}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-red-700">High Priority</p>
                  <p className="text-2xl font-bold text-red-800">
                    {stats.highPriority}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name, ID, or medical ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] bg-white"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] bg-white min-w-[120px]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] bg-white min-w-[120px]"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Patient Cards */}
        <div className="grid xl:grid-cols-2 gap-6">
          {filteredPatients.map((patient) => {
            const dominantDosha = getDominantDosha(patient.assessment);
            const doshaInfo =
              doshaConfig[dominantDosha as keyof typeof doshaConfig];

            return (
              <Card
                key={patient.id}
                className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                        <User className="h-6 w-6 text-[#1F5C3F]" />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-lg font-semibold text-slate-900">
                          {patient.name}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span>
                            {patient.age} years, {patient.gender}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(patient.lastVisit).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono">
                          {patient.medicalId}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge
                        className={`text-xs px-2 py-1 border ${
                          priorityConfig[
                            patient.priority as keyof typeof priorityConfig
                          ].color
                        }`}
                      >
                        {
                          priorityConfig[
                            patient.priority as keyof typeof priorityConfig
                          ].icon
                        }
                        <span className="ml-1 capitalize">
                          {patient.priority}
                        </span>
                      </Badge>
                      <Badge
                        className={`text-xs px-2 py-1 border ${
                          patient.assessment.status === "verified"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                        }`}
                      >
                        {patient.assessment.status === "verified" ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {patient.assessment.status === "verified"
                          ? "Verified"
                          : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Dosha Analysis */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-[#1F5C3F]" />
                      Constitutional Analysis
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(doshaConfig).map(([key, config]) => {
                        const value = patient.assessment[
                          key as keyof typeof patient.assessment
                        ] as number;
                        const percentage = (value / 8) * 100;
                        return (
                          <div
                            key={key}
                            className={`p-3 rounded-lg border ${config.borderColor} ${config.bgColor}`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className={config.color}>{config.icon}</div>
                              <span
                                className={`font-medium text-sm ${config.color}`}
                              >
                                {config.name}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span
                                  className={`text-lg font-bold ${config.color}`}
                                >
                                  {value}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {percentage.toFixed(0)}%
                                </span>
                              </div>
                              <Progress
                                value={percentage}
                                className={`h-1.5 ${config.bgColor}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Confidence Score:</span>
                      <Badge variant="outline" className="text-slate-700">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {patient.assessment.confidence}%
                      </Badge>
                    </div>
                  </div>

                  {/* Assessment Details */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#1F5C3F]" />
                      Assessment Response
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {questions.map((q) => (
                        <div
                          key={q.id}
                          className="flex items-center gap-2 p-2 bg-slate-50 rounded border"
                        >
                          <div className="text-slate-500">{q.icon}</div>
                          <span className="font-medium text-slate-600">
                            {q.label}:
                          </span>
                          <span className="text-slate-800 capitalize ml-auto">
                            {
                              patient.assessment.answers[
                                q.id as keyof typeof patient.assessment.answers
                              ]
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Doctor's Review Section */}
                  {editingId === patient.id ? (
                    <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Edit className="h-4 w-4 text-[#1F5C3F]" />
                        Medical Review & Verification
                      </h4>

                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">
                            Final Constitutional Type
                          </Label>
                          <RadioGroup
                            value={editState.finalDosha}
                            onValueChange={(val) =>
                              handleInputChange("finalDosha", val)
                            }
                            className="flex gap-6"
                          >
                            {Object.entries(doshaConfig).map(
                              ([key, config]) => (
                                <div
                                  key={key}
                                  className="flex items-center space-x-2"
                                >
                                  <RadioGroupItem
                                    value={key}
                                    id={`${patient.id}-${key}`}
                                  />
                                  <Label
                                    htmlFor={`${patient.id}-${key}`}
                                    className="flex items-center gap-2 cursor-pointer"
                                  >
                                    <div className={config.color}>
                                      {config.icon}
                                    </div>
                                    <span className="font-medium">
                                      {config.name}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                      ({config.element})
                                    </span>
                                  </Label>
                                </div>
                              )
                            )}
                          </RadioGroup>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">
                            Clinical Notes & Observations
                          </Label>
                          <textarea
                            className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] resize-none"
                            rows={4}
                            value={editState.doctorNotes}
                            onChange={(e) =>
                              handleInputChange("doctorNotes", e.target.value)
                            }
                            placeholder="Add your clinical observations, recommendations, and any additional notes..."
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => handleSave(patient.id)}
                          disabled={!editState.finalDosha}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Verify & Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                          className="border-slate-300 text-slate-700"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(patient.id)}
                          className="border-red-300 text-red-700 hover:bg-red-50 ml-auto"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Final Assessment */}
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-[#1F5C3F]" />
                          Medical Assessment
                        </h4>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">
                              Final Constitution:
                            </span>
                            {patient.assessment.finalDosha ? (
                              <Badge
                                className={
                                  doshaConfig[
                                    patient.assessment
                                      .finalDosha as keyof typeof doshaConfig
                                  ].badgeColor
                                }
                              >
                                {
                                  doshaConfig[
                                    patient.assessment
                                      .finalDosha as keyof typeof doshaConfig
                                  ].icon
                                }
                                <span className="ml-1">
                                  {
                                    doshaConfig[
                                      patient.assessment
                                        .finalDosha as keyof typeof doshaConfig
                                    ].name
                                  }{" "}
                                  Dominant
                                </span>
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-amber-700 border-amber-300 bg-amber-50"
                              >
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Awaiting Review
                              </Badge>
                            )}
                          </div>

                          {patient.assessment.doctorNotes && (
                            <div className="space-y-2">
                              <span className="text-sm font-medium text-slate-600">
                                Clinical Notes:
                              </span>
                              <p className="text-sm text-slate-800 bg-white p-3 rounded border border-slate-200 leading-relaxed">
                                {patient.assessment.doctorNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3">
                        {patient.assessment.status !== "verified" && (
                          <Button
                            size="sm"
                            onClick={() => handleEdit(patient.id)}
                            className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Review & Verify
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-300 text-slate-700"
                          onClick={() => setViewDetailsId(patient.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-300 text-slate-700"
                        >
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </Button>

                        {patient.assessment.status !== "verified" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(patient.id)}
                            className="border-red-300 text-red-700 hover:bg-red-50 ml-auto"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-600" />
                HIPAA Compliant System
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#1F5C3F]" />
                All actions logged & audited
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" />
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>Powered by Ayurvedic Medical Intelligence</span>
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredPatients.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No patients found
            </h3>
            <p className="text-slate-600 mb-4">
              {search || filterStatus !== "all" || filterPriority !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No patient assessments available at this time"}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setFilterStatus("all");
                setFilterPriority("all");
              }}
              className="border-slate-300 text-slate-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        )}
      {/* View Details Modal */}
      {viewDetailsId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl relative animate-fade-in overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setViewDetailsId(null)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            {(() => {
              const patient = patients.find((p) => p.id === viewDetailsId);
              if (!patient) return null;
              const dominantDosha = getDominantDosha(patient.assessment);
              const doshaInfo = doshaConfig[dominantDosha as keyof typeof doshaConfig];
              return (
                <>
                  <h2 className="text-2xl font-bold text-[#1F5C3F] mb-2 flex items-center gap-2">
                    <User className="h-6 w-6 text-[#1F5C3F]" /> Patient Details
                  </h2>
                  <div className="mb-2 text-sm text-slate-600">
                    <span className="font-semibold">Name:</span> {patient.name}<br />
                    <span className="font-semibold">Age:</span> {patient.age} | <span className="font-semibold">Gender:</span> {patient.gender}<br />
                    <span className="font-semibold">Phone:</span> {patient.phone}<br />
                    <span className="font-semibold">Email:</span> {patient.email}<br />
                    <span className="font-semibold">Medical ID:</span> {patient.medicalId}<br />
                    <span className="font-semibold">Last Visit:</span> {new Date(patient.lastVisit).toLocaleDateString()}<br />
                    <span className="font-semibold">Priority:</span> <Badge className={priorityConfig[patient.priority as keyof typeof priorityConfig].color}>{priorityConfig[patient.priority as keyof typeof priorityConfig].icon}<span className="ml-1 capitalize">{patient.priority}</span></Badge>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-[#1F5C3F]" /> Dosha Analysis
                    </h3>
                    <div className="grid grid-cols-3 gap-3 mb-2">
                      {Object.entries(doshaConfig).map(([key, config]) => {
                        const value = patient.assessment[key as keyof typeof patient.assessment] as number;
                        const percentage = (value / 8) * 100;
                        return (
                          <div key={key} className={`p-3 rounded-lg border ${config.borderColor} ${config.bgColor}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <div className={config.color}>{config.icon}</div>
                              <span className={`font-medium text-sm ${config.color}`}>{config.name}</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className={`text-lg font-bold ${config.color}`}>{value}</span>
                                <span className="text-xs text-slate-500">{percentage.toFixed(0)}%</span>
                              </div>
                              <Progress value={percentage} className={`h-1.5 ${config.bgColor}`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Confidence Score:</span>
                      <Badge variant="outline" className="text-slate-700">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {patient.assessment.confidence}%
                      </Badge>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[#1F5C3F]" /> Assessment Answers
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {questions.map((q) => (
                        <div key={q.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded border">
                          <div className="text-slate-500">{q.icon}</div>
                          <span className="font-medium text-slate-600">{q.label}:</span>
                          <span className="text-slate-800 capitalize ml-auto">{patient.assessment.answers[q.id as keyof typeof patient.assessment.answers]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-[#1F5C3F]" /> Medical Assessment
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-slate-600">Final Constitution:</span>
                      {patient.assessment.finalDosha ? (
                        <Badge className={doshaConfig[patient.assessment.finalDosha as keyof typeof doshaConfig].badgeColor}>
                          {doshaConfig[patient.assessment.finalDosha as keyof typeof doshaConfig].icon}
                          <span className="ml-1">{doshaConfig[patient.assessment.finalDosha as keyof typeof doshaConfig].name} Dominant</span>
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50">
                          <AlertCircle className="h-3 w-3 mr-1" /> Awaiting Review
                        </Badge>
                      )}
                    </div>
                    {patient.assessment.doctorNotes && (
                      <div className="space-y-2">
                        <span className="text-sm font-medium text-slate-600">Clinical Notes:</span>
                        <p className="text-sm text-slate-800 bg-white p-3 rounded border border-slate-200 leading-relaxed">{patient.assessment.doctorNotes}</p>
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-[#1F5C3F]" /> Risk Factors
                    </h3>
                    <ul className="list-disc pl-6 text-sm text-slate-700">
                      {patient.assessment.riskFactors.map((rf: string, idx: number) => (
                        <li key={idx}>{rf.replace(/_/g, " ")}</li>
                      ))}
                    </ul>
                  </div>
                  {patient.assessment.recommendations && patient.assessment.recommendations.length > 0 && (
                    <div className="mb-2">
                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-[#1F5C3F]" /> Recommendations
                      </h3>
                      <ul className="list-disc pl-6 text-sm text-slate-700">
                        {patient.assessment.recommendations.map((rec: string, idx: number) => (
                          <li key={idx}>{rec.replace(/_/g, " ")}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
          <style>{`
            .animate-fade-in {
              animation: fadeInModal 0.25s cubic-bezier(0.4,0,0.2,1);
            }
            @keyframes fadeInModal {
              from { opacity: 0; transform: translateY(40px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </div>
  </div>
  );
}
