import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Briefcase,
} from "lucide-react";

const qualificationsList = [
  "BAMS (Bachelor of Ayurvedic Medicine & Surgery)",
  "MD (Ayurveda)",
  "PhD (Ayurveda)",
  "Ayurvedic Doctor",
  "Ayurvedic Therapist",
  "Diploma in Panchakarma",
  "Diploma in Ayurvedic Pharmacy",
  "Other",
];

export default function DoctorRegistration({
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  // Track mouse for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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

  // Ayurvedic-inspired gradient palette
  const gradients = {
    primary: "from-amber-500 via-orange-500 to-rose-500",
    secondary: "from-emerald-500 via-teal-500 to-cyan-500",
    accent: "from-saffron-400 via-amber-500 to-orange-500",
  };

  // Step icons mapping
  const stepIcons = {
    1: <User className="h-5 w-5" />,
    2: <MapPin className="h-5 w-5" />,
    3: <Briefcase className="h-5 w-5" />,
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50">
        {/* Animated Background with Parallax */}
        <div 
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100 via-orange-100/50 to-transparent opacity-30"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
        </div>

        {/* Decorative Ayurvedic Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-[10%] animate-float-slow">
            <Leaf className="h-16 w-16 text-amber-200/30" />
          </div>
          <div className="absolute bottom-10 right-[15%] animate-float-slower">
            <Heart className="h-20 w-20 text-rose-200/30" />
          </div>
          <div className="absolute top-1/2 left-[20%] animate-pulse-slow">
            <Sparkles className="h-12 w-12 text-orange-200/30" />
          </div>
          <div className="absolute top-1/3 right-[25%] animate-spin-slow">
            <Stethoscope className="h-14 w-14 text-amber-200/30" />
          </div>
        </div>

        {/* Main Success Card */}
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent"
            style={{
              transform: `translateY(${mousePosition.y * 0.5}px)`,
            }}
          ></div>
          
          <Card className="relative w-full max-w-2xl overflow-hidden group">
            {/* Animated border gradient */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur"></div>
            
            <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl">
              {/* Top Decorative Strip */}
              <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"></div>
              
              <CardContent className="p-8">
                {/* Celebration Animation */}
                <div className="relative mb-8">
                  {/* Rotating Circle */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-amber-200 rounded-full animate-spin-slow"></div>
                  
                  {/* Icon Row */}
                  <div className="relative flex items-center justify-center gap-6 mb-6">
                    <div className="animate-bounce-slow">
                      <Sparkles className="h-10 w-10 text-amber-400" />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
                      <CheckCircle2 className="h-20 w-20 text-emerald-500 relative z-10" />
                    </div>
                    <div className="animate-bounce-slow animation-delay-1000">
                      <Heart className="h-10 w-10 text-rose-400" />
                    </div>
                  </div>

                  {/* Animated Dots */}
                  <div className="flex justify-center gap-2 mt-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 200}ms` }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Success Message */}
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
                    Registration Complete!
                  </h2>
                  
                  <p className="text-xl text-stone-700">
                    Thank you for joining{" "}
                    <span className="font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      TrivedaCare
                    </span>
                  </p>
                  
                  <p className="text-stone-600 max-w-md mx-auto">
                    Your details will be verified by our team. We are excited to
                    have you in our network of trusted Vaidyas!
                  </p>

                  {/* Ayurvedic Symbols */}
                  <div className="flex items-center justify-center gap-4 py-4">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-300"></div>
                    <div className="flex gap-3">
                      <Stethoscope className="h-5 w-5 text-amber-500" />
                      <span className="text-sm font-medium text-stone-500">|</span>
                      <Leaf className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-300"></div>
                  </div>

                  {/* Verification Badge */}
                  <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-200 px-4 py-2">
                    <Clock className="h-4 w-4 mr-2" />
                    Verification in progress
                  </Badge>

                  <p className="text-sm text-stone-500 mt-6">
                    Your login credentials will be shared by admin
                  </p>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50">
      {/* Animated Background with Parallax */}
      <div 
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100 via-orange-100/50 to-transparent opacity-30"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
      </div>

      {/* Decorative Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[5%] animate-float">
          <Leaf className="h-12 w-12 text-amber-200/20" />
        </div>
        <div className="absolute top-40 right-[8%] animate-float animation-delay-1000">
          <Heart className="h-16 w-16 text-rose-200/20" />
        </div>
        <div className="absolute bottom-32 left-[15%] animate-float-slower">
          <Stethoscope className="h-20 w-20 text-orange-200/20" />
        </div>
        <div className="absolute bottom-20 right-[12%] animate-spin-slow">
          <Sparkles className="h-14 w-14 text-amber-200/20" />
        </div>
      </div>

      {/* Main Form Container */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        {/* Progress Bar - Floating above */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
          <div className="relative">
            <div className="h-2 bg-stone-200/50 backdrop-blur-sm rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            {/* Step Indicators */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-1">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`relative flex items-center justify-center transition-all duration-300 ${
                    step <= currentStep ? "scale-110" : "scale-100"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
                      step <= currentStep
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                        : "bg-stone-200/50 text-stone-400"
                    }`}
                  >
                    {step <= currentStep ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      step
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Card */}
        <Card className="relative w-full max-w-2xl overflow-hidden group mt-16">
          {/* Animated border gradient on hover */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur"></div>
          
          <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl">
            {/* Top Gradient Strip */}
            <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"></div>

            {/* Header with Modern Design */}
            <div className="relative px-8 pt-8 pb-6 text-center border-b border-stone-100">
              {/* Decorative Circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-rose-200/20 to-amber-200/20 rounded-full -ml-12 -mb-12"></div>
              
              {/* Logo Area */}
              <div className="relative inline-flex mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-ping opacity-20"></div>
                <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-4">
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
              </div>

              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent mb-2">
                TrivedaCare
              </h1>
              <p className="text-sm font-medium text-stone-500 tracking-wider uppercase">
                Ayurvedic Wellness Platform
              </p>
              
              <div className="mt-4">
                <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-200 px-4 py-2">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Doctor Registration
                </Badge>
              </div>
              
              <p className="text-stone-600 mt-4 max-w-md mx-auto">
                Join our network of trusted Vaidyas and share the ancient wisdom of Ayurveda
              </p>
            </div>

            {/* Form Content */}
            <CardContent className="p-8">
              {/* Step Title */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
                  {stepIcons[currentStep as keyof typeof stepIcons]}
                </div>
                <div>
                  <p className="text-sm text-stone-500">Step {currentStep} of {totalSteps}</p>
                  <h3 className="font-semibold text-stone-800">
                    {currentStep === 1 && "Personal Information"}
                    {currentStep === 2 && "Practice Details"}
                    {currentStep === 3 && "Professional Experience"}
                  </h3>
                </div>
              </div>

              {/* Form Fields with Modern Styling */}
              <div className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                        <User className="h-4 w-4 text-amber-500" />
                        Full Name <span className="text-rose-500">*</span>
                      </Label>
                      <div className="relative group/input">
                        <Input
                          value={form.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          placeholder="Enter your full name"
                          className="pl-4 border-stone-200 focus:border-amber-500 focus:ring-amber-500 transition-all duration-300 hover:border-amber-300"
                        />
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover/input:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Qualifications */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                        <Award className="h-4 w-4 text-amber-500" />
                        Qualifications <span className="text-rose-500">*</span>
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {qualificationsList.map((q, index) => (
                          <label
                            key={q}
                            className={`relative flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 group/checkbox ${
                              form.qualifications.includes(q)
                                ? "border-amber-500 bg-amber-50/50"
                                : "border-stone-200 hover:border-amber-200 bg-white"
                            }`}
                            style={{
                              animationDelay: `${index * 50}ms`,
                            }}
                          >
                            <Checkbox
                              checked={form.qualifications.includes(q)}
                              onCheckedChange={() => handleQualificationToggle(q)}
                              className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                            />
                            <span className="text-sm text-stone-700 flex-1">{q}</span>
                            {form.qualifications.includes(q) && (
                              <CheckCircle2 className="h-4 w-4 text-amber-500 animate-scaleIn" />
                            )}
                          </label>
                        ))}
                      </div>
                      
                      {/* Other Qualification */}
                      {form.qualifications.includes("Other") && (
                        <div className="mt-3 animate-slideDown">
                          <Input
                            placeholder="Specify your qualification"
                            value={form.otherQualification}
                            onChange={(e) => handleChange("otherQualification", e.target.value)}
                            className="border-stone-200 focus:border-amber-500 focus:ring-amber-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Locality */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-amber-500" />
                        Locality <span className="text-rose-500">*</span>
                      </Label>
                      <div className="relative group/input">
                        <Input
                          value={form.locality}
                          onChange={(e) => handleChange("locality", e.target.value)}
                          placeholder="City, State"
                          className="pl-4 border-stone-200 focus:border-amber-500 focus:ring-amber-500 transition-all duration-300 hover:border-amber-300"
                        />
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-amber-500" />
                        Years of Experience <span className="text-rose-500">*</span>
                      </Label>
                      <div className="relative group/input">
                        <Input
                          type="number"
                          min="0"
                          value={form.experience}
                          onChange={(e) => handleChange("experience", e.target.value)}
                          placeholder="e.g. 5"
                          className="pl-4 border-stone-200 focus:border-amber-500 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* Certificates */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                        <UploadCloud className="h-4 w-4 text-amber-500" />
                        Ayurvedic Certificates <span className="text-rose-500">*</span>
                      </Label>
                      <div className="relative group/input">
                        <Input
                          value={form.certificates}
                          onChange={(e) => handleChange("certificates", e.target.value)}
                          placeholder="Certificate details or upload link"
                          className="pl-4 border-stone-200 focus:border-amber-500 focus:ring-amber-500"
                        />
                      </div>
                      <p className="text-xs text-stone-400 mt-1">Upload links or describe your certificates</p>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Previous Work */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-amber-500" />
                        Previous Work / Experience <span className="text-rose-500">*</span>
                      </Label>
                      <div className="relative group/input">
                        <Input
                          value={form.previousWork}
                          onChange={(e) => handleChange("previousWork", e.target.value)}
                          placeholder="Describe your previous work or experience"
                          className="pl-4 border-stone-200 focus:border-amber-500 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* Extra Info */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-amber-500" />
                        Additional Information
                      </Label>
                      <div className="relative group/input">
                        <Input
                          value={form.extraInfo}
                          onChange={(e) => handleChange("extraInfo", e.target.value)}
                          placeholder="Any other info you'd like to share (optional)"
                          className="pl-4 border-stone-200 focus:border-amber-500 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* Summary Preview */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                      <h4 className="text-sm font-medium text-amber-800 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Almost there!
                      </h4>
                      <p className="text-xs text-stone-600">
                        You've completed all steps. Review your information before submitting.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-stone-100">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-all duration-300"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                
                <Button
                  onClick={handleNext}
                  className={`bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 ${
                    currentStep === totalSteps ? "px-8" : "px-6"
                  }`}
                >
                  {currentStep === totalSteps ? (
                    <>
                      Submit Registration
                      <CheckCircle2 className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        
        @keyframes float-slower {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-slower {
          animation: float-slower 10s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
      `}</style>
    </div>
  );
}