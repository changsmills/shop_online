// src/components/RelatedProducts.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function RelatedProducts({ relatedProducts, leafCategoryId, loadingRelated, navigate }) {
  if (relatedProducts.length === 0) return null;

  const formatTitle = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    /* 🔥 MABADILIKO: Tumeongeza px-4 (padding left & right) hapa kwenye section kuu */
    <section className="mt-10 pt-5 border-t border-gray-200 dark:border-gray-700 pb-10 mb-5 sm:pb-0 sm:mb-0 px-4 md:px-6">
      
      {/* ===== HEADER ===== */}
      {/* Tumeondoa px-1 hapa kwa sababu section yenyewe ina padding sasa */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 dark:text-white m-0">
          Related Products
        </h3>
        <Link
          to={`/category/${leafCategoryId}`}
          className="text-orange-500 font-semibold text-xs sm:text-sm no-underline hover:underline"
        >
          View all →
        </Link>
      </div>

      {/* ===== PRODUCTS GRID ===== */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {relatedProducts.map((p) => (
          <div
            key={p.id}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              navigate(`/product/${p.id}`);
            }}
            className="group flex flex-col w-full rounded-xl border border-gray-200 bg-white dark:bg-[#1e293b] dark:border-[#334155] p-2 shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md"
          >
            
            {/* Image Container */}
            <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800 mb-2">
              <img
                src={p.cover_image_url || 'https://via.placeholder.com/200x200?text=No+Image'}
                alt={p.name}
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200?text=No+Image'; }}
              />
            </div>

            {/* Info Section */}
            <div className="flex flex-col flex-1 justify-between">
              <div>
                {/* Name */}
                <p className="text-xs sm:text-[13px] md:text-sm font-semibold text-gray-900 dark:text-white m-0 mb-1.5 line-clamp-2 leading-tight">
                  {formatTitle(p.name)}
                </p>
              </div>

              {/* Price */}
              <div className="text-[13px] sm:text-sm md:text-[15px] font-black text-orange-500 mt-auto">
                TSH {Number(p.price).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== LOADING SKELETON ===== */}
      {loadingRelated && (
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-2.5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}
    </section>
  );
}