import { useRef, useState, useEffect } from "react";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Search } from "lucide-react"; // Tumia icon kutoka lucide-react

export default function SearchBar({ search = "", setSearch }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [placeholders, setPlaceholders] = useState(["Search"])
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Pakia placeholders
  useEffect(() => {
    const fetchLeafCategoryNames = async () => {
      try {
        const response = await api.get('/leaf-categories/', { params: { limit: 15 } });
        const data = response.data.results || response.data || [];
        if (Array.isArray(data)) {
          const names = data.map(item => item.name);
          if (names.length > 0) setPlaceholders(names);
        }
      } catch (err) {
        console.error("❌ Error fetching placeholders:", err);
      }
    };
    fetchLeafCategoryNames();
  }, []);

  // Badilisha placeholder
  useEffect(() => {
    if (placeholders.length <= 1) return;
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev === placeholders.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [placeholders]);

  // Tafuta suggestions
  useEffect(() => {
    const getCombinedSuggestions = async () => {
      if (!search || typeof search !== "string" || search.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const query = search.trim();
      try {
        const [catRes, prodRes] = await Promise.allSettled([
          api.get('/leaf-categories/', { params: { search: query, limit: 4 } }),
          api.get('/products/', { params: { search: query, limit: 4 } })
        ]);

        const categories = catRes.status === 'fulfilled' ? (catRes.value.data.results || catRes.value.data || []) : [];
        const products = prodRes.status === 'fulfilled' ? (prodRes.value.data.results || prodRes.value.data || []) : [];

        const combined = [
          ...products.map(item => ({ ...item, type: 'product' })),
          ...categories.map(item => ({ ...item, type: 'category' }))
        ];

        if (combined.length > 0) {
          setSuggestions(combined);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (err) {
        console.error("❌ Search Error:", err);
      }
    };

    const timeoutId = setTimeout(getCombinedSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (typeof setSearch === "function") setSearch(val);
  };

  const navigateToSearchResults = (query) => {
    if (!query || query.trim() === "") return;
    if (window.innerWidth > 1024) {
      window.open(`/search?q=${encodeURIComponent(query.trim())}`, '_blank');
    } else {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    setShowSuggestions(false);
    setIsFocused(false);
  };

  const handleSearchSubmit = () => {
    if (search.trim()) navigateToSearchResults(search);
  };

  return (
    <div className="relative w-full max-w-[800px] mx-auto flex-1 px-2 md:px-4 z-[1000]">
      
      {/* Search Bar Container */}
      <div 
        className={`flex items-center bg-white dark:bg-black border-2 rounded-full h-[36px] sm:h-[40px] md:h-[44px] pl-3 sm:pl-4 pr-1 transition-all duration-300 ${
          isFocused 
            ? 'border-brand-orange shadow-[0_0_0_4px_rgba(255,102,0,0.1)]' 
            : 'border-gray-300 dark:border-gray-600 hover:border-brand-orange'
        }`}
      >
        <input
          type="text"
          placeholder={placeholders[placeholderIndex]}
          className="flex-1 bg-transparent border-none outline-none text-[13px] sm:text-[14px] md:text-[15px] text-gray-800 dark:text-white placeholder:text-gray-400 w-full min-w-0"
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

        <button 
          className="bg-brand-orange hover:bg-brand-hover text-white h-[28px] sm:h-[32px] md:h-[36px] px-3 sm:px-4 md:px-5 rounded-full font-bold text-[12px] sm:text-[13px] md:text-[14px] flex items-center justify-center gap-1.5 shrink-0 transition-transform active:scale-95"
          onClick={handleSearchSubmit}
        >
          <Search size={16} className="sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px]" />
          <span className="hidden md:inline">Search</span>
        </button>
      </div>

{showSuggestions && suggestions.length > 0 && (
  <div className="absolute top-full left-0 right-0 mt-2 w-full bg-white dark:bg-[#1e293b] z-[9999] rounded-b-2xl shadow-xl border border-gray-200 dark:border-gray-700 border-t-0 overflow-hidden animate-smooth-dropdown">
    <div className="max-h-[380px] overflow-y-auto scrollbar-thin scrollbar-thumb-brand-orange scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
      {suggestions.map((item) => (
        <div 
          key={`${item.type}-${item.id}`} 
          className="flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-50 dark:border-gray-800 hover:bg-brand-light dark:hover:bg-gray-700 transition-colors"
          onMouseDown={() => {
            if (typeof setSearch === "function") setSearch(item.name);
            navigateToSearchResults(item.name);
          }}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-[14px] text-gray-700 dark:text-gray-200 truncate">{item.name}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

    </div>
  );
}