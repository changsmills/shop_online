// src/components/JustForYou.jsx (Updated Version)
import React, { useEffect, useState, useMemo, useRef } from "react";
import { supabase } from "../supabaseClient";
import { Loader2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "./DashboardCard";
import "../JustForYou.css"; 

export default function JustForYou({ handleAction, search = "", selectedCategory, isMobile }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);
  const navigate = useNavigate();

  const fetchJustForYou = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from("products_engines")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(30);

      if (selectedCategory?.id) {
        query = query.eq("parent_category_id", selectedCategory.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      if (isMounted.current) {
        setProducts(data || []);
      }
    } catch (error) {
      console.error("Error:", error.message);
      if (isMounted.current) {
        setError(error.message);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    fetchJustForYou();
    return () => { isMounted.current = false; };
  }, [selectedCategory]);

  const filteredProducts = useMemo(() => {
    if (!search) return products;
    const searchLower = search.toLowerCase();
    return products.filter(item => 
      item.name?.toLowerCase().includes(searchLower)
    );
  }, [products, search]);

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="animate-spin" size={40} color="#ff6600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Failed to load products. Please try again.</p>
      </div>
    );
  }

  return (
    <section 
      className="just-for-you-container"
      style={{
        width: '100%',
        margin: 0,
        padding: isMobile ? '0 0 40px 0' : 0,  // ← Add padding-bottom on mobile (70px for BottomNav)

      }}
    >
    {/* Header - Responsive for mobile */}
<div 
  className="section-header"
  style={{
    padding: isMobile ? '0 8px 12px 8px' : '0 16px 16px 16px',
    margin: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '8px',
  }}
>
  <div className="header-main" style={{ flex: 1 }}>
    <div className="header-text-group">
      <h2 
        className="just-title"
        style={{
          fontSize: isMobile ? '14px' : '24px',
          fontWeight: 'bold',
          margin: 0,
          lineHeight: isMobile ? '1.3' : '1.4',
        }}
      >
        Just For You {selectedCategory && `in ${selectedCategory.name}`}
      </h2>
      <p 
        className="just-subtitle"
        style={{
          fontSize: isMobile ? '9px' : '14px',
          margin: isMobile ? '2px 0 0 0' : '4px 0 0 0',
          color: '#888',
          lineHeight: isMobile ? '1.2' : '1.4',
        }}
      >
        Curated picks for your style on Skyfall.com
        {selectedCategory && ` in ${selectedCategory.name}`}
      </p>
    </div>
  </div>
  
  {filteredProducts.length > 6 && (
    <button 
      className="view-all-just" 
      onClick={() => navigate("/products", { 
        state: { 
          sectionName: "Just For You",
          categoryId: selectedCategory?.id 
        } 
      })}
      style={{
        fontSize: isMobile ? '9px' : '14px',
        fontWeight: isMobile ? '500' : 'normal',
        background: isMobile ? 'rgba(255,102,0,0.1)' : 'none',
        border: 'none',
        borderRadius: isMobile ? '16px' : '0',
        padding: isMobile ? '4px 10px' : '0',
        color: '#ff6600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        whiteSpace: 'nowrap',
      }}
    >
      <span>View all</span>
      <ChevronRight size={isMobile ? 12 : 16} />
    </button>
  )}
</div>

      {/* ========== MOBILE: FULL WIDTH GRID (ZERO PADDING) ========== */}
      {isMobile ? (
        <div 
          className="just-mobile-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            padding: 0,           // ← ZERO PADDING
            margin: 0,
            width: '100%',
          }}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item) => (
              <DashboardCard 
                key={item.id}
                image={item.cover_image}
                title={item.name}
                price={item.price}
                originalPrice={item.original_price}
                views={item.views}
                isMobile={isMobile}
                onClick={() => navigate('/products', { 
                  state: { 
                    priorityId: item.id, 
                    sectionName: `Just For You ${selectedCategory ? `in ${selectedCategory.name}` : ''}`,
                    categoryId: selectedCategory?.id
                  } 
                })}
              />
            ))
          ) : (
            <div className="empty-state">
              <p>No products available in {selectedCategory?.name || 'this category'} right now.</p>
            </div>
          )}
        </div>
      ) : (
        /* ========== DESKTOP: GRID LAYOUT ========== */
        <div 
          className="universal-grid-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '16px',
            padding: '0 16px',
            margin: 0,
          }}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item) => (
              <DashboardCard 
  key={item.id}
  image={item.cover_image}
  title={item.name}
  price={item.price}
  originalPrice={item.original_price}
  views={item.views}
  isMobile={isMobile}
  onClick={() => {
    // 1. Maandalizi ya data
    const priorityId = item.id;
    const sectionName = encodeURIComponent(`Just For You ${selectedCategory ? `in ${selectedCategory.name}` : ''}`);
    const categoryId = selectedCategory?.id || '';
    const categoryName = encodeURIComponent(selectedCategory?.name || 'All');

    // 2. Tengeneza URL string
    const url = `/products?priorityId=${priorityId}&sectionName=${sectionName}&categoryId=${categoryId}&categoryName=${categoryName}`;
    
    // 3. Fungua Tab mpya
    window.open(url, '_blank');
  }}
/>
            ))
          ) : (
            <div className="empty-state">
              <p>No products available in {selectedCategory?.name || 'this category'} right now.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}