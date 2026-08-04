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
  const hasDiscount = numericOriginal > 0 && numericOriginal < numericPrice;
  const oldPrice = hasDiscount ? numericPrice : null;

  const displayPrice = hasDiscount ? numericOriginal : numericPrice;
  const discountPercent = hasDiscount 
    ? Math.round(((numericPrice - numericOriginal) / numericPrice) * 100) 
    : 0;

  // ============================================================
  // 🔥 MABADILIKO HAPA: Handler kuu ya kubonyeza (Click)
  // ============================================================
  const handleCardClick = () => {
    const productUrl = `/product/${id}`;
    
    // Kama ni Mobile: Tumia navigate (SPA - tab moja)
    if (isMobile) {
      navigate(productUrl);
    } 
    // Kama ni Desktop: Fungua window/tab mpya
    else {
      window.open(productUrl, '_blank');
    }
  };

  // ========== MOBILE VERSION ==========
  if (isMobile) {
    return (
      <div 
        className="product-card-item mobile-card"
        onClick={handleCardClick} // 🔥 Tumia handler hii
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* IMAGE CONTAINER - SQUARE */}
        <div className="product-card-media">
          {hot_sale_tag && (
            <div className="tag-hot">
              Hot
            </div>
          )}

          {hasDiscount && (
            <div className="tag-discount">
              -{discountPercent}%
            </div>
          )}

          {/* MOQ Badge (Bottom) */}
          {moq && (
            <div className="tag-moq">
              MOQ: {moq} {moq > 1 ? 'pcs' : 'pc'}
            </div>
          )}
          
          <img 
            src={finalImage} 
            alt={name} 
            className="product-card-img"
            draggable="false"
            onContextMenu={(e) => e.preventDefault()}
            onError={(e) => { e.target.src = '/images/placeholder.png'; }} 
          />
        </div>

        {/* INFO SECTION */}
        <div className="product-card-info mobile-info">
          <h4 className="product-card-title mobile-title">{displayName}</h4>
          
          {/* PRICE ROW */}
          <div className="product-card-price-row mobile-price-row">
            <div className="price-main">
              <span className="price-currency mobile-currency">TSh</span>
              <span className="price-amount mobile-amount">
                {displayPrice.toLocaleString()}
              </span>
            </div>
            {oldPrice && (
              <span className="price-original-strikethrough mobile-old">
                {oldPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* MOQ row */}
          {!moq && (
            <div className="product-card-moq">
              <span className="moq-label">MOQ:</span>
              <span className="moq-value">1</span>
            </div>
          )}

          {/* Stats Row (Sold & Location) */}
          <div className="product-card-stats mobile-stats">
            <span>{soldCount?.toLocaleString() || 0} sold</span>
            <div className="stat-location">
              <MapPin size={8} />
              <span>{location || 'Tanzania'}</span>
            </div>
          </div>

          {/* Verified Badge */}
          {is_verified && (
            <div className="product-card-verified mobile-verified">
              <div className="verified-pill">
                <span className="years">{seller_years || 1}y</span>
                <span>Verified</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ========== DESKTOP VERSION ==========
  return (
    <div 
      className="product-card-item desktop-card"
      onClick={handleCardClick} // 🔥 Tumia handler hii
    >
      {/* IMAGE CONTAINER */}
      <div className="product-card-media">
        {hot_sale_tag && (
          <div className="tag-hot desktop-tag">
            🔥 Hot
          </div>
        )}
        {hasDiscount && (
          <div className="tag-discount desktop-tag">
            -{discountPercent}%
          </div>
        )}

        <img 
          src={finalImage} 
          alt={name} 
          className="product-card-img"
          onError={(e) => { e.target.src = '/images/placeholder.png'; }} 
        />
      </div>

      {/* INFO SECTION - Desktop */}
      <div className="product-card-info desktop-info">
        <h4 className="product-card-title desktop-title">{displayName}</h4>
        
        <div className="product-card-price-row desktop-price-row">
          <div className="price-main">
            <span className="price-currency desktop-currency">TSh</span>
            <span className="price-amount desktop-amount">
              {displayPrice.toLocaleString()}
            </span>
          </div>
          {oldPrice && (
            <span className="price-original-strikethrough desktop-old">
              {oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="product-card-stats desktop-stats">
          <span>MOQ: {moq || 1}</span>
          <span>{soldCount?.toLocaleString() || 0} sold</span>
        </div>

        <div className="product-card-location desktop-location">
          <MapPin size={10} />
          <span>{location || 'Tanzania'}</span>
          {is_verified && (
            <>
              <span className="divider">•</span>
              <span className="verified-text">✓ {seller_years || 1}y Verified</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}