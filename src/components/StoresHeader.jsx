// src/components/StoresHeader.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ChevronDown, ArrowLeft } from 'lucide-react';
import Logo from './Logo';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext.jsx';
import StoreSearchBar from './StoreSearchBar'; 

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(search);
  };

  const handleSave = () => {
    setIsLangOpen(false);
  };

  const LanguageCurrencyDropdown = () => (
    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#161b22] rounded-xl shadow-lg border border-gray-200 dark:border-[#30363d] p-4 z-50">
      <div className="mb-4">
        <h3 className="font-bold text-gray-800 dark:text-white">{t('set_language_currency')}</h3>
        <p className="text-xs text-gray-500">{t('select_preferred_language')}</p>
      </div>
      <div className="mb-3">
        <label className="block text-xs font-semibold text-gray-600 mb-1">{t('language')}</label>
        <select value={language} onChange={(e) => changeLanguage(e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-gray-50 dark:bg-[#0d1117] dark:text-white dark:border-[#30363d]">
          <option value="en">English</option>
          <option value="sw">Kiswahili</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-600 mb-1">{t('currency')}</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-gray-50 dark:bg-[#0d1117] dark:text-white dark:border-[#30363d]">
          <option value="TZS">TZS - Tanzanian Shilling</option>
          <option value="USD">USD - US Dollar</option>
          <option value="KES">KES - Kenyan Shilling</option>
        </select>
      </div>
      <button onClick={handleSave} className="w-full bg-brand-orange text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#e65c00] transition-colors">
        {t('save')}
      </button>
    </div>
  );

  return (
    // 🔥 HAPA NIMEONGEZA fixed top-0 left-0 w-full z-50
    <header className="sticky top-0 left-0 w-full z-50 bg-white dark:bg-[#161b22] border-b border-gray-200 dark:border-[#30363d] shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 h-[70px] flex items-center justify-between gap-4">
        
        {/* KUSHOTO: Back Arrow + Logo */}
        <div className="flex items-center gap-2 shrink-0">
          {showBack && (
            <button 
              className="md:hidden p-1 text-gray-700 dark:text-gray-300" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <div className="scale-90 origin-left"><Logo /></div>
        </div>

        {/* KATI: Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl">
          <StoreSearchBar search={search} setSearch={setSearch} />
        </form>

        {/* KULIA: Lugha na Sarafu */}
        <div className="flex items-center gap-2 shrink-0 relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)} 
            className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#21262d] transition-colors text-gray-700 dark:text-gray-300"
          >
            <Globe size={20} />
            <span className="hidden md:inline text-sm font-medium">{language === 'en' ? 'English' : 'Kiswahili'}-{currency}</span>
            <ChevronDown size={14} className="hidden md:inline" />
          </button>
          {isLangOpen && <LanguageCurrencyDropdown />}
        </div>
        
      </div>
    </header>
  );
};

export default StoresHeader;