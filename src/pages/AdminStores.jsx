// src/pages/AdminStores.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';
import { toast, Toaster } from 'react-hot-toast';
// 🔥 1. Icons mpya zimeongezwa hapa (Users, Search, Activity)
import { CheckCircle, XCircle, LogOut, Store, Package, ShoppingCart, ShieldCheck, Clock, Users, Search, Activity } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminSidebar from '../components/AdminSidebar'; 

// ==========================================
// FUNCTIONS ZA KUCHUKUA DATA
// ==========================================
const fetchAdminStores = async ({ queryKey }) => {
  const [_, status] = queryKey;
  const response = await api.get('/admin/stores/', {
    params: { verification_status: status }
  });
  return response.data.results || response.data || [];
};

// 🔥 2. Function mpya ya kuchukua takwimu za wageni
const fetchAnalytics = async () => {
  const response = await api.get('/admin/analytics/');
  return response.data;
};

export default function AdminStores() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // State ya Tab (Pending vs Approved)
  const [activeTab, setActiveTab] = useState('pending'); 

  // TUMIA useQuery kwa ajili ya Maduka
  const { 
    data: stores = [], 
    isLoading: loading 
  } = useQuery({
    queryKey: ['adminStores', activeTab],
    queryFn: fetchAdminStores,
    staleTime: 1000 * 60 * 2, 
  });

  // 🔥 3. useQuery ya kuchukua takwimu (Itajisasisha kila dakika 1)
  const { data: analytics } = useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: fetchAnalytics,
    refetchInterval: 60000, 
  });

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    queryClient.clear();
    toast.success("Umetoka kwenye mfumo kikamilifu.");
    setTimeout(() => navigate('/dashboard/login'), 1000);
  };

  const handleApprove = async (storeId) => {
    if (!window.confirm("Je, unathibitisha kupitisha duka hili?")) return;
    try {
      await api.patch(`/admin/stores/${storeId}/`, { 
        verification_status: 'approved', 
        status: 'active',
        is_verified: true
      });
      toast.success("Duka limepitishwa!");
      queryClient.invalidateQueries({ queryKey: ['adminStores'] });
    } catch (err) {
      toast.error("Imeshindwa: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleReject = async (storeId) => {
    if (!window.confirm("Je, una uhakika unataka kukataa duka hili?")) return;
    try {
      await api.patch(`/admin/stores/${storeId}/`, { verification_status: 'rejected', status: 'inactive' });
      toast.success("Duka limekataliwa.");
      queryClient.invalidateQueries({ queryKey: ['adminStores'] });
    } catch (err) {
      toast.error("Imeshindwa: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex font-sans">
      <Toaster position="top-center" />

      <AdminSidebar activePage="stores" />

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-4 md:px-8 shadow-sm">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Store Management</h1>
          <button onClick={handleLogout} className="md:hidden flex items-center gap-2 text-red-500 font-medium text-sm">
            <LogOut size={16} /> Logout
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto">
            
            {/* 🔥 4. KADI ZA TAKWIMU ZIMEANZA HAPA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              
              {/* Kadi ya Ziara Zote */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                <div className="p-4 bg-blue-100 text-blue-600 rounded-full"><Users size={24} /></div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Site Visits</p>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{analytics?.total_visits || 0}</h2>
                </div>
              </div>

              {/* Kadi ya Waliotafuta Skyfall */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                <div className="p-4 bg-orange-100 text-orange-600 rounded-full"><Search size={24} /></div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">"Skyfall" Searches</p>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{analytics?.skyfall_searches || 0}</h2>
                </div>
              </div>

              {/* Kadi ya Ziara za Leo */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                <div className="p-4 bg-green-100 text-green-600 rounded-full"><Activity size={24} /></div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Visits Today</p>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{analytics?.visits_today || 0}</h2>
                </div>
              </div>

            </div>
            {/* 🔥 MWISHO WA KADI ZA TAKWIMU */}

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

                    <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
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