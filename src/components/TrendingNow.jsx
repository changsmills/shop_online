import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, TrendingUp, ArrowRight } from "lucide-react";
import api from "../axiosConfig";
import DashboardCard from "./DashboardCard";
import SkeletonCardz from "./SkeletonCardz"; // 🔥 IMPORT SAHIHI (SkeletonCardz)
import { useTranslation } from 'react-i18next';
import '../TrendingNow.css';

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
        setProducts(productsData);
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
    <div className="trend-header">
      <div className="trend-header-left">
        <div className="trend-title-group">
          <TrendingUp className="trend-icon" />
          <h2 className="trend-title">
            {t('hot_picks')}
          </h2>
        </div>
        
        {/* ✅ ONGEZA SUBTITLE HAPA CHINI YA TITLE */}
        <p className="trend-subtitle">
          {t('check_popular_items')}
        </p>
      </div>
      
      <div className="trend-header-right">
        <button 
          className="trend-arrow-link-btn"
          onClick={() => {
            const url = '/products?section=hot-picks'; 
            window.location.href = url; 
          }}
        >
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );

  // ============================================================
  // 🔥 SKELETON LOADING - Inaonyesha skeleton cards wakati data inapakia
  // ============================================================
  if (loading) {
    return (
      <div className="trending-main-wrapper">
        
              {renderHeader()}


        {/* 🔥 SKELETON SCROLL - Inaonyesha skeleton 5 kwa horizontal scroll */}
        <div className="trend-desktop-wrapper">
          <div className="trend-scroll-wrapper hide-scrollbar">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="trend-card-wrapper">
                <SkeletonCardz /> {/* ✅ SkeletonCardz */}
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
    <div className="trending-main-wrapper">
      
     {renderHeader()}

      {/* Horizontal Scroll */}
      <div className="trend-desktop-wrapper">
        {showLeftArrow && (
          <button className="trend-arrow-btn trend-arrow-left" onClick={() => scroll('left')}>
            <ChevronLeft size={24} />
          </button>
        )}
        
        <div ref={scrollContainerRef} className="trend-scroll-wrapper hide-scrollbar">
          {products.map((item, index) => (
            <div key={item.id} className="trend-card-wrapper">
              <DashboardCard
                image={item.cover_image}
                title={item.name}
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
          <button className="trend-arrow-btn trend-arrow-right" onClick={() => scroll('right')}>
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
}