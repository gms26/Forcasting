import React, { useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

export default function ForecastChart({ historicalData, forecastData }) {
  
  const chartData = useMemo(() => {
    if (!Array.isArray(historicalData) || historicalData.length === 0) return [];
    
    // Convert historical data
    const hist = historicalData.map(d => ({
      date: d.date,
      historical: d.value,
      forecast: null,
      confidenceLower: null,
      confidenceUpper: null
    }));
    
    if (!forecastData || !forecastData.dates) return hist;
    
    // Convert forecast data
    const future = forecastData.dates.map((date, i) => ({
      date: date,
      historical: null,
      forecast: forecastData.forecast[i],
      confidenceLower: forecastData.confidence_lower ? forecastData.confidence_lower[i] : null,
      confidenceUpper: forecastData.confidence_upper ? forecastData.confidence_upper[i] : null
    }));
    
    // Connect the lines seamlessly
    if (hist.length > 0 && future.length > 0) {
      const lastHist = hist[hist.length - 1];
      future[0].historical = lastHist.historical;
    }
    
    return [...hist, ...future];
  }, [historicalData, forecastData]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm">
        <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <p className="text-gray-900 font-bold text-base">Forecast Visualization</p>
        <p className="text-xs text-gray-500 mt-1 max-w-sm">Upload a CSV dataset or click "Load Sample Data" to plot historical actuals and predict future trends.</p>
      </div>
    );
  }

  const forecastStartDate = forecastData?.dates?.[0];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3.5 border border-gray-200 shadow-xl rounded-xl">
          <p className="font-bold text-gray-900 mb-1.5 text-xs">{label}</p>
          {payload.map((entry, index) => {
            if (entry.dataKey === 'confidenceUpper' || entry.dataKey === 'confidenceLower') {
              return null;
            }
            return (
              <div key={index} className="flex items-center space-x-2 text-xs py-0.5">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-600 capitalize">{entry.name}:</span>
                <span className="font-bold text-gray-900 num-stat">
                  {entry.value !== null && entry.value !== undefined ? entry.value.toFixed(2) : 'N/A'}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dash-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900">Forecast Visualization</h3>
        {forecastData && (
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
            Live Trajectory
          </span>
        )}
      </div>

      <div className="h-96 w-full bg-white rounded-xl">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickMargin={10}
              minTickGap={30}
              stroke="#e2e8f0"
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickMargin={10}
              axisLine={false}
              tickLine={false}
              stroke="#e2e8f0"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle" 
              wrapperStyle={{ color: '#475569', fontSize: '12px' }} 
            />
            
            {forecastStartDate && (
              <ReferenceLine x={forecastStartDate} stroke="#cbd5e1" strokeDasharray="3 3" />
            )}

            <Area 
              type="monotone" 
              dataKey="confidenceUpper" 
              name="confidenceUpper"
              stroke="none" 
              fill="#fed7aa" 
              fillOpacity={0.4} 
              legendType="circle"
            />
            <Area 
              type="monotone" 
              dataKey="confidenceLower" 
              stroke="none" 
              fill="#ffffff" 
              fillOpacity={1} 
              legendType="none"
            />

            <Line 
              type="monotone" 
              dataKey="historical" 
              name="Historical Data"
              stroke="#3b82f6" 
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, stroke: '#3b82f6' }}
            />
            <Line 
              type="monotone" 
              dataKey="forecast" 
              name="Forecast"
              stroke="#f97316" 
              strokeWidth={2.5}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 4, stroke: '#f97316' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
