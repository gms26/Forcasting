import React from 'react';

const MODELS = [
  {
    id: 'Prophet',
    name: 'Meta Prophet',
    tag: 'Seasonal',
    description: 'Decomposable additive model handling missing data, holidays, and multi-period seasonality.'
  },
  {
    id: 'ARIMA',
    name: 'Auto-ARIMA',
    tag: 'Autoregressive',
    description: 'Autoregressive Integrated Moving Average. Optimal for series with stationary lag dependencies.'
  },
  {
    id: 'Holt-Winters',
    name: 'Holt-Winters',
    tag: 'Exponential',
    description: 'Triple exponential smoothing with adaptive trend gradients and seasonal dampening.'
  },
  {
    id: 'Moving Average',
    name: 'Moving Average',
    tag: 'Baseline',
    description: 'Rolling window average for simple smoothing and baseline loss benchmarking.'
  }
];

export default function ModelSelector({ selectedModel, onChange }) {
  return (
    <div className="rasera-card rounded-2xl p-6 shadow-md">
      <h3 className="text-base font-bold text-white mb-4">Forecasting Model</h3>
      <div className="space-y-3">
        {MODELS.map((model) => {
          const isSelected = selectedModel === model.id;
          return (
            <div 
              key={model.id}
              className={`relative flex items-start p-3.5 border rounded-xl cursor-pointer transition-all ${
                isSelected 
                  ? 'border-[#a2fff4]/70 bg-[#002f4d] shadow-md' 
                  : 'border-[#003b64] hover:border-[#004f7c] bg-[#001726]/70'
              }`}
              onClick={() => onChange(model.id)}
            >
              <div className="flex items-center h-5 mt-0.5">
                <input
                  type="radio"
                  name="model"
                  checked={isSelected}
                  onChange={() => onChange(model.id)}
                  className="h-4 w-4 text-[#00131c] accent-[#a2fff4] cursor-pointer"
                />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-white cursor-pointer">
                    {model.name}
                  </label>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-[#a2fff4] text-[#00131c]' : 'bg-[#002842] text-[#97dcff]'
                  }`}>
                    {model.tag}
                  </span>
                </div>
                <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">{model.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
