import React, { useState, useMemo } from 'react';
import LogoF from './components/LogoF';
import { 
  ArrowRight, 
  Activity, 
  BrainCircuit, 
  ShieldCheck, 
  Zap, 
  LineChart, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  ChevronDown, 
  Lock, 
  Database, 
  HelpCircle, 
  Check, 
  Terminal, 
  Copy, 
  FileSpreadsheet
} from 'lucide-react';

const SIMULATOR_DATASETS = {
  revenue: {
    id: 'revenue',
    name: 'Enterprise SaaS ARR',
    category: 'Financial Planning',
    unit: '$M ARR',
    badge: 'Finance',
    historicalBase: [
      { date: 'Jan 24', val: 3.20 },
      { date: 'Feb 24', val: 3.42 },
      { date: 'Mar 24', val: 3.88 },
      { date: 'Apr 24', val: 4.15 },
      { date: 'May 24', val: 4.52 },
      { date: 'Jun 24', val: 4.86 }
    ],
    growthRate: 1.058,
    seasonalityPattern: [1.02, 1.05, 0.99, 1.07, 1.11, 1.04],
    models: {
      ensemble: { 
        accuracy: '99.4%', 
        mape: '1.18%', 
        mae: '$0.042M', 
        rmse: '$0.058M', 
        aic: '312.4',
        label: 'Consensus Ensemble (Best Fit)',
        desc: 'Weighted bayesian ensemble combining Prophet changepoints and ARIMA lag autocorrelation.'
      },
      prophet: { 
        accuracy: '99.1%', 
        mape: '1.54%', 
        mae: '$0.061M', 
        rmse: '$0.079M', 
        aic: '328.1',
        label: 'Meta Prophet (Seasonal + Trend)',
        desc: 'Decomposable additive model with automated holiday effects and piecewise trend changepoints.'
      },
      arima: { 
        accuracy: '98.6%', 
        mape: '2.12%', 
        mae: '$0.089M', 
        rmse: '$0.118M', 
        aic: '344.7',
        label: 'Auto-ARIMA (p,d,q)(P,D,Q)s',
        desc: 'Optimal order selection via Akaike Information Criterion minimization.'
      },
      holt: { 
        accuracy: '98.9%', 
        mape: '1.85%', 
        mae: '$0.072M', 
        rmse: '$0.096M', 
        aic: '335.2',
        label: 'Holt-Winters (Triple Exponential)',
        desc: 'Damped trend smoothing with multiplicative quarterly seasonal cycles.'
      }
    },
    geminiAnalysis: {
      velocity: '5.8% month-over-month compound ARR expansion',
      confidence: 'High (0.94 probability distribution within 95% CI)',
      risks: 'Seasonal dip typical in late Q3 renewal cycles if mid-market pipeline remains unhedged.',
      recommendation: 'Expand compute capacity by 18% in late Q3 to guarantee SLA commitments as enterprise usage hits peak.'
    }
  },
  compute: {
    id: 'compute',
    name: 'Cloud GPU Compute Cluster',
    category: 'DevOps & Infrastructure',
    unit: 'PFLOPS',
    badge: 'Infrastructure',
    historicalBase: [
      { date: '00:00', val: 62.4 },
      { date: '04:00', val: 68.1 },
      { date: '08:00', val: 75.8 },
      { date: '12:00', val: 81.3 },
      { date: '16:00', val: 89.6 },
      { date: '20:00', val: 96.2 }
    ],
    growthRate: 1.074,
    seasonalityPattern: [1.05, 1.08, 1.01, 1.09, 1.12, 1.06],
    models: {
      ensemble: { 
        accuracy: '99.7%', 
        mape: '0.82%', 
        mae: '0.58 PF', 
        rmse: '0.84 PF', 
        aic: '284.2',
        label: 'Consensus Ensemble (Best Fit)',
        desc: 'Hybrid kernel smoothing combining high-frequency telemetry and batch training cycles.'
      },
      prophet: { 
        accuracy: '99.3%', 
        mape: '1.24%', 
        mae: '0.88 PF', 
        rmse: '1.25 PF', 
        aic: '298.5',
        label: 'Meta Prophet (Seasonal + Trend)',
        desc: 'Captures diurnal workload pulses and scheduled batch training cron triggers.'
      },
      arima: { 
        accuracy: '99.0%', 
        mape: '1.62%', 
        mae: '1.34 PF', 
        rmse: '1.82 PF', 
        aic: '310.8',
        label: 'Auto-ARIMA (p,d,q)(P,D,Q)s',
        desc: 'Strong autoregression at lag-4 matching continuous inference pipeline loads.'
      },
      holt: { 
        accuracy: '99.5%', 
        mape: '0.98%', 
        mae: '0.74 PF', 
        rmse: '1.05 PF', 
        aic: '289.6',
        label: 'Holt-Winters (Triple Exponential)',
        desc: 'Fast exponential adaptation to instantaneous workload escalations.'
      }
    },
    geminiAnalysis: {
      velocity: '7.4% rolling shift compute escalation',
      confidence: 'Very High (0.97 Bayesian posterior convergence)',
      risks: 'Potential thermal throttling at peak 124 PFLOPS threshold without autoscaling warm-up.',
      recommendation: 'Pre-provision 32x H100 GPU spot instances 45 minutes prior to next diurnal peak window.'
    }
  },
  supply: {
    id: 'supply',
    name: 'Supply Chain Inventory Units',
    category: 'Supply Chain & Logistics',
    unit: 'k Units',
    badge: 'Logistics',
    historicalBase: [
      { date: 'Wk 1', val: 124.0 },
      { date: 'Wk 2', val: 131.5 },
      { date: 'Wk 3', val: 118.2 },
      { date: 'Wk 4', val: 136.0 },
      { date: 'Wk 5', val: 144.2 },
      { date: 'Wk 6', val: 151.8 }
    ],
    growthRate: 1.046,
    seasonalityPattern: [1.09, 0.94, 1.14, 1.01, 1.16, 0.97],
    models: {
      ensemble: { 
        accuracy: '99.1%', 
        mape: '1.68%', 
        mae: '2.14k', 
        rmse: '2.95k', 
        aic: '348.9',
        label: 'Consensus Ensemble (Best Fit)',
        desc: 'Synthesizes lead-time lag correlations and retailer replenishment cycles.'
      },
      prophet: { 
        accuracy: '98.7%', 
        mape: '2.35%', 
        mae: '3.10k', 
        rmse: '3.98k', 
        aic: '362.4',
        label: 'Meta Prophet (Seasonal + Trend)',
        desc: 'Identifies holiday inventory loading windows and supplier factory shutdowns.'
      },
      arima: { 
        accuracy: '99.3%', 
        mape: '1.45%', 
        mae: '1.92k', 
        rmse: '2.64k', 
        aic: '341.2',
        label: 'Auto-ARIMA (p,d,q)(P,D,Q)s',
        desc: 'Captures strong 3-week order fulfillment autoregressive autocorrelation.'
      },
      holt: { 
        accuracy: '98.2%', 
        mape: '2.84%', 
        mae: '3.75k', 
        rmse: '4.82k', 
        aic: '375.1',
        label: 'Holt-Winters (Triple Exponential)',
        desc: 'Calculates additive trend with seasonal swings across supplier lead times.'
      }
    },
    geminiAnalysis: {
      velocity: '4.6% weekly unit replenishment velocity',
      confidence: 'High (0.91 statistical certainty)',
      risks: 'Inventory buffer tightens below 14-day safety threshold in Week 9.',
      recommendation: 'Lock in sea freight container reservations 3 weeks earlier to mitigate route cost premiums.'
    }
  }
};

