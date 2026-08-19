import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, 
  TrendingUp, 
  Settings, 
  LayoutDashboard, 
  LogOut, 
  User as UserIcon, 
  Database,
  Lock,
  ArrowRight
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
  const [selectedModel, setSelectedModel] = useState('Prophet');
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
      setError(err.response?.data?.detail || 'Failed to upload CSV. Please verify formatting.');
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
      setFileInfo({ name: 'sample_sales_data.csv', size: 4096 });
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
      setError(err.response?.data?.detail || 'Model comparison failed.');
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

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U');
  const userDisplayName = user?.name || (user?.email ? user.email.split('@')[0] : 'Analyst');

  return (
    <div className="min-h-screen bg-[#00111a] text-[#f1f5f9] flex flex-col font-sans relative selection:bg-[#a2fff4] selection:text-[#00131c]">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 rasera-mesh-pattern opacity-70" />
        <div className="absolute inset-0 rasera-radial-glow" />
      </div>

      {/* Navbar */}
      <nav className="bg-[#001726]/85 backdrop-blur-xl border-b border-[#003b64] sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Brand */}
            <div className="flex items-center space-x-3.5">
              <div className="h-11 w-11 rounded-2xl bg-[#002238] border border-[#004f7c] shadow-lg flex items-center justify-center p-1.5 shadow-[#a2fff4]/5">
                <LogoF className="h-7 w-7" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold tracking-tight text-white">SmartForecast</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#a2fff4]/15 text-[#a2fff4] border border-[#a2fff4]/30">
                    Enterprise
                  </span>
                </div>
                <span className="text-xs text-[#97dcff]/70 font-medium">Predictive Workspace</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleSampleData}
                disabled={isLoading}
                className="text-xs sm:text-sm font-semibold text-[#a2fff4] bg-[#002842] hover:bg-[#00375a] border border-[#a2fff4]/30 px-4 py-2.5 rounded-xl transition-all flex items-center shadow-md"
              >
                <Database className="h-4 w-4 mr-2 text-[#a2fff4]" />
                Load Sample Data
              </button>

              {/* User Profile Pill */}
              <div className="flex items-center pl-2 pr-3 py-1.5 bg-[#002238] border border-[#004775] rounded-full">
                <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-[#a2fff4] to-[#3b82f6] text-[#00131c] flex items-center justify-center text-xs font-extrabold shadow-sm mr-2.5">
                  {userInitial}
                </div>
                <div className="hidden md:flex flex-col text-left mr-2">
                  <span className="text-xs font-bold text-white leading-tight max-w-[130px] truncate">{userDisplayName}</span>
                  <span className="text-[10px] text-[#94a3b8] leading-tight max-w-[130px] truncate">{user?.email || 'Authenticated'}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-[#94a3b8] hover:text-rose-400 p-1.5 rounded-full hover:bg-rose-950/40 transition-colors ml-1"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {error && (
          <div className="mb-6 bg-rose-950/70 border-l-4 border-rose-500 p-4 rounded-xl shadow-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-rose-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
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
              className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-base font-extrabold rounded-2xl text-[#00131c] bg-gradient-to-r from-[#a2fff4] via-[#6aceff] to-[#3b82f6] hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-[#6aceff]/20 transition-all active:scale-[0.99]"
            >
              {isLoading && !isCompareLoading ? (
                <div className="h-5 w-5 border-2 border-[#00131c] border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <LayoutDashboard className="h-5 w-5 mr-2" />
              )}
              Generate Forecast
            </button>
            
            <button
              onClick={handleCompare}
              disabled={!uploadedData || isLoading || isCompareLoading}
              className="w-full flex items-center justify-center px-6 py-3.5 border border-[#004775] text-sm font-semibold rounded-2xl text-[#a2fff4] bg-[#002238] hover:bg-[#002f4d] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {isCompareLoading ? (
                <div className="h-4 w-4 border-2 border-[#a2fff4] border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Settings className="h-4 w-4 mr-2 text-[#a2fff4]" />
              )}
              Compare All Models
            </button>
          </div>

          {/* Right Column: Visualization & Results */}
          <div className="lg:col-span-8 space-y-6">
            <ForecastChart 
              historicalData={uploadedData} 
              forecastData={forecastResult} 
            />

            {forecastResult && (
              <>
                <MetricsCard metrics={forecastResult.metrics} />
                <AIExplanation explanation={forecastResult.explanation} />
                <DownloadReport 
                  forecastData={forecastResult}
                  model={selectedModel}
                  explanation={forecastResult.explanation}
                />
              </>
            )}

            {compareResults && (
              <CompareModels comparisons={compareResults} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#003b64] bg-[#001424] py-6 text-xs text-[#94a3b8] font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <LogoF className="h-4 w-4" />
            <span className="text-white font-bold">SmartForecast AI</span>
            <span>•</span>
            <span>Enterprise Workspace</span>
          </div>
          <div>
            <span>Multi-Model Parallel Inference</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
