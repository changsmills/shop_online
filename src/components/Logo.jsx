import React from 'react';
// ❌ ONDOA KABISA: import logoSvg from '../assets/logo1.png';
// ❌ ONDOA KABISA: import '../Logo.css';

const Logo = () => {
  return (
    <div className="flex items-center flex-shrink-0 cursor-pointer no-underline gap-[5px] md:gap-2 lg:gap-2 xl:gap-[10px] print:gap-2">
      
      {/* ========== LOGO ICON BOX ========== */}
      <div className="
        w-9 h-9 border-[1.5px] 
        md:w-10 md:h-10 
        lg:w-12 lg:h-12 lg:border-2 
        xl:w-[45px] xl:h-[45px] 
        rounded-full overflow-hidden flex items-center justify-center 
        bg-white 
        border-gray-200 dark:border-[#ff6a00] 
        shadow-sm dark:shadow-none 
        flex-shrink-0 transition-colors duration-300
        print:border-[#333] print:shadow-none
      ">
        {/* ✅ HAPA NDIO TUNAITA PIGA MOJA KWA MOJA KUTOKA PUBLIC */}
        <img 
          src="/favicon.svg" 
          alt="Skyfall Logo" 
          className="w-full h-full object-contain p-1" 
        />
      </div>

      {/* ========== LOGO TEXT ========== */}
      <div className="
        text-[18px] tracking-[0.5px] 
        md:text-[35px] md:tracking-[0.2px] 
        lg:text-[22px] lg:tracking-[1.2px] 
        xl:text-[26px] xl:tracking-[1.5px] 
        text-[#ff4e00] dark:text-[#ff6a00] 
        font-extrabold leading-[1.2] 
        font-['Poppins','Inter',sans-serif] 
        whitespace-nowrap 
        [text-shadow:0_1px_2px_rgba(255,78,0,0.1)]
        print:text-black print:text-[20px] print:tracking-[1px] print:font-extrabold
      ">
        Skyfall
      </div>

    </div>
  );
};

export default Logo;