// src/components/MobileCategorySlider.jsx
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

  if (!categories || !categories.length) return null;

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          style={{
            position: 'absolute',
            left: 0,
            zIndex: 10,
            background: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            marginLeft: '4px'
          }}
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {/* Scrollable Categories Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
          padding: '10px 0',
          gap: '12px',
          flex: 1,
          scrollBehavior: 'smooth'
        }}
      >
        {categories.map((cat, index) => {
          const displayName = getDisplayName ? getDisplayName(cat) : cat.name;
          const isActive = selectedCategory?.id === cat.id;
          return (
            <div
              key={cat.id === null ? `all-${index}` : cat.id}
              onClick={() => onSelectCategory(cat)}
              style={{
                whiteSpace: 'nowrap',
                flexShrink: 0,
                padding: '8px 16px',
                borderRadius: '30px',
                backgroundColor: isActive ? '#000000' : '#f0f0f0',
                color: isActive ? '#ffffff' : '#000000',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                userSelect: 'none'
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
            background: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            marginRight: '4px'
          }}
        >
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}