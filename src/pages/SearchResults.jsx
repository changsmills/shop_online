// src/components/SearchResults.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from "../axiosConfig";
import { Filter } from 'lucide-react';

// 🔥 TUMIA HEADER COMPONENT ILEILE!
import Header from "../components/Header";

//import "../SearchResults.css";

export default function SearchResults({ session }) {

  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [search, setSearch] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const navigate = useNavigate();
  const lastProductRef = useRef();
  const PRODUCTS_PER_PAGE = 20;

  // ============================================
  // 🔥 FUNCTION MPYA YA KUPATA IMAGE URL
  // ============================================
  const getProductImage = (product) => {
    if (product.cover_image_url) return product.cover_image_url;
    if (product.cover_image) {
      if (product.cover_image.startsWith('http')) return product.cover_image;
      const BASE_URL = api.defaults.baseURL.replace(/\/api$/, '');
      const imagePath = product.cover_image.startsWith('/') ? product.cover_image : '/' + product.cover_image;
      return `${BASE_URL}${imagePath}`;
    }
    return '/placeholder-image.jpg';
  };

  // ============================================
  // 1. PATA KATEGORIA ZA SIDEBAR
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

      if (initialQuery && initialQuery.trim()) params.search = initialQuery.trim();
      if (selectedCategoryId) params.leaf_category = selectedCategoryId;
      if (minPrice && !isNaN(minPrice)) params.price__gte = minPrice;
      if (maxPrice && !isNaN(maxPrice)) params.price__lte = maxPrice;

      const response = await api.get('/products/', { params });
      const data = response.data.results || response.data || [];
      const totalCount = response.data.count || data.length;

      if (reset) setProducts(data);
      else setProducts(prev => [...prev, ...data]);

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
  // 3. EFFECTS
  // ============================================
  useEffect(() => {
    setProducts([]);
    setHasMore(true);
    setPage(1);
    fetchProducts(1, true);
  }, [initialQuery, selectedCategoryId, minPrice, maxPrice, fetchProducts]);

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
    
    if (lastProductRef.current) observer.observe(lastProductRef.current);
    
    return () => {
      if (lastProductRef.current) observer.unobserve(lastProductRef.current);
    };
  }, [loading, loadingMore, hasMore, fetchProducts, page]);

  useEffect(() => {
    setSearch(initialQuery);
  }, [initialQuery]);

 if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] dark:bg-black pt-[60px] md:pt-[80px]">
        <Header showBack={true} />
        
        <div className="max-w-[1400px] mx-auto p-4 md:p-5 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          {/* Skeleton Sidebar (Desktop) */}
          <div className="hidden md:block bg-white dark:bg-[#111] rounded-xl p-5 h-[500px] animate-pulse"></div>
          
          {/* Skeleton Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 lg:gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white dark:bg-[#111] rounded-xl overflow-hidden shadow-sm">
                <div className="w-full aspect-square bg-gray-200 dark:bg-[#1a1a1a] animate-pulse"></div>
                <div className="p-3 flex flex-col gap-2">
                  <div className="h-3 w-[90%] bg-gray-200 dark:bg-[#1a1a1a] rounded animate-pulse"></div>
                  <div className="h-4 w-[60%] bg-gray-200 dark:bg-[#1a1a1a] rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] dark:bg-black pt-[60px] md:pt-[80px]">
      
      <Header showBack={true} />

      <main className="max-w-[1400px] mx-auto p-3 md:p-5 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 md:gap-6">
        
        {/* SIDEBAR (Desktop Only) */}
        <aside className="hidden md:block bg-white dark:bg-[#111] rounded-xl border border-[#e5e7eb] dark:border-[#1f1f1f] p-5 sticky top-[90px] max-h-[calc(100vh-120px)] overflow-y-auto h-fit">
          
          <div className="flex items-center gap-2 text-lg font-bold text-[#1a1a1a] dark:text-white border-b-2 border-[#f0f0f0] dark:border-[#1f1f1f] pb-4 mb-4">
            <Filter size={16} />
            <span>Filters</span>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-semibold text-[#333] dark:text-gray-300 mb-3">Kategoria</h4>
            <ul className="list-none p-0 m-0">
              <li 
                className={`py-2 px-3 rounded-md text-[13px] cursor-pointer transition-all mb-0.5 ${!selectedCategoryId ? 'bg-[#fff5f0] dark:bg-[#2d1a0a] text-brand-orange font-semibold border-l-[3px] border-brand-orange' : 'text-[#4b5563] dark:text-[#94a3b8] hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'}`}
                onClick={() => setSelectedCategoryId(null)}
              >
                Zote
              </li>
              {categories.map((cat) => (
                <li 
                  key={cat.id}
                  className={`py-2 px-3 rounded-md text-[13px] cursor-pointer transition-all mb-0.5 ${selectedCategoryId === cat.id ? 'bg-[#fff5f0] dark:bg-[#2d1a0a] text-brand-orange font-semibold border-l-[3px] border-brand-orange' : 'text-[#4b5563] dark:text-[#94a3b8] hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'}`}
                  onClick={() => setSelectedCategoryId(cat.id)}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-semibold text-[#333] dark:text-gray-300 mb-3">Bei (TSh)</h4>
            <div className="flex items-center gap-1.5">
              <input 
                type="number" 
                placeholder="Min" 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="flex-1 p-2 border border-[#d1d5db] dark:border-[#334155] rounded-md text-sm outline-none bg-white dark:bg-[#0f172a] text-black dark:text-white focus:border-brand-orange min-w-0"
              />
              <span className="text-[#999] font-bold">-</span>
              <input 
                type="number" 
                placeholder="Max" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="flex-1 p-2 border border-[#d1d5db] dark:border-[#334155] rounded-md text-sm outline-none bg-white dark:bg-[#0f172a] text-black dark:text-white focus:border-brand-orange min-w-0"
              />
              <button className="px-3.5 py-1.5 border border-[#333] dark:border-gray-500 bg-transparent rounded-full text-xs font-semibold cursor-pointer transition-colors hover:bg-[#1a1a1a] hover:text-white dark:hover:bg-white dark:hover:text-black whitespace-nowrap" onClick={() => fetchProducts(1, true)}>
                OK
              </button>
            </div>
          </div>
        </aside>

        {/* PRODUCTS CONTENT */}
        <div className="w-full">
      
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-[16px]">
            {products.length > 0 ? (
              products.map((product, index) => (
                <div 
                  key={product.id} 
                  className="bg-white dark:bg-[#111] border border-[#eee] dark:border-[#1f1f1f] rounded-xl overflow-hidden transition-all duration-300 h-full flex flex-col group hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] hover:border-brand-orange"
                  ref={index === products.length - 1 ? lastProductRef : null}
                >
                  <div 
                    className="cursor-pointer flex flex-col h-full"
                    onClick={() => {
                      if (window.innerWidth > 1024) {
                        window.open(`/product/${product.id}`, '_blank');
                      } else {
                        navigate(`/product/${product.id}`);
                      }
                    }}
                  >
                    <div className="w-full aspect-square overflow-hidden bg-[#f8fafc] dark:bg-[#0a0a0a]">
                      <img 
                        src={getProductImage(product)} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                      />
                    </div>
                    <div className="p-2.5 md:p-3 flex-1 flex flex-col">
                      <h3 className="text-xs md:text-sm font-semibold text-[#333] dark:text-white m-0 mb-1.5 md:mb-2 leading-[1.4] line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-baseline gap-1 mt-auto">
                        <span className="text-[11px] md:text-xs text-[#666] dark:text-[#94a3b8] font-medium">TSH</span>
                        <span className="text-sm md:text-base font-extrabold text-brand-orange">{Number(product.price).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center p-10 md:p-[60px_20px] bg-white dark:bg-[#111] rounded-2xl m-2">
                <p className="text-sm md:text-base text-[#666] dark:text-[#94a3b8] mb-3">Samahani, hatukupata bidhaa zozote.</p>
                <button onClick={() => navigate('/')} className="mt-4 px-6 md:px-8 py-2.5 md:py-3 bg-brand-orange hover:bg-brand-hover text-white border-none rounded-full cursor-pointer font-semibold text-sm md:text-base transition-all hover:scale-105">
                  Rudi Kwenye Duka
                </button>
              </div>
            )}
          </div>
          
          {loadingMore && (
            <div className="flex justify-center items-center gap-3 py-10 text-[#666] dark:text-[#94a3b8]">
              <div className="w-6 h-6 border-[3px] border-[#f3f3f3] dark:border-[#334155] border-t-brand-orange rounded-full animate-spin"></div>
              <span>Inapakia bidhaa zaidi...</span>
            </div>
          )}
          
          {!hasMore && products.length > 0 && (
            <div className="text-center py-10 text-[#999] dark:text-[#64748b] text-sm">
              <p>✨ Umeifikia mwisho wa matokeo ✨</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}