import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  BarChart3, 
  TrendingUp, 
  Settings, 
  LayoutDashboard, 
  LogOut, 
  Database,
  Lock,
  ArrowRight,
  Sparkles,
  Layers,
  Table,
  Cpu,
  Activity,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Zap,
  Sliders
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

  // Active Dashboard Tab
  const [activeTab, setActiveTab] = useState('workbench'); // 'workbench' | 'benchmark' | 'inspector'

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
      setFileInfo({ name: 'sample_enterprise_arr.csv', size: 4096 });
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
      setActiveTab('workbench');
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
      setActiveTab('benchmark');
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

  // Compute dataset summary stats
  const datasetStats = useMemo(() => {
    if (!uploadedData || !Array.isArray(uploadedData) || uploadedData.length === 0) {
      return null;
    }
    const count = uploadedData.length;
    const values = uploadedData.map(d => Number(d.value)).filter(v => !isNaN(v));
    const minVal = values.length ? Math.min(...values) : 0;
    const maxVal = values.length ? Math.max(...values) : 0;
    const avgVal = values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2) : 0;
    const startDate = uploadedData[0]?.date || 'N/A';
    const endDate = uploadedData[uploadedData.length - 1]?.date || 'N/A';
    return { count, minVal, maxVal, avgVal, startDate, endDate };
  }, [uploadedData]);

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
        <div className="absolute inset-0 rasera-mesh-pattern opacity-75" />
        <div className="absolute inset-0 rasera-radial-glow" />
      </div>

      {/* Navbar */}
      <nav className="bg-[#001726]/85 backdrop-blur-2xl border-b border-[#003b64] sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Brand */}
            <div className="flex items-center space-x-3.5">
              <div className="h-11 w-11 rounded-2xl bg-[#002238] border border-[#004f7c] shadow-lg flex items-center justify-center p-1.5 shadow-[#a2fff4]/10 animate-pulse-glow">
                <LogoF className="h-7 w-7" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-display font-extrabold tracking-tight text-white">SmartForecast</span>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#a2fff4]/15 text-[#a2fff4] border border-[#a2fff4]/40">
                    Enterprise
                  </span>
                </div>
                <span className="text-xs text-[#97dcff]/75 font-medium">Predictive Intelligence Dashboard</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button 
                onClick={handleSampleData}
                disabled={isLoading}
                className="text-xs sm:text-sm font-semibold text-[#a2fff4] bg-[#002842] hover:bg-[#00375a] border border-[#a2fff4]/30 px-4 py-2.5 rounded-xl transition-all flex items-center shadow-md hover:border-[#a2fff4]"
              >
                <Database className="h-4 w-4 mr-2 text-[#a2fff4]" />
                Load Sample Data
              </button>

              {/* User Profile Pill */}
              <div className="flex items-center pl-2 pr-3.5 py-1.5 bg-[#002238] border border-[#004775] rounded-full shadow-sm">
                <div className="h-8 w-8 rounded-full btn-radiant flex items-center justify-center text-xs font-extrabold mr-2.5 shadow-sm">
                  {userInitial}
                </div>
                <div className="hidden md:flex flex-col text-left mr-2">
                  <span className="text-xs font-bold text-white leading-tight max-w-[130px] truncate font-display">{userDisplayName}</span>
                  <span className="text-[10px] text-[#94a3b8] leading-tight max-w-[130px] truncate font-mono">{user?.email || 'Authenticated'}</span>
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

      {/* Dashboard Sub-Header / KPI Summary Cards */}
      <div className="relative z-10 bg-[#001726]/60 border-b border-[#003b64] py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          {/* Card 1: Data Source Status */}
          <div className="rasera-card p-4 rounded-xl flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-[#002f4d] border border-[#00558a] flex items-center justify-center text-[#a2fff4]">
              <Database className="h-5 w-5" />
            </div>
            <div className="truncate">
              <span className="text-[11px] font-bold uppercase text-[#97dcff]/70 block font-mono">Ingested Dataset</span>
              <span className="text-base font-display font-bold text-white truncate block">
                {fileInfo?.name || 'No Data Ingested'}
              </span>
              <span className="text-[11px] text-[#94a3b8] font-mono">
                {datasetStats ? `${datasetStats.count} records` : 'Awaiting CSV'}
              </span>
            </div>
          </div>

          {/* Card 2: Temporal Span */}
          <div className="rasera-card p-4 rounded-xl flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-[#002f4d] border border-[#00558a] flex items-center justify-center text-[#6aceff]">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="truncate">
              <span className="text-[11px] font-bold uppercase text-[#97dcff]/70 block font-mono">Time Span</span>
              <span className="text-base font-display font-bold text-white truncate block">
                {datasetStats ? `${datasetStats.startDate} → ${datasetStats.endDate}` : '—'}
              </span>
              <span className="text-[11px] text-[#94a3b8] font-mono">
                {datasetStats ? `Mean Value: ${datasetStats.avgVal}` : 'Upload data to inspect'}
              </span>
            </div>
          </div>

          {/* Card 3: Active Model */}
          <div className="rasera-card p-4 rounded-xl flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-[#002f4d] border border-[#00558a] flex items-center justify-center text-[#a2fff4]">
              <Cpu className="h-5 w-5" />
            </div>
            <div className="truncate">
              <span className="text-[11px] font-bold uppercase text-[#97dcff]/70 block font-mono">Active Model</span>
              <span className="text-base font-display font-bold text-white truncate block">
                {selectedModel} ({forecastPeriod}D)
              </span>
              <span className="text-[11px] text-[#a2fff4] font-mono">
                {forecastResult ? 'Forecast Active' : 'Ready to Run'}
              </span>
            </div>
          </div>

          {/* Card 4: Engine Status */}
          <div className="rasera-card p-4 rounded-xl flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-[#002f4d] border border-[#00558a] flex items-center justify-center text-emerald-400">
              <Activity className="h-5 w-5" />
            </div>
            <div className="truncate">
              <span className="text-[11px] font-bold uppercase text-[#97dcff]/70 block font-mono">Runtime Engine</span>
              <span className="text-base font-display font-bold text-emerald-400 truncate block">
                &lt; 38ms Latency
              </span>
              <span className="text-[11px] text-[#94a3b8] font-mono">In-Memory Ephemeral</span>
            </div>
          </div>

        </div>
      </div>

      {/* Dashboard View Navigation Tabs */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center space-x-2 border-b border-[#003b64] pb-4 font-display">
          <button
            onClick={() => setActiveTab('workbench')}
            className={`px-5 py-2.5 rounded-xl text-base font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'workbench'
                ? 'btn-radiant shadow-lg'
                : 'text-[#cbd5e1] hover:text-white hover:bg-[#002238]'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Forecasting Studio</span>
          </button>

          <button
            onClick={() => {
              if (compareResults) {
                setActiveTab('benchmark');
              } else {
                handleCompare();
              }
            }}
            className={`px-5 py-2.5 rounded-xl text-base font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'benchmark'
                ? 'btn-radiant shadow-lg'
                : 'text-[#cbd5e1] hover:text-white hover:bg-[#002238]'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Model Benchmark Matrix</span>
            {compareResults && (
              <span className="h-2 w-2 rounded-full bg-[#00131c] shadow-[0_0_4px_#00131c]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('inspector')}
            className={`px-5 py-2.5 rounded-xl text-base font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'inspector'
                ? 'btn-radiant shadow-lg'
                : 'text-[#cbd5e1] hover:text-white hover:bg-[#002238]'
            }`}
          >
            <Table className="h-4 w-4" />
            <span>Data Inspector</span>
          </button>
        </div>
      </div>

      {/* Main Content Dashboard */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        
        {error && (
          <div className="mb-6 bg-rose-950/80 border-l-4 border-rose-500 p-4 rounded-xl shadow-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-rose-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-rose-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Main Forecast Studio Workbench */}
        {activeTab === 'workbench' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            
            {/* Left Column: Controls Workbench */}
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
                className="btn-radiant w-full py-4 px-6 rounded-2xl text-base flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading && !isCompareLoading ? (
                  <div className="h-5 w-5 border-2 border-[#00131c] border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Sparkles className="h-5 w-5 mr-2 text-[#00131c]" />
                )}
                <span>Generate Forecast</span>
              </button>
              
              <button
                onClick={handleCompare}
                disabled={!uploadedData || isLoading || isCompareLoading}
                className="w-full flex items-center justify-center px-6 py-3.5 border border-[#004775] text-sm font-bold font-display rounded-2xl text-[#a2fff4] bg-[#002238] hover:bg-[#002f4d] hover:border-[#a2fff4]/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {isCompareLoading ? (
                  <div className="h-4 w-4 border-2 border-[#a2fff4] border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Layers className="h-4 w-4 mr-2 text-[#a2fff4]" />
                )}
                <span>Compare All Models</span>
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
                    metrics={forecastResult.metrics}
                    modelName={selectedModel}
                    periods={forecastPeriod}
                    explanation={forecastResult.explanation}
                  />
                </>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Model Benchmark Matrix */}
        {activeTab === 'benchmark' && (
          <div className="space-y-6 animate-fade-in">
            <div className="rasera-card p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-display font-bold text-white">Parallel Model Benchmark Execution</h3>
                <p className="text-sm sm:text-base text-[#94a3b8] mt-1">
                  Cross-validates Meta Prophet, Auto-ARIMA, Holt-Winters, and Moving Average across historical folds.
                </p>
              </div>
              <button
                onClick={handleCompare}
                disabled={!uploadedData || isCompareLoading}
                className="btn-radiant px-6 py-3 text-sm rounded-xl disabled:opacity-40 flex items-center space-x-2"
              >
                {isCompareLoading ? (
                  <div className="h-4 w-4 border-2 border-[#00131c] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Layers className="h-4 w-4 text-[#00131c]" />
                )}
                <span>Re-run Benchmark</span>
              </button>
            </div>

            <CompareModels 
              results={compareResults} 
              bestModel={compareResults?.[0]?.model} 
              isLoading={isCompareLoading} 
            />
          </div>
        )}

        {/* Tab 3: Raw Data Inspector */}
        {activeTab === 'inspector' && (
          <div className="rasera-card rounded-2xl overflow-hidden shadow-xl border border-[#004775] animate-fade-in">
            <div className="p-6 border-b border-[#003b64] flex justify-between items-center bg-[#001726]/90">
              <div>
                <h3 className="text-lg font-display font-bold text-white">Ingested Dataset Schema &amp; Records</h3>
                <p className="text-xs sm:text-sm text-[#94a3b8] mt-0.5 font-mono">
                  {uploadedData ? `${uploadedData.length} records verified with date and target values` : 'No dataset uploaded'}
                </p>
              </div>
            </div>

            {uploadedData && uploadedData.length > 0 ? (
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#001a2c] text-xs font-display font-bold text-[#97dcff] uppercase sticky top-0 border-b border-[#003b64]">
                    <tr>
                      <th className="py-3.5 px-6">Row #</th>
                      <th className="py-3.5 px-6">Timestamp / Date</th>
                      <th className="py-3.5 px-6">Target Metric Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#002f4d] bg-[#001424]/90 font-mono text-xs sm:text-sm">
                    {uploadedData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#00243d] transition-colors">
                        <td className="py-3.5 px-6 text-[#94a3b8]">{idx + 1}</td>
                        <td className="py-3.5 px-6 text-white">{row.date}</td>
                        <td className="py-3.5 px-6 text-[#a2fff4] font-bold">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-[#94a3b8]">
                <Database className="h-10 w-10 mx-auto mb-3 text-[#004775]" />
                <p className="text-white font-display font-semibold text-lg">No Data Available</p>
                <p className="text-sm text-[#94a3b8] mt-1">Upload a CSV or load the sample dataset to view raw points.</p>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#003b64] bg-[#001424] py-6 text-xs text-[#94a3b8] font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <LogoF className="h-4 w-4" />
            <span className="text-white font-display font-bold text-sm">SmartForecast AI</span>
            <span>•</span>
            <span>Predictive Intelligence Workspace</span>
          </div>
          <div className="flex items-center space-x-4 font-mono text-xs">
            <span className="text-[#a2fff4] flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-[#a2fff4] shadow-[0_0_4px_#a2fff4]" />
              <span>Engine Ready</span>
            </span>
            <span>Fast In-Memory Processing</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
