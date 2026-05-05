// src/components/TopStores.jsx (Fixed Version - Same as RecentlyViewed)
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Factory } from "lucide-react";
import { supabase } from "../supabaseClient";
import DashboardCard from "./DashboardCard";

export default function TopStores({ navigate, isMobile }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const fetchTopStores = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("stores_engine") 
          .select("*")
          .eq("status", "active") 
          .limit(10); 

        if (error) throw error;
        setStores(data || []);
      } catch (error) {
        console.error("Error fetching stores:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopStores();
  }, []);

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
  }, [stores, isMobile]);

  if (loading) return null;
  if (stores.length === 0) return null;

  return (
    <div 
      className="top-stores-main-wrapper" 
      style={{ 
        padding: isMobile ? '4px 0' : '20px',
        position: 'relative',
        width: '100%',
      }}
    >
      {/* Header Section - Same as RecentlyViewed */}
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
            <Factory size={isMobile ? 12 : 24} style={{ color: '#f97316' }} />
            <h2 style={{ 
              fontSize: isMobile ? '13px' : '24px', 
              fontWeight: 'bold', 
              margin: 0,
              lineHeight: isMobile ? '1.3' : '1.4'
            }}>
              Elite Suppliers
            </h2>
          </div>
          <p style={{ 
            margin: 0, 
            color: '#888',
            fontSize: isMobile ? '9px' : '16px',
            lineHeight: isMobile ? '1.2' : '1.5'
          }}>
            Maduka ya jumla yaliyohakikiwa
          </p>
        </div>
        
        {stores.length > 6 && (
          <button 
            onClick={() => navigate('/products', { state: { filterType: 'Wholesaler' } })}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: isMobile ? '4px' : '8px', 
              padding: isMobile ? '4px 10px' : '8px 20px',
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              color: 'white',
              border: 'none',
              borderRadius: isMobile ? '20px' : '10px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: isMobile ? '9px' : '16px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(249, 115, 22, 0.3)';
            }}
          >
            <span>Ona Yote</span>
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
          {stores.map((store) => {
            let officeImg = 'https://via.placeholder.com/300x150?text=Verified+Store';
            try {
              if (store.office_images) {
                const images = typeof store.office_images === 'string' ? JSON.parse(store.office_images) : store.office_images;
                officeImg = Array.isArray(images) ? images.find(img => img !== null) : officeImg;
              }
            } catch (e) { officeImg = officeImg; }

            return (
              <div
                key={store.id}
                style={{
                  flex: '0 0 auto',
                  width: '140px',
                  minWidth: '140px'
                }}
              >
                 <DashboardCard 
                  image={officeImg}
                  logo={store.store_logo}
                  title={store.store_name}
                  subtitle={`${store.city} - ${store.physical_address?.split(',')[0]}`}
                  isVerified={store.is_verified}
                  businessType={store.business_type}
                  moq={store.moq}
                  rating={store.average_rating}
                  isStore={true}
                  isMobile={isMobile}
                  onClick={() => {
  // 1. Maandalizi ya kichwa cha habari (Header)
  const sectionTitle = `Products from ${store.store_name}`;
  
  // 2. Navigate kwenda /products badala ya /store
  navigate('/products', {
    state: {
      storeId: store.id,          // Inachuja bidhaa za duka hili
      categoryId: store.category_id,
      sectionName: sectionTitle   // Inatuma jina la duka lionekane juu
    }
  });
}}
                />
              </div>
            );
          })}
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
  {/* MAP INAANZA MOJA KWA MOJA HAPA */}
  {stores.map((store) => {
    let officeImg = 'https://via.placeholder.com/300x150?text=Verified+Store';
    try {
      if (store.office_images) {
        const images = typeof store.office_images === 'string' 
          ? JSON.parse(store.office_images) 
          : store.office_images;
        
        const foundImg = Array.isArray(images) ? images.find(img => img !== null) : null;
        if (foundImg) officeImg = foundImg;
      }
    } catch (e) { 
      console.error("Error parsing office images", e); 
    }

    return (
      <div
        key={store.id}
        style={{
          flex: '0 0 auto',
          width: '200px',
          minWidth: '200px'
        }}
      >
        <DashboardCard 
          image={officeImg}
          logo={store.store_logo}
          title={store.store_name}
          subtitle={`${store.city || ''} - ${store.physical_address?.split(',')[0] || ''}`}
          isVerified={store.is_verified}
          businessType={store.business_type}
          moq={store.moq}
          rating={store.average_rating}
          isStore={true}
          isMobile={isMobile}
         onClick={() => {
  // 1. Tengeneza URL Params (Hakikisha unapitisha storeId hapa pia)
  const params = new URLSearchParams({
    categoryId: store.category_id, // <--- Tunapitisha category_id sasa
    storeId: store.id, // Hii ni muhimu ili ukurasa wa products ujue ni duka gani
    name: store.store_name || '',
    city: store.city || '',
    type: store.business_type || ''
  }).toString();

  // 2. Fungua ukurasa wa Products badala ya Store
  window.open(`/products?${params}`, '_blank');
}}
        />
      </div>
    );
  })} 
  {/* HAPA NDIPO MAP INAISHIA */}
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