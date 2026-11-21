// SignInBanner.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Gift } from 'lucide-react';

const SignInBanner = () => {
  const token = localStorage.getItem("access_token");

  if (token) return null;

  return (
    // 🔥 Ongeza 'md:hidden' hapa
    <div className="md:hidden bg-orange-100 p-3 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] w-full">
      <div className="flex items-center space-x-2">
        <Gift className="text-orange-500 w-5 h-5" />
        <span className="text-xs sm:text-sm font-semibold text-gray-800">
          Sign in for better sourcing experience
        </span>
      </div>
      <Link 
        to="/dashboard/login" 
        className="bg-orange-600 text-white text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full hover:bg-orange-700 transition"
      >
        Sign In
      </Link>
    </div>
  );
};

export default SignInBanner;