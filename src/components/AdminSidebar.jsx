// src/components/AdminSidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ShoppingCart, LogOut } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export default function AdminSidebar({ activePage = 'stores' }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    queryClient.clear();
    toast.success("Umetoka kwenye mfumo kikamilifu.");
    setTimeout(() => navigate('/dashboard/login'), 1000);
  };

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex fixed h-full z-10">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Store className="mr-3 text-orange-500" size={24} />
        <span className="text-xl font-bold tracking-wider">Skyfall Admin</span>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2">
        {/* Kitufe cha Store Management */}
        <button 
          onClick={() => navigate('/admin/stores')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            activePage === 'stores' 
              ? 'bg-orange-600 text-white' 
              : 'text-gray-300 hover:bg-slate-800'
          }`}
        >
          <Store size={20} />
          Store Management
        </button>

        {/* Kitufe cha Order Tracking */}
        <button 
          onClick={() => navigate('/admin/orders')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            activePage === 'orders' 
              ? 'bg-orange-600 text-white' 
              : 'text-gray-300 hover:bg-slate-800'
          }`}
        >
          <ShoppingCart size={20} />
          Order Tracking
        </button>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg font-medium transition-colors">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}