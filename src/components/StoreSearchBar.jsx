// src/components/StoreSearchBar.jsx
import { useRef, useState, useEffect } from "react";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
//import "../SearchBar.css";

export default function StoreSearchBar({ search = "", setSearch }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [placeholders, setPlaceholders] = useState(["Tafuta maduka..."]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // 1. PAKIA PLACEHOLDERS (Kwa maduka)
  useEffect(() => {
    // Tunaweza kuweka placeholders za kawaida kwa maduka, au kutoka API
    setPlaceholders([
      "Tafuta duka la nguo...",
      "Tafuta wauzaji jijini...",
      "Suppliers za bidhaa...",
      "Wholesale stores..."
    ]);
  }, []);

  // Badilisha placeholder (Animation)
  useEffect(() => {
    if (placeholders.length <= 1) return;
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev === placeholders.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [placeholders]);

  // 2. SEARCH EFFECT (Kwa Maduka)
  useEffect(() => {
    const getStoreSuggestions = async () => {
      if (!search || typeof search !== "string" || search.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const query = search.trim();

      try {
        const res = await api.get('/stores/', { 
          params: { search: query, limit: 5, status: 'active' } 
        });

        const data = res.data.results || res.data || [];
        
        // Tunaweka store data kwenye suggestions
        if (data.length > 0) {
          setSuggestions(data.map(store => ({ ...store, type: 'store' })));
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }

      } catch (err) {
        console.error("Store Search Error:", err);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(getStoreSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (typeof setSearch === "function") setSearch(val);
  };

  const navigateToSearchResults = (query) => {
    if (!query || query.trim() === "") return;
    if (window.innerWidth > 1024) {
      window.open(`/search-stores?q=${encodeURIComponent(query.trim())}`, '_blank');
    } else {
      navigate(`/search-stores?q=${encodeURIComponent(query.trim())}`);
    }
    setShowSuggestions(false);
    setIsFocused(false);
  };

  const handleSearchSubmit = () => {
    if (search.trim()) navigateToSearchResults(search);
  };

  const handleStoreClick = (storeId) => {
    if (window.innerWidth > 1024) {
      window.open(`/stores/${storeId}`, '_blank');
    } else {
      navigate(`/stores/${storeId}`);
    }
    setShowSuggestions(false);
    setIsFocused(false);
  };

  return (
    <div className="relative flex-1 max-w-full md:max-w-[700px] lg:max-w-[800px] mx-1 sm:mx-4 md:mx-5 lg:mx-[30px] z-[1000] w-full">

      {/* ===== SEARCH BAR CONTAINER ===== */}
      <div
        className={`flex items-center bg-white dark:bg-[#2d2d44] border-2 rounded-full h-8 sm:h-9 md:h-11 pl-2.5 sm:pl-3 md:pl-[18px] pr-0.5 py-0.5 relative z-10 transition-all duration-300 ${
          isFocused
            ? 'border-[#FF6600] shadow-[0_0_0_4px_rgba(255,102,0,0.1)] dark:shadow-[0_0_0_4px_rgba(255,102,0,0.15)]'
            : 'border-gray-300 dark:border-slate-700 hover:border-[#FF6600]'
        }`}
      >
        <input
          type="text"
          placeholder={placeholders[placeholderIndex]}
          className="flex-1 border-none outline-none text-xs sm:text-[13px] md:text-[15px] bg-transparent w-full text-gray-800 dark:text-white px-2 sm:px-2 md:px-2.5 placeholder:text-gray-400 dark:placeholder:text-slate-400 transition-opacity duration-300"
          value={search}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearchSubmit();
          }}
        />

        <div className="flex items-center gap-1.5 sm:gap-1.5 md:gap-2.5 flex-shrink-0">
          <button
            className="bg-[#FF6600] hover:bg-[#e55a00] text-white border-none h-[26px] sm:h-[30px] md:h-9 min-w-[26px] sm:min-w-[30px] md:min-w-9 px-2 sm:px-2.5 md:px-5 rounded-[13px] sm:rounded-[15px] md:rounded-[18px] font-bold text-xs sm:text-xs md:text-sm flex items-center justify-center gap-1 sm:gap-1 md:gap-1.5 cursor-pointer transition-all duration-200 active:scale-[0.96] flex-shrink-0"
            onClick={handleSearchSubmit}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span className="hidden md:inline">Search</span>
          </button>
        </div>
      </div>

      {/* ===== SUGGESTIONS PORTAL ===== */}
      {showSuggestions && suggestions.length > 0 && createPortal(
        <div className="fixed top-[70px] sm:top-[70px] md:top-[80px] left-1/2 -translate-x-1/2 w-[98%] sm:w-[96%] md:w-[96%] lg:w-full max-w-[98%] sm:max-w-[96%] md:max-w-[550px] lg:max-w-[650px] bg-white dark:bg-slate-800 z-[9999999] rounded-b-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-200 dark:border-slate-700 border-t-0 overflow-hidden animate-[dropdownFadeIn_0.2s_ease]">
          <div className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 uppercase tracking-wide">
            {search.trim().length > 0 ? `Maduka kwa "${search.trim()}"` : "Maduka Yanayopendekezwa"}
          </div>

          <div className="max-h-[380px] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#ff6a00_#f1f5f9] dark:[scrollbar-color:#ff6a00_#334155] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-slate-100 dark:[&::-webkit-scrollbar-track]:bg-slate-700 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#ff6a00] [&::-webkit-scrollbar-thumb]:rounded-full">
            {suggestions.map((store) => (
              <div
                key={`store-${store.id}`}
                className="flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-3 sm:py-3.5 cursor-pointer border-b border-slate-50 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-slate-700 active:bg-slate-100 dark:active:bg-slate-800 transition-colors duration-200"
                onMouseDown={() => handleStoreClick(store.id)}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-lg text-[#ff6a00] flex-shrink-0 text-xs sm:text-sm">
                  🏪
                </div>

                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-[13px] sm:text-sm text-slate-700 dark:text-white flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                    {store.store_name}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 flex-shrink-0 bg-slate-100 dark:bg-slate-700 px-1.5 sm:px-2 py-0.5 rounded-xl">
                    {store.city || 'Tanzania'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}