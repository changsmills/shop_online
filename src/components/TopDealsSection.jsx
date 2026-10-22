import React, { useState } from "react";
import api from "../axiosConfig";

const TopDealsSection = ({ products, onUpdate }) => {
  const myProducts = products || [];

  return (
    <section className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 p-5 h-full flex flex-col shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.4)]">

      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 dark:bg-red-600 rounded-full animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] dark:animate-[pulseDark_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
          <h2 className="text-base font-black text-gray-800 dark:text-slate-200 m-0 tracking-tight">
            Manage Offers
          </h2>
        </div>
        <span className="text-[10px] font-bold bg-orange-50 dark:bg-[#2d3748] text-orange-600 dark:text-[#f97316] px-2 py-1 rounded-full">
          {myProducts.length} Products
        </span>
      </div>

      {/* ===== GRID ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2.5 sm:gap-4 max-h-[600px] overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:#e2e8f0_#f8fafc] dark:[scrollbar-color:#4b5563_#1e293b] [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-slate-50 dark:[&::-webkit-scrollbar-track]:bg-slate-800 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb:hover]:bg-[#f97316]">

        {myProducts.length > 0 ? (
          myProducts.map((product) => (
            <FlashSaleCard
              key={product.id}
              product={product}
              onUpdate={onUpdate}
            />
          ))
        ) : (
          <div className="text-center py-10 text-gray-400 dark:text-slate-400 text-xs italic col-span-full">
            No products to display
          </div>
        )}
      </div>
    </section>
  );
};

const FlashSaleCard = ({ product, onUpdate }) => {
  const [percentage, setPercentage] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const beiKuu = Number(product.price) || 0;
  const kiasiChaPunguzo = (percentage / 100) * beiKuu;
  const beiMpyaYaOfa = beiKuu - kiasiChaPunguzo;

  const mwanzoWaOfa = product.offer_started_at ? new Date(product.offer_started_at).getTime() : 0;
  const sasa = new Date().getTime();
  const masaa24 = 24 * 60 * 60 * 1000;
  const isLocked = product.is_flash_sale === true && (sasa - mwanzoWaOfa) < masaa24;
  const masaaYaliyobaki = isLocked
    ? Math.ceil((masaa24 - (sasa - mwanzoWaOfa)) / (1000 * 60 * 60))
    : 0;

  const handleApplyOffer = async () => {
    if (percentage <= 0 || percentage > 90) {
      alert("Weka asilimia sahihi (1% mpaka 90%)");
      return;
    }

    if (product.is_flash_sale && product.offer_started_at) {
      const sasa = new Date().getTime();
      const mwanzo = new Date(product.offer_started_at).getTime();
      if ((sasa - mwanzo) < masaa24) {
        alert("🔒 This offer is still locked. You cannot change it until 24 hours have passed.");
        return;
      }
    }

    const beiYaOfa = Math.round(beiMpyaYaOfa).toLocaleString();
    const confirmAction = window.confirm(
      `NOTE: The new price will be ${beiYaOfa} TZS and will self-lock for 24 hours. Do you want to continue?`
    );
    if (!confirmAction) return;

    setIsUpdating(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Please login again.");

      await api.patch(
        `/products/${product.id}/`,
        {
          original_price: Math.round(beiMpyaYaOfa),
          offer_started_at: new Date().toISOString(),
          is_flash_sale: true,
          sale_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`✅ Offer of ${percentage}% applied successfully!`);
      if (onUpdate) onUpdate();
      setPercentage(0);

    } catch (err) {
      alert("Failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden transition-all duration-200 flex flex-col hover:border-gray-200 dark:hover:border-[#f97316] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.6)] hover:-translate-y-[3px]">

      {/* Image */}
      <div className="w-full aspect-square bg-slate-50 dark:bg-slate-800 relative overflow-hidden">
        <img
          src={
            product.cover_image_url
              ? product.cover_image_url
              : (product.cover_image
                  ? (product.cover_image.startsWith('http')
                      ? product.cover_image
                      : `https://shop-online-r9z4.onrender.com${product.cover_image}`)
                  : "https://placehold.co/400x400?text=No+Image")
          }
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/400x400?text=No+Image";
          }}
        />
        {percentage > 0 && (
          <div className="absolute top-0 right-0 bg-red-500 dark:bg-red-600 text-white px-1.5 py-0.5 text-[10px] font-bold">
            {percentage}%
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col gap-1.5">
        <h3 className="text-[13px] font-semibold text-gray-800 dark:text-slate-200 whitespace-nowrap overflow-hidden text-ellipsis m-0">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-gray-400 dark:text-slate-400 line-through">
            {beiKuu.toLocaleString()} TZS
          </span>
          {percentage > 0 && (
            <span className="text-sm font-bold text-orange-600 dark:text-[#f97316]">
              {Math.round(beiMpyaYaOfa).toLocaleString()} TZS
            </span>
          )}
        </div>

        <div className="mt-1">
          <label
            className={`text-[9px] font-bold block mb-1 uppercase ${
              isLocked ? 'text-red-500 dark:text-[#f87171]' : 'text-gray-500 dark:text-slate-400'
            }`}
          >
            {isLocked ? `🔒 LOCKED (${masaaYaliyobaki}h)` : "Discount %"}
          </label>

          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              min="0" max="90"
              disabled={isLocked}
              className="w-[60px] p-1 border border-gray-300 dark:border-slate-600 rounded text-center text-xs bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 disabled:bg-gray-100 dark:disabled:bg-slate-700 disabled:text-gray-400 dark:disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleApplyOffer}
              disabled={isUpdating || isLocked || percentage <= 0}
              className="px-3 py-1 bg-orange-600 hover:bg-orange-700 dark:bg-[#ea580c] dark:hover:bg-[#c2410c] text-white rounded text-xs font-bold border-none cursor-pointer transition-colors duration-200 disabled:bg-gray-300 dark:disabled:bg-slate-600 disabled:text-gray-500 dark:disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              {isUpdating ? "..." : "Apply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopDealsSection;