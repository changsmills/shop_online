import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const TopDealsSection = ({ products, onUpdate }) => {
  const myProducts = products || [];

  return (
    <section className="bg-white rounded-[24px] border border-gray-100 p-5 h-full flex flex-col shadow-sm">
      {/* Header ya Section */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
          <h2 className="text-base font-black text-gray-800 m-0 tracking-tight">
            Simamia Punguzo (Offers)
          </h2>
        </div>
        <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
          {myProducts.length} Bidhaa
        </span>
      </div>

      {/* List ya Bidhaa */}
      <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scroll">
        {myProducts.length > 0 ? (
          myProducts.map((product) => (
            <FlashSaleCard 
              key={product.id} 
              product={product} 
              onUpdate={onUpdate} 
            />
          ))
        ) : (
          <div className="text-center py-10 text-gray-400 text-xs italic">
            Hakuna bidhaa za kuonyesha
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </section>
  );
};

const FlashSaleCard = ({ product, onUpdate }) => {
  const [percentage, setPercentage] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  // 1. Pata bei kutoka kwenye table yako
  const beiKuu = Number(product.price) || 0; 
  
  // 2. Hesabu bei mpya itakayokuwa "original_price" (Offer Price)
  const kiasiChaPunguzo = (percentage / 100) * beiKuu;
  const beiMpyaYaOfa = beiKuu - kiasiChaPunguzo;

  // 3. LOGIC YA KUFUNGA (LOCKED):
  // Lazima 'is_flash_sale' iwe true ndipo tufunge. 
  // Kama ni false, hata kama kuna tarehe, isifunge.
  const mwanzoWaOfa = product.offer_started_at ? new Date(product.offer_started_at).getTime() : 0;
  const sasa = new Date().getTime();
  const masaa24 = 24 * 60 * 60 * 1000;

  const isLocked = product.is_flash_sale === true && (sasa - mwanzoWaOfa) < masaa24;

  const masaaYaliyobaki = isLocked 
    ? Math.ceil((masaa24 - (sasa - mwanzoWaOfa)) / (1000 * 60 * 60)) 
    : 0;

  const handleApplyOffer = async () => {
  // 1. Validations za asilimia
  if (percentage <= 0 || percentage > 90) {
    alert("Weka asilimia sahihi (1% mpaka 90%)");
    return;
  }

  // 2. Kagua kama ofa imefungwa (Lock Logic)
  // Tunafunga TU kama is_flash_sale ni true NA muda haujapita masaa 24
  if (product.is_flash_sale && product.offer_started_at) {
    const sasa = new Date().getTime();
    const mwanzo = new Date(product.offer_started_at).getTime();
    const masaa24 = 24 * 60 * 60 * 1000;

    if ((sasa - mwanzo) < masaa24) {
      alert("🔒 Ofa hii bado imefungwa. Huwezi kubadilisha mpaka masaa 24 yaishe.");
      return;
    }
  }

  // 3. Thibitisha kwa mtumiaji
  const beiYaOfa = Math.round(beiMpyaYaOfa).toLocaleString();
  const confirmAction = window.confirm(
    `ZINGATIA: Bei mpya itakuwa ${beiYaOfa} TZS na itajifunga kwa masaa 24. Je, unaendelea?`
  );
  if (!confirmAction) return;

  setIsUpdating(true);
  try {
    const { error } = await supabase
      .from("products_engines")
      .update({
        // Kwenye table yako 'price' ni bei kuu, 'original_price' tunaitumia kwa bei ya ofa
        original_price: beiMpyaYaOfa, 
        offer_started_at: new Date().toISOString(),
        is_flash_sale: true, // Hii inawasha mfumo wa ofa na kufuli
        sale_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      })
      .eq("id", product.id);

    if (error) throw error;

    alert(`✅ Ofa ya ${percentage}% imewekwa kikamilifu!`);
    if (onUpdate) onUpdate(); 
    setPercentage(0); // Safisha input baada ya kukamilisha
    
  } catch (err) {
    alert("Imefeli: " + err.message);
  } finally {
    setIsUpdating(false);
  }
};

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden transition-all hover:bg-white hover:border-gray-200 hover:shadow-sm">
      <div className="flex flex-row items-center gap-3 p-2.5">
        {/* Picha ya Bidhaa */}
        <div style={{ 
          width: '150px', 
          height: '150px', 
          flexShrink: 0, 
          borderRadius: '6px', 
          overflow: 'hidden', 
          position: 'relative',
          backgroundColor: '#070808' 
        }}>
          <img 
            src={product.cover_image} 
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.src = "https://placehold.co/400x400?text=No+Image"; }}
          />
          {percentage > 0 && (
            <div style={{
              position: 'absolute', top: 0, right: 0, backgroundColor: '#ef4444',
              color: 'white', padding: '0 4px', fontSize: '8px', fontWeight: 'bold'
            }}>
              {percentage}%
            </div>
          )}
        </div>

        {/* Maelezo ya Bidhaa */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-semibold text-gray-800 mb-1 truncate">
            {product.name}
          </h3>
          
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[10px] text-gray-400 line-through">
              {beiKuu.toLocaleString()} TZS
            </span>
            {percentage > 0 && (
              <span className="text-xs font-bold text-orange-600">
                {Math.round(beiMpyaYaOfa).toLocaleString()} TZS
              </span>
            )}
          </div>

          {/* Sehemu ya Input */}
          <div className="mt-1">
            <label className="text-[9px] font-bold block mb-1 text-gray-500 uppercase">
              {isLocked ? `🔒 FUNGWA (${masaaYaliyobaki}h)` : "Punguza %"}
            </label>
            <div className="flex gap-2 items-center">
              <input 
                type="number" 
                className="w-12 px-1.5 py-1 border border-gray-200 rounded text-xs text-center disabled:bg-gray-100"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                min="0" max="90"
                disabled={isLocked}
              />
              <button 
                className="px-2 py-1 bg-orange-600 text-white rounded text-[10px] font-bold hover:bg-orange-700 disabled:bg-gray-300"
                onClick={handleApplyOffer}
                disabled={isUpdating || isLocked || percentage <= 0}
              >
                {isUpdating ? "..." : "Weka"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopDealsSection;