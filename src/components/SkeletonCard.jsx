import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-[#0a0a0a] rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.8)] w-full m-0">
      {/* Image Skeleton */}
      <div className="w-full h-[160px] bg-[#e0e0e0] dark:bg-[#1a1a1a] rounded-lg animate-pulse"></div>
      
      {/* Text Skeletons */}
      <div className="w-full h-4 bg-[#e0e0e0] dark:bg-[#1a1a1a] rounded mt-3 animate-pulse"></div>
      <div className="w-3/5 h-4 bg-[#e0e0e0] dark:bg-[#1a1a1a] rounded mt-3 animate-pulse"></div>
      <div className="w-4/5 h-4 bg-[#e0e0e0] dark:bg-[#1a1a1a] rounded mt-3 animate-pulse"></div>
    </div>
  );
};

export default SkeletonCard;