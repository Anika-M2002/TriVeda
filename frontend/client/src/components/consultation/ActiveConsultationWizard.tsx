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

type AsanaActivityEntry = {
  id: string;
  name: string;
  repsOrDuration: string;
  notes: string;
};

type AsanaActivitySlot = {
  id: string;
  name: string;
  time: string;
  asanas: AsanaActivityEntry[];
  rationale: string;
};

type SleepSlot = {
  id: string;
  name: string;
  sleepTime: string;
  wakeupTime: string;
  duration?: string;
};

type ManualActivityChart = {
  slots: AsanaActivitySlot[];
  sleepSlots: SleepSlot[];
  rules: string;
};

type MedicineDraft = {
  id: string;
  name: string;
  dosage: string;
  timingTime: string;
  timingPeriod: "AM" | "PM";
  medicineType: string;
  duration: string;
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
        timingTime: "08:00",
        timingPeriod: "AM",
        medicineType: "",
        duration: "",
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

  const [activityFlowStep, setActivityFlowStep] = useState(1);
  const [activitySelectedSlotId, setActivitySelectedSlotId] = useState("activity-morning");
  const [newActivitySlotName, setNewActivitySlotName] = useState("");
  const [newActivitySlotTime, setNewActivitySlotTime] = useState("6:00 AM");
  const [asanaQuickSearchActivity, setAsanaQuickSearchActivity] = useState("");
  const [newSleepSlotName, setNewSleepSlotName] = useState("");
  const [newSleepTime, setNewSleepTime] = useState("10:00 PM");
  const [newWakeupTime, setNewWakeupTime] = useState("6:00 AM");
  const [selectedSleepSlotId, setSelectedSleepSlotId] = useState("sleep-night");
  const [manualActivityChart, setManualActivityChart] = useState<ManualActivityChart>({
    slots: [
      {
        id: "activity-morning",
        name: "Morning",
        time: "6:00 AM",
        asanas: [],
        rationale: "",
      },
      {
        id: "activity-evening",
        name: "Evening",
        time: "5:00 PM",
        asanas: [],
        rationale: "",
      },
    ],
    sleepSlots: [
      {
        id: "sleep-night",
        name: "Night Sleep",
        sleepTime: "10:00 PM",
        wakeupTime: "6:00 AM",
        duration: "8 hours",
      },
    ],
    rules: "",
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

  const getPeriodFromTime24 = (time24: string): "AM" | "PM" => {
    const [hourString] = time24.split(":");
    const hour = Number(hourString || 0);
    return hour >= 12 ? "PM" : "AM";
  };

  const to12HourTime = (time24: string) => {
    const [hourString, minuteString] = time24.split(":");
    const hour = Number(hourString || 0);
    const minute = (minuteString || "00").padStart(2, "0");
    const hour12 = ((hour + 11) % 12) + 1;
    return `${hour12}:${minute}`;
  };

  const applyPeriodToTime24 = (time24: string, period: "AM" | "PM") => {
    const [hourString, minuteString] = time24.split(":");
    let hour = Number(hourString || 0);
    const minute = (minuteString || "00").padStart(2, "0");

    if (period === "AM" && hour >= 12) {
      hour -= 12;
    }
    if (period === "PM" && hour < 12) {
      hour += 12;
    }

    return `${String(hour).padStart(2, "0")}:${minute}`;
  };

  const formatMedicineTiming = (medicine: MedicineDraft) => {
    if (!medicine.timingTime) return "";
    return `${to12HourTime(medicine.timingTime)} ${medicine.timingPeriod}`;
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
          timingTime: "08:00",
          timingPeriod: "AM",
          medicineType: "",
          duration: "",
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
          timingTime: "08:00",
          timingPeriod: "AM",
          medicineType: medicine.medicineType || "",
          duration: "",
          notes: "",
        },
      ],
    }));
  };

  const duplicateMedicine = (id: string) => {
    setConsultationData((previous) => {
      const source = previous.medicines.find((medicine) => medicine.id === id);
      if (!source) return previous;

      return {
        ...previous,
        medicines: [
          ...previous.medicines,
          {
            ...source,
            id: `med-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          },
        ],
      };
    });
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

  const sortActivitySlotsByTime = (slots: AsanaActivitySlot[]) =>
    [...slots].sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));

  const selectedActivitySlot =
    manualActivityChart.slots.find((slot) => slot.id === activitySelectedSlotId) || 
    manualActivityChart.slots[0];

  const addActivitySlot = () => {
    const slotName = newActivitySlotName.trim();
    if (!slotName) return;

    const newSlotId = `activity-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newSlot: AsanaActivitySlot = {
      id: newSlotId,
      name: slotName,
      time: newActivitySlotTime.trim() || "6:00 AM",
      asanas: [],
      rationale: "",
    };

    setManualActivityChart((previous) => {
      const nextChart = {
        ...previous,
        slots: sortActivitySlotsByTime([...previous.slots, newSlot]),
      };
      return nextChart;
    });

    setActivitySelectedSlotId(newSlotId);
    setNewActivitySlotName("");
  };

  const deleteActivitySlot = (slotId: string) => {
    if (manualActivityChart.slots.length <= 1) return;

    setManualActivityChart((previous) => {
      const nextSlots = previous.slots.filter((slot) => slot.id !== slotId);
      return {
        ...previous,
        slots: nextSlots,
      };
    });

    if (activitySelectedSlotId === slotId) {
      setActivitySelectedSlotId(manualActivityChart.slots[0]?.id || "");
    }
  };

  const updateActivitySlotMeta = (key: "name" | "time", value: string) => {
    if (!selectedActivitySlot) return;

    setManualActivityChart((previous) => {
      const nextSlots = previous.slots.map((slot) =>
        slot.id === selectedActivitySlot.id
          ? {
              ...slot,
              [key]: value,
            }
          : slot
      );

      const sortedSlots = key === "time" ? sortActivitySlotsByTime(nextSlots) : nextSlots;
      return {
        ...previous,
        slots: sortedSlots,
      };
    });
  };

  const addAsanaToActivitySlot = (asana: AsanaCatalogItem) => {
    if (!selectedActivitySlot) return;

    setManualActivityChart((previous) => {
      const nextSlots = previous.slots.map((slot) => {
        if (slot.id !== selectedActivitySlot.id) return slot;

        const asanaExists = slot.asanas.some((a) => a.name === asana.name);
        if (asanaExists) return slot;

        return {
          ...slot,
          asanas: [
            ...slot.asanas,
            {
              id: `asana-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              name: asana.name,
              repsOrDuration: "",
              notes: "",
            },
          ],
        };
      });

      return {
        ...previous,
        slots: nextSlots,
      };
    });
  };

  const removeAsanaFromActivitySlot = (asanaId: string) => {
    if (!selectedActivitySlot) return;

    setManualActivityChart((previous) => {
      const nextSlots = previous.slots.map((slot) => {
        if (slot.id !== selectedActivitySlot.id) return slot;

        return {
          ...slot,
          asanas: slot.asanas.filter((a) => a.id !== asanaId),
        };
      });

      return {
        ...previous,
        slots: nextSlots,
      };
    });
  };

  const updateAsanaInActivitySlot = (asanaId: string, key: "repsOrDuration" | "notes", value: string) => {
    if (!selectedActivitySlot) return;

    setManualActivityChart((previous) => {
      const nextSlots = previous.slots.map((slot) => {
        if (slot.id !== selectedActivitySlot.id) return slot;

        return {
          ...slot,
          asanas: slot.asanas.map((a) =>
            a.id === asanaId
              ? {
                  ...a,
                  [key]: value,
                }
              : a
          ),
        };
      });

      return {
        ...previous,
        slots: nextSlots,
      };
    });
  };

  const updateActivitySlotRationale = (value: string) => {
    if (!selectedActivitySlot) return;

    setManualActivityChart((previous) => ({
      ...previous,
      slots: previous.slots.map((slot) =>
        slot.id === selectedActivitySlot.id
          ? {
              ...slot,
              rationale: value,
            }
          : slot
      ),
    }));
  };

  const sortSleepSlotsByTime = (slots: SleepSlot[]) =>
    [...slots].sort((a, b) => parseTimeToMinutes(a.sleepTime) - parseTimeToMinutes(b.sleepTime));

  const addSleepSlot = () => {
    const slotName = newSleepSlotName.trim();
    if (!slotName) return;

    const newSlotId = `sleep-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newSlot: SleepSlot = {
      id: newSlotId,
      name: slotName,
      sleepTime: newSleepTime.trim() || "10:00 PM",
      wakeupTime: newWakeupTime.trim() || "6:00 AM",
    };

    setManualActivityChart((previous) => {
      const nextChart = {
        ...previous,
        sleepSlots: sortSleepSlotsByTime([...previous.sleepSlots, newSlot]),
      };
      return nextChart;
    });

    setSelectedSleepSlotId(newSlotId);
    setNewSleepSlotName("");
    setNewSleepTime("10:00 PM");
    setNewWakeupTime("6:00 AM");
  };

  const deleteSleepSlot = (slotId: string) => {
    if (manualActivityChart.sleepSlots.length <= 1) return;

    setManualActivityChart((previous) => {
      const nextSlots = previous.sleepSlots.filter((slot) => slot.id !== slotId);
      return {
        ...previous,
        sleepSlots: nextSlots,
      };
    });

    if (selectedSleepSlotId === slotId) {
      setSelectedSleepSlotId(manualActivityChart.sleepSlots[0]?.id || "");
    }
  };

  const updateSleepSlot = (slotId: string, key: "name" | "sleepTime" | "wakeupTime", value: string) => {
    setManualActivityChart((previous) => {
      const nextSlots = previous.sleepSlots.map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              [key]: value,
            }
          : slot
      );

      const sortedSlots = key === "sleepTime" ? sortSleepSlotsByTime(nextSlots) : nextSlots;
      return {
        ...previous,
        sleepSlots: sortedSlots,
      };
    });
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
          medicine.duration.trim() ||
          medicine.notes.trim()
      )
      .map((medicine) => ({
        name: medicine.name,
        dosage: medicine.dosage,
        timing: formatMedicineTiming(medicine),
        doctorNotes: [
          medicine.medicineType ? `Type: ${medicine.medicineType}` : "",
          medicine.duration ? `Duration: ${medicine.duration} days` : "",
          medicine.notes,
        ]
          .filter(Boolean)
          .join(" | "),
      }));

    // Build asanas from activity chart
    const asanasFromChart = manualActivityChart.slots
      .flatMap((slot) =>
        slot.asanas.map((asana) => ({
          name: asana.name,
          repsOrDuration: asana.repsOrDuration,
          notes: asana.notes,
          timeSlot: slot.name,
          slotTime: slot.time,
        }))
      );

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
        exercisesAndAsanas: asanasFromChart.length > 0
          ? asanasFromChart.map((asana) => `${asana.name} (${asana.repsOrDuration || "as recommended"})`)
          : [],
        mode: "manual",
        sleepSchedule: manualActivityChart.sleepSlots
          .map((slot) => `${slot.name}: Sleep at ${slot.sleepTime}, Wake up at ${slot.wakeupTime}`)
          .join(" | "),
        therapy: manualActivityChart.rules
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
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
                <div className="mt-3 flex gap-1 border-b border-sky-200">
                  {[1, 2, 3, 4].map((step) => (
                    <button
                      key={step}
                      type="button"
                      onClick={() => setActivityFlowStep(step)}
                      className={`px-3 py-2 text-xs font-medium transition-colors ${
                        activityFlowStep === step
                          ? "border-b-2 border-sky-700 text-sky-700"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {step === 1 && "Activity Slots"}
                      {step === 2 && "Add Asanas"}
                      {step === 3 && "Sleep & Rules"}
                      {step === 4 && "Review"}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Sub-step 1: Activity Slot Selection */}
                {activityFlowStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-slate-900">Create Custom Activity Slots</h3>
                      <div className="space-y-2 rounded-lg bg-sky-50 p-4">
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                          <Input
                            value={newActivitySlotName}
                            onChange={(event) => setNewActivitySlotName(event.target.value)}
                            placeholder="Slot name (e.g., 'Morning Yoga')"
                            className="border-sky-200"
                          />
                          <Input
                            type="time"
                            value={newActivitySlotTime.includes(":") && !newActivitySlotTime.includes(" ") 
                              ? newActivitySlotTime.split(" ")[0] 
                              : newActivitySlotTime.includes("AM") || newActivitySlotTime.includes("PM")
                                ? (() => {
                                    const [time, period] = newActivitySlotTime.split(" ");
                                    const [hours, minutes] = time.split(":");
                                    let h = parseInt(hours);
                                    if (period === "PM" && h !== 12) h += 12;
                                    if (period === "AM" && h === 12) h = 0;
                                    return `${String(h).padStart(2, "0")}:${minutes}`;
                                  })()
                                : "06:00"}
                            onChange={(event) => {
                              const [hours, minutes] = event.target.value.split(":");
                              let h = parseInt(hours);
                              const period = h >= 12 ? "PM" : "AM";
                              if (h > 12) h -= 12;
                              if (h === 0) h = 12;
                              setNewActivitySlotTime(`${h}:${minutes} ${period}`);
                            }}
                            className="border-sky-200"
                          />
                          <Button
                            type="button"
                            onClick={addActivitySlot}
                            disabled={!newActivitySlotName.trim()}
                            className="bg-sky-700 text-white hover:bg-sky-800"
                          >
                            <Plus className="h-4 w-4" />
                            Add Slot
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-slate-900">Activity Slots</h3>
                      <div className="flex flex-wrap gap-2">
                        {sortActivitySlotsByTime(manualActivityChart.slots).map((slot) => (
                          <div
                            key={slot.id}
                            className={`flex items-center gap-1 rounded-lg border-2 px-3 py-2 transition-colors ${
                              activitySelectedSlotId === slot.id
                                ? "border-sky-700 bg-sky-100"
                                : "border-sky-200 bg-white hover:border-sky-300"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setActivitySelectedSlotId(slot.id)}
                              className="font-medium text-slate-900"
                            >
                              {slot.name} <span className="text-xs text-slate-500">({slot.time})</span>
                            </button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteActivitySlot(slot.id)}
                              disabled={manualActivityChart.slots.length <= 1}
                              className="h-5 w-5 p-0 text-red-600 hover:bg-red-100"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => skipStep(3)}>
                        Skip this step
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setActivityFlowStep(2)}
                        className="ml-auto bg-sky-700 text-white hover:bg-sky-800"
                      >
                        Next: Add Asanas
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Sub-step 2: Add Asanas - with tabs for switching slots */}
                {activityFlowStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-slate-900">Activity Slots</h3>
                      <div className="flex flex-wrap gap-1 rounded-lg bg-sky-50 p-2 border border-sky-200">
                        {sortActivitySlotsByTime(manualActivityChart.slots).map((slot) => (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setActivitySelectedSlotId(slot.id)}
                            className={`rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                              activitySelectedSlotId === slot.id
                                ? "bg-sky-700 text-white"
                                : "bg-white text-slate-700 border border-sky-200 hover:bg-sky-100"
                            }`}
                          >
                            {slot.name} <span className="ml-1 text-xs">({slot.time})</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                      <div className="xl:col-span-4 space-y-3">
                        <div>
                          <h3 className="mb-2 text-sm font-semibold text-slate-900">Search & Add Asanas</h3>
                          <Input
                            value={asanaQuickSearchActivity}
                            onChange={(event) => setAsanaQuickSearchActivity(event.target.value)}
                            placeholder="Search asana"
                            className="border-sky-200"
                          />
                        </div>
                        <div className="max-h-96 overflow-y-auto rounded-lg border border-sky-100 bg-white p-3">
                          <div className="space-y-2">
                            {asanaCatalog
                              .filter((asana) =>
                                asana.name.toLowerCase().includes(asanaQuickSearchActivity.toLowerCase())
                              )
                              .slice(0, 15)
                              .map((asana) => (
                                <div
                                  key={asana.id}
                                  className="flex items-center justify-between rounded-md border border-sky-100 px-3 py-2"
                                >
                                  <p className="text-sm font-medium text-slate-900">{asana.name}</p>
                                  <Button
                                    type="button"
                                    size="sm"
                                    className="bg-sky-700 text-white"
                                    onClick={() => addAsanaToActivitySlot(asana)}
                                  >
                                    Add
                                  </Button>
                                </div>
                              ))}
                            {asanaCatalog.filter((asana) =>
                              asana.name.toLowerCase().includes(asanaQuickSearchActivity.toLowerCase())
                            ).length === 0 && (
                              <p className="py-8 text-center text-xs text-slate-500">No asanas found</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="xl:col-span-8 space-y-4">
                        <div>
                          <h3 className="mb-3 text-sm font-semibold text-slate-900">
                            Asanas for <span className="text-sky-700">{selectedActivitySlot?.name}</span>
                          </h3>
                          <div className="space-y-2 max-h-96 overflow-y-auto rounded-lg border border-sky-200 bg-sky-50/50 p-3">
                            {selectedActivitySlot?.asanas && selectedActivitySlot.asanas.length > 0 ? (
                              selectedActivitySlot.asanas.map((asana) => (
                                <div
                                  key={asana.id}
                                  className="rounded-md border border-sky-200 bg-white p-3 space-y-2"
                                >
                                  <div className="flex items-start justify-between">
                                    <span className="font-medium text-slate-900">{asana.name}</span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeAsanaFromActivitySlot(asana.id)}
                                      className="h-5 w-5 p-0 text-red-600 hover:bg-red-100"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    <Input
                                      value={asana.repsOrDuration}
                                      onChange={(event) =>
                                        updateAsanaInActivitySlot(asana.id, "repsOrDuration", event.target.value)
                                      }
                                      placeholder="Reps / Duration (e.g., '10 reps' or '5 minutes')"
                                      className="border-sky-200 text-xs"
                                    />
                                    <Input
                                      value={asana.notes}
                                      onChange={(event) =>
                                        updateAsanaInActivitySlot(asana.id, "notes", event.target.value)
                                      }
                                      placeholder="Notes (optional)"
                                      className="border-sky-200 text-xs"
                                    />
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="py-8 text-center text-xs text-slate-500">
                                No asanas added for this slot. Search and add asanas from the left panel.
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">Rationale (Optional)</label>
                          <Textarea
                            value={selectedActivitySlot?.rationale || ""}
                            onChange={(event) => updateActivitySlotRationale(event.target.value)}
                            placeholder="Why these asanas are recommended for this slot..."
                            rows={3}
                            className="border-sky-200 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-step 3: Sleep Slots & Lifestyle Rules */}
                {activityFlowStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-slate-900">Sleep Slots</h3>
                      <div className="space-y-3 rounded-lg bg-blue-50 p-4 border border-blue-200">
                        <div>
                          <p className="text-xs text-slate-600 mb-3">Create sleep slots (e.g., Night Sleep, Afternoon Nap)</p>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
                            <Input
                              value={newSleepSlotName}
                              onChange={(event) => setNewSleepSlotName(event.target.value)}
                              placeholder="Slot name (e.g., 'Night Sleep')"
                              className="border-blue-200"
                            />
                            <input
                              type="time"
                              value={
                                newSleepTime.includes(":") && !newSleepTime.includes(" ")
                                  ? newSleepTime
                                  : (() => {
                                      const [time, period] = newSleepTime.split(" ");
                                      const [h, m] = time.split(":");
                                      let hours = parseInt(h);
                                      if (period === "PM" && hours !== 12) hours += 12;
                                      if (period === "AM" && hours === 12) hours = 0;
                                      return `${String(hours).padStart(2, "0")}:${m}`;
                                    })()
                              }
                              onChange={(event) => {
                                const [hours, minutes] = event.target.value.split(":");
                                let h = parseInt(hours);
                                const period = h >= 12 ? "PM" : "AM";
                                if (h > 12) h -= 12;
                                if (h === 0) h = 12;
                                setNewSleepTime(`${h}:${minutes} ${period}`);
                              }}
                              className="rounded-md border border-blue-200 px-3 py-2 text-sm"
                              title="Sleep time"
                            />
                            <input
                              type="time"
                              value={
                                newWakeupTime.includes(":") && !newWakeupTime.includes(" ")
                                  ? newWakeupTime
                                  : (() => {
                                      const [time, period] = newWakeupTime.split(" ");
                                      const [h, m] = time.split(":");
                                      let hours = parseInt(h);
                                      if (period === "PM" && hours !== 12) hours += 12;
                                      if (period === "AM" && hours === 12) hours = 0;
                                      return `${String(hours).padStart(2, "0")}:${m}`;
                                    })()
                              }
                              onChange={(event) => {
                                const [hours, minutes] = event.target.value.split(":");
                                let h = parseInt(hours);
                                const period = h >= 12 ? "PM" : "AM";
                                if (h > 12) h -= 12;
                                if (h === 0) h = 12;
                                setNewWakeupTime(`${h}:${minutes} ${period}`);
                              }}
                              className="rounded-md border border-blue-200 px-3 py-2 text-sm"
                              title="Wake-up time"
                            />
                            <Button
                              type="button"
                              onClick={addSleepSlot}
                              disabled={!newSleepSlotName.trim()}
                              className="bg-blue-700 text-white hover:bg-blue-800"
                            >
                              <Plus className="h-4 w-4" />
                              Add Slot
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {sortSleepSlotsByTime(manualActivityChart.sleepSlots).map((slot) => (
                            <div
                              key={slot.id}
                              className="flex items-center justify-between rounded-md border border-blue-200 bg-white p-3"
                            >
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={slot.name}
                                  onChange={(event) => updateSleepSlot(slot.id, "name", event.target.value)}
                                  className="w-full rounded border border-blue-100 px-2 py-1 text-sm font-medium text-slate-900 hover:border-blue-300 focus:border-blue-400 focus:outline-none"
                                />
                                <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                                  <span>Sleep:</span>
                                  <input
                                    type="time"
                                    value={
                                      slot.sleepTime.includes(":") && !slot.sleepTime.includes(" ")
                                        ? slot.sleepTime
                                        : (() => {
                                            const [time, period] = slot.sleepTime.split(" ");
                                            const [h, m] = time.split(":");
                                            let hours = parseInt(h);
                                            if (period === "PM" && hours !== 12) hours += 12;
                                            if (period === "AM" && hours === 12) hours = 0;
                                            return `${String(hours).padStart(2, "0")}:${m}`;
                                          })()
                                    }
                                    onChange={(event) => {
                                      const [hours, minutes] = event.target.value.split(":");
                                      let h = parseInt(hours);
                                      const period = h >= 12 ? "PM" : "AM";
                                      if (h > 12) h -= 12;
                                      if (h === 0) h = 12;
                                      updateSleepSlot(slot.id, "sleepTime", `${h}:${minutes} ${period}`);
                                    }}
                                    className="rounded border border-blue-100 px-2 py-1 text-xs"
                                  />
                                  <span className="ml-2">Wake:</span>
                                  <input
                                    type="time"
                                    value={
                                      slot.wakeupTime.includes(":") && !slot.wakeupTime.includes(" ")
                                        ? slot.wakeupTime
                                        : (() => {
                                            const [time, period] = slot.wakeupTime.split(" ");
                                            const [h, m] = time.split(":");
                                            let hours = parseInt(h);
                                            if (period === "PM" && hours !== 12) hours += 12;
                                            if (period === "AM" && hours === 12) hours = 0;
                                            return `${String(hours).padStart(2, "0")}:${m}`;
                                          })()
                                    }
                                    onChange={(event) => {
                                      const [hours, minutes] = event.target.value.split(":");
                                      let h = parseInt(hours);
                                      const period = h >= 12 ? "PM" : "AM";
                                      if (h > 12) h -= 12;
                                      if (h === 0) h = 12;
                                      updateSleepSlot(slot.id, "wakeupTime", `${h}:${minutes} ${period}`);
                                    }}
                                    className="rounded border border-blue-100 px-2 py-1 text-xs"
                                  />
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteSleepSlot(slot.id)}
                                disabled={manualActivityChart.sleepSlots.length <= 1}
                                className="h-5 w-5 p-0 text-red-600 hover:bg-red-100 ml-2"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-slate-900">Lifestyle Rules</h3>
                      <Textarea
                        value={manualActivityChart.rules}
                        onChange={(event) =>
                          setManualActivityChart((prev) => ({
                            ...prev,
                            rules: event.target.value,
                          }))
                        }
                        placeholder={`Enter lifestyle recommendations, one per line:\n• Avoid stressful situations during the day\n• Take a short walk after meals\n• Avoid heavy or oily foods at night\n• Practice meditation or pranayama for 15 minutes daily\n• Keep a consistent sleep schedule\n• Avoid excessive screen time before bed`}
                        rows={6}
                        className="border-sky-200"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActivityFlowStep(2)}
                        className="bg-white"
                      >
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setActivityFlowStep(4)}
                        className="ml-auto bg-sky-700 text-white hover:bg-sky-800"
                      >
                        Next: Review
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Sub-step 4: Review */}
                {activityFlowStep === 4 && (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-sky-50 p-4 border border-sky-200">
                      <h3 className="mb-3 font-semibold text-slate-900">Activity Slots Summary</h3>
                      <div className="space-y-3">
                        {sortActivitySlotsByTime(manualActivityChart.slots).map((slot) => (
                          <div key={slot.id} className="rounded-lg border border-sky-200 bg-white p-3">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="font-medium text-slate-900">{slot.name}</span>
                              <span className="text-xs text-slate-600">{slot.time}</span>
                            </div>
                            {slot.asanas.length > 0 ? (
                              <div className="space-y-1 text-xs text-slate-700">
                                {slot.asanas.map((asana) => (
                                  <div key={asana.id} className="pl-3">
                                    • {asana.name} {asana.repsOrDuration && `(${asana.repsOrDuration})`}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-500 italic">No asanas added</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
                      <h3 className="mb-3 font-semibold text-slate-900">Sleep Schedule</h3>
                      <div className="space-y-2">
                        {sortSleepSlotsByTime(manualActivityChart.sleepSlots).map((slot) => (
                          <div key={slot.id} className="text-sm text-slate-700">
                            <span className="font-medium">{slot.name}:</span> Sleep at {slot.sleepTime}, Wake at {slot.wakeupTime}
                          </div>
                        ))}
                      </div>
                    </div>

                    {manualActivityChart.rules && (
                      <div className="rounded-lg bg-sky-50 p-4 border border-sky-200">
                        <h3 className="mb-2 font-semibold text-slate-900">Lifestyle Rules</h3>
                        <ul className="text-sm text-slate-700 space-y-1">
                          {manualActivityChart.rules
                            .split("\n")
                            .map((rule, idx) => rule.trim() && <li key={idx}>• {rule.trim()}</li>)}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActivityFlowStep(3)}
                        className="bg-white"
                      >
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Back
                      </Button>
                      <Button type="button" variant="outline" onClick={() => skipStep(3)} className="ml-auto">
                        Skip remaining
                      </Button>
                      <Button
                        type="button"
                        onClick={goNext}
                        className="bg-sky-700 text-white hover:bg-sky-800"
                      >
                        Next: Continue
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
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
                          value={medicine.medicineType}
                          placeholder="Type"
                          readOnly
                          className="bg-slate-100 text-slate-600"
                        />
                        <Input
                          value={medicine.duration}
                          onChange={(event) => updateMedicine(medicine.id, "duration", event.target.value)}
                          placeholder="Duration (days)"
                        />
                      </div>

                      <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-3">
                        <Input
                          type="time"
                          value={medicine.timingTime}
                          onChange={(event) => {
                            const nextTime = event.target.value || "08:00";
                            updateMedicine(medicine.id, "timingTime", nextTime);
                            updateMedicine(medicine.id, "timingPeriod", getPeriodFromTime24(nextTime));
                          }}
                        />
                        <Select
                          value={medicine.timingPeriod}
                          onValueChange={(value) => {
                            const nextPeriod = value as "AM" | "PM";
                            updateMedicine(medicine.id, "timingPeriod", nextPeriod);
                            updateMedicine(
                              medicine.id,
                              "timingTime",
                              applyPeriodToTime24(medicine.timingTime || "08:00", nextPeriod)
                            );
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="AM/PM" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AM">AM</SelectItem>
                            <SelectItem value="PM">PM</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          value={medicine.notes}
                          onChange={(event) => updateMedicine(medicine.id, "notes", event.target.value)}
                          placeholder="Notes (optional)"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => duplicateMedicine(medicine.id)}
                        >
                          Duplicate
                        </Button>
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
            disabled={currentStep === 4 || (currentStep === 2 && dietFlowStep < 4) || (currentStep === 3 && activityFlowStep < 4)}
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
