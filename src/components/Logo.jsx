import React from 'react';
import '../Logo.css'; 
// 1. Import file lako la SVG kutoka kwenye folder la assets
import logoSvg from '../assets/logoz.svg'; 

export default function Logo() {
  return (
    <div className="logo-wrapper">
      
      {/* 2. Badilisha <img> ya zamani na hii mpya */}
      <div className="icon-crop">
        <img 
          src={logoSvg} 
          alt="Skyfall Logo" 
          className="logo-img" 
        />
      </div>
      
      {/* 3. Kama unataka maandishi yasomeke vizuri, unaweza kuyaacha 
          au kuyaficha kama logo ya SVG ina maandishi tayari */}
      <div className="logo-text">
        <span>
          Skyfall<span className="dot-com">.com</span>
        </span>
      </div>
    </div>
  );
}