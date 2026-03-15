import DoctorDashboard from "../DoctorDashboard";

export default function DoctorDashboardExample() {
  const mockNavigate = (view: string) => {
    console.log("Mock navigation:", view);
  };

  return <DoctorDashboard onNavigate={mockNavigate} />;
}
