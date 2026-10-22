import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
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
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "897025267638-4uq34ithcduiblhn0qfb1cdspl2uovn6.apps.googleusercontent.com"}>
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

          {/* Google Login */}
          <div className="flex flex-col gap-3 mb-6 w-full justify-center overflow-hidden">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              width="100%"
            />
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
    </GoogleOAuthProvider>
  );
};

// 🔥 Google Social Button pekee! (Imehifadhiwa kama ilivyokuwa kwenye code yako ya awali)
const SocialButton = ({ className, icon, text, onClick }) => (
  <button 
    type="button" 
    onClick={onClick}
    className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-[10px] text-[15px] font-medium cursor-pointer transition-all border-none hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] active:scale-95 ${className}`}
  >
    {icon}
    {text}
  </button>
);

export default Register;