import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowRight, 
  Activity, 
  BrainCircuit, 
  BarChart3, 
  ShieldCheck,
  Zap,
  LineChart,
  Globe,
  CheckCircle2,
  Sparkles,
  Layers,
  FileText,
  Clock,
  Cpu,
  ChevronDown,
  ChevronUp,
  Download,
  Lock,
  Database,
  ArrowUpRight,
  HelpCircle
} from 'lucide-react';

// Datasets for the Interactive Live Demo Widget on the Landing Page
const LANDING_DATASETS = {
  revenue: {
    title: 'Enterprise ARR Revenue',
    unit: '$M USD',
    current: '$4.82M',
    forecast: '$6.45M',
    growth: '+33.8%',
    accuracy: '99.4%',
    mape: '1.4%',
    aiNote: 'Prophet ensembling detected a 34% cyclic surge in Q3-Q4. Gemini advises expanding cloud capacity by 15% to maintain SLA.',
    points: [
      { label: 'Q1', y: 88 },
      { label: 'Q2', y: 76 },
      { label: 'Q3', y: 82 },
      { label: 'Q4', y: 64 },
      { label: 'Now', y: 55 },
      { label: 'Q1(P)', y: 44, isForecast: true, high: 36, low: 52 },
      { label: 'Q2(P)', y: 32, isForecast: true, high: 22, low: 44 },
      { label: 'Q3(P)', y: 22, isForecast: true, high: 10, low: 36 },
      { label: 'Q4(P)', y: 14, isForecast: true, high: 4, low: 30 }
    ]
  },
  supply: {
    title: 'Supply Chain Units',
    unit: 'k Units',
    current: '142.5k',
    forecast: '198.0k',
    growth: '+38.9%',
    accuracy: '98.9%',
    mape: '2.1%',
    aiNote: 'ARIMA stationary lag analysis forecasts peak demand in August. Buffer stock should be raised 12% by late June.',
    points: [
      { label: 'Jan', y: 92 },
      { label: 'Feb', y: 84 },
      { label: 'Mar', y: 70 },
      { label: 'Apr', y: 75 },
      { label: 'May', y: 60 },
      { label: 'Jun(P)', y: 48, isForecast: true, high: 40, low: 58 },
      { label: 'Jul(P)', y: 38, isForecast: true, high: 28, low: 50 },
      { label: 'Aug(P)', y: 26, isForecast: true, high: 14, low: 40 },
      { label: 'Sep(P)', y: 18, isForecast: true, high: 6, low: 32 }
    ]
  },
  compute: {
    title: 'Cluster Compute Load',
    unit: 'PFLOPS',
    current: '84.2 PF',
    forecast: '124.6 PF',
    growth: '+47.9%',
    accuracy: '99.7%',
    mape: '0.9%',
    aiNote: 'Holt-Winters triple exponential model projects non-linear growth. Recommending proactive node provisioning.',
    points: [
      { label: 'W1', y: 95 },
      { label: 'W2', y: 88 },
      { label: 'W3', y: 80 },
      { label: 'W4', y: 72 },
      { label: 'W5', y: 62 },
      { label: 'W6(P)', y: 50, isForecast: true, high: 42, low: 59 },
      { label: 'W7(P)', y: 36, isForecast: true, high: 26, low: 48 },
      { label: 'W8(P)', y: 24, isForecast: true, high: 12, low: 38 },
      { label: 'W9(P)', y: 12, isForecast: true, high: 2, low: 28 }
    ]
  }
};

const FAQ_ITEMS = [
  {
    q: 'What file formats and date structures are supported?',
    a: 'SmartForecast AI natively ingests CSV and Excel files (.csv, .xlsx). The platform auto-detects date columns (ISO 8601, YYYY-MM-DD, DD/MM/YYYY, etc.) and numerical target variables with automatic gap filling and anomaly detection.'
  },
  {
    q: 'How does the multi-model ensembling benchmark work?',
    a: 'When you upload time-series data, our pipeline fits Meta Prophet, Auto-ARIMA, Holt-Winters, and Moving Average models simultaneously. It calculates backtested MAE, RMSE, and MAPE metrics to dynamically identify the best performing model.'
  },
  {
    q: 'Is my proprietary financial and customer data safe?',
    a: 'Yes. All data processing occurs in isolated runtime containers with zero retention for public AI training. We adhere strictly to SOC 2 Type II, ISO 27001, and GDPR compliance standards with 256-bit AES encryption at-rest and in-transit.'
  },
  {
    q: 'How does Gemini AI reasoning enhance numerical forecasts?',
    a: 'Gemini 2.5 Pro analyzes the computed numerical trend vectors, seasonality spikes, and confidence bands to provide plain-English executive summaries, risk factors, and actionable business recommendations.'
  }
];

