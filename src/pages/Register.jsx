import React, { useState, useEffect } from 'react';
import axios from 'axios'; // ✅ Badilisha: Axios badala ya Supabase
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE_URL = "http://127.0.0.1:8000/api";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); // 🔥 ONGEZA HII (Njia ya 2)
  
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 🔥 ONGEZA HII useEffect (Kwa ajili ya Navigation isiyoshindwa)
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        // Futa token ili Login isimrudishe kiotomatiki
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Peleka kwenye Login
        navigate("/dashboard/login");
      }, 1500);
      // Safisha timer ikiwa mtumiaji ataondoka kwenye ukurasa kabla ya muda kuisha
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

  // ✅ BADILISHA: Handle Signup kwa Django API
  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Validations (zimebaki sawa)
    if (!email.trim()) {
      toast.error('Tafadhali weka barua pepe');
      setErrorMessage('Barua pepe inahitajika');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Tafadhali weka barua pepe halali');
      setErrorMessage('Barua pepe si sahihi (mfano: jina@gmail.com)');
      return;
    }
    
    if (!password.trim()) {
      toast.error('Tafadhali weka nenosiri');
      setErrorMessage('Nenosiri inahitajika');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Nenosiri lazima liwe na herufi 6 au zaidi');
      setErrorMessage('Nenosiri lazima iwe na herufi 6+');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Nenosiri hazilingani! Tafadhali kagua tena.');
      setErrorMessage('Manenosiri hayafanani');
      return;
    }

    setLoading(true);
    
    try {
      // 1. Tuma data kwenye endpoint ya Django (Backend itaunda User na Profile kwa pamoja)
      const response = await axios.post(`${API_BASE_URL}/register/`, {
        email: email.trim(),
        password: password,
        full_name: generateDefaultNameFromEmail(email) // Tumia hii kujaza full_name kwenye Profile
      });

      // 2. Ikiwa backend inarudisha tokens moja kwa moja (inashauriwa), zihifadhi
      if (response.data.access && response.data.refresh) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
      }

      // 3. Ujumbe wa mafanikio
      toast.success(`🎉 Karibu ${generateDefaultNameFromEmail(email)}! Akaunti yako imeundwa.`, { duration: 4000 });
      
      // 4. 🔥 MABADILIKO HAPA: Badala ya setTimeout, tumia setIsSuccess
      setIsSuccess(true);
      
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      
      // Kama kuna makosa kutoka backend
      const backendError = err.response?.data;
      let errorMsg = "Hitilafu isiyotarajiwa. Tafadhali jaribu tena.";
      
      if (backendError?.email) {
        errorMsg = backendError.email.join(' ');
      } else if (backendError?.password) {
        errorMsg = backendError.password.join(' ');
      } else if (backendError?.non_field_errors) {
        errorMsg = backendError.non_field_errors.join(' ');
      } else if (backendError?.detail) {
        errorMsg = backendError.detail;
      }
      
      toast.error(errorMsg);
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  
  // Social Login (Placeholder - Inahitaji usanidi wa Backend OAuth kama django-allauth)
  const handleSocialLogin = (provider) => {
    toast(`Inaanza ${provider} login... (OAuth inahitaji usanidi wa Backend)`, { icon: '⏳' });
    // Mfano wa redirect baadaye:
    // window.location.href = `${API_BASE_URL}/auth/${provider.toLowerCase()}/`;
  };

  // Styles za Layout (Split Screen - Sawa na Login) - HAZIJABADILISHWA
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#fff',
      fontFamily: "'Inter', sans-serif",
      flexDirection: isMobile ? 'column' : 'row',
      overflowX: 'hidden'
    },
    leftPanel: {
      flex: 1,
      display: isMobile ? 'none' : 'block',
      backgroundImage: 'url("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative',
      height: '100vh',
    },
    testimonialBox: {
      position: 'absolute',
      bottom: '40px',
      left: '40px',
      right: '40px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '20px 30px',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)',
    },
    rightPanel: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: isMobile ? '40px 20px' : '40px 60px',
      backgroundColor: '#fff',
      width: isMobile ? '100%' : 'auto',
    },
  };

  return (
    <div style={styles.container}>
      <Toaster position="top-center" reverseOrder={false} />

      {/* SEHEMU YA KUSHOTO: PICHA NA MAANDISHI (Desktop tu) */}
      <div style={styles.leftPanel}>
        <div style={styles.testimonialBox}>
          <p style={{ margin: '0 0 10px 0', fontSize: '16px', fontStyle: 'italic', fontWeight: '500', color: '#1a1a1a', lineHeight: '1.5' }}>
            “In just 1 year, LTA International generated 14 new customers with new sales growth totaling $1.5 million.”
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '12px' }}>
            <span style={{ fontWeight: '600', fontSize: '14px', color: '#333' }}>Andrea Vitello</span>
            <span style={{ fontWeight: 'bold', fontSize: '12px', color: '#FF6600' }}>Skyfall.com</span>
          </div>
        </div>
      </div>

      {/* SEHEMU YA KULIA: FOMU YA REGISTER */}
      <div style={styles.rightPanel}>
        
        {/* Kichwa cha Fomu */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>
            Create your account
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            Join Skyfall today! Enter your details below.
          </p>
        </div>

        {/* Vifungo vya Social Login (Sawa na Login) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
          <SocialButton 
            onClick={() => handleSocialLogin('Google')}
            bg="#fff" border="1px solid #ddd" color="#333" 
            icon={<GoogleIcon />} 
            text="Continue with Google" 
          />
          <SocialButton 
            onClick={() => handleSocialLogin('Facebook')}
            bg="#1877F2" border="none" color="#fff" 
            icon={<FacebookIcon />} 
            text="Continue with Facebook" 
          />
          <SocialButton 
            onClick={() => handleSocialLogin('LinkedIn')}
            bg="#0077B5" border="none" color="#fff" 
            icon={<LinkedInIcon />} 
            text="Continue with LinkedIn" 
          />
          <SocialButton 
            onClick={() => handleSocialLogin('Apple')}
            bg="#000" border="none" color="#fff" 
            icon={<AppleIcon />} 
            text="Continue with Apple" 
          />
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px', color: '#999', fontSize: '14px' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e5e7eb' }} />
          <span style={{ padding: '0 15px' }}>Or</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e5e7eb' }} />
        </div>

        {/* Error Message Area */}
        {errorMessage && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c00',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Fomu ya Register */}
        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#333' }}>Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              disabled={loading}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #d1d5db',
                fontSize: '15px', outline: 'none', transition: '0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FF6600'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            <div style={{ fontSize: '12px', color: '#999', marginTop: '6px' }}>
              Your default name will be: <strong>{email ? generateDefaultNameFromEmail(email) : '...'}</strong>
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#333' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                disabled={loading}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #d1d5db',
                  fontSize: '15px', outline: 'none', transition: '0.2s', paddingRight: '40px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#FF6600'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#333' }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} 
                disabled={loading}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #d1d5db',
                  fontSize: '15px', outline: 'none', transition: '0.2s', paddingRight: '40px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#FF6600'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%', padding: '14px', backgroundColor: '#FF6600', color: 'white', border: 'none',
              borderRadius: '40px', fontSize: '16px', fontWeight: '700', cursor: 'pointer',
              transition: '0.2s', marginTop: '10px'
            }}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#e55a00')}
            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#FF6600')}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer - Ingia */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '15px', color: '#333' }}>
          Already have an account? 
          <span 
            onClick={() => navigate("/dashboard/login")}
            style={{ fontWeight: '700', color: '#FF6600', cursor: 'pointer', textDecoration: 'underline', marginLeft: '4px' }}
          >
            Sign in here
          </span>
        </div>
      </div>
    </div>
  );
};

// === Helper Component for Social Buttons ===
const SocialButton = ({ bg, border, color, icon, text, onClick }) => (
  <button 
    type="button" 
    onClick={onClick}
    style={{
      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '12px', padding: '12px 16px', backgroundColor: bg, border: border || 'none',
      borderRadius: '8px', color: color, fontSize: '15px', fontWeight: '500', cursor: 'pointer',
      transition: '0.2s'
    }}
  >
    {icon}
    {text}
  </button>
);

// === SVGs for Social Icons ===
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

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.5 1.3 0 2.5 .87 3.29 .87 .78 0 2.26-1.07 3.8-.91 .65 .03 2.47 .26 3.64 1.98-.09 .06-2.17 1.28-2.15 3.81 .03 3.02 2.65 4.03 2.68 4.04-.03 .07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69 .85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

export default Register;