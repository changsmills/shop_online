import React, { useState, useEffect } from 'react';
import { CheckCircle, Loader2, Settings } from 'lucide-react';
// import api from '../axiosConfig'; // Haifai tena kwa sasa kwa kuwa hakuna kupakia picha

const StoreHeader = ({ 
  myStore, 
  bannerPreview, 
  setBannerFile, 
  setBannerPreview, 
  logoPreview, 
  setLogoFile, 
  setLogoPreview,
  refetchAll 
}) => {
  
  // 🔥 PICHA YA DEFAULT (Ikiwa banner haipo au imefeli kupakia)
  const DEFAULT_BANNER = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop";
  
  // 🔥 State ya kuweka picha ya mwisho itakayoonekana
  const [finalBanner, setFinalBanner] = useState(DEFAULT_BANNER);

  useEffect(() => {
    // Chukua URL ya picha ya duka (kama ipo)
    const storeBannerUrl = bannerPreview || myStore?.store_banner_url;
    
    if (storeBannerUrl) {
      // Jaribu kupakia picha ya duka
      const img = new Image();
      img.src = storeBannerUrl;
      
      img.onload = () => {
        // Kama picha imepakiwa vizuri, itumie
        setFinalBanner(storeBannerUrl);
      };
      
      img.onerror = () => {
        // Kama picha imeshindwa (404), tumia DEFAULT_BANNER
        console.log("⚠️ Picha ya duka haipatikani, inatumia default banner.");
        setFinalBanner(DEFAULT_BANNER);
      };
    } else {
      // Kama hakuna URL kabisa, tumia DEFAULT_BANNER
      setFinalBanner(DEFAULT_BANNER);
    }
  }, [bannerPreview, myStore?.store_banner_url]);

  return (
    <header 
      className="relative rounded-2xl md:rounded-3xl min-h-[240px] md:min-h-[320px] flex flex-col justify-between overflow-hidden bg-cover bg-center"
      style={{
        // 🔥 Tumia finalBanner
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url('${finalBanner}')`,
      }}
    >
      <div className="p-5 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 relative z-10 w-full">
        
        <div className="flex-1 text-white">
          <div className="flex items-center flex-wrap gap-2 md:gap-3 mb-2 md:mb-3">
            <h1 className="text-xl md:text-3xl font-extrabold m-0 text-white">
              {myStore?.store_name || "Store Name"}
            </h1>
            
            {myStore?.is_verified ? (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-[11px] md:text-xs font-semibold bg-emerald-500/90 text-white">
                <CheckCircle size={14} />
                <span>Verified</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-[11px] md:text-xs font-semibold bg-amber-500/90 text-white">
                <Loader2 size={14} className="animate-spin" />
                <span>Reviewing</span>
              </div>
            )}
          </div>

          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-1 md:mt-2">
            <div className="flex items-center gap-1 text-[11px] md:text-xs bg-white/20 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-white">
              <Settings size={14} />
              <span>ID: {myStore?.id?.substring(0, 8)}</span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] md:text-xs text-white">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span>
              <span>{myStore?.city || "Location"}, Tanzania</span>
            </div>

            {/* Desktop Stats */}
            <div className="hidden md:flex items-center gap-3 text-xs text-white">
              <div className="flex items-center gap-1">
                <span className="opacity-70">Sales:</span>
                <span className="font-bold">{myStore?.total_sales || 0}</span>
              </div>
              <div className="w-px h-3 bg-white/30"></div>
              <div className="flex items-center gap-1">
                <span className="opacity-70">Type:</span>
                <span className="font-bold">{myStore?.business_type || "Retailer"}</span>
              </div>
            </div>
          </div>
          
          {/* Mobile Stats */}
          <div className="flex md:hidden items-center gap-4 mt-3 text-xs bg-white/15 px-3 py-2 rounded-xl w-fit text-white">
            <div className="flex items-center gap-1">
              <span className="opacity-70">📊 Sales:</span>
              <span className="font-bold">{myStore?.total_sales || 0}</span>
            </div>
            <div className="w-px h-3 bg-white/30"></div>
            <div className="flex items-center gap-1">
              <span className="opacity-70">🏪 Type:</span>
              <span className="font-bold">{myStore?.business_type || "Retailer"}</span>
            </div>
          </div>
        </div>

        {/* 🔥 KITUFE CHA "CHANGE BANNER" KIMEONDOLWA KABISA HAPA */}
        
      </div>
    </header>
  );
};

export default StoreHeader;