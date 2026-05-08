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
      
      // ✅ Tumebadilisha .select("*") na kuweka uhusiano wa categories
      const { data, error } = await supabase
        .from("stores_engine") 
        .select(`
          *,
          categories:category_id (
            name
          )
        `) 
        .eq("status", "active") 
        .limit(10); 

      if (error) throw error;
      
      // Supabase itarudisha data ikiwa na object ya 'categories' ndani
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
        padding: isMobile ? '4px 0' : '1px',
        position: 'relative',
        width: '100%',
       backgroundColor: 'white', 
          borderRadius: isMobile ? '8px' : '16px',
        margin: isMobile ? '2px 0' : '10px 0'



      }}
    >
    {/* Header Section - Fixed Version */}
<div style={{ 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  marginBottom: isMobile ? '8px' : '15px',
  // ✅ Badilisha wrap iwe nowrap ili button isishuke chini
  flexWrap: 'nowrap', 
  gap: isMobile ? '4px' : '10px',
  padding: isMobile ? '0 10px' : '0', 
  width: '100%',
}}>
  <div style={{ flexShrink: 1, minWidth: 0 }}>
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: isMobile ? '4px' : '8px' 
    }}>
      <Factory size={isMobile ? 14 : 24} style={{ color: '#f97316', flexShrink: 0 }} />
      <h2 style={{ 
        fontSize: isMobile ? '14px' : '24px', 
        fontWeight: 'bold', 
        margin: 0,
        whiteSpace: 'nowrap'
      }}>
        Elite Suppliers
      </h2>
    </div>
    <p style={{ 
      margin: 0, 
      color: '#888',
      fontSize: isMobile ? '9px' : '14px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }}>
      Maduka ya jumla yaliyohakikiwa
    </p>
  </div>
  
  {/* ✅ Ondoa sharti la stores.length > 6 ili ionekane muda wote */}
  <button 
    onClick={() => navigate('/products', { state: { filterType: 'Wholesaler' } })}
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '2px', 
      background: 'transparent', // ✅ Ondoa gradient, weka transparent
      color: '#f97316', 
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: isMobile ? '11px' : '16px',
      whiteSpace: 'nowrap',
      flexShrink: 0, // ✅ Inazuia button isinywee
      padding: '4px 0'
    }}
  >
    {/* ✅ Badilisha "Ona Yote" kuwa "View more" */}
    <span>View more</span>
    <ChevronRight size={isMobile ? 12 : 16} />
  </button>
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
            subtitle={
              store.categories?.name 
              ? `${store.categories.name.toUpperCase()} • ${store.city}` 
              : `${store.business_type} • ${store.city}`
            }
            isVerified={store.is_verified}
            businessType={store.business_type}
            moq={store.moq}
            rating={store.average_rating}
            isStore={true}
            isMobile={isMobile}
            onClick={() => {
              // Navigate directly to StorePage
              navigate(`/stores/${store.id}`, {
                state: {
                  storeId: store.id,
                  categoryId: store.category_id,
                  storeName: store.store_name
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
          subtitle={
    store.categories?.name 
    ? `${store.categories.name.toUpperCase()} • ${store.city}` 
    : `${store.business_type} • ${store.city}`
  }
          isVerified={store.is_verified}
          businessType={store.business_type}
          moq={store.moq}
          rating={store.average_rating}
          isStore={true}
          isMobile={isMobile}
 onClick={() => {
  // Fungua ukurasa wa Store na pitisha data kama state
  const storeData = {
    id: store.id,
    name: store.store_name,
    categoryId: store.category_id,
    city: store.city,
    type: store.business_type
  };
  
  // Store data kwenye localStorage kwa muda (option)
  sessionStorage.setItem('selectedStore', JSON.stringify(storeData));
  
  window.open(`/stores/${store.id}`, '_blank');
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
                border: '1px solid #f8fafc',
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