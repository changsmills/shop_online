import { useRef, useState, useEffect } from "react";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Search } from "lucide-react";
import { useQuery } from '@tanstack/react-query';

// ==========================================
// 2. FUNCTIONS ZA KUCHUKUA DATA
// ==========================================
const fetchPlaceholders = async () => {
  try {
    // Tunavuta bidhaa 15 kutoka kwenye API yako ya products
    const response = await api.get('/products/', { params: { limit: 15 } });
    const data = response.data.results || response.data || [];
    
    if (Array.isArray(data) && data.length > 0) {
      // 🔥 HAPA NDIO MABADILIKO YALIYO:
      const productNames = data.map(item => {
        if (!item.name) return null;
        // Tunachukua herufi ya kwanza tuibadilishe kuwa kubwa, kisha tuunganishe na salio la jina
        return item.name.charAt(0).toUpperCase() + item.name.slice(1);
      }).filter(Boolean); // filter(Boolean) inasaidia kuondoa hizo null kama jina halipo

      if (productNames.length > 0) {
        return productNames;
      }
    }
    
    // Kama API haikurudisha kitu, tunaweka hizi za kawaida
    return ["Tafuta bidhaa...", "Search electronics...", "Search fashion..."]; 
  } catch (error) {
    console.error("Error fetching product placeholders:", error);
    return ["Tafuta bidhaa...", "Search electronics...", "Search fashion..."]; // Fallback
  }
};

const fetchSuggestions = async ({ queryKey }) => {
  const [_, query] = queryKey;
  if (!query || query.trim().length < 2) return [];

  const cleanQuery = query.trim();

  // ==========================================
  // 🔥 1. KAMA LINAANZA NA @, TAFUTA MADUKA
  // ==========================================
  if (cleanQuery.startsWith('@')) {
    const storeName = cleanQuery.substring(1).trim(); // Ondoa @
    
    // Kama hana jina la duka baada ya @, usifanye kitu
    if (!storeName) return [];

    try {
      const res = await api.get('/stores/', { params: { search: storeName, limit: 5 } });
      const stores = res.data.results || res.data || [];
      
      // Tunahakikisha tunavuta store_name kwa usahihi
      return stores.map(item => ({ 
        ...item, 
        type: 'store',
        name: item.store_name || item.name || "Duka" 
      }));
    } catch (error) {
      console.error("Error fetching stores:", error);
      return [];
    }
  } 
  
  // ==========================================
  // 🔥 2. KAMA HAKUNA @, TAFUTA BIDHAA (Kama kawaida)
  // ==========================================
  else {
    const [catRes, prodRes] = await Promise.allSettled([
      api.get('/leaf-categories/', { params: { search: cleanQuery, limit: 4 } }),
      api.get('/products/', { params: { search: cleanQuery, limit: 4 } })
    ]);

    const categories = catRes.status === 'fulfilled' ? (catRes.value.data.results || catRes.value.data || []) : [];
    const products = prodRes.status === 'fulfilled' ? (prodRes.value.data.results || prodRes.value.data || []) : [];

    return [
      ...products.map(item => ({ ...item, type: 'product' })),
      ...categories.map(item => ({ ...item, type: 'category' }))
    ];
  }
};

