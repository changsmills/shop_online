import React from 'react';
import { Trophy, MapPin, BadgeCheck } from "lucide-react";
import "../DashboardCard.css";
import { useTranslation } from 'react-i18next';

export default function DashboardCard({ 
  image, 
  title, 
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
  displayMode = 'full', // full, image-only, price-moq, image-price
  onClick 
}) {
  const numPrice = Number(price);
  const { t } = useTranslation();
  const numOriginal = Number(originalPrice);
  const hasValidPrice = price !== undefined && price !== null && !isNaN(numPrice);

  // 🔥 LOGIC YA MODE (SASA UNA image-price)
  const isFull = displayMode === 'full';
  const isImageOnly = displayMode === 'image-only';
  const isPriceMoq = displayMode === 'price-moq';
  const isImagePrice = displayMode === 'image-price';

  const displayTitle = title?.length > 30 ? title.substring(0, 25) + '...' : title;

  return (
    <div 
      className={`product-card-item ${isStore ? 'is-store' : ''} ${isLocation ? 'is-location' : ''} display-${displayMode}`}
      onClick={onClick} 
      onContextMenu={(e) => e.preventDefault()}
    >
      
      {/* IMAGE CONTAINER */}
      <div className="product-card-media">
        {rank && Number(rank) > 0 ? (
          <div className={`rank-indicator rank-level-${rank}`}>
            <Trophy size={10} fill="currentColor" />
            <span>{rank}</span>
          </div>
        ) : null}
        
        {/* 🔥 Discount Inaonekana TU kwenye FULL mode */}
        {isFull && (!isStore || isTopDeal) && numOriginal > 0 && hasValidPrice && numPrice < numOriginal && (
          <div className="discount-badge-mini">
            -{Math.round(((numOriginal - numPrice) / numOriginal) * 100)}%
          </div>
        )}
        
        <img 
          src={image || ''} 
          alt={title} 
          className="product-card-img"
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
          onError={(e) => { 
            e.target.style.display = 'none';
          }}
        />

        {/* 🔥 Overlay Inaonekana TU kwenye FULL mode */}
        {isFull && overlay && (
          <div className="product-card-location">
            <MapPin size={10} />
            <span>{overlay}</span>
          </div>
        )}
      </div>

      {/* INFO SECTION */}
      <div className="product-card-info">
        {/* 🔥 JINA LINAONEKANA KILA MARA */}
        <h4 className="product-card-title">
          {displayTitle || title}
        </h4>

        {/* 🔥 VERIFIED - FULL TU */}
        {isFull && isVerified && (
          <div className="verified-badge-wrapper">
            <BadgeCheck size={12} className="verified-icon" />
            <span className="verified-text">Verified</span>
          </div>
        )}

        {/* 🔥 SOLD COUNT - FULL TU */}
        {isFull && !isStore && views > 0 && (
          <div className="sold-count-wrapper">
            <span>{views.toLocaleString()} sold</span>
          </div>
        )}
        
        {/* 🔥 BEI - Inaonekana kwenye FULL, PRICE-MOQ, na IMAGE-PRICE */}
        {(isFull || isPriceMoq || isImagePrice) && (!isStore || isTopDeal) && !isLocation && hasValidPrice && (
          <div className="product-card-price-row">
            <div className="price-main">
              <span className="price-currency">{t('currency')}</span>
              <span className="price-amount">
                {numPrice.toLocaleString()}
              </span>
            </div>
            
            {isFull && numOriginal > 0 && numOriginal > numPrice && (
              <span className="price-original-strikethrough">
                {numOriginal.toLocaleString()}
              </span>
            )}
          </div>
        )}

        {/* 🔥 MOQ - Inaonekana kwenye FULL na PRICE-MOQ TU (SI IMAGE-PRICE) */}
        {(isFull || isPriceMoq) && (isStore || isTopDeal) && (
          <div className="store-moq-info">
            <span className="moq-label">{t('moq')}:</span>
            <span className="moq-value">
              {(moq && moq !== "0" && moq !== 0) ? moq : '1'}
            </span>
          </div>
        )}

        {/* 🔥 CATEGORY - FULL TU */}
        {isFull && categoryName && (
          <p className="product-card-category">{categoryName}</p>
        )}

        {/* 🔥 SUBTITLE - FULL TU */}
        {isFull && subtitle && (
          <div className="product-card-subtitle-row">
            <MapPin size={10} className="subtitle-icon" />
            <span className="product-card-subtitle">{subtitle}</span>
          </div>
        )}
      </div>
    </div>
  );
}