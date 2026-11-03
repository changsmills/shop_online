// src/components/TopDeals.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Flame, ArrowRight } from "lucide-react";
import api from "../axiosConfig";
import DashboardCard from "./DashboardCard";
import SkeletonCardz from "./SkeletonCardz";
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query'; // 1. Ingiza useQuery

// 2. Function ya kuchukua data (nje ya component)
const fetchDeals = async ({ queryKey }) => {
  const [_, categoryId] = queryKey;

  const params = {};
  if (categoryId && categoryId !== 'all') {
    params.parent_category = categoryId;
  }

  const response = await api.get('/products/', { params });
  const data = response.data.results || response.data || [];

  // Logic yako ya kupanga punguzo (discount)
  const calculatedDeals = data.map(product => {
    const beiYaKawaida = parseFloat(product.price) || 0;
    const beiYaOfa = parseFloat(product.original_price) || 0;

    let asilimia = 0;
    if (beiYaKawaida > beiYaOfa && beiYaOfa > 0) {
      asilimia = ((beiYaKawaida - beiYaOfa) / beiYaKawaida) * 100;
    }
    return { ...product, discountPercent: asilimia };
  });

  return calculatedDeals
    .filter(p => p.discountPercent > 0 && p.discountPercent < 100)
    .sort((a, b) => b.discountPercent - a.discountPercent)
    .slice(0, 10);
};

