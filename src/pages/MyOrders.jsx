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
//import '../MyOrders.css';
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

 // ===== SKELETON LOADING =====
  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-white dark:bg-[#1e293b]">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center px-4 md:px-6 py-2.5 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-[#1e293b]">
          <div className="flex items-center gap-4">
            <div className="w-[30px] h-[30px] rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse" />
            <div className="w-[120px] h-5 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse" />
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-[#0f172a] overflow-y-auto">
            <div className="max-w-[1100px] mx-auto">
              <div className="w-[200px] h-[30px] rounded-lg bg-gray-200 dark:bg-slate-700 mb-5 animate-pulse" />

              <div className="grid gap-4 md:gap-5">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 md:p-5 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-[#0f172a]">
                      <div className="flex justify-between items-center flex-wrap gap-2.5">
                        <div className="space-y-2">
                          <div className="w-[100px] h-3 rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse" />
                          <div className="w-[150px] h-3 rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse" />
                        </div>
                        <div className="flex gap-2.5 items-center">
                          <div className="w-[60px] h-6 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
                          <div className="w-[80px] h-6 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 md:p-5">
                      <div className="flex gap-4 items-center">
                        <div className="w-[70px] h-[70px] rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="w-[70%] h-3.5 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse" />
                          <div className="w-[50%] h-3 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse" />
                          <div className="w-[30%] h-3 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse" />
                        </div>
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
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Toaster position="top-center" />

      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-[100] flex justify-between items-center px-3 md:px-6 py-2.5 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-[#1e293b]">
        <div className="flex items-center gap-2.5 md:gap-4">
          {isMobile && (
            <button
              onClick={() => navigate(-1)}
              className="bg-transparent border-none cursor-pointer p-1 flex items-center justify-center text-gray-800 dark:text-white"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          {!isMobile && (
            <Menu size={22} className="cursor-pointer text-gray-500 dark:text-slate-400 hover:text-[#ff6a00] transition-colors" onClick={() => setIsExpanded(!isExpanded)} />
          )}
          <Link to="/dashboard" className="text-base md:text-xl font-extrabold text-[#ff6a00] no-underline">
            Skyfall.com
          </Link>
          {!isMobile && (
            <div className="flex items-center bg-gray-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg">
              <Search size={16} className="text-gray-400 dark:text-slate-500" />
              <input type="text" placeholder="Search orders..." className="border-none bg-transparent outline-none ml-2 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500" />
            </div>
          )}
        </div>
        {!isMobile && (
          <div className="flex items-center gap-4">
            <Bell size={20} className="cursor-pointer text-gray-500 dark:text-slate-400" />
            <UserTools />
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* ===== SIDEBAR (Desktop) ===== */}
        {!isMobile && (
          <aside
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            className={`flex flex-col pt-5 bg-white dark:bg-[#1e293b] border-r border-gray-200 dark:border-slate-700 overflow-hidden whitespace-nowrap z-10 transition-[width] duration-300 ease ${
              isExpanded ? 'w-60' : 'w-[70px]'
            }`}
          >
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-6 py-3 mx-2 my-1 rounded-lg no-underline transition-colors ${
                    isActive
                      ? 'text-[#ff6a00] bg-orange-50 dark:bg-[#2d2d44]'
                      : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className="min-w-[22px] flex justify-center">{item.icon}</div>
                  <span className={`ml-[15px] text-sm font-semibold transition-opacity duration-200 ${
                    isExpanded ? 'opacity-100' : 'opacity-0'
                  }`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </aside>
        )}

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 bg-gray-50 dark:bg-[#0f172a] overflow-y-auto">
          <div className="max-w-[1100px] mx-auto">
            <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold mb-4 md:mb-5 text-gray-800 dark:text-white">
              Your orders
            </h1>

            {orders.length === 0 ? (
              /* ===== EMPTY STATE ===== */
              <div className="flex flex-col items-center justify-center px-4 py-12 sm:py-16 md:py-20 text-center bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-slate-700 mt-5">
                <img src={messageImage} alt="No orders" className="w-[200px] sm:w-[240px] md:w-[280px] max-w-[80%] mb-6" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white mb-3">
                  Bado haujanunua kitu
                </h2>
                <p className="text-gray-500 dark:text-slate-400 max-w-[400px] mb-8 text-xs sm:text-sm md:text-[15px]">
                  Inaonekana bado haujaweka oda yoyote. Anza sasa kupata bidhaa bora kutoka kwetu.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-[#ff6a00] hover:bg-[#e55a00] hover:-translate-y-0.5 text-white px-8 sm:px-10 py-3 sm:py-3.5 rounded-full border-none font-bold cursor-pointer text-sm sm:text-base transition-all"
                >
                  Anza Kununua Sasa
                </button>
              </div>
            ) : (
              /* ===== ORDERS LIST ===== */
              <div className="grid gap-4 md:gap-6">
                {orders.map((order) => {
                  const orderItems = order.order_items || [];
                  const totalItems = orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
                  const isExpandedOrder = expandedOrders[order.id];
                  const isDelivered = order.status === 'delivered';

                  return (
                    <div
                      key={order.id}
                      className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden transition-shadow duration-200 hover:shadow-[0_4px_15px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_4px_15px_rgba(0,0,0,0.4)]"
                    >
                      {/* Order Header */}
                      <div className="p-4 md:p-5 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-[#0f172a]">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                          <div>
                            <span className="text-xs text-gray-400 dark:text-slate-500">
                              Order #{order.order_number?.slice(0, 12)}
                            </span>
                            <p className="mt-1.5 mb-0 text-xs md:text-[13px] text-gray-500 dark:text-slate-400">
                              {new Date(order.created_at).toLocaleDateString()} | Bidhaa: {totalItems}
                            </p>
                          </div>
                          <div className="flex gap-2.5 items-center flex-wrap">
                            <div className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold uppercase ${
                              isDelivered
                                ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400'
                                : 'bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400'
                            }`}>
                              {order.status}
                            </div>
                            <button
                              onClick={() => toggleExpandOrder(order.id)}
                              className="bg-transparent hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-xs cursor-pointer flex items-center gap-1.5 text-gray-700 dark:text-slate-300 transition-colors"
                            >
                              {isExpandedOrder ? '▲ Punguza' : '▼ Onyesha Bidhaa'}
                              <span className="text-[11px] text-gray-500 dark:text-slate-400">({orderItems.length})</span>
                            </button>
                          </div>
                        </div>

                        {/* Total */}
                        <div className="mt-3 sm:text-right">
                          <span className="text-xs md:text-sm text-gray-500 dark:text-slate-400">Jumla ya Oda: </span>
                          <span className="text-base md:text-xl font-extrabold text-[#ff6a00]">
                            TZS {order.grand_total?.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-4 md:p-5">
                        <div className="flex flex-col gap-4">
                          {orderItems.map((item, idx) => (
                            <div
                              key={item.id || idx}
                              className={`flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center ${
                                idx !== orderItems.length - 1
                                  ? 'pb-4 border-b border-gray-100 dark:border-slate-700'
                                  : ''
                              }`}
                            >
                              <img
                                src={item.product_image || 'https://via.placeholder.com/80'}
                                alt={item.product_name}
                                className="w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-xl object-cover bg-gray-50 dark:bg-slate-700 flex-shrink-0 mx-auto sm:mx-0"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/70'; }}
                              />
                              <div className="flex-1 text-center sm:text-left">
                                <h4 className="m-0 text-sm md:text-[15px] font-bold text-gray-800 dark:text-white">
                                  {item.product_name}
                                </h4>
                                <p className="my-1 text-xs md:text-[13px] text-gray-500 dark:text-slate-400">
                                  Rangi: <strong>{item.selected_color || 'N/A'}</strong> |
                                  Size: <strong>{item.selected_size || 'N/A'}</strong> |
                                  Qty: <strong>{item.quantity || 1}</strong>
                                </p>
                                <p className="m-0 text-sm md:text-[14px] font-bold text-[#ff6a00]">
                                  TZS {(item.unit_price || item.price)?.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row gap-2.5">
                          {!isDelivered && (
                            <button
                              onClick={() => handleConfirmDelivery(order.id)}
                              className="bg-green-500 hover:bg-green-600 text-white border-none px-4 py-2.5 rounded-lg font-semibold cursor-pointer text-xs md:text-[13px] transition-colors"
                            >
                              ✓ Nimepokea
                            </button>
                          )}
                          <button
                            onClick={() => handleReportIssue(order.id, order.store_id, orderItems)}
                            className="bg-white dark:bg-transparent border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 px-4 py-2.5 rounded-lg font-semibold cursor-pointer text-xs md:text-[13px] hover:border-[#ff4e00] hover:text-[#ff4e00] transition-colors"
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