const CODE_EXAMPLES = {
  python: `# pip install smartforecast-sdk
import pandas as pd
from smartforecast import Engine

# 1. Initialize client with in-memory runtime
engine = Engine(api_key="sf_prod_99a8b72c")

# 2. Ingest time-series DataFrame
df = pd.read_csv("sales_data.csv", parse_dates=["date"])

# 3. Fit multi-model benchmark concurrently
benchmark = engine.benchmark(
    data=df,
    target_col="value",
    date_col="date",
    models=["prophet", "auto_arima", "holt_winters", "moving_avg"],
    forecast_horizon=30
)

# 4. Extract champion forecast & Gemini AI briefing
champion = benchmark.get_best_model(metric="mape")
forecast_df = champion.predict(horizon=30, confidence_interval=0.95)
reasoning = benchmark.get_gemini_analysis()

print(f"Champion: {champion.name} | MAPE: {champion.mape:.2f}%")
print(f"Gemini Synthesis: {reasoning.summary}")`,

  curl: `# Direct High-Throughput REST API Call
curl -X POST "https://api.smartforecast.ai/v1/forecast/benchmark" \\
  -H "Authorization: Bearer sf_prod_99a8b72c" \\
  -H "Content-Type: application/json" \\
  -d '{
    "dataset_id": "ds_sales_2026",
    "horizon": 30,
    "confidence_level": 0.95,
    "algorithms": ["prophet", "arima", "holt_winters", "moving_avg"],
    "explain_with_gemini": true
  }'`,

  typescript: `// TypeScript / Node.js Engine Client
import { SmartForecastClient } from '@smartforecast/sdk';

const sf = new SmartForecastClient({
  apiKey: process.env.SMARTFORECAST_API_KEY!
});

// Run distributed forecast across 4 model families
const result = await sf.forecast.runBenchmark({
  records: historicalPoints,
  targetKey: 'value',
  timestampKey: 'date',
  horizonSteps: 30,
  includeExecutiveAI: true
});

console.log(\`Best Model: \${result.champion.modelName}\`);
console.log(\`Projected P50: \${result.champion.predictions[29].yhat}\`);`,

  sql: `-- Native Snowflake / BigQuery SQL Interface
SELECT 
    d.date,
    d.value,
    f.predicted_p50,
    f.confidence_lower_95,
    f.confidence_upper_95,
    f.model_family
FROM enterprise_telemetry.sales_daily d
MODEL PREDICT smartforecast_ensemble (
    TARGET d.value,
    HORIZON 30
) OVER (ORDER BY d.date) f;`
};

