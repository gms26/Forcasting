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
  KeyRound
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Login({ setToken, setUser, onBack }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccessNotice, setAuthSuccessNotice] = useState('');

  // Password reset modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleKeyDown = (e) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  const calculatePasswordStrength = (pwd) => {
    let score = 0;
    if (!pwd) return { score: 0, text: 'Empty', color: 'bg-zinc-700' };
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, text: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, text: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, text: 'Strong', color: 'bg-emerald-500' };
    return { score: 4, text: 'Strong & Secure', color: 'bg-cyan-400' };
  };

  const pwdStrength = calculatePasswordStrength(password);

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

      setAuthSuccessNotice('Success! Entering your forecasting workspace...');

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
    <div className="min-h-screen bg-[#0a0c14] text-slate-100 flex flex-col justify-between relative overflow-x-hidden w-full max-w-full font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Subtle Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 dev-grid-pattern opacity-40" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer group" 
          onClick={onBack}
        >
          <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center shadow-lg group-hover:border-cyan-500/50 transition-colors p-1.5">
            <LogoF className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-white">SmartForecast</span>
            <span className="text-xs text-slate-400 font-medium">Predictive AI Platform</span>
          </div>
        </div>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium text-slate-300 hover:text-white flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </button>
        )}
      </header>

      {/* Main Centered Login Card */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6 py-8 my-auto">
        <div className="surface-panel rounded-3xl border border-slate-800/90 shadow-2xl p-7 sm:p-9 backdrop-blur-xl bg-slate-900/85">
          
          {/* Top Logo & Friendly Welcome */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-indigo-500/10 to-transparent border border-cyan-500/30 items-center justify-center shadow-lg p-2.5 mb-2">
              <LogoF className="h-8 w-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {isRegister ? 'Create Your Account' : 'Welcome Back'}
            </h1>
            <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
              {isRegister 
                ? 'Sign up to start forecasting with multi-model algorithms and AI insights.' 
                : 'Enter your credentials to access your forecasting workspace.'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-200 text-sm flex items-start space-x-2.5">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {authSuccessNotice && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-800/80 text-emerald-200 text-sm flex items-start space-x-2.5">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-emerald-400" />
              <span>{authSuccessNotice}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isRegister && (
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white rounded-xl px-4 py-3 text-sm transition-all placeholder:text-slate-500 outline-none"
                  />
                  <User className="h-4 w-4 text-slate-400 absolute right-3.5 top-3.5" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white rounded-xl px-4 py-3 text-sm transition-all placeholder:text-slate-500 outline-none"
                />
                <Mail className="h-4 w-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-slate-300">
                  Password
                </label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
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
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyDown}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white rounded-xl px-4 py-3 text-sm transition-all placeholder:text-slate-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-200 absolute right-3.5 top-3.5 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {capsLockActive && (
                <div className="text-xs text-amber-400 mt-1.5 flex items-center space-x-1 font-medium">
                  <span>⚠️ Caps Lock is turned on</span>
                </div>
              )}

              {/* Password Strength Meter when Registering */}
              {isRegister && password && (
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Password strength:</span>
                    <span className="text-slate-200 font-semibold">{pwdStrength.text}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 h-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`rounded-full transition-colors ${
                          pwdStrength.score >= step ? pwdStrength.color : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2 font-medium">
                    <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
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
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center text-sm text-slate-400">
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
              className="text-cyan-400 hover:text-cyan-300 font-semibold ml-1 transition-colors"
            >
              {isRegister ? 'Sign In' : 'Sign Up'}
            </button>
          </div>

        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="surface-panel rounded-2xl border border-slate-800 p-6 sm:p-7 max-w-md w-full shadow-2xl relative space-y-4 bg-slate-900">
            
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotSubmitted(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Reset Password</h3>
                <p className="text-xs text-slate-400">Recover access to your account</p>
              </div>
            </div>

            {forgotSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-200 text-sm space-y-2">
                <div className="font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span>Reset Link Sent</span>
                </div>
                <p className="text-slate-300 text-xs">
                  We have sent instructions to <strong className="text-white">{forgotEmail}</strong> if an account is registered.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSubmitted(false);
                  }}
                  className="mt-3 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors"
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
                  Enter your email address and we'll send you a secure link to reset your password.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white rounded-xl px-4 py-3 text-sm transition-colors placeholder:text-slate-500 outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm transition-colors shadow-md"
                >
                  Send Reset Link
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Clean Footer */}
      <footer className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/80">
        <div className="flex items-center space-x-2">
          <LogoF className="h-4 w-4" glow={false} />
          <span>SmartForecast AI</span>
        </div>
        <div>
          <span>Secure Cloud Forecasting</span>
        </div>
      </footer>

    </div>
  );
}
