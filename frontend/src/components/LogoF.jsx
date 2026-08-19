import React from 'react';

/**
 * Stylish 'F' Brand Symbol for SmartForecast
 * Modern geometric monogram incorporating time-series forward trajectory and predictive vector optics.
 */
export default function LogoF({ className = "h-5 w-5", glow = true, variant = "cyan" }) {
  const gradientId = React.useId();
  const glowId = React.useId();
  const accentId = React.useId();

  return (
    <svg 
      viewBox="0 0 36 36" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="45%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>

        <linearGradient id={accentId} x1="20" y1="4" x2="32" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        {glow && (
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#22d3ee" floodOpacity="0.6"/>
          </filter>
        )}
      </defs>

      {/* 1. Main Vertical Spine of 'F' */}
      <rect 
        x="6" 
        y="5" 
        width="5" 
        height="26" 
        rx="2.5" 
        fill={`url(#${gradientId})`} 
      />

      {/* 2. Top Forward-Predictive Vector Wing of 'F' */}
      <path 
        d="M6 5 H 28.5 C 29.8 5 30.5 6.4 29.6 7.4 L 24.2 13 H 6 V 5 Z" 
        fill={`url(#${gradientId})`} 
      />

      {/* Top Wing Speed Apex Highlight */}
      <path 
        d="M20 5 H 28.5 C 29.8 5 30.5 6.4 29.6 7.4 L 24.2 13 H 19.5 L 23.5 7.5 H 20 V 5 Z" 
        fill={`url(#${accentId})`} 
        filter={glow ? `url(#${glowId})` : undefined}
      />

      {/* 3. Middle Forecast Horizon Bar of 'F' */}
      <rect 
        x="6" 
        y="16.5" 
        width="14" 
        height="4.5" 
        rx="2.25" 
        fill={`url(#${gradientId})`} 
      />

      {/* 4. Forecasting Changepoint Node Point */}
      <circle 
        cx="23.5" 
        cy="18.75" 
        r="2.25" 
        fill="#22d3ee" 
        filter={glow ? `url(#${glowId})` : undefined}
      />
    </svg>
  );
}