const FAQ_ITEMS = [
  {
    q: 'How does SmartForecast AI benchmark multiple models simultaneously?',
    a: 'When time-series data is ingested, our worker cluster executes parallel threads for Meta Prophet, Auto-ARIMA, Holt-Winters, and Moving Average algorithms. It computes Mean Absolute Percentage Error (MAPE), Root Mean Square Error (RMSE), and Mean Absolute Error (MAE) via rolling cross-validation folds, automatically surfacing the champion model for your data.'
  },
  {
    q: 'What exact role does Gemini AI play in numerical forecasting?',
    a: 'Classical statistical and ML models compute the numerical vectors, trend gradients, and Bayesian confidence boundaries. Gemini 2.5 analyzes the computed changepoints, volatility clusters, residual distribution, and seasonal anomalies to synthesize plain-English executive briefings, highlight tail risks, and recommend concrete operational decisions.'
  },
  {
    q: 'How are the 95% Bayesian Confidence Intervals calculated?',
    a: 'Confidence intervals represent the statistical boundaries within which future values will fall with 95% certainty. As the forecast horizon extends deeper into the future, the uncertainty fan naturally expands to account for variance accumulation, giving engineering and finance leaders visibility into both worst-case and best-case boundaries.'
  },
  {
    q: 'Can I upload custom CSV time-series data?',
    a: 'Yes. SmartForecast features an intelligent schema parser that automatically detects ISO-8601, Unix epoch, YYYY-MM-DD, or DD/MM/YYYY dates, handles irregular sampling frequencies, and fills missing intervals using linear interpolation before model fitting.'
  },
  {
    q: 'What is your security and data retention architecture?',
    a: 'All forecasting runs execute in isolated, in-memory ephemeral worker containers. Data is never persisted on disk, never shared across tenants, and never used to train public foundation models.'
  }
];

