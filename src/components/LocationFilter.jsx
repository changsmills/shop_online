import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, MapPin } from "lucide-react";
import api from "../axiosConfig"; 
import DashboardCard from "./DashboardCard";
import SkeletonCardz from "./SkeletonCardz"; // 🔥 IMPORT SKELETON
import { useTranslation } from 'react-i18next';
import '../LocationFilter.css';

export default function LocationFilter({ navigate }) {
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
        
        const response = await api.get('/products/');
        const data = response.data.results || response.data || [];

        const cityMap = {};
        data.forEach(item => {
          const cityName = item.store?.city;
          const address = item.store?.physical_address;
          
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
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      setTimeout(checkScrollPosition, 100);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, [locations]);

  // ============================================================
  // 🔥 SKELETON LOADING - Inaonyesha skeleton cards wakati data inapakia
  // ============================================================
  if (loading) {
    return (
      <div className="location-main-wrapper">
        {/* Header Section */}
        <div className="loc-header">
          <div className="loc-header-left">
            <div className="loc-title-group">
              <MapPin className="loc-map-icon" />
              <h2 className="loc-title">{t('shop_by_location')}</h2>
            </div>
            <p className="loc-subtitle">{t('find_best_deals_near_you')}</p>
          </div>
        </div>

        {/* 🔥 SKELETON SCROLL - Inaonyesha skeleton 5 kwa horizontal scroll */}
        <div className="loc-desktop-wrapper">
          <div className="loc-scroll-wrapper hide-scrollbar">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="loc-card-wrapper">
                <SkeletonCardz />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // EMPTY STATE - Hakuna locations
  // ============================================================
  if (locations.length === 0) return null;

  // ============================================================
  // SUCCESS STATE - Onyesha locations
  // ============================================================
  return (
    <div className="location-main-wrapper">
      
      {/* Header Section */}
      <div className="loc-header">
        <div className="loc-header-left">
          <div className="loc-title-group">
            <MapPin className="loc-map-icon" />
            <h2 className="loc-title">{t('shop_by_location')}</h2>
          </div>
          <p className="loc-subtitle">{t('find_best_deals_near_you')}</p>
        </div>
      </div>

      {/* Horizontal Scroll */}
      <div className="loc-desktop-wrapper">
        {showLeftArrow && (
          <button className="loc-arrow-btn loc-arrow-left" onClick={() => scroll('left')}>
            <ChevronLeft size={24} />
          </button>
        )}
        
        <div ref={scrollContainerRef} className="loc-scroll-wrapper hide-scrollbar">
          {locations.map((loc, index) => (
            <div key={index} className="loc-card-wrapper">
              <DashboardCard 
                image={loc.image}
                title={loc.name}
                subtitle={loc.address?.split(',')[0]}
                price={loc.price}
                isLocation={true}
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
    </div>
  );
}