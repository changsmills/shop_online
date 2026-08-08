import React, { useState } from 'react';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import '../Login.css'; // Tunaweza kutumia CSS ile ile

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
    <div className="login-container">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="login-right-panel" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div className="login-header">
          <h2 className="login-title">
            {step === 'request' ? 'Reset Your Password' : 'Verify OTP & Set New Password'}
          </h2>
          <p className="login-subtitle">
            {step === 'request' 
              ? 'Enter your email and we\'ll send you an OTP to reset your password.' 
              : 'Enter the OTP sent to your email and set a new password.'}
          </p>
        </div>

        {/* Step 1: Request Reset */}
        {step === 'request' && (
          <form onSubmit={handleRequestReset} className="login-form">
            <div className="login-form-group">
              <label className="login-label">Email</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                placeholder="Enter your registered email"
                autoComplete="email"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="login-submit-btn"
            >
              {loading ? 'Inachakata...' : 'Send Reset OTP'}
            </button>

            <div className="login-footer" style={{ marginTop: '1.5rem' }}>
              <span 
                onClick={handleBackToLogin}
                className="login-register-link"
              >
                ← Back to Login
              </span>
            </div>
          </form>
        )}

        {/* Step 2: Verify OTP & Set New Password */}
        {step === 'verify' && (
          <form onSubmit={handleVerifyAndReset} className="login-form">
            <div className="login-form-group">
              <label className="login-label">OTP (One-Time Password)</label>
              <input 
                type="text" 
                required 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="login-input"
                placeholder="Enter OTP sent to your email"
                maxLength="6"
              />
            </div>

            <div className="login-form-group">
              <label className="login-label">New Password</label>
              <input 
                type="password" 
                required 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="login-input"
                placeholder="Enter new password (min 8 chars)"
                autoComplete="new-password"
              />
            </div>

            <div className="login-form-group">
              <label className="login-label">Confirm Password</label>
              <input 
                type="password" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="login-input"
                placeholder="Confirm new password"
                autoComplete="new-password"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="login-submit-btn"
            >
              {loading ? 'Inachakata...' : 'Reset Password'}
            </button>

            <div className="login-footer" style={{ marginTop: '1.5rem' }}>
              <span 
                onClick={handleBackToLogin}
                className="login-register-link"
              >
                ← Back to Login
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;