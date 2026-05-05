// src/components/ProductsAll.jsx (Updated with Grid Layout)
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import "../ProductsAll.css";
import { supabase } from "../supabaseClient";
import ProductList from "./ProductList";

export default function ProductsAll() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const scrollRef = useRef(null);

  // 1. DATA KUTOKA KWENYE NAVIGATION (Location State)
 // const incomingCategory = location.state?.categoryName || "All";
  //const incomingSection = location.state?.sectionName || "";
 // const incomingCategoryId = location.state?.categoryId || null;
 // const priorityId = location.state?.priorityId || null;
 // const incomingFilterType = location.state?.filterType || null;
 // const incomingSortBy = location.state?.sortBy || "created_at"; 
 // const incomingOrder = location.state?.order || "desc";

const incomingCategoryId = searchParams.get('categoryId') || location.state?.categoryId || null;
  const incomingSection = searchParams.get('sectionName') || location.state?.sectionName || "";
  const incomingSortBy = searchParams.get('sortBy') || location.state?.sortBy || "created_at";
  const incomingOrder = searchParams.get('order') || location.state?.order || "desc";
  const priorityId = searchParams.get('priorityId') || location.state?.priorityId || null;


  const incomingCategory = searchParams.get('categoryName') || location.state?.categoryName || "All";
  const incomingFilterType = searchParams.get('filterType') || location.state?.filterType || null;
  // Ongeza hii chini ya mistari yako ya searchParams.get
const incomingStoreId = searchParams.get('storeId') || location.state?.storeId || null;
const incomingStoreName = searchParams.get('name') || location.state?.name || null;


  //const [activeCategory, setActiveCategory] = useState({
 //   name: incomingCategoryName,
  //  id: incomingCategoryId
 // });

  // 2. STATES ZILIZOBAKI
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

  // 3. DETECT MOBILE SCREEN
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
  window.scrollTo(0, 0); // Inahakikisha ukurasa unaanza juu kabisa
}, [incomingStoreId]); // Itajirudia kama duka likibadilika

const bannerTitle = incomingStoreName 
  ? `Bidhaa za ${incomingStoreName}` 
  : (activeSection 
      ? (activeCategory.name === "All" ? activeSection : activeCategory.name) // Nimeondoa ":" ili iwe fupi zaidi kwenye simu
      : (activeCategory.name === "All" ? "Mkusanyiko wa Bidhaa" : activeCategory.name)
    );

  const getBannerDesc = () => {
    const catName = activeCategory.name || "All";
    if (activeSection === "New Arrivals") return `Gundua bidhaa mpya za ${catName} zilizofika hivi punde.`;
    if (activeSection === "Top Deals") return `Okoa pesa na ofa za kila siku kwenye bidhaa za ${catName}.`;
    if (activeSection === "Top Rankings") return `Bidhaa zinazovuma zaidi katika ${catName}.`;
    return `Pata bidhaa bora za ${catName} kwa bei nafuu.`;
  };

  // 5. FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("categories")
          .select("id, name")
          .order("name", { ascending: true });

        if (error) throw error;

        if (data) {
          setCategories([
            { id: null, name: "All" },
            ...data.map((cat) => ({ id: cat.id, name: cat.name }))
          ]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
  if (incomingCategoryId !== activeCategory.id) {
    setActiveCategory({
      name: incomingCategory,
      id: incomingCategoryId
    });
  }
}, [incomingCategoryId]);

  // 6. SCROLL LOGIC (Kwa Category Tabs)
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - 200 : scrollLeft + 200;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 1000);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ongeza hii hapa
useEffect(() => {
  const pageTitle = incomingStoreName 
    ? `${incomingStoreName} - Store` 
    : (activeSection || activeCategory.name);
  document.title = `${pageTitle} | JinaLaAppYako`;
}, [activeCategory, activeSection, incomingStoreName]);

  return (
    <div 
      className="products-all-page" 
      style={{ 
        padding: 0, 
        margin: 0,
        overflowX: 'hidden'
      }}
    >
      {/* BANNER - with mobile padding adjustment */}
      <div 
        className="alibaba-style-banner"
        style={{
          padding: isMobile ? '16px 12px' : '24px 20px',
          margin: 0
        }}
      >
        <h1 style={{ fontSize: isMobile ? '20px' : '28px', margin: 0 }}>{bannerTitle}</h1>
        <p style={{ fontSize: isMobile ? '12px' : '14px', marginTop: '8px' }}>{getBannerDesc()}</p>
      </div>

      {/* CATEGORY TABS - full width on mobile */}
      <div 
        className="category-tabs-wrapper"
        style={{
          padding: isMobile ? '0' : '0 16px',
          margin: 0
        }}
      >
        <button className="nav-arrow left" onClick={() => scroll("left")}>
          <ChevronLeft size={20} />
        </button>
        <div className="category-tabs-scroll" ref={scrollRef}>
          {loading ? (
            <div className="tab-item">Inapakia...</div>
          ) : (
            categories.map((cat) => (
              <button
  key={cat.id || 'all'}
  className={`tab-item ${activeCategory.id === cat.id ? "active" : ""}`}
  onClick={() => {
    // 1. Sasisha state ya hapo hapo ili rangi ya tab ibadilike (Active State)
    setActiveCategory({ name: cat.name, id: cat.id });
    
    // 2. Chukua vigezo (params) vilivyopo sasa hivi kwenye URL
    const newParams = new URLSearchParams(window.location.search);
    
    // 3. Ikiwa amebonyeza category maalum (sio "All")
    if (cat.id) {
      newParams.set('categoryId', cat.id);
      newParams.set('categoryName', cat.name);
    } else {
      // Ikiwa amebonyeza "All", ondoa vigezo vya category ili aone bidhaa zote
      newParams.delete('categoryId');
      newParams.set('categoryName', 'All');
    }
    
    // 4. MUHIMU: Ikiwa unataka mtumiaji akibonyeza Category, 
    // atoke kwenye duka alilokuwa (storeId) na aone bidhaa za soko zima:
    // newParams.delete('storeId');
    // newParams.delete('name');

    // 5. Badilisha URL ya kivinjari (browser) bila kurefresh ukurasa
    const newUrl = `${window.location.pathname}?${newParams.toString()}`;
    window.history.replaceState({ path: newUrl }, '', newUrl);
  }}
  style={{
    padding: isMobile ? '8px 12px' : '10px 20px',
    fontSize: isMobile ? '13px' : '14px',
    cursor: 'pointer',
    outline: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    transition: 'all 0.2s ease'
  }}
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

      {/* PRODUCT LIST SECTION - ZERO PADDING ON MOBILE */}
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
            category={activeCategory.name}
            key={`${incomingStoreId}-${activeCategory.id}-${activeSection}-${search}-${priorityId}`}
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

      {/* BACK TO TOP BUTTON */}
      {showBackToTop && (
        <button 
          className="back-to-top" 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            bottom: isMobile ? '16px' : '24px',
            right: isMobile ? '16px' : '24px',
            padding: isMobile ? '10px' : '12px'
          }}
        >
          <ArrowUp size={isMobile ? 18 : 20} />
        </button>
      )}
    </div>
  );
}