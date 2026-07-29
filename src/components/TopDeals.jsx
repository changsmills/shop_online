import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Flame } from "lucide-react";
import api from "../axiosConfig";
import DashboardCard from "./DashboardCard";
import SkeletonCard from "./SkeletonCardz"; // 🔥 IMPORT SKELETON
import { useTranslation } from 'react-i18next';
import '../TopDeals.css';

export default function TopDeals({ navigate, selectedCategory }) {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const getCategoryDisplayName = (category) => {
    if (!category) return '';
    return i18n.language === 'sw' ? (category.name_sw || category.name) : category.name;
  };

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory?.id) params.parent_category = selectedCategory.id;

        const response = await api.get('/products/', { params });
        const data = response.data.results || response.data || [];

        const calculatedDeals = data.map(product => {
          const beiYaKawaida = parseFloat(product.price) || 0;
          const beiYaOfa = parseFloat(product.original_price) || 0;
          
          let asilimia = 0;
          if (beiYaKawaida > beiYaOfa && beiYaOfa > 0) {
            asilimia = ((beiYaKawaida - beiYaOfa) / beiYaKawaida) * 100;
          }
          return { ...product, discountPercent: asilimia };
        });

        const sortedDeals = calculatedDeals
          .filter(p => p.discountPercent > 0 && p.discountPercent < 100)
          .sort((a, b) => b.discountPercent - a.discountPercent)
          .slice(0, 10);

        setProducts(sortedDeals);
      } catch (err) {
        console.error("Top Deals Fetch Error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, [selectedCategory, i18n.language]);

  const getDiscountPercentage = (originalPrice, currentPrice) => {
    const beiYaAwali = parseFloat(originalPrice) || 0;
    const beiYaOfa = parseFloat(currentPrice) || 0;
    
    if (beiYaAwali > 0 && beiYaAwali > beiYaOfa) {
      return Math.round(((beiYaAwali - beiYaOfa) / beiYaAwali) * 100);
    }
    return 0;
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
  // 🔥 SKELETON LOADING - Inaonyesha skeleton cards wakati data inapakia
  // ============================================================
  if (loading) {
    return (
      <div className="top-deals-main-wrapper">
        {/* Header Section */}
        <div className="td-header">
          <div className="td-header-left">
            <div className="td-title-group">
              <Flame className="td-flame-icon" />
              <h2 className="td-title">
                {t('top_deals')} {selectedCategory && `${t('in')} ${getCategoryDisplayName(selectedCategory)}`}
              </h2>
            </div>
            <p className="td-subtitle">
              {t('score_lowest_price')}
              {selectedCategory && ` ${t('in')} ${getCategoryDisplayName(selectedCategory)}`}
            </p>
          </div>
        </div>

        {/* 🔥 SKELETON SCROLL - Inaonyesha skeleton 5 kwa horizontal scroll */}
        <div className="td-desktop-wrapper">
          <div className="td-scroll-wrapper hide-scrollbar">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="td-card-wrapper">
                <SkeletonCard />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // EMPTY STATE - Hakuna deals
  // ============================================================
  if (products.length === 0) return null;

  // ============================================================
  // SUCCESS STATE - Onyesha deals
  // ============================================================
  return (
    <div className="top-deals-main-wrapper">
      
      {/* Header Section */}
      <div className="td-header">
        <div className="td-header-left">
          <div className="td-title-group">
            <Flame className="td-flame-icon" />
            <h2 className="td-title">
              {t('top_deals')} {selectedCategory && `${t('in')} ${getCategoryDisplayName(selectedCategory)}`}
            </h2>
          </div>
          <p className="td-subtitle">
            {t('score_lowest_price')}
            {selectedCategory && ` ${t('in')} ${getCategoryDisplayName(selectedCategory)}`}
          </p>
        </div>
      </div>

      {/* Horizontal Scroll */}
      <div className="td-desktop-wrapper">
        {showLeftArrow && (
          <button className="td-arrow-btn td-arrow-left" onClick={() => scroll('left')}>
            <ChevronLeft size={24} />
          </button>
        )}
        
        <div ref={scrollContainerRef} className="td-scroll-wrapper hide-scrollbar">
          {products.map((product) => {
            const discountPercent = getDiscountPercentage(product.price, product.original_price);
            return (
              <div key={product.id} className="td-card-wrapper">
                <DashboardCard
                  image={product.cover_image}
                  title={product.name}
                  price={product.original_price} 
                  originalPrice={product.price}  
                  moq={product.moq}
                  discountBadge={discountPercent > 0 ? `-${discountPercent}%` : null}
                  showProgress={true}
                  onClick={() => {
                    const priorityId = product.id;
                    const sectionName = encodeURIComponent(`Top Deals ${selectedCategory ? `in ${selectedCategory.name}` : ''}`);
                    const categoryId = selectedCategory?.id || '';
                    const url = `/products?priorityId=${priorityId}&sectionName=${sectionName}${categoryId ? `&categoryId=${categoryId}` : ''}`;
                    window.open(url, '_blank');
                  }}
                />
              </div>
            );
          })}
        </div>
        
        {showRightArrow && (
          <button className="td-arrow-btn td-arrow-right" onClick={() => scroll('right')}>
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
}