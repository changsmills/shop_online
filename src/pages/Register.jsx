import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Lock, ShieldCheck, CheckCircle, Mail, Eye, EyeOff, User } from 'lucide-react'; // 🔥 ONGEZA HII!
import '../Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        toast.dismiss(); // 🔥 Futa toasts zilizopo kabla ya navigate
        navigate("/dashboard/login", { replace: true });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const generateDefaultNameFromEmail = (email) => {
    if (!email) return "Skyfall User";
    
    const emailPrefix = email.split('@')[0];
    let name = emailPrefix.replace(/[._]/g, ' ');
    name = name.replace(/-/g, ' ');
    name = name.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
    
    if (!name || name.length < 2 || /^\d+$/.test(name.replace(/\s/g, ''))) {
      return "Skyfall User";
    }
    
    return name;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!email.trim()) {
      toast.error('Tafadhali weka barua pepe', { duration: 4000 });
      setErrorMessage('Barua pepe inahitajika');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Tafadhali weka barua pepe halali', { duration: 4000 });
      setErrorMessage('Barua pepe si sahihi (mfano: jina@gmail.com)');
      return;
    }
    
    if (!password.trim()) {
      toast.error('Tafadhali weka nenosiri', { duration: 4000 });
      setErrorMessage('Nenosiri inahitajika');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Nenosiri lazima liwe na herufi 6 au zaidi', { duration: 4000 });
      setErrorMessage('Nenosiri lazima iwe na herufi 6+');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Nenosiri hazilingani! Tafadhali kagua tena.', { duration: 4000 });
      setErrorMessage('Manenosiri hayafanani');
      return;
    }

    setLoading(true);
    
    try {
      // 🔥 BADILISHA HAPA: endpoint ya `dj-rest-auth` ni `/auth/registration/`
      const response = await api.post('/auth/registration/', {
        email: email.trim(),
        password1: password,
        password2: confirmPassword,
        username: email.trim(),
        full_name: generateDefaultNameFromEmail(email)
      });

      if (response.data.access_token && response.data.refresh_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
      }

      toast.success(`🎉 Karibu ${generateDefaultNameFromEmail(email)}! Akaunti yako imeundwa.`, { duration: 4000 });
      setIsSuccess(true);
      
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      
      const backendError = err.response?.data;
      let errorMsg = "Hitilafu isiyotarajiwa. Tafadhali jaribu tena.";
      
      if (backendError?.email) {
        errorMsg = backendError.email.join(' ');
      } else if (backendError?.password1) {
        errorMsg = backendError.password1.join(' ');
      } else if (backendError?.non_field_errors) {
        errorMsg = backendError.non_field_errors.join(' ');
      } else if (backendError?.detail) {
        errorMsg = backendError.detail;
      }
      
      toast.error(errorMsg, { duration: 4000 });
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  
  // 🔥 KAZI MPYA: Google Login Success (Kama Login.jsx)
  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("🔍 Google Credential Response:", credentialResponse);
    const token = credentialResponse.credential;

    try {
      const res = await api.post('/auth/google/', { access_token: token });
      const { access, refresh, user } = res.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      toast.success(`Karibu ${user.email || 'Mteja'}!`, { duration: 3000 });
      setTimeout(() => {
        toast.dismiss();
        navigate('/dashboard', { replace: true });
      }, 3000);
    } catch (error) {
      console.error("❌ Google Login Error:", error);
      toast.error("Google login imeshindwa. Jaribu tena.", { duration: 4000 });
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login imeshindwa.", { duration: 4000 });
  };

  return (
    // 🔥 Wrap with GoogleOAuthProvider
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "897025267638-4uq34ithcduiblhn0qfb1cdspl2uovn6.apps.googleusercontent.com"}>
      <div className="register-container">
        <Toaster position="top-center" reverseOrder={false} />

        {/* LEFT PANEL */}
        <div className="register-left-panel">
          <div className="register-testimonial-box">
            <p className="register-testimonial-text">
              “In just 1 year, LTA International generated 14 new customers with new sales growth totaling $1.5 million.”
            </p>
            <div className="register-testimonial-footer">
              <span className="register-testimonial-author">Andrea Vitello</span>
              <span className="register-testimonial-brand">Skyfall.com</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="register-right-panel">
          
          {/* 🔥 ONGEZA HII: SECURITY BADGES */}
          <div className="register-security-badges">
            <div className="security-badge-item">
              <ShieldCheck size={16} color="#28a745" />
              <span className="security-text">SSL 256-bit Encryption</span>
            </div>
            <div className="security-badge-item">
              <Lock size={16} color="#28a745" />
              <span className="security-text">2FA Enabled</span>
            </div>
            <div className="security-badge-item">
              <CheckCircle size={16} color="#28a745" />
              <span className="security-text">Verified by Skyfall</span>
            </div>
          </div>

          <div className="register-header">
            <h2 className="register-title">Create your account</h2>
            <p className="register-subtitle">
              <Lock size={14} color="#28a745" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              <span className="secure-text">We Secure Your Data</span> | Tunalinda Data Zako
            </p>
          </div>

          {/* 🔥 Social Login Buttons - Google pekee */}
          <div className="register-social-buttons">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
            />
          </div>

          {/* Divider */}
          <div className="register-divider">
            <hr className="register-divider-line" />
            <span className="register-divider-text">Or</span>
            <hr className="register-divider-line" />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="register-error-message">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSignup} className="register-form">
            <div className="register-form-group">
              <label className="register-label">Email Address</label>
              <div className="register-input-wrapper">
                <Mail size={18} color="#999" className="register-input-icon" />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                  disabled={loading}
                  className="register-input"
                  placeholder="Enter your email"
                />
              </div>
              <div className="register-name-preview">
                Your default name will be: <strong>{email ? generateDefaultNameFromEmail(email) : '...'}</strong>
              </div>
            </div>

            <div className="register-form-group">
              <label className="register-label">Password</label>
              <div className="register-password-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  disabled={loading}
                  className="register-input"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="register-password-toggle"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="register-form-group">
              <label className="register-label">Confirm Password</label>
              <div className="register-password-wrapper">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  disabled={loading}
                  className="register-input"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  className="register-password-toggle"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="register-submit-btn"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* 🔥 ONGEZA HII: TRUST MESSAGE CHINI */}
          <div className="register-trust-message">
            <div className="trust-icon-wrapper">
              <ShieldCheck size={20} color="#28a745" />
            </div>
            <p className="trust-text">
              Your information is protected with 256-bit SSL encryption.
            </p>
            <p className="trust-text-swahili">
              Taarifa zako zinalindwa kwa usimbaji fiche wa kiwango cha juu.
            </p>
          </div>

          <div className="register-footer">
            Already have an account? 
            <span 
              onClick={() => navigate("/dashboard/login")}
              className="register-login-link"
            >
              Sign in here
            </span>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

// 🔥 Google Social Button pekee!
const SocialButton = ({ className, icon, text, onClick }) => (
  <button 
    type="button" 
    onClick={onClick}
    className={`register-social-btn ${className}`}
  >
    {icon}
    {text}
  </button>
);

export default Register;