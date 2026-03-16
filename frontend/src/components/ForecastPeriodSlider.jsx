import React from 'react';
import { CalendarDays } from 'lucide-react';

const ForecastPeriodSlider = ({ period, setPeriod }) => {
  return (
    <div className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-navy-700 mt-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-orange-500" /> Forecast Period
        </h2>
        <span className="px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 rounded-full text-sm font-semibold">
          Next {period} Days
        </span>
      </div>
      
      <div className="pt-2 pb-4">
        <input 
          type="range" 
          min="7" 
          max="365" 
          step="1"
          value={period} 
          onChange={(e) => setPeriod(parseInt(e.target.value))} 
          className="w-full h-2 bg-slate-200 dark:bg-navy-600 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
          <span>7d</span>
          <span>90d</span>
          <span>180d</span>
          <span>365d</span>
        </div>
      </div>
    </div>
  );
};

export default ForecastPeriodSlider;
