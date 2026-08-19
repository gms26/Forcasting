import React, { useState } from 'react';
import axios from 'axios';
import LogoF from './components/LogoF';
import { 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  X,
  KeyRound,
  Info
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Login({ setToken, setUser, onBack }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccessNotice, setAuthSuccessNotice] = useState('');

  // Password reset modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setAuthSuccessNotice('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid email address.');
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

      setAuthSuccessNotice('Authentication successful. Opening your workspace...');

      setTimeout(() => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        if (setUser) setUser(userData);
        setToken(token);
      }, 300);

    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Authentication failed. Please verify your credentials.';
      setError(errorMsg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070c18] text-[#f1f5f9] flex flex-col justify-between relative selection:bg-cyan-500 selection:text-[#070c18]">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 ai-grid-pattern opacity-80" />
        <div className="absolute inset-0 ai-radial-glow" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer group" 
          onClick={onBack}
        >
          <div className="h-10 w-10 rounded-xl bg-[#0d1e38] border border-[#1e3a5f] flex items-center justify-center p-1.5 shadow-md shadow-cyan-500/10 group-hover:border-cyan-400 transition-colors">
            <LogoF className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white">SmartForecast</span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60">
                AI
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Predictive Workspace</span>
          </div>
        </div>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#0d1e38] border border-[#1e3a5f] hover:border-cyan-500/40 transition-all shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </button>
        )}
      </header>

      {/* Main Centered Login Card */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6 py-8 my-auto">
        <div className="ai-card p-8 sm:p-10 shadow-2xl border border-[#1e3a5f]">
          
          {/* Top Logo & Welcome */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex h-14 w-14 rounded-2xl bg-[#0d1e38] border border-[#1e3a5f] items-center justify-center p-2 mb-1 shadow-lg shadow-cyan-500/15">
              <LogoF className="h-8 w-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
              {isRegister 
                ? 'Sign up to start forecasting with multi-model algorithms and Gemini AI.' 
                : 'Sign in to access your predictive analytics dashboard.'}
            </p>
          </div>

          {/* Render Wakeup Notice */}
          <div className="mb-5 p-3.5 rounded-xl bg-[#091830] border border-cyan-500/40 text-cyan-300 text-xs flex items-start space-x-2.5 shadow-sm">
            <Info className="h-4 w-4 shrink-0 text-cyan-400 mt-0.5" />
            <span className="leading-relaxed">
              <strong>Note:</strong> The backend is hosted on Render free tier. If the server is asleep, the first request may take up to 50 seconds to wake up. Please be patient while authenticating.
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-start space-x-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {authSuccessNotice && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-start space-x-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>{authSuccessNotice}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    required
                    className="w-full bg-[#080e1b] border border-[#1e3a5f] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white rounded-xl px-4 py-3 text-sm transition-all placeholder:text-slate-500 outline-none"
                  />
                  <User className="h-4 w-4 text-slate-500 absolute right-4 top-3.5" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                Work Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full bg-[#080e1b] border border-[#1e3a5f] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white rounded-xl px-4 py-3 text-sm transition-all placeholder:text-slate-500 outline-none"
                />
                <Mail className="h-4 w-4 text-slate-500 absolute right-4 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Password
                </label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs text-cyan-400 hover:underline font-semibold transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#080e1b] border border-[#1e3a5f] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white rounded-xl px-4 py-3 text-sm transition-all placeholder:text-slate-500 outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500 hover:text-white absolute right-4 top-3.5 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-ai-radiant w-full flex items-center justify-center space-x-2 py-3.5 px-5 rounded-xl text-sm disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <>
                    <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Toggle Mode Footer */}
          <div className="mt-6 pt-5 border-t border-[#14233c] text-center text-xs sm:text-sm text-slate-400">
            <span>
              {isRegister ? 'Already have an account?' : "Don't have an account yet?"}
            </span>{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                setAuthSuccessNotice('');
              }}
              className="text-cyan-400 hover:underline font-bold ml-1 transition-colors"
            >
              {isRegister ? 'Sign In' : 'Sign Up'}
            </button>
          </div>

        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="ai-card p-7 sm:p-9 max-w-md w-full shadow-2xl relative space-y-4 border border-[#1e3a5f]">
            
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotSubmitted(false);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-[#0d1e38] border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Reset Password</h3>
                <p className="text-xs text-slate-400">Recover access to your account</p>
              </div>
            </div>

            {forgotSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs space-y-2">
                <div className="font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Reset Link Sent</span>
                </div>
                <p className="text-slate-300 text-xs">
                  We have sent instructions to <strong className="text-white font-mono">{forgotEmail}</strong> if an account exists.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSubmitted(false);
                  }}
                  className="btn-ai-radiant mt-3 w-full py-2.5 text-xs rounded-xl"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (forgotEmail) setForgotSubmitted(true);
                }}
                className="space-y-4 text-sm"
              >
                <p className="text-slate-400 text-xs leading-relaxed">
                  Enter your email address and we will send you a secure recovery link to reset your password.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full bg-[#080e1b] border border-[#1e3a5f] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white rounded-xl px-4 py-3 text-xs transition-colors placeholder:text-slate-500 outline-none"
                />
                <button
                  type="submit"
                  className="btn-ai-radiant w-full py-3 px-4 rounded-xl text-xs"
                >
                  Send Reset Link
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between text-xs text-slate-400 border-t border-[#1e3a5f]">
        <div className="flex items-center space-x-2">
          <LogoF className="h-4 w-4" />
          <span className="font-bold text-white">SmartForecast AI</span>
        </div>
        <span className="font-mono">Enterprise Forecasting Workspace</span>
      </footer>

    </div>
  );
}
