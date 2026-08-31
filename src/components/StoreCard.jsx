// src/components/StoreCard.jsx
import React from 'react';
import { MapPin, Star, ShieldCheck, ChevronRight } from "lucide-react";
import '../StoreCard.css';

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
    null; // 🔥 Hakuna placeholder ya nje!

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
        
                {storeImage ? (
          <img 
            src={storeImage} 
            alt={storeName}
            className="store-card-img"
            onError={(e) => { 
              // 🔥 Tumia SVG ya ndani (haitegemei internet!)
              e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><rect fill='%23f0f0f0' width='300' height='300'/><text fill='%23888' font-size='20' x='50%' y='50%' text-anchor='middle'>No Image</text></svg>"; 
            }}
          />
        ) : (
          <div className="store-card-no-image" style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0',
            color: '#888',
            fontSize: '48px',
            fontWeight: 'bold'
          }}>
            {storeName.charAt(0).toUpperCase()}
          </div>
        )}
        
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