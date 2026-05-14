import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import SearchBar from './SearchBar';
import UserTools from './UserTools';
import NavLinks from './NavLinks';
import "../Header.css";
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext.jsx';

const Header = () => {
  const { t } = useTranslation();
const { language, changeLanguage } = useLanguage();
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


        {/* Kitufe cha lugha */}
<div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1001 }}>
  <button 
    onClick={() => changeLanguage(language === 'en' ? 'sw' : 'en')}
    style={{
      background: '#ff6600',
      color: 'white',
      border: 'none',
      padding: '4px 10px',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: '11px',
      fontWeight: 'bold'
    }}
  >
    {language === 'en' ? 'Kiswahili' : 'English'}
  </button>
</div>
        
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

        {!isMobile && (
  <div className="header-navigation-row" key={language}>
    <NavLinks />
  </div>
)}
        
      </div>
    </header>
  );
};

export default Header;