import React from "react";

interface BrandLogoProps {
  className?: string;
  textClassName?: string;
  iconClassName?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "",
  textClassName = "text-xl",
  iconClassName = "h-9 w-9",
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`.trim()}>
      <div
        className={`${iconClassName} rounded-lg bg-[#1F5C3F] dark:bg-emerald-500/20 border border-[#1F5C3F]/20 dark:border-emerald-500/30 flex items-center justify-center shrink-0`.trim()}
      >
        <svg width="20" height="20" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path
            d="M14 2C14 2 6 6 6 14C6 18 8 22 14 26C20 22 22 18 22 14C22 6 14 2 14 2Z"
            stroke="#10B981"
            strokeWidth="1.5"
            fill="#10B981"
            fillOpacity="0.2"
          />
          <path
            d="M14 8V20M10 12C10 12 12 14 14 14C16 14 18 12 18 12"
            stroke="#10B981"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className={`${textClassName} font-bold text-foreground font-display leading-none`.trim()}>
        Tri<span className="text-[#10B981]">Veda</span>
      </span>
    </div>
  );
};

export default BrandLogo;
