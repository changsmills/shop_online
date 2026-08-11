// src/components/StoreCard.jsx
import React from 'react';
import { MapPin, Star, ShieldCheck, ChevronRight } from "lucide-react";
import '../StoreCard.css';

export default function StoreCard({ store, onClick }) {
  // 🔥 Pata majina kwa usalama
  const storeName = store.store_name || 'Store';
  const city = store.city || 'Tanzania';
  const categoryName = store.category_name || store.business_type || 'Store';

  // 🔥 Tumia picha kutoka backend au placeholder
  let storeImage = 
    store.office_image_1 || 
    store.office_image_2 || 
    store.store_logo || 
    store.store_banner || 
    'https://via.placeholder.com/300x300?text=Store';

  // 🔥 DEBUG: Chapisha kwenye console ili uone ni picha ipi inayotumika
  console.log(`🖼️ [StoreCard] Store: ${storeName}`);
  console.log(`  - Final Image: ${storeImage}`);

  return (
    <div 
      className="store-card"
      onClick={onClick}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* IMAGE CONTAINER */}
      <div className="store-card-img-container">
        {store.is_verified && (
          <div className="verified-badge">
            <ShieldCheck size={10} />
            <span>Verified</span>
          </div>
        )}
        
        <img 
          src={storeImage} 
          alt={storeName}
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
          className="store-card-img"
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onTouchStart={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onError={(e) => { 
            console.warn(`⚠️ [StoreCard] Image failed to load for ${storeName}, using placeholder.`);
            e.target.src = 'https://via.placeholder.com/300x300?text=Store'; 
          }}
        />
      </div>

      {/* INFO SECTION */}
      <div className="store-card-info">
        <h4 className="store-card-name">{storeName}</h4>

        {categoryName && (
          <p className="store-card-category">{categoryName}</p>
        )}
        
        <div className="store-card-stats">
          {store.average_rating > 0 && (
            <div className="store-card-rating">
              <Star size={9} fill="#fbbf24" stroke="#fbbf24" />
              <span>{store.average_rating}</span>
            </div>
          )}
          {store.total_sales > 0 && (
            <span className="store-card-sales">
              {store.total_sales?.toLocaleString()} sales
            </span>
          )}
        </div>

        <div className="store-card-location">
          <MapPin size={9} color="#999" />
          <span>{city}</span>
        </div>

        <div className="store-card-action">
          <span>View Store</span>
          <ChevronRight size={12} />
        </div>
      </div>
    </div>
  );
}