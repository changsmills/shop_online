import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import api from "../axiosConfig"; // 🔥 MUHIMU: Tumia api pekee!
import ProductCard from "../components/ProductCard";

export default function ProductList({ 
  storeId = null,
  search, 
  category = "All", 
  categoryId = null,
  section = "",      
  priorityId = null, 
  sortBy = "created_at", 
  order = "desc",
  minPrice = 0, 
  maxPrice = Infinity, 
  limit = null,
  filterType = null,
  isMobile = false,
  onLoad 
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 30;
  
  const abortControllerRef = useRef(null);
  const mountedRef = useRef(true);
  const fetchingRef = useRef(false);
  const initialFetchDoneRef = useRef(false);
  const hasMoreRef = useRef(true);
  
  const currentParamsRef = useRef({
    search, categoryId, section, sortBy, order, minPrice, maxPrice, filterType
  });

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchProducts = useCallback(async (pageNum, isNewSearch = false) => {
    if (fetchingRef.current && !isNewSearch) return;
    if (!mountedRef.current) return;
    if (!hasMoreRef.current && !isNewSearch && pageNum > 0) return;

    fetchingRef.current = true;
    setError(null);
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    setLoading(true);

    try {
      // 🔥 MABADILIKO: ONDOA FILTER KABISA! Sasa params ni tupu.
      const params = {};

      const currentCategoryId = currentParamsRef.current.categoryId;
      const currentSearch = currentParamsRef.current.search;
      const currentSection = currentParamsRef.current.section;
      const currentSortBy = currentParamsRef.current.sortBy;
      const currentOrder = currentParamsRef.current.order;
      const currentMinPrice = currentParamsRef.current.minPrice;
      const currentMaxPrice = currentParamsRef.current.maxPrice;
      const currentFilterType = currentParamsRef.current.filterType;

      // 1. Filtering kwa Store na Category
      if (storeId) {
        params.store_id = storeId;
      }
      if (currentCategoryId) {
        params.parent_category = currentCategoryId;
      }

      // 2. Search
      if (currentSearch && currentSearch.trim()) {
        params.search = currentSearch.trim();
      }

      // 3. Sorting & Section Logic
      let ordering = '';
      if (currentSection === "Top Deals") {
        ordering = '-created_at';
      } else if (currentSection === "New Arrivals") {
        ordering = '-created_at';
      } else if (currentSection === "Top Rankings") {
        ordering = '-order_count';
      } else if (currentSection === "Trending" || currentSection === "Inayovuma Sasa") {
        ordering = '-views';
      } else if (currentSection === "Flash Sale") {
        params.is_flash_sale = true;
        params.sale_end_date__gte = new Date().toISOString();
        ordering = '-created_at';
      } else if (currentSection === "Featured") {
        params.is_featured = true;
        ordering = '-created_at';
      } else if (currentSection === "Just For You") {
        ordering = '-created_at';
      } else {
        const validSortColumns = ["created_at", "price", "name", "views", "order_count", "average_rating"];
        const sortColumn = validSortColumns.includes(currentSortBy) ? currentSortBy : "created_at";
        ordering = currentOrder === "asc" ? sortColumn : `-${sortColumn}`;
      }
      if (ordering) params.ordering = ordering;

      // 4. Price filters
      if (currentMinPrice > 0) {
        params.price__gte = currentMinPrice;
      }
      if (currentMaxPrice !== Infinity && currentMaxPrice > 0) {
        params.price__lte = currentMaxPrice;
      }

      // 5. Other filters
      if (currentFilterType === "in_stock") {
        params.stock_quantity__gt = 0;
      } else if (currentFilterType === "retail") {
        params.is_retail = true;
      } else if (currentFilterType === "wholesale") {
        params.is_wholesale = true;
      }

      // 6. Pagination
      params.limit = ITEMS_PER_PAGE;
      params.offset = pageNum * ITEMS_PER_PAGE;

      // Tuma Request
      const response = await api.get('/products/', {
        params,
        signal: abortController.signal
      });
      
      if (abortController.signal.aborted || !mountedRef.current) {
        fetchingRef.current = false;
        return;
      }
      
      // 🔥 Inakagua 'results' kutoka Django REST Framework (pagination)!
      const data = response.data?.results || response.data || [];

      let sanitizedData = data.map(p => {
        const beiKubwa = parseFloat(p.price) || 0;
        const beiYaOfa = parseFloat(p.original_price) || 0;
        const discountPercent = (beiKubwa > beiYaOfa && beiYaOfa > 0) 
          ? Math.round(((beiKubwa - beiYaOfa) / beiKubwa) * 100) 
          : 0;
        return {
          ...p,
          image: p.cover_image || "/images/placeholder.png",
          discount: discountPercent
        };
      });

      if (currentSection === "Top Deals") {
        sanitizedData = sanitizedData.filter(p => {
          const p_price = parseFloat(p.price) || 0;
          const p_original = parseFloat(p.original_price) || 0;
          return p_price > p_original && p_original > 0;
        });
      }

      if (priorityId && pageNum === 0) {
        const priorityItem = sanitizedData.find(p => p.id === priorityId);
        if (priorityItem) {
          const otherItems = sanitizedData.filter(p => p.id !== priorityId);
          sanitizedData = [priorityItem, ...otherItems]; 
        }
      }

      if (isNewSearch || pageNum === 0) {
        setProducts(sanitizedData);
        if (onLoad) onLoad(sanitizedData.length);
        initialFetchDoneRef.current = true;
      } else {
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newItems = sanitizedData.filter(p => !existingIds.has(p.id));
          return [...prev, ...newItems];
        });
      }

      setHasMore(data && data.length === ITEMS_PER_PAGE);
      
    } catch (err) {
      if (err.name !== 'AbortError' && err.name !== 'CanceledError' && mountedRef.current) {
        console.error("Fetch error:", err.response?.data?.detail || err.message);
        setError(err.response?.data?.detail || err.message);
        if (onLoad) onLoad(0);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        fetchingRef.current = false;
        if (abortController === abortControllerRef.current) {
          abortControllerRef.current = null;
        }
      }
    }
  }, [onLoad, priorityId, storeId]);

  useEffect(() => {
    currentParamsRef.current = {
      search, categoryId, section, sortBy, order, minPrice, maxPrice, filterType
    };
  }, [search, categoryId, section, sortBy, order, minPrice, maxPrice, filterType]);

  useEffect(() => {
    initialFetchDoneRef.current = false;
    setPage(0);
    setHasMore(true);
    setProducts([]);
    setError(null);
    
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        fetchProducts(0, true);
      }
    }, 50);
    
    return () => {
      clearTimeout(timer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [search, categoryId, section, sortBy, order, minPrice, maxPrice, filterType, fetchProducts]);

  useEffect(() => {
    if (page > 0 && mountedRef.current && !loading && hasMore && initialFetchDoneRef.current) {
      fetchProducts(page, false);
    }
  }, [page, loading, hasMore, fetchProducts]);

  useEffect(() => {
    let timeoutId;
    let ticking = false;
    
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      
      requestAnimationFrame(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = window.innerHeight;
        const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

        if (scrollPercentage > 0.8 && !loading && hasMore) {
          if (timeoutId) clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            setPage(prev => prev + 1);
          }, 500);
        }
        
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loading, hasMore]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (search && !loading && products.length > 0) {
      result = result.filter(p => 
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return limit ? result.slice(0, limit) : result;
  }, [products, search, limit, loading]);

  if (error && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold mb-2">Hitilafu Imetokea</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button 
          onClick={() => fetchProducts(0, true)} 
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Jaribu Tena
        </button>
      </div>
    );
  }

  if (loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">Inapakia bidhaa...</p>
      </div>
    );
  }

  if (!loading && products.length === 0 && !error) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-gray-100 p-6 rounded-full mb-6">
          <span className="text-5xl">📦</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Bidhaa Hazijapatikana
        </h3>
        <p className="text-gray-500 max-w-sm text-center mb-8">
          Samahani, kwa sasa hatuna bidhaa kwenye kategoria ya 
          <span className="font-semibold text-orange-600"> "{category}"</span>. 
          Tunaongeza bidhaa mpya kila siku, tafadhali rudi baadaye!
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-black transition-all active:scale-95 shadow-lg"
        >
          <span>←</span> Rudi Kwenye Duka
        </button>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ margin: 0, padding: 0 }}>
      <div style={{
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(6, minmax(0, 1fr))',
        width: '100%',
        margin: 0,
        padding: isMobile ? '0' : '0 16px',
      }}>
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            isMobile={isMobile}
            isPriority={product.id === priorityId}
          />
        ))}
      </div>

      {loading && products.length > 0 && (
        <div className="flex justify-center items-center py-8 gap-3">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Inavuta bidhaa zaidi...</p>
        </div>
      )}
      
      {!hasMore && products.length > 0 && (
        <div className="flex items-center justify-center gap-4 my-10">
          <hr className="flex-1 border-gray-200" />
          <span className="text-gray-400 text-sm">✨ Umeifikia mwisho wa bidhaa ✨</span>
          <hr className="flex-1 border-gray-200" />
        </div>
      )}
    </div>
  );
}