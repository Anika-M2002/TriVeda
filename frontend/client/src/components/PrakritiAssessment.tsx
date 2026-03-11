import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  ArrowRight,
  ArrowLeft,
  Brain,
  Flower2,
  Sparkles,
  Heart,
  User,
  Stethoscope,
  Shield,
  Sun,
  Moon,
  Cloud,
  Droplet,
  Flame,
  Apple,
  UtensilsCrossed,
  Smile,
  CheckCircle2,
  RefreshCw,
  Activity,
  Zap,
  Star,
  Target,
  Microscope,
  Pause,
  ChevronRight,
  Award,
  TrendingUp,
  BarChart3,
  Timer,
  Users,
  Hospital,
  Dna,
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  category: string;
  options: {
    value: string;
    text: string;
    dosha: "vata" | "pitta" | "kapha";
    intensity: number;
  }[];
}

const questions: Question[] = [
  {
    id: "body-frame",
    category: "Physical Constitution",
    question: "Which best describes your natural body frame?",
    options: [
      {
        value: "thin",
        text: "Thin, light frame with prominent joints and visible bones",
        dosha: "vata",
        intensity: 3,
      },
      {
        value: "medium",
        text: "Medium build with well-defined muscles and proportionate frame",
        dosha: "pitta",
        intensity: 3,
      },
      {
        value: "large",
        text: "Large, solid frame with tendency to gain weight easily",
        dosha: "kapha",
        intensity: 3,
      },
    ],
  },
  {
    id: "skin-type",
    category: "Dermatological Assessment",
    question: "How would you describe your skin characteristics?",
    options: [
      {
        value: "dry",
        text: "Dry, thin, cool to touch with rough texture and visible veins",
        dosha: "vata",
        intensity: 2,
      },
      {
        value: "warm",
        text: "Warm, oily, prone to rashes, freckles or heat-related irritation",
        dosha: "pitta",
        intensity: 3,
      },
      {
        value: "thick",
        text: "Thick, soft, cool, well-moisturized with good elasticity",
        dosha: "kapha",
        intensity: 2,
      },
    ],
  },
  {
    id: "appetite",
    category: "Metabolic Pattern",
    question: "Describe your appetite and eating patterns:",
    options: [
      {
        value: "irregular",
        text: "Irregular appetite, often forget to eat, sensitive stomach",
        dosha: "vata",
        intensity: 3,
      },
      {
        value: "strong",
        text: "Strong, regular appetite, become irritable or weak when hungry",
        dosha: "pitta",
        intensity: 3,
      },
      {
        value: "steady",
        text: "Steady appetite, can comfortably skip meals without discomfort",
        dosha: "kapha",
        intensity: 2,
      },
    ],
  },
  {
    id: "sleep",
    category: "Circadian Rhythm",
    question: "What's your natural sleep pattern and quality?",
    options: [
      {
        value: "light",
        text: "Light sleeper, difficulty falling asleep, frequent vivid dreams",
        dosha: "vata",
        intensity: 3,
      },
      {
        value: "moderate",
        text: "Moderate sleep duration, fall asleep quickly, intense colorful dreams",
        dosha: "pitta",
        intensity: 2,
      },
      {
        value: "deep",
        text: "Deep, long sleep cycles, slow to wake up, minimal dream recall",
        dosha: "kapha",
        intensity: 3,
      },
    ],
  },
  {
    id: "energy",
    category: "Energy Dynamics",
    question: "How would you describe your energy levels throughout the day?",
    options: [
      {
        value: "bursts",
        text: "Energy comes in bursts, prone to sudden exhaustion and fatigue",
        dosha: "vata",
        intensity: 3,
      },
      {
        value: "intense",
        text: "Intense, focused energy with excellent endurance when motivated",
        dosha: "pitta",
        intensity: 3,
      },
      {
        value: "steady",
        text: "Steady, consistent energy levels, slow to start but sustainable",
        dosha: "kapha",
        intensity: 2,
      },
    ],
  },
  {
    id: "digestion",
    category: "Digestive Health",
    question: "How is your digestion typically?",
    options: [
      {
        value: "variable",
        text: "Variable digestion - sometimes excellent, sometimes gas and bloating",
        dosha: "vata",
        intensity: 2,
      },
      {
        value: "strong",
        text: "Strong, efficient digestion, rarely experience digestive issues",
        dosha: "pitta",
        intensity: 3,
      },
      {
        value: "slow",
        text: "Slow but thorough digestion, feel heavy or sluggish after meals",
        dosha: "kapha",
        intensity: 2,
      },
    ],
  },
  {
    id: "temperament",
    category: "Psychological Profile",
    question: "Which temperament best describes your mental constitution?",
    options: [
      {
        value: "creative",
        text: "Highly creative, enthusiastic, imaginative but prone to anxiety",
        dosha: "vata",
        intensity: 3,
      },
      {
        value: "focused",
        text: "Goal-oriented, competitive, decisive but can be irritable or impatient",
        dosha: "pitta",
        intensity: 3,
      },
      {
        value: "calm",
        text: "Naturally calm, steady, compassionate but resistant to change",
        dosha: "kapha",
        intensity: 2,
      },
    ],
  },
  {
    id: "weather",
    category: "Environmental Sensitivity",
    question: "Which environmental conditions do you prefer and feel best in?",
    options: [
      {
        value: "warm",
        text: "Warm, humid weather with protection from cold wind and dry air",
        dosha: "vata",
        intensity: 2,
      },
      {
        value: "cool",
        text: "Cool, well-ventilated spaces with minimal heat and direct sunlight",
        dosha: "pitta",
        intensity: 3,
      },
      {
        value: "warm-dry",
        text: "Warm, dry climate with good air circulation, avoid cold and dampness",
        dosha: "kapha",
        intensity: 2,
      },
    ],
  },
];