export default function Landing({ onLoginClick }) {
  const [activeDataset, setActiveDataset] = useState('revenue');
  const [selectedModel, setSelectedModel] = useState('ensemble');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const dataset = LANDING_DATASETS[activeDataset];

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      
      {/* Background Ambience Mesh & Lights */}
      <div className="fixed inset-0 forecasting-radial-mesh pointer-events-none z-0" />
      <div className="fixed inset-0 forecasting-grid-pattern opacity-35 pointer-events-none z-0" />
      
      {/* Dynamic Glowing Aurora Orbs */}
      <div className="fixed -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[160px] pointer-events-none animate-pulse-slow z-0" />
      <div className="fixed top-1/3 -right-40 w-[550px] h-[550px] bg-cyan-500/15 rounded-full blur-[150px] pointer-events-none animate-pulse-slow z-0" />
      <div className="fixed bottom-10 left-1/4 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* Sticky Glass Navbar */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="h-full w-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-extrabold tracking-tight text-white">SmartForecast</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                AI 2.5 Pro
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-medium text-slate-300">
            <a href="#demo" className="hover:text-cyan-400 transition-colors">Interactive Demo</a>
            <a href="#models" className="hover:text-cyan-400 transition-colors">AI Models</a>
            <a href="#pipeline" className="hover:text-cyan-400 transition-colors">Architecture</a>
            <a href="#benchmarks" className="hover:text-cyan-400 transition-colors">Benchmarks</a>
            <a href="#security" className="hover:text-cyan-400 transition-colors">Enterprise Security</a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onLoginClick}
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-900 transition-all"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={onLoginClick}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-500 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 transition-all flex items-center space-x-1.5"
            >
              <span>Launch App</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24 sm:pb-20 text-center">
        
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin-slow" />
          <span>Next-Generation Predictive Time-Series Intelligence</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
          Predict Future Trends with <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">
            Multi-Model AI Precision
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Simultaneously benchmark Meta Prophet, Auto-ARIMA, and Holt-Winters models on your business data. 
          Enriched with automated Gemini LLM executive reasoning and 95% confidence bounds.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={onLoginClick}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-500 shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 transition-all flex items-center justify-center space-x-2"
          >
            <span>Launch Forecasting Workspace</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <a
            href="#demo"
            className="w-full sm:w-auto px-7 py-4 rounded-2xl text-sm font-bold text-slate-300 bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:text-white transition-all flex items-center justify-center space-x-2 shadow-sm"
          >
            <Activity className="h-4 w-4 text-cyan-400" />
            <span>Try Interactive Demo</span>
          </a>
        </div>

        {/* Trust Badges KPI Ticker */}
        <div className="mt-12 pt-8 border-t border-slate-800/60 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/40">
            <span className="text-xl sm:text-2xl font-extrabold text-white block">99.4%</span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Model Precision Fit</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/40">
            <span className="text-xl sm:text-2xl font-extrabold text-cyan-400 block">&lt; 15ms</span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Inference Latency</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/40">
            <span className="text-xl sm:text-2xl font-extrabold text-indigo-400 block">95% CI</span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Variance Bands</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/40">
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 block">SOC-2</span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Type II Certified</span>
          </div>
        </div>

      </section>

      {/* SECTION: Interactive Live Forecasting Playground */}
      <section id="demo" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
            <Activity className="h-3.5 w-3.5 animate-pulse" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Test the Forecasting Engine in Real-Time
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Switch between datasets and algorithms to inspect historical actuals vs predicted intervals.
          </p>
        </div>

        {/* Interactive Dashboard Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl glow-indigo">
          
          {/* Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {dataset.title}
              </span>
            </div>

            {/* Dataset Selector Tabs */}
            <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveDataset('revenue')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeDataset === 'revenue' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ARR Revenue
              </button>
              <button
                type="button"
                onClick={() => setActiveDataset('supply')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeDataset === 'supply' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Supply Chain
              </button>
              <button
                type="button"
                onClick={() => setActiveDataset('compute')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeDataset === 'compute' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Compute Load
              </button>
            </div>
          </div>

          {/* Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">Current Metric</span>
              <span className="text-base font-extrabold text-white">{dataset.current}</span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">Projected Horizon</span>
              <div className="flex items-center space-x-1.5">
                <span className="text-base font-extrabold text-cyan-400">{dataset.forecast}</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">{dataset.growth}</span>
              </div>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">Accuracy (MAPE)</span>
              <span className="text-base font-extrabold text-indigo-400">{dataset.accuracy} <span className="text-[11px] text-slate-500 font-normal">({dataset.mape})</span></span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">AI Reasoner</span>
              <span className="text-base font-extrabold text-emerald-400 flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-1 text-emerald-400" /> Gemini 2.5
              </span>
            </div>
          </div>

          {/* Interactive SVG Fan Graph */}
          <div className="h-48 sm:h-56 w-full relative bg-slate-950/70 rounded-2xl border border-slate-800 p-3 overflow-hidden">
            <svg 
              viewBox="0 0 360 120" 
              className="w-full h-full overflow-visible"
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <defs>
                <linearGradient id="demoForecastFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="demoFanBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="25" x2="360" y2="25" stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.35" />
              <line x1="0" y1="60" x2="360" y2="60" stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.35" />
              <line x1="0" y1="95" x2="360" y2="95" stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.35" />

              {/* Origin Forecast Line */}
              <line x1="180" y1="5" x2="180" y2="115" stroke="#06b6d4" strokeDasharray="2 2" strokeWidth="1.5" />
              <text x="184" y="16" fill="#06b6d4" fontSize="8" fontWeight="700">PREDICTIVE HORIZON</text>

              {/* Confidence Fan Polygon */}
              <polygon 
                points={`180,${dataset.points[4].y} 225,${dataset.points[5].high} 270,${dataset.points[6].high} 315,${dataset.points[7].high} 360,${dataset.points[8].high} 360,${dataset.points[8].low} 315,${dataset.points[7].low} 270,${dataset.points[6].low} 225,${dataset.points[5].low} 180,${dataset.points[4].y}`} 
                fill="url(#demoFanBand)" 
              />

              {/* Historic Area Fill */}
              <path 
                d={`M 0 ${dataset.points[0].y} Q 45 ${dataset.points[1].y}, 90 ${dataset.points[2].y} T 180 ${dataset.points[4].y} L 180 115 L 0 115 Z`} 
                fill="url(#demoForecastFill)" 
              />

              {/* Historical Curve */}
              <path 
                d={`M 0 ${dataset.points[0].y} Q 45 ${dataset.points[1].y}, 90 ${dataset.points[2].y} T 180 ${dataset.points[4].y}`} 
                fill="none" 
                stroke="#38bdf8" 
                strokeWidth="3" 
                strokeLinecap="round" 
              />

              {/* Predicted Dashed Curve */}
              <path 
                d={`M 180 ${dataset.points[4].y} Q 225 ${dataset.points[5].y}, 270 ${dataset.points[6].y} T 360 ${dataset.points[8].y}`} 
                fill="none" 
                stroke="#818cf8" 
                strokeWidth="3" 
                strokeDasharray="5 3" 
                strokeLinecap="round" 
              />

              {/* Interactive Point Nodes */}
              {dataset.points.map((pt, idx) => {
                const cx = idx * 45;
                return (
                  <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredPoint(pt)}>
                    <circle 
                      cx={cx} 
                      cy={pt.y} 
                      r={cx === 180 ? 5 : 3.5} 
                      fill={pt.isForecast ? "#818cf8" : (cx === 180 ? "#06b6d4" : "#38bdf8")} 
                      className={cx === 180 ? "animate-pulse" : "transition-transform hover:scale-150"}
                    />
                    {cx === 180 && (
                      <circle cx={cx} cy={pt.y} r="8" fill="none" stroke="#06b6d4" strokeWidth="1" className="animate-ping opacity-75" />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip */}
            {hoveredPoint && (
              <div className="absolute top-3 right-3 bg-slate-900/95 border border-cyan-500/40 text-xs px-3 py-1.5 rounded-lg shadow-xl backdrop-blur-md animate-fadeIn flex items-center space-x-2">
                <span className="text-slate-400">{hoveredPoint.label}:</span>
                <span className="font-bold text-cyan-400">
                  {hoveredPoint.isForecast ? 'Forecasted Value' : 'Historical Actual'}
                </span>
                {hoveredPoint.high && (
                  <span className="text-[10px] text-indigo-300">
                    (95% CI: [{hoveredPoint.high} - {hoveredPoint.low}])
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Gemini AI Reasoner Card */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start space-x-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 text-white shadow-md">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-200">Gemini 2.5 AI Reasoning:</span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.2 rounded">Automated Summary</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                "{dataset.aiNote}"
              </p>
            </div>
          </div>

        </div>

      </section>

      {/* SECTION: AI Model Deep-Dives */}
      <section id="models" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/60 scroll-mt-20">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Layers className="h-3.5 w-3.5" />
            <span>Algorithm Arsenal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Battle-Tested Forecasting Models
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            No single algorithm fits every dataset. SmartForecast AI ensembles four complementary engines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Prophet */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all group">
            <div className="h-10 w-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Meta Prophet</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Additive regression model optimized for business metrics with daily, weekly, or yearly seasonality and holiday shifts.
            </p>
            <div className="text-[11px] text-cyan-400 font-semibold flex items-center">
              <span>Best for: Revenue & Demand</span>
            </div>
          </div>

          {/* Card 2: ARIMA */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all group">
            <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <LineChart className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Auto-ARIMA</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Auto-Regressive Integrated Moving Average for capturing auto-correlations and stationary time-series dynamics.
            </p>
            <div className="text-[11px] text-indigo-400 font-semibold flex items-center">
              <span>Best for: Financial Indices</span>
            </div>
          </div>

          {/* Card 3: Holt-Winters */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all group">
            <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Holt-Winters</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Triple exponential smoothing addressing level, trend slope, and multiplicative seasonal adjustments.
            </p>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center">
              <span>Best for: Logistics & Inventory</span>
            </div>
          </div>

          {/* Card 4: Gemini LLM Reasoner */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all group">
            <div className="h-10 w-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Gemini 2.5 Reasoner</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Translates mathematical forecast curves into actionable executive summaries, risk factors, and strategic recommendations.
            </p>
            <div className="text-[11px] text-purple-400 font-semibold flex items-center">
              <span>Best for: Board & C-Suite Briefs</span>
            </div>
          </div>

        </div>

      </section>

      {/* SECTION: Pipeline Visualizer */}
      <section id="pipeline" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/60 scroll-mt-20">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
            <Cpu className="h-3.5 w-3.5" />
            <span>End-to-End Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How SmartForecast AI Works
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            From raw CSV spreadsheets to board-ready predictive PDF briefings in under 10 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 relative">
            <span className="text-2xl font-black text-slate-800 absolute top-4 right-4">01</span>
            <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
              <Database className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Data Ingestion</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload CSV or Excel. Automatic date parsing, frequency alignment, and anomaly cleanup.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 relative">
            <span className="text-2xl font-black text-slate-800 absolute top-4 right-4">02</span>
            <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
              <Activity className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Model Ensembling</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Parallel execution of ARIMA, Prophet, and Holt-Winters with parameter optimization.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 relative">
            <span className="text-2xl font-black text-slate-800 absolute top-4 right-4">03</span>
            <div className="h-8 w-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Gemini AI Reasoning</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates executive commentary, anomaly explanations, and risk mitigation strategies.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 relative">
            <span className="text-2xl font-black text-slate-800 absolute top-4 right-4">04</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <FileText className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Executive Export</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download presentation-grade PDF reports and CSV forecast schedules with 95% confidence bands.
            </p>
          </div>

        </div>

      </section>

      {/* SECTION: Benchmarks Comparison Table */}
      <section id="benchmarks" className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/60 scroll-mt-20">
        
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Algorithm Comparison Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Technical benchmark criteria across all supported predictive engines.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-semibold">
              <tr>
                <th className="p-3.5">Model Engine</th>
                <th className="p-3.5">Seasonality</th>
                <th className="p-3.5">Non-Stationary</th>
                <th className="p-3.5">Latency</th>
                <th className="p-3.5">Confidence Bands</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="p-3.5 font-bold text-cyan-400">Meta Prophet</td>
                <td className="p-3.5 text-emerald-400 font-semibold">Multi-Period (Daily/Weekly/Yearly)</td>
                <td className="p-3.5">Excellent (Changepoint Detection)</td>
                <td className="p-3.5">&lt; 45ms</td>
                <td className="p-3.5 text-emerald-400 font-medium">80% / 95% Bayesian</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-indigo-400">Auto-ARIMA</td>
                <td className="p-3.5">Single Period (SARIMA)</td>
                <td className="p-3.5">Differencing (Order d)</td>
                <td className="p-3.5">&lt; 30ms</td>
                <td className="p-3.5 text-emerald-400 font-medium">Standard Error Intervals</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-blue-400">Holt-Winters</td>
                <td className="p-3.5">Additive / Multiplicative</td>
                <td className="p-3.5">Linear Trend Damping</td>
                <td className="p-3.5">&lt; 10ms</td>
                <td className="p-3.5 text-emerald-400 font-medium">Gaussian Intervals</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-emerald-400">Ensemble Best-Fit</td>
                <td className="p-3.5 text-emerald-400 font-semibold">Auto-Selected</td>
                <td className="p-3.5 text-emerald-400 font-semibold">Dynamic Selection</td>
                <td className="p-3.5">&lt; 60ms</td>
                <td className="p-3.5 text-emerald-400 font-semibold">Consensus Ensembled</td>
              </tr>
            </tbody>
          </table>
        </div>

      </section>

      {/* SECTION: Security & Compliance */}
      <section id="security" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/60 scroll-mt-20">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Enterprise Safeguards</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Security & Data Sovereignty
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Built for mission-critical enterprise workloads with strict compliance standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">SOC 2 Type II Certified</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Annual third-party audit verification of security, availability, and confidentiality controls.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
            <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">256-Bit AES & TLS 1.3</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              End-to-end encryption for all uploaded spreadsheets, model weights, and generated reports.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
            <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Zero AI Training Retention</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Customer data is strictly isolated in memory and never used to train public foundation models.
            </p>
          </div>

        </div>

      </section>

      {/* SECTION: FAQ Accordion */}
      <section id="faq" className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/60 scroll-mt-20">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={index} 
                className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 text-left flex items-center justify-between text-sm font-bold text-slate-200 hover:text-white"
                >
                  <span>{item.q}</span>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-cyan-400 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-slate-500 flex-shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3 animate-fadeIn">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

      {/* SECTION: Bottom Call to Action Banner */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 shadow-2xl text-center glow-indigo">
          <TrendingUp className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Forecast with Precision AI?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-3 max-w-xl mx-auto">
            Experience multi-model Prophet & ARIMA ensembling with automated Gemini LLM executive briefs.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={onLoginClick}
              className="px-8 py-3.5 rounded-2xl text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 shadow-xl transition-all flex items-center space-x-2"
            >
              <span>Launch Free Workspace</span>
              <ArrowRight className="h-4 w-4 text-slate-950" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 border-t border-slate-800/60 bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">SmartForecast AI</span>
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex space-x-6 text-[11px]">
            <a href="#models" className="hover:text-cyan-400 transition-colors">Models</a>
            <a href="#pipeline" className="hover:text-cyan-400 transition-colors">Architecture</a>
            <a href="#benchmarks" className="hover:text-cyan-400 transition-colors">Benchmarks</a>
            <a href="#security" className="hover:text-cyan-400 transition-colors">Security</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
