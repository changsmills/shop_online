// src/components/RecentlyViewed.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, History } from "lucide-react";
import api from "../axiosConfig"; // 🔥 BADILISHA: Tumia api badala ya axios!
import DashboardCard from "./DashboardCard";
import { useTranslation } from 'react-i18next';
import '../RecentlyViewed.css';

// 🔥 ONDOA API_BASE_URL – ipo kwenye api config!

export default function RecentlyViewed({ navigate, isMobile }) {
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
          // 🔥 BADILISHA: Tumia api.get, sio axios.get!
          const response = await api.get('/products/', {
            params: { id__in: ids.join(',') }
          });

          // 🔥 KAGUA PAGINATION – DRF inarudisha { results: [...] }
          const data = response.data.results || response.data || [];

          if (data) {
            // Mantiki ya kupanga data kufuatana na mpangilio wa IDs kwenye localStorage
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
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && !isMobile) {
      container.addEventListener('scroll', checkScrollPosition);
      setTimeout(checkScrollPosition, 100);
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, [products, isMobile]);

  if (loading) return null;
  if (products.length === 0) return null;

  return (
    <div className="recently-viewed-main-wrapper">
      
      {/* Header Section - Responsive via CSS */}
      <div className="rv-header">
        <div className="rv-header-left">
          <div className="rv-title-group">
            <History className="rv-history-icon" />
            <h2 className="rv-title">{t('recently_viewed')}</h2>
          </div>
          <p className="rv-subtitle">{t('items_you_recently_viewed')}</p>
        </div>

        {products.length > 6 && (
          <button 
            className="rv-view-more-btn"
            onClick={() => navigate('/products', { 
              state: { 
                sectionName: t('recently_viewed')
              } 
            })}
          >
            <span>{t('view_more')}</span>
            <ChevronRight size={isMobile ? 10 : 16} />
          </button>
        )}
      </div>

      {/* ========== MOBILE VIEW: Horizontal Scroll ========== */}
      {isMobile ? (
        <div className="rv-mobile-scroll hide-scrollbar-mobile">
          {products.map((product) => (
            <div key={product.id} className="rv-mobile-card-wrapper">
              <DashboardCard
                image={product.cover_image}
                price={product.price}
                originalPrice={product.original_price}
                views={product.views}
                isMobile={isMobile}
                onClick={() => navigate('/products', {
                  state: {
                    priorityId: product.id,
                    sectionName: t('recently_viewed')
                  }
                })}
              />
            </div>
          ))}
        </div>
      ) : (
        /* ========== DESKTOP VIEW: Horizontal Scroll with Arrows ========== */
        <div className="rv-desktop-wrapper">
          {showLeftArrow && (
            <button className="rv-arrow-btn rv-arrow-left" onClick={() => scroll('left')}>
              <ChevronLeft size={24} />
            </button>
          )}
          
          <div ref={scrollContainerRef} className="rv-desktop-scroll hide-scrollbar-desktop">
            {products.map((product) => (
              <div key={product.id} className="rv-desktop-card-wrapper">
                <DashboardCard
                  image={product.cover_image}
                  price={product.price}
                  originalPrice={product.original_price}
                  views={product.views}
                  isMobile={isMobile}
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
      )}
    </div>
  );
}