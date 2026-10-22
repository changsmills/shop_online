import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, TrendingUp, ArrowRight } from "lucide-react";
import api from "../axiosConfig";
import DashboardCard from "./DashboardCard";
import SkeletonCardz from "./SkeletonCardz"; // 🔥 IMPORT SAHIHI (SkeletonCardz)
import { useTranslation } from 'react-i18next';
//import '../TrendingNow.css';

export default function TrendingNow({ navigate, selectedCategory, getCategoryDisplayName }) {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const fetchTrending = async () => {
  setLoading(true);
  try {
    const params = {
      limit: 10,
      ordering: '-order_count,-views',
    };
    if (selectedCategory?.id) params.parent_category = selectedCategory.id;

    const response = await api.get('/products/', { params });
    const productsData = response.data.results || response.data || [];

   const trendingProducts = productsData.filter(product => {
  const price = parseFloat(product.price) || 0;
  const originalPrice = parseFloat(product.original_price) || 0;
  
  // Ondoa Top Deals (bidhaa zenye punguzo)
  const isDiscounted = originalPrice > 0 && originalPrice < price;
  if (isDiscounted) return false;
  
  // Chuja kwa mauzo au views (kiwango cha chini - kitu chochote)
  const orderCount = parseInt(product.order_count) || 0;
  const views = parseInt(product.views) || 0;
  
  return orderCount > 0 || views > 0;  // ✅ Badilisha 100 → 0
});

    setProducts(trendingProducts);
  } catch (err) {
    console.error("Trending Fetch Error:", err.message);
  } finally {
    setLoading(false);
  }
};
    fetchTrending();
  }, [selectedCategory, i18n.language]);

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
  }, [products]);

  // ============================================================
  // 🔥 RENDER HEADER (Imejumuishwa kwa pande zote)
  // ============================================================
   const renderHeader = () => (
    <div className="flex justify-between items-center px-3 md:px-5 py-2 md:py-3 bg-[#fff7ed] dark:bg-[#1e293b] dark:border-b dark:border-[#334155] rounded-t-xl mb-2.5 md:mb-4 text-black dark:text-white">
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 md:gap-2.5">
          <TrendingUp className="text-[#8b5cf6] dark:text-[#a78bfa] w-[18px] h-[18px] md:w-6 md:h-6" />
          <h2 className="text-sm md:text-base lg:text-xl font-bold m-0 text-black dark:text-white">
            {t('hot_picks')}
          </h2>
        </div>
        
        <p className="text-[10px] md:text-xs lg:text-sm text-[#888] dark:text-[#94a3b8] m-0 mt-1 lg:mt-0 lg:pl-[34px]">
          {t('check_popular_items')}
        </p>
      </div>
      
      <div className="flex items-center">
        <button 
          className="bg-transparent border-none cursor-pointer flex items-center justify-center text-black dark:text-white p-1 transition-transform hover:translate-x-1 hover:text-[#8b5cf6] active:scale-95"
          onClick={() => {
            const url = '/products?sectionName=Hot+Picks';
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
  // 🔥 SKELETON LOADING - Inaonyesha skeleton cards wakati data inapakia
  // ============================================================
  if (loading) {
    return (
      <div className="relative w-full bg-white dark:bg-[#1e293b] border-y border-[#e5e7eb] dark:border-[#334155] py-4 box-border">
        {renderHeader()}

        <div className="relative flex items-center px-2">
          <div className="flex flex-nowrap overflow-x-auto overflow-y-hidden scroll-smooth px-1 py-2 pb-4 w-full gap-2 md:gap-3 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
  // EMPTY STATE - Hakuna bidhaa
  // ============================================================
  if (products.length === 0) return null;

  // ============================================================
  // SUCCESS STATE - Onyesha bidhaa
  // ============================================================
  return (
  
    <div className="relative w-full bg-white dark:bg-[#1e293b] border-y border-[#e5e7eb] dark:border-[#334155] py-4 box-border">
      
     {renderHeader()}

      {/* Horizontal Scroll */}
      <div className="relative flex items-center px-2">
         {showLeftArrow && (
          <button 
            className="absolute z-10 w-6 h-6 md:w-9 md:h-9 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all top-1/2 -translate-y-1/2 text-black dark:text-white hover:bg-[#8b5cf6] hover:text-white hover:border-[#8b5cf6] hover:scale-105 active:scale-95 left-0 md:-left-1" 
            onClick={() => scroll('left')}
          >
          <ChevronLeft size={16} className="md:w-6 md:h-6" />

          </button>
        )}
        
        <div ref={scrollContainerRef} className="flex flex-nowrap overflow-x-auto overflow-y-hidden scroll-smooth px-1 py-2 pb-4 w-full gap-2 md:gap-3 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {products.map((item, index) => (
            <div key={item.id} className="flex-[0_0_calc((100%-17.6px)/2.2)] min-w-[calc((100%-17.6px)/2.2)] sm:flex-[0_0_calc((100%-35px)/3.5)] sm:min-w-[calc((100%-35px)/3.5)] md:flex-[0_0_calc((100%-54px)/4.5)] md:min-w-[calc((100%-54px)/4.5)] lg:flex-[0_0_calc((100%-78px)/6.5)] lg:min-w-[calc((100%-78px)/6.5)] snap-start"
            >
              <DashboardCard
                image={item.cover_image_url || item.cover_image}
               // title={item.name}
                price={item.price}
                views={item.views}
                rank={index + 1}
                isVerified={item.is_verified || item.store?.is_verified}
                onClick={() => {
                  const queryParams = {
                    ...(selectedCategory?.id && { categoryId: selectedCategory.id }),
                    categoryName: selectedCategory?.name || 'All',
                    sectionName: `${t('hot_picks')} ${selectedCategory ? `${t('in')} ${selectedCategory.name}` : ''}`,
                    sortBy: 'order_count',
                    order: 'desc',
                    priorityId: item.id
                  };
                  const params = new URLSearchParams(queryParams).toString();
                  const url = `/products?${params}`;
                  window.open(url, '_blank');
                }}
              />
            </div>
          ))}
        </div>
        
        {showRightArrow && (
          <button 
            className="absolute z-10 w-6 h-6 md:w-9 md:h-9 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all top-1/2 -translate-y-1/2 text-black dark:text-white hover:bg-[#8b5cf6] hover:text-white hover:border-[#8b5cf6] hover:scale-105 active:scale-95 right-0 md:-right-1" 
            onClick={() => scroll('right')}
          >                       
           <ChevronRight size={16} className="md:w-6 md:h-6" />

          </button>
        )}
      </div>
    </div>
  );
}