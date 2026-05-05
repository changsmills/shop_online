// src/components/DashboardCard.jsx
import React from 'react';
import { Eye, Trophy, MapPin } from "lucide-react";
import "../DashboardCard.css";

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
  isStore, 
  isLocation, 
  isMobile,
  onClick 
}) {
  const numPrice = Number(price);
  const numOriginal = Number(originalPrice);
  const hasValidPrice = price !== undefined && price !== null && !isNaN(numPrice);

  const displayTitle = isMobile && title?.length > 30 
    ? title.substring(0, 25) + '...' 
    : title;

  return (
    <div className="product-card-item" onClick={onClick} data-is-store={isStore}>
      {/* IMAGE CONTAINER - Different for mobile vs desktop */}
      <div 
        className="product-card-media"
        style={{
          position: 'relative',
          width: '100%',
          // ✅ MOBILE: Square (1:1), DESKTOP: Rectangle (3:4 or as you want)
          aspectRatio: isMobile ? '1 / 1' : '3 / 4',
          backgroundColor: '#f8f8f8',
          overflow: 'hidden',
          borderRadius: '8px 8px 0 0',
        }}
      >
        {rank && Number(rank) > 0 ? (
          <div className={`rank-indicator rank-level-${rank}`}>
            <Trophy size={isMobile ? 8 : 10} fill="currentColor" />
            <span>{rank}</span>
          </div>
        ) : null}
        
        {!isStore && numOriginal > 0 && hasValidPrice && numPrice < numOriginal && (
          <div className="discount-badge-mini">
            -{Math.round(((numOriginal - numPrice) / numOriginal) * 100)}%
          </div>
        )}
        
        {/* ✅ IMAGE - Now uses container's aspect ratio */}
        <img 
          src={image || 'https://via.placeholder.com/200'} 
          alt={title} 
          className="product-card-img"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/200'; }}
        />

        {overlay && (
          <div className="product-card-location">
            <MapPin size={isMobile ? 8 : 9} />
            <span>{overlay}</span>
          </div>
        )}


      </div>

      {/* INFO SECTION - Responsive padding based on isMobile */}
      <div 
        className="product-card-info"
        style={{
          padding: isMobile ? '6px' : '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '3px' : '5px',
        }}
      >
        <h4 
          className="product-card-title"
          style={{
            margin: 0,
            fontSize: isMobile ? '11px' : '13px',
            color: '#333',
            fontWeight: '500',
            lineHeight: '1.3',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {displayTitle || title}
        </h4>
        
        {!isStore && !isLocation && hasValidPrice && (
          <div 
            className="product-card-price-row"
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: isMobile ? '4px' : '8px',
              flexWrap: 'wrap',
            }}
          >
            <div className="price-main">
              <span 
                className="price-currency"
                style={{
                  fontSize: isMobile ? '9px' : '11px',
                  fontWeight: '700',
                  color: '#f97316',
                }}
              >
                TSh
              </span>
              <span 
                className="price-amount"
                style={{
                  fontSize: isMobile ? '13px' : '16px',
                  fontWeight: '700',
                  color: '#f97316',
                }}
              >
                {numPrice.toLocaleString()}
              </span>
            </div>
            
            {numOriginal > 0 && numOriginal > numPrice && (
              <span 
                className="price-original-strikethrough"
                style={{
                  textDecoration: 'line-through',
                  color: '#999',
                  fontSize: isMobile ? '9px' : '12px',
                }}
              >
                {numOriginal.toLocaleString()}
              </span>
            )}
          </div>
        )}

        {isStore && (
          <div className="store-moq-info">
            <span className="moq-label">Minimum Order:</span>
            <span className="moq-value">
              {(moq && moq !== "0" && moq !== 0) ? moq : '1'}
            </span>
          </div>
        )}

        {subtitle && (
          <p 
            className="product-card-subtitle"
            style={{
              fontSize: isMobile ? '9px' : '10px',
              color: '#888',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}