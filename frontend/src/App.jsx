import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LogOut, 
  Sparkles,
  Layers,
  AlertCircle,
  Database
} from 'lucide-react';
import FileUpload from './components/FileUpload';
import ModelSelector from './components/ModelSelector';
import ForecastPeriodSlider from './components/ForecastPeriodSlider';
import ForecastChart from './components/ForecastChart';
import MetricsCard from './components/MetricsCard';
import AIExplanation from './components/AIExplanation';
import CompareModels from './components/CompareModels';
import DownloadReport from './components/DownloadReport';
import Landing from './Landing';
import Login from './Login';
import LogoF from './components/LogoF';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });
  const [showLogin, setShowLogin] = useState(false);

  const [uploadedData, setUploadedData] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [selectedModel, setSelectedModel] = useState('Moving Average');
  const [forecastPeriod, setForecastPeriod] = useState(30);
  const [forecastResult, setForecastResult] = useState(null);
  const [compareResults, setCompareResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompareLoading, setIsCompareLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear auth error interceptor
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      err => {
        if (err.response && err.response.status === 401) {
          handleLogout();
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setShowLogin(false);
    setUploadedData(null);
    setForecastResult(null);
    setCompareResults(null);
  };

  const handleUpload = async (file) => {
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${API_BASE}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      setUploadedData(res.data.data);
      setFileInfo({ name: file.name, size: file.size });
      setForecastResult(null);
      setCompareResults(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload CSV. Please verify date and value columns.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/sample-data`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUploadedData(res.data.data);
      setFileInfo({ name: 'sales_data.csv', size: 4096 });
      setForecastResult(null);
      setCompareResults(null);
    } catch (err) {
      setError('Failed to load sample dataset.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForecast = async () => {
    if (!uploadedData) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${API_BASE}/forecast`, {
        data: uploadedData,
        model: selectedModel,
        periods: forecastPeriod
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setForecastResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Forecast generation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompare = async () => {
    if (!uploadedData) return;
    setIsCompareLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${API_BASE}/compare`, {
        data: uploadedData,
        periods: forecastPeriod
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCompareResults(res.data.comparisons);
    } catch (err) {
      setError(err.response?.data?.detail || 'Model comparison benchmark failed.');
    } finally {
      setIsCompareLoading(false);
    }
  };

  const handleClearData = () => {
    setUploadedData(null);
    setFileInfo(null);
    setForecastResult(null);
    setCompareResults(null);
    setError(null);
  };

  if (!token) {
    if (showLogin) {
      return <Login setToken={setToken} setUser={setUser} onBack={() => setShowLogin(false)} />;
    }
    return <Landing onLoginClick={() => setShowLogin(true)} />;
  }

  const userDisplayName = user?.name || (user?.email ? user.email.split('@')[0] : 'Analyst');

  return (
    <div className="min-h-screen bg-[#070c18] text-[#f1f5f9] flex flex-col font-sans relative selection:bg-cyan-500 selection:text-[#070c18]">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 ai-grid-pattern opacity-80" />
        <div className="absolute inset-0 ai-radial-glow" />
      </div>

      {/* Top Navbar */}
      <nav className="bg-[#0b1328]/85 backdrop-blur-xl border-b border-[#1e3a5f] sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Brand Logo & Name with creative 'F' monogram */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-[#0d1e38] border border-[#1e3a5f] flex items-center justify-center p-1.5 shadow-md shadow-cyan-500/10">
                <LogoF className="h-6 w-6" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-white tracking-tight">SmartForecast</span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60">
                  AI
                </span>
              </div>
            </div>

            {/* Right Actions: Sample Data Button, User info & Logout */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button 
                onClick={handleSampleData}
                disabled={isLoading}
                className="text-xs sm:text-sm font-semibold text-cyan-300 bg-[#0f2442] hover:bg-[#132d54] border border-cyan-500/30 px-3.5 py-1.5 rounded-xl transition-all flex items-center shadow-xs hover:border-cyan-400 font-mono"
              >
                <Database className="h-3.5 w-3.5 mr-1.5 text-cyan-400" />
                <span>Load Sample Data</span>
              </button>

              <div className="flex items-center space-x-2 pl-2 border-l border-[#1e3a5f]">
                <span className="text-xs font-mono font-semibold text-slate-300 hidden sm:inline">{userDisplayName}</span>
                <button 
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-rose-400 p-2 rounded-xl hover:bg-rose-950/40 border border-[#1e3a5f] transition-colors flex items-center space-x-1"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* Main Content Dashboard */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {error && (
          <div className="mb-6 bg-rose-950/80 border border-rose-500/50 p-4 rounded-xl shadow-lg">
            <div className="flex">
              <div className="shrink-0">
                <AlertCircle className="h-5 w-5 text-rose-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-rose-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 space-y-6">
            <FileUpload 
              onUpload={handleUpload} 
              file={fileInfo} 
              onClear={handleClearData}
              onSampleData={handleSampleData}
              isLoading={isLoading}
            />
            
            <ModelSelector 
              selectedModel={selectedModel} 
              onChange={setSelectedModel} 
            />
            
            <ForecastPeriodSlider 
              period={forecastPeriod} 
              onChange={setForecastPeriod}
              disabled={isLoading}
            />
            
            <button
              onClick={handleForecast}
              disabled={!uploadedData || isLoading}
              className="btn-ai-radiant w-full py-3.5 px-6 rounded-xl text-sm flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading && !isCompareLoading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              <span>Generate Forecast</span>
            </button>
            
            <button
              onClick={handleCompare}
              disabled={!uploadedData || isLoading || isCompareLoading}
              className="btn-ai-glass w-full py-3.5 px-6 rounded-xl text-sm flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isCompareLoading ? (
                <div className="h-4 w-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Layers className="h-4 w-4 mr-2 text-cyan-400" />
              )}
              <span>Compare All Models</span>
            </button>
          </div>

          {/* Right Column: Visualization, Accuracy, Comparison Table, AI Insights */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Forecast Chart */}
            <ForecastChart 
              historicalData={uploadedData} 
              forecastData={forecastResult} 
            />

            {/* Model Accuracy & Export Results Cards side-by-side */}
            {forecastResult && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-7">
                  <MetricsCard metrics={forecastResult.metrics} />
                </div>
                <div className="md:col-span-5">
                  <DownloadReport 
                    forecastData={forecastResult}
                    metrics={forecastResult.metrics}
                    modelName={selectedModel}
                    periods={forecastPeriod}
                    explanation={forecastResult.explanation}
                  />
                </div>
              </div>
            )}

            {/* Comparison Results Benchmark Table */}
            {(compareResults || isCompareLoading) && (
              <CompareModels 
                results={compareResults} 
                bestModel={compareResults?.[0]?.model} 
                isLoading={isCompareLoading} 
              />
            )}

            {/* AI Business Insights */}
            {forecastResult && (
              <AIExplanation 
                explanation={forecastResult.explanation} 
                onRegenerate={handleForecast}
                isLoading={isLoading}
              />
            )}

          </div>
        </div>

      </main>

      {/* Clean Footer */}
      <footer className="relative z-10 border-t border-[#1e3a5f] bg-[#0b1328] py-5 text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 font-medium">
            <LogoF className="h-4 w-4" />
            <span className="text-white font-bold">SmartForecast AI</span>
            <span>•</span>
            <span>Predictive Time-Series Intelligence</span>
          </div>
          <div className="font-mono text-[11px] text-cyan-400 flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>AI Engine Ready</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
