// src/components/SkeletonProductsAll.jsx
import React from 'react';

const SkeletonProductsAll = ({ isMobile }) => {
  return (
    <div className="bg-gray-50 dark:bg-[#0f172a] min-h-screen w-full overflow-x-hidden transition-colors duration-300">
      
      {/* 1. Skeleton Banner */}
      <div className="h-[180px] w-full flex flex-col justify-center items-center gap-4 px-5 bg-gray-200 dark:bg-[#1e293b] dark:border-b dark:border-slate-700 animate-pulse">
        <div className="w-[40%] h-8 bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
        <div className="w-[60%] h-4 bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
      </div>

      {/* 2. Skeleton Category Tabs */}
      <div className="h-[60px] w-full flex items-center px-5 bg-gray-50 dark:bg-[#0f172a] border-b border-gray-200 dark:border-slate-700 transition-colors duration-300">
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-20 h-8 bg-gray-300 dark:bg-slate-700 rounded-full shrink-0 animate-pulse"></div>
          ))}
        </div>
      </div>

      {/* 3. Skeleton Product Grid */}
      <div className="p-2.5 md:p-4 max-w-[1440px] mx-auto w-full box-border">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 md:gap-4 xl:gap-5 w-full">
          {Array.from({ length: isMobile ? 6 : 10 }).map((_, i) => (
            <div 
              key={i} 
              // 🔥 HAPA: Nimetumia bg-white kwa light mode na dark:bg-[#1e293b] kwa dark mode
              className="bg-white dark:bg-[#1e293b] rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 flex flex-col w-full transition-colors duration-300 shadow-sm"
            >
              {/* Product Image Skeleton */}
              <div className="w-full aspect-square bg-gray-200 dark:bg-slate-700 animate-pulse"></div>
              
              {/* Product Info Skeleton */}
              <div className="p-2 flex flex-col gap-1.5">
                <div className="h-3 w-full bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                <div className="h-3 w-[60%] bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                <div className="h-3 w-[40%] bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default SkeletonProductsAll;