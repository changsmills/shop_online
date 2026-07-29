// components/SkeletonCard.jsx
import React from "react";
import "../SkeletonCard.css";

export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image shimmer"></div>
      <div className="skeleton-content">
        <div className="skeleton-title shimmer"></div>
        <div className="skeleton-price shimmer"></div>
        <div className="skeleton-moq shimmer"></div>
      </div>
    </div>
  );
}