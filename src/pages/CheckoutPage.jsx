import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, MessageSquare, ClipboardList, BarChart3, Settings,
  Bell, Search, MapPin, ChevronLeft, Lock
} from 'lucide-react';
import UserTools from '../components/UserTools';
import api from '../axiosConfig'; // 🔥 BADILISHA: Tumia api badala ya supabase!
import { toast, Toaster } from 'react-hot-toast'; 
import '../CheckoutPage.css';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => { // 🔥 IMEONDOLEShA { session }
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, clearCart } = useCart();
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isWhatsAppOrder, setIsWhatsAppOrder] = useState(false);
  
  // 🔥 MPYA: Pata ID ya mtumiaji aliyelogin
  const [currentUserId, setCurrentUserId] = useState(null);

  // State za shipping - dynamic kutoka database
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);

  // Customer info pamoja na city
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: 'Dar es Salaam' // default
  });

  // Order items
// 🔥 Tumia cartItems kwa sasa, lakini sahihisha picha na bei kupitia mapping
const orderItems = cartItems.length > 0 ? cartItems : (location.state?.orderItems || []);

  // ========== 1. Detect mobile ==========
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ========== 2. Pata USER ID kutoka Backend ==========
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile/');
        setCurrentUserId(res.data.id);
      } catch (error) {
        console.error("Error fetching profile for checkout:", error);
      }
    };
    fetchProfile();
  }, []);

  // ========== 3. Fetch shipping methods kutoka Django ==========
  useEffect(() => {
    const fetchShipping = async () => {
      const storeId = orderItems[0]?.store_id;
      if (!storeId || orderItems.length === 0) return;

      try {
        const res = await api.get('/shipping-methods/', {
          params: { store_id: storeId }
        });
        // DRF inarudisha { results: [...] } ikiwa pagination imewashwa
        const data = res.data.results || res.data || [];
        
        setShippingMethods(data);
        if (data.length > 0) setSelectedShipping(data[0]); // auto-select first method
      } catch (error) {
        console.error("Error fetching shipping methods:", error);
        setShippingMethods([]);
      }
    };
    fetchShipping();
  }, [orderItems]);

  // ========== 4. Helper: Get price based on city ==========
  const getPrice = (method) => {
    if (!method) return 0;
    const isLocal = customerInfo.city === 'Dar es Salaam';
    // Methods from DB should have fields: price_local, price_national
    return isLocal ? (method.price_local || 0) : (method.price_national || 0);
  };

  // ========== 5. Calculate totals ==========
const subtotal = orderItems.reduce((sum, item) => {
  const price = Number(item.price) || 0;
  return sum + (price * item.quantity);
}, 0);

