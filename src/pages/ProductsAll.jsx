import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowUp, ChevronLeft, ChevronRight, ArrowLeft, Search } from "lucide-react";
import api from "../axiosConfig";
import "../ProductsAll.css";
import ProductList from "./ProductList";
import SearchDialog from "../components/SearchDialog";

// ✅ LAZY IMPORT YA SKELETON
const SkeletonProductsAll = React.lazy(() => import("../components/SkeletonProductsAll"));

export default function ProductsAll() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scrollRef = useRef(null);

  // ============================================
  // 1. DATA KUTOKA URL PARAMS NA LOCATION STATE
  // ============================================
  
  const incomingCategoryId = searchParams.get('categoryId') || location.state?.categoryId || null;
  const incomingSection = searchParams.get('sectionName') || location.state?.sectionName || "";
  const incomingSortBy = searchParams.get('sortBy') || location.state?.sortBy || "created_at";
  const incomingOrder = searchParams.get('order') || location.state?.order || "desc";
  const priorityId = searchParams.get('priorityId') || location.state?.priorityId || null;
  const incomingCategory = searchParams.get('categoryName') || location.state?.categoryName || "All";
  const incomingFilterType = searchParams.get('filterType') || location.state?.filterType || null;
  const incomingStoreId = searchParams.get('storeId') || location.state?.storeId || null;
  const incomingStoreName = searchParams.get('name') || location.state?.name || null;

  // ============================================
  // 2. STATES
  // ============================================
  
  const [activeCategory, setActiveCategory] = useState({
    name: incomingCategory,
    id: incomingCategoryId
  });

  const [activeSection, setActiveSection] = useState(incomingSection);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // ============================================
  // 3. MOBILE DETECTION
  // ============================================
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ============================================
  // 4. SCROLL TO TOP ON STORE CHANGE
  // ============================================
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [incomingStoreId]);

  // ============================================
  // 5. BANNER TITLE (Optimized with useMemo)
  // ============================================
  
  const bannerTitle = useMemo(() => {
    if (incomingStoreName) {
      return `Bidhaa za ${incomingStoreName}`;
    }
    if (activeSection) {
      return activeCategory.name === "All" ? activeSection : activeCategory.name;
    }
    return activeCategory.name === "All" ? "Mkusanyiko wa Bidhaa" : activeCategory.name;
  }, [incomingStoreName, activeSection, activeCategory.name]);

  // ============================================
  // 6. BANNER DESCRIPTION (Optimized with useMemo)
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
  // 7. FETCH CATEGORIES (Imepangwa Alphabetically)
  // ============================================
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get('/categories/');
        const data = response.data;

        if (Array.isArray(data) && data.length > 0) {
          const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));

          setCategories([
            { id: null, name: "All" },
            ...sortedData.map((cat) => ({ id: cat.id, name: cat.name }))
          ]);
        } else {
          setCategories([{ id: null, name: "All" }]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error.message);
        setError("Imeshindwa kupakia kategoria. Tafadhali jaribu tena.");
        setCategories([{ id: null, name: "All" }]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // ============================================
  // 8. SYNC CATEGORY FROM URL
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
  // 9. PAGE TITLE
  // ============================================
  
  useEffect(() => {
    const pageTitle = incomingStoreName 
      ? `${incomingStoreName} - Store` 
      : (activeSection || activeCategory.name);
    document.title = `${pageTitle} | Skyfall`;
  }, [activeCategory, activeSection, incomingStoreName]);

  // ============================================
  // 10. SCROLL LOGIC
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
  // 11. BACK TO TOP - FLOATING BOTTOM BUTTON
  // ============================================
  
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ============================================
  // 12. SCROLL TO TOP FUNCTION
  // ============================================

  const scrollToTop = useCallback(() => {
    window.scrollTo({ 
      top: 0, 
      behavior: "smooth" 
    });
  }, []);

  // ============================================
  // 13. HANDLE BACK TO DASHBOARD
  // ============================================

  const handleBackToDashboard = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  // ============================================
  // 14. HANDLE SEARCH
  // ============================================
  
  const handleSearchSubmit = useCallback((query) => {
    navigate(`/products?search=${encodeURIComponent(query)}`);
  }, [navigate]);

  // ============================================
  // 15. HANDLE CATEGORY CLICK
  // ============================================
  
  const handleCategoryClick = useCallback((cat) => {
    setActiveCategory({ name: cat.name, id: cat.id });
    const newParams = new URLSearchParams(window.location.search);
    if (cat.id) {
      newParams.set('categoryId', cat.id);
      newParams.set('categoryName', cat.name);
    } else {
      newParams.delete('categoryId');
      newParams.set('categoryName', 'All');
    }
    const newUrl = `${window.location.pathname}?${newParams.toString()}`;
    window.history.replaceState({ path: newUrl }, '', newUrl);
  }, []);

  // ============================================
  // 16. RENDER
  // ============================================

  if (error) {
    return (
      <div className="products-all-page error-page">
        <h2 className="error-title">Error</h2>
        <p className="error-message">{error}</p>
        <button className="error-retry-btn" onClick={() => window.location.reload()}>
          Jaribu Tena
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <Suspense fallback={<div className="loading-placeholder">Inapakia...</div>}>
        <SkeletonProductsAll isMobile={isMobile} />
      </Suspense>
    );
  }

  return (
    <div className="products-all-page">
      
      {/* ========== BANNER ========== */}
      <div className="alibaba-style-banner">
        {/* ✅ BACK ARROW - KUREJEA DASHBOARD */}
        <button 
          className="banner-back-btn" 
          onClick={handleBackToDashboard}
          aria-label="Rudi Dashboard"
        >
          <ArrowLeft size={24} />
        </button>
        
        {/* ✅ SEARCH BUTTON - KULIA */}
        <button 
          className="banner-search-btn" 
          onClick={() => setIsSearchOpen(true)}
          aria-label="Tafuta"
        >
          <Search size={22} />
        </button>
        
        <h1 className="banner-title">{bannerTitle}</h1>
        <p className="banner-desc">{bannerDesc}</p>
      </div>

      {/* ========== SEARCH DIALOG ========== */}
      <SearchDialog 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearchSubmit}
      />

      {/* ========== CATEGORY TABS ========== */}
      <div className="category-tabs-wrapper">
        <button className="nav-arrow left" onClick={() => scroll("left")}>
          <ChevronLeft size={20} />
        </button>
        
        <div className="category-tabs-scroll" ref={scrollRef}>
          {loading ? (
            <div className="tab-item loading-tab">Inapakia...</div>
          ) : (
            categories.map((cat) => (
              <button
                key={cat.id || 'all'}
                className={`tab-item ${activeCategory.id === cat.id ? "active" : ""}`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat.name}
              </button>
            ))
          )}
        </div>
        
        <button className="nav-arrow right" onClick={() => scroll("right")}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* ========== PRODUCT LIST ========== */}
      <div className="all-products-container">
        <main className="products-main-content">
          <ProductList 
            key={`${incomingStoreId}-${activeCategory.id}-${activeSection}-${search}-${priorityId}`}
            category={activeCategory.name}
            storeId={incomingStoreId}
            categoryId={activeCategory.id}
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

      {/* ========== BACK TO TOP - FLOATING BUTTON ========== */}
      <button 
        className={`back-to-top-btn ${showBackToTop ? 'visible' : ''}`} 
        onClick={scrollToTop}
        aria-label="Rudi Juu"
      >
        <ArrowUp className="back-to-top-icon" />
      </button>
    </div>
  );
}