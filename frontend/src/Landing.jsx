import React, { useState, useMemo } from 'react';
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
      velocity: '+5.8% MoM compound ARR expansion',
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
      velocity: '+7.4% rolling shift compute escalation',
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
      velocity: '+4.6% weekly unit replenishment velocity',
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
      velocity: '+8.2% transaction surge rate',
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
    a: 'When time-series data is ingested, our worker cluster spawns parallel execution threads for Meta Prophet (decomposable changepoint regression), Auto-ARIMA (AIC-minimizing autoregression), Holt-Winters (triple exponential smoothing), and Moving Average algorithms. It computes Mean Absolute Percentage Error (MAPE), Root Mean Square Error (RMSE), and Mean Absolute Error (MAE) via rolling cross-validation folds, automatically surfacing the mathematical champion model for your data.'
  },
  {
    q: 'What exact role does Gemini AI play in numerical forecasting?',
    a: 'Classical statistical and ML models compute the numerical vectors, trend gradients, and Bayesian confidence boundaries. Gemini 2.5 analyzes the computed changepoints, volatility clusters, residual distribution, and seasonal anomalies to synthesize plain-English executive briefings, highlight tail risks, and recommend concrete operational decisions.'
  },
  {
    q: 'How are the 95% Bayesian Confidence Intervals calculated?',
    a: 'Confidence intervals represent the statistical boundaries within which future values will fall with 95% certainty. As the forecast horizon extends deeper into the future, the uncertainty fan naturally expands to account for variance accumulation, giving engineering and finance leaders visibility into both worst-case (P05) and best-case (P95) boundaries.'
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
    a: 'Our optimized C++ / Python backend fits standard time-series datasets (<10,000 points) across all 4 algorithmic families in under 45ms. For enterprise scale, batch inference handles millions of time-series series concurrently across distributed worker nodes.'
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
        ? `Day +${i * 2}` 
        : forecastHorizon <= 60 
          ? `M+${i}` 
          : `Q+${Math.ceil(i / 2)}`;

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
  const svgWidth = 620;
  const svgHeight = 200;
  const minVal = Math.min(...allPoints.map(p => p.lower || p.val)) * 0.90;
  const maxVal = Math.max(...allPoints.map(p => p.upper || p.val)) * 1.08;

  const getY = (v) => {
    const clamped = Math.max(minVal, Math.min(maxVal, v));
    return svgHeight - ((clamped - minVal) / (maxVal - minVal)) * (svgHeight - 40) - 20;
  };

  const getX = (idx) => {
    return (idx / (allPoints.length - 1)) * (svgWidth - 60) + 30;
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
    <div className="min-h-screen bg-[#090a0f] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden w-full max-w-full relative">
      
      {/* Subtle Developer Canvas Ambience (No cheesy oversaturated neon blobs) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 dev-grid-pattern opacity-60" />
        <div className="absolute inset-0 dev-radial-glow opacity-80" />
      </div>

      {/* Top Header / Navigation Bar */}
      <header className="sticky top-0 z-50 w-full pro-glass border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo & Version Tag */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center shadow-inner group-hover:border-cyan-500/50 transition-colors">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="text-sm font-semibold tracking-tight text-white font-mono">SmartForecast</span>
              <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                v2.4.2-prod
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs text-zinc-400 font-medium">
            <a href="#sandbox" className="hover:text-white transition-colors">Studio Simulator</a>
            <a href="#features" className="hover:text-white transition-colors">Core Capabilities</a>
            <a href="#benchmark" className="hover:text-white transition-colors">Model Benchmark</a>
            <a href="#sdk" className="hover:text-white transition-colors">Developer SDK</a>
            <a href="#architecture" className="hover:text-white transition-colors">Pipeline Arch</a>
            <a href="#faq" className="hover:text-white transition-colors">Technical FAQ</a>
          </nav>

          {/* Action CTAs: Direct to Login */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onLoginClick}
              className="text-xs font-medium text-zinc-300 hover:text-white px-3 py-1.5 rounded-md hover:bg-zinc-800/60 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onLoginClick}
              className="text-xs font-medium text-zinc-950 bg-cyan-400 hover:bg-cyan-300 px-3.5 py-1.5 rounded-md transition-all flex items-center space-x-1.5 shadow-sm active:scale-[0.98] font-semibold"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Enter Workspace</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          {/* Status Indicator Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-xs font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-live-dot" />
            <span>High-Throughput Time-Series Engine</span>
            <span className="text-zinc-500">|</span>
            <span className="text-cyan-400">p99 &lt; 38ms Latency</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            Production Time-Series Intelligence &amp; ML Forecasting Engine
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Benchmark Meta Prophet, Auto-ARIMA, Holt-Winters, and Neural Ensembles in parallel. Get automated Bayesian confidence fans and Gemini-synthesized executive briefings in real time.
          </p>

          {/* Action CTAs: Direct to Login */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onLoginClick}
              className="text-sm font-semibold text-zinc-950 bg-cyan-400 hover:bg-cyan-300 px-5 py-2.5 rounded-lg transition-all flex items-center space-x-2 shadow-lg shadow-cyan-500/10 active:scale-[0.98]"
            >
              <Lock className="h-4 w-4" />
              <span>Sign In to Launch Workspace</span>
            </button>

            <a
              href="#sandbox"
              className="text-sm font-semibold text-zinc-200 hover:text-white bg-zinc-900/90 hover:bg-zinc-800 px-4 py-2.5 rounded-lg border border-zinc-800 transition-all flex items-center space-x-2"
            >
              <Activity className="h-3.5 w-3.5 text-cyan-400" />
              <span>Interactive Live Preview ↓</span>
            </a>

            <a
              href="#sdk"
              className="text-sm font-semibold text-zinc-400 hover:text-white px-3 py-2.5 rounded-lg hover:bg-zinc-900 transition-colors flex items-center space-x-1 font-mono text-xs"
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Python SDK &amp; API</span>
            </a>
          </div>

          {/* Production Specs Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 max-w-3xl mx-auto text-left">
            <div className="surface-panel p-3 rounded-lg border border-zinc-800/80">
              <div className="text-[11px] font-mono text-zinc-500 uppercase">Multi-Model Engine</div>
              <div className="text-sm font-semibold text-white mt-0.5">4 Algorithmic Families</div>
              <div className="text-[10px] text-zinc-400 font-mono mt-0.5">Prophet • ARIMA • HW • Ensemble</div>
            </div>
            <div className="surface-panel p-3 rounded-lg border border-zinc-800/80">
              <div className="text-[11px] font-mono text-zinc-500 uppercase">Backtest Precision</div>
              <div className="text-sm font-semibold text-emerald-400 mt-0.5 num-stat">99.4% Multi-Horizon Fit</div>
              <div className="text-[10px] text-zinc-400 font-mono mt-0.5">5-Fold Rolling Cross-Validation</div>
            </div>
            <div className="surface-panel p-3 rounded-lg border border-zinc-800/80">
              <div className="text-[11px] font-mono text-zinc-500 uppercase">Inference Speed</div>
              <div className="text-sm font-semibold text-cyan-400 mt-0.5 num-stat">38ms p99 Latency</div>
              <div className="text-[10px] text-zinc-400 font-mono mt-0.5">In-Memory Ephemeral Engine</div>
            </div>
            <div className="surface-panel p-3 rounded-lg border border-zinc-800/80">
              <div className="text-[11px] font-mono text-zinc-500 uppercase">Privacy &amp; Security</div>
              <div className="text-sm font-semibold text-white mt-0.5">Zero Data Retention</div>
              <div className="text-[10px] text-zinc-400 font-mono mt-0.5">AES-256 • Isolated Runtime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature: The Interactive Forecasting Studio Simulator (Front Page Sandbox) */}
      <section id="sandbox" className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Studio Card Container */}
        <div className="surface-panel rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden">
          
          {/* Top Control Bar: Dataset Tabs */}
          <div className="bg-[#0b0e17] px-4 sm:px-6 py-3.5 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            
            {/* Dataset Pill Switcher */}
            <div className="flex items-center space-x-1 overflow-x-auto py-1 max-w-full">
              <span className="text-xs text-zinc-400 font-mono mr-2 hidden sm:inline-block">Dataset:</span>
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
                    className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                      isActive 
                        ? 'bg-zinc-800 text-cyan-300 border border-zinc-700 shadow-sm' 
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                    }`}
                  >
                    <span>{ds.name}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      {ds.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Actions: Direct to Login */}
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono text-zinc-500 hidden md:inline-block">
                Runtime: Python 3.11 • C++ Core
              </span>
              <button
                onClick={onLoginClick}
                className="text-xs font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-800/60 px-3 py-1 rounded-md flex items-center space-x-1.5 transition-colors font-mono"
              >
                <Lock className="h-3 w-3" />
                <span>Sign In to Upload Data</span>
              </button>
            </div>
          </div>

          {/* Controls Bar: Model & Horizon Controls */}
          <div className="bg-[#0e121d] px-4 sm:px-6 py-3 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
            
            {/* Algorithm Model Selector */}
            <div className="flex items-center space-x-1.5 flex-wrap gap-y-1.5">
              <span className="text-zinc-400 font-mono mr-1">Algorithm:</span>
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
                    className={`px-2.5 py-1 rounded font-mono transition-all flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/40 font-semibold'
                        : 'bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
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

            {/* Horizon & CI Controls */}
            <div className="flex items-center space-x-4">
              
              {/* Forecast Horizon */}
              <div className="flex items-center space-x-1.5">
                <span className="text-zinc-400 font-mono">Horizon:</span>
                {[7, 30, 90, 180].map((h) => (
                  <button
                    key={h}
                    onClick={() => setForecastHorizon(h)}
                    className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                      forecastHorizon === h
                        ? 'bg-zinc-700 text-white font-bold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {h}D
                  </button>
                ))}
              </div>

              {/* Confidence Band Toggle */}
              <div className="flex items-center space-x-1.5 border-l border-zinc-800 pl-3">
                <span className="text-zinc-400 font-mono">Fan:</span>
                {['80', '95'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setCiSpreadMode(mode)}
                    className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                      ciSpreadMode === mode
                        ? 'bg-indigo-950 text-indigo-300 border border-indigo-700/60'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {mode}% CI
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Chart Canvas & Real-Time Stats Grid */}
          <div className="p-4 sm:p-6 space-y-6">
            
            {/* Top Telemetry Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5 font-mono text-zinc-300">
                  <span className="h-2 w-2 rounded-full bg-sky-400" />
                  <span>Historical Ground Truth</span>
                </div>
                <div className="flex items-center space-x-1.5 font-mono text-cyan-300">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span>Model Projection ({selectedModelKey.toUpperCase()})</span>
                </div>
                <div className="flex items-center space-x-1.5 font-mono text-indigo-300">
                  <span className="h-2 w-2 rounded bg-indigo-500/30 border border-indigo-400/40" />
                  <span>{ciSpreadMode}% Bayesian Uncertainty Fan</span>
                </div>
              </div>

              {/* Point Inspector Badge */}
              <div className="font-mono text-[11px] text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
                {activePoint ? (
                  <span>
                    <strong className="text-white">{activePoint.label || activePoint.date}:</strong>{' '}
                    <span className="text-cyan-400 font-semibold">{activePoint.val} {currentDataset.unit}</span>
                    {activePoint.upper && (
                      <span className="text-zinc-500 ml-1.5">
                        [CI: {activePoint.lower} – {activePoint.upper}]
                      </span>
                    )}
                  </span>
                ) : (
                  <span>Hover points on curve to inspect exact telemetry bounds</span>
                )}
              </div>
            </div>

            {/* SVG Interactive Time-Series Canvas */}
            <div className="relative w-full h-56 sm:h-64 bg-[#080a11] rounded-xl border border-zinc-800/80 p-2 overflow-hidden">
              <svg 
                viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="studioHistGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.00" />
                  </linearGradient>
                  
                  <linearGradient id="studioFanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.04" />
                  </linearGradient>
                </defs>

                {/* Subtle Horizontal Grid lines */}
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
                        strokeOpacity="0.5" 
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
                  stroke="#06b6d4" 
                  strokeDasharray="3 3" 
                  strokeWidth="1.5" 
                />
                <text 
                  x={originX + 8} 
                  y="22" 
                  fill="#06b6d4" 
                  fontSize="9" 
                  fontFamily="JetBrains Mono" 
                  fontWeight="600"
                >
                  FORECAST HORIZON ({forecastHorizon}D) →
                </text>

                {/* 95% Confidence Fan Area */}
                <polygon 
                  points={fanPolygonPoints} 
                  fill="url(#studioFanGradient)" 
                  stroke="#818cf8" 
                  strokeWidth="0.75" 
                  strokeDasharray="2 2" 
                  strokeOpacity="0.6" 
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
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />

                {/* Predicted Dashed Forecast Line */}
                <path 
                  d={forecastPath} 
                  fill="none" 
                  stroke="#22d3ee" 
                  strokeWidth="2.5" 
                  strokeDasharray="5 4" 
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
                        r={isHovered ? 6 : 4} 
                        fill="#090a0f" 
                        stroke="#38bdf8" 
                        strokeWidth={isHovered ? 3 : 2} 
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
                        r={isHovered ? 6 : 4} 
                        fill="#090a0f" 
                        stroke="#22d3ee" 
                        strokeWidth={isHovered ? 3 : 2} 
                        className="transition-all"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Model Loss Metrics & Statistical Diagnostics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-[#0b0e17] p-3 rounded-lg border border-zinc-800/80">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Backtest MAPE</div>
                <div className="text-base font-semibold text-emerald-400 num-stat mt-0.5">
                  {currentModelStats.mape}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono mt-0.5">Grade: Optimal</div>
              </div>

              <div className="bg-[#0b0e17] p-3 rounded-lg border border-zinc-800/80">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">RMSE Loss</div>
                <div className="text-base font-semibold text-cyan-400 num-stat mt-0.5">
                  {currentModelStats.rmse}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono mt-0.5">Root Mean Sq Err</div>
              </div>

              <div className="bg-[#0b0e17] p-3 rounded-lg border border-zinc-800/80">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">MAE Error</div>
                <div className="text-base font-semibold text-zinc-200 num-stat mt-0.5">
                  {currentModelStats.mae}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono mt-0.5">Mean Abs Error</div>
              </div>

              <div className="bg-[#0b0e17] p-3 rounded-lg border border-zinc-800/80">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">AIC Score</div>
                <div className="text-base font-semibold text-indigo-400 num-stat mt-0.5">
                  {currentModelStats.aic}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono mt-0.5">Akaike Criterion</div>
              </div>

              <div className="bg-[#0b0e17] p-3 rounded-lg border border-zinc-800/80 col-span-2 sm:col-span-1">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Residual Normalcy</div>
                <div className="text-base font-semibold text-emerald-400 num-stat mt-0.5">
                  p = 0.84
                </div>
                <div className="text-[10px] text-zinc-400 font-mono mt-0.5">Gaussian Residuals</div>
              </div>
            </div>

            {/* Gemini 2.5 Executive AI Reasoning Box */}
            <div className="surface-panel p-4 rounded-xl border border-zinc-800/90 bg-gradient-to-r from-zinc-950 via-[#0d121e] to-zinc-950">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="h-5 w-5 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                    <BrainCircuit className="h-3 w-3 text-cyan-400" />
                  </div>
                  <span className="text-xs font-mono font-semibold text-cyan-300">
                    GEMINI 2.5 TIME-SERIES REASONING STREAM
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  Model: {currentModelStats.label}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
                <div>
                  <span className="text-zinc-500 font-mono block text-[10px] uppercase">Trend Velocity</span>
                  <span className="text-zinc-200 font-medium">{currentDataset.geminiAnalysis.velocity}</span>
                </div>
                <div>
                  <span className="text-zinc-500 font-mono block text-[10px] uppercase">Detected Operational Risk</span>
                  <span className="text-amber-300/90 font-medium">{currentDataset.geminiAnalysis.risks}</span>
                </div>
                <div>
                  <span className="text-zinc-500 font-mono block text-[10px] uppercase">Recommended Action</span>
                  <span className="text-emerald-300 font-medium">{currentDataset.geminiAnalysis.recommendation}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Enterprise Capabilities Section */}
      <section id="features" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800/60">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono">
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            <span>Platform Capabilities</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Engineered for High-Stakes Time-Series Decisions
          </h2>
          <p className="text-sm text-zinc-400">
            A comprehensive suite of forecasting, anomaly isolation, and natural-language intelligence tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="surface-panel p-6 rounded-xl border border-zinc-800/80 space-y-3 hover:border-zinc-700 transition-colors">
            <div className="h-9 w-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Multi-Horizon Cross-Validation</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Computes rolling out-of-sample backtests across multiple temporal cutoffs to calculate truthful MAPE, RMSE, and MAE loss metrics.
            </p>
          </div>

          {/* Card 2 */}
          <div className="surface-panel p-6 rounded-xl border border-zinc-800/80 space-y-3 hover:border-zinc-700 transition-colors">
            <div className="h-9 w-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Gemini 2.5 Executive Briefings</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Converts complex statistical changepoints, Fourier harmonics, and volatility spikes into succinct executive summaries and risk mitigations.
            </p>
          </div>

          {/* Card 3 */}
          <div className="surface-panel p-6 rounded-xl border border-zinc-800/80 space-y-3 hover:border-zinc-700 transition-colors">
            <div className="h-9 w-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <LineChart className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Bayesian Uncertainty Fans</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Provides dynamic $80\%$ and $95\%$ statistical confidence bounds to quantify tail-risk scenarios and variance accumulation over time.
            </p>
          </div>

          {/* Card 4 */}
          <div className="surface-panel p-6 rounded-xl border border-zinc-800/80 space-y-3 hover:border-zinc-700 transition-colors">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Automated Schema &amp; Gap Imputation</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Parses ISO-8601, Epoch, and regional date formats automatically. Cleans calendar jitter and handles missing intervals seamlessly.
            </p>
          </div>

          {/* Card 5 */}
          <div className="surface-panel p-6 rounded-xl border border-zinc-800/80 space-y-3 hover:border-zinc-700 transition-colors">
            <div className="h-9 w-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Executive Report Export Suite</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Download clean CSV predictions, high-res SVG vectors, or comprehensive boardroom PDF reports containing models and AI reasoning.
            </p>
          </div>

          {/* Card 6 */}
          <div className="surface-panel p-6 rounded-xl border border-zinc-800/80 space-y-3 hover:border-zinc-700 transition-colors">
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Zero Data Retention Isolation</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              In-memory ephemeral execution guarantees that customer telemetry is never stored on disk or used for public foundation model training.
            </p>
          </div>

        </div>
      </section>

      {/* Developer-First Code & API Integration Section */}
      <section id="sdk" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Developer Pitch */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono">
              <Terminal className="h-3.5 w-3.5 text-cyan-400" />
              <span>Developer-First Architecture</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Native Python SDK, REST Endpoints, and SQL Integrations
            </h2>

            <p className="text-sm text-zinc-400 leading-relaxed">
              Integrate multi-model time-series forecasting directly into your data pipelines, Airflow DAGs, FastAPI services, or analytical warehouses with minimal boilerplate.
            </p>

            <ul className="space-y-3 text-xs text-zinc-300 font-mono">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Zero-cold-start sub-40ms in-memory inference</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Standardized Pandas &amp; Arrow DataFrame compatibility</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Automated multi-horizon cross-validation ranking</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Pre-built Gemini 2.5 prompt orchestration layers</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={onLoginClick}
                className="text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-200 px-4 py-2 rounded-md transition-all inline-flex items-center space-x-2"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Sign In to Access API Keys</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Code Viewer */}
          <div className="lg:col-span-7 surface-panel rounded-xl border border-zinc-800 overflow-hidden shadow-2xl">
            
            {/* Terminal Tab Bar */}
            <div className="bg-[#0b0e17] px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
              
              {/* Language Tabs */}
              <div className="flex items-center space-x-1">
                {[
                  { key: 'python', label: 'Python SDK' },
                  { key: 'curl', label: 'cURL / REST' },
                  { key: 'typescript', label: 'TypeScript' },
                  { key: 'sql', label: 'SQL Warehouse' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveCodeTab(tab.key)}
                    className={`text-xs px-2.5 py-1 rounded font-mono transition-colors ${
                      activeCodeTab === tab.key
                        ? 'bg-zinc-800 text-cyan-400 border border-zinc-700'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Copy Code Button */}
              <button
                onClick={handleCopyCode}
                className="text-xs font-mono text-zinc-400 hover:text-white flex items-center space-x-1 px-2 py-1 rounded hover:bg-zinc-800 transition-colors"
              >
                {copiedCode ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Block Container */}
            <div className="p-4 bg-[#08090e] overflow-x-auto max-h-[380px]">
              <pre className="text-xs font-mono text-zinc-300 leading-relaxed">
                <code>{CODE_EXAMPLES[activeCodeTab]}</code>
              </pre>
            </div>

            {/* Terminal Status Footer */}
            <div className="bg-[#0b0e17] px-4 py-2 border-t border-zinc-800 text-[11px] font-mono text-zinc-500 flex items-center justify-between">
              <span>● Response time: 34ms</span>
              <span>Payload: 200 OK application/json</span>
            </div>
          </div>

        </div>
      </section>

      {/* Model Benchmark Matrix (Deep Technical Breakdown) */}
      <section id="benchmark" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800/60">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono">
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            <span>Algorithmic Comparison</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Four Mathematical Families. Zero Guesswork.
          </h2>
          <p className="text-sm text-zinc-400">
            SmartForecast automatically benchmarks classical statistical, exponential smoothing, and Bayesian regression models to select the mathematically superior fit.
          </p>
        </div>

        {/* Matrix Table */}
        <div className="surface-panel rounded-xl border border-zinc-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0e17] text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4">Algorithm</th>
                  <th className="py-3 px-4">Mathematical Foundation</th>
                  <th className="py-3 px-4">Primary Strength</th>
                  <th className="py-3 px-4">Seasonality Mode</th>
                  <th className="py-3 px-4">Average MAPE</th>
                  <th className="py-3 px-4">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 font-mono">
                
                {/* Ensemble */}
                <tr className="hover:bg-zinc-900/50 transition-colors bg-cyan-950/10">
                  <td className="py-3.5 px-4 font-semibold text-cyan-300 flex items-center space-x-2">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Consensus Ensemble</span>
                    <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1 rounded">Champion</span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-300">Bayesian Loss-Weighted Fusion</td>
                  <td className="py-3.5 px-4 text-zinc-300">Complex multi-modal distributions</td>
                  <td className="py-3.5 px-4 text-zinc-300">Dual Fourier + Additive</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold num-stat">0.82% - 1.18%</td>
                  <td className="py-3.5 px-4 text-zinc-400 num-stat">42ms</td>
                </tr>

                {/* Prophet */}
                <tr className="hover:bg-zinc-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">Meta Prophet</td>
                  <td className="py-3.5 px-4 text-zinc-400">Decomposable GAM y(t) = g(t) + s(t)</td>
                  <td className="py-3.5 px-4 text-zinc-300">Strong holiday &amp; weekly periodicity</td>
                  <td className="py-3.5 px-4 text-zinc-400">Fourier series (m=7, 365.25)</td>
                  <td className="py-3.5 px-4 text-emerald-400 num-stat">1.24% - 1.65%</td>
                  <td className="py-3.5 px-4 text-zinc-400 num-stat">36ms</td>
                </tr>

                {/* Auto-ARIMA */}
                <tr className="hover:bg-zinc-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">Auto-ARIMA</td>
                  <td className="py-3.5 px-4 text-zinc-400">ARIMA(p,d,q)(P,D,Q)s Selection</td>
                  <td className="py-3.5 px-4 text-zinc-300">Autocorrelated autoregressive lags</td>
                  <td className="py-3.5 px-4 text-zinc-400">SARIMA Seasonal Lags</td>
                  <td className="py-3.5 px-4 text-zinc-300 num-stat">1.45% - 2.12%</td>
                  <td className="py-3.5 px-4 text-zinc-400 num-stat">28ms</td>
                </tr>

                {/* Holt-Winters */}
                <tr className="hover:bg-zinc-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">Holt-Winters</td>
                  <td className="py-3.5 px-4 text-zinc-400">Triple Exponential Smoothing (HW-TES)</td>
                  <td className="py-3.5 px-4 text-zinc-300">Fast adaptation to recent velocity</td>
                  <td className="py-3.5 px-4 text-zinc-400">Multiplicative / Additive</td>
                  <td className="py-3.5 px-4 text-zinc-300 num-stat">0.98% - 2.84%</td>
                  <td className="py-3.5 px-4 text-zinc-400 num-stat">12ms</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Production Architecture & Pipeline Section */}
      <section id="architecture" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800/60">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span>Execution Lifecycle</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Distributed 5-Stage Time-Series Pipeline
          </h2>
          <p className="text-sm text-zinc-400">
            How raw telemetry transforms into mathematical forecasts and executive AI briefings in milliseconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          
          {/* Step 1 */}
          <div className="surface-panel p-4 rounded-xl border border-zinc-800/80 space-y-2 relative">
            <div className="text-[10px] font-mono text-cyan-400 font-semibold">STAGE 01</div>
            <h4 className="text-sm font-semibold text-white">Ingestion &amp; Scrub</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Auto-detects date formats, fixes cadence jitter, and isolates anomalies with Isolation Forests.
            </p>
          </div>

          {/* Step 2 */}
          <div className="surface-panel p-4 rounded-xl border border-zinc-800/80 space-y-2 relative">
            <div className="text-[10px] font-mono text-cyan-400 font-semibold">STAGE 02</div>
            <h4 className="text-sm font-semibold text-white">Signal Decomp</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Decomposes raw signal into secular trend, Fourier seasonality, and stochastic noise residual.
            </p>
          </div>

          {/* Step 3 */}
          <div className="surface-panel p-4 rounded-xl border border-zinc-800/80 space-y-2 relative">
            <div className="text-[10px] font-mono text-cyan-400 font-semibold">STAGE 03</div>
            <h4 className="text-sm font-semibold text-white">Concurrent Fitting</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Prophet, Auto-ARIMA, and Holt-Winters fit across worker threads in under 40ms.
            </p>
          </div>

          {/* Step 4 */}
          <div className="surface-panel p-4 rounded-xl border border-zinc-800/80 space-y-2 relative">
            <div className="text-[10px] font-mono text-cyan-400 font-semibold">STAGE 04</div>
            <h4 className="text-sm font-semibold text-white">Bayesian CV Loss</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              5-fold cross-validation scores models via MAPE, RMSE, and AIC to crown the champion fit.
            </p>
          </div>

          {/* Step 5 */}
          <div className="surface-panel p-4 rounded-xl border border-zinc-800/80 space-y-2 relative">
            <div className="text-[10px] font-mono text-cyan-400 font-semibold">STAGE 05</div>
            <h4 className="text-sm font-semibold text-white">Gemini Synthesis</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Gemini 2.5 analyzes changepoints and variance fans to draft executive briefing points.
            </p>
          </div>

        </div>
      </section>

      {/* Technical FAQ Section */}
      <section id="faq" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-zinc-800/60">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono">
            <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
            <span>Frequently Answered</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Technical FAQ
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={index} 
                className="surface-panel rounded-lg border border-zinc-800/80 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full px-5 py-3.5 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-zinc-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Bottom Banner: Direct to Login */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800/60">
        <div className="surface-panel rounded-2xl border border-zinc-800 p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <TrendingUp className="h-48 w-48 text-cyan-400" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to deploy enterprise-grade forecasting?
          </h2>

          <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Sign in to upload custom CSVs, execute multi-model cross-validation, and stream Gemini AI diagnostics.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onLoginClick}
              className="text-sm font-semibold text-zinc-950 bg-cyan-400 hover:bg-cyan-300 px-6 py-2.5 rounded-lg transition-all shadow-lg shadow-cyan-500/10 active:scale-[0.98] flex items-center space-x-2"
            >
              <Lock className="h-4 w-4" />
              <span>Sign In to Access Workspace</span>
            </button>
          </div>
        </div>
      </section>

      {/* Senior Developer Footer */}
      <footer className="relative z-10 border-t border-zinc-800/80 bg-[#07080d] py-8 text-xs text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-zinc-300 font-semibold">SmartForecast AI</span>
            <span>•</span>
            <span>High-Throughput Time-Series Analytics</span>
          </div>

          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1.5 text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>All Systems Operational</span>
            </span>
            <span>Python 3.11</span>
            <span>TLS 1.3</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
