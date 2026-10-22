import React, { useState, useEffect } from "react";
// import { supabase } from "../supabaseClient";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Bell, ShoppingBag, Home, User, ChevronRight, 
  Search, LayoutDashboard, MessageSquare, ClipboardList, 
  BarChart3, Settings, Menu 
} from "lucide-react";
import UserTools from '../components/UserTools';
import toast from 'react-hot-toast';
//import "../NotificationsPage.css";  // 🔥 ONGEZA IMPORT HII

export default function NotificationsPage({ session }) {
  const [sellerOrders, setSellerOrders] = useState([]);
  const [buyerOrders, setBuyerOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("buyer");
  const [isExpanded, setIsExpanded] = useState(false);
  const [myStoreId, setMyStoreId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

 {/* Sidebar items */}
const sidebarItems = [
  { icon: <LayoutDashboard size={20} strokeWidth={2} />, path: '/dashboard', label: 'Dashboard' },
  { icon: <MessageSquare size={20} strokeWidth={2} />, path: '/dashboard/messages', label: 'Messages' },
  { icon: <ClipboardList size={20} strokeWidth={2} />, path: '/dashboard/orders', label: 'Orders' },
  { icon: <BarChart3 size={20} strokeWidth={2} />, path: '/dashboard/analytics', label: 'Analytics' },
  { icon: <Settings size={20} strokeWidth={2} />, path: '/dashboard/settings', label: 'Settings' },
];

  // 1. FETCH ORDERS
  useEffect(() => {
    const fetchAllNotifications = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession) {
        setLoading(false);
        return;
      }

      try {
        const { data: store } = await supabase
          .from("stores_engine")
          .select("id")
          .eq("owner_id", currentSession.user.id)
          .maybeSingle();

        if (store) {
          setMyStoreId(store.id);
          const { data: sOrders } = await supabase
            .from('orders')
            .select('*')
            .eq('store_id', store.id)
            .order('created_at', { ascending: false });

          const sOrdersWithCustomers = await Promise.all(
            (sOrders || []).map(async (order) => {
              const { data: customer } = await supabase
                .from('profiles')
                .select('full_name, avatar_url')
                .eq('id', order.customer_id)
                .maybeSingle();
              return { ...order, profiles: customer || { full_name: 'Mteja Mpya' } };
            })
          );

          setSellerOrders(sOrdersWithCustomers);
          setActiveTab("seller");
        } else {
          setMyStoreId(null);
        }

        const { data: bOrders } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_id', currentSession.user.id)
          .order('created_at', { ascending: false });

        const bOrdersWithStores = await Promise.all(
          (bOrders || []).map(async (order) => {
            const { data: storeData } = await supabase
              .from('stores_engine')
              .select('store_name, store_logo')
              .eq('id', order.store_id)
              .maybeSingle();
            return { ...order, stores_engine: storeData || { store_name: 'Duka lisilojulikana' } };
          })
        );

        setBuyerOrders(bOrdersWithStores);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Hitilafu ilitokea kupata orders zako");
      } finally {
        setLoading(false);
      }
    };

    fetchAllNotifications();
  }, []);

  // 2. REAL-TIME + POLLING
  useEffect(() => {
    if (!session?.user?.id) return;

    let channel = null;
    let pollingInterval = null;
    let isRealtimeWorking = false;
    let lastCheckTime = new Date().toISOString();

    const setupRealtime = async () => {
      let storeId = myStoreId;
      if (!storeId) {
        const { data: store } = await supabase
          .from("stores_engine")
          .select("id")
          .eq("owner_id", session.user.id)
          .maybeSingle();
        storeId = store?.id;
        if (storeId) setMyStoreId(storeId);
      }
      if (!storeId) return;

      channel = supabase
        .channel(`store-orders-${storeId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'orders', filter: `store_id=eq.${storeId}` },
          async (payload) => {
            isRealtimeWorking = true;
            const newOrder = payload.new;
            const { data: customerProfile } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', newOrder.customer_id)
              .maybeSingle();

            const orderWithCustomer = {
              ...newOrder,
              profiles: customerProfile || { full_name: 'Mteja Mpya' }
            };

            setSellerOrders(prev => {
              const exists = prev.some(order => order.id === newOrder.id);
              if (exists) return prev;
              return [orderWithCustomer, ...prev];
            });

            toast.success(
              `📦 Oda Mpya! #${newOrder.order_number}\n👤 Mteja: ${customerProfile?.full_name || 'Mteja Mpya'}\n💰 Kiasi: TSH ${parseInt(newOrder.grand_total).toLocaleString()}`,
              { duration: 8000, icon: '💰' }
            );

            try {
              const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
              audio.volume = 0.3;
              await audio.play();
            } catch (error) {}

            document.title = `🔔 Oda Mpya! - Skyfall`;
            setTimeout(() => { document.title = "Skyfall"; }, 10000);

            if (window.navigator && window.navigator.vibrate) {
              window.navigator.vibrate(200);
            }
          }
        )
        .subscribe();
    };

    const startPolling = (storeId) => {
      if (pollingInterval) return;

      const checkForNewOrders = async () => {
        try {
          const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('store_id', storeId)
            .gt('created_at', lastCheckTime)
            .order('created_at', { ascending: false });

          if (error) throw error;

          if (orders && orders.length > 0) {
            lastCheckTime = new Date().toISOString();
            const ordersWithCustomers = await Promise.all(
              orders.map(async (order) => {
                const { data: customer } = await supabase
                  .from('profiles')
                  .select('full_name')
                  .eq('id', order.customer_id)
                  .maybeSingle();
                return { ...order, profiles: customer || { full_name: 'Mteja Mpya' } };
              })
            );

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

            document.title = `🔔 (${orders.length}) Oda Mpya!`;
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
      pollingInterval = setInterval(checkForNewOrders, 5000);
    };

    setupRealtime();

    return () => {
      if (channel) supabase.removeChannel(channel);
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [session?.user?.id, myStoreId]);

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Inasubiri',
      received: 'Imepokelewa',
      delivered: 'Imewasilishwa',
      cancelled: 'Imefutwa'
    };
    return labels[status] || labels.pending;
  };

 return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-[#0f172a]">

      {/* ===== HEADER ===== */}
      <header className="relative flex justify-between items-center px-3 md:px-6 py-2.5 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] z-[100] flex-shrink-0">
        <div className="flex items-center gap-2.5 md:gap-4">
          {!isMobile && (
            <Menu
              size={22}
              className="cursor-pointer text-gray-500 dark:text-slate-300 hover:text-[#ff6a00] transition-colors"
              onClick={() => setIsExpanded(!isExpanded)}
            />
          )}
          <Link
            to="/dashboard"
            className="text-base md:text-xl font-extrabold text-[#ff6a00] dark:text-[#ff8533] no-underline"
          >
            Skyfall.com
          </Link>
          {!isMobile && (
            <div className="flex items-center bg-gray-100 dark:bg-[#0f172a] px-3 py-1.5 rounded-lg ml-2.5">
              <Search size={16} className="text-gray-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search notifications..."
                className="border-none bg-transparent outline-none ml-2 text-sm w-[200px] text-gray-800 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500"
              />
            </div>
          )}
        </div>
        {!isMobile && (
          <div className="flex items-center gap-4">
            <Bell size={20} className="cursor-pointer text-[#ff6a00]" />
            <UserTools session={session} />
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* ===== SIDEBAR (Desktop) ===== */}
        {!isMobile && (
          <aside
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            className={`flex flex-col pt-5 bg-white dark:bg-[#1e293b] border-r border-gray-200 dark:border-slate-700 overflow-hidden whitespace-nowrap transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isExpanded ? 'w-60' : 'w-[70px]'
            }`}
          >
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center no-underline px-6 py-3 mx-2 my-1 rounded-lg transition-colors ${
                    isActive
                      ? 'text-[#ff6a00] dark:text-[#ff8533] bg-orange-50 dark:bg-[#2d2419]'
                      : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-gray-800 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="min-w-[22px] flex justify-center">
                    {item.icon}
                  </div>
                  <span
                    className={`ml-[15px] text-sm font-semibold transition-opacity duration-200 ${
                      isExpanded ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </aside>
        )}

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 p-4 md:p-6 pb-[90px] md:pb-6 overflow-y-auto bg-gray-50 dark:bg-[#0f172a]">
          <div className="max-w-[900px] mx-auto">

            <h2 className="text-xl md:text-2xl font-extrabold mb-5 md:mb-6 text-gray-800 dark:text-slate-100">
              Arifa za Orders
            </h2>

            {/* ===== TABS ===== */}
            <div className="flex gap-2 md:gap-3 mb-5 md:mb-6 border-b border-gray-200 dark:border-slate-700 pb-3 flex-wrap">
              <button
                onClick={() => setActiveTab("buyer")}
                className={`px-4 md:px-5 py-1.5 md:py-2 rounded-3xl border-none font-semibold text-xs md:text-sm cursor-pointer transition-all ${
                  activeTab === 'buyer'
                    ? 'bg-[#ff6a00] text-white'
                    : 'bg-gray-100 dark:bg-[#1e293b] text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                🛒 Ununuzi Wangu ({buyerOrders.length})
              </button>

              {sellerOrders.length > 0 && (
                <button
                  onClick={() => setActiveTab("seller")}
                  className={`px-4 md:px-5 py-1.5 md:py-2 rounded-3xl border-none font-semibold text-xs md:text-sm cursor-pointer transition-all ${
                    activeTab === 'seller'
                      ? 'bg-[#00a65a] text-white'
                      : 'bg-gray-100 dark:bg-[#1e293b] text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >
                  🏪 Mauzo Yangu ({sellerOrders.length})
                </button>
              )}
            </div>

            {/* ===== ORDERS LIST ===== */}
            <div>
              {loading ? (
                /* Loading */
                <div className="text-center py-15">
                  <div className="w-10 h-10 border-[3px] border-gray-100 dark:border-[#1e293b] border-t-[#ff6a00] rounded-full mx-auto animate-spin" />
                  <p className="mt-4 text-gray-500 dark:text-slate-400 text-sm">
                    Inapakia orders zako...
                  </p>
                </div>
              ) : (
                <>
                  {/* Seller empty */}
                  {activeTab === "seller" && sellerOrders.length === 0 && (
                    <div className="text-center py-15 bg-white dark:bg-[#1e293b] rounded-2xl">
                      <ShoppingBag size={64} className="text-gray-200 dark:text-slate-600 mx-auto" />
                      <p className="mt-4 text-gray-400 dark:text-slate-500 text-sm">
                        Hamna orders za duka lako bado
                      </p>
                    </div>
                  )}

                  {/* Buyer empty */}
                  {activeTab === "buyer" && buyerOrders.length === 0 && (
                    <div className="text-center py-15 bg-white dark:bg-[#1e293b] rounded-2xl">
                      <Bell size={64} className="text-gray-200 dark:text-slate-600 mx-auto" />
                      <p className="mt-4 text-gray-400 dark:text-slate-500 text-sm">
                        Hujafanya ununuzi wowote bado
                      </p>
                    </div>
                  )}

                  {/* Seller orders */}
                  {activeTab === "seller" && sellerOrders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                      className="flex flex-col md:flex-row md:justify-between md:items-center flex-wrap gap-3 md:gap-0 p-3 md:p-4 bg-white dark:bg-[#1e293b] rounded-xl mb-3 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-transform duration-200 border-l-4 border-l-[#00a65a] dark:border-l-[#10b981] hover:translate-x-1"
                    >
                      <div className="flex items-center gap-3 md:gap-4 flex-1">
                        <div className="p-2 md:p-2.5 rounded-full bg-green-50 dark:bg-[#064e3b] flex-shrink-0">
                          <ShoppingBag size={isMobile ? 18 : 22} className="text-[#00a65a] dark:text-[#34d399]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="m-0 text-sm md:text-base font-bold text-gray-800 dark:text-slate-100">
                            Oda #{order.order_number?.slice(0, 12)}
                          </h4>
                          <p className="my-1 text-xs md:text-sm text-gray-600 dark:text-slate-300">
                            Mteja: <strong className="text-gray-800 dark:text-slate-200">{order.profiles?.full_name?.slice(0, 20) || 'Mteja Mpya'}</strong>
                          </p>
                          <p className="my-0.5 text-[10px] md:text-xs text-gray-500 dark:text-slate-400">
                            🚚 {order.shipping_method || 'Usafirishaji'} | 📅 {new Date(order.created_at).toLocaleDateString('sw-TZ')}
                          </p>
                          <p className="mt-1 mb-0 text-[13px] md:text-[15px] font-bold text-[#ff6a00] dark:text-[#ff8533]">
                            TSH {order.grand_total?.toLocaleString() || 0}
                          </p>
                        </div>
                      </div>
                      <div className="flex md:flex-col items-center md:items-end gap-2 md:gap-0 md:text-right">
                        <span className={`text-[10px] md:text-[11px] px-2.5 md:px-3 py-1 md:py-1 rounded-full font-bold uppercase inline-block ${getStatusBadgeClass(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                        {!isMobile && (
                          <ChevronRight size={20} className="text-gray-400 dark:text-slate-500 mt-2" />
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Buyer orders */}
                  {activeTab === "buyer" && buyerOrders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                      className="flex flex-col md:flex-row md:justify-between md:items-center flex-wrap gap-3 md:gap-0 p-3 md:p-4 bg-white dark:bg-[#1e293b] rounded-xl mb-3 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-transform duration-200 border-l-4 border-l-[#ff6a00] dark:border-l-[#ff8533] hover:translate-x-1"
                    >
                      <div className="flex items-center gap-3 md:gap-4 flex-1">
                        <div className="p-2 md:p-2.5 rounded-full bg-orange-50 dark:bg-[#7c2d12] flex-shrink-0">
                          <Bell size={isMobile ? 18 : 22} className="text-[#ff6a00] dark:text-[#ff8533]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="m-0 text-sm md:text-base font-bold text-gray-800 dark:text-slate-100">
                            Oda #{order.order_number?.slice(0, 12)}
                          </h4>
                          <p className="my-1 text-xs md:text-sm text-gray-600 dark:text-slate-300">
                            Duka: <strong className="text-gray-800 dark:text-slate-200">{order.stores_engine?.store_name?.slice(0, 20) || 'Duka lisilojulikana'}</strong>
                          </p>
                          <p className="my-0.5 text-[10px] md:text-xs text-gray-500 dark:text-slate-400">
                            🚚 {order.shipping_method || 'Usafirishaji'} | 📅 {new Date(order.created_at).toLocaleDateString('sw-TZ')}
                          </p>
                          <p className="mt-1 mb-0 text-[13px] md:text-[15px] font-bold text-[#ff6a00] dark:text-[#ff8533]">
                            TSH {order.grand_total?.toLocaleString() || 0}
                          </p>
                        </div>
                      </div>
                      <div className="flex md:flex-col items-center md:items-end gap-2 md:gap-0 md:text-right">
                        <span className={`text-[10px] md:text-[11px] px-2.5 md:px-3 py-1 md:py-1 rounded-full font-bold uppercase inline-block ${getStatusBadgeClass(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                        {!isMobile && (
                          <ChevronRight size={20} className="text-gray-400 dark:text-slate-500 mt-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1e293b] flex justify-around items-center pt-2 pb-5 border-t border-gray-200 dark:border-slate-700 z-[1000] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.3)]">
          <div
            onClick={() => navigate('/dashboard')}
            className="flex flex-col items-center gap-1 cursor-pointer text-gray-500 dark:text-slate-400"
          >
            <Home size={22} />
            <span className="text-[10px]">Home</span>
          </div>
          <div
            onClick={() => navigate('/cart')}
            className="flex flex-col items-center gap-1 cursor-pointer text-gray-500 dark:text-slate-400"
          >
            <ShoppingBag size={22} />
            <span className="text-[10px]">Cart</span>
          </div>
          <div
            onClick={() => navigate('/dashboard/notifications')}
            className="flex flex-col items-center gap-1 cursor-pointer text-[#ff6a00] dark:text-[#ff8533]"
          >
            <Bell size={22} />
            <span className="text-[10px]">Alerts</span>
          </div>
          <div
            onClick={() => navigate('/profile')}
            className="flex flex-col items-center gap-1 cursor-pointer text-gray-500 dark:text-slate-400"
          >
            <User size={22} />
            <span className="text-[10px]">Account</span>
          </div>
        </nav>
      )}

      {isMobile && <div className="h-[70px]" />}
    </div>
  );
}