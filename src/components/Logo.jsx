import React from 'react';
import logoSvg from '../assets/logoz.svg'; 

const Logo = () => {
  // Hapa ndio msingi wa kutatua tatizo: Inakagua ukubwa wa screen mara moja!
  // Haihitaji useEffect, haisubiri chochote. 
  // Ukitumia SSR (Next.js), tumia: const isMobile = typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  const styles = {
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '4px' : '10px',
      flexShrink: 0,
      cursor: 'pointer',
    },
    iconBox: {
      width: isMobile ? '28px' : '40px', // Imepunguzwa hadi 28px kwa mobile
      height: isMobile ? '28px' : '40px',
      borderRadius: '50%',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0B132B',
      border: '2px solid #ff4e00',
      boxShadow: '0 3px 6px rgba(255, 78, 0, 0.25)',
    },
    img: {
      width: '120%',
      height: '120%',
      objectFit: 'cover',
    },
    text: {
      color: '#ff4e00',
      fontSize: isMobile ? '12px' : '20px', // Sasa maandishi yanapungua papo hapo
      fontWeight: '800',
      lineHeight: 1,
      letterSpacing: '-0.3px',
      fontFamily: "'Inter', -apple-system, sans-serif",
      display: 'flex',
      alignItems: 'baseline',
    },
    dotCom: {
      color: '#e45a0a',
      fontSize: isMobile ? '8px' : '14px',
      fontWeight: '600',
      marginLeft: '1px',
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.iconBox}>
        <img src={logoSvg} alt="Skyfall Logo" style={styles.img} />
      </div>
      <div style={styles.text}>
        Skyfall<span style={styles.dotCom}>.com</span>
      </div>
    </div>
  );
};

export default Logo;