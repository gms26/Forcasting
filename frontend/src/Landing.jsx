import React, { useState, useMemo } from 'react';
import LogoF from './components/LogoF';
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
  AlertTriangle, 
  Code2, 
  Copy, 
  Terminal, 
  Server, 
  RefreshCw, 
  SlidersHorizontal, 
  ChevronRight, 
  GitBranch, 
  Key,
  FileSpreadsheet,
  SlidersVertical
} from 'lucide-react';

// Live Interactive Datasets for the Front-Page Studio Simulator
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
    changepoints: [
      { date: 'Mar 24', note: 'Q1 Enterprise Tier Expansion (+14% ARR uplift)' },
      { date: 'May 24', note: 'Europe Datacenter Launch (+9% pipeline expansion)' }
    ],
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
    changepoints: [
      { date: '08:00', note: 'APAC Trading Desk Morning Inference Peak' },
      { date: '16:00', note: 'US Market Batch Embedding Pipeline Trigger' }
    ],
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
    changepoints: [
      { date: 'Wk 3', note: 'Supplier Port Transit Bottleneck (-10% throughput)' },
      { date: 'Wk 5', note: 'Air Freight Route Reallocation (+16% velocity)' }
    ],
    geminiAnalysis: {
      velocity: '4.6% weekly unit replenishment velocity',
      confidence: 'High (0.91 statistical certainty)',
      risks: 'Inventory buffer tightens below 14-day safety threshold in Week 9.',
      recommendation: 'Lock in sea freight container reservations 3 weeks earlier to mitigate route cost premiums.'
    }
  },
  ecommerce: {
    id: 'ecommerce',
    name: 'E-Commerce Global Transactions',
    category: 'High-Frequency Retail',
    unit: 'tx / sec',
    badge: 'E-Commerce',
    historicalBase: [
      { date: 'T-5h', val: 2450 },
      { date: 'T-4h', val: 2680 },
      { date: 'T-3h', val: 2920 },
      { date: 'T-2h', val: 3240 },
      { date: 'T-1h', val: 3610 },
      { date: 'Now', val: 4050 }
    ],
    growthRate: 1.082,
    seasonalityPattern: [1.04, 1.07, 1.02, 1.10, 1.14, 1.09],
    models: {
      ensemble: { 
        accuracy: '99.6%', 
        mape: '0.94%', 
        mae: '34 tx/s', 
        rmse: '48 tx/s', 
        aic: '402.1',
        label: 'Consensus Ensemble (Best Fit)',
        desc: 'High-throughput rolling consensus model for microsecond latency applications.'
      },
      prophet: { 
        accuracy: '99.2%', 
        mape: '1.42%', 
        mae: '52 tx/s', 
        rmse: '71 tx/s', 
        aic: '418.6',
        label: 'Meta Prophet (Seasonal + Trend)',
        desc: 'Decomposes intraday flash sale surges and geo-located traffic waves.'
      },
      arima: { 
        accuracy: '99.1%', 
        mape: '1.58%', 
        mae: '58 tx/s', 
        rmse: '79 tx/s', 
        aic: '422.3',
        label: 'Auto-ARIMA (p,d,q)(P,D,Q)s',
        desc: 'Handles high-order moving average coefficients from payment gateway retry queues.'
      },
      holt: { 
        accuracy: '99.4%', 
        mape: '1.12%', 
        mae: '41 tx/s', 
        rmse: '56 tx/s', 
        aic: '409.8',
        label: 'Holt-Winters (Triple Exponential)',
        desc: 'Ultra-fast exponential update weights suited for streaming stream ingestion.'
      }
    },
    changepoints: [
      { date: 'T-3h', note: 'Flash Sale Push Notification Broadcast' },
      { date: 'T-1h', note: 'Checkout Payment Gateway Latency Optimization' }
    ],
    geminiAnalysis: {
      velocity: '8.2% transaction surge rate',
      confidence: 'Exceptional (0.98 predictive accuracy on streaming test sets)',
      risks: 'Database connection pool saturation projected at 5,200 tx/sec mark.',
      recommendation: 'Activate read-replica pooling and edge caching for payment authorization checks.'
    }
  }
};

