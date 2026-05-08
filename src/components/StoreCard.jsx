// src/components/StoreCard.jsx
import React from 'react';
import { MapPin, Star, ShieldCheck, ChevronRight } from "lucide-react";

export default function StoreCard({ store, isMobile, onClick }) {
  const {
    id,
    store_name,
    store_logo,
    city,
    business_type,
    is_verified,
    average_rating,
    total_sales,
    category_name
  } = store;

  // Pata picha ya ofisi au logo
  let storeImage = store_logo || '/images/store-placeholder.png';
  
  // Kama kuna office_images, jaribu kuchukua ya kwanza
  if (store.office_images) {
    try {
      const officeImgs = typeof store.office_images === 'string' 
        ? JSON.parse(store.office_images) 
        : store.office_images;
      if (officeImgs && officeImgs.length > 0 && officeImgs[0]) {
        storeImage = officeImgs[0];
      }
    } catch (e) {}
  }

  // ========== MOBILE VERSION ==========
  if (isMobile) {
    return (
      <div 
        onClick={onClick}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
          padding: 0,
          margin: 0,
          cursor: 'pointer',
        }}
      >
        {/* IMAGE CONTAINER */}
        <div 
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1 / 1',
            backgroundColor: '#ece7e7',
            overflow: 'hidden',
            borderRadius: '8px',
          }}
        >
          {/* Verification Badge */}
          {is_verified && (
            <div style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              backgroundColor: '#10b981',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '8px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              zIndex: 2
            }}>
              <ShieldCheck size={8} />
              <span>Verified</span>
            </div>
          )}
          
          <img 
            src={storeImage} 
            alt={store_name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transition: 'transform 0.3s ease-in-out',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onTouchStart={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onError={(e) => { e.target.src = '/images/store-placeholder.png'; }}
          />
        </div>

        {/* INFO SECTION */}
        <div 
          style={{
            padding: '6px 4px 4px 4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            backgroundColor: 'transparent',
          }}
        >
          {/* Store Name */}
          <h4 
            style={{
              margin: 0,
              fontSize: '11px',
              color: '#333',
              fontWeight: '600',
              lineHeight: '1.3',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {store_name}
          </h4>

          {/* Category / Business Type */}
          {category_name && (
            <p style={{
              fontSize: '8px',
              fontWeight: '600',
              color: '#f97316',
              margin: '0',
              textTransform: 'uppercase',
              letterSpacing: '0.3px'
            }}>
              {category_name}
            </p>
          )}
          
          {/* Stats Row (Rating & Sales) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '8px',
            color: '#999',
            marginTop: '2px'
          }}>
            {average_rating > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <Star size={8} fill="#fbbf24" stroke="#fbbf24" />
                <span>{average_rating}</span>
              </div>
            )}
            {total_sales > 0 && (
              <span>{total_sales?.toLocaleString()} sales</span>
            )}
          </div>

          {/* Location */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '2px',
            fontSize: '8px', 
            color: '#999',
          }}>
            <MapPin size={8} color="#999" />
            <span>{city || 'Tanzania'}</span>
          </div>
        </div>
      </div>
    );
  }

  // ========== DESKTOP VERSION ==========
  return (
    <div 
      onClick={onClick}
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',
        padding: 0,
        margin: 0,
        cursor: 'pointer',
      }}
    >
      {/* IMAGE CONTAINER */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          backgroundColor: '#ece7e7',
          overflow: 'hidden',
          borderRadius: '8px',
        }}
      >
        {/* Verification Badge */}
        {is_verified && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: '#10b981',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '20px',
            fontSize: '10px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            zIndex: 2
          }}>
            <ShieldCheck size={12} />
            <span>Verified</span>
          </div>
        )}
        
        <img 
          src={storeImage} 
          alt={store_name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onError={(e) => { e.target.src = '/images/store-placeholder.png'; }}
        />
      </div>

      {/* INFO SECTION - Desktop */}
      <div 
        style={{
          padding: '8px 6px 6px 6px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          backgroundColor: 'transparent',
        }}
      >
        {/* Store Name */}
        <h4 
          style={{
            margin: 0,
            fontSize: '14px',
            color: '#333',
            fontWeight: '600',
            lineHeight: '1.3',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {store_name}
        </h4>

        {/* Category / Business Type */}
        {category_name && (
          <p style={{
            fontSize: '10px',
            fontWeight: '600',
            color: '#f97316',
            margin: '0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {category_name}
          </p>
        )}
        
        {/* Stats Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '10px',
          color: '#666',
          marginTop: '2px'
        }}>
          {average_rating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Star size={10} fill="#fbbf24" stroke="#fbbf24" />
              <span>{average_rating}</span>
            </div>
          )}
          {total_sales > 0 && (
            <span>{total_sales?.toLocaleString()} sales</span>
          )}
        </div>

        {/* Location */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px',
          fontSize: '10px', 
          color: '#999',
          marginTop: '2px'
        }}>
          <MapPin size={10} color="#999" />
          <span>{city || 'Tanzania'}</span>
        </div>

        {/* View Store Link */}
        <div style={{
          marginTop: '6px',
          paddingTop: '6px',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#f97316',
          fontSize: '11px',
          fontWeight: '600'
        }}>
          <span>View Store</span>
          <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
}