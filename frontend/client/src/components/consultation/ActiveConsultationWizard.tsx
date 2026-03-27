import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Monitor,
  Phone,
  Pill,
  Plus,
  Stethoscope,
  Trash2,
  User,
  Utensils,
  Video,
  Wind,
  Flame,
  Droplets,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSaveDoctorPlan } from "@/hooks/useAppointments";
import { useTreatmentCatalogs } from "@/hooks/useTreatmentCatalogs";
import type {
  AsanaCatalogItem,
  FoodCatalogItem,
  MedicineCatalogItem,
} from "@/api/catalog.api";

export type AssessmentAnswer = {
  question: string;
  answer: string;
};

type ManualDietMeal = {
  id: string;
  meal: string;
  foods: string[];
  time: string;
  rationale: string;
  calories: number;
};

type ManualDietChart = {
  meals: ManualDietMeal[];
  recommendations: string[];
};

type MedicineDraft = {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  notes: string;
};

interface ActiveConsultationWizardProps {
  appointmentId?: string | null;
  patientName: string;
  prakritiScores?: {
    vata?: number;
    pitta?: number;
    kapha?: number;
  };
  patientProfileSummary?: {
    age?: number;
    gender?: string;
    prakriti?: string;
    priority?: string;
    email?: string;
    phone?: string;
    location?: string;
    issues?: string[];
    compliance?: number;
  };
  patientAssessmentAnswers: AssessmentAnswer[];
  initialDiagnosis?: {
    finalPrakriti?: string;
    finalVikriti?: string;
    chiefComplaint?: string;
  };
  onFinalizeSuccess?: () => void;
}

const steps = [
  { id: 1, label: "Diagnosis" },
  { id: 2, label: "Diet (Optional)" },
  { id: 3, label: "Lifestyle (Optional)" },
  { id: 4, label: "Medicines & Finalize" },
] as const;

