import React, { useEffect, useState } from 'react';
//import { supabase } from '../supabaseClient';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, MessageSquare, ClipboardList, 
  Settings, BarChart3, Bell, Search, CheckCircle2, Menu 
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import UserTools from '../components/UserTools';
import '../MyOrders.css';
import { useNavigate } from 'react-router-dom';
import messageImage from "../images/orderAhead.svg"; 

const MyOrders = ({ session }) => {
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({}); // ✅ Kufungua/kufunga bidhaa za order
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const [feedback, setFeedback] = useState({}); 
  const [ratings, setRatings] = useState({}); 
  const navigate = useNavigate();  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);


  useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

  const fetchOrders = async () => {
    if (!session) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*) 
        `)
        .eq('customer_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data);
      
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      toast.error("Imeshindwa kupata oda zako.");
    } finally {
      setLoading(false);
    }
  };

  const handleReportIssue = async (orderId, storeId, orderItems) => {
  if (!orderId || !storeId) {
    toast.error("Taarifa za duka hazijapatikana.");
    return;
  }

  // Chukua bidhaa ya kwanza kwa ajili ya maelezo
  const firstItem = orderItems?.[0];
  const productName = firstItem?.product_name || "Bidhaa isiyojulikana";
  const productId = firstItem?.product_id || "";

  const messageText = `Habari, nina tatizo na oda #${orderId.slice(0, 8)}: Bidhaa "${productName}" haijafika kama ilivyotarajiwa. Tafadhali nisaidie.`;

  try {
    // 1. Tafuta maelezo ya duka (whatsapp na owner_id)
    const { data: store, error: storeErr } = await supabase
      .from('stores_engine')
      .select('owner_id, whatsapp_number')
      .eq('id', storeId)
      .single();

    if (storeErr || !store) throw new Error("Duka halikupatikana");

    // 2. Fungua WhatsApp (kwa muuzaji)
    const whatsapp = store.whatsapp_number.replace(/\s+/g, '');
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(messageText)}`, '_blank');

    // 3. Weka dispute kwenye database (table `disputes`)
    const { error: disputeError } = await supabase
      .from('disputes')
      .insert([{
        order_id: orderId,
        store_id: storeId,
        customer_id: session.user.id,
        product_name: productName,
        product_id: productId,
        reason: 'Bidhaa haijafika',  // Unaweza kubadilisha sababu baadaye
        description: messageText,
        status: 'open'
      }]);

    if (disputeError) throw disputeError;

    // 4. Tuma ujumbe kwenye mfumo wa messages (kama ulivyokuwa)
    const { error: msgError } = await supabase
      .from('messages')
      .insert([{
        sender_id: session.user.id,
        receiver_id: store.owner_id,
        order_id: orderId,
        content: messageText,
      }]);

    if (msgError) console.error("Message insert error:", msgError);

    toast.success("Ripoti imetumwa kwa muuzaji na kurekodiwa kwenye mfumo!");
    navigate('/dashboard/messages'); // au uwaachie wabaki kwenye ukurasa wa orders

  } catch (err) {
    toast.error("Kuna tatizo: " + err.message);
    console.error(err);
  }
};

  useEffect(() => {
    fetchOrders();
  }, [session]);

  const handleSubmitFeedback = async (orderId) => {
    const comment = feedback[orderId];
    const rating = ratings[orderId] || 5;

    if (!comment) {
      toast.error("Tafadhali andika maoni kwanza");
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          customer_feedback: comment, 
          customer_rating: rating,
          feedback_date: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;
      toast.success("Asante kwa maoni yako!");
      fetchOrders(); 
    } catch (err) {
      toast.error("Imeshindwa kutuma maoni.");
    }
  };

  const handleConfirmDelivery = async (orderId) => {
    const confirmBox = window.confirm("Je, unathibitisha kuwa umepokea bidhaa hii?");
    if (!confirmBox) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'delivered' })
        .eq('id', orderId);

      if (error) throw error;
      toast.success("Oda imethibitishwa!");
      fetchOrders();
    } catch (err) {
      toast.error("Imeshindwa kuthibitisha.");
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

  if (loading) return <div className="orders-loader">Inapakia oda zako...</div>;

  return (
    <div className="dashboard-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Toaster position="top-center" />
      
     <header className="dashboard-header" style={{ 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', // Hakikisha vitu viko katikati mstari mmoja
  padding: isMobile ? '10px 15px' : '10px 24px', 
  borderBottom: '1px solid #eee', 
  backgroundColor: '#fff' 
}}>
  <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
    {/* 1. Menu icon ionekane Desktop tu */}
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

    {/* 2. Search bar ionekane Desktop tu */}
    {!isMobile && (
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: '#f4f4f4', padding: '6px 12px', borderRadius: '8px' }}>
        <Search size={16} color="#999" />
        <input type="text" placeholder="Search orders..." style={{ border: 'none', background: 'none', outline: 'none', marginLeft: '8px', fontSize: '14px' }} />
      </div>
    )}
  </div>

  <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
    {/* 3. Icon za kulia (Bell & UserTools) zionekane Desktop TU */}
    {!isMobile && (
      <>
        <Bell size={20} style={{ cursor: 'pointer', color: '#666' }} />
        <UserTools session={session} />
      </>
    )}
  </div>
</header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Ionyeshe Sidebar TU kama SIYO mobile */}
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
                          {/* ✅ ONYESHA BIDHAA ZOTE, SI MOJA TU */}
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
                                  Quantity: <strong>{item.quantity || item.qty_ordered || 1}</strong>
                                </p>
                                <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#ff6a00' }}>
                                  TZS {(item.unit_price || item.price)?.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* BUTTONS ZA ORDER (Zinaonekana mara moja tu kwa order nzima) */}
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