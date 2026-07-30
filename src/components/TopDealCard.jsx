// src/components/TopDealCard.jsx
import React from 'react';
import { Star, ShieldCheck, Flame, TrendingUp } from 'lucide-react';

const TopDealCard = ({
  image,
  title,
  price,
  originalPrice,
  moq,
  rating,
  verified,
  years,
  discountPercent,
  onClick
}) => {
  // Hesabu discount
  const discount = discountPercent || (originalPrice && price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);

  return (
    <div className="top-deal-card" onClick={onClick}>
      {/* Picha ya bidhaa */}
      <div className="td-card-image">
        <img src={image || "https://via.placeholder.com/300?text=No+Image"} alt={title} />
        
        {/* Badge ya Discount */}
        {discount > 0 && (
          <div className="td-discount-badge">
            <Flame size={12} />
            <span>-{discount}%</span>
          </div>
        )}
        
        {/* Badge ya "Top Deal" */}
        <div className="td-top-badge">
          <TrendingUp size={12} />
          <span>Top Deal</span>
        </div>
        
        {/* Open button */}
        <button className="td-open-btn">Open</button>
      </div>
      
      {/* Maelezo ya bidhaa */}
      <div className="td-card-body">
        <h4 className="td-card-title">{title}</h4>
        
        {/* Bei */}
        <div className="td-price-section">
          <span className="td-current-price">{price}</span>
          {originalPrice && (
            <span className="td-original-price">{originalPrice}</span>
          )}
        </div>
        
        {/* MOQ */}
        {moq && <p className="td-moq">{moq} (MOQ)</p>}
        
        {/* Footer - Rating, Verified, Years */}
        <div className="td-card-footer">
          {rating && (
            <span className="td-rating">
              <Star size={14} /> {rating} YRS
            </span>
          )}
          {verified && (
            <span className="td-verified">
              <ShieldCheck size={14} /> Verified
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopDealCard;