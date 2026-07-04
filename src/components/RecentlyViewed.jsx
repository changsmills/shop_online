// src/components/RecentlyViewed.jsx (Fixed Version - Same as NewArrivals)
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, History } from "lucide-react";
import { supabase } from "../supabaseClient";
import DashboardCard from "./DashboardCard";
import { useTranslation } from 'react-i18next'; // ✅ 1. ONGEZA HAPA


export default function RecentlyViewed({ navigate, isMobile }) {
   const { t, i18n } = useTranslation(); // ✅ 2. ONGEZA HAPA
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      setLoading(true);
      const storedIds = localStorage.getItem("recentlyViewed");
      const ids = storedIds ? JSON.parse(storedIds) : [];
      
      if (ids.length > 0) {
        try {
          const { data, error } = await supabase
            .from("products_engines")
            .select("*")
            .in("id", ids)
           // .eq("is_approved", true);

          if (error) throw error;

          if (data) {
            const sortedData = ids
              .map(id => data.find(p => p.id === id))
              .filter(Boolean);
            setProducts(sortedData);
          }
        } catch (err) {
          console.error("Error fetching recently viewed:", err.message);
        }
      }
      setLoading(false);
    };

    fetchRecentlyViewed();
  }, [i18n.language]); // ✅ 3. MUHIMU: Ongeza i18n.language hapa!

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

  if (loading) return null;
  if (products.length === 0) return null;

  return (
    <div 
      className="recently-viewed-main-wrapper" 
      style={{ 
         padding: isMobile ? '4px 0' : '0px',
        position: 'relative',
        width: '100%',
        // ✅ 2. Rangi ya background ya kijivu (Light Gray kama Alibaba)
        backgroundColor: '#eceef1', 
        // ✅ 3. Pembe za duara kidogo kwa kontena zima
        borderRadius: isMobile ? '8px' : '16px',
        margin: isMobile ? '2px 0' : '10px 0'
      }}
    >
            {/* Header Section - Same as NewArrivals */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: isMobile ? '12px' : '20px',
        flexWrap: 'wrap',
        gap: isMobile ? '2px' : '3px',
        padding: isMobile ? '0 8px' : '0',
      }}>
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: isMobile ? '4px' : '8px', 
            marginBottom: isMobile ? '2px' : '8px' 
          }}>
            <History size={isMobile ? 12 : 24} style={{ color: '#10b981' }} />
            <h2 style={{ 
              fontSize: isMobile ? '13px' : '24px', 
              fontWeight: 'bold', 
              margin: 0,
              lineHeight: isMobile ? '1.3' : '1.4'
            }}>
              {/* ✅ BADILISHA HAPA: Badilisha maandishi kuwa {t('...')} */}
              {t('recently_viewed')}
            </h2>
          </div>
          <p style={{ 
            margin: 0, 
            color: '#888',
            fontSize: isMobile ? '9px' : '16px',
            lineHeight: isMobile ? '1.2' : '1.5'
          }}>
            {/* ✅ BADILISHA HAPA: Badilisha subtitle kuwa {t('...')} */}
            {t('items_you_recently_viewed')}
          </p>
        </div>
        
        {products.length > 6 && (
          <button 
            onClick={() => navigate('/products', { 
              state: { 
                /* ✅ BADILISHA HAPA: Badilisha jina la section */
                sectionName: t('recently_viewed')
              } 
            })}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: isMobile ? '4px' : '8px', 
              padding: isMobile ? '4px 10px' : '8px 20px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: isMobile ? '20px' : '10px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: isMobile ? '9px' : '16px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
            }}
          >
            {/* ✅ BADILISHA HAPA: Badilisha "View more" kuwa {t('view_more')} */}
            <span>{t('view_more')}</span>
            <ChevronRight size={isMobile ? 10 : 16} />
          </button>
        )}
      </div>
      
      {/* ========== MOBILE VIEW: Horizontal Scroll ========== */}
      {isMobile ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            gap: '12px',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
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
                flex: '0 0 auto',
                width: '140px',
                minWidth: '140px'
              }}
            >
              <DashboardCard
                image={product.cover_image}
                //title={product.name}
                price={product.price}
                originalPrice={product.original_price}
                views={product.views}
                isMobile={isMobile}
                onClick={() => navigate('/products', {
                  state: {
                    priorityId: product.id,
                   sectionName: t('recently_viewed')

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
          //title={product.name}
          price={product.price}
          originalPrice={product.original_price}
          views={product.views}
          isMobile={isMobile}
          onClick={() => {
            // 1. Maandalizi ya URL params
            const priorityId = product.id;
            const sectionName = encodeURIComponent(t('recently_viewed')); // ✅ BADILISHA HAPA

            // 2. Kutengeneza URL
            const url = `/products?priorityId=${priorityId}&sectionName=${sectionName}`;

            // 3. Kufungua tab mpya
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

      {/* Global styles to hide scrollbars */}
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
        @media (max-width: 768px) {
          .hide-scrollbar-mobile {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch;
          }
        }
        .hide-scrollbar-desktop::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar-desktop {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}