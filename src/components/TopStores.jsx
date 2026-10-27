// src/components/TopStores.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Factory, ArrowRight } from "lucide-react";
import api from "../axiosConfig";
import DashboardCard from "./DashboardCard";
import SkeletonCardz from "./SkeletonCardz";
import { useTranslation } from 'react-i18next';
import { useUserLocation } from '../hooks/useUserLocation,js'; 

export default function TopStores({ navigate }) {
  const { t, i18n } = useTranslation();
  const { location, error: locationError } = useUserLocation(); 
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const fetchTopStores = async () => {
      setLoading(true);
      try {
        let response;
        
        if (location) {
          // 🔥 Tumia Nearby Stores API (Maduka ya karibu na mtumiaji)
          response = await api.get('/nearby-stores/', {
            params: {
              lat: location.lat,
              lng: location.lng,
              limit: 10,
            }
          });
        } else {
          // 🔥 Fallback: Tumia stores za kawaida (kama hakuna location)
          response = await api.get('/stores/', {
            params: {
              limit: 10,
              verification_status: 'approved',
              status: 'active',
              ordering: '-average_rating,-created_at'
            }
          });
        }
        
        const storesData = response.data.results || response.data || [];
        setStores(storesData);
      } catch (error) {
        console.error("Error fetching stores:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTopStores();
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
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      setTimeout(checkScrollPosition, 100);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, [stores]);


  // ============================================================
  // 🔥 RENDER HEADER (Muonekano kamili kama Hot Picks)
  // ============================================================
  const renderHeader = () => (
    <div className="flex justify-between items-center px-3 md:px-5 py-2 md:py-3 bg-[#fff7ed] dark:bg-[#1e293b] dark:border-b dark:border-[#334155] rounded-t-xl mb-2.5 md:mb-4 text-black dark:text-white">
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 md:gap-2.5">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center shrink-0">
            <Factory className="text-orange-500 dark:text-orange-400 w-3.5 h-3.5 md:w-4 md:h-4" />
          </div>
          <h2 className="text-sm md:text-base lg:text-xl font-bold m-0 text-black dark:text-white">
            {t('top_suppliers')}
          </h2>
        </div>
        
        <p className="text-[10px] md:text-xs lg:text-sm text-[#888] dark:text-[#94a3b8] m-0 mt-1 lg:mt-0 lg:pl-[42px]">
          {t('verified_wholesale_stores')}
        </p>
      </div>
      
      <div className="flex items-center">
        <button 
          className="bg-transparent border-none cursor-pointer flex items-center justify-center text-black dark:text-white p-1 transition-transform hover:translate-x-1 hover:text-orange-500 active:scale-95"
          onClick={() => {
            const url = '/stores?section=top-suppliers'; 
            if (window.innerWidth > 768) {
              window.open(url, '_blank'); 
            } else {
              window.location.href = url; 
            }
          }}
        >
          <ArrowRight size={20} className="md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  );
  
  // ============================================================
  // SKELETON LOADING
  // ============================================================
  if (loading) {
    return (
      // 🔥 Nimeweka border-y, pt-0 (kupunguza nafasi juu), na pb-4
      <div className="relative w-full bg-white dark:bg-black border-y border-[#e5e7eb] dark:border-[#334155] pt-0 pb-4 md:py-4 box-border">
        {renderHeader()}
        <div className="relative flex items-center px-2">
          <div className="flex flex-nowrap overflow-x-auto overflow-y-hidden scroll-smooth px-1 py-2 pb-4 md:pb-5 w-full gap-2 md:gap-3 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {Array.from({ length: 5 }).map((_, index) => (
              <div 
                key={`skeleton-${index}`} 
                className="flex-[0_0_calc((100%-17.6px)/2.2)] min-w-[calc((100%-17.6px)/2.2)] sm:flex-[0_0_calc((100%-35px)/3.5)] sm:min-w-[calc((100%-35px)/3.5)] md:flex-[0_0_calc((100%-54px)/4.5)] md:min-w-[calc((100%-54px)/4.5)] lg:flex-[0_0_calc((100%-78px)/6.5)] lg:min-w-[calc((100%-78px)/6.5)] snap-start"
              >
                <SkeletonCardz />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // EMPTY STATE
  // ============================================================
  if (stores.length === 0) return null;

  // ============================================================
  // SUCCESS STATE
  // ============================================================
  return (
    // 🔥 Nimeweka border-y, pt-0 (kupunguza nafasi juu), na pb-4
    <div className="relative w-full bg-white dark:bg-black border-y border-[#e5e7eb] dark:border-[#334155] pt-0 pb-4 md:py-4 box-border">      
      {renderHeader()}

      {/* Horizontal Scroll */}
      <div className="relative flex items-center px-2">
        {showLeftArrow && (
         <button 
            className="absolute z-10 w-6 h-6 md:w-9 md:h-9 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all top-1/2 -translate-y-1/2 text-black dark:text-white hover:bg-[#f97316] hover:text-white hover:border-[#f97316] hover:scale-105 active:scale-95 left-0 md:-left-1" 
            onClick={() => scroll('left')}
          >
           <ChevronLeft size={16} className="md:w-6 md:h-6" />
          </button>
        )}
        
        <div ref={scrollContainerRef} className="flex flex-nowrap overflow-x-auto overflow-y-hidden scroll-smooth px-1 py-2 pb-4 md:pb-5 w-full gap-2 md:gap-3 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {stores.map((store) => {
            let officeImg = 'https://via.placeholder.com/300x150?text=Verified+Store';
            try {
              if (store.office_images) {
                const images = typeof store.office_images === 'string' ? JSON.parse(store.office_images) : store.office_images;
                officeImg = Array.isArray(images) ? images.find(img => img !== null) : officeImg;
              }
            } catch (e) { officeImg = officeImg; }

            return (
              <div key={store.id}  className="flex-[0_0_calc((100%-17.6px)/2.2)] min-w-[calc((100%-17.6px)/2.2)] sm:flex-[0_0_calc((100%-35px)/3.5)] sm:min-w-[calc((100%-35px)/3.5)] md:flex-[0_0_calc((100%-54px)/4.5)] md:min-w-[calc((100%-54px)/4.5)] lg:flex-[0_0_calc((100%-78px)/6.5)] lg:min-w-[calc((100%-78px)/6.5)] snap-start">
                <DashboardCard
                  image={store.office_image_1_url || store.office_image_2_url || 'https://via.placeholder.com/300x150?text=Verified+Store'}
                  title={store.store_name}
                  subtitle={
                     store.distance_km 
                     ? `${store.city} • ${store.distance_km} km` 
                        : (store.category?.name 
                        ? `${store.category.name} • ${store.city}` 
                        : `${store.business_type} • ${store.city}`)
                  }
                  isVerified={store.is_verified}
                  businessType={store.business_type}
                  rating={store.average_rating}
                  isStore={true}
                  onClick={() => {
                    // 🔥 Hifadhi data kamili kwenye sessionStorage!
                    const storeData = {
                      id: store.id,
                      store_name: store.store_name,
                      category_id: store.category_id,
                      city: store.city,
                      business_type: store.business_type,
                      store_logo_url: store.store_logo_url || store.store_logo || null,
                      office_images: store.office_images || [],
                      is_verified: store.is_verified || false
                    };
                    sessionStorage.setItem('selectedStore', JSON.stringify(storeData));

                    // 🔥 ANGALIA KAMA UNATUMIA '/stores/:id' AU '/store/:id'!
                    window.open(`/stores/${store.id}`, '_blank'); 
                  }}
                />
              </div>
            );
          })}
        </div>
        
        {showRightArrow && (
          <button 
            className="absolute z-10 w-6 h-6 md:w-9 md:h-9 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all top-1/2 -translate-y-1/2 text-black dark:text-white hover:bg-[#f97316] hover:text-white hover:border-[#f97316] hover:scale-105 active:scale-95 right-0 md:-right-1" 
            onClick={() => scroll('right')}
          > 
            <ChevronRight size={16} className="md:w-6 md:h-6" />
          </button>
        )}
      </div>
    </div>
  );
}