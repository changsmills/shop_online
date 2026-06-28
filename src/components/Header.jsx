import React, { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import SearchBar from './SearchBar';
import UserTools from './UserTools';
import NavLinks from './NavLinks';
import "../Header.css";
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Globe, ChevronDown, MapPin } from 'lucide-react';

const Header = () => {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currency, setCurrency] = useState("TZS");
  const dropdownRef = useRef(null);

  // States za Location Selector
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [deliveryCountry, setDeliveryCountry] = useState("TZ");
  const [zipCode, setZipCode] = useState("");
  const locationDropdownRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Kufunga dropdowns unapobonyeza nje
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setIsLocationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSave = () => {
    console.log(`Imebadilishwa: Lugha=${language}, Sarafu=${currency}`);
    setIsLangOpen(false);
  };

  const handleLocationSave = () => {
    console.log(`Location Saved: Country=${deliveryCountry}, ZIP=${zipCode}`);
    setIsLocationOpen(false);
  };

  // Component ya Dropdown ya Lugha na Sarafu
  const LanguageCurrencyDropdown = () => (
    <div 
      className="lang-currency-card"
      style={{
        position: 'absolute',
        top: '42px',
        right: '0',
        width: isMobile ? '280px' : '360px',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        border: '1px solid #f0f0f0',
        padding: '20px',
        zIndex: 10000,
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>Set language and currency</h3>
        <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: '1.4' }}>
          Select your preferred language and currency.
        </p>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#333' }}>Language</label>
        <select 
          value={language} 
          onChange={(e) => changeLanguage(e.target.value)}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: '8px',
            border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', background: '#fff'
          }}
        >
          <option value="en">English</option>
          <option value="sw">Kiswahili</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#333' }}>Currency</label>
        <select 
          value={currency} 
          onChange={(e) => setCurrency(e.target.value)}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: '8px',
            border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', background: '#fff'
          }}
        >
          <option value="TZS">TZS - Tanzanian Shilling</option>
          <option value="USD">USD - US Dollar</option>
          <option value="KES">KES - Kenyan Shilling</option>
        </select>
      </div>

      <button 
        onClick={handleSave}
        style={{
          width: '100%', background: '#FF6600', color: 'white', border: 'none',
          borderRadius: '40px', padding: '12px 0', fontSize: '15px', fontWeight: '700',
          cursor: 'pointer', boxShadow: '0 4px 6px rgba(255, 102, 0, 0.2)'
        }}
        onMouseOver={(e) => e.target.style.background = '#e55a00'}
        onMouseOut={(e) => e.target.style.background = '#FF6600'}
      >
        Save
      </button>
    </div>
  );

  // Component ya Dropdown ya Location
  const LocationDropdown = () => (
    <div 
      className="location-dropdown-card"
      style={{
        position: 'absolute',
        top: '42px',
        right: '0',
        width: isMobile ? '280px' : '360px',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        border: '1px solid #f0f0f0',
        padding: '20px',
        zIndex: 10000,
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>Specify your location</h3>
        <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: '1.4' }}>
          Shipping options and fees vary based on your location.
        </p>
      </div>

      <button 
        onClick={() => console.log("Add address clicked")}
        style={{
          width: '100%', background: '#FF6600', color: 'white', border: 'none',
          borderRadius: '40px', padding: '10px 0', fontSize: '14px', fontWeight: '700',
          cursor: 'pointer', marginBottom: '15px'
        }}
      >
        Add address
      </button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '12px', marginBottom: '15px' }}>
        <span style={{ padding: '0 10px', background: '#fff' }}>Or</span>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <select 
          value={deliveryCountry} 
          onChange={(e) => setDeliveryCountry(e.target.value)}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: '8px',
            border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', background: '#fff'
          }}
        >
          <option value="TZ">🇹🇿 Tanzania</option>
          <option value="KE">🇰🇪 Kenya</option>
          <option value="UG">🇺🇬 Uganda</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Enter ZIP or postal code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: '8px',
            border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', background: '#fff'
          }}
        />
      </div>

      <button 
        onClick={handleLocationSave}
        style={{
          width: '100%', background: '#FF6600', color: 'white', border: 'none',
          borderRadius: '40px', padding: '12px 0', fontSize: '15px', fontWeight: '700',
          cursor: 'pointer', boxShadow: '0 4px 6px rgba(255, 102, 0, 0.2)'
        }}
        onMouseOver={(e) => e.target.style.background = '#e55a00'}
        onMouseOut={(e) => e.target.style.background = '#FF6600'}
      >
        Save
      </button>
    </div>
  );

  return (
    <header className="main-header">
      <div className="header-container">
        
                {/* ROW 1: Logo, Search, na Vifaa vya Kulia */}
        <div className="header-top-bar" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          
          {/* 1. Logo upande wa Kushoto */}
          <div className="logo-wrapper"><Logo /></div>

          {/* 🔥 2. Search Bar katikati (IMEONGEZWA flex: 1 na minWidth ili ijaze nafasi!) */}
          <div className="search-bar-wrapper" style={{ flex: 1, display: 'flex', alignItems: 'center', width: '100%', minWidth: isMobile ? '80px' : '150px' }}>
            <SearchBar search={search} setSearch={setSearch} />
          </div>

                    {/* 3. Vifaa vya Kulia (Location, UserTools, Globe) */}
          <div 
            className="user-tools-group" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: isMobile ? '6px' : '12px',
              flexShrink: 0
            }}
          >
            {/* LOCATION SELECTOR */}
            <div ref={locationDropdownRef} style={{ position: 'relative' }}>
              <button 
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px', background: 'none',
                  border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '13px', color: '#333'
                }}
              >
                <MapPin size={isMobile ? 22 : 18} />
                {!isMobile && <span style={{ fontWeight: 'bold' }}>{deliveryCountry === 'TZ' ? 'TZ' : deliveryCountry}</span>}
              </button>
              {isLocationOpen && <LocationDropdown />}
            </div>

            {/* ✨ BADILISHA HAPA: Weka !isMobile ili isionekane kwenye Mobile! */}
            {!isMobile && (
              <UserTools isMobile={isMobile} />
            )}

            {/* GLOBE - LUUGHA NA SARAFU */}
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px', background: 'none',
                  border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '13px', color: '#333'
                }}
              >
                <Globe size={isMobile ? 22 : 20} />
                {!isMobile && <><span style={{ fontWeight: 'bold' }}>{language === 'en' ? 'English' : 'Kiswahili'}-{currency}</span><ChevronDown size={14} /></>}
              </button>
              {isLangOpen && <LanguageCurrencyDropdown />}
            </div>
          </div>
        </div>

                {/* ==========================================
            NAV LINKS - RESPONSIVE (Desktop & Mobile)
           ========================================== */}
        <div className="header-navigation-row" key={language}>
          <NavLinks isMobile={isMobile} />
        </div>
        
      </div>
    </header>
  );
};

export default Header;