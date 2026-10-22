import React, { useState, useEffect } from 'react';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

export default function VerifySellerOTP() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();

  // 1. Angalia kama user ni supplier na hajaverify
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        const profileRes = await api.get('/profile/');
        if (profileRes.data.role !== 'supplier') {
          navigate('/dashboard'); // Si supplier, wapeleke dashboard
          return;
        }

               if (profileRes.data.is_otp_verified) {
          // 🔥 MUHIMU: Kagua store kwanza!
          const storeRes = await api.get('/stores/', { params: { owner_id: profileRes.data.id } });
          if (storeRes.data && storeRes.data.length > 0) {
            const store = storeRes.data[0];
            const status = store.verification_status || store.status;
            if (status === 'pending' || status === 'unverified') {
              navigate(`/store-pending/${store.id}`);
            } else {
              navigate(`/dashboard/sellerboard/${store.id}`);
            }
          } else {
            navigate('/create-store');
          }
        }

      } catch (err) {
        console.error("Auth check error:", err);
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  // 2. Tuma OTP kwa email (inatumwa na Backend)
  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      console.log("🔍 [FRONTEND] Sending OTP request to:", '/seller/otp/request/');
      // 🔥 MUHIMU: Ondoa '/api' mbele! axiosConfig ina baseURL: '.../api'
      await api.post('/seller/otp/request/');
      toast.success("OTP imetumwa tena kwenye email yako!");
    } catch (err) {
      console.error("❌ [FRONTEND] OTP request failed:", err.response?.data || err.message);
      toast.error("Imeshindwa kutuma OTP. Jaribu tena.");
    } finally {
      setResendLoading(false);
    }
  };

  // 3. Thibitisha OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Tafadhali ingiza OTP ya tarakimu 6.");
      return;
    }

    setLoading(true);
    try {
      console.log("🔍 [FRONTEND] Verifying OTP:", otp);
      // 🔥 MUHIMU: Ondoa '/api' mbele!
      await api.post('/seller/otp/verify/', { otp });
      toast.success("Imethibitishwa! Unaweza kuingia Dashboard.");
      
      // 4. Pata data upya na uelekeze kwenye supplier dashboard
      const profileRes = await api.get('/profile/');
      const role = profileRes.data.role;

        if (role === 'supplier') {
        const storeRes = await api.get('/stores/', { params: { owner: profileRes.data.id } });
        if (storeRes.data && storeRes.data.length > 0) {
          const store = storeRes.data[0];
          const status = store.verification_status || store.status;
          // 🔥 MUHIMU: Ikiwa inasubiri kupitishwa, mpeleke kwenye Store Pending!
          if (status === 'pending' || status === 'unverified') {
            navigate(`/store-pending/${store.id}`);
          } else {
            navigate(`/dashboard/sellerboard/${store.id}`);
          }
        } else {
          navigate('/create-store');
        }
      }

    } catch (err) {

      console.error("❌ [FRONTEND] OTP verify error:", err.response?.data || err.message);
      toast.error(err.response?.data?.detail || "OTP si sahihi au imeisha muda.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Tuma OTP mara ya kwanza ukurasa unapopakia
  useEffect(() => {
    // Tuma OTP mara ya kwanza ukurasa unapopakia
    handleResendOTP();
  }, []);

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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Verify Your Seller Account
          </h2>
          <p className="mt-3 text-sm text-gray-500 leading-relaxed">
            We have sent a 6-digit OTP to your registered email. Enter it below to verify your identity.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 text-center">
              OTP Code
            </label>
            <input
              type="text"
              required
              value={otp}
              maxLength="6"
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="••••••"
              className="w-full text-center text-2xl sm:text-3xl font-bold tracking-[0.6em] pl-[0.6em] text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl py-4 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-300 placeholder:tracking-[0.4em] placeholder:pl-[0.4em]"
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
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-sm">
          <span className="text-gray-500">Didn't receive the code?</span>
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resendLoading}
            className="font-semibold text-blue-600 hover:text-indigo-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200 hover:underline underline-offset-2"
          >
            {resendLoading ? 'Sending...' : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  );
}