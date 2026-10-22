// src/pages/SupplierAuth.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import api from '../axiosConfig';
import { Lock, ShieldCheck, Mail, Eye, EyeOff, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const SupplierAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState('TZ');
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="flex min-h-screen bg-white font-sans flex-col lg:flex-row">
        
        {/* LEFT PANEL (Inaonekana kwenye Desktop tu) */}
        <div 
          className="hidden lg:flex flex-1 relative bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop')" }}
        >
          <div className="absolute bottom-10 left-10 right-10 bg-white/85 p-6 md:p-8 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
            <p className="m-0 mb-3 text-base italic font-medium text-gray-900 leading-relaxed">
              “In just 1 year, LTA International generated 14 new customers with new sales growth totaling $1.5 million.”
            </p>
            <div className="flex items-center justify-between border-t border-gray-200 pt-3">
              <span className="font-semibold text-sm text-gray-800">Andrea Vitello</span>
              <span className="font-bold text-xs text-[#FF6600]">Skyfall.com</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 flex flex-col justify-center px-5 py-8 md:px-12 lg:px-20 md:py-10 bg-white w-full">
          
          {/* SECURITY BADGES */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4 mb-6 p-3 md:p-2.5 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
              <ShieldCheck size={16} className="text-[#28a745]" />
              <span>SSL 256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
              <Lock size={16} className="text-[#28a745]" />
              <span>2FA Enabled</span>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Sign in as a supplier' : 'Sign up as a supplier'}
          </h2>
          
          <p className="text-[13px] md:text-sm text-gray-600 mb-6 md:mb-8 flex items-center gap-1">
            <Lock size={14} className="text-[#28a745] inline" />
            <span className="text-[#28a745] font-semibold">We Secure Your Data</span>
          </p>

          <div className="flex items-center gap-2 mb-6 md:mb-8 text-sm text-gray-600 flex-wrap">
            <span>Company location:</span>
            <div className="relative flex items-center">
              <select 
                value={country} 
                onChange={(e) => setCountry(e.target.value)}
                className="appearance-none border-none bg-transparent font-semibold text-gray-900 cursor-pointer outline-none text-sm pr-6"
              >
                <option value="TZ">🇹🇿 Tanzania</option>
                <option value="KE">🇰🇪 Kenya</option>
                <option value="UG">🇺🇬 Uganda</option>
                <option value="US">🇺🇸 United States</option>
              </select>
              <ChevronDown size={16} className="absolute right-0 pointer-events-none text-gray-500" />
            </div>
          </div>

          {/* GOOGLE LOGIN */}
          <div className="flex flex-col gap-3 mb-6 md:mb-8 w-full justify-center items-center overflow-hidden">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              width="100%"
            />
          </div>

          {/* DIVIDER */}
          <div className="flex items-center mb-6 md:mb-8 text-gray-400 text-sm">
            <hr className="flex-1 border-t border-gray-200 m-0" />
            <span className="px-4">Or</span>
            <hr className="flex-1 border-t border-gray-200 m-0" />
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-5">
            <div className="flex flex-col">
              <label className="block text-sm font-medium mb-1.5 text-gray-800">Email</label>
              <div className="relative flex items-center">
                <Mail size={18} className="absolute left-3.5 text-gray-400" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3 pl-10 pr-4 rounded-lg border border-gray-300 text-[15px] outline-none focus:border-[#FF6600] transition-colors bg-white text-gray-900 placeholder-gray-400"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium mb-1.5 text-gray-800">Password</label>
              <div className="relative flex items-center">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 pl-4 pr-10 rounded-lg border border-gray-300 text-[15px] outline-none focus:border-[#FF6600] transition-colors bg-white text-gray-900 placeholder-gray-400"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-[#FF6600] hover:bg-[#e55a00] text-white border-none rounded-full text-[15px] md:text-base font-bold cursor-pointer transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Create account'}
            </button>
          </form>

          {/* TRUST MESSAGE */}
          <div className="mt-4 text-center p-2.5 bg-blue-50 rounded-lg border border-blue-100 flex flex-col items-center">
            <ShieldCheck size={20} className="text-[#28a745] mb-1" />
            <p className="text-xs text-gray-800 font-medium m-0">
              Your information is protected with 256-bit SSL encryption.
            </p>
          </div>

          <div className="text-center mt-5 text-[15px] text-gray-800">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span 
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-[#FF6600] cursor-pointer underline hover:text-[#e55a00] transition-colors"
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