interface PrakritiAssessmentProps {
  onNavigate?: (view: string) => void;
}

export default function PrakritiAssessment({
  onNavigate,
}: PrakritiAssessmentProps) {
  // Enhanced State Management
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<{
    vata: number;
    pitta: number;
    kapha: number;
    weighted: { vata: number; pitta: number; kapha: number };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const [timeSpent, setTimeSpent] = useState(0);
  const [finalTime, setFinalTime] = useState<number | null>(null);
  const [startTime] = useState(Date.now());
  useEffect(() => {
    if (showResults) return; // Stop timer when results are shown
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, showResults]);

  const progress = showResults
    ? 100
    : ((currentQuestion + 1) / questions.length) * 100;

  // Enhanced Dosha Icons with medical aesthetics
  const doshaIcons = {
    vata: <Cloud className="h-8 w-8 text-sky-500 drop-shadow-lg" />,
    pitta: <Flame className="h-8 w-8 text-orange-500 drop-shadow-lg" />,
    kapha: <Droplet className="h-8 w-8 text-emerald-600 drop-shadow-lg" />,
  };

  // Professional Healthcare Color Palette
  const doshaColors = {
    vata: {
      primary: "from-sky-500 to-[#10B981]",
      secondary: "from-emerald-100 to-emerald-100",
      accent: "border-sky-300",
      text: "text-sky-700",
      bg: "bg-sky-50",
    },
    pitta: {
      primary: "from-orange-500 to-red-600",
      secondary: "from-orange-100 to-red-100",
      accent: "border-orange-300",
      text: "text-orange-700",
      bg: "bg-orange-50",
    },
    kapha: {
      primary: "from-emerald-500 to-green-600",
      secondary: "from-emerald-100 to-green-100",
      accent: "border-emerald-300",
      text: "text-emerald-700",
      bg: "bg-emerald-50",
    },
  };

  // Advanced Medical Background with Particle System
  const MedicalBackground = () => (
    <>
      {/* Advanced Healthcare Gradient System */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 z-0" />
      <div className="absolute inset-0 bg-gradient-to-tl from-emerald-50/80 via-transparent to-sky-50/80 z-0" />

      {/* Medical Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.15] z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Floating Medical Particles */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full blur-sm animate-float-medical opacity-30`}
            style={{
              width: `${12 + (i % 4) * 6}px`,
              height: `${12 + (i % 4) * 6}px`,
              left: `${((i * 7) % 95) + 2}%`,
              top: `${((i * 11) % 90) + 5}%`,
              background: `linear-gradient(135deg, 
                ${
                  i % 3 === 0 ? "#3B82F6" : i % 3 === 1 ? "#10B981" : "#F59E0B"
                }40,
                ${
                  i % 3 === 0 ? "#1D4ED8" : i % 3 === 1 ? "#059669" : "#D97706"
                }60)`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${8 + (i % 3) * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Advanced Medical Icons */}
      <div className="absolute top-20 left-16 text-emerald-400/20 animate-pulse z-0">
        <Microscope size={64} className="animate-spin-slow drop-shadow-lg" />
      </div>
      <div className="absolute top-32 right-20 text-emerald-300/20 animate-bounce z-0">
        <Dna size={72} className="animate-float drop-shadow-lg" />
      </div>
      <div className="absolute bottom-32 left-20 text-orange-400/20 animate-float z-0">
        <Activity size={56} className="animate-pulse drop-shadow-lg" />
      </div>
      <div
        className="absolute bottom-20 right-16 text-sky-400/20 animate-bounce z-0"
        style={{ animationDelay: "1s" }}
      >
        <Hospital size={68} className="animate-spin-slow drop-shadow-lg" />
      </div>
      <div
        className="absolute top-1/2 left-8 text-emerald-300/20 animate-float z-0"
        style={{ animationDelay: "0.5s" }}
      >
        <Pause size={48} className="animate-pulse drop-shadow-lg" />
      </div>

      {/* Subtle Medical Cross */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.08] z-0 pointer-events-none">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="animate-pulse"
        >
          <defs>
            <linearGradient
              id="medicalGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          <rect
            x="85"
            y="25"
            width="30"
            height="150"
            rx="15"
            fill="url(#medicalGradient)"
          />
          <rect
            x="25"
            y="85"
            width="150"
            height="30"
            rx="15"
            fill="url(#medicalGradient)"
          />
        </svg>
      </div>
    </>
  );

  // Professional Loading Animation
  const LoadingAnimation = () => (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-emerald-200 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
        <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-emerald-600 animate-pulse" />
      </div>
      <div className="text-center space-y-2">
        <div className="text-xl font-bold text-emerald-700 animate-pulse">
          Analyzing Your Constitution...
        </div>
        <div className="text-sm text-slate-600 animate-fade-in-out">
          Processing {questions.length} data points with advanced algorithms
        </div>
      </div>
      <div className="flex space-x-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );

  // Enhanced Handlers
  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setFinalTime(timeSpent); // Store the final time when assessment completes
        calculateEnhancedResults();
        setIsLoading(false);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }, 2000);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateEnhancedResults = () => {
    const scores = { vata: 0, pitta: 0, kapha: 0 };
    const weightedScores = { vata: 0, pitta: 0, kapha: 0 };

    Object.entries(answers).forEach(([qid, answer]) => {
      const question = questions.find((q) => q.id === qid);
      if (question) {
        const option = question.options.find((opt) => opt.value === answer);
        if (option) {
          scores[option.dosha]++;
          weightedScores[option.dosha] += option.intensity;
        }
      }
    });

    setResults({
      vata: scores.vata,
      pitta: scores.pitta,
      kapha: scores.kapha,
      weighted: weightedScores,
    });
    setShowResults(true);
  };

  const getPrimaryDosha = () => {
    if (!results) return null;
    return Object.entries(results.weighted).reduce((a, b) =>
      results.weighted[a[0] as keyof typeof results.weighted] >
      results.weighted[b[0] as keyof typeof results.weighted]
        ? a
        : b
    )[0];
  };

  const getDoshaPercentage = (dosha: string) => {
    if (!results) return 0;
    const total = Object.values(results.weighted).reduce(
      (sum, val) => sum + val,
      0
    );
    return Math.round(
      (results.weighted[dosha as keyof typeof results.weighted] / total) * 100
    );
  };

  const getDoshaDescription = (dosha: string) => {
    const descriptions = {
      vata: {
        name: "Vata Prakriti",
        subtitle: "Air & Space Dominant Constitution",
        description:
          "Your constitution is characterized by movement, creativity, and variability. You embody the dynamic forces of air and space elements, making you naturally adaptable but requiring stability and routine for optimal health.",
        characteristics: [
          "Light, lean physical build with visible bone structure",
          "Dry, cool skin with tendency toward roughness",
          "Quick, energetic movements and speech patterns",
          "Highly creative and imaginative mindset",
          "Variable appetite with irregular eating patterns",
          "Light sleep with active dream patterns",
          "Sensitive to cold, wind, and dry conditions",
        ],
        recommendations: [
          "Establish consistent daily routines and meal times",
          "Favor warm, moist, grounding foods (cooked grains, stews)",
          "Regular oil massages with warming oils (sesame, almond)",
          "Avoid excessive cold, raw foods and stimulants",
          "Practice grounding activities (yoga, meditation, nature walks)",
          "Ensure adequate rest and avoid overstimulation",
          "Create warm, stable environments",
        ],
        supplements: ["Ashwagandha", "Brahmi", "Warm herbal teas"],
        lifestyle: "Focus on routine, warmth, and calming practices",
      },
      pitta: {
        name: "Pitta Prakriti",
        subtitle: "Fire & Water Dominant Constitution",
        description:
          "Your constitution is driven by transformation and intensity. You embody the metabolic fire that governs digestion, metabolism, and mental clarity, making you naturally focused but requiring cooling balance.",
        characteristics: [
          "Medium, well-proportioned build with good muscle tone",
          "Warm, oily skin with tendency toward sensitivity",
          "Strong, regular appetite with excellent digestion",
          "Sharp intellect with strong leadership qualities",
          "Goal-oriented with competitive nature",
          "Moderate sleep needs with vivid dreams",
          "Heat sensitivity with preference for cool environments",
        ],
        recommendations: [
          "Choose cooling, sweet, and bitter foods (cucumbers, melons)",
          "Avoid excessive spicy, hot, and acidic foods",
          "Stay cool and avoid prolonged sun exposure",
          "Engage in moderate, non-competitive exercise",
          "Practice cooling pranayama and meditation",
          "Maintain work-life balance to prevent burnout",
          "Use cooling oils like coconut or sunflower for massage",
        ],
        supplements: ["Aloe vera", "Neem", "Cooling herbal teas"],
        lifestyle: "Balance intensity with cooling, calming practices",
      },
      kapha: {
        name: "Kapha Prakriti",
        subtitle: "Water & Earth Dominant Constitution",
        description:
          "Your constitution provides stability and nourishment. You embody the structural elements of water and earth, making you naturally calm and steady but requiring stimulation and movement for optimal vitality.",
        characteristics: [
          "Large, sturdy frame with tendency toward weight gain",
          "Soft, thick, well-moisturized skin",
          "Steady appetite with slow but thorough digestion",
          "Calm, patient, and compassionate nature",
          "Deep, restful sleep with minimal dream recall",
          "Strong immunity and physical endurance",
          "Preference for warm, dry environments",
        ],
        recommendations: [
          "Choose light, warm, spicy foods (ginger, pepper, legumes)",
          "Engage in regular, vigorous physical exercise",
          "Avoid heavy, oily, cold, and dairy-rich foods",
          "Maintain active lifestyle to prevent stagnation",
          "Practice energizing breathing techniques",
          "Use stimulating massage with warming oils",
          "Embrace variety and new experiences",
        ],
        supplements: ["Triphala", "Ginger", "Stimulating herbal teas"],
        lifestyle: "Embrace movement, variety, and energizing activities",
      },
    };
    return descriptions[dosha as keyof typeof descriptions];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-emerald-50/30 overflow-hidden">
        <MedicalBackground />
        <Card className="w-full max-w-lg shadow-2xl border-0 relative z-10 backdrop-blur-xl bg-white/90">
          <CardContent className="p-8">
            <LoadingAnimation />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults && results) {
    const primaryDosha = getPrimaryDosha();
    const doshaInfo = primaryDosha ? getDoshaDescription(primaryDosha) : null;
    const primaryPercentage = primaryDosha
      ? getDoshaPercentage(primaryDosha)
      : 0;
    // Use finalTime if available, else fallback to timeSpent
    const displayTime = finalTime !== null ? finalTime : timeSpent;

    return (
      <div className="min-h-screen relative flex items-start justify-center p-4 bg-gradient-to-br from-slate-50 to-emerald-50/30 overflow-hidden">
        <MedicalBackground />

        {/* Celebration Animation */}
        {showCelebration && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="animate-bounce-in">
              <div className="text-6xl">🎉</div>
            </div>
          </div>
        )}

        <div className="w-full max-w-7xl space-y-6 relative z-10 my-8">
          {/* Header Card */}
          <Card className="shadow-2xl border-0 backdrop-blur-xl bg-gradient-to-r from-emerald-500 via-[#10B981] to-[#10B981] text-white">
            <CardHeader className="text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                  <Award className="h-12 w-12 text-white animate-pulse" />
                </div>
                <div className="text-left">
                  <CardTitle className="text-4xl font-bold tracking-tight">
                    Assessment Complete
                  </CardTitle>
                  <CardDescription className="text-white/90 text-lg mt-2">
                    Your Personalized Ayurvedic Constitution Analysis
                  </CardDescription>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex justify-center gap-8 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{questions.length}</div>
                  <div className="text-sm text-white/80">
                    Questions Analyzed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.floor(displayTime / 60)}:
                    {(displayTime % 60).toString().padStart(2, "0")}
                  </div>
                  <div className="text-sm text-white/80">Time Taken</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{primaryPercentage}%</div>
                  <div className="text-sm text-white/80">Primary Match</div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Results Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Dosha Scores */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-emerald-600" />
                Constitution Analysis
              </h3>

              {Object.entries(results.weighted).map(([dosha, score]) => {
                const percentage = getDoshaPercentage(dosha);
                const colors = doshaColors[dosha as keyof typeof doshaColors];
                const isPrimary = dosha === primaryDosha;

                return (
                  <Card
                    key={dosha}
                    className={`transition-all duration-500 hover:scale-[1.02] ${
                      isPrimary
                        ? "ring-2 ring-emerald-400 shadow-lg"
                        : "shadow-md"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {doshaIcons[dosha as keyof typeof doshaIcons]}
                          <div>
                            <div className="font-bold capitalize text-lg">
                              {dosha}
                            </div>
                            <div className="text-sm text-slate-600">
                              {dosha === "vata"
                                ? "Movement"
                                : dosha === "pitta"
                                ? "Metabolism"
                                : "Structure"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-slate-800">
                            {percentage}%
                          </div>
                          {isPrimary && (
                            <Badge className="bg-emerald-500 text-white">
                              Primary
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                        <div
                          className={`h-3 rounded-full bg-gradient-to-r ${colors.primary} transition-all duration-1000`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <div className="text-xs text-slate-600">
                        Weighted Score: {score} points
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Detailed Analysis */}
            <div className="lg:col-span-2">
              {doshaInfo && (
                <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/95">
                  <CardHeader
                    className={`bg-gradient-to-r ${
                      doshaColors[primaryDosha as keyof typeof doshaColors]
                        .primary
                    } text-white rounded-t-lg`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 p-3 rounded-full">
                        {doshaIcons[primaryDosha as keyof typeof doshaIcons]}
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold">
                          {doshaInfo.name}
                        </CardTitle>
                        <CardDescription className="text-white/90 text-base">
                          {doshaInfo.subtitle}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-8 space-y-8">
                    {/* Description */}
                    <div className="bg-slate-50 p-6 rounded-xl">
                      <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <Target className="h-5 w-5 text-emerald-600" />
                        Your Constitutional Profile
                      </h4>
                      <p className="text-slate-700 leading-relaxed">
                        {doshaInfo.description}
                      </p>
                    </div>

                    {/* Characteristics & Recommendations Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Characteristics */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                          <User className="h-5 w-5 text-[#1F5C3F]" />
                          Key Characteristics
                        </h4>
                        <div className="space-y-3">
                          {doshaInfo.characteristics.map((char, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg"
                            >
                              <CheckCircle2 className="h-4 w-4 text-[#1F5C3F] mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-slate-700">
                                {char}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                          <UtensilsCrossed className="h-5 w-5 text-emerald-600" />
                          Health Recommendations
                        </h4>
                        <div className="space-y-3">
                          {doshaInfo.recommendations.map((rec, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg"
                            >
                              <Apple className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-slate-700">
                                {rec}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Additional Recommendations */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-xl">
                        <h5 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-orange-500" />
                          Recommended Supplements
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {doshaInfo.supplements.map((supp, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-orange-100 text-orange-800"
                            >
                              {supp}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-emerald-50/30 to-pink-50 p-6 rounded-xl">
                        <h5 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                          <Heart className="h-5 w-5 text-[#10B981]" />
                          Lifestyle Focus
                        </h5>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {doshaInfo.lifestyle}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-emerald-500 to-[#10B981] p-3 rounded-full">
                    <Smile className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">
                      Assessment Complete!
                    </div>
                    <div className="text-sm text-slate-600">
                      Your personalized constitution analysis is ready
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    onClick={() => {
                      setCurrentQuestion(0);
                      setAnswers({});
                      setShowResults(false);
                      setResults(null);
                      setFinalTime(null);
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retake Assessment
                  </Button>

                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-emerald-500 via-[#10B981] to-[#10B981] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Health Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main Assessment Interface
  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-emerald-50/30 overflow-hidden">
      <MedicalBackground />

      <div className="w-full max-w-4xl relative z-10">
        {/* Progress Header */}
        <Card className="shadow-xl border-0 backdrop-blur-xl bg-white/95 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-emerald-500 to-[#10B981] p-3 rounded-full">
                  <Brain className="h-6 w-6 text-white animate-pulse" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-800">
                    Ayurvedic Constitution Assessment
                  </div>
                  <div className="text-sm text-slate-600">
                    Advanced Prakriti Analysis System
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-slate-600">Progress</div>
                <div className="text-lg font-bold text-emerald-600">
                  {currentQuestion + 1} of {questions.length}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-600">
                <span>{currentQ.category}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-[#10B981] to-[#10B981] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="shadow-2xl border-0 backdrop-blur-xl bg-white/95">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-emerald-50/30 border-b">
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-r from-emerald-500 to-[#10B981] p-3 rounded-full flex-shrink-0">
                <span className="text-white font-bold text-lg">
                  {currentQuestion + 1}
                </span>
              </div>
              <div className="flex-1">
                <Badge
                  variant="secondary"
                  className="mb-3 bg-emerald-100 text-[#1F5C3F]"
                >
                  {currentQ.category}
                </Badge>
                <CardTitle className="text-2xl leading-relaxed text-slate-800">
                  {currentQ.question}
                </CardTitle>
                <CardDescription className="text-base mt-2 text-slate-600">
                  Select the option that best describes your natural state and
                  tendencies
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <RadioGroup
              value={answers[currentQ.id] || ""}
              onValueChange={handleAnswer}
              className="space-y-4"
            >
              {currentQ.options.map((option, index) => {
                const colors = doshaColors[option.dosha];
                const isSelected = answers[currentQ.id] === option.value;

                return (
                  <div
                    key={option.value}
                    className={`group relative flex items-start gap-4 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:scale-[1.02] ${
                      isSelected
                        ? `${colors.accent} bg-gradient-to-r ${colors.secondary} shadow-lg scale-[1.02]`
                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                    }`}
                    onClick={() => handleAnswer(option.value)}
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      className={`mt-1 ${isSelected ? "border-current" : ""}`}
                    />

                    <div className="flex-1">
                      <Label
                        htmlFor={option.value}
                        className="text-base font-medium leading-relaxed cursor-pointer text-slate-800"
                      >
                        {option.text}
                      </Label>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        variant="secondary"
                        className={`${colors.bg} ${colors.text} flex items-center gap-2`}
                      >
                        {doshaIcons[option.dosha]}
                        <span className="capitalize font-medium">
                          {option.dosha}
                        </span>
                      </Badge>

                      <div className="flex items-center gap-1">
                        {[...Array(3)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < option.intensity
                                ? "text-yellow-400 fill-current"
                                : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </CardContent>

          <div className="p-6 bg-slate-50 border-t">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentQuestion === 0}
                className="border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Timer className="h-4 w-4" />
                {Math.floor(timeSpent / 60)}:
                {(timeSpent % 60).toString().padStart(2, "0")}
              </div>

              <Button
                onClick={handleNext}
                disabled={!answers[currentQ.id]}
                className="bg-gradient-to-r from-emerald-500 via-[#10B981] to-[#10B981] text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed px-6"
              >
                {currentQuestion === questions.length - 1 ? (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Analyze Results
                  </>
                ) : (
                  <>
                    Next Question
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Footer Info */}
        <Card className="mt-6 shadow-md border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-8 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                HIPAA Compliant & Secure
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#10B981]" />
                Trusted by 10K+ users
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-[#10B981]" />
                Clinically Validated
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes float-medical {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes bounce-in {
          0% {
            transform: scale(0.3) rotate(-10deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) rotate(5deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        @keyframes fade-in-out {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float-medical {
          animation: float-medical 8s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out forwards;
        }
        .animate-fade-in-out {
          animation: fade-in-out 2s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
