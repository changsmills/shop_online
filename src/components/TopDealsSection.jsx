import React, { useState } from "react";
import api from "../axiosConfig"; // 🔥 Tumia api
import "../TopDealsection.css";

const TopDealsSection = ({ products, onUpdate }) => {
  const myProducts = products || [];

  return (
    <section className="top-deals-section">
      <div className="top-deals-header">
        <div className="top-deals-title-group">
          <div className="top-deals-pulse" />
                   <h2 className="top-deals-title">Manage Offers</h2>
        </div>
        <span className="top-deals-badge">
          {myProducts.length} Products
        </span>
      </div>

      <div className="top-deals-grid">
        {myProducts.length > 0 ? (
          myProducts.map((product) => (
            <FlashSaleCard 
              key={product.id} 
              product={product} 
              onUpdate={onUpdate} 
            />
          ))
        ) : (
           <div className="flash-card-empty">
            No products to display
          </div>
        )}
      </div>
    </section>
  );
};

const FlashSaleCard = ({ product, onUpdate }) => {
  const [percentage, setPercentage] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const beiKuu = Number(product.price) || 0; 
  const kiasiChaPunguzo = (percentage / 100) * beiKuu;
  const beiMpyaYaOfa = beiKuu - kiasiChaPunguzo;

  const mwanzoWaOfa = product.offer_started_at ? new Date(product.offer_started_at).getTime() : 0;
  const sasa = new Date().getTime();
  const masaa24 = 24 * 60 * 60 * 1000;
  const isLocked = product.is_flash_sale === true && (sasa - mwanzoWaOfa) < masaa24;
  const masaaYaliyobaki = isLocked 
    ? Math.ceil((masaa24 - (sasa - mwanzoWaOfa)) / (1000 * 60 * 60)) 
    : 0;

  const handleApplyOffer = async () => {
        if (percentage <= 0 || percentage > 90) {
      alert("Weka asilimia sahihi (1% mpaka 90%)");
      return;
    }

        if (product.is_flash_sale && product.offer_started_at) {
      const sasa = new Date().getTime();
      const mwanzo = new Date(product.offer_started_at).getTime();
      if ((sasa - mwanzo) < masaa24) {
        alert("🔒 This offer is still locked. You cannot change it until 24 hours have passed.");
        return;
      }
    }

    const beiYaOfa = Math.round(beiMpyaYaOfa).toLocaleString();
    const confirmAction = window.confirm(
      `NOTE: The new price will be ${beiYaOfa} TZS and will self-lock for 24 hours. Do you want to continue?`
    );
    if (!confirmAction) return;

    setIsUpdating(true);
    try {
      const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Please login again.");

      await api.patch(
        `/products/${product.id}/`,
        {
          original_price: Math.round(beiMpyaYaOfa),
          offer_started_at: new Date().toISOString(),
          is_flash_sale: true,
          sale_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`✅ Offer of ${percentage}% applied successfully!`);
      if (onUpdate) onUpdate(); 
      setPercentage(0);
       
    } catch (err) {
      alert("Failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flash-card">
      <div className="flash-card-img-wrap">
        <img 
          src={
            // ✅ Hapa ndio suluhisho: Angalia cover_image_url kwanza!
            product.cover_image_url 
              ? product.cover_image_url 
              : (product.cover_image 
                  ? (product.cover_image.startsWith('http') 
                      ? product.cover_image 
                      : `https://shop-online-r9z4.onrender.com${product.cover_image}`) 
                  : "https://placehold.co/400x400?text=No+Image")
          } 
          alt={product.name}
          className="flash-card-img"
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = "https://placehold.co/400x400?text=No+Image"; 
          }}
        />
        {percentage > 0 && (
          <div className="flash-card-badge">
            {percentage}%
          </div>
        )}
      </div>

      <div className="flash-card-body">
        <h3 className="flash-card-title">
          {product.name}
        </h3>
        
        <div className="flash-card-price-row">
          <span className="flash-card-original">
            {beiKuu.toLocaleString()} TZS
          </span>
          {percentage > 0 && (
            <span className="flash-card-offer">
              {Math.round(beiMpyaYaOfa).toLocaleString()} TZS
            </span>
          )}
        </div>

        <div className="flash-card-input-area">

               <label className={`flash-card-label ${isLocked ? 'locked' : ''}`}>
            {isLocked ? `🔒 LOCKED (${masaaYaliyobaki}h)` : "Discount %"}
          </label>

          <div className="flash-card-input-row">
            <input 
              type="number" 
              className="flash-card-input"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              min="0" max="90"
              disabled={isLocked}
            />
            <button 
              className="flash-card-btn"
              onClick={handleApplyOffer}
              disabled={isUpdating || isLocked || percentage <= 0}
            >
            {isUpdating ? "..." : "Apply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopDealsSection;