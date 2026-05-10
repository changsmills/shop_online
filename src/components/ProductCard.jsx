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
  
  // --- MABADILIKO YA PICHA YA OFISI ---
  let finalImage = "/images/placeholder.png";

  try {
    const officeImgs = typeof product.store_info?.office_images === 'string' 
      ? JSON.parse(product.store_info.office_images) 
      : product.store_info?.office_images;

    if (Array.isArray(officeImgs) && officeImgs.length > 0 && officeImgs[0]) {
      finalImage = officeImgs[0];
    } 
    else if (cover_image || image) {
      finalImage = cover_image || image;
    }
  } catch (e) {
    finalImage = cover_image || image || "/images/placeholder.png";
  }
  
  // Dynamic name length
  const maxNameLength = isMobile ? 30 : 60;
  const displayName = name?.length > maxNameLength 
    ? name.substring(0, maxNameLength - 3) + '...' 
    : name;

  const numericPrice = parseFloat(price) || 0;
  const numericOriginal = parseFloat(original_price) || 0;
  const hasDiscount = numericOriginal > 0 && numericOriginal > numericPrice;
  const displayPrice = hasDiscount ? numericOriginal : numericPrice;
  const oldPrice = hasDiscount ? numericPrice : null;

  // ========== MOBILE VERSION (Sawa na DashboardCard style) ==========
  if (isMobile) {
    return (
      <div 
        className="product-card-item" 
        onClick={() => navigate(`/product/${id}`)}
        onContextMenu={(e) => e.preventDefault()} // <---
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
          padding: 0,
          margin: 0,
          cursor: 'pointer',
          // 2. Inazuia rangi ya kijani/bluu (highlight) unapogusa
          WebkitTapHighlightColor: 'transparent', // <---
          WebkitUserSelect: 'none',               // <---
          userSelect: 'none'
        }}
      >
        {/* IMAGE CONTAINER - Square kama DashboardCard */}
        <div 
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1 / 1',
            backgroundColor: '#ece7e7',
            overflow: 'hidden',
            borderRadius: '8px',
            WebkitTouchCallout: 'none' // <---
          }}
        >
          {/* Hot Sale Badge */}
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

          {/* Discount Badge */}
          {hasDiscount && (
            <div style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              backgroundColor: '#ca290d',
              color: '#fff',
              fontSize: '9px',
              fontWeight: 'bold',
              padding: '2px 6px',
              borderRadius: '4px',
              zIndex: 2,
            }}>
              -{Math.round(((numericOriginal - numericPrice) / numericOriginal) * 100)}%
            </div>
          )}

          {/* MOQ Badge (Bottom) */}
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
              MOQ: {moq} {moq > 1 ? 'pcs' : 'pc'}
            </div>
          )}
          
       <img 
  src={finalImage} 
  alt={name} 
  // 4. Inazuia picha isivutike (drag) na menu ya picha isitokee
            draggable="false"                          // <---
            onContextMenu={(e) => e.preventDefault()} // <---
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
  onError={(e) => { e.target.src = '/images/placeholder.png'; }} 
/>
        </div>

        {/* INFO SECTION - Kama DashboardCard */}
        <div 
          style={{
            padding: '6px 4px 4px 4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            backgroundColor: 'transparent',
          }}
        >
          {/* Product Name */}
          <h4 
            style={{
              margin: 0,
              fontSize: '11px',
              color: '#333',
              fontWeight: '500',
              lineHeight: '1.3',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '28px',
            }}
          >
            {displayName}
          </h4>
          
          {/* Price Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '4px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span 
                style={{
                  fontSize: '9px',
                  fontWeight: '700',
                  color: '#ca290d',
                }}
              >
                TSh
              </span>
              <span 
                style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#ca290d',
                }}
              >
                {displayPrice.toLocaleString()}
              </span>
            </div>
            
            {oldPrice && (
              <span 
                style={{
                  textDecoration: 'line-through',
                  color: '#999',
                  fontSize: '9px',
                }}
              >
                {oldPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* MOQ row (kama haiko kwenye image overlay) */}
          {!moq && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              marginTop: '1px',
            }}>
              <span style={{ fontSize: '9px', color: '#666' }}>MOQ:</span>
              <span style={{ fontSize: '10px', fontWeight: '600', color: '#333' }}>1</span>
            </div>
          )}

          {/* Stats Row (Sold & Location) */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '9px', 
            color: '#999',
            marginTop: '2px' 
          }}>
            <span>{soldCount?.toLocaleString() || 0} sold</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <MapPin size={8} color="#999" />
              <span>{location || 'Tanzania'}</span>
            </div>
          </div>

          {/* Verified Badge */}
          {is_verified && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              marginTop: '4px',
              paddingTop: '3px',
              borderTop: '0.5px solid #f0f0f0' 
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '2px',
                backgroundColor: '#fff7e6',
                padding: '1px 4px',
                borderRadius: '2px'
              }}>
                <span style={{ color: '#fa8c16', fontSize: '9px', fontWeight: '600' }}>{seller_years || 1}y</span>
                <span style={{ color: '#fa8c16', fontSize: '8px', fontWeight: '500' }}>Verified</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ========== DESKTOP VERSION (Sawa na DashboardCard style) ==========
  return (
    <div 
      className="product-card-item"
      onClick={() => navigate(`/product/${id}`)}
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
        {hot_sale_tag && (
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            backgroundColor: '#ff4d4f',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 'bold',
            padding: '2px 8px',
            borderRadius: '4px',
            zIndex: 2,
          }}>
            🔥 Hot
          </div>
        )}

        {hasDiscount && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: '#ca290d',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 'bold',
            padding: '2px 8px',
            borderRadius: '4px',
            zIndex: 2,
          }}>
            -{Math.round(((numericOriginal - numericPrice) / numericOriginal) * 100)}%
          </div>
        )}

        <img 
  src={finalImage} 
  alt={name} 
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
  onTouchStart={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
  onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
  onError={(e) => { e.target.src = '/images/placeholder.png'; }} 
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
        <h4 
          style={{
            margin: 0,
            fontSize: '13px',
            color: '#333',
            fontWeight: '500',
            lineHeight: '1.3',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {displayName}
        </h4>
        
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#ca290d' }}>TSh</span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#ca290d' }}>
              {displayPrice.toLocaleString()}
            </span>
          </div>
          {oldPrice && (
            <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '11px' }}>
              {oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', fontSize: '10px', color: '#666', marginTop: '2px' }}>
          <span>MOQ: {moq || 1}</span>
          <span>{soldCount?.toLocaleString() || 0} sold</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
          <MapPin size={10} color="#999" />
          <span style={{ fontSize: '9px', color: '#999' }}>{location || 'Tanzania'}</span>
          {is_verified && (
            <>
              <span style={{ color: '#ddd' }}>•</span>
              <span style={{ fontSize: '9px', color: '#fa8c16' }}>✓ {seller_years || 1}y Verified</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}