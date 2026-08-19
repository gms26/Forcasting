import React from 'react';

/**
 * 'F' Monogram Symbol:
 * - First half: Solid white top forecast wing + Amber horizon node
 * - Second half: Crisp white drawn border stem & arm for the 'F'
 */
export default function LogoF({ className = "h-9 w-9" }) {
  return (
    <svg 
      viewBox="0 0 36 36" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="logoFBadgeGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>

      {/* Rounded Soft Gradient Badge */}
      <rect width="36" height="36" rx="9" fill="url(#logoFBadgeGrad)" />

      {/* First Half: Top Forecast Wing (Solid White) */}
      <path 
        d="M 9 8 H 26 C 27.5 8 28.3 9.6 27.2 10.7 L 22.5 16 H 9 V 8 Z" 
        fill="#ffffff" 
      />

      {/* Top Amber Predictive Horizon Node */}
      <circle cx="25" cy="11" r="2.5" fill="#fbbf24" />

      {/* Second Half: Drawn Crisp White Border & Stem for 'F' */}
      <path 
        d="M 9.5 8 V 27.5 M 9.5 17.5 H 19.5" 
        stroke="#ffffff" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}
