// src/components/ProductGridCard.jsx
import React from 'react';

export default function ProductGridCard({ product, getProductImage, onClick }) {
  return (
    <div 
      // 🔥 1. KADI KUU: Nimeongeza 'p-1' ili picha isigonge kingo (kama kwenye picha yako)
      className="bg-white dark:bg-[#111] border border-[#eee] dark:border-[#1f1f1f] rounded-xl p-1 overflow-hidden transition-all duration-300 h-full flex flex-col group cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] hover:border-brand-orange font-sans"
      onClick={onClick}
    >
      {/* 🔥 2. PICHA: Nimeweka 'rounded-lg' (pembe zote 4 duara) na kuondoa rounded-t-xl */}
      <div className="w-full aspect-square overflow-hidden rounded-lg bg-[#f8fafc] dark:bg-[#0a0a0a]">
        <img 
          src={getProductImage(product)} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
        />
      </div>

      {/* Maelezo: Padded kidogo, Bei kubwa na wazi */}
      <div className="px-1 pt-1.5 pb-1 flex-1 flex flex-col">
        <h3 className="text-[12px] md:text-[13px] font-semibold text-[#333] dark:text-white m-0 mb-1.5 leading-[1.3] line-clamp-2">
          {product.name}
        </h3>
        
        {/* Category (kama ipo) */}
        {(product.sub_category_name || product.category_name) && (
          <p className="text-[9px] sm:text-[10px] font-bold text-brand-orange dark:text-[#ff8a3c] m-0 uppercase tracking-[0.3px] line-clamp-1 mb-1">
            {product.sub_category_name || product.category_name}
          </p>
        )}

        <div className="flex items-baseline gap-1 mt-auto">
          <span className="text-[10px] md:text-xs text-[#666] dark:text-[#94a3b8] font-medium">TSH</span>
          <span className="text-[14px] md:text-base font-extrabold text-brand-orange">
            {Number(product.price).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}