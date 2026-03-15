import React from "react";
import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./lib/ThemeProvider";

// Layout + Pages
import AppLayout from "./components/layout/AppLayout";
import DoctorAppLayout from "./components/layout/DoctorAppLayout";
import NotFound from "@/pages/not-found";
import LandingPage from "./components/LandingPage";
import LoginForm from "./components/LoginForm";
import LoginSelection from "./components/LoginSelection";
import PatientRegistration from "./components/PatientRegistration";
import PrakritiAssessment from "./components/PrakritiAssessment";
import PatientDashboard from "./components/PatientDashboard";
import PatientDietCharts from "./components/PatientDietCharts";
import PatientHealthRecords from "./components/PatientHealthRecords";
import PatientReports from "./components/PatientReports";
import PatientProfile from "./components/PatientProfile";
import PatientSettings from "./components/PatientSettings";
import PatientAppointments from "./components/PatientAppointments";
import DoctorDashboard from "./components/DoctorDashboard";
import AdminDashboard from "./components/AdminDashboard";
import PrakritiFinalization from "./components/PrakritiFinalization";
import WellnessCenterNetwork from "./components/WellnessCenterNetwork";
import AdminAppLayout from "./components/layout/AdminAppLayout";
import DoctorRegistration from "./components/DoctorRegistration";
import PrakritiVerification from "./components/PrakritiVerification";
import DietChartGenerator from "./components/DietChartGenerator";
import Monitoring from "./components/Monitoring";
import DoctorAppointmentsFlow from "./components/DoctorAppointmentsFlow";
import AdminSettings from "./components/AdminSettings";

//
// Route Wrappers (avoid inline functions in <Route>)
//
const PatientDashboardPage = () => (
  <AppLayout userType="patient">
    <PatientDashboard />
  </AppLayout>
);

const PatientDietChartsPage = () => (
  <AppLayout userType="patient">
    <PatientDietCharts />
  </AppLayout>
);

const PatientHealthRecordsPage = () => (
  <AppLayout userType="patient">
    <PatientHealthRecords />
  </AppLayout>
);

const PatientReportsPage = () => (
  <AppLayout userType="patient">
    <PatientReports />
  </AppLayout>
);

const PatientProfilePage = () => (
  <AppLayout userType="patient">
    <PatientProfile />
  </AppLayout>
);

const PatientSettingsPage = () => (
  <AppLayout userType="patient">
    <PatientSettings />
  </AppLayout>
);

const PatientAppointmentsPage = () => (
  <AppLayout userType="patient">
    <PatientAppointments />
  </AppLayout>
);

const DoctorDashboardPage = () => (
  <DoctorAppLayout>
    <DoctorDashboard />
  </DoctorAppLayout>
);

const DoctorPatientProfilePage = ({ patientId }: { patientId: string }) => (
  <DoctorAppLayout>
    <DoctorDashboard patientId={patientId} />
  </DoctorAppLayout>
);

// const DietChartCreationPage = () => (
//   <DoctorAppLayout>
//     <DietChartCreation />
//   </DoctorAppLayout>
// );

const AdminDashboardPage = () => (
  <AdminAppLayout>
    <AdminDashboard />
  </AdminAppLayout>
);

const AdminPrakritiFinalizationPage = () => (
  <AdminAppLayout>
    <PrakritiFinalization />
  </AdminAppLayout>
);

const AdminWellnessNetworkPage = () => (
  <AdminAppLayout>
    <WellnessCenterNetwork />
  </AdminAppLayout>
);

const AdminSettingsPage = () => (
  <AdminAppLayout>
    <AdminSettings />
  </AdminAppLayout>
);

const PrakritiVerificationPage = () => (
  <DoctorAppLayout>
    <PrakritiVerification />
  </DoctorAppLayout>
);

//
// Router Component
//
function Router() {
  return (
    <Switch>
      {/* Landing */}
      <Route path="/" component={LandingPage} />
      <Route path="/landing" component={LandingPage} />

      {/* Login role selection */}
      <Route path="/login" component={LoginSelection} />

      {/* Login form for specific role */}
      <Route
        path="/login/:userType"
        component={({ params }) => (
          <LoginForm
            userType={params.userType as "patient" | "doctor" | "admin"}
          />
        )}
      />

      {/* Patient Routes */}
      <Route
        path="/patient/register"
        component={() => <PatientRegistration />}
      />
      <Route
        path="/patient/assessment"
        component={() => <PrakritiAssessment />}
      />
      <Route path="/patient/dashboard" component={PatientDashboardPage} />
      <Route path="/patient/diet-charts" component={PatientDietChartsPage} />
      <Route
        path="/patient/health-records"
        component={PatientHealthRecordsPage}
      />
      <Route path="/patient/reports" component={PatientReportsPage} />
      <Route path="/patient/profile" component={PatientProfilePage} />
      <Route path="/patient/settings" component={PatientSettingsPage} />
      <Route path="/patient/appointments" component={PatientAppointmentsPage} />

      {/* Doctor Routes */}
      <Route
        path="/doctor/dashboard"
        component={DoctorDashboardPage}
      />
      {/* <Route path="/Doctor/diet-chart" component={DietChartCreationPage} /> */}
      <Route
        path="/doctor/register"
        component={() => <DoctorRegistration />}
      />
      <Route
        path="/doctor/prakriti-verification"
        component={PrakritiVerificationPage}
      />
      <Route
        path="/doctor/diet-chart-generator"
        component={() => (
          <DoctorAppLayout>
            <DietChartGenerator />
          </DoctorAppLayout>
        )}
      />
      <Route
        path="/doctor/monitoring"
        component={() => (
          <DoctorAppLayout>
            <Monitoring />
          </DoctorAppLayout>
        )}
      />
      <Route
        path="/doctor/appointments"
        component={() => (
          <DoctorAppLayout>
            <DoctorAppointmentsFlow />
          </DoctorAppLayout>
        )}
      />
      <Route
        path="/doctor/:patientId"
        component={({ params }) => (
          <DoctorPatientProfilePage patientId={params.patientId} />
        )}
      />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" component={AdminDashboardPage} />
      <Route
        path="/admin/prakriti-finalization"
        component={AdminPrakritiFinalizationPage}
      />
      <Route
        path="/admin/wellness-network"
        component={AdminWellnessNetworkPage}
      />
      <Route path="/admin/settings" component={AdminSettingsPage} />

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen bg-background">
            <Router />
            <Toaster />
          </div>
        </QueryClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
