// src/pages/AllStores.jsx
import React, { useState, useEffect, useRef } from 'react';
import StoresHeader from '../components/StoresHeader';
import Footer from '../components/Footer';
import StoreCard from '../components/StoreCard';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../axiosConfig';
import { Filter, ArrowUp } from 'lucide-react'; 
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
    ordering: '-created_at'
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
  const response = await api.get(`/stores/${storeId}/`);
  return response.data && response.data.id ? response.data : null;
};


export default function AllStores({ session }) {
  const { storeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const lastStoreRef = useRef();

  // 🔥 HAPA NDIO PA KUWeka STATE ZOTE ZA COMPONENT
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterVerified, setFilterVerified] = useState("all");
  
  // 🔥 NIMERUDISHA STATE YA BACK TO TOP HAPA NDANI
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Orodha ya miji (Static)
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

  // 🔥 NIMERUDISHA EFFECT YA KUSIKILIZA SCROLL HAPA NDANI
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔥 NIMERUDISHA FUNCTION YA KURUDI JUU HAPA NDANI
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


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
      <div className="bg-[#f8f9fa] dark:bg-[#0d1117] min-h-screen flex flex-col font-sans">
        <StoresHeader showBack={true} onSearch={setSearchQuery} />
        
        <div className="max-w-[1400px] mx-auto w-full px-2 md:px-4 pt-1 md:pt-[80px] pb-5">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0.5 sm:gap-2 lg:gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#161b22] rounded-xl p-1.5 sm:p-2 flex flex-col gap-2 shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
              >
                <div className="w-full aspect-square bg-gray-200 dark:bg-[#30363d] rounded-lg animate-pulse" />
                <div className="h-3 bg-gray-200 dark:bg-[#30363d] rounded animate-pulse" />
                <div className="h-3 w-3/5 bg-gray-200 dark:bg-[#30363d] rounded animate-pulse" />
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
    
    <div className="bg-[#f8f9fa] dark:bg-[#0d1117] min-h-screen flex flex-col relative">
      <StoresHeader showBack={true} onSearch={setSearchQuery} />

      <div className="flex flex-col lg:flex-row max-w-[1400px] mx-auto w-full px-1 md:px-4 py-2 md:py-4 pb-20 md:pb-6 lg:pb-10 gap-2 sm:gap-4 lg:gap-6 flex-1 ">

              {/* ===== SIDEBAR ===== */}
        <aside className="hidden md:flex md:flex-col w-full lg:w-[220px] xl:w-[260px] flex-shrink-0 bg-white dark:bg-[#161b22] p-3 sm:p-4 lg:p-5 rounded-xl border border-gray-200 dark:border-[#30363d] lg:sticky lg:top-[90px] max-h-[calc(100vh-110px)] overflow-hidden">
          
          {/* Kichwa cha Filters (Hakiondoi) */}
          <div className="flex items-center gap-2.5 font-bold text-base pb-4 border-b border-gray-200 dark:border-[#30363d] mb-4 text-gray-800 dark:text-[#f0f6fc] shrink-0">
            <Filter size={16} />
            <span>Filters</span>
          </div>

          {/* 🔥 HAPA: Sehemu ya chini inayoscroll */}
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
          
          {/* 🔥 MAIN GRID: Gap ni 0.5 kwenye mobile, na 4 kwenye desktop kubwa */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0.5 sm:gap-2 lg:gap-3 xl:gap-4">

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