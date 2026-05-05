import React, { useState, useEffect } from 'react';
import { CheckCircle, Loader2, Settings, Camera } from 'lucide-react';
import { supabase } from '../supabaseClient'; 

const StoreHeader = ({ 
  myStore, 
  bannerPreview, 
  setBannerFile, 
  setBannerPreview, 
  logoPreview, 
  setLogoFile, 
  setLogoPreview 
}) => {
  
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

 const handleImageChange = async (e, type) => {
  const file = e.target.files[0];
  if (!file || !myStore?.id) return;

  // 1. Tengeneza jina la kipekee na path (kama yale ya Supabase uliyotuma)
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `${myStore.owner_id}/branding/${fileName}`;

  try {
    // 2. Pandisha picha kwenye Supabase Bucket ya 'picha_za_duka'
    const { error: uploadError } = await supabase.storage
      .from('picha_za_duka')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 3. Pata Public URL ya hiyo picha
    const { data: { publicUrl } } = supabase.storage
      .from('picha_za_duka')
      .getPublicUrl(filePath);

    // 4. Update Table ya 'stores_engine' kulingana na Column husika
    const updateColumn = type === 'banner' ? 'store_banner' : 'store_logo';
    
    const { error: updateError } = await supabase
      .from('stores_engine')
      .update({ [updateColumn]: publicUrl })
      .eq('id', myStore.id); // Inatumia ID ya duka uliyotupa

    if (updateError) throw updateError;

    // 5. Update UI Preview
    if (type === 'banner') setBannerPreview(publicUrl);
    else setLogoPreview(publicUrl);

    alert('Imefanikiwa kubadilishwa!');
  } catch (error) {
    console.error('Shida imetokea:', error.message);
    alert('Imeshindikana kupakia picha.');
  }
};
  
  useEffect(() => {
  if (myStore?.store_banner) setBannerPreview(myStore.store_banner);
  if (myStore?.store_logo) setLogoPreview(myStore.store_logo);
}, [myStore]);

  return (
    <header
      className="pd-header-card-premium"
      style={{
  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), 
url(${bannerPreview || myStore?.store_banner || "https://via.placeholder.com/1200x400"})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  
  // 1. Ongeza urefu wa chini ili isijikunje (Stabilization)
  minHeight: isMobile ? '240px' : '320px', 
  
  borderRadius: isMobile ? '16px' : '24px',
  
  // 2. Ongeza nafasi ya chini ili kutoa room kwa Logo inayochungulia nje
  marginBottom: isMobile ? '45px' : '60px', 
  
  overflow: 'visible', // Badilisha kuwa visible ili Logo ionekane ikitokeza nje
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
}}
    >
      {/* Inner container with padding */}
      <div style={{
        padding: isMobile ? '20px 16px' : '30px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        gap: isMobile ? '16px' : '0'
      }}>
        
        {/* 1. Maelezo ya Duka (Jina, Verification, ID) */}
        <div className="pd-header-info" style={{
          flex: 1,
          color: 'white'
        }}>
          <div className="pd-name-row" style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: isMobile ? '8px' : '12px',
            marginBottom: isMobile ? '8px' : '12px'
          }}>
            <h1 className="pd-store-name" style={{
              fontSize: isMobile ? '20px' : '28px',
              fontWeight: '800',
              margin: 0,
              color: 'white'
            }}>
              {myStore?.store_name || "Jina la Duka"}
            </h1>
            
            {myStore?.is_verified ? (
              <div className="pd-badge verified" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'rgba(16, 185, 129, 0.9)',
                padding: isMobile ? '4px 10px' : '4px 12px',
                borderRadius: '30px',
                fontSize: isMobile ? '11px' : '12px',
                fontWeight: '600'
              }}>
                <CheckCircle size={isMobile ? 12 : 14} />
                <span>Verified</span>
              </div>
            ) : (
              <div className="pd-badge pending" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'rgba(245, 158, 11, 0.9)',
                padding: isMobile ? '4px 10px' : '4px 12px',
                borderRadius: '30px',
                fontSize: isMobile ? '11px' : '12px',
                fontWeight: '600'
              }}>
                <Loader2 size={isMobile ? 12 : 14} className="pd-icon-spin" />
                <span>Reviewing</span>
              </div>
            )}
          </div>

          <div className="pd-meta-row" style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: isMobile ? '6px 12px' : '16px',
            marginTop: isMobile ? '4px' : '8px'
          }}>
            <div className="pd-id-box" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: isMobile ? '11px' : '12px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: isMobile ? '4px 10px' : '6px 12px',
              borderRadius: '20px'
            }}>
              <Settings size={isMobile ? 12 : 14} />
              <span>ID: {myStore?.id?.substring(0, 8)}</span>
            </div>

            <div className="pd-location" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: isMobile ? '11px' : '12px'
            }}>
              <span className="pd-dot" style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                display: 'inline-block'
              }}></span>
              <span>{myStore?.city || "Location"}, Tanzania</span>
            </div>

            {!isMobile && (
              <div className="pd-stats-summary" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '12px'
              }}>
                <div className="pd-stat-item" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ opacity: 0.7 }}>Sales:</span>
                  <span style={{ fontWeight: '700' }}>{myStore?.total_sales || 0}</span>
                </div>
                <div className="pd-stat-divider" style={{ width: '1px', height: '12px', backgroundColor: 'rgba(255,255,255,0.3)' }}></div>
                <div className="pd-stat-item" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ opacity: 0.7 }}>Type:</span>
                  <span style={{ fontWeight: '700' }}>{myStore?.business_type || "Retailer"}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Stats for mobile only */}
          {isMobile && (
            <div className="pd-stats-mobile" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: '12px',
              fontSize: '12px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              padding: '8px 12px',
              borderRadius: '12px',
              width: 'fit-content'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ opacity: 0.7 }}>📊 Sales:</span>
                <span style={{ fontWeight: '700' }}>{myStore?.total_sales || 0}</span>
              </div>
              <div style={{ width: '1px', height: '12px', backgroundColor: 'rgba(255,255,255,0.3)' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ opacity: 0.7 }}>🏪 Type:</span>
                <span style={{ fontWeight: '700' }}>{myStore?.business_type || "Retailer"}</span>
              </div>
            </div>
          )}
        </div>

        {/* 2. Kitufe cha kubadili Banner */}
        <label className="pd-banner-edit" style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '6px' : '8px',
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          padding: isMobile ? '8px 12px' : '10px 16px',
          borderRadius: '30px',
          fontSize: isMobile ? '12px' : '13px',
          fontWeight: '600',
          color: 'white',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap'
        }}>
          <Camera size={isMobile ? 14 : 16} />
          <span>{isMobile ? 'Banner' : 'Badili Banner'}</span>
          <input type="file" hidden onChange={(e) => handleImageChange(e, 'banner')} />
        </label>
      </div>

      {/* 3. Sehemu ya Logo (Avatar) - Bottom Left */}
      <div className="pd-profile-group" style={{
        position: 'absolute',
        bottom: isMobile ? '-25px' : '-30px',
        left: isMobile ? '16px' : '30px',
        zIndex: 10
      }}>
        <div className="pd-avatar-wrapper" style={{ position: 'relative' }}>
          <img 
            src={logoPreview || myStore?.store_logo || "https://via.placeholder.com/150"}
            alt="Logo" 
            style={{
              width: isMobile ? '70px' : '100px',
              height: isMobile ? '70px' : '100px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: isMobile ? '3px solid white' : '4px solid white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              backgroundColor: '#fff'
            }} 
          />
          <label className="pd-logo-edit" style={{
            position: 'absolute',
            bottom: '5px',
            right: '5px',
            backgroundColor: '#ff4e00',
            borderRadius: '50%',
            width: isMobile ? '28px' : '32px',
            height: isMobile ? '28px' : '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '2px solid white',
            transition: 'transform 0.2s'
          }}>
            <Camera size={isMobile ? 12 : 14} color="white" />
            <input type="file" hidden onChange={(e) => handleImageChange(e, 'logo')} />
          </label>
        </div>
      </div>

      {/* Add padding bottom to account for absolute positioned logo */}
      <div style={{ height: isMobile ? '45px' : '60px' }}></div>
    </header>
  );
};

export default StoreHeader;