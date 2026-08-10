// src/components/RelatedProducts.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../RelatedProducts.css'; // 🔥 Tutaiunda baadae!

export default function RelatedProducts({ relatedProducts, leafCategoryId, loadingRelated, navigate }) {
  if (relatedProducts.length === 0) return null;

  return (
    <section className="related-products-section">
      <div className="related-header">
        <h3 className="related-title">Bidhaa Zinazofanana</h3>
        <Link to={`/category/${leafCategoryId}`} className="related-view-all">
          Tazama zote →
        </Link>
      </div>

      <div className="related-products-grid">
        {relatedProducts.map((p) => (
          <div 
            key={p.id} 
            className="related-product-card"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              navigate(`/product/${p.id}`);
            }}
          >
            <div className="related-img-wrap">
              <img 
                src={p.cover_image_url || 'https://via.placeholder.com/200x200?text=No+Image'} 
                alt={p.name} 
                onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200?text=No+Image'; }}
              />
            </div>
            <p className="related-product-name">{p.name}</p>
            <div className="related-product-price">TSH {Number(p.price).toLocaleString()}</div>
          </div>
        ))}
      </div>

      {loadingRelated && (
        <div className="related-loading-skeleton">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      )}
    </section>
  );
}