import React from 'react';
import { Activity, Target, TrendingUp } from 'lucide-react';

export default function MetricsCard({ metrics }) {
  if (!metrics) return null;

  return (
    <div className="dash-card p-6">
      <h3 className="text-base font-bold text-gray-900 mb-4">Model Accuracy</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* MAE */}
        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex flex-col justify-between">
          <div className="flex items-center text-gray-500 mb-1.5">
            <Target className="h-4 w-4 mr-1.5 text-gray-400" />
            <span className="text-xs font-bold uppercase tracking-wider">MAE</span>
          </div>
          <span className="text-2xl font-bold text-gray-900 num-stat">{metrics.mae}</span>
          <span className="text-[11px] text-gray-400 mt-1">Mean Absolute Error</span>
        </div>

        {/* RMSE */}
        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex flex-col justify-between">
          <div className="flex items-center text-gray-500 mb-1.5">
            <Activity className="h-4 w-4 mr-1.5 text-gray-400" />
            <span className="text-xs font-bold uppercase tracking-wider">RMSE</span>
          </div>
          <span className="text-2xl font-bold text-gray-900 num-stat">{metrics.rmse}</span>
          <span className="text-[11px] text-gray-400 mt-1">Root Mean Square Error</span>
        </div>

        {/* MAPE */}
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 flex flex-col justify-between">
          <div className="flex items-center text-emerald-700 mb-1.5">
            <TrendingUp className="h-4 w-4 mr-1.5 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider">MAPE</span>
          </div>
          <span className="text-2xl font-bold text-emerald-600 num-stat">{metrics.mape}%</span>
          <span className="text-[11px] text-emerald-700/80 mt-1">Percentage Error</span>
        </div>
      </div>
    </div>
  );
}
