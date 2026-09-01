// src/pages/MyOrders.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, MessageSquare, ClipboardList, 
  Settings, BarChart3, Bell, Search, CheckCircle2, Menu , ChevronLeft 
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import api from '../axiosConfig'; // 🔥 Badilisha: tumia api!
import UserTools from '../components/UserTools';
import '../MyOrders.css';
import messageImage from "../images/orderAhead.svg"; 

const MyOrders = () => { // 🔥 Imeondolewa { session }
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const [feedback, setFeedback] = useState({}); 
  const [ratings, setRatings] = useState({}); 
  const navigate = useNavigate();  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Detect mobile resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 🔥 Pata ID ya mtumiaji kwanza
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          navigate('/dashboard/login');
          return;
        }
        const res = await api.get('/profile/');
        setCurrentUserId(res.data.id);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Imeshindwa kupata data za mtumiaji.");
      }
    };
    fetchProfile();
  }, [navigate]);

  // ==========================================
  // 🔥 FETCH ORDERS KUTOKA DJANGO
  // ==========================================
  const fetchOrders = async () => {
    if (!currentUserId) return;
    setLoading(true);

    try {
      // 1. Pata orders za mtumiaji huyu
      const ordersRes = await api.get('/orders/', {
        params: { customer: currentUserId, ordering: '-created_at' }
      });
      const ordersData = ordersRes.data.results || ordersRes.data || [];

      // 2. Kwa kila order, pata order_items
      const ordersWithItems = [];
      for (const order of ordersData) {
        const itemsRes = await api.get('/order-items/', {
          params: { order: order.id }
        });
        ordersWithItems.push({
          ...order,
          order_items: itemsRes.data.results || itemsRes.data || []
        });
      }

      setOrders(ordersWithItems);
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data || error.message);
      toast.error("Imeshindwa kupata oda zako.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) fetchOrders();
  }, [currentUserId]);

  // ==========================================
  // 🔥 HANDLE REPORT ISSUE (Django API)
  // ==========================================
  const handleReportIssue = async (orderId, storeId, orderItems) => {
    if (!orderId || !storeId) {
      toast.error("Taarifa za duka hazijapatikana.");
      return;
    }

    const firstItem = orderItems?.[0];
    const productName = firstItem?.product_name || "Bidhaa isiyojulikana";
    const productId = firstItem?.product_id || "";
    const messageText = `Habari, nina tatizo na oda #${orderId.slice(0, 8)}: Bidhaa "${productName}" haijafika kama ilivyotarajiwa. Tafadhali nisaidie.`;

    try {
      // 1. Tafuta maelezo ya duka (owner_id na whatsapp_number)
      const storeRes = await api.get(`/stores/${storeId}/`);
      const store = storeRes.data;

      // 2. Fungua WhatsApp
      const whatsapp = store.whatsapp_number?.replace(/\s+/g, '');
      if (whatsapp) {
        window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(messageText)}`, '_blank');
      }

      // 3. Weka dispute kwenye database (POST /api/disputes/)
      await api.post('/disputes/', {
        order_id: orderId,
        store_id: storeId,
        customer: currentUserId,
        product_name: productName,
        product_id: productId,
        reason: 'Bidhaa haijafika',
        description: messageText,
        status: 'open'
      });

      // 4. Tuma ujumbe kwenye mfumo wa messages
      await api.post('/messages/', {
        sender: currentUserId,
        receiver: store.owner_id,
        order: orderId,
        content: messageText
      });

      toast.success("Ripoti imetumwa kwa muuzaji na kurekodiwa kwenye mfumo!");
      navigate('/dashboard/messages');

    } catch (err) {
      toast.error("Kuna tatizo: " + (err.response?.data?.detail || err.message));
      console.error(err);
    }
  };

  // ==========================================
  // 🔥 CONFIRM DELIVERY
  // ==========================================
  const handleConfirmDelivery = async (orderId) => {
    const confirmBox = window.confirm("Je, unathibitisha kuwa umepokea bidhaa hii?");
    if (!confirmBox) return;

    try {
      await api.patch(`/orders/${orderId}/`, { status: 'delivered' });
      toast.success("Oda imethibitishwa!");
      fetchOrders();
    } catch (err) {
      toast.error("Imeshindwa kuthibitisha: " + (err.response?.data?.detail || err.message));
    }
  };

  // ==========================================
  // 🔥 SUBMIT FEEDBACK
  // ==========================================
  const handleSubmitFeedback = async (orderId) => {
    const comment = feedback[orderId];
    const rating = ratings[orderId] || 5;

    if (!comment) {
      toast.error("Tafadhali andika maoni kwanza");
      return;
    }

    try {
      await api.patch(`/orders/${orderId}/`, { 
        customer_feedback: comment, 
        customer_rating: rating,
        feedback_date: new Date().toISOString()
      });
      toast.success("Asante kwa maoni yako!");
      fetchOrders(); 
    } catch (err) {
      toast.error("Imeshindwa kutuma maoni.");
    }
  };

  // ✅ Toggle kufungua/kufunga bidhaa zote za order
  const toggleExpandOrder = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, path: '/dashboard', label: 'Dashboard' },
    { icon: <MessageSquare size={20} />, path: '/dashboard/messages', label: 'Messages' },
    { icon: <ClipboardList size={20} />, path: '/dashboard/orders', label: 'Orders' },
    { icon: <BarChart3 size={20} />, path: '/dashboard/analytics', label: 'Analytics' },
    { icon: <Settings size={20} />, path: '/dashboard/settings', label: 'Settings' },
  ];

// 🔥 SKELETON LOADING - Inafanana na muonekano halisi!
if (loading) {
  return (
    <div className="dashboard-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      {/* Header Skeleton (Inafanana na Header halisi) */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '10px 24px', 
        borderBottom: '1px solid #eee', 
        backgroundColor: '#fff' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '8px', backgroundColor: '#e0e0e0', animation: 'pulse 1.5s infinite' }}></div>
          <div style={{ width: '120px', height: '20px', borderRadius: '8px', backgroundColor: '#e0e0e0', animation: 'pulse 1.5s infinite' }}></div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <main style={{ flex: 1, padding: '24px', backgroundColor: '#f7f8fa' }}>
          <div className="orders-content-wrapper" style={{ maxWidth: '1100px', margin: '0 auto' }}>
            
            {/* Title Skeleton */}
            <div style={{ width: '200px', height: '30px', borderRadius: '8px', backgroundColor: '#e0e0e0', marginBottom: '20px', animation: 'pulse 1.5s infinite' }}></div>

            {/* Order Cards Skeleton */}
            <div className="orders-list-grid" style={{ display: 'grid', gap: '20px' }}>
              {[1, 2].map((i) => (
                <div key={i} style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #eee', overflow: 'hidden' }}>
                  
                  {/* Header ya Card (Order no & Status) */}
                  <div style={{ padding: '20px', borderBottom: '1px solid #eee', backgroundColor: '#fafafa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <div style={{ width: '100px', height: '12px', borderRadius: '6px', backgroundColor: '#e0e0e0', marginBottom: '8px', animation: 'pulse 1.5s infinite' }}></div>
                        <div style={{ width: '150px', height: '12px', borderRadius: '6px', backgroundColor: '#e0e0e0', animation: 'pulse 1.5s infinite' }}></div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{ width: '60px', height: '24px', borderRadius: '12px', backgroundColor: '#e0e0e0', animation: 'pulse 1.5s infinite' }}></div>
                        <div style={{ width: '80px', height: '24px', borderRadius: '8px', backgroundColor: '#e0e0e0', animation: 'pulse 1.5s infinite' }}></div>
                      </div>
                    </div>
                    <div style={{ marginTop: '15px', textAlign: 'right' }}>
                      <div style={{ width: '120px', height: '20px', borderRadius: '8px', backgroundColor: '#e0e0e0', marginLeft: 'auto', animation: 'pulse 1.5s infinite' }}></div>
                    </div>
                  </div>

                  {/* Items Skeleton (Picha + Maelezo) */}
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <div style={{ width: '70px', height: '70px', borderRadius: '10px', backgroundColor: '#e0e0e0', animation: 'pulse 1.5s infinite' }}></div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ width: '70%', height: '14px', borderRadius: '8px', backgroundColor: '#e0e0e0', animation: 'pulse 1.5s infinite' }}></div>
                        <div style={{ width: '50%', height: '12px', borderRadius: '8px', backgroundColor: '#e0e0e0', animation: 'pulse 1.5s infinite' }}></div>
                        <div style={{ width: '30%', height: '12px', borderRadius: '8px', backgroundColor: '#e0e0e0', animation: 'pulse 1.5s infinite' }}></div>
                      </div>
                    </div>

                    {/* Buttons Skeleton */}
                    <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #f5f5f5', display: 'flex', gap: '10px' }}>
                      <div style={{ width: '100px', height: '34px', borderRadius: '8px', backgroundColor: '#e0e0e0', animation: 'pulse 1.5s infinite' }}></div>
                      <div style={{ width: '100px', height: '34px', borderRadius: '8px', backgroundColor: '#e0e0e0', animation: 'pulse 1.5s infinite' }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
  return (
    <div className="dashboard-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
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
    
    {/* 🔥 ONGEZA BACK ARROW (Inaonekana Mobile tu) */}
    {isMobile && (
      <button 
        onClick={() => navigate(-1)}
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <ChevronLeft size={24} color="#333" />
      </button>
    )}

    {/* 🔥 Desktop tu: Menu ya Kufungua Sidebar */}
    {!isMobile && (
      <Menu size={22} style={{ cursor: 'pointer', color: '#666' }} onClick={() => setIsExpanded(!isExpanded)} />
    )}

    <Link to="/dashboard" style={{ 
      fontSize: isMobile ? '18px' : '20px', 
      fontWeight: '800', 
      color: '#ff6a00', 
      textDecoration: 'none' 
    }}>
      Skyfall.com
    </Link>

    {/* 🔥 Desktop tu: Search Box */}
    {!isMobile && (
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: '#f4f4f4', padding: '6px 12px', borderRadius: '8px' }}>
        <Search size={16} color="#999" />
        <input type="text" placeholder="Search orders..." style={{ border: 'none', background: 'none', outline: 'none', marginLeft: '8px', fontSize: '14px' }} />
      </div>
    )}
  </div>
  <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
    {!isMobile && (
      <>
        <Bell size={20} style={{ cursor: 'pointer', color: '#666' }} />
        <UserTools /> {/* 🔥 Imeondolewa { session } */}
      </>
    )}
  </div>
</header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Sidebar */}
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
            <h1 className="orders-main-title" style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px' }}>Your orders</h1>

            {orders.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '80px 20px', textAlign: 'center', backgroundColor: '#fff',
                borderRadius: '16px', border: '1px solid #eee', marginTop: '20px'
              }}>
                <img src={messageImage} alt="No orders" style={{ width: '280px', marginBottom: '24px' }} />
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a', marginBottom: '12px' }}>Bado haujanunua kitu</h2>
                <p style={{ color: '#666', maxWidth: '400px', marginBottom: '32px', fontSize: '15px' }}>
                  Inaonekana bado haujaweka oda yoyote. Anza sasa kupata bidhaa bora kutoka kwetu.
                </p>
                <button 
                  onClick={() => navigate('/')}
                  style={{ backgroundColor: '#ff6a00', color: 'white', padding: '14px 40px', borderRadius: '30px', border: 'none', fontWeight: '700', cursor: 'pointer' }}
                >
                  Anza Kununua Sasa
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
                      {/* ORDER HEADER */}
                      <div style={{ padding: '20px', borderBottom: '1px solid #eee', backgroundColor: '#fafafa' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                          <div>
                            <span style={{ fontSize: '12px', color: '#888' }}>Order #{order.order_number?.slice(0, 12)}</span>
                            <p style={{ margin: '5px 0 0', fontSize: '13px', color: '#666' }}>
                              {new Date(order.created_at).toLocaleDateString()} | Bidhaa: {totalItems}
                            </p>
                          </div>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div style={{ 
                              padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800',
                              backgroundColor: order.status === 'delivered' ? '#e8f5e9' : '#fff3e0',
                              color: order.status === 'delivered' ? '#2e7d32' : '#ef6c00',
                              textTransform: 'uppercase'
                            }}>
                              {order.status}
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
                        
                        {/* JUMLA YA ODA */}
                        <div style={{ marginTop: '12px', textAlign: 'right' }}>
                          <span style={{ fontSize: '14px', color: '#666' }}>Jumla ya Oda: </span>
                          <span style={{ fontSize: '20px', fontWeight: '800', color: '#ff6a00' }}>
                            TZS {order.grand_total?.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* ORDER ITEMS - LIST YA BIDHAA ZOTE KATIKA ODA HII */}
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

                        {/* BUTTONS ZA ORDER */}
                        <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #f5f5f5', display: 'flex', gap: '10px' }}>
                          {order.status !== 'delivered' && (
                            <button 
                              onClick={() => handleConfirmDelivery(order.id)}
                              style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#4caf50', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
                            >
                              ✓ Nimepokea
                            </button>
                          )}
                          <button 
                            onClick={() => handleReportIssue(order.id, order.store_id, orderItems)}
                            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fff', color: '#666', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
                          >
                            ⚠️ Ripoti Tatizo
                          </button>
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
    </div>
  );
};

export default MyOrders;