// src/components/MobileCategorySlider.jsx
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function MobileCategorySlider({ categories, selectedCategory, onSelectCategory }) {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // MABADILIKO: Tumeondoa 'allCategories' hapa kwa sababu 'categories' 
  // tayari inakuja na "All" kutoka kwenye Dashboard.js

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
  }, [categories]); // Tumeweka 'categories' kama dependency

  if (!categories || !categories.length) return null;

  return (
    <div className="mobile-category-slider-container">
      {showLeftArrow && (
        <button className="slider-arrow left" onClick={() => scroll('left')}>
          <ChevronLeft size={20} />
        </button>
      )}
      
      <div className="mobile-category-slider" ref={scrollRef} onScroll={checkScroll}>
        {/* Tunatumia 'categories' moja kwa moja hapa */}
        {categories.map((cat, index) => (
          <div
            // Tunatumia index pamoja na id kuhakikisha key ni unique
            key={cat.id === null ? `all-${index}` : cat.id}
            className={`mobile-cat-item ${selectedCategory?.id === cat.id ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat)}
          >
            <span>{cat.name}</span>
          </div>
        ))}
      </div>
      {showRightArrow && (
        <button className="slider-arrow right" onClick={() => scroll('right')}>
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}