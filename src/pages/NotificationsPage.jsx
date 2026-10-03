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
import "../NotificationsPage.css";  // 🔥 ONGEZA IMPORT HII

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
    <div className="notifications-layout">

      {/* HEADER */}
      <header className="notifications-header">
        <div className="notifications-header-left">
          {!isMobile && (
            <Menu
              size={22}
              className="notifications-menu-icon"
              onClick={() => setIsExpanded(!isExpanded)}
            />
          )}

          <Link to="/dashboard" className="notifications-logo">
            Skyfall.com
          </Link>

          {!isMobile && (
            <div className="notifications-search">
              <Search size={16} color="#999" />
              <input
                type="text"
                placeholder="Search notifications..."
                className="notifications-search-input"
              />
            </div>
          )}
        </div>

        <div className="notifications-header-right">
          {!isMobile && (
            <>
              <Bell size={20} style={{ cursor: 'pointer', color: '#ff6a00' }} />
              <UserTools session={session} />
            </>
          )}
        </div>
      </header>

      <div className="notifications-body">

        {/* SIDEBAR */}
        {!isMobile && (
          <aside
            className={`notifications-sidebar ${isExpanded ? 'expanded' : ''}`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
          >
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`notifications-sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <div className="notifications-sidebar-icon">{item.icon}</div>
                <span className="notifications-sidebar-label">{item.label}</span>
              </Link>
            ))}
          </aside>
        )}

        {/* MAIN CONTENT */}
        <main className="notifications-main">
          <div className="notifications-content">

            <h2 className="notifications-title">Arifa za Orders</h2>

            {/* TABS */}
            <div className="notifications-tabs">
              <button
                onClick={() => setActiveTab("buyer")}
                className={`notifications-tab ${activeTab === 'buyer' ? 'active-buyer' : ''}`}
              >
                🛒 Ununuzi Wangu ({buyerOrders.length})
              </button>

              {sellerOrders.length > 0 && (
                <button
                  onClick={() => setActiveTab("seller")}
                  className={`notifications-tab ${activeTab === 'seller' ? 'active-seller' : ''}`}
                >
                  🏪 Mauzo Yangu ({sellerOrders.length})
                </button>
              )}
            </div>

            {/* ORDERS LIST */}
            <div>
              {loading ? (
                <div className="notifications-loading">
                  <div className="notifications-spinner"></div>
                  <p className="notifications-loading-text">Inapakia orders zako...</p>
                </div>
              ) : (
                <>
                  {activeTab === "seller" && sellerOrders.length === 0 && (
                    <div className="notifications-empty">
                      <ShoppingBag size={64} color="#ddd" />
                      <p className="notifications-empty-text">Hamna orders za duka lako bado</p>
                    </div>
                  )}

                  {activeTab === "buyer" && buyerOrders.length === 0 && (
                    <div className="notifications-empty">
                      <Bell size={64} color="#ddd" />
                      <p className="notifications-empty-text">Hujafanya ununuzi wowote bado</p>
                    </div>
                  )}

                  {activeTab === "seller" && sellerOrders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                      className="notifications-order-card seller"
                    >
                      <div className="notifications-order-info">
                        <div className="notifications-order-icon-wrapper seller">
                          <ShoppingBag size={isMobile ? 18 : 22} color="#00a65a" />
                        </div>
                        <div className="notifications-order-details">
                          <h4 className="notifications-order-title">
                            Oda #{order.order_number?.slice(0, 12)}
                          </h4>
                          <p className="notifications-order-subtitle">
                            Mteja: <strong>{order.profiles?.full_name?.slice(0, 20) || 'Mteja Mpya'}</strong>
                          </p>
                          <p className="notifications-order-meta">
                            🚚 {order.shipping_method || 'Usafirishaji'} | 📅 {new Date(order.created_at).toLocaleDateString('sw-TZ')}
                          </p>
                          <p className="notifications-order-total">
                            TSH {order.grand_total?.toLocaleString() || 0}
                          </p>
                        </div>
                      </div>
                      <div className="notifications-order-status-wrapper">
                        <span className={`notifications-status-badge ${order.status || 'pending'}`}>
                          {getStatusLabel(order.status)}
                        </span>
                        {!isMobile && <ChevronRight size={20} color="#9ca3af" className="notifications-order-arrow" />}
                      </div>
                    </div>
                  ))}

                  {activeTab === "buyer" && buyerOrders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                      className="notifications-order-card buyer"
                    >
                      <div className="notifications-order-info">
                        <div className="notifications-order-icon-wrapper buyer">
                          <Bell size={isMobile ? 18 : 22} color="#ff6a00" />
                        </div>
                        <div className="notifications-order-details">
                          <h4 className="notifications-order-title">
                            Oda #{order.order_number?.slice(0, 12)}
                          </h4>
                          <p className="notifications-order-subtitle">
                            Duka: <strong>{order.stores_engine?.store_name?.slice(0, 20) || 'Duka lisilojulikana'}</strong>
                          </p>
                          <p className="notifications-order-meta">
                            🚚 {order.shipping_method || 'Usafirishaji'} | 📅 {new Date(order.created_at).toLocaleDateString('sw-TZ')}
                          </p>
                          <p className="notifications-order-total">
                            TSH {order.grand_total?.toLocaleString() || 0}
                          </p>
                        </div>
                      </div>
                      <div className="notifications-order-status-wrapper">
                        <span className={`notifications-status-badge ${order.status || 'pending'}`}>
                          {getStatusLabel(order.status)}
                        </span>
                        {!isMobile && <ChevronRight size={20} color="#9ca3af" className="notifications-order-arrow" />}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      {isMobile && (
        <nav className="notifications-mobile-nav">
          <div onClick={() => navigate('/dashboard')} className="notifications-nav-item">
            <Home size={22} />
            <span>Home</span>
          </div>
          <div onClick={() => navigate('/cart')} className="notifications-nav-item">
            <ShoppingBag size={22} />
            <span>Cart</span>
          </div>
          <div onClick={() => navigate('/dashboard/notifications')} className="notifications-nav-item active">
            <Bell size={22} />
            <span>Alerts</span>
          </div>
          <div onClick={() => navigate('/profile')} className="notifications-nav-item">
            <User size={22} />
            <span>Account</span>
          </div>
        </nav>
      )}

      {isMobile && <div className="notifications-mobile-spacer" />}
    </div>
  );
}