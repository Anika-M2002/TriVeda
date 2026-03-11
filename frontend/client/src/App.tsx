import React from "react";
import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./lib/ThemeProvider";

// Layout + Pages
import AppLayout from "./components/layout/AppLayout";
import PractitionerAppLayout from "./components/layout/PractitionerAppLayout";
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
import PractitionerDashboard from "./components/PractitionerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import PrakritiFinalization from "./components/PrakritiFinalization";
import WellnessCenterNetwork from "./components/WellnessCenterNetwork";
import AdminAppLayout from "./components/layout/AdminAppLayout";
import PractitionerRegistration from "./components/PractitionerRegistration";
import PrakritiVerification from "./components/PrakritiVerification";
import DietChartGenerator from "./components/DietChartGenerator";
import Monitoring from "./components/Monitoring";

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

const PractitionerDashboardPage = () => (
  <PractitionerAppLayout>
    <PractitionerDashboard />
  </PractitionerAppLayout>
);

// const DietChartCreationPage = () => (
//   <PractitionerAppLayout>
//     <DietChartCreation />
//   </PractitionerAppLayout>
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

const PrakritiVerificationPage = () => (
  <PractitionerAppLayout>
    <PrakritiVerification />
  </PractitionerAppLayout>
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

      {/* Practitioner Routes */}
      <Route
        path="/practitioner/dashboard"
        component={PractitionerDashboardPage}
      />
      {/* <Route path="/practitioner/diet-chart" component={DietChartCreationPage} /> */}
      <Route
        path="/practitioner/register"
        component={() => <PractitionerRegistration />}
      />
      <Route
        path="/practitioner/prakriti-verification"
        component={PrakritiVerificationPage}
      />
      <Route
        path="/practitioner/diet-chart-generator"
        component={() => (
          <PractitionerAppLayout>
            <DietChartGenerator />
          </PractitionerAppLayout>
        )}
      />
      <Route
        path="/practitioner/monitoring"
        component={() => (
          <PractitionerAppLayout>
            <Monitoring />
          </PractitionerAppLayout>
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
