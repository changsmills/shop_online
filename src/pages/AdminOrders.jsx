// src/pages/AdminOrders.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';
import { toast, Toaster } from 'react-hot-toast';
import { 
  Search, User, MapPin, Phone, Mail, Calendar, Package, ShoppingCart, LogOut, DollarSign
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminSidebar from '../components/AdminSidebar'; // 🔥 Import Sidebar

// Function ya kuchukua oda zote kutoka API
const fetchAdminOrders = async () => {
  const response = await api.get('/orders/');
  return response.data.results || response.data || [];
};

export default function AdminOrders() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  // Kuchukua data kwa kutumia React Query
  const { 
    data: orders = [], 
    isLoading: loading 
  } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: fetchAdminOrders,
    staleTime: 1000 * 60 * 2, // Cache kwa dakika 2
  });

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    queryClient.clear();
    toast.success("Umetoka kwenye mfumo kikamilifu.");
    setTimeout(() => navigate('/dashboard/login'), 1000);
  };

  // Filter orders kwa search
  const filteredOrders = orders.filter(order => 
    order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex font-sans">
      <Toaster position="top-center" />

      {/* 🔥 TUMIA SIDEBAR COMPONENT HAPA */}
      <AdminSidebar activePage="orders" />

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* HEADER */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-4 md:px-8 shadow-sm">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Order Tracking</h1>
          <button onClick={handleLogout} className="md:hidden flex items-center gap-2 text-red-500 font-medium text-sm">
            <LogOut size={16} /> Logout
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto">
            
            {/* SEARCH BAR */}
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by Order ID, Customer Name, or Email..." 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-orange-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* LOADING */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl text-center text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700 shadow-sm">
                <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300 dark:text-slate-600" />
                <p className="text-lg font-medium">Hakuna oda zilizopatikana.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                    
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 border-b border-gray-100 dark:border-slate-700 pb-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">#{order.order_number}</span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            order.status === 'completed' ? 'bg-green-100 text-green-700' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {order.status?.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <Calendar size={14} />
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-left md:text-right">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          TZS {Number(order.grand_total).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">{order.total_items} Items</div>
                      </div>
                    </div>

                    {/* Customer Info & Items */}
                    <div className="grid md:grid-cols-2 gap-6">
                      
                      {/* Customer Details */}
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                          <User size={16} /> Customer Details
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-slate-400">
                          <p className="font-semibold text-gray-900 dark:text-white">{order.customer_name || 'N/A'}</p>
                          <p className="flex items-center gap-2"><Mail size={14} /> {order.customer_email || 'N/A'}</p>
                          <p className="flex items-center gap-2"><Phone size={14} /> {order.customer_phone || 'N/A'}</p>
                          <p className="flex items-center gap-2"><MapPin size={14} /> {order.customer_location || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                          <Package size={16} /> Order Items
                        </h4>
                        <div className="space-y-2">
                          {order.items?.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-slate-700/50 p-2 rounded-lg">
                              <div className="flex items-center gap-3">
                                {item.product_image ? (
                                  <img src={item.product_image} alt={item.product_name} className="w-10 h-10 rounded object-cover" />
                                ) : (
                                  <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-xs">No Img</div>
                                )}
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{item.product_name}</p>
                                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <div className="font-semibold text-gray-900 dark:text-white">
                                TZS {Number(item.subtotal).toLocaleString()}
                              </div>
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