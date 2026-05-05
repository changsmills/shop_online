import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Trash2, ShoppingBag, Store, Minus, Plus, 
  ChevronLeft, Bell, Search, ShieldCheck,
  LayoutDashboard, MessageSquare, ClipboardList, BarChart3, Settings, Menu
} from 'lucide-react';
import UserTools from '../components/UserTools';

export default function CartPage({ session }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, path: '/dashboard', label: 'Dashboard' },
    { icon: <MessageSquare size={20} />, path: '/dashboard/messages', label: 'Messages' },
    { icon: <ClipboardList size={20} />, path: '/dashboard/orders', label: 'Orders' },
    { icon: <BarChart3 size={20} />, path: '/dashboard/analytics', label: 'Analytics' },
    { icon: <Settings size={20} />, path: '/dashboard/settings', label: 'Settings' },
  ];

  return (
    <div className="dashboard-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#fff' }}>
      
     {/* HEADER */}
<header className="dashboard-header" style={{ 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', // Muhimu kwa mpangilio mzuri
  padding: isMobile ? '10px 16px' : '10px 24px', 
  borderBottom: '1px solid #eee', 
  backgroundColor: '#fff',
  zIndex: 100 
}}>
  <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '15px' }}>
    {!isMobile && (
      <Menu 
        size={22} 
        style={{ cursor: 'pointer', color: '#666' }} 
        onClick={() => setIsExpanded(!isExpanded)} 
      />
    )}
    <Link to="/dashboard" style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '800', color: '#ff6a00', textDecoration: 'none' }}>
      Skyfall.com
    </Link>
    
    {/* Search ya cart itatokea Desktop TU */}
    {!isMobile && (
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: '#f4f4f4', padding: '6px 12px', borderRadius: '8px', marginLeft: '10px' }}>
        <Search size={16} color="#999" />
        <input type="text" placeholder="Search in cart..." style={{ border: 'none', background: 'none', outline: 'none', marginLeft: '8px', fontSize: '14px' }} />
      </div>
    )}
  </div>

  {/* HAPA NDIPO ULIPOTAKIWA KUWEKA SHARTI LA !isMobile */}
  <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
    {!isMobile && (
      <>
        <Bell size={20} style={{ cursor: 'pointer', color: '#666' }} />
        <UserTools session={session} />
      </>
    )}
  </div>
