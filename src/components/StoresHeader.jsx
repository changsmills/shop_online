// src/components/StoreHeader.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ChevronDown, ArrowLeft } from 'lucide-react';
import Logo from './Logo';
import "../StoreHeader.css"; 
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext.jsx';
import StoreSearchBar from './StoreSearchBar'; // ✅ Tumia StoreSearchBar mpya

const StoresHeader = ({ onSearch, showBack = true }) => {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const navigate = useNavigate(); 
  const [search, setSearch] = useState("");
  
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currency, setCurrency] = useState("TZS");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ==========================================
  // 🔥 HANDLER MAALUM WA SEARCH YA STORES
  // ==========================================
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(search); // Tuma search query kwa mzazi (AllStores)
    }
  };

  const handleSave = () => {
    console.log(`Imebadilishwa: Lugha=${language}, Sarafu=${currency}`);
    setIsLangOpen(false);
  };

  // Dropdown ya Lugha na Sarafu
  const LanguageCurrencyDropdown = () => (
    <div className="dropdown-card lang-currency-dropdown">
      <div className="dropdown-header">
        <h3>{t('set_language_currency')}</h3>
        <p>{t('select_preferred_language')}</p>
      </div>
      <div className="dropdown-field">
        <label>{t('language')}</label>
        <select value={language} onChange={(e) => changeLanguage(e.target.value)} className="dropdown-select">
          <option value="en">English</option>
          <option value="sw">Kiswahili</option>
        </select>
      </div>
      <div className="dropdown-field">
        <label>{t('currency')}</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="dropdown-select">
          <option value="TZS">TZS - Tanzanian Shilling</option>
          <option value="USD">USD - US Dollar</option>
          <option value="KES">KES - Kenyan Shilling</option>
        </select>
      </div>
      <button onClick={handleSave} className="dropdown-save-btn">{t('save')}</button>
    </div>
  );

  return (
    <header className="main-header">
      <div className="header-container">
        
        {/* ROW 1: Logo, Search, na Vifaa vya Kulia */}
        <div className="header-top-bar">
          
          {/* SEHEMU YA KUSHOTO: Back Arrow + Logo */}
          <div className="header-left-group" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {showBack && (
              <button 
                className="mobile-back-btn" 
                onClick={() => navigate(-1)}
                aria-label="Rudi nyuma"
              >
                <ArrowLeft size={24} color="#333" className="desktop-hidden" />
              </button>
            )}
            <div className="logo-wrapper"><Logo /></div>
          </div>

          {/* ✅ SEARCH BAR MAALUM YA STORES (Inatumia StoreSearchBar) */}
          <form onSubmit={handleSearchSubmit} className={`search-bar-wrapper`} style={{ flex: 1 }}>
            <StoreSearchBar search={search} setSearch={setSearch} />
          </form>

          <div className="user-tools-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* GLOBE - LUUGHA NA SARAFU */}
            <div ref={dropdownRef} className="header-dropdown-wrapper">
              <button onClick={() => setIsLangOpen(!isLangOpen)} className="header-icon-btn">
                <Globe className="header-icon" size={20} />
                <span className="header-icon-text desktop-only">{language === 'en' ? 'English' : 'Kiswahili'}-{currency}</span>
                <ChevronDown className="header-icon small" size={14} />
              </button>
              {isLangOpen && <LanguageCurrencyDropdown />}
            </div>
          </div>
        </div>
        
      </div>
    </header>
  );
};

export default StoresHeader;