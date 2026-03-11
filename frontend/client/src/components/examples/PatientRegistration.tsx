import PatientRegistration from '../PatientRegistration'

export default function PatientRegistrationExample() {
  const mockNavigate = (view: string) => {
    console.log('Mock navigation:', view);
  };
  
  return <PatientRegistration onNavigate={mockNavigate} />
}