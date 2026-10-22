import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../axiosConfig";
import { useCart } from "../context/CartContext";
import { Bell, MessageSquare, ShoppingCart, User, LogOut, ChevronRight } from "lucide-react";

export default function UserTools({ session: propSession, isMobile }) {
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartTimer = useRef(null);
  const userTimer = useRef(null);

  const [localSession, setLocalSession] = useState(null);
  const [userStoreId, setUserStoreId] = useState(null);
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);

  const { cartItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const getSessionAndStore = async () => {
      const token = localStorage.getItem("access_token");
      if (!isMounted) return;

      if (token) {
        try {
          const profileRes = await api.get('/profile/', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const profile = profileRes.data;
          setLocalSession({
            user: {
              email: profile.email || "User",
              full_name: profile.full_name || "",
              role: profile.role || "buyer"
            }
          });
        } catch (err) {
          console.error("Error fetching profile:", err);
          setLocalSession({ user: { email: "User", full_name: "", role: "user" } });
        }

        try {
          const { data: stores } = await api.get('/stores/', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (stores && stores.length > 0) setUserStoreId(stores[0].id);
        } catch (err) {
          console.error("Error fetching user store:", err);
        }

        try {
          const msgRes = await api.get('/messages/', {
            params: { is_read: false },
            headers: { Authorization: `Bearer ${token}` }
          });
          setUnreadMsgCount(msgRes.data?.length || 0);
        } catch (err) { /* ignore */ }

      } else {
        setLocalSession(null);
        setUserStoreId(null);
      }
    };

    getSessionAndStore();
    return () => { isMounted = false; };
  }, [propSession]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
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

  // 🔥 Click toggle kwa mobile (hakuna hover)
  const handleCartClick = (e) => {
    if (isMobile) {
      e.preventDefault();
      setIsCartOpen((v) => !v);
    }
  };
  const handleUserClick = (e) => {
    if (isMobile) {
      e.preventDefault();
      setIsUserOpen((v) => !v);
    }
  };

  const session = localSession;

  return (
    <div className={`relative flex items-center z-[1000] ${isMobile ? 'gap-1.5' : 'gap-4'}`}>

      {/* ===== CART DROPDOWN ===== */}
      <div
        className="relative"
        onMouseEnter={() => !isMobile && handleEnter(setIsCartOpen, cartTimer)}
        onMouseLeave={() => !isMobile && handleLeave(setIsCartOpen, cartTimer)}
      >
        <Link
          to="/cart"
          onClick={handleCartClick}
          className="flex flex-col items-center hover:opacity-80 transition-opacity no-underline"
        >
          <div className="relative flex">
            <ShoppingCart size={isMobile ? 22 : 20} className="text-gray-800 dark:text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-[#ff4e00] text-white rounded-full w-4 h-4 text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-black">
                {cartCount}
              </span>
            )}
          </div>
        </Link>

        {isCartOpen && (
          <div
            className="absolute top-10 right-0 w-[280px] z-[999] bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1f1f1f] rounded-xl p-4 shadow-[0_8px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.6)] max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:top-auto max-md:w-full max-md:rounded-t-2xl max-md:rounded-b-none max-md:max-h-[80vh] max-md:overflow-y-auto max-md:p-5 max-md:z-[1001]"
            onMouseEnter={() => !isMobile && handleEnter(setIsCartOpen, cartTimer)}
            onMouseLeave={() => !isMobile && handleLeave(setIsCartOpen, cartTimer)}
          >
            {/* Mobile close handle */}
            <div className="md:hidden flex justify-center mb-3">
              <div className="w-10 h-1 bg-gray-300 dark:bg-slate-600 rounded-full" />
            </div>

            <p className="text-sm font-bold text-black dark:text-white m-0 mb-2">
              Shopping Cart
            </p>
            <div className="h-px bg-gray-200 dark:bg-[#1f1f1f] my-2" />
            {cartItems.length === 0 ? (
              <div className="text-center py-4 text-gray-400 dark:text-[#6b6b6b]">
                <ShoppingCart size={40} strokeWidth={1} className="mx-auto mb-2 opacity-20" />
                <p className="text-[13px] m-0 text-gray-400 dark:text-[#6b6b6b]">
                  Cart is empty
                </p>
              </div>
            ) : (
              <div className="py-2">
                <p className="text-[13px] text-[#ff6a00] font-bold m-0">
                  {cartCount} items selected
                </p>
              </div>
            )}
            <Link
              to="/cart"
              className="mt-2 block text-center bg-[#ff6a00] hover:bg-[#e55a00] text-white rounded-full py-2 no-underline font-bold text-[13px] transition-colors"
            >
              Go to Cart
            </Link>
          </div>
        )}
      </div>

            {/* ===== AUTH OR USER SECTION ===== */}
      {!session ? (
        <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-3'}`}>
          
          {/* SIGN IN - Nyeusi kwenye Light Mode, Nyeupe kwenye Dark Mode */}
          <Link
            to="/dashboard/login"
            className={`font-semibold !text-black dark:!text-white hover:!text-orange-600 transition-colors no-underline ${
              isMobile ? 'text-[13px]' : 'text-sm'
            }`}
          >
            Sign in
          </Link>

          {/* CREATE ACCOUNT - Background Nyeusi & Text Nyeupe (Light), Background Nyeupe & Text Nyeusi (Dark) */}
          <Link
            to="/dashboard/register"
            className={`flex items-center justify-center bg-black dark:bg-white !text-white dark:!text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full no-underline font-bold shadow-sm transition-all duration-200 ${
              isMobile ? 'px-3 py-1 text-xs' : 'px-5 py-2 text-sm'
            }`}
          >
            <span className="relative z-10">Create account</span>
          </Link>
          
        </div>
      ) : (

        <div className={`flex items-center ${isMobile ? 'gap-1.5' : 'gap-3'}`}>

          {/* Notifications */}
          <Link
            to="/dashboard/notifications"
            className="flex flex-col items-center hover:opacity-80 transition-opacity no-underline"
          >
            <div className="relative flex">
              <Bell size={isMobile ? 22 : 20} className="text-gray-800 dark:text-white" />
              <span className="absolute -top-1 -right-1.5 bg-[#ff4e00] text-white rounded-full w-3.5 h-3.5 text-[9px] flex items-center justify-center">
                3
              </span>
            </div>
            {!isMobile && (
              <span className="text-[10px] font-medium text-gray-500 dark:text-slate-400">Alerts</span>
            )}
          </Link>

          {/* Messages */}
          <Link
            to="/dashboard/messages"
            className="flex flex-col items-center hover:opacity-80 transition-opacity no-underline"
          >
            <div className="relative flex">
              <MessageSquare size={isMobile ? 22 : 20} className="text-gray-800 dark:text-white" />
              {unreadMsgCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-[#ff4e00] text-white rounded-full w-3.5 h-3.5 text-[9px] flex items-center justify-center">
                  {unreadMsgCount}
                </span>
              )}
            </div>
            {!isMobile && (
              <span className="text-[10px] font-medium text-gray-500 dark:text-slate-400">Msg</span>
            )}
          </Link>

          {/* User Account Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => !isMobile && handleEnter(setIsUserOpen, userTimer)}
            onMouseLeave={() => !isMobile && handleLeave(setIsUserOpen, userTimer)}
          >
            <button
              onClick={handleUserClick}
              className="flex flex-col items-center bg-transparent border-none cursor-pointer"
            >
              <User size={isMobile ? 22 : 20} className="text-gray-800 dark:text-white" />
              {!isMobile && (
                <span className="text-[10px] font-medium text-gray-500 dark:text-slate-400">Account</span>
              )}
            </button>

            {isUserOpen && (
              <div
                className="absolute top-10 right-0 w-[220px] bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1f1f1f] rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.6)] z-[999] p-4 max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:top-auto max-md:w-full max-md:rounded-t-2xl max-md:rounded-b-none max-md:max-h-[80vh] max-md:overflow-y-auto max-md:p-5 max-md:z-[1001]"
                onMouseEnter={() => !isMobile && handleEnter(setIsUserOpen, userTimer)}
                onMouseLeave={() => !isMobile && handleLeave(setIsUserOpen, userTimer)}
              >
                {/* Mobile close handle */}
                <div className="md:hidden flex justify-center mb-3">
                  <div className="w-10 h-1 bg-gray-300 dark:bg-slate-600 rounded-full" />
                </div>

                {/* User Header */}
                <div className="text-center pb-3 border-b border-gray-200 dark:border-[#1f1f1f]">
                  <p className="text-sm font-bold text-gray-800 dark:text-white mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    Hi, {session.user.full_name ? session.user.full_name : session.user.email.split('@')[0]}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-[#b0b0b0] mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                    {session.user.email}
                  </p>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-[11px] text-red-600 dark:text-[#f87171] font-semibold w-full justify-center py-1.5 border border-red-200 dark:border-red-900/60 rounded-full hover:bg-red-50 dark:hover:bg-red-950/40 bg-white dark:bg-[#0a0a0a] cursor-pointer transition-colors"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>

                <div className="h-px bg-gray-200 dark:bg-[#1f1f1f] my-3" />

                <nav className="flex flex-col gap-1.5">
                  <Link
                    to="/dashboard/orders"
                    className="flex justify-between items-center text-[13px] text-gray-700 dark:text-slate-300 hover:text-orange-600 no-underline py-1.5 transition-colors"
                  >
                    My Orders <ChevronRight size={14} className="text-gray-300 dark:text-slate-600" />
                  </Link>

                  <Link
                    to="/dashboard/settings"
                    className="flex justify-between items-center text-[13px] text-gray-700 dark:text-slate-300 hover:text-orange-600 no-underline py-1.5 transition-colors"
                  >
                    Settings <ChevronRight size={14} className="text-gray-300 dark:text-slate-600" />
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