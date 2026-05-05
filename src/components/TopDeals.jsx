// src/components/TopDeals.jsx (Fixed Version - Same as NewArrivals)
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Flame } from "lucide-react";
import { supabase } from "../supabaseClient";
import DashboardCard from "./DashboardCard";

export default function TopDeals({ navigate, selectedCategory, isMobile }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('products_engines')
          .select('*')
          .eq('is_approved', true)
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
  }, [selectedCategory]);

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
    <div className="skeleton-loader-h" style={{height: '280px', margin: '20px', borderRadius: '15px'}} />
  );
  
  if (products.length === 0) return null;

  return (
    <div 
      className="top-deals-main-wrapper" 
      style={{ 
        padding: isMobile ? '4px 0' : '20px',
        position: 'relative',
        width: '100%',
      }}
    >
      {/* Header Section - Same as NewArrivals */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: isMobile ? '12px' : '20px',
        flexWrap: 'wrap',
        gap: isMobile ? '6px' : '10px',
        padding: isMobile ? '0 8px' : '0',
      }}>
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: isMobile ? '4px' : '8px', 
            marginBottom: isMobile ? '2px' : '8px' 
          }}>
            <Flame size={isMobile ? 12 : 24} style={{ color: '#f97316' }} />
            <h2 style={{ 
              fontSize: isMobile ? '13px' : '24px', 
              fontWeight: 'bold', 
              margin: 0,
              lineHeight: isMobile ? '1.3' : '1.4'
            }}>
              Top Deals {selectedCategory && `in ${selectedCategory.name}`}
            </h2>
          </div>
          <p style={{ 
            margin: 0, 
            color: '#888',
            fontSize: isMobile ? '9px' : '16px',
            lineHeight: isMobile ? '1.2' : '1.5'
          }}>
            Score the lowest price on Skyfall.com
            {selectedCategory && ` in ${selectedCategory.name}`}
          </p>
        </div>
        
        <button 
          onClick={() => navigate('/products', { 
            state: { 
              sectionName: `Top Deals ${selectedCategory ? `in ${selectedCategory.name}` : ''}`,
              categoryId: selectedCategory?.id
            } 
          })}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: isMobile ? '4px' : '8px', 
            padding: isMobile ? '4px 10px' : '8px 20px',
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            color: 'white',
            border: 'none',
            borderRadius: isMobile ? '20px' : '10px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: isMobile ? '9px' : '16px',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(249, 115, 22, 0.3)';
          }}
        >
          <span>View more</span>
          <ChevronRight size={isMobile ? 10 : 16} />
        </button>
      </div>
      
      {/* ========== MOBILE VIEW: Horizontal Scroll ========== */}
      {isMobile ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            gap: '12px',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            padding: '10px 0 20px 0',
            width: '100%',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}
          className="hide-scrollbar-mobile"
        >
          {products.map((product) => {
            const discountPercent = getDiscountPercentage(product.price, product.original_price);
            
            return (
              <div
                key={product.id}
                style={{
                  flex: '0 0 auto',
                  width: '140px',
                  minWidth: '140px'
                }}
              >
                <DashboardCard
                  image={product.cover_image}
                  title={product.name}
                  price={product.original_price} 
                  originalPrice={product.price}  
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
        /* ========== DESKTOP VIEW: Horizontal Scroll with Arrows ========== */
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              style={{
                position: 'absolute',
                left: '-15px',
                zIndex: 10,
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f7f9fc';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ChevronLeft size={24} />
            </button>
          )}
          
          <div
            ref={scrollContainerRef}
            style={{
              display: 'flex',
              gap: '20px',
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollBehavior: 'smooth',
              padding: '10px 5px 20px 5px',
              width: '100%',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }}
            className="hide-scrollbar-desktop"
          >
            {products.map((product) => {
              const discountPercent = getDiscountPercentage(product.price, product.original_price);
              
              return (
                <div
                  key={product.id}
                  style={{
                    flex: '0 0 auto',
                    width: '200px',
                    minWidth: '200px'
                  }}
                >
                  <DashboardCard
  image={product.cover_image}
  title={product.name}
  price={product.original_price} 
  originalPrice={product.price}  
  discountBadge={discountPercent > 0 ? `-${discountPercent}%` : null}
  showProgress={true}
  isMobile={isMobile}
  onClick={() => {
    // 1. Tunatengeneza vigezo vya URL (Query Params)
    const priorityId = product.id;
    const sectionName = encodeURIComponent(`Top Deals ${selectedCategory ? `in ${selectedCategory.name}` : ''}`);
    const categoryId = selectedCategory?.id || '';

    // 2. Tunatengeneza URL kamili
    const url = `/products?priorityId=${priorityId}&sectionName=${sectionName}${categoryId ? `&categoryId=${categoryId}` : ''}`;

    // 3. Tunafungua kwenye window mpya
    window.open(url, '_blank');
  }}
/>
                </div>
              );
            })}
          </div>
          
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              style={{
                position: 'absolute',
                right: '-15px',
                zIndex: 10,
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f7f9fc';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      )}

      {/* Global styles to hide scrollbars */}
      <style>{`
        .hide-scrollbar-mobile {
          overflow-x: auto !important;
          overflow-y: hidden !important;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar-mobile::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 768px) {
          .hide-scrollbar-mobile {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch;
          }
        }
        .hide-scrollbar-desktop::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar-desktop {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}