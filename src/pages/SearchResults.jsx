// src/components/SearchResults.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from "../axiosConfig"; // ✅ TUMIA API (Sio Supabase!)
import { Globe, ChevronRight, Filter } from 'lucide-react';

import SearchBar from '../components/SearchBar';
import UserTools from '../components/UserTools';
import "../SearchResults.css";

export default function SearchResults({ session }) {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  // State
  const [search, setSearch] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // 🔥 Kategoria za Sidebar
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  // 🔥 Filter States
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  
  const navigate = useNavigate();
  const lastProductRef = useRef();
  const PRODUCTS_PER_PAGE = 20;

  // ============================================
  // 1. PATA KATEGORIA ZA SIDEBAR (Filters)
  // ============================================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/leaf-categories/', { params: { limit: 50 } });
        const data = response.data.results || response.data || [];
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories for sidebar:", err);
      }
    };
    fetchCategories();
  }, []);

  // ============================================
  // 2. PATA BIDHAA (Search + Filters)
  // ============================================
  const fetchProducts = useCallback(async (pageNum = 1, reset = true) => {
    setLoading(reset ? true : false);
    if (pageNum === 1) setLoadingMore(false);
    else setLoadingMore(true);

    try {
      const params = {
        limit: PRODUCTS_PER_PAGE,
        offset: (pageNum - 1) * PRODUCTS_PER_PAGE,
        ordering: '-created_at'
      };

      // 1. Search Query
      if (initialQuery && initialQuery.trim()) {
        params.search = initialQuery.trim();
      }

      // 2. Category Filter
      if (selectedCategoryId) {
        params.leaf_category = selectedCategoryId;
      }

      // 3. Price Filters
      if (minPrice && !isNaN(minPrice)) {
        params.price__gte = minPrice;
      }
      if (maxPrice && !isNaN(maxPrice)) {
        params.price__lte = maxPrice;
      }

      const response = await api.get('/products/', { params });
      const data = response.data.results || response.data || [];
      const totalCount = response.data.count || data.length;

      if (reset) {
        setProducts(data);
      } else {
        setProducts(prev => [...prev, ...data]);
      }

      setHasMore(data.length === PRODUCTS_PER_PAGE);
      setPage(pageNum);

    } catch (err) {
      console.error("Search Error:", err);
      setProducts([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [initialQuery, selectedCategoryId, minPrice, maxPrice]);

  // ============================================
  // 3. EFFECT: Ita `fetchProducts` wakati filters zinabadilika
  // ============================================
  useEffect(() => {
    setProducts([]);
    setHasMore(true);
    setPage(1);
    fetchProducts(1, true);
  }, [initialQuery, selectedCategoryId, minPrice, maxPrice, fetchProducts]);

  // ============================================
  // 4. INFINITE SCROLL (Observer)
  // ============================================
  useEffect(() => {
    if (loading || loadingMore || !hasMore) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore) {
          fetchProducts(page + 1, false);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    
    if (lastProductRef.current) {
      observer.observe(lastProductRef.current);
    }
    
    return () => {
      if (lastProductRef.current) observer.unobserve(lastProductRef.current);
    };
  }, [loading, loadingMore, hasMore, fetchProducts, page]);

  // Update search state pindi URL inapobadilika
  useEffect(() => {
    setSearch(initialQuery);
  }, [initialQuery]);

  // ========== SKELETON LOADING ==========
  if (loading && products.length === 0) {
    return (
      <div className="alibaba-container skeleton">
        {/* Header skeleton tu... */}
        <header className="alibaba-header skeleton-header">
          <div className="header-wrapper">
            <div className="skeleton-logo"></div>
            <div className="skeleton-search"></div>
            <div className="skeleton-icons"></div>
          </div>
        </header>
        <div className="search-skeleton-layout">
          <div className="skeleton-sidebar"></div>
          <div className="skeleton-main-grid"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="alibaba-container">
      
      {/* HEADER */}
      <header className="alibaba-header">
        <div className="header-wrapper">
          <Link to="/" className="skyfall-logo">
            Skyfall<span>.com</span>
          </Link>
          
          <div className="main-search-area">
            <SearchBar search={search} setSearch={setSearch} />
          </div>

          <div className="header-right-actions">
            <div className="nav-action-item">
              <UserTools session={session} />
            </div>
          </div>
        </div>
      </header>

      {/* 🔥 MAIN LAYOUT: SIDEBAR + GRID */}
      <main className="search-main-layout">
        
        {/* ============================================
            LEFT SIDEBAR - FILTERS (Alibaba Style)
           ============================================ */}
        <aside className="search-filter-sidebar">
          <div className="filter-header">
            <Filter size={16} />
            <span>Filters</span>
          </div>

          {/* 1. Kategoria (Categories) */}
          <div className="filter-section">
            <h4 className="filter-section-title">Kategoria</h4>
            <ul className="filter-list">
              <li 
                className={`filter-item ${!selectedCategoryId ? 'active' : ''}`}
                onClick={() => setSelectedCategoryId(null)}
              >
                Zote
              </li>
              {categories.map((cat) => (
                <li 
                  key={cat.id}
                  className={`filter-item ${selectedCategoryId === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategoryId(cat.id)}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Bei (Price Range) */}
          <div className="filter-section">
            <h4 className="filter-section-title">Bei (TSh)</h4>
            <div className="price-filter-wrapper">
              <input 
                type="number" 
                placeholder="Min" 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="price-input"
              />
              <span className="price-sep">-</span>
              <input 
                type="number" 
                placeholder="Max" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="price-input"
              />
              <button className="price-ok-btn" onClick={() => fetchProducts(1, true)}>
                OK
              </button>
            </div>
          </div>

          {/* 3. Min Order (MOQ) - Optional, unaweza kuongeza hapa baadaye */}
          <div className="filter-section">
            <h4 className="filter-section-title">Min. Order</h4>
            <div className="moq-filter-wrapper">
              <input type="number" placeholder="Min pieces" className="price-input" />
              <button className="price-ok-btn">OK</button>
            </div>
          </div>
          
        </aside>

        {/* ============================================
            RIGHT SIDE - PRODUCTS CONTENT
           ============================================ */}
        <div className="search-products-content">
          
          {/* Results Info Bar */}
          <div className="results-info-bar">
            <div className="deep-search-label">
              <span className="sparkle">✦</span> 
              {products.length > 0 ? (
                <>Matokeo ya <strong>"{initialQuery}"</strong></>
              ) : (
                <>Samahani, hatukupata bidhaa kwa "{initialQuery}"</>
              )}
            </div>
            <div className="results-count">
              {products.length}+ products found
            </div>
          </div>

          {/* Products Grid - Fluid Flow */}
          <div className="search-products-grid">
            {products.length > 0 ? (
              products.map((product, index) => (
                <div 
                  key={product.id} 
                  className="alibaba-card"
                  ref={index === products.length - 1 ? lastProductRef : null}
                >
                  <Link to={`/product/${product.id}`} className="card-link">
                    <div className="card-image">
                      <img 
                        src={product.cover_image || '/placeholder-image.jpg'} 
                        alt={product.name}
                        onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                      />
                    </div>
                    <div className="card-body">
                      <h3 className="product-title">{product.name}</h3>
                      <div className="price-tag">
                        <span className="currency">TSH</span>
                        <span className="amount">{Number(product.price).toLocaleString()}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="not-found">
                <p>Samahani, hatukupata bidhaa zozote.</p>
                <button onClick={() => navigate('/')} className="browse-all-btn">
                  Rudi Kwenye Duka
                </button>
              </div>
            )}
          </div>
          
          {/* Loading more indicator */}
          {loadingMore && (
            <div className="loading-more">
              <div className="loader-small"></div>
              <span>Inapakia bidhaa zaidi...</span>
            </div>
          )}
          
          {/* End of results message */}
          {!hasMore && products.length > 0 && (
            <div className="end-of-results">
              <p>✨ Umeifikia mwisho wa matokeo ✨</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}