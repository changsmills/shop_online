// src/components/MobileCategorySlider.jsx
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Check, X } from 'lucide-react';

export default function MobileCategorySlider({ 
  categories, 
  selectedCategory, 
  onSelectCategory,
  getDisplayName 
}) {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  // 🔥 State ya kufungua na kufunga dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const basePillClass = "whitespace-nowrap shrink-0 px-3 py-1.5 rounded-full text-[13px] font-medium cursor-pointer transition-all duration-200 select-none border";
  const activePillClass = "bg-[#ff6a00] text-white border-[#ff6a00] font-semibold shadow-sm";
  const inactivePillClass = "bg-gray-100 dark:bg-[#1a1a2e] text-gray-800 dark:text-gray-200 border-transparent hover:bg-gray-200 dark:hover:bg-[#2a2a3e]";

  return (
    <>
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

        {/* Scrollable Container (Pills) */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto flex-1 gap-1.5 py-1.5 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pr-10"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {categories.map((cat) => {
            const displayName = getDisplayName ? getDisplayName(cat) : (cat.name || cat.name_sw);
            const isActive = selectedCategory?.id === cat.id;
            
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat)}
                className={`${basePillClass} ${isActive ? activePillClass : inactivePillClass}`}
              >
                <span className="max-w-[110px] truncate block">
                  {displayName}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-8 z-10 w-8 h-10 flex items-center justify-end pr-1.5 border-none cursor-pointer bg-gradient-to-l from-white dark:from-[#0a0a0a] via-white/80 dark:via-[#0a0a0a]/80 to-transparent text-gray-500 dark:text-gray-400"
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        )}

        {/* 🔥 KITUFE KIPYA CHA KUFUNGUA DIALOG (Upande wa kulia kabisa) */}
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="absolute right-1 z-20 w-8 h-8 flex items-center justify-center bg-white dark:bg-[#0a0a0a] rounded-full border border-gray-200 dark:border-gray-700 shadow-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronDown size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* 🔥 DIALOG YA CHINI (Inatokea ukibonyeza kitufe cha chini) */}
      {isDialogOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60"
          onClick={() => setIsDialogOpen(false)}
        >
          <div 
            className="w-full max-h-[75vh] bg-white dark:bg-[#0a0a0a] rounded-t-2xl flex flex-col overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Kichwa cha Dialog */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 shrink-0">
              <h3 className="text-base font-bold text-black dark:text-white m-0">All Categories</h3>
              <button onClick={() => setIsDialogOpen(false)} className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Orodha ya Categories */}
            <div className="flex-1 overflow-y-auto p-2  pb-20">
              {categories.map((cat) => {
                const displayName = getDisplayName ? getDisplayName(cat) : (cat.name || cat.name_sw);
                const isActive = selectedCategory?.id === cat.id;

                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat);
                      setIsDialogOpen(false); // Funga dialog baada ya kuchagua
                    }}
                    className={`flex items-center justify-between px-4 py-3.5 mb-1 rounded-lg cursor-pointer transition-colors ${
                      isActive 
                        ? 'bg-orange-50 dark:bg-orange-500/10 text-[#ff6a00] font-bold' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a2e]'
                    }`}
                  >
                    <span className="truncate pr-4">{displayName}</span>
                    {isActive && <Check size={18} className="text-[#ff6a00] shrink-0" />}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}
    </>
  );
}