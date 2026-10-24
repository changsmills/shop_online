// src/components/LocationFilter.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, MapPin, ArrowRight } from "lucide-react";
import api from "../axiosConfig"; 
import DashboardCard from "./DashboardCard";
import SkeletonCardz from "./SkeletonCardz"; 
import { useTranslation } from 'react-i18next';
// 🔥 NIMEREKEBISHA HAPA: Koma imebadilishwa kuwa nukta
import { useUserLocation } from '../hooks/useUserLocation.js'; 

export default function LocationFilter({ navigate }) {
  const { t, i18n } = useTranslation();
  const { location, error: locationError } = useUserLocation(); 
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        
        let response;
        
        if (location) {
          response = await api.get('/nearby-products/', {
            params: {
              lat: location.lat,
              lng: location.lng,
            }
          });
        } else {
          response = await api.get('/products/');
        }
        
        const data = response.data.results || response.data || [];

        if (location) {
          data.sort((a, b) => (a.distance_km || 0) - (b.distance_km || 0));
        }

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
  }, [location, i18n.language]); 

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
  // 🔥 RENDER HEADER - Imebadilishwa kwenda Tailwind
  // ============================================================
  const renderHeader = () => (
    <div className="flex items-start justify-between mb-4 px-2 md:px-0">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <MapPin className="text-blue-600" size={24} />
          <h2 className="text-lg md:text-xl font-bold text-gray-800">{t('shop_by_location')}</h2>
        </div>
        
        <p className="text-sm text-gray-500 mt-1 ml-8">
          {location ? t('find_best_deals_near_you') : t('find_best_deals_across_tz')}
        </p>
      </div>
      
      <div>
        <button 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-blue-600"
          onClick={() => {
            const url = location 
              ? `/products?lat=${location.lat}&lng=${location.lng}&section=nearby`
              : '/products?section=location'; 
            
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
  // 🔥 SKELETON LOADING - Imebadilishwa kwenda Tailwind
  // ============================================================
  if (loading) {
    return (
      <div className="w-full py-4">
        {renderHeader()}

        <div className="relative w-full">
          <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="min-w-[200px] md:min-w-[250px] flex-shrink-0">
                <SkeletonCardz />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (locations.length === 0) return null;

  // ============================================================
  // 🔥 SUCCESS STATE - Imebadilishwa kwenda Tailwind
  // ============================================================
  return (
    <div className="w-full py-4">
      {renderHeader()}

      <div className="relative w-full group">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-md rounded-full p-2 text-gray-700 hover:bg-white transition-all hidden md:block" 
            onClick={() => scroll('left')}
          >
            <ChevronLeft size={24} />
          </button>
        )}
        
        {/* Scroll Container */}
        <div 
          ref={scrollContainerRef} 
          className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar scroll-smooth"
        >
          {locations.map((loc, index) => (
            <div key={index} className="min-w-[200px] md:min-w-[250px] flex-shrink-0">
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
        
        {/* Right Arrow */}
        {showRightArrow && (
          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-md rounded-full p-2 text-gray-700 hover:bg-white transition-all hidden md:block" 
            onClick={() => scroll('right')}
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
}