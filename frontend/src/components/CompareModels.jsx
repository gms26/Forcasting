import React from 'react';
import { Trophy, Info } from 'lucide-react';

export default function CompareModels({ results, bestModel, isLoading }) {
  if (isLoading) {
    return (
      <div className="dash-card p-8 flex flex-col items-center justify-center min-h-[200px] text-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-gray-900 font-bold text-base">Benchmarking All Forecasting Models...</p>
        <p className="text-xs text-gray-500 mt-1 max-w-sm">
          Fitting Auto-ARIMA, Meta Prophet, Holt-Winters, and Moving Average concurrently.
        </p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="dash-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">Comparison Results</h3>
          <p className="text-xs text-gray-500">Evaluated on holdout cross-validation split</p>
        </div>
        {bestModel && (
          <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold font-mono self-start sm:self-auto">
            <Trophy className="h-3.5 w-3.5 text-emerald-600" />
            <span>Best: {bestModel}</span>
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase font-mono">
            <tr>
              <th className="px-6 py-3.5 text-left">MODEL</th>
              <th className="px-6 py-3.5 text-left">MAE</th>
              <th className="px-6 py-3.5 text-left">RMSE</th>
              <th className="px-6 py-3.5 text-left">MAPE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white font-mono text-xs sm:text-sm">
            {results.map((res, idx) => {
              const isBest = res.model === bestModel;
              return (
                <tr 
                  key={idx} 
                  className={isBest ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-gray-50 transition-colors'}
                >
                  <td className="px-6 py-3.5 text-gray-900 flex items-center space-x-2">
                    {isBest && <Trophy className="h-4 w-4 text-emerald-600 shrink-0" />}
                    <span>{res.model}</span>
                  </td>
                  <td className="px-6 py-3.5 text-gray-700 num-stat">{res.metrics?.mae || 'N/A'}</td>
                  <td className="px-6 py-3.5 text-gray-700 num-stat">{res.metrics?.rmse || 'N/A'}</td>
                  <td className={`px-6 py-3.5 num-stat font-bold ${isBest ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {res.metrics?.mape ? `${res.metrics.mape}%` : 'N/A'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Advisory Note matching screenshot */}
      <div className="mt-4 flex items-start space-x-2 text-xs text-gray-500">
        <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
        <span>Lower MAPE indicates superior percentage accuracy. We recommend deploying the model with lowest MAPE loss for final predictions.</span>
      </div>
    </div>
  );
}
