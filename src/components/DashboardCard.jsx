// src/components/DashboardCard.jsx
import React from 'react';
import { Eye, Trophy, MapPin } from "lucide-react";
import "../DashboardCard.css";
import { useTranslation } from 'react-i18next';

export default function DashboardCard({ 
  image, 
  title, 
  price, 
  originalPrice, 
  moq,
  views, 
  rank, 
  overlay, 
  subtitle,
  categoryName,
  isStore, 
  isTopDeal,
  isLocation, 
  isMobile,
  onClick 
}) {
  const numPrice = Number(price);
  const { t } = useTranslation();
  const numOriginal = Number(originalPrice);
  const hasValidPrice = price !== undefined && price !== null && !isNaN(numPrice);

  const displayTitle = isMobile && title?.length > 30 
    ? title.substring(0, 25) + '...' 
    : title;

  return (
    <div 
      className={`product-card-item ${isStore ? 'is-store' : ''} ${isLocation ? 'is-location' : ''}`}
      onClick={onClick} 
      onContextMenu={(e) => e.preventDefault()}
    >
      
      {/* IMAGE CONTAINER */}
      <div className="product-card-media">
        
        {rank && Number(rank) > 0 ? (
          <div className={`rank-indicator rank-level-${rank}`}>
            <Trophy size={isMobile ? 8 : 10} fill="currentColor" />
            <span>{rank}</span>
          </div>
        ) : null}
        
        {(!isStore || isTopDeal) && numOriginal > 0 && hasValidPrice && numPrice < numOriginal && (
          <div className="discount-badge-mini">
            -{Math.round(((numOriginal - numPrice) / numOriginal) * 100)}%
          </div>
        )}
        
        <img 
          src={image || 'https://via.placeholder.com/200'} 
          alt={title} 
          className="product-card-img"
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/200'; }}
        />

        {overlay && (
          <div className="product-card-location">
            <MapPin size={isMobile ? 8 : 9} />
            <span>{overlay}</span>
          </div>
        )}

      </div>

      {/* INFO SECTION */}
      <div className="product-card-info">
        
        <h4 className="product-card-title">
          {displayTitle || title}
        </h4>
        
        {/* PRICE ROW */}
        {(!isStore || isTopDeal) && !isLocation && hasValidPrice && (
          <div className="product-card-price-row">
            <div className="price-main">
              <span className="price-currency">{t('currency')}</span>
              <span className="price-amount">
                {numPrice.toLocaleString()}
              </span>
            </div>
            
            {numOriginal > 0 && numOriginal > numPrice && (
              <span className="price-original-strikethrough">
                {numOriginal.toLocaleString()}
              </span>
            )}
          </div>
        )}

        {/* MOQ - Ikiwa ni Store au TopDeal */}
        {(isStore || isTopDeal) && (
          <div className="store-moq-info">
            <span className="moq-label">{t('moq')}:</span>
            <span className="moq-value">
              {(moq && moq !== "0" && moq !== 0) ? moq : '1'}
            </span>
          </div>
        )}

        {/* Category Name */}
        {categoryName && (
          <p className="product-card-category">{categoryName}</p>
        )}

        {/* Subtitle (Location) */}
        {subtitle && (
          <div className="product-card-subtitle-row">
            <MapPin size={isMobile ? 8 : 10} className="subtitle-icon" />
            <span className="product-card-subtitle">{subtitle}</span>
          </div>
        )}
       
      </div>
    </div>
  );
}