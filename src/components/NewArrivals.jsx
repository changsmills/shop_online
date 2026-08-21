// src/components/NewArrivals.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, ArrowRight } from "lucide-react";
import api from "../axiosConfig";
import DashboardCard from "./DashboardCard";
import SkeletonCardz from "./SkeletonCardz";
import { useTranslation } from 'react-i18next';
import '../NewArrivals.css';

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
    if (selectedCategory?.id) params.parent_category = selectedCategory.id;

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
    <div className="na-header">
      <div className="na-header-left">
        
        {/* 🔥 1. Title na Icon ziko kwenye kikundi chake (zitakaa upande kwa upande) */}
        <div className="na-title-group">
          <Sparkles className="na-sparkle-icon" />
          <h2 className="na-title">
            {t('new_arrivals')}
          </h2>
        </div>
        
        {/* 🔥 2. Subtitle sasa iko NJE ya kikundi hicho, kwa hiyo itakaa CHINI ya title! */}
        <p className="na-subtitle">
          {t('discover_latest_arrivals')}
        </p>
        
      </div>
      
      {/* 🔥 UPANDE WA KULIA: MSHALE TU */}
      <div className="na-header-right">
        <button 
          className="na-arrow-link-btn"
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
      <div className="new-arrivals-main-wrapper">

        {renderHeader()}

        <div className="na-desktop-wrapper">
          <div className="na-scroll-wrapper hide-scrollbar">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="na-card-wrapper">
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
    <div className="new-arrivals-main-wrapper">
      
            {renderHeader()}


      {/* Horizontal Scroll */}
      <div className="na-desktop-wrapper">
        {showLeftArrow && (
          <button className="na-arrow-btn na-arrow-left" onClick={() => scroll('left')}>
            <ChevronLeft size={24} />
          </button>
        )}
        
        <div ref={scrollContainerRef} className="na-scroll-wrapper hide-scrollbar">
          {products.map((product) => (
            <div key={product.id} className="na-card-wrapper">
              <DashboardCard
                image={product.cover_image_url || product.cover_image || ''}
                title={product.name || ''}
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
        
        {showRightArrow && (
          <button className="na-arrow-btn na-arrow-right" onClick={() => scroll('right')}>
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
}