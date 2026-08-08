import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; // 🔥 ONGEZA HII
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import '../Login.css';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        const profileRes = await api.get('/profile/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const userProfile = profileRes.data;
        const role = userProfile.role;

        console.log("🔍 Role ya user:", role);
        console.log("🔍 User ID:", userProfile.id);

        if (role === 'supplier') {
          const storeRes = await api.get('/stores/', {
            params: { owner_id: userProfile.id },
            headers: { Authorization: `Bearer ${token}` }
          });
          
          console.log("🔍 Store data:", storeRes.data);

          if (storeRes.data && storeRes.data.length > 0) {
            const storeId = storeRes.data[0].id;
            console.log("✅ Store ID:", storeId);
            navigate(`/dashboard/sellerboard/${storeId}`, { replace: true });
          } else {
            console.log("⚠️ Hakuna store, inapeleka /create-store");
            navigate('/create-store', { replace: true });
          }
        } else {
          console.log("👤 User ni customer, inapeleka /dashboard");
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        console.error("❌ Auth check error:", err.response?.data || err.message);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // 🔥 KAZI YA KUANDAA LOGIN YA KAWAIDA
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tokenRes = await api.post('/token/', {
        email: email.trim(),
        password: password
      });

      const { access, refresh } = tokenRes.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      const profileRes = await api.get('/profile/', {
        headers: { Authorization: `Bearer ${access}` }
      });
      
      const userProfile = profileRes.data;
      const role = userProfile.role;

      console.log("🔍 Role ya user (login):", role);
      console.log("🔍 User ID (login):", userProfile.id);

      if (role === 'supplier') {
        const storeRes = await api.get('/stores/', {
          params: { owner_id: userProfile.id },
          headers: { Authorization: `Bearer ${access}` }
        });

        console.log("🔍 Store data (login):", storeRes.data);

        if (storeRes.data && storeRes.data.length > 0) {
          const storeId = storeRes.data[0].id;
          toast.success("Karibu Muuzaji! Inaelekeza kwenye Dashboard yako...");
          navigate(`/dashboard/sellerboard/${storeId}`, { replace: true });
        } else {
          toast.success("Karibu Muuzaji! Tafadhali unda duka lako kwanza.");
          navigate('/create-store', { replace: true });
        }
      } else {
        toast.success("Karibu Mteja!");
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error("Barua pepe au nenosiri si sahihi. Tafadhali jaribu tena.");
      } else {
        toast.error("Kosa la mtandao: " + (err.response?.data?.detail || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  // 🔥 KAZI MPYA: Google Login Success
  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("🔍 Google Credential Response:", credentialResponse);
    const token = credentialResponse.credential; // Hii ndio token kutoka Google

    try {
      // Tuma token hii kwa backend yetu (dj-rest-auth + allauth)
      const res = await api.post('/auth/google/', {
        access_token: token,
      });

      const { access, refresh, user } = res.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      toast.success(`Karibu ${user.email || 'Mteja'}!`);

      // Redirect kulingana na role
      if (user.role === 'supplier') {
        navigate('/create-store');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("❌ Google Login Error:", error);
      toast.error("Google login imeshindwa. Jaribu tena.");
    }
  };

  // 🔥 KAZI MPYA: Google Login Error
  const handleGoogleError = () => {
    console.error("❌ Google Login Error");
    toast.error("Google login imeshindwa.");
  };

  if (isCheckingAuth) {
    return (
      <div className="login-loading-container">
        <div className="login-spinner"></div>
      </div>
    );
  }

  // 🔥 BADILISHA: GoogleOAuthProvider lazima ifunge component nzima!
  return (
    <GoogleOAuthProvider clientId="897025267638-4uq34ithcduiblhn0qfb1cdspl2uovn6.apps.googleusercontent.com">
      
       {/* 🔥 BADILISHA HAPA NA CLIENT ID YAKO! */}
      <div className="login-container">
        <Toaster position="top-center" reverseOrder={false} />

        {/* LEFT PANEL */}
        <div className="login-left-panel">
          <div className="login-testimonial-box">
            <p className="login-testimonial-text">
              “In just 1 year, LTA International generated 14 new customers with new sales growth totaling $1.5 million.”
            </p>
            <div className="login-testimonial-footer">
              <span className="login-testimonial-author">Andrea Vitello</span>
              <span className="login-testimonial-brand">Skyfall.com</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="login-right-panel">
          <div className="login-header">
            <h2 className="login-title">Sign in to your account</h2>
            <p className="login-subtitle">Welcome back! Enter your details below.</p>
          </div>

          {/* 🔥 BADILISHA: Google Login Button */}
          <div className="login-social-buttons">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
            />
          </div>

          {/* Divider */}
          <div className="login-divider">
            <hr className="login-divider-line" />
            <span className="login-divider-text">Or</span>
            <hr className="login-divider-line" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="login-form">
            <div className="login-form-group">
              <label className="login-label">Email</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                placeholder="Enter your email"
              />
            </div>

            <div className="login-form-group">
              <label className="login-label">Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                placeholder="Enter your password"
              />
            </div>

            <div className="login-forgot-password">
              <span 
                onClick={handleForgotPassword}
                className="login-forgot-link"
              >
                Forgot your password?
              </span>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="login-submit-btn"
            >
              {loading ? 'Inachakata...' : 'Sign in'}
            </button>
          </form>

          <div className="login-footer">
            Don't have an account? 
            <span 
              onClick={() => navigate("/dashboard/register")}
              className="login-register-link"
            >
              Sign up here
            </span>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

// 🔥 BADILISHA: SocialButton sio lazima tena kwa GoogleLogin, lakini tunaweza kuiacha
const SocialButton = ({ className, icon, text, onClick }) => (
  <button 
    type="button" 
    onClick={onClick}
    className={`login-social-btn ${className}`}
  >
    {icon}
    {text}
  </button>
);

// Google Icon pekee
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default Login;