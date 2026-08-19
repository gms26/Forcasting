import React from 'react';

/**
 * Stylish 'F' Brand Symbol for SmartForecast
 * Modern, bold, unmistakably clear 'F' monogram in vibrant Ice-Cyan & Electric-Blue gradient.
 */
export default function LogoF({ className = "h-6 w-6", glow = true }) {
  const gradientId = React.useId();
  const glowId = React.useId();

  return (
    <svg 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a2fff4" />
          <stop offset="45%" stopColor="#6aceff" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>

        {glow && (
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#6aceff" floodOpacity="0.45" />
          </filter>
        )}
      </defs>

      {/* Main Vertical Spine of 'F' */}
      <rect 
        x="4" 
        y="4" 
        width="5.5" 
        height="24" 
        rx="2.75" 
        fill={`url(#${gradientId})`} 
        filter={glow ? `url(#${glowId})` : undefined}
      />

      {/* Top Main Bar of 'F' with sleek forward forecast vector */}
      <path 
        d="M4 6.75 C4 5.23 5.23 4 6.75 4 H 24.5 C 26.2 4 27.2 5.8 26.3 7.2 L 23.5 11.5 C 22.8 12.5 21.6 13 20.4 13 H 4 V 6.75 Z" 
        fill={`url(#${gradientId})`} 
        filter={glow ? `url(#${glowId})` : undefined}
      />

      {/* Middle Bar of 'F' */}
      <rect 
        x="4" 
        y="15.5" 
        width="13.5" 
        height="5" 
        rx="2.5" 
        fill={`url(#${gradientId})`} 
        filter={glow ? `url(#${glowId})` : undefined}
      />
    </svg>
  );
}
