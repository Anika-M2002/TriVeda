import LandingPage from '../LandingPage'

export default function LandingPageExample() {
  const mockNavigate = (view: string, userType?: 'patient' | 'doctor' | 'admin') => {
    console.log('Mock navigation:', view, userType);
  };
  
  return <LandingPage onNavigate={mockNavigate} />
}