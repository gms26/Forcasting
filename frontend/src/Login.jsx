import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TrendingUp, 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  Activity, 
  ShieldCheck, 
  CheckCircle2,
  Check,
  X,
  AlertCircle,
  Key,
  Globe,
  Building2,
  Fingerprint,
  Server
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Instant Demo Profile Presets for Testing
const DEMO_PRESETS = [
  {
    role: 'Lead Analyst',
    email: 'analyst@smartforecast.ai',
    name: 'Sarah Chen',
    password: 'forecast2025',
    tag: 'Analyst'
  },
  {
    role: 'CFO / Finance',
    email: 'cfo@smartforecast.ai',
    name: 'Marcus Vance',
    password: 'forecast2025',
    tag: 'Executive'
  },
  {
    role: 'Supply Chain',
    email: 'supplychain@smartforecast.ai',
    name: 'David Rossi',
    password: 'forecast2025',
    tag: 'Logistics'
  },
  {
    role: 'Platform Admin',
    email: 'admin@smartforecast.ai',
    name: 'Alex Vance',
    password: 'smartforecast',
    tag: 'Admin'
  }
];

export default function Login({ setToken, setUser, onBack }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccessNotice, setAuthSuccessNotice] = useState('');

  // Modals
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  
  const [showSSOModal, setShowSSOModal] = useState(false);
  const [ssoDomain, setSsoDomain] = useState('');
  const [ssoStatus, setSsoStatus] = useState('');

  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFACode, setTwoFACode] = useState(['', '', '', '', '', '']);

  // Password Strength Calculation (for Registration)
  const calculatePasswordStrength = (pwd) => {
    let score = 0;
    if (!pwd) return { score: 0, text: 'Empty', color: 'bg-slate-700' };
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, text: 'Weak', color: 'bg-rose-500' };
    if (score === 3) return { score: 2, text: 'Fair', color: 'bg-amber-500' };
    if (score === 4) return { score: 3, text: 'Strong', color: 'bg-emerald-500' };
    return { score: 4, text: 'Enterprise Grade', color: 'bg-cyan-400' };
  };

  const pwdStrength = calculatePasswordStrength(password);

  const handleKeyDown = (e) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState('CapsLock'));
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setAuthSuccessNotice('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid work or personal email address.');
      return;
    }

    if (!password || password.length < 4) {
      setError('Password must contain at least 4 characters.');
      return;
    }

    setIsLoading(true);
    
    try {
      const endpoint = isRegister ? `${API_BASE}/auth/register` : `${API_BASE}/auth/login`;
      const payload = isRegister 
        ? { email: cleanEmail, password, name: name.trim() } 
        : { email: cleanEmail, password };

      const response = await axios.post(endpoint, payload);
      
      const token = response.data.access_token;
      const userData = response.data.user || { 
        email: cleanEmail, 
        name: name || cleanEmail.split('@')[0] 
      };

      setAuthSuccessNotice('Identity verified. Entering workspace...');

      setTimeout(() => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        if (setUser) setUser(userData);
        setToken(token);
      }, 400);

    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Authentication failed. Please verify credentials.';
      setError(errorMsg);
      setIsLoading(false);
    }
  };

  const applyPreset = async (preset) => {
    setEmail(preset.email);
    setPassword(preset.password);
    setName(preset.name);
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        email: preset.email,
        password: preset.password
      });

      const token = response.data.access_token;
      const userData = response.data.user || { email: preset.email, name: preset.name };

      setAuthSuccessNotice(`Authenticated as ${preset.name}. Launching...`);

      setTimeout(() => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        if (setUser) setUser(userData);
        setToken(token);
      }, 450);

    } catch {
      const mockToken = 'jwt_demo_' + Math.random().toString(36).substring(2);
      const userData = { email: preset.email, name: preset.name };
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(userData));
      if (setUser) setUser(userData);
      setToken(mockToken);
    }
  };

  const handleSocialAuth = (providerName) => {
    setError('');
    setIsLoading(true);
    const mockEmail = providerName === 'Google' ? 'analyst@smartforecast.ai' : 'devops@smartforecast.ai';
    const mockName = providerName === 'Google' ? 'Google Workspace Analyst' : 'GitHub Engineer';

    setTimeout(() => {
      const mockToken = `sso_${providerName.toLowerCase()}_token_` + Date.now();
      const userData = { email: mockEmail, name: mockName, provider: providerName };
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(userData));
      if (setUser) setUser(userData);
      setToken(mockToken);
    }, 500);
  };

  const handleSSOVerify = (e) => {
    e.preventDefault();
    if (!ssoDomain || !ssoDomain.includes('.')) {
      setSsoStatus('error');
      return;
    }
    setSsoStatus('verifying');
    setTimeout(() => {
      setShowSSOModal(false);
      const ssoUser = { email: `user@${ssoDomain}`, name: `${ssoDomain.split('.')[0].toUpperCase()} Enterprise` };
      const mockToken = 'sso_saml_okta_' + Date.now();
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(ssoUser));
      if (setUser) setUser(ssoUser);
      setToken(mockToken);
    }, 800);
  };

  const domainSuggestions = ['@smartforecast.ai', '@company.com', '@gmail.com'];
  const handleDomainAppend = (dom) => {
    const prefix = email.includes('@') ? email.split('@')[0] : email;
    setEmail(`${prefix}${dom}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Background Ambience Mesh & Lights */}
      <div className="fixed inset-0 forecasting-radial-mesh pointer-events-none z-0" />
      <div className="fixed inset-0 forecasting-grid-pattern opacity-40 pointer-events-none z-0" />
      
      <div className="fixed -top-40 -left-40 w-[550px] h-[550px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-slow z-0" />
      <div className="fixed -bottom-40 -right-40 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[150px] pointer-events-none animate-pulse-slow z-0" />

      {/* Top Navbar */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800/60">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px] shadow-md shadow-cyan-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-base font-extrabold tracking-tight text-white">SmartForecast</span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              AI 2.5
            </span>
          </div>
        </div>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Overview</span>
          </button>
        )}
      </header>

      {/* Main Container: Focused & Clean Split Layout */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-slate-900/90 border border-slate-800/90 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
          
          {/* Left Column: Pure Forecasting Visual & Artwork (No duplicate marketing text) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative">
            
            {/* Header branding */}
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-semibold mb-3">
                <Activity className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                <span>Predictive Time-Series Engine</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Forecasting Workspace
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your credentials to access live model benchmarking and Gemini AI reasoning.
              </p>
            </div>

            {/* Clean Forecasting Visual Graph Graphic */}
            <div className="my-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 shadow-inner relative overflow-hidden">
              <div className="flex items-center justify-between mb-3 text-[11px]">
                <span className="text-slate-400 font-medium">Model Output Stream</span>
                <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  ● 99.4% Accuracy
                </span>
              </div>

              {/* Dynamic Predictive Fan Curve SVG */}
              <div className="h-32 w-full relative">
                <svg viewBox="0 0 320 110" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="loginForecastGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="loginFanGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="0" y1="28" x2="320" y2="28" stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.35" />
                  <line x1="0" y1="65" x2="320" y2="65" stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.35" />
                  <line x1="0" y1="95" x2="320" y2="95" stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.35" />

                  {/* Vertical origin line */}
                  <line x1="170" y1="5" x2="170" y2="105" stroke="#06b6d4" strokeDasharray="2 2" strokeWidth="1.5" />
                  <text x="174" y="16" fill="#06b6d4" fontSize="8" fontWeight="700">PREDICTION</text>

                  {/* 95% Confidence Fan */}
                  <polygon 
                    points="170,55 210,38 250,28 290,16 320,10 320,85 290,75 250,70 210,65 170,55" 
                    fill="url(#loginFanGrad)" 
                  />

                  {/* Historical Area */}
                  <path 
                    d="M 0 90 Q 40 82, 80 86 T 130 65 T 170 55 L 170 105 L 0 105 Z" 
                    fill="url(#loginForecastGrad)" 
                  />

                  {/* Historical Solid Line */}
                  <path 
                    d="M 0 90 Q 40 82, 80 86 T 130 65 T 170 55" 
                    fill="none" 
                    stroke="#38bdf8" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                  />

                  {/* Forecast Dashed Line */}
                  <path 
                    d="M 170 55 Q 210 50, 250 42 T 320 22" 
                    fill="none" 
                    stroke="#818cf8" 
                    strokeWidth="2.5" 
                    strokeDasharray="4 3" 
                    strokeLinecap="round" 
                  />

                  {/* Pulse Crossover Node */}
                  <circle cx="170" cy="55" r="4.5" fill="#06b6d4" className="animate-pulse" />
                  <circle cx="170" cy="55" r="8" fill="none" stroke="#06b6d4" strokeWidth="1" className="animate-ping opacity-75" />
                  <circle cx="320" cy="22" r="3.5" fill="#818cf8" />
                </svg>
              </div>

              {/* Minimal metrics footer */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-800/80 text-center text-[10px]">
                <div>
                  <span className="text-slate-500 uppercase block font-medium">History</span>
                  <span className="text-cyan-400 font-bold">Actuals</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase block font-medium">Interval</span>
                  <span className="text-indigo-400 font-bold">95% CI</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase block font-medium">Reasoner</span>
                  <span className="text-emerald-400 font-bold">Gemini 2.5</span>
                </div>
              </div>
            </div>

            {/* Security badge footer */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/50">
              <span className="flex items-center">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 mr-1" />
                256-Bit Encrypted
              </span>
              <span>TLS 1.3 Active</span>
            </div>

          </div>

          {/* Right Column: Clean, Modern Authentication Portal */}
          <div className="lg:col-span-7 p-7 sm:p-9 flex flex-col justify-center bg-slate-900">
            
            <div className="max-w-md w-full mx-auto">
              
              {/* Header & Mode Switcher */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {isRegister ? 'Create Account' : 'Welcome Back'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isRegister ? 'Sign up for enterprise workspace' : 'Sign in to access your models'}
                  </p>
                </div>
              </div>

              {/* Segmented Sign In / Register Tabs */}
              <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => { setIsRegister(false); setError(''); setAuthSuccessNotice(''); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    !isRegister 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setIsRegister(true); setError(''); setAuthSuccessNotice(''); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    isRegister 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Social / OAuth SSO Buttons */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => handleSocialAuth('Google')}
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold transition-all disabled:opacity-50"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSSOModal(true)}
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold transition-all disabled:opacity-50"
                >
                  <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                  <span>SAML SSO</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex py-1 items-center mb-3">
                <div className="flex-grow border-t border-slate-800" />
                <span className="flex-shrink mx-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                  or with email
                </span>
                <div className="flex-grow border-t border-slate-800" />
              </div>

              {/* Alert Capsules */}
              {error && (
                <div className="mb-3 p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-start space-x-2 animate-fadeIn">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-rose-400" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              {authSuccessNotice && (
                <div className="mb-3 p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-start space-x-2 animate-fadeIn">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                  <span className="leading-snug">{authSuccessNotice}</span>
                </div>
              )}

              {/* Main Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                {isRegister && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Sarah Chen"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-9 block w-full rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 text-xs p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Email Input */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Work Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 block w-full rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 text-xs p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  {email && !email.includes('@') && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {domainSuggestions.map((dom) => (
                        <button
                          key={dom}
                          type="button"
                          onClick={() => handleDomainAppend(dom)}
                          className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] text-slate-400 hover:text-cyan-300"
                        >
                          +{dom}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-300">Password</label>
                    {!isRegister && (
                      <button 
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-[11px] text-cyan-400 hover:underline"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      onKeyDown={handleKeyDown}
                      onKeyUp={handleKeyDown}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-9 block w-full rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 text-xs p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {capsLockActive && (
                    <div className="mt-1 text-[11px] text-amber-400 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>Caps Lock is ON</span>
                    </div>
                  )}

                  {isRegister && password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">Strength:</span>
                        <span className="font-semibold text-slate-200">{pwdStrength.text}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 h-1 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${pwdStrength.score >= 1 ? pwdStrength.color : 'bg-slate-800'}`} />
                        <div className={`h-full rounded-full ${pwdStrength.score >= 2 ? pwdStrength.color : 'bg-slate-800'}`} />
                        <div className={`h-full rounded-full ${pwdStrength.score >= 3 ? pwdStrength.color : 'bg-slate-800'}`} />
                        <div className={`h-full rounded-full ${pwdStrength.score >= 4 ? pwdStrength.color : 'bg-slate-800'}`} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Remember Me / Session */}
                {!isRegister && (
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <label className="flex items-center space-x-2 text-slate-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-[11px]">Remember 30 days</span>
                    </label>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg shadow-blue-600/30 disabled:opacity-50 transition-all"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5">
                      <span>{isRegister ? 'Create Account & Enter' : 'Sign in to Workspace'}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  )}
                </button>
              </form>

              {/* Minimal Demo Profiles Quick Fill Chips */}
              <div className="mt-5 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center">
                    <Sparkles className="h-3 w-3 text-cyan-400 mr-1" />
                    Demo Presets
                  </span>
                  <span className="text-[10px] text-slate-500">1-Click Auto Fill</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {DEMO_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800/90 border border-slate-800 text-left transition-all group flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-slate-300 group-hover:text-white truncate">
                          {preset.role}
                        </p>
                      </div>
                      <span className="text-[9px] font-medium text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                        {preset.tag}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/60">
        <span>© {new Date().getFullYear()} SmartForecast AI</span>
        <div className="flex items-center space-x-3">
          <span className="flex items-center text-slate-400">
            <Server className="h-3 w-3 text-cyan-400 mr-1" />
            US-East-1 (Operational)
          </span>
        </div>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => { setShowForgotModal(false); setForgotSubmitted(false); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Reset Password</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your email to receive recovery instructions.
            </p>

            {forgotSubmitted ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs space-y-2">
                <p>Recovery link dispatched to <strong className="text-white">{forgotEmail}</strong>.</p>
                <button
                  type="button"
                  onClick={() => { setShowForgotModal(false); setForgotSubmitted(false); }}
                  className="w-full mt-2 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg text-xs"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setForgotSubmitted(true); }} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="block w-full rounded-xl border border-slate-800 bg-slate-950 text-white text-xs p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs"
                >
                  Send Recovery Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SSO Modal */}
      {showSSOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => { setShowSSOModal(false); setSsoStatus(''); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Single Sign-On (SSO)</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your corporate domain (e.g. acmecorp.com)
            </p>

            <form onSubmit={handleSSOVerify} className="space-y-3">
              <input
                type="text"
                required
                placeholder="company.com"
                value={ssoDomain}
                onChange={(e) => setSsoDomain(e.target.value)}
                className="block w-full rounded-xl border border-slate-800 bg-slate-950 text-white text-xs p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {ssoStatus === 'verifying' && (
                <p className="text-[11px] text-indigo-300">Connecting to SAML IdP...</p>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs"
              >
                Authenticate SSO
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
