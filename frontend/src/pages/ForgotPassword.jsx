import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(true);
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
            <div class="inline-flex p-3 bg-green-50 rounded-2xl text-green-600 mb-4">
              <CheckCircle2 class="w-10 h-10" />
            </div>
            <h3 class="text-xl font-bold text-[#0F172A] mb-2">Check Your Logs</h3>
            <p class="text-sm text-slate-500 mb-6 leading-relaxed">
              We have generated a password reset code for <strong>{email}</strong>. 
              Since this is a sandbox environment, the code has been logged to the <strong>Spring Boot backend console</strong>.
            </p>
            <a
              href={`/reset-password?email=${encodeURIComponent(email)}`}
              class="block w-full py-2.5 bg-primary text-white font-semibold rounded-xl text-sm text-center hover:bg-primary-hover shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all mb-4"
            >
              Enter Reset Code
            </a>
            <a
              href="/login"
              class="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              <ArrowLeft class="w-3.5 h-3.5 mr-1" /> Back to Login
            </a>
          </div>
        ) : (
          <div>
            <div class="mb-6 text-center">
              <h3 class="text-2xl font-bold text-[#0F172A] mb-1">Reset Password</h3>
              <p class="text-sm text-slate-500">Enter your email to receive a recovery code</p>
            </div>

            {error && (
              <div class="p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm mb-6">
                {error}
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

              <button
                type="submit"
                disabled={loading}
                class="w-full py-2.5 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 transition-all flex items-center justify-center shadow-lg shadow-primary/10 hover:shadow-primary/20"
              >
                {loading ? (
                  <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Send Reset Code'
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

export default ForgotPassword;
