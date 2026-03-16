import React, { useState } from 'react';
import { Target, AlertCircle } from 'lucide-react';

const MetricsCard = ({ metrics, modelName, isComparing }) => {
  const [activeTooltip, setActiveTooltip] = useState(null);

  if (!metrics) return null;

  const MetricBox = ({ label, value, desc, colorClass, highlight }) => (
    <div 
      className={`relative p-4 rounded-xl border transition-all duration-300 ${highlight ? colorClass : 'bg-slate-50 dark:bg-navy-700/50 border-slate-100 dark:border-navy-600'} hover:shadow-md cursor-help`}
      onMouseEnter={() => setActiveTooltip(label)}
      onMouseLeave={() => setActiveTooltip(null)}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</span>
        {highlight && <AlertCircle className="w-4 h-4 opacity-50" />}
      </div>
      <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</div>
      
      {activeTooltip === label && (
        <div className="absolute top-full left-0 mt-2 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg z-10 animate-fade-in">
          {desc}
          <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-800 transform rotate-45"></div>
        </div>
      )}
    </div>
  );

  const renderSingle = (m) => {
    // MAPE Colors
    let mapeColor = "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800";
    if (m.mape > 20) mapeColor = "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 text-red-700";
    else if (m.mape >= 10) mapeColor = "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 text-yellow-700";

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricBox 
          label="MAE" 
          value={m.mae?.toFixed(2) || 'N/A'}
          desc="Mean Absolute Error: Average absolute difference between forecast and actuals."
        />
        <MetricBox 
          label="RMSE" 
          value={m.rmse?.toFixed(2) || 'N/A'} 
          desc="Root Mean Square Error: Penalizes larger errors more heavily."
        />
        <MetricBox 
          label="MAPE" 
          value={`${m.mape?.toFixed(2) || 'N/A'}%`}
          desc="Mean Absolute Percentage Error: Average error relative to the actual values."
          colorClass={mapeColor}
          highlight={true}
        />
      </div>
    );
  };

  const renderCompare = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-navy-600 text-slate-500 dark:text-slate-400 text-sm">
              <th className="py-2 pl-2">Model</th>
              <th className="py-2">MAE</th>
              <th className="py-2">RMSE</th>
              <th className="py-2">MAPE</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(metrics).map(mKey => {
              const m = metrics[mKey].metrics;
              const isBest = Math.min(...Object.values(metrics).map(v => v.metrics?.mape || 999)) === m.mape;
              
              return (
                <tr key={mKey} className={`border-b border-slate-100 dark:border-navy-700/50 ${isBest ? 'bg-orange-50 dark:bg-orange-500/10' : ''}`}>
                  <td className="py-3 pl-2 font-medium text-slate-800 dark:text-slate-200">
                    {mKey} {isBest && <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">Best</span>}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{m.mae?.toFixed(2)}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{m.rmse?.toFixed(2)}</td>
                  <td className={`py-3 font-semibold ${m.mape < 10 ? 'text-green-600' : m.mape < 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {m.mape?.toFixed(2)}%
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-navy-700 animate-fade-in">
      <h2 className="text-xl font-semibold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <Target className="w-5 h-5 text-orange-500" /> 
        {isComparing ? 'Model Comparison' : `${modelName} Accuracy`}
      </h2>
      
      {isComparing ? renderCompare() : renderSingle(metrics)}
    </div>
  );
};

export default MetricsCard;
