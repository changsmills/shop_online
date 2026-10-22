import React from "react";
import { Home, LayoutGrid, ShoppingCart, MessageSquare, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNav = ({ activeMenu, onOpenCategories, session }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartCount, setCartCount] = React.useState(0);

  React.useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('alibaba_cart') || '[]');
        const total = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
        setCartCount(total);
      } catch (e) {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  // 🔥 Class ya kila nav item (Imeongezwa Dark Mode na Brand Color)
  const navItemClass = (active) =>
    `flex flex-col items-center justify-center flex-1 gap-1 py-0.5 cursor-pointer transition-all duration-200 [-webkit-tap-highlight-color:transparent] ${
      active 
        ? "text-[#ff6a00] dark:text-[#ff8c33]" // Brand Orange kwa Active
        : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200" // Grey inayofaa Light na Dark
    }`;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 h-[78px] bg-white dark:bg-[#0a0a0a] flex justify-around items-center
                 border-t-[0.5px] border-gray-200 dark:border-gray-800 shadow-[0_-1px_8px_rgba(0,0,0,0.03)]
                 z-[1000] pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))]
                 antialiased [text-rendering:optimizeLegibility] md:hidden transition-colors duration-300"
    >
      {/* 1. HOME */}
      <div
        className={navItemClass(isActive("/dashboard") && activeMenu !== "categories")}
        onClick={() => {
          navigate("/dashboard");
          if (activeMenu === "categories") window.location.reload();
        }}
      >
        <Home size={22} strokeWidth={2.5} className="w-6 h-6 shrink-0" />
        <span className="text-[11px] font-medium tracking-[0.02em] leading-[1.2]">Home</span>
      </div>

      {/* 2. CATEGORIES */}
      <div
        className={navItemClass(activeMenu === "categories")}
        onClick={() => {
          if (onOpenCategories) onOpenCategories();
        }}
      >
        <LayoutGrid size={22} strokeWidth={2.5} className="w-6 h-6 shrink-0" />
        <span className="text-[11px] font-medium tracking-[0.02em] leading-[1.2]">Categories</span>
      </div>

      {/* 3. MESSENGER */}
      <div
        className={navItemClass(isActive("/dashboard/messages"))}
        onClick={() => navigate("/dashboard/messages")}
      >
        <MessageSquare size={22} strokeWidth={2.5} className="w-6 h-6 shrink-0" />
        <span className="text-[11px] font-medium tracking-[0.02em] leading-[1.2]">Messenger</span>
      </div>

      {/* 4. CART */}
      <div
        className={navItemClass(isActive("/cart"))}
        onClick={() => navigate("/cart")}
      >
        <div className="relative flex items-center justify-center">
          <ShoppingCart size={22} strokeWidth={2.5} className="w-6 h-6 shrink-0" />
          {cartCount > 0 && (
            <span
              className="absolute -top-1.5 -right-2 bg-[#ff4d4f] text-white
                         text-[10px] font-bold px-1 py-px rounded-full min-w-4 h-4
                         flex items-center justify-center border-[1.5px] border-white dark:border-[#0a0a0a] leading-none"
            >
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </div>
        <span className="text-[11px] font-medium tracking-[0.02em] leading-[1.2]">Cart</span>
      </div>

      {/* 5. ACCOUNT */}
      <div
        className={navItemClass(isActive("/dashboard/settings"))}
        onClick={() => navigate("/dashboard/settings")}
      >
        <User size={22} strokeWidth={2.5} className="w-6 h-6 shrink-0" />
        <span className="text-[11px] font-medium tracking-[0.02em] leading-[1.2]">Account</span>
      </div>
    </nav>
  );
};

export default BottomNav;