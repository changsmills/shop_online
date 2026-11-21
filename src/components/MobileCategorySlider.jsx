// src/components/MobileCategorySlider.jsx
import React, { useState } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

export default function MobileCategorySlider({ 
  categories, 
  selectedCategory, 
  onSelectCategory,
  getDisplayName 
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!categories || categories.length === 0) return null;

  const basePillClass = "whitespace-nowrap shrink-0 px-3 py-1.5 rounded-full text-[13px] font-medium cursor-pointer transition-all duration-200 select-none border";
  const activePillClass = "bg-[#ff6a00] text-white border-[#ff6a00] font-semibold shadow-sm";
  const inactivePillClass = "bg-gray-100 dark:bg-[#1a1a2e] text-gray-800 dark:text-gray-200 border-transparent hover:bg-gray-200 dark:hover:bg-[#2a2a3e]";

  return (
    <>
      {/* 🔥 DIV KUU: Full width, py-1.5, bg-white, na border-b */}
      <div className="relative flex items-center w-full px-3 py-1.5 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        
        {/* Scrollable Container (Pills) - Bila mishale */}
        <div
          className="flex overflow-x-auto flex-1 gap-1.5 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pr-12"
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

        {/* 🔥 KITUFE CHA CHINI (ChevronDown) - Kimebaki kimoja */}
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="absolute right-2 z-20 w-8 h-8 flex items-center justify-center bg-white dark:bg-black rounded-full border border-gray-200 dark:border-gray-700 shadow-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronDown size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Dialog */}
      {isDialogOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60"
          onClick={() => setIsDialogOpen(false)}
        >
          <div 
            className="w-full max-h-[75vh] bg-white dark:bg-[#0a0a0a] rounded-t-2xl flex flex-col overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 shrink-0">
              <h3 className="text-base font-bold text-black dark:text-white m-0">All Categories</h3>
              <button onClick={() => setIsDialogOpen(false)} className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 pb-20">
              {categories.map((cat) => {
                const displayName = getDisplayName ? getDisplayName(cat) : (cat.name || cat.name_sw);
                const isActive = selectedCategory?.id === cat.id;

                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat);
                      setIsDialogOpen(false);
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