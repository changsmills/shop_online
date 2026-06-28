import { useState, useEffect, useRef } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useCart } from "../context/CartContext"; 
import { Bell, MessageSquare, ShoppingCart, User, LogOut, ChevronRight } from "lucide-react";
import "../UserTools.css"; 

export default function UserTools({ session: propSession, isMobile }) {
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const cartTimer = useRef(null);
  const userTimer = useRef(null);

  const [localSession, setLocalSession] = useState(null);
  const [userStoreId, setUserStoreId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const { cartItems } = useCart(); 
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const getSessionAndStore = async () => {
      let currentSession = propSession;
      if (!currentSession) {
        const { data } = await supabase.auth.getSession();
        currentSession = data.session;
      }
      if (!isMounted) return;
      setLocalSession(currentSession);

      if (currentSession?.user) {
        const { data: stores } = await supabase
          .from("stores_engine")
          .select("id")
          .eq("owner_id", currentSession.user.id)
          .limit(1);
        setUserStoreId(stores && stores.length > 0 ? stores[0].id : null);
      } else {
        setUserStoreId(null);
      }
    };
    getSessionAndStore();
    return () => { isMounted = false; };
  }, [propSession]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLocalSession(null);
    setUserStoreId(null);
    setIsUserOpen(false);
    navigate("/"); 
  };

  const handleEnter = (setter, timer) => {
    if (timer.current) clearTimeout(timer.current);
    setter(true);
  };
  const handleLeave = (setter, timer) => {
    timer.current = setTimeout(() => setter(false), 300);
  };

  const session = localSession;

  return (
    <div className="user-tools-container" style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '12px' }}>
      
      {/* ==========================================
          1. CART
         ========================================== */}
      <div 
        className="dropdown-wrapper" 
        onMouseEnter={() => handleEnter(setIsCartOpen, cartTimer)} 
        onMouseLeave={() => handleLeave(setIsCartOpen, cartTimer)}
        style={{ position: 'relative' }}
      >
        <Link to="/cart" className="flex flex-col items-center hover:opacity-80 transition" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: isMobile ? '0' : '10px', color: '#333', textDecoration: 'none' }}>
          <div style={{ position: 'relative', display: 'flex' }}>
            <ShoppingCart size={isMobile ? 22 : 20} />
            {cartCount > 0 && <span style={{ position: 'absolute', top: '-4px', right: '-6px', background: '#ff4e00', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{cartCount}</span>}
          </div>
        </Link>

        {isCartOpen && (
          <div 
            className="alibaba-dropdown-menu"
            style={{ position: 'absolute', top: '40px', right: '0', background: 'white', width: '280px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', borderRadius: '12px', border: '1px solid #eee', zIndex: 999, padding: '16px' }}
            onMouseEnter={() => handleEnter(setIsCartOpen, cartTimer)} 
            onMouseLeave={() => handleLeave(setIsCartOpen, cartTimer)}
          >
            <p className="font-bold text-sm mb-2" style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Shopping Cart</p>
            <div className="dropdown-divider" style={{ height: '1px', background: '#eee', margin: '8px 0' }}></div>
            {cartItems.length === 0 ? (
              <div className="text-center py-4 text-gray-400" style={{ textAlign: 'center', padding: '16px 0', color: '#999' }}>
                <ShoppingCart size={40} strokeWidth={1} style={{ margin: '0 auto 8px auto', opacity: 0.2 }} />
                <p className="text-sm" style={{ fontSize: '13px' }}>Cart is empty</p>
              </div>
            ) : (
              <div className="py-2" style={{ padding: '8px 0' }}>
                 <p className="text-sm text-orange-600 font-bold" style={{ color: '#FF6600', fontWeight: 'bold', fontSize: '13px' }}>{cartCount} items selected</p>
              </div>
            )}
            <Link to="/cart" className="mt-2 block text-center py-2 rounded-full bg-orange-500 text-white text-sm font-bold" style={{ marginTop: '8px', display: 'block', textAlign: 'center', background: '#FF6600', color: 'white', borderRadius: '9999px', padding: '8px 0', textDecoration: 'none' }}>Go to Cart</Link>
          </div>
        )}
      </div>


      {/* ==========================================
          2. MGENI
         ========================================== */}
      {!session ? (
        <div className="flex items-center gap-4" style={{ display: 'flex', gap: isMobile ? '8px' : '12px', alignItems: 'center' }}>
           <Link 
             to="/dashboard/login" 
             className="text-sm font-semibold text-gray-700 hover:text-orange-600 transition"
             style={{ color: '#333', textDecoration: 'none', cursor: 'pointer', fontSize: isMobile ? '13px' : '14px' }}
           >
             Sign in
           </Link>

           <Link 
             to="/dashboard/register" 
             className="px-5 py-2 text-sm font-bold text-white rounded-full transition"
             style={{ 
               backgroundColor: '#FF6600', 
               color: 'white', 
               borderRadius: '9999px', 
               textDecoration: 'none',
               boxShadow: '0 4px 6px rgba(255,102,0,0.2)',
               padding: isMobile ? '4px 12px' : '8px 20px',
               fontSize: isMobile ? '12px' : '14px'
             }}
           >
             Create account
           </Link>
        </div>
      ) : (
        
        /* ==========================================
           3. MTEJA / MFANYA BIASHARA
           ========================================== */
        <div className="flex items-center gap-4" style={{ display: 'flex', gap: isMobile ? '6px' : '12px', alignItems: 'center' }}>
          
          {/* 🔥 B. ALERTS - SASA INA LINK (Inafanya kazi!) */}
          <Link 
            to="/dashboard/notifications"
            className="flex flex-col items-center hover:opacity-80 transition"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '10px', color: '#333', textDecoration: 'none' }}
          >
            <div style={{ position: 'relative', display: 'flex' }}>
              <Bell size={isMobile ? 22 : 20} />
              {(unreadCount > 0) && <span style={{ position: 'absolute', top: '-4px', right: '-6px', background: '#ff4e00', color: 'white', borderRadius: '50%', width: '14px', height: '14px', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>}
            </div>
            {!isMobile && <span>Alerts</span>}
          </Link>

          {/* C. Messages */}
          <Link to="/dashboard/messages" className="flex flex-col items-center hover:opacity-80 transition" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '10px', color: '#333', textDecoration: 'none' }}>
            <div style={{ position: 'relative', display: 'flex' }}>
              <MessageSquare size={isMobile ? 22 : 20} />
              <span style={{ position: 'absolute', top: '-4px', right: '-6px', background: '#ff4e00', color: 'white', borderRadius: '50%', width: '14px', height: '14px', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
            </div>
            {!isMobile && <span>Msg</span>}
          </Link>

          {/* D. User Account Dropdown */}
          <div 
            className="dropdown-wrapper" 
            onMouseEnter={() => handleEnter(setIsUserOpen, userTimer)} 
            onMouseLeave={() => handleLeave(setIsUserOpen, userTimer)}
            style={{ position: 'relative' }}
          >
            <button className="flex flex-col items-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '10px', color: '#333', background: 'none', border: 'none', cursor: 'pointer' }}>
              <User size={isMobile ? 22 : 20} />
              {!isMobile && <span>Account</span>}
            </button>

            {isUserOpen && (
              <div 
                className="alibaba-dropdown-menu"
                style={{ position: 'absolute', top: '40px', right: '0', background: 'white', width: '220px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', borderRadius: '12px', border: '1px solid #eee', zIndex: 999, padding: '16px' }}
                onMouseEnter={() => handleEnter(setIsUserOpen, userTimer)} 
                onMouseLeave={() => handleLeave(setIsUserOpen, userTimer)}
              >
                <div className="user-logged-header">
                  <p className="font-bold truncate" style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis' }}>Hi, {session.user.email.split('@')[0]}</p>
                  <p className="text-xs text-gray-500 truncate" style={{ fontSize: '11px', color: '#888', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.user.email}</p>
                  
                  <button onClick={handleLogout} className="flex items-center gap-2 text-xs text-red-500 font-semibold w-full justify-center py-1.5 border border-red-200 rounded-full hover:bg-red-50 transition" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#e53e3e', fontWeight: '600', width: '100%', justifyContent: 'center', padding: '4px 0', border: '1px solid #fecaca', borderRadius: '9999px', background: 'transparent', cursor: 'pointer' }}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
                
                <div className="dropdown-divider" style={{ height: '1px', background: '#eee', margin: '12px 0' }}></div>
                
                <nav className="flex flex-col gap-2" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <Link to="/dashboard/orders" className="flex justify-between text-sm text-gray-700 hover:text-orange-600 transition" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#333', textDecoration: 'none' }}>
                    My Orders <ChevronRight size={14} className="text-gray-300" />
                  </Link>
                  <Link to="/dashboard/analytics" className="flex justify-between text-sm text-gray-700 hover:text-orange-600 transition" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#333', textDecoration: 'none' }}>
                    Analytics <ChevronRight size={14} className="text-gray-300" />
                  </Link>
                  <Link to="/dashboard/settings" className="flex justify-between text-sm text-gray-700 hover:text-orange-600 transition" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#333', textDecoration: 'none' }}>
                    Settings <ChevronRight size={14} className="text-gray-300" />
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}