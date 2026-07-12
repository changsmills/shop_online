// src/components/SkeletonProductsAll.jsx
import React from 'react';
import '../SkeletonProductsAll.css';

const SkeletonProductsAll = ({ isMobile }) => {
  return (
    <div className="skeleton-products-all-page">
      
      {/* 1. Skeleton Banner */}
      <div className="skeleton-banner">
        <div className="skeleton-banner-title"></div>
        <div className="skeleton-banner-desc"></div>
      </div>

      {/* 2. Skeleton Category Tabs */}
      <div className="skeleton-tabs-wrapper">
        <div className="skeleton-tabs-scroll">
          <div className="skeleton-tab-item"></div>
          <div className="skeleton-tab-item"></div>
          <div className="skeleton-tab-item"></div>
          <div className="skeleton-tab-item"></div>
        </div>
      </div>

      {/* 3. Skeleton Product Grid */}
      <div className="skeleton-grid-wrapper">
        <div className={`skeleton-grid ${isMobile ? 'skeleton-mobile-grid' : ''}`}>
          {Array.from({ length: isMobile ? 6 : 10 }).map((_, i) => (
            <div key={i} className="skeleton-product-card">
              <div className="skeleton-product-image"></div>
              <div className="skeleton-product-info">
                <div className="skeleton-text-line long"></div>
                <div className="skeleton-text-line medium"></div>
                <div className="skeleton-text-line short"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default SkeletonProductsAll;