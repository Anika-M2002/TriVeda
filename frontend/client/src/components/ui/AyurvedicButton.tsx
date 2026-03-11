import React from 'react';

interface AyurvedicButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const AyurvedicButton: React.FC<AyurvedicButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}) => {
  // Variant styles
  const variantStyles = {
    primary: 'bg-ayurveda-sage hover:bg-ayurveda-sage-dark text-foreground',
    secondary: 'bg-ayurveda-earth hover:bg-ayurveda-earth-dark text-foreground',
    outline: 'bg-transparent border border-ayurveda-sage text-foreground hover:bg-ayurveda-sage/10',
  };

  // Size styles
  const sizeStyles = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        rounded-md font-medium transition-colors
        focus:outline-none focus:ring-2 focus:ring-ayurveda-sage focus:ring-opacity-50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default AyurvedicButton;