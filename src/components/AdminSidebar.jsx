// src/components/AdminSidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ShoppingCart, LogOut, X, Megaphone } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminSidebar({ activePage = 'stores', onClose }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    queryClient.clear();
    navigate('/dashboard/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <aside className="w-64 h-full bg-slate-900 text-white flex flex-col relative">
      
      {/* 🔥 HEADER: Nimebadilisha hapa ili maandishi yakae vizuri */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 gap-2">
        
        <div className="flex items-center flex-1 min-w-0">
          <Store className="mr-2 text-orange-500 shrink-0" size={24} />
          {/* Nimeongeza whitespace-nowrap ili Skyfall Admin isigawanyike mistari miwili */}
          <span className="text-lg font-bold tracking-wider whitespace-nowrap truncate">
            Skyfall Admin
          </span>
        </div>
        
        <button 
          onClick={onClose}
          className="md:hidden p-1 text-gray-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
        >
          <X size={20} />
        </button>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2">
        <button 
          onClick={() => handleNavigation('/admin/stores')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            activePage === 'stores' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-slate-800'
          }`}
        >
          <Store size={20} /> Store Management
        </button>

        <button 
          onClick={() => handleNavigation('/admin/orders')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            activePage === 'orders' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-slate-800'
          }`}
        >
          <ShoppingCart size={20} /> Order Tracking
        </button>

        <button 
          onClick={() => handleNavigation('/admin/ads')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            activePage === 'ads' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-slate-800'
          }`}
        >
          <Megaphone size={20} /> Ad Approvals
        </button>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg font-medium transition-colors"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}