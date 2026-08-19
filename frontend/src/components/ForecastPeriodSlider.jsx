import React from 'react';

export default function ForecastPeriodSlider({ period, onChange, disabled }) {
  return (
    <div className="rasera-card rounded-2xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-white">Forecast Horizon</h3>
        <span className="text-sm font-bold text-[#00131c] bg-gradient-to-r from-[#a2fff4] to-[#6aceff] px-3 py-1 rounded-full shadow-sm">
          {period} Periods
        </span>
      </div>
      
      <input
        type="range"
        min="7"
        max="90"
        value={period}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-[#001726] rounded-lg appearance-none cursor-pointer accent-[#a2fff4]"
      />
      
      <div className="flex justify-between text-xs text-[#94a3b8] mt-2 font-mono">
        <span>7d (Short)</span>
        <span>30d (Standard)</span>
        <span>90d (Quarter)</span>
      </div>
    </div>
  );
}
