// src/components/SkeletonLayout.jsx
import React from 'react';
import SkeletonCard from './SkeletonCard'; 
import NavBottom from './BottomNav'; 

// Helper component kwa ajili ya Shimmer Effect
const ShimmerBox = ({ className }) => (
  <div className={`relative overflow-hidden bg-gray-200 dark:bg-[#1a1a1a] ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" />
  </div>
);

const SkeletonLayout = () => {
  return (
    <div className="bg-[#f7f8fa] dark:bg-black min-h-[100dvh] w-full 
     pb-[calc(100px+env(safe-area-inset-bottom))] m-0 sm:pt-20 md:pt-24
      md:pb-20 lg:pt-5 lg:pb-5 overflow-x-hidden font-sans">
      
      {/* ============================================== */}
      {/* MOBILE & TABLET LAYOUT */}
      {/* ============================================== */}
      <div className="block lg:hidden w-full m-0 p-0">
        
        {/* Skeleton ya Category Slider */}
        <div className="flex overflow-x-auto gap-3 px-4 py-3 bg-white dark:bg-black border-b border-[#eee] dark:border-[#1f1f1f] m-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ShimmerBox className="w-8 h-8 rounded-full shrink-0" />
          <ShimmerBox className="w-[90px] h-8 rounded-full shrink-0" />
          <ShimmerBox className="w-[90px] h-8 rounded-full shrink-0" />
          <ShimmerBox className="w-[90px] h-8 rounded-full shrink-0" />
          <ShimmerBox className="w-[90px] h-8 rounded-full shrink-0" />
        </div>

        {/* Skeleton ya Banner - Imeboreshwa */}
        <div className="px-4 mt-4 mb-5">
            {/* Banner sasa ina rounded corners kwenye mobile na ni ndefu kidogo */}
            <ShimmerBox className="w-full h-[180px] sm:h-[220px] md:h-[260px] rounded-2xl shadow-sm" />
        </div>
        
        {/* Skeleton ya Grid ya Bidhaa (Mobile = 2, Tablet = 4) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 px-4 m-0 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>

      {/* ============================================== */}
      {/* DESKTOP LAYOUT */}
      {/* ============================================== */}
      <div className="hidden lg:block max-w-[1400px] mx-auto w-full m-0 p-0">
        
        {/* Top Row (Sidebar + Banner) */}
        <div className="flex gap-6 mb-[30px] items-stretch m-0">
          
          {/* Sidebar */}
          <div className="w-[260px] bg-white dark:bg-[#0a0a0a] rounded-xl p-5 shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.8)] flex flex-col gap-[15px] shrink-0 min-h-[350px] m-0">
            {[1, 2, 3, 4, 5].map(i => (
              <ShimmerBox key={i} className="w-full h-[30px] rounded-lg" />
            ))}
          </div>
          
          {/* Banner */}
          <ShimmerBox className="flex-1 min-h-[350px] rounded-xl shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.8)] m-0" />
        </div>

        {/* Grid ya Bidhaa (5 Columns) */}
        <div className="grid grid-cols-5 gap-5 m-0">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>

      {/* ============================================== */}
      {/* NAVBOTTOM */}
      {/* ============================================== */}
      <div className="block lg:hidden">
        <NavBottom />
      </div>

    </div>
  );
};

export default SkeletonLayout;