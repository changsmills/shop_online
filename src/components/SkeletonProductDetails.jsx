// src/components/SkeletonProductDetails.jsx
import React from 'react';
import Header from "../components/Header"; // ✅ ONGEZA HII!
import '../SkeletonProductDetails.css';

export default function SkeletonProductDetails({ isMobile }) {
  return (
    <div className="product-page-root skeleton-page">
      
      {/* ✅ ONGEZA HEADER HAPA! */}
      <Header />

      <div className="product-details-container skeleton-container">
        
        {/* Breadcrumb Skeleton */}
        <div className="skeleton-breadcrumb">
          <div className="skeleton-breadcrumb-item"></div>
          <div className="skeleton-breadcrumb-sep">/</div>
          <div className="skeleton-breadcrumb-item"></div>
          <div className="skeleton-breadcrumb-sep">/</div>
          <div className="skeleton-breadcrumb-item active"></div>
        </div>

        {/* Main Layout Skeleton */}
        <div className={`main-grid-container skeleton-main-grid ${isMobile ? 'skeleton-mobile' : ''}`}>
          
          {/* Left Side (Gallery & Description) */}
          <div className="left-content skeleton-left">
            <div className="product-hero-section skeleton-hero">
              <div className="skeleton-main-image"></div>
              <div className="skeleton-thumbnails">
                <div className="skeleton-thumb"></div>
                <div className="skeleton-thumb"></div>
                <div className="skeleton-thumb"></div>
                <div className="skeleton-thumb"></div>
              </div>
            </div>
            <div className="skeleton-description">
              <div className="skeleton-text-line long"></div>
              <div className="skeleton-text-line long"></div>
              <div className="skeleton-text-line medium"></div>
              <div className="skeleton-text-line short"></div>
            </div>
          </div>

          {/* Right Side (ProductInfo) */}
          <div className="right-sidebar skeleton-right">
            <div className="sticky-info-wrapper skeleton-sticky">
              <div className="skeleton-title"></div>
              <div className="skeleton-price"></div>
              <div className="skeleton-divider"></div>
              <div className="skeleton-specs">
                <div className="skeleton-spec-line"></div>
                <div className="skeleton-spec-line"></div>
                <div className="skeleton-spec-line"></div>
              </div>
              <div className="skeleton-buttons">
                <div className="skeleton-btn"></div>
                <div className="skeleton-btn"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}