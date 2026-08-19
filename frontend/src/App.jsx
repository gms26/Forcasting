import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, 
  LogOut, 
  Sparkles,
  Layers,
  AlertCircle
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Navbar matching screenshot */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Brand Logo & Name */}
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <BarChart3 className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">SmartForecast AI</span>
            </div>

            {/* Right Actions: User info & Logout matching screenshot */}
            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold text-gray-600 hidden sm:inline">{userDisplayName}</span>
              <button 
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-100 transition-colors flex items-center space-x-1"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 p-4 rounded-xl shadow-xs">
            <div className="flex">
              <div className="shrink-0">
                <AlertCircle className="h-5 w-5 text-rose-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-rose-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Clean Workspace Layout matching assets/dashboard_1.png and dashboard_2.png */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 space-y-6">
            <FileUpload 
              onUpload={handleUpload} 
              file={fileInfo} 
              onClear={handleClearData}
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
              className="w-full flex items-center justify-center py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading && !isCompareLoading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2 text-white" />
              )}
              <span>Generate Forecast</span>
            </button>
            
            <button
              onClick={handleCompare}
              disabled={!uploadedData || isLoading || isCompareLoading}
              className="w-full flex items-center justify-center py-3.5 px-6 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isCompareLoading ? (
                <div className="h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Layers className="h-4 w-4 mr-2 text-gray-600" />
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

            {/* Model Accuracy & Export Results Cards side-by-side matching screenshot */}
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

            {/* Comparison Results Benchmark Table matching assets/dashboard_2.png */}
            {(compareResults || isCompareLoading) && (
              <CompareModels 
                results={compareResults} 
                bestModel={compareResults?.[0]?.model} 
                isLoading={isCompareLoading} 
              />
            )}

            {/* AI Business Insights matching screenshot */}
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
      <footer className="border-t border-gray-200 bg-white py-5 text-xs text-gray-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 font-medium">
            <span className="text-gray-900 font-bold">SmartForecast AI</span>
            <span>•</span>
            <span>Enterprise Predictive Intelligence</span>
          </div>
          <div className="font-mono text-[11px] text-gray-400">
            <span>Fast In-Memory Computation</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
