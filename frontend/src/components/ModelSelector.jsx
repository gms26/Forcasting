import React from 'react';

const MODELS = [
  {
    id: 'Moving Average',
    name: 'Moving Average',
    tag: 'Baseline',
    description: 'Simple baseline model using a 7-day rolling window. Best for short-term baseline loss comparison.'
  },
  {
    id: 'ARIMA',
    name: 'Auto-ARIMA',
    tag: 'Autoregressive',
    description: 'Auto-Regressive Integrated Moving Average. Optimal for non-seasonal data with lag dependencies.'
  },
  {
    id: 'Prophet',
    name: 'Meta Prophet',
    tag: 'Seasonal',
    description: 'Robust decomposable model handling missing data, outliers, holidays, and multi-period seasonality.'
  },
  {
    id: 'Holt-Winters',
    name: 'Holt-Winters',
    tag: 'Exponential',
    description: 'Triple exponential smoothing. Captures dynamic secular trend gradients and seasonal dampening.'
  }
];

export default function ModelSelector({ selectedModel, onChange }) {
  return (
    <div className="dash-card p-6">
      <h3 className="text-base font-bold text-gray-900 mb-4">Forecasting Model</h3>
      <div className="space-y-3">
        {MODELS.map((model) => {
          const isSelected = selectedModel === model.id;
          return (
            <div 
              key={model.id}
              className={`relative flex items-start p-3.5 rounded-xl cursor-pointer transition-all border ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50/50 shadow-xs' 
                  : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
              }`}
              onClick={() => onChange(model.id)}
            >
              <div className="flex items-center h-5 mt-0.5">
                <input
                  type="radio"
                  name="model"
                  checked={isSelected}
                  onChange={() => onChange(model.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 accent-blue-600 cursor-pointer"
                />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-900 cursor-pointer">
                    {model.name}
                  </label>
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                    isSelected 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    {model.tag}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{model.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
