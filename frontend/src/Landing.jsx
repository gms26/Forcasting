import React from 'react';
import { 
  TrendingUp, 
  ArrowRight, 
  Activity, 
  BrainCircuit, 
  BarChart3, 
  ShieldCheck,
  Zap,
  LineChart,
  Globe
} from 'lucide-react';

export default function Landing({ onLoginClick }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 forecasting-radial-mesh pointer-events-none z-0" />
      <div className="fixed inset-0 forecasting-grid-pattern opacity-40 pointer-events-none z-0" />
      
      {/* Glowing Orbs */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[150px] pointer-events-none animate-pulse-slow z-0" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow z-0" />

      {/* Navigation */}
      <nav className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px] shadow-lg shadow-cyan-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tight text-white">SmartForecast</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                AI 2.5
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={onLoginClick}
            className="text-sm font-semibold text-slate-300 hover:text-white transition-colors hidden sm:block"
          >
            Customer Login
          </button>
          <button 
            onClick={onLoginClick}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-500 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 transition-all flex items-center space-x-2"
          >
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-8 animate-float">
          <Zap className="h-4 w-4 text-amber-400" />
          <span>The Next Generation of Time-Series Intelligence</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight mb-8">
          Predict the Future with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
            Precision AI Models
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12">
          Empower your enterprise with automated machine learning. SmartForecast AI ensembles ARIMA, Meta Prophet, and Holt-Winters algorithms with Gemini LLM reasoning to deliver hyper-accurate predictions.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onLoginClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center space-x-2"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="h-5 w-5" />
          </button>
          <button 
            onClick={onLoginClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-slate-300 bg-slate-900 border border-slate-700 hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center"
          >
            View Live Demo
          </button>
        </div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 border-t border-slate-800/60">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Enterprise-Grade Intelligence</h2>
          <p className="text-slate-400">Everything you need to turn raw data into strategic foresight.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm hover:bg-slate-800/50 transition-colors">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Multi-Model Ensembling</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Automatically benchmark and ensemble Meta Prophet, ARIMA, and Holt-Winters models to find the highest accuracy fit for your specific time-series data.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm hover:bg-slate-800/50 transition-colors">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Gemini AI Insights</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Raw numbers don't tell the whole story. Our integration with Gemini 2.5 automatically generates executive-ready explanations for complex trends and anomalies.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm hover:bg-slate-800/50 transition-colors">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Secure & Compliant</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Built for the enterprise. Enjoy SAML SSO, AES-256 encryption, and SOC 2 Type II compliance to ensure your proprietary metrics remain strictly confidential.
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Preview / CTA */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-24 text-center">
        <div className="p-12 rounded-[2.5rem] bg-gradient-to-b from-blue-900/40 to-slate-950 border border-blue-500/20 shadow-2xl glow-indigo">
          <LineChart className="h-16 w-16 text-cyan-400 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Forecast?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Join 1,400+ data science teams using SmartForecast AI to predict demand, revenue, and infrastructure scale.
          </p>
          <button 
            onClick={onLoginClick}
            className="px-8 py-4 rounded-xl text-base font-bold text-slate-900 bg-white hover:bg-slate-200 transition-all shadow-lg"
          >
            Create Free Enterprise Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 border-t border-slate-800/60 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <TrendingUp className="h-4 w-4 text-cyan-500" />
            <span className="font-semibold text-slate-400">SmartForecast AI</span>
            <span>© 2026 All rights reserved.</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
