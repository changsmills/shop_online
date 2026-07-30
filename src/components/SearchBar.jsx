import { useRef, useState, useEffect } from "react";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import "../SearchBar.css"; // ✅ CSS IMEHAMISHIWA HAPA

export default function SearchBar({ search = "", setSearch }) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  
  const [placeholders, setPlaceholders] = useState(["Tafuta kategoria..."]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const fetchLeafCategoryNames = async () => {
      try {
        const response = await api.get('/leaf-categories/', {
          params: { limit: 15 }
        });
        if (response.data) {
          const names = response.data.map(item => item.name);
          if (names.length > 0) setPlaceholders(names);
        }
      } catch (err) {
        console.error("Initial fetch error:", err);
      }
    };
    fetchLeafCategoryNames();
  }, []);

  useEffect(() => {
    if (placeholders.length <= 1) return;
    const timer = setInterval(() => {
      setPlaceholderIndex((prevIndex) => 
        prevIndex === placeholders.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(timer);
  }, [placeholders]);

  useEffect(() => {
    const getCombinedSuggestions = async () => {
      if (!search || typeof search !== "string" || search.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const query = search.trim();
      
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/leaf-categories/', {
            params: { search: query, limit: 4 }
          }),
          api.get('/products/', {
            params: { search: query, limit: 4 }
          })
        ]);

        const combined = [
          ...(catRes.data || []).map(item => ({ ...item, type: 'category' })),
          ...(prodRes.data || []).map(item => ({ ...item, type: 'product' }))
        ];

        if (combined.length > 0) {
          setSuggestions(combined);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }

      } catch (err) {
        console.error("Search Error:", err);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(getCombinedSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (typeof setSearch === "function") {
      setSearch(val);
    }
  };

  const navigateToSearchResults = (query) => {
    if (!query || query.trim() === "") return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setShowSuggestions(false);
  };

  const handleSearchSubmit = () => {
    if (search.trim()) {
      navigateToSearchResults(search);
    }
  };

  return (
    <>
      <div className="search-wrapper-main">
        <div 
          className={`search-bar-container ${isFocused ? 'focused' : ''}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <input
            type="text"
            placeholder={placeholders[placeholderIndex]}
            className="search-input"
            value={search}
            onChange={handleInputChange}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit();
              }
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

        {showSuggestions && suggestions.length > 0 && createPortal(
          <div className="search-portal">
            <div className="suggestion-header">
              {search.trim().length > 0 ? "Matokeo yaliyopatikana" : "Mapendekezo"}
            </div>
            
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
                  <div className="category-icon">
                    {item.type === 'product' ? '📦' : '🔍'}
                  </div>
                  
                  <div className="suggestion-info">
                    <span className="suggestion-name">{item.name}</span>
                    <span className="suggestion-type-badge">
                      {item.type === 'product' ? 'Bidhaa' : 'Kategoria'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>,
          document.body
        )}
      </div>
    </>
  );
}