// src/pages/ProductsAll.jsx
import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowUp, ChevronLeft, ChevronRight, ArrowLeft, Search } from "lucide-react";
import api from "../axiosConfig";
import ProductList from "./ProductList";
import SearchDialog from "../components/SearchDialog";
import { useQuery, useQueryClient } from '@tanstack/react-query';

// ✅ LAZY IMPORT YA SKELETON (Haituhitaji tena kwa ukurasa mzima, lakini tunaiacha kwa usalama)
const SkeletonProductsAll = React.lazy(() => import("../components/SkeletonProductsAll"));

// 2. Function ya kuchukua Categories (nje ya component)
const fetchCategoriesData = async () => {
  const response = await api.get('/categories/');
  const data = response.data;

  if (Array.isArray(data) && data.length > 0) {
    const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));
    return [
      { id: null, name: "All" },
      ...sortedData.map((cat) => ({ id: cat.id, name: cat.name }))
    ];
  }
  return [{ id: null, name: "All" }];
};

export default function ProductsAll() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scrollRef = useRef(null);
  const queryClient = useQueryClient();

  // ============================================
  // 1. DATA KUTOKA URL PARAMS NA LOCATION STATE
  // ============================================
  
  const incomingCategoryId = searchParams.get('categoryId') || location.state?.categoryId || null;
  const incomingSortBy = searchParams.get('sortBy') || location.state?.sortBy || "created_at";
  const incomingOrder = searchParams.get('order') || location.state?.order || "desc";
  const priorityId = searchParams.get('priorityId') || location.state?.priorityId || null;
  const incomingCategory = searchParams.get('categoryName') || location.state?.categoryName || "All";
  const incomingFilterType = searchParams.get('filterType') || location.state?.filterType || null;
  const incomingStoreId = searchParams.get('storeId') || location.state?.storeId || null;
  const incomingStoreName = searchParams.get('name') || location.state?.name || null;

  // ✅ FUNCTION YA NORMALIZE
  const normalizeSection = (section) => {
    if (!section) return "";
    return section
      .trim() 
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const incomingSection = normalizeSection(
    searchParams.get('sectionName') ||
    searchParams.get('section') ||
    location.state?.sectionName ||
    location.state?.section ||
    ""
  );

  // ============================================
  // 2. STATES
  // ============================================
  
  const [activeCategory, setActiveCategory] = useState({
    name: incomingCategory,
    id: incomingCategoryId
  });

  const [activeSection, setActiveSection] = useState(incomingSection);
  const [search, setSearch] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  // ============================================
  // 3. QUERIES
  // ============================================
  const { data: categories = [], isLoading: loadingCategories, error: categoriesError } = useQuery({
    queryKey: ['productsAllCategories'],
    queryFn: fetchCategoriesData,
    staleTime: 1000 * 60 * 10,
  });

  // ============================================
  // 4. MOBILE DETECTION
  // ============================================
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ============================================
  // 5. SCROLL TO TOP ON STORE CHANGE
  // ============================================
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [incomingStoreId]);

  // ============================================
  // 6. BANNER TITLE
  // ============================================
  const bannerTitle = useMemo(() => {
    if (incomingStoreName) {
      return `Bidhaa za ${incomingStoreName}`;
    }
    
    if (activeSection) {
      const decodedSection = decodeURIComponent(activeSection);
      const cleanSection = decodedSection.split(' in ')[0];
      return cleanSection;
    }
    
    return activeCategory.name === "All" ? "Mkusanyiko wa Bidhaa" : activeCategory.name;
  }, [incomingStoreName, activeSection, activeCategory.name]);

  // ============================================
  // 7. BANNER DESCRIPTION
  // ============================================
  const bannerDesc = useMemo(() => {
    const catName = activeCategory.name || "All";
    if (activeSection === "New Arrivals") {
      return `Gundua bidhaa mpya za ${catName} zilizofika hivi punde.`;
    }
    if (activeSection === "Top Deals") {
      return `Okoa pesa na ofa za kila siku kwenye bidhaa za ${catName}.`;
    }
    if (activeSection === "Top Rankings") {
      return `Bidhaa zinazovuma zaidi katika ${catName}.`;
    }
    return `Pata bidhaa bora za ${catName} kwa bei nafuu.`;
  }, [activeCategory.name, activeSection]);

  // ============================================
  // 8. MTANDAO (ONLINE LISTENER)
  // ============================================
  useEffect(() => {
    const handleOnline = () => {
      console.log("🌐 Mtandao umeunganishwa! Inapakia data za bidhaa upya...");
      queryClient.invalidateQueries();
      setFetchTrigger(prev => prev + 1);
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [queryClient]);

  // ============================================
  // 9. SYNC CATEGORY FROM URL
  // ============================================
  useEffect(() => {
    if (incomingCategoryId !== undefined && incomingCategoryId !== activeCategory.id) {
      setActiveCategory({
        name: incomingCategory || "All",
        id: incomingCategoryId
      });
    }
  }, [incomingCategoryId, incomingCategory]);

  // ============================================
  // 10. PAGE TITLE
  // ============================================
  useEffect(() => {
    const pageTitle = incomingStoreName 
      ? `${incomingStoreName} - Store` 
      : (activeSection || activeCategory.name);
    document.title = `${pageTitle} | Skyfall`;
  }, [activeCategory, activeSection, incomingStoreName]);

  // ============================================
  // 11. SCROLL LOGIC
  // ============================================
  const scroll = useCallback((direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth / 2 : clientWidth / 2;
      scrollRef.current.scrollTo({ 
        left: scrollLeft + scrollAmount, 
        behavior: "smooth" 
      });
    }
  }, []);

  // ============================================
  // 12. BACK TO TOP
  // ============================================
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setActiveSection(incomingSection);
  }, [incomingSection]);

  // ============================================
  // 13. SCROLL TO TOP FUNCTION
  // ============================================
  const scrollToTop = useCallback(() => {
    window.scrollTo({ 
      top: 0, 
      behavior: "smooth" 
    });
  }, []);

  // ============================================
  // 14. HANDLE BACK TO DASHBOARD
  // ============================================
  const handleBackToDashboard = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  // ============================================
  // 15. HANDLE SEARCH
  // ============================================
  const handleSearchSubmit = useCallback((query) => {
    navigate(`/products?search=${encodeURIComponent(query)}`);
  }, [navigate]);

  // ============================================
  // 16. HANDLE CATEGORY CLICK
  // ============================================
  const handleCategoryClick = useCallback((cat) => {
    setActiveCategory({ name: cat.name, id: cat.id });
    const newParams = new URLSearchParams(window.location.search);
    
    newParams.delete('leafId');
    newParams.delete('subId');
    newParams.delete('parentId');
    
    if (cat.id) {
      newParams.set('categoryId', cat.id);
      newParams.set('categoryName', cat.name);
    } else {
      newParams.delete('categoryId');
      newParams.set('categoryName', 'All');
    }
    const newUrl = `${window.location.pathname}?${newParams.toString()}`;
    window.location.href = newUrl;
  }, []);

  // ============================================
  // 17. RENDER
  // ============================================

  // 🔥 TUMEONDOA KIZUIZI CHA loadingCategories HAPA

  if (categoriesError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-white dark:bg-[#1e293b] text-black dark:text-white">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-500 mb-2">Error</h2>
        <p className="text-gray-600 dark:text-gray-400">Imeshindwa kupakia kategoria. Tafadhali jaribu tena.</p>
        <button className="bg-brand-orange text-white px-8 py-2.5 rounded-lg cursor-pointer mt-5 hover:bg-brand-hover transition-colors" onClick={() => window.location.reload()}>
          Jaribu Tena
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f8f8f8] dark:bg-[#1e293b] text-black dark:text-[#e2e8f0] overflow-x-hidden transition-colors duration-300 font-sans">
      
      {/* ========== BANNER ========== */}
      <div className="relative overflow-hidden text-gray-900 dark:text-white text-center py-8 md:py-12 px-4 md:px-5">
        <div className="absolute inset-0 z-0 mesh-gradient-bg opacity-90 dark:hidden"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          
          <button 
            className="hidden max-md:flex absolute top-2 left-2 w-8 h-8 rounded-full items-center justify-center bg-white/15 border border-white/20 backdrop-blur-md transition-all hover:bg-white/25 hover:scale-105 active:scale-95" 
            onClick={handleBackToDashboard}
            aria-label="Rudi Dashboard"
          >
            <ArrowLeft size={20} />
          </button>
          
          <button 
            className="flex absolute top-2 right-2 w-8 h-8 md:w-10 md:h-10 rounded-full items-center justify-center bg-white/15 border border-white/20 backdrop-blur-md transition-all hover:bg-white/25 hover:scale-105 active:scale-95" 
            onClick={() => setIsSearchOpen(true)}
            aria-label="Tafuta"
          >
            <Search size={20} />
          </button>

          <h1 className="text-2xl md:text-3xl lg:text-[32px] font-extrabold m-0 drop-shadow-md">
            {bannerTitle}
          </h1>
          
          <p className="text-[11px] md:text-sm lg:text-base mt-1.5 opacity-90 font-medium drop-shadow-sm">
            {bannerDesc}
          </p>
        </div>
      </div>

      <SearchDialog 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearchSubmit}
      />

      {/* ========== CATEGORY TABS ========== */}
      <div className="sticky top-[60px] md:top-0 z-[100] bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-gray-700 flex items-center w-full h-[54px] md:h-[64px] overflow-hidden px-2 md:px-4 shadow-sm mb-2">              
        <button 
          className="hidden md:flex absolute z-20 w-8 h-8 bg-white dark:bg-[#1e293b] border border-gray-300 dark:border-gray-600 rounded-full items-center justify-center shadow-md top-1/2 -translate-y-1/2 left-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" 
          onClick={() => scroll("left")}
        >
          <ChevronLeft size={20} />
        </button>
        
        <div 
          className="flex flex-row overflow-x-auto scroll-smooth whitespace-nowrap w-full px-1 md:px-12 gap-2 md:gap-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" 
          ref={scrollRef}
        >
          
          {/* 🔥 HAPA: Kama categories zinapakia, onyesha Skeleton ndogo hapa */}
          {loadingCategories ? (
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-8 md:h-10 w-20 md:w-28 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse shrink-0"></div>
              ))}
            </>
          ) : (
            categories.map((cat) => (
              <button
                key={cat.id || 'all'}
                className={`px-3 py-1.5 md:px-5 md:py-2.5 text-xs md:text-[15px] font-medium rounded-full transition-all duration-200 border whitespace-nowrap ${
                  activeCategory.id === cat.id 
                    ? "bg-[#ff6a00] text-white border-[#ff6a00] shadow-md shadow-orange-500/20" 
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat.name}
              </button>
            ))
          )}
        </div>
        
        <button 
          className="hidden md:flex absolute z-20 w-8 h-8 bg-white dark:bg-[#1e293b] border border-gray-300 dark:border-gray-600 rounded-full items-center justify-center shadow-md top-1/2 -translate-y-1/2 right-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" 
          onClick={() => scroll("right")}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* ========== PRODUCT LIST ========== */}
      <div className="w-full block p-0 md:p-0">
        <main className="w-full block p-0 md:p-0">
          <ProductList 
            key={`${incomingStoreId}-${activeCategory.id}-${activeSection}-${search}-${priorityId}-${fetchTrigger}`}
            category={activeCategory.name}
            storeId={incomingStoreId}
            categoryId={activeCategory.id}
            leafId={searchParams.get('leafId')}
            subId={searchParams.get('subId')}
            parentId={searchParams.get('parentId')}
            search={search}
            activeCategory={activeCategory}
            section={activeSection}
            priorityId={priorityId}
            sortBy={incomingSortBy}
            order={incomingOrder}
            limit={50}
            filterType={incomingFilterType}
            isMobile={isMobile}
            onLoad={() => {}}
          />
        </main>
      </div>

      {/* ========== BACK TO TOP ========== */}
      <button 
        className={`fixed bottom-[80px] md:bottom-[120px] right-3 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#ff6a00] hover:bg-[#e55a00] text-white shadow-[0_4px_16px_rgba(255,106,0,0.35)] flex items-center justify-center transition-all duration-300 z-[1000] border-none cursor-pointer
         ${showBackToTop ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto visible animate-[bounceIn_0.4s_ease_forwards]' : 'opacity-0 translate-y-5 scale-75 pointer-events-none invisible'}`} 
        onClick={scrollToTop}
      >
        <ArrowUp className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5]" />
      </button>
    </div>
  );
}