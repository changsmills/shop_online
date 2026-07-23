import React from 'react';
import { CheckCircle, Loader2, Settings, Camera } from 'lucide-react';
import axios from 'axios';
import '../StoreHeader.css'; // ✅ Import CSS class

const API_BASE_URL = "http://127.0.0.1:8000/api";

const StoreHeader = ({ 
  myStore, 
  bannerPreview, 
  setBannerFile, 
  setBannerPreview, 
  logoPreview, 
  setLogoFile, 
  setLogoPreview 
}) => {
  
  const handleImageChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file || !myStore?.id) return;

    const localPreview = URL.createObjectURL(file);
    if (type === 'banner') setBannerPreview(localPreview);
    else setLogoPreview(localPreview);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) { alert("Tafadhali ingia tena."); return; }

      const formData = new FormData();
      const fieldName = type === 'banner' ? 'store_banner' : 'store_logo';
      formData.append(fieldName, file);

      const response = await axios.patch(
        `${API_BASE_URL}/stores/${myStore.id}/`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const updatedStore = response.data;
      if (type === 'banner' && updatedStore.store_banner) {
        setBannerPreview(updatedStore.store_banner);
      } else if (type === 'logo' && updatedStore.store_logo) {
        setLogoPreview(updatedStore.store_logo);
      }

      alert('Imefanikiwa kubadilishwa!');
    } catch (error) {
      console.error('Shida imetokea:', error.response?.data || error.message);
      alert('Imeshindikana kupakia picha. Tafadhali jaribu tena.');
    }
  };

  return (
    <header 
      className="store-header-wrapper"
      style={{
        // 🔥 Exception: Hapa tunatumia inline kwa dynamic URL pekee.
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${bannerPreview || myStore?.store_banner || "https://via.placeholder.com/1200x400"})`
      }}
    >
      <div className="store-header-inner">
        
        {/* MAELEZO YA DUKA */}
        <div className="store-info-content">
          <div className="store-title-group">
            <h1 className="store-title">
              {myStore?.store_name || "Jina la Duka"}
            </h1>
            
            {myStore?.is_verified ? (
              <div className="store-verified-badge green">
                <CheckCircle size={14} />
                <span>Verified</span>
              </div>
            ) : (
              <div className="store-verified-badge yellow">
                <Loader2 size={14} className="store-spin" />
                <span>Reviewing</span>
              </div>
            )}
          </div>

          <div className="store-info-row">
            <div className="store-tag">
              <Settings size={14} />
              <span>ID: {myStore?.id?.substring(0, 8)}</span>
            </div>

            <div className="store-location-text">
              <span className="store-dot-status"></span>
              <span>{myStore?.city || "Location"}, Tanzania</span>
            </div>

            {/* 📌 DESKTOP STATS (Inaonekana PC tu) */}
            <div className="desktop-stats-row">
              <div className="desktop-stats-item">
                <span className="stats-text-light">Sales:</span>
                <span className="stats-text-bold">{myStore?.total_sales || 0}</span>
              </div>
              <div className="desktop-stats-divider"></div>
              <div className="desktop-stats-item">
                <span className="stats-text-light">Type:</span>
                <span className="stats-text-bold">{myStore?.business_type || "Retailer"}</span>
              </div>
            </div>
          </div>
          
          {/* 📱 MOBILE STATS (Inaonekana Simu tu) */}
          <div className="mobile-stats-row">
            <div className="mobile-stats-item">
              <span className="stats-text-light">📊 Sales:</span>
              <span className="stats-text-bold">{myStore?.total_sales || 0}</span>
            </div>
            <div className="mobile-stats-divider"></div>
            <div className="mobile-stats-item">
              <span className="stats-text-light">🏪 Type:</span>
              <span className="stats-text-bold">{myStore?.business_type || "Retailer"}</span>
            </div>
          </div>
        </div>

        {/* KITUFE CHA BANNER */}
        <label className="store-header-btn">
          <Camera size={16} />
          {/* Badili maandishi kulingana na skrini kwa CSS Class */}
          <span className="btn-label-desktop">Badili Banner</span>
          <span className="btn-label-mobile">Banner</span>
          <input type="file" hidden onChange={(e) => handleImageChange(e, 'banner')} />
        </label>
      </div>
    </header>
  );
};

export default StoreHeader;