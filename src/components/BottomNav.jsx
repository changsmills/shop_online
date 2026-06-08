import React from "react";
import { Home, LayoutGrid, ShoppingCart, MessageSquare, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "../BottomNav.css";

const BottomNav = ({ activeMenu, onOpenCategories, session }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="mobile-bottom-nav">
      {/* 1. HOME */}
      <div 
        className={`nav-item ${isActive("/dashboard") && activeMenu !== 'categories' ? "active" : ""}`} 
        onClick={() => {
          navigate("/dashboard");
          if(activeMenu === 'categories') window.location.reload(); 
        }}
      >
        <Home size={22} strokeWidth={2.5} />
        <span>Home</span>
      </div>

      {/* 2. CATEGORIES */}
      <div 
        className={`nav-item ${activeMenu === 'categories' ? "active" : ""}`} 
        onClick={() => {
          if (onOpenCategories) onOpenCategories();
        }}
      >
        <LayoutGrid size={22} strokeWidth={2.5} /> 
        <span>Categories</span>
      </div>

      {/* 3. MESSENGER (badala ya Alerts) */}
      <div 
        className={`nav-item ${isActive("/dashboard/messages") ? "active" : ""}`} 
        onClick={() => navigate("/dashboard/messages")}
      >
        <MessageSquare size={22} strokeWidth={2.5} />
        <span>Messenger</span>
      </div>

      {/* 4. CART */}
      <div 
        className={`nav-item ${isActive("/cart") ? "active" : ""}`} 
        onClick={() => navigate("/cart")}
      >
        <div className="cart-icon-wrapper">
          <ShoppingCart size={22} strokeWidth={2.5} />
          <span className="cart-badge">3</span> 
        </div>
        <span>Cart</span>
      </div>

      {/* 5. ACCOUNT */}
      <div 
        className={`nav-item ${isActive("/dashboard/settings") ? "active" : ""}`} 
        onClick={() => navigate("/dashboard/settings")}
      >
        <User size={22} strokeWidth={2.5} />
        <span>Account</span>
      </div>
    </nav>
  );
};

export default BottomNav;