// src/pages/CartPage.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Trash2, ShoppingBag, Store, Minus, Plus, 
  ChevronLeft, Bell, Search, ShieldCheck,
  LayoutDashboard, MessageSquare, ClipboardList, BarChart3, Settings, Menu
} from 'lucide-react';
import UserTools from '../components/UserTools';
import api from "../axiosConfig";
import '../CartPage.css';

export default function CartPage({ session }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 1. ONGEZA LOADING STATE (Ili kuzuia "Empty Cart" kuonekana mapema kabla data haijapakuliwa)
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Chelewesha sekunde 0.5 ili kuepuka flickering
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const getProductImage = (item) => {
    if (item.cover_image_url) return item.cover_image_url;
    if (item.image) {
      if (item.image.startsWith('http')) return item.image;
      const BASE_URL = api.defaults.baseURL.replace(/\/api$/, '');
      const imagePath = item.image.startsWith('/') ? item.image : '/' + item.image;
      return `${BASE_URL}${imagePath}`;
    }
    if (item.cover_image) {
      if (item.cover_image.startsWith('http')) return item.cover_image;
      const BASE_URL = api.defaults.baseURL.replace(/\/api$/, '');
      const imagePath = item.cover_image.startsWith('/') ? item.cover_image : '/' + item.cover_image;
      return `${BASE_URL}${imagePath}`;
    }
    return '/placeholder-image.jpg';
  };

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, path: '/dashboard', label: 'Dashboard' },
    { icon: <MessageSquare size={20} />, path: '/dashboard/messages', label: 'Messages' },
    { icon: <ClipboardList size={20} />, path: '/dashboard/orders', label: 'Orders' },
    { icon: <BarChart3 size={20} />, path: '/dashboard/analytics', label: 'Analytics' },
    { icon: <Settings size={20} />, path: '/dashboard/settings', label: 'Settings' },
  ];

