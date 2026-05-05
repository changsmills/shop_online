import { useState, useEffect, useRef } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useCart } from "../context/CartContext"; 
import { Bell, Store, MessageSquare, ShoppingCart, User, LogOut, ChevronRight, PlusCircle } from "lucide-react";
import "../UserTools.css"; 

export default function UserTools({ session: propSession }) {
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [localSession, setLocalSession] = useState(null);
  const [userStoreId, setUserStoreId] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]); 
  
  const { cartItems } = useCart(); 
  const navigate = useNavigate();

  // 1. HIFADHI ZA TIMERS (Refs) - Moja kwa kila dropdown kuzuia migongano
  const storeTimer = useRef(null);
  const messageTimer = useRef(null);
  const cartTimer = useRef(null);
  const userTimer = useRef(null);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const notifyTimer = useRef(null);

  const [notifications, setNotifications] = useState([]);

  const fetchCustomerOrders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(3);
    if (data) setCustomerOrders(data);
  }
};
fetchCustomerOrders();

useEffect(() => {
  if (userStoreId) {
    const fetchRecentOrders = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('store_id', userStoreId)
        .order('created_at', { ascending: false })
        .limit(5); // Inavuta 5 tu kwa ajili ya summary
      
      if (data) setNotifications(data);
    };

    fetchRecentOrders();
  }
}, [userStoreId]);

// Ongeza hii juu ya return
const handleEnter = (setter, timer) => {
  if (timer.current) clearTimeout(timer.current);
  setter(true);
};

const handleLeave = (setter, timer) => {
  timer.current = setTimeout(() => setter(false), 300);
};


  const handleNotifyEnter = () => {
  if (notifyTimer.current) clearTimeout(notifyTimer.current);
  setIsNotifyOpen(true);
};

const handleNotifyLeave = () => {
  notifyTimer.current = setTimeout(() => setIsNotifyOpen(false), 300);
};
  // --- LOGIC ZA STORE ---
  const handleStoreEnter = () => {
    if (storeTimer.current) clearTimeout(storeTimer.current);
    setIsStoreOpen(true);
  };
  const handleStoreLeave = () => {
    storeTimer.current = setTimeout(() => setIsStoreOpen(false), 300);
  };

  // --- LOGIC ZA MESSAGES ---
  const handleMessageEnter = () => {
    if (messageTimer.current) clearTimeout(messageTimer.current);
    setIsMessageOpen(true);
  };
  const handleMessageLeave = () => {
    messageTimer.current = setTimeout(() => setIsMessageOpen(false), 300);
  };

  // --- LOGIC ZA CART ---
  const handleCartEnter = () => {
    if (cartTimer.current) clearTimeout(cartTimer.current);
    setIsCartOpen(true);
  };
  const handleCartLeave = () => {
    cartTimer.current = setTimeout(() => setIsCartOpen(false), 300);
  };

  // --- LOGIC ZA USER ACCOUNT ---
  const handleUserEnter = () => {
    if (userTimer.current) clearTimeout(userTimer.current);
    setIsUserOpen(true);
  };
  const handleUserLeave = () => {
    userTimer.current = setTimeout(() => setIsUserOpen(false), 300);
  };

