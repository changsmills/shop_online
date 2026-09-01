// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, MessageSquare, ClipboardList, BarChart3, Settings,
  Bell, Search, MapPin, ChevronLeft, Lock
} from 'lucide-react';
import UserTools from '../components/UserTools';
import api from '../axiosConfig';
import { toast, Toaster } from 'react-hot-toast'; 
import '../CheckoutPage.css';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, clearCart } = useCart();
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isWhatsAppOrder, setIsWhatsAppOrder] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);

  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: 'Dar es Salaam'
  });

  const orderItems = cartItems.length > 0 ? cartItems : (location.state?.orderItems || []);

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

  useEffect(() => {
    const fetchShipping = async () => {
      const storeId = orderItems[0]?.store_id;
      if (!storeId || orderItems.length === 0) return;

      try {
        const res = await api.get('/shipping-methods/', {
          params: { store_id: storeId }
        });
        const data = res.data.results || res.data || [];
        setShippingMethods(data);
        if (data.length > 0) setSelectedShipping(data[0]);
      } catch (error) {
        console.error("Error fetching shipping methods:", error);
        setShippingMethods([]);
      }
    };
    fetchShipping();
  }, [orderItems]);

  const getPrice = (method) => {
    if (!method) return 0;
    const isLocal = customerInfo.city === 'Dar es Salaam';
    return isLocal ? (method.price_local || 0) : (method.price_national || 0);
  };

  const subtotal = orderItems.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    return sum + (price * item.quantity);
  }, 0);

  const currentShippingPrice = selectedShipping ? Number(getPrice(selectedShipping)) : 0;
  const totalAmount = subtotal + currentShippingPrice;

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

      const itemsToInsert = orderItems.map(item => ({
        order: mainOrder.id,
        product: item.productId || item.id,
        variant: item.variant_id,
        product_name: item.product_name || item.name,
        product_image: item.image,
        selected_color: item.selected_color,
        selected_size: item.selected_size,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity
      }));

      for (const item of itemsToInsert) {
        await api.post('/order-items/', item);
      }

      toast.dismiss(loadingToast);
      clearCart();
      toast.success("Hongera! Oda yako imepokelewa vyema!");

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

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, path: '/dashboard', label: 'Dashboard' },
    { icon: <MessageSquare size={20} />, path: '/dashboard/messages', label: 'Messages' },
    { icon: <ClipboardList size={20} />, path: '/dashboard/orders', label: 'Orders' },
    { icon: <BarChart3 size={20} />, path: '/dashboard/analytics', label: 'Analytics' },
    { icon: <Settings size={20} />, path: '/dashboard/settings', label: 'Settings' },
  ];

  return (
    <div className="checkout-page-root">
      <Toaster position="top-center" />

      {/* HEADER */}
      <header className="checkout-header">
        <div className="header-left">
          <Link to="/dashboard" className="brand-logo">
            Skyfall.com
          </Link>
          <div className="header-search-bar desktop-only">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search order details..." className="header-search-input" />
          </div>
        </div>
        <div className="header-right">
          <Bell size={20} className="bell-icon desktop-only" />
          <UserTools />
        </div>
      </header>

      <div className="checkout-layout-container">
        {/* SIDEBAR - Desktop only */}
        <aside 
          className={`checkout-sidebar desktop-only ${isSidebarHovered ? 'expanded' : 'collapsed'}`}
          onMouseEnter={() => setIsSidebarHovered(true)}
          onMouseLeave={() => setIsSidebarHovered(false)}
        >
          {sidebarItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <div className="sidebar-icon-wrapper">{item.icon}</div>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          ))}
        </aside>

        {/* MAIN CONTENT */}
        <main className="checkout-main-content">
          <div className="checkout-content-container">
            <div className="back-to-shop-row" onClick={() => navigate(-1)}>
              <ChevronLeft size={20} />
              <span className="back-text">Back to shop</span>
            </div>

            <h1 className="checkout-title">Checkout</h1>

            <div className="checkout-grid-layout">
              
              {/* SHIPPING ADDRESS SECTION */}
              <div className="shipping-section-card">
                <div className="shipping-header">
                  <MapPin size={22} className="map-icon" />
                  <h3 className="shipping-title">Shipping address</h3>
                </div>
                
                <form onSubmit={(e) => e.preventDefault()} className="shipping-form">
                  <div className="form-group">
                    <label className="form-label">Full name *</label>
                    <input type="text" placeholder="Joshua Julius" value={customerInfo.fullName}
                      onChange={(e) => setCustomerInfo({...customerInfo, fullName: e.target.value})}
                      className="form-input" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone number *</label>
                    <input type="text" placeholder="07XXXXXXXX" value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="form-input" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Street address *</label>
                    <input type="text" placeholder="Makongo Juu, House No. 12" value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      className="form-input" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City / Region *</label>
                    <select
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                      className="form-select"
                    >
                      <option value="Dar es Salaam">Dar es Salaam (Local)</option>
                      <option value="Arusha">Arusha (National)</option>
                      <option value="Mwanza">Mwanza (National)</option>
                      <option value="Zanzibar">Zanzibar (National)</option>
                      <option value="Other">Other Region</option>
                    </select>
                  </div>

                  {/* SHIPPING METHODS */}
                  <div className="shipping-methods-section">
                    <label className="shipping-label">Select Shipping Method *</label>
                    <div className="shipping-methods-list">
                      {shippingMethods.map((method) => {
                        const calculatedPrice = getPrice(method);
                        return (
                          <div key={method.id} onClick={() => setSelectedShipping(method)}
                            className={`shipping-method-item ${selectedShipping?.id === method.id ? 'selected' : ''}`}
                          >
                            <div className="shipping-radio-wrapper">
                              <div className="shipping-radio-circle">
                                {selectedShipping?.id === method.id && <div className="shipping-radio-dot" />}
                              </div>
                              <span className="shipping-method-name">{method.method_name || method.label}</span>
                            </div>
                            <span className="shipping-method-price">
                              {calculatedPrice === 0 ? 'Free' : `TZS ${calculatedPrice.toLocaleString()}`}
                            </span>
                          </div>
                        );
                      })}
                      {shippingMethods.length === 0 && (
                        <p className="no-shipping-msg">No shipping methods available</p>
                      )}
                    </div>
                  </div>
                </form>
              </div>

              {/* ORDER SUMMARY SECTION */}
              <div className="summary-section-card">
                <h3 className="summary-title">Order Summary</h3>
                
                {orderItems.length > 0 && (
                  <div className="summary-items-list">
                    {orderItems.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="summary-item-row">
                        <img 
                          src={item.cover_image_url || item.image || item.product_image || '/placeholder-image.jpg'} 
                          alt={item.name} 
                          className="summary-item-img" 
                        />
                        <div className="summary-item-info">
                          <p className="summary-item-name">{item.name?.slice(0, 30)}</p>
                          <p className="summary-item-qty">Qty: {item.quantity}</p>
                        </div>
                        <span className="summary-item-price">
                          TZS {(Number(item.price) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    {orderItems.length > 3 && <p className="summary-more-items">+{orderItems.length - 3} more items</p>}
                  </div>
                )}
                
                <div className="summary-row">
                  <span className="summary-label">Subtotal ({orderItems.length} items)</span>
                  <span className="summary-value">TZS {subtotal.toLocaleString()}</span>
                </div>

                <div className="summary-row">
                  <span className="summary-label">{selectedShipping?.method_name || selectedShipping?.label || 'Shipping'}</span>
                  <span className="summary-value">
                    {currentShippingPrice === 0 ? 'Free' : `TZS ${currentShippingPrice.toLocaleString()}`}
                  </span>
                </div>
                
                <hr className="summary-divider" />
                
                <div className="summary-total-row">
                  <strong className="summary-total-label">Total</strong>
                  <strong className="summary-total-amount">TZS {totalAmount.toLocaleString()}</strong>
                </div>
                
                                {/* 🔥 BUTTON YA KUWEKA ODA */}
                <button onClick={handlePlaceOrder} disabled={orderItems.length === 0 || loading}
                  className="btn-place-order">
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
                
                {/* 🔥 PAYMENT INFO BOX (MPYA) */}
                <div className="payment-info-box">
                  <div className="payment-info-icon">💵</div>
                  <div className="payment-info-text">
                    <strong>Payment Method: Cash on Delivery</strong>
                    <p>
                      Kwa sasa, malipo yanafanyika <strong>baada ya kupokea bidhaa (Pay on Delivery)</strong>. 
                      Hii inahakikisha unalipa pale tu bidhaa inapofika mikononi mwako.
                    </p>
                    <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                      💳 Mfumo wa malipo mtandaoni (Online Payment) utakuja kwenye toleo lijalo.
                    </p>
                  </div>
                </div>
                
                {/* 🔥 BADILISHA HII: Ondoa "Secure payment" ya zamani */}
                <div className="secure-badge-row">
                  <Lock size={14} className="lock-icon" />
                  <span className="secure-text">Order protected by Skyfall.com</span>
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