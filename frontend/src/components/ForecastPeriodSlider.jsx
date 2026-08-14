import React from 'react';
import { CalendarClock } from 'lucide-react';

export default function ForecastPeriodSlider({ period, onChange, disabled }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Forecast Horizon</h3>
        <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          <CalendarClock className="h-4 w-4 mr-2" />
          <span className="font-semibold text-sm">Next {period} Days</span>
        </div>
      </div>
      
      <div className="px-2">
        <input
          type="range"
          min="7"
          max="365"
          step="1"
          value={period}
          onChange={(e) => onChange(parseInt(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium px-1">
          <span>7d</span>
          <span>90d</span>
          <span>180d</span>
          <span>365d</span>
        </div>
      </div>
    </div>
  );
}
