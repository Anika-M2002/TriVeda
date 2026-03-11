import LoginForm from '../LoginForm'

export default function LoginFormExample() {
  const mockNavigate = (view: string) => {
    console.log('Mock navigation:', view);
  };
  
  return <LoginForm userType="doctor" onNavigate={mockNavigate} />
}