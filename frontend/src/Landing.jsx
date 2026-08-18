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
  HelpCircle,
  Play,
  Sliders,
  Check,
  Info,
  Calendar,
  AlertTriangle
} from 'lucide-react';

// Live Interactive Datasets for the Sandbox Simulator
const SIMULATOR_DATASETS = {
  revenue: {
    name: 'Enterprise ARR Revenue',
    category: 'Financial Planning',
    unit: '$M ARR',
    historicalBase: [
      { date: 'Jan', val: 3.2 },
      { date: 'Feb', val: 3.4 },
      { date: 'Mar', val: 3.9 },
      { date: 'Apr', val: 4.1 },
      { date: 'May', val: 4.5 },
      { date: 'Jun', val: 4.8 }
    ],
    growthRate: 1.055,
    volatility: 0.12,
    seasonalityPattern: [1.02, 1.05, 0.98, 1.08, 1.12, 1.04],
    models: {
      ensemble: { accuracy: '99.4%', mape: '1.2%', mae: '$0.04M', rmse: '$0.06M', label: 'Consensus Ensemble (Best Fit)' },
      prophet: { accuracy: '99.1%', mape: '1.6%', mae: '$0.06M', rmse: '$0.08M', label: 'Meta Prophet (Seasonal)' },
      arima: { accuracy: '98.5%', mape: '2.2%', mae: '$0.09M', rmse: '$0.12M', label: 'Auto-ARIMA (Auto-Regressive)' },
      holt: { accuracy: '98.8%', mape: '1.9%', mae: '$0.07M', rmse: '$0.10M', label: 'Holt-Winters (Exponential)' }
    },
    geminiInsight: 'Prophet ensembling detected a consistent +5.5% month-over-month expansion with positive Q3 renewal seasonality. Projected ARR crosses $6.2M with low tail-risk variance.',
    recommendedAction: 'Increase cloud tier capacity by 15% in Q3 to maintain SLA guarantees as contract volume expands.'
  },
  supply: {
    name: 'Supply Chain Inventory Units',
    category: 'Logistics & Operations',
    unit: 'k Units',
    historicalBase: [
      { date: 'W1', val: 120 },
      { date: 'W2', val: 128 },
      { date: 'W3', val: 115 },
      { date: 'W4', val: 132 },
      { date: 'W5', val: 140 },
      { date: 'W6', val: 145 }
    ],
    growthRate: 1.042,
    volatility: 0.18,
    seasonalityPattern: [1.08, 0.95, 1.12, 1.02, 1.15, 0.98],
    models: {
      ensemble: { accuracy: '98.9%', mape: '2.1%', mae: '2.8k', rmse: '3.6k', label: 'Consensus Ensemble (Best Fit)' },
      prophet: { accuracy: '98.4%', mape: '2.7%', mae: '3.4k', rmse: '4.2k', label: 'Meta Prophet (Seasonal)' },
      arima: { accuracy: '99.2%', mape: '1.8%', mae: '2.3k', rmse: '3.1k', label: 'Auto-ARIMA (Auto-Regressive)' },
      holt: { accuracy: '98.1%', mape: '3.1%', mae: '4.0k', rmse: '5.1k', label: 'Holt-Winters (Exponential)' }
    },
    geminiInsight: 'Auto-ARIMA identified critical autocorrelation at lag-3. Demand will surge in late summer due to seasonal supplier lead cycles.',
    recommendedAction: 'Lock in warehouse buffer stock 3 weeks ahead of the August peak to avoid stockout penalties.'
  },
  compute: {
    name: 'Cloud GPU Compute Load',
    category: 'Infrastructure & DevOps',
    unit: 'PFLOPS',
    historicalBase: [
      { date: 'T-5', val: 62 },
      { date: 'T-4', val: 68 },
      { date: 'T-3', val: 74 },
      { date: 'T-2', val: 79 },
      { date: 'T-1', val: 86 },
      { date: 'Now', val: 94 }
    ],
    growthRate: 1.078,
    volatility: 0.10,
    seasonalityPattern: [1.04, 1.06, 1.02, 1.09, 1.11, 1.08],
    models: {
      ensemble: { accuracy: '99.7%', mape: '0.8%', mae: '0.6 PF', rmse: '0.9 PF', label: 'Consensus Ensemble (Best Fit)' },
      prophet: { accuracy: '99.3%', mape: '1.2%', mae: '0.9 PF', rmse: '1.3 PF', label: 'Meta Prophet (Seasonal)' },
      arima: { accuracy: '98.9%', mape: '1.7%', mae: '1.4 PF', rmse: '1.9 PF', label: 'Auto-ARIMA (Auto-Regressive)' },
      holt: { accuracy: '99.5%', mape: '1.0%', mae: '0.8 PF', rmse: '1.1 PF', label: 'Holt-Winters (Exponential)' }
    },
    geminiInsight: 'Holt-Winters triple exponential smoothing captured non-linear acceleration in model inference calls. Compute demand is trending 48% higher.',
    recommendedAction: 'Initiate cluster spot reservation autoscaling to optimize cloud cost margins before threshold breach.'
  }
};

