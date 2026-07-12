// src/components/SkeletonLayout.jsx
import React from 'react';
import SkeletonCard from './SkeletonCard';
import '../App_skeleton.css';

const SkeletonLayout = () => {
  return (
    <div className="skeleton-layout-wrapper">
      
      {/* Mobile & Tablet Layout - Inaonekana <1024px */}
      <div className="skeleton-mobile">
        
        {/* ✅ ONGEZA HII: Skeleton ya Category Slider kwa Mobile */}
        <div className="skeleton-category-slider">
          <div className="skeleton-cat-item active"></div>
          <div className="skeleton-cat-item"></div>
          <div className="skeleton-cat-item"></div>
          <div className="skeleton-cat-item"></div>
          <div className="skeleton-cat-item"></div>
        </div>

        <div className="skeleton-banner-mobile"></div>
        <div className="skeleton-grid-mobile">
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>

      {/* Desktop Layout - Inaonekana >1024px */}
      <div className="skeleton-desktop">
        <div className="skeleton-top-row">
          <div className="skeleton-sidebar">
            <div className="skeleton-sidebar-item"></div>
            <div className="skeleton-sidebar-item"></div>
            <div className="skeleton-sidebar-item"></div>
            <div className="skeleton-sidebar-item"></div>
            <div className="skeleton-sidebar-item"></div>
          </div>
          <div className="skeleton-banner-desktop"></div>
        </div>
        <div className="skeleton-grid-desktop">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>

    </div>
  );
};

export default SkeletonLayout;