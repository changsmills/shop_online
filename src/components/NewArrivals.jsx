// src/components/NewArrivals.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, ArrowRight } from "lucide-react";
import api from "../axiosConfig";
import DashboardCard from "./DashboardCard";
import SkeletonCardz from "./SkeletonCardz";
import { useTranslation } from 'react-i18next';

export default function NewArrivals({ navigate, selectedCategory }) {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // 🔥 Refs za cache / mount / abort / scroll
  const cacheRef = useRef({});
  const isMounted = useRef(true);
  const abortRef = useRef(null);
  const scrollPosRef = useRef(0);
  const prevCategoryKeyRef = useRef('');

  // 🔥 FETCH — cache + forceRefresh
  const fetchNewArrivals = async (forceRefresh = false) => {
    const cacheKey = `${selectedCategory?.id || 'all'}_${i18n.language}`;

    // 🔥 KINGA YA CACHE
    if (!forceRefresh && cacheRef.current[cacheKey]) {
      console.log("📦 [NewArrivals] Data ipo kwenye cache, haifetchi tena.");
      setProducts(cacheRef.current[cacheKey]);
      setLoading(false);
      return;
    }

    // 🔥 Futa request ya awali kama ipo
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    try {
      const params = {
        ordering: '-created_at',
        limit: 30,
      };

      if (selectedCategory?.id && selectedCategory.id !== 'all' && !selectedCategory.isAll) {
        params.parent_category = selectedCategory.id;
      }

      const response = await api.get('/products/', {
        params,
        signal: abortRef.current.signal,
      });
      const productsData = response.data.results || response.data || [];

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      let freshProducts = productsData.filter(p => {
        const productDate = p.created_at ? new Date(p.created_at) : null;
        const isNew = productDate && productDate >= thirtyDaysAgo;

        const price = parseFloat(p.price) || 0;
        const originalPrice = parseFloat(p.original_price) || 0;
        const isTopDeal = originalPrice > 0 && originalPrice < price;

        return isNew && !isTopDeal;
      });

      if (freshProducts.length === 0) {
        freshProducts = productsData.filter(p => {
          const price = parseFloat(p.price) || 0;
          const originalPrice = parseFloat(p.original_price) || 0;
          const isTopDeal = originalPrice > 0 && originalPrice < price;
          return !isTopDeal;
        }).slice(0, 10);
      }

      if (isMounted.current) {
        // 🔥 Hifadhi kwenye cache
        cacheRef.current[cacheKey] = freshProducts;
        setProducts(freshProducts);
      }
    } catch (err) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return;
      console.error("New Arrivals Fetch Error:", err.message);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  // 🔥 EFFECT YA KUANZISHA + KUFUATA CATEGORY/LANGUAGE
  useEffect(() => {
    isMounted.current = true;
    fetchNewArrivals();

    return () => {
      isMounted.current = false;
      if (abortRef.current) abortRef.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory?.id, i18n.language]);

  // 🔥 ONLINE LISTENER — mtandao ukirudi, fetch upya
  useEffect(() => {
    const handleOnline = () => {
      console.log("🌐 [NewArrivals] Mtandao umerudi! Inafetch data mpya...");
      fetchNewArrivals(true);
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCategoryDisplayName = (category) => {
    if (!category) return '';
    return i18n.language === 'sw' ? (category.name_sw || category.name) : category.name;
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

  // 🔥 REjesha scroll — lakini anza mwanzo kama category/language imebadilika
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
    <div className="flex justify-between items-center px-3 py-3 bg-[#fff7ed] dark:bg-black dark:border-b dark:border-[#334155] rounded-t-xl mb-4 text-black dark:text-white mt-50">
      <div className="flex flex-col">
        <div className="flex items-center gap-2.5">
          <Sparkles className="text-[#f973161] dark:text-[#fbbf24] w-[18px] h-[18px] md:w-6 md:h-6" />
          <h2 className="text-sm md:text-base lg:text-xl font-bold m-0">
            {t('new_arrivals')}
          </h2>
        </div>
        <p className="text-[10px] md:text-xs lg:text-sm text-[#888] dark:text-[#94a3b8] m-0 mt-1 lg:mt-0 lg:pl-[34px]">
          {t('discover_latest_arrivals')}
        </p>
      </div>

      <div className="flex items-center">
        <button
          className="bg-transparent border-none cursor-pointer flex items-center justify-center text-black dark:text-white p-1 transition-transform hover:translate-x-1 hover:text-[#f97316] active:scale-95"
          onClick={() => {
            const url = '/products?sectionName=New+Arrivals';
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

  if (loading) {
    return (
      <div className="relative w-full bg-white dark:bg-black border-y border-[#e5e7eb] dark:border-[#334155] py-4">
        {renderHeader()}
        <div className="relative flex items-center px-2">
          <div className="flex flex-nowrap overflow-x-auto overflow-y-hidden scroll-smooth px-1 py-2 pb-4 w-full gap-2 md:gap-3 snap-mandatory [&::-webkit-scrollbar]:hidden[-ms-overflow-style:none] [scrollbar-width:none]">
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
    <div className="relative w-full bg-[#f1f3f5] dark:bg-black border-y border-[#e5e7eb] dark:border-[#334155] py-4">
      {renderHeader()}
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
            <div
              key={product.id}
              className="flex-[0_0_calc((100%-17.6px)/2.2)] min-w-[calc((100%-17.6px)/2.2)] 
              sm:flex-[0_0_calc((100%-35px)/3.5)] sm:min-w-[calc((100%-35px)/3.5)] 
              md:flex-[0_0_calc((100%-54px)/4.5)] md:min-w-[calc((100%-54px)/4.5)] 
              lg:flex-[0_0_calc((100%-66px)/5.5)] lg:min-w-[calc((100%-66px)/5.5)] snap-start"
            >
              <DashboardCard
                image={product.cover_image_url || product.cover_image || ''}
                price={product.price || 'TSh 0'}
                originalPrice={product.original_price || ''}
                moq={product.moq || ''}
                rating={product.rating || ''}
                verified={product.is_verified || product.store?.is_verified || false}
                years={product.years || ''}
                                onClick={() => {
                  // 🔥 Chukua IDs zote tatu kutoka kwenye bidhaa
                  const leafId = product.leaf_category_id || '';
                  const subId = product.sub_category_id || ''; 
                  const parentId = product.parent_category_id || '';
                  
                  // 🔥 Chukua jina la bidhaa/category (kwa ajili ya bannerDesc)
                  const categoryName = i18n.language === 'sw' 
                    ? (product.leaf_category_name_sw || product.leaf_category_name || product.category_name || 'All')
                    : (product.leaf_category_name || product.category_name || 'All');

                  // 🔥 Tumia "New Arrivals" pekee kama sectionName (bila "in Category")
                  const sectionName = encodeURIComponent('New Arrivals');

                  // 🔥 Tengeneza URL na IDs zote (BILA priorityId!)
                  const url = `/products?sectionName=${sectionName}&leafId=${leafId}&subId=${subId}&parentId=${parentId}&categoryName=${encodeURIComponent(categoryName)}`;
                  
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