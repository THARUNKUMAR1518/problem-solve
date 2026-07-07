import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Key, Lock, Mail, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resetPassword(email, token, newPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex min-h-screen bg-[#F8FAFC] items-center justify-center p-8">
      <div class="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-premium p-10">
        <div class="flex items-center space-x-2 mb-8 justify-center">
          <ShieldCheck class="w-8 h-8 text-primary" />
          <span class="text-xl font-bold text-[#0F172A]">SecureAssess</span>
        </div>

        {success ? (
          <div class="text-center">
            <h3 class="text-2xl font-bold text-green-600 mb-2">Password Reset Successful</h3>
            <p class="text-sm text-slate-500 mb-6">
              Your password has been successfully updated. Redirecting you to the login screen...
            </p>
            <div class="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div>
            <div class="mb-6 text-center">
              <h3 class="text-2xl font-bold text-[#0F172A] mb-1">Set New Password</h3>
              <p class="text-sm text-slate-500">Provide the code from the logs to finalize reset</p>
            </div>

            {error && (
              <div class="p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} class="space-y-5">
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
                <label class="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="token">
                  Reset Code (from backend logs)
                </label>
                <div class="relative">
                  <Key class="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="token"
                    type="text"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="RESET-123456"
                    class="w-full pl-11 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="newPassword">
                  New Password
                </label>
                <div class="relative">
                  <Lock class="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="newPassword"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    class="w-full pl-11 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
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
                  'Update Password'
                )}
              </button>
            </form>

            <div class="mt-8 pt-6 border-t border-slate-100 text-center">
              <a
                href="/login"
                class="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                <ArrowLeft class="w-3.5 h-3.5 mr-1" /> Back to Login
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
