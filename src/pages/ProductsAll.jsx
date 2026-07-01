// src/components/ProductsAll.jsx (FULLY OPTIMIZED)
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import "../ProductsAll.css";
import { supabase } from "../supabaseClient";
import ProductList from "./ProductList";

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
  // 7. FETCH CATEGORIES (With Error Handling)
  // ============================================
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from("categories")
          .select("id, name")
          .order("name", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setCategories([
            { id: null, name: "All" },
            ...data.map((cat) => ({ id: cat.id, name: cat.name }))
          ]);
        } else {
          // Fallback - hakuna categories
          setCategories([{ id: null, name: "All" }]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error.message);
        setError("Imeshindwa kupakia kategoria. Tafadhali jaribu tena.");
        // Fallback - show at least "All"
        setCategories([{ id: null, name: "All" }]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // ============================================
  // 8. SYNC CATEGORY FROM URL (FIXED - Prevents infinite loop)
  // ============================================
  
  useEffect(() => {
    // Only update if category actually changed and not during initial load
    if (incomingCategoryId !== undefined && incomingCategoryId !== activeCategory.id) {
      setActiveCategory({
        name: incomingCategory || "All",
        id: incomingCategoryId
      });
    }
  }, [incomingCategoryId, incomingCategory]);

  // ============================================
  // 9. PAGE TITLE (FIXED)
  // ============================================
  
  useEffect(() => {
    const pageTitle = incomingStoreName 
      ? `${incomingStoreName} - Store` 
      : (activeSection || activeCategory.name);
    document.title = `${pageTitle} | Skyfall`;
  }, [activeCategory, activeSection, incomingStoreName]);

  // ============================================
  // 10. SCROLL LOGIC (FIXED - Dynamic scroll amount)
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
  // 12. HANDLE CATEGORY CLICK (FIXED - With useCallback)
  // ============================================
  
  const handleCategoryClick = useCallback((cat) => {
    // Update state
    setActiveCategory({ name: cat.name, id: cat.id });
    
    // Update URL
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
  // 13. HANDLE SEARCH (Ikiwa unataka kuongeza)
  // ============================================
  
  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  // ============================================
  // 14. RENDER
  // ============================================

  // Error state
  if (error) {
    return (
      <div className="products-all-page" style={{ padding: '20px', textAlign: 'center' }}>
        <h2 style={{ color: '#dc2626' }}>Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            background: '#FF6600',
            color: 'white',
            border: 'none',
            padding: '10px 30px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Jaribu Tena
        </button>
      </div>
    );
  }

  return (
    <div 
      className="products-all-page" 
      style={{ 
        padding: 0, 
        margin: 0,
        overflowX: 'hidden'
      }}
    >
      {/* ========== BANNER ========== */}
      <div 
        className="alibaba-style-banner"
        style={{
          padding: isMobile ? '16px 12px' : '24px 20px',
          margin: 0,
          background: 'linear-gradient(135deg, #FF6A00 0%, #FF8C00 100%)',
          color: 'white'
        }}
      >
        <h1 style={{ fontSize: isMobile ? '20px' : '28px', margin: 0 }}>
          {bannerTitle}
        </h1>
        <p style={{ fontSize: isMobile ? '12px' : '14px', marginTop: '8px', opacity: 0.9 }}>
          {bannerDesc}
        </p>
      </div>

      {/* ========== SEARCH BAR (Optional - Ongeza kama unataka) ========== */}
      {/* 
      <div style={{ padding: isMobile ? '8px 12px' : '12px 20px', background: 'white' }}>
        <input
          type="text"
          placeholder="Tafuta bidhaa..."
          value={search}
          onChange={handleSearch}
          style={{
            width: '100%',
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: isMobile ? '14px' : '16px',
            outline: 'none'
          }}
        />
      </div>
      */}

      {/* ========== CATEGORY TABS ========== */}
      <div 
        className="category-tabs-wrapper"
        style={{
          padding: isMobile ? '0' : '0 16px',
          margin: 0,
          position: 'relative',
          background: 'white',
          borderBottom: '1px solid #eee'
        }}
      >
        {/* Left Arrow */}
        <button 
          className="nav-arrow left" 
          onClick={() => scroll("left")}
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <ChevronLeft size={20} />
        </button>
        
        {/* Scrollable Tabs */}
        <div 
          className="category-tabs-scroll" 
          ref={scrollRef}
          style={{
            display: 'flex',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            padding: isMobile ? '8px 32px' : '10px 40px',
            gap: '4px',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {loading ? (
            <div className="tab-item" style={{ padding: '10px 20px', color: '#999' }}>
              Inapakia...
            </div>
          ) : (
            categories.map((cat) => (
              <button
                key={cat.id || 'all'}
                className={`tab-item ${activeCategory.id === cat.id ? "active" : ""}`}
                onClick={() => handleCategoryClick(cat)}
                style={{
                  padding: isMobile ? '8px 16px' : '10px 24px',
                  fontSize: isMobile ? '13px' : '14px',
                  cursor: 'pointer',
                  outline: 'none',
                  border: 'none',
                  backgroundColor: activeCategory.id === cat.id ? '#FF6600' : 'transparent',
                  color: activeCategory.id === cat.id ? 'white' : '#333',
                  borderRadius: '20px',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  fontWeight: activeCategory.id === cat.id ? '600' : '400',
                  boxShadow: activeCategory.id === cat.id ? '0 2px 8px rgba(255, 102, 0, 0.3)' : 'none'
                }}
              >
                {cat.name}
              </button>
            ))
          )}
        </div>
        
        {/* Right Arrow */}
        <button 
          className="nav-arrow right" 
          onClick={() => scroll("right")}
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* ========== PRODUCT LIST ========== */}
      <div 
        className="all-products-container"
        style={{
          padding: isMobile ? '0' : '0',
          margin: 0,
          width: '100%'
        }}
      >
        <main 
          className="products-main-content" 
          style={{ 
            width: '100%', 
            padding: 0, 
            margin: 0 
          }}
        >
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
        <button 
          className="back-to-top" 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            position: 'fixed',
            bottom: isMobile ? '16px' : '24px',
            right: isMobile ? '16px' : '24px',
            padding: isMobile ? '10px' : '12px',
            background: '#FF6600',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(255, 102, 0, 0.4)',
            zIndex: 999,
            width: isMobile ? '44px' : '52px',
            height: isMobile ? '44px' : '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 102, 0, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 102, 0, 0.4)';
          }}
        >
          <ArrowUp size={isMobile ? 20 : 24} />
        </button>
      )}
    </div>
  );
}