const FAQ_ITEMS = [
  {
    q: 'How does SmartForecast AI benchmark multiple models simultaneously?',
    a: 'When you upload or select a time-series dataset, our backend pipeline concurrently fits Meta Prophet, Auto-ARIMA, Holt-Winters Exponential Smoothing, and Moving Average algorithms. It computes Mean Absolute Percentage Error (MAPE), Root Mean Square Error (RMSE), and Mean Absolute Error (MAE) through cross-validation, automatically designating the champion model for your specific data.'
  },
  {
    q: 'What is the role of Gemini 2.5 AI in numerical forecasting?',
    a: 'While mathematical algorithms compute the statistical projection vectors and confidence bounds, Gemini AI analyzes the underlying trend velocity, detected changepoints, volatility, and seasonal spikes to synthesize plain-English executive briefings, highlight operational risks, and recommend concrete management actions.'
  },
  {
    q: 'How are the 95% Bayesian Confidence Intervals calculated?',
    a: 'Confidence intervals represent the statistical boundaries within which the future value is expected to fall with 95% probability. As the forecast horizon extends further into the future, the uncertainty fan naturally expands, giving risk managers visibility into both worst-case and best-case scenarios.'
  },
  {
    q: 'Can I upload my own custom CSV or Excel files?',
    a: 'Yes. SmartForecast AI features an intelligent data parser that auto-detects date columns (e.g. ISO-8601, YYYY-MM-DD, DD/MM/YYYY) and numeric metrics, automatically filling missing gaps and filtering anomalies without requiring complex configuration.'
  },
  {
    q: 'Is our proprietary business and customer data kept private and secure?',
    a: 'Absolutely. All computations take place in isolated, in-memory ephemeral runtime environments. We never retain customer data for public AI training, and all communications are secured with 256-bit AES encryption at rest and TLS 1.3 in transit.'
  }
];

