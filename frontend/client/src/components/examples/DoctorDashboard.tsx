import PractitionerDashboard from "../PractitionerDashboard";

export default function PractitionerDashboardExample() {
  const mockNavigate = (view: string) => {
    console.log("Mock navigation:", view);
  };

  return <PractitionerDashboard onNavigate={mockNavigate} />;
}
