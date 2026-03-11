import React from 'react';

interface DoshaIndicatorProps {
  vata: number;
  pitta: number;
  kapha: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DoshaIndicator: React.FC<DoshaIndicatorProps> = ({
  vata,
  pitta,
  kapha,
  size = 'md',
  className = '',
}) => {
  // Normalize values to percentages
  const total = vata + pitta + kapha;
  const vataPercent = Math.round((vata / total) * 100);
  const pittaPercent = Math.round((pitta / total) * 100);
  const kaphaPercent = Math.round((kapha / total) * 100);

  // Size styles
  const sizeStyles = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-xs mb-1">
        <span>Vata {vataPercent}%</span>
        <span>Pitta {pittaPercent}%</span>
        <span>Kapha {kaphaPercent}%</span>
      </div>
      <div className={`w-full rounded-full overflow-hidden ${sizeStyles[size]} flex`}>
        <div 
          className="bg-ayurveda-vata transition-all duration-500 ease-in-out" 
          style={{ width: `${vataPercent}%` }}
        />
        <div 
          className="bg-ayurveda-pitta transition-all duration-500 ease-in-out" 
          style={{ width: `${pittaPercent}%` }}
        />
        <div 
          className="bg-ayurveda-kapha transition-all duration-500 ease-in-out" 
          style={{ width: `${kaphaPercent}%` }}
        />
      </div>
    </div>
  );
};

export default DoshaIndicator;