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
    if (!pwd) return { score: 0, text: 'Empty', color: 'bg-slate-700' };
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, text: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, text: 'Fair', color: 'bg-amber-400' };
    if (score === 3) return { score: 3, text: 'Strong', color: 'bg-[#a2fff4]' };
    return { score: 4, text: 'Very Strong', color: 'bg-[#6aceff]' };
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
    <div className="min-h-screen bg-[#00111a] text-[#f1f5f9] flex flex-col justify-between relative overflow-x-hidden w-full max-w-full font-sans selection:bg-[#a2fff4] selection:text-[#00131c]">
      
      {/* Ambient Deep Navy & Ice-Cyan Glow Background (raseraa0 style) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 rasera-mesh-pattern opacity-70" />
        <div className="absolute inset-0 rasera-radial-glow" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-[#a2fff4]/10 via-[#005282]/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <div 
          className="flex items-center space-x-3.5 cursor-pointer group" 
          onClick={onBack}
        >
          <div className="h-10 w-10 rounded-xl bg-[#002238] border border-[#004f7c] shadow-md flex items-center justify-center group-hover:border-[#a2fff4] transition-all p-1.5">
            <LogoF className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-white">SmartForecast</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#a2fff4]/15 text-[#a2fff4] border border-[#a2fff4]/30">
                AI
              </span>
            </div>
            <span className="text-xs text-[#97dcff]/70 font-medium">Predictive Workspace</span>
          </div>
        </div>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-semibold text-[#cbd5e1] hover:text-white flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#002238] border border-[#004775] hover:border-[#005f9e] transition-all shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </button>
        )}
      </header>

      {/* Main Centered Login Card */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6 py-8 my-auto">
        <div className="rasera-card rounded-3xl p-7 sm:p-9 shadow-2xl">
          
          {/* Top Logo & Friendly Welcome */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex h-14 w-14 rounded-2xl bg-[#002238] border border-[#004f7c] items-center justify-center shadow-lg p-2.5 mb-2 shadow-[#a2fff4]/5">
              <LogoF className="h-8 w-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {isRegister ? 'Create Your Account' : 'Welcome Back'}
            </h1>
            <p className="text-sm text-[#94a3b8] max-w-xs mx-auto leading-relaxed">
              {isRegister 
                ? 'Sign up to start forecasting with multi-model algorithms and AI insights.' 
                : 'Enter your credentials to access your forecasting workspace.'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-sm flex items-start space-x-2.5">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {authSuccessNotice && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#003429]/80 border border-[#a2fff4]/50 text-[#a2fff4] text-sm flex items-start space-x-2.5">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-[#a2fff4]" />
              <span>{authSuccessNotice}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isRegister && (
              <div>
                <label className="block text-sm font-semibold text-[#cbd5e1] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    required
                    className="w-full bg-[#001726] border border-[#003b64] focus:border-[#a2fff4] focus:ring-2 focus:ring-[#a2fff4]/20 text-white rounded-xl px-4 py-3 text-sm transition-all placeholder:text-[#94a3b8]/50 outline-none"
                  />
                  <User className="h-4 w-4 text-[#94a3b8] absolute right-3.5 top-3.5" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#cbd5e1] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full bg-[#001726] border border-[#003b64] focus:border-[#a2fff4] focus:ring-2 focus:ring-[#a2fff4]/20 text-white rounded-xl px-4 py-3 text-sm transition-all placeholder:text-[#94a3b8]/50 outline-none"
                />
                <Mail className="h-4 w-4 text-[#94a3b8] absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-[#cbd5e1]">
                  Password
                </label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs text-[#a2fff4] hover:underline font-semibold transition-colors"
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
                  className="w-full bg-[#001726] border border-[#003b64] focus:border-[#a2fff4] focus:ring-2 focus:ring-[#a2fff4]/20 text-white rounded-xl px-4 py-3 text-sm transition-all placeholder:text-[#94a3b8]/50 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#94a3b8] hover:text-white absolute right-3.5 top-3.5 transition-colors"
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
                    <span className="text-[#94a3b8]">Password strength:</span>
                    <span className="text-white font-semibold">{pwdStrength.text}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 h-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`rounded-full transition-colors ${
                          pwdStrength.score >= step ? pwdStrength.color : 'bg-[#002f4d]'
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
                className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#a2fff4] via-[#6aceff] to-[#3b82f6] hover:opacity-95 text-[#00131c] font-extrabold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[#6aceff]/20 active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2 font-bold">
                    <div className="h-4 w-4 border-2 border-[#00131c] border-t-transparent rounded-full animate-spin" />
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
          <div className="mt-6 pt-5 border-t border-[#003b64] text-center text-sm text-[#94a3b8]">
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
              className="text-[#a2fff4] hover:underline font-bold ml-1 transition-colors"
            >
              {isRegister ? 'Sign In' : 'Sign Up'}
            </button>
          </div>

        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="rasera-card rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-4">
            
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotSubmitted(false);
              }}
              className="absolute top-5 right-5 text-[#94a3b8] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-[#002f4d] border border-[#00558a] flex items-center justify-center text-[#a2fff4]">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Reset Password</h3>
                <p className="text-xs text-[#94a3b8]">Recover access to your account</p>
              </div>
            </div>

            {forgotSubmitted ? (
              <div className="p-4 rounded-2xl bg-[#003429]/80 border border-[#a2fff4]/50 text-[#a2fff4] text-sm space-y-2">
                <div className="font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-[#a2fff4]" />
                  <span>Reset Link Sent</span>
                </div>
                <p className="text-[#cbd5e1] text-xs">
                  We have sent instructions to <strong className="text-white">{forgotEmail}</strong> if an account exists.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSubmitted(false);
                  }}
                  className="mt-3 w-full py-2.5 bg-gradient-to-r from-[#a2fff4] to-[#6aceff] text-[#00131c] font-bold rounded-xl text-sm transition-opacity hover:opacity-95"
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
                <p className="text-[#94a3b8] text-xs leading-relaxed">
                  Enter your email address and we will send you a secure recovery link to reset your password.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full bg-[#001726] border border-[#003b64] focus:border-[#a2fff4] focus:ring-2 focus:ring-[#a2fff4]/20 text-white rounded-xl px-4 py-3 text-sm transition-colors placeholder:text-[#94a3b8]/50 outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#a2fff4] via-[#6aceff] to-[#3b82f6] text-[#00131c] font-extrabold text-sm transition-opacity hover:opacity-95 shadow-md shadow-[#6aceff]/20"
                >
                  Send Reset Link
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Clean Footer */}
      <footer className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between text-xs text-[#94a3b8] border-t border-[#003b64]">
        <div className="flex items-center space-x-2">
          <LogoF className="h-4 w-4" />
          <span className="font-semibold text-white">SmartForecast AI</span>
        </div>
        <div>
          <span>Enterprise Forecasting Workspace</span>
        </div>
      </footer>

    </div>
  );
}
