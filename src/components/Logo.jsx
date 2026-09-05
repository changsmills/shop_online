import React from 'react';
import logoSvg from '../assets/logo1.png';
import '../Logo.css';

const Logo = () => {
  return (
    <div className="logo-wrapper">
      <div className="logo-icon-box">
        <img src={logoSvg} alt="Skyfall Logo" className="logo-image" />
      </div>
      <div className="logo-text">
        Skyfall
      </div>
    </div>
  );
};

export default Logo;