// src/components/ProductsAll.jsx
import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import "../ProductsAll.css";
import axios from 'axios'; // 🔥 ONGEZA HII
const API_BASE_URL = 'http://127.0.0.1:8000/api'; // 🔥 ONGEZA HII URL ya Backend

import ProductList from "./ProductList";

// ✅ MUHIMU: LAZY IMPORT YA SKELETON (Haipaki mpaka inahitajika!)
const SkeletonProductsAll = React.lazy(() => import("../components/SkeletonProductsAll"));

export default function ProductsAll() {
  const location = useLocation();
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
  // 7. FETCH CATEGORIES (🔥 MABADILIKO HAPA: AXIOS + DJANGO)
  // ============================================
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 🔥 Badilisha Supabase kuwa Axios + Django Endpoint
        const response = await axios.get(`${API_BASE_URL}/categories/`);
        const data = response.data;

        if (Array.isArray(data) && data.length > 0) {
          setCategories([
            { id: null, name: "All" },
            ...data.map((cat) => ({ id: cat.id, name: cat.name }))
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
  // 11. BACK TO TOP
  // ============================================
  
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 1000);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ============================================
  // 12. HANDLE CATEGORY CLICK
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
  // 13. HANDLE SEARCH
  // ============================================
  
  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  // ============================================
  // 14. RENDER
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

  // ✅ MUHIMU: Lazy Load + Suspense kwa skeleton
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
        <h1 className="banner-title">{bannerTitle}</h1>
        <p className="banner-desc">{bannerDesc}</p>
      </div>

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

      {/* ========== BACK TO TOP BUTTON ========== */}
      {showBackToTop && (
        <button className="back-to-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <ArrowUp className="back-to-top-icon" />
        </button>
      )}
    </div>
  );
}