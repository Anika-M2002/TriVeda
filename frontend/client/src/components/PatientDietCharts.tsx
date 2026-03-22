import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Leaf,
  Utensils,
  BarChart3,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  Target,
  Flame,
  Droplets,
  Sun,
  Moon,
  Star,
  Award,
  Eye,
  Filter,
  Download,
  Share2,
  Sparkles,
  Heart,
  Activity,
  Zap,
  Coffee,
  Sunset,
  Sunrise,
  ChevronRight,
  ChevronLeft,
  X,
  MessageSquare,
  User,
  Bell,
  AlertCircle,
} from "lucide-react";

// Mock data (unchanged)
const mockDietData = [
  {
    day: "Mon",
    calories: 1800,
    protein: 60,
    carbs: 220,
    fat: 50,
    fiber: 28,
    water: 2.5,
  },
  {
    day: "Tue",
    calories: 1750,
    protein: 65,
    carbs: 210,
    fat: 48,
    fiber: 32,
    water: 2.8,
  },
  {
    day: "Wed",
    calories: 1900,
    protein: 70,
    carbs: 230,
    fat: 55,
    fiber: 30,
    water: 3.0,
  },
  {
    day: "Thu",
    calories: 1850,
    protein: 68,
    carbs: 225,
    fat: 52,
    fiber: 29,
    water: 2.6,
  },
  {
    day: "Fri",
    calories: 1700,
    protein: 62,
    carbs: 200,
    fat: 47,
    fiber: 26,
    water: 2.4,
  },
  {
    day: "Sat",
    calories: 2000,
    protein: 75,
    carbs: 240,
    fat: 60,
    fiber: 35,
    water: 3.2,
  },
  {
    day: "Sun",
    calories: 1650,
    protein: 58,
    carbs: 195,
    fat: 45,
    fiber: 24,
    water: 2.3,
  },
];

const doshaBalanceData = [
  { dosha: "Vata", current: 65, optimal: 70 },
  { dosha: "Pitta", current: 80, optimal: 75 },
  { dosha: "Kapha", current: 55, optimal: 60 },
];

const nutritionRadarData = [
  { nutrient: "Protein", value: 85 },
  { nutrient: "Carbs", value: 78 },
  { nutrient: "Fiber", value: 92 },
  { nutrient: "Vitamins", value: 88 },
  { nutrient: "Minerals", value: 75 },
  { nutrient: "Water", value: 70 },
];

const macroPieData = [
  { name: "Protein (25%)", value: 400, color: "#34d399" },
  { name: "Carbs (50%)", value: 1320, color: "#60a5fa" },
  { name: "Fat (25%)", value: 357, color: "#fbbf24" },
];

type MealStatus = "excellent" | "on-plan" | "off-plan" | "poor";
type MealLog = {
  date: string;
  meal: string;
  status: MealStatus;
  rationale: string;
  foods: string[];
  time: string;
  doshaEffect: string;
};

const mealLogs: MealLog[] = [
  {
    date: "2025-09-17",
    meal: "Breakfast",
    status: "on-plan",
    rationale:
      "Warm oatmeal with ghee - pacifies Vata, supports morning digestion",
    foods: ["Oat Porridge", "Ghee", "Almonds", "Herbal Tea"],
    time: "8:00 AM",
    doshaEffect: "Balances Vata",
  },
  {
    date: "2025-09-17",
    meal: "Lunch",
    status: "on-plan",
    rationale: "High protein quinoa bowl - cooling for Pitta, energizing",
    foods: ["Quinoa Bowl", "Steamed Vegetables", "Coconut Water"],
    time: "1:00 PM",
    doshaEffect: "Cools Pitta",
  },
  {
    date: "2025-09-17",
    meal: "Dinner",
    status: "excellent",
    rationale: "Light lentil soup - easy digestion, promotes sound sleep",
    foods: ["Moong Dal", "Sautéed Greens", "Chamomile Tea"],
    time: "7:30 PM",
    doshaEffect: "Balances all Doshas",
  },
  {
    date: "2025-09-16",
    meal: "Breakfast",
    status: "on-plan",
    rationale:
      "Fresh fruits and nuts - natural energy, good for Pitta constitution",
    foods: ["Mixed Berries", "Walnuts", "Green Tea"],
    time: "8:15 AM",
    doshaEffect: "Supports Pitta",
  },
];

