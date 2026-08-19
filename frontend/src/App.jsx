import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, 
  LogOut, 
  LayoutDashboard, 
  Settings,
  Database
} from 'lucide-react';

import Login from './Login';
import Landing from './Landing';
import FileUpload from './components/FileUpload';
import ModelSelector from './components/ModelSelector';
import ForecastChart from './components/ForecastChart';
import AIExplanation from './components/AIExplanation';
import MetricsCard from './components/MetricsCard';
import ForecastPeriodSlider from './components/ForecastPeriodSlider';
import CompareModels from './components/CompareModels';
import DownloadReport from './components/DownloadReport';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  
  // App State
  const [showLogin, setShowLogin] = useState(false);
  const [uploadedData, setUploadedData] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [selectedModel, setSelectedModel] = useState('Moving Average');
  const [forecastPeriod, setForecastPeriod] = useState(30);
  
  // Results State
  const [forecastResult, setForecastResult] = useState(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [compareResults, setCompareResults] = useState(null);
  const [bestModel, setBestModel] = useState(null);
  
  // Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isCompareLoading, setIsCompareLoading] = useState(false);
  const [error, setError] = useState('');

  // Clear results when inputs change
  useEffect(() => {
    setForecastResult(null);
    setAiExplanation('');
    setCompareResults(null);
    setBestModel(null);
    setError('');
  }, [uploadedData, selectedModel, forecastPeriod]);

  // Setup Axios interceptor for auth
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          handleLogout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    // Reset state
    setUploadedData(null);
    setFileInfo(null);
    setForecastResult(null);
    setAiExplanation('');
    setCompareResults(null);
  };

  const handleUpload = async (file) => {
    setIsLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response format from server. The API might not be configured correctly.");
      }
      setUploadedData(response.data);
      setFileInfo(file);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error uploading file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`${API_BASE}/sample`);
      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response format from server. The API might not be configured correctly.");
      }
      setUploadedData(response.data);
      setFileInfo({ name: 'sample_data.csv', size: 1024 * 45 }); // Dummy size
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error loading sample data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = () => {
    setUploadedData(null);
    setFileInfo(null);
  };

  const generateInsight = async (forecastData) => {
    setIsAiLoading(true);
    try {
      const histValues = uploadedData.map(d => d.value);
      const foreValues = forecastData.forecast;
      
      const response = await axios.post(`${API_BASE}/explain`, {
        model_name: selectedModel,
        periods: forecastPeriod,
        historical_values: histValues,
        forecast_values: foreValues,
        mae: forecastData.mae,
        rmse: forecastData.rmse,
        mape: forecastData.mape
      });
      setAiExplanation(response.data.explanation);
    } catch (err) {
      console.error('Error generating AI explanation:', err);
      // Don't set main error, just show fallback in component if needed
      setAiExplanation("AI explanation failed to generate. Please ensure your Gemini API key is configured correctly.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleForecast = async () => {
    if (!uploadedData) return;
    
    setIsLoading(true);
    setError('');
    setForecastResult(null);
    setAiExplanation('');
    
    try {
      const response = await axios.post(`${API_BASE}/forecast`, {
        data: uploadedData,
        model: selectedModel,
        periods: forecastPeriod
      });
      
      setForecastResult(response.data);
      
      // Fire and forget AI explanation
      generateInsight(response.data);
      
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error running forecast.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompare = async () => {
    if (!uploadedData) return;
    
    setIsCompareLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_BASE}/compare`, {
        data: uploadedData,
        model: selectedModel, // Model is required by schema, but compare runs all
        periods: forecastPeriod
      });
      
      setCompareResults(response.data.results);
      setBestModel(response.data.best_model);
      
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error comparing models.');
    } finally {
      setIsCompareLoading(false);
    }
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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900 tracking-tight">SmartForecast <span className="text-blue-600">AI</span></span>
                <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">Enterprise</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button 
                onClick={handleSampleData}
                disabled={isLoading}
                className="text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-lg transition-colors flex items-center shadow-sm"
              >
                <Database className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
                Load Sample Data
              </button>

              {/* User Profile Pill */}
              <div className="flex items-center pl-2 pr-3 py-1 bg-slate-50 border border-slate-200/80 rounded-full">
                <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm mr-2">
                  {userInitial}
                </div>
                <div className="hidden md:flex flex-col text-left mr-2">
                  <span className="text-xs font-semibold text-gray-800 leading-tight max-w-[130px] truncate">{userDisplayName}</span>
                  <span className="text-[10px] text-gray-400 leading-tight max-w-[130px] truncate">{user?.email || 'Authenticated'}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-rose-600 p-1 rounded-full hover:bg-rose-50 transition-colors ml-1"
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
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
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
              className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading && !isCompareLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <LayoutDashboard className="h-5 w-5 mr-2" />
              )}
              Generate Forecast
            </button>
            
            <button
              onClick={handleCompare}
              disabled={!uploadedData || isLoading || isCompareLoading}
              className="w-full flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isCompareLoading ? (
                <div className="h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Settings className="h-4 w-4 mr-2" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MetricsCard metrics={{
                  mae: forecastResult.mae,
                  rmse: forecastResult.rmse,
                  mape: forecastResult.mape
                }} />
                
                <DownloadReport 
                  forecastData={forecastResult}
                  metrics={{
                    mae: forecastResult.mae,
                    rmse: forecastResult.rmse,
                    mape: forecastResult.mape
                  }}
                  explanation={aiExplanation}
                  modelName={forecastResult.model_name}
                  periods={forecastPeriod}
                />
              </div>
            )}
            
            {/* Show Compare Results if triggered */}
            {(compareResults || isCompareLoading) && (
              <CompareModels 
                results={compareResults} 
                bestModel={bestModel}
                isLoading={isCompareLoading} 
              />
            )}
            
            <AIExplanation 
              explanation={aiExplanation} 
              isLoading={isAiLoading}
              onRegenerate={() => generateInsight(forecastResult)}
            />
            
          </div>
        </div>
      </main>
    </div>
  );
}
