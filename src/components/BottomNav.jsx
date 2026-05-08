import React from "react";
import { Home, LayoutGrid, ShoppingCart, Bell, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "../BottomNav.css";

const BottomNav = ({ activeMenu, onOpenCategories }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function ya kuangalia kama link ipo active ili kuipa rangi (Active State)
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="mobile-bottom-nav">
     {/* 1. HOME */}
<div 
  className={`nav-item ${isActive("/dashboard") && activeMenu !== 'categories' ? "active" : ""}`} 
  onClick={() => {
    navigate("/dashboard");
    // Hii itasaidia kufunga portal ukirudi Home (hiari)
    if(activeMenu === 'categories') window.location.reload(); 
  }}
>
  <Home size={22} strokeWidth={2.5} />
  <span>Home</span>
</div>

      {/* 2. CATEGORIES (Ilikuwa Orders) */}
<div 
  className={`nav-item ${activeMenu === 'categories' ? "active" : ""}`} 
  onClick={() => {
    if (onOpenCategories) {
      onOpenCategories(); // Hii inafungua portal ya dashboard
    }
  }}
>
  <LayoutGrid size={22} strokeWidth={2.5} /> 
  <span>Categories</span>
</div>

      {/* 3. CART */}
      <div 
        className={`nav-item ${isActive("/cart") ? "active" : ""}`} 
        onClick={() => navigate("/cart")}
      >
        <div className="cart-icon-wrapper">
          <ShoppingCart size={22} strokeWidth={2.5} />  {/* 🔥 NIMEONGEZA strokeWidth */}
          <span className="cart-badge">3</span> 
        </div>
        <span>Cart</span>
      </div>

      {/* 4. ALERTS (Notifications) */}
      <div 
        className={`nav-item ${isActive("/dashboard/notifications") ? "active" : ""}`} 
        onClick={() => navigate("/dashboard/notifications")}
      >
        <Bell size={22} strokeWidth={2.5} />  {/* 🔥 NIMEONGEZA strokeWidth */}
        <span>Alerts</span>
      </div>

      {/* 5. ACCOUNT (Settings) */}
      <div 
        className={`nav-item ${isActive("/dashboard/settings") ? "active" : ""}`} 
        onClick={() => navigate("/dashboard/settings")}
      >
        <User size={22} strokeWidth={2.5} />  {/* 🔥 NIMEONGEZA strokeWidth */}
        <span>Account</span>
      </div>
    </nav>
  );
};

export default BottomNav;