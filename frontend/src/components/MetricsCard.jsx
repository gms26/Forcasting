import React from 'react';
import { Activity, Target, TrendingUp } from 'lucide-react';

export default function MetricsCard({ metrics }) {
  if (!metrics) return null;

  // MAPE Color logic
  const getMapeColor = (mape) => {
    if (mape < 10) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (mape < 20) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const mapeColor = getMapeColor(metrics.mape);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col justify-center">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Model Accuracy</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* MAE */}
        <div className="p-4 rounded-lg border border-gray-100 bg-gray-50 flex flex-col group relative">
          <div className="flex items-center text-gray-500 mb-2">
            <Target className="h-4 w-4 mr-1.5" />
            <span className="text-xs font-medium uppercase tracking-wider">MAE</span>
          </div>
          <span className="text-2xl font-semibold text-gray-900">{metrics.mae}</span>
          
          {/* Tooltip */}
          <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded p-2 -top-10 left-1/2 transform -translate-x-1/2 w-48 text-center pointer-events-none z-10">
            Mean Absolute Error: Average magnitude of errors.
          </div>
        </div>

        {/* RMSE */}
        <div className="p-4 rounded-lg border border-gray-100 bg-gray-50 flex flex-col group relative">
          <div className="flex items-center text-gray-500 mb-2">
            <Activity className="h-4 w-4 mr-1.5" />
            <span className="text-xs font-medium uppercase tracking-wider">RMSE</span>
          </div>
          <span className="text-2xl font-semibold text-gray-900">{metrics.rmse}</span>
          
          <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded p-2 -top-10 left-1/2 transform -translate-x-1/2 w-48 text-center pointer-events-none z-10">
            Root Mean Square Error: Penalizes larger errors more heavily.
          </div>
        </div>

        {/* MAPE */}
        <div className={`p-4 rounded-lg border flex flex-col group relative ${mapeColor}`}>
          <div className="flex items-center mb-2">
            <TrendingUp className="h-4 w-4 mr-1.5" />
            <span className="text-xs font-medium uppercase tracking-wider">MAPE</span>
          </div>
          <span className="text-2xl font-semibold">{metrics.mape}%</span>
          
          <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded p-2 -top-10 left-1/2 transform -translate-x-1/2 w-48 text-center pointer-events-none z-10">
            Mean Absolute Percentage Error. Green &lt; 10%, Yellow 10-20%, Red &gt; 20%.
          </div>
        </div>
      </div>
    </div>
  );
}
