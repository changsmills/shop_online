// src/components/SkeletonProductDetails.jsx (TAILWIND VERSION)
import React from 'react';
import Header from "../components/Header";

export default function SkeletonProductDetails({ isMobile }) {
  return (
    // Container kuu: Ina background ya kijivu (light) au bluu nyeusi (dark)
    <div className="min-h-screen flex flex-col bg-[#f5f5f7] dark:bg-[#0f172a] pt-0 pb-6 md:pb-0"> 
         
      <Header showBack={true} />

      <div className="max-w-[1440px] w-full mx-auto px-3 md:px-5 py-4 box-border">
        
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-1.5 md:gap-2 py-3 md:py-4">
          <div className="w-[60px] md:w-[80px] h-3 md:h-4 bg-[#e0e0e0] dark:bg-[#334155] rounded animate-pulse"></div>
          <span className="text-gray-400 dark:text-gray-600 text-xs">/</span>
          <div className="w-[60px] md:w-[80px] h-3 md:h-4 bg-[#e0e0e0] dark:bg-[#334155] rounded animate-pulse"></div>
          <span className="text-gray-400 dark:text-gray-600 text-xs">/</span>
          <div className="w-[90px] md:w-[120px] h-3 md:h-4 bg-[#e0e0e0] dark:bg-[#334155] rounded animate-pulse"></div>
        </div>

        {/* Main Layout Skeleton */}
        <div className={`flex w-full items-start box-border ${isMobile ? 'flex-col gap-4' : 'flex-col md:flex-row md:gap-8'}`}>
          
          {/* Left Side (Gallery & Description) - Inachukua 65% kwenye Desktop */}
          <div className="flex flex-col w-full box-border md:w-[65%]">
            
            {/* Hero Image Card */}
            <div className="bg-white dark:bg-[#1e293b] rounded-xl p-3 md:p-6 shadow-sm md:shadow-md border border-gray-100 dark:border-[#334155] mb-3 md:mb-5 w-full box-border">
              
              {/* Main Image */}
              <div className="w-full aspect-square bg-[#e0e0e0] dark:bg-[#334155] rounded-lg animate-pulse"></div>
              
              {/* Thumbnails */}
              <div className="flex gap-2 md:gap-3 mt-3 md:mt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 md:w-[60px] md:h-[60px] bg-[#e0e0e0] dark:bg-[#334155] rounded-md md:rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Description Lines */}
            <div className="flex flex-col gap-2.5 mt-2">
              <div className="w-full h-4 bg-[#e0e0e0] dark:bg-[#334155] rounded animate-pulse"></div>
              <div className="w-full h-4 bg-[#e0e0e0] dark:bg-[#334155] rounded animate-pulse"></div>
              <div className="w-[70%] h-4 bg-[#e0e0e0] dark:bg-[#334155] rounded animate-pulse"></div>
              <div className="w-[40%] h-4 bg-[#e0e0e0] dark:bg-[#334155] rounded animate-pulse"></div>
            </div>
          </div>

          {/* Right Side (ProductInfo) - Inachukua 35% kwenye Desktop */}
          <div className="w-full box-border md:w-[35%] mt-2 md:mt-0">
            
            {/* Sticky Info Card */}
            <div className="bg-white dark:bg-[#1e293b] rounded-xl p-4 md:p-5 border border-gray-200 dark:border-[#334155] shadow-sm md:shadow-lg flex flex-col gap-4">
              
              {/* Title */}
              <div className="w-[70%] h-7 bg-[#e0e0e0] dark:bg-[#334155] rounded animate-pulse"></div>
              
              {/* Price */}
              <div className="w-[50%] h-6 bg-[#e0e0e0] dark:bg-[#334155] rounded animate-pulse"></div>
              
              {/* Divider */}
              <div className="w-full h-[1px] bg-[#e0e0e0] dark:bg-[#334155] animate-pulse"></div>
              
              {/* Specs Lines */}
              <div className="flex flex-col gap-3">
                <div className="w-full h-10 bg-[#e0e0e0] dark:bg-[#334155] rounded-lg animate-pulse"></div>
                <div className="w-full h-10 bg-[#e0e0e0] dark:bg-[#334155] rounded-lg animate-pulse"></div>
                <div className="w-full h-10 bg-[#e0e0e0] dark:bg-[#334155] rounded-lg animate-pulse"></div>
              </div>
              
              {/* Buttons */}
              <div className="flex gap-3 mt-2">
                <div className="flex-1 h-11 bg-[#e0e0e0] dark:bg-[#334155] rounded-lg animate-pulse"></div>
                <div className="flex-1 h-11 bg-[#e0e0e0] dark:bg-[#334155] rounded-lg animate-pulse"></div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}