// src/components/StoreCard.jsx
import React from 'react';
import { MapPin, Star, ShieldCheck, ChevronRight } from "lucide-react";

export default function StoreCard({ store, onClick }) {
  // Pata majina kwa usalama
  const storeName = store.store_name || 'Store';
  const city = store.city || 'Tanzania';
  const categoryName = store.category_name || store.business_type || 'Store';

  // Tumia URL halisi kutoka Backend
  const storeImage = 
    store.store_logo_url || 
    store.office_image_1_url || 
    store.office_image_2_url || 
    (store.store_logo ? `https://res.cloudinary.com/rlgqgsnv/image/upload/${store.store_logo}` : null) || 
    null; 

  return (
    <div 
      // Kadi nzima ina class hizi
      className="w-full h-full bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] rounded-lg p-1 shadow-sm cursor-pointer select-none font-sans"
      onClick={onClick}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 🔥 IMAGE CONTAINER: Nimeongeza class 'group' hapa */}
      <div className="group relative w-full aspect-square bg-[#f5f5f5] dark:bg-[#2d2d2d] overflow-hidden rounded-md">
        
        {store.is_verified && (
          <div className="absolute top-1 right-1 bg-[#10b981] dark:bg-[#059669] text-white px-1 py-0.5 rounded-full text-[7px] sm:text-[8px] font-bold flex items-center gap-0.5 z-10 shadow-sm">
            <ShieldCheck size={8} />
            <span>Verified</span>
          </div>
        )}
        
        {storeImage ? (
          <img 
            src={storeImage} 
            alt={storeName}
            // 🔥 Nimeongeza group-hover:scale-110 hapa ili ivutike
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-110"
            onError={(e) => { 
              e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><rect fill='%23f0f0f0' width='300' height='300'/><text fill='%23888' font-size='20' x='50%' y='50%' text-anchor='middle'>No Image</text></svg>"; 
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#f0f0f0] dark:bg-[#2d2d2d] text-[#888] dark:text-gray-400 text-[32px] font-bold">
            {storeName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* INFO SECTION */}
      <div className="px-0.5 pt-1.5 pb-0.5 flex flex-col gap-0.5 bg-transparent">
        <h4 className="m-0 text-[11px] sm:text-[12px] text-[#333] dark:text-[#f3f4f6] font-semibold leading-[1.2] line-clamp-1">
          {storeName}
        </h4>

        {categoryName && (
          <p className="text-[8px] sm:text-[9px] font-bold text-[#f97316] dark:text-[#ff8a3c] m-0 uppercase tracking-[0.3px] line-clamp-1">
            {categoryName}
          </p>
        )}
        
        <div className="flex items-center gap-1.5 text-[8px] sm:text-[9px] text-[#666] dark:text-[#9ca3af] mt-0.5">
          {store.average_rating > 0 && (
            <div className="flex items-center gap-0.5">
              <Star size={8} fill="#fbbf24" stroke="#fbbf24" />
              <span>{store.average_rating}</span>
            </div>
          )}
          {store.total_sales > 0 && (
            <span className="text-[8px] sm:text-[9px] text-[#666] dark:text-[#9ca3af]">
              {store.total_sales?.toLocaleString()} sales
            </span>
          )}
        </div>

        <div className="flex items-center gap-0.5 text-[8px] sm:text-[9px] text-[#999] dark:text-[#6b7280] mt-0.5">
          <MapPin size={8} color="#999" />
          <span className="line-clamp-1">{city}</span>
        </div>

        <div className="mt-1 pt-1 border-t border-[#f0f0f0] dark:border-[#374151] flex items-center justify-between text-[#f97316] dark:text-[#ff8a3c] text-[9px] sm:text-[10px] font-semibold">
          <span>View Store</span>
          <ChevronRight size={10} />
        </div>
      </div>
    </div>
  );
}