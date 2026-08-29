import { useRef, useState, useEffect } from "react";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import "../SearchBar.css";

export default function SearchBar({ search = "", setSearch }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [placeholders, setPlaceholders] = useState(["Search"])
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // ✅ 1. PAKIA PLACEHOLDERS (Tunaangalia data ya kwanza)
  useEffect(() => {
    const fetchLeafCategoryNames = async () => {
      try {
        console.log("🔍 [DEBUG 1] Inapakia Leaf Categories kwa placeholders...");
        const response = await api.get('/leaf-categories/', { params: { limit: 15 } });
        
        console.log("✅ [DEBUG 1] Response imefika! Full response:", response);

        // Tumia 'results' ikiwa ipo, vinginevyo tumia 'data'
        const data = response.data.results || response.data || [];
        console.log("✅ [DEBUG 1] Data iliyopatikana:", data);

        if (Array.isArray(data)) {
          console.log(`✅ [DEBUG 1] Data ni array. Idadi ya items: ${data.length}`);
          const names = data.map(item => item.name);
          console.log("✅ [DEBUG 1] Majina yaliyopatikana:", names);
          if (names.length > 0) setPlaceholders(names);
        } else {
          console.warn("⚠️ [DEBUG 1] Data HAIPO kama array! Tazama hapa:", data);
        }
      } catch (err) {
        console.error("❌ [DEBUG 1] Error wakati wa fetch:", err);
        console.error("❌ [DEBUG 1] Error details:", err.response || err.message);
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

  // ✅ 2. SEARCH EFFECT (Hapa ndio muhimu zaidi!)
  useEffect(() => {
    const getCombinedSuggestions = async () => {
      if (!search || typeof search !== "string" || search.trim().length < 2) {
        console.log("ℹ️ [DEBUG 2] Search ni fupi sana au tupu. Inafuta suggestions.");
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const query = search.trim();
      console.log(`🔍 [DEBUG 2] Mtumiaji amechapa: "${query}"`);

      try {
        console.log("⏳ [DEBUG 2] Inatuma requests kwa API...");
        const [catRes, prodRes] = await Promise.allSettled([
          api.get('/leaf-categories/', { params: { search: query, limit: 4 } }),
          api.get('/products/', { params: { search: query, limit: 4 } })
        ]);

        // ✅ Angalia kama Categories API imefanikiwa
        if (catRes.status === 'fulfilled') {
          console.log("✅ [DEBUG 2] Categories API imefanikiwa!");
          const catData = catRes.value.data.results || catRes.value.data || [];
          console.log("  📦 Data za Categories:", catData);
        } else {
          console.error("❌ [DEBUG 2] Categories API imeshindwa:", catRes.reason);
        }

        // ✅ Angalia kama Products API imefanikiwa
        if (prodRes.status === 'fulfilled') {
          console.log("✅ [DEBUG 2] Products API imefanikiwa!");
          const prodData = prodRes.value.data.results || prodRes.value.data || [];
          console.log("  📦 Data za Products:", prodData);
        } else {
          console.error("❌ [DEBUG 2] Products API imeshindwa:", prodRes.reason);
        }

        // Changanya data
        const categories = catRes.status === 'fulfilled' ? (catRes.value.data.results || catRes.value.data || []) : [];
        const products = prodRes.status === 'fulfilled' ? (prodRes.value.data.results || prodRes.value.data || []) : [];

        const combined = [
          ...products.map(item => ({ ...item, type: 'product' })),
          ...categories.map(item => ({ ...item, type: 'category' }))
        ];

        console.log(`✅ [DEBUG 2] Combined data (Jumla: ${combined.length}):`, combined);

        if (combined.length > 0) {
          console.log("✅ [DEBUG 2] Data ipo! Inaweka suggestions na kufungua portal.");
          setSuggestions(combined);
          setShowSuggestions(true);
        } else {
          console.log("⚠️ [DEBUG 2] Data imerudi tupu! (Hakuna categories au products).");
          setSuggestions([]);
          setShowSuggestions(false);
        }

      } catch (err) {
        console.error("❌ [DEBUG 2] Search Error:", err);
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
    <div className="search-wrapper-main">
      <div className={`search-bar-container ${isFocused ? 'focused' : ''}`}>
        <input
          type="text"
          placeholder={placeholders[placeholderIndex]}
          className="search-input"
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

        <div className="search-tools">
          <button className="search-submit-btn" onClick={handleSearchSubmit}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span className="search-btn-text">Search</span>
          </button>
        </div>
      </div>

     {/* Portal - Inaonyesha majina tu! */}
{showSuggestions && suggestions.length > 0 && createPortal(
  <div className="search-portal">
    <div className="suggestion-scroll-area">
      {suggestions.map((item) => (
        <div 
          key={`${item.type}-${item.id}`} 
          className="suggestion-item"
          onMouseDown={() => {
            if (typeof setSearch === "function") setSearch(item.name);
            navigateToSearchResults(item.name);
          }}
        >
          <div className="suggestion-info">
            <span className="suggestion-name">{item.name}</span>
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