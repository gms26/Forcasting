import React, { useMemo } from 'react';
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, ReferenceLine } from 'recharts';
import { Activity } from 'lucide-react';

const ForecastChart = ({ data, isComparing }) => {
  // data format:
  // if not comparing: [{date, value, forecast, ci_lower, ci_upper}]
  // if comparing: [{date, value, "Moving Average", "ARIMA", "Holt-Winters", "Moving Average_ci_lower"...}]
  
  if (!data || data.length === 0) return null;

  // Find the split point between historical and forecast
  const lastHistoricalIndex = data.findIndex(d => d.value !== undefined && d.value !== null && Object.keys(d).some(k => k !== 'date' && k !== 'value' && d[k] !== undefined));
  let splitDate = null;
  
  if (data.length > 0) {
    // If we have pure historical data at the start and mixed later
    // Just find the last date that has 'value' and 'forecast' (or model name)
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].value !== undefined && data[i].value !== null) {
        splitDate = data[i].date;
        break;
      }
    }
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-navy-900 border border-navy-700 text-slate-100 p-3 rounded-lg shadow-xl text-sm min-w-[150px]">
          <div className="flex items-center justify-between mb-2 border-b border-navy-700 pb-1">
            <span className="font-semibold">{label}</span>
            <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded ${payload.some(p => p.dataKey === 'forecast' || p.dataKey === 'ARIMA' || p.dataKey === 'Holt-Winters' || p.dataKey === 'Moving Average') ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
              {payload.some(p => p.name.includes('Forecast') || p.dataKey !== 'value') ? 'Future' : 'Past'}
            </span>
          </div>
          {payload.map((entry, index) => {
            // Filter out internal bounds for cleaner tooltip
            if (entry.dataKey.includes('ci_lower') || entry.dataKey.includes('ci_upper')) return null;
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
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Historical Data (Past)</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-full">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
            <span className="text-xs font-medium text-orange-700 dark:text-orange-300">Future Forecast (Predictions)</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              tickMargin={10} 
              minTickGap={30}
              tickFormatter={(v, i) => i % 10 === 0 || i === data.length-1 ? v : ''}
              stroke="#cbd5e1"
              label={{ value: 'Date', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 12, fontWeight: 'bold' }}
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              tickMargin={10} 
              stroke="#cbd5e1"
              domain={['auto', 'auto']}
              label={{ value: 'Value', angle: -90, position: 'insideLeft', offset: 0, fill: '#64748b', fontSize: 12, fontWeight: 'bold' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: '20px' }} />
            
            {splitDate && (
              <ReferenceLine x={splitDate} stroke="#94a3b8" strokeDasharray="3 3" />
            )}

            <Line 
              type="monotone" 
              dataKey="value" 
              name="Historical" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={false}
              activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 0 }}
              isAnimationActive={true}
            />

            {!isComparing ? (
              <>
                <Area 
                  type="monotone" 
                  dataKey="ci_upper" 
                  baseValue="ci_lower"
                  stroke="none" 
                  fill="#f97316" 
                  fillOpacity={0.15} 
                  name="95% Confidence"
                  tooltipType="none"
                />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  name="Forecast" 
                  stroke="#f97316" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false}
                  activeDot={{ r: 6, fill: '#f97316', strokeWidth: 0 }}
                  isAnimationActive={true}
                />
              </>
            ) : (
              <>
                <Line type="monotone" dataKey="Moving Average" name="Moving Average" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                <Line type="monotone" dataKey="ARIMA" name="ARIMA" stroke="#f43f5e" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                <Line type="monotone" dataKey="Holt-Winters" name="Holt-Winters" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ForecastChart;
