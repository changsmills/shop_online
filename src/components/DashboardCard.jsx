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
   //<div className="product-card-item" onClick={onClick} data-is-store={isStore}>
   // Badilisha hapa:
<div 
  className="product-card-item" 
  onClick={onClick} 
  data-is-store={isStore}
  onContextMenu={(e) => e.preventDefault()}
  style={{
    backgroundColor: 'transparent', // ✅ Inafanya background iwe wazi
    border: 'none',                 // ✅ Inatoa border yoyote nyeupe
    boxShadow: 'none',              // ✅ Inatoa kivuli kinachoweza kuleta weupe
    padding: 0,                     // ✅ Inahakikisha kadi haina nafasi ya ndani
    margin: 0                       // ✅ Inahakikisha kadi haina nafasi ya nje
  }}
>
      {/* IMAGE CONTAINER - Different for mobile vs desktop */}
      <div 
        className="product-card-media"
        style={{
          position: 'relative',
          width: '100%',
          // ✅ MOBILE: Square (1:1), DESKTOP: Rectangle (3:4 or as you want)
          aspectRatio: isMobile ? '1 / 1' : '1 / 1',
          backgroundColor: '#ece7e7',
          overflow: 'hidden',
          WebkitTouchCallout: 'none',
          //borderRadius: '8px 8px 0 0',
          borderRadius: '8px',
        }}
      >
        {rank && Number(rank) > 0 ? (
          <div className={`rank-indicator rank-level-${rank}`}>
            <Trophy size={isMobile ? 8 : 10} fill="currentColor" />
            <span>{rank}</span>
          </div>
        ) : null}
        
       {/* ✅ Badilisha hapa ili isTopDeal iweze kuonyesha beji ya punguzo pia */}
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
  style={{
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    transition: 'transform 0.3s ease-out',
    transform: 'scale(1)',
  }}
  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
  onTouchStart={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
  onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
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
          padding: isMobile ? '2px 6px 6px 6px' : '0px 5px 5px 4px', // Hapa '2px' ni ya juu, imepunguzwa sana
         // padding: isMobile ? '4px 6px' : '1px 2px',
          display: 'flex',
          flexDirection: 'column',
          marginTop: isMobile ? '-2px' : '-4px', // Hii inavuta info section juu kidogo iguse picha
            gap: isMobile ? '1px' : '0px',
          backgroundColor: 'transparent',
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
        
       {/* ✅ Ikiwemo isTopDeal hapa, bei itatokea hata kama isStore ni true */}
        {(!isStore || isTopDeal) && !isLocation && hasValidPrice && (
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
    fontSize: isMobile ? '9px' : '19px',
    fontWeight: '700',
    color: '#ca290d',
  }}
>
  {t('currency')}
</span>
              <span 
                className="price-amount"
                style={{
                  fontSize: isMobile ? '13px' : '19px',
                  fontWeight: '700',
                  color: '#ca290d',
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

{/* ✅ Ikiwa ni Store AU ni TopDeal, onyesha MOQ kwenye mstari mmoja nadhifu */}
{(isStore || isTopDeal) && (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '4px', 
    marginTop: '1px',
    marginBottom:'1px',
    lineHeight: '1' 
  }}>
    <span style={{ 
      fontSize: isMobile ? '10px' : '15px', 
      color: '#666',
      fontWeight: '500'
    }}>
      {t('moq')}:
    </span>
    <span style={{ 
      fontSize: isMobile ? '10px' : '15px', 
      fontWeight: '700',
      color: '#333'
    }}>
      {(moq && moq !== "0" && moq !== 0) ? moq : '1'}
    </span>
  </div>
)}


{/* ✅ Sehemu ya Category Name - Mstari wake wenyewe */}
{categoryName && (
  <p style={{
    fontSize: isMobile ? '9px' : '11px',
    fontWeight: '700',
    color: '#f97316', 
    margin: '4px 0 0 0', // Nafasi kidogo juu
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }}>
    {categoryName}
  </p>
)}

{/* ✅ Subtitle (Location) - Chini ya Category na Ikoni */}
{subtitle && (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '3px', 
    marginTop: '2px' 
  }}>
    <MapPin size={isMobile ? 8 : 10} color="#888" />
    <span 
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
    </span>
  </div>
)}
       
      </div>
    </div>
  );
}