import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

export default function ProductCard({ product, isMobile = false, isPriority = false }) {
  const navigate = useNavigate();
  
  const { 
    id, 
    price = 0, 
    original_price = null, 
    cover_image, 
    image,
    name = "Bidhaa", 
    soldCount = 20, 
    moq = 2, 
    location = "Tanzania", 
    address = "",
    is_verified = true,
    seller_years = 1,
    lowest_price_tag = false,
    hot_sale_tag = false
  } = product;
  
  // --- MABADILIKO YA PICHA YA OFISI ---
  let finalImage = "/images/placeholder.png";

  try {
    const officeImgs = typeof product.store_info?.office_images === 'string' 
      ? JSON.parse(product.store_info.office_images) 
      : product.store_info?.office_images;

    if (Array.isArray(officeImgs) && officeImgs.length > 0 && officeImgs[0]) {
      finalImage = officeImgs[0];
    } 
    else if (cover_image || image) {
      finalImage = cover_image || image;
    }
  } catch (e) {
    finalImage = cover_image || image || "/images/placeholder.png";
  }
  
  // Dynamic name length
  const maxNameLength = isMobile ? 30 : 60;
  const displayName = name?.length > maxNameLength 
    ? name.substring(0, maxNameLength - 3) + '...' 
    : name;

  const numericPrice = parseFloat(price) || 0;
  const numericOriginal = parseFloat(original_price) || 0;
  const hasDiscount = numericOriginal > 0 && numericOriginal < numericPrice;
  const oldPrice = hasDiscount ? numericPrice : null;

  const displayPrice = hasDiscount ? numericOriginal : numericPrice;
  const discountPercent = hasDiscount 
    ? Math.round(((numericPrice - numericOriginal) / numericPrice) * 100) 
    : 0;

  // ============================================================
  // 🔥 MABADILIKO HAPA: Handler kuu ya kubonyeza (Click)
  // ============================================================
  const handleCardClick = () => {
    const productUrl = `/product/${id}`;
    
    // Kama ni Mobile: Tumia navigate (SPA - tab moja)
    if (isMobile) {
      navigate(productUrl);
    } 
    // Kama ni Desktop: Fungua window/tab mpya
    else {
      window.open(productUrl, '_blank');
    }
  };

  // ========== MOBILE VERSION ==========
  if (isMobile) {
    return (
      <div 
        className="group flex flex-col w-full max-w-full cursor-pointer select-none bg-transparent border-none p-0 m-0 transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] active:scale-[0.99]"
        onClick={handleCardClick}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* IMAGE CONTAINER - SQUARE */}
        <div className="relative w-full aspect-square bg-[#ece7e7] dark:bg-gray-800 overflow-hidden rounded-lg">
          {hot_sale_tag && (
            <div className="absolute top-1.5 left-1.5 bg-[#ff4d4f] text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-20">
              Hot
            </div>
          )}

          {hasDiscount && (
            <div className="absolute top-1.5 right-1.5 bg-[#ca290d] text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-20">
              -{discountPercent}%
            </div>
          )}

          {/* MOQ Badge (Bottom) */}
          {moq && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent text-white text-[10px] pt-3 pr-1.5 pb-1 pl-1.5 font-medium z-20">
              MOQ: {moq} {moq > 1 ? 'pcs' : 'pc'}
            </div>
          )}
          
          <img 
            src={finalImage} 
            alt={name} 
            className="w-full h-full object-cover object-center block transition-transform duration-400 ease-[cubic-bezier(0.2,0.9,0.4,1.1)] group-hover:scale-[1.08] group-active:scale-[1.05]"
            draggable="false"
            onContextMenu={(e) => e.preventDefault()}
            onError={(e) => { e.target.src = '/images/placeholder.png'; }} 
          />
        </div>

        {/* INFO SECTION */}
        <div className="flex flex-col pt-1 px-0.5 pb-0.5 gap-0.5 bg-transparent">
          <h4 className="m-0 text-[11px] min-h-[26px] text-gray-800 dark:text-gray-200 font-medium leading-tight line-clamp-2">
            {displayName}
          </h4>
          
          {/* PRICE ROW */}
          <div className="flex items-baseline flex-wrap gap-1">
            <div className="flex items-baseline">
              <span className="font-bold text-[#ca290d] text-[9px]">TSh</span>
              <span className="font-bold text-[#ca290d] text-[13px]">
                {displayPrice.toLocaleString()}
              </span>
            </div>
            {oldPrice && (
              <span className="line-through text-[#999] text-[9px]">
                {oldPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* MOQ row */}
          {!moq && (
            <div className="flex items-center gap-1">
              <span className="text-[#666] text-[8px]">MOQ:</span>
              <span className="text-[#333] dark:text-gray-200 font-semibold text-[8px]">1</span>
            </div>
          )}

          {/* Stats Row (Sold & Location) */}
          <div className="flex justify-between items-center text-[#999] mt-0.5 text-[8px]">
            <span>{soldCount?.toLocaleString() || 0} sold</span>
            <div className="flex items-center gap-0.5">
              <MapPin size={8} />
              <span>{location || 'Tanzania'}</span>
            </div>
          </div>

          {/* Verified Badge */}
          {is_verified && (
            <div className="flex items-center gap-1 mt-1 pt-1 border-t-[0.5px] border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-0.5 bg-[#fff7e6] dark:bg-amber-900/30 px-1 py-0.5 rounded-sm">
                <span className="text-[#fa8c16] text-[9px] font-semibold">{seller_years || 1}y</span>
                <span className="text-[#fa8c16] text-[8px] font-medium">Verified</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ========== DESKTOP VERSION ==========
  return (
    <div 
      className="group flex flex-col w-full max-w-full cursor-pointer select-none bg-transparent border-none p-0 m-0 transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
      onClick={handleCardClick}
    >
      {/* IMAGE CONTAINER */}
      <div className="relative w-full aspect-square bg-[#ece7e7] dark:bg-gray-800 overflow-hidden rounded-lg">
        {hot_sale_tag && (
          <div className="absolute top-2 left-2 bg-[#ff4d4f] text-white text-[10px] font-bold px-2 py-0.5 rounded z-20">
            🔥 Hot
          </div>
        )}
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-[#ca290d] text-white text-[10px] font-bold px-2 py-0.5 rounded z-20">
            -{discountPercent}%
          </div>
        )}

        <img 
          src={finalImage} 
          alt={name} 
          className="w-full h-full object-cover object-center block transition-transform duration-400 ease-[cubic-bezier(0.2,0.9,0.4,1.1)] group-hover:scale-[1.08]"
          onError={(e) => { e.target.src = '/images/placeholder.png'; }} 
        />
      </div>

      {/* INFO SECTION - Desktop */}
      <div className="flex flex-col pt-2 px-1.5 pb-1.5 gap-0.5 bg-transparent">
        <h4 className="m-0 text-[13px] text-gray-800 dark:text-gray-200 font-medium leading-tight line-clamp-2">
          {displayName}
        </h4>
        
        <div className="flex items-baseline flex-wrap gap-1.5">
          <div className="flex items-baseline">
            <span className="font-bold text-[#ca290d] text-[11px]">TSh</span>
            <span className="font-bold text-[#ca290d] text-[16px]">
              {displayPrice.toLocaleString()}
            </span>
          </div>
          {oldPrice && (
            <span className="line-through text-[#999] text-[11px]">
              {oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex justify-start items-center text-[#666] dark:text-gray-400 mt-0.5 gap-3 text-[10px]">
          <span>MOQ: {moq || 1}</span>
          <span>{soldCount?.toLocaleString() || 0} sold</span>
        </div>

        <div className="flex items-center gap-1 mt-1">
          <MapPin size={10} className="text-gray-400" />
          <span className="text-[10px] text-gray-500 dark:text-gray-400">{location || 'Tanzania'}</span>
          {is_verified && (
            <>
              <span className="text-[#ddd] dark:text-gray-600 mx-0.5">•</span>
              <span className="text-[9px] text-[#fa8c16]">✓ {seller_years || 1}y Verified</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}