import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; // 🔥 ONGEZA HII!
import api from '../axiosConfig';
import { Lock, ShieldCheck, CheckCircle, Mail, Eye, EyeOff, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import '../SupplierAuth.css';

const SupplierAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState('TZ');
  const [showPassword, setShowPassword] = useState(false);

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 900 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // ===== LOGIN =====
        const response = await api.post('/token/', {
          email: email.trim(),
          password: password
        });

        const { access, refresh } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        const profileRes = await api.get('/profile/', {
          headers: { Authorization: `Bearer ${access}` }
        });

        const role = profileRes.data.role;
        toast.success('Umeingia kikamilifu!', { duration: 3000 });

        if (role === 'supplier') {
          setTimeout(() => {
            toast.dismiss();
            navigate('/create-store');
          }, 3000);
        } else {
          setTimeout(() => {
            toast.dismiss();
            navigate('/dashboard');
          }, 3000);
        }
      } else {
        // ===== SIGNUP (Supplier) =====
        const response = await api.post('/register/', {
          email: email.trim(),
          password: password,
          role: 'supplier'
        });

        if (response.data.access && response.data.refresh) {
          localStorage.setItem('access_token', response.data.access);
          localStorage.setItem('refresh_token', response.data.refresh);
        }

        toast.success('Akaunti ya supplier imeundwa!', { duration: 3000 });
        setTimeout(() => {
          toast.dismiss();
          navigate('/create-store');
        }, 3000);
      }
    } catch (err) {
      console.error('Auth error:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.detail || err.response?.data?.email?.[0] || 'Hitilafu. Tafadhali jaribu tena.';
      toast.error(errorMsg, { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  // 🔥 KAZI MPYA: Google Login Success
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
        if (user.role === 'supplier') {
          navigate('/create-store');
        } else {
          navigate('/dashboard');
        }
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
    <GoogleOAuthProvider clientId="897025267638-ef196t913o7kt77dbgld9d7tmv01ftbp.apps.googleusercontent.com">
      <div className={`supplier-auth-container ${isMobile ? 'mobile' : ''}`}>
        
        {/* LEFT PANEL */}
        <div className="supplier-auth-left-panel">
          <div className="supplier-auth-overlay-box">
            <p className="supplier-auth-testimonial-text">
              “In just 1 year, LTA International generated 14 new customers with new sales growth totaling $1.5 million.”
            </p>
            <div className="supplier-auth-testimonial-footer">
              <span className="supplier-auth-testimonial-author">Andrea Vitello</span>
              <span className="supplier-auth-testimonial-brand">Skyfall.com</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="supplier-auth-right-panel">
          
          {/* 🔥 SECURITY BADGES */}
          <div className="supplier-auth-security-badges">
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

          <h2 className="supplier-auth-title">
            {isLogin ? 'Sign in as a supplier' : 'Sign up as a supplier'}
          </h2>
          
          <p className="supplier-auth-subtitle">
            <Lock size={14} color="#28a745" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            <span className="secure-text">We Secure Your Data</span> | Tunalinda Data Zako
          </p>

          <div className="supplier-auth-location">
            <span>Company location:</span>
            <div className="supplier-auth-location-select">
              <select 
                value={country} 
                onChange={(e) => setCountry(e.target.value)}
                className="supplier-auth-country-select"
              >
                <option value="TZ">🇹🇿 Tanzania</option>
                <option value="KE">🇰🇪 Kenya</option>
                <option value="UG">🇺🇬 Uganda</option>
                <option value="US">🇺🇸 United States</option>
              </select>
              <ChevronDown size={16} className="supplier-auth-country-arrow" />
            </div>
          </div>

          {/* 🔥 GOOGLE PEKEE - HAKUNA FACEBOOK AU LINKEDIN */}
          <div className="supplier-auth-social-buttons">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
            />
          </div>

          {/* DIVIDER */}
          <div className="supplier-auth-divider">
            <hr className="supplier-auth-divider-line" />
            <span className="supplier-auth-divider-text">Or</span>
            <hr className="supplier-auth-divider-line" />
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="supplier-auth-form">
            <div className="supplier-auth-form-group">
              <label className="supplier-auth-label">Email</label>
              <div className="supplier-auth-input-wrapper">
                <Mail size={18} color="#999" className="supplier-auth-input-icon" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="supplier-auth-input"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="supplier-auth-form-group">
              <label className="supplier-auth-label">Password</label>
              <div className="supplier-auth-input-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="supplier-auth-input"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="supplier-auth-password-toggle"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="supplier-auth-submit-btn"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Create account'}
            </button>
          </form>

          {/* TRUST MESSAGE */}
          <div className="supplier-auth-trust-message">
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

          <div className="supplier-auth-footer">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span 
              onClick={() => setIsLogin(!isLogin)}
              className="supplier-auth-toggle-link"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </span>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default SupplierAuth;