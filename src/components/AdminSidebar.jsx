// src/components/AdminSidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ShoppingCart, LogOut, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminSidebar({ activePage = 'stores', onClose }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    // Futa kumbukumbu na uende login moja kwa moja
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
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
        <div className="flex items-center">
          <Store className="mr-3 text-orange-500" size={24} />
          <span className="text-xl font-bold tracking-wider">Skyfall Admin</span>
        </div>
        
        <button 
          onClick={onClose}
          className="md:hidden p-1 text-gray-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
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