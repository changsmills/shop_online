import { useRef, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../SearchBar.css"; 
import { createPortal } from 'react-dom'; 
import { useTranslation } from 'react-i18next';

export default function SearchBar({ search = "", setSearch }) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [placeholders, setPlaceholders] = useState(["Tafuta kategoria..."]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 1. Fetch Placeholders
  useEffect(() => {
    const fetchLeafCategoryNames = async () => {
      try {
        const { data, error } = await supabase.from('leaf_categories').select('name').limit(15);
        if (data && !error) {
          const names = data.map(item => item.name);
          if (names.length > 0) setPlaceholders(names);
        }
      } catch (err) {
        console.error("Initial fetch error:", err);
      }
    };
    fetchLeafCategoryNames();
  }, []);

  // 1.5 Logic ya kubadilisha placeholder kila baada ya sekunde 3
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
      // 1. Ulinzi wa awali
      if (!search || typeof search !== "string" || search.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const query = search.trim();
      
      try {
        // 2. Tunafanya queries mbili kwa wakati mmoja (Parallel Fetching)
        const [catData, prodData] = await Promise.all([
          supabase.from("leaf_categories").select("id, name").ilike("name", `%${query}%`).limit(4),
          supabase.from("products_engines").select("id, name").ilike("name", `%${query}%`).limit(4)
        ]);

        // 3. Kuchanganya matokeo (Combined Array)
        const combined = [
          ...(catData.data || []).map(item => ({ ...item, type: 'category' })),
          ...(prodData.data || []).map(item => ({ ...item, type: 'product' }))
        ];

        // 4. Sasisha state
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

    // 5. Debounce ili kupunguza mizigo kwenye database kila mtumiaji anapochapa
    const timeoutId = setTimeout(getCombinedSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  // Handle input change safely
  const handleInputChange = (e) => {
    const val = e.target.value;
    if (typeof setSearch === "function") {
      setSearch(val);
    } else {
      console.warn("setSearch is not a function. Check your props.");
    }
  };

  return (
    <div className="search-wrapper-main">
      <div className="search-bar-container">
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
        />

        <div className="search-tools">
          <button type="button" onClick={() => fileInputRef.current.click()} className="camera-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
          </button>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" />
          
          <button className="search-submit-btn" onClick={() => navigate(`/search?q=${search}`)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span>Search</span>
          </button>
        </div>
      </div>

{showSuggestions && suggestions.length > 0 && createPortal(
  <div 
    className="suggestions-dropdown portal-layout"
    style={{
      position: 'fixed',
      top: '80px',
      left: 'auto',
      right: 'auto',
      width: '400px',
      maxWidth: 'calc(100vw - 40px)',
      zIndex: 9999
    }}
  >
    <div className="suggestion-header">
      {search.trim().length > 0 ? "Matokeo yaliyopatikana" : "Mapendekezo"}
    </div>
    
    <div className="suggestion-scroll-area">
      {suggestions.map((item) => (
        <div 
          // Tunatumia type + id kuhakikisha key ni unique
          key={`${item.type}-${item.id}`} 
          className="suggestion-item"
          onMouseDown={() => {
            if (typeof setSearch === "function") setSearch(item.name);
            
            // Logic ya navigation
            if (item.type === 'product') {
              navigate(`/product/${item.id}`);
            } else {
              navigate(`/search?q=${item.name}`);
            }
            setShowSuggestions(false);
          }}
        >
          <div className="category-icon">
            {/* Tunabadilisha icon kulingana na kama ni bidhaa au kategoria */}
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
  );
}