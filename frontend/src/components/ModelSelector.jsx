import React from 'react';
import { Info } from 'lucide-react';

const MODELS = [
  {
    id: 'Moving Average',
    name: 'Moving Average',
    description: 'Simple baseline model using a 7-day rolling average. Best for short-term smoothing.'
  },
  {
    id: 'ARIMA',
    name: 'ARIMA',
    description: 'Auto-Regressive Integrated Moving Average. Excellent for non-seasonal data with clear trends.'
  },
  {
    id: 'Prophet',
    name: 'Prophet (by Meta)',
    description: 'Robust model handling missing data and outliers well. Great for daily data with strong seasonality.'
  },
  {
    id: 'Holt-Winters',
    name: 'Holt-Winters',
    description: 'Triple exponential smoothing. Captures both trend and seasonality effectively.'
  }
];

export default function ModelSelector({ selectedModel, onChange }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Forecasting Model</h3>
      <div className="space-y-3">
        {MODELS.map((model) => (
          <div 
            key={model.id}
            className={`relative flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedModel === model.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => onChange(model.id)}
          >
            <div className="flex items-center h-5">
              <input
                type="radio"
                name="model"
                checked={selectedModel === model.id}
                onChange={() => onChange(model.id)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
            </div>
            <div className="ml-3 flex-1 flex justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900 cursor-pointer">
                  {model.name}
                </label>
                <p className="text-xs text-gray-500 mt-1 pr-6">{model.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
