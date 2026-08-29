// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ChevronDown, MapPin, ArrowLeft } from 'lucide-react';
import Logo from './Logo';
import SearchBar from './SearchBar';
import UserTools from './UserTools';
import NavLinks from './NavLinks';
import "../Header.css";
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext.jsx';

const Header = ({ showBack = false, showSearch = true }) => {  // 🔥 ONGEZA showSearch
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currency, setCurrency] = useState("TZS");
  const dropdownRef = useRef(null);

  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [deliveryCountry, setDeliveryCountry] = useState("TZ");
  const [zipCode, setZipCode] = useState("");
  const locationDropdownRef = useRef(null);

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

  const LanguageCurrencyDropdown = () => (
    <div className="dropdown-card lang-currency-dropdown">
      <div className="dropdown-header">
        <h3>{t('set_language_currency')}</h3>
        <p>{t('select_preferred_language')}</p>
      </div>

      <div className="dropdown-field">
        <label>{t('language')}</label>
        <select 
          value={language} 
          onChange={(e) => changeLanguage(e.target.value)}
          className="dropdown-select"
        >
          <option value="en">English</option>
          <option value="sw">Kiswahili</option>
        </select>
      </div>

      <div className="dropdown-field">
        <label>{t('currency')}</label>
        <select 
          value={currency} 
          onChange={(e) => setCurrency(e.target.value)}
          className="dropdown-select"
        >
          <option value="TZS">TZS - Tanzanian Shilling</option>
          <option value="USD">USD - US Dollar</option>
          <option value="KES">KES - Kenyan Shilling</option>
        </select>
      </div>

      <button 
        onClick={handleSave}
        className="dropdown-save-btn"
      >
        {t('save')}
      </button>
    </div>
  );

  const LocationDropdown = () => (
    <div className="dropdown-card location-dropdown">
      <div className="dropdown-header">
        <h3>{t('specify_location')}</h3>
        <p>{t('shipping_options_desc')}</p>
      </div>

      <button 
        onClick={() => console.log("Add address clicked")}
        className="dropdown-add-address-btn"
      >
        {t('add_address')}
      </button>

      <div className="dropdown-or-divider">
        <span>{t('or')}</span>
      </div>

      <div className="dropdown-field">
        <select 
          value={deliveryCountry} 
          onChange={(e) => setDeliveryCountry(e.target.value)}
          className="dropdown-select"
        >
          <option value="TZ">🇹🇿 Tanzania</option>
          <option value="KE">🇰🇪 Kenya</option>
          <option value="UG">🇺🇬 Uganda</option>
        </select>
      </div>

      <div className="dropdown-field">
        <input 
          type="text" 
          placeholder={t('enter_zip_postal')}
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          className="dropdown-input"
        />
      </div>

      <button 
        onClick={handleLocationSave}
        className="dropdown-save-btn"
      >
        {t('save')}
      </button>
    </div>
  );

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-top-bar">
          <div className="header-left-group">
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

          {/* 🔥 SEARCH BAR - INAONYESHWA TU KAMA showSearch NI TRUE */}
          {showSearch && (
            <div className="search-bar-wrapper">
              <SearchBar search={search} setSearch={setSearch} />
            </div>
          )}

          <div className="user-tools-group">
            <div ref={locationDropdownRef} className="header-dropdown-wrapper">
              <button 
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="header-icon-btn"
              >
                <MapPin className="header-icon" size={20} />
                <span className="header-icon-text desktop-only">{deliveryCountry === 'TZ' ? 'TZ' : deliveryCountry}</span>
              </button>
              {isLocationOpen && <LocationDropdown />}
            </div>

            <UserTools />

            <div ref={dropdownRef} className="header-dropdown-wrapper">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="header-icon-btn"
              >
                <Globe className="header-icon" size={20} />
                <span className="header-icon-text desktop-only">{language === 'en' ? 'English' : 'Kiswahili'}-{currency}</span>
                <ChevronDown className="header-icon small" size={14} />
              </button>
              {isLangOpen && <LanguageCurrencyDropdown />}
            </div>
          </div>
        </div>

        <div className="header-navigation-row" key={language}>
          <NavLinks />
        </div>
      </div>
    </header>
  );
};

export default Header;