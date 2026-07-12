// src/components/LocationFilter.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, MapPin } from "lucide-react";
import { supabase } from "../supabaseClient";
import DashboardCard from "./DashboardCard";
import { useTranslation } from 'react-i18next';
import '../LocationFilter.css';  // ✅ ONGEZA HII

export default function LocationFilter({ navigate, isMobile }) {
  const { t, i18n } = useTranslation();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products_engines')
          .select(`
            cover_image,
            price,
            stores_engine!inner (
              city,
              physical_address
            )
          `)
          .not('stores_engine', 'is', null);

        if (error) throw error;

        const cityMap = {};
        data.forEach(item => {
          const cityName = item.stores_engine?.city;
          const address = item.stores_engine?.physical_address;
          if (cityName && !cityMap[cityName]) {
            cityMap[cityName] = {
              image: item.cover_image,
              address: address,
              price: item.price
            };
          }
        });

        const formatted = Object.keys(cityMap).map(city => ({
          name: city,
          image: cityMap[city].image,
          address: cityMap[city].address,
          price: cityMap[city].price
        }));

        setLocations(formatted);
      } catch (err) {
        console.error("Location Error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, [i18n.language]);

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
  }, [locations, isMobile]);

  if (loading) return (
    <div className="skeleton-loader-h" />
  );
  
  if (locations.length === 0) return null;

  return (
    <div className="location-main-wrapper">
      
      {/* Header Section - Responsive via CSS */}
      <div className="loc-header">
        <div className="loc-header-left">
          <div className="loc-title-group">
            <MapPin className="loc-map-icon" />
            <h2 className="loc-title">{t('shop_by_location')}</h2>
          </div>
          <p className="loc-subtitle">{t('find_best_deals_near_you')}</p>
        </div>

        <button 
          className="loc-view-more-btn"
          onClick={() => navigate('/products', { state: { sectionName: t('shop_by_location') } })}
        >
          <span>{t('view_more')}</span>
          <ChevronRight size={isMobile ? 10 : 16} />
        </button>
      </div>

      {/* ========== MOBILE VIEW: Horizontal Scroll ========== */}
      {isMobile ? (
        <div className="loc-mobile-scroll hide-scrollbar-mobile">
          {locations.map((loc, index) => (
            <div key={index} className="loc-mobile-card-wrapper">
              <DashboardCard 
                image={loc.image}
                title={loc.name}
                subtitle={loc.address?.split(',')[0]}
                price={loc.price}
                isLocation={true}
                isMobile={isMobile}
                onClick={() => navigate('/products', { 
                  state: { 
                    location: loc.name, 
                    sectionName: `${t('products_in')} ${loc.name}`
                  } 
                })}
              />
            </div>
          ))}
        </div>
      ) : (
        /* ========== DESKTOP VIEW: Horizontal Scroll with Arrows ========== */
        <div className="loc-desktop-wrapper">
          {showLeftArrow && (
            <button className="loc-arrow-btn loc-arrow-left" onClick={() => scroll('left')}>
              <ChevronLeft size={24} />
            </button>
          )}
          
          <div ref={scrollContainerRef} className="loc-desktop-scroll hide-scrollbar-desktop">
            {locations.map((loc, index) => (
              <div key={index} className="loc-desktop-card-wrapper">
                <DashboardCard 
                  image={loc.image}
                  title={loc.name}
                  subtitle={loc.address?.split(',')[0]}
                  price={loc.price}
                  isLocation={true}
                  isMobile={isMobile}
                  onClick={() => {
                    const locationName = encodeURIComponent(loc.name);
                    const sectionTitle = `${t('products_in')} ${loc.name}`;
                    const encodedSectionName = encodeURIComponent(sectionTitle);
                    const url = `/products?location=${locationName}&sectionName=${encodedSectionName}`;
                    window.open(url, '_blank');
                  }}
                />
              </div>
            ))}
          </div>
          
          {showRightArrow && (
            <button className="loc-arrow-btn loc-arrow-right" onClick={() => scroll('right')}>
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}