export default function ActiveConsultationWizard({
  appointmentId,
  patientName,
  prakritiScores,
  patientProfileSummary,
  patientAssessmentAnswers,
  initialDiagnosis,
  onFinalizeSuccess,
}: ActiveConsultationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const [consultationData, setConsultationData] = useState(() => ({
    diagnosis: {
      finalPrakriti: initialDiagnosis?.finalPrakriti || "",
      finalVikriti: initialDiagnosis?.finalVikriti || "",
      chiefComplaint: initialDiagnosis?.chiefComplaint || "",
    },
    diet: {
      include: true,
      items: "",
      pathya: "",
      apathya: "",
    },
    lifestyle: {
      include: true,
      asanas: "",
      sleepSchedule: "",
      rules: "",
    },
    medicines: [
      {
        id: `med-${Date.now()}`,
        name: "",
        dosage: "",
        timing: "",
        notes: "",
      },
    ] as MedicineDraft[],
  }));

  const [dietQuickSearch, setDietQuickSearch] = useState("");
  const [dietFlowStep, setDietFlowStep] = useState(1);
  const [dietSelectedMealId, setDietSelectedMealId] = useState("meal-breakfast");
  const [newMealSlotName, setNewMealSlotName] = useState("");
  const [newMealSlotTime, setNewMealSlotTime] = useState("6:30 AM");
  const [asanaQuickSearch, setAsanaQuickSearch] = useState("");
  const [medicineQuickSearch, setMedicineQuickSearch] = useState("");
  const [manualDietChart, setManualDietChart] = useState<ManualDietChart>({
    meals: [
      {
        id: "meal-breakfast",
        meal: "Breakfast",
        foods: [],
        time: "8:00 AM",
        rationale: "",
        calories: 0,
      },
      {
        id: "meal-lunch",
        meal: "Lunch",
        foods: [],
        time: "1:00 PM",
        rationale: "",
        calories: 0,
      },
      {
        id: "meal-snack",
        meal: "Snack",
        foods: [],
        time: "4:30 PM",
        rationale: "",
        calories: 0,
      },
      {
        id: "meal-dinner",
        meal: "Dinner",
        foods: [],
        time: "7:00 PM",
        rationale: "",
        calories: 0,
      },
    ],
    recommendations: [],
  });

  const saveDoctorPlanMutation = useSaveDoctorPlan();
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

  const filteredFoods = foodCatalog.filter((food) =>
    food.name.toLowerCase().includes(dietQuickSearch.toLowerCase())
  );
  const filteredAsanas = asanaCatalog.filter((asana) =>
    asana.name.toLowerCase().includes(asanaQuickSearch.toLowerCase())
  );
  const filteredMedicines = medicineCatalog.filter((medicine) =>
    medicine.medicineName.toLowerCase().includes(medicineQuickSearch.toLowerCase())
  );

  const progressValue = useMemo(() => (currentStep / 4) * 100, [currentStep]);

  const vataScore = Number(prakritiScores?.vata || 0);
  const pittaScore = Number(prakritiScores?.pitta || 0);
  const kaphaScore = Number(prakritiScores?.kapha || 0);
  const totalPrakritiScore = Math.max(vataScore + pittaScore + kaphaScore, 1);
  const vataPercent = Math.round((vataScore / totalPrakritiScore) * 100);
  const pittaPercent = Math.round((pittaScore / totalPrakritiScore) * 100);
  const kaphaPercent = Math.round((kaphaScore / totalPrakritiScore) * 100);

  const goNext = () => {
    setCurrentStep((previous) => Math.min(4, previous + 1));
  };

  const goBack = () => {
    if (currentStep === 1) {
      window.location.href = "/doctor/dashboard";
      return;
    }

    setCurrentStep((previous) => Math.max(1, previous - 1));
  };

  const skipStep = (step: 1 | 2 | 3) => {
    if (step === 1) {
      setCurrentStep(2);
      return;
    }
    if (step === 2) {
      setConsultationData((previous) => ({
        ...previous,
        diet: {
          ...previous.diet,
          include: false,
        },
      }));
      setCurrentStep(3);
      return;
    }

    setConsultationData((previous) => ({
      ...previous,
      lifestyle: {
        ...previous.lifestyle,
        include: false,
      },
    }));
    setCurrentStep(4);
  };

  const addMedicine = () => {
    setConsultationData((previous) => ({
      ...previous,
      medicines: [
        ...previous.medicines,
        {
          id: `med-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: "",
          dosage: "",
          timing: "",
          notes: "",
        },
      ],
    }));
  };

  const addMedicineFromCatalog = (medicine: MedicineCatalogItem) => {
    setConsultationData((previous) => ({
      ...previous,
      medicines: [
        ...previous.medicines,
        {
          id: `med-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: medicine.medicineName,
          dosage: "",
          timing: "",
          notes: medicine.medicineType || "",
        },
      ],
    }));
  };

  const removeMedicine = (id: string) => {
    setConsultationData((previous) => ({
      ...previous,
      medicines:
        previous.medicines.length > 1
          ? previous.medicines.filter((medicine) => medicine.id !== id)
          : previous.medicines,
    }));
  };

  const updateMedicine = (id: string, key: keyof MedicineDraft, value: string) => {
    setConsultationData((previous) => ({
      ...previous,
      medicines: previous.medicines.map((medicine) =>
        medicine.id === id
          ? {
              ...medicine,
              [key]: value,
            }
          : medicine
      ),
    }));
  };

  const syncDietDataFromManualChart = (nextChart: ManualDietChart) => {
    const itemLines = nextChart.meals
      .filter((meal) => meal.foods.length > 0)
      .map((meal) => `${meal.meal}: ${meal.foods.join(", ")}`)
      .join("\n");

    const pathyaLines = nextChart.recommendations.join("\n");

    setConsultationData((previous) => ({
      ...previous,
      diet: {
        ...previous.diet,
        include: true,
        items: itemLines,
        pathya: pathyaLines,
      },
    }));
  };

  const foodCaloriesByName = useMemo(() => {
    const map = new Map<string, number>();
    foodCatalog.forEach((food) => {
      const parsedCalories = Number(food.calories || 0);
      map.set(food.name, Number.isFinite(parsedCalories) ? parsedCalories : 0);
    });
    return map;
  }, [foodCatalog]);

  const parseTimeToMinutes = (time: string) => {
    const trimmed = time.trim();
    const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return Number.MAX_SAFE_INTEGER;

    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    const period = match[3].toUpperCase();

    if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
      return Number.MAX_SAFE_INTEGER;
    }

    const normalizedHours = hours % 12;
    const total = normalizedHours * 60 + minutes + (period === "PM" ? 12 * 60 : 0);
    return total;
  };

  const sortMealsByTime = (meals: ManualDietMeal[]) =>
    [...meals].sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));

  const selectedMeal =
    manualDietChart.meals.find((meal) => meal.id === dietSelectedMealId) || manualDietChart.meals[0];

  const addManualDietFood = (food: FoodCatalogItem) => {
    if (!selectedMeal) return;

    setManualDietChart((previous) => {
      const nextMeals = previous.meals.map((meal) => {
        if (meal.id !== selectedMeal.id) return meal;

        if (meal.foods.includes(food.name)) {
          return meal;
        }

        return {
          ...meal,
          foods: [...meal.foods, food.name],
          calories: meal.calories + (foodCaloriesByName.get(food.name) || 0),
        };
      });

      const nextChart = {
        ...previous,
        meals: nextMeals,
      };

      syncDietDataFromManualChart(nextChart);
      return nextChart;
    });
  };

  const removeManualDietFood = (foodIndex: number) => {
    if (!selectedMeal) return;

    setManualDietChart((previous) => {
      const nextMeals = previous.meals.map((meal) => {
        if (meal.id !== selectedMeal.id) return meal;

        const foodName = meal.foods[foodIndex];
        const nextFoods = meal.foods.filter((_, idx) => idx !== foodIndex);
        const nextCalories = Math.max(0, meal.calories - (foodCaloriesByName.get(foodName) || 0));

        return {
          ...meal,
          foods: nextFoods,
          calories: nextCalories,
        };
      });

      const nextChart = {
        ...previous,
        meals: nextMeals,
      };

      syncDietDataFromManualChart(nextChart);
      return nextChart;
    });
  };

  const updateManualMealRationale = (value: string) => {
    if (!selectedMeal) return;

    setManualDietChart((previous) => ({
      ...previous,
      meals: previous.meals.map((meal) =>
        meal.id === selectedMeal.id
          ? {
              ...meal,
              rationale: value,
            }
          : meal
      ),
    }));
  };

  const updateManualRecommendations = (value: string) => {
    const nextRecommendations = value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    setManualDietChart((previous) => {
      const nextChart = {
        ...previous,
        recommendations: nextRecommendations,
      };
      syncDietDataFromManualChart(nextChart);
      return nextChart;
    });
  };

  const updateSelectedMealMeta = (key: "meal" | "time", value: string) => {
    if (!selectedMeal) return;

    setManualDietChart((previous) => {
      const nextMeals = previous.meals.map((meal) =>
        meal.id === selectedMeal.id
          ? {
              ...meal,
              [key]: value,
            }
          : meal
      );

      const sortedMeals = key === "time" ? sortMealsByTime(nextMeals) : nextMeals;
      const nextChart = {
        ...previous,
        meals: sortedMeals,
      };

      syncDietDataFromManualChart(nextChart);
      return nextChart;
    });
  };

  const addMealSlot = () => {
    const slotName = newMealSlotName.trim();
    if (!slotName) return;

    const newSlotId = `meal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newSlot: ManualDietMeal = {
      id: newSlotId,
      meal: slotName,
      foods: [],
      time: newMealSlotTime.trim() || "6:30 AM",
      rationale: "",
      calories: 0,
    };

    setManualDietChart((previous) => {
      const nextChart = {
        ...previous,
        meals: sortMealsByTime([...previous.meals, newSlot]),
      };

      syncDietDataFromManualChart(nextChart);
      return nextChart;
    });

    setDietSelectedMealId(newSlotId);
    setNewMealSlotName("");
  };

  const deleteMealSlot = (slotId: string) => {
    if (manualDietChart.meals.length <= 1) return;

    setManualDietChart((previous) => {
      const nextMeals = previous.meals.filter((meal) => meal.id !== slotId);
      const nextChart = {
        ...previous,
        meals: nextMeals,
      };

      syncDietDataFromManualChart(nextChart);
      return nextChart;
    });

    if (dietSelectedMealId === slotId) {
      setDietSelectedMealId(manualDietChart.meals[0]?.id || "");
    }
  };

  const addAsanaLine = (asana: AsanaCatalogItem) => {
    setConsultationData((previous) => ({
      ...previous,
      lifestyle: {
        ...previous.lifestyle,
        include: true,
        asanas: previous.lifestyle.asanas.trim()
          ? `${previous.lifestyle.asanas}\n${asana.name}`
          : asana.name,
      },
    }));
  };

  const finalizeTreatmentPlan = async () => {
    if (!appointmentId) return;

    const medications = consultationData.medicines
      .filter(
        (medicine) =>
          medicine.name.trim() ||
          medicine.dosage.trim() ||
          medicine.timing.trim() ||
          medicine.notes.trim()
      )
      .map((medicine) => ({
        name: medicine.name,
        dosage: medicine.dosage,
        timing: medicine.timing,
        doctorNotes: medicine.notes,
      }));

    const payload = {
      doctorNotes: consultationData.diagnosis.chiefComplaint,
      diagnosis: {
        finalPrakriti: consultationData.diagnosis.finalPrakriti,
        finalVikriti: consultationData.diagnosis.finalVikriti,
        chiefComplaint: consultationData.diagnosis.chiefComplaint,
      },
      dietChart: {
        items: consultationData.diet.include
          ? consultationData.diet.items
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean)
          : [],
        pathya: consultationData.diet.include
          ? consultationData.diet.pathya
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean)
          : [],
        apathya: consultationData.diet.include
          ? consultationData.diet.apathya
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean)
          : [],
      },
      routinePlan: {
        exercisesAndAsanas: consultationData.lifestyle.include
          ? consultationData.lifestyle.asanas
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean)
          : [],
        mode: "manual",
        sleepSchedule: consultationData.lifestyle.include
          ? consultationData.lifestyle.sleepSchedule
          : "",
        therapy: consultationData.lifestyle.include
          ? consultationData.lifestyle.rules
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean)
          : [],
        tests: [],
      },
      medications,
    };

    await saveDoctorPlanMutation.mutateAsync({
      appointmentId,
      planData: payload,
    });

    if (onFinalizeSuccess) {
      onFinalizeSuccess();
    }
  };

  const avatarLetter = patientName?.trim()?.charAt(0)?.toUpperCase() || "P";

  return (
    <div className="space-y-4 pb-28">
      <Card className="border-emerald-100 bg-gradient-to-r from-emerald-50 to-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-slate-900">Active Consultation Flow</CardTitle>
          <div className="space-y-2">
            <Progress value={progressValue} className="h-2" />
            <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`rounded-md border px-2 py-1 text-center font-medium ${
                    currentStep === step.id
                      ? "border-emerald-500 bg-emerald-100 text-emerald-800"
                      : currentStep > step.id
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {step.id}. {step.label}
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -14 }}
          transition={{ duration: 0.22 }}
        >
          {currentStep === 1 && (
            <div className="space-y-4">
              <Card className="border-slate-200">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#1F5C3F] to-emerald-500 text-xl font-semibold text-white">
                        {avatarLetter}
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-slate-900">{patientName}</h2>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-[#1F5C3F]">
                            {patientProfileSummary?.prakriti || "Not Assessed"}
                          </span>
                          <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                            {patientProfileSummary?.priority || "low"}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">
                          {(patientProfileSummary?.age ?? "-")} years • {patientProfileSummary?.gender || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button type="button" className="bg-[#1F5C3F] text-white hover:bg-[#184734]">
                        <Video className="h-4 w-4" />
                        Video Call
                      </Button>
                      <Button type="button" variant="outline" className="border-slate-300">
                        <MessageCircle className="h-4 w-4" />
                        Message
                      </Button>
                      <span className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                        View Mode
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
                    <div className="space-y-4 xl:col-span-4">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <h3 className="mb-3 flex items-center text-base font-semibold text-slate-900">
                          <User className="mr-2 h-4 w-4 text-[#1F5C3F]" />
                          Patient Information
                        </h3>
                        <div className="space-y-3 text-sm text-slate-700">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-slate-400" />
                            <span>{patientProfileSummary?.email || "-"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-400" />
                            <span>{patientProfileSummary?.phone || "-"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <span>{patientProfileSummary?.location || "-"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span>Last Visit: -</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span>Next: -</span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="flex items-center text-sm font-semibold text-slate-900">
                            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-md bg-red-100 text-red-700">
                              <Monitor className="h-3.5 w-3.5" />
                            </span>
                            Vital Signs
                          </h3>
                          <span className="rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                            4 metrics
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {["Blood Pressure", "Pulse", "Weight", "Temp"].map((label) => (
                            <div key={label} className="rounded-lg border border-red-100 bg-white p-2 text-center">
                              <p className="text-lg font-semibold text-slate-900">-</p>
                              <p className="text-[10px] text-slate-600">{label}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="flex items-center text-sm font-semibold text-slate-900">
                            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-amber-700">
                              <AlertTriangle className="h-3.5 w-3.5" />
                            </span>
                            Allergies
                          </h3>
                          <span className="rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                            1 reported
                          </span>
                        </div>
                        <span className="rounded-full border border-amber-200 bg-white px-2.5 py-1 text-xs text-amber-800">
                          Ladkiya
                        </span>
                      </div>
                    </div>

                    <div className="xl:col-span-8">
                      <div className="rounded-xl border border-slate-200 p-4">
                        <h3 className="mb-4 flex items-center text-lg font-semibold text-slate-900">
                          <Stethoscope className="mr-2 h-5 w-5 text-[#1F5C3F]" />
                          Health Issues & Treatment
                        </h3>

                        <div className="mb-4">
                          <p className="mb-2 text-sm font-medium text-slate-900">Primary Health Goals</p>
                          <div className="flex flex-wrap gap-2">
                            {(patientProfileSummary?.issues || []).length > 0 ? (
                              (patientProfileSummary?.issues || []).map((issue, index) => (
                                <span key={`${issue}-${index}`} className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs text-[#1F5C3F]">
                                  {issue}
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-slate-500">No health goals added</span>
                            )}
                          </div>
                        </div>

                        <hr className="my-4" />

                        <div className="mb-4">
                          <div className="mb-2 flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-900">Treatment Compliance</p>
                            <p className="text-3xl font-bold text-[#1F5C3F]">{patientProfileSummary?.compliance ?? 0}%</p>
                          </div>
                          <div className="h-3 w-full rounded-full bg-slate-200">
                            <div
                              className="h-3 rounded-full bg-[#1F5C3F]"
                              style={{ width: `${Math.max(0, Math.min(100, patientProfileSummary?.compliance ?? 0))}%` }}
                            />
                          </div>
                          <p className="mt-1 text-xs text-slate-600">Weekly compliance rate based on logged activities</p>
                        </div>

                        <div className="mb-4">
                          <p className="mb-2 text-sm font-semibold text-slate-900">Prakriti Assessment</p>
                          <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
                              <div className="mb-2 flex items-center justify-between">
                                <p className="flex items-center gap-1 text-lg font-medium text-[#1F5C3F]">
                                  <Wind className="h-4 w-4" /> Vata
                                </p>
                                <p className="text-2xl font-bold text-[#1F5C3F]">{vataScore}</p>
                              </div>
                              <div className="mb-1 h-2 w-full rounded-full bg-white">
                                <div className="h-2 rounded-full bg-[#1F5C3F]" style={{ width: `${vataPercent}%` }} />
                              </div>
                              <p className="text-right text-sm font-medium text-slate-600">{vataPercent}%</p>
                            </div>

                            <div className="rounded-xl border border-orange-200 bg-orange-50/60 p-3">
                              <div className="mb-2 flex items-center justify-between">
                                <p className="flex items-center gap-1 text-lg font-medium text-orange-700">
                                  <Flame className="h-4 w-4" /> Pitta
                                </p>
                                <p className="text-2xl font-bold text-orange-700">{pittaScore}</p>
                              </div>
                              <div className="mb-1 h-2 w-full rounded-full bg-white">
                                <div className="h-2 rounded-full bg-[#1F5C3F]" style={{ width: `${pittaPercent}%` }} />
                              </div>
                              <p className="text-right text-sm font-medium text-slate-600">{pittaPercent}%</p>
                            </div>

                            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
                              <div className="mb-2 flex items-center justify-between">
                                <p className="flex items-center gap-1 text-lg font-medium text-emerald-700">
                                  <Droplets className="h-4 w-4" /> Kapha
                                </p>
                                <p className="text-2xl font-bold text-emerald-700">{kaphaScore}</p>
                              </div>
                              <div className="mb-1 h-2 w-full rounded-full bg-white">
                                <div className="h-2 rounded-full bg-[#1F5C3F]" style={{ width: `${kaphaPercent}%` }} />
                              </div>
                              <p className="text-right text-sm font-medium text-slate-600">{kaphaPercent}%</p>
                            </div>
                          </div>

                          <p className="mb-2 text-sm font-semibold text-slate-900">Assessment Response</p>
                          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                            {patientAssessmentAnswers.map((entry, index) => (
                              <div key={`${entry.question}-${index}`} className="grid grid-cols-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs">
                                <span className="text-slate-600">{entry.question}:</span>
                                <span className="text-right font-medium text-slate-900">{entry.answer || "Not specified"}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-3 space-y-3">
                          <p className="text-sm font-semibold text-slate-900">Final Diagnosis</p>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-sm font-medium text-slate-700">Final Prakriti</label>
                              <Select
                                value={consultationData.diagnosis.finalPrakriti}
                                onValueChange={(value) =>
                                  setConsultationData((previous) => ({
                                    ...previous,
                                    diagnosis: {
                                      ...previous.diagnosis,
                                      finalPrakriti: value,
                                    },
                                  }))
                                }
                              >
                                <SelectTrigger className="border-emerald-200 bg-white">
                                  <SelectValue placeholder="Select Prakriti" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Vata">Vata</SelectItem>
                                  <SelectItem value="Pitta">Pitta</SelectItem>
                                  <SelectItem value="Kapha">Kapha</SelectItem>
                                  <SelectItem value="Vata-Pitta">Vata-Pitta</SelectItem>
                                  <SelectItem value="Pitta-Kapha">Pitta-Kapha</SelectItem>
                                  <SelectItem value="Vata-Kapha">Vata-Kapha</SelectItem>
                                  <SelectItem value="Tri-doshic">Tri-doshic</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <label className="mb-1 block text-sm font-medium text-slate-700">Final Vikriti</label>
                              <Select
                                value={consultationData.diagnosis.finalVikriti}
                                onValueChange={(value) =>
                                  setConsultationData((previous) => ({
                                    ...previous,
                                    diagnosis: {
                                      ...previous.diagnosis,
                                      finalVikriti: value,
                                    },
                                  }))
                                }
                              >
                                <SelectTrigger className="border-emerald-200 bg-white">
                                  <SelectValue placeholder="Select Vikriti" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Vata aggravation">Vata aggravation</SelectItem>
                                  <SelectItem value="Pitta aggravation">Pitta aggravation</SelectItem>
                                  <SelectItem value="Kapha aggravation">Kapha aggravation</SelectItem>
                                  <SelectItem value="Vata-Pitta imbalance">Vata-Pitta imbalance</SelectItem>
                                  <SelectItem value="Pitta-Kapha imbalance">Pitta-Kapha imbalance</SelectItem>
                                  <SelectItem value="Vata-Kapha imbalance">Vata-Kapha imbalance</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Chief Complaint</label>
                            <Textarea
                              value={consultationData.diagnosis.chiefComplaint}
                              onChange={(event) =>
                                setConsultationData((previous) => ({
                                  ...previous,
                                  diagnosis: {
                                    ...previous.diagnosis,
                                    chiefComplaint: event.target.value,
                                  },
                                }))
                              }
                              placeholder="Add live consultation notes"
                              rows={3}
                              className="border-emerald-200 bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 2 && (
            <Card className="border-slate-200 bg-white">
              <CardHeader className="space-y-4 border-b border-slate-200 pb-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-[#1F5C3F] p-2">
                      <Utensils className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-slate-900">Create Diet Chart</CardTitle>
                      <p className="text-sm text-slate-600">
                        {patientName} • {consultationData.diagnosis.finalPrakriti || "Constitution"}
                      </p>
                    </div>
                  </div>
                  <Button type="button" variant="outline" onClick={() => skipStep(2)}>
                    Skip this step
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {[
                    { step: 1, title: "Food Selection", icon: Utensils },
                    { step: 2, title: "Meal Planning", icon: Clock },
                    { step: 3, title: "Recommendations", icon: BookOpen },
                    { step: 4, title: "Review & Publish", icon: CheckCircle2 },
                  ].map(({ step, title, icon: Icon }) => (
                    <div key={step} className="flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          dietFlowStep === step
                            ? "bg-[#1F5C3F] text-white"
                            : dietFlowStep > step
                            ? "bg-green-600 text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {dietFlowStep > step ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          dietFlowStep === step
                            ? "text-[#1F5C3F]"
                            : dietFlowStep > step
                            ? "text-green-600"
                            : "text-slate-500"
                        }`}
                      >
                        {title}
                      </span>
                      {step < 4 && <ChevronRight className="h-4 w-4 text-slate-400" />}
                    </div>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {dietFlowStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-slate-900">Select Foods for Meals</h3>

                      <div className="mb-4 rounded-lg bg-slate-50 p-4">
                        <div className="mb-3 flex items-end gap-2">
                          <div className="flex-1">
                            <label className="mb-1 block text-xs font-medium text-slate-600">New Slot Name</label>
                            <Input
                              value={newMealSlotName}
                              onChange={(event) => setNewMealSlotName(event.target.value)}
                              placeholder="e.g. Early Morning"
                            />
                          </div>
                          <div className="w-36">
                            <label className="mb-1 block text-xs font-medium text-slate-600">Time</label>
                            <Input
                              value={newMealSlotTime}
                              onChange={(event) => setNewMealSlotTime(event.target.value)}
                              placeholder="6:30 AM"
                            />
                          </div>
                          <Button type="button" onClick={addMealSlot} className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90">
                            Add Slot
                          </Button>
                        </div>
                      </div>

                      <div className="mb-4 flex flex-wrap gap-2 rounded-lg bg-slate-100 p-2">
                        {manualDietChart.meals.map((meal) => (
                          <div key={meal.id} className="flex items-center gap-1 rounded-md bg-white">
                            <Button
                              type="button"
                              size="sm"
                              variant={dietSelectedMealId === meal.id ? "default" : "ghost"}
                              onClick={() => setDietSelectedMealId(meal.id)}
                              className={`${dietSelectedMealId === meal.id ? "bg-emerald-500 text-white" : ""}`}
                            >
                              {meal.meal}
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteMealSlot(meal.id)}
                              disabled={manualDietChart.meals.length === 1}
                              className="text-red-600 hover:bg-red-50"
                              title="Delete this meal slot"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="mb-4">
                        <Input
                          value={dietQuickSearch}
                          onChange={(event) => setDietQuickSearch(event.target.value)}
                          placeholder="Search foods by name, category, or therapeutic properties..."
                          className="border-slate-300"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div>
                          <h4 className="mb-3 font-medium text-slate-900">Available Foods</h4>
                          <div className="max-h-96 space-y-2 overflow-y-auto rounded-lg bg-slate-50 p-4">
                            {filteredFoods.map((food) => (
                              <div key={food.id} className="rounded-lg bg-white p-3 shadow-sm">
                                <div className="mb-2 flex items-center justify-between">
                                  <div>
                                    <h5 className="font-medium text-slate-900">{food.name}</h5>
                                    <div className="flex items-center space-x-2 text-xs text-slate-600">
                                      <span>{food.category || "Food"}</span>
                                      <span>•</span>
                                      <span>{food.calories || 0} kcal</span>
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    size="sm"
                                    className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90"
                                    onClick={() => {
                                      addManualDietFood(food);
                                    }}
                                  >
                                    Add
                                  </Button>
                                </div>
                                <div className="flex items-center space-x-2 text-xs">
                                  {food.rasa && <Badge className="bg-emerald-100 text-[#1F5C3F]">{food.rasa}</Badge>}
                                  {food.dosha && (
                                    <Badge className="bg-green-100 text-green-800">{food.dosha}</Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="mb-3 font-medium text-slate-900">
                            Selected for {selectedMeal?.meal || "Meal"}
                          </h4>
                          <div className="rounded-lg bg-emerald-50 p-4">
                            <div className="mb-3 flex items-center justify-between">
                              <span className="text-sm font-medium text-[#1F5C3F]">Total Calories</span>
                              <span className="text-lg font-bold text-[#1F5C3F]">
                                {selectedMeal?.calories || 0} kcal
                              </span>
                            </div>

                            {!selectedMeal || selectedMeal.foods.length === 0 ? (
                              <div className="py-8 text-center text-slate-500">
                                <Utensils className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                <p>No foods selected for this meal</p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {selectedMeal.foods.map((food, idx) => (
                                  <div key={`${food}-${idx}`} className="flex items-center justify-between rounded-lg bg-white p-3">
                                    <span className="font-medium text-slate-900">{food}</span>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="border-red-300 text-red-700 hover:bg-red-50"
                                      onClick={() => removeManualDietFood(idx)}
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end border-t pt-4">
                      <Button
                        type="button"
                        onClick={() => setDietFlowStep(2)}
                        className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90"
                      >
                        Next: Meal Planning
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {dietFlowStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-slate-900">Add Therapeutic Rationale</h3>

                      <div className="mb-4 flex flex-wrap gap-2 rounded-lg bg-slate-100 p-2">
                        {manualDietChart.meals.map((meal) => (
                          <div key={meal.id} className="flex items-center gap-1 rounded-md bg-white">
                            <Button
                              type="button"
                              size="sm"
                              variant={dietSelectedMealId === meal.id ? "default" : "ghost"}
                              onClick={() => setDietSelectedMealId(meal.id)}
                              className={`${dietSelectedMealId === meal.id ? "bg-emerald-500 text-white" : ""}`}
                            >
                              {meal.meal} ({meal.foods.length})
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteMealSlot(meal.id)}
                              disabled={manualDietChart.meals.length === 1}
                              className="text-red-600 hover:bg-red-50"
                              title="Delete this meal slot"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Meal Slot Name</label>
                          <Input
                            value={selectedMeal?.meal || ""}
                            onChange={(event) => updateSelectedMealMeta("meal", event.target.value)}
                            placeholder="Meal name"
                            disabled={!selectedMeal}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Meal Time</label>
                          <Input
                            value={selectedMeal?.time || ""}
                            onChange={(event) => updateSelectedMealMeta("time", event.target.value)}
                            placeholder="e.g. 6:30 AM"
                            disabled={!selectedMeal}
                          />
                        </div>
                      </div>

                      <div className="rounded-lg bg-slate-50 p-6">
                        <div className="mb-4">
                          <h4 className="mb-2 font-medium text-slate-900">
                            {selectedMeal?.meal || "Meal"} - {selectedMeal?.time || "Not set"}
                          </h4>
                          <div className="mb-3 flex flex-wrap gap-2">
                            {(selectedMeal?.foods || []).map((food, idx) => (
                              <Badge key={`${food}-${idx}`} className="bg-emerald-100 text-[#1F5C3F]">
                                {food}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">Therapeutic Rationale *</label>
                          <Textarea
                            className="border-slate-300"
                            rows={4}
                            placeholder="Explain the therapeutic benefits of this meal combination for the patient's constitution and condition..."
                            value={selectedMeal?.rationale || ""}
                            onChange={(event) => updateManualMealRationale(event.target.value)}
                            disabled={!selectedMeal}
                          />
                          <p className="mt-1 text-xs text-slate-500">
                            Describe how these foods support the patient's dosha balance and health goals.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between border-t pt-4">
                      <Button type="button" variant="outline" onClick={() => setDietFlowStep(1)}>
                        Back to Food Selection
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setDietFlowStep(3)}
                        className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90"
                      >
                        Next: Recommendations
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {dietFlowStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-slate-900">General Lifestyle Recommendations</h3>

                      <div className="rounded-lg bg-slate-50 p-6">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Dietary and Lifestyle Guidelines *
                        </label>
                        <Textarea
                          className="border-slate-300"
                          rows={8}
                          placeholder={`Enter personalized recommendations, one per line:\n• Eat meals at regular times to support digestive fire\n• Drink warm water throughout the day\n• Avoid cold drinks with meals\n• Practice mindful eating in a calm environment\n• Include warming spices like ginger and cumin\n• Take a short walk after meals to aid digestion`}
                          value={manualDietChart.recommendations.join("\n")}
                          onChange={(event) => updateManualRecommendations(event.target.value)}
                        />
                        <p className="mt-1 text-xs text-slate-500">
                          Provide holistic guidance covering diet, timing, preparation methods, and lifestyle practices.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between border-t pt-4">
                      <Button type="button" variant="outline" onClick={() => setDietFlowStep(2)}>
                        Back to Meal Planning
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setDietFlowStep(4)}
                        className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90"
                      >
                        Review & Publish
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {dietFlowStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-slate-900">Review Diet Chart</h3>

                      <div className="space-y-6 rounded-lg bg-slate-50 p-6">
                        <div className="rounded-lg bg-white p-4">
                          <h4 className="mb-3 font-semibold text-slate-900">Patient Information</h4>
                          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                            <div>
                              <span className="text-slate-600">Name:</span>
                              <span className="ml-2 font-medium">{patientName}</span>
                            </div>
                            <div>
                              <span className="text-slate-600">Constitution:</span>
                              <span className="ml-2 font-medium">
                                {consultationData.diagnosis.finalPrakriti || "Not specified"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg bg-white p-4">
                          <h4 className="mb-3 font-semibold text-slate-900">Daily Meal Plan</h4>
                          <div className="space-y-4">
                            {manualDietChart.meals.map((meal, idx) => (
                              <div key={`${meal.meal}-${idx}`} className="rounded-lg border border-slate-200 p-4">
                                <div className="mb-2 flex items-center justify-between">
                                  <h5 className="font-medium text-slate-900">{meal.meal}</h5>
                                  <div className="text-sm text-slate-600">
                                    {meal.time} • {meal.calories} kcal
                                  </div>
                                </div>
                                <div className="mb-2 text-sm">
                                  <span className="text-slate-600">Foods: </span>
                                  <span>{meal.foods.join(", ") || "None selected"}</span>
                                </div>
                                {meal.rationale && (
                                  <div className="rounded bg-slate-50 p-2 text-sm italic text-slate-700">{meal.rationale}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-lg bg-white p-4">
                          <h4 className="mb-3 font-semibold text-slate-900">Lifestyle Recommendations</h4>
                          {manualDietChart.recommendations.length > 0 ? (
                            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                              {manualDietChart.recommendations.map((recommendation, idx) => (
                                <li key={`${recommendation}-${idx}`}>{recommendation}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-slate-500">No recommendations added yet.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between border-t pt-4">
                      <Button type="button" variant="outline" onClick={() => setDietFlowStep(3)}>
                        Back to Recommendations
                      </Button>
                      <Button
                        type="button"
                        onClick={goNext}
                        className="bg-[#1F5C3F] hover:bg-[#1F5C3F]/90"
                      >
                        Continue to Lifestyle
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card className="border-sky-200 bg-gradient-to-br from-sky-50/60 to-white">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-sky-900">
                  <Activity className="h-4 w-4" />
                  Lifestyle & Asanas (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                <div className="xl:col-span-5 space-y-3">
                  <Input
                    value={asanaQuickSearch}
                    onChange={(event) => setAsanaQuickSearch(event.target.value)}
                    placeholder="Search asana"
                    className="border-sky-200"
                  />
                  <div className="max-h-64 overflow-y-auto rounded-lg border border-sky-100 bg-white p-3">
                    <div className="space-y-2">
                      {filteredAsanas.slice(0, 10).map((asana) => (
                        <div key={asana.id} className="flex items-center justify-between rounded-md border border-sky-100 px-3 py-2">
                          <p className="text-sm font-medium text-slate-900">{asana.name}</p>
                          <Button type="button" size="sm" className="bg-sky-700 text-white" onClick={() => addAsanaLine(asana)}>
                            Add
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="xl:col-span-7 space-y-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Selected Asanas</label>
                    <Textarea
                      value={consultationData.lifestyle.asanas}
                      onChange={(event) =>
                        setConsultationData((previous) => ({
                          ...previous,
                          lifestyle: {
                            ...previous.lifestyle,
                            include: true,
                            asanas: event.target.value,
                          },
                        }))
                      }
                      rows={5}
                      className="border-sky-200"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Sleep Schedule</label>
                    <Input
                      value={consultationData.lifestyle.sleepSchedule}
                      onChange={(event) =>
                        setConsultationData((previous) => ({
                          ...previous,
                          lifestyle: {
                            ...previous.lifestyle,
                            include: true,
                            sleepSchedule: event.target.value,
                          },
                        }))
                      }
                      className="border-sky-200"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Lifestyle Rules</label>
                    <Textarea
                      value={consultationData.lifestyle.rules}
                      onChange={(event) =>
                        setConsultationData((previous) => ({
                          ...previous,
                          lifestyle: {
                            ...previous.lifestyle,
                            include: true,
                            rules: event.target.value,
                          },
                        }))
                      }
                      rows={4}
                      className="border-sky-200"
                    />
                  </div>
                  <Button type="button" variant="outline" onClick={() => skipStep(3)}>
                    Skip this step
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <Card className="border-amber-200 bg-gradient-to-br from-amber-50/60 to-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2 text-amber-900">
                  <Pill className="h-4 w-4" />
                  Aushadhi / Medicines
                </CardTitle>
                <Button type="button" variant="outline" onClick={addMedicine}>
                  <Plus className="h-4 w-4" />
                  Add Medicine
                </Button>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                <div className="xl:col-span-4 space-y-3">
                  <Input
                    value={medicineQuickSearch}
                    onChange={(event) => setMedicineQuickSearch(event.target.value)}
                    placeholder="Search medicine"
                    className="border-amber-200"
                  />
                  <div className="max-h-72 overflow-y-auto rounded-lg border border-amber-100 bg-white p-3">
                    <div className="space-y-2">
                      {filteredMedicines.slice(0, 10).map((medicine) => (
                        <div key={medicine.id} className="flex items-center justify-between rounded-md border border-amber-100 px-3 py-2">
                          <div>
                            <p className="text-sm font-medium text-slate-900">{medicine.medicineName}</p>
                            <p className="text-xs text-slate-500">{medicine.medicineType}</p>
                          </div>
                          <Button type="button" size="sm" className="bg-amber-700 text-white" onClick={() => addMedicineFromCatalog(medicine)}>
                            Add
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="xl:col-span-8 space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {consultationData.medicines.map((medicine) => (
                    <div key={medicine.id} className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                        <Input
                          value={medicine.name}
                          onChange={(event) => updateMedicine(medicine.id, "name", event.target.value)}
                          placeholder="Medicine Name"
                        />
                        <Input
                          value={medicine.dosage}
                          onChange={(event) => updateMedicine(medicine.id, "dosage", event.target.value)}
                          placeholder="Dosage"
                        />
                        <Input
                          value={medicine.timing}
                          onChange={(event) => updateMedicine(medicine.id, "timing", event.target.value)}
                          placeholder="Timing"
                        />
                        <Input
                          value={medicine.notes}
                          onChange={(event) => updateMedicine(medicine.id, "notes", event.target.value)}
                          placeholder="Notes"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-red-700"
                          onClick={() => removeMedicine(medicine.id)}
                          disabled={consultationData.medicines.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    className="mt-3 min-h-12 w-full bg-gradient-to-r from-[#1F5C3F] to-emerald-600 text-base font-semibold text-white hover:from-[#194A33] hover:to-emerald-700"
                    onClick={finalizeTreatmentPlan}
                    disabled={saveDoctorPlanMutation.isPending || !appointmentId}
                  >
                    {saveDoctorPlanMutation.isPending ? "Finalizing..." : "Finalize Treatment Plan"}
                    <CheckCircle2 className="h-5 w-5" />
                  </Button>
                  {!appointmentId && (
                    <p className="text-xs text-red-600">
                      Select or open an appointment before finalizing this plan.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-emerald-200 bg-white shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <Button
            type="button"
            onClick={goBack}
            className="min-w-[112px] bg-[#1F5C3F] text-white hover:bg-[#184734]"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="text-sm font-medium text-slate-600">Step {currentStep} of 4</div>

          <Button
            type="button"
            onClick={goNext}
            disabled={currentStep === 4 || (currentStep === 2 && dietFlowStep < 4)}
            className="min-w-[112px] bg-[#1F5C3F] text-white hover:bg-[#184734]"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
