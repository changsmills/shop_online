import React from 'react';
import { Eye, Trophy, MapPin, BadgeCheck } from "lucide-react"; // 🔥 Ongeza BadgeCheck!
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
  isVerified = false, // 🔥 Ongeza hii
  onClick 
}) {
  const numPrice = Number(price);
  const { t } = useTranslation();
  const numOriginal = Number(originalPrice);
  const hasValidPrice = price !== undefined && price !== null && !isNaN(numPrice);

  const displayTitle = title?.length > 30 ? title.substring(0, 25) + '...' : title;

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
            <Trophy size={10} fill="currentColor" />
            <span>{rank}</span>
          </div>
        ) : null}
        
        {(!isStore || isTopDeal) && numOriginal > 0 && hasValidPrice && numPrice < numOriginal && (
          <div className="discount-badge-mini">
            -{Math.round(((numOriginal - numPrice) / numOriginal) * 100)}%
          </div>
        )}
        
        {/* 🔥 BADILISHA HAPA: Picha halisi, placeholder ya ndani kwa usalama */}
        <img 
          src={image || ''} 
          alt={title} 
          className="product-card-img"
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
          onError={(e) => { 
            e.target.style.display = 'none'; // 🔥 Ficha picha ikiwa imevunjika
          }}
        />

        {overlay && (
          <div className="product-card-location">
            <MapPin size={10} />
            <span>{overlay}</span>
          </div>
        )}
      </div>

      {/* INFO SECTION */}
      <div className="product-card-info">
        <h4 className="product-card-title">
          {displayTitle || title}
        </h4>

        {/* 🔥 NEW: Verified Badge (Ikiwa ni Verified) */}
        {isVerified && (
          <div className="verified-badge-wrapper">
            <BadgeCheck size={12} className="verified-icon" />
            <span className="verified-text">Verified</span>
          </div>
        )}

        {/* 🔥 NEW: Sold Count (Kutoka kwa views) */}
        {!isStore && views > 0 && (
          <div className="sold-count-wrapper">
            <span>{views.toLocaleString()} sold</span>
          </div>
        )}
        
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

        {categoryName && (
          <p className="product-card-category">{categoryName}</p>
        )}

        {subtitle && (
          <div className="product-card-subtitle-row">
            <MapPin size={10} className="subtitle-icon" />
            <span className="product-card-subtitle">{subtitle}</span>
          </div>
        )}
      </div>
    </div>
  );
}