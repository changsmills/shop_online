// src/components/RecentlyViewed.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, History, ArrowRight } from "lucide-react"; // 🔥 Ongeza ArrowRight!
import api from "../axiosConfig";
import DashboardCard from "./DashboardCard";
import SkeletonCardz from "./SkeletonCardz";
import { useTranslation } from 'react-i18next';
import '../RecentlyViewed.css';

export default function RecentlyViewed({ navigate }) {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      setLoading(true);
      const storedIds = localStorage.getItem("recentlyViewed");
      const ids = storedIds ? JSON.parse(storedIds) : [];
      
      if (ids.length > 0) {
        try {
          const response = await api.get('/products/', {
            params: { id__in: ids.join(',') }
          });
          const data = response.data.results || response.data || [];

          if (data) {
            const sortedData = ids
              .map(id => data.find(p => p.id === id))
              .filter(Boolean);
            setProducts(sortedData);
          }
        } catch (err) {
          console.error("Error fetching recently viewed:", err.message);
        }
      }
      setLoading(false);
    };
    fetchRecentlyViewed();
  }, [i18n.language]);

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
    <div className="rv-header">
      <div className="rv-header-left">
        <div className="rv-title-group">
          <History className="rv-history-icon" />
          <h2 className="rv-title">{t('recently_viewed')}</h2>
        </div>
        
        {/* ✅ ONGEZA SUBTITLE HAPA CHINI YA TITLE */}
        <p className="rv-subtitle">{t('items_you_recently_viewed')}</p>
      </div>
      
      <div className="rv-header-right">
        <button 
          className="rv-arrow-link-btn"
          onClick={() => {
            const url = '/products?section=recently-viewed'; 
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
      <div className="recently-viewed-main-wrapper">

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

  // ============================================================
  // EMPTY STATE
  // ============================================================
  if (products.length === 0) return null;

  // ============================================================
  // SUCCESS STATE
  // ============================================================
  return (
    <div className="recently-viewed-main-wrapper">
      
      {/* ✅ SASA HAPA TUNATAJA renderHeader() ILI IPATE MSHALE WAKO WA ArrowRight */}
      {renderHeader()}

      {/* Horizontal Scroll */}
      <div className="rv-desktop-wrapper">
        {showLeftArrow && (
          <button className="rv-arrow-btn rv-arrow-left" onClick={() => scroll('left')}>
            <ChevronLeft size={24} />
          </button>
        )}
        
        <div ref={scrollContainerRef} className="rv-scroll-wrapper hide-scrollbar">
          {products.map((product) => (
            <div key={product.id} className="rv-card-wrapper">
              <DashboardCard
                image={product.cover_image || ''}
                title={product.name || ''}
                price={product.price || 'TSh 0'}
                originalPrice={product.original_price || ''}
                moq={product.moq || ''}
                rating={product.rating || ''}
                verified={product.is_verified || product.store?.is_verified || false}
                years={product.years || ''}
                views={product.views || 0}
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
        
        {showRightArrow && (
          <button className="rv-arrow-btn rv-arrow-right" onClick={() => scroll('right')}>
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
}