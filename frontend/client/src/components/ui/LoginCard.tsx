import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flower2, Sun, Leaf, User, Stethoscope, Building2 } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

interface LoginCardProps {
  role: "patient" | "doctor" | "admin";
  onLogin: () => void;
  onRegister?: () => void;
}

export const LoginCard: React.FC<LoginCardProps> = ({
  role,
  onLogin,
  onRegister,
}) => {
  const { t } = useTranslation(["components/ui/LoginCard"]);
  if (role === "patient") {
    return (
      <Card className="hover-elevate bg-gradient-to-br from-white to-green-50/30 border-primary/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-4 right-4 opacity-20">
          <Flower2 className="h-8 w-8 text-primary rotate-45" />
        </div>
        <CardHeader className="text-center relative z-10">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-full mx-auto mb-4 w-20 h-20 flex items-center justify-center">
            <User className="h-12 w-12 text-white" />
          </div>
          <CardTitle className="text-primary text-xl">
            🧘‍♀️ {t("patient_portal", { ns: "components/ui/LoginCard" })}
          </CardTitle>
          <CardDescription className="text-base">
            {t("patient_portal_desc", { ns: "components/ui/LoginCard" })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full"
            size="lg"
            data-testid="button-patient-login"
            onClick={onLogin}
          >
            {t("login_as_patient", { ns: "components/ui/LoginCard" })}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            data-testid="button-patient-register"
            onClick={onRegister}
          >
            {t("register_new_patient", { ns: "components/ui/LoginCard" })}
          </Button>
        </CardContent>
      </Card>
    );
  }
  if (role === "doctor") {
    return (
      <Card className="hover-elevate bg-gradient-to-br from-white to-green-50/30 border-primary/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-4 left-4 opacity-20">
          <Sun className="h-8 w-8 text-orange-400" />
        </div>
        <CardHeader className="text-center relative z-10">
          <div className="bg-gradient-to-br from-primary to-green-600 p-4 rounded-full mx-auto mb-4 w-20 h-20 flex items-center justify-center">
            <Stethoscope className="h-12 w-12 text-white" />
          </div>
          <CardTitle className="text-primary text-xl">
            🩺 {t("vaidya_dashboard", { ns: "components/ui/LoginCard" })}
          </CardTitle>
          <CardDescription className="text-base">
            {t("vaidya_dashboard_desc", { ns: "components/ui/LoginCard" })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            size="lg"
            data-testid="button-doctor-login"
            onClick={onLogin}
          >
            {t("doctor_login", { ns: "components/ui/LoginCard" })}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            data-testid="button-doctor-register"
            onClick={() => {
              if (onRegister) onRegister();
              else window.location.href = "/doctor/register";
            }}
          >
            {t("register_new_doctor", { ns: "components/ui/LoginCard" })}
          </Button>
        </CardContent>
      </Card>
    );
  }
  // admin
  return (
    <Card className="hover-elevate bg-gradient-to-br from-white to-green-50/30 border-primary/30 shadow-xl relative overflow-hidden">
      <div className="absolute bottom-4 right-4 opacity-20">
        <Leaf className="h-8 w-8 text-primary -rotate-12" />
      </div>
      <CardHeader className="text-center relative z-10">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-full mx-auto mb-4 w-20 h-20 flex items-center justify-center">
          <Building2 className="h-12 w-12 text-white" />
        </div>
        <CardTitle className="text-primary text-xl">
          🏛️ {t("admin_panel", { ns: "components/ui/LoginCard" })}
        </CardTitle>
        <CardDescription className="text-base">
          {t("admin_panel_desc", { ns: "components/ui/LoginCard" })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full"
          size="lg"
          data-testid="button-admin-login"
          onClick={onLogin}
        >
          {t("admin_login", { ns: "components/ui/LoginCard" })}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          data-testid="button-admin-register"
          onClick={onRegister}
        >
          {t("register_new_hospital", { ns: "components/ui/LoginCard" })}
        </Button>
      </CardContent>
    </Card>
  );
};
