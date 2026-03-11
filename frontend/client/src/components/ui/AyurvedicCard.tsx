import React from 'react';

interface AyurvedicCardProps {
  title: string;
  children: React.ReactNode;
  doshaType?: 'vata' | 'pitta' | 'kapha';
  className?: string;
}

export const AyurvedicCard: React.FC<AyurvedicCardProps> = ({ 
  title, 
  children, 
  doshaType,
  className = '' 
}) => {
  // Dosha-specific styling
  const doshaStyles = {
    vata: 'border-ayurveda-vata/30 bg-ayurveda-vata/5',
    pitta: 'border-ayurveda-pitta/30 bg-ayurveda-pitta/5',
    kapha: 'border-ayurveda-kapha/30 bg-ayurveda-kapha/5',
  };

  const cardStyle = doshaType 
    ? doshaStyles[doshaType]
    : 'border-ayurveda-sage/30 bg-ayurveda-earth-light';

  return (
    <div className={`rounded-lg border p-4 shadow-sm ${cardStyle} ${className}`}>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div>{children}</div>
    </div>
  );
};

export default AyurvedicCard;