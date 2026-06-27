// pages/SellerSettings.jsx
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import StoreHeader from '../components/StoreHeader'; 
import StoreManagement from '../components/StoreManagement';

export default function SellerSettings() {
  const { 
    store, myStoreSubCats, attributes, setAttributes,
    isManageMode, setIsManageMode, isMobile,
    handleRemoveCategoryFromStore, setShowCategoryManager,
    officePreviews, setOfficeFiles, setOfficePreviews, officeInputRefs,
    storeMeta, setStoreMeta, isUpdatingStore, handleUpdateStoreDetails,
    logoPreview, setLogoFile, setLogoPreview, bannerPreview, setBannerFile, setBannerPreview
  } = useOutletContext();

  return (
    <div className="pd-section">
      <StoreHeader 
        myStore={store} bannerPreview={bannerPreview} setBannerFile={setBannerFile} setBannerPreview={setBannerPreview}
        logoPreview={logoPreview} setLogoFile={setLogoFile} setLogoPreview={setLogoPreview}
      />
      <StoreManagement 
        isManageMode={isManageMode} isMobile={isMobile} setIsManageMode={setIsManageMode}
        myStoreSubCats={myStoreSubCats} attributes={attributes} setAttributes={setAttributes}
        handleRemoveCategoryFromStore={handleRemoveCategoryFromStore} setShowCategoryManager={setShowCategoryManager}
        officePreviews={officePreviews} setOfficeFiles={setOfficeFiles} setOfficePreviews={setOfficePreviews}
        officeInputRefs={officeInputRefs} storeMeta={storeMeta} setStoreMeta={setStoreMeta}
        isUpdatingStore={isUpdatingStore} handleUpdateStoreDetails={handleUpdateStoreDetails}
      />
    </div>
  );
}