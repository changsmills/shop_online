// src/components/SearchDialog.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../SearchDialog.css';
import api from "../axiosConfig"; // 🔥 ONGEZA HII

export default function SearchDialog({ isOpen, onClose, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      
      setLoading(true);
      try {
        const response = await api.get('/products/', {
          params: { search: searchQuery, limit: 5 }
        });
        const data = response.data.results || response.data || [];
        setSuggestions(data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      onClose();
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSuggestionClick = (product) => {
    onClose();
    navigate(`/product/${product.id}`);
  };

  if (!isOpen) return null;

  return (
    <div className="search-dialog-overlay" onClick={onClose}>
      <div className="search-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="search-dialog-header">
          <button className="search-dialog-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form className="search-dialog-form" onSubmit={handleSearch}>
          <div className="search-dialog-input-wrapper">
            <Search className="search-dialog-icon" size={20} />
            <input
              ref={inputRef}
              type="text"
              className="search-dialog-input"
              placeholder="Tafuta bidhaa, kategoria, au chapa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                type="button" 
                className="search-dialog-clear"
                onClick={() => setSearchQuery('')}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button type="submit" className="search-dialog-submit">
            Search
          </button>
        </form>

        {suggestions.length > 0 && (
          <div className="search-dialog-suggestions">
            <div className="search-dialog-suggestions-header">
              <span>Results</span>
            </div>
            {suggestions.map((item) => (
              <div 
                key={item.id}
                className="search-dialog-suggestion-item"
                onClick={() => handleSuggestionClick(item)}
              >
                
                <div className="search-dialog-suggestion-info">
                  <span className="search-dialog-suggestion-name">{item.name}</span>
                
                </div>
              </div>
            ))}
          </div>
        )}

        {searchQuery.trim().length >= 2 && suggestions.length === 0 && !loading && (
          <div className="search-dialog-no-results">
            <p>Hakuna bidhaa zilizopatikana kwa "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}