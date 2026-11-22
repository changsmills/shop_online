// src/pages/AllStores.jsx
import React, { useState, useEffect, useRef } from 'react';
import StoresHeader from '../components/StoresHeader';
import Footer from '../components/Footer';
import StoreCard from '../components/StoreCard';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../axiosConfig';
import { Filter, ArrowUp, ChevronDown, Check, X } from 'lucide-react'; 
import { useQuery, useInfiniteQuery } from '@tanstack/react-query'; 

const STORES_PER_PAGE = 20;

// ==========================================
// 2. FUNCTION ZA KUCHUKUA DATA
// ==========================================
const fetchFilterCategories = async () => {
  const catRes = await api.get('/categories/', { params: { limit: 50 } });
  return catRes.data.results || catRes.data || [];
};

const fetchStoresData = async ({ pageParam = 1, queryKey }) => {
  const [_, { searchQuery, filterCategory, filterCity, filterVerified }] = queryKey;
  
  const params = {
    limit: STORES_PER_PAGE,
    offset: (pageParam - 1) * STORES_PER_PAGE,
    status: 'active',
    ordering: '-created_at',
    public_view: 'true'
  };
  
  if (searchQuery && searchQuery.trim()) params.search = searchQuery.trim();
  if (filterCategory) params.category_id = filterCategory;
  if (filterCity) params.city = filterCity;
  if (filterVerified === 'verified') params.is_verified = true;
  else if (filterVerified === 'unverified') params.is_verified = false;

  const response = await api.get('/stores/', { params });
  const data = response.data.results || response.data || [];

  return {
    data,
    nextPage: data.length === STORES_PER_PAGE ? pageParam + 1 : undefined
  };
};

const fetchSingleStore = async ({ queryKey }) => {
  const [_, storeId] = queryKey;
  if (!storeId) return null;
  const response = await api.get(`/stores/${storeId}/?public_view=true`);
  return response.data && response.data.id ? response.data : null;
};


