// src/components/NewArrivals.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { supabase } from "../supabaseClient";
import DashboardCard from "./DashboardCard";
import { useTranslation } from 'react-i18next';
import '../NewArrivals.css';  // ✅ ONGEZA HII

export default function NewArrivals({ navigate, selectedCategory, isMobile }) {
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
        let query = supabase
          .from('products_engines')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (selectedCategory?.id) {
          query = query.eq('parent_category_id', selectedCategory.id);
        }

        const { data, error } = await query;
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("New Arrivals Fetch Error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, [selectedCategory]);

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

  if (loading) return (
    <div className="skeleton-loader-h" />
  );
  
  if (products.length === 0) return null;

  return (
    <div className="new-arrivals-main-wrapper">
      
      {/* Header Section */}
      <div className="na-header">
        <div className="na-header-left">
          <div className="na-title-group">
            <Sparkles className="na-sparkle-icon" />
            <h2 className="na-title">
              {selectedCategory && selectedCategory.id !== null ? (
                `${t('new_arrivals')} ${t('in')} ${getCategoryDisplayName(selectedCategory)}`
              ) : (
                t('new_arrivals')
              )}
            </h2>
          </div>
          <p className="na-subtitle">
            {selectedCategory && selectedCategory.id !== null ? (
              `${t('discover_latest_arrivals')} ${t('in')} ${getCategoryDisplayName(selectedCategory)}`
            ) : (
              t('discover_latest_arrivals')
            )}
          </p>
        </div>

        <button 
          className="na-view-more-btn"
          onClick={() => navigate('/products', { 
            state: { 
              sectionName: `${t('new_arrivals')} ${selectedCategory && selectedCategory.id !== null ? `${t('in')} ${selectedCategory.name}` : ''}`,
              categoryId: selectedCategory?.id,
              categoryName: selectedCategory?.name
            } 
          })}
        >
          <span>{t('view_more')}</span>
          <ChevronRight size={isMobile ? 10 : 16} />
        </button>
      </div>

      {/* ========== MOBILE VIEW: Horizontal Scroll ========== */}
      {isMobile ? (
        <div className="na-mobile-scroll hide-scrollbar-mobile">
          {products.map((product) => (
            <div key={product.id} className="na-mobile-card-wrapper">
              <DashboardCard
                image={product.cover_image}
                title={product.name}
                price={product.price}
                originalPrice={product.original_price}
                views={product.views}
                isMobile={isMobile}
                onClick={() => navigate('/products', {
                  state: {
                    priorityId: product.id,
                    sectionName: `${t('new_arrivals')} ${selectedCategory ? `${t('in')} ${selectedCategory.name}` : ''}`,
                    categoryId: selectedCategory?.id,
                    categoryName: selectedCategory?.name
                  }
                })}
              />
            </div>
          ))}
        </div>
      ) : (
        /* ========== DESKTOP VIEW: Horizontal Scroll with Arrows ========== */
        <div className="na-desktop-wrapper">
          {showLeftArrow && (
            <button className="na-arrow-btn na-arrow-left" onClick={() => scroll('left')}>
              <ChevronLeft size={24} />
            </button>
          )}
          
          <div ref={scrollContainerRef} className="na-desktop-scroll hide-scrollbar-desktop">
            {products.map((product) => (
              <div key={product.id} className="na-desktop-card-wrapper">
                <DashboardCard
                  image={product.cover_image}
                  title={product.name}
                  price={product.price}
                  originalPrice={product.original_price}
                  views={product.views}
                  isMobile={isMobile}
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
      )}

      {/* CSS ya scrollbar hiding iko kwenye NewArrivals.css sasa */}
    </div>
  );
}