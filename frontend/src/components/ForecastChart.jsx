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
    if (!historicalData || historicalData.length === 0) return [];
    
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
      confidenceLower: forecastData.confidence_lower[i],
      confidenceUpper: forecastData.confidence_upper[i]
    }));
    
    // Connect the lines by adding the last historical point to the forecast
    if (hist.length > 0 && future.length > 0) {
      const lastHist = hist[hist.length - 1];
      future[0].historical = lastHist.historical; // to bridge the gap visually in some chart libs
    }
    
    return [...hist, ...future];
  }, [historicalData, forecastData]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-gray-500">Upload data to see the chart</p>
      </div>
    );
  }

  const forecastStartDate = forecastData?.dates?.[0];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => {
            // Don't show confidence bands in tooltip to keep it clean, or format them nicely
            if (entry.dataKey === 'confidenceUpper' || entry.dataKey === 'confidenceLower') {
                return null;
            }
            return (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-600 capitalize">{entry.name}:</span>
                <span className="font-semibold text-gray-900">
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Forecast Visualization</h3>
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickMargin={10}
              minTickGap={30}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickMargin={10}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            
            {forecastStartDate && (
              <ReferenceLine x={forecastStartDate} stroke="#9CA3AF" strokeDasharray="3 3" />
            )}

            <Area 
              type="monotone" 
              dataKey="confidenceUpper" 
              stroke="none" 
              fill="#fed7aa" 
              fillOpacity={0.4} 
              legendType="none"
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
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="forecast" 
              name="Forecast"
              stroke="#f97316" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