export default function AllStores({ session }) {
  const { storeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const lastStoreRef = useRef();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterVerified, setFilterVerified] = useState("all");
  
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  // 🔥 Refs kwa ajili ya mobile category slider
  const categoryScrollRef = useRef(null);
  const categoryRefs = useRef({});

  const cities = [
    "Dar es Salaam", "Arusha", "Mwanza", "Zanzibar", "Dodoma",
    "Tanga", "Mbeya", "Morogoro", "Tabora", "Kigoma"
  ];

  // ==========================================
  // 3. QUERIES
  // ==========================================
  
  const { data: categories = [] } = useQuery({
    queryKey: ['allStoresFilterCategories'],
    queryFn: fetchFilterCategories,
    staleTime: Infinity,
  });

  const {
    data: storesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: loadingStores,
  } = useInfiniteQuery({
    queryKey: ['allStores', { searchQuery, filterCategory, filterCity, filterVerified }],
    queryFn: fetchStoresData,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5,
    enabled: !storeId, 
  });

  const stores = storesData?.pages.flatMap(page => page.data) || [];

  const { data: singleStore, isLoading: loadingSingleStore } = useQuery({
    queryKey: ['singleStore', storeId],
    queryFn: fetchSingleStore,
    enabled: !!storeId,
    staleTime: 1000 * 60 * 5,
  });

  const loading = storeId ? loadingSingleStore : loadingStores;

  // ==========================================
  // 4. INFINITE SCROLL LOGIC
  // ==========================================
  useEffect(() => {
    if (loading || isFetchingNextPage || !hasNextPage || storeId) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    
    if (lastStoreRef.current) observer.observe(lastStoreRef.current);
    
    return () => {
      if (lastStoreRef.current) observer.unobserve(lastStoreRef.current);
    };
  }, [loading, isFetchingNextPage, hasNextPage, fetchNextPage, storeId]);

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

  // 🔥 Auto-scroll kwenye mobile category slider
  useEffect(() => {
    if (filterCategory && categoryRefs.current[filterCategory]) {
      setTimeout(() => {
        categoryRefs.current[filterCategory]?.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }, 100);
    }
  }, [filterCategory]);


  // ===== Reusable classes =====
  const filterItemBase =
    "px-3 sm:px-3.5 py-1.5 lg:py-2 rounded-lg cursor-pointer text-xs sm:text-sm transition-all border lg:border-transparent";
  const filterItemActive =
    "border-orange-500 lg:border-transparent bg-orange-50 dark:bg-[#2d1a0a] text-orange-500 font-semibold";
  const filterItemInactive =
    "border-gray-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] lg:bg-transparent text-gray-500 dark:text-[#8b949e] hover:bg-gray-100 dark:hover:bg-[#21262d]";

  // ===== 5. LOADING SKELETON =====
  if (loading && !singleStore && stores.length === 0) {
    return (
      <div className="bg-white dark:bg-[#0d1117] min-h-screen flex flex-col font-sans">
        <StoresHeader showBack={true} onSearch={setSearchQuery} />
        
        <div className="max-w-[1400px] mx-auto w-full px-2 md:px-4 pt-1 md:pt-[8px] pb-5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#161b22] rounded-xl p-2 flex flex-col gap-2 shadow-sm border border-gray-200 dark:border-[#30363d] animate-pulse"
              >
                <div className="w-full aspect-square bg-gray-200 dark:bg-[#30363d] rounded-lg" />
                <div className="h-4 bg-gray-200 dark:bg-[#30363d] rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-[#30363d] rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
         <div className="hidden md:block"><Footer /></div>
      </div>
    );
  }

  // ===== 6. MAIN RENDER =====
  return (
    
    <div className="bg-white dark:bg-[#0d1117] min-h-screen flex flex-col relative">
      <StoresHeader showBack={true} onSearch={setSearchQuery} />

      <div className="flex flex-col lg:flex-row max-w-[1400px] mx-auto w-full px-1 md:px-4 py-2 md:py-4 pb-20 md:pb-6 lg:pb-10 gap-2 sm:gap-4 lg:gap-6 flex-1 ">

              {/* ===== SIDEBAR ===== */}
        <aside className="hidden md:flex md:flex-col w-full lg:w-[220px] xl:w-[260px] flex-shrink-0 bg-white dark:bg-[#161b22] p-3 sm:p-4 lg:p-5 rounded-xl border border-gray-200 dark:border-[#30363d] lg:sticky lg:top-[90px] max-h-[calc(100vh-110px)] overflow-hidden">
          
          {/* Kichwa cha Filters (Hakiondoi) */}
          <div className="flex items-center gap-2.5 font-bold text-base pb-4 border-b border-gray-200 dark:border-[#30363d] mb-4 text-gray-800 dark:text-[#f0f6fc] shrink-0">
            <Filter size={16} />
            <span>Filters</span>
          </div>

          <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar">
            
            {/* Category */}
            <div className="mb-4 lg:mb-6">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-[#f0f6fc] mb-3">Category</h4>
              <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1 list-none p-0 m-0">
                <li
                  className={`${filterItemBase} ${!filterCategory ? filterItemActive : filterItemInactive}`}
                  onClick={() => setFilterCategory("")}
                >
                  All Categories
                </li>
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    className={`${filterItemBase} ${filterCategory === cat.id ? filterItemActive : filterItemInactive}`}
                    onClick={() => setFilterCategory(cat.id)}
                  >
                    {cat.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* City */}
            <div className="mb-4 lg:mb-6">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-[#f0f6fc] mb-3">Location (City)</h4>
              <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1 list-none p-0 m-0">
                <li
                  className={`${filterItemBase} ${!filterCity ? filterItemActive : filterItemInactive}`}
                  onClick={() => setFilterCity("")}
                >
                  All Cities
                </li>
                {cities.map((city) => (
                  <li
                    key={city}
                    className={`${filterItemBase} ${filterCity === city ? filterItemActive : filterItemInactive}`}
                    onClick={() => setFilterCity(city)}
                  >
                    {city}
                  </li>
                ))}
              </ul>
            </div>

            {/* Verified */}
            <div className="mb-4 lg:mb-6">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-[#f0f6fc] mb-3">Verification</h4>
              <div className="flex flex-row flex-wrap lg:flex-col gap-3 lg:gap-2">
                {[
                  { val: 'all', label: 'All Suppliers' },
                  { val: 'verified', label: 'Verified Only' },
                  { val: 'unverified', label: 'Unverified' },
                ].map(({ val, label }) => (
                  <label
                    key={val}
                    className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-500 dark:text-[#8b949e] cursor-pointer lg:py-1.5"
                  >
                    <input
                      type="radio"
                      name="verified"
                      value={val}
                      checked={filterVerified === val}
                      onChange={() => setFilterVerified(val)}
                      className="accent-orange-500 w-4 h-4 cursor-pointer"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

          </div>
        </aside>

               {/* ===== MAIN CONTENT ===== */}
        <div className="flex-1 min-w-0">
          
          {/* 🔥 MOBILE CATEGORY SLIDER (PILLS) */}
          <div className="block md:hidden mb-4">
            <div className="relative flex items-center w-full px-3 py-2 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
              <div
                ref={categoryScrollRef}
                className="flex overflow-x-auto flex-1 gap-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pr-12"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <div
                  onClick={() => setFilterCategory("")}
                  className={`whitespace-nowrap shrink-0 px-4 py-2 rounded-full text-[13px] font-medium cursor-pointer transition-all duration-200 select-none border ${
                    !filterCategory ? 'bg-[#ff6a00] text-white border-[#ff6a00] font-semibold shadow-md' : 'bg-gray-100 dark:bg-[#1a1a2e] text-gray-800 dark:text-gray-200 border-transparent hover:bg-gray-200 dark:hover:bg-[#2a2a3e]'
                  }`}
                >
                  All
                </div>
                {categories.map((cat) => {
                  const isActive = filterCategory === cat.id;
                  return (
                    <div
                      key={cat.id}
                      ref={(el) => { categoryRefs.current[cat.id] = el; }}
                      onClick={() => setFilterCategory(cat.id)}
                      className={`whitespace-nowrap shrink-0 px-4 py-2 rounded-full text-[13px] font-medium cursor-pointer transition-all duration-200 select-none border ${
                        isActive ? 'bg-[#ff6a00] text-white border-[#ff6a00] font-semibold shadow-md' : 'bg-gray-100 dark:bg-[#1a1a2e] text-gray-800 dark:text-gray-200 border-transparent hover:bg-gray-200 dark:hover:bg-[#2a2a3e]'
                      }`}
                    >
                      <span className="max-w-[120px] truncate block">{cat.name}</span>
                    </div>
                  );
                })}
              </div>
              <button 
                onClick={() => setIsCategoryDialogOpen(true)}
                className="absolute right-2 z-20 w-8 h-8 flex items-center justify-center bg-white dark:bg-black rounded-full border border-gray-200 dark:border-gray-700 shadow-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronDown size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* 🔥 MAIN GRID: Gap ni 0.5 kwenye mobile, na 4 kwenye desktop kubwa */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">

            {singleStore && (
              <div className="flex">
                <StoreCard
                  store={singleStore}
                  onClick={() => navigate(`/store/${singleStore.id}`)}
                />
              </div>
            )}

            {stores.length > 0 ? (
              stores.map((store, index) => (
                <div
                  key={store.id}
                  ref={index === stores.length - 1 ? lastStoreRef : null}
                  className="flex"
                >
                  <StoreCard
                    store={store}
                    onClick={() => navigate(`/store/${store.id}`)}
                  />
                </div>
              ))
            ) : (
              null
            )}

          </div>

          {isFetchingNextPage && (
            <div className="flex justify-center items-center gap-3 py-10 text-gray-500 dark:text-[#8b949e]">
              <div className="w-6 h-6 border-[3px] border-gray-200 dark:border-[#30363d] border-t-orange-500 rounded-full animate-spin" />
              <span>Loading more stores...</span>
            </div>
          )}

          {!hasNextPage && stores.length > 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-[#8b949e] text-sm">
              <p>✨ You have reached the end of the list ✨</p>
            </div>
          )}
        </div>
      </div>
      <div className="hidden md:block"><Footer /></div>

      {/* 🔥 KITUFE CHA BACK TO TOP HAPA CHINI */}
      <button 
        className={`fixed bottom-[80px] md:bottom-[120px] right-3 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#ff6a00] hover:bg-[#e55a00] text-white shadow-[0_4px_16px_rgba(255,106,0,0.35)] flex items-center justify-center transition-all duration-300 z-[1000] border-none cursor-pointer md:hidden
         ${showBackToTop ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto visible' : 'opacity-0 translate-y-5 scale-75 pointer-events-none invisible'}`} 
        onClick={scrollToTop}
        aria-label="Rudi Juu"
      >
        <ArrowUp className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5]" />
      </button>

      {/* 🔥 DIALOG YA CATEGORIES KWA MOBILE */}
      {isCategoryDialogOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60"
          onClick={() => setIsCategoryDialogOpen(false)}
        >
          <div 
            className="w-full max-h-[75vh] bg-white dark:bg-[#0a0a0a] rounded-t-2xl flex flex-col overflow-hidden animate-slide-up shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
              <h3 className="text-base font-bold text-black dark:text-white m-0">All Categories</h3>
              <button onClick={() => setIsCategoryDialogOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 pb-24">
              <div
                onClick={() => {
                  setFilterCategory("");
                  setIsCategoryDialogOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-3.5 mb-1.5 rounded-xl cursor-pointer transition-colors ${
                  !filterCategory 
                    ? 'bg-orange-50 dark:bg-orange-500/10 text-[#ff6a00] font-bold' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a2e]'
                }`}
              >
                <span className="truncate pr-4">All</span>
                {!filterCategory && <Check size={18} className="text-[#ff6a00] shrink-0" />}
              </div>
              {categories.map((cat) => {
                const isActive = filterCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setFilterCategory(cat.id);
                      setIsCategoryDialogOpen(false);
                    }}
                    className={`flex items-center justify-between px-4 py-3.5 mb-1.5 rounded-xl cursor-pointer transition-colors ${
                      isActive 
                        ? 'bg-orange-50 dark:bg-orange-500/10 text-[#ff6a00] font-bold' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a2e]'
                    }`}
                  >
                    <span className="truncate pr-4">{cat.name}</span>
                    {isActive && <Check size={18} className="text-[#ff6a00] shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}