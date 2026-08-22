import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, History, ArrowRight } from "lucide-react";
import api from "../axiosConfig";
import DashboardCard from "./DashboardCard";
import SkeletonCardz from "./SkeletonCardz";
import { useTranslation } from 'react-i18next';
import '../RecentlyViewed.css';

// 🔥 ONGEZA compact = false HAPA!
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

      // Hesabu kadi iliyoonekana (Desktop tu)
      if (window.innerWidth > 1024) {
        const cardWidth = scrollContainerRef.current.clientWidth;
        setActiveIndex(Math.round(scrollLeft / cardWidth));
      }
    }
  };

  const scrollToIndex = (index) => {
    if (scrollContainerRef.current && window.innerWidth > 1024) {
      const cardWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth > 1024 ? scrollContainerRef.current.clientWidth : 300;
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
  }, [products]);

  // Header - Mshale tu upande wa kulia, Ficha subtitle kwenye compact
  const renderHeader = () => (
    <div className="rv-header">
      <div className="rv-header-left">
        <div className="rv-title-group">
          <History className="rv-history-icon" />
          <h2 className="rv-title">{t('recently_viewed')}</h2>
        </div>
        {/* 🔥 FICHA SUBTITLE IKIWA COMPACT */}
        {!compact && <p className="rv-subtitle">{t('items_you_recently_viewed')}</p>}
      </div>
      
      <div className="rv-header-right">
        <button 
          className="rv-arrow-link-btn"
          onClick={() => {
            const url = '/products?section=recently-viewed'; 
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

  // Loading skeleton - 🔥 ONGEZA compact class
  if (loading) {
    return (
      <div className={`recently-viewed-main-wrapper ${compact ? 'compact-mode' : ''}`}>
        {renderHeader()}
        <div className="rv-desktop-wrapper">
          <div className="rv-scroll-wrapper hide-scrollbar">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="rv-card-wrapper">
                <SkeletonCardz />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) return null;

  // Main render - 🔥 ONGEZA compact class
  return (
    <div className={`recently-viewed-main-wrapper ${compact ? 'compact-mode' : ''}`}>
      {renderHeader()}
      
      {/* Carousel Container */}
      <div className="rv-desktop-wrapper">
        {/* Mshale wa Kushoto - Desktop tu */}
        {showLeftArrow && window.innerWidth > 1024 && (
          <button className="rv-arrow-btn rv-arrow-left" onClick={() => scroll('left')}>
            <ChevronLeft size={24} />
          </button>
        )}
        
        <div ref={scrollContainerRef} className="rv-scroll-wrapper hide-scrollbar">
          {products.map((product) => (
            <div key={product.id} className="rv-card-wrapper">
              <DashboardCard
  image={product.cover_image_url || product.cover_image || ''}
 // title={product.name || ''} // 🔥 RUDISHA HII (Lakini itaonekana kama jina tu, sio bei!)
  // price={product.price || 'TSh 0'} // 🔥 ONDOA HII KWA SASA
  displayMode="image-only" // 🔥 PICHA NA JINA TU (Sio bei!)
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
        
        {/* Mshale wa Kulia - Desktop tu */}
        {showRightArrow && window.innerWidth > 1024 && (
          <button className="rv-arrow-btn rv-arrow-right" onClick={() => scroll('right')}>
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Dots - Desktop tu */}
      {products.length > 1 && window.innerWidth > 1024 && (
        <div className="dots-container">
          {products.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${activeIndex === idx ? 'active' : ''}`}
              onClick={() => scrollToIndex(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}