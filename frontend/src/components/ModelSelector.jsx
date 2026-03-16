import React, { useEffect, useState } from 'react';
import { Settings2, Info } from 'lucide-react';

const MODELS = [
  { id: 'Moving Average', name: 'Moving Average', desc: 'Simple and fast. Best for short-term trends, smooths out noise.' },
  { id: 'ARIMA', name: 'ARIMA (Auto)', desc: 'Statistical model. Good for data with clear trends and weekly seasonality.' },
  { id: 'Holt-Winters', name: 'Holt-Winters', desc: 'Robust statistical model using Exponential Smoothing. Excellent for data with strong seasonal patterns.' }
];

const ModelSelector = ({ selectedModel, onChange }) => {
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('smartforecast_model');
    if (saved && MODELS.find(m => m.id === saved)) {
      onChange(saved);
    }
  }, []);

  const handleChange = (id) => {
    localStorage.setItem('smartforecast_model', id);
    onChange(id);
  };

  return (
    <div className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-navy-700 mt-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <Settings2 className="w-5 h-5 text-orange-500" /> Model Selection
      </h2>
      
      <div className="space-y-3">
        {MODELS.map((model) => (
          <div key={model.id} className="relative">
            <label 
              className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                ${selectedModel === model.id 
                  ? 'border-orange-500 bg-orange-50 dark:bg-navy-700/80 shadow-sm' 
                  : 'border-slate-100 dark:border-navy-600 hover:border-orange-200 dark:hover:border-navy-500'}`}
              onMouseEnter={() => setActiveTooltip(model.id)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <div className="flex items-center h-5">
                <input
                  type="radio"
                  name="forecasting_model"
                  value={model.id}
                  className="w-4 h-4 text-orange-500 bg-gray-100 border-gray-300 focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                  checked={selectedModel === model.id}
                  onChange={() => handleChange(model.id)}
                />
              </div>
              <div className="ml-3 text-sm flex-1">
                <div className="font-medium text-slate-900 dark:text-slate-100 flex items-center justify-between">
                  {model.name}
                  <Info className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </label>
            
            {activeTooltip === model.id && (
              <div className="absolute left-full ml-4 top-0 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg z-10 hidden md:block">
                {model.desc}
                <div className="absolute top-3 -left-1 w-2 h-2 bg-slate-800 transform rotate-45"></div>
              </div>
            )}
            {/* Mobile tooltip visible below */}
            {selectedModel === model.id && (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 md:hidden px-2">
                {model.desc}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelSelector;
