import { useState } from "react";
import { Link } from "react-router-dom";
import MegaMenu from "./MegaMenu";
import "../TopBar.css"; 

export default function TopBar({ activeTab, setActiveTab, search, setSearch }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const rightLinks = ["Buyer Central", "Help Center", "App & extension"];

  return (
    <div className="topbar-container">
      {/* MSTARI WA CHINI (Navigation Row) */}
      <div className="topbar-row-bottom">
        <div className="bottom-left-links">
          
          {/* --- SEHEMU YA MENU --- */}
          <div 
            className="menu-wrapper"
            onMouseEnter={() => setIsMenuOpen(true)}
            onMouseLeave={() => setIsMenuOpen(false)}
          >
            <div className="all-categories-btn">
              <span className="hamburger-icon">☰</span> All categories
            </div>

            {/* DROPDOWN MENU */}
            {isMenuOpen && (
              <div className="megamenu-dropdown">
                <MegaMenu />
              </div>
            )}
          </div>
          {/* --- MWISHO WA MENU --- */}

    {/* SEHEMU MPYA YA JARIBIO */}
   <div 
  className="menu-wrapper"
  onMouseEnter={() => setIsMenuOpen(true)}
  onMouseLeave={() => setIsMenuOpen(false)}
  style={{ position: 'relative', display: 'inline-block' }} 
   >
  <span className="nav-link" style={{ fontWeight: 'bold', cursor: 'pointer' }}>
    Featured selections ▼
  </span>

  {/* Hii itatokea chini ya Featured Selections sasa */}
  {isMenuOpen && (
    <div className="megamenu-dropdown">
      <MegaMenu />
    </div>
  )}
</div>          <span className="nav-link">Order protections</span>
        </div>

        <div className="bottom-right-links">
          {rightLinks.map(link => (
            <span key={link} className="nav-link">{link}</span>
          ))}
          
          <Link to="/home" className="sell-link">
            Sell on Changsmills
          </Link>
        </div>
      </div>
    </div>
  );
}