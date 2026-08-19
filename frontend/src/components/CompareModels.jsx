import React from 'react';
import { Trophy, Activity, AlertCircle } from 'lucide-react';

export default function CompareModels({ results, bestModel, isLoading }) {
  if (isLoading) {
    return (
      <div className="rasera-card rounded-2xl p-6 flex flex-col items-center justify-center min-h-[250px]">
        <div className="w-10 h-10 border-4 border-[#003b64] border-t-[#a2fff4] rounded-full animate-spin mb-4" />
        <p className="text-white font-semibold">Running all models for benchmark comparison...</p>
        <p className="text-xs text-[#94a3b8] mt-2 text-center max-w-sm">
          Fitting Auto-ARIMA, Meta Prophet, and Holt-Winters concurrently.
        </p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="rasera-card rounded-2xl overflow-hidden shadow-lg border border-[#004775]">
      <div className="p-6 border-b border-[#003b64] flex justify-between items-center bg-[#001726]/90">
        <div>
          <h3 className="text-base font-bold text-white">Multi-Model Benchmark Matrix</h3>
          <p className="text-xs text-[#94a3b8] mt-0.5">Evaluated on out-of-sample backtest split</p>
        </div>
        {bestModel && (
          <div className="flex items-center space-x-2 bg-[#00362c] text-[#a2fff4] px-3.5 py-1.5 rounded-full border border-[#a2fff4]/40 text-xs font-bold">
            <Trophy className="h-4 w-4" />
            <span>Champion: {bestModel}</span>
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#003456] text-sm">
          <thead className="bg-[#001a2c] text-xs font-bold text-[#97dcff] uppercase">
            <tr>
              <th className="px-6 py-3.5 text-left">Model</th>
              <th className="px-6 py-3.5 text-left">MAE</th>
              <th className="px-6 py-3.5 text-left">RMSE</th>
              <th className="px-6 py-3.5 text-left">MAPE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#002f4d] bg-[#001424]/80">
            {results.map((res, idx) => {
              const isBest = res.model === bestModel;
              return (
                <tr key={idx} className={isBest ? 'bg-[#002f4d]/40' : 'hover:bg-[#001f33]'}>
                  <td className="px-6 py-4 font-bold text-white flex items-center space-x-2">
                    <span>{res.model}</span>
                    {isBest && (
                      <span className="text-[10px] bg-[#a2fff4] text-[#00131c] px-2 py-0.5 rounded-full font-bold">Best</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[#cbd5e1] num-stat">{res.metrics?.mae || 'N/A'}</td>
                  <td className="px-6 py-4 text-[#6aceff] num-stat">{res.metrics?.rmse || 'N/A'}</td>
                  <td className="px-6 py-4 text-[#a2fff4] font-bold num-stat">{res.metrics?.mape ? `${res.metrics.mape}%` : 'N/A'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
