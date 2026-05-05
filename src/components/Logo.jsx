import React from 'react';
import '../Logo.css'; // Hakikisha umei-import hapa

export default function Logo() {
  return (
    <div className="logo-wrapper">
      
      {/* 1. Icon ya Picha */}
      <div className="icon-crop">
        <img 
          src="https://s.alicdn.com/@g/tps/tps/TB13L6SXPihSKJjy0FeXXbe2pXa-268-54.png" 
          alt="Logo Icon" 
          className="logo-img" 
        />
      </div>
      
      {/* 2. Maandishi */}
      <div className="logo-text">
        <span>
          Skyfall<span className="dot-com">.com</span>
        </span>
      </div>

    </div>
  );
}