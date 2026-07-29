import React, { useEffect, useState } from 'react';
import api from '../axiosConfig'; // 🔥 Tumia api
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, MessageSquare, ClipboardList, 
  Settings, Bell, Search, Menu, Home, Megaphone, ShoppingBag, ChevronRight
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import '../MyOrders.css';

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

      // 🔥 MABADILIKO: api.get na kuondoa API_BASE_URL
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

      // 🔥 MABADILIKO: api.get na kuondoa API_BASE_URL
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

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #f3f4f6', borderTop: '3px solid #ff6a00', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
    </div>
  );

  return (
    <div className="dashboard-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f7f8fa' }}>
      <Toaster position="top-center" />
      
      <header className="dashboard-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: isMobile ? '10px 15px' : '10px 24px', 
        borderBottom: '1px solid #eee', 
        backgroundColor: '#fff' 
      }}>
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
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

          {!isMobile && (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: '#f4f4f4', padding: '6px 12px', borderRadius: '8px' }}>
              <Search size={16} color="#999" />
              <input type="text" placeholder="Tafuta oda..." style={{ border: 'none', background: 'none', outline: 'none', marginLeft: '8px', fontSize: '14px' }} />
            </div>
          )}
        </div>

        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {!isMobile && (
            <Bell size={20} style={{ cursor: 'pointer', color: '#666' }} />
          )}
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
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
              transition: 'width 0.3s ease',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              zIndex: 10
            }}
          >
            {sidebarItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 24px',
                  textDecoration: 'none',
                  color: location.pathname === item.path ? '#ff6a00' : '#666',
                  backgroundColor: location.pathname === item.path ? '#fff5ed' : 'transparent',
                  margin: '4px 8px',
                  borderRadius: '8px',
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

        <main style={{ flex: 1, padding: isMobile ? '15px' : '24px', backgroundColor: '#f7f8fa', overflowY: 'auto' }}>
          <div className="orders-content-wrapper" style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <h1 className="orders-main-title" style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: '#1a1a1a' }}>
              Oda za Wateja
            </h1>

            {orders.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '80px 20px', textAlign: 'center', backgroundColor: '#fff',
                borderRadius: '16px', border: '1px solid #eee', marginTop: '20px'
              }}>
                <ShoppingBag size={64} color="#ddd" style={{ marginBottom: '20px' }} />
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a', marginBottom: '12px' }}>Bado hamna oda</h2>
                <p style={{ color: '#666', maxWidth: '400px', marginBottom: '32px', fontSize: '15px' }}>
                  Wateja bado hawajaweka oda. Tangaza bidhaa zako ili kuanza kupata oda.
                </p>
                <button 
                  onClick={() => navigate('/advertise')}
                  style={{ backgroundColor: '#ff6a00', color: 'white', padding: '14px 40px', borderRadius: '30px', border: 'none', fontWeight: '700', cursor: 'pointer' }}
                >
                  Tangaza Sasa
                </button>
              </div>
            ) : (
              <div className="orders-list-grid" style={{ display: 'grid', gap: '20px' }}>
                {orders.map((order) => {
                  const orderItems = order.order_items || [];
                  const totalItems = orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
                  const isExpandedOrder = expandedOrders[order.id];

                  return (
                    <div key={order.id} style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #eee', overflow: 'hidden' }}>
                      <div style={{ padding: '20px', borderBottom: '1px solid #eee', backgroundColor: '#fafafa' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                          <div>
                            <span style={{ fontSize: '12px', color: '#888' }}>Oda #{order.order_number?.slice(0, 12)}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                              <span style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>
                                {order.profiles?.full_name || order.customer?.full_name || 'Mteja Asiyejulikana'}
                              </span>
                              {(order.profiles?.avatar_url || order.customer?.avatar_url) && (
                                <img src={order.profiles?.avatar_url || order.customer?.avatar_url} alt="" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                              )}
                            </div>
                            <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#666' }}>
                              📅 {new Date(order.created_at).toLocaleDateString()} | Bidhaa: {totalItems}
                            </p>
                          </div>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div style={getStatusStyle(order.status)}>
                              {getStatusStyle(order.status).label}
                            </div>
                            <button
                              onClick={() => toggleExpandOrder(order.id)}
                              style={{
                                background: 'none', border: '1px solid #ddd', borderRadius: '8px',
                                padding: '6px 12px', fontSize: '12px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '5px'
                              }}
                            >
                              {isExpandedOrder ? '▲ Punguza' : '▼ Onyesha Bidhaa'}
                              <span style={{ fontSize: '11px', color: '#666' }}>({orderItems.length})</span>
                            </button>
                          </div>
                        </div>
                        
                        <div style={{ marginTop: '12px', textAlign: 'right' }}>
                          <span style={{ fontSize: '14px', color: '#666' }}>Jumla ya Oda: </span>
                          <span style={{ fontSize: '20px', fontWeight: '800', color: '#ff6a00' }}>
                            TZS {order.grand_total?.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          {orderItems.map((item, idx) => (
                            <div 
                              key={item.id || idx} 
                              style={{ 
                                display: 'flex', gap: '15px', alignItems: 'center',
                                paddingBottom: idx !== orderItems.length - 1 ? '15px' : 0,
                                borderBottom: idx !== orderItems.length - 1 ? '1px solid #f0f0f0' : 'none'
                              }}
                            >
                              <img 
                                src={item.product_image || 'https://via.placeholder.com/80'} 
                                alt={item.product_name}
                                style={{ width: '70px', height: '70px', borderRadius: '10px', objectFit: 'cover', backgroundColor: '#f9f9f9' }} 
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/70' }}
                              />
                              <div style={{ flex: 1 }}>
                                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#333' }}>{item.product_name}</h4>
                                <p style={{ margin: '5px 0', fontSize: '13px', color: '#666' }}>
                                  Rangi: <strong>{item.selected_color || 'N/A'}</strong> | 
                                  Size: <strong>{item.selected_size || 'N/A'}</strong> | 
                                  Quantity: <strong>{item.quantity || 1}</strong>
                                </p>
                                <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#ff6a00' }}>
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

      {isMobile && (
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '10px 0 20px',
          borderTop: '1px solid #eee',
          zIndex: 1000,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
        }}>
          <button onClick={() => navigate('/dashboard/sellerboard')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', flex: 1, color: location.pathname.startsWith('/dashboard/sellerboard') ? '#ff6600' : '#666' }}>
            <Home size={22} color={location.pathname.startsWith('/dashboard/sellerboard') ? '#ff6600' : '#666'} />
            <span style={{ fontSize: '10px', color: location.pathname.startsWith('/dashboard/sellerboard') ? '#ff6600' : '#666' }}>Duka</span>
          </button>
          <button onClick={() => navigate('/dashboard/supplier-orders')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', flex: 1, color: location.pathname === '/dashboard/supplier-orders' ? '#ff6600' : '#666' }}>
            <ClipboardList size={22} color={location.pathname === '/dashboard/supplier-orders' ? '#ff6600' : '#666'} />
            <span style={{ fontSize: '10px', color: location.pathname === '/dashboard/supplier-orders' ? '#ff6600' : '#666' }}>Oda</span>
          </button>
          <button onClick={() => navigate('/advertise')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', flex: 1, color: location.pathname === '/advertise' ? '#ff6600' : '#666' }}>
            <Megaphone size={22} color={location.pathname === '/advertise' ? '#ff6600' : '#666'} />
            <span style={{ fontSize: '10px', color: location.pathname === '/advertise' ? '#ff6600' : '#666' }}>Ads</span>
          </button>
          <button onClick={() => navigate('/dashboard/supplier-notifications')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', flex: 1, color: location.pathname === '/dashboard/supplier-notifications' ? '#ff6600' : '#666' }}>
            <Bell size={22} color={location.pathname === '/dashboard/supplier-notifications' ? '#ff6600' : '#666'} />
            <span style={{ fontSize: '10px', color: location.pathname === '/dashboard/supplier-notifications' ? '#ff6600' : '#666' }}>Arifa</span>
          </button>
        </nav>
      )}

      {isMobile && <div style={{ height: '70px' }} />}
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SupplierOrders;