const CODE_EXAMPLES = {
  python: `# pip install smartforecast-sdk
import pandas as pd
from smartforecast import Engine, ModelConfig

# 1. Initialize client with isolated memory runtime
engine = Engine(api_key="sf_prod_99a8b72c", cluster="us-east-1")

# 2. Ingest time-series DataFrame
df = pd.read_csv("telemetry_arr.csv", parse_dates=["timestamp"])

# 3. Fit multi-model benchmark concurrently
benchmark = engine.benchmark(
    data=df,
    target_col="arr_metric",
    date_col="timestamp",
    models=["prophet", "auto_arima", "holt_winters", "ensemble"],
    cv_folds=5,
    forecast_horizon=30
)

# 4. Extract champion forecast & Gemini executive briefing
champion = benchmark.get_best_model(metric="mape")
forecast_df = champion.predict(horizon=30, confidence_interval=0.95)
reasoning = benchmark.get_gemini_analysis()

print(f"Champion: {champion.name} | Backtest MAPE: {champion.mape:.2f}%")
print(f"Gemini Synthesis: {reasoning.executive_summary}")`,

  curl: `# Direct High-Throughput REST API Call
curl -X POST "https://api.smartforecast.ai/v1/forecast/benchmark" \\
  -H "Authorization: Bearer sf_prod_99a8b72c" \\
  -H "Content-Type: application/json" \\
  -d '{
    "dataset_id": "ds_arr_2026",
    "horizon": 30,
    "confidence_level": 0.95,
    "seasonality_mode": "additive",
    "algorithms": ["ensemble", "prophet", "arima", "holt_winters"],
    "explain_with_gemini": true
  }'`,

  typescript: `// TypeScript / Node.js Engine Client
import { SmartForecastClient } from '@smartforecast/sdk';

const sf = new SmartForecastClient({
  apiKey: process.env.SMARTFORECAST_API_KEY!,
  clusterRegion: 'us-east-1'
});

// Run distributed forecast across 4 model families
const result = await sf.forecast.runBenchmark({
  records: historicalPoints,
  targetKey: 'arr_metric',
  timestampKey: 'timestamp',
  horizonSteps: 30,
  includeExecutiveAI: true
});

console.log(\`Best Model: \${result.champion.modelName}\`);
console.log(\`Projected P50: \${result.champion.predictions[29].yhat}\`);
console.log(\`AI Diagnostics: \${result.geminiBriefing.summary}\`);`,

  sql: `-- Native Snowflake / BigQuery / Databricks SQL Interface
SELECT 
    d.timestamp,
    d.historical_value,
    f.predicted_p50,
    f.confidence_lower_95,
    f.confidence_upper_95,
    f.model_family,
    f.gemini_risk_flag
FROM enterprise_telemetry.sales_daily d
MODEL PREDICT smartforecast_ensemble (
    TARGET d.historical_value,
    HORIZON 30,
    CLUSTER 'ephemeral-gpu'
) OVER (ORDER BY d.timestamp) f
WHERE d.timestamp >= CURRENT_DATE - INTERVAL '180 DAYS';`
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
    q: 'Can I upload custom CSV, Excel, or streaming time-series data?',
    a: 'Yes. SmartForecast features an intelligent schema parser that automatically detects ISO-8601, Unix epoch, YYYY-MM-DD, or DD/MM/YYYY dates, handles irregular sampling frequencies, fills missing intervals using Kalman or linear interpolation, and isolates outliers before model fitting.'
  },
  {
    q: 'What is your security and data retention architecture?',
    a: 'All forecasting runs execute in isolated, in-memory ephemeral worker containers. Data is never persisted on disk, never shared across tenants, and never used to train public foundation models. We support TLS 1.3 in transit and AES-256 encryption at rest.'
  },
  {
    q: 'What is the inference latency and throughput for production workloads?',
    a: 'Our optimized backend fits standard time-series datasets across all 4 algorithmic families in under 45ms. For enterprise scale, batch inference handles millions of time-series series concurrently across distributed worker nodes.'
  }
];

