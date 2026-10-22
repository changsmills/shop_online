// src/components/SearchDialog.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from "../axiosConfig";

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
    <div
      className="fixed inset-0 bg-black/60 z-[99999] flex items-start justify-center pt-5 sm:pt-10 md:pt-20 animate-[fadeIn_0.2s_ease]"
      onClick={onClose}
    >
      <div
        className="bg-white w-[98%] sm:w-[95%] md:w-[90%] max-w-[600px] max-h-[85vh] sm:max-h-[85vh] md:max-h-[80vh] rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-[slideDown_0.3s_ease] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===== HEADER ===== */}
        <div className="flex justify-end px-4 py-3 border-b border-gray-100">
          <button
            className="bg-transparent border-none cursor-pointer text-gray-500 p-1 rounded-full transition-all duration-200 hover:bg-gray-100 hover:text-gray-800"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        {/* ===== FORM ===== */}
        <form
          className="flex flex-col sm:flex-row gap-2 sm:gap-2 md:gap-3 px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4 border-b border-gray-100"
          onSubmit={handleSearch}
        >
          <div className="flex-1 flex items-center bg-gray-100 rounded-xl px-3.5 transition-all duration-200 border-2 border-transparent focus-within:border-orange-500 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(255,106,0,0.1)]">
            <Search className="text-gray-400 flex-shrink-0" size={20} />
            <input
              ref={inputRef}
              type="text"
              className="flex-1 border-none outline-none px-2 sm:px-2.5 md:px-3 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-[15px] md:text-base bg-transparent text-gray-800 placeholder:text-gray-400"
              placeholder="Tafuta bidhaa, kategoria, au chapa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="bg-transparent border-none cursor-pointer text-gray-400 p-1 rounded-full flex items-center justify-center hover:bg-gray-200 hover:text-gray-800 transition-colors"
                onClick={() => setSearchQuery('')}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white border-none px-5 sm:px-6 md:px-7 py-3 sm:py-3.5 md:py-3.5 rounded-xl font-semibold text-sm sm:text-[15px] cursor-pointer transition-all duration-200 whitespace-nowrap hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(255,106,0,0.3)] active:scale-[0.96]"
          >
            Search
          </button>
        </form>

        {/* ===== SUGGESTIONS ===== */}
        {suggestions.length > 0 && (
          <div className="flex-1 overflow-y-auto py-2">
            <div className="px-4 sm:px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Results
            </div>
            {suggestions.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3.5 px-4 sm:px-5 py-2.5 sm:py-3 cursor-pointer transition-colors duration-200 hover:bg-gray-50"
                onClick={() => handleSuggestionClick(item)}
              >
                <div className="flex-1 min-w-0">
                  <span className="block text-[13px] sm:text-sm font-medium text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== NO RESULTS ===== */}
        {searchQuery.trim().length >= 2 && suggestions.length === 0 && !loading && (
          <div className="py-10 px-5 text-center text-gray-400">
            <p className="m-0 text-sm sm:text-[15px]">
              Hakuna bidhaa zilizopatikana kwa "{searchQuery}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}