const todaysMeals = [
  {
    meal: "Early Morning",
    time: "6:30 AM",
    foods: ["Warm Water with Lemon", "Tulsi Tea"],
    rationale: "Cleanses digestive system, prepares Agni (digestive fire)",
    calories: 15,
    constitution: "All Doshas",
  },
  {
    meal: "Breakfast",
    time: "8:00 AM",
    foods: [
      "Oat Porridge (1 bowl)",
      "Ghee (1 tsp)",
      "Almonds (6-8)",
      "Herbal Tea",
    ],
    rationale:
      "Warm, nourishing breakfast to balance Vata and fuel morning energy",
    calories: 320,
    constitution: "Vata+",
  },
  {
    meal: "Mid-Morning",
    time: "10:30 AM",
    foods: ["Fresh Coconut Water", "Dates (2-3)"],
    rationale: "Natural electrolytes and quick energy without disturbing Pitta",
    calories: 85,
    constitution: "Pitta+",
  },
  {
    meal: "Lunch",
    time: "1:00 PM",
    foods: [
      "Quinoa Bowl (1 cup)",
      "Steamed Vegetables",
      "Buttermilk",
      "Coriander Chutney",
    ],
    rationale:
      "Complete protein with cooling properties, main meal when Agni is strongest",
    calories: 450,
    constitution: "All Doshas",
  },
  {
    meal: "Evening",
    time: "5:00 PM",
    foods: ["Herbal Tea", "Roasted Seeds Mix"],
    rationale: "Light snack to maintain energy without overloading digestion",
    calories: 120,
    constitution: "Vata+",
  },
  {
    meal: "Dinner",
    time: "7:30 PM",
    foods: [
      "Moong Dal Khichdi",
      "Steamed Greens",
      "Ghee (1 tsp)",
      "Chamomile Tea",
    ],
    rationale:
      "Light, easily digestible meal that promotes restful sleep and overnight healing",
    calories: 280,
    constitution: "All Doshas",
  },
];

// Mock recipe recommendations for each meal
const recipeRecommendations: Record<
  string,
  Array<{ name: string; benefit: string; link?: string }>
> = {
  "Early Morning": [
    {
      name: "Tulsi Lemon Detox Water",
      benefit: "Boosts immunity, supports digestion, and hydrates after sleep.",
    },
    {
      name: "Herbal Cleansing Tea",
      benefit: "Gently stimulates metabolism and balances all doshas.",
    },
  ],
  Breakfast: [
    {
      name: "Vata-Balancing Oat Porridge",
      benefit: "Warm, grounding, and easy to digest for morning energy.",
    },
    {
      name: "Almond Herbal Chai",
      benefit: "Nourishes nerves and supports mental clarity.",
    },
  ],
  "Mid-Morning": [
    {
      name: "Coconut Date Smoothie",
      benefit: "Natural electrolytes, cooling for Pitta, and quick energy.",
    },
  ],
  Lunch: [
    {
      name: "Quinoa Vegetable Bowl",
      benefit: "High protein, cooling, and balances all doshas at midday.",
    },
    {
      name: "Buttermilk Digestive Drink",
      benefit: "Aids digestion and soothes the gut after lunch.",
    },
  ],
  Evening: [
    {
      name: "Roasted Seed Trail Mix",
      benefit: "Light, energizing, and easy on digestion for Vata types.",
    },
  ],
  Dinner: [
    {
      name: "Moong Dal Khichdi",
      benefit:
        "Easily digestible, protein-rich, and calming for restful sleep.",
    },
    {
      name: "Steamed Greens with Ghee",
      benefit: "Provides minerals and supports overnight healing.",
    },
  ],
};

