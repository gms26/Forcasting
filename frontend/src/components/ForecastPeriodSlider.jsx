import React from 'react';
import { Calendar } from 'lucide-react';

export default function ForecastPeriodSlider({ period, onChange, disabled }) {
  return (
    <div className="dash-card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-gray-900">Forecast Horizon</h3>
        <div className="flex items-center space-x-1.5 bg-blue-50 text-blue-600 border border-blue-200/80 px-3 py-1 rounded-full text-xs font-semibold">
          <Calendar className="h-3.5 w-3.5" />
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
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      
      <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
        <span>7d</span>
        <span>30d</span>
        <span>90d</span>
      </div>
    </div>
  );
}
