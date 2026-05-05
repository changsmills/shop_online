// src/components/TrendingNow.jsx (Fixed Version - Same as TopDeals)
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, TrendingUp } from "lucide-react";
import { supabase } from "../supabaseClient";
import DashboardCard from "./DashboardCard";

export default function TrendingNow({ navigate, selectedCategory, isMobile }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('products_engines')
          .select('*')
          .eq('is_approved', true)
          .or('order_count.gt.0,views.gt.0')
          .order('order_count', { ascending: false })
          .order('views', { ascending: false })
          .limit(10);

        if (selectedCategory?.id) {
          query = query.eq('parent_category_id', selectedCategory.id);
        }

        const { data, error } = await query;
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("Trending Fetch Error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, [selectedCategory]);

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
      className="trending-main-wrapper" 
      style={{ 
        padding: isMobile ? '4px 0' : '20px',
        position: 'relative',
        width: '100%',
      }}
    >
      {/* Header Section - Same as TopDeals */}
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
            <TrendingUp size={isMobile ? 12 : 24} style={{ color: '#8b5cf6' }} />
            <h2 style={{ 
              fontSize: isMobile ? '13px' : '24px', 
              fontWeight: 'bold', 
              margin: 0,
              lineHeight: isMobile ? '1.3' : '1.4'
            }}>
              Hot Picks {selectedCategory && `in ${selectedCategory.name}`}
            </h2>
          </div>
          <p style={{ 
            margin: 0, 
            color: '#888',
            fontSize: isMobile ? '9px' : '16px',
            lineHeight: isMobile ? '1.2' : '1.5'
          }}>
            Check out the most popular items people are buying right now.
          </p>
        </div>
        
        <button 
          onClick={() => navigate('/products', { 
            state: { 
              sectionName: 'Trending Now',
              categoryId: selectedCategory?.id 
            } 
          })}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: isMobile ? '4px' : '8px', 
            padding: isMobile ? '4px 10px' : '8px 20px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
            color: 'white',
            border: 'none',
            borderRadius: isMobile ? '20px' : '10px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: isMobile ? '9px' : '16px',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(139, 92, 246, 0.3)';
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
          {products.map((item, index) => (
            <div
              key={item.id}
              style={{
                flex: '0 0 auto',
                width: '140px',
                minWidth: '140px'
              }}
            >
               <DashboardCard
                image={item.cover_image}
                title={item.name}
                price={item.price}
                views={item.views}
                rank={index + 1}
                isMobile={isMobile}
                onClick={() => navigate('/products', {
                  state: {
                    sortBy: 'order_count',
                    order: 'desc',
                    sectionName: `Trending in ${selectedCategory?.name || 'All'}`,
                    priorityId: item.id,
                    categoryId: selectedCategory?.id
                  }
                })}
              />
            </div>
          ))}
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
            {products.map((item, index) => (
              <div
                key={item.id}
                style={{
                  flex: '0 0 auto',
                  width: '200px',
                  minWidth: '200px'
                }}
              >
                <DashboardCard
                  image={item.cover_image}
                  title={item.name}
                  price={item.price}
                  views={item.views}
                  rank={index + 1}
                  isMobile={isMobile}
 onClick={() => {
  const queryParams = {
    // Inatuma categoryId TU kama ipo, kuzuia kosa la "all" kuwa UUID
    ...(selectedCategory?.id && { categoryId: selectedCategory.id }),
    categoryName: selectedCategory?.name || 'All',
    sectionName: `Trending in ${selectedCategory?.name || 'All'}`,
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