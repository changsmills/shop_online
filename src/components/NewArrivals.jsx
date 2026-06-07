// src/components/NewArrivals.jsx (Fixed Version - Square Images on Mobile)
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { supabase } from "../supabaseClient";
import DashboardCard from "./DashboardCard";
import { useTranslation } from 'react-i18next';

export default function NewArrivals({ navigate, selectedCategory, isMobile }) {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('products_engines')
          .select('*')
          .eq('is_approved', true)
          .order('created_at', { ascending: false })
          .limit(10);

        if (selectedCategory?.id) {
          query = query.eq('parent_category_id', selectedCategory.id);
        }

        const { data, error } = await query;
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("New Arrivals Fetch Error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, [selectedCategory]);


  const getCategoryDisplayName = (category) => {
  if (!category) return '';
  return i18n.language === 'sw' ? (category.name_sw || category.name) : category.name;
};


  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && !isMobile) {
      container.addEventListener('scroll', checkScrollPosition);
      setTimeout(checkScrollPosition, 100);
      
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, [products, isMobile]);

  if (loading) return (
    <div className="skeleton-loader-h" style={{height: '280px', margin: '20px', borderRadius: '15px'}} />
  );
  
  if (products.length === 0) return null;

  <style>{`
  .hide-scrollbar-mobile {
    overflow-x: auto !important;
    overflow-y: hidden !important;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .hide-scrollbar-mobile::-webkit-scrollbar {
    display: none;
  }
  
  /* Force horizontal scroll on mobile */
  @media (max-width: 768px) {
    .hide-scrollbar-mobile {
      display: flex !important;
      flex-direction: row !important;
      flex-wrap: nowrap !important;
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch;
    }
  }
`}</style>

  return (
    <div 
      className="new-arrivals-main-wrapper" 
      style={{ 
         padding: isMobile ? '4px 0' : '0px',
        position: 'relative',
        width: '100%',
        // ✅ 2. Rangi ya background ya kijivu (Light Gray kama Alibaba)
        backgroundColor: 'white', 
        // ✅ 3. Pembe za duara kidogo kwa kontena zima
        borderRadius: isMobile ? '8px' : '16px',
        margin: isMobile ? '2px 0' : '10px 0'
      }}
    >
     {/* Header Section */}
<div style={{ 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  marginBottom: isMobile ? '12px' : '20px',
  flexWrap: 'wrap',
  gap: isMobile ? '6px' : '10px',
  padding: isMobile ? '0 8px' : '0',
}}>
  <div>
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: isMobile ? '4px' : '8px', 
      marginBottom: isMobile ? '2px' : '8px' 
    }}>
      <Sparkles size={isMobile ? 12 : 24} style={{ color: '#eab308' }} />
     <h2 style={{ 
  fontSize: isMobile ? '13px' : '24px', 
  fontWeight: 'bold', 
  margin: 0,
  lineHeight: isMobile ? '1.3' : '1.4'
}}>
  {t('new_arrivals')} {selectedCategory && `${t('in')} ${getCategoryDisplayName(selectedCategory)}`}
</h2>
    </div>
    <p style={{ 
  margin: 0, 
  color: '#888',
  fontSize: isMobile ? '9px' : '16px',
  lineHeight: isMobile ? '1.2' : '1.5'
}}>
  {t('discover_latest_arrivals')}
  {selectedCategory && ` ${t('in')} ${getCategoryDisplayName(selectedCategory)}`}
</p>
  </div>
  
  <button 
    onClick={() => navigate('/products', { 
      state: { 
        sectionName: `${t('new_arrivals')} ${selectedCategory ? `${t('in')} ${selectedCategory.name}` : ''}`,
        categoryId: selectedCategory?.id,
        categoryName: selectedCategory?.name
      } 
    })}
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: isMobile ? '4px' : '8px', 
      padding: isMobile ? '4px 10px' : '8px 20px',
      background: isMobile ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      color: 'white',
      border: 'none',
      borderRadius: isMobile ? '20px' : '10px',
      cursor: 'pointer',
      fontWeight: isMobile ? '500' : '500',
      fontSize: isMobile ? '9px' : '16px',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
      whiteSpace: 'nowrap'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
    }}
  >
    <span>{t('view_more')}</span>
    <ChevronRight size={isMobile ? 10 : 16} />
  </button>
</div>
      
     {/* ========== MOBILE VIEW: Horizontal Scroll with SQUARE Images ========== */}
{isMobile ? (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',           // ← MUHIMU: Inazuia vipengele kujikunja
      gap: '12px',
      overflowX: 'auto',            // ← MUHIMU: Inawezesha horizontal scroll
      overflowY: 'hidden',
      scrollBehavior: 'smooth',
      WebkitOverflowScrolling: 'touch',  // ← MUHIMU: Kwa iOS smooth scroll
      padding: '10px 0 20px 0',
      width: '100%',
      msOverflowStyle: 'none',
      scrollbarWidth: 'none'
    }}
    className="hide-scrollbar-mobile"
  >
    {products.map((product) => (
      <div
        key={product.id}
        style={{
          flex: '0 0 auto',        // ← MUHIMU: Inazuia vipengele kukua au kusinyaa
          width: '140px',
          minWidth: '140px'
        }}
      >
        <DashboardCard
          image={product.cover_image}
          title={product.name}
          price={product.price}
          originalPrice={product.original_price}
          views={product.views}
          isMobile={isMobile}
          onClick={() => navigate('/products', {
            state: {
              priorityId: product.id,
              sectionName: `New Arrivals ${selectedCategory ? `in ${selectedCategory.name}` : ''}`,
              categoryId: selectedCategory?.id,
              categoryName: selectedCategory?.name
            }
          })}
        />
      </div>
    ))}
  </div>
) : (
        /* ========== DESKTOP VIEW: Horizontal Scroll with Arrows ========== */
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              style={{
                position: 'absolute',
                left: '-15px',
                zIndex: 10,
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f7f9fc';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ChevronLeft size={24} />
            </button>
          )}
          
          <div
            ref={scrollContainerRef}
            style={{
              display: 'flex',
              gap: '20px',
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollBehavior: 'smooth',
              padding: '10px 5px 20px 5px',
              width: '100%',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }}
            className="hide-scrollbar-desktop"
          >
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  flex: '0 0 auto',
                  width: '200px',
                  minWidth: '200px'
                }}
              >
              <DashboardCard
  image={product.cover_image}
  title={product.name}
  price={product.price}
  originalPrice={product.original_price}
  views={product.views}
  isMobile={isMobile}
  onClick={() => {
    // 1. Andaa vigezo (Params)
    const priorityId = product.id;
    // Tumia encodeURIComponent ili kuzuia makosa kama jina lina alama au nafasi
    const sectionName = encodeURIComponent(`New Arrivals ${selectedCategory ? `in ${selectedCategory.name}` : ''}`);
    const categoryId = selectedCategory?.id || '';
    const categoryName = encodeURIComponent(selectedCategory?.name || 'All');

    // 2. Tengeneza URL kamili
    const url = `/products?priorityId=${priorityId}&sectionName=${sectionName}&categoryId=${categoryId}&categoryName=${categoryName}`;

    // 3. Fungua kwenye Window/Tab mpya
    window.open(url, '_blank');
  }}
/>
              </div>
            ))}
          </div>
          
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              style={{
                position: 'absolute',
                right: '-15px',
                zIndex: 10,
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f7f9fc';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      )}

      <style>{`
        .hide-scrollbar-mobile::-webkit-scrollbar,
        .hide-scrollbar-desktop::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar-mobile, .hide-scrollbar-desktop {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}