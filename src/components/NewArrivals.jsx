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
          limit: 10
        };
        if (selectedCategory?.id) params.parent_category = selectedCategory.id;

        const response = await api.get('/products/', { params });
        const productsData = response.data.results || response.data || [];
        setProducts(productsData);
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
        <div className="na-title-group">
          <Sparkles className="na-sparkle-icon" />
          <h2 className="na-title">
            {t('new_arrivals')}
          </h2>
          
          {/* ✅ ONGEZA SUBTITLE HAPA CHINI YA TITLE */}
          <p className="na-subtitle">
            {t('discover_latest_arrivals')}
          </p>
        </div>
      </div>
      
      {/* 🔥 UPANDE WA KULIA: MSHALE TU */}
      <div className="na-header-right">
        <button 
          className="na-arrow-link-btn"
          onClick={() => {
            const url = '/products?section=new-arrivals'; 
            window.location.href = url; 
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
                image={product.cover_image || ''}
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