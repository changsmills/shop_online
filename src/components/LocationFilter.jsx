// src/components/LocationFilter.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, MapPin, ArrowRight, Navigation } from "lucide-react";
import api from "../axiosConfig"; 
import DashboardCard from "./DashboardCard";
import SkeletonCardz from "./SkeletonCardz"; // 🔥 IMPORT SKELETON
import { useTranslation } from 'react-i18next';
import { useUserLocation } from '../hooks/useUserLocation,js'; // 🔥 ONGEZA HII
import '../LocationFilter.css';

export default function LocationFilter({ navigate }) {
  const { t, i18n } = useTranslation();
  const { location, error: locationError } = useUserLocation(); // 🔥 ONGEZA HII
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // 🔥 BADILISHA: Tumia nearby-products API kulingana na GPS
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        
        let response;
        
        if (location) {
          // 🔥 Tumia Nearby Products API (bidhaa za maduka ya karibu)
          response = await api.get('/nearby-products/', {
            params: {
              lat: location.lat,
              lng: location.lng,
            }
          });
        } else {
          // Fallback: Tumia products za kawaida
          response = await api.get('/products/');
        }
        
        const data = response.data.results || response.data || [];

        // 🔥 Panga kulingana na umbali (kama data ina distance_km)
        if (location) {
          data.sort((a, b) => (a.distance_km || 0) - (b.distance_km || 0));
        }

        // 🔥 Chuja kwa store zilizo na location (city au GPS)
        const uniqueStores = {};
        data.forEach(item => {
          const storeId = item.store?.id;
          const cityName = item.store?.city;
          const address = item.store?.physical_address;
          const distance = item.distance_km;
          
          if (storeId && !uniqueStores[storeId]) {
            uniqueStores[storeId] = {
              storeId: storeId,
              name: cityName || item.store?.store_name || 'Unknown',
              image: item.cover_image || item.store?.store_logo_url,
              address: address,
              price: item.price,
              distance: distance
            };
          }
        });

        const formatted = Object.values(uniqueStores).map(store => ({
          name: store.name,
          image: store.image,
          address: store.address,
          price: store.price,
          distance: store.distance,
          storeId: store.storeId
        }));

        setLocations(formatted);
      } catch (err) {
        console.error("Location Error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, [location, i18n.language]); // ✅ Ongeza location kwenye dependencies

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
  // 🔥 RENDER HEADER (Imejumuishwa kwa pande zote)
  // ============================================================
  const renderHeader = () => (
    <div className="loc-header">
      <div className="loc-header-left">
        <div className="loc-title-group">
          <MapPin className="loc-map-icon" />
          <h2 className="loc-title">{t('shop_by_location')}</h2>
        </div>
        
        {/* ✅ ONGEZA SUBTITLE HAPA CHINI YA TITLE */}
        <p className="loc-subtitle">
          {location ? t('find_best_deals_near_you') : t('find_best_deals_across_tz')}
        </p>
      </div>
      
      <div className="loc-header-right">
        <button 
          className="loc-arrow-link-btn"
          onClick={() => {
            const url = location 
              ? `/products?lat=${location.lat}&lng=${location.lng}&section=nearby`
              : '/products?section=location'; 
            
            // ✅ MUHIMU: Angalia kama ni Desktop (>768px), fungua tab mpya.
            // Ikiwa ni Mobile, fungua kwenye tab hii hii (kama kawaida).
            if (window.innerWidth > 768) {
              window.open(url, '_blank'); 
            } else {
              window.location.href = url; 
            }
          }}
        >
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
  
  // ============================================================
  // 🔥 SKELETON LOADING - Inaonyesha skeleton cards wakati data inapakia
  // ============================================================
  if (loading) {
    return (
      <div className="location-main-wrapper">
        
        {renderHeader()}

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
      
            {renderHeader()}


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
                image={loc.image || 'https://via.placeholder.com/300x200?text=Store'}
                title={loc.name}
                subtitle={
                  loc.distance 
                  ? `${loc.address?.split(',')[0] || loc.name} • ${loc.distance} km`
                  : loc.address?.split(',')[0] || loc.name
                }
                price={loc.price}
                isLocation={true}
                onClick={() => {
                  const locationName = encodeURIComponent(loc.name);
                  const sectionTitle = `${t('products_in')} ${loc.name}`;
                  const encodedSectionName = encodeURIComponent(sectionTitle);
                  
                  const url = location 
                    ? `/products?location=${locationName}&sectionName=${encodedSectionName}&lat=${location.lat}&lng=${location.lng}`
                    : `/products?location=${locationName}&sectionName=${encodedSectionName}`;
                  
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