const recipeDetails: Record<string, any> = {
  "Tulsi Lemon Detox Water": {
    ingredients: [
      "2 cups warm water",
      "5-6 fresh tulsi (holy basil) leaves",
      "1/2 lemon, freshly squeezed",
      "1/2 tsp honey (optional)",
    ],
    steps: [
      "Add tulsi leaves to warm water and let steep for 2-3 minutes.",
      "Add lemon juice and honey, stir well.",
      "Drink slowly on an empty stomach.",
    ],
    dosha: "All Doshas",
    nutrition: "Hydrating, rich in antioxidants, supports immunity.",
    contraindications: "Avoid honey if diabetic.",
    wellnessTips:
      "Best consumed first thing in the morning for detoxification.",
  },
  "Vata-Balancing Oat Porridge": {
    ingredients: [
      "1/2 cup rolled oats",
      "1 cup water",
      "1/2 cup milk (dairy or plant-based)",
      "1 tsp ghee",
      "6-8 almonds, chopped",
      "Pinch of cinnamon",
    ],
    steps: [
      "Cook oats in water and milk until soft.",
      "Stir in ghee, almonds, and cinnamon.",
      "Serve warm.",
    ],
    dosha: "Vata",
    nutrition: "Provides sustained energy, healthy fats, and protein.",
    contraindications: "Use plant milk for lactose intolerance.",
    wellnessTips: "Ideal for dry, cold mornings or Vata imbalance.",
  },
  "Coconut Date Smoothie": {
    ingredients: [
      "1 cup coconut water",
      "2-3 dates, pitted",
      "1/2 banana (optional)",
      "Pinch of cardamom",
    ],
    steps: ["Blend all ingredients until smooth.", "Serve cool, not cold."],
    dosha: "Pitta",
    nutrition: "Natural electrolytes, potassium, and quick energy.",
    contraindications: "Limit for high blood sugar.",
    wellnessTips: "Great for hot days or after exercise.",
  },
  "Quinoa Vegetable Bowl": {
    ingredients: [
      "1 cup cooked quinoa",
      "1 cup mixed steamed vegetables",
      "1 tbsp coriander chutney",
      "1/2 cup buttermilk",
    ],
    steps: [
      "Combine quinoa and vegetables in a bowl.",
      "Top with chutney and serve with buttermilk.",
    ],
    dosha: "All Doshas",
    nutrition: "High protein, fiber, and cooling properties.",
    contraindications: "None significant.",
    wellnessTips: "Eat as main meal when digestion is strongest (lunch).",
  },
  "Moong Dal Khichdi": {
    ingredients: [
      "1/2 cup moong dal (split yellow lentils)",
      "1/2 cup rice",
      "2 cups water",
      "1 tsp ghee",
      "1/2 tsp cumin seeds",
      "1/4 tsp turmeric",
      "Salt to taste",
    ],
    steps: [
      "Rinse dal and rice, add water, turmeric, and salt.",
      "Cook until soft and porridge-like.",
      "Heat ghee, add cumin, pour over khichdi and mix.",
    ],
    dosha: "All Doshas",
    nutrition: "Easily digestible, protein-rich, gentle on gut.",
    contraindications: "Reduce ghee for high cholesterol.",
    wellnessTips: "Ideal for dinner or during illness recovery.",
  },
};

const COLORS = [
  "#34d399",
  "#60a5fa",
  "#fbbf24",
  "#f87171",
  "#a78bfa",
  "#fb7185",
];

