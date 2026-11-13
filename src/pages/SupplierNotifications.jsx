import React, { useState, useEffect } from "react";
import api from "../axiosConfig"; // 🔥 Tumia api
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Bell, ShoppingBag, Home, ChevronRight, 
  LayoutDashboard, MessageSquare, ClipboardList, 
  Settings, Menu, Megaphone
} from "lucide-react";
import toast from 'react-hot-toast';

export default function SupplierNotifications({ session }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [sellerOrders, setSellerOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [myStoreId, setMyStoreId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, path: '/dashboard/sellerboard', label: 'Your Store' },
    { icon: <MessageSquare size={20} />, path: '/dashboard/supplier-messages', label: 'Messages' },
    { icon: <ClipboardList size={20} />, path: '/dashboard/supplier-notifications', label: 'Notifications (Orders)' }, 
    { icon: <Settings size={20} />, path: '/dashboard/supplier-settings', label: 'Settings' },
  ];

  // ==========================================
  // 🔥 FUNCTION YA KUPATA ORDERS
  // ==========================================
  useEffect(() => {
    const fetchSellerOrders = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      
      try {
        const profileRes = await api.get('/profile/', { headers });
        const profileId = profileRes.data.id;
        setCurrentUserId(profileId);

        const storeRes = await api.get('/stores/', {
          params: { owner_id: profileId },
          headers
        });

        const storesData = storeRes.data.results || storeRes.data || [];
        const store = storesData[0]; 

        if (store) {
          setMyStoreId(store.id);

          const ordersRes = await api.get('/orders/', {
            params: { store_id: store.id, ordering: '-created_at' },
            headers
          });

          const ordersData = ordersRes.data.results || ordersRes.data || [];
          const ordersWithCustomers = ordersData.map(order => {
            const customerData = order.customer || { full_name: 'Mteja Mpya' };
            return { ...order, profiles: customerData };
          });

          setSellerOrders(ordersWithCustomers);
        } else {
          setMyStoreId(null);
        }
        
      } catch (error) { 
        console.error("Error fetching orders:", error.response?.data || error.message);
        toast.error("Hitilafu ilitokea kupata orders zako");
      } finally { 
        setLoading(false); 
      }
    };
    
    fetchSellerOrders();
  }, []);

  // ==========================================
  // 🔥 POLLING KWA ODA MPYA
  // ==========================================
  useEffect(() => {
    if (!currentUserId || !myStoreId) return;
    
    let pollingInterval = null;
    let lastCheckTime = new Date().toISOString();
    
    const startPolling = (storeId) => {
      console.log("🔄 Starting polling fallback (every 10 seconds)");
      
      const checkForNewOrders = async () => {
        try {
          const token = localStorage.getItem("access_token");
          if (!token) return;

          const headers = { Authorization: `Bearer ${token}` };
          const params = { 
            store_id: storeId, 
            created_at__gt: lastCheckTime,
            ordering: '-created_at'
          };

          const response = await api.get('/orders/', { params, headers });
          const ordersData = response.data.results || response.data || [];
          const status = response.status;

          if (status === 200 && ordersData.length > 0) {
            console.log(`📦 Found ${ordersData.length} new order(s) via polling`);
            lastCheckTime = new Date().toISOString();
            
            const ordersWithCustomers = ordersData.map(order => ({
              ...order,
              profiles: order.customer || { full_name: 'Mteja Mpya' }
            }));
            
            setSellerOrders(prev => {
              let newOrders = [...prev];
              ordersWithCustomers.forEach(order => {
                const exists = prev.some(o => o.id === order.id);
                if (!exists) {
                  newOrders = [order, ...newOrders];
                  toast.success(`📦 Oda Mpya! #${order.order_number}`, { duration: 5000, icon: '💰' });
                }
              });
              return newOrders;
            });
            
            document.title = `🔔 (${ordersData.length}) Oda Mpya!`;
            setTimeout(() => { document.title = "Skyfall"; }, 8000);
            
            try {
              const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
              audio.volume = 0.3;
              audio.play().catch(() => {});
            } catch (e) {}
          }
        } catch (error) {
          console.error("Polling error:", error);
        }
      };
      
      checkForNewOrders();
      pollingInterval = setInterval(checkForNewOrders, 10000);
    };
    
    startPolling(myStoreId);
    
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [currentUserId, myStoreId]);

  const getStatusStyle = (status) => {
    const styles = {
      pending: { bg: 'bg-orange-50', color: 'text-orange-600', label: 'Inasubiri' },
      received: { bg: 'bg-blue-50', color: 'text-blue-600', label: 'Imepokelewa' },
      delivered: { bg: 'bg-green-50', color: 'text-green-600', label: 'Imewasilishwa' },
      cancelled: { bg: 'bg-red-50', color: 'text-red-600', label: 'Imefutwa' }
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      
      {/* Header */}
      <header className="flex justify-between items-center px-4 md:px-6 py-3 border-b border-gray-200 bg-white z-[100] shrink-0">
        <div className="flex items-center gap-3 md:gap-4">
          {!isMobile && (
            <Menu size={22} className="cursor-pointer text-gray-500" onClick={() => setIsExpanded(!isExpanded)} />
          )}
          
          <Link to="/dashboard/sellerboard" className="text-lg md:text-xl font-extrabold text-[#ff6a00] no-underline">
            Skyfall.co.tz
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {!isMobile && (
            <Bell size={20} className="cursor-pointer text-[#ff6a00]" />
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside 
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            className={`border-r border-gray-200 bg-white pt-5 flex flex-col overflow-hidden whitespace-nowrap transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isExpanded ? 'w-[240px]' : 'w-[70px]'
            }`}
          >
            {sidebarItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center no-underline px-6 py-3 mx-2 my-1 rounded-lg transition-colors ${
                  location.pathname === item.path 
                    ? 'text-[#ff6a00] bg-[#fff5ed]' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="min-w-[22px] flex justify-center">
                  {item.icon}
                </div>
                <span className={`ml-4 text-sm font-semibold transition-opacity duration-200 ${
                  isExpanded ? 'opacity-100' : 'opacity-0'
                }`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-[900px] mx-auto">
            
            <h2 className="text-xl md:text-2xl font-extrabold mb-6 text-gray-900">
              Arifa za Mauzo (Orders)
            </h2>

            <div>
              {loading ? (
                <div className="text-center py-16">
                  <div className="w-10 h-10 border-4 border-gray-100 border-t-[#ff6a00] rounded-full mx-auto animate-spin"></div>
                  <p className="mt-4 text-gray-500">Inapakia orders zako...</p>
                </div>
              ) : (
                <>
                  {sellerOrders.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl">
                      <ShoppingBag size={64} className="text-gray-300 mx-auto" />
                      <p className="mt-4 text-gray-400">Hamna orders za duka lako bado</p>
                    </div>
                  )}
                  
                  {sellerOrders.map((order) => {
                    const statusStyle = getStatusStyle(order.status);
                    return (
                      <div 
                        key={order.id} 
                        onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                        className="flex justify-between items-center p-3 md:p-4 bg-white rounded-xl mb-3 cursor-pointer border-l-4 border-green-500 shadow-sm hover:translate-x-1 transition-transform flex-wrap md:flex-nowrap"
                      >
                        <div className="flex items-center gap-3 md:gap-4 flex-1">
                          <div className="bg-green-50 p-2 md:p-2.5 rounded-full">
                            <ShoppingBag size={isMobile ? 18 : 22} className="text-green-500" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm md:text-base font-bold text-gray-800 m-0">
                              Oda #{order.order_number?.slice(0, 12)}
                            </h4>
                            <p className="text-xs md:text-sm text-gray-600 mt-1 mb-0.5">
                              Mteja: <strong>{order.profiles?.full_name?.slice(0, 20) || 'Mteja Mpya'}</strong>
                            </p>
                            <p className="text-[10px] md:text-xs text-gray-500 m-0">
                              🚚 {order.shipping_method || 'Usafirishaji'} | 📅 {new Date(order.created_at).toLocaleDateString('sw-TZ')}
                            </p>
                            <p className="text-xs md:text-sm font-bold text-[#ff6a00] mt-1">
                              TSH {order.grand_total?.toLocaleString() || 0}
                            </p>
                          </div>
                        </div>
                        <div className="text-right mt-2 md:mt-0">
                          <span className={`text-[10px] md:text-[11px] px-2.5 md:px-3 py-1 md:py-1.5 rounded-full font-bold uppercase ${statusStyle.bg} ${statusStyle.color}`}>
                            {statusStyle.label}
                          </span>
                          {!isMobile && <ChevronRight size={20} className="text-gray-400 mt-2 ml-auto" />}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Nav */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white flex justify-around items-center pt-2 pb-5 border-t border-gray-200 z-[1000] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <button onClick={() => navigate('/dashboard/sellerboard')} className="flex flex-col items-center gap-1 cursor-pointer bg-transparent border-none flex-1">
            <Home size={22} className={location.pathname.startsWith('/dashboard/sellerboard') ? 'text-[#ff6a00]' : 'text-gray-500'} />
            <span className={`text-[10px] ${location.pathname.startsWith('/dashboard/sellerboard') ? 'text-[#ff6a00]' : 'text-gray-500'}`}>Duka</span>
          </button>

          <button onClick={() => navigate('/dashboard/supplier-orders')} className="flex flex-col items-center gap-1 cursor-pointer bg-transparent border-none flex-1">
            <ClipboardList size={22} className={location.pathname === '/dashboard/supplier-orders' ? 'text-[#ff6a00]' : 'text-gray-500'} />
            <span className={`text-[10px] ${location.pathname === '/dashboard/supplier-orders' ? 'text-[#ff6a00]' : 'text-gray-500'}`}>Oda</span>
          </button>

          <button onClick={() => navigate('/advertise')} className="flex flex-col items-center gap-1 cursor-pointer bg-transparent border-none flex-1">
            <Megaphone size={22} className={location.pathname === '/advertise' ? 'text-[#ff6a00]' : 'text-gray-500'} />
            <span className={`text-[10px] ${location.pathname === '/advertise' ? 'text-[#ff6a00]' : 'text-gray-500'}`}>Ads</span>
          </button>

          <button onClick={() => navigate('/dashboard/supplier-notifications')} className="flex flex-col items-center gap-1 cursor-pointer bg-transparent border-none flex-1">
            <Bell size={22} className={location.pathname === '/dashboard/supplier-notifications' ? 'text-[#ff6a00]' : 'text-gray-500'} />
            <span className={`text-[10px] ${location.pathname === '/dashboard/supplier-notifications' ? 'text-[#ff6a00]' : 'text-gray-500'}`}>Arifa</span>
          </button>
        </nav>
      )}

      {isMobile && <div className="h-[70px]" />}
      
      {/* Keyframes za Spin zimebaki hapa (Tailwind ina animate-spin lakini hii ni backup) */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}