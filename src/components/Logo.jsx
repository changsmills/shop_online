import React from 'react';
import logoSvg from '../assets/logoz.svg';
import '../Logo.css';

const Logo = () => {
  return (
    <div className="logo-wrapper">
      <div className="logo-icon-box">
        <img src={logoSvg} alt="Skyfall Logo" className="logo-image" />
      </div>
      <div className="logo-text">
        Skyfall.com
      </div>
    </div>
  );
};

export default Logo;