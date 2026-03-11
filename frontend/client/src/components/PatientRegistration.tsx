import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Leaf,
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Weight,
  Ruler,
  Salad,
  HeartPulse,
  AlertCircle,
  Stethoscope,
  CheckCircle2,
  UserCheck,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { useRef } from "react";

interface PatientFormData {
  abhaId: string;
  name: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
  email: string;
  phone: string;
  dietaryHabits: string;
  healthGoals: string[];
  allergies: string;
  chronicConditions: string[];
}

interface PatientRegistrationProps {
  onNavigate?: (view: string) => void;
}
export default function PatientRegistration({
  onNavigate,
}: PatientRegistrationProps) {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PatientFormData>({
    abhaId: "",
    name: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    email: "",
    phone: "",
    dietaryHabits: "",
    healthGoals: [],
    allergies: "",
    chronicConditions: [],
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;
  const formRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      setShowSuccess(true);
    }
  };

  // Handles navigation for assessment
  const handleGoToAssessment = () => {
    if (onNavigate) {
      onNavigate("prakriti-assessment");
    } else {
      setLocation("/patient/assessment");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (
    field: "healthGoals" | "chronicConditions",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Personal Information
            </h3>
            <div className="mb-4">
              <Label htmlFor="abha-id" className="flex items-center gap-1 mb-1">
                <ShieldCheck className="w-4 h-4 text-muted-foreground" /> ABHA
                ID *
              </Label>
              <Input
                id="abha-id"
                data-testid="input-abha-id"
                value={formData.abhaId}
                onChange={(e) => handleInputChange("abhaId", e.target.value)}
                placeholder="Enter your ABHA ID"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="flex items-center gap-1 mb-1">
                  <UserPlus className="w-4 h-4 text-muted-foreground" /> Full
                  Name *
                </Label>
                <Input
                  id="name"
                  data-testid="input-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="age" className="flex items-center gap-1 mb-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" /> Age *
                </Label>
                <Input
                  id="age"
                  data-testid="input-age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="Age in years"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="flex items-center gap-1 mb-1">
                  <Mail className="w-4 h-4 text-muted-foreground" /> Email *
                </Label>
                <Input
                  id="email"
                  data-testid="input-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="flex items-center gap-1 mb-1">
                  <Phone className="w-4 h-4 text-muted-foreground" /> Phone
                  Number *
                </Label>
                <Input
                  id="phone"
                  data-testid="input-phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="gender" className="flex items-center gap-1 mb-1">
                <UserCheck className="w-4 h-4 text-muted-foreground" /> Gender *
              </Label>
              <Select
                onValueChange={(value) => handleInputChange("gender", value)}
                value={formData.gender}
              >
                <SelectTrigger data-testid="select-gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-primary" /> Physical
              Characteristics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="weight"
                  className="flex items-center gap-1 mb-1"
                >
                  <Weight className="w-4 h-4 text-muted-foreground" /> Weight
                  (kg) *
                </Label>
                <Input
                  id="weight"
                  data-testid="input-weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  placeholder="70.5"
                />
              </div>
              <div>
                <Label
                  htmlFor="height"
                  className="flex items-center gap-1 mb-1"
                >
                  <Ruler className="w-4 h-4 text-muted-foreground" /> Height
                  (cm) *
                </Label>
                <Input
                  id="height"
                  data-testid="input-height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  placeholder="170"
                />
              </div>
            </div>
            {formData.weight && formData.height && (
              <div className="bg-muted p-4 rounded-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <p className="text-sm text-muted-foreground">
                  Calculated BMI:{" "}
                  {(
                    parseFloat(formData.weight) /
                    Math.pow(parseFloat(formData.height) / 100, 2)
                  ).toFixed(1)}
                </p>
              </div>
            )}
            <div>
              <Label
                htmlFor="dietaryHabits"
                className="flex items-center gap-1 mb-1"
              >
                <Salad className="w-4 h-4 text-muted-foreground" /> Dietary
                Habits
              </Label>
              <Select
                onValueChange={(value) =>
                  handleInputChange("dietaryHabits", value)
                }
                value={formData.dietaryHabits}
              >
                <SelectTrigger data-testid="select-diet">
                  <SelectValue placeholder="Select dietary preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="eggetarian">Eggetarian</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary" /> Health Goals &
              Preferences
            </h3>
            <div>
              <Label className="text-base font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />{" "}
                Health Goals (Select all that apply)
              </Label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {[
                  "Weight Loss",
                  "Weight Gain",
                  "Better Digestion",
                  "Improved Energy",
                  "Skin Health",
                  "Stress Management",
                  "Sleep Quality",
                  "General Wellness",
                ].map((goal) => (
                  <div key={goal} className="flex items-center space-x-2">
                    <Checkbox
                      id={goal}
                      data-testid={`checkbox-goal-${goal
                        .toLowerCase()
                        .replace(/ /g, "-")}`}
                      checked={formData.healthGoals.includes(goal)}
                      onCheckedChange={() =>
                        handleArrayToggle("healthGoals", goal)
                      }
                    />
                    <Label htmlFor={goal} className="text-sm">
                      {goal}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label
                htmlFor="allergies"
                className="flex items-center gap-1 mb-1"
              >
                <AlertCircle className="w-4 h-4 text-muted-foreground" /> Known
                Allergies
              </Label>
              <Input
                id="allergies"
                data-testid="input-allergies"
                value={formData.allergies}
                onChange={(e) => handleInputChange("allergies", e.target.value)}
                placeholder="e.g., Peanuts, Dairy, Gluten (leave blank if none)"
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary" /> Medical History
            </h3>
            <div>
              <Label className="text-base font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />{" "}
                Chronic Conditions (Select all that apply)
              </Label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {[
                  "Diabetes",
                  "Hypertension",
                  "Heart Disease",
                  "Thyroid Issues",
                  "PCOD/PCOS",
                  "Arthritis",
                  "Digestive Issues",
                  "None",
                ].map((condition) => (
                  <div key={condition} className="flex items-center space-x-2">
                    <Checkbox
                      id={condition}
                      data-testid={`checkbox-condition-${condition
                        .toLowerCase()
                        .replace(/\//g, "-")
                        .replace(/ /g, "-")}`}
                      checked={formData.chronicConditions.includes(condition)}
                      onCheckedChange={() =>
                        handleArrayToggle("chronicConditions", condition)
                      }
                    />
                    <Label htmlFor={condition} className="text-sm">
                      {condition}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              <p className="text-sm text-muted-foreground">
                <strong>Next Step:</strong> After registration, you'll complete
                a constitutional assessment (Prakriti quiz) to determine your
                Ayurvedic body type for personalized diet recommendations.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 opacity-10 animate-pulse"></div>
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-emerald-200/20 animate-bounce">
          <Leaf size={40} />
        </div>
        <div className="absolute top-40 right-20 text-teal-300/20 animate-pulse">
          <HeartPulse size={32} />
        </div>
        <div
          className="absolute bottom-32 left-20 text-cyan-200/20 animate-bounce"
          style={{ animationDelay: "1s" }}
        >
          <User size={36} />
        </div>
        <div
          className="absolute bottom-20 right-10 text-emerald-300/20 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        >
          <Salad size={44} />
        </div>
      </div>
      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-2xl backdrop-blur-sm bg-white/95 shadow-2xl border border-white/20 overflow-hidden animate-fade-in">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mr-3">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <div className="text-center">
                  <h1 className="text-2xl font-bold tracking-wide">
                    TrivedaCare
                  </h1>
                  <p className="text-xs text-white/80 font-medium">
                    Ayurvedic Wellness Platform
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/15 backdrop-blur-sm rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold mb-1">
                  Sacred Patient Registration
                </h2>
                <p className="text-sm text-white/90 font-medium">
                  Step {currentStep} of {totalSteps}: Complete your profile for
                  personalized Ayurvedic care
                </p>
              </div>
            </div>
            {/* Decorative wave */}
            <div className="absolute bottom-0 left-0 right-0 h-4">
              <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                className="w-full h-full"
              >
                <path
                  d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
                  fill="white"
                  opacity="0.1"
                />
              </svg>
            </div>
          </div>
          <CardContent ref={formRef} className="p-8">
            <Progress value={progress} className="w-full mt-2 mb-6" />
            {showSuccess ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] animate-fade-in">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mb-4 animate-bounce-in" />
                <h2 className="text-xl font-semibold mb-2 text-emerald-700">
                  Submitted for Assessment!
                </h2>
                <p className="text-base text-muted-foreground mb-4 text-center max-w-md">
                  Thank you for completing your registration. Soon a
                  practitioner will be assigned to you for the onboarding
                  process.
                  <br />
                  <span className="text-primary font-medium">
                    You may now proceed to your Prakriti Assessment.
                  </span>
                </p>
                <Button
                  className="mt-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 hover:scale-[1.02] transition-all duration-300"
                  variant="default"
                  onClick={handleGoToAssessment}
                  data-testid="button-proceed-assessment"
                >
                  <ArrowRight className="w-4 h-4 mr-2" /> Go to Assessment
                </Button>
              </div>
            ) : (
              <>
                {renderStep()}
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    data-testid="button-back"
                    className="flex items-center gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-lg font-medium"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    data-testid="button-next"
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 hover:scale-[1.02] transition-all duration-300"
                  >
                    {currentStep === totalSteps ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" /> Complete
                        Registration
                      </>
                    ) : (
                      <>
                        Next <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
