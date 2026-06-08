// src/components/MobileCategorySlider.jsx (FIXED)
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function MobileCategorySlider({ 
  categories, 
  selectedCategory, 
  onSelectCategory,
  getDisplayName 
}) {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  if (!categories || categories.length === 0) return null;

  return (
    <div style={{ 
      position: 'relative', 
      display: 'flex', 
      alignItems: 'center', 
      width: '100%',
      padding: '0 4px'
    }}>
      {/* Left Arrow - sio absolute tena, na background gradient */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          style={{
            position: 'absolute',
            left: 0,
            zIndex: 10,
            background: 'linear-gradient(90deg, white 60%, transparent)',
            border: 'none',
            borderRadius: '0 20px 20px 0',
            width: '32px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: '6px',
            cursor: 'pointer',
            boxShadow: 'none'
          }}
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          padding: '8px 0',
          gap: '10px',
          flex: 1,
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {categories.map((cat, index) => {
          const displayName = getDisplayName ? getDisplayName(cat) : (cat.name || cat.name_sw);
          const isActive = selectedCategory?.id === cat.id;
          return (
            <div
              key={cat.id === null ? `all-${index}` : cat.id}
              onClick={() => onSelectCategory(cat)}
              style={{
                whiteSpace: 'nowrap',
                flexShrink: 0,
                padding: '6px 16px',
                borderRadius: '40px',
                backgroundColor: isActive ? '#000000' : '#f0f0f0',
                color: isActive ? '#ffffff' : '#333333',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '500',
                transition: 'all 0.2s ease',
                userSelect: 'none',
                boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {displayName}
            </div>
          );
        })}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          style={{
            position: 'absolute',
            right: 0,
            zIndex: 10,
            background: 'linear-gradient(270deg, white 60%, transparent)',
            border: 'none',
            borderRadius: '20px 0 0 20px',
            width: '32px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '6px',
            cursor: 'pointer',
            boxShadow: 'none'
          }}
        >
          <ChevronRight size={20} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}