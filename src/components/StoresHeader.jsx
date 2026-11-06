// src/components/StoresHeader.jsx
import React, { useState, useEffect, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; 
import Logo from './Logo';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext.jsx';
import StoreSearchBar from './StoreSearchBar'; 
import api from '../axiosConfig';
import { useQuery } from '@tanstack/react-query';

const fetchStoreNames = async () => {
  try {
    const response = await api.get('/stores/', { params: { limit: 10 } });
    const data = response.data.results || response.data || [];
    const names = data.map(store => store.store_name || store.name).filter(Boolean);
    return names.length > 0 ? names : ["Search stores...", "Find your favorite shop..."];
  } catch (error) {
    console.error("Imeshindwa kuchukua majina ya maduka:", error);
    return ["Search stores...", "Find your favorite shop..."];
  }
};

const StoresHeader = memo(({ onSearch, showBack = true }) => {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const navigate = useNavigate(); 
  const [search, setSearch] = useState("");
  
  // States za lugha (hazitumiki tena lakini tunaziacha kuzuia error)
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currency, setCurrency] = useState("TZS");
  const dropdownRef = useRef(null);

  const { data: storePlaceholders = ["Search stores..."] } = useQuery({
    queryKey: ['storePlaceholders'],
    queryFn: fetchStoreNames,
    staleTime: 1000 * 60 * 10,
  });

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

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-white dark:bg-[#161b22] border-b border-gray-200 dark:border-[#30363d] shadow-sm font-sans">
      
      {/* Header Container */}
      <div className="max-w-[1400px] mx-auto px-4 h-[70px] flex items-center justify-between gap-2 md:gap-4">
        
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
        {/* Nimeondoa max-w-2xl na kuweka w-full max-w-3xl ili itumie nafasi vizuri */}
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full max-w-3xl mx-auto">
          <StoreSearchBar 
            search={search} 
            setSearch={setSearch} 
            placeholders={storePlaceholders} 
          />
        </form>

        {/* 🔥 KULIA: Nafasi Tupu (Spacer) */}
        {/* Hii inasaidia Search Bar kubaki katikati kwa kuweka nafasi sawa na ile ya Logo upande wa kushoto */}
        <div className="w-[30px] md:w-[100px] shrink-0"></div>
        
      </div>
    </header>
  );
});

StoresHeader.displayName = 'StoresHeader';

export default StoresHeader;