const currentShippingPrice = selectedShipping ? Number(getPrice(selectedShipping)) : 0;  const totalAmount = subtotal + currentShippingPrice;

  // ========== 6. Handle Place Order (Django API) ==========
  const handlePlaceOrder = async () => {
    if (orderItems.length === 0) {
      toast.error("Huna bidhaa yoyote ya kuagiza");
      return;
    }
    if (!customerInfo.fullName || !customerInfo.phone || !customerInfo.address) {
      toast.error("Tafadhali jaza taarifa zote za usafirishaji");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Tunatuma oda yako...");
    let orderNumber = null;

    try {
      orderNumber = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // 1. UNDA ORDER
      const orderPayload = {
        order_number: orderNumber,
        customer_id: currentUserId,
        store_id: orderItems[0]?.store_id,
        grand_total: totalAmount,
        shipping_fee: currentShippingPrice,
        shipping_method: selectedShipping?.method_name || selectedShipping?.label,
        customer_location: `${customerInfo.fullName} | ${customerInfo.address} | Simu: ${customerInfo.phone}`,
        status: 'received',
        payment_method: 'mobile_money',
        total_items: orderItems.length,
      };

      const orderRes = await api.post('/orders/', orderPayload);
      const mainOrder = orderRes.data;

      // 🔥 BADILISHA HAPA: Ondoa '_id' ili ilingane na Django models!
       const itemsToInsert = orderItems.map(item => ({
      order: mainOrder.id,                // Badilisha order_id kuwa order
      product: item.productId || item.id, // Badilisha product_id kuwa product
      variant: item.variant_id,           // Badilisha variant_id kuwa variant
      product_name: item.product_name || item.name,
      product_image: item.image,
      selected_color: item.selected_color,
      selected_size: item.selected_size,
      quantity: item.quantity,
      unit_price: item.price,            // Inapaswa kuwa number (Decimal)
      subtotal: item.price * item.quantity // Inapaswa kuwa number (Decimal)
      }));

      // Tuma order items moja moja (au tumia endpoint ya bulk create kama ipo)
      for (const item of itemsToInsert) {
        await api.post('/order-items/', item);
      }

      toast.dismiss(loadingToast);
      clearCart();
      toast.success("Hongera! Oda yako imepokelewa vyema!");

      // ========== WhatsApp Message ==========
      let whatsappMessage = `*ORDER CONFIRMATION - SKYFALL.COM*%0A%0A`;
      whatsappMessage += `*ORDER NUMBER:* ${orderNumber}%0A`;
      whatsappMessage += `*DATE:* ${new Date().toLocaleString()}%0A%0A`;
      whatsappMessage += `*CUSTOMER DETAILS*%0A`;
      whatsappMessage += `👤 Jina: ${customerInfo.fullName}%0A`;
      whatsappMessage += `📞 Simu: ${customerInfo.phone}%0A`;
      whatsappMessage += `📍 Anuani: ${customerInfo.address}%0A`;
      whatsappMessage += `🚚 Usafirishaji: ${selectedShipping?.method_name || selectedShipping?.label} - TZS ${currentShippingPrice.toLocaleString()}%0A%0A`;
      whatsappMessage += `*ORDER DETAILS*%0A`;
      whatsappMessage += `────────────────%0A`;
      orderItems.forEach((item, idx) => {
        whatsappMessage += `\n${idx + 1}. *${item.product_name || item.name}*%0A`;
        whatsappMessage += `   🟢 Rangi: ${item.selected_color || 'Standard'}%0A`;
        whatsappMessage += `   📏 Ukubwa: ${item.selected_size || 'Free Size'}%0A`;
        whatsappMessage += `   🔢 Kiasi: ${item.quantity}%0A`;
        whatsappMessage += `   💰 Bei: TZS ${(item.price * item.quantity).toLocaleString()}%0A`;
      });
      whatsappMessage += `\n────────────────%0A`;
      whatsappMessage += `💰 *Subtotal:* TZS ${subtotal.toLocaleString()}%0A`;
      whatsappMessage += `🚚 *Shipping:* TZS ${currentShippingPrice.toLocaleString()}%0A`;
      whatsappMessage += `💵 *TOTAL:* TZS ${totalAmount.toLocaleString()}%0A%0A`;
      whatsappMessage += `Asante kwa order yako! Tutawasiliana nawe kwa maelekezo zaidi.`;

      const customerPhone = customerInfo.phone.replace(/^0+/, '255').replace(/[\s+]/g, '');
      window.open(`https://wa.me/${customerPhone}?text=${whatsappMessage}`, '_blank');

      const storePhone = orderItems[0]?.store_phone;
      if (storePhone && storePhone !== "255XXXXXXXXX") {
        const cleanStorePhone = storePhone.replace(/[\s+]/g, '');
        window.open(`https://wa.me/${cleanStorePhone}?text=*NEW ORDER RECEIVED!*%0A%0A${whatsappMessage}`, '_blank');
      }

      toast.success("Taarifa ya order imetumwa kwa WhatsApp yako!");
      setTimeout(() => navigate('/dashboard/orders'), 3000);

    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Order Error:", error.response?.data || error.message);
      toast.error("Imeshindwa kuweka oda: " + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Sidebar items
  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, path: '/dashboard', label: 'Dashboard' },
    { icon: <MessageSquare size={20} />, path: '/dashboard/messages', label: 'Messages' },
    { icon: <ClipboardList size={20} />, path: '/dashboard/orders', label: 'Orders' },
    { icon: <BarChart3 size={20} />, path: '/dashboard/analytics', label: 'Analytics' },
    { icon: <Settings size={20} />, path: '/dashboard/settings', label: 'Settings' },
  ];

  return (
    <div className="dashboard-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#fff' }}>
      <Toaster position="top-center" />

      {/* HEADER */}
      <header className="dashboard-header" style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: isMobile ? '10px 16px' : '10px 24px', borderBottom: '1px solid #eee', 
        backgroundColor: '#fff', zIndex: 20
      }}>
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '20px' }}>
          <Link to="/dashboard" style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '800', color: '#ff6a00', textDecoration: 'none' }}>
            Skyfall.com
          </Link>
          {!isMobile && (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: '#f4f4f4', padding: '6px 12px', borderRadius: '8px' }}>
              <Search size={16} color="#999" />
              <input type="text" placeholder="Search order details..." style={{ border: 'none', background: 'none', outline: 'none', marginLeft: '8px', fontSize: '14px' }} />
            </div>
          )}
        </div>
        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '15px' }}>
          {!isMobile && (
            <>
              <Bell size={20} style={{ cursor: 'pointer', color: '#666' }} />
              <UserTools /> {/* 🔥 Imeondolewa { session } */}
            </>
          )}
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* SIDEBAR */}
        {!isMobile && (
          <aside 
            onMouseEnter={() => setIsSidebarHovered(true)}
            onMouseLeave={() => setIsSidebarHovered(false)}
            style={{ 
              width: isSidebarHovered ? '240px' : '75px', borderRight: '1px solid #eee', 
              display: 'flex', flexDirection: 'column', padding: '20px 12px', gap: '8px', 
              backgroundColor: '#fff', transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'hidden', zIndex: 100
            }}
          >
            {sidebarItems.map((item) => (
              <Link key={item.path} to={item.path} style={{ 
                display: 'flex', alignItems: 'center', gap: '15px',
                color: location.pathname === item.path ? '#ff6a00' : '#64748b',
                padding: '12px 16px', borderRadius: '12px', textDecoration: 'none', fontSize: '15px',
                fontWeight: location.pathname === item.path ? '700' : '500',
                backgroundColor: location.pathname === item.path ? '#fff5ed' : 'transparent',
                transition: '0.2s', minWidth: '210px'
              }}>
                <div style={{ minWidth: '24px', display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                <span style={{ opacity: isSidebarHovered ? 1 : 0, visibility: isSidebarHovered ? 'visible' : 'hidden', transition: 'opacity 0.2s ease', whiteSpace: 'nowrap' }}>
                  {item.label}
                </span>
              </Link>
            ))}
          </aside>
        )}

        {/* MAIN CONTENT */}
        <main style={{ flex: 1, padding: isMobile ? '16px' : '30px', backgroundColor: '#f7f8fa', overflowY: 'auto', paddingBottom: isMobile ? '30px' : '30px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', cursor: 'pointer', color: '#666' }} onClick={() => navigate(-1)}>
              <ChevronLeft size={20} />
              <span style={{ fontWeight: '600' }}>Back to shop</span>
            </div>

            <h1 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '900', marginBottom: '24px', color: '#222' }}>Checkout</h1>

            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px', alignItems: 'flex-start' }}>
              
              {/* SHIPPING ADDRESS SECTION */}
              <div style={{ flex: isMobile ? 'auto' : 1.5, background: '#fff', padding: isMobile ? '16px' : '24px', borderRadius: '16px', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <MapPin size={22} color="#ff6a00" />
                  <h3 style={{ margin: 0, fontWeight: '800', fontSize: isMobile ? '16px' : '18px' }}>Shipping address</h3>
                </div>
                
                <form onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#444', display: 'block', marginBottom: '6px' }}>Full name *</label>
                    <input type="text" placeholder="Joshua Julius" value={customerInfo.fullName}
                      onChange={(e) => setCustomerInfo({...customerInfo, fullName: e.target.value})}
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '14px' }} />
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#444', display: 'block', marginBottom: '6px' }}>Phone number *</label>
                    <input type="text" placeholder="07XXXXXXXX" value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '14px' }} />
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#444', display: 'block', marginBottom: '6px' }}>Street address *</label>
                    <input type="text" placeholder="Sinza, Dar es Salaam" value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '14px' }} />
                  </div>

                  {/* City Selector */}
                  <div style={{ marginTop: '16px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#444', display: 'block', marginBottom: '6px' }}>City / Region *</label>
                    <select
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '14px', backgroundColor: '#fff' }}
                    >
                      <option value="Dar es Salaam">Dar es Salaam (Local)</option>
                      <option value="Arusha">Arusha (National)</option>
                      <option value="Mwanza">Mwanza (National)</option>
                      <option value="Zanzibar">Zanzibar (National)</option>
                      <option value="Other">Other Region</option>
                    </select>
                  </div>

                  {/* SHIPPING METHODS - Dynamic from database */}
                  <div style={{ marginTop: '25px' }}>
                    <label style={{ fontWeight: '700', display: 'block', marginBottom: '12px', color: '#444', fontSize: '14px' }}>
                      Select Shipping Method *
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {shippingMethods.map((method) => {
                        const calculatedPrice = getPrice(method);
                        return (
                          <div key={method.id} onClick={() => setSelectedShipping(method)}
                            style={{
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              padding: isMobile ? '10px 12px' : '12px 16px', borderRadius: '12px',
                              border: selectedShipping?.id === method.id ? '2px solid #ff6a00' : '1px solid #eee',
                              backgroundColor: selectedShipping?.id === method.id ? '#fff9f5' : '#fff',
                              cursor: 'pointer', transition: '0.2s'
                            }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #ff6a00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {selectedShipping?.id === method.id && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff6a00' }} />}
                              </div>
                              <span style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600' }}>{method.method_name || method.label}</span>
                            </div>
                            <span style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '800' }}>
                              {calculatedPrice === 0 ? 'Free' : `TZS ${calculatedPrice.toLocaleString()}`}
                            </span>
                          </div>
                        );
                      })}
                      {shippingMethods.length === 0 && (
                        <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No shipping methods available</p>
                      )}
                    </div>
                  </div>
                </form>
              </div>

                            {/* ORDER SUMMARY SECTION */}
              <div style={{ flex: isMobile ? 'auto' : 1, width: isMobile ? '100%' : 'auto' }}>
                <div style={{ background: '#fff', padding: isMobile ? '16px' : '24px', borderRadius: '16px', border: '1px solid #eee', position: isMobile ? 'relative' : 'sticky', top: '20px' }}>
                  <h3 style={{ fontWeight: '800', marginBottom: '20px', fontSize: isMobile ? '16px' : '18px' }}>Order Summary</h3>
                  
                  {orderItems.length > 0 && (
                    <div style={{ marginBottom: '16px', maxHeight: '200px', overflowY: 'auto' }}>
                      {orderItems.slice(0, 3).map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                          {/* 🔥 BADILISHA HAPA: Tumia cover_image_url kwanza, kisha image, kisha product_image */}
                          <img 
                            src={item.cover_image_url || item.image || item.product_image || '/placeholder-image.jpg'} 
                            alt={item.name} 
                            style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} 
                          />
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '12px', fontWeight: '600', margin: 0 }}>{item.name?.slice(0, 30)}</p>
                            <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>Qty: {item.quantity}</p>
                          </div>
                          {/* 🔥 BADILISHA HAPA: Tumia Number() kwa usalama */}
                          <span style={{ fontSize: '12px', fontWeight: '700', color: '#ff6a00' }}>
                            TZS {(Number(item.price) * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                      {orderItems.length > 3 && <p style={{ fontSize: '11px', color: '#999', textAlign: 'center', marginTop: '8px' }}>+{orderItems.length - 3} more items</p>}
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>Subtotal ({orderItems.length} items)</span>
                    <span style={{ fontWeight: '700', fontSize: '14px' }}>TZS {subtotal.toLocaleString()}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>{selectedShipping?.method_name || selectedShipping?.label || 'Shipping'}</span>
                    <span style={{ fontWeight: '700', fontSize: '14px' }}>
                      {currentShippingPrice === 0 ? 'Free' : `TZS ${currentShippingPrice.toLocaleString()}`}
                    </span>
                  </div>
                  
                  <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #eee' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <strong style={{ fontSize: isMobile ? '16px' : '18px' }}>Total</strong>
                    <strong style={{ fontSize: isMobile ? '20px' : '24px', color: '#ff6a00', fontWeight: '900' }}>
                      TZS {totalAmount.toLocaleString()}
                    </strong>
                  </div>
                  
                  <button onClick={handlePlaceOrder} disabled={orderItems.length === 0 || loading}
                    style={{ width: '100%', padding: isMobile ? '14px' : '16px', 
                      background: orderItems.length === 0 ? '#ccc' : 'linear-gradient(90deg, #ff9000 0%, #ff6a00 100%)', 
                      color: 'white', borderRadius: '30px', border: 'none', fontWeight: '800', 
                      fontSize: isMobile ? '14px' : '16px', 
                      cursor: orderItems.length === 0 || loading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 15px rgba(255, 106, 0, 0.3)', transition: 'transform 0.2s ease' }}
                    onMouseDown={(e) => { if (orderItems.length > 0 && !loading) e.currentTarget.style.transform = 'scale(0.98)'; }}
                    onMouseUp={(e) => { if (orderItems.length > 0 && !loading) e.currentTarget.style.transform = 'scale(1)'; }}>
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px' }}>
                    <Lock size={14} color="#00a65a" />
                    <span style={{ fontSize: '11px', color: '#666' }}>Secure payment protected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CheckoutPage;