export default function Landing({ onLoginClick, onQuickStart }) {
  const [activeDatasetKey, setActiveDatasetKey] = useState('revenue');
  const [selectedModelKey, setSelectedModelKey] = useState('ensemble');
  const [forecastHorizon, setForecastHorizon] = useState(30); // 7, 30, 90, 180 days
  const [hoveredNode, setHoveredNode] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const currentDataset = SIMULATOR_DATASETS[activeDatasetKey];
  const currentModelStats = currentDataset.models[selectedModelKey];

  // Dynamically compute forecast curve based on horizon and selected model
  const horizonSteps = forecastHorizon <= 14 ? 3 : forecastHorizon <= 60 ? 5 : 7;
  const lastHist = currentDataset.historicalBase[currentDataset.historicalBase.length - 1].val;
  
  const futurePoints = [];
  for (let i = 1; i <= horizonSteps; i++) {
    const periodFraction = (i / horizonSteps) * (forecastHorizon / 30);
    const growthMult = Math.pow(currentDataset.growthRate, periodFraction);
    const seasonIndex = (i - 1) % currentDataset.seasonalityPattern.length;
    const seasonMult = currentDataset.seasonalityPattern[seasonIndex];
    
    // Model specific variance multiplier
    const modelVariance = selectedModelKey === 'arima' ? 1.05 : selectedModelKey === 'holt' ? 0.98 : 1.0;
    const predictedVal = Number((lastHist * growthMult * seasonMult * modelVariance).toFixed(2));
    
    // Confidence Interval fans out with time
    const spreadFraction = 0.04 + (i * 0.025);
    const upper = Number((predictedVal * (1 + spreadFraction)).toFixed(2));
    const lower = Number((predictedVal * (1 - spreadFraction)).toFixed(2));
    
    const label = forecastHorizon <= 14 
      ? `Day +${i * 3}` 
      : forecastHorizon <= 60 
        ? `Month +${i}` 
        : `Qtr +${Math.ceil(i / 2)}`;

    futurePoints.push({
      label,
      val: predictedVal,
      upper,
      lower,
      isForecast: true
    });
  }

  // Combined points for SVG plotting
  const allPoints = [
    ...currentDataset.historicalBase.map(h => ({ ...h, isForecast: false })),
    ...futurePoints
  ];

  // SVG dimensions
  const svgWidth = 520;
  const svgHeight = 160;
  const minVal = Math.min(...allPoints.map(p => p.lower || p.val)) * 0.88;
  const maxVal = Math.max(...allPoints.map(p => p.upper || p.val)) * 1.12;

  const getY = (v) => {
    const clamped = Math.max(minVal, Math.min(maxVal, v));
    return svgHeight - ((clamped - minVal) / (maxVal - minVal)) * (svgHeight - 30) - 15;
  };

  const getX = (idx) => {
    return (idx / (allPoints.length - 1)) * (svgWidth - 40) + 20;
  };

  const originHistIndex = currentDataset.historicalBase.length - 1;
  const originX = getX(originHistIndex);
  const originY = getY(currentDataset.historicalBase[originHistIndex].val);

  // Generate SVG path strings
  const histPath = currentDataset.historicalBase.reduce((acc, pt, idx) => {
    const x = getX(idx);
    const y = getY(pt.val);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const forecastPath = `M ${originX} ${originY} ` + futurePoints.map((pt, idx) => {
    const x = getX(originHistIndex + 1 + idx);
    const y = getY(pt.val);
    return `L ${x} ${y}`;
  }).join(' ');

  // Fan Polygon points
  const fanUpper = futurePoints.map((pt, idx) => `${getX(originHistIndex + 1 + idx)},${getY(pt.upper)}`).join(' ');
  const fanLower = [...futurePoints].reverse().map((pt, idx) => `${getX(allPoints.length - 1 - idx)},${getY(pt.lower)}`).join(' ');
  const fanPolygonPoints = `${originX},${originY} ${fanUpper} ${fanLower} ${originX},${originY}`;

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleStartSandboxInWorkspace = () => {
    if (onQuickStart) {
      onQuickStart();
    } else if (onLoginClick) {
      onLoginClick();
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden w-full max-w-full relative">
      
      {/* Background Ambience Layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 forecasting-radial-mesh" />
        <div className="absolute inset-0 forecasting-grid-pattern opacity-40" />
        <div className="absolute -top-32 -left-32 w-[580px] h-[580px] bg-blue-600/15 rounded-full blur-[160px] animate-pulse-slow" />
        <div className="absolute top-1/3 -right-32 w-[520px] h-[520px] bg-cyan-500/15 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-10 left-1/3 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Sticky Glass Navigation Bar */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#080c14]/85 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="h-full w-full bg-[#080c14] rounded-[11px] flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-white">SmartForecast</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Enterprise AI
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-medium text-slate-300">
            <a href="#simulator" className="hover:text-cyan-400 transition-colors flex items-center space-x-1">
              <span>Live Simulator</span>
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </a>
            <a href="#pillars" className="hover:text-cyan-400 transition-colors">Forecasting Pillars</a>
            <a href="#algorithms" className="hover:text-cyan-400 transition-colors">Model Arsenal</a>
            <a href="#workflow" className="hover:text-cyan-400 transition-colors">How It Works</a>
            <a href="#metrics" className="hover:text-cyan-400 transition-colors">Metrics Guide</a>
            <a href="#security" className="hover:text-cyan-400 transition-colors">Security</a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onLoginClick}
              className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={handleStartSandboxInWorkspace}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-500 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 transition-all flex items-center space-x-1.5 group"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12 sm:pt-20 sm:pb-16 text-center">
        
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-indigo-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Multi-Model Predictive AI & Gemini Executive Intelligence</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.12] max-w-5xl mx-auto">
          Turn Historical Data Into <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
            Predictive Certainty
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Automatically fit, benchmark, and explain <strong className="text-slate-200 font-semibold">Meta Prophet</strong>, <strong className="text-slate-200 font-semibold">Auto-ARIMA</strong>, and <strong className="text-slate-200 font-semibold">Holt-Winters</strong> models in parallel. Enriched with 95% Bayesian confidence intervals and automated Gemini LLM executive briefs.
        </p>

        {/* Primary Action Triggers */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={handleStartSandboxInWorkspace}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-500 shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 transition-all flex items-center justify-center space-x-2 group"
          >
            <span>Launch Free Workspace</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          
          <a
            href="#simulator"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-sm font-bold text-slate-300 bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:text-white transition-all flex items-center justify-center space-x-2 shadow-sm"
          >
            <Activity className="h-4 w-4 text-cyan-400" />
            <span>Try Live Simulator Below</span>
          </a>
        </div>

        {/* Trust Badges KPI Ticker */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3.5 text-center">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/70">
            <span className="text-xl sm:text-2xl font-extrabold text-white block">99.4%</span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Model Precision Fit</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/70">
            <span className="text-xl sm:text-2xl font-extrabold text-cyan-400 block">&lt; 25ms</span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Inference Latency</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/70">
            <span className="text-xl sm:text-2xl font-extrabold text-indigo-400 block">95% CI</span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Bayesian Variance</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/70">
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 block">Zero-Retention</span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">In-Memory Privacy</span>
          </div>
        </div>

      </section>

      {/* SECTION: Interactive Live Forecasting Simulator */}
      <section id="simulator" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 scroll-mt-20">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
            <Activity className="h-3.5 w-3.5 animate-pulse" />
            <span>Interactive Live Sandbox</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Experience Multi-Model Forecasting in Real-Time
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Toggle business datasets, switch algorithms, and drag the forecast horizon slider to see statistical fan curves and Gemini reasoning adapt instantly.
          </p>
        </div>

        {/* Interactive Dashboard Container */}
        <div className="p-5 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl glow-indigo">
          
          {/* Header Controls: Dataset Tabs */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
            
            <div>
              <div className="flex items-center space-x-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {currentDataset.name}
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Category: {currentDataset.category} • Target Metric: {currentDataset.unit}
              </span>
            </div>

            {/* Dataset Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#080c14] p-1.5 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveDatasetKey('revenue')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  activeDatasetKey === 'revenue' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📊 ARR Revenue
              </button>
              <button
                type="button"
                onClick={() => setActiveDatasetKey('supply')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  activeDatasetKey === 'supply' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📦 Supply Chain
              </button>
              <button
                type="button"
                onClick={() => setActiveDatasetKey('compute')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  activeDatasetKey === 'compute' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚡ GPU Compute
              </button>
            </div>

          </div>

          {/* Model Selector & Horizon Slider Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5 p-3.5 rounded-2xl bg-[#080c14]/80 border border-slate-800/80">
            
            {/* Model Selector Buttons */}
            <div className="md:col-span-7 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 flex items-center">
                <Sliders className="h-3 w-3 mr-1 text-cyan-400" />
                Select Algorithmic Engine:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { key: 'ensemble', name: 'Ensemble Best' },
                  { key: 'prophet', name: 'Prophet' },
                  { key: 'arima', name: 'Auto-ARIMA' },
                  { key: 'holt', name: 'Holt-Winters' }
                ].map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setSelectedModelKey(m.key)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                      selectedModelKey === m.key
                        ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Forecast Horizon Slider */}
            <div className="md:col-span-5 flex flex-col justify-center pl-0 md:pl-3 border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0">
              <div className="flex items-center justify-between mb-1 text-xs">
                <span className="text-slate-400 font-medium">Forecast Horizon:</span>
                <span className="font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {forecastHorizon} Days Forward
                </span>
              </div>
              <input 
                type="range"
                min="7"
                max="180"
                step="7"
                value={forecastHorizon}
                onChange={(e) => setForecastHorizon(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>7 Days</span>
                <span>30 Days</span>
                <span>90 Days</span>
                <span>180 Days</span>
              </div>
            </div>

          </div>

          {/* Metric Tiles Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
            <div className="bg-[#080c14] p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">Baseline Value</span>
              <span className="text-base font-extrabold text-white">
                {currentDataset.historicalBase[currentDataset.historicalBase.length - 1].val} {currentDataset.unit}
              </span>
            </div>
            <div className="bg-[#080c14] p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">Horizon Forecast</span>
              <div className="flex items-center space-x-1.5">
                <span className="text-base font-extrabold text-cyan-400">
                  {futurePoints[futurePoints.length - 1].val} {currentDataset.unit}
                </span>
              </div>
            </div>
            <div className="bg-[#080c14] p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">Fit Quality (MAPE)</span>
              <span className="text-base font-extrabold text-indigo-400">
                {currentModelStats.accuracy} <span className="text-[11px] text-slate-500 font-normal">({currentModelStats.mape})</span>
              </span>
            </div>
            <div className="bg-[#080c14] p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">95% Confidence Band</span>
              <span className="text-base font-extrabold text-emerald-400 text-xs truncate">
                ± {((futurePoints[futurePoints.length - 1].upper - futurePoints[futurePoints.length - 1].lower) / 2).toFixed(1)} {currentDataset.unit}
              </span>
            </div>
          </div>

          {/* Dynamic SVG Fan Graph Visualizer */}
          <div className="h-52 sm:h-60 w-full relative bg-[#080c14] rounded-2xl border border-slate-800 p-3 overflow-hidden shadow-inner">
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              className="w-full h-full overflow-visible"
              onMouseLeave={() => setHoveredNode(null)}
            >
              <defs>
                <linearGradient id="forecastFillGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="fanConfidenceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.06" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="20" y1="35" x2={svgWidth - 20} y2="35" stroke="#1e293b" strokeDasharray="3 3" strokeOpacity="0.7" />
              <line x1="20" y1="80" x2={svgWidth - 20} y2="80" stroke="#1e293b" strokeDasharray="3 3" strokeOpacity="0.7" />
              <line x1="20" y1="125" x2={svgWidth - 20} y2="125" stroke="#1e293b" strokeDasharray="3 3" strokeOpacity="0.7" />

              {/* Origin Split Line */}
              <line x1={originX} y1="10" x2={originX} y2={svgHeight - 10} stroke="#06b6d4" strokeDasharray="3 2" strokeWidth="1.5" />
              <text x={originX + 6} y="22" fill="#06b6d4" fontSize="9" fontWeight="700" letterSpacing="0.5">
                FORECAST HORIZON
              </text>

              {/* 95% Confidence Fan Area */}
              <polygon points={fanPolygonPoints} fill="url(#fanConfidenceGrad)" />

              {/* Historical Area */}
              <path 
                d={`${histPath} L ${originX} ${svgHeight - 15} L ${getX(0)} ${svgHeight - 15} Z`} 
                fill="url(#forecastFillGrad)" 
              />

              {/* Historical Solid Line */}
              <path 
                d={histPath} 
                fill="none" 
                stroke="#38bdf8" 
                strokeWidth="2.75" 
                strokeLinecap="round" 
              />

              {/* Predicted Dashed Curve */}
              <path 
                d={forecastPath} 
                fill="none" 
                stroke="#818cf8" 
                strokeWidth="2.75" 
                strokeDasharray="5 3.5" 
                strokeLinecap="round" 
              />

              {/* Interactive Node Circles */}
              {allPoints.map((pt, idx) => {
                const cx = getX(idx);
                const cy = getY(pt.val);
                const isOrigin = idx === originHistIndex;

                return (
                  <g 
                    key={idx} 
                    className="cursor-pointer" 
                    onMouseEnter={() => setHoveredNode({ ...pt, cx, cy })}
                  >
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r={isOrigin ? 5.5 : 4} 
                      fill={pt.isForecast ? "#818cf8" : (isOrigin ? "#06b6d4" : "#38bdf8")} 
                      className={isOrigin ? "animate-pulse" : "transition-transform hover:scale-150"}
                    />
                    {isOrigin && (
                      <circle cx={cx} cy={cy} r="9" fill="none" stroke="#06b6d4" strokeWidth="1.2" className="animate-ping opacity-75" />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredNode && (
              <div 
                className="absolute z-30 bg-slate-950/95 border border-cyan-500/40 text-xs p-2.5 rounded-xl shadow-2xl backdrop-blur-md animate-fadeIn pointer-events-none"
                style={{
                  top: Math.max(10, hoveredNode.cy - 60),
                  left: Math.min(window.innerWidth > 640 ? 340 : 180, Math.max(20, hoveredNode.cx - 70))
                }}
              >
                <div className="flex items-center space-x-1.5 mb-1 font-bold text-white">
                  <span>{hoveredNode.label || hoveredNode.date}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${hoveredNode.isForecast ? 'bg-indigo-500/20 text-indigo-300' : 'bg-cyan-500/20 text-cyan-300'}`}>
                    {hoveredNode.isForecast ? 'Predicted' : 'Historical Actual'}
                  </span>
                </div>
                <div className="text-cyan-400 font-extrabold text-sm">
                  {hoveredNode.val} {currentDataset.unit}
                </div>
                {hoveredNode.upper && (
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    95% CI Range: [{hoveredNode.lower} - {hoveredNode.upper}]
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Gemini AI Reasoner Card */}
          <div className="mt-4 p-4 rounded-2xl bg-[#080c14] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white shadow-md">
                <BrainCircuit className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-200">Gemini 2.5 AI Executive Analysis</span>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.2 rounded">
                    Confidence fit: {currentModelStats.accuracy}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  "{currentDataset.geminiInsight}"
                </p>
                <p className="text-[11px] text-cyan-300/90 mt-1">
                  💡 <strong className="font-semibold text-slate-200">Strategic Recommendation:</strong> {currentDataset.recommendedAction}
                </p>
              </div>
            </div>

            {/* In-Simulator Conversion Trigger */}
            <button
              type="button"
              onClick={handleStartSandboxInWorkspace}
              className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5 w-full sm:w-auto justify-center"
            >
              <span>Run in Full Workspace</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>

      </section>

      {/* SECTION: Time-Series Forecasting Masterclass (Educational Pillars) */}
      <section id="pillars" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80 scroll-mt-20">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Info className="h-3.5 w-3.5" />
            <span>Time-Series Fundamentals</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Time-Series Forecasting Actually Works
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl mx-auto">
            Traditional statistics often fail on modern business metrics. Here is how our multi-model pipeline deconstructs complex temporal dynamics into actionable certainty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Pillar 1: Trend */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all group">
            <div className="h-10 w-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">1. Trend Direction</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identifies the underlying long-term linear or logistic trajectory of your metric, separating genuine growth or decline from temporary daily noise.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-cyan-400 font-semibold">
              Prophet & Holt Slope Modeling
            </div>
          </div>

          {/* Pillar 2: Seasonality */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all group">
            <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">2. Seasonality & Cycles</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Discovers recurring cycles across weeks, months, quarters, and holidays. Accounts for weekend dips and end-of-quarter renewal surges.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-cyan-400 font-semibold">
              Fourier Series Decomposition
            </div>
          </div>

          {/* Pillar 3: Stationarity & Noise */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all group">
            <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">3. Stationarity & Lags</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Applies differencing and autocorrelation analysis to stabilize non-stationary series, eliminating deceptive autocorrelation traps.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-indigo-400 font-semibold">
              Auto-ARIMA (p, d, q) Optimization
            </div>
          </div>

          {/* Pillar 4: Confidence Bands */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all group">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">4. 95% Bayesian Bands</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates expanding uncertainty envelopes for future periods, giving risk executives worst-case and best-case bounds for budgeting.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400 font-semibold">
              Markov Chain Monte Carlo (MCMC)
            </div>
          </div>

        </div>

      </section>

      {/* SECTION: Algorithmic Arsenal */}
      <section id="algorithms" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80 scroll-mt-20">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-3">
            <Layers className="h-3.5 w-3.5" />
            <span>Algorithm Benchmark Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Four Battle-Tested Forecasting Engines
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            No single algorithm wins on every dataset. SmartForecast AI runs an automated model tournament to select the best performer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Prophet */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1.5">Meta Prophet</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Decomposable additive model engineered for business metrics featuring strong multi-period seasonal effects and historical changepoint shifts.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 text-[11px] text-cyan-400 font-semibold">
              Best for: SaaS ARR, Web Traffic, Marketing Leads
            </div>
          </div>

          {/* Card 2: ARIMA */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                <LineChart className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1.5">Auto-ARIMA</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Auto-Regressive Integrated Moving Average utilizing Akaike Information Criterion (AIC) to optimize lag parameters and differencing.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 text-[11px] text-indigo-400 font-semibold">
              Best for: Financial Stocks, Currency & Commodities
            </div>
          </div>

          {/* Card 3: Holt-Winters */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1.5">Holt-Winters</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Triple exponential smoothing that dynamically calculates alpha, beta, and gamma coefficients for baseline level, trend, and seasonal components.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400 font-semibold">
              Best for: Supply Chain, Warehouse SKUs, Inventory
            </div>
          </div>

          {/* Card 4: Moving Average */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1.5">Rolling Average</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                High-speed rolling window baseline for smoothing noisy high-frequency streams and establishing conservative momentum benchmarks.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 text-[11px] text-purple-400 font-semibold">
              Best for: Real-time Telemetry & Micro-trends
            </div>
          </div>

        </div>

      </section>

      {/* SECTION: 4-Step Interactive Workflow Walkthrough */}
      <section id="workflow" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80 scroll-mt-20">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
            <Cpu className="h-3.5 w-3.5" />
            <span>Operational Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            From Raw Spreadsheet to Board Briefing in 4 Steps
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Zero machine learning expertise required. Complete end-to-end intelligence in under 10 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 relative group hover:border-slate-700 transition-all">
            <span className="text-3xl font-black text-slate-800 absolute top-4 right-4 group-hover:text-cyan-500/20 transition-colors">01</span>
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
              <Database className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">1. Ingest Data</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload CSV or click 1-Click Sample Dataset. Automatic date parsing, cadence detection, and null handling.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 relative group hover:border-slate-700 transition-all">
            <span className="text-3xl font-black text-slate-800 absolute top-4 right-4 group-hover:text-cyan-500/20 transition-colors">02</span>
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
              <Activity className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">2. Auto-Benchmarking</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Parallel execution of ARIMA, Prophet, and Holt-Winters. Backtested MAPE, MAE, and RMSE ranking.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 relative group hover:border-slate-700 transition-all">
            <span className="text-3xl font-black text-slate-800 absolute top-4 right-4 group-hover:text-cyan-500/20 transition-colors">03</span>
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">3. Gemini AI Reasoning</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Synthesizes plain-English executive summaries, risk alerts, and concrete operational recommendations.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 relative group hover:border-slate-700 transition-all">
            <span className="text-3xl font-black text-slate-800 absolute top-4 right-4 group-hover:text-cyan-500/20 transition-colors">04</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <FileText className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">4. Executive Export</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download presentation-ready PDF reports and forecast schedule CSVs with 95% confidence bounds.
            </p>
          </div>

        </div>

      </section>

      {/* SECTION: Forecasting Metrics Explainer */}
      <section id="metrics" className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80 scroll-mt-20">
        
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Forecasting Metrics Made Simple
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Understand the statistical evaluation criteria used to rate model accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">MAPE</span>
            <h4 className="text-sm font-bold text-white mb-1">Mean Absolute Percentage Error</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Measures the average percentage deviation between predicted and actual values. A MAPE of 1.4% means forecasts were 98.6% accurate.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">MAE</span>
            <h4 className="text-sm font-bold text-white mb-1">Mean Absolute Error</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates the raw average magnitude of errors in the original units (e.g. $ thousands or physical inventory units) without penalizing outliers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">RMSE</span>
            <h4 className="text-sm font-bold text-white mb-1">Root Mean Square Error</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Heavily penalizes large variance misses by squaring residuals, ensuring models that avoid disastrous extreme misses are favored.
            </p>
          </div>

        </div>

      </section>

      {/* SECTION: Enterprise Security */}
      <section id="security" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80 scroll-mt-20">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Enterprise Safeguards</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Security & Strict Data Sovereignty
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Architected for enterprise security leaders with zero data leakage guarantees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">SOC 2 Type II Compliant</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Rigorous verification of operational availability, confidentiality, and data handling protocols.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
            <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">256-Bit AES & TLS 1.3</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full encryption across spreadsheet uploads, model parameter tensors, and generated PDF reports.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
            <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Zero Public AI Retention</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Customer data is strictly isolated in memory and never used to train public foundation models.
            </p>
          </div>

        </div>

      </section>

      {/* SECTION: FAQ Accordion */}
      <section id="faq" className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80 scroll-mt-20">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Clarifications</span>
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

      {/* High-Converting Bottom CTA Banner */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-blue-950/90 via-slate-900 to-indigo-950/90 border border-blue-500/30 shadow-2xl text-center glow-indigo">
          <TrendingUp className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Forecast with Senior AI Precision?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-3 max-w-xl mx-auto">
            Experience multi-model Prophet & ARIMA ensembling with automated Gemini LLM executive briefs today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleStartSandboxInWorkspace}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 shadow-xl transition-all flex items-center justify-center space-x-2"
            >
              <span>Launch Free Workspace</span>
              <ArrowRight className="h-4 w-4 text-slate-950" />
            </button>
            <button
              type="button"
              onClick={onLoginClick}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-bold text-slate-300 bg-slate-900 border border-slate-700 hover:border-slate-600 hover:text-white transition-all flex items-center justify-center space-x-2"
            >
              <span>Sign In with Credentials</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 border-t border-slate-800/80 bg-[#080c14] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">SmartForecast AI</span>
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex flex-wrap gap-5 text-[11px]">
            <a href="#simulator" className="hover:text-cyan-400 transition-colors">Simulator</a>
            <a href="#pillars" className="hover:text-cyan-400 transition-colors">Pillars</a>
            <a href="#algorithms" className="hover:text-cyan-400 transition-colors">Algorithms</a>
            <a href="#workflow" className="hover:text-cyan-400 transition-colors">Workflow</a>
            <a href="#security" className="hover:text-cyan-400 transition-colors">Security</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
