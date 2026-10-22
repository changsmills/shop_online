// src/pages/SupplierOrders.jsx
import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, MessageSquare, ClipboardList, 
  Settings, Bell, Search, Menu, Home, Megaphone, ShoppingBag
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const SupplierOrders = ({ session }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [expandedOrders, setExpandedOrders] = useState({}); 

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchSupplierOrders = async () => {
    if (!session) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Tafadhali ingia tena!");
        setLoading(false);
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };

      const storeRes = await api.get('/stores/', {
        params: { owner_id: session.user.id },
        headers
      });
      const storeData = storeRes.data?.[0];

      if (!storeData) {
        toast.error("Hujasajili duka bado");
        setLoading(false);
        return;
      }

      const storeId = storeData.id;

      const ordersRes = await api.get('/orders/', {
        params: { store_id: storeId, ordering: '-created_at' },
        headers
      });

      setOrders(ordersRes.data || []);
      
    } catch (error) {
      console.error("Error fetching supplier orders:", error.response?.data || error.message);
      toast.error("Imeshindwa kupata oda za wateja.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplierOrders();
  }, [session]);

  const toggleExpandOrder = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, path: '/dashboard/sellerboard', label: 'Duka Lako' },
    { icon: <MessageSquare size={20} />, path: '/dashboard/supplier-messages', label: 'Ujumbe' },
    { icon: <ClipboardList size={20} />, path: '/dashboard/supplier-orders', label: 'Oda za Wateja' },
    { icon: <Settings size={20} />, path: '/dashboard/supplier-settings', label: 'Mipangilio' },
  ];

  const getStatusStyle = (status) => {
    const base = "px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide";
    switch(status) {
      case 'pending': return `${base} bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400`;
      case 'received': return `${base} bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400`;
      case 'delivered': return `${base} bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400`;
      case 'cancelled': return `${base} bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400`;
      default: return `${base} bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400`;
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending': return 'Inasubiri';
      case 'received': return 'Imepokelewa';
      case 'delivered': return 'Imewasilishwa';
      case 'cancelled': return 'Imefutwa';
      default: return 'Inasubiri';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-black">
        <div className="w-10 h-10 border-4 border-gray-200 dark:border-gray-800 border-t-brand-orange rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50 dark:bg-black font-sans overflow-hidden">
      <Toaster position="top-center" />
      
      {/* HEADER */}
      <header className="sticky top-0 z-[100] h-[60px] bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-6 shrink-0">
        <div className="flex items-center gap-4">
          {!isMobile && (
            <Menu size={22} className="cursor-pointer text-gray-500 hover:text-brand-orange transition-colors" onClick={() => setIsExpanded(!isExpanded)} />
          )}
          <Link to="/dashboard/sellerboard" className="text-lg md:text-xl font-extrabold text-brand-orange tracking-tight">
            Skyfall.com
          </Link>
          {!isMobile && (
            <div className="flex items-center bg-gray-100 dark:bg-gray-900 px-3 py-1.5 rounded-lg ml-4">
              <Search size={16} className="text-gray-400" />
              <input type="text" placeholder="Tafuta oda..." className="bg-transparent border-none outline-none ml-2 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 w-40" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          {!isMobile && <Bell size={20} className="cursor-pointer text-gray-500 hover:text-brand-orange transition-colors" />}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* DESKTOP SIDEBAR */}
        {!isMobile && (
          <aside 
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            className={`${isExpanded ? 'w-[240px]' : 'w-[70px]'} transition-all duration-300 flex flex-col bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 pt-5 shrink-0 z-10 overflow-hidden whitespace-nowrap`}
          >
            {sidebarItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center mx-2 my-1 p-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-orange-50 dark:bg-orange-950/30 text-brand-orange' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'}`}
              >
                <div className="min-w-[22px] flex justify-center">{item.icon}</div>
                <span className={`ml-4 text-sm font-semibold transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </aside>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-black overflow-y-auto">
          <div className="max-w-[1100px] mx-auto">
            <h1 className="text-xl md:text-2xl font-extrabold mb-5 text-gray-900 dark:text-white">
              Oda za Wateja
            </h1>

            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-10 md:p-20 text-center bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-200 dark:border-gray-800 mt-5">
                <ShoppingBag size={64} className="text-gray-300 dark:text-gray-700 mb-5" />
                <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white mb-3">Bado hamna oda</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-[400px] mb-8 text-sm md:text-base">
                  Wateja bado hawajaweka oda. Tangaza bidhaa zako ili kuanza kupata oda.
                </p>
                <button 
                  onClick={() => navigate('/advertise')}
                  className="bg-brand-orange hover:bg-brand-hover text-white px-8 py-3.5 rounded-full font-bold transition-colors"
                >
                  Tangaza Sasa
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {orders.map((order) => {
                  const orderItems = order.order_items || [];
                  const totalItems = orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
                  const isExpandedOrder = expandedOrders[order.id];

                  return (
                    <div key={order.id} className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                      
                      {/* ORDER HEADER */}
                      <div className="p-4 md:p-5 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                          <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Oda #{order.order_number?.slice(0, 12)}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                {order.profiles?.full_name || order.customer?.full_name || 'Mteja Asiyejulikana'}
                              </span>
                              {(order.profiles?.avatar_url || order.customer?.avatar_url) && (
                                <img src={order.profiles?.avatar_url || order.customer?.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                              )}
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              📅 {new Date(order.created_at).toLocaleDateString()} | Bidhaa: {totalItems}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                            <div className={getStatusStyle(order.status)}>
                              {getStatusLabel(order.status)}
                            </div>
                            <button
                              onClick={() => toggleExpandOrder(order.id)}
                              className="bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1"
                            >
                              {isExpandedOrder ? '▲ Punguza' : '▼ Onyesha Bidhaa'}
                              <span className="text-[11px] text-gray-500">({orderItems.length})</span>
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-3 text-right">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Jumla ya Oda: </span>
                          <span className="text-lg md:text-xl font-extrabold text-brand-orange">
                            TZS {order.grand_total?.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* ORDER ITEMS */}
                      <div className="p-4 md:p-5">
                        <div className="flex flex-col gap-4">
                          {orderItems.map((item, idx) => (
                            <div 
                              key={item.id || idx} 
                              className={`flex flex-col md:flex-row items-center md:items-start gap-4 ${idx !== orderItems.length - 1 ? 'pb-4 border-b border-gray-100 dark:border-gray-800' : ''}`}
                            >
                              <img 
                                src={item.product_image || 'https://via.placeholder.com/80'} 
                                alt={item.product_name}
                                className="w-20 h-20 rounded-xl object-cover bg-gray-50 dark:bg-gray-900 shrink-0" 
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/70' }}
                              />
                              <div className="flex-1 text-center md:text-left">
                                <h4 className="m-0 text-sm md:text-base font-bold text-gray-900 dark:text-white">{item.product_name}</h4>
                                <p className="my-1 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                                  Rangi: <strong>{item.selected_color || 'N/A'}</strong> | 
                                  Size: <strong>{item.selected_size || 'N/A'}</strong> | 
                                  Qty: <strong>{item.quantity || 1}</strong>
                                </p>
                                <p className="m-0 text-sm md:text-base font-bold text-brand-orange">
                                  TZS {(item.unit_price || item.price)?.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAV */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black flex justify-around items-center pt-3 pb-5 border-t border-gray-200 dark:border-gray-800 z-[1000] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <button onClick={() => navigate('/dashboard/sellerboard')} className={`flex flex-col items-center bg-transparent border-none flex-1 ${location.pathname.startsWith('/dashboard/sellerboard') ? 'text-brand-orange' : 'text-gray-500'}`}>
            <Home size={22} />
            <span className="text-[10px] mt-1">Duka</span>
          </button>
          <button onClick={() => navigate('/dashboard/supplier-orders')} className={`flex flex-col items-center bg-transparent border-none flex-1 ${location.pathname === '/dashboard/supplier-orders' ? 'text-brand-orange' : 'text-gray-500'}`}>
            <ClipboardList size={22} />
            <span className="text-[10px] mt-1">Oda</span>
          </button>
          <button onClick={() => navigate('/advertise')} className={`flex flex-col items-center bg-transparent border-none flex-1 ${location.pathname === '/advertise' ? 'text-brand-orange' : 'text-gray-500'}`}>
            <Megaphone size={22} />
            <span className="text-[10px] mt-1">Ads</span>
          </button>
          <button onClick={() => navigate('/dashboard/supplier-notifications')} className={`flex flex-col items-center bg-transparent border-none flex-1 ${location.pathname === '/dashboard/supplier-notifications' ? 'text-brand-orange' : 'text-gray-500'}`}>
            <Bell size={22} />
            <span className="text-[10px] mt-1">Arifa</span>
          </button>
        </nav>
      )}
      {isMobile && <div className="h-[70px]"></div>}
    </div>
  );
};

export default SupplierOrders;