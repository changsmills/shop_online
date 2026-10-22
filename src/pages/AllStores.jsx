// src/pages/AllStores.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import StoresHeader from '../components/StoresHeader';
import Footer from '../components/Footer';
import StoreCard from '../components/StoreCard';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../axiosConfig';
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

  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterVerified, setFilterVerified] = useState("all");

  // ===== 1. FILTER DATA =====
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const catRes = await api.get('/categories/', { params: { limit: 50 } });
        const catData = catRes.data.results || catRes.data || [];
        setCategories(catData);
        setCities([
          "Dar es Salaam", "Arusha", "Mwanza", "Zanzibar", "Dodoma",
          "Tanga", "Mbeya", "Morogoro", "Tabora", "Kigoma"
        ]);
      } catch (err) {
        console.error("Error fetching filter data:", err);
      }
    };
    fetchFilterData();
  }, []);

  // ===== 2. FETCH STORES =====
  const fetchStores = useCallback(async (pageNum = 1, reset = true) => {
    if (storeId) return;
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
      if (searchQuery && searchQuery.trim()) params.search = searchQuery.trim();
      if (filterCategory) params.category_id = filterCategory;
      if (filterCity) params.city = filterCity;
      if (filterVerified === 'verified') params.is_verified = true;
      else if (filterVerified === 'unverified') params.is_verified = false;

      const response = await api.get('/stores/', { params });
      const data = response.data.results || response.data || [];

      if (reset) setStores(data);
      else setStores(prev => [...prev, ...data]);

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

  // ===== 3. TRIGGER =====
  useEffect(() => {
    if (storeId) return;
    setStores([]);
    setHasMore(true);
    setPage(1);
    fetchStores(1, true);
  }, [searchQuery, filterCategory, filterCity, filterVerified, fetchStores]);

  // ===== 4. INFINITE SCROLL =====
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
    if (lastStoreRef.current) observer.observe(lastStoreRef.current);
    return () => {
      if (lastStoreRef.current) observer.unobserve(lastStoreRef.current);
    };
  }, [loading, loadingMore, hasMore, fetchStores, page, storeId]);

  // ===== 5. SINGLE STORE =====
  useEffect(() => {
    const fetchSingleStore = async () => {
      if (!storeId) return;
      setLoading(true);
      try {
        const response = await api.get(`/stores/${storeId}/`);
        const data = response.data;
        setSingleStore(data && data.id ? data : null);
      } catch (error) {
        console.error("Error fetching single store:", error);
        setSingleStore(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSingleStore();
  }, [storeId]);

  // ===== Reusable classes =====
  const filterItemBase =
    "px-3 sm:px-3.5 py-1.5 lg:py-2 rounded-lg cursor-pointer text-xs sm:text-sm transition-all border lg:border-transparent";
  const filterItemActive =
    "border-orange-500 lg:border-transparent bg-orange-50 dark:bg-[#2d1a0a] text-orange-500 font-semibold";
  const filterItemInactive =
    "border-gray-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] lg:bg-transparent text-gray-500 dark:text-[#8b949e] hover:bg-gray-100 dark:hover:bg-[#21262d]";

  // ===== 6. LOADING SKELETON =====
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

  // ===== 7. MAIN =====
  return (
    <div className="bg-[#f8f9fa] dark:bg-[#0d1117] min-h-screen flex flex-col">
      <StoresHeader showBack={true} onSearch={setSearchQuery} />

      {/* LAYOUT: mobile column → desktop row */}
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

          {loadingMore && (
            <div className="flex justify-center items-center gap-3 py-10 text-gray-500 dark:text-[#8b949e]">
              <div className="w-6 h-6 border-[3px] border-gray-200 dark:border-[#30363d] border-t-orange-500 rounded-full animate-spin" />
              <span>Loading more stores...</span>
            </div>
          )}

          {!hasMore && stores.length > 0 && (
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