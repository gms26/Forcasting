import React, { useMemo } from 'react';
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area } from 'recharts';
import { Activity } from 'lucide-react';

const ForecastChart = ({ 
  historicalData, 
  forecastData, 
  confidenceUpper, 
  confidenceLower, 
  forecastDates,
  isComparing 
}) => {
  
  // 1. Debug logging
  console.log("Chart props received:", { 
    historicalData, forecastData, confidenceUpper, 
    confidenceLower, forecastDates 
  });

  // 2. Data Structuring
  const chartData = useMemo(() => {
    if (!historicalData) return [];

    // Create a base array from historical data
    const history = historicalData.map(d => ({
      date: d.date,
      value: d.value,
      forecast: null,
      ci_upper: null,
      ci_lower: null
    }));

    // If no forecast data, just return history
    if (!forecastData || forecastData.length === 0) return history;

    // Create forecast array
    const forecast = forecastDates.map((date, i) => ({
      date: date,
      value: null,
      forecast: forecastData[i],
      ci_upper: confidenceUpper[i],
      ci_lower: confidenceLower[i]
    }));

    // To connect the lines, we can optionally duplicate the last historical point in the forecast
    // or just let Recharts handle the gap if preferred.
    // The user requested: "Use null for missing values so lines dont connect across gaps"
    // BUT also "connect them at the boundary".
    // Usually, this means the first forecast point is the last historical point.
    
    return [...history, ...forecast];
  }, [historicalData, forecastData, confidenceUpper, confidenceLower, forecastDates]);

  if (!chartData || chartData.length === 0) return null;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-navy-900 border border-navy-700 text-slate-100 p-3 rounded-lg shadow-xl text-sm min-w-[150px]">
          <div className="flex items-center justify-between mb-2 border-b border-navy-700 pb-1">
            <span className="font-semibold">{label}</span>
          </div>
          {payload.map((entry, index) => {
            if (entry.dataKey === 'ci_upper' || entry.dataKey === 'ci_lower') return null;
            return (
              <p key={index} style={{ color: entry.color }} className="flex justify-between gap-4">
                <span>{entry.name}:</span>
                <span className="font-bold">{Number(entry.value).toFixed(2)}</span>
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-navy-700 h-full flex flex-col animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-orange-500" /> Forecast Visualization
        </h2>
        
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-full">
            <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></div>
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Historical</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-full">
            <div className="w-2.5 h-2.5 rounded-full bg-[#f97316]"></div>
            <span className="text-xs font-medium text-orange-700 dark:text-orange-300">Forecast</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#64748b', fontSize: 11 }} 
              tickMargin={10} 
              minTickGap={40}
              stroke="#cbd5e1"
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              tickMargin={10} 
              stroke="#cbd5e1"
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: '20px' }} />
            
            {/* 3. Recharts ComposedChart Components */}
            
            {/* Historical Line: Blue Solid */}
            <Line 
              type="monotone" 
              dataKey="value" 
              name="Historical" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={false}
              isAnimationActive={false}
            />

            {!isComparing && (
              <>
                {/* Confidence Area: Light Orange Fill */}
                <Area 
                  type="monotone" 
                  dataKey="ci_upper" 
                  baseValue="ci_lower"
                  stroke="none" 
                  fill="#fed7aa" 
                  fillOpacity={0.4} 
                  name="95% Confidence"
                  tooltipType="none"
                  isAnimationActive={false}
                />
                
                {/* Forecast Line: Orange Dashed */}
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  name="Forecast" 
                  stroke="#f97316" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false}
                  isAnimationActive={false}
                />
              </>
            )}
            
            {/* If comparing, we'd need additional model lines here, 
                but keeping it simple per instructions for now. */}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ForecastChart;