const handleCheckout = () => {
  if (cartItems.length === 0) {
    alert("Kikapu chako kiko tupu!");
    return;
  }

  const token = localStorage.getItem("access_token");
  
  if (!token) {
    // ✅ MUHIMU: Tuma 'from' destination hapa!
    navigate('/dashboard/login', { 
      state: { from: '/checkout' } 
    });
    return;
  }

  navigate('/checkout');
};

  return (
    <div className="cart-page-root">
      
      {/* HEADER */}
      <header className="cart-header">
        <div className="header-left">
          <Menu 
            size={22} 
            className="menu-icon desktop-only" 
            onClick={() => setIsExpanded(!isExpanded)} 
          />
          <Link to="/dashboard" className="brand-logo">
            Skyfall.com
          </Link>
          
          <div className="header-search-bar desktop-only">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search in cart..." className="header-search-input" />
          </div>
        </div>

        <div className="header-right">
          <Bell size={20} className="bell-icon desktop-only" />
          <UserTools session={session} />
        </div>
      </header>

      <div className="cart-layout-container">
        
        {/* SIDEBAR */}
        <aside 
          className={`cart-sidebar desktop-only ${isExpanded ? 'expanded' : 'collapsed'}`}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          {sidebarItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <div className="sidebar-icon-wrapper">
                {item.icon}
              </div>
              <span className="sidebar-label">
                {item.label}
              </span>
            </Link>
          ))}
        </aside>

        {/* MAIN CONTENT */}
        <main className="cart-main-content">
          <div className="cart-content-container">
            
            <div className="back-to-shop-row" onClick={() => navigate(-1)}>
              <ChevronLeft size={20} />
              <span className="back-text">Back to shopping</span>
            </div>

            <h2 className="cart-title">
              Shopping Cart ({totalItems})
            </h2>

            {/* ✅ 2. BADILISHA LOGIC HAPA: Angalia loading kwanza */}
            {loading ? (
              // A. ONYESHA SKELETON WAKATI INAPOKIA
              <div className="cart-loading-skeleton">
                <div className="skeleton-item"></div>
                <div className="skeleton-item"></div>
                <div className="skeleton-item"></div>
                <div className="skeleton-item"></div>
              </div>
            ) : cartItems.length === 0 ? (
              // B. ONYESHA EMPTY CART IKIWA KWA KWELI HAKUNA BIDHAA
              <div className="empty-cart-box">
                <ShoppingBag size={64} className="empty-cart-icon" />
                <h3 className="empty-cart-text">Kikapu chako kiko tupu!</h3>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="btn-primary-large"
                >
                  Anza Manunuzi
                </button>
              </div>
            ) : (
              // C. ONYESHA BIDHAA HALISI
              <div className="cart-with-items-layout">
                  
                {/* LIST YA BIDHAA */}
                <div className="cart-items-list-wrapper">
                  <div className="cart-items-header">
                    <Store size={18} className="store-icon" />
                    <span>Skyfall.com Verified Items</span>
                  </div>

                  {cartItems.map((item) => (
                    <div key={item.uniqueCartId} className="cart-item-row">
                      <img 
                        src={getProductImage(item)} 
                        alt={item.name} 
                        className="cart-item-image"
                        onError={(e) => { 
                          console.error("Cart image error:", e.target.src);
                          e.target.src = '/placeholder-image.jpg'; 
                        }}
                      />
                      
                      <div className="cart-item-details">
                        <div className="cart-item-top">
                          <h4 className="cart-item-title">
                            {item.name}
                          </h4>
                          <button 
                            onClick={() => removeFromCart(item.uniqueCartId)} 
                            className="btn-remove-item"
                          >
                            <Trash2 size={18} className="trash-icon" />
                          </button>
                        </div>
                        
                        <div className="cart-item-tags">
                          <span className="cart-tag">🎨 {item.selected_color || 'Default'}</span>
                          <span className="cart-tag">📏 {item.selected_size || 'Free Size'}</span>
                        </div>
                        
                                                <div className="cart-item-bottom">
                          <span className="cart-item-price">
                            TSH {Number(item.price).toLocaleString()}
                          </span>
                          
                          <div className="qty-controls">
                            <button 
                              onClick={() => updateQuantity(item.uniqueCartId, Math.max(1, item.quantity - 1))} 
                              disabled={item.quantity <= 1}
                              className="qty-btn minus"
                            >
                              <Minus size={14}/>
                            </button>
                            <span className="qty-display">{item.quantity}</span>
                            
                            {/* 🔥 BADILISHA HAPA: Zuia kuongeza ikifikia stock */}
                            <button 
                              onClick={() => updateQuantity(item.uniqueCartId, item.quantity + 1)} 
                              disabled={!item.stock_quantity || item.quantity >= item.stock_quantity}
                              className="qty-btn plus"
                            >
                              <Plus size={14}/>
                            </button>
                          </div>
                        </div>

                        {/* 🔥 ONGEZA HII: Taarifa ya Stock chini ya quantity */}
                        <div className="cart-item-stock" style={{ marginTop: '5px', fontSize: '12px' }}>
                          {item.stock_quantity > 0 ? (
                            <span style={{ color: '#10b981', fontWeight: '500' }}>
                              ✓ Stock Available: {item.stock_quantity}
                            </span>
                          ) : (
                            <span style={{ color: '#ef4444', fontWeight: '500' }}>
                              ✗ Out of Stock
                            </span>
                          )}
                        </div>
                        
                      </div>
                    </div>
                  ))}
                </div>

                {/* SUMMARY CARD - Kwa Desktop */}
                <div className="cart-summary-card desktop-only">
                  <h3 className="summary-title">Order Summary</h3>
                  <div className="summary-row">
                    <span>Subtotal ({totalItems} items):</span>
                    <span>TSH {totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span className="shipping-text">Calculated later</span>
                  </div>
                  <hr className="summary-divider" />
                  <div className="summary-row total-row">
                    <span className="total-label">Total:</span>
                    <span className="total-amount">TSH {totalAmount.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="btn-checkout-main"
                  >
                    Checkout ({totalItems})
                  </button>
                  <div className="secure-badge-row">
                    <ShieldCheck size={16} className="shield-icon" />
                    <span>Secure payment protected</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM CHECKOUT BAR */}
      {!loading && cartItems.length > 0 && (
        <div className="mobile-checkout-bar">
          <div className="mobile-total-info">
            <div className="mobile-total-label">Total</div>
            <div className="mobile-total-amount">TSH {totalAmount.toLocaleString()}</div>
            <div className="mobile-item-count">{totalItems} item(s)</div>
          </div>
          <button 
            onClick={handleCheckout}
            className="btn-checkout-mobile"
          >
            Checkout →
          </button>
        </div>
      )}
    </div>
  );
}