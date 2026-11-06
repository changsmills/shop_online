// src/components/SearchResults.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from "../axiosConfig";
import { Filter, ArrowUp } from 'lucide-react';
import Header from "../components/Header";
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
// 🔥 1. Ingiza Component mpya ya Kadi hapa
import ProductGridCard from '../components/ProductGridCard'; 
const PRODUCTS_PER_PAGE = 20;

// ============================================
// 2. FUNCTION ZA KUCHUKUA DATA
// ============================================
const fetchSidebarCategories = async () => {
  const response = await api.get('/leaf-categories/', { params: { limit: 50 } });
  return response.data.results || response.data || [];
};

const fetchSearchProducts = async ({ pageParam = 1, queryKey }) => {
  const [_, { query, categoryId, minPrice, maxPrice }] = queryKey;
  
  const params = {
    limit: PRODUCTS_PER_PAGE,
    offset: (pageParam - 1) * PRODUCTS_PER_PAGE,
    ordering: '-created_at'
  };

  if (query && query.trim()) params.search = query.trim();
  if (categoryId) params.leaf_category = categoryId;
  if (minPrice && !isNaN(minPrice)) params.price__gte = minPrice;
  if (maxPrice && !isNaN(maxPrice)) params.price__lte = maxPrice;

  const response = await api.get('/products/', { params });
  const data = response.data.results || response.data || [];

  return {
    data,
    nextPage: data.length === PRODUCTS_PER_PAGE ? pageParam + 1 : undefined
  };
};

export default function SearchResults({ session }) {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const navigate = useNavigate();
  
  const [search, setSearch] = useState(initialQuery);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  
  const [appliedMinPrice, setAppliedMinPrice] = useState("");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState("");

  const [showBackToTop, setShowBackToTop] = useState(false);
  const lastProductRef = useRef();

  // ============================================
  // 3. TUMIA QUERIES
  // ============================================
  
  const { data: categories = [] } = useQuery({
    queryKey: ['searchSidebarCategories'],
    queryFn: fetchSidebarCategories,
    staleTime: Infinity,
  });

  const {
    data: productsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch
  } = useInfiniteQuery({
    queryKey: ['searchProducts', { 
      query: initialQuery, 
      categoryId: selectedCategoryId, 
      minPrice: appliedMinPrice, 
      maxPrice: appliedMaxPrice 
    }],
    queryFn: fetchSearchProducts,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5,
  });

  const products = productsData?.pages.flatMap(page => page.data) || [];

  // ============================================
  // 4. EFFECTS
  // ============================================
  
  useEffect(() => {
    setSearch(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (isLoading || isFetchingNextPage || !hasNextPage) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    
    if (lastProductRef.current) observer.observe(lastProductRef.current);
    
    return () => {
      if (lastProductRef.current) observer.unobserve(lastProductRef.current);
    };
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ============================================
  // 5. HANDLERS
  // ============================================
  
  const handleApplyPriceFilter = () => {
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
  };

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
  // 6. RENDER
  // ============================================

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] dark:bg-black">
        <Header showBack={true} />
        
        <div className="max-w-[1400px] mx-auto p-4 md:p-5 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          <div className="hidden md:block bg-white dark:bg-[#111] rounded-xl p-5 h-[500px] animate-pulse"></div>
          
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
    <div className="min-h-screen bg-[#f7f8fa] dark:bg-black font-sans">
      
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
              <button 
                className="px-3.5 py-1.5 border border-[#333] dark:border-gray-500 bg-transparent rounded-full text-xs font-semibold cursor-pointer transition-colors hover:bg-[#1a1a1a] hover:text-white dark:hover:bg-white dark:hover:text-black whitespace-nowrap" 
                onClick={handleApplyPriceFilter}
              >
                OK
              </button>
            </div>
          </div>
        </aside>

        {/* PRODUCTS CONTENT */}
        <div className="w-full">
      
          {/* 🔥 2. GRID INAYOTUMIA COMPONENT MPYA */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
            {products.length > 0 ? (
              products.map((product, index) => (
                <div 
                  key={product.id} 
                  ref={index === products.length - 1 ? lastProductRef : null}
                >
                  <ProductGridCard 
                    product={product}
                    getProductImage={getProductImage}
                    onClick={() => {
                      if (window.innerWidth > 1024) {
                        window.open(`/product/${product.id}`, '_blank');
                      } else {
                        navigate(`/product/${product.id}`);
                      }
                    }}
                  />
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
          
          {isFetchingNextPage && (
            <div className="flex justify-center items-center gap-3 py-10 text-[#666] dark:text-[#94a3b8]">
              <div className="w-6 h-6 border-[3px] border-[#f3f3f3] dark:border-[#334155] border-t-brand-orange rounded-full animate-spin"></div>
              <span>Inapakia bidhaa zaidi...</span>
            </div>
          )}
          
          {!hasNextPage && products.length > 0 && (
            <div className="text-center py-10 text-[#999] dark:text-[#64748b] text-sm">
              <p>✨ Umeifikia mwisho wa matokeo ✨</p>
            </div>
          )}
        </div>

      </main>

      {/* 🔥 KITUFE CHA BACK TO TOP */}
      <button 
        className={`fixed bottom-[80px] md:bottom-[120px] right-3 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#ff6a00] hover:bg-[#e55a00] text-white shadow-[0_4px_16px_rgba(255,106,0,0.35)] flex items-center justify-center transition-all duration-300 z-[1000] border-none cursor-pointer
         ${showBackToTop ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto visible' : 'opacity-0 translate-y-5 scale-75 pointer-events-none invisible'}`} 
        onClick={scrollToTop}
        aria-label="Rudi Juu"
      >
        <ArrowUp className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5]" />
      </button>

    </div>
  );
}