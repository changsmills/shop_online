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

  if (!categories || categories.length === 0) return null;

  // 🔥 IMEONDOLEWA: allCategory hapa kwa sababu Dashboard inatuma ALL_CATEGORY tayari

  // 🔥 TUMIA RANGI ZA KAWAIDA ZENYE DARK MODE
  const basePillClass = "whitespace-nowrap shrink-0 px-4 py-1.5 rounded-full text-sm cursor-pointer transition-all duration-200 select-none border";
  
  const activePillClass = "bg-[#ff6a00] text-white border-[#ff6a00] font-semibold shadow-md";
  
  const inactivePillClass = "bg-gray-100 dark:bg-[#1a1a2e] text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-200 dark:hover:bg-[#2a2a3e]";

  return (
    <div className="relative flex items-center w-full px-1 bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 z-10 w-8 h-10 flex items-center justify-start pl-1.5 border-none cursor-pointer rounded-r-[20px] bg-gradient-to-r from-white dark:from-[#0a0a0a] via-white/80 dark:via-[#0a0a0a]/80 to-transparent text-gray-500 dark:text-gray-400"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex overflow-x-auto flex-1 gap-2 py-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        
        {/* 🔥 IMEONDOLEWA: Ile div ya "ALL CATEGORY" iliyokuwa hapa imefutwa. 
            Sasa inasoma moja kwa moja kutoka kwenye 'categories' prop ambayo ina "All" ndani yake. */}

        {/* CATEGORIES KUTOKA BACKEND (Pamoja na ALL iliyotumwa) */}
        {categories.map((cat) => {
          const displayName = getDisplayName ? getDisplayName(cat) : (cat.name || cat.name_sw);
          const isActive = selectedCategory?.id === cat.id;
          
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className={`${basePillClass} ${isActive ? activePillClass : inactivePillClass}`}
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
          className="absolute right-0 z-10 w-8 h-10 flex items-center justify-end pr-1.5 border-none cursor-pointer rounded-l-[20px] bg-gradient-to-l from-white dark:from-[#0a0a0a] via-white/80 dark:via-[#0a0a0a]/80 to-transparent text-gray-500 dark:text-gray-400"
        >
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}