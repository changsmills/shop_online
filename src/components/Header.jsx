import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import SearchBar from './SearchBar';
import UserTools from './UserTools';
import NavLinks from './NavLinks';
import "../Header.css";

const Header = () => {
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="main-header">
      <div className="header-container">
        
        {/* ROW 1: Logo & Search Bar PEKEE Kwenye Simu */}
        <div className="header-top-bar">
          <div className="logo-wrapper">
            <Logo />
          </div>

          <SearchBar search={search} setSearch={setSearch} />

          {/* UserTools itaonekana kwenye PC tu sasa */}
          {!isMobile && (
            <div className="user-tools-group">
              <UserTools />
            </div>
          )}
        </div>

        {/* ROW 2: NavLinks - Inaonekana kwenye PC tu */}
        {!isMobile && (
          <div className="header-navigation-row">
            <NavLinks />
          </div>
        )}
        
      </div>
    </header>
  );
};

export default Header;