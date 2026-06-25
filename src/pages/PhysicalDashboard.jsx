import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Header from "../components/Header";
import Footer from "../components/Footer";
import QuickInventoryManager from '../components/QuickInventoryManager';
import BusinessAnalytics from '../components/BusinessAnalytics'; 
import TopDealsSection from "../components/TopDealsSection"
import StoreHeader from '../components/StoreHeader'; 
import StoreManagement from '../components/StoreManagement';
import ProductCreationFlow from '../components/ProductCreationFlow';
import { Edit3, Rocket, X, CheckCircle, Plus } from 'lucide-react';
import "../PhysicalDashboard.css";
import ReactDOM from 'react-dom';

export default function PhysicalDashboard() {
  const navigate = useNavigate();
  const { id } = useParams();

  // --- UI STATES ---
  const [isManageMode, setIsManageMode] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // Imerudishwa kwa ajili ya Flow
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingStore, setIsUpdatingStore] = useState(false);
  const [search, setSearch] = useState("");

  // --- DATA STATES ---
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [myStore, setMyStore] = useState(null);
  const [myStoreSubCats, setMyStoreSubCats] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [addedProducts, setAddedProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // --- FORM STATES ---
  const [storeMeta, setStoreMeta] = useState({
    store_name: "", phone_number: "", whatsapp_number: "",
    instagram_handle: "", tiktok_handle: "", youtube_link: "",
    physical_address: "", working_hours: "", tin_number: "",
    description: "", city: "",
  });

  const [attributes, setAttributes] = useState({
    name: "", price: "", compare_at_price: "", 
    category_id: "", brand_id: "", stock: "",
    description: "", specifications: {}
  });

  // --- MEDIA PREVIEWS & FILES ---
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [officePreviews, setOfficePreviews] = useState([null, null, null]);
  const [officeFiles, setOfficeFiles] = useState([null, null, null]);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const officeInputRefs = useRef([]);
  const coverInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  useEffect(() => {
    if (id) fetchDashboardData();
  }, [id]);

  useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  // --- RESET FORM ---
  const resetProductForm = () => {
    setAttributes({
      name: "", price: "", compare_at_price: "",
      category_id: attributes.category_id,
      brand_id: "", stock: "", description: "", specifications: {}
    });
    setCoverFile(null); setCoverPreview(null);
    setGalleryFiles([]); setGalleryPreviews([]);
    setVideoFile(null); setVideoPreview(null);
    setEditingProductId(null);
  };

  const fetchDashboardData = async () => {
    try {
      const { data: bData } = await supabase.from("brands").select("*");
      if (bData) setBrands(bData);

      const { data: allCats } = await supabase.from("sub_categories").select("*");
      if (allCats) setAllSubCategories(allCats);

      const { data: store } = await supabase.from("stores_engine").select("*").eq("id", id).single();

      if (store) {
        setMyStore(store);
        setLogoPreview(store.store_logo);
        setBannerPreview(store.store_banner);
        setStoreMeta({
          store_name: store.store_name || "",
          phone_number: store.phone_number || "",
          whatsapp_number: store.whatsapp_number || "",
          instagram_handle: store.instagram_handle || "",
          tiktok_handle: store.tiktok_handle || "",
          youtube_link: store.youtube_link || "",
          physical_address: store.physical_address || "",
          working_hours: store.working_hours || "Mon - Sat (8:00 AM - 6:00 PM)",
          tin_number: store.tin_number || "",
          description: store.description || "",
          city: store.city || "",
        });

        const imgs = store.office_images || [];
        setOfficePreviews([imgs[0] || null, imgs[1] || null, imgs[2] || null]);

        if (store.sub_category_ids?.length > 0) {
          const { data: subData } = await supabase.from("sub_categories").select("*").in("id", store.sub_category_ids);
          if (subData) setMyStoreSubCats(subData);
        }

        const { data: prods } = await supabase.from("products_engines").select("*, product_media(*)").eq("store_id", id).order("created_at", { ascending: false });
        if (prods) setMyProducts(prods);
      }
    } catch (err) { console.error("Fetch Error:", err); }
  };

  const uploadFile = async (file, folderPath, bucket = "picha_za_duka") => {
    if (!file) return null;
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folderPath}/${fileName}`;
    const { error } = await supabase.storage.from(bucket).upload(filePath, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return urlData.publicUrl;
  };

  // --- CORE FUNCTIONS (Zilizohitajika na UI) ---
  const handleRemoveCategoryFromStore = async (catId) => {
    if (!window.confirm("Je, una uhakika unataka kuondoa kategoria hii?")) return;
    try {
      const updatedIds = (myStore.sub_category_ids || []).filter(cid => cid !== catId);
      const { error } = await supabase.from("stores_engine").update({ sub_category_ids: updatedIds }).eq("id", id);
      if (error) throw error;
      fetchDashboardData();
    } catch (err) { alert("Imeshindikana: " + err.message); }
  };

   const handleUpdateStoreDetails = async () => {
    setIsUpdatingStore(true);
    try {
      let finalLogo = logoPreview;
      let finalBanner = bannerPreview;
      let finalOfficeUrls = [...officePreviews];

      if (logoFile) finalLogo = await uploadFile(logoFile, id);
      if (bannerFile) finalBanner = await uploadFile(bannerFile, id);
      for (let i = 0; i < officeFiles.length; i++) {
        if (officeFiles[i]) finalOfficeUrls[i] = await uploadFile(officeFiles[i], id);
      }

      const { error } = await supabase.from("stores_engine").update({
        ...storeMeta,
        store_logo: finalLogo,
        store_banner: finalBanner,
        office_images: finalOfficeUrls,
      }).eq("id", id);

      if (error) throw error;
      alert("Duka limesasishwa!");
      fetchDashboardData();
    } catch (err) { alert("Hitilafu: " + err.message); }
    finally { setIsUpdatingStore(false); }
  };

  const addToQueue = () => {
    if (!attributes.name || !attributes.price) return alert("Jaza jina na bei!");
    if (!coverFile) return alert("Weka picha kuu!");

    const newProductEntry = {
      ...attributes,
      cover_file: coverFile,
      video_file: videoFile,
      gallery: [...galleryFiles],
      cover_preview: coverPreview 
    };

    setAddedProducts(prev => [...prev, newProductEntry]);
    resetProductForm();
    alert("Bidhaa imeongezwa kwenye list!");
  };
const handleFinalPublishAll = async () => {
  if (addedProducts.length === 0) return alert("Hakuna bidhaa ya kurusha!");
  setIsLoading(true);

  try {
    // 1. Uhakiki wa User
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;
    if (!user) throw new Error("Session imeisha. Tafadhali login tena.");

    // 2. Pata Parent Category ya Duka mara moja tu (nje ya loop)
    const { data: stData } = await supabase.from('stores_engine')
      .select('category_id')
      .eq('id', id)
      .single();
    const storeParentCategoryId = stData?.category_id;

    let successCount = 0;
    
    // Tunatumia nakala ya list ili tuweze ku-update UI bidhaa ikifanikiwa
    let remainingProducts = [...addedProducts];

    for (const p of addedProducts) {
      try {
        const productPath = `${p.category_id}/${id}`;

        // Upload Picha Kuu
        let finalCoverUrl = await uploadFile(p.cover_file, productPath, "product-images");

        // Upload Gallery
        const finalGalleryUrls = [];
        if (p.gallery && p.gallery.length > 0) {
          for (const item of p.gallery) {
            const url = await uploadFile(item, productPath, "product-images");
            if (url) finalGalleryUrls.push(url);
          }
        }

        // Upload Video
        let finalVideoUrl = p.video_file ? await uploadFile(p.video_file, productPath, "product-videos") : null;

        // 3. Insert kwenye products_engines
        const { data: engineData, error: engineError } = await supabase.from('products_engines').insert([{
          user_id: user.id,
          store_id: id,
          name: p.name,
          sku: `${p.name.substring(0,3).toUpperCase()}-${Date.now().toString().slice(-6)}`,
          price: parseFloat(p.price),
          original_price: parseFloat(p.compare_at_price) || 0,
          cover_image: finalCoverUrl || (finalGalleryUrls.length > 0 ? finalGalleryUrls[0] : null),
          category_id: p.category_id,
          parent_category_id: storeParentCategoryId,
          brand_id: p.brand_id || null,
          stock_quantity: parseInt(p.stock) || 0,
          description: p.description,
          specifications: p.specifications,
          is_approved: false
        }]).select('id').single();

        if (engineError) throw engineError;

        // 4. Insert Media (Picha za ziada na Video)
        const mediaPayload = [];
        if (finalVideoUrl) {
          mediaPayload.push({ product_id: engineData.id, media_type: 'video', media_url: finalVideoUrl, display_order: 0 });
        }
        finalGalleryUrls.forEach((url, i) => {
          mediaPayload.push({ product_id: engineData.id, media_type: 'image', media_url: url, display_order: i + 1 });
        });

        if (mediaPayload.length > 0) {
          await supabase.from('product_media').insert(mediaPayload);
        }

        // KAMA KILA KITU KIMEENDA SAWA:
        successCount++;
        // Ondoa bidhaa hii kwenye list ya "addedProducts" ili isirudiwe ikitokea error mbeleni
        remainingProducts = remainingProducts.filter(item => item.id !== p.id);
        setAddedProducts([...remainingProducts]);

      } catch (productError) {
        console.error(`Error kwenye bidhaa ${p.name}:`, productError.message);
        // Hapa hatu-stop loop, tunaendelea na bidhaa inayofuata
        continue;
      }
    }

    if (successCount > 0) {
      alert(`✅ Bidhaa ${successCount} zimehifadhiwa kikamilifu!`);
      fetchDashboardData();
      if (remainingProducts.length === 0) {
        // Kama zote zimeisha, rudi step ya kwanza
        if (typeof setCurrentStep === 'function') setCurrentStep(1);
      }
    }

    if (remainingProducts.length > 0) {
      alert(`⚠️ Bidhaa ${remainingProducts.length} zimefeli kurushwa. Tafadhali jaribu tena.`);
    }

  } catch (err) {
    alert("Hitilafu Kubwa: " + err.message);
  } finally {
    setIsLoading(false);
  }
};

  // --- UI Handlers ---
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) { setCoverFile(file); setCoverPreview(URL.createObjectURL(file)); }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) { setVideoFile(file); setVideoPreview(URL.createObjectURL(file)); }
  };

  const handleGalleryChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
      setGalleryFiles([...galleryFiles, ...selectedFiles]);
      setGalleryPreviews([...galleryPreviews, ...newPreviews]);
    }
  };

  const removeGalleryImage = (index) => {
    setGalleryFiles(galleryFiles.filter((_, i) => i !== index));
    setGalleryPreviews(galleryPreviews.filter((_, i) => i !== index));
  };

  const selectedCategoryName = myStoreSubCats?.find(cat => cat.id === attributes.category_id)?.name || "Chagua Kategoria";

  const handleAddCategoryToStore = async (cat) => {
  try {
    // Pata ID za sasa, kama hakuna anza na array tupu
    const currentIds = myStore.sub_category_ids || [];
    
    // Zuia kuongeza mara mbili
    if (currentIds.includes(cat.id)) {
      alert("Kategoria hii tayari ipo dukan kwako!");
      return;
    }

    const updatedIds = [...currentIds, cat.id];

    const { error } = await supabase
      .from("stores_engine")
      .update({ sub_category_ids: updatedIds })
      .eq("id", id);

    if (error) throw error;

    // Refresh dashboard ili kategoria mpya ionekane
    await fetchDashboardData();
    alert(`✅ ${cat.name} imeongezwa!`);
  } catch (err) {
    alert("Hitilafu: " + err.message);
  }
};

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 768);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

  return (
    <div className="pd-dashboard-wrapper">
      <Header search={search} setSearch={setSearch} />
      <main className="pd-main-content">
        <div className="pd-container">

           <StoreHeader 
            myStore={myStore}
            bannerPreview={bannerPreview}
            setBannerFile={setBannerFile}
            setBannerPreview={setBannerPreview}
            logoPreview={logoPreview}
            setLogoFile={setLogoFile}
            setLogoPreview={setLogoPreview}
          />
         

          <section className="pd-section mt-4">
            <BusinessAnalytics products={myProducts} sellerId={myStore?.id} />   
            <div className="advertise-banner-mini mt-4" onClick={() => navigate('/advertise')} style={{ background: 'linear-gradient(135deg, #ff4e00 0%, #ec2f4b 100%)', borderRadius: '20px', padding: '20px', color: 'white', cursor: 'pointer', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Rocket size={20} /><b>ONGEZA MAUZO LEO!</b></div>
                <p style={{ fontSize: '12px', opacity: 0.9 }}>Weka bidhaa zako mbele ya maelfu ya wateja sasa.</p>
              </div>
              <button style={{ backgroundColor: 'white', color: '#ff4e00', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold' }}>TANGAA SASA 🚀</button>
            </div>
          </section>

        <StoreManagement 
            isManageMode={isManageMode}
            isMobile={isMobile}
            setIsManageMode={setIsManageMode}
            myStoreSubCats={myStoreSubCats}
            attributes={attributes}
            setAttributes={setAttributes}
            handleRemoveCategoryFromStore={handleRemoveCategoryFromStore}
            setShowCategoryManager={setShowCategoryManager}
            officePreviews={officePreviews}
            setOfficeFiles={setOfficeFiles}
            setOfficePreviews={setOfficePreviews}
            officeInputRefs={officeInputRefs}
            storeMeta={storeMeta}
            setStoreMeta={setStoreMeta}
            isUpdatingStore={isUpdatingStore}
            handleUpdateStoreDetails={handleUpdateStoreDetails}
          />

   <section className="pd-section mt-8">
  
  {/* ROW YA 1: ProductCreationFlow - IWE JUU KABISA */}
  <div className="bg-white p-6 rounded-[35px] border border-gray-100 shadow-sm" style={{ marginBottom: '32px' }}>
    <h2 className="text-xl font-black text-gray-800 mb-6">✨ Ongeza Bidhaa Mpya</h2>
    <ProductCreationFlow 
      storeId={id}
      currentStep={currentStep} setCurrentStep={setCurrentStep}
      myStoreSubCats={myStoreSubCats}
      attributes={attributes} setAttributes={setAttributes}
      selectedCategoryName={selectedCategoryName} 
      coverPreview={coverPreview} coverInputRef={coverInputRef} handleCoverChange={handleCoverChange}
      videoPreview={videoPreview} videoInputRef={videoInputRef} handleVideoChange={handleVideoChange}
      galleryPreviews={galleryPreviews} galleryInputRef={galleryInputRef} handleGalleryChange={handleGalleryChange} removeGalleryImage={removeGalleryImage}
      addedProducts={addedProducts} setAddedProducts={setAddedProducts}
      addToQueue={addToQueue} resetProductForm={resetProductForm} handleFinalPublishAll={handleFinalPublishAll}
      isLoading={isLoading} editingProductId={editingProductId}
    />
  </div>
  
<div className="grid grid-cols-2 gap-6">
  <QuickInventoryManager products={myProducts} setProducts={setMyProducts} />
  <TopDealsSection products={myProducts} />
</div>

  {/* ROW YA 3: Products Grid (Bidhaa zilizopo) */}
  <div>
    <div className="pd-products-grid">
      {myProducts.map((p) => (
        <div key={p.id} className="pd-product-card">
          <img src={p.cover_image || "https://via.placeholder.com/150"} alt={p.name} className="pd-product-image" />
          <div className="pd-product-info">
            <span className="pd-product-name">{p.name}</span>
            <span className="pd-product-price">TZS {Number(p.price).toLocaleString()}</span>
          </div>
          <button onClick={() => navigate(`/update/${p.id}`)} className="pd-edit-btn">
            <Edit3 size={14} /> Hariri
          </button>
        </div>
      ))}
    </div>
  </div>

</section>
{!isMobile && <Footer />}
        </div>
      </main>
{/* --- MODAL YA KATEGORIA INAYOTUMIA PORTAL --- */}
{showCategoryManager && ReactDOM.createPortal(
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'flex-end', // Kwenye simu inaanza chini kidogo (kama kadi za iPhone)
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)'
  }}>
    {/* Background inayoweza kubonyeza kufunga */}
    <div 
      style={{ position: 'absolute', inset: 0 }}
      onClick={() => setShowCategoryManager(false)} 
    />
    
    {/* Dirisha la Modal */}
    <div 
      className="animate-in slide-in-from-bottom duration-300"
      style={{
        position: 'relative',
        backgroundColor: 'white',
        width: '100%',
        maxWidth: '500px',
        // Kwenye simu tunatoa round za juu tu, chini inagusa screen
        borderRadius: isMobile ? '30px 30px 0 0' : '35px', 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: isMobile ? '92vh' : '85vh', // Inachukua nafasi kubwa zaidi kwenye simu
        boxShadow: '0 -10px 25px rgba(0,0,0,0.2)'
      }}
    >
      
      {/* Notch ya urembo kwa ajili ya Mobile (Optional) */}
      {isMobile && (
        <div style={{ width: '40px', height: '4px', backgroundColor: '#e5e7eb', borderRadius: '2px', margin: '12px auto 0' }} />
      )}

      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white" style={{ flexShrink: 0 }}>
        <div>
          <h3 className="font-black text-gray-800 italic uppercase tracking-tighter" style={{ margin: 0, fontSize: '1rem' }}>Soko la Kategoria</h3>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest" style={{ margin: 0 }}>
            Chagua sub-kategoria ya kuongeza
          </p>
        </div>
        <button 
          onClick={() => setShowCategoryManager(false)}
          className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 border-none"
        >
          <X size={18} />
        </button>
      </div>

      {/* Sehemu ya Scroll (Kategoria) */}
      <div 
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '15px',
          WebkitOverflowScrolling: 'touch', // Muhimu kwa iPhone
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {allSubCategories
            .filter(cat => String(cat.category_id || "").trim() === String(myStore?.category_id || "").trim())
            .map((cat) => {
              const isAdded = myStoreSubCats.some(s => s.id === cat.id);
              
              return (
                <button
                  key={cat.id}
                  disabled={isAdded}
                  onClick={() => handleAddCategoryToStore(cat)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '15px 20px',
                    borderRadius: '18px',
                    border: '1.5px solid',
                    width: '100%',
                    backgroundColor: isAdded ? '#f9fafb' : 'white',
                    borderColor: isAdded ? '#f3f4f6' : '#f3f4f6',
                    cursor: isAdded ? 'not-allowed' : 'pointer'
                  }}
                >
                  <span style={{ 
                    fontWeight: '700', 
                    fontSize: '13px', 
                    color: isAdded ? '#9ca3af' : '#374151' 
                  }}>
                    {cat.name}
                  </span>
                  
                  {isAdded ? (
                    <CheckCircle size={18} className="text-green-500" />
                  ) : (
                    <div style={{ color: '#f97316' }}><Plus size={18} /></div>
                  )}
                </button>
              );
            })}
            
          {/* Kama hakuna kategoria */}
          {allSubCategories.filter(cat => String(cat.category_id || "").trim() === String(myStore?.category_id || "").trim()).length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '600' }}>Hakuna kategoria hapa.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer (Button ya chini) */}
      <div className="p-4 bg-white border-t border-gray-50" style={{ flexShrink: 0, paddingBottom: isMobile ? '30px' : '20px' }}>
        <button 
          onClick={() => setShowCategoryManager(false)}
          style={{ 
            width: '100%', 
            padding: '16px', 
            backgroundColor: 'black', 
            color: 'white', 
            borderRadius: '16px', 
            fontWeight: '900',
            border: 'none',
            fontSize: '14px'
          }}
        >
          NIMEKAMILISHA
        </button>
      </div>
    </div>
  </div>,
  document.body
)}
    </div>
  );
}