export default function Landing({ onLoginClick }) {
  const [activeDatasetKey, setActiveDatasetKey] = useState('revenue');
  const [selectedModelKey, setSelectedModelKey] = useState('ensemble');
  const [forecastHorizon, setForecastHorizon] = useState(30);
  const [ciSpreadMode, setCiSpreadMode] = useState('95');
  const [activeCodeTab, setActiveCodeTab] = useState('python');
  const [copiedCode, setCopiedCode] = useState(false);
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const currentDataset = SIMULATOR_DATASETS[activeDatasetKey];
  const currentModelStats = currentDataset.models[selectedModelKey];

  const futurePoints = useMemo(() => {
    const horizonSteps = forecastHorizon <= 14 ? 4 : forecastHorizon <= 60 ? 6 : 8;
    const lastHist = currentDataset.historicalBase[currentDataset.historicalBase.length - 1].val;
    const points = [];
    
    for (let i = 1; i <= horizonSteps; i++) {
      const periodFraction = (i / horizonSteps) * (forecastHorizon / 30);
      const growthMult = Math.pow(currentDataset.growthRate, periodFraction);
      const seasonIndex = (i - 1) % currentDataset.seasonalityPattern.length;
      const seasonMult = currentDataset.seasonalityPattern[seasonIndex];
      
      const modelVariance = selectedModelKey === 'arima' ? 1.03 : selectedModelKey === 'holt' ? 0.98 : 1.0;
      const predictedVal = Number((lastHist * growthMult * seasonMult * modelVariance).toFixed(2));
      
      const spreadBase = ciSpreadMode === '95' ? 0.055 : 0.035;
      const spreadFraction = spreadBase + (i * 0.022);
      const upper = Number((predictedVal * (1 + spreadFraction)).toFixed(2));
      const lower = Number((predictedVal * (1 - spreadFraction)).toFixed(2));
      
      const label = forecastHorizon <= 14 
        ? `Day ${i * 2}` 
        : forecastHorizon <= 60 
          ? `Month ${i}` 
          : `Qtr ${Math.ceil(i / 2)}`;

      points.push({
        label,
        val: predictedVal,
        upper,
        lower,
        isForecast: true
      });
    }
    return points;
  }, [currentDataset, selectedModelKey, forecastHorizon, ciSpreadMode]);

  const allPoints = useMemo(() => {
    return [
      ...currentDataset.historicalBase.map(h => ({ ...h, isForecast: false })),
      ...futurePoints
    ];
  }, [currentDataset, futurePoints]);

  const svgWidth = 640;
  const svgHeight = 220;
  const minVal = Math.min(...allPoints.map(p => p.lower || p.val)) * 0.90;
  const maxVal = Math.max(...allPoints.map(p => p.upper || p.val)) * 1.08;

  const getY = (v) => {
    const clamped = Math.max(minVal, Math.min(maxVal, v));
    return svgHeight - ((clamped - minVal) / (maxVal - minVal)) * (svgHeight - 45) - 22;
  };

  const getX = (idx) => {
    return (idx / (allPoints.length - 1)) * (svgWidth - 70) + 35;
  };

  const originHistIndex = currentDataset.historicalBase.length - 1;
  const originX = getX(originHistIndex);
  const originY = getY(currentDataset.historicalBase[originHistIndex].val);

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

  const fanUpper = futurePoints.map((pt, idx) => `${getX(originHistIndex + 1 + idx)},${getY(pt.upper)}`).join(' ');
  const fanLower = [...futurePoints].reverse().map((pt, idx) => `${getX(allPoints.length - 1 - idx)},${getY(pt.lower)}`).join(' ');
  const fanPolygonPoints = `${originX},${originY} ${fanUpper} ${fanLower} ${originX},${originY}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLES[activeCodeTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const activePoint = hoveredPointIndex !== null ? allPoints[hoveredPointIndex] : null;

  return (
    <div className="min-h-screen bg-[#070c18] text-[#f1f5f9] font-sans relative selection:bg-cyan-500 selection:text-[#070c18]">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 ai-grid-pattern opacity-80" />
        <div className="absolute inset-0 ai-radial-glow" />
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#0b1328]/85 border-b border-[#1e3a5f] shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo with stylish 'F' */}
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="h-10 w-10 rounded-xl bg-[#0d1e38] border border-[#1e3a5f] flex items-center justify-center p-1.5 shadow-md shadow-cyan-500/10">
              <LogoF className="h-6 w-6" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white">SmartForecast</span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60">
                AI
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm text-slate-300 font-medium">
            <a href="#sandbox" className="hover:text-cyan-300 transition-colors">Live Preview</a>
            <a href="#features" className="hover:text-cyan-300 transition-colors">Capabilities</a>
            <a href="#benchmark" className="hover:text-cyan-300 transition-colors">Model Matrix</a>
            <a href="#sdk" className="hover:text-cyan-300 transition-colors">Developer SDK</a>
            <a href="#faq" className="hover:text-cyan-300 transition-colors">FAQ</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onLoginClick}
              className="text-sm font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl hover:bg-[#0d1e38] transition-all"
            >
              Sign In
            </button>
            <button
              onClick={onLoginClick}
              className="btn-ai-radiant text-sm px-5 py-2.5 rounded-xl flex items-center space-x-1.5"
            >
              <Lock className="h-4 w-4" />
              <span>Launch Studio</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 sm:pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          {/* Status Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-xs">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Multi-Model AI Forecasting Platform</span>
            <span className="text-slate-600">•</span>
            <span className="font-mono text-white">&lt; 38ms In-Memory Latency</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Modern Time-Series Intelligence &amp; Predictive AI
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Benchmark Meta Prophet, Auto-ARIMA, Holt-Winters, and Moving Average in parallel. Automatically generate uncertainty fans and Gemini AI executive briefings in real time.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onLoginClick}
              className="btn-ai-radiant text-sm sm:text-base px-7 py-3.5 rounded-xl flex items-center space-x-2 shadow-lg"
            >
              <Lock className="h-4 w-4" />
              <span>Sign In to Start Forecasting</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <a
              href="#sandbox"
              className="btn-ai-glass text-sm sm:text-base px-6 py-3.5 rounded-xl flex items-center space-x-2"
            >
              <Activity className="h-4 w-4 text-cyan-400" />
              <span>Interactive Live Preview ↓</span>
            </a>
          </div>

          {/* Production Specs Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-8 max-w-4xl mx-auto text-left">
            <div className="ai-card p-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">Engine</div>
              <div className="text-base font-bold text-white mt-0.5">4 Model Families</div>
              <div className="text-xs text-slate-400 mt-0.5">Prophet • ARIMA • HW • MA</div>
            </div>
            <div className="ai-card p-4">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Accuracy</div>
              <div className="text-base font-bold text-emerald-300 mt-0.5 num-stat">99.4% Fit Score</div>
              <div className="text-xs text-slate-400 mt-0.5">5-Fold Cross Validation</div>
            </div>
            <div className="ai-card p-4">
              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider font-mono">Speed</div>
              <div className="text-base font-bold text-cyan-300 mt-0.5 num-stat">&lt; 38ms Latency</div>
              <div className="text-xs text-slate-400 mt-0.5">Fast In-Memory Runtime</div>
            </div>
            <div className="ai-card p-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">Privacy</div>
              <div className="text-base font-bold text-white mt-0.5">Zero Retention</div>
              <div className="text-xs text-slate-400 mt-0.5">Ephemeral In-Memory Isolation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature: The Interactive Forecasting Studio Simulator */}
      <section id="sandbox" className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="ai-card overflow-hidden shadow-2xl">
          
          {/* Top Control Bar: Dataset Tabs */}
          <div className="bg-[#091122] px-6 py-3.5 border-b border-[#1e3a5f] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2 overflow-x-auto py-1 max-w-full">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline-block font-mono">Dataset:</span>
              {Object.keys(SIMULATOR_DATASETS).map((key) => {
                const ds = SIMULATOR_DATASETS[key];
                const isActive = activeDatasetKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveDatasetKey(key);
                      setHoveredPointIndex(null);
                    }}
                    className={`text-xs sm:text-sm px-3.5 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                      isActive 
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs' 
                        : 'text-slate-300 hover:text-white hover:bg-[#13233f]'
                    }`}
                  >
                    <span>{ds.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                      isActive ? 'bg-slate-900/40 text-slate-950' : 'bg-[#142646] text-cyan-300'
                    }`}>
                      {ds.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={onLoginClick}
              className="text-xs font-semibold text-cyan-300 hover:text-white bg-[#0f2442] hover:bg-[#15345d] border border-cyan-500/40 px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all shadow-xs"
            >
              <Lock className="h-3.5 w-3.5 text-cyan-400" />
              <span>Upload Custom CSV</span>
            </button>
          </div>

          {/* Controls Bar: Model & Horizon Controls */}
          <div className="bg-[#0b1328] px-6 py-3.5 border-b border-[#1e3a5f] flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-xs mr-1 font-mono">Algorithm:</span>
              {[
                { key: 'ensemble', label: 'Auto-Ensemble', tag: 'Best Fit' },
                { key: 'prophet', label: 'Meta Prophet', tag: 'Seasonal' },
                { key: 'arima', label: 'Auto-ARIMA', tag: 'Autoregressive' },
                { key: 'holt', label: 'Holt-Winters', tag: 'Exponential' }
              ].map((m) => {
                const isSelected = selectedModelKey === m.key;
                return (
                  <button
                    key={m.key}
                    onClick={() => setSelectedModelKey(m.key)}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 border text-xs font-semibold ${
                      isSelected
                        ? 'bg-[#0f2d54] text-cyan-300 border-cyan-400 font-bold shadow-xs'
                        : 'bg-[#091122] text-slate-300 border-[#1e3a5f] hover:border-[#2d5284] hover:bg-[#0c1830]'
                    }`}
                  >
                    <span>{m.label}</span>
                    {m.tag === 'Best Fit' && (
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-xs font-mono">Horizon:</span>
                {[7, 30, 90].map((h) => (
                  <button
                    key={h}
                    onClick={() => setForecastHorizon(h)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                      forecastHorizon === h
                        ? 'bg-cyan-500 text-slate-950 shadow-xs'
                        : 'text-slate-300 hover:text-white bg-[#091122]'
                    }`}
                  >
                    {h}D
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Chart Canvas & Real-Time Stats Grid */}
          <div className="p-6 space-y-6">
            
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
              <div className="flex items-center space-x-4 font-semibold">
                <div className="flex items-center space-x-1.5 text-sky-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                  <span>Historical Data</span>
                </div>
                <div className="flex items-center space-x-1.5 text-cyan-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                  <span>Forecast ({selectedModelKey.toUpperCase()})</span>
                </div>
                <div className="flex items-center space-x-1.5 text-cyan-300/70">
                  <span className="h-2.5 w-2.5 rounded bg-cyan-900/60 border border-cyan-500/40" />
                  <span>95% Confidence Fan</span>
                </div>
              </div>

              <div className="text-xs text-slate-300 bg-[#091122] px-3.5 py-1.5 rounded-xl border border-[#1e3a5f] font-medium font-mono">
                {activePoint ? (
                  <span>
                    <strong className="text-white">{activePoint.label || activePoint.date}:</strong>{' '}
                    <span className="text-cyan-400 font-bold ml-1">{activePoint.val} {currentDataset.unit}</span>
                    {activePoint.upper && (
                      <span className="text-slate-400 ml-1.5">
                        [{activePoint.lower} – {activePoint.upper}]
                      </span>
                    )}
                  </span>
                ) : (
                  <span>Hover data points on curve to inspect</span>
                )}
              </div>
            </div>

            {/* SVG Interactive Time-Series Canvas */}
            <div className="relative w-full h-64 sm:h-72 bg-[#080e1b] rounded-xl border border-[#14233c] p-2 overflow-hidden shadow-inner">
              <svg 
                viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="aiDarkHistGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                  </linearGradient>
                  
                  <linearGradient id="aiDarkFanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {[0.25, 0.5, 0.75].map((pct, idx) => {
                  const y = svgHeight * pct;
                  return (
                    <line 
                      key={idx}
                      x1="20" 
                      y1={y} 
                      x2={svgWidth - 20} 
                      y2={y} 
                      stroke="#14233c" 
                      strokeDasharray="4 4" 
                    />
                  );
                })}

                <line 
                  x1={originX} 
                  y1="10" 
                  x2={originX} 
                  y2={svgHeight - 15} 
                  stroke="#1e3a5f" 
                  strokeDasharray="3 3" 
                  strokeWidth="1.5" 
                />
                <text 
                  x={originX + 8} 
                  y="20" 
                  fill="#64748b" 
                  fontSize="10" 
                  fontWeight="700"
                  fontFamily="JetBrains Mono"
                >
                  FORECAST ({forecastHorizon}D) →
                </text>

                <polygon 
                  points={fanPolygonPoints} 
                  fill="url(#aiDarkFanGrad)" 
                  stroke="#22d3ee" 
                  strokeWidth="1" 
                  strokeDasharray="3 3" 
                />

                <path 
                  d={`${histPath} L ${originX} ${svgHeight - 15} L ${getX(0)} ${svgHeight - 15} Z`} 
                  fill="url(#aiDarkHistGrad)" 
                />

                <path 
                  d={histPath} 
                  fill="none" 
                  stroke="#38bdf8" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />

                <path 
                  d={forecastPath} 
                  fill="none" 
                  stroke="#22d3ee" 
                  strokeWidth="2.5" 
                  strokeDasharray="5 4" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />

                {currentDataset.historicalBase.map((pt, idx) => {
                  const x = getX(idx);
                  const y = getY(pt.val);
                  const isHovered = hoveredPointIndex === idx;
                  return (
                    <g key={`hist-${idx}`} className="cursor-pointer" onMouseEnter={() => setHoveredPointIndex(idx)}>
                      <circle 
                        cx={x} 
                        cy={y} 
                        r={isHovered ? 6 : 4} 
                        fill="#080e1b" 
                        stroke="#38bdf8" 
                        strokeWidth={isHovered ? 3 : 2} 
                      />
                    </g>
                  );
                })}

                {futurePoints.map((pt, idx) => {
                  const actualIdx = originHistIndex + 1 + idx;
                  const x = getX(actualIdx);
                  const y = getY(pt.val);
                  const isHovered = hoveredPointIndex === actualIdx;
                  return (
                    <g key={`fut-${idx}`} className="cursor-pointer" onMouseEnter={() => setHoveredPointIndex(actualIdx)}>
                      <circle 
                        cx={x} 
                        cy={y} 
                        r={isHovered ? 6 : 4} 
                        fill="#080e1b" 
                        stroke="#22d3ee" 
                        strokeWidth={isHovered ? 3 : 2} 
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Model Loss Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-500/40">
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Backtest MAPE</div>
                <div className="text-2xl font-bold text-emerald-300 num-stat mt-0.5">
                  {currentModelStats.mape}
                </div>
                <div className="text-xs text-emerald-400/70 mt-0.5">Percentage Error</div>
              </div>

              <div className="bg-[#091122] p-4 rounded-xl border border-[#1e3a5f]">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">RMSE Loss</div>
                <div className="text-2xl font-bold text-sky-300 num-stat mt-0.5">
                  {currentModelStats.rmse}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Root Mean Square</div>
              </div>

              <div className="bg-[#091122] p-4 rounded-xl border border-[#1e3a5f]">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">MAE Error</div>
                <div className="text-2xl font-bold text-white num-stat mt-0.5">
                  {currentModelStats.mae}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Mean Absolute Error</div>
              </div>

              <div className="bg-[#091122] p-4 rounded-xl border border-[#1e3a5f]">
                <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider font-mono">AIC Score</div>
                <div className="text-2xl font-bold text-cyan-300 num-stat mt-0.5">
                  {currentModelStats.aic}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Akaike Criterion</div>
              </div>
            </div>

            {/* Gemini 2.5 Executive AI Reasoning Box */}
            <div className="bg-[#091122] text-white p-6 rounded-2xl border border-[#1e3a5f] shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <BrainCircuit className="h-5 w-5 text-cyan-400" />
                  <span className="text-base font-bold text-white">
                    Gemini AI Executive Insights
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-cyan-300 bg-[#0f2442] px-2.5 py-0.5 rounded-full border border-cyan-500/40">
                  {currentModelStats.label}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs sm:text-sm">
                <div className="bg-[#080e1b] p-3.5 rounded-xl border border-[#14233c]">
                  <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block mb-1 font-mono">Velocity</span>
                  <span className="text-slate-200">{currentDataset.geminiAnalysis.velocity}</span>
                </div>
                <div className="bg-[#080e1b] p-3.5 rounded-xl border border-[#14233c]">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1 font-mono">Risk Mitigations</span>
                  <span className="text-amber-200">{currentDataset.geminiAnalysis.risks}</span>
                </div>
                <div className="bg-[#080e1b] p-3.5 rounded-xl border border-[#14233c]">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1 font-mono">Recommendation</span>
                  <span className="text-emerald-200">{currentDataset.geminiAnalysis.recommendation}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section id="features" className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1e3a5f]">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 text-xs font-semibold">
            <Zap className="h-3.5 w-3.5" />
            <span>Platform Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Accurate Time-Series Decisions
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            A comprehensive suite of forecasting, anomaly isolation, and natural-language intelligence tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="ai-card p-6 space-y-3 ai-card-hover">
            <div className="h-11 w-11 rounded-xl bg-[#0f2442] text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Multi-Horizon Cross-Validation</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Computes rolling out-of-sample backtests across multiple temporal cutoffs to calculate truthful MAPE, RMSE, and MAE loss metrics.
            </p>
          </div>

          <div className="ai-card p-6 space-y-3 ai-card-hover">
            <div className="h-11 w-11 rounded-xl bg-[#131d3f] text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Gemini AI Executive Briefings</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Converts complex statistical changepoints and volatility spikes into succinct executive summaries and operational recommendations.
            </p>
          </div>

          <div className="ai-card p-6 space-y-3 ai-card-hover">
            <div className="h-11 w-11 rounded-xl bg-[#0f283d] text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <LineChart className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Uncertainty Fans &amp; Intervals</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Provides dynamic 95% statistical confidence bounds to quantify tail-risk scenarios and variance accumulation over time.
            </p>
          </div>
        </div>
      </section>

      {/* Developer API & SDK Section */}
      <section id="sdk" className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1e3a5f]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 text-xs font-semibold">
              <Terminal className="h-3.5 w-3.5" />
              <span>Developer-First</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Native Python SDK, REST API, and SQL Integrations
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Integrate multi-model time-series forecasting directly into your data pipelines, Airflow DAGs, FastAPI services, or analytical warehouses.
            </p>

            <ul className="space-y-3 text-sm text-slate-300 font-medium">
              <li className="flex items-center space-x-2.5">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>Zero-cold-start sub-38ms in-memory inference</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>Standardized Pandas &amp; Arrow DataFrame compatibility</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>Automated multi-horizon cross-validation ranking</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={onLoginClick}
                className="btn-ai-radiant text-sm px-6 py-3 rounded-xl flex items-center space-x-2"
              >
                <Lock className="h-4 w-4" />
                <span>Sign In to Access API Keys</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-2xl border border-[#1e3a5f] overflow-hidden shadow-2xl bg-[#080e1b]">
            <div className="bg-[#050914] px-5 py-3 border-b border-[#14233c] flex items-center justify-between">
              <div className="flex items-center space-x-2 font-mono text-xs">
                {['python', 'curl', 'typescript', 'sql'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveCodeTab(tab)}
                    className={`px-3 py-1.5 rounded-lg uppercase transition-colors ${
                      activeCodeTab === tab
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopyCode}
                className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 px-2.5 py-1 rounded-lg hover:bg-[#0f2442] transition-colors"
              >
                {copiedCode ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-5 bg-[#080e1b] overflow-x-auto max-h-[360px]">
              <pre className="text-xs font-mono text-slate-200 leading-relaxed">
                <code>{CODE_EXAMPLES[activeCodeTab]}</code>
              </pre>
            </div>
          </div>

        </div>
      </section>

      {/* Model Benchmark Matrix */}
      <section id="benchmark" className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1e3a5f]">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 text-xs font-semibold">
            <Layers className="h-3.5 w-3.5" />
            <span>Algorithmic Comparison</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Four Mathematical Families. Zero Guesswork.
          </h2>
        </div>

        <div className="ai-card overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#091122] text-slate-400 font-bold uppercase text-xs font-mono border-b border-[#1e3a5f]">
                <tr>
                  <th className="py-3.5 px-6">Algorithm</th>
                  <th className="py-3.5 px-6">Mathematical Foundation</th>
                  <th className="py-3.5 px-6">Primary Strength</th>
                  <th className="py-3.5 px-6">Average MAPE</th>
                  <th className="py-3.5 px-6">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#14233c] bg-[#091122]/70 font-mono text-xs sm:text-sm">
                <tr className="bg-emerald-950/40">
                  <td className="py-4 px-6 font-bold text-white flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    <span>Consensus Ensemble</span>
                    <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-bold">Champion</span>
                  </td>
                  <td className="py-4 px-6 text-slate-300">Bayesian Loss-Weighted Fusion</td>
                  <td className="py-4 px-6 text-slate-300">Complex multi-modal patterns</td>
                  <td className="py-4 px-6 text-emerald-300 font-bold num-stat">0.82% - 1.18%</td>
                  <td className="py-4 px-6 text-slate-400 num-stat">42ms</td>
                </tr>

                <tr className="hover:bg-[#0c1830]">
                  <td className="py-4 px-6 font-bold text-white">Meta Prophet</td>
                  <td className="py-4 px-6 text-slate-400">Decomposable Additive GAM</td>
                  <td className="py-4 px-6 text-slate-400">Strong holiday &amp; seasonality</td>
                  <td className="py-4 px-6 text-cyan-300 font-bold num-stat">1.24% - 1.65%</td>
                  <td className="py-4 px-6 text-slate-400 num-stat">36ms</td>
                </tr>

                <tr className="hover:bg-[#0c1830]">
                  <td className="py-4 px-6 font-bold text-white">Auto-ARIMA</td>
                  <td className="py-4 px-6 text-slate-400">ARIMA(p,d,q) Lag Regression</td>
                  <td className="py-4 px-6 text-slate-400">Autocorrelated time series</td>
                  <td className="py-4 px-6 text-slate-300 font-bold num-stat">1.45% - 2.12%</td>
                  <td className="py-4 px-6 text-slate-400 num-stat">28ms</td>
                </tr>

                <tr className="hover:bg-[#0c1830]">
                  <td className="py-4 px-6 font-bold text-white">Holt-Winters</td>
                  <td className="py-4 px-6 text-slate-400">Triple Exponential Smoothing</td>
                  <td className="py-4 px-6 text-slate-400">Fast trend adaptation</td>
                  <td className="py-4 px-6 text-slate-300 font-bold num-stat">0.98% - 2.84%</td>
                  <td className="py-4 px-6 text-slate-400 num-stat">12ms</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Technical FAQ Section */}
      <section id="faq" className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-[#1e3a5f]">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 text-xs font-semibold">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>FAQ</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="ai-card overflow-hidden shadow-xs">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between text-base font-bold text-white hover:text-cyan-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-300 leading-relaxed border-t border-[#14233c]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1e3a5f]">
        <div className="ai-card p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6 shadow-2xl border border-cyan-500/40">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Ready to deploy accurate forecasting?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Sign in to upload custom CSV datasets, execute multi-model cross-validation, and stream Gemini AI diagnostics.
          </p>

          <div className="pt-2">
            <button
              onClick={onLoginClick}
              className="btn-ai-radiant font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl inline-flex items-center space-x-2"
            >
              <Lock className="h-4 w-4" />
              <span>Sign In to Access Workspace</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#1e3a5f] bg-[#0b1328] py-8 text-xs text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <LogoF className="h-5 w-5" />
            <span className="text-white font-bold text-sm">SmartForecast AI</span>
            <span>•</span>
            <span>Predictive Time-Series Analytics</span>
          </div>

          <div className="flex items-center space-x-6 font-mono text-[11px] text-cyan-400">
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>All Systems Operational</span>
            </span>
            <span>Secure In-Memory</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
