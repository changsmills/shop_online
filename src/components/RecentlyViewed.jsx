import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, History, ArrowRight } from "lucide-react";
import api from "../axiosConfig";
import DashboardCard from "./DashboardCard";
import SkeletonCardz from "./SkeletonCardz";
import { useTranslation } from 'react-i18next';
// import '../RecentlyViewed.css'; // ❌ IMEONDOLEWA

export default function RecentlyViewed({ navigate, compact = false }) {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0); // Kwa Dots

  // Fetch data
  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      setLoading(true);
      const storedIds = localStorage.getItem("recentlyViewed");
      const ids = storedIds ? JSON.parse(storedIds) : [];
      
      if (ids.length > 0) {
        try {
          const response = await api.get('/products/', { params: { id__in: ids.join(',') } });
          const data = response.data.results || response.data || [];
          if (data) {
            const sortedData = ids.map(id => data.find(p => p.id === id)).filter(Boolean);
            setProducts(sortedData);
          }
        } catch (err) { console.error("Error fetching recently viewed:", err.message); }
      }
      setLoading(false);
    };
    fetchRecentlyViewed();
  }, [i18n.language]);

  // Scroll position
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);

      // Hesabu kadi iliyoonekana (Desktop tu kwa Standard mode)
      if (window.innerWidth > 1024 && !compact) {
        const cardWidth = scrollContainerRef.current.clientWidth;
        setActiveIndex(Math.round(scrollLeft / cardWidth));
      } else if (compact) {
        // Kwa compact mode, hesabu index kulingana na upana wa card moja
        const cardWidth = scrollContainerRef.current.clientWidth;
        setActiveIndex(Math.round(scrollLeft / cardWidth));
      }
    }
  };

  const scrollToIndex = (index) => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth > 1024 || compact ? scrollContainerRef.current.clientWidth : 300;
      scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  // Add scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      setTimeout(checkScrollPosition, 100);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, [products, compact]);

  // Header
  const renderHeader = () => (
    <div className={`flex justify-between items-center ${compact ? 'p-0 mb-2.5 bg-transparent border-none' : 'px-3 md:px-5 py-2 md:py-3 bg-[#fff7ed] dark:bg-[#1a1a2e] border-b border-transparent dark:border-[#334155] rounded-t-xl mb-2.5 md:mb-4'} text-black dark:text-white`}>
      <div className="flex flex-col">
        <div className={`flex items-center ${compact ? 'gap-1.5' : 'gap-1.5 md:gap-2.5'}`}>
          <History className={`text-[#10b981] dark:text-[#34d399] ${compact ? 'w-4.5 h-4.5' : 'w-4 h-4 md:w-6 md:h-6'}`} />
          <h2 className={`font-bold m-0 text-black dark:text-white ${compact ? 'text-base' : 'text-sm md:text-base lg:text-xl'}`}>
            {t('recently_viewed')}
          </h2>
        </div>
        {/* FICHA SUBTITLE IKIWA COMPACT */}
        {!compact && (
          <p className="text-[10px] md:text-xs lg:text-sm text-[#888] dark:text-[#94a3b8] m-0 mt-1 lg:mt-0 lg:pl-[34px]">
            {t('items_you_recently_viewed')}
          </p>
        )}
      </div>
      
      <div className={`flex items-center ${compact ? 'hidden' : ''}`}>
        <button 
          className="bg-transparent border-none cursor-pointer flex items-center justify-center text-black dark:text-white p-1 transition-transform hover:translate-x-1 hover:text-[#f97316] active:scale-95"
          onClick={() => {
            const url = '/products?section=recently-viewed'; 
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

  // Loading skeleton
  if (loading) {
    return (
      <div className={`relative w-full ${compact ? 'h-full flex flex-col bg-transparent border-none p-0 overflow-hidden' : 'bg-white dark:bg-[#1e293b] border-y border-[#e5e7eb] dark:border-[#334155] py-4 box-border'}`}>
        {renderHeader()}
        <div className="relative flex items-center px-2">
          <div className={`flex flex-nowrap overflow-x-auto overflow-y-hidden scroll-smooth px-1 py-2 w-full snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${compact ? 'gap-0 p-0 flex-1 min-h-0' : 'gap-2 md:gap-3 pb-4'}`}>
            {Array.from({ length: 5 }).map((_, index) => (
              <div 
                key={`skeleton-${index}`} 
                className={`${compact ? 'flex-[0_0_100%] min-w-[100%] max-w-[100%] snap-center m-0 h-full flex flex-col' : 'flex-[0_0_calc((100%-17.6px)/2.2)] min-w-[calc((100%-17.6px)/2.2)] sm:flex-[0_0_calc((100%-35px)/3.5)] sm:min-w-[calc((100%-35px)/3.5)] md:flex-[0_0_calc((100%-54px)/4.5)] md:min-w-[calc((100%-54px)/4.5)] lg:flex-[0_0_calc((100%-78px)/6.5)] lg:min-w-[calc((100%-78px)/6.5)] snap-start'}`}
              >
                <SkeletonCardz />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

     if (!compact) {
      return null;
    }
        

  // Main render
  return (
    <div className={`relative w-full ${compact ? 'h-full flex flex-col bg-transparent border-none p-0 overflow-hidden' : 'bg-white dark:bg-[#1e293b] border-y border-[#e5e7eb] dark:border-[#334155] py-4 box-border'}`}>
      {renderHeader()}
      
      {/* Carousel Container */}
      <div className="relative flex items-center px-2">
        
        {/* Mshale wa Kushoto - Desktop tu au Compact */}
        {showLeftArrow && (window.innerWidth > 1024 || compact) && (
          <button 
            className={`absolute z-10 rounded-full flex items-center justify-center shadow-md transition-all top-1/2 -translate-y-1/2 active:scale-95 ${compact ? 'w-10 h-10 bg-white text-[#333] hover:bg-[#ff6a00] hover:text-white hover:border-[#ff6a00] border border-[#eee] left-1' : 'w-6 h-6 md:w-9 md:h-9 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] text-black dark:text-white hover:bg-[#10b981] hover:text-white hover:border-[#10b981] hover:scale-105 left-0 md:-left-1'}`}
            onClick={() => scroll('left')}
          >
            <ChevronLeft size={compact ? 20 : 16} className={compact ? '' : 'md:w-6 md:h-6'} />
          </button>
        )}
        
        <div 
          ref={scrollContainerRef} 
          className={`flex flex-nowrap overflow-x-auto overflow-y-hidden scroll-smooth px-1 py-2 w-full snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${compact ? 'gap-0 p-0 flex-1 min-h-0' : 'gap-2 md:gap-3 pb-4'}`}
        >
          {products.map((product) => (
            <div 
              key={product.id} 
              className={`${compact ? 'flex-[0_0_100%] min-w-[100%] max-w-[100%] snap-center m-0 h-full flex flex-col' : 'flex-[0_0_calc((100%-17.6px)/2.2)] min-w-[calc((100%-17.6px)/2.2)] sm:flex-[0_0_calc((100%-35px)/3.5)] sm:min-w-[calc((100%-35px)/3.5)] md:flex-[0_0_calc((100%-54px)/4.5)] md:min-w-[calc((100%-54px)/4.5)] lg:flex-[0_0_calc((100%-78px)/6.5)] lg:min-w-[calc((100%-78px)/6.5)] snap-start'}`}
            >
              <DashboardCard
                image={product.cover_image_url || product.cover_image || ''}
                displayMode="image-only"
                onClick={() => {
                  const priorityId = product.id;
                  const sectionName = encodeURIComponent(t('recently_viewed'));
                  const url = `/products?priorityId=${priorityId}&sectionName=${sectionName}`;
                  window.open(url, '_blank');
                }}
              />
            </div>
          ))}
        </div>
        
        {/* Mshale wa Kulia - Desktop tu au Compact */}
        {showRightArrow && (window.innerWidth > 1024 || compact) && (
          <button 
            className={`absolute z-10 rounded-full flex items-center justify-center shadow-md transition-all top-1/2 -translate-y-1/2 active:scale-95 ${compact ? 'w-10 h-10 bg-white text-[#333] hover:bg-[#ff6a00] hover:text-white hover:border-[#ff6a00] border border-[#eee] right-1' : 'w-6 h-6 md:w-9 md:h-9 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] text-black dark:text-white hover:bg-[#10b981] hover:text-white hover:border-[#10b981] hover:scale-105 right-0 md:-right-1'}`}
            onClick={() => scroll('right')}
          >
            <ChevronRight size={compact ? 20 : 16} className={compact ? '' : 'md:w-6 md:h-6'} />
          </button>
        )}
      </div>

      {/* Dots - Desktop tu kwa Standard, au kwa Compact Mode */}
      {products.length > 1 && (window.innerWidth > 1024 || compact) && (
        <div className="flex justify-center gap-2 mt-2.5">
          {products.map((_, idx) => (
            <button
              key={idx}
              className={`h-2 rounded-full border-none cursor-pointer transition-all ${activeIndex === idx ? 'bg-[#ff6a00] w-5' : 'bg-gray-300 w-2'}`}
              onClick={() => scrollToIndex(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}