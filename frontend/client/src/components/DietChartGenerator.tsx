import React, { useState } from "react";
import {
  Stethoscope,
  Users,
  Activity,
  Clock,
  CheckCircle,
  PlusCircle,
  AlertCircle,
  RefreshCw,
  Edit,
  FileText,
  Eye,
  Trash2,
  Calendar,
  X,
  Utensils,
  BookOpen,
  ChevronRight,
  Heart,
  Shield,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
// ...existing code...
const mockPatients = [
  { id: "p1", name: "Aarav Sharma", age: 32, condition: "Digestive Issues" },
  { id: "p2", name: "Priya Verma", age: 28, condition: "Weight Management" },
  { id: "p3", name: "Rohit Sen", age: 45, condition: "Diabetes Type 2" },
  { id: "p4", name: "Meera Iyer", age: 38, condition: "Hypertension" },
  { id: "p5", name: "Sanjay Patel", age: 52, condition: "High Cholesterol" },
  { id: "p6", name: "Fatima Khan", age: 29, condition: "PCOS" },
  { id: "p7", name: "Vikas Gupta", age: 41, condition: "Joint Pain" },
  { id: "p8", name: "Anjali Desai", age: 35, condition: "Stress Management" },
  { id: "p9", name: "Ritu Singh", age: 26, condition: "Immunity Boost" },
  { id: "p10", name: "Deepak Joshi", age: 48, condition: "Sleep Disorders" },
];

// Mock food database for manual creation
const mockFoodDatabase = [
  {
    id: "1",
    name: "Poha",
    category: "Breakfast",
    rasa: "Sweet",
    virya: "Cooling",
    vipaka: "Sweet",
    dosha: "Balances Pitta",
    calories: 180,
    protein: 4,
    carbs: 35,
    fat: 2,
  },
  {
    id: "2",
    name: "Brown Rice",
    category: "Grains",
    rasa: "Sweet",
    virya: "Cooling",
    vipaka: "Sweet",
    dosha: "Balances all Doshas",
    calories: 220,
    protein: 5,
    carbs: 45,
    fat: 2,
  },
  {
    id: "3",
    name: "Moong Dal",
    category: "Legumes",
    rasa: "Sweet",
    virya: "Cooling",
    vipaka: "Sweet",
    dosha: "Balances Pitta",
    calories: 150,
    protein: 12,
    carbs: 25,
    fat: 1,
  },
  {
    id: "4",
    name: "Cucumber",
    category: "Vegetables",
    rasa: "Sweet",
    virya: "Cooling",
    vipaka: "Sweet",
    dosha: "Balances Pitta",
    calories: 15,
    protein: 1,
    carbs: 4,
    fat: 0,
  },
  {
    id: "5",
    name: "Coconut Water",
    category: "Beverages",
    rasa: "Sweet",
    virya: "Cooling",
    vipaka: "Sweet",
    dosha: "Balances Pitta",
    calories: 45,
    protein: 2,
    carbs: 9,
    fat: 0,
  },
  {
    id: "6",
    name: "Khichdi",
    category: "Complete Meals",
    rasa: "Sweet",
    virya: "Neutral",
    vipaka: "Sweet",
    dosha: "Balances all Doshas",
    calories: 200,
    protein: 8,
    carbs: 40,
    fat: 3,
  },
  {
    id: "7",
    name: "Ghee",
    category: "Fats",
    rasa: "Sweet",
    virya: "Cooling",
    vipaka: "Sweet",
    dosha: "Balances Vata",
    calories: 120,
    protein: 0,
    carbs: 0,
    fat: 14,
  },
  {
    id: "8",
    name: "Buttermilk",
    category: "Beverages",
    rasa: "Sour",
    virya: "Cooling",
    vipaka: "Sweet",
    dosha: "Balances Pitta",
    calories: 60,
    protein: 3,
    carbs: 8,
    fat: 2,
  },
];

interface DietChartType {
  id?: string;
  patientId: string;
  patientName: string;
  prakriti: string;
  status: string;
  meals: Array<{
    meal: string;
    foods: string[];
    time: string;
    rationale: string;
    calories: number;
    recipes: Array<{ name: string; benefit: string }>;
  }>;
  recommendations: string[];
  generatedBy: string;
  lastUpdated: string;
}

const initialDietCharts: DietChartType[] = [
  {
    id: "d1",
    patientId: "p1",
    patientName: "Aarav Sharma",
    prakriti: "Vata",
    status: "active",
    meals: [
      {
        meal: "Breakfast",
        foods: ["Oat Porridge", "Ghee", "Almonds", "Herbal Tea"],
        time: "8:00 AM",
        rationale:
          "Warm, nourishing breakfast to balance Vata and fuel morning energy",
        calories: 320,
        recipes: [
          {
            name: "Vata-Balancing Oat Porridge",
            benefit: "Warm, grounding, and easy to digest for morning energy.",
          },
        ],
      },
      {
        meal: "Lunch",
        foods: ["Quinoa Bowl", "Steamed Vegetables", "Buttermilk"],
        time: "1:00 PM",
        rationale:
          "Complete protein with cooling properties, main meal when Agni is strongest",
        calories: 450,
        recipes: [
          {
            name: "Quinoa Vegetable Bowl",
            benefit:
              "High protein, cooling, and balances all doshas at midday.",
          },
        ],
      },
      {
        meal: "Dinner",
        foods: ["Moong Dal Khichdi", "Steamed Greens", "Chamomile Tea"],
        time: "7:30 PM",
        rationale:
          "Light, easily digestible meal that promotes restful sleep and overnight healing",
        calories: 280,
        recipes: [
          {
            name: "Moong Dal Khichdi",
            benefit:
              "Easily digestible, protein-rich, and calming for restful sleep.",
          },
        ],
      },
    ],
    recommendations: [
      "Eat warm, cooked foods to support digestion",
      "Avoid cold, raw foods that can disturb Vata",
      "Practice regular meal times for metabolic balance",
      "Stay hydrated with warm herbal teas",
    ],
    generatedBy: "AI Nutritionist",
    lastUpdated: new Date().toISOString().slice(0, 10),
  },
];

// Manual creation state
const defaultManualChart = {
  patientId: "",
  patientName: "",
  prakriti: "",
  status: "draft",
  meals: [
    {
      meal: "Breakfast",
      foods: [],
      time: "8:00 AM",
      rationale: "",
      calories: 0,
      recipes: [],
    },
    {
      meal: "Lunch",
      foods: [],
      time: "1:00 PM",
      rationale: "",
      calories: 0,
      recipes: [],
    },
    {
      meal: "Snack",
      foods: [],
      time: "4:30 PM",
      rationale: "",
      calories: 0,
      recipes: [],
    },
    {
      meal: "Dinner",
      foods: [],
      time: "7:00 PM",
      rationale: "",
      calories: 0,
      recipes: [],
    },
  ],
  recommendations: [],
  generatedBy: "Ayurvedic Doctor",
  lastUpdated: new Date().toISOString().slice(0, 10),
};

export default function DietChartGenerator() {
  // ...existing code...

  // Helper function for rendering the view modal (now has access to state)
  function renderDietChartViewModal() {
    const chart = dietCharts.find((d) => d.id === viewId);
    if (!chart) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-600 rounded-lg">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Diet Chart Details
                  </h2>
                  <p className="text-sm text-slate-600">
                    {chart.patientName} • {chart.prakriti} Constitution
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setViewId(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {/* Patient Summary */}
            <div className="bg-gradient-to-r from-slate-50 to-emerald-50/30 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-slate-600">Patient</span>
                  <div className="font-semibold text-slate-900">
                    {chart.patientName}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-slate-600">Constitution</span>
                  <div>
                    <Badge className={getPrakritiColor(chart.prakriti)}>
                      {chart.prakriti}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-slate-600">Status</span>
                  <div>
                    <Badge className={getStatusColor(chart.status)}>
                      {chart.status.charAt(0).toUpperCase() +
                        chart.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            {/* Meal Plan */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Daily Meal Plan
              </h3>
              <div className="grid gap-4">
                {chart.meals.map((meal: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                          <Utensils className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">
                            {meal.meal}
                          </h4>
                          <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <Clock className="h-3 w-3" />
                            <span>{meal.time}</span>
                            <span>•</span>
                            <span>{meal.calories} kcal</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-2">
                        {meal.foods.map((food: string, foodIdx: number) => (
                          <Badge
                            key={foodIdx}
                            className="bg-slate-100 text-slate-700 border-slate-200"
                          >
                            {food}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {meal.rationale && (
                      <div className="bg-emerald-50 rounded-lg p-3 mb-3">
                        <div className="flex items-start space-x-2">
                          <Shield className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-slate-700 italic">
                            {meal.rationale}
                          </p>
                        </div>
                      </div>
                    )}
                    {meal.recipes && meal.recipes.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-slate-900">
                          Recommended Preparations:
                        </h5>
                        {meal.recipes.map((recipe: any, recipeIdx: number) => (
                          <div
                            key={recipeIdx}
                            className="bg-emerald-50 rounded-lg p-3"
                          >
                            <div className="flex items-start space-x-2">
                              <BookOpen className="h-4 w-4 text-[#1F5C3F] mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="font-medium text-[#1F5C3F] text-sm">
                                  {recipe.name}
                                </div>
                                <div className="text-xs text-[#1F5C3F]">
                                  {recipe.benefit}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Recommendations */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Lifestyle Recommendations
              </h3>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                {chart.recommendations.length > 0 ? (
                  <div className="space-y-3">
                    {chart.recommendations.map((rec: string, idx: number) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-slate-700">{rec}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-500">
                      No specific recommendations provided
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Chart Metadata */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Created by:</span>
                  <div className="font-medium text-slate-900">
                    {chart.generatedBy}
                  </div>
                </div>
                <div>
                  <span className="text-slate-600">Last Updated:</span>
                  <div className="font-medium text-slate-900">
                    {chart.lastUpdated}
                  </div>
                </div>
                <div>
                  <span className="text-slate-600">Chart ID:</span>
                  <div className="font-medium text-slate-900">{chart.id}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const [dietCharts, setDietCharts] =
    useState<DietChartType[]>(initialDietCharts);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editState, setEditState] = useState<any>({});
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishedPatient, setPublishedPatient] = useState<string>("");
  const [manualMode, setManualMode] = useState<string | null>(null);
  const [manualChart, setManualChart] = useState<any>({
    ...defaultManualChart,
  });
  const [manualStep, setManualStep] = useState(1);
  const [manualSearch, setManualSearch] = useState("");
  const [selectedMealIdx, setSelectedMealIdx] = useState(0);

  // Find patients without a generated diet chart
  const patientsWithoutChart = mockPatients.filter(
    (p) => !dietCharts.some((d) => d.patientId === p.id)
  );

  // Generate diet chart (mock AI)
  const handleGenerate = (patient: any) => {
    setGeneratingId(patient.id);
    setTimeout(() => {
      setDietCharts((prev) => [
        ...prev,
        {
          id: `d${prev.length + 1}`,
          patientId: patient.id,
          patientName: patient.name,
          prakriti: ["Vata", "Pitta", "Kapha"][Math.floor(Math.random() * 3)],
          status: "active",
          meals: [
            {
              meal: "Breakfast",
              foods: ["Oat Porridge", "Ghee", "Almonds", "Herbal Tea"],
              time: "8:00 AM",
              rationale:
                "Warm, nourishing breakfast to balance Vata and fuel morning energy",
              calories: 320,
              recipes: [
                {
                  name: "Vata-Balancing Oat Porridge",
                  benefit:
                    "Warm, grounding, and easy to digest for morning energy.",
                },
              ],
            },
            {
              meal: "Lunch",
              foods: ["Quinoa Bowl", "Steamed Vegetables", "Buttermilk"],
              time: "1:00 PM",
              rationale:
                "Complete protein with cooling properties, main meal when Agni is strongest",
              calories: 450,
              recipes: [
                {
                  name: "Quinoa Vegetable Bowl",
                  benefit:
                    "High protein, cooling, and balances all doshas at midday.",
                },
              ],
            },
            {
              meal: "Dinner",
              foods: ["Moong Dal Khichdi", "Steamed Greens", "Chamomile Tea"],
              time: "7:30 PM",
              rationale:
                "Light, easily digestible meal that promotes restful sleep and overnight healing",
              calories: 280,
              recipes: [
                {
                  name: "Moong Dal Khichdi",
                  benefit:
                    "Easily digestible, protein-rich, and calming for restful sleep.",
                },
              ],
            },
          ],
          recommendations: [
            "Eat warm, cooked foods to support digestion",
            "Avoid cold, raw foods that can disturb balance",
            "Practice regular meal times for metabolic health",
            "Stay hydrated with appropriate beverages",
          ],
          generatedBy: "AI Nutritionist",
          lastUpdated: new Date().toISOString().slice(0, 10),
        },
      ]);
      setGeneratingId(null);
      setPublishedPatient(patient.name);
      setShowPublishModal(true);
    }, 2000);
  };

  // Manual creation handlers
  const handleManualStart = (patient: any) => {
    setManualMode(patient.id);
    setManualChart({
      ...defaultManualChart,
      patientId: patient.id,
      patientName: patient.name,
      prakriti: ["Vata", "Pitta", "Kapha"][Math.floor(Math.random() * 3)],
      id: `d${dietCharts.length + 1}`,
    });
    setManualStep(1);
    setSelectedMealIdx(0);
    setManualSearch("");
  };

  const handleManualAddFood = (food: any) => {
    setManualChart((prev: any) => {
      const newMeals = [...prev.meals];
      newMeals[selectedMealIdx].foods = [
        ...newMeals[selectedMealIdx].foods,
        food.name,
      ];
      newMeals[selectedMealIdx].calories += food.calories;
      return { ...prev, meals: newMeals };
    });
  };

  const handleManualRemoveFood = (foodIdx: number) => {
    setManualChart((prev: any) => {
      const newMeals = [...prev.meals];
      const foodName = newMeals[selectedMealIdx].foods[foodIdx];
      const foodObj = mockFoodDatabase.find((f) => f.name === foodName);
      if (foodObj) newMeals[selectedMealIdx].calories -= foodObj.calories;
      newMeals[selectedMealIdx].foods = newMeals[selectedMealIdx].foods.filter(
        (_: string, i: number) => i !== foodIdx
      );
      return { ...prev, meals: newMeals };
    });
  };

  const handleManualRationale = (val: string) => {
    setManualChart((prev: any) => {
      const newMeals = [...prev.meals];
      newMeals[selectedMealIdx].rationale = val;
      return { ...prev, meals: newMeals };
    });
  };

  const handleManualRecommendations = (val: string) => {
    setManualChart((prev: any) => ({
      ...prev,
      recommendations: val.split("\n").filter((r) => r.trim()),
    }));
  };

  const handleManualPublish = () => {
    setDietCharts((prev) => [...prev, { ...manualChart, status: "active" }]);
    setShowPublishModal(true);
    setPublishedPatient(manualChart.patientName);
    setManualMode(null);
    setManualChart({ ...defaultManualChart });
    setManualStep(1);
    setSelectedMealIdx(0);
    setManualSearch("");
  };

  // Edit handlers
  const handleEdit = (id: string) => {
    setEditId(id);
    const chart = dietCharts.find((d) => d.id === id);
    if (chart) {
      setEditState({ ...chart });
    }
  };

  const handleEditChange = (field: string, value: any) => {
    setEditState((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = () => {
    setDietCharts((prev) =>
      prev.map((d) => (d.id === editId ? { ...editState } : d))
    );
    setEditId(null);
    setEditState({});
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditState({});
  };

  const handleDelete = (id: string) => {
    setDietCharts((prev) => prev.filter((d) => d.id !== id));
    if (editId === id) {
      setEditId(null);
      setEditState({});
    }
    if (viewId === id) setViewId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "draft":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "review":
        return "bg-emerald-100 text-[#1F5C3F] border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPrakritiColor = (prakriti: string) => {
    switch (prakriti) {
      case "Vata":
        return "bg-emerald-100 text-[#1F5C3F] border-emerald-200";
      case "Pitta":
        return "bg-red-100 text-red-800 border-red-200";
      case "Kapha":
        return "bg-emerald-100 text-[#1F5C3F] border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
              <div className="p-2 bg-[#1F5C3F] rounded-lg flex-shrink-0 mt-0.5 sm:mt-0">
                <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight break-words">
                  Ayurvedic Diet Chart Generator
                </h1>
                <p className="text-sm sm:text-base text-slate-600 mt-1 leading-snug">
                  Professional Healthcare Management System
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-start sm:gap-3 lg:justify-end lg:gap-4 w-full lg:w-auto">
              <div className="text-left sm:text-right min-w-0">
                <div className="text-sm font-medium text-slate-900 leading-tight">
                  Dr. Ayurveda Specialist
                </div>
                <div className="text-xs text-slate-500 leading-tight">
                  Certified Doctor
                </div>
              </div>
              <div className="w-10 h-10 bg-[#1F5C3F] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">AS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Total Patients
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                    {mockPatients.length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-[#1F5C3F]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Active Charts
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-600">
                    {dietCharts.filter((d) => d.status === "active").length}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Pending Charts
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600">
                    {patientsWithoutChart.length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Success Rate
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">98%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* New Diet Chart Creation */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <PlusCircle className="h-6 w-6 text-[#1F5C3F]" />
              <h2 className="text-xl font-bold text-slate-900">
                Create New Diet Chart
              </h2>
            </div>
            <Badge className="bg-emerald-100 text-[#1F5C3F] border-emerald-200">
              {patientsWithoutChart.length} Pending
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patientsWithoutChart.length === 0 && (
              <div className="col-span-full">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-green-900 mb-2">
                      All Patients Covered
                    </h3>
                    <p className="text-green-700">
                      All patients have active diet charts assigned.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {patientsWithoutChart.map((patient) => (
              <Card
                key={patient.id}
                className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-slate-900 mb-1">
                        {patient.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-600">
                        Age: {patient.age} • ID: {patient.id}
                      </CardDescription>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                      Pending
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <span className="text-sm text-slate-700">
                        {patient.condition}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <Button
                      onClick={() => handleGenerate(patient)}
                      disabled={generatingId === patient.id}
                      className="w-full bg-[#10B981] hover:bg-emerald-500 text-white font-medium py-2.5 transition-colors"
                    >
                      {generatingId === patient.id ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating AI Chart...
                        </>
                      ) : (
                        <>
                          <Stethoscope className="h-4 w-4 mr-2" />
                          Generate with AI
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => handleManualStart(patient)}
                      className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 font-medium py-2.5 transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Create Manually
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {/* Existing Diet Charts */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-900">
                Active Diet Charts
              </h2>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
              {dietCharts.length} Total
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dietCharts.length === 0 && (
              <div className="col-span-full">
                <Card className="bg-slate-50 border-slate-200">
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">
                      No Diet Charts Generated
                    </h3>
                    <p className="text-slate-500">
                      Create your first diet chart for a patient above.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {dietCharts.map((chart) => (
              <Card
                key={chart.id}
                className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-slate-900 mb-1">
                        {chart.patientName}
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-600">
                        Patient ID: {chart.patientId}
                      </CardDescription>
                    </div>
                    <Badge
                      className={`text-xs ${getStatusColor(chart.status)}`}
                    >
                      {chart.status.charAt(0).toUpperCase() +
                        chart.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">
                        Constitution:
                      </span>
                      <Badge
                        className={`text-xs ${getPrakritiColor(
                          chart.prakriti
                        )}`}
                      >
                        {chart.prakriti}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">
                        Created by:
                      </span>
                      <span className="text-sm font-medium text-slate-900">
                        {chart.generatedBy}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">
                        Last updated:
                      </span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        <span className="text-sm text-slate-900">
                          {chart.lastUpdated}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setViewId(chart.id || "")}
                        className="text-xs border-slate-300 text-slate-700 hover:bg-slate-50"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(chart.id || "")}
                        className="text-xs border-slate-300 text-slate-700 hover:bg-slate-50"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(chart.id || "")}
                        className="text-xs border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {/* Manual Creation Modal */}
        {manualMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#1F5C3F] rounded-lg">
                      <Edit className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        Create Diet Chart
                      </h2>
                      <p className="text-sm text-slate-600">
                        {manualChart.patientName} • {manualChart.prakriti}{" "}
                        Constitution
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setManualMode(null)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center space-x-4 mt-4">
                  {[
                    { step: 1, title: "Food Selection", icon: Utensils },
                    { step: 2, title: "Meal Planning", icon: Clock },
                    { step: 3, title: "Recommendations", icon: BookOpen },
                    { step: 4, title: "Review & Publish", icon: CheckCircle },
                  ].map(({ step, title, icon: Icon }) => (
                    <div key={step} className="flex items-center space-x-2">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          manualStep === step
                            ? "bg-[#1F5C3F] text-white"
                            : manualStep > step
                            ? "bg-green-600 text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {manualStep > step ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          manualStep === step
                            ? "text-[#1F5C3F]"
                            : manualStep > step
                            ? "text-green-600"
                            : "text-slate-500"
                        }`}
                      >
                        {title}
                      </span>
                      {step < 4 && (
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {/* Step 1: Food Selection */}
                {manualStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">
                        Select Foods for Meals
                      </h3>

                      {/* Meal Tabs */}
                      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg mb-4">
                        {["Breakfast", "Lunch", "Snack", "Dinner"].map(
                          (meal, idx) => (
                            <Button
                              key={meal}
                              size="sm"
                              variant={
                                selectedMealIdx === idx ? "default" : "ghost"
                              }
                              onClick={() => setSelectedMealIdx(idx)}
                              className={`flex-1 ${
                                selectedMealIdx === idx
                                  ? "bg-white shadow-sm"
                                  : ""
                              }`}
                            >
                              {meal}
                            </Button>
                          )
                        )}
                      </div>

                      {/* Search */}
                      <div className="relative mb-4">
                        <input
                          className="w-full pl-4 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
                          placeholder="Search foods by name, category, or therapeutic properties..."
                          value={manualSearch}
                          onChange={(e) => setManualSearch(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Food Database */}
                        <div>
                          <h4 className="font-medium text-slate-900 mb-3">
                            Available Foods
                          </h4>
                          <div className="bg-slate-50 rounded-lg p-4 max-h-96 overflow-y-auto space-y-2">
                            {mockFoodDatabase
                              .filter(
                                (food) =>
                                  food.name
                                    .toLowerCase()
                                    .includes(manualSearch.toLowerCase()) ||
                                  food.category
                                    .toLowerCase()
                                    .includes(manualSearch.toLowerCase()) ||
                                  food.rasa
                                    .toLowerCase()
                                    .includes(manualSearch.toLowerCase()) ||
                                  food.dosha
                                    .toLowerCase()
                                    .includes(manualSearch.toLowerCase())
                              )
                              .map((food) => (
                                <div
                                  key={food.id}
                                  className="bg-white rounded-lg p-3 shadow-sm"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div>
                                      <h5 className="font-medium text-slate-900">
                                        {food.name}
                                      </h5>
                                      <div className="flex items-center space-x-2 text-xs text-slate-600">
                                        <span>{food.category}</span>
                                        <span>•</span>
                                        <span>{food.calories} kcal</span>
                                      </div>
                                    </div>
                                    <Button
                                      size="sm"
                                      onClick={() => handleManualAddFood(food)}
                                    >
                                      Add
                                    </Button>
                                  </div>
                                  <div className="flex items-center space-x-4 text-xs">
                                    <Badge className="bg-emerald-100 text-[#1F5C3F]">
                                      {food.rasa}
                                    </Badge>
                                    <Badge className="bg-green-100 text-green-800">
                                      {food.dosha}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Selected Foods */}
                        <div>
                          <h4 className="font-medium text-slate-900 mb-3">
                            Selected for{" "}
                            {manualChart.meals[selectedMealIdx].meal}
                          </h4>
                          <div className="bg-emerald-50 rounded-lg p-4">
                            <div className="mb-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-[#1F5C3F]">
                                  Total Calories
                                </span>
                                <span className="text-lg font-bold text-[#1F5C3F]">
                                  {manualChart.meals[selectedMealIdx].calories}{" "}
                                  kcal
                                </span>
                              </div>
                            </div>

                            {manualChart.meals[selectedMealIdx].foods.length ===
                            0 ? (
                              <div className="text-center py-8 text-slate-500">
                                <Utensils className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>No foods selected for this meal</p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {manualChart.meals[selectedMealIdx].foods.map(
                                  (food: string, idx: number) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between bg-white rounded-lg p-3"
                                    >
                                      <span className="font-medium text-slate-900">
                                        {food}
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          handleManualRemoveFood(idx)
                                        }
                                        className="border-red-300 text-red-700 hover:bg-red-50"
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                      <Button
                        onClick={() => setManualStep(2)}
                        className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90"
                      >
                        Next: Meal Planning{" "}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Meal Planning */}
                {manualStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">
                        Add Therapeutic Rationale
                      </h3>

                      {/* Meal Tabs */}
                      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg mb-4">
                        {["Breakfast", "Lunch", "Snack", "Dinner"].map(
                          (meal, idx) => (
                            <Button
                              key={meal}
                              size="sm"
                              variant={
                                selectedMealIdx === idx ? "default" : "ghost"
                              }
                              onClick={() => setSelectedMealIdx(idx)}
                              className={`flex-1 ${
                                selectedMealIdx === idx
                                  ? "bg-white shadow-sm"
                                  : ""
                              }`}
                            >
                              {meal} ({manualChart.meals[idx].foods.length})
                            </Button>
                          )
                        )}
                      </div>

                      <div className="bg-slate-50 rounded-lg p-6">
                        <div className="mb-4">
                          <h4 className="font-medium text-slate-900 mb-2">
                            {manualChart.meals[selectedMealIdx].meal} -{" "}
                            {manualChart.meals[selectedMealIdx].time}
                          </h4>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {manualChart.meals[selectedMealIdx].foods.map(
                              (food: string, idx: number) => (
                                <Badge
                                  key={idx}
                                  className="bg-emerald-100 text-[#1F5C3F]"
                                >
                                  {food}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Therapeutic Rationale *
                          </label>
                          <textarea
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
                            rows={4}
                            placeholder="Explain the therapeutic benefits of this meal combination for the patient's constitution and condition..."
                            value={manualChart.meals[selectedMealIdx].rationale}
                            onChange={(e) =>
                              handleManualRationale(e.target.value)
                            }
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            Describe how these foods support the patient's dosha
                            balance and health goals.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setManualStep(1)}
                      >
                        Back to Food Selection
                      </Button>
                      <Button
                        onClick={() => setManualStep(3)}
                        className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90"
                      >
                        Next: Recommendations{" "}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Recommendations */}
                {manualStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">
                        General Lifestyle Recommendations
                      </h3>

                      <div className="bg-slate-50 rounded-lg p-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Dietary and Lifestyle Guidelines *
                        </label>
                        <textarea
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
                          rows={8}
                          placeholder={`Enter personalized recommendations, one per line:
• Eat meals at regular times to support digestive fire
• Drink warm water throughout the day
• Avoid cold drinks with meals
• Practice mindful eating in a calm environment
• Include warming spices like ginger and cumin
• Take a short walk after meals to aid digestion`}
                          value={manualChart.recommendations.join("\n")}
                          onChange={(e) =>
                            handleManualRecommendations(e.target.value)
                          }
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Provide holistic guidance covering diet, timing,
                          preparation methods, and lifestyle practices.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setManualStep(2)}
                      >
                        Back to Meal Planning
                      </Button>
                      <Button
                        onClick={() => setManualStep(4)}
                        className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90"
                      >
                        Review & Publish{" "}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 4: Review & Publish */}
                {manualStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">
                        Review Diet Chart
                      </h3>

                      <div className="bg-slate-50 rounded-lg p-6 space-y-6">
                        {/* Patient Info */}
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-slate-900 mb-3">
                            Patient Information
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-600">Name:</span>
                              <span className="ml-2 font-medium">
                                {manualChart.patientName}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-600">
                                Constitution:
                              </span>
                              <Badge
                                className={`ml-2 ${getPrakritiColor(
                                  manualChart.prakriti
                                )}`}
                              >
                                {manualChart.prakriti}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Meal Plan */}
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-slate-900 mb-3">
                            Daily Meal Plan
                          </h4>
                          <div className="space-y-4">
                            {manualChart.meals.map((meal: any, idx: number) => (
                              <div
                                key={idx}
                                className="border border-slate-200 rounded-lg p-4"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium text-slate-900">
                                    {meal.meal}
                                  </h5>
                                  <div className="text-sm text-slate-600">
                                    {meal.time} • {meal.calories} kcal
                                  </div>
                                </div>
                                <div className="mb-2">
                                  <span className="text-sm text-slate-600">
                                    Foods:{" "}
                                  </span>
                                  <span className="text-sm">
                                    {meal.foods.join(", ") || "None selected"}
                                  </span>
                                </div>
                                {meal.rationale && (
                                  <div className="text-sm text-slate-700 italic bg-slate-50 p-2 rounded">
                                    {meal.rationale}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Recommendations */}
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-slate-900 mb-3">
                            Lifestyle Recommendations
                          </h4>
                          {manualChart.recommendations.length > 0 ? (
                            <ul className="space-y-1 text-sm text-slate-700">
                              {manualChart.recommendations.map(
                                (rec: string, idx: number) => (
                                  <li key={idx} className="flex items-start">
                                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                    {rec}
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p className="text-sm text-slate-500">
                              No recommendations added
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setManualStep(3)}
                      >
                        Back to Recommendations
                      </Button>
                      <Button
                        onClick={handleManualPublish}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Publish Diet Chart
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* View Modal */}
        {viewId && renderDietChartViewModal()}
        {/* Edit Modal */}
        {editId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#1F5C3F] rounded-lg">
                      <Edit className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        Edit Diet Chart
                      </h2>
                      <p className="text-sm text-slate-600">
                        {editState.patientName} • {editState.prakriti}{" "}
                        Constitution
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Recommendations Section */}
                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Lifestyle Recommendations
                  </h3>
                  <textarea
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
                    rows={6}
                    value={editState.recommendations?.join("\n") || ""}
                    onChange={(e) =>
                      handleEditChange(
                        "recommendations",
                        e.target.value.split("\n").filter((r) => r.trim())
                      )
                    }
                    placeholder="Enter recommendations, one per line..."
                  />
                </div>

                {/* Meals Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Meal Plan
                  </h3>
                  {editState.meals?.map((meal: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 rounded-lg p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Meal
                          </label>
                          <input
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
                            value={meal.meal}
                            onChange={(e) => {
                              const newMeals = [...editState.meals];
                              newMeals[idx].meal = e.target.value;
                              handleEditChange("meals", newMeals);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Time
                          </label>
                          <input
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
                            value={meal.time}
                            onChange={(e) => {
                              const newMeals = [...editState.meals];
                              newMeals[idx].time = e.target.value;
                              handleEditChange("meals", newMeals);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Calories
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
                            value={meal.calories}
                            onChange={(e) => {
                              const newMeals = [...editState.meals];
                              newMeals[idx].calories =
                                parseInt(e.target.value) || 0;
                              handleEditChange("meals", newMeals);
                            }}
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Foods (comma-separated)
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
                          value={meal.foods.join(", ")}
                          onChange={(e) => {
                            const newMeals = [...editState.meals];
                            newMeals[idx].foods = e.target.value
                              .split(",")
                              .map((f) => f.trim())
                              .filter((f) => f);
                            handleEditChange("meals", newMeals);
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Therapeutic Rationale
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
                          rows={3}
                          value={meal.rationale}
                          onChange={(e) => {
                            const newMeals = [...editState.meals];
                            newMeals[idx].rationale = e.target.value;
                            handleEditChange("meals", newMeals);
                          }}
                        />
                      </div>

                      {meal.recipes && meal.recipes.length > 0 && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Recipe Recommendations
                          </label>
                          {meal.recipes.map(
                            (recipe: any, recipeIdx: number) => (
                              <div
                                key={recipeIdx}
                                className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 p-3 bg-white rounded-lg border"
                              >
                                <div>
                                  <label className="block text-xs font-medium text-slate-600 mb-1">
                                    Recipe Name
                                  </label>
                                  <input
                                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-[#10B981]"
                                    value={recipe.name}
                                    onChange={(e) => {
                                      const newMeals = [...editState.meals];
                                      newMeals[idx].recipes[recipeIdx].name =
                                        e.target.value;
                                      handleEditChange("meals", newMeals);
                                    }}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-slate-600 mb-1">
                                    Health Benefit
                                  </label>
                                  <input
                                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-[#10B981]"
                                    value={recipe.benefit}
                                    onChange={(e) => {
                                      const newMeals = [...editState.meals];
                                      newMeals[idx].recipes[recipeIdx].benefit =
                                        e.target.value;
                                      handleEditChange("meals", newMeals);
                                    }}
                                  />
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="border-slate-300 text-slate-700"
                  >
                    Cancel Changes
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Success Modal */}
        {showPublishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Diet Chart Published Successfully!
                </h3>
                <p className="text-slate-600 mb-6">
                  The personalized diet chart has been created and assigned to{" "}
                  <span className="font-medium text-slate-900">
                    {publishedPatient}
                  </span>
                  . The patient will receive notification and can access their
                  plan immediately.
                </p>
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center space-x-2 text-green-800">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Healthcare delivery optimized
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => setShowPublishModal(false)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
