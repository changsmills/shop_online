// src/components/NewArrivalCard.jsx
import React from 'react';
import { Star, ShieldCheck, Sparkles, Clock } from 'lucide-react';

const NewArrivalCard = ({
  image,
  title,
  price,
  originalPrice,
  moq,
  rating,
  verified,
  years,
  isNew = true,
  onClick
}) => {
  return (
    <div className="new-arrival-card" onClick={onClick}>
      {/* Picha ya bidhaa */}
      <div className="na-card-image">
        <img src={image || "https://via.placeholder.com/300?text=No+Image"} alt={title} />
        
        {/* Badge ya "New" */}
        {isNew && (
          <div className="na-new-badge">
            <Sparkles size={12} />
            <span>New</span>
          </div>
        )}
        
        {/* Badge ya "Just In" */}
        <div className="na-just-in-badge">
          <Clock size={12} />
          <span>Just In</span>
        </div>
        
        {/* Open button */}
        <button className="na-open-btn" onClick={(e) => { e.stopPropagation(); onClick(); }}>
          Open
        </button>
      </div>
      
      {/* Maelezo ya bidhaa */}
      <div className="na-card-body">
        <h4 className="na-card-title">{title}</h4>
        
        {/* Bei */}
        <div className="na-price-section">
          <span className="na-current-price">{price}</span>
          {originalPrice && (
            <span className="na-original-price">{originalPrice}</span>
          )}
        </div>
        
        {/* MOQ */}
        {moq && <p className="na-moq">{moq} (MOQ)</p>}
        
        {/* Footer - Rating, Verified, Years */}
        <div className="na-card-footer">
          {rating && (
            <span className="na-rating">
              <Star size={14} /> {rating} YRS
            </span>
          )}
          {verified && (
            <span className="na-verified">
              <ShieldCheck size={14} /> Verified
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewArrivalCard;