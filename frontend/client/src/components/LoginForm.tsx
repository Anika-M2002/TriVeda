import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Leaf,
  ArrowLeft,
  Eye,
  EyeOff,
  User,
  Stethoscope,
  Shield,
  Award,
  Globe,
  CheckCircle,
} from "lucide-react";
import BrandLogo from "@/components/common/BrandLogo";

import { useStaffLogin } from '@/hooks/useAuth';

interface LoginFormProps {
  userType: "patient" | "doctor" | "admin";
}

export default function LoginForm({ userType = "patient" }: LoginFormProps) {
  const loginMutation = useStaffLogin();
  const [formData, setFormData] = useState({
    abhaId: "",
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    if (userType === "patient") {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setLocation("/patient/dashboard");
      }, 1500);
      return;
    }

    loginMutation.mutate({
      email: formData.email,
      password: formData.password,
      role: userType.toUpperCase(),
    });
  };

  const getRoleDetails = () => {
    switch (userType) {
      case "patient":
        return {
          title: "Patient Portal",
          subtitle: "Your Wellness Journey Awaits",
          description:
            "Access personalized Ayurvedic diet charts and holistic health insights",
          icon: User,
          demoCredentials: {
            email: "patient@trivedacare.com",
            password: "patient123",
          },
        };
      case "doctor":
        return {
          title: "Doctor Dashboard",
          subtitle: "Heal with Ancient Wisdom",
          description:
            "Create personalized Ayurvedic treatments and manage patient wellness",
          icon: Stethoscope,
          demoCredentials: {
            email: "doctor@trivedacare.com",
            password: "doctor123",
          },
        };
      case "admin":
        return {
          title: "Admin Portal",
          subtitle: "Manage Holistic Care",
          description:
            "Oversee clinic operations and system administration",
          icon: Shield,
          demoCredentials: {
            email: "admin@trivedacare.com",
            password: "admin123",
          },
        };
      default:
        return {
          title: "Login Portal",
          subtitle: "Welcome Back",
          description: "Please sign in to continue your journey",
          icon: User,
          demoCredentials: { email: "", password: "" },
        };
    }
  };

  const roleDetails = getRoleDetails();
  const RoleIcon = roleDetails.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="w-full px-6 md:px-12 py-6">
        <button
          onClick={() => setLocation("/login")}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors font-sans"
        >
          <ArrowLeft size={16} />
          Back to Role Selection
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-16">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Branding */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-5">
              <BrandLogo textClassName="text-2xl" iconClassName="h-10 w-10" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 font-display">
              {roleDetails.title}
            </h1>
            <p className="text-muted-foreground font-sans">
              {roleDetails.description}
            </p>
          </div>

          {/* Main Card */}
          <Card className="border border-[#1F5C3F]/[0.08] dark:border-emerald-500/10 bg-gradient-to-br from-[#1F5C3F]/[0.03] to-[#10B981]/[0.02] dark:from-white/[0.03] dark:to-white/[0.01] backdrop-blur-sm shadow-lg overflow-hidden">
            {/* Card Header */}
            <div className="px-8 pt-8 pb-4 text-center">
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: "#1F5C3F15" }}
              >
                <RoleIcon size={30} className="text-[#1F5C3F]" />
              </div>
              <h2 className="text-xl font-bold text-foreground font-display">
                {roleDetails.subtitle}
              </h2>
            </div>

            <CardContent className="px-8 pb-8 space-y-6">
              {/* Demo Credentials */}
              <div className="bg-[#1F5C3F]/[0.04] dark:bg-emerald-500/[0.06] p-4 rounded-xl border border-[#1F5C3F]/[0.08] dark:border-emerald-500/10">
                <div className="flex items-center mb-3">
                  <Leaf className="h-4 w-4 text-[#10B981] mr-2" />
                  <p className="font-semibold text-foreground text-sm font-display">
                    Demo Credentials
                  </p>
                  <span className="ml-2 px-2 py-0.5 bg-[#10B981]/10 rounded-full text-xs font-medium text-[#1F5C3F] dark:text-emerald-400">
                    Test
                  </span>
                </div>

                {userType === "patient" ? (
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm font-sans">
                      Click an ABHA ID to auto-fill:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "1234-5678-9012",
                        "2345-6789-0123",
                        "3456-7890-1234",
                        "4567-8901-2345",
                        "5678-9012-3456",
                      ].map((id, index) => (
                        <button
                          key={index}
                          type="button"
                          className="flex items-center gap-1.5 text-xs bg-white dark:bg-white/5 p-2 rounded-lg border border-[#1F5C3F]/[0.08] dark:border-emerald-500/10 hover:border-[#1F5C3F]/30 dark:hover:border-emerald-500/30 transition-colors cursor-pointer text-left"
                          onClick={() => handleInputChange("abhaId", id)}
                        >
                          <CheckCircle className="h-3 w-3 text-[#10B981] flex-shrink-0" />
                          <span className="text-foreground font-mono">
                            {id}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-sm font-sans">
                    <div className="flex items-center p-2 bg-white dark:bg-white/5 rounded-lg">
                      <span className="font-medium text-muted-foreground w-20">
                        Email:
                      </span>
                      <code className="text-[#1F5C3F] dark:text-emerald-400">
                        {roleDetails.demoCredentials.email}
                      </code>
                    </div>
                    <div className="flex items-center p-2 bg-white dark:bg-white/5 rounded-lg">
                      <span className="font-medium text-muted-foreground w-20">
                        Password:
                      </span>
                      <code className="text-[#1F5C3F] dark:text-emerald-400">
                        {roleDetails.demoCredentials.password}
                      </code>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {userType === "patient" ? (
                  <div>
                    <Label
                      htmlFor="abha-id"
                      className="text-foreground font-semibold text-sm font-sans flex items-center gap-2"
                    >
                      <User className="h-4 w-4 text-[#1F5C3F] dark:text-emerald-400" />
                      ABHA ID
                    </Label>
                    <div className="relative mt-1.5">
                      <Input
                        id="abha-id"
                        type="text"
                        value={formData.abhaId}
                        onChange={(e) =>
                          handleInputChange("abhaId", e.target.value)
                        }
                        placeholder="Enter your ABHA ID"
                        className="border-[#1F5C3F]/10 dark:border-emerald-500/10 focus:border-[#10B981] focus:ring-[#10B981]/20 rounded-xl h-12 pl-4"
                        data-testid="input-abha-id"
                        required
                      />
                      {formData.abhaId && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#10B981]">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <Label
                        htmlFor={`email-${userType}`}
                        className="text-foreground font-semibold text-sm font-sans flex items-center gap-2"
                      >
                        <Globe className="h-4 w-4 text-[#1F5C3F] dark:text-emerald-400" />
                        Email Address
                      </Label>
                      <div className="relative mt-1.5">
                        <Input
                          id={`email-${userType}`}
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="Enter your email"
                          className="border-[#1F5C3F]/10 dark:border-emerald-500/10 focus:border-[#10B981] focus:ring-[#10B981]/20 rounded-xl h-12 pl-4"
                          data-testid="input-email"
                          required
                        />
                        {formData.email && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#10B981]">
                            <CheckCircle className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor={`password-${userType}`}
                        className="text-foreground font-semibold text-sm font-sans flex items-center gap-2"
                      >
                        <Shield className="h-4 w-4 text-[#1F5C3F] dark:text-emerald-400" />
                        Password
                      </Label>
                      <div className="relative mt-1.5">
                        <Input
                          id={`password-${userType}`}
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          placeholder="Enter your password"
                          className="border-[#1F5C3F]/10 dark:border-emerald-500/10 focus:border-[#10B981] focus:ring-[#10B981]/20 rounded-xl h-12 pl-4 pr-12"
                          data-testid="input-password"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="remember"
                          checked={formData.rememberMe}
                          onCheckedChange={(checked) =>
                            handleInputChange(
                              "rememberMe",
                              checked as boolean,
                            )
                          }
                          data-testid="checkbox-remember"
                          className="border-[#1F5C3F]/20 data-[state=checked]:bg-[#1F5C3F] data-[state=checked]:border-[#1F5C3F]"
                        />
                        <Label
                          htmlFor="remember"
                          className="text-sm text-muted-foreground cursor-pointer font-sans"
                        >
                          Remember me
                        </Label>
                      </div>
                      <button
                        type="button"
                        className="text-sm font-medium text-[#1F5C3F] dark:text-emerald-400 hover:underline font-sans"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  onClick={handleLogin}
                  disabled={
                    isLoading || loginMutation.isPending ||
                    (userType === "patient"
                      ? !formData.abhaId
                      : !formData.email || !formData.password)
                  }
                  className="w-full h-12 bg-[#1F5C3F] hover:bg-[#174A32] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-sans"
                  data-testid="button-login"
                >
                  {isLoading || loginMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <RoleIcon className="h-4 w-4" />
                      {userType === "patient"
                        ? "Sign in with ABHA ID"
                        : `Sign in as ${userType.charAt(0).toUpperCase() + userType.slice(1)}`}
                    </div>
                  )}
                </Button>

                {/* Registration Button */}
                <Button
                  variant="outline"
                  className="w-full h-11 border-[#1F5C3F]/15 dark:border-emerald-500/15 text-[#1F5C3F] dark:text-emerald-400 hover:bg-[#1F5C3F]/5 dark:hover:bg-emerald-500/5 rounded-xl font-medium font-sans transition-all duration-300"
                  data-testid={`button-${userType}-register`}
                  onClick={
                    userType === "doctor"
                      ? () => setLocation("/doctor/register")
                      : undefined
                  }
                >
                  <RoleIcon className="h-4 w-4 mr-2" />
                  {userType === "patient" && "Register New Patient"}
                  {userType === "doctor" && "Register New Doctor"}
                  {userType === "admin" && "Register New Hospital"}
                </Button>
              </div>
            </CardContent>

            {/* Footer Trust Badges */}
            <div className="px-8 pb-6 flex justify-center gap-4">
              <div className="flex items-center text-xs text-muted-foreground">
                <Shield className="h-3 w-3 mr-1 text-[#10B981]" />
                <span>Secure Login</span>
              </div>
              <div className="w-1 h-1 bg-[#10B981]/30 rounded-full self-center"></div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Award className="h-3 w-3 mr-1 text-[#10B981]" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="w-1 h-1 bg-[#10B981]/30 rounded-full self-center"></div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Globe className="h-3 w-3 mr-1 text-[#10B981]" />
                <span>ABHA Enabled</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
