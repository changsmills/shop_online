import React, { useState } from 'react';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
//import '../Login.css'; // Tunaweza kutumia CSS ile ile

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('request'); // 'request' au 'verify'
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  // Step 1: Tuma email kupata OTP
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend endpoint ya kutuma OTP
      const response = await api.post('/password-reset/request/', {
        email: email.trim()
      });

      toast.success("OTP imetumwa kwa email yako! Tafadhali angalia inbox.");
      setStep('verify');
    } catch (err) {
      console.error("❌ Reset error:", err.response?.data || err.message);
      toast.error(err.response?.data?.detail || "Kosa la mtandao. Tafadhali jaribu tena.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Thibitisha OTP na ubadili password
  const handleVerifyAndReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      toast.error("Password zinazolingana! Tafadhali hakikisha.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password lazima iwe na herufi angalau 8.");
      setLoading(false);
      return;
    }

    try {
      // Backend endpoint ya kuthibitisha OTP na kubadili password
      const response = await api.post('/password-reset/verify/', {
        email: email.trim(),
        otp: otp,
        new_password: newPassword
      });

      toast.success("Password imebadilishwa kikamilifu! Sasa unaweza kuingia.");
      
      // Rudi kwenye login baada ya sekunde 2
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error("❌ Verify error:", err.response?.data || err.message);
      toast.error(err.response?.data?.detail || "Kosa la mtandao. Tafadhali jaribu tena.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/dashboard/login');
  };

 return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-10">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-5">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {step === 'request' ? 'Reset Your Password' : 'Verify OTP'}
          </h2>
          <p className="mt-3 text-sm text-gray-500 leading-relaxed">
            {step === 'request'
              ? "Enter your email and we'll send you an OTP to reset your password."
              : 'Enter the OTP sent to your email and set a new password.'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === 'request'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/40'
                  : 'bg-green-500 text-white'
              }`}
            >
              {step === 'verify' ? '✓' : '1'}
            </div>
            <span
              className={`text-xs font-semibold ${
                step === 'request' ? 'text-gray-900' : 'text-green-600'
              }`}
            >
              Email
            </span>
          </div>
          <div
            className={`h-0.5 w-10 rounded transition-colors ${
              step === 'verify' ? 'bg-green-500' : 'bg-gray-200'
            }`}
          />
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === 'verify'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/40'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              2
            </div>
            <span
              className={`text-xs font-semibold ${
                step === 'verify' ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              Verify
            </span>
          </div>
        </div>

        {/* Step 1: Request Reset */}
        {step === 'request' && (
          <form onSubmit={handleRequestReset} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                autoComplete="email"
                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              {loading ? 'Inachakata...' : 'Send Reset OTP'}
            </button>

            <div className="pt-4 border-t border-gray-100 text-center">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-sm font-semibold text-blue-600 hover:text-indigo-700 transition-colors hover:underline underline-offset-2"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Verify OTP & Set New Password */}
        {step === 'verify' && (
          <form onSubmit={handleVerifyAndReset} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                OTP (One-Time Password)
              </label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="••••••"
                maxLength="6"
                className="w-full text-center text-2xl font-bold tracking-[0.6em] pl-[0.6em] text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl py-3.5 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-300 placeholder:tracking-[0.4em] placeholder:pl-[0.4em]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 8 chars)"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 pr-12 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 pr-12 text-gray-900 bg-gray-50 border-2 rounded-xl focus:outline-none focus:bg-white focus:ring-4 transition-all duration-200 placeholder:text-gray-400 ${
                    confirmPassword && confirmPassword !== newPassword
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {confirmPassword && confirmPassword !== newPassword && (
                <p className="text-xs text-red-500 font-medium">Passwords hazilingani</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              {loading ? 'Inachakata...' : 'Reset Password'}
            </button>

            <div className="pt-4 border-t border-gray-100 text-center">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-sm font-semibold text-blue-600 hover:text-indigo-700 transition-colors hover:underline underline-offset-2"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;