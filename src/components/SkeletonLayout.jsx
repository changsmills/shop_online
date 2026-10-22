// src/components/SkeletonLayout.jsx
import React from 'react';
import SkeletonCard from './SkeletonCard'; 
import NavBottom from './BottomNav'; 

const SkeletonLayout = () => {
  return (
    // 🔥 Marekebisho: Tumia min-h-[100dvh] badala ya min-h-screen kuzuia kuruka kwa screen
    // 🔥 Marekebisho: Tumia pb-[calc(...)] ili kuzuia BottomNav kufunika content
    // 🔥 Marekebisho: Ongeza overflow-x-hidden kuzuia scroll isiyo ya lazima kwa upande
    <div className="bg-[#f7f8fa] dark:bg-black min-h-[100dvh] w-full  pb-[calc(100px+env(safe-area-inset-bottom))] m-0 sm:pt-20 md:pt-24 md:pb-20 lg:pt-5 lg:pb-5 overflow-x-hidden">
      
      {/* ============================================== */}
      {/* MOBILE & TABLET LAYOUT */}
      {/* ============================================== */}
      <div className="block lg:hidden w-full m-0 p-0">
        
        {/* Skeleton ya Category Slider */}
        <div className="flex overflow-x-auto gap-3 px-4 py-3 bg-white dark:bg-black border-b border-[#eee] dark:border-[#1f1f1f] m-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* 🔥 Marekebisho: Badilisha w-10 h-8 kuwa w-8 h-8 ili iwe mduara kamili */}
          <div className="w-8 h-8 bg-[#e0e0e0] dark:bg-[#1a1a1a] rounded-full shrink-0 animate-pulse"></div>
          <div className="w-[90px] h-8 bg-[#e0e0e0] dark:bg-[#1a1a1a] rounded-full shrink-0 animate-pulse"></div>
          <div className="w-[90px] h-8 bg-[#e0e0e0] dark:bg-[#1a1a1a] rounded-full shrink-0 animate-pulse"></div>
          <div className="w-[90px] h-8 bg-[#e0e0e0] dark:bg-[#1a1a1a] rounded-full shrink-0 animate-pulse"></div>
          <div className="w-[90px] h-8 bg-[#e0e0e0] dark:bg-[#1a1a1a] rounded-full shrink-0 animate-pulse"></div>
        </div>

        {/* Skeleton ya Banner */}
        {/* 🔥 Marekebisho: Ondoa m-0 iliyokuwepo, tumia margins sahihi kwa mobile na desktop */}
        <div className="w-full h-[120px] sm:h-[180px] md:h-[220px] bg-[#e0e0e0] dark:bg-[#1a1a1a] rounded-none md:rounded-xl mb-5 md:mb-6 md:mt-2.5 animate-pulse"></div>
        
        {/* Skeleton ya Grid ya Bidhaa (Mobile = 2, Tablet = 4) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 px-4 m-0 w-full">
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
              <div key={i} className="w-full h-[30px] bg-[#e0e0e0] dark:bg-[#1a1a1a] rounded-lg animate-pulse"></div>
            ))}
          </div>
          
          {/* Banner */}
          <div className="flex-1 min-h-[350px] bg-[#e0e0e0] dark:bg-[#1a1a1a] rounded-xl shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.8)] animate-pulse m-0"></div>
        </div>

        {/* Grid ya Bidhaa (5 Columns) */}
        <div className="grid grid-cols-5 gap-5 m-0">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>

      {/* ============================================== */}
      {/* NAVBOTTOM (Inaonekana kwenye simu tu) */}
      {/* ============================================== */}
      <div className="block lg:hidden">
        <NavBottom />
      </div>

    </div>
  );
};

export default SkeletonLayout;