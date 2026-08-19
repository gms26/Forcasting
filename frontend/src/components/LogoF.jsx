import React from 'react';

/**
 * 'F' Monogram Symbol:
 * - First half: Solid white top forecast wing + Amber horizon node (matching screenshot)
 * - Second half: Hollow border polygon with space inside for the 'F' stem and arm
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

      {/* First Half: Top Forecast Wing (Solid White, matching screenshot) */}
      <path 
        d="M 11 9 H 24 C 27.5 9 28.5 12 26 15 H 17 Z" 
        fill="#ffffff" 
      />

      {/* Top Amber Predictive Horizon Node */}
      <circle cx="23.5" cy="12" r="2.2" fill="#fbbf24" />

      {/* Second Half: Hollow Drawn Border for 'F' stem and arm with transparent space */}
      <path 
        d="M 15 17 H 21 L 24.5 20.5 H 18.5 V 26 H 15 Z" 
        stroke="#ffffff" 
        strokeWidth="1.5" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}
