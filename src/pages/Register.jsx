import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google'; // 🔥 Imebadilishwa kutoka GoogleOAuthProvider/GoogleLogin
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

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
        toast.dismiss();
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
      } else if (backendError?.username) { // 🔥 ONGEZA HII HAPA
        errorMsg = backendError.username.join(' ');
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

  // 🔥 GOOGLE SIGNUP MPYA KWA KUTUMIA useGoogleLogin (Kama ilivyo kwenye Login)
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Tunatuma token kwenda backend. Backend yako inapaswa kushughulikia
        // kuunda akaunti mpya kama mtumiaji hayupo, au kumuingiza kama yupo.
        const res = await api.post('/auth/google/', { access_token: tokenResponse.access_token });
        const { access, refresh, user } = res.data;
        
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        toast.success(`Karibu ${user?.email || 'Mteja'}!`, { duration: 3000 });
        setTimeout(() => {
          toast.dismiss();
          navigate('/dashboard', { replace: true });
        }, 3000);
      } catch (error) {
        console.error("❌ Google Signup Error:", error);
        toast.error("Google signup imeshindwa. Jaribu tena.", { duration: 4000 });
      }
    },
    onError: () => toast.error("Google signup imeshindwa.", { duration: 4000 }),
    flow: 'implicit',
  });

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#1a1a2e] font-sans">
      <Toaster position="top-center" reverseOrder={false} />

      {/* LEFT PANEL (Desktop only) */}
      <div 
        className="hidden lg:flex flex-1 relative items-end p-10 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop')" }}
      >
        <div className="bg-white/90 dark:bg-[#1e293b]/90 p-6 md:p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md w-full max-w-[500px]">
          <p className="m-0 mb-3 text-base italic font-medium text-[#1a1a1a] dark:text-[#e2e8f0] leading-relaxed">
            “In just 1 year, LTA International generated 14 new customers with new sales growth totaling $1.5 million.”
          </p>
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-[#334155] pt-3">
            <span className="font-semibold text-sm text-[#333] dark:text-[#f1f5f9]">Andrea Vitello</span>
            <span className="font-bold text-xs text-[#FF6600]">Skyfall.com</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col justify-center px-5 py-8 md:px-[60px] md:py-[40px] bg-white dark:bg-[#1a1a2e] max-w-[600px] mx-auto w-full">
        
        <div className="mb-6 md:mb-8">
          <h2 className="text-[26px] md:text-[32px] font-bold text-[#1a1a1a] dark:text-[#e2e8f0] m-0 mb-2">Create your account</h2>
          <p className="m-0 text-[13px] md:text-sm text-[#666] dark:text-[#94a3b8] flex items-center gap-1">
            <Lock size={14} className="text-[#28a745]" />
            <span className="text-[#28a745] font-semibold">We Secure Your Data</span>
          </p>
        </div>

        {/* Google Signup Button */}
        <div className="flex flex-col gap-3 mb-6 w-full justify-center overflow-hidden">
          <button
            type="button"
            onClick={() => loginWithGoogle()}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-[10px] text-[15px] font-medium cursor-pointer transition-all border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1e293b] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] active:scale-95"
          >
            <GoogleIcon />
            <span>Sign in with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center mb-6 text-[#999] dark:text-[#64748b] text-sm">
          <hr className="flex-1 border-t border-gray-200 dark:border-[#334155] m-0" />
          <span className="px-4">Or</span>
          <hr className="flex-1 border-t border-gray-200 dark:border-[#334155] m-0" />
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 dark:bg-[#2d1a1a] text-red-600 dark:text-[#f87171] border border-red-200 dark:border-[#4a1a1a] px-4 py-3 rounded-lg mb-5 text-sm text-center">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSignup} className="flex flex-col gap-5">
          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-1.5 text-[#333] dark:text-[#e2e8f0]">Email Address</label>
            <div className="relative flex items-center">
              <Mail size={18} className="absolute left-3.5 text-gray-400" />
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                disabled={loading}
                className="w-full px-4 py-3.5 pl-10 rounded-lg border border-gray-300 dark:border-[#334155] bg-white dark:bg-[#1e293b] text-[#333] dark:text-[#e2e8f0] text-[15px] outline-none transition-all focus:border-[#FF6600] focus:ring-4 focus:ring-[#FF6600]/10 placeholder:text-gray-400 dark:placeholder:text-[#64748b] disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="Enter your email"
              />
            </div>
            <div className="text-xs text-gray-500 dark:text-[#94a3b8] mt-1.5">
              Your default name will be: <strong className="text-[#333] dark:text-[#e2e8f0]">{email ? generateDefaultNameFromEmail(email) : '...'}</strong>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-1.5 text-[#333] dark:text-[#e2e8f0]">Password</label>
            <div className="relative flex items-center">
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                disabled={loading}
                className="w-full px-4 py-3.5 rounded-lg border border-gray-300 dark:border-[#334155] bg-white dark:bg-[#1e293b] text-[#333] dark:text-[#e2e8f0] text-[15px] outline-none transition-all focus:border-[#FF6600] focus:ring-4 focus:ring-[#FF6600]/10 placeholder:text-gray-400 dark:placeholder:text-[#64748b] disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-gray-500 dark:text-gray-400 p-1 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-1.5 text-[#333] dark:text-[#e2e8f0]">Confirm Password</label>
            <div className="relative flex items-center">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} 
                disabled={loading}
                className="w-full px-4 py-3.5 rounded-lg border border-gray-300 dark:border-[#334155] bg-white dark:bg-[#1e293b] text-[#333] dark:text-[#e2e8f0] text-[15px] outline-none transition-all focus:border-[#FF6600] focus:ring-4 focus:ring-[#FF6600]/10 placeholder:text-gray-400 dark:placeholder:text-[#64748b] disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-gray-500 dark:text-gray-400 p-1 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 mt-2.5 bg-[#FF6600] text-white rounded-full text-base font-bold cursor-pointer transition-all hover:bg-[#e55a00] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(255,102,0,0.3)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-5 text-[15px] text-[#333] dark:text-[#e2e8f0]">
          Already have an account? 
          <span 
            onClick={() => navigate("/dashboard/login")}
            className="font-bold text-[#FF6600] cursor-pointer underline ml-1 hover:text-[#e55a00] transition-colors"
          >
            Sign in here
          </span>
        </div>
      </div>
    </div>
  );
};

// 🔥 Google Icon SVG (Imehifadhiwa kama ilivyokuwa kwenye Login)
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default Register;