import React, { useState, useEffect } from "react";
import axios from "axios"; // ✅ Badilisha: Axios badala ya Supabase
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Bell, ShoppingBag, Home, ChevronRight, 
  LayoutDashboard, MessageSquare, ClipboardList, 
  Settings, Menu, Megaphone
} from "lucide-react";
import toast from 'react-hot-toast';
import "../NotificationsPage.css"; 

const API_BASE_URL = "http://127.0.0.1:8000/api"; // ✅ Ongeza hii

export default function SupplierNotifications({ session }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [sellerOrders, setSellerOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [myStoreId, setMyStoreId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 🔥 SIDEBAR KWA MUUZAJI PEKEE (SAHIHI)
  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, path: '/dashboard/sellerboard', label: 'Duka Lako' },
    { icon: <MessageSquare size={20} />, path: '/dashboard/supplier-messages', label: 'Ujumbe' },
    { icon: <ClipboardList size={20} />, path: '/dashboard/supplier-notifications', label: 'Arifa (Oda)' }, 
    { icon: <Settings size={20} />, path: '/dashboard/supplier-settings', label: 'Mipangilio' },
  ];

  // ✅ FETCH SUPPLIER ORDERS (Kupitia Django API)
  useEffect(() => {
    const fetchSellerOrders = async () => {
      // Check token
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      
      try {
        // 1. Pata store ya mtumiaji
        const storeRes = await axios.get(`${API_BASE_URL}/stores/`, {
          params: { owner_id: session?.user?.id }, // endpoint inabidi ichuje kwa owner_id
          headers
        });
        const store = storeRes.data?.[0];

        if (store) {
          setMyStoreId(store.id);

          // 2. Pata orders za store hii
          const ordersRes = await axios.get(`${API_BASE_URL}/orders/`, {
            params: { store_id: store.id, ordering: '-created_at' },
            headers
          });

          // 3. Chukua data na uishughulikie
          const orders = ordersRes.data || [];
          
          // Kama Django inarudisha customer profile kwa nested serializer, hii inatosha.
          // Ikiwa haijajumuishwa, unaweza ku-map kwa kutumia `customer_id` na kupiga `/api/profile/{id}/`
          // Lakini kwa mfano huu, tunachukulia kuwa `customer` (au `profiles`) iko kwenye response.
          const ordersWithCustomers = orders.map(order => {
            // Tunaweka profile dummy kama haijajumuishwa
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
  }, [session?.user?.id]);

  // ✅ POLLING (Kwa sababu Django bado haina Realtime WebSocket)
  useEffect(() => {
    if (!session?.user?.id || !myStoreId) return;
    
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

          const { data: orders, status } = await axios.get(`${API_BASE_URL}/orders/`, { params, headers });

          if (status === 200 && orders && orders.length > 0) {
            console.log(`📦 Found ${orders.length} new order(s) via polling`);
            lastCheckTime = new Date().toISOString();
            
            // Map customer data
            const ordersWithCustomers = orders.map(order => ({
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
      
      // Check immediately then every 10 seconds
      checkForNewOrders();
      pollingInterval = setInterval(checkForNewOrders, 10000);
    };
    
    startPolling(myStoreId);
    
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [session?.user?.id, myStoreId]);

  const getStatusStyle = (status) => {
    const styles = {
      pending: { backgroundColor: '#fff7ed', color: '#ff6a00', label: 'Inasubiri' },
      received: { backgroundColor: '#e8f4fd', color: '#2196f3', label: 'Imepokelewa' },
      delivered: { backgroundColor: '#e6fff0', color: '#00a65a', label: 'Imewasilishwa' },
      cancelled: { backgroundColor: '#fee2e2', color: '#ef4444', label: 'Imefutwa' }
    };
    const style = styles[status] || styles.pending;
    return {
      fontSize: isMobile ? '10px' : '11px',
      padding: isMobile ? '3px 10px' : '4px 12px',
      borderRadius: '20px',
      fontWeight: '700',
      textTransform: 'uppercase',
      ...style
    };
  };

  return (
    <div className="dashboard-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f7f8fa' }}>
      
      {/* HEADER YA SUPPLIER */}
      <header className="dashboard-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: isMobile ? '10px 16px' : '10px 24px', 
        borderBottom: '1px solid #eee', 
        backgroundColor: '#fff', 
        zIndex: 100 
      }}>
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '15px' }}>
          {!isMobile && (
            <Menu size={22} style={{ cursor: 'pointer', color: '#666' }} onClick={() => setIsExpanded(!isExpanded)} />
          )}
          
          <Link to="/dashboard/sellerboard" style={{ 
            fontSize: isMobile ? '18px' : '20px',
            fontWeight: '800', 
            color: '#ff6a00', 
            textDecoration: 'none' 
          }}>
            Skyfall.com
          </Link>
        </div>

        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '15px' }}>
          {!isMobile && (
            <Bell size={20} style={{ cursor: 'pointer', color: '#ff6a00' }} />
          )}
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* SIDEBAR - Supplier Version */}
        {!isMobile && (
          <aside 
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            style={{ 
              width: isExpanded ? '240px' : '70px', 
              borderRight: '1px solid #eee', 
              display: 'flex', 
              flexDirection: 'column', 
              paddingTop: '20px', 
              backgroundColor: '#fff',
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}
          >
            {sidebarItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className="sidebar-item"
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: location.pathname === item.path ? '#ff6a00' : '#666',
                  padding: '12px 24px',
                  margin: '4px 8px',
                  borderRadius: '8px',
                  backgroundColor: location.pathname === item.path ? '#fff5ed' : 'transparent',
                  transition: '0.2s'
                }}
              >
                <div style={{ minWidth: '22px', display: 'flex', justifyContent: 'center' }}>
                  {item.icon}
                </div>
                <span style={{ 
                  marginLeft: '15px', 
                  fontSize: '14px', 
                  fontWeight: '600',
                  opacity: isExpanded ? 1 : 0,
                  transition: 'opacity 0.2s'
                }}>
                  {item.label}
                </span>
              </Link>
            ))}
          </aside>
        )}

        {/* MAIN CONTENT - SUPPLIER ORDERS ONLY */}
        <main style={{ 
          flex: 1, 
          padding: isMobile ? '16px' : '24px', 
          overflowY: 'auto' 
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            
            <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '800', marginBottom: '24px', color: '#222' }}>
              Arifa za Mauzo (Orders)
            </h2>

            <div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                  <div style={{ width: '40px', height: '40px', border: '3px solid #f3f4f6', borderTop: '3px solid #ff6a00', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
                  <p style={{ marginTop: '16px', color: '#6b7280' }}>Inapakia orders zako...</p>
                </div>
              ) : (
                <>
                  {sellerOrders.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '16px' }}>
                      <ShoppingBag size={64} color="#ddd" />
                      <p style={{ marginTop: '16px', color: '#9ca3af' }}>Hamna orders za duka lako bado</p>
                    </div>
                  )}
                  
                  {sellerOrders.map((order) => (
                    <div 
                      key={order.id} 
                      onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: isMobile ? '12px' : '16px',
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        marginBottom: '12px',
                        cursor: 'pointer',
                        borderLeft: '4px solid #00a65a',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        transition: 'transform 0.2s',
                        flexWrap: isMobile ? 'wrap' : 'nowrap'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '15px', flex: 1 }}>
                        <div style={{ backgroundColor: '#e6fff0', padding: isMobile ? '8px' : '10px', borderRadius: '50%' }}>
                          <ShoppingBag size={isMobile ? 18 : 22} color="#00a65a" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: 0, fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: '#1f2937' }}>
                            Oda #{order.order_number?.slice(0, 12)}
                          </h4>
                          <p style={{ margin: '4px 0', fontSize: isMobile ? '12px' : '14px', color: '#4b5563' }}>
                            Mteja: <strong>{order.profiles?.full_name?.slice(0, 20) || 'Mteja Mpya'}</strong>
                          </p>
                          <p style={{ margin: '2px 0', fontSize: isMobile ? '10px' : '12px', color: '#6b7280' }}>
                            🚚 {order.shipping_method || 'Usafirishaji'} | 📅 {new Date(order.created_at).toLocaleDateString('sw-TZ')}
                          </p>
                          <p style={{ margin: '4px 0 0', fontSize: isMobile ? '13px' : '15px', fontWeight: '700', color: '#ff6a00' }}>
                            TSH {order.grand_total?.toLocaleString() || 0}
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', marginTop: isMobile ? '8px' : '0' }}>
                        <span style={getStatusStyle(order.status)}>
                          {getStatusStyle(order.status).label}
                        </span>
                        {!isMobile && <ChevronRight size={20} color="#9ca3af" style={{ marginTop: '8px' }} />}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* MOBILE BOTTOM NAV - SUPPLIER VERSION (SAHIHI) */}
      {isMobile && (
        <nav className="mobile-bottom-nav" style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '8px 0 20px',
          borderTop: '1px solid #eee',
          zIndex: 1000,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
        }}>
          {/* Duka - Inaelekeza kwenye Supplier Dashboard */}
          <button onClick={() => navigate('/dashboard/sellerboard')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', background: 'none', border: 'none', flex: 1 }}>
            <Home size={22} color={location.pathname.startsWith('/dashboard/sellerboard') ? '#ff6a00' : '#666'} />
            <span style={{ fontSize: '10px', color: location.pathname.startsWith('/dashboard/sellerboard') ? '#ff6a00' : '#666' }}>Duka</span>
          </button>

          {/* 🔥 Oda - Inaelekeza kwenye Supplier Orders (sio notifications!) */}
          <button onClick={() => navigate('/dashboard/supplier-orders')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', background: 'none', border: 'none', flex: 1 }}>
            <ClipboardList size={22} color={location.pathname === '/dashboard/supplier-orders' ? '#ff6a00' : '#666'} />
            <span style={{ fontSize: '10px', color: location.pathname === '/dashboard/supplier-orders' ? '#ff6a00' : '#666' }}>Oda</span>
          </button>

          {/* Ads - Inabaki sawa */}
          <button onClick={() => navigate('/advertise')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', background: 'none', border: 'none', flex: 1 }}>
            <Megaphone size={22} color={location.pathname === '/advertise' ? '#ff6a00' : '#666'} />
            <span style={{ fontSize: '10px', color: location.pathname === '/advertise' ? '#ff6a00' : '#666' }}>Ads</span>
          </button>

          {/* 🔥 Arifa - Inaelekeza kwenye Supplier Notifications */}
          <button onClick={() => navigate('/dashboard/supplier-notifications')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', background: 'none', border: 'none', flex: 1 }}>
            <Bell size={22} color={location.pathname === '/dashboard/supplier-notifications' ? '#ff6a00' : '#666'} />
            <span style={{ fontSize: '10px', color: location.pathname === '/dashboard/supplier-notifications' ? '#ff6a00' : '#666' }}>Arifa</span>
          </button>
        </nav>
      )}

      {/* Add padding bottom for mobile */}
      {isMobile && <div style={{ height: '70px' }} />}
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}