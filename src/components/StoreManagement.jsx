import React from 'react';
import { Settings, CheckCircle, X, Plus, Phone, Instagram, Camera } from 'lucide-react';

const StoreManagement = ({
  // Kategoria Props
  isManageMode,
  isMobile,
  setIsManageMode,
  myStoreSubCats,
  attributes,
  setAttributes,
  handleRemoveCategoryFromStore,
  setShowCategoryManager,
  selectedCategory,
  
  // Office Images Props
  officePreviews,
  officeFiles,
  setOfficeFiles,
  setOfficePreviews,
  officeInputRefs,

  // Store Meta Props
  storeMeta,
  setStoreMeta,
  isUpdatingStore,
  handleUpdateStoreDetails
}) => {
  return (
    <section className="pd-section mt-6">
      <div className="pd-card p-4">
        {/* --- SEHEMU YA KATEGORIA --- */}
        <div className="pd-card-header mb-4 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-800 text-sm">🏷️ Kategoria za Duka Lako</h3>
            <p className="text-[10px] text-gray-500">Chagua kategoria ya bidhaa unayotaka kuongeza</p>
          </div>
          <button 
            onClick={() => setIsManageMode(!isManageMode)}
            className={`text-[10px] px-3 py-1.5 rounded-lg font-bold border transition-all flex items-center gap-1 ${
              isManageMode ? 'bg-red-500 text-white shadow-md' : 'bg-gray-50 text-gray-600 border-gray-200'
            }`}
          >
            <Settings size={12} /> {isManageMode ? "MALIZA" : "DHIBITI"}
          </button>
        </div>

        <div className="pd-subcat-wrapper flex flex-wrap gap-2">
          {myStoreSubCats.length > 0 ? (
            myStoreSubCats.map((sub) => (
              <div key={sub.id} className="relative">
                <button
                  type="button"
                  onClick={() => setAttributes({ ...attributes, category_id: sub.id })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                    attributes.category_id === sub.id 
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm' 
                      : 'bg-white text-gray-700 border-gray-100 hover:border-orange-300'
                  }`}
                >
                  {sub.name}
                  {attributes.category_id === sub.id && <CheckCircle size={12} />}
                </button>
                {isManageMode && (
                  <button 
                    onClick={() => handleRemoveCategoryFromStore(sub.id)}
                    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 shadow-lg hover:scale-110 z-10"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="w-full py-4 text-center border-2 border-dashed border-gray-100 rounded-xl">
              <p className="text-gray-400 text-[10px] italic">Hujachagua kategoria bado.</p>
            </div>
          )}
          <button 
            onClick={() => setShowCategoryManager(true)}
            className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all"
          >
            <Plus size={16} />
          </button>
        </div>

{/* --- OFFICE IMAGES & STORE DETAILS FORM --- */}
<div className="pd-grid-layout mt-8 pt-6 border-t border-gray-100">
  <div className="pd-image-upload-grid">
    {officePreviews.map((url, index) => (
      <div key={index} className="pd-image-box" onClick={() => officeInputRefs.current[index].click()}>
        {url ? <img src={url} alt="Office" className="pd-office-img" /> : <div className="pd-placeholder">📸 Picha {index + 1}</div>}
        <input
          type="file"
          hidden
          ref={(el) => (officeInputRefs.current[index] = el)}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const nF = [...officeFiles]; nF[index] = file; setOfficeFiles(nF);
              const nP = [...officePreviews]; nP[index] = URL.createObjectURL(file); setOfficePreviews(nP);
            }
          }}
        />
      </div>
    ))}
  </div>

  <div className="pd-form-column">
    
  <div className={isMobile ? "flex flex-col gap-3" : "pd-input-row"}>
  <div className="pd-input-group flex-1">
    <label>Jina la Duka</label>
    <input 
      type="text" 
      className="w-full" 
      value={storeMeta.store_name} 
      onChange={(e) => setStoreMeta({ ...storeMeta, store_name: e.target.value })} 
    />
  </div>
  <div className="pd-input-group flex-1">
    <label>Simu ya Biashara</label>
    <input 
      type="text" 
      className="w-full" 
      value={storeMeta.phone_number} 
      onChange={(e) => setStoreMeta({ ...storeMeta, phone_number: e.target.value })} 
    />
  </div>
</div>

   <div className={isMobile ? "flex flex-col gap-3 mt-3" : "pd-input-row mt-3"}>
  <div className="pd-input-group flex-1">
    <label><Phone size={14} className="inline mr-1" /> WhatsApp</label>
    <input 
      type="text" 
      className="w-full" // Inahakikisha input inajaza upana wote kwenye simu
      placeholder="255..." 
      value={storeMeta.whatsapp_number} 
      onChange={(e) => setStoreMeta({ ...storeMeta, whatsapp_number: e.target.value })} 
    />
  </div>
  <div className="pd-input-group flex-1">
    <label><Instagram size={14} className="inline mr-1" /> Instagram</label>
    <input 
      type="text" 
      className="w-full" // Inahakikisha input inajaza upana wote kwenye simu
      placeholder="@handle" 
      value={storeMeta.instagram_handle} 
      onChange={(e) => setStoreMeta({ ...storeMeta, instagram_handle: e.target.value })} 
    />
  </div>
</div>

    <div className="pd-input-group mt-3">
      <label>Physical Address</label>
      <input type="text" value={storeMeta.physical_address} onChange={(e) => setStoreMeta({ ...storeMeta, physical_address: e.target.value })} />
    </div>

<div className={isMobile ? "flex flex-col gap-4 mt-4" : "pd-input-row mt-4"}>
  <div className="pd-input-group flex-1">
    <label className="block mb-1">TIN Number 🔒</label>
    <input 
      type="text" 
      value={storeMeta.tin_number || "Inapakia..."} 
      readOnly 
      className="bg-gray-100 cursor-not-allowed opacity-80 font-mono w-full" 
    />
  </div>
  <div className="pd-input-group flex-1">
    <label className="block mb-1">TikTok Handle</label>
    <input 
      type="text" 
      placeholder="@username" 
      value={storeMeta.tiktok_handle || ""} 
      onChange={(e) => setStoreMeta({ ...storeMeta, tiktok_handle: e.target.value })} 
      className="w-full"
    />
  </div>
</div>

    <div className="pd-input-group mt-4">
      <label className="block text-sm font-medium mb-1 text-gray-700">Maelezo ya Duka</label>
      <textarea 
        rows="3"
        className="w-full p-3 rounded-lg border border-gray-200 text-gray-800"
        value={storeMeta.description || ""}
        onChange={(e) => setStoreMeta({ ...storeMeta, description: e.target.value })}
      />
    </div>

    <button onClick={handleUpdateStoreDetails} disabled={isUpdatingStore} className="pd-save-btn mt-6 w-full">
      {isUpdatingStore ? "Inasave..." : "Hifadhi Mabadiliko ya Duka ✅"}
    </button>
  </div>
</div>
      </div>
    </section>
  );
};

export default StoreManagement;