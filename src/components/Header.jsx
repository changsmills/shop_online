// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ChevronDown, MapPin, ArrowLeft } from 'lucide-react';
import Logo from './Logo';
import SearchBar from './SearchBar';
import UserTools from './UserTools';
import NavLinks from './NavLinks';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext.jsx';
import api from '../axiosConfig';

const Header = ({ showBack = false, showSearch = true }) => { 
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
  const [isScrolled, setIsScrolled] = useState(false);

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

  // ==========================================
  // LANGUAGE CURRENCY DROPDOWN (FIXED)
  // ==========================================
  const LanguageCurrencyDropdown = () => (
    <div className="absolute top-full right-0 mt-2 w-full lg:w-[360px] bg-white dark:bg-black rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-5 z-[99999] box-border">
      <div className="mb-4">
        <h3 className="m-0 mb-1 text-base font-bold text-black dark:text-white">{t('set_language_currency')}</h3>
        <p className="m-0 text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed">{t('select_preferred_language')}</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">{t('language')}</label>
        <select 
          value={language} 
          onChange={(e) => changeLanguage(e.target.value)}
          className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm outline-none bg-white dark:bg-black text-black dark:text-white box-border"
        >
          <option value="en">English</option>
          <option value="sw">Kiswahili</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">{t('currency')}</label>
        <select 
          value={currency} 
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm outline-none bg-white dark:bg-black text-black dark:text-white box-border"
        >
          <option value="TZS">TZS - Tanzanian Shilling</option>
        </select>
      </div>

      <button 
        onClick={handleSave}
        className="w-full bg-brand-orange text-white border-none rounded-[40px] py-3 text-[15px] font-bold cursor-pointer shadow-[0_4px_6px_rgba(255,102,0,0.2)] transition-colors hover:bg-brand-hover"
      >
        {t('save')}
      </button>
    </div>
  );

  // ==========================================
  // LOCATION DROPDOWN (FIXED)
  // ==========================================
  const LocationDropdown = () => (
    <div className="absolute top-full right-0 mt-2 w-full lg:w-[360px] bg-white dark:bg-black rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-5 z-[99999] box-border">
      <div className="mb-4">
        <h3 className="m-0 mb-1 text-base font-bold text-black dark:text-white">{t('specify_location')}</h3>
        <p className="m-0 text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed">{t('shipping_options_desc')}</p>
      </div>

      <button 
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                api.patch('/profile/', {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
                })
                .then(() => {
                  console.log("✅ GPS Location saved to profile!");
                  localStorage.setItem('location_allowed', 'true');
                  setIsLocationOpen(false);
                  window.location.reload();
                })
                .catch(err => {
                  console.error("❌ Error saving location:", err);
                  setIsLocationOpen(false);
                });
              },
              (err) => {
                console.error("❌ Error getting GPS:", err);
                setIsLocationOpen(false);
              },
              { enableHighAccuracy: true, timeout: 10000 }
            );
          } else {
            console.log("Geolocation not supported");
            setIsLocationOpen(false);
          }
        }}
        className="w-full bg-brand-orange text-white border-none rounded-[40px] py-2.5 text-sm font-bold cursor-pointer mb-4"
      >
        📍 {t('use_my_current_location')}
      </button>

      <div className="flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs mb-4">
        <span className="px-2.5 bg-white dark:bg-black">{t('or')}</span>
      </div>

      <div className="mb-4">
        <select 
          value={deliveryCountry} 
          onChange={(e) => setDeliveryCountry(e.target.value)}
          className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm outline-none bg-white dark:bg-black text-black dark:text-white box-border"
        >
          <option value="TZ">🇹🇿 Tanzania</option>
        </select>
      </div>

      <div className="mb-4">
        <input 
          type="text" 
          placeholder={t('enter_zip_postal')}
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm outline-none bg-white dark:bg-black text-black dark:text-white box-border"
        />
      </div>

      <button 
        onClick={handleLocationSave}
        className="w-full bg-brand-orange text-white border-none rounded-[40px] py-3 text-[15px] font-bold cursor-pointer shadow-[0_4px_6px_rgba(255,102,0,0.2)] transition-colors hover:bg-brand-hover"
      >
        {t('save')}
      </button>
    </div>
  );

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full bg-white dark:bg-black text-black dark:text-white border-t-2 border-t-gray-200 dark:border-t-gray-800 border-b border-b-gray-200 dark:border-b-gray-800 shadow-sm transition-colors duration-300">
      
      <div className="max-w-[1440px] mx-auto px-4 py-1 lg:px-8 overflow-visible">

        <div className="flex items-center justify-between gap-4 h-[52px] lg:gap-5">
          
          {/* LEFT GROUP */}
          <div className="flex items-center gap-4 lg:gap-5 max-[480px]:gap-[15px]">
            {showBack && (
              <button 
                className="flex lg:hidden bg-transparent border-none p-[2px] pr-2 items-center justify-center cursor-pointer active:scale-95 transition-transform" 
                onClick={() => navigate(-1)}
                aria-label="Rudi nyuma"
              >
                <ArrowLeft size={24} className="text-black dark:text-white" />
              </button>
            )}
            <div className="min-w-0 w-auto max-w-[130px] shrink-0 flex items-center lg:min-w-[140px] lg:max-w-none">
              <Logo />
            </div>
          </div>

          {/* SEARCH BAR */}
          {showSearch && (
            <div className="flex-1 flex items-center w-full min-w-0 px-1 lg:px-1">
              <SearchBar search={search} setSearch={setSearch} />
            </div>
          )}

          {/* RIGHT GROUP - User Tools + Dropdowns (Desktop only) */}
          <div className="hidden lg:flex gap-[1.2rem] items-center">

            {/* LOCATION DROPDOWN */}
            <div ref={locationDropdownRef} className="relative">
              <button 
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center gap-1 bg-transparent border-none cursor-pointer font-medium text-[13px] text-black dark:text-white hover:text-brand-orange transition-colors"
              >
                <MapPin size={20} />
                <span className="hidden lg:inline font-bold">
                  {deliveryCountry === 'TZ' ? 'TZ' : deliveryCountry}
                </span>
              </button>
              {isLocationOpen && <LocationDropdown />}
            </div>

            {/* USER TOOLS */}
            <UserTools />

            {/* LANGUAGE DROPDOWN */}
            <div ref={dropdownRef} className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 bg-transparent border-none cursor-pointer font-medium text-[13px] text-black dark:text-white hover:text-brand-orange transition-colors"
              >
                <Globe size={20} />
                <span className="hidden lg:inline font-bold">
                  {language === 'en' ? 'English' : 'Kiswahili'}-{currency}
                </span>
                <ChevronDown size={14} />
              </button>
              {isLangOpen && <LanguageCurrencyDropdown />}
            </div>
          </div>
        </div>

        {/* NAVIGATION ROW (Desktop only) */}
        <div 
          className={`hidden lg:block relative border-t border-gray-200 
            dark:border-gray-800 bg-white dark:bg-black items-center
             mt-0 transition-all duration-300 ease-in-out lg:px-0 overflow-visible ${
            isScrolled 
              ? 'lg:hidden'
              : 'lg:block'     
          }`} 
          key={language}
        >
          <NavLinks />
        </div>

      </div>
    </header>
  );
};

export default Header;