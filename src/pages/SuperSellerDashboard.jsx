import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
//import { supabase } from '../supabaseClient';
import ReactDOM from 'react-dom';
import { 
  LayoutDashboard, Package, ShoppingCart, BarChart3, Users, Settings, LogOut, 
  Bell, ChevronDown, ArrowUpRight, TrendingUp, AlertCircle, PlusCircle,
  Edit3, Rocket, X, CheckCircle, Plus
} from 'lucide-react';

// Import components zilizotengwa (Hakikisha njia ni sahihi)
import SellerSidebar from '../components/SellerSidebar';
import SellerHeader from '../components/SellerHeader';
import QuickInventoryManager from '../components/QuickInventoryManager';
import BusinessAnalytics from '../components/BusinessAnalytics'; 
import TopDealsSection from "../components/TopDealsSection";
import StoreHeader from '../components/StoreHeader'; 
import StoreManagement from '../components/StoreManagement';
import ProductCreationFlow from '../components/ProductCreationFlow';
import "../PhysicalDashboard.css";

const SuperSellerDashboard = () => {
  const navigate = useNavigate();
  
  // ==========================================
  // 1. STATE ZA LAYOUT & UI (Kutoka SuperSeller na Physical)
  // ==========================================
  const [isManageMode, setIsManageMode] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingStore, setIsUpdatingStore] = useState(false);
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(true); // Loading kuu

  // ==========================================
  // 2. DATA STATES (Kutoka Physical Dashboard)
  // ==========================================
  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [myStoreSubCats, setMyStoreSubCats] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [addedProducts, setAddedProducts] = useState([]);
  
  // 2b. FORM STATES
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

  // 2c. MEDIA STATES
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

  // ==========================================
  // 3. FUNCTIONS & EFFECTS (Kutoka Physical Dashboard)
  // ==========================================
  
  // Detect Screen Resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch All Core Data (Store, Categories, Brands, Products)
  const fetchDashboardData = async () => {
    try {
      // Pata Sub-categories na Brands kwa ajili ya Forms
      const { data: bData } = await supabase.from("brands").select("*");
      if (bData) setBrands(bData);

      const { data: allCats } = await supabase.from("sub_categories").select("*");
      if (allCats) setAllSubCategories(allCats);

      // Pata Store na Products kwa kutumia store.id
      if (!store?.id) return;
      
      const { data: storeData } = await supabase.from("stores_engine").select("*").eq("id", store.id).single();
      if (storeData) {
        setStore(storeData);
        setLogoPreview(storeData.store_logo);
        setBannerPreview(storeData.store_banner);
        setStoreMeta({
          store_name: storeData.store_name || "",
          phone_number: storeData.phone_number || "",
          whatsapp_number: storeData.whatsapp_number || "",
          instagram_handle: storeData.instagram_handle || "",
          tiktok_handle: storeData.tiktok_handle || "",
          youtube_link: storeData.youtube_link || "",
          physical_address: storeData.physical_address || "",
          working_hours: storeData.working_hours || "Mon - Sat (8:00 AM - 6:00 PM)",
          tin_number: storeData.tin_number || "",
          description: storeData.description || "",
          city: storeData.city || "",
        });

        const imgs = storeData.office_images || [];
        setOfficePreviews([imgs[0] || null, imgs[1] || null, imgs[2] || null]);

        if (storeData.sub_category_ids?.length > 0) {
          const { data: subData } = await supabase.from("sub_categories").select("*").in("id", storeData.sub_category_ids);
          if (subData) setMyStoreSubCats(subData);
        }

        const { data: prods } = await supabase.from("products_engines").select("*, product_media(*)").eq("store_id", storeData.id).order("created_at", { ascending: false });
        if (prods) setMyProducts(prods);
      }
    } catch (err) { 
      console.error("Fetch Error:", err); 
    } finally {
      setLoading(false);
    }
  };

  // Initial Fetch (User na Store yake)
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/dashboard/login');
        return;
      }
      setUser(session.user);

      const { data: storeData } = await supabase
        .from('stores_engine')
        .select('*')
        .eq('owner_id', session.user.id)
        .limit(1)
        .single();

      if (storeData) setStore(storeData);
      setLoading(false);
    };
    init();
  }, [navigate]);

  // Fetch data whenever store.id changes (akishapata duka)
  useEffect(() => {
    if (store?.id) {
      fetchDashboardData();
    }
  }, [store?.id]);


  // --- Helper & Action Functions ---
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

  const handleRemoveCategoryFromStore = async (catId) => {
    if (!window.confirm("Je, una uhakika unataka kuondoa kategoria hii?")) return;
    try {
      const updatedIds = (store.sub_category_ids || []).filter(cid => cid !== catId);
      const { error } = await supabase.from("stores_engine").update({ sub_category_ids: updatedIds }).eq("id", store.id);
      if (error) throw error;
      await fetchDashboardData();
    } catch (err) { alert("Imeshindikana: " + err.message); }
  };

  const handleUpdateStoreDetails = async () => {
    setIsUpdatingStore(true);
    try {
      let finalLogo = logoPreview;
      let finalBanner = bannerPreview;
      let finalOfficeUrls = [...officePreviews];

      if (logoFile) finalLogo = await uploadFile(logoFile, store.id);
      if (bannerFile) finalBanner = await uploadFile(bannerFile, store.id);
      for (let i = 0; i < officeFiles.length; i++) {
        if (officeFiles[i]) finalOfficeUrls[i] = await uploadFile(officeFiles[i], store.id);
      }

      const { error } = await supabase.from("stores_engine").update({
        ...storeMeta,
        store_logo: finalLogo,
        store_banner: finalBanner,
        office_images: finalOfficeUrls,
      }).eq("id", store.id);

      if (error) throw error;
      alert("Duka limesasishwa!");
      await fetchDashboardData();
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
      const { data: authData } = await supabase.auth.getUser();
      const userAuth = authData?.user;
      if (!userAuth) throw new Error("Session imeisha. Tafadhali login tena.");

      const { data: stData } = await supabase.from('stores_engine')
        .select('category_id')
        .eq('id', store.id)
        .single();
      const storeParentCategoryId = stData?.category_id;

      let successCount = 0;
      let remainingProducts = [...addedProducts];

      for (const p of addedProducts) {
        try {
          const productPath = `${p.category_id}/${store.id}`;
          let finalCoverUrl = await uploadFile(p.cover_file, productPath, "product-images");
          const finalGalleryUrls = [];
          if (p.gallery && p.gallery.length > 0) {
            for (const item of p.gallery) {
              const url = await uploadFile(item, productPath, "product-images");
              if (url) finalGalleryUrls.push(url);
            }
          }
          let finalVideoUrl = p.video_file ? await uploadFile(p.video_file, productPath, "product-videos") : null;

          const { data: engineData, error: engineError } = await supabase.from('products_engines').insert([{
            user_id: userAuth.id,
            store_id: store.id,
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

          successCount++;
          remainingProducts = remainingProducts.filter(item => item !== p);
          setAddedProducts([...remainingProducts]);

        } catch (productError) {
          console.error(`Error kwenye bidhaa ${p.name}:`, productError.message);
          continue;
        }
      }

      if (successCount > 0) {
        alert(`✅ Bidhaa ${successCount} zimehifadhiwa kikamilifu!`);
        await fetchDashboardData();
        if (remainingProducts.length === 0 && typeof setCurrentStep === 'function') setCurrentStep(1);
      }
      if (remainingProducts.length > 0) alert(`⚠️ Bidhaa ${remainingProducts.length} zimefeli kurushwa. Jaribu tena.`);
    } catch (err) { alert("Hitilafu Kubwa: " + err.message); } 
    finally { setIsLoading(false); }
  };

  // --- Handlers za Media ---
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

  const handleAddCategoryToStore = async (cat) => {
    try {
      const currentIds = store.sub_category_ids || [];
      if (currentIds.includes(cat.id)) {
        alert("Kategoria hii tayari ipo dukan kwako!");
        return;
      }
      const updatedIds = [...currentIds, cat.id];
      const { error } = await supabase.from("stores_engine").update({ sub_category_ids: updatedIds }).eq("id", store.id);
      if (error) throw error;
      await fetchDashboardData();
      alert(`✅ ${cat.name} imeongezwa!`);
    } catch (err) { alert("Hitilafu: " + err.message); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', color: '#666' }}>Inapakia Dashboard yako...</div>;

  const selectedCategoryName = myStoreSubCats?.find(cat => cat.id === attributes.category_id)?.name || "Chagua Kategoria";

  // ==========================================
  // 4. RENDER (Muonekano wa Mwisho)
  // ==========================================
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: "'Inter', sans-serif" }}>
      
      {/* ✅ SIDEBAR COMPONENT (Imetengwa) */}
      <SellerSidebar store={store} handleLogout={handleLogout} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        
        {/* ✅ HEADER COMPONENT (Imetengwa) */}
        <SellerHeader user={user} store={store} />

        {/* ✅ MAUDAILI KUU YA DASHBOARD (Sasa inajumuisha yaliyomo yote ya PhysicalDashboard) */}
        <div style={{ padding: '30px', flex: 1, overflowY: 'auto' }}>
          
          <StoreHeader 
            myStore={store}
            bannerPreview={bannerPreview}
            setBannerFile={setBannerFile}
            setBannerPreview={setBannerPreview}
            logoPreview={logoPreview}
            setLogoFile={setLogoFile}
            setLogoPreview={setLogoPreview}
          />

          <section className="pd-section mt-4">
            <BusinessAnalytics products={myProducts} sellerId={store?.id} />   
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
            <div className="bg-white p-6 rounded-[35px] border border-gray-100 shadow-sm" style={{ marginBottom: '32px' }}>
              <h2 className="text-xl font-black text-gray-800 mb-6">✨ Ongeza Bidhaa Mpya</h2>
              <ProductCreationFlow 
                storeId={store.id}
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
          </section>

          {/* --- MODAL YA KATEGORIA (Imetumia Portal kama awali) --- */}
          {showCategoryManager && ReactDOM.createPortal(
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}>
              <div style={{ position: 'absolute', inset: 0 }} onClick={() => setShowCategoryManager(false)} />
              <div className="animate-in slide-in-from-bottom duration-300" style={{ position: 'relative', backgroundColor: 'white', width: '100%', maxWidth: '500px', borderRadius: isMobile ? '30px 30px 0 0' : '35px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: isMobile ? '92vh' : '85vh', boxShadow: '0 -10px 25px rgba(0,0,0,0.2)' }}>
                {isMobile && <div style={{ width: '40px', height: '4px', backgroundColor: '#e5e7eb', borderRadius: '2px', margin: '12px auto 0' }} />}
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white" style={{ flexShrink: 0 }}>
                  <div>
                    <h3 className="font-black text-gray-800 italic uppercase tracking-tighter" style={{ margin: 0, fontSize: '1rem' }}>Soko la Kategoria</h3>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest" style={{ margin: 0 }}>Chagua sub-kategoria ya kuongeza</p>
                  </div>
                  <button onClick={() => setShowCategoryManager(false)} className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 border-none"><X size={18} /></button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {allSubCategories
                      .filter(cat => String(cat.category_id || "").trim() === String(store?.category_id || "").trim())
                      .map((cat) => {
                        const isAdded = myStoreSubCats.some(s => s.id === cat.id);
                        return (
                          <button key={cat.id} disabled={isAdded} onClick={() => handleAddCategoryToStore(cat)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', borderRadius: '18px', border: '1.5px solid', width: '100%', backgroundColor: isAdded ? '#f9fafb' : 'white', borderColor: isAdded ? '#f3f4f6' : '#f3f4f6', cursor: isAdded ? 'not-allowed' : 'pointer' }}>
                            <span style={{ fontWeight: '700', fontSize: '13px', color: isAdded ? '#9ca3af' : '#374151' }}>{cat.name}</span>
                            {isAdded ? (<CheckCircle size={18} className="text-green-500" />) : (<div style={{ color: '#f97316' }}><Plus size={18} /></div>)}
                          </button>
                        );
                      })}
                    {allSubCategories.filter(cat => String(cat.category_id || "").trim() === String(store?.category_id || "").trim()).length === 0 && (
                      <div style={{ textAlign: 'center', padding: '40px 20px' }}><p style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '600' }}>Hakuna kategoria hapa.</p></div>
                    )}
                  </div>
                </div>
                <div className="p-4 bg-white border-t border-gray-50" style={{ flexShrink: 0, paddingBottom: isMobile ? '30px' : '20px' }}>
                  <button onClick={() => setShowCategoryManager(false)} style={{ width: '100%', padding: '16px', backgroundColor: 'black', color: 'white', borderRadius: '16px', fontWeight: '900', border: 'none', fontSize: '14px' }}>NIMEKAMILISHA</button>
                </div>
              </div>
            </div>,
            document.body
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperSellerDashboard;