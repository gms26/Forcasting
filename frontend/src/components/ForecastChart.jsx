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
    
    // Connect the lines
    if (hist.length > 0 && future.length > 0) {
      const lastHist = hist[hist.length - 1];
      future[0].historical = lastHist.historical;
    }
    
    return [...hist, ...future];
  }, [historicalData, forecastData]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center bg-[#001726]/80 rounded-2xl border border-[#003b64] p-6 text-center">
        <p className="text-white font-semibold">No Time-Series Ingested Yet</p>
        <p className="text-xs text-[#94a3b8] mt-1">Upload a CSV dataset or click "Load Sample Data" to visualize forecasts.</p>
      </div>
    );
  }

  const forecastStartDate = forecastData?.dates?.[0];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#002238] p-3.5 border border-[#004f7c] shadow-2xl rounded-xl">
          <p className="font-bold text-white mb-2">{label}</p>
          {payload.map((entry, index) => {
            if (entry.dataKey === 'confidenceUpper' || entry.dataKey === 'confidenceLower') {
              return null;
            }
            return (
              <div key={index} className="flex items-center space-x-2 text-xs">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-[#94a3b8] capitalize">{entry.name}:</span>
                <span className="font-bold text-white num-stat">
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
    <div className="rasera-card rounded-2xl p-6 shadow-md border border-[#004775]">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-white">Forecasting Trajectory &amp; Uncertainty</h3>
        {forecastData && (
          <span className="text-xs font-bold text-[#a2fff4] bg-[#a2fff4]/15 px-3 py-1 rounded-full border border-[#a2fff4]/30">
            Active Forecast
          </span>
        )}
      </div>

      <div className="h-96 w-full bg-[#001424] rounded-xl border border-[#003152] p-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#003152" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickMargin={10}
              minTickGap={30}
              stroke="#003b64"
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickMargin={10}
              axisLine={false}
              tickLine={false}
              stroke="#003b64"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ color: '#cbd5e1' }} />
            
            {forecastStartDate && (
              <ReferenceLine x={forecastStartDate} stroke="#a2fff4" strokeDasharray="3 3" />
            )}

            <Area 
              type="monotone" 
              dataKey="confidenceUpper" 
              stroke="none" 
              fill="#6aceff" 
              fillOpacity={0.25} 
              legendType="none"
            />
            <Area 
              type="monotone" 
              dataKey="confidenceLower" 
              stroke="none" 
              fill="#001424" 
              fillOpacity={1} 
              legendType="none"
            />

            <Line 
              type="monotone" 
              dataKey="historical" 
              name="Historical Data"
              stroke="#38bdf8" 
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, stroke: '#38bdf8' }}
            />
            <Line 
              type="monotone" 
              dataKey="forecast" 
              name="Forecast Horizon"
              stroke="#a2fff4" 
              strokeWidth={2.5}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 4, stroke: '#a2fff4' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