// ==========================================
// 3. COMPONENT
// ==========================================
export default function SearchBar({ search = "", setSearch }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Debounce state kwa ajili ya utafutaji
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // ==========================================
  // 4. QUERIES
  // ==========================================
  
  // Query ya Placeholders (Inafetch mara moja tu)
  const { data: placeholders = ["Search"] } = useQuery({
    queryKey: ['searchPlaceholders'],
    queryFn: fetchPlaceholders,
    staleTime: Infinity, 
  });

  // Query ya Suggestions (Inategemea na debouncedSearch)
  const { data: suggestions = [] } = useQuery({
    queryKey: ['searchSuggestions', debouncedSearch],
    queryFn: fetchSuggestions,
    enabled: debouncedSearch.trim().length >= 2, 
    staleTime: 1000 * 60 * 5, 
  });

  // ==========================================
  // 5. EFFECTS
  // ==========================================

  // Animation ya Placeholders
  useEffect(() => {
    if (placeholders.length <= 1) return;
    
    const timer = setInterval(() => {
      setIsAnimating(true); 
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev === placeholders.length - 1 ? 0 : prev + 1));
        setIsAnimating(false); 
      }, 300); 
    }, 3000);
    
    return () => clearInterval(timer);
  }, [placeholders]);

  // Debounce Logic kwa ajili ya Search (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Onyesha suggestions pale data inapokuja
  useEffect(() => {
    if (debouncedSearch.trim().length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [suggestions, debouncedSearch]);

  // ==========================================
  // 6. HANDLERS
  // ==========================================
  const handleInputChange = (e) => {
    const val = e.target.value;
    if (typeof setSearch === "function") setSearch(val);
  };

  const navigateToSearchResults = (query) => {
    if (!query || query.trim() === "") return;
    const cleanQuery = query.trim();

    // 🔥 KAMA LINAANZA NA @, NENDA KWENYE DUKA
    if (cleanQuery.startsWith('@')) {
      const storeNameOrId = cleanQuery.substring(1); 
      if (storeNameOrId) {
        navigate(`/store/${storeNameOrId}`);
      }
    } 
    // KAMA HAKUNA @, NENDA KWENYE UTAFUTAJI WA BIDHAA
    else {
      if (window.innerWidth > 1024) {
        window.open(`/search?q=${encodeURIComponent(cleanQuery)}`, '_blank');
      } else {
        navigate(`/search?q=${encodeURIComponent(cleanQuery)}`);
      }
    }
    
    setShowSuggestions(false);
    setIsFocused(false);
  };

  const handleSearchSubmit = () => {
    if (search.trim()) navigateToSearchResults(search);
  };

  // ==========================================
  // 7. RENDER (UI)
  // ==========================================
  return (
    <div className="relative w-full max-w-[800px] mx-auto flex-1 px-2 md:px-4 z-[1000] font-sans">
      
      {/* Search Bar Container */}
      <div 
        className={`flex items-center bg-white dark:bg-black border-2 rounded-full h-[36px] sm:h-[40px] md:h-[44px] pl-3 sm:pl-4 pr-1 transition-all duration-300 relative ${
          isFocused 
            ? 'border-brand-orange shadow-[0_0_0_4px_rgba(255,102,0,0.1)]' 
            : 'border-gray-300 dark:border-gray-600 hover:border-brand-orange'
        }`}
      >
        
      {/* 🔥 PLACEHOLDER YA ANIMATION */}
      {!search && (
        <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center overflow-hidden h-[24px] w-[calc(100%-80px)] sm:w-[calc(100%-100px)]">
          <span 
            key={placeholderIndex} 
            className={`text-[13px] sm:text-[14px] md:text-[15px] text-gray-400 transition-all duration-300 ease-in-out block truncate w-full ${
              isAnimating 
                ? 'translate-y-[-100%] opacity-0' 
                : 'translate-y-0 opacity-100 animate-[slideDown_0.3s_ease-out]'
            }`}
            title={placeholders[placeholderIndex]} 
          >
            {placeholders[placeholderIndex] || "Tafuta bidhaa au andika @kutafuta duka..."}
          </span>
        </div>
      )}

        {/* 🔥 INPUT */}
        <input
          type="text"
          className="flex-1 bg-transparent border-none outline-none text-[13px] sm:text-[14px] md:text-[15px] text-gray-800 dark:text-white w-full min-w-0 relative z-10"
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

        {/* 🔥 BUTTON */}
        <button 
          className="bg-brand-orange hover:bg-brand-hover text-white h-[28px] sm:h-[32px] md:h-[36px] px-3 sm:px-4 md:px-5 rounded-full font-bold text-[12px] sm:text-[13px] md:text-[14px] flex items-center justify-center gap-1.5 shrink-0 transition-transform active:scale-95"
          onClick={handleSearchSubmit}
        >
          <Search size={16} className="sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px]" />
          <span className="hidden md:inline">Search</span>
        </button>
      </div>

      {/* 🔥 SUGGESTIONS DROPDOWN */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 w-full bg-white dark:bg-[#1e293b] z-[9999] rounded-b-2xl shadow-xl border border-gray-200 dark:border-gray-700 border-t-0 overflow-hidden animate-smooth-dropdown">
          <div className="max-h-[380px] overflow-y-auto scrollbar-thin scrollbar-thumb-brand-orange scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
            {suggestions.map((item) => (
              <div 
                key={`${item.type}-${item.id}`} 
                className="flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-50 dark:border-gray-800 hover:bg-brand-light dark:hover:bg-gray-700 transition-colors"
                onMouseDown={() => {
                  // 🔥 KAMA NI DUKA, MPELeke KWENYE UKURASA WA DUKA
                  if (item.type === 'store') {
                    navigate(`/store/${item.id || item.name}`); 
                  } else {
                    // Kama ni bidhaa, tumia hii ya kawaida
                    if (typeof setSearch === "function") setSearch(item.name);
                    navigateToSearchResults(item.name);
                  }
                  setShowSuggestions(false);
                }}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {/* 🔥 ONGEZA ALAMA YA DUKA KAMA NI STORE */}
                  <span className="text-[14px] text-gray-700 dark:text-gray-200 truncate">
                    {item.type === 'store' ? `🏪 ${item.name}` : item.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}