// src/components/NewArrivals.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, ArrowRight } from "lucide-react";
import api from "../axiosConfig";
import DashboardCard from "./DashboardCard";
import SkeletonCardz from "./SkeletonCardz";
import { useTranslation } from 'react-i18next';
//import '../NewArrivals.css';

export default function NewArrivals({ navigate, selectedCategory }) {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const fetchNewArrivals = async () => {
  setLoading(true);
  try {
    const params = {
      ordering: '-created_at',
      limit: 30 // Ongeza limit kuwa 30 ili uwe na pool nzuri ya kuchuja
    };

// Kama kategoria ipo, NA sio "All", ndio tuma parent_category
if (selectedCategory?.id && selectedCategory.id !== 'all' && !selectedCategory.isAll) {
  params.parent_category = selectedCategory.id;
      }
    const response = await api.get('/products/', { params });
    const productsData = response.data.results || response.data || [];

    // 🔥 1. TAREHE YA MWISHO: Siku 30 zilizopita
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 🔥 2. CHUJA BIDHAA MPYA (ndani ya siku 30) NA ZISIZO NA PUNGUZO (Top Deals)
    let freshProducts = productsData.filter(p => {
      // A. Angalia kama ni ya siku 30
      const productDate = p.created_at ? new Date(p.created_at) : null;
      const isNew = productDate && productDate >= thirtyDaysAgo;

      // B. Angalia kama ni Top Deal (ina punguzo)
      const price = parseFloat(p.price) || 0;
      const originalPrice = parseFloat(p.original_price) || 0;
      const isTopDeal = originalPrice > 0 && originalPrice < price;

      // Rudi TRUE tu kama ni mpya NA si Top Deal
      return isNew && !isTopDeal;
    });

    // 🔥 3. FALLBACK: Kama hakuna bidhaa mpya isiyo na punguzo, tumia bidhaa za karibuni ambazo SI Top Deals
    if (freshProducts.length === 0) {
      freshProducts = productsData.filter(p => {
        const price = parseFloat(p.price) || 0;
        const originalPrice = parseFloat(p.original_price) || 0;
        const isTopDeal = originalPrice > 0 && originalPrice < price;
        return !isTopDeal; // Chukua bidhaa yoyote ambayo si Top Deal
      }).slice(0, 10); // Chukua 10 tu
    }

    setProducts(freshProducts);
  } catch (err) {
    console.error("New Arrivals Fetch Error:", err.message);
  } finally {
    setLoading(false);
  }
};
    fetchNewArrivals();
  }, [selectedCategory, i18n.language]);

  const getCategoryDisplayName = (category) => {
    if (!category) return '';
    return i18n.language === 'sw' ? (category.name_sw || category.name) : category.name;
  };

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
  // 🔥 RENDER HEADER (Inajumuisha mshale na peach background)
  // ============================================================
  const renderHeader = () => (
    <div className="flex justify-between items-center px-3 py-3 bg-[#fff7ed] dark:bg-black dark:border-b dark:border-[#334155] rounded-t-xl mb-4 text-black dark:text-white mt-50">
      <div className="flex flex-col">
        
        {/* 🔥 1. Title na Icon ziko kwenye kikundi chake (zitakaa upande kwa upande) */}
        <div className="flex items-center gap-2.5">
          <Sparkles className="text-[#f973161] dark:text-[#fbbf24] w-[18px] h-[18px] md:w-6 md:h-6" />
          <h2 className="text-sm md:text-base lg:text-xl font-bold m-0">
            {t('new_arrivals')}
          </h2>
        </div>
        
        {/* 🔥 2. Subtitle sasa iko NJE ya kikundi hicho, kwa hiyo itakaa CHINI ya title! */}
        <p className="text-[10px] md:text-xs lg:text-sm text-[#888] dark:text-[#94a3b8] m-0 mt-1 lg:mt-0 lg:pl-[34px]">
          {t('discover_latest_arrivals')}
        </p>
        
      </div>
      
      {/* 🔥 UPANDE WA KULIA: MSHALE TU */}
      <div className="flex items-center">
        <button 
          className="bg-transparent border-none cursor-pointer flex items-center justify-center text-black dark:text-white p-1 transition-transform hover:translate-x-1 hover:text-[#f97316] active:scale-95"
          onClick={() => {
            const url = '/products?sectionName=New+Arrivals'; 
            
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
  // SKELETON LOADING
  // ============================================================
  if (loading) {
    return (
      <div className="relative w-full bg-white dark:bg-black border-y border-[#e5e7eb] dark:border-[#334155] py-4">

        {renderHeader()}

        <div className="relative flex items-center px-2">
          <div className="flex flex-nowrap overflow-x-auto overflow-y-hidden scroll-smooth px-1 py-2 pb-4 w-full gap-2 md:gap-3 snap-mandatory [&::-webkit-scrollbar]:hidden[-ms-overflow-style:none] [scrollbar-width:none]">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="flex-[0_0_calc((100%-17.6px)/2.2)] min-w-[calc((100%-17.6px)/2.2)] sm:flex-[0_0_calc((100%-35px)/3.5)] sm:min-w-[calc((100%-35px)/3.5)] md:flex-[0_0_calc((100%-54px)/4.5)] md:min-w-[calc((100%-54px)/4.5)] lg:flex-[0_0_calc((100%-78px)/6.5)] lg:min-w-[calc((100%-78px)/6.5)] snap-start">
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
  if (products.length === 0) return null;

  // ============================================================
  // SUCCESS STATE
  // ============================================================
  return (
    <div className="relative w-full bg-white dark:bg-black border-y border-[#e5e7eb] dark:border-[#334155] py-4">
      
            {renderHeader()}

           {/* Horizontal Scroll */}
      <div className="relative flex items-center px-2">
        {/* LEFT ARROW */}
        {showLeftArrow && (
          <button 
            className="absolute z-20 w-8 h-8 md:w-9 md:h-9 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all top-1/2 -translate-y-1/2 text-black dark:text-white hover:bg-[#eab308] hover:text-white hover:border-[#eab308] hover:scale-105 active:scale-95 left-3 md:left-4" 
            onClick={() => scroll('left')}
          >
            <ChevronLeft size={20} className="md:w-6 md:h-6" />
          </button>
        )}
        
        <div ref={scrollContainerRef} className="flex flex-nowrap overflow-x-auto overflow-y-hidden scroll-smooth px-1 py-2 pb-4 w-full gap-2 md:gap-3 snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {products.map((product) => (
            <div key={product.id} className="flex-[0_0_calc((100%-17.6px)/2.2)] min-w-[calc((100%-17.6px)/2.2)] sm:flex-[0_0_calc((100%-35px)/3.5)] sm:min-w-[calc((100%-35px)/3.5)] md:flex-[0_0_calc((100%-54px)/4.5)] md:min-w-[calc((100%-54px)/4.5)] lg:flex-[0_0_calc((100%-78px)/6.5)] lg:min-w-[calc((100%-78px)/6.5)] snap-start">
              <DashboardCard
                image={product.cover_image_url || product.cover_image || ''}
                //title={product.name || ''}
                price={product.price || 'TSh 0'}
                originalPrice={product.original_price || ''}
                moq={product.moq || ''}
                rating={product.rating || ''}
                verified={product.is_verified || product.store?.is_verified || false}
                years={product.years || ''}
                onClick={() => {
                  const priorityId = product.id;
                  const sectionName = encodeURIComponent(`${t('new_arrivals')} ${selectedCategory ? `${t('in')} ${selectedCategory.name}` : ''}`);
                  const categoryId = selectedCategory?.id || '';
                  const categoryName = encodeURIComponent(selectedCategory?.name || 'All');
                  const url = `/products?priorityId=${priorityId}&sectionName=${sectionName}&categoryId=${categoryId}&categoryName=${categoryName}`;
                  window.open(url, '_blank');
                }}
              />
            </div>
          ))}
        </div>
        
        {/* RIGHT ARROW */}
        {showRightArrow && (
          <button 
            className="absolute z-20 w-8 h-8 md:w-9 md:h-9 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all top-1/2 -translate-y-1/2 text-black dark:text-white hover:bg-[#eab308] hover:text-white hover:border-[#eab308] hover:scale-105 active:scale-95 right-3 md:right-4" 
            onClick={() => scroll('right')}
          >
            <ChevronRight size={20} className="md:w-6 md:h-6" />
          </button>
        )}
      </div>
    </div>
  );
}