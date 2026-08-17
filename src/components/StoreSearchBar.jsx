// src/components/StoreSearchBar.jsx
import { useRef, useState, useEffect } from "react";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import "../SearchBar.css";

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

      {/* Portal for Store Suggestions */}
      {showSuggestions && suggestions.length > 0 && createPortal(
        <div className="search-portal">
          <div className="suggestion-header">
            {search.trim().length > 0 ? `Maduka kwa "${search.trim()}"` : "Maduka Yanayopendekezwa"}
          </div>
          
          <div className="suggestion-scroll-area">
            {suggestions.map((store) => (
              <div 
                key={`store-${store.id}`} 
                className="suggestion-item"
                onMouseDown={() => handleStoreClick(store.id)}
              >
                <div className="category-icon">
                  🏪
                </div>
                
                <div className="suggestion-info">
                  <span className="suggestion-name">{store.store_name}</span>
                  <span className="suggestion-type-badge">
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