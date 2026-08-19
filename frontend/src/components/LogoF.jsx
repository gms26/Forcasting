import React from 'react';

/**
 * Stylish 'F' Brand Symbol for SmartForecast
 * Modern, bold, unmistakably clear 'F' monogram representing predictive forward trajectory.
 */
export default function LogoF({ className = "h-6 w-6", variant = "blue" }) {
  const gradientId = React.useId();

  return (
    <svg 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>

      {/* Main Vertical Spine of 'F' */}
      <rect 
        x="4" 
        y="4" 
        width="5.5" 
        height="24" 
        rx="2.75" 
        fill={`url(#${gradientId})`} 
      />

      {/* Top Main Bar of 'F' with sleek forward forecast vector */}
      <path 
        d="M4 6.75 C4 5.23 5.23 4 6.75 4 H 24.5 C 26.2 4 27.2 5.8 26.3 7.2 L 23.5 11.5 C 22.8 12.5 21.6 13 20.4 13 H 4 V 6.75 Z" 
        fill={`url(#${gradientId})`} 
      />

      {/* Middle Bar of 'F' */}
      <rect 
        x="4" 
        y="15.5" 
        width="13.5" 
        height="5" 
        rx="2.5" 
        fill={`url(#${gradientId})`} 
      />
    </svg>
  );
}
