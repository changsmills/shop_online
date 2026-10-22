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

  const displayTitle = title?.length > 30 ? title.substring(0, 25) + '...' : title;

  // Rank Background Colors
  const getRankColor = (r) => {
    if (Number(r) === 1) return 'bg-[#ff4d4f]';
    if (Number(r) === 2) return 'bg-[#ff7a45]';
    return 'bg-[#ffc53d]';
  };

  return (
    <div 
      className={`product-card-item group relative flex flex-col w-full overflow-hidden rounded-lg border border-[#e5e7eb] bg-[#f8f9fa] shadow-[0_2px_8px_rgba(0,0,0,0.06)] cursor-pointer transition-shadow duration-250 ease-in-out box-border dark:border-[#334155] dark:bg-[#1e293b] max-md:rounded-[10px] ${isStore ? 'is-store' : ''} ${isLocation ? 'is-location' : ''} display-${displayMode}`}
      onClick={onClick} 
      onContextMenu={(e) => e.preventDefault()}
    >
      
      {/* IMAGE CONTAINER */}
      <div className="relative w-full aspect-square overflow-hidden rounded-t-lg bg-[#f1f3f5] dark:bg-gray-800 max-md:rounded-t-[10px]">
        
        {/* Rank Indicator */}
        {rank && Number(rank) > 0 ? (
          <div className={`absolute top-1 left-1 z-20 flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold text-white max-md:px-[5px] max-md:text-[8px] ${getRankColor(rank)}`}>
            <Trophy size={10} fill="currentColor" />
            <span>{rank}</span>
          </div>
        ) : null}
        
        {/* Discount Badge */}
        {isFull && (!isStore || isTopDeal) && numOriginal > 0 && hasValidPrice && numPrice < numOriginal && (
          <div className="absolute top-1 right-1 z-20 rounded bg-[#ef4444] px-1.5 py-0.5 text-[10px] font-bold text-white max-md:px-[5px] max-md:text-[8px]">
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
          <div className="absolute bottom-1 left-1 z-20 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
            <MapPin size={10} />
            <span>{overlay}</span>
          </div>
        )}
      </div>

      {/* INFO SECTION */}
      <div className="relative z-20 flex flex-col gap-1 p-3 pb-3.5 bg-transparent max-md:!gap-0 max-md:!p-[4px_8px_6px_8px]">
        
        {/* Title */}
        <h4 className="m-0 line-clamp-2 text-[14px] font-semibold leading-tight tracking-wide text-gray-900 dark:text-white max-md:text-[12px] max-md:font-semibold max-md:leading-[1.2]">
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
        
        {/* Price Row */}
        {(isFull || isPriceMoq || isImagePrice) && (!isStore || isTopDeal) && !isLocation && hasValidPrice && (
          <div className="flex items-baseline gap-1 flex-wrap mt-0.5 max-md:!mt-0 max-md:!mb-0">
            <div className="flex items-baseline">
              <span className="text-[#ff6a00] text-[16px] font-bold max-md:text-[10px] max-md:font-bold">
                {t('currency')}
              </span>
              <span className="text-[#ff6a00] text-[22px] font-extrabold max-md:text-[13px] max-md:font-extrabold">
                {numPrice.toLocaleString()}
              </span>
            </div>
            
            {isFull && numOriginal > 0 && numOriginal > numPrice && (
              <span className="line-through text-gray-400 dark:text-gray-500 text-[14px] font-normal max-md:text-[10px]">
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
          <div className="flex items-center gap-1 mt-0.5 text-gray-500 dark:text-gray-400 w-full overflow-hidden whitespace-nowrap text-ellipsis">
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