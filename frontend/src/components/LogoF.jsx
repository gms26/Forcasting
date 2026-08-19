import React from 'react';

/**
 * High-Visibility Professional 'F' Monogram
 * Pure white bold 'F' on a soft royal blue & cyan gradient badge.
 * Perfectly visible on dark and light browser tabs, navbars, and headers.
 */
export default function LogoF({ className = "h-7 w-7" }) {
  return (
    <svg 
      viewBox="0 0 36 36" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="logoBadgeGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="60%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>

      {/* Rounded Soft Royal Blue Badge */}
      <rect width="36" height="36" rx="9" fill="url(#logoBadgeGrad)" />

      {/* Solid Crisp White 'F' Monogram with Predictive Trajectory Top Vector */}
      <path 
        d="M9 8 H 27 C 28.2 8 28.8 9.5 28 10.4 L 24 14.5 H 14.5 V 17.5 H 22 C 22.8 17.5 23.5 18.2 23.5 19 V 20.5 C 23.5 21.3 22.8 22 H 14.5 V 28 C 14.5 28.8 13.8 29.5 13 V 29.5 C 12.2 29.5 11.5 28.8 11.5 28 V 10.5 C 11.5 9.1 10.4 8 9 8 Z" 
        fill="#ffffff" 
      />

      {/* Luminous Forecasting Dot Node */}
      <circle cx="25.5" cy="11.5" r="2" fill="#67e8f9" />
    </svg>
  );
}
