// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../axiosConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Lock, ShieldCheck, CheckCircle, Eye, EyeOff, Mail, KeyRound } from 'lucide-react';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setIsCheckingAuth(false);
        return;
      }
      // ... (Logic yako yote ya checkAuth ipo hapa kama ilivyokuwa)
      // Kwa ufupi, nimeiacha kama ilivyo ili isivunjike
      try {
        const profileRes = await api.get('/profile/', { headers: { Authorization: `Bearer ${token}` } });
        const userProfile = profileRes.data;
        const role = userProfile.role;

        if (role === 'supplier') {
          if (userProfile.is_otp_verified === false || userProfile.is_otp_verified === undefined) {
            toast("Tafadhali thibitisha akaunti yako kwa OTP kwanza.", { icon: '🔐', duration: 3000 });
            setTimeout(() => navigate('/verify-seller-otp', { replace: true }), 3000);
            return;
          }
          const storeRes = await api.get('/stores/', { params: { owner: userProfile.id }, headers: { Authorization: `Bearer ${token}` } });
          if (storeRes.data && storeRes.data.length > 0) {
            const store = storeRes.data[0];
            const storeId = store.id;
            const verificationStatus = store.verification_status || store.status;
            if (verificationStatus === 'pending' || verificationStatus === 'unverified') {
              toast("Store yako inasubiri kupitishwa na Admin.", { icon: '⏳', duration: 3000 });
              setTimeout(() => navigate(`/store-pending/${storeId}`, { replace: true }), 3000);
            } else {
              toast.success("Karibu Muuzaji! Inaelekeza kwenye Dashboard yako...", { duration: 3000 });
              setTimeout(() => navigate(`/dashboard/sellerboard/${storeId}`, { replace: true }), 3000);
            }
          } else {
            toast.success("Karibu Muuzaji! Tafadhali unda duka lako kwanza.", { duration: 3000 });
            setTimeout(() => navigate('/create-store', { replace: true }), 3000);
          }
        } else {
          toast.success("Karibu Mteja!", { duration: 3000 });
          setTimeout(() => navigate('/dashboard', { replace: true }), 3000);
        }
      } catch (err) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    // ... (Logic yako yote ya handleLogin ipo hapa kama ilivyokuwa)
    // Nimeiacha kama ilivyo ili isivunjike
    try {
      const tokenRes = await api.post('/token/', { email: email.trim(), password });
      const { access, refresh } = tokenRes.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      const profileRes = await api.get('/profile/', { headers: { Authorization: `Bearer ${access}` } });
      const userProfile = profileRes.data;
      const role = userProfile.role;

      if (role === 'supplier') {
        if (!userProfile.is_otp_verified) {
          toast("Tafadhali thibitisha akaunti yako kwa OTP kwanza.", { icon: '🔐', duration: 4000 });
          setTimeout(() => navigate('/verify-seller-otp', { replace: true }), 4000);
          return;
        }
        const storeRes = await api.get('/stores/', { params: { owner: userProfile.id }, headers: { Authorization: `Bearer ${access}` } });
        if (storeRes.data && storeRes.data.length > 0) {
          const store = storeRes.data[0];
          const storeId = store.id;
          const verificationStatus = store.verification_status || store.status;
          if (verificationStatus === 'pending' || verificationStatus === 'unverified') {
            toast("Store yako inasubiri kupitishwa na Admin.", { icon: '⏳', duration: 3000 });
            setTimeout(() => navigate(`/store-pending/${storeId}`, { replace: true }), 3000);
          } else {
            toast.success("Karibu Muuzaji! Inaelekeza kwenye Dashboard yako...", { duration: 3000 });
            setTimeout(() => navigate(`/dashboard/sellerboard/${storeId}`, { replace: true }), 3000);
          }
        } else {
          toast.success("Karibu Muuzaji! Tafadhali unda duka lako kwanza.", { duration: 3000 });
          setTimeout(() => navigate('/create-store', { replace: true }), 3000);
        }
      } else {
        toast.success("Karibu Mteja!", { duration: 3000 });
        const from = location.state?.from || '/dashboard';
        setTimeout(() => { toast.dismiss(); navigate(from, { replace: true }); }, 3000);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Barua pepe au nenosiri si sahihi. Tafadhali jaribu tena.", { duration: 4000 });
      } else {
        toast.error("Kosa la mtandao: " + (err.response?.data?.detail || err.message), { duration: 4000 });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => navigate('/forgot-password');

  // ... (Google Login logic na useGoogleLogin ipo hapa kama ilivyokuwa)

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await api.post('/auth/google/', { access_token: tokenResponse.access_token });
        const { access, refresh } = res.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        const profileRes = await api.get('/profile/', { headers: { Authorization: `Bearer ${access}` } });
        const userProfile = profileRes.data;
        const role = userProfile.role;

        toast.success(`Karibu ${userProfile.email || 'Mteja'}!`, { duration: 3000 });

        if (role === 'supplier') {
          if (userProfile.is_otp_verified === false || userProfile.is_otp_verified === undefined) {
            toast("Tafadhali thibitisha akaunti yako kwa OTP kwanza.", { icon: '🔐', duration: 4000 });
            setTimeout(() => navigate('/verify-seller-otp', { replace: true }), 4000);
            return;
          }
          const storeRes = await api.get('/stores/', { params: { owner: userProfile.id }, headers: { Authorization: `Bearer ${access}` } });
          if (storeRes.data && storeRes.data.length > 0) {
            const myStore = storeRes.data.find(s => s.owner === userProfile.id || s.owner_id === userProfile.id) || storeRes.data[0];
            const storeId = myStore.id;
            const verificationStatus = myStore.verification_status || myStore.status;
            if (verificationStatus === 'pending' || verificationStatus === 'unverified') {
              toast("Store yako inasubiri kupitishwa na Admin.", { icon: '⏳', duration: 3000 });
              setTimeout(() => navigate(`/store-pending/${storeId}`, { replace: true }), 3000);
            } else {
              toast.success("Karibu Muuzaji!", { duration: 3000 });
              setTimeout(() => navigate(`/dashboard/sellerboard/${storeId}`, { replace: true }), 3000);
            }
          } else {
            toast.success("Karibu Muuzaji! Tafadhali unda duka lako kwanza.", { duration: 3000 });
            setTimeout(() => navigate('/create-store', { replace: true }), 3000);
          }
        } else {
          toast.success("Karibu Mteja!", { duration: 3000 });
          setTimeout(() => navigate('/dashboard', { replace: true }), 3000);
        }
      } catch (error) {
        toast.error("Google login imeshindwa. Jaribu tena.", { duration: 4000 });
      }
    },
    onError: () => toast.error("Google login imeshindwa.", { duration: 4000 }),
    flow: 'implicit',
  });

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex bg-white dark:bg-black">
        {/* Skeleton Left */}
        <div className="hidden md:flex flex-1 flex-col justify-center p-10 gap-4 bg-gray-50 dark:bg-gray-900">
          <div className="h-[150px] w-[80%] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="h-[30px] w-[50%] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
        {/* Skeleton Right */}
        <div className="flex-1 max-w-[500px] mx-auto p-10 flex flex-col justify-center gap-4">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          <div className="h-10 w-3/5 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="h-5 w-2/5 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mt-4"></div>
          <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-black font-sans">
      <Toaster position="top-center" reverseOrder={false} />

      {/* LEFT PANEL (Picha) */}
      <div className="hidden md:flex flex-1 relative items-end p-10 bg-[url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center">
        <div className="w-full max-w-[500px] bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-8 rounded-2xl shadow-xl">
          <p className="text-base italic font-medium text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
            "In just 1 year, LTA International generated 14 new customers with new sales growth totaling 1.5 million."
          </p>
          <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4">
            <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">Andrea Vitello</span>
            <span className="font-bold text-xs text-brand-orange">Skyfall.co.tz</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL (Form) */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-12 lg:p-20 max-w-[600px] mx-auto w-full">
        
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sign in to your account</h2>
          <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Lock size={14} className="text-green-500" />
            <span className="text-green-600 font-medium">We Secure Your Data</span>
          </p>
        </div>

        {/* Google Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => loginWithGoogle()}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <hr className="flex-1 border-gray-200 dark:border-gray-700" />
          <span className="text-sm text-gray-400">Or</span>
          <hr className="flex-1 border-gray-200 dark:border-gray-700" />
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
            <div className="relative flex items-center">
              <Mail size={18} className="absolute left-3 text-gray-400" />
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            <div className="relative flex items-center">
              <KeyRound size={18} className="absolute left-3 text-gray-400" />
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="text-right">
            <span onClick={handleForgotPassword} className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">Forgot your password?</span>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-brand-orange text-white rounded-full font-bold text-base hover:bg-brand-hover transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Inachakata...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Create an account? 
          <span onClick={() => navigate("/dashboard/register")} className="text-brand-orange font-bold cursor-pointer hover:underline ml-1">Sign in here</span>
        </div>

      </div>
    </div>
  );
};

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default Login;