export default function Landing({ onLoginClick }) {
  const [activeDatasetKey, setActiveDatasetKey] = useState('revenue');
  const [selectedModelKey, setSelectedModelKey] = useState('ensemble');
  const [forecastHorizon, setForecastHorizon] = useState(30); // 7, 30, 90, 180
  const [ciSpreadMode, setCiSpreadMode] = useState('95'); // '80' | '95'
  const [activeCodeTab, setActiveCodeTab] = useState('python');
  const [copiedCode, setCopiedCode] = useState(false);
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const currentDataset = SIMULATOR_DATASETS[activeDatasetKey];
  const currentModelStats = currentDataset.models[selectedModelKey];

  // Dynamically compute forecast curve based on horizon and selected model
  const futurePoints = useMemo(() => {
    const horizonSteps = forecastHorizon <= 14 ? 4 : forecastHorizon <= 60 ? 6 : 8;
    const lastHist = currentDataset.historicalBase[currentDataset.historicalBase.length - 1].val;
    const points = [];
    
    for (let i = 1; i <= horizonSteps; i++) {
      const periodFraction = (i / horizonSteps) * (forecastHorizon / 30);
      const growthMult = Math.pow(currentDataset.growthRate, periodFraction);
      const seasonIndex = (i - 1) % currentDataset.seasonalityPattern.length;
      const seasonMult = currentDataset.seasonalityPattern[seasonIndex];
      
      // Model specific variance multiplier
      const modelVariance = selectedModelKey === 'arima' ? 1.03 : selectedModelKey === 'holt' ? 0.98 : 1.0;
      const predictedVal = Number((lastHist * growthMult * seasonMult * modelVariance).toFixed(2));
      
      // CI Spread
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

  // Combined points for SVG plotting
  const allPoints = useMemo(() => {
    return [
      ...currentDataset.historicalBase.map(h => ({ ...h, isForecast: false })),
      ...futurePoints
    ];
  }, [currentDataset, futurePoints]);

  // SVG dimensions
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

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLES[activeCodeTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const activePoint = hoveredPointIndex !== null ? allPoints[hoveredPointIndex] : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden w-full max-w-full relative">
      
      {/* Subtle Background Ambiance */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 clean-mesh-pattern opacity-60" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-blue-100/70 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-3xl" />
      </div>

      {/* Top Header / Navigation Bar */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/90 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo with stylish 'F' */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="h-11 w-11 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center group-hover:border-blue-400 transition-colors p-1.5">
              <LogoF className="h-7 w-7" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">SmartForecast</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  AI
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium">Predictive Intelligence</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm text-slate-600 font-semibold">
            <a href="#sandbox" className="hover:text-blue-600 transition-colors">Live Preview</a>
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#benchmark" className="hover:text-blue-600 transition-colors">Model Matrix</a>
            <a href="#sdk" className="hover:text-blue-600 transition-colors">Developer API</a>
            <a href="#architecture" className="hover:text-blue-600 transition-colors">Architecture</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={onLoginClick}
              className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onLoginClick}
              className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl transition-all flex items-center space-x-2 shadow-md shadow-blue-600/20 active:scale-[0.98]"
            >
              <Lock className="h-4 w-4" />
              <span>Launch App</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          {/* Status Badge */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-semibold shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-live-dot" />
            <span>Time-Series Forecasting Engine</span>
            <span className="text-slate-300">•</span>
            <span className="text-blue-600 font-bold">&lt; 40ms Latency</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Modern Time-Series Intelligence &amp; AI Forecasting
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Benchmark Meta Prophet, Auto-ARIMA, Holt-Winters, and Neural Ensembles in parallel. Automatically generate Bayesian confidence fans and Gemini-synthesized executive briefings in real time.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onLoginClick}
              className="text-base font-bold text-white bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl transition-all flex items-center space-x-2.5 shadow-lg shadow-blue-600/25 active:scale-[0.98]"
            >
              <Lock className="h-5 w-5" />
              <span>Sign In to Start Forecasting</span>
              <ArrowRight className="h-5 w-5" />
            </button>

            <a
              href="#sandbox"
              className="text-base font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-7 py-4 rounded-2xl border border-slate-200 transition-all flex items-center space-x-2 shadow-sm"
            >
              <Activity className="h-5 w-5 text-blue-600" />
              <span>Interactive Live Preview ↓</span>
            </a>
          </div>

          {/* Production Specs Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 max-w-4xl mx-auto text-left">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Multi-Model Engine</div>
              <div className="text-lg font-bold text-slate-900 mt-1">4 Model Families</div>
              <div className="text-xs sm:text-sm text-slate-500 mt-1">Prophet • ARIMA • HW • Ensemble</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Backtest Accuracy</div>
              <div className="text-lg font-bold text-emerald-600 mt-1 num-stat">99.4% Fit Score</div>
              <div className="text-xs sm:text-sm text-slate-500 mt-1">5-Fold Cross Validation</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inference Speed</div>
              <div className="text-lg font-bold text-blue-600 mt-1 num-stat">&lt; 38ms Latency</div>
              <div className="text-xs sm:text-sm text-slate-500 mt-1">Fast In-Memory Engine</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Privacy &amp; Security</div>
              <div className="text-lg font-bold text-slate-900 mt-1">Zero Retention</div>
              <div className="text-xs sm:text-sm text-slate-500 mt-1">Isolated Ephemeral Session</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature: The Interactive Forecasting Studio Simulator (Front Page Sandbox) */}
      <section id="sandbox" className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Studio Card Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Top Control Bar: Dataset Tabs */}
          <div className="bg-slate-50/80 px-6 sm:px-8 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
            
            {/* Dataset Switcher */}
            <div className="flex items-center space-x-2 overflow-x-auto py-1 max-w-full">
              <span className="text-sm font-bold text-slate-700 mr-2 hidden sm:inline-block">Dataset:</span>
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
                    className={`text-sm px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap flex items-center space-x-2 ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-md font-semibold' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <span>{ds.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {ds.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onLoginClick}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors shadow-sm"
              >
                <Lock className="h-4 w-4" />
                <span>Sign In to Upload Custom CSV</span>
              </button>
            </div>
          </div>

          {/* Controls Bar: Model & Horizon Controls */}
          <div className="bg-white px-6 sm:px-8 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-sm">
            
            {/* Algorithm Model Selector */}
            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
              <span className="text-slate-500 font-semibold mr-1">Algorithm:</span>
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
                    className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-2 ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 border border-blue-300 font-bold shadow-sm'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <span>{m.label}</span>
                    {m.tag === 'Best Fit' && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Horizon & CI Controls */}
            <div className="flex items-center space-x-5">
              
              {/* Forecast Horizon */}
              <div className="flex items-center space-x-2">
                <span className="text-slate-500 font-semibold">Horizon:</span>
                {[7, 30, 90, 180].map((h) => (
                  <button
                    key={h}
                    onClick={() => setForecastHorizon(h)}
                    className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
                      forecastHorizon === h
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                    }`}
                  >
                    {h}D
                  </button>
                ))}
              </div>

              {/* Confidence Band Toggle */}
              <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
                <span className="text-slate-500 font-semibold">Fan:</span>
                {['80', '95'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setCiSpreadMode(mode)}
                    className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
                      ciSpreadMode === mode
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                    }`}
                  >
                    {mode}% CI
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Chart Canvas & Real-Time Stats Grid */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Top Telemetry Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 font-semibold text-slate-700">
                  <span className="h-3 w-3 rounded-full bg-sky-500" />
                  <span>Historical Data</span>
                </div>
                <div className="flex items-center space-x-2 font-semibold text-blue-600">
                  <span className="h-3 w-3 rounded-full bg-blue-600" />
                  <span>Forecast ({selectedModelKey.toUpperCase()})</span>
                </div>
                <div className="flex items-center space-x-2 font-semibold text-indigo-600">
                  <span className="h-3 w-3 rounded bg-indigo-200 border border-indigo-400" />
                  <span>{ciSpreadMode}% Uncertainty Fan</span>
                </div>
              </div>

              {/* Point Inspector Badge */}
              <div className="text-sm text-slate-700 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 font-medium">
                {activePoint ? (
                  <span>
                    <strong className="text-slate-900">{activePoint.label || activePoint.date}:</strong>{' '}
                    <span className="text-blue-600 font-bold ml-1">{activePoint.val} {currentDataset.unit}</span>
                    {activePoint.upper && (
                      <span className="text-slate-500 ml-2">
                        [Confidence Range: {activePoint.lower} – {activePoint.upper}]
                      </span>
                    )}
                  </span>
                ) : (
                  <span>Hover data points on the curve to inspect exact values</span>
                )}
              </div>
            </div>

            {/* SVG Interactive Time-Series Canvas */}
            <div className="relative w-full h-64 sm:h-72 bg-[#0c1222] rounded-2xl border border-slate-800 p-3 overflow-hidden shadow-inner">
              <svg 
                viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="studioHistGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.30" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.00" />
                  </linearGradient>
                  
                  <linearGradient id="studioFanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.06" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[0.25, 0.5, 0.75].map((pct, idx) => {
                  const y = svgHeight * pct;
                  return (
                    <g key={idx}>
                      <line 
                        x1="20" 
                        y1={y} 
                        x2={svgWidth - 20} 
                        y2={y} 
                        stroke="#1e293b" 
                        strokeDasharray="4 4" 
                        strokeOpacity="0.8" 
                      />
                    </g>
                  );
                })}

                {/* Vertical Cutoff Separator at Historical Origin */}
                <line 
                  x1={originX} 
                  y1="10" 
                  x2={originX} 
                  y2={svgHeight - 15} 
                  stroke="#38bdf8" 
                  strokeDasharray="3 3" 
                  strokeWidth="2" 
                />
                <text 
                  x={originX + 10} 
                  y="24" 
                  fill="#38bdf8" 
                  fontSize="11" 
                  fontWeight="700"
                >
                  FORECAST HORIZON ({forecastHorizon}D) →
                </text>

                {/* 95% Confidence Fan Area */}
                <polygon 
                  points={fanPolygonPoints} 
                  fill="url(#studioFanGradient)" 
                  stroke="#818cf8" 
                  strokeWidth="1" 
                  strokeDasharray="3 3" 
                  strokeOpacity="0.7" 
                />

                {/* Historical Area Under Curve */}
                <path 
                  d={`${histPath} L ${originX} ${svgHeight - 15} L ${getX(0)} ${svgHeight - 15} Z`} 
                  fill="url(#studioHistGradient)" 
                />

                {/* Historical Solid Trend Line */}
                <path 
                  d={histPath} 
                  fill="none" 
                  stroke="#38bdf8" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />

                {/* Predicted Dashed Forecast Line */}
                <path 
                  d={forecastPath} 
                  fill="none" 
                  stroke="#60a5fa" 
                  strokeWidth="3" 
                  strokeDasharray="6 4" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />

                {/* Historical Points */}
                {currentDataset.historicalBase.map((pt, idx) => {
                  const x = getX(idx);
                  const y = getY(pt.val);
                  const isHovered = hoveredPointIndex === idx;
                  return (
                    <g key={`hist-${idx}`} className="cursor-pointer" onMouseEnter={() => setHoveredPointIndex(idx)}>
                      <circle 
                        cx={x} 
                        cy={y} 
                        r={isHovered ? 7 : 5} 
                        fill="#0c1222" 
                        stroke="#38bdf8" 
                        strokeWidth={isHovered ? 3.5 : 2.5} 
                        className="transition-all"
                      />
                    </g>
                  );
                })}

                {/* Future Predicted Points */}
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
                        r={isHovered ? 7 : 5} 
                        fill="#0c1222" 
                        stroke="#60a5fa" 
                        strokeWidth={isHovered ? 3.5 : 2.5} 
                        className="transition-all"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Model Loss Metrics & Statistical Diagnostics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Backtest MAPE</div>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 num-stat mt-1">
                  {currentModelStats.mape}
                </div>
                <div className="text-xs text-slate-500 mt-1">Grade: Optimal Fit</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">RMSE Loss</div>
                <div className="text-xl sm:text-2xl font-extrabold text-blue-600 num-stat mt-1">
                  {currentModelStats.rmse}
                </div>
                <div className="text-xs text-slate-500 mt-1">Root Mean Squared</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">MAE Error</div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-800 num-stat mt-1">
                  {currentModelStats.mae}
                </div>
                <div className="text-xs text-slate-500 mt-1">Mean Absolute Error</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">AIC Score</div>
                <div className="text-xl sm:text-2xl font-extrabold text-indigo-600 num-stat mt-1">
                  {currentModelStats.aic}
                </div>
                <div className="text-xs text-slate-500 mt-1">Akaike Criterion</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 col-span-2 sm:col-span-1 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Residual Normalcy</div>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 num-stat mt-1">
                  p = 0.84
                </div>
                <div className="text-xs text-slate-500 mt-1">Gaussian Residuals</div>
              </div>
            </div>

            {/* Gemini 2.5 Executive AI Reasoning Box */}
            <div className="bg-blue-50/80 p-6 rounded-2xl border border-blue-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                    <BrainCircuit className="h-4 w-4" />
                  </div>
                  <span className="text-base font-bold text-blue-900">
                    Gemini 2.5 Time-Series Executive Insights
                  </span>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
                  {currentModelStats.label}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2 text-sm">
                <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Trend Velocity</span>
                  <span className="text-slate-800 font-semibold leading-snug">{currentDataset.geminiAnalysis.velocity}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">Detected Operational Risk</span>
                  <span className="text-amber-800 font-medium leading-snug">{currentDataset.geminiAnalysis.risks}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">Recommended Action</span>
                  <span className="text-emerald-800 font-medium leading-snug">{currentDataset.geminiAnalysis.recommendation}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Enterprise Capabilities Section */}
      <section id="features" className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-sm font-semibold">
            <Zap className="h-4 w-4" />
            <span>Platform Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Engineered for Accurate Time-Series Decisions
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            A comprehensive suite of forecasting, anomaly isolation, and natural-language intelligence tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 space-y-3.5 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Multi-Horizon Cross-Validation</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Computes rolling out-of-sample backtests across multiple temporal cutoffs to calculate truthful MAPE, RMSE, and MAE loss metrics.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 space-y-3.5 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Gemini 2.5 Executive Briefings</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Converts complex statistical changepoints, Fourier harmonics, and volatility spikes into succinct executive summaries and risk mitigations.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 space-y-3.5 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <LineChart className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Bayesian Uncertainty Fans</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Provides dynamic 80% and 95% statistical confidence bounds to quantify tail-risk scenarios and variance accumulation over time.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 space-y-3.5 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Database className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Automated Schema &amp; Gap Imputation</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Parses ISO-8601, Epoch, and regional date formats automatically. Cleans calendar jitter and handles missing intervals seamlessly.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 space-y-3.5 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Executive Report Export Suite</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Download clean CSV predictions, high-res SVG vectors, or comprehensive boardroom PDF reports containing models and AI reasoning.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 space-y-3.5 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Zero Data Retention Isolation</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              In-memory ephemeral execution guarantees that customer telemetry is never stored on disk or used for public foundation model training.
            </p>
          </div>

        </div>
      </section>

      {/* Developer-First Code & API Integration Section */}
      <section id="sdk" className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Developer Pitch */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-sm font-semibold">
              <Terminal className="h-4 w-4" />
              <span>Developer-First Architecture</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Native Python SDK, REST Endpoints, and SQL Integrations
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              Integrate multi-model time-series forecasting directly into your data pipelines, Airflow DAGs, FastAPI services, or analytical warehouses with minimal boilerplate.
            </p>

            <ul className="space-y-3.5 text-sm text-slate-700">
              <li className="flex items-center space-x-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>Zero-cold-start sub-40ms in-memory inference</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>Standardized Pandas &amp; Arrow DataFrame compatibility</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>Automated multi-horizon cross-validation ranking</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>Pre-built Gemini 2.5 prompt orchestration layers</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={onLoginClick}
                className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-6 py-3.5 rounded-xl transition-all inline-flex items-center space-x-2 shadow-md shadow-blue-600/20"
              >
                <Lock className="h-4 w-4" />
                <span>Sign In to Access API Keys</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Code Viewer */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl bg-slate-950">
            
            {/* Terminal Tab Bar */}
            <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
              
              {/* Language Tabs */}
              <div className="flex items-center space-x-2">
                {[
                  { key: 'python', label: 'Python SDK' },
                  { key: 'curl', label: 'cURL / REST' },
                  { key: 'typescript', label: 'TypeScript' },
                  { key: 'sql', label: 'SQL Warehouse' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveCodeTab(tab.key)}
                    className={`text-sm px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
                      activeCodeTab === tab.key
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Copy Code Button */}
              <button
                onClick={handleCopyCode}
                className="text-sm text-slate-400 hover:text-white flex items-center space-x-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                {copiedCode ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Block Container */}
            <div className="p-5 bg-slate-950 overflow-x-auto max-h-[400px]">
              <pre className="text-sm font-mono text-slate-200 leading-relaxed">
                <code>{CODE_EXAMPLES[activeCodeTab]}</code>
              </pre>
            </div>

            {/* Terminal Status Footer */}
            <div className="bg-slate-900 px-5 py-2.5 border-t border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>● Response latency: 34ms</span>
              <span>HTTP 200 OK • JSON</span>
            </div>
          </div>

        </div>
      </section>

      {/* Model Benchmark Matrix (Deep Technical Breakdown) */}
      <section id="benchmark" className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-sm font-semibold">
            <Layers className="h-4 w-4" />
            <span>Algorithmic Comparison</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Four Mathematical Families. Zero Guesswork.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            SmartForecast automatically benchmarks classical statistical, exponential smoothing, and Bayesian regression models to select the mathematically superior fit.
          </p>
        </div>

        {/* Matrix Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-xs border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6">Algorithm</th>
                  <th className="py-4 px-6">Mathematical Foundation</th>
                  <th className="py-4 px-6">Primary Strength</th>
                  <th className="py-4 px-6">Seasonality Mode</th>
                  <th className="py-4 px-6">Average MAPE</th>
                  <th className="py-4 px-6">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                
                {/* Ensemble */}
                <tr className="hover:bg-blue-50/40 transition-colors bg-blue-50/20">
                  <td className="py-4 px-6 font-bold text-blue-700 flex items-center space-x-2.5">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span>Consensus Ensemble</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">Champion</span>
                  </td>
                  <td className="py-4 px-6 text-slate-700 font-medium">Bayesian Loss-Weighted Fusion</td>
                  <td className="py-4 px-6 text-slate-700 font-medium">Complex multi-modal patterns</td>
                  <td className="py-4 px-6 text-slate-700 font-medium">Dual Fourier + Additive</td>
                  <td className="py-4 px-6 text-emerald-600 font-extrabold num-stat">0.82% - 1.18%</td>
                  <td className="py-4 px-6 text-slate-500 num-stat">42ms</td>
                </tr>

                {/* Prophet */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">Meta Prophet</td>
                  <td className="py-4 px-6 text-slate-600">Decomposable GAM y(t) = g(t) + s(t)</td>
                  <td className="py-4 px-6 text-slate-700">Strong holiday &amp; weekly cycles</td>
                  <td className="py-4 px-6 text-slate-600">Fourier series (m=7, 365.25)</td>
                  <td className="py-4 px-6 text-emerald-600 font-bold num-stat">1.24% - 1.65%</td>
                  <td className="py-4 px-6 text-slate-500 num-stat">36ms</td>
                </tr>

                {/* Auto-ARIMA */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">Auto-ARIMA</td>
                  <td className="py-4 px-6 text-slate-600">ARIMA(p,d,q)(P,D,Q)s</td>
                  <td className="py-4 px-6 text-slate-700">Autocorrelated autoregressive lags</td>
                  <td className="py-4 px-6 text-slate-600">SARIMA Seasonal Lags</td>
                  <td className="py-4 px-6 text-slate-700 font-bold num-stat">1.45% - 2.12%</td>
                  <td className="py-4 px-6 text-slate-500 num-stat">28ms</td>
                </tr>

                {/* Holt-Winters */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">Holt-Winters</td>
                  <td className="py-4 px-6 text-slate-600">Triple Exponential Smoothing (HW-TES)</td>
                  <td className="py-4 px-6 text-slate-700">Fast adaptation to recent velocity</td>
                  <td className="py-4 px-6 text-slate-600">Multiplicative / Additive</td>
                  <td className="py-4 px-6 text-slate-700 font-bold num-stat">0.98% - 2.84%</td>
                  <td className="py-4 px-6 text-slate-500 num-stat">12ms</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Production Architecture & Pipeline Section */}
      <section id="architecture" className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-sm font-semibold">
            <Cpu className="h-4 w-4" />
            <span>Execution Lifecycle</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Distributed 5-Stage Forecasting Pipeline
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            How raw time-series data transforms into mathematical forecasts and executive AI briefings in milliseconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5">
          
          {/* Step 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2.5 shadow-sm">
            <div className="text-xs font-bold text-blue-600">STAGE 01</div>
            <h4 className="text-base font-bold text-slate-900">Ingestion &amp; Scrub</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Auto-detects date formats, fixes cadence jitter, and isolates anomalies with Isolation Forests.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2.5 shadow-sm">
            <div className="text-xs font-bold text-blue-600">STAGE 02</div>
            <h4 className="text-base font-bold text-slate-900">Signal Decomp</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Decomposes raw signal into secular trend, Fourier seasonality, and stochastic noise residual.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2.5 shadow-sm">
            <div className="text-xs font-bold text-blue-600">STAGE 03</div>
            <h4 className="text-base font-bold text-slate-900">Concurrent Fitting</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Prophet, Auto-ARIMA, and Holt-Winters fit across worker threads in under 40ms.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2.5 shadow-sm">
            <div className="text-xs font-bold text-blue-600">STAGE 04</div>
            <h4 className="text-base font-bold text-slate-900">Bayesian CV Loss</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              5-fold cross-validation scores models via MAPE, RMSE, and AIC to crown the champion fit.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2.5 shadow-sm">
            <div className="text-xs font-bold text-blue-600">STAGE 05</div>
            <h4 className="text-base font-bold text-slate-900">Gemini Synthesis</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Gemini 2.5 analyzes changepoints and variance fans to draft executive briefing points.
            </p>
          </div>

        </div>
      </section>

      {/* Technical FAQ Section */}
      <section id="faq" className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-200">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-sm font-semibold">
            <HelpCircle className="h-4 w-4" />
            <span>Frequently Answered</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={index} 
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full px-6 py-4 sm:py-5 text-left flex items-center justify-between text-base sm:text-lg font-bold text-slate-900 hover:text-blue-600"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Bottom Banner: Direct to Login */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-7 relative overflow-hidden shadow-2xl text-white">
          
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Ready to deploy accurate forecasting?
          </h2>

          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Sign in to upload custom CSV datasets, execute multi-model cross-validation, and stream Gemini AI diagnostics.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onLoginClick}
              className="text-base sm:text-lg font-bold text-blue-900 bg-white hover:bg-blue-50 px-8 py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] flex items-center space-x-2.5"
            >
              <Lock className="h-5 w-5 text-blue-600" />
              <span>Sign In to Access Workspace</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white py-10 text-sm text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center space-x-3">
            <LogoF className="h-5 w-5" />
            <span className="text-slate-900 font-bold">SmartForecast AI</span>
            <span>•</span>
            <span>Predictive Time-Series Analytics</span>
          </div>

          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-2 text-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>All Systems Operational</span>
            </span>
            <span>Secure TLS 1.3</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
