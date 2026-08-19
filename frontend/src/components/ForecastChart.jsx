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
      <div className="h-96 flex flex-col items-center justify-center bg-[#0d1527] rounded-2xl border border-[#1e3a5f] p-6 text-center shadow-lg">
        <div className="h-12 w-12 rounded-2xl bg-[#13233f] text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-3 shadow-md shadow-cyan-500/10">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <p className="text-white font-bold text-base">Forecast Visualization</p>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">Upload a CSV dataset to plot historical observations and forecast predictive trajectories.</p>
      </div>
    );
  }

  const forecastStartDate = forecastData?.dates?.[0];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0b1328] p-3.5 border border-[#1e3a5f] shadow-2xl rounded-xl">
          <p className="font-bold text-white mb-1.5 text-xs font-mono">{label}</p>
          {payload.map((entry, index) => {
            if (entry.dataKey === 'confidenceUpper' || entry.dataKey === 'confidenceLower') {
              return null;
            }
            return (
              <div key={index} className="flex items-center space-x-2 text-xs py-0.5">
                <div 
                  className="w-2.5 h-2.5 rounded-full shadow-xs" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-300 capitalize">{entry.name}:</span>
                <span className="font-bold text-white num-stat font-mono">
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
    <div className="ai-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-white">Forecast Visualization</h3>
        {forecastData && (
          <span className="text-xs font-bold text-cyan-300 bg-cyan-950/70 px-3 py-1 rounded-full border border-cyan-500/40 font-mono shadow-xs">
            Live Trajectory
          </span>
        )}
      </div>

      <div className="h-96 w-full bg-[#080e1b] rounded-xl border border-[#14233c] p-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#162540" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickMargin={10}
              minTickGap={30}
              stroke="#1e3a5f"
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickMargin={10}
              axisLine={false}
              tickLine={false}
              stroke="#1e3a5f"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle" 
              wrapperStyle={{ color: '#cbd5e1', fontSize: '12px' }} 
            />
            
            {forecastStartDate && (
              <ReferenceLine x={forecastStartDate} stroke="#22d3ee" strokeDasharray="3 3" />
            )}

            <Area 
              type="monotone" 
              dataKey="confidenceUpper" 
              name="Confidence Interval"
              stroke="none" 
              fill="#06b6d4" 
              fillOpacity={0.25} 
              legendType="circle"
            />
            <Area 
              type="monotone" 
              dataKey="confidenceLower" 
              stroke="none" 
              fill="#080e1b" 
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
              stroke="#22d3ee" 
              strokeWidth={2.5}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 4, stroke: '#22d3ee' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
