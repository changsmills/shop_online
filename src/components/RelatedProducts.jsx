// src/components/RelatedProducts.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function RelatedProducts({ relatedProducts, leafCategoryId, loadingRelated, navigate }) {
  if (relatedProducts.length === 0) return null;

  return (
    <section className="mt-10 pt-5 border-t border-gray-200 pb-10 mb-5 sm:pb-0 sm:mb-0">
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 m-0">
          Bidhaa Zinazofanana
        </h3>
        <Link
          to={`/category/${leafCategoryId}`}
          className="text-orange-500 font-semibold text-xs sm:text-sm no-underline hover:underline"
        >
          Tazama zote →
        </Link>
      </div>

      {/* ===== PRODUCTS GRID ===== */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-5 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
        {relatedProducts.map((p) => (
          <div
            key={p.id}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              navigate(`/product/${p.id}`);
            }}
            className="border border-gray-200 rounded-xl p-3 text-center transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:border-orange-500"
          >
            {/* Image */}
            <div className="w-full h-[100px] sm:h-[120px] md:h-[150px] overflow-hidden rounded-lg mb-2.5 bg-gray-50">
              <img
                src={p.cover_image_url || 'https://via.placeholder.com/200x200?text=No+Image'}
                alt={p.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200?text=No+Image'; }}
              />
            </div>

            {/* Name */}
            <p className="text-xs sm:text-[13px] md:text-sm font-semibold text-gray-800 m-0 mb-1.5 whitespace-nowrap overflow-hidden text-ellipsis">
              {p.name}
            </p>

            {/* Price */}
            <div className="text-[11px] sm:text-xs md:text-[13px] font-bold text-orange-500">
              TSH {Number(p.price).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* ===== LOADING SKELETON ===== */}
      {loadingRelated && (
        <div className="flex gap-2 sm:gap-3 md:gap-5 flex-wrap mt-2.5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-[calc(50%-4px)] sm:w-[180px] h-[220px] bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}
    </section>
  );
}