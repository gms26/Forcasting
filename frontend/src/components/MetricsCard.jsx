import React from 'react';
import { Activity, Target, TrendingUp } from 'lucide-react';

export default function MetricsCard({ metrics }) {
  if (!metrics) return null;

  return (
    <div className="ai-card p-6">
      <h3 className="text-base font-bold text-white mb-4">Model Accuracy</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* MAE */}
        <div className="p-4 rounded-xl border border-[#1e3a5f] bg-[#091122]/90 flex flex-col justify-between">
          <div className="flex items-center text-cyan-400 mb-1.5">
            <Target className="h-4 w-4 mr-1.5 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider font-mono">MAE</span>
          </div>
          <span className="text-2xl font-bold text-white num-stat">{metrics.mae}</span>
          <span className="text-[11px] text-slate-400 mt-1">Mean Absolute Error</span>
        </div>

        {/* RMSE */}
        <div className="p-4 rounded-xl border border-[#1e3a5f] bg-[#091122]/90 flex flex-col justify-between">
          <div className="flex items-center text-sky-400 mb-1.5">
            <Activity className="h-4 w-4 mr-1.5 text-sky-400" />
            <span className="text-xs font-bold uppercase tracking-wider font-mono">RMSE</span>
          </div>
          <span className="text-2xl font-bold text-sky-300 num-stat">{metrics.rmse}</span>
          <span className="text-[11px] text-slate-400 mt-1">Root Mean Square Error</span>
        </div>

        {/* MAPE */}
        <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/40 flex flex-col justify-between">
          <div className="flex items-center text-emerald-400 mb-1.5">
            <TrendingUp className="h-4 w-4 mr-1.5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider font-mono">MAPE</span>
          </div>
          <span className="text-2xl font-bold text-emerald-300 num-stat">{metrics.mape}%</span>
          <span className="text-[11px] text-emerald-400/80 mt-1">Percentage Loss</span>
        </div>
      </div>
    </div>
  );
}
