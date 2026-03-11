import { useState } from "react";
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
  Stethoscope,
  User,
  Award,
  MapPin,
  BookOpen,
  FileText,
  CheckCircle2,
  UploadCloud,
  Sparkles,
  Heart,
  Leaf,
} from "lucide-react";

const qualificationsList = [
  "BAMS (Bachelor of Ayurvedic Medicine & Surgery)",
  "MD (Ayurveda)",
  "PhD (Ayurveda)",
  "Ayurvedic Practitioner",
  "Ayurvedic Therapist",
  "Diploma in Panchakarma",
  "Diploma in Ayurvedic Pharmacy",
  "Other",
];

export default function PractitionerRegistration({
  onNavigate,
}: {
  onNavigate?: (view: string) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    qualifications: [] as string[],
    otherQualification: "",
    locality: "",
    experience: "",
    certificates: "",
    previousWork: "",
    extraInfo: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleQualificationToggle = (q: string) => {
    setForm((prev) => ({
      ...prev,
      qualifications: prev.qualifications.includes(q)
        ? prev.qualifications.filter((item) => item !== q)
        : [...prev.qualifications, q],
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
    else setShowSuccess(true);
  };
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // --- THEME/DECORATIVE ---
  const gradient = "from-[#1F5C3F] via-[#10B981] to-[#0D9488]";

  // --- END THEME ---

  if (showSuccess) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background Gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 animate-pulse`}
        ></div>
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 text-emerald-200/20 animate-bounce">
            <Stethoscope size={40} />
          </div>
          <div className="absolute top-40 right-20 text-emerald-300/20 animate-pulse">
            <Sparkles size={32} />
          </div>
          <div
            className="absolute bottom-32 left-20 text-emerald-200/20 animate-bounce"
            style={{ animationDelay: "1s" }}
          >
            <Heart size={36} />
          </div>
          <div
            className="absolute bottom-20 right-10 text-emerald-300/20 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          >
            <Leaf size={44} />
          </div>
        </div>
        <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
          <Card className="w-full max-w-2xl backdrop-blur-md bg-white/95 shadow-2xl border border-white/20 overflow-hidden animate-fade-in-up">
            <div className="flex flex-col items-center justify-center gap-2 pt-8">
              {/* Celebration Icon Row */}
              <div className="flex items-center justify-center gap-4 mb-2">
                <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
                <CheckCircle2 className="h-14 w-14 text-emerald-500 animate-bounce drop-shadow-lg" />
                <Heart className="h-8 w-8 text-pink-400 animate-bounce" />
              </div>
              {/* Decorative SVG Diagram */}
              <svg
                width="120"
                height="60"
                viewBox="0 0 120 60"
                fill="none"
                className="mb-2"
              >
                <ellipse
                  cx="60"
                  cy="30"
                  rx="55"
                  ry="20"
                  fill="#a5b4fc"
                  fillOpacity="0.15"
                />
                <ellipse
                  cx="60"
                  cy="30"
                  rx="40"
                  ry="12"
                  fill="#818cf8"
                  fillOpacity="0.10"
                />
                <path
                  d="M30 30 Q60 10 90 30"
                  stroke="#818cf8"
                  strokeWidth="2"
                  fill="none"
                />
                <circle cx="60" cy="20" r="4" fill="#34d399" />
              </svg>
              <h2 className="text-3xl font-extrabold text-emerald-700 mb-1 tracking-tight">
                Registration Complete!
              </h2>
              <p className="text-lg text-gray-700 font-medium mb-2">
                Thank you for joining{" "}
                <span className="text-[#1F5C3F] font-bold">TrivedaCare</span>{" "}
                as an Ayurvedic Practitioner.
              </p>
              <p className="text-base text-gray-500 mb-4 max-w-md">
                Your details will be verified by our team. We are excited to
                have you in our network of trusted Vaidyas!
              </p>
              <div className="flex flex-row items-center gap-2 mb-4">
                <Stethoscope className="h-6 w-6 text-[#10B981]" />
                <span className="text-sm text-[#1F5C3F] font-semibold">
                  Ayurveda | Wellness | Community
                </span>
                <Leaf className="h-6 w-6 text-green-500" />
              </div>
              {/* Add extra space below for visual balance */}
              <p className="text-sm text-gray-500 mt-2 mb-0 text-center">
                Your login credentials will be shared by admin.
              </p>
              <div className="h-8" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 animate-pulse`}
      ></div>
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-emerald-200/20 animate-bounce">
          <Stethoscope size={40} />
        </div>
        <div className="absolute top-40 right-20 text-emerald-300/20 animate-pulse">
          <Sparkles size={32} />
        </div>
        <div
          className="absolute bottom-32 left-20 text-emerald-200/20 animate-bounce"
          style={{ animationDelay: "1s" }}
        >
          <Heart size={36} />
        </div>
        <div
          className="absolute bottom-20 right-10 text-emerald-300/20 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        >
          <Leaf size={44} />
        </div>
      </div>
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-2xl backdrop-blur-sm bg-white/95 shadow-2xl border border-white/20 overflow-hidden">
          {/* Header with Gradient */}
          <div
            className={`bg-gradient-to-r ${gradient} p-6 text-white relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mr-3">
                  <Stethoscope className="h-6 w-6 text-white" />
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
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold mb-1">
                  Practitioner Registration
                </h2>
                <p className="text-sm text-white/90 font-medium">
                  Join TrivedaCare as a certified Ayurvedic professional
                </p>
                <p className="text-xs text-white/70 mt-2">
                  Provide your credentials and experience to join our network of
                  trusted Vaidyas.
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
          <CardContent className="space-y-8 mt-4">
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <Label
                    htmlFor="name"
                    className="font-bold text-base flex items-center gap-2 mb-1"
                  >
                    <User className="h-4 w-4 text-[#10B981]" /> Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label className="font-bold text-base flex items-center gap-2 mb-1">
                    <Award className="h-4 w-4 text-[#10B981]" /> Qualifications *
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {qualificationsList.map((q) => (
                      <label
                        key={q}
                        className="flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={form.qualifications.includes(q)}
                          onCheckedChange={() => handleQualificationToggle(q)}
                        />
                        <span className="text-sm font-medium">{q}</span>
                      </label>
                    ))}
                  </div>
                  {form.qualifications.includes("Other") && (
                    <Input
                      className="mt-2"
                      placeholder="Other qualification"
                      value={form.otherQualification}
                      onChange={(e) =>
                        handleChange("otherQualification", e.target.value)
                      }
                    />
                  )}
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <Label
                    htmlFor="locality"
                    className="font-bold text-base flex items-center gap-2 mb-1"
                  >
                    <MapPin className="h-4 w-4 text-[#10B981]" /> Locality *
                  </Label>
                  <Input
                    id="locality"
                    value={form.locality}
                    onChange={(e) => handleChange("locality", e.target.value)}
                    placeholder="City, State"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="experience"
                    className="font-bold text-base flex items-center gap-2 mb-1"
                  >
                    <BookOpen className="h-4 w-4 text-[#10B981]" /> Years of
                    Experience *
                  </Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    value={form.experience}
                    onChange={(e) => handleChange("experience", e.target.value)}
                    placeholder="e.g. 5"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="certificates"
                    className="font-bold text-base flex items-center gap-2 mb-1"
                  >
                    <UploadCloud className="h-4 w-4 text-[#10B981]" /> Ayurvedic
                    Certificates (upload or details) *
                  </Label>
                  <Input
                    id="certificates"
                    value={form.certificates}
                    onChange={(e) =>
                      handleChange("certificates", e.target.value)
                    }
                    placeholder="Certificate details or upload link"
                    required
                  />
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <Label
                    htmlFor="previousWork"
                    className="font-bold text-base flex items-center gap-2 mb-1"
                  >
                    <FileText className="h-4 w-4 text-[#10B981]" /> Previous Work
                    / Experience *
                  </Label>
                  <Input
                    id="previousWork"
                    value={form.previousWork}
                    onChange={(e) =>
                      handleChange("previousWork", e.target.value)
                    }
                    placeholder="Describe your previous work or experience"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="extraInfo"
                    className="font-bold text-base flex items-center gap-2 mb-1"
                  >
                    <Stethoscope className="h-4 w-4 text-[#10B981]" /> Additional
                    Information (optional)
                  </Label>
                  <Input
                    id="extraInfo"
                    value={form.extraInfo}
                    onChange={(e) => handleChange("extraInfo", e.target.value)}
                    placeholder="Any other info you'd like to share (optional)"
                  />
                </div>
              </div>
            )}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <Button onClick={handleNext}>
                {currentStep === totalSteps ? "Submit" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
