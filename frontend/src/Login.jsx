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
  Sparkles, 
  Activity, 
  ShieldCheck, 
  CheckCircle2,
  Check,
  X,
  AlertCircle,
  Key,
  Cpu,
  Building2,
  Globe,
  HelpCircle,
  Layers,
  ExternalLink,
  Shield,
  Zap,
  BarChart2,
  ChevronRight,
  Info,
  RefreshCw,
  Fingerprint,
  Laptop,
  Server
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Enterprise presets for instant realistic testing
const DEMO_PRESETS = [
  {
    role: 'Senior Forecast Analyst',
    email: 'analyst@smartforecast.ai',
    name: 'Sarah Chen, CFA',
    password: 'forecast2025',
    department: 'Demand & Revenue Planning',
    badge: 'Popular',
    icon: TrendingUp,
    color: 'from-blue-500 to-cyan-400'
  },
  {
    role: 'Chief Financial Officer',
    email: 'cfo@smartforecast.ai',
    name: 'Marcus Vance',
    password: 'forecast2025',
    department: 'Executive Leadership',
    badge: 'Executive',
    icon: Building2,
    color: 'from-emerald-500 to-teal-400'
  },
  {
    role: 'VP Supply Chain',
    email: 'supplychain@smartforecast.ai',
    name: 'David Rossi',
    password: 'forecast2025',
    department: 'Global Logistics',
    badge: 'Operations',
    icon: Layers,
    color: 'from-purple-500 to-indigo-400'
  },
  {
    role: 'Platform Administrator',
    email: 'admin@smartforecast.ai',
    name: 'Alex Vance (DevOps)',
    password: 'smartforecast',
    department: 'Cloud Infrastructure & AI',
    badge: 'Full Root',
    icon: ShieldCheck,
    color: 'from-amber-500 to-orange-400'
  }
];

// Interactive Showcase Datasets for Left Hero Visualizer
const SHOWCASE_DATASETS = {
  revenue: {
    title: 'Enterprise ARR Revenue',
    unit: '$M USD',
    current: '$4.82M',
    forecast: '$6.45M',
    change: '+33.8%',
    accuracy: '99.4%',
    mape: '1.4%',
    points: [
      { x: 0, y: 88, label: 'Q1 24' },
      { x: 45, y: 76, label: 'Q2 24' },
      { x: 90, y: 82, label: 'Q3 24' },
      { x: 135, y: 64, label: 'Q4 24' },
      { x: 180, y: 55, label: 'Now' },
      { x: 225, y: 44, label: 'Q1 25 (P)', isForecast: true, low: 52, high: 36 },
      { x: 270, y: 32, label: 'Q2 25 (P)', isForecast: true, low: 44, high: 22 },
      { x: 315, y: 22, label: 'Q3 25 (P)', isForecast: true, low: 36, high: 10 },
      { x: 360, y: 14, label: 'Q4 25 (P)', isForecast: true, low: 30, high: 4 }
    ]
  },
  supply: {
    title: 'Supply Chain Inventory Units',
    unit: 'k Units',
    current: '142.5k',
    forecast: '198.0k',
    change: '+38.9%',
    accuracy: '98.9%',
    mape: '2.1%',
    points: [
      { x: 0, y: 92, label: 'Jan' },
      { x: 45, y: 84, label: 'Feb' },
      { x: 90, y: 70, label: 'Mar' },
      { x: 135, y: 75, label: 'Apr' },
      { x: 180, y: 60, label: 'May' },
      { x: 225, y: 48, label: 'Jun (P)', isForecast: true, low: 58, high: 40 },
      { x: 270, y: 38, label: 'Jul (P)', isForecast: true, low: 50, high: 28 },
      { x: 315, y: 26, label: 'Aug (P)', isForecast: true, low: 40, high: 14 },
      { x: 360, y: 18, label: 'Sep (P)', isForecast: true, low: 32, high: 6 }
    ]
  },
  compute: {
    title: 'Cluster AI Compute Load',
    unit: 'PFLOPS',
    current: '84.2 PF',
    forecast: '124.6 PF',
    change: '+47.9%',
    accuracy: '99.7%',
    mape: '0.9%',
    points: [
      { x: 0, y: 95, label: 'W1' },
      { x: 45, y: 88, label: 'W2' },
      { x: 90, y: 80, label: 'W3' },
      { x: 135, y: 72, label: 'W4' },
      { x: 180, y: 62, label: 'W5' },
      { x: 225, y: 50, label: 'W6 (P)', isForecast: true, low: 59, high: 42 },
      { x: 270, y: 36, label: 'W7 (P)', isForecast: true, low: 48, high: 26 },
      { x: 315, y: 24, label: 'W8 (P)', isForecast: true, low: 38, high: 12 },
      { x: 360, y: 12, label: 'W9 (P)', isForecast: true, low: 28, high: 2 }
    ]
  }
};

