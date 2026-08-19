import React from 'react';
import { Trophy, Info } from 'lucide-react';

export default function CompareModels({ results, bestModel, isLoading }) {
  if (isLoading) {
    return (
      <div className="ai-card p-8 flex flex-col items-center justify-center min-h-[250px] text-center">
        <div className="w-10 h-10 border-3 border-[#1e3a5f] border-t-cyan-400 rounded-full animate-spin mb-3" />
        <p className="text-white font-bold text-base">Benchmarking All Forecasting Models...</p>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Fitting Auto-ARIMA, Meta Prophet, Holt-Winters, and Moving Average concurrently.
        </p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="ai-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-white">Comparison Results</h3>
          <p className="text-xs text-slate-400">Evaluated on holdout cross-validation split</p>
        </div>
        {bestModel && (
          <div className="inline-flex items-center space-x-1.5 bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold font-mono self-start sm:self-auto shadow-xs">
            <Trophy className="h-3.5 w-3.5 text-emerald-400" />
            <span>Best: {bestModel}</span>
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto rounded-xl border border-[#1e3a5f]">
        <table className="min-w-full divide-y divide-[#1e3a5f] text-sm">
          <thead className="bg-[#091122] text-xs font-bold text-slate-400 uppercase font-mono">
            <tr>
              <th className="px-6 py-3.5 text-left">MODEL</th>
              <th className="px-6 py-3.5 text-left">MAE</th>
              <th className="px-6 py-3.5 text-left">RMSE</th>
              <th className="px-6 py-3.5 text-left">MAPE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#14233c] bg-[#091122]/70 font-mono text-xs sm:text-sm">
            {results.map((res, idx) => {
              const isBest = res.model === bestModel;
              return (
                <tr 
                  key={idx} 
                  className={isBest ? 'bg-emerald-950/40 font-semibold' : 'hover:bg-[#0c1830] transition-colors'}
                >
                  <td className="px-6 py-3.5 text-white flex items-center space-x-2">
                    {isBest && <Trophy className="h-4 w-4 text-emerald-400 shrink-0" />}
                    <span>{res.model}</span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-300 num-stat">{res.metrics?.mae || 'N/A'}</td>
                  <td className="px-6 py-3.5 text-sky-300 num-stat">{res.metrics?.rmse || 'N/A'}</td>
                  <td className={`px-6 py-3.5 num-stat font-bold ${isBest ? 'text-emerald-400' : 'text-slate-200'}`}>
                    {res.metrics?.mape ? `${res.metrics.mape}%` : 'N/A'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Advisory Note */}
      <div className="mt-4 flex items-start space-x-2 text-xs text-slate-400">
        <Info className="h-4 w-4 shrink-0 text-cyan-400 mt-0.5" />
        <span>Lower MAPE indicates superior percentage accuracy. We recommend deploying the model with lowest MAPE loss for final predictions.</span>
      </div>
    </div>
  );
}
