import React from 'react';
import { Activity, Target, TrendingUp } from 'lucide-react';

export default function MetricsCard({ metrics }) {
  if (!metrics) return null;

  // MAPE Color logic
  const getMapeColor = (mape) => {
    if (mape < 10) return 'text-[#a2fff4] bg-[#00362c]/60 border-[#a2fff4]/40';
    if (mape < 20) return 'text-amber-400 bg-amber-950/40 border-amber-500/40';
    return 'text-rose-400 bg-rose-950/40 border-rose-500/40';
  };

  const mapeColor = getMapeColor(metrics.mape);

  return (
    <div className="rasera-card rounded-2xl p-6 shadow-md">
      <h3 className="text-base font-bold text-white mb-4">Model Accuracy Loss Metrics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* MAE */}
        <div className="p-4 rounded-xl border border-[#003b64] bg-[#001726]/80 flex flex-col group relative">
          <div className="flex items-center text-[#97dcff] mb-1.5">
            <Target className="h-4 w-4 mr-1.5 text-[#97dcff]" />
            <span className="text-xs font-bold uppercase tracking-wider">MAE</span>
          </div>
          <span className="text-2xl font-extrabold text-white num-stat">{metrics.mae}</span>
          <span className="text-xs text-[#94a3b8] mt-1">Mean Absolute Error</span>
        </div>

        {/* RMSE */}
        <div className="p-4 rounded-xl border border-[#003b64] bg-[#001726]/80 flex flex-col group relative">
          <div className="flex items-center text-[#6aceff] mb-1.5">
            <Activity className="h-4 w-4 mr-1.5 text-[#6aceff]" />
            <span className="text-xs font-bold uppercase tracking-wider">RMSE</span>
          </div>
          <span className="text-2xl font-extrabold text-[#6aceff] num-stat">{metrics.rmse}</span>
          <span className="text-xs text-[#94a3b8] mt-1">Root Mean Square Error</span>
        </div>

        {/* MAPE */}
        <div className={`p-4 rounded-xl border flex flex-col group relative ${mapeColor}`}>
          <div className="flex items-center mb-1.5">
            <TrendingUp className="h-4 w-4 mr-1.5" />
            <span className="text-xs font-bold uppercase tracking-wider">MAPE</span>
          </div>
          <span className="text-2xl font-extrabold num-stat">{metrics.mape}%</span>
          <span className="text-xs mt-1 opacity-80">Percentage Error</span>
        </div>
      </div>
    </div>
  );
}
