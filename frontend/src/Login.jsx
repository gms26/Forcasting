import React, { useState } from 'react';
import axios from 'axios';
import { 
  TrendingUp, 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Login({ setToken, setUser }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid work or personal email address.');
      return;
    }

    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);
    
    try {
      const endpoint = isRegister ? `${API_BASE}/auth/register` : `${API_BASE}/auth/login`;
      const payload = isRegister 
        ? { email, password, name } 
        : { email, password };

      const response = await axios.post(endpoint, payload);
      
      const token = response.data.access_token;
      const userData = response.data.user || { email, name: name || email.split('@')[0] };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      if (setUser) {
        setUser(userData);
      }
      setToken(token);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Authentication failed. Please check your credentials.';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail = 'analyst@smartforecast.ai') => {
    setEmail(demoEmail);
    setPassword('forecast2025');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Dynamic Background Ambient Lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-cyan-500/20 rounded-full blur-[130px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-[40%] right-[30%] w-[350px] h-[350px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 forecasting-grid-pattern opacity-60 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl glow-indigo">
        
        {/* Left Side: Forecasting Hero Showcase */}
        <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-900 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative">
          
          {/* Top Brand & Badge */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold tracking-tight text-white">SmartForecast</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">AI 2.0</span>
                </div>
                <p className="text-xs text-slate-400">Enterprise Time-Series Intelligence</p>
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight">
                Predict Tomorrow's Trends with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Precision AI</span>
              </h2>
              <p className="text-sm text-slate-300">
                Leverage ARIMA, Prophet, and Holt-Winters models paired with Gemini AI reasoning to forecast your business metrics accurately.
              </p>
            </div>
          </div>

          {/* Interactive Forecasting Visualizer Card */}
          <div className="my-4 p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 shadow-inner relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-cyan-400 animate-pulse" />
                <span className="text-xs font-semibold text-slate-200">Live Forecast Engine</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[11px] font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>99.4% Accuracy</span>
              </div>
            </div>

            {/* Custom SVG Predictive Fan Chart */}
            <div className="h-32 w-full relative">
              <svg viewBox="0 0 360 120" className="w-full h-full overflow-visible">
                <defs>
                  {/* Forecast Gradient Fill */}
                  <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                  {/* Confidence Interval Band */}
                  <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1="0" y1="30" x2="360" y2="30" stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.4" />
                <line x1="0" y1="70" x2="360" y2="70" stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.4" />
                <line x1="0" y1="105" x2="360" y2="105" stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.4" />

                {/* Forecast Boundary Line */}
                <line x1="200" y1="10" x2="200" y2="115" stroke="#06b6d4" strokeDasharray="2 2" strokeWidth="1.5" />
                <text x="204" y="22" fill="#06b6d4" fontSize="9" fontWeight="600">FORECAST</text>

                {/* Confidence Interval Polygon (Fan) */}
                <polygon 
                  points="200,60 240,42 280,32 320,20 360,12 360,88 320,80 280,74 240,70 200,60" 
                  fill="url(#confidenceBand)" 
                />

                {/* Historical Area Fill */}
                <path 
                  d="M 0 95 Q 40 85, 80 90 T 140 70 T 200 60 L 200 115 L 0 115 Z" 
                  fill="url(#forecastFill)" 
                />

                {/* Historical Curve Line */}
                <path 
                  d="M 0 95 Q 40 85, 80 90 T 140 70 T 200 60" 
                  fill="none" 
                  stroke="#38bdf8" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />

                {/* Predicted Curve Line (Dashed) */}
                <path 
                  d="M 200 60 Q 240 55, 280 48 T 360 28" 
                  fill="none" 
                  stroke="#818cf8" 
                  strokeWidth="3" 
                  strokeDasharray="4 3"
                  strokeLinecap="round"
                />

                {/* Crossover Anchor Dot */}
                <circle cx="200" cy="60" r="5" fill="#06b6d4" className="animate-pulse" />
                <circle cx="200" cy="60" r="2" fill="#ffffff" />

                {/* Future Endpoint Dot */}
                <circle cx="360" cy="28" r="4" fill="#818cf8" />
              </svg>
            </div>

            {/* Micro Metrics in Preview */}
            <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-slate-800/80 text-center">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Historical</p>
                <p className="text-xs font-semibold text-sky-400">Actuals</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Confidence</p>
                <p className="text-xs font-semibold text-indigo-400">95% Interval</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">AI Insights</p>
                <p className="text-xs font-semibold text-cyan-400">Gemini LLM</p>
              </div>
            </div>
          </div>

          {/* Feature Highlights List */}
          <div className="space-y-2.5 mt-4">
            <div className="flex items-center text-xs text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-cyan-400 mr-2 flex-shrink-0" />
              <span>Prophet, ARIMA & Holt-Winters multi-algorithm benchmark</span>
            </div>
            <div className="flex items-center text-xs text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-cyan-400 mr-2 flex-shrink-0" />
              <span>Automated Gemini AI executive report explanations</span>
            </div>
            <div className="flex items-center text-xs text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-cyan-400 mr-2 flex-shrink-0" />
              <span>Instant PDF & CSV reports ready for stakeholder review</span>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>256-Bit JWT Encryption</span>
            </div>
            <span>v2.5 Production Ready</span>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-center bg-slate-900">
          
          <div className="max-w-md w-full mx-auto">
            {/* Header Tabs */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {isRegister ? 'Create Account' : 'Welcome Back'}
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  {isRegister 
                    ? 'Start forecasting with your corporate or personal email' 
                    : 'Sign in to access your predictive analytics dashboard'}
                </p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => { setIsRegister(false); setError(''); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  !isRegister 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsRegister(true); setError(''); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  isRegister 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                New Account
              </button>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-start space-x-2.5 animate-fadeIn">
                <span className="font-bold flex-shrink-0">⚠️</span>
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Optional Name on Register */}
              {isRegister && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Alex Morgan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 block w-full rounded-xl border border-slate-800 bg-slate-950/80 text-white placeholder-slate-500 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Work / Personal Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 block w-full rounded-xl border border-slate-800 bg-slate-950/80 text-white placeholder-slate-500 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-300">Password</label>
                  {!isRegister && (
                    <button 
                      type="button"
                      onClick={() => handleQuickDemo('analyst@smartforecast.ai')}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                    >
                      Fill Demo Email
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 block w-full rounded-xl border border-slate-800 bg-slate-950/80 text-white placeholder-slate-500 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between py-1 text-xs">
                <label className="flex items-center space-x-2 text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                  />
                  <span>Remember my session</span>
                </label>
                <span className="text-slate-500 text-[11px]">Instant workspace setup</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>{isRegister ? 'Create Account & Continue' : 'Sign In to Workspace'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </button>
            </form>

            {/* Quick Demo Analyst Preset Button */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-400 mb-2">Want to test with a preloaded sample profile?</p>
              <button
                type="button"
                onClick={() => handleQuickDemo('analyst@smartforecast.ai')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
              >
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>Use Sample Analyst Email (analyst@smartforecast.ai)</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
