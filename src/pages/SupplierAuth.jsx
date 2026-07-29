import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig'; // 🔥 Tumia api
import { ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const SupplierAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState('TZ');

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
        // 🔥 MABADILIKO: api.post na kuondoa API_BASE_URL
        const response = await api.post('/token/', {
          email: email.trim(),
          password: password
        });

        const { access, refresh } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        // 🔥 MABADILIKO: api.get na kuondoa API_BASE_URL
        const profileRes = await api.get('/profile/', {
          headers: { Authorization: `Bearer ${access}` }
        });

        const role = profileRes.data.role;
        toast.success('Umeingia kikamilifu!');

        if (role === 'supplier') {
          navigate('/create-store');
        } else {
          navigate('/dashboard');
        }
      } else {
        // ===== SIGNUP (Supplier) =====
        // 🔥 MABADILIKO: api.post na kuondoa API_BASE_URL
        const response = await api.post('/register/', {
          email: email.trim(),
          password: password,
          role: 'supplier'
        });

        if (response.data.access && response.data.refresh) {
          localStorage.setItem('access_token', response.data.access);
          localStorage.setItem('refresh_token', response.data.refresh);
        }

        toast.success('Akaunti ya supplier imeundwa!');
        navigate('/create-store');
      }
    } catch (err) {
      console.error('Auth error:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.detail || err.response?.data?.email?.[0] || 'Hitilafu. Tafadhali jaribu tena.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#fff',
      fontFamily: "'Inter', -apple-system, sans-serif",
      flexDirection: isMobile ? 'column' : 'row',
    },
    leftPanel: {
      flex: 1,
      backgroundImage: 'url("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      height: isMobile ? '350px' : 'auto',
    },
    overlayBox: {
      position: 'absolute',
      bottom: '40px',
      left: '40px',
      right: '40px',
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      padding: '20px 30px',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    },
    rightPanel: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: isMobile ? '30px 20px' : '40px 80px',
      backgroundColor: '#fff',
    },
  };

  return (
    <div style={styles.container}>
      
      <div style={styles.leftPanel}>
        <div style={styles.overlayBox}>
          <p style={{ margin: '0 0 10px 0', fontSize: '16px', fontStyle: 'italic', fontWeight: '500', color: '#1a1a1a', lineHeight: '1.5' }}>
            “In just 1 year, LTA International generated 14 new customers with new sales growth totaling $1.5 million.”
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '12px' }}>
            <span style={{ fontWeight: '600', fontSize: '14px', color: '#333' }}>Andrea Vitello</span>
            <span style={{ fontWeight: 'bold', fontSize: '12px', color: '#FF6600' }}>Skyfall.com</span>
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>
          {isLogin ? 'Sign in as a supplier' : 'Sign up as a supplier'}
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '30px', color: '#555', fontSize: '14px' }}>
          <span>Company location:</span>
          <select 
            value={country} 
            onChange={(e) => setCountry(e.target.value)}
            style={{
              border: 'none', background: 'transparent', fontWeight: '600', color: '#1a1a1a', cursor: 'pointer', outline: 'none', fontSize: '14px'
            }}
          >
            <option value="TZ">🇹🇿 Tanzania</option>
            <option value="KE">🇰🇪 Kenya</option>
            <option value="UG">🇺🇬 Uganda</option>
            <option value="US">🇺🇸 United States</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
          <SocialButton 
            bg="#fff" border="1px solid #ddd" color="#333" 
            icon={<GoogleIcon />} 
            text="Continue with Google" 
          />
          <SocialButton 
            bg="#1877F2" border="none" color="#fff" 
            icon={<FacebookIcon />} 
            text="Continue with Facebook" 
          />
          <SocialButton 
            bg="#0077B5" border="none" color="#fff" 
            icon={<LinkedInIcon />} 
            text="Continue with LinkedIn" 
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', color: '#999', fontSize: '14px' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e5e7eb' }} />
          <span style={{ padding: '0 15px' }}>Or</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e5e7eb' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#333' }}>Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #d1d5db',
                fontSize: '15px', outline: 'none', transition: '0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FF6600'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#333' }}>Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #d1d5db',
                fontSize: '15px', outline: 'none', transition: '0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FF6600'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%', padding: '14px', backgroundColor: '#FF6600', color: 'white', border: 'none',
              borderRadius: '40px', fontSize: '16px', fontWeight: '700', cursor: 'pointer',
              opacity: loading ? 0.7 : 1, transition: '0.2s'
            }}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#e55a00')}
            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#FF6600')}
          >
            {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '15px', color: '#333' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => setIsLogin(!isLogin)}
            style={{ fontWeight: '700', color: '#FF6600', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </span>
        </div>
      </div>
    </div>
  );
};

const SocialButton = ({ bg, border, color, icon, text }) => (
  <button type="button" style={{
    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '12px', padding: '12px 16px', backgroundColor: bg, border: border || 'none',
    borderRadius: '8px', color: color, fontSize: '15px', fontWeight: '500', cursor: 'pointer',
    transition: '0.2s'
  }}>
    {icon}
    {text}
  </button>
);

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export default SupplierAuth;