export default function TopDeals({ navigate, selectedCategory }) {
  const { t, i18n } = useTranslation();
  
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollPosRef = useRef(0);
  const prevCategoryKeyRef = useRef('');

  const categoryId = selectedCategory?.isAll ? 'all' : (selectedCategory?.id || 'all');

  // 3. Tumia useQuery
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['topDeals', categoryId, i18n.language],
    queryFn: fetchDeals,
    staleTime: 1000 * 60 * 5, // Cache kwa dakika 5
  });

  const getCategoryDisplayName = (category) => {
    if (!category) return '';
    return i18n.language === 'sw' ? (category.name_sw || category.name) : category.name;
  };

  const getDiscountPercentage = (originalPrice, currentPrice) => {
    const beiYaAwali = parseFloat(originalPrice) || 0;
    const beiYaOfa = parseFloat(currentPrice) || 0;

    if (beiYaAwali > 0 && beiYaAwali > beiYaOfa) {
      return Math.round(((beiYaAwali - beiYaOfa) / beiYaAwali) * 100);
    }
    return 0;
  };

  // ========== SCROLL HANDLERS ==========
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      scrollPosRef.current = scrollContainerRef.current.scrollLeft;
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

  // 🔥 Rejesha scroll — anza mwanzo kama category/language imebadilika
  useEffect(() => {
    const currentKey = `${selectedCategory?.id || 'all'}_${i18n.language}`;

    if (prevCategoryKeyRef.current !== currentKey) {
      prevCategoryKeyRef.current = currentKey;
      scrollPosRef.current = 0;
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = 0;
      }
      return;
    }

    if (scrollContainerRef.current && scrollPosRef.current > 0) {
      scrollContainerRef.current.scrollLeft = scrollPosRef.current;
    }
  }, [products, selectedCategory?.id, i18n.language]);

  const renderHeader = () => (
    <div className="flex justify-between items-center px-3 md:px-5 py-2 md:py-3 bg-[#fff7ed] dark:bg-[#1e293b] dark:border-b dark:border-[#334155] rounded-t-xl mb-2.5 md:mb-4 text-black dark:text-white">
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 md:gap-2.5">
          <Flame className="text-[#f97316] dark:text-[#fb923c] w-[18px] h-[18px] md:w-6 md:h-6" />
          <h2 className="text-sm md:text-base lg:text-xl font-bold m-0 text-black dark:text-white">
            {t('top_deals')}
          </h2>
        </div>

        <p className="text-[10px] md:text-xs lg:text-sm text-[#888] dark:text-[#94a3b8] m-0 mt-1 lg:mt-0 lg:pl-[34px]">
          {t('score_lowest_price')}
        </p>
      </div>

      <div className="flex items-center">
        <button
          className="bg-transparent border-none cursor-pointer flex items-center justify-center text-black dark:text-white p-1 transition-transform hover:translate-x-1 hover:text-[#f97316] active:scale-95"
          onClick={() => {
            const dealsUrl = '/products?sectionName=Top+Deals';
            if (window.innerWidth > 768) {
              window.open(dealsUrl, '_blank');
            } else {
              window.location.href = dealsUrl;
            }
          }}
        >
          <ArrowRight size={20} className="md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="relative w-full bg-white dark:bg-black border-y border-[#e5e7eb] dark:border-[#334155] py-4 box-border">
        {renderHeader()}
        <div className="relative flex items-center px-2">
          <div className="flex flex-nowrap overflow-x-auto overflow-y-hidden scroll-smooth px-1 py-2 pb-4 w-full gap-2 md:gap-3 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="flex-[0_0_calc((100%-17.6px)/2.2)] min-w-[calc((100%-17.6px)/2.2)] 
                sm:flex-[0_0_calc((100%-35px)/3.5)] sm:min-w-[calc((100%-35px)/3.5)] 
                md:flex-[0_0_calc((100%-54px)/4.5)] md:min-w-[calc((100%-54px)/4.5)] 
                lg:flex-[0_0_calc((100%-66px)/5.5)] lg:min-w-[calc((100%-66px)/5.5)] snap-start"
              >
                <SkeletonCardz />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="relative w-full bg-white dark:bg-black border-y border-[#e5e7eb] dark:border-[#334155] py-4 box-border">

      {renderHeader()}

      <div className="relative flex items-center px-2">
        {showLeftArrow && (
          <button
            className="absolute z-10 w-6 h-6 md:w-9 md:h-9 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all top-1/2 -translate-y-1/2 text-black dark:text-white hover:bg-[#f97316] hover:text-white hover:border-[#f97316] hover:scale-105 active:scale-95 left-0 md:-left-1"
            onClick={() => scroll('left')}
          >
            <ChevronLeft size={16} className="md:w-6 md:h-6" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex flex-nowrap overflow-x-auto overflow-y-hidden scroll-smooth px-1 py-2 pb-4 w-full gap-2 md:gap-3 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {products.map((product) => {
            const discountPercent = getDiscountPercentage(product.price, product.original_price);
            return (
              <div
                key={product.id}
                className="flex-[0_0_calc((100%-17.6px)/2.2)] min-w-[calc((100%-17.6px)/2.2)] 
                sm:flex-[0_0_calc((100%-35px)/3.5)] sm:min-w-[calc((100%-35px)/3.5)] 
                md:flex-[0_0_calc((100%-54px)/4.5)] md:min-w-[calc((100%-54px)/4.5)] 
                lg:flex-[0_0_calc((100%-66px)/5.5)] lg:min-w-[calc((100%-66px)/5.5)] snap-start"
              >
                <DashboardCard
                  image={product.cover_image_url || product.cover_image}
                  price={product.original_price || product.price}
                  originalPrice={product.price}
                  moq={product.moq}
                  rating={product.rating}
                  verified={product.verified || product.store?.is_verified}
                  years={product.years}
                  onClick={() => {
                    const leafId = product.leaf_category_id || '';
                    const subId = product.sub_category_id || ''; 
                    const parentId = product.parent_category_id || '';
                    
                    const categoryName = i18n.language === 'sw' 
                      ? (product.leaf_category_name_sw || product.leaf_category_name || product.category_name || 'All')
                      : (product.leaf_category_name || product.category_name || 'All');

                    const sectionName = encodeURIComponent('Top Deals');
                    const url = `/products?sectionName=${sectionName}&leafId=${leafId}&subId=${subId}&parentId=${parentId}&categoryName=${encodeURIComponent(categoryName)}`;
                    
                    window.open(url, '_blank');
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