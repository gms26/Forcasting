import React from 'react';
import { Calendar } from 'lucide-react';

export default function ForecastPeriodSlider({ period, onChange, disabled }) {
  return (
    <div className="ai-card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-white">Forecast Horizon</h3>
        <div className="flex items-center space-x-1.5 bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 px-3 py-1 rounded-full text-xs font-bold font-mono shadow-xs">
          <Calendar className="h-3.5 w-3.5 text-cyan-400" />
          <span>Next {period} Days</span>
        </div>
      </div>
      
      <input
        type="range"
        min="7"
        max="90"
        value={period}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-[#091122] rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-[#1e3a5f]"
      />
      
      <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
        <span>7d (Short)</span>
        <span>30d (Monthly)</span>
        <span>90d (Quarter)</span>
      </div>
    </div>
  );
}
