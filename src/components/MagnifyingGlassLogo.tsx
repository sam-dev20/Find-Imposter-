import React from 'react';

interface MagnifyingGlassLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withContainer?: boolean;
}

export const MagnifyingGlassLogo: React.FC<MagnifyingGlassLogoProps> = ({
  size = 'md',
  className = '',
  withContainer = true,
}) => {
  // Dimensions for container & SVG
  const containerDimensions = {
    sm: 'w-8 h-8 rounded-lg p-1.5',
    md: 'w-12 h-12 rounded-xl p-2.5',
    lg: 'w-16 h-16 rounded-2xl p-3',
    xl: 'w-24 h-24 rounded-3xl p-4',
  };

  const svgDimensions = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16',
  };

  const svgContent = (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${svgDimensions[size]} transition-transform duration-300`}
    >
      {/* Soft Ambient Lens Backing */}
      <circle cx="21" cy="21" r="14" fill="#F8FAFC" />

      {/* Subtle Specular Glint in Glass */}
      <path
        d="M13 15C14.5 11.5 18 9.5 22 9.5"
        stroke="#CBD5E1"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Main Magnifying Lens Outer Rim */}
      <circle
        cx="21"
        cy="21"
        r="13"
        stroke="#1E293B"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Mysterious Inquisitive Center Pupil/Core */}
      <circle cx="21" cy="21" r="3.5" fill="#0F172A" />
      <circle cx="22.5" cy="19.5" r="1.2" fill="#FFFFFF" />

      {/* Handle Collar / Ring Connector */}
      <rect
        x="29.5"
        y="29.5"
        width="6"
        height="4"
        rx="1.5"
        transform="rotate(45 29.5 29.5)"
        fill="#64748B"
      />

      {/* Sleek Ergonomic Handle */}
      <path
        d="M32.5 32.5L42 42"
        stroke="#0F172A"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Handle Grip Highlight */}
      <path
        d="M35 35L40 40"
        stroke="#475569"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  if (!withContainer) {
    return <div className={`inline-flex items-center justify-center ${className}`}>{svgContent}</div>;
  }

  return (
    <div
      className={`inline-flex items-center justify-center bg-white border border-neutral-200/90 shadow-sm ${containerDimensions[size]} ${className}`}
      style={{
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
      }}
    >
      {svgContent}
    </div>
  );
};
