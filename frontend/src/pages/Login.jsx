import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isExpired = searchParams.get('expired') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex min-h-screen bg-[#F8FAFC]">
      {/* Left side: Branding Panel */}
      <div class="hidden lg:flex lg:w-1/2 bg-[#0F172A] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle geometric background highlights */}
        <div class="absolute -top-40 -left-40 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-0 w-80 h-80 bg-primary opacity-10 rounded-full blur-3xl"></div>

        <div class="flex items-center space-x-3 z-10">
          <div class="p-2.5 bg-primary rounded-xl shadow-lg">
            <ShieldCheck class="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold tracking-tight">SecureAssess</h1>
            <p class="text-xs text-slate-400 font-medium">Enterprise Online Assessment Platform</p>
          </div>
        </div>

        <div class="z-10 space-y-6">
          <h2 class="text-4xl font-semibold leading-tight">
            The standard in <br />
            secure, proctored examinations.
          </h2>
          <p class="text-slate-300 max-w-md text-base leading-relaxed">
            Protect assessment integrity with automated AI-proctoring, active tab and screen-share tracking, and real-time proctor supervision.
          </p>
          <div class="flex items-center space-x-4 pt-4">
            <div class="flex -space-x-2">
              <div class="w-9 h-9 rounded-full bg-slate-700 border-2 border-[#0F172A] flex items-center justify-center text-xs font-semibold">HR</div>
              <div class="w-9 h-9 rounded-full bg-slate-600 border-2 border-[#0F172A] flex items-center justify-center text-xs font-semibold">SA</div>
              <div class="w-9 h-9 rounded-full bg-primary border-2 border-[#0F172A] flex items-center justify-center text-xs font-semibold">+8k</div>
            </div>
            <p class="text-xs text-slate-400">Trusted by top enterprises and universities worldwide.</p>
          </div>
        </div>

        <div class="z-10 text-xs text-slate-500">
          &copy; {new Date().getFullYear()} SecureAssess Inc. All rights reserved.
        </div>
      </div>

      {/* Right side: Login Panel */}
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div class="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-premium p-10">
          
          <div class="mb-8">
            <div class="flex lg:hidden items-center space-x-2 mb-6">
              <ShieldCheck class="w-8 h-8 text-primary" />
              <span class="text-xl font-bold text-[#0F172A]">SecureAssess</span>
            </div>
            <h3 class="text-2xl font-bold text-[#0F172A] mb-1">Sign In</h3>
            <p class="text-sm text-slate-500">Access your assessment dashboard</p>
          </div>

          {error && (
            <div class="flex items-start space-x-2.5 p-3.5 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm mb-6 animate-pulse">
              <AlertCircle class="w-5 h-5 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isExpired && !error && (
            <div class="flex items-start space-x-2.5 p-3.5 bg-amber-50 border border-amber-100 text-amber-800 rounded-xl text-sm mb-6">
              <AlertCircle class="w-5 h-5 mt-0.5 shrink-0" />
              <span>Your session has expired. Please sign in again.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} class="space-y-6">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="email">
                Email Address
              </label>
              <div class="relative">
                <Mail class="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  class="w-full pl-11 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-sm font-semibold text-slate-700" htmlFor="password">
                  Password
                </label>
                <a
                  href="/forgot-password"
                  class="text-xs font-semibold text-primary hover:text-primary-hover"
                >
                  Forgot password?
                </a>
              </div>
              <div class="relative">
                <Lock class="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  class="w-full pl-11 pr-11 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff class="w-4 h-4" /> : <Eye class="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              class="w-full py-2.5 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 transition-all flex items-center justify-center shadow-lg shadow-primary/10 hover:shadow-primary/20"
            >
              {loading ? (
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div class="mt-8 pt-6 border-t border-slate-100 text-center">
            <p class="text-xs text-slate-500">
              Need to verify your email?{' '}
              <a href="/verify-email" class="font-semibold text-primary hover:text-primary-hover">
                Verify Account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
