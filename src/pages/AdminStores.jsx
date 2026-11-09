// src/pages/AdminStores.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';
import { CheckCircle, XCircle, LogOut, Store, Package, ShoppingCart, ShieldCheck, Clock, Users, Search, Activity, Menu, X } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminSidebar from '../components/AdminSidebar'; 

const fetchAdminStores = async ({ queryKey }) => {
  const [_, status] = queryKey;
  const response = await api.get('/admin/stores/', {
    params: { verification_status: status }
  });
  return response.data.results || response.data || [];
};

const fetchAnalytics = async () => {
  const response = await api.get('/admin/analytics/');
  return response.data;
};

export default function AdminStores() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('pending'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: stores = [], isLoading: loading } = useQuery({
    queryKey: ['adminStores', activeTab],
    queryFn: fetchAdminStores,
    staleTime: 1000 * 60 * 2, 
  });

  const { data: analytics } = useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: fetchAnalytics,
    refetchInterval: 60000, 
  });

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    queryClient.clear();
    navigate('/dashboard/login');
  };

  const handleApprove = async (storeId) => {
    if (!window.confirm("Je, unathibitisha kupitisha duka hili?")) return;
    try {
      await api.patch(`/admin/stores/${storeId}/`, { 
        verification_status: 'approved', 
        status: 'active',
        is_verified: true
      });
      queryClient.invalidateQueries({ queryKey: ['adminStores'] });
    } catch (err) {
      alert("Imeshindwa: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleReject = async (storeId) => {
    if (!window.confirm("Je, una uhakika unataka kukataa duka hili?")) return;
    try {
      await api.patch(`/admin/stores/${storeId}/`, { verification_status: 'rejected', status: 'inactive' });
      queryClient.invalidateQueries({ queryKey: ['adminStores'] });
    } catch (err) {
      alert("Imeshindwa: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex font-sans relative w-full">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <AdminSidebar activePage="stores" onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen w-full min-w-0 transition-all duration-300">
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-4 md:px-8 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Store Management</h1>
          </div>
          <button onClick={handleLogout} className="md:hidden flex items-center gap-2 text-red-500 font-medium text-sm">
            <LogOut size={16} /> Logout
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
          <div className="max-w-[1200px] mx-auto w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
              <div className="bg-white dark:bg-slate-800 p-3 md:p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                <div className="p-2 md:p-4 bg-blue-100 text-blue-600 rounded-full flex-shrink-0"><Users size={20} className="md:w-6 md:h-6" /></div>
                <div className="min-w-0">
                  <p className="text-[11px] md:text-sm text-gray-500 font-medium truncate">Total Visits</p>
                  <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">{analytics?.total_visits || 0}</h2>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-3 md:p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                <div className="p-2 md:p-4 bg-orange-100 text-orange-600 rounded-full flex-shrink-0"><Search size={20} className="md:w-6 md:h-6" /></div>
                <div className="min-w-0">
                  <p className="text-[11px] md:text-sm text-gray-500 font-medium truncate">Searches</p>
                  <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">{analytics?.skyfall_searches || 0}</h2>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-3 md:p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 col-span-2 md:col-span-1">
                <div className="p-2 md:p-4 bg-green-100 text-green-600 rounded-full flex-shrink-0"><Activity size={20} className="md:w-6 md:h-6" /></div>
                <div className="min-w-0">
                  <p className="text-[11px] md:text-sm text-gray-500 font-medium truncate">Visits Today</p>
                  <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">{analytics?.visits_today || 0}</h2>
                </div>
              </div>
            </div>

            <div className="flex gap-2 md:gap-4 mb-6 border-b border-gray-200 dark:border-slate-700 pb-2 overflow-x-auto">
              <button 
                onClick={() => setActiveTab('pending')}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 font-semibold rounded-lg transition-colors whitespace-nowrap text-sm md:text-base ${activeTab === 'pending' ? 'bg-orange-100 text-orange-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
              >
                <Clock size={18} /> Pending Approvals
              </button>
              <button 
                onClick={() => setActiveTab('approved')}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 font-semibold rounded-lg transition-colors whitespace-nowrap text-sm md:text-base ${activeTab === 'approved' ? 'bg-green-100 text-green-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
              >
                <ShieldCheck size={18} /> Approved Stores
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div></div>
            ) : stores.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl text-center text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700 shadow-sm">
                <Store size={48} className="mx-auto mb-4 text-gray-300 dark:text-slate-600" />
                <p className="text-lg font-medium">Hakuna maduka kwenye kundi hili ({activeTab}).</p>
              </div>
            ) : (
              <div className="grid gap-4 w-full">
                {stores.map((store) => (
                  <div key={store.id} className="bg-white dark:bg-slate-800 p-4 md:p-5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:justify-between md:items-center gap-4 w-full overflow-hidden">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {store.store_logo_url ? (
                        <img src={store.store_logo_url} alt="logo" className="w-16 h-16 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-orange-50 flex items-center justify-center text-2xl font-bold text-orange-500 flex-shrink-0">
                          {store.store_name?.charAt(0)}
                        </div>
                      )}
                      
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate block">
                          {store.store_name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 break-words">
                          {store.business_type} <span className="mx-1">•</span> {store.city}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-500/10 py-1 px-2.5 rounded-md">
                            <Package size={14} /> {store.total_products || 0} Products
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-purple-600 bg-purple-50 dark:bg-purple-500/10 py-1 px-2.5 rounded-md">
                            <ShoppingCart size={14} /> {store.total_orders || 0} Orders
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0 flex-shrink-0">
                      {activeTab === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(store.id)} className="flex-1 md:flex-initial bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors text-sm md:text-base">
                            <CheckCircle size={18} /> Approve
                          </button>
                          <button onClick={() => handleReject(store.id)} className="flex-1 md:flex-initial bg-red-50 text-red-600 hover:bg-red-100 px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors text-sm md:text-base">
                            <XCircle size={18} /> Reject
                          </button>
                        </>
                      )}
                      
                      {activeTab === 'approved' && (
                        <span className="px-4 py-2 bg-green-100 text-green-700 font-bold rounded-lg text-sm flex items-center justify-center gap-2 w-full md:w-auto">
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