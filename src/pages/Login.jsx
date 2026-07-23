import React, { useState, useEffect } from 'react';
import axios from 'axios'; // ✅ Badilisha: Axios badala ya Supabase
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const API_BASE_URL = "http://127.0.0.1:8000/api"; // ✅ Ongeza hii

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // 🔥 Ongeza hii
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 🔥 ONGEZA HII useEffect: Angalia kama user tayari ameingia
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        // Thibitisha kama token ni halali kwa kutuma ombi la profile
        const profileRes = await axios.get(`${API_BASE_URL}/profile/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const userProfile = profileRes.data;
        const role = userProfile.role;

        // Tuma kwenye dashboard sahihi kama token ni halali
        if (role === 'supplier') {
          const storeRes = await axios.get(`${API_BASE_URL}/stores/`, {
            params: { owner_id: userProfile.id },
            headers: { Authorization: `Bearer ${token}` }
          });
          if (storeRes.data && storeRes.data.length > 0) {
            navigate(`/dashboard/sellerboard/${storeRes.data[0].id}`, { replace: true });
          } else {
            navigate('/create-store', { replace: true });
          }
        } else {
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        // Token ni batili au imekwisha muda -> futa token na uache user aingie
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // ✅ BADILISHA: Handle Login kwa Django JWT
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Pata Token (JWT) kutoka endpoint ya /api/token/
      // Kumbuka: Kwa sababu USERNAME_FIELD = 'email', SimpleJWT inatarajia 'email' hapa
      const tokenRes = await axios.post(`${API_BASE_URL}/token/`, {
        email: email.trim(),
        password: password
      });

      const { access, refresh } = tokenRes.data;
      
      // 2. Hifadhi token kwenye localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // 3. Pata Profile ya mtumiaji (Kujua role) kwa kutumia token
      const profileRes = await axios.get(`${API_BASE_URL}/profile/`, {
        headers: { Authorization: `Bearer ${access}` }
      });
      
      const userProfile = profileRes.data;
      const role = userProfile.role;

      console.log("✅ Role found:", role);

      // 4. Kama ni Supplier, tafuta Store ID yake
      if (role === 'supplier') {
        console.log("⏳ Searching for supplier's store...");
        const storeRes = await axios.get(`${API_BASE_URL}/stores/`, {
          params: { owner_id: userProfile.id },
          headers: { Authorization: `Bearer ${access}` }
        });

        // 5. Kama store ipo, peleka na ID; Kama haipo, peleka kuunda store
        if (storeRes.data && storeRes.data.length > 0) {
          console.log("✅ Store ID found:", storeRes.data[0].id);
          toast.success("Karibu Muuzaji! Inaelekeza kwenye Dashboard yako...");
          navigate(`/dashboard/sellerboard/${storeRes.data[0].id}`, { replace: true });
        } else {
          console.warn("⚠️ Supplier has no store yet. Redirecting to create store.");
          toast.success("Karibu Muuzaji! Tafadhali unda duka lako kwanza.");
          navigate('/create-store', { replace: true });
        }
      } 
      // 6. Kama ni Customer, peleka kwenye dashboard ya kawaida
      else {
        console.log("✅ Customer detected. Redirecting to customer dashboard.");
        toast.success("Karibu Mteja!");
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);
      
      // 🔥 Boresha ujumbe wa makosa: Angalia ikiwa ni 401 (User haipo / password ni mbaya)
      if (err.response?.status === 401) {
        toast.error("Barua pepe au nenosiri si sahihi. Tafadhali jaribu tena.");
      } else {
        toast.error("Kosa la mtandao: " + (err.response?.data?.detail || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  // Social Login (Placeholder kwa sasa - Utahitaji backend kwa OAuth)
  const handleSocialLogin = (provider) => {
    toast(`Inaanza ${provider} login... (OAuth inahitaji usanidi upande wa Backend)`, { icon: '⏳' });
    // Mfano: baadaye unaweza ku-redirect kwa backend OAuth URL
    // window.location.href = `${API_BASE_URL}/auth/${provider.toLowerCase()}/`;
  };

  // Styles za Layout (Split Screen) - HAZIJABADILISHWA
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#fff',
      fontFamily: "'Inter', sans-serif",
      flexDirection: isMobile ? 'column' : 'row',
    },
    leftPanel: {
      flex: 1,
      backgroundImage: 'url("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      height: isMobile ? '300px' : 'auto',
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
      padding: isMobile ? '30px 20px' : '40px 60px',
      backgroundColor: '#fff',
    },
  };

  // Ikiwa bado inakagua token, onyesha skrini ya kupakia
  if (isCheckingAuth) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Toaster position="top-center" reverseOrder={false} />

      {/* SEHEMU YA KUSHOTO: PICHA NA MAANDISHI */}
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

      {/* SEHEMU YA KULIA: FOMU YA LOGIN */}
      <div style={styles.rightPanel}>
        
        {/* Kichwa cha Fomu */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>
            Sign in to your account
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            Welcome back! Enter your details below.
          </p>
        </div>

        {/* Vifungo vya Social Login (Kama kwenye picha) */}
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
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px', color: '#999', fontSize: '14px' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e5e7eb' }} />
          <span style={{ padding: '0 15px' }}>Or</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e5e7eb' }} />
        </div>

        {/* Fomu ya Email & Password */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
              transition: '0.2s', marginTop: '10px'
            }}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#e55a00')}
            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#FF6600')}
          >
            {loading ? 'Inachakata...' : 'Sign in'}
          </button>
        </form>

        {/* Footer - Jisajili */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '15px', color: '#333' }}>
          Don't have an account? 
          <span 
            onClick={() => navigate("/dashboard/register")}
            style={{ fontWeight: '700', color: '#FF6600', cursor: 'pointer', textDecoration: 'underline', marginLeft: '4px' }}
          >
            Sign up here
          </span>
        </div>
      </div>
    </div>
  );
};

// === Helper Components for Social Buttons ===
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

// === SVGs for social icons ===
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

export default Login;