export default function Login({ setToken, setUser }) {
  // Auth Form State
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccessNotice, setAuthSuccessNotice] = useState('');

  // Interactive Visualizer State (Left Hero)
  const [activeDatasetKey, setActiveDatasetKey] = useState('revenue');
  const [selectedModelView, setSelectedModelView] = useState('ensemble');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Modals & Auxiliary Dialogs
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  
  const [showSSOModal, setShowSSOModal] = useState(false);
  const [ssoDomain, setSsoDomain] = useState('');
  const [ssoStatus, setSsoStatus] = useState('');

  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFACode, setTwoFACode] = useState(['', '', '', '', '', '']);
  const [twoFATimer, setTwoFATimer] = useState(45);

  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

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

  // Keydown listener for Caps Lock detection
  const handleKeyDown = (e) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState('CapsLock'));
    }
  };

  // 2FA Timer countdown
  useEffect(() => {
    let timer;
    if (show2FAModal && twoFATimer > 0) {
      timer = setInterval(() => setTwoFATimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [show2FAModal, twoFATimer]);

  // Main Submit handler (supports both Sign In and Register)
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setAuthSuccessNotice('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid business or personal email address (e.g. name@company.com).');
      return;
    }

    if (!password || password.length < 4) {
      setError('Password must contain at least 4 characters.');
      return;
    }

    if (isRegister && !termsAccepted) {
      setError('Please accept the Master Services Agreement & Privacy Policy to continue.');
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

      setAuthSuccessNotice('Identity verified. Loading forecasting workspace...');

      setTimeout(() => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        if (setUser) setUser(userData);
        setToken(token);
      }, 500);

    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Authentication failed. Please verify your credentials or server connection.';
      setError(errorMsg);
      setIsLoading(false);
    }
  };

  // Quick Preset Selector (Instant Fill & Smooth Login)
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

      setAuthSuccessNotice(`Authenticated as ${preset.name} (${preset.role}). Launching workspace...`);

      setTimeout(() => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        if (setUser) setUser(userData);
        setToken(token);
      }, 550);

    } catch {
      // Fallback auto-provision if offline or custom endpoint
      const mockToken = 'jwt_demo_bearer_' + Math.random().toString(36).substring(2);
      const userData = { email: preset.email, name: preset.name };
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(userData));
      if (setUser) setUser(userData);
      setToken(mockToken);
    }
  };

  // Social Login Mock Handler
  const handleSocialAuth = (providerName) => {
    setError('');
    setIsLoading(true);
    const mockEmail = providerName === 'Google' ? 'analyst@smartforecast.ai' : 'devops@smartforecast.ai';
    const mockName = providerName === 'Google' ? 'Google Workspace Analyst' : 'GitHub Cloud Engineer';

    setTimeout(() => {
      const mockToken = `sso_${providerName.toLowerCase()}_token_` + Date.now();
      const userData = { email: mockEmail, name: mockName, provider: providerName };
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(userData));
      if (setUser) setUser(userData);
      setToken(mockToken);
    }, 600);
  };

  // 2FA Code Input Handler
  const handle2FAChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newArr = [...twoFACode];
    newArr[index] = value;
    setTwoFACode(newArr);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`2fa-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handle2FASubmit = () => {
    const fullCode = twoFACode.join('');
    if (fullCode.length === 6) {
      setShow2FAModal(false);
      applyPreset(DEMO_PRESETS[0]);
    } else {
      setError('Please enter all 6 digits of your authenticator code.');
    }
  };

  // SSO Verification Flow
  const handleSSOVerify = (e) => {
    e.preventDefault();
    if (!ssoDomain || !ssoDomain.includes('.')) {
      setSsoStatus('error');
      return;
    }
    setSsoStatus('verifying');
    setTimeout(() => {
      setSsoStatus('redirecting');
      setTimeout(() => {
        setShowSSOModal(false);
        const ssoUser = { email: `user@${ssoDomain}`, name: `${ssoDomain.split('.')[0].toUpperCase()} Enterprise User` };
        const mockToken = 'sso_saml_okta_token_' + Date.now();
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(ssoUser));
        if (setUser) setUser(ssoUser);
        setToken(mockToken);
      }, 700);
    }, 1000);
  };

  // Autocomplete email domain quick chips
  const domainSuggestions = ['@smartforecast.ai', '@company.com', '@gmail.com', '@outlook.com'];
  const handleDomainAppend = (dom) => {
    const prefix = email.includes('@') ? email.split('@')[0] : email;
    setEmail(`${prefix}${dom}`);
  };

  const currentDataset = SHOWCASE_DATASETS[activeDatasetKey];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Background Ambience Mesh & Grids */}
      <div className="fixed inset-0 forecasting-radial-mesh pointer-events-none z-0" />
      <div className="fixed inset-0 forecasting-grid-pattern opacity-40 pointer-events-none z-0" />
      
      {/* Dynamic Glowing Aurora Orbs */}
      <div className="fixed -top-32 -left-32 w-[550px] h-[550px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-slow z-0" />
      <div className="fixed -bottom-32 -right-32 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[150px] pointer-events-none animate-pulse-slow z-0" />
      <div className="fixed top-1/2 left-1/3 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Top Enterprise Navigation Header */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between border-b border-slate-800/60 backdrop-blur-md">
        
        {/* Brand Logo & Version */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-cyan-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-extrabold tracking-tight text-white">SmartForecast</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                AI 2.5 Pro
              </span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline-block">Time-Series Machine Intelligence</span>
          </div>
        </div>

        {/* Status Pill & Header Links */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-full text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">System:</span>
            <span className="text-emerald-400 font-medium">Operational (99.98% SLA)</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 text-[11px]">18ms Latency</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowSecurityModal(true)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-slate-700 transition-all flex items-center space-x-1.5"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Trust & Security</span>
            </button>
            <button
              type="button"
              onClick={() => setShowSSOModal(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <Building2 className="h-3.5 w-3.5 text-indigo-400" />
              <span>Enterprise SSO</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Center Area: Dual Column Enterprise Grid */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT COLUMN: Real-Time Intelligence Showcase & Live Visualizer */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Hero Copy */}
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-indigo-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-4 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin-slow" />
                <span>Next-Gen Multi-Algorithm Predictive Engine</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                Anticipate the Future with <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">
                  Precision Machine Forecasting
                </span>
              </h1>

              <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Benchmark ARIMA, Meta Prophet, and Holt-Winters time-series models with automated 
                Gemini LLM executive insights and 95% confidence variance bands.
              </p>
            </div>

            {/* Interactive Live Forecasting Chart Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              
              {/* Card Header with Dataset Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-cyan-400 animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Live Model Simulation
                  </span>
                </div>

                {/* Dataset Switcher Tabs */}
                <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {Object.keys(SHOWCASE_DATASETS).map((key) => {
                    const data = SHOWCASE_DATASETS[key];
                    const isActive = activeDatasetKey === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveDatasetKey(key)}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                          isActive 
                            ? 'bg-blue-600 text-white shadow-sm' 
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {data.title.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Metric Highlights Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">Current Actual</span>
                  <span className="text-sm font-extrabold text-white">{currentDataset.current}</span>
                </div>
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">Forecast Horizon</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-extrabold text-cyan-400">{currentDataset.forecast}</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded">{currentDataset.change}</span>
                  </div>
                </div>
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">Accuracy (MAPE)</span>
                  <span className="text-sm font-extrabold text-indigo-400">{currentDataset.accuracy} <span className="text-[10px] text-slate-500">({currentDataset.mape})</span></span>
                </div>
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">AI Reasoner</span>
                  <span className="text-sm font-extrabold text-emerald-400 flex items-center">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Gemini 2.5
                  </span>
                </div>
              </div>

              {/* Dynamic SVG Interactive Time-Series Fan Graph */}
              <div className="h-40 w-full relative bg-slate-950/60 rounded-2xl border border-slate-800/60 p-2 overflow-hidden">
                <svg 
                  viewBox="0 0 360 120" 
                  className="w-full h-full overflow-visible"
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <defs>
                    {/* Forecast Area Gradient */}
                    <linearGradient id="liveForecastFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                    {/* Confidence Fan Gradient */}
                    <linearGradient id="liveConfidenceFan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="0" y1="25" x2="360" y2="25" stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.4" />
                  <line x1="0" y1="60" x2="360" y2="60" stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.4" />
                  <line x1="0" y1="95" x2="360" y2="95" stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.4" />

                  {/* Vertical Forecast Origin Boundary */}
                  <line x1="180" y1="5" x2="180" y2="115" stroke="#06b6d4" strokeDasharray="2 2" strokeWidth="1.5" />
                  <text x="184" y="16" fill="#06b6d4" fontSize="8" fontWeight="700" letterSpacing="0.5">FORECAST HORIZON</text>

                  {/* 95% Confidence Fan Interval Polygon */}
                  <polygon 
                    points={`180,${currentDataset.points[4].y} 225,${currentDataset.points[5].high} 270,${currentDataset.points[6].high} 315,${currentDataset.points[7].high} 360,${currentDataset.points[8].high} 360,${currentDataset.points[8].low} 315,${currentDataset.points[7].low} 270,${currentDataset.points[6].low} 225,${currentDataset.points[5].low} 180,${currentDataset.points[4].y}`} 
                    fill="url(#liveConfidenceFan)" 
                  />

                  {/* Historical Shaded Area */}
                  <path 
                    d={`M 0 ${currentDataset.points[0].y} Q 45 ${currentDataset.points[1].y}, 90 ${currentDataset.points[2].y} T 180 ${currentDataset.points[4].y} L 180 115 L 0 115 Z`} 
                    fill="url(#liveForecastFill)" 
                  />

                  {/* Historical Solid Curve Line */}
                  <path 
                    d={`M 0 ${currentDataset.points[0].y} Q 45 ${currentDataset.points[1].y}, 90 ${currentDataset.points[2].y} T 180 ${currentDataset.points[4].y}`} 
                    fill="none" 
                    stroke="#38bdf8" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                  />

                  {/* Predicted Horizon Dashed Curve */}
                  <path 
                    d={`M 180 ${currentDataset.points[4].y} Q 225 ${currentDataset.points[5].y}, 270 ${currentDataset.points[6].y} T 360 ${currentDataset.points[8].y}`} 
                    fill="none" 
                    stroke="#818cf8" 
                    strokeWidth="3" 
                    strokeDasharray="5 3" 
                    strokeLinecap="round" 
                  />

                  {/* Interactive Point Nodes */}
                  {currentDataset.points.map((pt, idx) => (
                    <g 
                      key={idx}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(pt)}
                    >
                      <circle 
                        cx={pt.x} 
                        cy={pt.y} 
                        r={pt.x === 180 ? "5" : "3.5"} 
                        fill={pt.isForecast ? "#818cf8" : (pt.x === 180 ? "#06b6d4" : "#38bdf8")} 
                        className={pt.x === 180 ? "animate-pulse" : "transition-transform hover:scale-150"}
                      />
                      {pt.x === 180 && (
                        <circle cx={pt.x} cy={pt.y} r="8" fill="none" stroke="#06b6d4" strokeWidth="1" className="animate-ping opacity-75" />
                      )}
                    </g>
                  ))}
                </svg>

                {/* Interactive Point Inspection Tooltip */}
                {hoveredPoint && (
                  <div 
                    className="absolute top-2 right-2 bg-slate-900/95 border border-cyan-500/40 text-xs px-2.5 py-1.5 rounded-lg shadow-xl pointer-events-none backdrop-blur-md animate-fadeIn flex items-center space-x-2"
                  >
                    <span className="text-slate-400">{hoveredPoint.label}:</span>
                    <span className="font-bold text-cyan-400">
                      {hoveredPoint.isForecast ? 'Predicted Metric' : 'Actual Historic'}
                    </span>
                    {hoveredPoint.high && (
                      <span className="text-[10px] text-indigo-300">
                        (95% CI: [{hoveredPoint.high} - {hoveredPoint.low}])
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Model Tag Filter Selector */}
              <div className="flex flex-wrap items-center justify-between mt-3 pt-3 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400 text-[11px]">Ensemble Active Models:</span>
                <div className="flex items-center space-x-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-medium">
                    Prophet (Seasonality)
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-medium">
                    ARIMA (Stationary)
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-medium">
                    Holt-Winters (Trend)
                  </span>
                </div>
              </div>
            </div>

            {/* Enterprise Client Social Proof & Testimonial */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Trusted by 1,400+ Enterprise Data Science Teams
                </span>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center">
                  <Check className="h-3 w-3 mr-0.5" /> SOC 2 Type II Certified
                </span>
              </div>

              {/* Minimalist Corporate Logos */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold text-slate-500 py-1">
                <div className="bg-slate-950/60 py-1.5 rounded-lg border border-slate-800/50 hover:text-slate-300 transition-colors">
                  NOVACORP
                </div>
                <div className="bg-slate-950/60 py-1.5 rounded-lg border border-slate-800/50 hover:text-slate-300 transition-colors">
                  QUANTIX.AI
                </div>
                <div className="bg-slate-950/60 py-1.5 rounded-lg border border-slate-800/50 hover:text-slate-300 transition-colors">
                  APEX GLOBAL
                </div>
                <div className="bg-slate-950/60 py-1.5 rounded-lg border border-slate-800/50 hover:text-slate-300 transition-colors">
                  FINSCALE
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-start space-x-3">
                <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
                  ER
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "SmartForecast AI reduced our monthly demand prediction error from 14% to 1.8% in our first production deployment."
                  <span className="block not-italic text-[11px] text-slate-400 font-medium mt-0.5">
                    — Elena Rostova, VP of Global Supply Analytics @ Novacorp
                  </span>
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Realistic Enterprise Authentication Portal */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            
            <div className="bg-slate-900/95 border border-slate-800/90 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-2xl relative glow-indigo">
              
              {/* Corner Live Status Indicator */}
              <div className="absolute top-4 right-4 flex items-center space-x-1.5 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800 text-[10px] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>TLS 1.3 256-bit</span>
              </div>

              {/* Portal Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {isRegister ? 'Create Enterprise Account' : 'Sign in to SmartForecast'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isRegister 
                    ? 'Start ensembling time-series models with automated Gemini reasoning.' 
                    : 'Access your predictive forecasting dashboards and live datasets.'}
                </p>
              </div>

              {/* Segmented Sign In / Register Tabs */}
              <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-xl mb-5">
                <button
                  type="button"
                  onClick={() => { setIsRegister(false); setError(''); setAuthSuccessNotice(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
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
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    isRegister 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Social / OAuth SSO Login Buttons */}
              <div className="space-y-2 mb-5">
                <div className="grid grid-cols-2 gap-2.5">
                  
                  {/* Google OAuth Button */}
                  <button
                    type="button"
                    onClick={() => handleSocialAuth('Google')}
                    disabled={isLoading}
                    className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold transition-all hover:shadow-md disabled:opacity-50"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Google</span>
                  </button>

                  {/* GitHub OAuth Button */}
                  <button
                    type="button"
                    onClick={() => handleSocialAuth('GitHub')}
                    disabled={isLoading}
                    className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold transition-all hover:shadow-md disabled:opacity-50"
                  >
                    <svg className="h-4 w-4 fill-current text-white" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span>GitHub</span>
                  </button>

                </div>

                {/* SAML SSO Direct Link */}
                <button
                  type="button"
                  onClick={() => setShowSSOModal(true)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all flex items-center justify-center space-x-2"
                >
                  <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Single Sign-On (SAML / Okta / Azure AD)</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex py-2 items-center mb-4">
                <div className="flex-grow border-t border-slate-800" />
                <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  or continue with email
                </span>
                <div className="flex-grow border-t border-slate-800" />
              </div>

              {/* Feedback Alerts */}
              {error && (
                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-start space-x-2 animate-fadeIn">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-rose-400" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              {authSuccessNotice && (
                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-start space-x-2 animate-fadeIn">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                  <span className="leading-relaxed">{authSuccessNotice}</span>
                </div>
              )}

              {/* Main Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name Input (Register Mode) */}
                {isRegister && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sarah Chen"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 block w-full rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Email Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-300">Enterprise Email</label>
                    {email && email.includes('@') && (
                      <span className="text-[10px] text-emerald-400 flex items-center font-medium">
                        <Check className="h-3 w-3 mr-0.5" /> Valid Format
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 block w-full rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Domain Auto-Suggestions Chips */}
                  {email && !email.includes('@') && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {domainSuggestions.map((dom) => (
                        <button
                          key={dom}
                          type="button"
                          onClick={() => handleDomainAppend(dom)}
                          className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 hover:border-slate-700 text-[10px] text-slate-400 hover:text-cyan-300 transition-colors"
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
                    <label className="block text-xs font-semibold text-slate-300">Password</label>
                    {!isRegister && (
                      <button 
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
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
                      className="pl-10 pr-10 block w-full rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Caps Lock Alert Banner */}
                  {capsLockActive && (
                    <div className="mt-1.5 text-[11px] text-amber-400 flex items-center space-x-1 animate-fadeIn">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>Caps Lock is active</span>
                    </div>
                  )}

                  {/* Password Strength Indicator (in Registration Mode) */}
                  {isRegister && password && (
                    <div className="mt-2.5 space-y-1.5 animate-fadeIn">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Security Strength:</span>
                        <span className="font-semibold text-slate-200">{pwdStrength.text}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${pwdStrength.score >= 1 ? pwdStrength.color : 'bg-slate-800'}`} />
                        <div className={`h-full rounded-full transition-all ${pwdStrength.score >= 2 ? pwdStrength.color : 'bg-slate-800'}`} />
                        <div className={`h-full rounded-full transition-all ${pwdStrength.score >= 3 ? pwdStrength.color : 'bg-slate-800'}`} />
                        <div className={`h-full rounded-full transition-all ${pwdStrength.score >= 4 ? pwdStrength.color : 'bg-slate-800'}`} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Remember Me / Terms Checkboxes */}
                {!isRegister ? (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center space-x-2 text-slate-400 hover:text-slate-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                      />
                      <span>Remember this device (30 days)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShow2FAModal(true)}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1"
                    >
                      <Key className="h-3 w-3 text-cyan-400" />
                      <span>Use 2FA Key</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-xs pt-1">
                    <label className="flex items-start space-x-2 text-slate-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        required
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 mt-0.5"
                      />
                      <span className="leading-snug text-[11px]">
                        I agree to the{' '}
                        <button 
                          type="button" 
                          onClick={() => setShowTermsModal(true)} 
                          className="text-cyan-400 hover:underline"
                        >
                          Terms of Service
                        </button>{' '}
                        and{' '}
                        <button 
                          type="button" 
                          onClick={() => setShowTermsModal(true)} 
                          className="text-cyan-400 hover:underline"
                        >
                          Privacy Policy
                        </button>.
                      </span>
                    </label>
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-3 flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating Identity...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>{isRegister ? 'Create Account & Launch' : 'Sign in to Workspace'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </button>
              </form>

              {/* Instant Enterprise Role Presets Switcher */}
              <div className="mt-6 pt-5 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400 mr-1.5" />
                    One-Click Demo Profiles
                  </span>
                  <span className="text-[10px] text-slate-500">Auto-fills credentials</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {DEMO_PRESETS.map((preset, idx) => {
                    const IconComp = preset.icon;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applyPreset(preset)}
                        className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 text-left transition-all group flex items-start space-x-2"
                      >
                        <div className={`p-1.5 rounded-lg bg-gradient-to-tr ${preset.color} text-white flex-shrink-0 mt-0.5`}>
                          <IconComp className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] font-bold text-slate-200 group-hover:text-white truncate">
                              {preset.role}
                            </p>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">{preset.name}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* Enterprise Security & Compliance Bottom Banner */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <span>© {new Date().getFullYear()} SmartForecast AI Inc. All rights reserved.</span>
          <span className="hidden sm:inline text-slate-700">•</span>
          <button 
            type="button" 
            onClick={() => setShowSecurityModal(true)} 
            className="hover:text-slate-300 transition-colors"
          >
            ISO 27001 & SOC-2 Compliance
          </button>
          <span className="hidden sm:inline text-slate-700">•</span>
          <button 
            type="button" 
            onClick={() => setShowTermsModal(true)} 
            className="hover:text-slate-300 transition-colors"
          >
            Privacy & Terms
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px]">
            <Server className="h-3 w-3 text-cyan-400" />
            <span>Region: US-East-1 (Primary)</span>
          </div>
        </div>
      </footer>

      {/* MODAL 1: Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => { setShowForgotModal(false); setForgotSubmitted(false); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-950"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-4">
              <Key className="h-5 w-5" />
            </div>

            <h3 className="text-xl font-bold text-white mb-1">Reset Password</h3>
            <p className="text-xs text-slate-400 mb-5">
              Enter your corporate email and we will dispatch a secure 15-minute recovery token.
            </p>

            {forgotSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs space-y-2">
                <div className="flex items-center space-x-2 font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Password Reset Dispatched!</span>
                </div>
                <p className="text-slate-300">
                  We've sent a magic reset link to <strong className="text-white">{forgotEmail || 'your email'}</strong>. Check your inbox or spam folder.
                </p>
                <button
                  type="button"
                  onClick={() => { setShowForgotModal(false); setForgotSubmitted(false); }}
                  className="w-full mt-3 py-2 bg-emerald-600 text-white font-semibold rounded-xl text-xs"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setForgotSubmitted(true); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="block w-full rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-blue-600/30"
                >
                  Send Reset Instructions
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Single Sign-On (SSO / SAML) Modal */}
      {showSSOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => { setShowSSOModal(false); setSsoStatus(''); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-950"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-4">
              <Building2 className="h-5 w-5" />
            </div>

            <h3 className="text-xl font-bold text-white mb-1">Enterprise SSO (SAML 2.0 / Okta)</h3>
            <p className="text-xs text-slate-400 mb-5">
              Enter your enterprise organization domain to authenticate via your identity provider.
            </p>

            <form onSubmit={handleSSOVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate Domain</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Globe className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. acmecorp.com"
                    value={ssoDomain}
                    onChange={(e) => setSsoDomain(e.target.value)}
                    className="pl-10 block w-full rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {ssoStatus === 'verifying' && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-xs text-blue-300 flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-blue-400" />
                  <span>Looking up SAML Identity Provider configuration for {ssoDomain}...</span>
                </div>
              )}

              {ssoStatus === 'redirecting' && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Identity Provider connected! Redirecting to dashboard...</span>
                </div>
              )}

              {ssoStatus === 'error' && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400">
                  Please provide a valid company domain (e.g. acmecorp.com).
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Supports Okta, Azure AD, PingIdentity</span>
                <span className="text-indigo-400 font-semibold">SAML 2.0</span>
              </div>

              <button
                type="submit"
                disabled={ssoStatus === 'verifying' || ssoStatus === 'redirecting'}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50"
              >
                Authenticate with SSO Domain
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: 2-Factor Authentication (2FA) Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-center">
            <button
              type="button"
              onClick={() => setShow2FAModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-950"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto h-12 w-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-4">
              <Fingerprint className="h-6 w-6" />
            </div>

            <h3 className="text-xl font-bold text-white mb-1">Two-Factor Authentication</h3>
            <p className="text-xs text-slate-400 mb-6">
              Enter the 6-digit verification code from your Google Authenticator or 1Password app.
            </p>

            {/* 6-Digit OTP Input Row */}
            <div className="flex justify-center gap-2 mb-6">
              {twoFACode.map((digit, idx) => (
                <input
                  key={idx}
                  id={`2fa-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handle2FAChange(idx, e.target.value)}
                  className="w-11 h-12 text-center text-lg font-extrabold text-cyan-400 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 mb-6 px-2">
              <span>Expires in: <strong className="text-cyan-400">{twoFATimer}s</strong></span>
              <button 
                type="button" 
                onClick={() => { setTwoFATimer(45); setTwoFACode(['7','4','9','1','2','8']); }}
                className="text-cyan-400 hover:underline"
              >
                Auto-fill Sample Code
              </button>
            </div>

            <button
              type="button"
              onClick={handle2FASubmit}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-cyan-500/20"
            >
              Verify Code & Access Workspace
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4: Security & Compliance Center Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowSecurityModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-950"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <h3 className="text-xl font-bold text-white mb-1">Security & Compliance Center</h3>
            <p className="text-xs text-slate-400 mb-5">
              SmartForecast AI operates with enterprise-grade protection and regulatory compliance standards.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3">
                <Shield className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-200">SOC 2 Type II Certified</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">Annual independent audit verification of security, availability, and confidentiality controls.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3">
                <Lock className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-200">AES-256 & TLS 1.3 Encryption</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">Data is encrypted both in-transit and at-rest with automated zero-knowledge key rotation.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3">
                <Globe className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-200">GDPR & CCPA Compliant</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">Full customer data sovereignty with instant data export and deletion endpoints.</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSecurityModal(false)}
              className="w-full mt-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-all"
            >
              Close Compliance Overview
            </button>
          </div>
        </div>
      )}

      {/* MODAL 5: Terms & Privacy Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[85vh] flex flex-col">
            <button
              type="button"
              onClick={() => setShowTermsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-950"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-2">Terms of Service & Privacy</h3>
            
            <div className="overflow-y-auto space-y-3 text-xs text-slate-300 pr-2 my-4">
              <p>
                <strong>1. Data Processing Agreement:</strong> SmartForecast AI processes uploaded time-series CSV/Excel metrics solely to generate predictive statistical models (ARIMA, Prophet, Holt-Winters) and Gemini AI contextual executive summaries.
              </p>
              <p>
                <strong>2. Privacy Guarantee:</strong> Customer forecast data is never used to train public foundational AI models. All temporary data frames are isolated per session.
              </p>
              <p>
                <strong>3. SLA:</strong> Enterprise accounts receive guaranteed 99.98% uptime availability and automated failover clustering.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowTermsModal(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
