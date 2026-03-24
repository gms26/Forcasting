import React, { useState, useEffect } from 'react';
import { Sun, Moon, Activity, LayoutDashboard, Zap } from 'lucide-react';
import axios from 'axios';

import FileUpload from './components/FileUpload';
import ModelSelector from './components/ModelSelector';
import ForecastPeriodSlider from './components/ForecastPeriodSlider';
import ForecastChart from './components/ForecastChart';
import MetricsCard from './components/MetricsCard';
import AIExplanation from './components/AIExplanation';
import DownloadReport from './components/DownloadReport';
import Login from './Login';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  console.log("App Rendering - isAuthenticated:", isAuthenticated);
  const [theme, setTheme] = useState('light');
  
  const [data, setData] = useState(null);
  const [filename, setFilename] = useState('');
  
  const [selectedModel, setSelectedModel] = useState('Moving Average');
  const [period, setPeriod] = useState(30);
  
  const [isComparing, setIsComparing] = useState(false);
  const [forecastResult, setForecastResult] = useState(null);
  const [metrics, setMetrics] = useState(null);
  
  const [isForecasting, setIsForecasting] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Individual forecast states for the chart
  const [forecastData, setForecastData] = useState([]);
  const [confidenceUpper, setConfidenceUpper] = useState([]);
  const [confidenceLower, setConfidenceLower] = useState([]);
  const [forecastDates, setForecastDates] = useState([]);

  // Initialize theme and check auth
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Check if token exists
    const token = localStorage.getItem('auth_token');
    if (token) {
      console.log("Auth token found, setting authenticated = true");
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleDataLoaded = (processedData, name) => {
    setData(processedData);
    setFilename(name);
    // Reset forecast states
    setForecastResult(null);
    setMetrics(null);
    setExplanation('');
    setIsComparing(false);
  };

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      handleDataLoaded(response.data.data, file.name);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLoadSampleData = async () => {
    setIsUploading(true);
    try {
      const response = await axios.get(`${API_BASE}/sample`);
      handleDataLoaded(response.data.data, 'Sample Dataset (Sales)');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadPdf = async () => {
    const response = await axios.post(`${API_BASE}/download/pdf`, reportData, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SmartForecast_Report_${reportData.model || 'Comparison'}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleDownloadCsv = async () => {
    const response = await axios.post(`${API_BASE}/download/csv`, reportData, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SmartForecast_Data_${reportData.model || 'Comparison'}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const generateInsight = async (forecastData, m_name, m_metrics) => {
    setIsExplaining(true);
    try {
      const explainPayload = {
        data: data.slice(-10), // send only last 10 points
        forecast: forecastData,
        model_name: m_name,
        forecast_period: period,
        metrics: m_metrics
      };
      
      console.log("Sending to /explain:", explainPayload);
      const res = await axios.post(`${API_BASE}/explain`, explainPayload);
      console.log("Explain response:", res.data);
      
      setExplanation(res.data.explanation);
    } catch (err) {
      console.error(err);
      setExplanation("Could not load AI explanation at this time.");
    } finally {
      setIsExplaining(false);
    }
  };

  const runForecast = async () => {
    if (!data) return;
    setIsForecasting(true);
    setIsComparing(false);
    setExplanation('');
    
    try {
      const res = await axios.post(`${API_BASE}/forecast`, {
        model_name: selectedModel,
        forecast_period: period,
        data: data
      });
      
      const { forecast, confidence_upper, confidence_lower, dates, ...newMetrics } = res.data;
      
      // Set individual states as requested
      setForecastData(res.data.forecast);
      setConfidenceUpper(res.data.confidence_upper);
      setConfidenceLower(res.data.confidence_lower);
      setForecastDates(res.data.dates);

      // Map arrays to objects for other UI components if needed
      const forecastFormatted = dates.map((d, i) => ({
        date: d,
        forecast: forecast[i],
        ci_lower: confidence_lower[i],
        ci_upper: confidence_upper[i]
      }));
      
      // Merge history with forecast
      const combinedMap = {};
      data.forEach(d => {
        combinedMap[d.date] = { ...d };
      });
      
      // 1. Point of connection: Add the last historical point's value as the 'forecast' value 
      // for that same date if it doesn't already have one, or just ensure continuity.
      const lastHistorical = data[data.length - 1];
      if (lastHistorical) {
        combinedMap[lastHistorical.date] = { 
          ...combinedMap[lastHistorical.date], 
          forecast: lastHistorical.value,
          ci_lower: lastHistorical.value,
          ci_upper: lastHistorical.value
        };
      }

      forecastFormatted.forEach(f => {
        combinedMap[f.date] = f;
      });
      
      const combined = Object.values(combinedMap).sort((a, b) => new Date(a.date) - new Date(b.date));
      setForecastResult(combined);
      setMetrics(newMetrics);
      
      // Run AI Insights automatically
      generateInsight(forecastFormatted, selectedModel, newMetrics);
      
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || "An unknown error occurred.";
      alert(`Error running forecast:\n${errorMsg}\n\nPlease make sure the backend server and Gemini API keys are configured correctly.`);
      console.error(err);
    } finally {
      setIsForecasting(false);
    }
  };

  const runComparison = async () => {
    if (!data) return;
    setIsForecasting(true);
    setIsComparing(true);
    setExplanation('');
    
    try {
      const res = await axios.post(`${API_BASE}/compare`, {
        model_name: "All",
        forecast_period: period,
        data: data
      });
      
      const results = res.data.comparison;
      
      // Merge all forecasts into data
      const combinedMap = {};
      data.forEach(d => {
        combinedMap[d.date] = { ...d };
      });
      
      // Connection point for each model
      const lastHistorical = data[data.length - 1];
      
      Object.keys(results).forEach(mName => {
        const mData = results[mName];
        
        // Add historical connection point
        if (lastHistorical) {
          combinedMap[lastHistorical.date][mName] = lastHistorical.value;
        }

        mData.dates.forEach((date, i) => {
          if (combinedMap[date]) {
            combinedMap[date] = { ...combinedMap[date], [mName]: mData.forecast[i] };
          } else {
            combinedMap[date] = { date: date, [mName]: mData.forecast[i] };
          }
        });
      });
      
      const combined = Object.values(combinedMap).sort((a,b) => new Date(a.date) - new Date(b.date));
      setForecastResult(combined);
      setMetrics(results);
      
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || "An unknown error occurred.";
      alert(`Error running comparison:\n${errorMsg}\n\nPlease make sure the backend server and Gemini API keys are configured correctly.`);
      console.error(err);
    } finally {
      setIsForecasting(false);
    }
  };

  const handleRegenerate = () => {
    let fData = [];
    if (isComparing) return; // Disallow insight generation for comparison to keep it simple
    
    // Find forecast portion
    if (forecastResult) {
      fData = forecastResult.filter(r => r.forecast !== undefined);
    }
    generateInsight(fData, selectedModel, metrics);
  };

  // Build report data
  const reportData = forecastResult ? {
    title: "Project Data Forecast",
    summary: `Dataset ${filename} contains ${data.length} historical records.`,
    model: isComparing ? 'Comparison' : selectedModel,
    period: period,
    explanation: explanation,
    metrics: metrics,
    history: data,
    forecast: forecastResult.filter(r => r.forecast !== undefined || isComparing)
  } : {};

  if (isComparing && reportData.forecast) {
    reportData.forecast = forecastResult.filter(r => r["Moving Average"] !== undefined);
  }

  // If not authenticated, show Login page
  if (!isAuthenticated) {
    return <Login onLogin={setIsAuthenticated} />;
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-navy-800 border-b border-slate-200 dark:border-navy-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-2 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">SmartForecast AI</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Predictive Analytics Dashboard</p>
            </div>
          </div>
          
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-navy-700 text-slate-600 dark:text-slate-300 transition-colors"
                title="Toggle Theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              
              <button 
                onClick={() => {
                  localStorage.removeItem('auth_token');
                  setIsAuthenticated(false);
                }}
                className="text-xs font-bold text-slate-500 hover:text-red-500 transition-colors uppercase tracking-wider bg-slate-100 dark:bg-navy-700 px-3 py-1.5 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
            <FileUpload 
              onUpload={handleFileUpload} 
              onLoadSample={handleLoadSampleData} 
              loading={isUploading} 
            />
            
            <div className={`transition-all duration-500 ${!data ? 'opacity-50 pointer-events-none' : ''}`}>
              <ModelSelector selectedModel={selectedModel} onChange={setSelectedModel} />
              <ForecastPeriodSlider period={period} setPeriod={setPeriod} />
              
              <div className="mt-6 space-y-3">
                <button 
                  onClick={runForecast}
                  disabled={!data || isForecasting}
                  className="w-full py-3.5 px-4 bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-200 dark:focus:ring-orange-900 text-white font-semibold rounded-xl transition-all shadow-md shadow-orange-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isForecasting && !isComparing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Zap className="w-5 h-5" />
                  )}
                  Generate Forecast
                </button>
                
                <button 
                  onClick={runComparison}
                  disabled={!data || isForecasting}
                  className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-navy-700 dark:hover:bg-navy-600 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isForecasting && isComparing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
                  ) : (
                    <LayoutDashboard className="w-5 h-5 opacity-70" />
                  )}
                  Compare All Models
                </button>
              </div>

              {forecastResult && (
                <DownloadReport 
                  onDownloadPdf={handleDownloadPdf} 
                  onDownloadCsv={handleDownloadCsv} 
                />
              )}
            </div>
          </aside>

          {/* Main Dashboard Area */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {!data ? (
              <div className="flex-1 bg-white dark:bg-navy-800 rounded-xl border border-slate-100 dark:border-navy-700 border-dashed flex items-center justify-center min-h-[400px] text-slate-400 dark:text-slate-500">
                <div className="text-center">
                  <LayoutDashboard className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Upload data to view dashboard</p>
                </div>
              </div>
            ) : (
              <>
                {isForecasting && !isComparing && selectedModel === 'ARIMA' ? (
                  <div className="flex-1 bg-white dark:bg-navy-800 rounded-xl border border-slate-100 dark:border-navy-700 flex flex-col items-center justify-center p-8 text-center min-h-[500px] animate-pulse">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mb-8"></div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Optimizing ARIMA Parameters...</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md">
                      SmartForecast AI is finding the best statistical fit for your data. 
                      This intensive process may take 10-20 seconds.
                    </p>
                  </div>
                ) : forecastResult ? (
                  <>
                    <div className="h-[450px]">
                      <ForecastChart 
                        historicalData={data}
                        forecastData={forecastData}
                        confidenceUpper={confidenceUpper}
                        confidenceLower={confidenceLower}
                        forecastDates={forecastDates}
                        comparisonData={forecastResult}
                        isComparing={isComparing} 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <MetricsCard metrics={metrics} modelName={selectedModel} isComparing={isComparing} />
                      </div>
                      
                      {!isComparing && (
                        <div className="lg:col-span-1">
                          <AIExplanation 
                            explanation={explanation} 
                            loading={isExplaining} 
                            onRegenerate={handleRegenerate}
                          />
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 bg-slate-50 border border-slate-100 dark:bg-navy-800 dark:border-navy-700 rounded-xl flex items-center justify-center flex-col p-8 text-center min-h-[500px]">
                    <div className="w-20 h-20 bg-orange-100 dark:bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center mb-6">
                      <Activity className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Data Ready for Analysis</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md">
                      Your dataset "{filename}" with {data.length} rows is loaded. 
                      Select a model and forecast period on the left, then click Generate Forecast.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          
        </div>
      </main>
    </div>
  );
}

export default App;
