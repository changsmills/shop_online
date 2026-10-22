// components/SkeletonCard.jsx
import React from "react";

export default function SkeletonCard() {
  return (
    <>
      {/* 
        Tunatumia <style> hapa ili kuweka ile Shimmer Animation na FadeIn 
        bila kubadilisha tailwind.config.js 
      */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .custom-shimmer {
          background: linear-gradient(90deg, #e8e8e8 0%, #f5f5f5 40%, #e8e8e8 80%);
          background-size: 200% 100%;
          animation: shimmer 1.8s ease-in-out infinite;
        }
        @media (prefers-color-scheme: dark) {
          .custom-shimmer {
            background: linear-gradient(90deg, #334155 0%, #4b5563 50%, #334155 100%);
            background-size: 200% 100%;
          }
        }
      `}</style>

      <div 
        className="flex flex-col w-full h-full overflow-hidden rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-[#e5e7eb] bg-white transition-colors duration-300 ease-in-out
        dark:bg-[#1e293b] dark:border-[#334155] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
        style={{ animation: 'fadeIn 0.4s ease forwards' }}
      >
        {/* IMAGE AREA */}
        <div className="w-full h-[200px] max-md:h-[150px] max-sm:h-[120px] bg-[#e8e8e8] dark:bg-[#334155] rounded-t-xl shrink-0 relative overflow-hidden custom-shimmer"></div>
        
        {/* CONTENT AREA */}
        <div className="p-4 max-md:p-3 max-sm:p-2.5 flex flex-col gap-3 max-md:gap-2 max-sm:gap-1.5 flex-1 justify-end">
          {/* Title */}
          <div className="h-[18px] max-md:h-4 max-sm:h-3.5 w-[80%] max-sm:w-[70%] bg-[#e8e8e8] dark:bg-[#334155] rounded-md custom-shimmer"></div>
          
          {/* Price */}
          <div className="h-6 max-md:h-5 max-sm:h-[18px] w-[50%] max-sm:w-[60%] bg-[#e8e8e8] dark:bg-[#334155] rounded-md custom-shimmer"></div>
          
          {/* MOQ */}
          <div className="h-3.5 max-md:h-3 max-sm:h-2.5 w-[40%] max-sm:w-[50%] bg-[#e8e8e8] dark:bg-[#334155] rounded-md custom-shimmer"></div>
        </div>
      </div>
    </>
  );
}