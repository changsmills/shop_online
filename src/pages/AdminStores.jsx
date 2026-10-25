// src/pages/AdminStores.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';
import { toast, Toaster } from 'react-hot-toast';
import { CheckCircle, XCircle, LogOut, Store, Package, ShoppingCart, ShieldCheck, Clock } from 'lucide-react';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🔥 TUMEONGEZA STATE YA TAB (Pending vs Approved)
  const [activeTab, setActiveTab] = useState('pending'); 
  
  const navigate = useNavigate();

  const fetchStores = async (status) => {
    setLoading(true);
    try {
      const response = await api.get('/admin/stores/', {
        params: { verification_status: status } // Tuma 'pending' au 'approved'
      });
      setStores(response.data.results || response.data || []);
    } catch (err) {
      console.error("Error fetching stores:", err.response?.data || err.message);
      toast.error("Imeshindwa kuvuta data. Hakikisha wewe ni Admin.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Kila tab inabadilika, vuta data mpya
  useEffect(() => {
    fetchStores(activeTab);
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    toast.success("Umetoka kwenye mfumo kikamilifu.");
    setTimeout(() => navigate('/dashboard/login'), 1000);
  };

const handleApprove = async (storeId) => {
    if (!window.confirm("Je, unathibitisha kupitisha duka hili?")) return;
    try {
      // 🔥 ONGEZA is_verified: true hapa
      await api.patch(`/admin/stores/${storeId}/`, { 
        verification_status: 'approved', 
        status: 'active',
        is_verified: true // <--- Hii ndio inakosekana
      });
      toast.success("Duka limepitishwa!");
      fetchStores(activeTab); // Refresh data
    } catch (err) {
      toast.error("Imeshindwa: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleReject = async (storeId) => {
    if (!window.confirm("Je, una uhakika unataka kukataa duka hili?")) return;
    try {
      await api.patch(`/admin/stores/${storeId}/`, { verification_status: 'rejected', status: 'inactive' });
      toast.success("Duka limekataliwa.");
      fetchStores(activeTab);
    } catch (err) {
      toast.error("Imeshindwa: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex font-sans">
      <Toaster position="top-center" />

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex fixed h-full z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Store className="mr-3 text-orange-500" size={24} />
          <span className="text-xl font-bold tracking-wider">Skyfall Admin</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-orange-600 text-white rounded-lg font-medium transition-colors">
            <Store size={20} />
            Store Management
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg font-medium transition-colors">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* HEADER */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-4 md:px-8 shadow-sm">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Store Management</h1>
          <button onClick={handleLogout} className="md:hidden flex items-center gap-2 text-red-500 font-medium text-sm">
            <LogOut size={16} /> Logout
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto">
            
            {/* 🔥 TABS ZA KUCHAGUA (PENDING / APPROVED) */}
            <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-slate-700 pb-2">
              <button 
                onClick={() => setActiveTab('pending')}
                className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg transition-colors ${activeTab === 'pending' ? 'bg-orange-100 text-orange-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
              >
                <Clock size={18} /> Pending Approvals
              </button>
              <button 
                onClick={() => setActiveTab('approved')}
                className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg transition-colors ${activeTab === 'approved' ? 'bg-green-100 text-green-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
              >
                <ShieldCheck size={18} /> Approved Stores
              </button>
            </div>

            {/* LOADING */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
              </div>
            ) : stores.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl text-center text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700 shadow-sm">
                <Store size={48} className="mx-auto mb-4 text-gray-300 dark:text-slate-600" />
                <p className="text-lg font-medium">Hakuna maduka kwenye kundi hili ({activeTab}).</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {stores.map((store) => (
                  <div key={store.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:justify-between md:items-center gap-5">
                    
                    {/* Store Info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {store.store_logo_url ? (
                        <img src={store.store_logo_url} alt="logo" className="w-16 h-16 rounded-xl object-cover border border-gray-100" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-orange-50 flex items-center justify-center text-2xl font-bold text-orange-500">
                          {store.store_name?.charAt(0)}
                        </div>
                      )}
                      
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{store.store_name}</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                          {store.business_type} <span className="mx-1">•</span> {store.city}
                        </p>
                        
                        {/* 🔥 STATISTICS ZA DUKA (Zinaonekana hapa) */}
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-500/10 py-1 px-2.5 rounded-md">
                            <Package size={14} />
                            {store.total_products || 0} Products
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-purple-600 bg-purple-50 dark:bg-purple-500/10 py-1 px-2.5 rounded-md">
                            <ShoppingCart size={14} />
                            {store.total_orders || 0} Orders
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
                      {/* Kama tupo kwenye Pending, Onyesha Approve/Reject */}
                      {activeTab === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(store.id)} className="flex-1 md:flex-initial bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors">
                            <CheckCircle size={18} /> Approve
                          </button>
                          <button onClick={() => handleReject(store.id)} className="flex-1 md:flex-initial bg-red-50 text-red-600 hover:bg-red-100 px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors">
                            <XCircle size={18} /> Reject
                          </button>
                        </>
                      )}
                      
                      {/* Kama tupo kwenye Approved, Onyesha Status Badge */}
                      {activeTab === 'approved' && (
                        <span className="px-4 py-2 bg-green-100 text-green-700 font-bold rounded-lg text-sm flex items-center gap-2">
                          <ShieldCheck size={18} /> Approved
                        </span>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}