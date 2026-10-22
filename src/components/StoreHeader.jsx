import React from 'react';
import { CheckCircle, Loader2, Settings, Camera } from 'lucide-react';
import api from '../axiosConfig';

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
      if (!token) { alert("Please login again."); return; }

      const formData = new FormData();
      const fieldName = type === 'banner' ? 'store_banner' : 'store_logo';
      formData.append(fieldName, file);

      const response = await api.patch(
        `/stores/${myStore.id}/`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const updatedStore = response.data;
      
      if (type === 'banner' && updatedStore.store_banner_url) {
        setBannerPreview(updatedStore.store_banner_url);
      } else if (type === 'logo' && updatedStore.store_logo_url) {
        setLogoPreview(updatedStore.store_logo_url);
      }

      alert('Successfully updated!');
    } catch (error) {
      console.error('An error occurred:', error.response?.data || error.message);
      alert('Failed to upload image. Please try again.');
    }
  };

  return (
    <header 
      className="relative rounded-2xl md:rounded-3xl min-h-[240px] md:min-h-[320px] flex flex-col justify-between bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url('${bannerPreview || myStore?.store_banner_url || "https://via.placeholder.com/1200x400"}')`
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

        <label className="flex items-center gap-1.5 md:gap-2 bg-black/60 backdrop-blur-md px-3 py-2 md:px-4 md:py-2.5 rounded-full text-xs md:text-sm font-semibold text-white cursor-pointer transition-all hover:bg-black/80 whitespace-nowrap border-none mt-2 md:mt-0">
          <Camera size={16} />
          <span className="hidden md:inline">Change Banner</span>
          <span className="inline md:hidden">Banner</span>
          <input type="file" hidden onChange={(e) => handleImageChange(e, 'banner')} />
        </label>
      </div>
    </header>
  );
};

export default StoreHeader;