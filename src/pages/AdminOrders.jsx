// src/pages/AdminOrders.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';
import { 
  Search, User, MapPin, Phone, Mail, Calendar, Package, ShoppingCart, LogOut, Menu, X, Users, Activity 
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminSidebar from '../components/AdminSidebar';

const fetchAdminOrders = async () => {
  const response = await api.get('/orders/');
  return response.data.results || response.data || [];
};

const fetchAnalytics = async () => {
  const response = await api.get('/admin/analytics/');
  return response.data;
};

export default function AdminOrders() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: orders = [], isLoading: loading } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: fetchAdminOrders,
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

  const filteredOrders = orders.filter(order => 
    order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex font-sans relative">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <AdminSidebar activePage="orders" onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen w-full min-w-0 transition-all duration-300">
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-4 md:px-8 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Order Tracking</h1>
          </div>
          <button onClick={handleLogout} className="md:hidden flex items-center gap-2 text-red-500 font-medium text-sm">
            <LogOut size={16} /> Logout
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
          <div className="max-w-[1200px] mx-auto w-full">
            <div className="mb-6 relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by Order ID, Name, or Email..." 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-orange-500 outline-none text-sm md:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

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

            {loading ? (
              <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div></div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl text-center text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700 shadow-sm">
                <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300 dark:text-slate-600" />
                <p className="text-lg font-medium">Hakuna oda zilizopatikana.</p>
              </div>
            ) : (
              <div className="grid gap-4 w-full">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="bg-white dark:bg-slate-800 p-4 md:p-5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm w-full overflow-hidden">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 border-b border-gray-100 dark:border-slate-700 pb-4 mb-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                          <span className="text-lg font-bold text-gray-900 dark:text-white break-all">#{order.order_number}</span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                            order.status === 'completed' ? 'bg-green-100 text-green-700' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                          }`}>{order.status?.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <Calendar size={14} /> {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-left md:text-right flex-shrink-0">
                        <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">TZS {Number(order.grand_total).toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{order.total_items} Items</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-2"><User size={16} /> Customer Details</h4>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-slate-400">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">{order.customer_name || 'N/A'}</p>
                          <p className="flex items-start gap-2 break-all"><Mail size={14} className="mt-0.5 flex-shrink-0" /> {order.customer_email || 'N/A'}</p>
                          <p className="flex items-center gap-2"><Phone size={14} className="flex-shrink-0" /> {order.customer_phone || 'N/A'}</p>
                          <p className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 flex-shrink-0" /> {order.customer_location || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-2"><Package size={16} /> Order Items</h4>
                        <div className="space-y-2">
                          {order.items?.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-slate-700/50 p-2 rounded-lg gap-2">
                              <div className="flex items-center gap-3 min-w-0">
                                {item.product_image ? (
                                  <img src={item.product_image} alt={item.product_name} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                                ) : (
                                  <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-xs flex-shrink-0">No Img</div>
                                )}
                                <div className="min-w-0">
                                  <p className="font-medium text-gray-900 dark:text-white truncate">{item.product_name}</p>
                                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <div className="font-semibold text-gray-900 dark:text-white flex-shrink-0">TZS {Number(item.subtotal).toLocaleString()}</div>
                            </div>
                          ))}
                        </div>
                      </div>
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