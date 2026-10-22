import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CategoryCard({ item }) {
  const navigate = useNavigate();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const placeholder = "https://placehold.co/400x400?text=Picha+Haipo";

  // --- 1. PICHA NA GALLERY LOGIC ---
  const galleryImages = item.product_media
    ?.map((m) => m.media_url)
    ?.filter((url) => url && typeof url === 'string' && !url.startsWith('blob:')) 
    || [];

  const uniqueImages = new Set();
  if (item.cover_image && typeof item.cover_image === 'string') {
    uniqueImages.add(item.cover_image);
  }
  galleryImages.forEach(img => uniqueImages.add(img));

  const finalImages = Array.from(uniqueImages);
  const imagesToDisplay = finalImages.length > 0 ? finalImages : [placeholder];

  // --- 2. NAVIGATION FUNCTIONS ---
  const nextSlide = (e) => {
    e.stopPropagation();
    if (imagesToDisplay.length <= 1) return;
    setCurrentImgIndex((prev) => (prev + 1) % imagesToDisplay.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    if (imagesToDisplay.length <= 1) return;
    setCurrentImgIndex((prev) => (prev - 1 + imagesToDisplay.length) % imagesToDisplay.length);
  };

  return (
    <div 
      onClick={() => navigate(`/product/${item.id}`)}
      onContextMenu={(e) => e.preventDefault()}
      className="
        group relative flex flex-col w-full aspect-square bg-white rounded-2xl 
        overflow-hidden border border-[#eee] cursor-pointer 
        transition-shadow duration-300 hover:shadow-[0_6px_15px_rgba(0,0,0,0.1)]
        [-webkit-tap-highlight-color:transparent] select-none touch-manipulation
      "
    >
      
      {/* ========== IMAGE CONTAINER ========== */}
      <div className="relative w-full h-[220px] bg-[#f9f9f9] overflow-hidden">
        
        <img 
          src={imagesToDisplay[currentImgIndex]} 
          alt={item.name}
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          onError={(e) => {
            if (e.target.src !== placeholder) {
              e.target.src = placeholder;
            }
          }}
        />

        {/* ========== VISHALE NA DOTS ========== */}
        {finalImages.length > 1 && (
          <div className="
            absolute inset-0 z-10 opacity-0 group-hover:opacity-100 
            transition-opacity duration-300 pointer-events-none
          ">
            {/* Left Arrow */}
            <button 
              onClick={prevSlide} 
              className="
                absolute top-1/2 left-2.5 -translate-y-1/2 
                bg-white/80 hover:bg-white border-none rounded-full 
                w-[30px] h-[30px] flex items-center justify-center 
                cursor-pointer z-20 shadow-[0_2px_5px_rgba(0,0,0,0.1)] 
                pointer-events-auto transition-colors
              "
            >
              <ChevronLeft size={18} className="text-gray-800" />
            </button>

            {/* Right Arrow */}
            <button 
              onClick={nextSlide} 
              className="
                absolute top-1/2 right-2.5 -translate-y-1/2 
                bg-white/80 hover:bg-white border-none rounded-full 
                w-[30px] h-[30px] flex items-center justify-center 
                cursor-pointer z-20 shadow-[0_2px_5px_rgba(0,0,0,0.1)] 
                pointer-events-auto transition-colors
              "
            >
              <ChevronRight size={18} className="text-gray-800" />
            </button>
            
            {/* Dots */}
            <div className="absolute bottom-2.5 w-full flex justify-center gap-1.5 z-20">
              {finalImages.map((_, i) => (
                <div 
                  key={i} 
                  className={`
                    w-1.5 h-1.5 rounded-full transition-all duration-300
                    ${i === currentImgIndex ? 'bg-[#ff6600] scale-125' : 'bg-white/50'}
                  `} 
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========== PRODUCT INFO ========== */}
      <div className="p-[15px] flex flex-col flex-1 justify-between">
        <h3 className="text-[15px] font-semibold text-[#333] mb-2 truncate">
          {item.name}
        </h3>
        <p className="text-[#ff6600] font-extrabold text-[18px] m-0">
          TSh {item.price?.toLocaleString()}
        </p>
      </div>

    </div>
  );
}