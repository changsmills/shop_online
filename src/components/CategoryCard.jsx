import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CategoryCard({ item }) {
  const navigate = useNavigate();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

// Badilisha mstari huu
const placeholder = "https://placehold.co/400x400?text=Picha+Haipo";
// --- WEKA KODI HAPA (MAHALI PAKE NI HAPA) ---

// --- 1. PICHA NA GALLERY LOGIC ---

// 1. Chuchua picha zote za gallery na hakikisha tunapata .media_url pekee
const galleryImages = item.product_media
    ?.map((m) => m.media_url)
    ?.filter((url) => url && typeof url === 'string' && !url.startsWith('blob:')) 
    || [];

// 2. Tumia "Set" ili kuondoa marudio (Duplicates) kiotomatiki
// Hii itahakikisha hata kama cover_image ipo ndani ya gallery, itachukuliwa mara moja tu.
const uniqueImages = new Set();

// Ongeza cover_image kwanza (kama ipo na ni halali)
if (item.cover_image && typeof item.cover_image === 'string') {
    uniqueImages.add(item.cover_image);
}

// Ongeza picha za gallery
galleryImages.forEach(img => uniqueImages.add(img));

// Badilisha Set kuwa Array tena
const finalImages = Array.from(uniqueImages);

// 3. Ikiwa hakuna picha yoyote, tumia placeholder
const imagesToDisplay = finalImages.length > 0 ? finalImages : [placeholder];

// --- 2. NAVIGATION FUNCTIONS ---

// Tumia 'imagesToDisplay' badala ya 'finalImages' hapa ili logic iende sawa na dots
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
      style={{
        background: '#fff',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #eee',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
            aspectRatio: '1 / 1',

        transition: 'box-shadow 0.3s ease', 
        position: 'relative'

      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
     <div 
        style={{ 
          position: 'relative', 
          height: '220px', 
          overflow: 'hidden', 
   width: '100%',         // Inachukua upana wote wa kadi
    aspectRatio: '1 / 1',
          background: '#f9f9f9' 
        }}
        onMouseEnter={(e) => {
          // 1. Zoom picha
          const img = e.currentTarget.querySelector('img');
          if (img) img.style.transform = 'scale(1.1)';
          // 2. Onyesha vishale - Hakikisha unalenga class sahihi
          const controls = e.currentTarget.querySelector('.slider-controls');
          if (controls) controls.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          const img = e.currentTarget.querySelector('img');
          if (img) img.style.transform = 'scale(1.0)';
          const controls = e.currentTarget.querySelector('.slider-controls');
          if (controls) controls.style.opacity = '0';
        }}
      >
        <img 
          src={imagesToDisplay[currentImgIndex]} 
          alt={item.name}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            transition: 'transform 0.5s ease-in-out'
                          


          }}
          onError={(e) => {
            if (e.target.src !== placeholder) {
              e.target.src = placeholder;
            }
          }}
        />

        {/* Vishale na Dots - Tumeongeza position absolute ya nje */}
        {finalImages.length > 1 && (
          <div 
            className="slider-controls" 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0, // Inaanza ikiwa haionekani
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none', // Muhimu ili isizuie click ya picha
              zIndex: 2
            }}
          >
            {/* Vishale - pointerEvents: 'auto' inaruhusu vishale vibonyezeke */}
            <button 
               onClick={prevSlide} 
               style={{ ...arrowStyle(true), pointerEvents: 'auto' }}
            >
              <ChevronLeft size={18} />
            </button>

            <button 
               onClick={nextSlide} 
               style={{ ...arrowStyle(false), pointerEvents: 'auto' }}
            >
              <ChevronRight size={18} />
            </button>
            
            <div style={dotsContainerStyle}>
              {finalImages.map((_, i) => (
                <div key={i} style={dotStyle(i === currentImgIndex)} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PRODUCT INFO */}
      <div style={{ padding: '15px' }}>
        <h3 style={{ 
          fontSize: '15px', 
          fontWeight: '600', 
          color: '#333', 
          marginBottom: '8px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis' 
        }}>
          {item.name}
        </h3>
        <p style={{ color: '#ff6600', fontWeight: '800', fontSize: '18px' }}>
          TSh {item.price?.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

// CSS-in-JS Styles
const arrowStyle = (isLeft) => ({
  position: 'absolute',
  top: '50%',
  [isLeft ? 'left' : 'right']: '10px',
  transform: 'translateY(-50%)',
  background: 'rgba(255,255,255,0.8)',
  border: 'none',
  borderRadius: '50%',
  width: '30px',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  zIndex: 2,
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
});

const dotsContainerStyle = {
  position: 'absolute',
  bottom: '10px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  gap: '5px',
  zIndex: 2
};

const dotStyle = (isActive) => ({
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  background: isActive ? '#ff6600' : 'rgba(255,255,255,0.5)',
  transition: '0.3s'
});