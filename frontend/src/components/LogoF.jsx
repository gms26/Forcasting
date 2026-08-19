import React from 'react';

/**
 * Creative Forecasting 'F' Monogram Symbol
 * - Vertical stem: Historical time-series base
 * - Top predictive wing: Upward forecast trajectory arrow
 * - Middle horizon bar: Changepoint threshold
 * - Predictive pulse node: AI changepoint anchor
 */
export default function LogoF({ className = "h-7 w-7", glow = true }) {
  const gradientId = React.useId();
  const accentId = React.useId();
  const glowId = React.useId();

  return (
    <svg 
      viewBox="0 0 36 36" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`shrink-0 ${className}`}
    >
      <defs>
        {/* Main Forecasting Gradient: Vibrant Cyan to Electric Blue to Indigo */}
        <linearGradient id={gradientId} x1="2" y1="4" x2="34" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="40%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>

        {/* Upward Trajectory Arrow Highlight */}
        <linearGradient id={accentId} x1="16" y1="4" x2="32" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        {glow && (
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#06b6d4" floodOpacity="0.4" />
          </filter>
        )}
      </defs>

      <g filter={glow ? `url(#${glowId})` : undefined}>
        {/* Vertical Axis Spine (Historical Data Column) */}
        <rect 
          x="5" 
          y="5" 
          width="5.5" 
          height="26" 
          rx="2.75" 
          fill={`url(#${gradientId})`} 
        />

        {/* Top Forward-Projecting Forecast Wing (Predictive Trajectory) */}
        <path 
          d="M5 5 H 26.5 C 28.2 5 29.1 7 28 8.2 L 22.5 14.5 C 21.8 15.3 20.7 15.8 19.6 15.8 H 5 V 5 Z" 
          fill={`url(#${gradientId})`} 
        />
        
        {/* Luminous Arrowhead Accent */}
        <path 
          d="M17 5 H 26.5 C 28.2 5 29.1 7 28 8.2 L 22.5 14.5 H 17.5 L 21.5 9 H 17 V 5 Z" 
          fill={`url(#${accentId})`} 
        />

        {/* Middle Horizon Horizon Bar (Changepoint Bar) */}
        <rect 
          x="5" 
          y="18.5" 
          width="13" 
          height="4.5" 
          rx="2.25" 
          fill={`url(#${gradientId})`} 
        />

        {/* Predictive Horizon Changepoint Node (Cyan Dot) */}
        <circle 
          cx="22.5" 
          cy="20.75" 
          r="2.75" 
          fill="#22d3ee" 
        />
        <circle 
          cx="22.5" 
          cy="20.75" 
          r="1.25" 
          fill="#ffffff" 
        />
      </g>
    </svg>
  );
}