useEffect(() => {
  let isMounted = true; // Kuzuia memory leaks

  const getSessionAndStore = async () => {
    // 1. Pata session (Kutoka kwa prop au moja kwa moja Supabase)
    let currentSession = propSession;
    if (!currentSession) {
      const { data } = await supabase.auth.getSession();
      currentSession = data.session;
    }

    if (!isMounted) return;

    // 2. Set local session state
    setLocalSession(currentSession);

    // 3. Kama hakuna user, hakikisha storeId inafutwa (Muhimu kwa Logout)
    if (!currentSession?.user) {
      setUserStoreId(null);
      return;
    }

    // 4. Tafuta Store ID
    try {
      const { data: store, error } = await supabase
        .from("stores_engine")
        .select("id")
        .eq("owner_id", currentSession.user.id)
        .maybeSingle();

      if (error) throw error;

      if (isMounted) {
        setUserStoreId(store ? store.id : null);
      }
    } catch (error) {
      console.error("Store Fetch Error:", error.message);
      if (isMounted) setUserStoreId(null);
    }
  };

  getSessionAndStore();

  return () => {
    isMounted = false; // Cleanup function
  };
}, [propSession]); 

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLocalSession(null);
    setUserStoreId(null);
    setIsUserOpen(false);
    navigate("/"); 
  };

  const session = localSession;

  return (
    <div className="user-tools-container">
{/* 1. ALERTS DROPDOWN */}
<div 
  className="dropdown-wrapper" 
  onMouseEnter={() => handleEnter(setIsNotifyOpen, notifyTimer)} 
  onMouseLeave={() => handleLeave(setIsNotifyOpen, notifyTimer)}
>
  <button className="user-trigger-btn">
    <div className="cart-icon-wrapper">
      <Bell size={22} className="user-icon-svg" />
      {(notifications.length > 0 || customerOrders.some(o => o.status === 'approved')) && (
        <span className="cart-badge notify-dot"></span>
      )}
    </div>
    <span className="user-label">Alerts</span>
  </button>

  {isNotifyOpen && (
    <div className="alibaba-dropdown-menu">
      <div className="dropdown-header">
        <div className="flex justify-between items-center mb-2">
           <p className="welcome-text font-bold">Notifications</p>
           {/* Hii hapa path uliyotaka */}
           <Link to="/dashboard/notifications" className="text-[10px] text-blue-600 hover:underline">See All</Link>
        </div>
        <div className="dropdown-divider"></div>
        
        <div className="empty-state">
          {session ? (
            <div className="alerts-container">
              {/* SEHEMU YA MUUZAJI */}
              {userStoreId && (
                <div className="seller-alerts-box">
                  <p className="section-label">Duka Lako (Oda Mpya)</p>
                  {notifications.length > 0 ? (
                    notifications.slice(0, 3).map((order) => (
                      <Link to="/dashboard/notifications" key={order.id} className="notification-item seller-item">
                        <div className="item-main-row">
                          <p className="order-no">Oda: #{order.order_number}</p>
                          <span className="order-total">TZS {order.grand_total}</span>
                        </div>
                        <p className="item-sub-text">Mteja: {order.customer_phone}</p>
                      </Link>
                    ))
                  ) : (
                    <p className="empty-text">Hakuna oda mpya...</p>
                  )}
                </div>
              )}

              {/* SEHEMU YA MTEJA */}
              <div className="buyer-alerts-box">
                <p className="section-label border-top">Mizigo Yako (Tracking)</p>
                {customerOrders.length > 0 ? (
                  customerOrders.slice(0, 3).map((order) => (
                    <Link to="/dashboard/notifications" key={order.id} className="notification-item buyer-item">
                      <div className="item-main-row">
                        <p className="order-name">{order.category_name}</p>
                        <span className={`status-badge ${order.status === 'approved' ? 'status-approved' : 'status-pending'}`}>
                          {order.status === 'approved' ? 'Approved ✓' : 'Pending'}
                        </span>
                      </div>
                      <p className="item-sub-text">#{order.order_number}</p>
                    </Link>
                  ))
                ) : (
                  <p className="empty-text">Hujafanya oda bado.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="login-prompt">
              <p className="prompt-text">Ingia kuona taarifa zako</p>
              <Link to="/dashboard/login" className="btn-signin-main">Sign In</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )}
</div>
      
    {/* 1. STORE DROPDOWN - ITAONEKANA KAMA ANA STORE TU */}
{userStoreId && (
  <div 
    className="dropdown-wrapper" 
    onMouseEnter={handleStoreEnter} 
    onMouseLeave={handleStoreLeave}
  >
    <button className="user-trigger-btn">
      <Store size={22} className="user-icon-svg" />
      <span className="user-label">Store</span>
    </button>
{isStoreOpen && (
  <div 
    className="alibaba-dropdown-menu"
    onMouseEnter={handleStoreEnter} 
    onMouseLeave={handleStoreLeave}
  >
    <div className="dropdown-header">
      <p className="welcome-text font-bold">Seller Dashboard</p>
      <div className="dropdown-divider"></div>
      <nav className="dropdown-nav-links">
        {/* Manage Store Link Pekee */}
        <Link 
          to={`/dashboard/physical/${userStoreId}`} 
          className="nav-item flex justify-between items-center"
        >
          Manage My Store <ChevronRight size={14} />
        </Link>
      </nav>
    </div>
  </div>
)}
  </div>
)}

      {/* 2. MESSAGES DROPDOWN */}
      <div 
        className="dropdown-wrapper" 
        onMouseEnter={handleMessageEnter} 
        onMouseLeave={handleMessageLeave}
      >
        <Link to="/dashboard/messages" className="user-trigger-btn">
          <MessageSquare size={22} className="user-icon-svg" />
          <span className="user-label">Messages</span>
        </Link>
        {isMessageOpen && (
          <div 
            className="alibaba-dropdown-menu"
            onMouseEnter={handleMessageEnter} 
            onMouseLeave={handleMessageLeave}
          >
            <div className="dropdown-header">
              <p className="welcome-text text-center font-bold">Messages</p>
              <div className="dropdown-divider"></div>
              <div className="empty-state text-center py-4">
                <p className="text-sm text-gray-500">
                  {session ? "No new messages" : "Sign in to view messages"}
                </p>
                {!session && (
                  <Link to="/dashboard/login" className="btn-signin-main mt-2">Sign in</Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
     {/* 3. CART DROPDOWN - SASA INA ULINZI WA SESSION */}
<div 
  className="dropdown-wrapper" 
  onMouseEnter={handleCartEnter} 
  onMouseLeave={handleCartLeave}
>
  {/* Link ya trigger sasa inampeleka login kama hajajisajili */}
  <Link 
    to={session ? "/cart" : "/dashboard/login"} 
    state={{ message: "Tafadhali ingia ili uweze kuona na kukamilisha manunuzi yako." }}
    className="user-trigger-btn"
  >
    <div className="cart-icon-wrapper">
      <ShoppingCart size={22} className="user-icon-svg" />
      {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
    </div>
    <span className="user-label">Cart</span>
  </Link>

  {isCartOpen && (
    <div 
      className="alibaba-dropdown-menu"
      onMouseEnter={handleCartEnter} 
      onMouseLeave={handleCartLeave}
    >
      <div className="dropdown-header">
        <p className="welcome-text font-bold">Shopping cart</p>
        <div className="dropdown-divider"></div>

        {!session ? (
          /* MUONEKANO KAMA HAJALOGIN */
          <div className="empty-cart-state text-center py-4">
            <ShoppingCart size={40} strokeWidth={1} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-500 mb-3">Login to view your items</p>
            <Link 
              to="/dashboard/login" 
              state={{ message: "Ingia ili uone bidhaa ulizoweka kwenye kero." }}
              className="btn-signin-main text-xs"
            >
              Sign In
            </Link>
          </div>
        ) : (
          /* MUONEKANO KAMA AMELOGIN */
          <>
            {cartItems.length === 0 ? (
              <div className="empty-cart-state text-center py-4 text-gray-400">
                <ShoppingCart size={40} strokeWidth={1} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">Your cart is empty</p>
              </div>
            ) : (
              <div className="mini-cart-items py-2">
                 <p className="text-sm text-orange-600 font-bold">{cartCount} items selected</p>
              </div>
            )}
            <Link to="/cart" className="btn-signin-main outline-btn mt-2">Go to cart</Link>
          </>
        )}
      </div>
    </div>
  )}
</div>

      {/* 4. USER ACCOUNT DROPDOWN */}
      <div 
        className="dropdown-wrapper" 
        onMouseEnter={handleUserEnter} 
        onMouseLeave={handleUserLeave}
      >
        <button className="user-trigger-btn">
          <User size={22} className="user-icon-svg" />
          <span className="user-label">{session ? "Account" : "Sign In"}</span>
        </button>

        {isUserOpen && (
          <div 
            className="alibaba-dropdown-menu"
            onMouseEnter={handleUserEnter} 
            onMouseLeave={handleUserLeave}
          >
            <div className="dropdown-header">
              {!session ? (
                <>
                  <p className="welcome-text">Welcome to Changsmills</p>
                  <Link to="/dashboard/login" className="btn-signin-main">Sign in</Link>
                </>
              ) : (
                <div className="user-logged-header">
                  <p className="welcome-text">Hi, {session.user.email.split('@')[0]}</p>
                  <p className="user-email-display">{session.user.email}</p>
                  <button onClick={handleLogout} className="btn-signout-modern flex items-center justify-center gap-2">
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
            
            <div className="dropdown-divider"></div>
            
            <nav className="dropdown-nav-links">
              <Link to="/dashboard/orders" className="nav-item flex justify-between">
                My Orders <ChevronRight size={14} className="text-gray-300" />
              </Link>
              <Link to="/dashboard/analytics" className="nav-item flex justify-between">
                Analytics <ChevronRight size={14} className="text-gray-300" />
              </Link>
              <Link to="/dashboard/settings" className="nav-item flex justify-between">
                Account Settings <ChevronRight size={14} className="text-gray-300" />
              </Link>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}