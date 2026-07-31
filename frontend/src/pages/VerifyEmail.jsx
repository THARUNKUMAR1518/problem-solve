import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ShieldCheck, Mail, Key, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const VerifyEmail = () => {
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeRequested, setCodeRequested] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setError('');
    setRequestLoading(true);

    try {
      // In a real application, this is a POST api request. Let's make an API call to request email code.
      // Wait, let's create a backend endpoint or trigger mock behavior.
      // We will add `requestEmailVerification` in AuthService, so let's call that endpoint.
      // Wait! We can call a GET/POST endpoint on `/auth/request-verification?email=...` or similar.
      // Let's create an endpoint in AuthController for it or write it in AuthService.
      // Wait, we didn't add the request-verification endpoint to AuthController!
      // Let's see: we have requestEmailVerification in AuthService. We can add a POST endpoint for it or just let the user know they can check logs.
      // Let's check: can we add a simple endpoint to AuthController to trigger request verification?
      // Yes! Let's write the controller endpoint `/api/auth/request-verification` in AuthController soon, or we can write a custom endpoint.
      // Let's call `/auth/request-verification` via Axios.
      await api.post(`/auth/request-verification?email=${encodeURIComponent(email)}`);
      setCodeRequested(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request verification code.');
    } finally {
      setRequestLoading(false);
    }
  };

  const handleSubmitVerification = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await verifyEmail(email, code);
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
            <div class="inline-flex p-3 bg-green-50 rounded-2xl text-green-600 mb-4">
              <CheckCircle2 class="w-10 h-10" />
            </div>
            <h3 class="text-2xl font-bold text-green-600 mb-2">Account Activated</h3>
            <p class="text-sm text-slate-500 mb-4">
              Your email has been verified and your account is active. Redirecting you to the login screen...
            </p>
            <div class="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div>
            <div class="mb-6 text-center">
              <h3 class="text-2xl font-bold text-[#0F172A] mb-1">Verify Email</h3>
              <p class="text-sm text-slate-500">Activate your student or faculty account</p>
            </div>

            {error && (
              <div class="flex items-start space-x-2 p-3.5 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm mb-6">
                <AlertCircle class="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!codeRequested ? (
              <form onSubmit={handleRequestCode} class="space-y-5">
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
                  disabled={requestLoading}
                  class="w-full py-2.5 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 transition-all flex items-center justify-center shadow-lg shadow-primary/10"
                >
                  {requestLoading ? (
                    <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Request Verification Code'
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmitVerification} class="space-y-5">
                <div class="p-3.5 bg-amber-50 border border-amber-100 text-amber-800 rounded-xl text-xs mb-2">
                  Verification code generated. Please inspect the <strong>Spring Boot backend console</strong> to find the code.
                </div>

                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    class="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 text-slate-500 rounded-xl text-sm outline-none"
                  />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="code">
                    Verification Code
                  </label>
                  <div class="relative">
                    <Key class="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="code"
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="VERIFY-123456"
                      class="w-full pl-11 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  class="w-full py-2.5 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 transition-all flex items-center justify-center shadow-lg shadow-primary/10"
                >
                  {loading ? (
                    <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Verify & Activate'
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setCodeRequested(false)}
                  class="w-full py-2 bg-transparent text-slate-600 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-all"
                >
                  Change Email / Re-request Code
                </button>
              </form>
            )}

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

export default VerifyEmail;
