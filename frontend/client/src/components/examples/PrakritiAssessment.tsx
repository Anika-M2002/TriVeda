import PrakritiAssessment from '../PrakritiAssessment'

export default function PrakritiAssessmentExample() {
  const mockNavigate = (view: string) => {
    console.log('Mock navigation:', view);
  };
  
  return <PrakritiAssessment onNavigate={mockNavigate} />
}