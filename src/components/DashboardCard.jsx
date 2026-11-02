import React from 'react';
import { Trophy, MapPin, BadgeCheck } from "lucide-react";
import { useTranslation } from 'react-i18next';

export default function DashboardCard({ 
  image, 
  title, 
  children, 
  price, 
  originalPrice, 
  moq,
  views = 0, 
  rank, 
  overlay, 
  subtitle,
  categoryName,
  isStore, 
  isTopDeal,
  isLocation, 
  isVerified = false,
  displayMode = 'full', 
  onClick 
}) {
  const numPrice = Number(price);
  const { t } = useTranslation();
  const numOriginal = Number(originalPrice);
  const hasValidPrice = price !== undefined && price !== null && !isNaN(numPrice);

  const isFull = displayMode === 'full';
  const isImageOnly = displayMode === 'image-only';
  const isPriceMoq = displayMode === 'price-moq';
  const isImagePrice = displayMode === 'image-price';

  const displayTitle = (!isStore && title?.length > 30) ? title.substring(0, 25) + '...' : title;

  const getRankColor = (r) => {
    if (Number(r) === 1) return 'bg-[#ff4d4f]';
    if (Number(r) === 2) return 'bg-[#ff7a45]';
    return 'bg-[#ffc53d]';
  };

  return (
    <div 
      /* 
        🔥 HAPA: 
        - Nimeongeza p-2 (padding ya nje)
        - Nimeweka bg-white dark:bg-[#1e293b] (ili card ionekane juu ya background)
        - Nimeweka rounded-xl (mviringo mzuri)
      */
      className={`product-card-item group relative flex flex-col w-full overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] cursor-pointer transition-shadow duration-250 ease-in-out box-border dark:border-[#334155] dark:bg-[#1e293b] p-2 ${isStore ? 'is-store' : ''} ${isLocation ? 'is-location' : ''} display-${displayMode}`}
      onClick={onClick} 
      onContextMenu={(e) => e.preventDefault()}
    >
      
      {/* IMAGE CONTAINER */}
      {/* 🔥 HAPA: Nimeweka rounded-xl (au unaweza kuweka rounded-full kama unataka duara kamili) na kuondoa rounded-t-lg */}
      <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-[#f1f3f5] dark:bg-gray-800">
        
        {/* Rank Indicator */}
        {rank && Number(rank) > 0 ? (
          <div className={`absolute top-2 left-2 z-20 flex items-center justify-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold text-white shadow-sm max-md:px-1.5 max-md:py-0.5 max-md:text-[9px] ${getRankColor(rank)}`}>
            <Trophy size={12} fill="currentColor" className="max-md:w-2.5 max-md:h-2.5" />
            <span>{rank}</span>
          </div>
        ) : null}
        
        {/* Discount Badge */}
        {isFull && (!isStore || isTopDeal) && numOriginal > 0 && hasValidPrice && numPrice < numOriginal && (
          <div className="absolute top-2 right-2 z-20 rounded-full bg-[#ef4444] px-2 py-0.5 text-[10px] font-bold text-white max-md:px-[5px] max-md:text-[8px]">
            -{Math.round(((numOriginal - numPrice) / numOriginal) * 100)}%
          </div>
        )}
        
        <img 
          src={image || ''} 
          alt={title} 
          className="h-full w-full object-cover object-center block transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.08]"
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
          onError={(e) => { 
            e.target.style.display = 'none';
          }}
        />

        {/* Overlay Location */}
        {isFull && overlay && (
          <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white">
            <MapPin size={10} />
            <span>{overlay}</span>
          </div>
        )}
      </div>

      {/* INFO SECTION */}
      <div className="relative z-20 flex flex-col gap-1 p-2 pb-2 bg-transparent max-md:!gap-0 max-md:!p-[4px_8px_6px_8px]">
        
        {/* Title */}
        <h4 className={`m-0 text-[14px] font-semibold leading-tight tracking-wide text-gray-900 dark:text-white max-md:text-[12px] max-md:font-semibold max-md:leading-[1.2] ${isStore ? 'truncate whitespace-nowrap block w-full' : 'line-clamp-2'}`}>
          {displayTitle || title}
        </h4>

        {children}

        {/* Verified Badge */}
        {isFull && isVerified && (
          <div className="flex items-center gap-1 mt-0.5 mb-0.5">
            <BadgeCheck size={12} className="text-[#10b981] max-md:w-2.5 max-md:h-2.5" />
            <span className="text-[11px] font-semibold text-[#10b981] max-md:text-[9px]">Verified</span>
          </div>
        )}

        {/* Sold Count */}
        {isFull && !isStore && views > 0 && (
          <div className="flex items-center mb-0.5">
            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 max-md:text-[9px]">
              {views.toLocaleString()} sold
            </span>
          </div>
        )}
        
         {/* 🔥 PRICE ROW (Imepewa Background na Padding) 🔥 */}
        {(isFull || isPriceMoq || isImagePrice) && (!isStore || isTopDeal) && !isLocation && hasValidPrice && (
          <div className="flex items-center flex-wrap mt-1.5 max-md:!mt-1 max-md:!mb-0">
            {/* Bei ya Sasa (Badge) */}
            <div className="flex items-baseline gap-1 bg-[#fff7ed] dark:bg-[#ff6a00]/10 px-2 py-1 rounded-lg border border-[#ffedd5] dark:border-[#ff6a00]/20 shadow-sm">
              <span className="text-[#ff6a00] text-[13px] font-bold max-md:text-[10px]">
                {t('currency')}
              </span>
              <span className="text-[#ff6a00] text-[20px] font-black leading-none max-md:text-[15px]">
                {numPrice.toLocaleString()}
              </span>
            </div>
            
            {/* Bei ya Awali (Iliyokatwa) */}
            {isFull && numOriginal > 0 && numOriginal > numPrice && (
              <span className="line-through text-gray-400 dark:text-gray-500 text-[13px] font-normal ml-2 max-md:text-[10px]">
                {numOriginal.toLocaleString()}
              </span>
            )}
          </div>
        )}

        {/* MOQ */}
        {(isFull || isPriceMoq) && (isStore || isTopDeal) && (
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[13px] text-gray-500 dark:text-gray-400 font-medium max-md:text-[9px] max-md:font-medium">
              {t('moq')}:
            </span>
            <span className="text-[14px] font-bold text-gray-900 dark:text-white max-md:text-[9px] max-md:font-bold">
              {(moq && moq !== "0" && moq !== 0) ? moq : '1'}
            </span>
          </div>
        )}

        {/* Category */}
        {isFull && categoryName && (
          <p className="text-[11px] mt-0.5 text-gray-500 dark:text-gray-400 max-md:text-[10px] m-0">
            {categoryName}
          </p>
        )}

        {/* Subtitle */}
        {isFull && subtitle && (
          <div className="flex items-center gap-1 mt-0.5 text-gray-500 dark:text-gray-400 w-full overflow-hidden 
          whitespace-nowrap text-ellipsis">
            <MapPin size={10} className="w-2.5 h-2.5 max-md:w-2.5 max-md:h-2.5" />
            <span className="text-[11px] font-normal leading-tight max-md:text-[9.5px]">
              {subtitle}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}