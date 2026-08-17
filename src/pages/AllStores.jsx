// src/pages/AllStores.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import StoresHeader from '../components/StoresHeader'; // ✅ Tumia StoresHeader
import Footer from '../components/Footer';
import StoreCard from '../components/StoreCard';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../axiosConfig';
import '../AllStores.css';
import { Filter } from 'lucide-react';

export default function AllStores({ session }) {
  const { storeId } = useParams();
  const [stores, setStores] = useState([]);
  const [singleStore, setSingleStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCategory = location.state?.selectedCategory;
  const lastStoreRef = useRef();
  const STORES_PER_PAGE = 20;

  // ===== FILTER & SEARCH STATES =====
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  
  // Filter selections
  const [filterCategory, setFilterCategory] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterVerified, setFilterVerified] = useState("all"); // 'all', 'verified', 'unverified'

  // ============================================================
  // 1. PATA CATEGORIES NA CITIES (Kwa Filters)
  // ============================================================
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        // Pata Categories
        const catRes = await api.get('/categories/', { params: { limit: 50 } });
        const catData = catRes.data.results || catRes.data || [];
        setCategories(catData);

        // Pata Cities (Tunaweza kuzipata kutoka stores au tuziweke hardcode kwa sasa)
        const tzCities = [
          "Dar es Salaam", "Arusha", "Mwanza", "Zanzibar", "Dodoma", 
          "Tanga", "Mbeya", "Morogoro", "Tabora", "Kigoma"
        ];
        setCities(tzCities);
      } catch (err) {
        console.error("Error fetching filter data:", err);
      }
    };
    fetchFilterData();
  }, []);

  // ============================================================
  // 2. FETCH STORES (With Pagination & Filters)
  // ============================================================
  const fetchStores = useCallback(async (pageNum = 1, reset = true) => {
    if (storeId) return; // Usifanye fetch kama ni single store

    setLoading(reset ? true : false);
    if (pageNum === 1) setLoadingMore(false);
    else setLoadingMore(true);

    try {
      const params = {
        limit: STORES_PER_PAGE,
        offset: (pageNum - 1) * STORES_PER_PAGE,
        status: 'active',
        ordering: '-created_at'
      };

      // 1. Search
      if (searchQuery && searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      // 2. Category Filter
      if (filterCategory) {
        params.category_id = filterCategory;
      }

      // 3. City Filter
      if (filterCity) {
        params.city = filterCity;
      }

      // 4. Verified Filter
      if (filterVerified === 'verified') {
        params.is_verified = true;
      } else if (filterVerified === 'unverified') {
        params.is_verified = false;
      }

      const response = await api.get('/stores/', { params });
      const data = response.data.results || response.data || [];
      const totalCount = response.data.count || data.length;

      if (reset) {
        setStores(data);
      } else {
        setStores(prev => [...prev, ...data]);
      }

      setHasMore(data.length === STORES_PER_PAGE);
      setPage(pageNum);

    } catch (err) {
      console.error("Error fetching stores:", err.message);
      setStores([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [storeId, searchQuery, filterCategory, filterCity, filterVerified]);

  // ============================================================
  // 3. TRIGGER FETCH
  // ============================================================
  useEffect(() => {
    if (storeId) return; // Ikiwa ni single store, usifanye hizi
    setStores([]);
    setHasMore(true);
    setPage(1);
    fetchStores(1, true);
  }, [searchQuery, filterCategory, filterCity, filterVerified, fetchStores]);

  // ============================================================
  // 4. INFINITE SCROLL
  // ============================================================
  useEffect(() => {
    if (loading || loadingMore || !hasMore || storeId) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore) {
          fetchStores(page + 1, false);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    
    if (lastStoreRef.current) {
      observer.observe(lastStoreRef.current);
    }
    
    return () => {
      if (lastStoreRef.current) observer.unobserve(lastStoreRef.current);
    };
  }, [loading, loadingMore, hasMore, fetchStores, page, storeId]);

  // ============================================================
  // 5. SINGLE STORE LOGIC (Ikiwa URL ina storeId)
  // ============================================================
  useEffect(() => {
    const fetchSingleStore = async () => {
      if (!storeId) return;
      setLoading(true);
      try {
        const cachedStore = sessionStorage.getItem('selectedStore');
        if (cachedStore) {
          const parsedStore = JSON.parse(cachedStore);
          if (String(parsedStore.id) === String(storeId)) {
            setSingleStore(parsedStore);
            setLoading(false);
            return;
          }
        }
        const response = await api.get(`/stores/${storeId}/`);
        setSingleStore(response.data);
      } catch (error) {
        console.error("Error fetching single store:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSingleStore();
  }, [storeId]);

  // ============================================================
  // RENDER: SINGLE STORE
  // ============================================================
   if (singleStore) {
    return (
      <div className="all-stores-page">
        <StoresHeader showBack={true} onSearch={setSearchQuery} />
        <div className="all-stores-container">
          <div className="all-stores-header">
            <h1 className="all-stores-title">{singleStore.store_name}</h1>
            <p className="all-stores-subtitle">
              {singleStore.business_type} • {singleStore.city || 'Tanzania'}
            </p>
          </div>
          <div className="store-card-single-container">
            <StoreCard
              key={singleStore.id}
              store={singleStore}
              onClick={() => navigate(`/store/${singleStore.id}`)}
            />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ============================================================
  // LOADING SKELETON
  // ============================================================
  if (loading && stores.length === 0) {
    return (
      <div className="all-stores-page">
        <StoresHeader showBack={true} onSearch={setSearchQuery} />
        <div className="all-stores-loading-wrapper">
          <div className="all-stores-skeleton-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="all-stores-skeleton-card">
                <div className="all-stores-skeleton-image"></div>
                <div className="all-stores-skeleton-text"></div>
                <div className="all-stores-skeleton-text short"></div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ============================================================
  // RENDER: MAIN PAGE (WITH SIDEBAR & SEARCH)
  // ============================================================
  return (
    <div className="all-stores-page search-results-style">
      {/* ✅ Sasa tumia StoresHeader pekee. Search iko ndani yake! */}
      <StoresHeader showBack={true} onSearch={setSearchQuery} />
      
      <div className="all-stores-layout-container">
        
        {/* SIDEBAR */}
        <aside className="search-filter-sidebar store-filter-sidebar">
          <div className="filter-header">
            <Filter size={16} />
            <span>Filters</span>
          </div>

          <div className="filter-section">
            <h4 className="filter-section-title">Category</h4>
            <ul className="filter-list">
              <li 
                className={`filter-item ${!filterCategory ? 'active' : ''}`}
                onClick={() => setFilterCategory("")}
              >
                All Categories
              </li>
              {categories.map((cat) => (
                <li 
                  key={cat.id}
                  className={`filter-item ${filterCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setFilterCategory(cat.id)}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-section">
            <h4 className="filter-section-title">Location (City)</h4>
            <ul className="filter-list">
              <li 
                className={`filter-item ${!filterCity ? 'active' : ''}`}
                onClick={() => setFilterCity("")}
              >
                All Cities
              </li>
              {cities.map((city) => (
                <li 
                  key={city}
                  className={`filter-item ${filterCity === city ? 'active' : ''}`}
                  onClick={() => setFilterCity(city)}
                >
                  {city}
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-section">
            <h4 className="filter-section-title">Verification</h4>
            <div className="radio-group">
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="verified" 
                  value="all"
                  checked={filterVerified === 'all'}
                  onChange={() => setFilterVerified('all')}
                />
                All Suppliers
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="verified" 
                  value="verified"
                  checked={filterVerified === 'verified'}
                  onChange={() => setFilterVerified('verified')}
                />
                Verified Only
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="verified" 
                  value="unverified"
                  checked={filterVerified === 'unverified'}
                  onChange={() => setFilterVerified('unverified')}
                />
                Unverified
              </label>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT (STORE GRID) */}
        <div className="all-stores-main-content">
          
          <div className="all-stores-info-bar">
            <div className="all-stores-count">
              {stores.length} Stores Loaded
            </div>
          </div>

          <div className="all-stores-grid">
            {stores.length > 0 ? (
              stores.map((store, index) => (
                <div 
                  key={store.id} 
                  ref={index === stores.length - 1 ? lastStoreRef : null}
                >
                  <StoreCard
                    store={store}
                    onClick={() => navigate(`/store/${store.id}`)}
                  />
                </div>
              ))
            ) : (
              <div className="all-stores-empty">
                <p>No stores found matching your criteria.</p>
                <button onClick={() => {
                  setSearchQuery("");
                  setFilterCategory("");
                  setFilterCity("");
                  setFilterVerified("all");
                }} className="reset-filters-btn">
                  Reset Filters
                </button>
              </div>
            )}
          </div>
          
          {loadingMore && (
            <div className="loading-more">
              <div className="loader-small"></div>
              <span>Loading more stores...</span>
            </div>
          )}
          
          {!hasMore && stores.length > 0 && (
            <div className="end-of-results">
              <p>✨ You have reached the end of the list ✨</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}