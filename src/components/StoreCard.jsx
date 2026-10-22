// src/components/StoreCard.jsx
import React from 'react';
import { MapPin, Star, ShieldCheck, ChevronRight } from "lucide-react";

export default function StoreCard({ store, onClick }) {
  // 🔥 Pata majina kwa usalama
  const storeName = store.store_name || 'Store';
  const city = store.city || 'Tanzania';
  const categoryName = store.category_name || store.business_type || 'Store';

   // 🔥 Tumia URL halisi kutoka Backend (zilizopo!) AU fallback ya ndani
  const storeImage = 
    store.store_logo_url || 
    store.office_image_1_url || 
    store.office_image_2_url || 
    (store.store_logo ? `https://res.cloudinary.com/rlgqgsnv/image/upload/${store.store_logo}` : null) ||
    null; 

  return (
    <div 
      className="w-full mx-auto bg-transparent border-none shadow-none p-0 m-0 cursor-pointer select-none max-w-[140px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[160px] xl:max-w-[180px]"
      onClick={onClick}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* IMAGE CONTAINER */}
      <div className="relative w-full aspect-square bg-[#f5f5f5] dark:bg-[#2d2d2d] overflow-hidden rounded-[10px]">
        
        {store.is_verified && (
          <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 bg-[#10b981] dark:bg-[#059669] text-white px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full text-[8px] md:text-[10px] font-bold flex items-center gap-1 z-10">
            <ShieldCheck size={10} />
            <span>Verified</span>
          </div>
        )}
        
        {storeImage ? (
          <img 
            src={storeImage} 
            alt={storeName}
            className="w-full h-full object-cover object-center transition-transform duration-300 ease-in-out"
            onError={(e) => { 
              // 🔥 Tumia SVG ya ndani (haitegemei internet!)
              e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><rect fill='%23f0f0f0' width='300' height='300'/><text fill='%23888' font-size='20' x='50%' y='50%' text-anchor='middle'>No Image</text></svg>"; 
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#f0f0f0] dark:bg-[#2d2d2d] text-[#888] dark:text-gray-400 text-[48px] font-bold">
            {storeName.charAt(0).toUpperCase()}
          </div>
        )}
        
      </div>

      {/* INFO SECTION */}
      <div className="px-1.5 pt-2.5 pb-1.5 flex flex-col gap-1 bg-transparent">
        <h4 className="m-0 text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] text-[#333] dark:text-[#f3f4f6] font-semibold leading-[1.3] line-clamp-1">
          {storeName}
        </h4>

        {categoryName && (
          <p className="text-[9px] md:text-[10px] font-semibold text-[#f97316] dark:text-[#ff8a3c] m-0 uppercase tracking-[0.5px]">
            {categoryName}
          </p>
        )}
        
        <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] text-[#666] dark:text-[#9ca3af] mt-0.5">
          {store.average_rating > 0 && (
            <div className="flex items-center gap-1">
              <Star size={9} fill="#fbbf24" stroke="#fbbf24" />
              <span>{store.average_rating}</span>
            </div>
          )}
          {store.total_sales > 0 && (
            <span className="text-[9px] md:text-[10px] text-[#666] dark:text-[#9ca3af]">
              {store.total_sales?.toLocaleString()} sales
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-[9px] md:text-[10px] text-[#999] dark:text-[#6b7280] mt-0.5">
          <MapPin size={9} color="#999" />
          <span>{city}</span>
        </div>

        <div className="mt-1.5 md:mt-2 pt-1.5 md:pt-2 border-t border-[#f0f0f0] dark:border-[#374151] flex items-center justify-between text-[#f97316] dark:text-[#ff8a3c] text-[9px] md:text-[11px] lg:text-[12px] font-semibold">
          <span>View Store</span>
          <ChevronRight size={12} />
        </div>
      </div>
    </div>
  );
}