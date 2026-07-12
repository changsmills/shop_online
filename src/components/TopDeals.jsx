// src/components/TopDeals.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Flame } from "lucide-react";
import { supabase } from "../supabaseClient";
import DashboardCard from "./DashboardCard";
import { useTranslation } from 'react-i18next';
import '../TopDeals.css';  // ✅ ONGEZA HII

export default function TopDeals({ navigate, selectedCategory, isMobile }) {
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
        let query = supabase
          .from('products_engines')
          .select('*')
          .not('original_price', 'is', null)
          .gt('original_price', 0);

        if (selectedCategory?.id) {
          query = query.eq('parent_category_id', selectedCategory.id);
        }

        const { data, error } = await query;
        if (error) throw error;

        const calculatedDeals = (data || []).map(product => {
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
  },  [selectedCategory, i18n.language]);

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

        <button 
          className="td-view-more-btn"
          onClick={() => navigate('/products', { 
            state: { 
              sectionName: t('top_deals'),
              categoryId: selectedCategory?.id
            } 
          })}
        >
          <span>{t('view_more')}</span>
          <ChevronRight size={isMobile ? 10 : 16} />
        </button>
      </div>

      {/* ========== MOBILE VIEW ========== */}
      {isMobile ? (
        <div className="td-mobile-scroll hide-scrollbar-mobile">
          {products.map((product) => {
            const discountPercent = getDiscountPercentage(product.price, product.original_price);
            return (
              <div key={product.id} className="td-mobile-card-wrapper">
                <DashboardCard
                  image={product.cover_image}
                  title={product.name}
                  price={product.original_price} 
                  originalPrice={product.price}  
                  moq={product.moq}
                  discountBadge={discountPercent > 0 ? `-${discountPercent}%` : null}
                  showProgress={true}
                  isMobile={isMobile}
                  onClick={() => navigate('/products', { 
                    state: { 
                      priorityId: product.id, 
                      sectionName: `Top Deals ${selectedCategory ? `in ${selectedCategory.name}` : ''}`,
                      categoryId: selectedCategory?.id
                    } 
                  })}
                />
              </div>
            );
          })}
        </div>
      ) : (
        /* ========== DESKTOP VIEW ========== */
        <div className="td-desktop-wrapper">
          {showLeftArrow && (
            <button className="td-arrow-btn td-arrow-left" onClick={() => scroll('left')}>
              <ChevronLeft size={24} />
            </button>
          )}
          
          <div ref={scrollContainerRef} className="td-desktop-scroll hide-scrollbar-desktop">
            {products.map((product) => {
              const discountPercent = getDiscountPercentage(product.price, product.original_price);
              
              return (
                <div key={product.id} className="td-desktop-card-wrapper">
                  <DashboardCard
                    image={product.cover_image}
                    title={product.name}
                    price={product.original_price} 
                    originalPrice={product.price}  
                    moq={product.moq}
                    isTopDeal={true}
                    discountBadge={discountPercent > 0 ? `-${discountPercent}%` : null}
                    showProgress={true}
                    isMobile={isMobile}
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
      )}
    </div>
  );
}