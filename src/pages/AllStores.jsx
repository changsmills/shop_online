// src/pages/AllStores.jsx
import React, { useState, useEffect, useRef } from 'react';
import StoresHeader from '../components/StoresHeader';
import Footer from '../components/Footer';
import StoreCard from '../components/StoreCard';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../axiosConfig';
import { Filter } from 'lucide-react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query'; // 1. Ingiza hooks

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

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterVerified, setFilterVerified] = useState("all");

  // Orodha ya miji (Static)
  const cities = [
    "Dar es Salaam", "Arusha", "Mwanza", "Zanzibar", "Dodoma",
    "Tanga", "Mbeya", "Morogoro", "Tabora", "Kigoma"
  ];

  // ==========================================
  // 3. QUERIES
  // ==========================================
  
  // Query ya Categories za Filter
  const { data: categories = [] } = useQuery({
    queryKey: ['allStoresFilterCategories'],
    queryFn: fetchFilterCategories,
    staleTime: Infinity,
  });

  // Query ya Stores (Infinite Scroll)
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
    enabled: !storeId, // Usiitishe stores kama tupo kwenye single store page
  });

  const stores = storesData?.pages.flatMap(page => page.data) || [];

  // Query ya Single Store (Kama ipo)
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
      <div className="bg-[#f8f9fa] dark:bg-[#0d1117] min-h-screen flex flex-col">
        <StoresHeader showBack={true} onSearch={setSearchQuery} />
        <div className="max-w-[1400px] mx-auto w-full px-2.5 sm:px-4 pt-[70px] md:pt-[80px] pb-5">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 xl:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#161b22] rounded-xl p-3 sm:p-4 flex flex-col gap-3 shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
              >
                <div className="w-full aspect-square bg-gray-300 dark:bg-[#30363d] rounded-lg animate-pulse" />
                <div className="h-3.5 bg-gray-300 dark:bg-[#30363d] rounded animate-pulse" />
                <div className="h-3.5 w-3/5 bg-gray-300 dark:bg-[#30363d] rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ===== 6. MAIN RENDER =====
  return (
    <div className="bg-[#f8f9fa] dark:bg-[#0d1117] min-h-screen flex flex-col">
      <StoresHeader showBack={true} onSearch={setSearchQuery} />

      <div className="flex flex-col lg:flex-row max-w-[1400px] mx-auto w-full px-2.5 sm:px-4 py-3 sm:py-4 pb-20 md:pb-6 lg:pb-10 gap-3 sm:gap-4 lg:gap-6 flex-1 ">

        {/* ===== SIDEBAR ===== */}
        <aside className=" hidden md:block w-full lg:w-[220px] xl:w-[260px] flex-shrink-0 bg-white dark:bg-[#161b22] p-3 sm:p-4 lg:p-5 rounded-xl border border-gray-200 dark:border-[#30363d] lg:sticky lg:top-[100px] lg:h-fit">
          <div className="flex items-center gap-2.5 font-bold text-base pb-4 border-b border-gray-200 dark:border-[#30363d] mb-4 text-gray-800 dark:text-[#f0f6fc]">
            <Filter size={16} />
            <span>Filters</span>
          </div>

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
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-end mb-3 lg:mb-5">
            <span className="text-sm text-gray-500 dark:text-[#8b949e]">
              {stores.length} Stores Loaded
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 xl:gap-5">
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
              <div className="col-span-full text-center py-10 sm:py-16 px-4 sm:px-5 bg-white dark:bg-[#161b22] rounded-xl text-gray-500 dark:text-[#8b949e] border border-transparent dark:border-[#30363d] flex flex-col items-center gap-4">
                <p>No stores found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterCategory("");
                    setFilterCity("");
                    setFilterVerified("all");
                  }}
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-semibold transition-colors text-sm"
                >
                  Reset Filters
                </button>
              </div>
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
      <div className=" hidden md:block"><Footer /></div>
    </div>
  );
}