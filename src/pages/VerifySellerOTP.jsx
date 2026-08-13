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
          navigate('/dashboard/sellerboard'); // Ameverify, wapeleke dashboard
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
        const storeRes = await api.get('/stores/', { params: { owner_id: profileRes.data.id } });
        if (storeRes.data && storeRes.data.length > 0) {
          navigate(`/dashboard/sellerboard/${storeRes.data[0].id}`);
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
    <div className="login-container">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="login-right-panel" style={{ maxWidth: '400px', margin: '80px auto' }}>
        <div className="login-header">
          <h2 className="login-title">Verify Your Seller Account</h2>
          <p className="login-subtitle">
            We have sent a 6-digit OTP to your registered email. Enter it below to verify your identity.
          </p>
        </div>

        <form onSubmit={handleVerify} className="login-form">
          <div className="login-form-group">
            <label className="login-label">OTP Code</label>
            <input
              type="text"
              required
              value={otp}
              maxLength="6"
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              className="login-input"
              placeholder="Enter 6-digit OTP"
              style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '20px' }}
            />
          </div>

          <button type="submit" disabled={loading} className="login-submit-btn">
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="login-footer" style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between' }}>
          <span onClick={handleResendOTP} className="login-register-link" style={{ cursor: 'pointer' }}>
            {resendLoading ? 'Sending...' : 'Resend OTP'}
          </span>
        </div>
      </div>
    </div>
  );
}