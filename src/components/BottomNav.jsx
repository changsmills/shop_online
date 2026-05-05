import React from "react";
import { Home, ClipboardList, ShoppingCart, Bell, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "../BottomNav.css";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function ya kuangalia kama link ipo active ili kuipa rangi (Active State)
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="mobile-bottom-nav">
      {/* 1. HOME */}
      <div 
        className={`nav-item ${isActive("/dashboard") ? "active" : ""}`} 
        onClick={() => navigate("/dashboard")}
      >
        <Home size={22} />
        <span>Home</span>
      </div>

      {/* 2. ORDERS */}
      <div 
        className={`nav-item ${isActive("/dashboard/orders") ? "active" : ""}`} 
        onClick={() => navigate("/dashboard/orders")}
      >
        <ClipboardList size={22} />
        <span>Orders</span>
      </div>

      {/* 3. CART */}
      <div 
        className={`nav-item ${isActive("/cart") ? "active" : ""}`} 
        onClick={() => navigate("/cart")}
      >
        <div className="cart-icon-wrapper">
          <ShoppingCart size={22} />
          {/* Hapa nimeiacha cart badge kama ilivyokuwa awali */}
          <span className="cart-badge">3</span> 
        </div>
        <span>Cart</span>
      </div>

      {/* 4. ALERTS (Notifications) */}
      <div 
        className={`nav-item ${isActive("/dashboard/notifications") ? "active" : ""}`} 
        onClick={() => navigate("/dashboard/notifications")}
      >
        <Bell size={22} />
        <span>Alerts</span>
      </div>

      {/* 5. ACCOUNT (Settings) */}
      <div 
        className={`nav-item ${isActive("/dashboard/settings") ? "active" : ""}`} 
        onClick={() => navigate("/dashboard/settings")}
      >
        <User size={22} />
        <span>Account</span>
      </div>
    </nav>
  );
};

export default BottomNav;