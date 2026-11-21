// SignInBanner.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gift } from 'lucide-react';

const SignInBanner = () => {
  const [hasToken, setHasToken] = useState(false);
  const location = useLocation();

  // 🔥 1. LOGIC: Angalia token kila mara ukurasa unapobadilika
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setHasToken(!!token);
  }, [location.pathname]);

  // 🔥 2. LOGIC: Usionyeshe kwenye kurasa za Login/Register au kama ameingia
  const isAuthPage = location.pathname.includes('/login') || location.pathname.includes('/register');
  
  if (hasToken || isAuthPage) {
    return null;
  }

  return (
    // 🔥 3. UI MPYA: Total Black kwenye Dark Mode
    <div className="md:hidden bg-orange-100 dark:bg-black p-3 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-none w-full border-t border-orange-200 dark:border-gray-800">
      
      <div className="flex items-center space-x-2">
        {/* Icon inakuwa nyeupe au rangi ya dhahabu kwenye dark mode */}
        <Gift className="text-orange-500 dark:text-orange-400 w-5 h-5" />
        <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-300">
          Sign in for better sourcing experience
        </span>
      </div>
      
      <Link 
        to="/dashboard/login" 
        className="bg-orange-600 dark:bg-white text-white dark:text-black text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full hover:bg-orange-700 dark:hover:bg-gray-200 transition shadow-sm"
      >
        Sign In
      </Link>
    </div>
  );
};

export default SignInBanner;