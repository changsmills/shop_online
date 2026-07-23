import { useRef, useState, useEffect } from "react";
import axios from "axios"; // ✅ Badilisha: Axios badala ya Supabase
import { useNavigate } from "react-router-dom";
import { createPortal } from 'react-dom'; 
import { useTranslation } from 'react-i18next';

const API_BASE_URL = "http://127.0.0.1:8000/api"; // ✅ Ongeza hii

export default function SearchBar({ search = "", setSearch }) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  
  const [placeholders, setPlaceholders] = useState(["Tafuta kategoria..."]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Responsive Screen detection
  const [screenSize, setScreenSize] = useState({
    isMobile: typeof window !== 'undefined' ? window.innerWidth <= 768 : false,
    isSmallMobile: typeof window !== 'undefined' ? window.innerWidth <= 480 : false,
    isDesktopLarge: typeof window !== 'undefined' ? window.innerWidth >= 1400 : false,
    isDarkMode: typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        isMobile: window.innerWidth <= 768,
        isSmallMobile: window.innerWidth <= 480,
        isDesktopLarge: window.innerWidth >= 1400,
        isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { isMobile, isSmallMobile, isDesktopLarge, isDarkMode } = screenSize;

  // =================================================================
  // CSS INJECTED (Pseudo-classes & Animations zilizobaki kwenye style tag)
  // =================================================================
  const injectedCss = `
    .search-portal-item { transition: background 0.2s ease; }
    .search-portal-item:hover { background: ${isDarkMode ? '#334155' : '#fff5ed'} !important; }
    .search-portal-item:active { background: #f1f5f9 !important; }

    .search-camera-btn { transition: background 0.2s !important; border: none !important; background: transparent !important; }
    .search-camera-btn:hover { background: ${isDarkMode ? '#334155' : '#f5f5f5'} !important; }

    .search-submit-btn { transition: background 0.2s !important; }
    .search-submit-btn:hover { background-color: #e55a00 !important; }

    .search-portal-scroll::-webkit-scrollbar { width: 4px !important; }
    .search-portal-scroll::-webkit-scrollbar-track { background: ${isDarkMode ? '#334155' : '#f1f1f1'} !important; border-radius: 10px !important; }
    .search-portal-scroll::-webkit-scrollbar-thumb { background: #ff6a00 !important; border-radius: 10px !important; }

    @keyframes dropdownFadeIn {
      from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `;

  // =================================================================
  // INLINE CSS RESPONSIVE OBJECTS (Layout, Fonts, Spacing)
  // =================================================================
  const styles = {
     wrapper: {
      position: 'relative',
      flex: 1,
      maxWidth: isDesktopLarge ? '1200px' : (isMobile ? '100%' : '800px'),
      margin: isMobile ? '0 4px' : '0 30px',
      zIndex: 1000,
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      background: isDarkMode ? '#1e293b' : '#fff',
      border: isFocused ? '2px solid #FF6600' : (isDarkMode ? '2px solid #334155' : '2px solid #ddd'),
      borderRadius: '50px',
      height: isMobile ? '36px' : '44px',
      padding: isMobile ? '2px 2px 2px 8px' : '2px 2px 2px 18px',
      position: 'relative',
      zIndex: 10,
    },
    input: {
      flex: 1,
      border: 'none',
      outline: 'none',
      fontSize: isMobile ? '13px' : '15px',
      background: 'transparent',
      width: '100%',
      color: isDarkMode ? '#e2e8f0' : '#333',
    },
    tools: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '6px' : '10px',
    },
    cameraBtn: {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      color: isDarkMode ? '#94a3b8' : '#666',
      padding: isMobile ? '4px' : '8px',
      borderRadius: '50%',
    },
    submitBtn: {
      backgroundColor: '#FF6600',
      color: 'white',
      border: 'none',
      height: isMobile ? '30px' : '36px',
      width: isMobile ? '30px' : 'auto',
      padding: isMobile ? '0' : '0 24px',
      borderRadius: isMobile ? '50%' : '40px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      cursor: 'pointer',
    },
    portal: {
      position: 'fixed',
      top: isMobile ? '95px' : '60px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: isMobile ? '96%' : '100%',
      maxWidth: isMobile ? '96%' : (isDesktopLarge ? '750px' : '650px'),
      background: isDarkMode ? '#1e293b' : 'white',
      zIndex: 9999999,
      borderRadius: '0 0 16px 16px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
      border: `1px solid ${isDarkMode ? '#334155' : '#e5e7eb'}`,
      borderTop: 'none',
      overflow: 'hidden',
      animation: 'dropdownFadeIn 0.2s ease',
    },
    scroll: {
      maxHeight: '380px',
      overflowY: 'auto',
      scrollbarWidth: 'thin',
      scrollbarColor: '#ff6a00 #f1f5f9',
    },
    header: {
      padding: isMobile ? '10px 14px' : '12px 16px',
      fontSize: isMobile ? '10px' : '11px',
      fontWeight: 700,
      color: isDarkMode ? '#94a3b8' : '#64748b',
      background: isDarkMode ? '#0f172a' : '#fafbfc',
      borderBottom: `1px solid ${isDarkMode ? '#334155' : '#f1f5f9'}`,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: isSmallMobile ? '12px 14px' : (isMobile ? '14px 16px' : '12px 16px'),
      cursor: 'pointer',
      borderBottom: `1px solid ${isDarkMode ? '#334155' : '#f8fafc'}`,
    },
    icon: {
      width: isSmallMobile ? '28px' : (isMobile ? '32px' : '28px'),
      height: isSmallMobile ? '28px' : (isMobile ? '32px' : '28px'),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isDarkMode ? '#334155' : '#f1f5f9',
      borderRadius: '8px',
      color: '#ff6a00',
      flexShrink: 0,
    },
    name: {
      fontSize: isSmallMobile ? '13px' : (isMobile ? '14px' : '14px'),
      color: isDarkMode ? '#e2e8f0' : '#334155',
      flex: 1,
    }
  };

  // ✅ BADILISHA: Fetch placeholders kutoka Django API
  useEffect(() => {
    const fetchLeafCategoryNames = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/leaf-categories/`, {
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

  // Rotate placeholder every 3 seconds
  useEffect(() => {
    if (placeholders.length <= 1) return;
    const timer = setInterval(() => {
      setPlaceholderIndex((prevIndex) => 
        prevIndex === placeholders.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(timer);
  }, [placeholders]);

  // ✅ BADILISHA: Fetch suggestions (categories + products) with debounce
  useEffect(() => {
    const getCombinedSuggestions = async () => {
      if (!search || typeof search !== "string" || search.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const query = search.trim();
      
      try {
        // Tumia endpoints za Django + SearchFilter (Lazima backend isaidie 'search' parameter)
        const [catRes, prodRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/leaf-categories/`, {
            params: { search: query, limit: 4 }
          }),
          axios.get(`${API_BASE_URL}/products/`, {
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
    } else {
      console.warn("setSearch is not a function.");
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
      <style>{injectedCss}</style>
      
      <div className="search-wrapper-main" style={styles.wrapper}>
        <div 
          className="search-bar-container" 
          style={styles.container}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <input
            type="text"
            placeholder={placeholders[placeholderIndex]}
            className="search-input"
            style={styles.input}
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

          <div className="search-tools" style={styles.tools}>
            {/* Kamera imebaki ikiwa imekatwa kama ilivyokuwa */}
            {/* <button className="search-camera-btn" style={styles.cameraBtn} onClick={handleImageSearch}>
              <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "16" : "22"} height={isMobile ? "16" : "22"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            </button> */}
            
            <button className="search-submit-btn" style={styles.submitBtn} onClick={handleSearchSubmit}>
              <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "14" : "20"} height={isMobile ? "14" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              {!isMobile && <span>Search</span>}
            </button>
          </div>

        </div>

        {showSuggestions && suggestions.length > 0 && createPortal(
          <div className="portal-layout" style={styles.portal}>
            <div className="suggestion-header" style={styles.header}>
              {search.trim().length > 0 ? "Matokeo yaliyopatikana" : "Mapendekezo"}
            </div>
            
            <div className="suggestion-scroll-area search-portal-scroll" style={styles.scroll}>
              {suggestions.map((item) => (
                <div 
                  key={`${item.type}-${item.id}`} 
                  className="suggestion-item search-portal-item"
                  style={styles.item}
                  onMouseDown={() => {
                    if (typeof setSearch === "function") setSearch(item.name);
                    navigateToSearchResults(item.name);
                  }}
                >
                  <div className="category-icon" style={styles.icon}>
                    {item.type === 'product' ? '📦' : '🔍'}
                  </div>
                  
                  <div className="suggestion-info">
                    <span className="suggestion-name" style={styles.name}>{item.name}</span>
                    <span className="suggestion-type-badge" style={{ fontSize: '10px', color: isDarkMode ? '#94a3b8' : '#64748b', marginLeft: '8px' }}>
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