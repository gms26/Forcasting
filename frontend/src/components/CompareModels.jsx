import React from 'react';
import { Trophy, Activity, AlertCircle } from 'lucide-react';

export default function CompareModels({ results, bestModel, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Running all models for comparison...</p>
        <p className="text-xs text-gray-400 mt-2 text-center max-w-sm">
          This may take a minute depending on data size as we fit ARIMA, Prophet, and Holt-Winters.
        </p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
        <Activity className="h-12 w-12 text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">Model Comparison</h3>
        <p className="text-gray-500 max-w-xs">Run a comparison to see how all models perform on your dataset.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Comparison Results</h3>
          <p className="text-sm text-gray-500 mt-1">Evaluated on 20% test split</p>
        </div>
        {bestModel && (
          <div className="flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200">
            <Trophy className="h-4 w-4" />
            <span className="text-sm font-semibold">Best: {bestModel}</span>
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Model
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                MAE
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                RMSE
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                MAPE
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((res, idx) => {
              const isBest = res.model_name === bestModel;
              return (
                <tr key={idx} className={isBest ? 'bg-emerald-50' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center space-x-2">
                    {isBest && <Trophy className="h-4 w-4 text-emerald-600" />}
                    <span>{res.model_name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {res.mae}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {res.rmse}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-semibold ${
                      res.mape < 10 ? 'text-emerald-600' : 
                      res.mape < 20 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {res.mape}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-start space-x-2 text-xs text-gray-500">
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        <p>Lower MAPE indicates better percentage accuracy. We recommend selecting the model with the lowest MAPE for final forecasting.</p>
      </div>
    </div>
  );
}