</header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* SIDEBAR - Hide on mobile */}
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
                  transition: 'background-color 0.2s'
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
                  transition: 'opacity 0.2s ease-in-out',
                  pointerEvents: isExpanded ? 'auto' : 'none'
                }}>
                  {item.label}
                </span>
              </Link>
            ))}
          </aside>
        )}

        {/* MAIN CONTENT */}
        <main style={{ 
          flex: 1, 
          padding: isMobile ? '16px' : '24px', 
          backgroundColor: '#f7f8fa', 
          overflowY: 'auto',
          paddingBottom: isMobile && cartItems.length > 0 ? '90px' : '24px'
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', cursor: 'pointer', color: '#666' }} onClick={() => navigate(-1)}>
              <ChevronLeft size={20} />
              <span style={{ fontWeight: '600' }}>Back to shopping</span>
            </div>

            <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '800', marginBottom: '24px', color: '#222' }}>
              Shopping Cart ({totalItems})
            </h2>

            {cartItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <ShoppingBag size={64} color="#ddd" style={{ marginBottom: '16px' }} />
                <h3 style={{ color: '#444' }}>Kikapu chako kiko tupu!</h3>
                <button 
                  onClick={() => navigate('/dashboard')}
                  style={{ marginTop: '20px', padding: '12px 24px', backgroundColor: '#ff6a00', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Anza Manunuzi
                </button>
              </div>
            ) : (
              <>
                {/* DESKTOP: 2 columns, MOBILE: 1 column */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: '24px', 
                  alignItems: 'start' 
                }}>
                  
                  {/* LIST YA BIDHAA */}
                  <div style={{ 
                    flex: isMobile ? 'auto' : 1,
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '16px', 
                    background: '#fff', 
                    borderRadius: '12px', 
                    border: '1px solid #eee', 
                    overflow: 'hidden' 
                  }}>
                    <div style={{ padding: '12px 20px', backgroundColor: '#fafafa', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700' }}>
                      <Store size={18} color="#ff6a00" />
                      <span>Skyfall.com Verified Items</span>
                    </div>

                    {cartItems.map((item) => (
                      <div key={item.uniqueCartId} style={{ 
                        display: 'flex', 
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? '12px' : '20px', 
                        padding: '20px', 
                        borderBottom: '1px solid #f5f5f5' 
                      }}>
                        <img src={item.image} alt={item.name} style={{ 
                          width: isMobile ? '80px' : '100px', 
                          height: isMobile ? '80px' : '100px', 
                          objectFit: 'cover', 
                          borderRadius: '8px', 
                          backgroundColor: '#f9f9f9' 
                        }} />
                        
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <h4 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', margin: 0, color: '#333', flex: 1 }}>
                                {item.name}
                              </h4>
                              <button 
                                onClick={() => removeFromCart(item.uniqueCartId)} 
                                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}
                              >
                                <Trash2 size={isMobile ? 16 : 18} color="#999" />
                              </button>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '10px', color: '#666', backgroundColor: '#f0f0f0', padding: '2px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                🎨 {item.selected_color || 'Default'}
                              </span>
                              <span style={{ fontSize: '10px', color: '#666', backgroundColor: '#f0f0f0', padding: '2px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                📏 {item.selected_size || 'Free Size'}
                              </span>
                            </div>
                          </div>
                          
                          <div style={{ 
                            display: 'flex', 
                            flexDirection: isMobile ? 'column' : 'row',
                            justifyContent: 'space-between', 
                            alignItems: isMobile ? 'flex-start' : 'center', 
                            marginTop: '10px',
                            gap: isMobile ? '8px' : '0'
                          }}>
                            <span style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '800', color: '#ff6a00' }}>
                              TSH {Number(item.price).toLocaleString()}
                            </span>
                            
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                              <button 
                                onClick={() => updateQuantity(item.uniqueCartId, Math.max(1, item.quantity - 1))} 
                                disabled={item.quantity <= 1}
                                style={{ padding: isMobile ? '4px 10px' : '6px 12px', border: 'none', background: '#fff', cursor: 'pointer', borderRight: '1px solid #ddd', opacity: item.quantity <= 1 ? 0.5 : 1 }}
                              >
                                <Minus size={isMobile ? 12 : 14}/>
                              </button>
                              <span style={{ padding: isMobile ? '0 12px' : '0 15px', fontWeight: '700', minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.uniqueCartId, item.quantity + 1)} 
                                style={{ padding: isMobile ? '4px 10px' : '6px 12px', border: 'none', background: '#fff', cursor: 'pointer', borderLeft: '1px solid #ddd' }}
                              >
                                <Plus size={isMobile ? 12 : 14}/>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* SUMMARY CARD - Desktop */}
                  {!isMobile && (
                    <div style={{ 
                      background: '#fff', 
                      padding: '24px', 
                      borderRadius: '12px', 
                      border: '1px solid #eee', 
                      position: 'sticky', 
                      top: '20px',
                      width: '320px'
                    }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px' }}>Order Summary</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#666' }}>
                        <span>Subtotal ({totalItems} items):</span>
                        <span>TSH {totalAmount.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#666' }}>
                        <span>Shipping:</span>
                        <span style={{ color: '#00a65a', fontWeight: '600' }}>Calculated later</span>
                      </div>
                      <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '16px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <span style={{ fontWeight: '700' }}>Total:</span>
                        <span style={{ fontWeight: '900', fontSize: '20px', color: '#ff6a00' }}>TSH {totalAmount.toLocaleString()}</span>
                      </div>
                      <button 
                        onClick={() => navigate('/checkout')}
                        style={{ width: '100%', padding: '14px', backgroundColor: '#ff6a00', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,106,0,0.2)' }}
                      >
                        Checkout ({totalItems})
                      </button>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px', color: '#666', fontSize: '12px' }}>
                        <ShieldCheck size={16} color="#00a65a" />
                        <span>Secure payment protected</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM CHECKOUT BAR - ONLY THIS, NO BOTTOM NAVIGATION */}
      {isMobile && cartItems.length > 0 && (
        <div className="mobile-checkout-bar" style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          padding: '12px 20px',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
          borderTop: '1px solid #eee',
          boxShadow: '0 -2px 15px rgba(0,0,0,0.08)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#666' }}>Total</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#ff6a00' }}>TSH {totalAmount.toLocaleString()}</div>
            <div style={{ fontSize: '11px', color: '#999' }}>{totalItems} item(s)</div>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            style={{
              backgroundColor: '#ff6a00',
              color: 'white',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '40px',
              fontWeight: '700',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255,106,0,0.3)',
              transition: 'transform 0.2s ease'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Checkout →
          </button>
        </div>
      )}
    </div>
  );
}