// src/components/SkeletonCard.jsx
import React from 'react';
import '../App_skeleton.css';

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-text long"></div>
      <div className="skeleton-text short"></div>
      <div className="skeleton-text medium"></div>
    </div>
  );
};

export default SkeletonCard;