// Enhanced Modal Component
interface ModalPopupProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalPopup: React.FC<ModalPopupProps> = ({
  title,
  onClose,
  children,
}) => {
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
        className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-md max-h-[85vh] overflow-y-auto relative"
      >
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-[#10B981] to-[#0D9488]"></div>
        
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-emerald-100 to-emerald-100 rounded-lg">
            <Leaf className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-[#10B981] bg-clip-text text-transparent">
            {title}
          </h3>
        </div>
        
        <div className="text-gray-700">{children}</div>
      </motion.div>
    </motion.div>
  );
};

// Enhanced Doctor Card
const assignedDoctor = {
  name: "Dr. Aditi Sharma",
  specialty: "Ayurvedic Physician",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  status: "Ongoing Care",
};

const DoctorCard = ({
  onAsk,
  onRequest,
}: {
  onAsk: () => void;
  onRequest: () => void;
}) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-[#10B981] rounded-2xl shadow-xl p-4 sm:p-8 mb-8"
  >
    {/* Decorative elements */}
    <div className="absolute inset-0 bg-black/10"></div>
    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
    <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
    
    <div className="relative flex flex-col md:flex-row md:items-center gap-4 sm:gap-6 text-white">
      <div className="flex items-center gap-3 sm:gap-6 min-w-0">
        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 overflow-hidden shrink-0">
          <img
            src={assignedDoctor.avatar}
            alt="Doctor Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-white/80" />
            <span className="text-sm text-white/80 font-medium">
              Assigned Doctor
            </span>
          </div>
          <h3 className="text-lg sm:text-2xl font-bold mb-1 break-words">{assignedDoctor.name}</h3>
          <p className="text-white/90 mb-2 text-sm sm:text-base break-words">{assignedDoctor.specialty}</p>
          <span className="inline-block px-3 sm:px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium border border-white/30">
            {assignedDoctor.status}
          </span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col sm:flex-row md:justify-end gap-2 sm:gap-3 w-full">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onAsk}
          className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white text-sm sm:text-base font-medium hover:bg-white/30 transition-all"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Ask a Question
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onRequest}
          className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-emerald-600 rounded-xl text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transition-all"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Request Appointment
        </motion.button>
      </div>
    </div>
  </motion.div>
);

// Enhanced Stat Card
type StatCardProps = {
  icon: React.ElementType;
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: "positive" | "negative";
  color?: string;
};

