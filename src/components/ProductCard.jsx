import { useNavigate } from "react-router-dom";
import { MapPin, Star, ChevronRight } from "lucide-react";
import "../ProductCard.css";

export default function ProductCard({ product, isMobile = false, isPriority = false }) {
  const navigate = useNavigate();
  
  const { 
    id, 
    price = 0, 
    original_price = null, 
    cover_image, 
    image,
    name = "Bidhaa", 
    soldCount = 20, 
    moq = 2, 
    location = "Tanzania", 
    address = "",
    is_verified = true,
    seller_years = 1,
    lowest_price_tag = false,
    hot_sale_tag = false
  } = product;
  
  // --- MABADILIKO YA PICHA YA OFISI YAANZA HAPA ---
  let finalImage = "/images/placeholder.png";

  try {
    // 1. Jaribu kuchukua picha ya kwanza ya ofisi kutoka store_info
    const officeImgs = typeof product.store_info?.office_images === 'string' 
      ? JSON.parse(product.store_info.office_images) 
      : product.store_info?.office_images;

    if (Array.isArray(officeImgs) && officeImgs.length > 0 && officeImgs[0]) {
      finalImage = officeImgs[0];
    } 
    // 2. Kama hamna picha ya ofisi, tumia picha ya bidhaa
    else if (cover_image || image) {
      finalImage = cover_image || image;
    }
  } catch (e) {
    // Kama kuna error yoyote, rudi kwenye picha ya bidhaa au placeholder
    finalImage = cover_image || image || "/images/placeholder.png";
  }
  // --- MABADILIKO YA PICHA YA OFISI YAISHA HAPA ---
  
  // Dynamic name length based on isMobile
  const maxNameLength = isMobile ? 30 : 60;
  const displayName = name?.length > maxNameLength 
    ? name.substring(0, maxNameLength - 3) + '...' 
    : name;

  const numericPrice = parseFloat(price) || 0;
  const numericOriginal = parseFloat(original_price) || 0;
  const hasDiscount = numericOriginal > 0 && numericOriginal > numericPrice;
  const displayPrice = hasDiscount ? numericOriginal : numericPrice;
  const oldPrice = hasDiscount ? numericPrice : null;

 // ========== MOBILE VERSION (Authentic Alibaba Style) ==========
if (isMobile) {
  return (
    <div 
      className="product-card mobile-card"
      onClick={() => navigate(`/product/${id}`)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
        height: 'fit-content',
        width: '100%',
        border: '0.5px solid #f0f0f0',
      }}
    >
      {/* 1. IMAGE CONTAINER - Square & Overlay */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          backgroundColor: '#f7f7f7',
        }}
      >
        <img 
          src={finalImage}  // <--- Tumia finalImage hapa
          alt={name} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e) => { e.target.src = "/images/placeholder.png"; }} 
        />
        
        {/* Hot Sale Badge (Top Left) */}
        {hot_sale_tag && (
          <div style={{
            position: 'absolute',
            top: '6px',
            left: '6px',
            backgroundColor: '#ff4d4f',
            color: '#fff',
            fontSize: '9px',
            fontWeight: 'bold',
            padding: '2px 6px',
            borderRadius: '4px',
            zIndex: 2,
          }}>
            Hot
          </div>
        )}

        {/* MOQ Badge (Bottom Left Overlay) */}
        {moq && (
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
            color: 'white',
            fontSize: '10px',
            padding: '12px 6px 4px',
            fontWeight: '500'
          }}>
            {moq} pieces
          </div>
        )}
      </div>

      {/* 2. INFO CONTENT - Compressed for Mobile */}
      <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        
        {/* Price Row - Alibaba emphasizes the price first */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '2px' }}>
          <span style={{ fontSize: '12px', color: '#222', fontWeight: 'bold' }}>TSh</span>
          <span style={{ fontSize: '17px', fontWeight: '800', color: '#222', letterSpacing: '-0.5px' }}>
            {displayPrice.toLocaleString()}
          </span>
        </div>

        {/* Product Name - Minimal Height */}
        <h3 style={{
          fontSize: '12px',
          fontWeight: '400',
          color: '#555',
          lineHeight: '1.2',
          margin: '0',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '28px',
        }}>
          {displayName}
        </h3>

        {/* Stats Row (Sold & Location) */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: '10px', 
          color: '#999',
          marginTop: '4px' 
        }}>
          <span>{soldCount.toLocaleString()} sold</span>
          <span>{location}</span>
        </div>

        {/* Trust Row - Supplier Identity */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px', 
          marginTop: '6px',
          paddingTop: '6px',
          borderTop: '0.5px solid #f5f5f5' 
        }}>
          {is_verified && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '2px',
              backgroundColor: '#fff7e6',
              padding: '1px 4px',
              borderRadius: '2px'
            }}>
              <span style={{ color: '#fa8c16', fontSize: '10px', fontWeight: '800' }}>{seller_years}y</span>
              <span style={{ color: '#fa8c16', fontSize: '9px', fontWeight: '600' }}>Verified</span>
            </div>
          )}
          <span style={{ fontSize: '9px', color: '#bbb' }}>{address || 'CN'}</span>
        </div>
      </div>
    </div>
  );
}

  // ========== DESKTOP VERSION (Original layout - keeps everything as before) ==========
  return (
    <div 
      className={`product-card ${isPriority ? 'priority-card' : ''}`}
      onClick={() => navigate(`/product/${id}`)}
    >
      {/* IMAGE SECTION - Square with zoom */}
      <div className="image-container">
        <div className="image-wrapper">
          <img 
            src={finalImage}  // <--- Tumia finalImage hapa
            alt={name} 
            className="product-image"
            onError={(e) => { e.target.src = "/images/placeholder.png"; }} 
          />
        </div>
        
        {lowest_price_tag && (
          <div className="lowest-price-tag">
            <span>Lowest price</span>
          </div>
        )}
        
        {hot_sale_tag && (
          <div className="hot-sale-tag">
            <span>🔥 Hot Sale</span>
          </div>
        )}
      </div>

      {/* INFO SECTION */}
      <div className="info-container">
        <h3 className="product-name">{displayName}</h3>

        {lowest_price_tag && (
          <div className="lowest-price-banner">
            <span className="banner-icon">💰</span>
            <span>180-day lowest prices</span>
          </div>
        )}

        <div className="price-section">
          <div className="price-single">
            <span className="currency">TSh</span>
            <span className="price-value">{displayPrice.toLocaleString()}</span>
            {oldPrice && (
              <span className="old-price">TSh {oldPrice.toLocaleString()}</span>
            )}
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-label">MOQ:</span>
            <span className="stat-value">{moq} {moq > 1 ? 'pairs' : 'piece'}</span>
          </div>
          <div className="stat-divider">•</div>
          <div className="stat-item">
            <span className="stat-value">{soldCount.toLocaleString()}</span>
            <span className="stat-label"> sold</span>
          </div>
          <div className="stat-divider">•</div>
          <div className="stat-item location-stat">
            <MapPin size={10} className="inline mr-0.5" />
            <span className="country-code">{location}</span>
          </div>
        </div>

        <div className="trust-row">
          {is_verified && (
            <div className="verified-badge">
              <span className="verified-icon">✓</span>
              <span>Verified</span>
            </div>
          )}
          <div className="years-badge">
            <Star size={10} className="inline mr-0.5 text-yellow-500" />
            <span>{seller_years} yrs</span>
          </div>
          <div className="country-badge">
            <span>· {address || 'CN'}</span>
            <ChevronRight size={10} className="inline ml-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
}