const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  change,
  changeType = "positive",
  color = "emerald",
}: StatCardProps) => (
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
      {change && (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
          changeType === "positive" ? "bg-emerald-50" : "bg-rose-50"
        }`}>
          <TrendingUp className={`w-4 h-4 ${
            changeType === "positive" ? "text-emerald-500" : "text-rose-500"
          }`} />
          <span className={`text-sm font-medium ${
            changeType === "positive" ? "text-emerald-500" : "text-rose-500"
          }`}>{change}</span>
        </div>
      )}
    </div>
  </motion.div>
);

// Enhanced Meal Card
const MealCard = ({ meal, isLast = false }: { meal: MealLog; isLast?: boolean }) => {
  const statusColors: Record<MealStatus, string> = {
    excellent: "emerald",
    "on-plan": "blue",
    "off-plan": "amber",
    poor: "rose",
  };

  const statusLabels: Record<MealStatus, string> = {
    excellent: "Excellent",
    "on-plan": "On Plan",
    "off-plan": "Adjusted",
    poor: "Needs Attention",
  };

  const color = statusColors[meal.status];

  return (
    <div className={`flex ${!isLast ? "pb-8" : ""}`}>
      <div className="flex flex-col items-center mr-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`w-4 h-4 rounded-full bg-${color}-500 shadow-lg`}
        />
        {!isLast && <div className="w-0.5 h-full bg-gradient-to-b from-gray-200 to-transparent mt-2"></div>}
      </div>
      
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex-1 min-w-0 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-4 sm:p-6 hover:shadow-xl transition-all"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-base sm:text-lg text-gray-900 break-words">{meal.meal}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-${color}-500`}>
                {statusLabels[meal.status]}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-gray-400" />
                {meal.time}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                {meal.date}
              </div>
            </div>
          </div>
          <div className="px-3 py-1 bg-emerald-50 rounded-full">
            <span className="text-xs text-[#1F5C3F] font-medium">{meal.doshaEffect}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Utensils className="w-4 h-4 mr-1 text-emerald-500" />
              Foods Consumed:
            </p>
            <div className="flex flex-wrap gap-2">
              {meal.foods.map((food: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gradient-to-r from-emerald-50 to-emerald-50/30 text-emerald-700 rounded-lg text-xs font-medium"
                >
                  {food}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Leaf className="w-4 h-4 mr-1 text-emerald-500" />
              Ayurvedic Rationale:
            </p>
            <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg">
              {meal.rationale}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function AdvancedAyurvedicDietCharts() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("week");
  const [selectedMealFilter, setSelectedMealFilter] = useState("all");
  const [showAskModal, setShowAskModal] = useState(false);
  const [askMessage, setAskMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState<{
    title: string;
    message: string;
  } | null>(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [activeRecipe, setActiveRecipe] = useState<any>(null);
  const [recipeQuestion, setRecipeQuestion] = useState("");
  const [showRecipeAlert, setShowRecipeAlert] = useState(false);
  const [recipeAlertContent, setRecipeAlertContent] = useState<string>("");

  return (
    <div className="min-h-screen relative bg-background text-foreground">

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 min-w-0 w-full lg:w-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-[#10B981] flex items-center justify-center">
                  <Utensils className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              </div>
              <div className="min-w-0 w-full max-w-full">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-[#10B981] to-[#0D9488] bg-clip-text text-transparent leading-tight break-words whitespace-normal">
                  Your's Ayurvedic Journey
                </h1>
                <p className="text-sm sm:text-lg text-gray-600 mt-1 leading-relaxed break-words max-w-full">
                  Personalized nutrition tracking for holistic wellness
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap w-full lg:w-auto gap-2 sm:gap-3 justify-start lg:justify-end">
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="flex items-center px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white hover:shadow-lg transition-all text-sm sm:text-base"
              >
                <Filter className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-gray-700">Filter</span>
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const data = mealLogs.map((meal) => ({
                    Date: meal.date,
                    Meal: meal.meal,
                    Status: meal.status,
                    Foods: meal.foods.join(", "),
                    Time: meal.time,
                    DoshaEffect: meal.doshaEffect,
                    Rationale: meal.rationale,
                  }));
                  const ws = XLSX.utils.json_to_sheet(data);
                  const wb = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(wb, ws, "DietCharts");
                  const wbout = XLSX.write(wb, {
                    bookType: "xlsx",
                    type: "array",
                  });
                  saveAs(
                    new Blob([wbout], { type: "application/octet-stream" }),
                    "diet_charts.xlsx"
                  );
                }}
                className="flex items-center px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white hover:shadow-lg transition-all text-sm sm:text-base"
              >
                <Download className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-gray-700">Export</span>
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-[#10B981] text-white rounded-xl shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
              >
                <Share2 className="w-4 h-4 mr-2" />
                <span>Share</span>
              </motion.button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 rounded-full text-xs sm:text-sm font-medium border border-emerald-300">
              Patient Dashboard
            </span>
            <span className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-emerald-100 to-emerald-200 text-[#1F5C3F] rounded-full text-xs sm:text-sm font-medium border border-emerald-300">
              Vata-Pitta Constitution
            </span>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            icon={Flame}
            title="Daily Calories"
            value="1,820"
            subtitle="Average this week"
            change="+5%"
            color="orange"
          />
          <StatCard
            icon={Target}
            title="Diet Compliance"
            value="92%"
            subtitle="Above target"
            change="+8%"
            color="emerald"
          />
          <StatCard
            icon={Droplets}
            title="Hydration"
            value="2.7L"
            subtitle="Daily average"
            change="+12%"
            color="blue"
          />
          <StatCard
            icon={Award}
            title="Streak"
            value="15 days"
            subtitle="Current streak"
            change="+1"
            color="purple"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Weekly Nutrition Trends */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-emerald-100 to-emerald-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                </div>
                Weekly Nutrition Analysis
              </h2>
              <div className="flex flex-wrap gap-2 bg-gray-100 rounded-xl p-1 w-full sm:w-auto">
                {["week", "month", "quarter"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedTimeRange(range)}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      selectedTimeRange === range
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[240px] sm:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockDietData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} width={30} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: 8 }} iconSize={10} />
                <Area
                  type="monotone"
                  dataKey="calories"
                  stackId="1"
                  stroke="#34d399"
                  fill="#34d399"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="protein"
                  stackId="2"
                  stroke="#60a5fa"
                  fill="#60a5fa"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="carbs"
                  stackId="3"
                  stroke="#fbbf24"
                  fill="#fbbf24"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Dosha Balance */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-emerald-100 to-emerald-100 rounded-lg">
                <Leaf className="w-5 h-5 text-emerald-600" />
              </div>
              Dosha Balance
            </h2>
            <div className="space-y-6">
              {doshaBalanceData.map((dosha, idx) => (
                <div key={dosha.dosha}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{dosha.dosha}</span>
                    <span className="text-sm text-gray-600">{dosha.current}%</span>
                  </div>
                  <div className="relative">
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${dosha.current}%` }}
                        transition={{ duration: 1, delay: idx * 0.2 }}
                        className={`h-full rounded-full ${
                          idx === 0 ? "bg-[#1F5C3F]" : idx === 1 ? "bg-red-500" : "bg-green-500"
                        }`}
                      />
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full flex justify-between px-1">
                      <div className="w-0.5 h-full bg-white/30"></div>
                      <div className="w-0.5 h-full bg-white/30"></div>
                      <div className="w-0.5 h-full bg-white/30"></div>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span className="text-gray-500">Target: {dosha.optimal}%</span>
                    <span className="text-gray-500">Current: {dosha.current}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Nutrition Radar & Macro Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-emerald-100 to-emerald-100 rounded-lg">
                <Star className="w-5 h-5 text-emerald-600" />
              </div>
              Nutritional Profile
            </h2>
            <div className="h-[260px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={nutritionRadarData} outerRadius="70%">
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="nutrient" stroke="#6b7280" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#6b7280" tick={{ fontSize: 11 }} />
                <Radar
                  name="Current"
                  dataKey="value"
                  stroke="#34d399"
                  fill="#34d399"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-emerald-100 to-emerald-100 rounded-lg">
                <Target className="w-5 h-5 text-emerald-600" />
              </div>
              Macro Distribution
            </h2>
            <div className="h-[260px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={82}
                  innerRadius={48}
                  paddingAngle={5}
                  label={false}
                >
                  {macroPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Today's Meal Plan */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-emerald-100 to-emerald-100 rounded-lg">
              <Sun className="w-5 h-5 text-emerald-600" />
            </div>
            Today's Ayurvedic Meal Plan
          </h2>
          
          <div className="w-full space-y-4">
            <div className="md:hidden space-y-4">
              {todaysMeals.map((meal, idx) => (
                <motion.div
                  key={`mobile-meal-${idx}`}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        meal.meal.includes("Morning")
                          ? "bg-yellow-400"
                          : meal.meal === "Lunch"
                          ? "bg-orange-400"
                          : "bg-[#10B981]"
                      }`} />
                      <p className="font-semibold text-gray-900 truncate">{meal.meal}</p>
                    </div>
                    <p className="text-xs text-gray-600 whitespace-nowrap">{meal.time}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {meal.foods.map((food, i) => (
                      <span key={i} className="px-2 py-1 bg-white text-gray-700 rounded-lg text-xs border border-gray-100">
                        {food}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-gray-600 italic mb-2 break-words">{meal.rationale}</p>

                  <div className="flex items-center justify-between">
                    <span className="inline-block px-2 py-1 bg-emerald-100 text-[#1F5C3F] rounded-full text-xs font-medium">
                      {meal.constitution}
                    </span>
                    <span className="font-semibold text-gray-900 text-sm">{meal.calories}</span>
                  </div>

                  <div className="mt-3 border-t border-emerald-100 pt-3">
                    <p className="text-xs font-semibold text-emerald-700 mb-2">Recommended Recipes:</p>
                    <div className="grid grid-cols-1 gap-2">
                      {(recipeRecommendations[meal.meal] || []).map((rec, ridx) => (
                        <div key={ridx} className="bg-white rounded-lg p-3 border border-emerald-100">
                          <p className="font-semibold text-emerald-700 text-sm">{rec.name}</p>
                          <p className="text-xs text-gray-600 mt-1 mb-2">{rec.benefit}</p>
                          <button
                            className="w-full px-3 py-2 bg-gradient-to-r from-emerald-500 to-[#10B981] text-white rounded-lg text-xs font-medium"
                            onClick={() => {
                              setActiveRecipe({
                                name: rec.name,
                                ...recipeDetails[rec.name],
                              });
                              setShowRecipeModal(true);
                            }}
                          >
                            View Recipe
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto w-full">
              <table className="w-full min-w-[680px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Meal Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Foods & Portions</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Ayurvedic Benefits</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Calories</th>
                  </tr>
                </thead>
                <tbody>
                  {todaysMeals.map((meal, idx) => (
                    <React.Fragment key={idx}>
                      <motion.tr
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-transparent transition-colors"
                      >
                        <td className="py-4 px-4 text-sm">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              meal.meal.includes("Morning")
                                ? "bg-yellow-400"
                                : meal.meal === "Lunch"
                                ? "bg-orange-400"
                                : "bg-[#10B981]"
                            }`} />
                            <span className="font-medium text-gray-900">{meal.meal}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600 text-sm whitespace-nowrap">{meal.time}</td>
                        <td className="py-4 px-4 text-sm">
                          <div className="flex flex-wrap gap-1">
                            {meal.foods.map((food, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-gray-100 text-gray-800 rounded-lg text-xs"
                              >
                                {food}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4 max-w-xs text-sm">
                          <p className="text-xs text-gray-600 italic mb-2">{meal.rationale}</p>
                          <span className="inline-block px-2 py-1 bg-emerald-100 text-[#1F5C3F] rounded-full text-xs font-medium">
                            {meal.constitution}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-gray-900 text-sm whitespace-nowrap">{meal.calories}</td>
                      </motion.tr>

                      <tr className="border-b border-gray-100">
                        <td colSpan={5} className="py-3 px-4 bg-gradient-to-r from-emerald-50/30 to-emerald-50/30">
                          <div className="flex items-center mb-2">
                            <Utensils className="w-4 h-4 mr-2 text-emerald-500" />
                            <span className="font-semibold text-emerald-700 text-sm">Recommended Recipes:</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {(recipeRecommendations[meal.meal] || []).map((rec, ridx) => (
                              <motion.div
                                key={ridx}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: ridx * 0.1 }}
                                className="bg-white rounded-xl shadow-md p-4 flex flex-col border border-emerald-100 hover:shadow-lg transition-all"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <Leaf className="w-4 h-4 text-emerald-500" />
                                  <span className="font-bold text-emerald-700 text-sm">{rec.name}</span>
                                </div>
                                <p className="text-xs text-gray-600 mb-3">{rec.benefit}</p>
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="mt-auto px-3 py-2 bg-gradient-to-r from-emerald-500 to-[#10B981] text-white rounded-lg text-xs font-medium shadow-md hover:shadow-lg transition-all"
                                  onClick={() => {
                                    setActiveRecipe({
                                      name: rec.name,
                                      ...recipeDetails[rec.name],
                                    });
                                    setShowRecipeModal(true);
                                  }}
                                >
                                  View Recipe
                                </motion.button>
                              </motion.div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Doctor Card */}
        <DoctorCard
          onAsk={() => setShowAskModal(true)}
          onRequest={() => {
            setAlertContent({
              title: "Appointment Requested!",
              message: `Your appointment request has been sent to ${assignedDoctor.name}. You will be notified once it is confirmed.`,
            });
            setShowAlert(true);
          }}
        />

        {/* Meal Timeline */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-emerald-100 to-emerald-100 rounded-lg">
                <Clock className="w-5 h-5 text-emerald-600" />
              </div>
              Recent Meal Timeline
            </h2>
            <div className="flex flex-wrap gap-2 bg-gray-100 rounded-xl p-1 w-full sm:w-auto">
              {["all", "breakfast", "lunch", "dinner"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedMealFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    selectedMealFilter === filter
                      ? "bg-white text-emerald-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            {mealLogs
              .filter((meal) => {
                if (selectedMealFilter === "all") return true;
                return meal.meal.toLowerCase() === selectedMealFilter;
              })
              .map((meal, idx, arr) => (
                <MealCard
                  key={idx}
                  meal={meal}
                  isLast={idx === arr.length - 1}
                />
              ))}
          </div>
        </motion.div>

        {/* Modals */}
        <AnimatePresence>
          {/* Ask Question Modal */}
          {showAskModal && (
            <ModalPopup
              title={`Ask a Question to ${assignedDoctor.name}`}
              onClose={() => setShowAskModal(false)}
            >
              <div className="space-y-4">
                <textarea
                  className="w-full border border-gray-200 rounded-xl p-4 focus:border-emerald-500 focus:ring-emerald-500 text-gray-900"
                  rows={4}
                  placeholder="Type your message..."
                  value={askMessage}
                  onChange={(e) => setAskMessage(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    onClick={() => setShowAskModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-[#10B981] text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                    onClick={() => {
                      setShowAskModal(false);
                      setAskMessage("");
                      setAlertContent({
                        title: "Message Sent!",
                        message: `Your message has been sent to ${assignedDoctor.name}. You will receive a reply soon.`,
                      });
                      setShowAlert(true);
                    }}
                    disabled={!askMessage.trim()}
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </ModalPopup>
          )}

          {/* Recipe Modal */}
          {showRecipeModal && activeRecipe && (
            <ModalPopup
              title={activeRecipe.name}
              onClose={() => {
                setShowRecipeModal(false);
                setActiveRecipe(null);
                setRecipeQuestion("");
              }}
            >
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600">Dosha Suitability:</span>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                    {activeRecipe.dosha}
                  </span>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <Leaf className="w-4 h-4 text-emerald-500" />
                    Ingredients:
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    {activeRecipe.ingredients.map((ing: string, i: number) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    Preparation Steps:
                  </h4>
                  <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-1">
                    {activeRecipe.steps.map((step: string, i: number) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
                
                <div className="bg-emerald-50 p-3 rounded-xl">
                  <h4 className="text-sm font-semibold text-emerald-700 mb-1">Nutritional Highlights:</h4>
                  <p className="text-sm text-gray-600">{activeRecipe.nutrition}</p>
                </div>
                
                <div className="bg-amber-50 p-3 rounded-xl">
                  <h4 className="text-sm font-semibold text-amber-700 mb-1">Contraindications:</h4>
                  <p className="text-sm text-gray-600">{activeRecipe.contraindications}</p>
                </div>
                
                <div className="bg-emerald-50 p-3 rounded-xl">
                  <h4 className="text-sm font-semibold text-[#1F5C3F] mb-1">Wellness Tips:</h4>
                  <p className="text-sm text-gray-600">{activeRecipe.wellnessTips}</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ask about this recipe:
                  </label>
                  <textarea
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                    rows={2}
                    placeholder="Type your question..."
                    value={recipeQuestion}
                    onChange={(e) => setRecipeQuestion(e.target.value)}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-[#10B981] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
                      disabled={!recipeQuestion.trim()}
                      onClick={() => {
                        setRecipeAlertContent(
                          "Your question has been sent to our healthcare team. You will receive a reply soon."
                        );
                        setShowRecipeAlert(true);
                        setRecipeQuestion("");
                      }}
                    >
                      Ask Question
                    </button>
                  </div>
                </div>
              </div>
            </ModalPopup>
          )}

          {/* Recipe Alert Modal */}
          {showRecipeAlert && (
            <ModalPopup
              title="Question Sent"
              onClose={() => setShowRecipeAlert(false)}
            >
              <div className="space-y-4">
                <p className="text-gray-600">{recipeAlertContent}</p>
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-[#10B981] text-white rounded-xl hover:shadow-lg transition-all"
                    onClick={() => setShowRecipeAlert(false)}
                  >
                    OK
                  </button>
                </div>
              </div>
            </ModalPopup>
          )}

          {/* Custom Alert Modal */}
          {showAlert && alertContent && (
            <ModalPopup
              title={alertContent.title}
              onClose={() => setShowAlert(false)}
            >
              <div className="space-y-4">
                <p className="text-gray-600">{alertContent.message}</p>
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-[#10B981] text-white rounded-xl hover:shadow-lg transition-all"
                    onClick={() => setShowAlert(false)}
                  >
                    OK
                  </button>
                </div>
              </div>
            </ModalPopup>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}