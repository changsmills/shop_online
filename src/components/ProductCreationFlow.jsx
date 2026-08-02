import React from 'react';
import { 
  Edit3, CheckCircle, ArrowLeft, Camera, 
  PlayCircle, Plus, X, PlusCircle, Trash2 
} from 'lucide-react';
import api from "../axiosConfig"; // 🔥 Tumia api
import ProductAttributes from '../pages/ProductAttribute';
import '../ProductCreationFlow.css';
import speedDashboardImg from "../images/SpeedDashboard.svg";

const ProductCreationFlow = ({ 
  storeId,      
  myStoreSubCats,
  storeSubCategoryIds = [], 
  onComplete 
}) => {
  console.log("🚀 [INIT] ProductCreationFlow Loaded!");
  console.log("  - Store ID (from props):", storeId);
  console.log("  - myStoreSubCats (from props):", myStoreSubCats);
  console.log("  - storeSubCategoryIds (from props):", storeSubCategoryIds);

  const [currentStep, setCurrentStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false); 

  const [allLeafCategories, setAllLeafCategories] = React.useState([]);

  const initialAttributes = {
    name: '', 
    price: '', 
    stock: '', 
    description: '', 
    category_id: null,       
    sub_category_id: null,   
    leaf_category_id: null,  
    brand_id: '', 
    specifications: [],
    total_stock_cost: '',        
    expected_total_profit: '',   
    is_retail: false,
    is_wholesale: false,
    price_tiers: [],
    target_audience: [], 
    available_sizes: [], 
    moq: '',
    size_stock: {},           
    colors: [],               
    sizes: [],                
    has_colors: false,        
    enable_sizes: false,      
    enable_variations: false, 
    color_images: {},         
    color_image_files: {},    
    dimensions: { length: '', width: '', height: '' },
    weight: '',
    warranty_months: '',
    gender: [],
    condition: 'new',
    shipping_method: 'fixed',
    shipping_cost: '',
    shipping_rate_per_km: '',
    shipping_base_fee: '',
    shipping_default_distance: '',
    shipping_dar_cost: '',
    shipping_outside_dar_cost: '',
    shipping_remote_cost: '',
    enable_pickup: false,
    store_address: '',
    marketplace_product_name: '',
    marketplace_base_price: '',
    marketplace_main_image: null,
    marketplace_main_image_file: null,
    price_per_meter: '',      
    price_per_foot: '',       
    size_format: 'standard',  
  };

  const [attributes, setAttributes] = React.useState(initialAttributes);
  const [addedProducts, setAddedProducts] = React.useState([]);

  const [coverPreview, setCoverPreview] = React.useState(null);
  const [coverFile, setCoverFile] = React.useState(null);
  const [videoPreview, setVideoPreview] = React.useState(null);
  const [videoFile, setVideoFile] = React.useState(null);
  const [galleryPreviews, setGalleryPreviews] = React.useState([]);
  const [galleryFiles, setGalleryFiles] = React.useState([]);

  const coverInputRef = React.useRef(null);
  const videoInputRef = React.useRef(null);
  const galleryInputRef = React.useRef(null);

    React.useEffect(() => {
    const fetchLeafCategories = async () => {
      console.log("🌿 [USE_EFFECT] sub_category_id imebadilika kuwa:", attributes.sub_category_id);
      
      // 1. Kama hakuna sub_category, futa data
      if (!attributes.sub_category_id) {
        console.log("  - Hakuna sub_category_id, nafuta leaf categories.");
        setAllLeafCategories([]);
        return;
      }

      // 2. Set loading state (muhimu kwa UI) na futa data za zamani
      setAllLeafCategories([]); // Safisha UI ili isionyeshe data za zamani
      
      try {
        const token = localStorage.getItem("access_token");
        
        // 3. Angalia kama Token ipo kabla ya kutuma request
        if (!token) {
          console.error("❌ [ERROR] Hakuna access_token kwenye localStorage!");
          return;
        }

        console.log(`  📤 [REQUEST] Inatuma GET kwa /leaf-categories/ kwa sub_category: ${attributes.sub_category_id}`);
        
        // 4. Tuma Request
        const res = await api.get('/leaf-categories/', {
          params: { sub_category: attributes.sub_category_id },
          headers: { Authorization: `Bearer ${token}` }
        });

        // 5. Angalia Response kutoka Backend
        console.log("  ✅ [RESPONSE] Backend imejibu kwa mafanikio!");
        console.log("  📦 [RESPONSE_DATA] Data zilizopokelewa:", res.data);
        
        // 6. Hakikisha data ni Array kabla ya kuweka kwenye state
        if (res.data && Array.isArray(res.data)) {
            if (res.data.length === 0) {
                console.warn("  ⚠️ [WARNING] Backend imerudisha array tupu ([]). Hakuna leaf categories kwenye DB kwa sub_category hii.");
            }
            setAllLeafCategories(res.data);
        } else {
            console.warn("  ⚠️ [WARNING] Data kutoka Backend si Array:", res.data);
            setAllLeafCategories([]);
        }

      } catch (err) {
        // 7. 🚨 HAPA NDIO TUTAPATA TATIZO HALISI!
        console.error("  ❌ [ERROR] Imeshindwa kupata leaf categories:");
        
        if (err.response) {
            // Backend imejibu lakini kwa error (400, 404, 500, n.k.)
            console.error("  🔴 [BACKEND_ERROR] Status:", err.response.status);
            console.error("  🔴 [BACKEND_ERROR] Data:", err.response.data);
            console.error("  🔴 [BACKEND_ERROR] Headers:", err.response.headers);
        } else if (err.request) {
            // Request ilituma, lakini Backend haikujibu (Network error, server off)
            console.error("  🟡 [NETWORK_ERROR] Hakuna response kutoka Backend! Angalia Network tab.");
            console.error("  🟡 [REQUEST_OBJECT]:", err.request);
        } else {
            // Tatizo katika kuandaa request (axios config error)
            console.error("  🔵 [SETUP_ERROR] Tatizo katika kuandaa request:", err.message);
        }
      }
    };
    
    fetchLeafCategories();
  }, [attributes.sub_category_id]); // 🔥 Hii inahakikisha inakimbia kila sub_category_id inapobadilika

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (galleryFiles.length + files.length > 5) return alert("Picha zisizidi 5");
    setGalleryFiles(prev => [...prev, ...files]);
    setGalleryPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeGalleryImage = (index) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const formatUUID = (id) => {
    console.log("  🔧 [formatUUID] Input received:", id, "Type:", typeof id);
    if (!id) {
      console.warn("  ⚠️ [formatUUID] ID is null or undefined!");
      return null;
    }
    const clean = id.toString().replace(/-/g, '');
    console.log("  🔧 [formatUUID] Cleaned (removed hyphens):", clean);
    
    if (clean.length === 32) {
      const formatted = `${clean.slice(0,8)}-${clean.slice(8,12)}-${clean.slice(12,16)}-${clean.slice(16,20)}-${clean.slice(20,32)}`;
      console.log("  ✅ [formatUUID] Formatted to standard UUID:", formatted);
      return formatted;
    }
    console.log("  ℹ️ [formatUUID] Not a 32-char hex, returning original:", id);
    return id;
  };

  const filteredStoreSubCats = React.useMemo(() => {
    if (!storeSubCategoryIds || storeSubCategoryIds.length === 0 || !myStoreSubCats) return [];
    return myStoreSubCats.filter(sub => storeSubCategoryIds.includes(sub.id));
  }, [myStoreSubCats, storeSubCategoryIds]);

    const handleFinalPublishAll = async () => {
    console.log("📦 [PUBLISH_BTN] ===== STARTING PUBLISH PROCESS =====");
    if (addedProducts.length === 0) return alert("Hakuna bidhaa ya kurusha!");
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Session imeisha. Tafadhali login tena.");
      if (!storeId) throw new Error("Store ID haipo!");

      console.log("  🔹 [STEP 1] Fetching Store data for Parent Category ID...");
      const storeRes = await api.get(`/stores/${storeId}/`, { headers: { Authorization: `Bearer ${token}` } });
      console.log("  🔹 [STEP 1] Store data response:", storeRes.data);
      
      const rawParentId = storeRes.data.category; 
      console.log("  🔹 [STEP 1] Raw Parent Category ID from DB:", rawParentId);
      
      const parentCategoryId = formatUUID(rawParentId);
      console.log("  🔹 [STEP 1] Final Parent Category ID to send:", parentCategoryId);

      let successCount = 0;
      const errors = [];

      for (const p of addedProducts) {
        console.log(`\n➡️ [PRODUCT LOOP] Processing product: "${p.name}"`);
        console.log("  - p.sub_category_id:", p.sub_category_id);
        console.log("  - p.category_id (initial):", p.category_id);
        console.log("  - p.leaf_category_id:", p.leaf_category_id);

        // 🔥 DEBUG 1: Angalia kama picha zipo kwenye Object ya Product kabla ya kutuma
        console.log("  🔍 [DEBUG] Checking product media files:");
        console.log("    - cover_file:", p.cover_file ? `✅ Exists (${p.cover_file.name})` : "❌ Missing");
        console.log("    - video_file:", p.video_file ? `✅ Exists (${p.video_file.name})` : "❌ Missing");
        console.log("    - gallery_files count:", p.gallery_files ? p.gallery_files.length : 0);
        if (p.gallery_files && p.gallery_files.length > 0) {
          p.gallery_files.forEach((f, i) => console.log(`      Gallery ${i+1}:`, f.name));
        }

        console.log("  🔍 Looking up subCategory in myStoreSubCats list...");
        const subCatObj = myStoreSubCats.find(sub => sub.id === p.sub_category_id);
        
        let realCategoryId = p.category_id;
        if (subCatObj && subCatObj.category) {
          realCategoryId = subCatObj.category;
          console.log("  ✅ SubCategory found! SubCatObj:", subCatObj);
          console.log("  ✅ REAL Category ID extracted from SubCatObj:", realCategoryId);
        } else {
          console.warn("  ⚠️ SubCategory NOT found or missing 'category' field. Falling back to p.category_id:", p.category_id);
        }

        try {
          // 🔥 TENGENEZA FORMDATA
          const formData = new FormData();
          formData.append("store_id", storeId);
          formData.append("name", p.name);
          formData.append("price", parseFloat(p.price) || 0);
          formData.append("original_price", parseFloat(p.compare_at_price) || 0);

          // Kategoria
          const formattedCategoryId = formatUUID(realCategoryId);
          console.log(`  ✨ Final formatted category: "${formattedCategoryId}"`);
          if (formattedCategoryId) formData.append("category", formattedCategoryId);
          if (parentCategoryId) formData.append("parent_category", parentCategoryId); 
          
          const formattedLeafId = formatUUID(p.leaf_category_id);
          console.log(`  ✨ Final formatted leaf_category: "${formattedLeafId}"`);
          if (formattedLeafId) formData.append("leaf_category", formattedLeafId);

          if (p.brand_id) formData.append("brand_id", p.brand_id);

          // Taarifa za msingi
          formData.append("stock_quantity", parseInt(p.stock) || 0);
          formData.append("description", p.description || "");
          formData.append("is_retail", p.is_retail ? "true" : "false");
          formData.append("is_wholesale", p.is_wholesale ? "true" : "false");
          formData.append("has_colors", p.has_colors ? "true" : "false");
          formData.append("enable_sizes", p.enable_sizes ? "true" : "false");
          formData.append("moq", p.moq || 1);
          formData.append("condition", p.condition || "new");
          formData.append("shipping_method", p.shipping_method || "fixed");
          formData.append("shipping_cost", parseFloat(p.shipping_cost) || 0);
          formData.append("size_format", p.size_format || "standard");
          formData.append("price_per_meter", parseFloat(p.price_per_meter) || 0);
          formData.append("price_per_foot", parseFloat(p.price_per_foot) || 0);
          formData.append("warranty_months", parseInt(p.warranty_months) || 0);
          formData.append("weight", parseFloat(p.weight) || 0);

          // JSON fields (Specs, Tiers, n.k.)
          formData.append("specifications", JSON.stringify(p.specifications || {}));
          formData.append("price_tiers", JSON.stringify(p.price_tiers || []));
          formData.append("colors", JSON.stringify(p.colors || []));
          formData.append("available_sizes", JSON.stringify(p.sizes || []));
          formData.append("size_stock", JSON.stringify(p.size_stock || {}));
          formData.append("target_audience", JSON.stringify(p.target_audience || []));
          formData.append("dimensions", JSON.stringify(p.dimensions || {}));
          formData.append("gender", JSON.stringify(p.gender || []));

          // ============================================================
          // 🔥 1. Tuma data ya color_images kama JSON (la muhimu: weka URLs tu za blob)
          // ============================================================
          const colorImagesData = {};
          if (p.color_images) {
            Object.keys(p.color_images).forEach(color => {
              colorImagesData[color] = p.color_images[color]; 
            });
          }
          formData.append("color_images", JSON.stringify(colorImagesData));

          // 🔥 2. ONDOA KABISA (Usitume files hapa! Zinatuma kwenye variations)
          // if (p.color_image_files && Object.keys(p.color_image_files).length > 0) { ... }

          // 🔥 DEBUG 2: Kuweka Media kwenye formData
          console.log("  📸 [DEBUG] Appending media files to FormData...");

          if (p.cover_file) {
            formData.append("cover_image", p.cover_file);
            console.log("    ✅ Appended cover_image");
          } else {
            console.warn("    ⚠️ No cover_file found.");
          }

          if (p.video_file) {
            formData.append("video_file", p.video_file);
            console.log("    ✅ Appended video_file");
          } else {
            console.log("    ℹ️ No video_file.");
          }

          if (p.gallery_files && p.gallery_files.length > 0) {
            p.gallery_files.forEach((file) => {
              formData.append("gallery_images", file);
            });
            console.log(`    ✅ Appended ${p.gallery_files.length} gallery_images`);
          } else {
            console.log("    ℹ️ No gallery_files.");
          }

          console.log(`  📤 SENDING Axios POST to /products/`);
          const response = await api.post('/products/', formData, {
            headers: { "Authorization": `Bearer ${token}` }
          });

          if (response.status === 201) {
            console.log(`  ✅ SUCCESS! Product created. Response:`, response.data);
            const newProductId = response.data.id;

            // ============================================================
            // 🔥 2. TUMA VARIATIONS (HAPA NDIO PAKUNA PICHA ZA RANGI!)
            // ============================================================
            if (p.variations && p.variations.length > 0) {
              console.log(`  📤 SENDING ${p.variations.length} variations to /product-variations/`);
              for (const variant of p.variations) {
                const varFormData = new FormData();
                varFormData.append("product", newProductId);
                varFormData.append("color_name", variant.color_name || "");
                varFormData.append("size_value", variant.size_value || "");
                varFormData.append("stock_quantity", variant.stock_quantity || 0);
                varFormData.append("price", variant.price || 0);
                
                if (variant.attributes) {
                  varFormData.append("attributes", JSON.stringify(variant.attributes));
                }
                
                // 🔥 MUHIMU SANA: Angalia kama faili lipo kwenye variant au kwenye map ya p.color_image_files
                let fileToSend = variant.color_image_file;
                if (!fileToSend && p.color_image_files && p.color_image_files[variant.color_name]) {
                    fileToSend = p.color_image_files[variant.color_name];
                }

                if (fileToSend) {
                  varFormData.append("color_image_file", fileToSend);
                }

                try {
                  await api.post('/product-variations/', varFormData, {
                    headers: { "Authorization": `Bearer ${token}` }
                  });
                  console.log(`    ✅ Variation saved: ${variant.color_name} ${variant.size_value || 'Standard'}`);
                } catch (varErr) {
                  console.warn(`    ⚠️ Failed to save variation ${variant.color_name}:`, varErr.message);
                }
              }
            }

            successCount++;
            setAddedProducts(prev => prev.filter(item => item.id !== p.id));
          }
        } catch (productError) {
          let errorMessage = `Tatizo kwenye bidhaa "${p.name}"`;
          if (productError.response) {
            console.error("❌ [ERROR] Backend Response Status:", productError.response.status);
            console.error("❌ [ERROR] Backend Response Data:", productError.response.data);
            errorMessage = `Backend Error ${productError.response.status}:\n${JSON.stringify(productError.response.data, null, 2)}`;
          } else if (productError.request) {
            console.error("❌ [ERROR] No response from server. Request object:", productError.request);
            errorMessage = "Hakuna majibu kutoka Server. Angalia network connection.";
          } else {
            console.error("❌ [ERROR] Request setup error:", productError.message);
            errorMessage = productError.message;
          }
          errors.push({ name: p.name, error: errorMessage });
        }
      }

      if (successCount > 0) {
        let message = `✅ ${successCount} bidhaa zimehifadhiwa!`;
        if (errors.length > 0) {
          message += `\n\n⚠️ Lakini bidhaa ${errors.length} zimeshindwa.`;
          alert(message + `\n\n${errors.map(e => `- ${e.name}:\n${e.error}`).join('\n\n')}`);
        } else {
          alert(message);
        }
        if (onComplete) onComplete();
        setCurrentStep(1);
        setAttributes(initialAttributes);
        setCoverFile(null); setCoverPreview(null);
        setVideoFile(null); setVideoPreview(null);
        setGalleryFiles([]); setGalleryPreviews([]);
      } else if (errors.length > 0) {
        alert(`❌ Imeshindwa:\n\n${errors.map(e => `- ${e.name}:\n${e.error}`).join('\n\n')}`);
      }

    } catch (err) {
      console.error("🔥 [FATAL ERROR]:", err);
      alert("Hitilafu ya mfumo: " + err.message);
    } finally {
      setLoading(false);
      console.log("🏁 [PUBLISH_BTN] FINISHED PUBLISH PROCESS");
    }
  };

  return (
    <section className="product-creation-flow">
      <div className="flow-steps-header">
        {[
          { id: 1, label: "Kategoria" },
          { id: 2, label: "Media" },
          { id: 3, label: "Maelezo" }
        ].map((s) => (
          <div key={s.id} className={`step-item ${currentStep >= s.id ? "active" : ""}`}>
            <div className={`step-circle ${currentStep > s.id ? "completed" : ""}`}>
              {currentStep > s.id ? "✓" : s.id}
            </div>
            <span className="step-label">{s.label}</span>
            {s.id < 3 && <div className={`step-line ${currentStep > s.id ? "filled" : ""}`} />}
          </div>
        ))}
      </div>

      {currentStep === 1 && (
        <div className="category-selection-step">
          <div className="step-title-area">
            <h3 className="main-title">Chagua Kategoria</h3>
            <p className="sub-title">Gusa kategoria moja ili kuendelea kuweka bidhaa</p>
          </div>
          <div className="category-grid">
            {filteredStoreSubCats.map((sub) => (
              <div 
                key={sub.id}
                onClick={() => {
                  console.log(`\n🗂️ [STEP 1] SubCategory Clicked!`);
                  console.log("  - Sub ID (sub.id):", sub.id);
                  console.log("  - Category ID (sub.category):", sub.category);
                  console.log("  - Name:", sub.name);
                  
                  setAttributes({ 
                    ...attributes, 
                    sub_category_id: sub.id, 
                    category_id: sub.category 
                  });
                  setCurrentStep(2);
                }}
                className={`category-card ${attributes.sub_category_id === sub.id ? "selected" : ""}`}
              >
                <div className="category-image-container">
                  <img 
                    src={sub.image_url || speedDashboardImg} 
                    alt={sub.name} 
                  />
                </div>
                <p className="category-name">{sub.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="media-upload-step">
          <div className="step-navigation">
            <button onClick={() => setCurrentStep(1)} className="back-button"><ArrowLeft size={20} /></button>
            <h3 className="step-heading">2. Media ya {filteredStoreSubCats.find(s => s.id === attributes.sub_category_id)?.name}</h3>
          </div>
          <div className="main-media-grid">
            <div className="upload-box-main" onClick={() => coverInputRef.current.click()}>
              <div className={`upload-area cover-area ${coverPreview ? "has-content" : ""}`}>
                {coverPreview ? <img src={coverPreview} className="preview-image" /> : <div className="placeholder"><Camera size={32} /><span>Picha Kuu *</span></div>}
                <input ref={coverInputRef} type="file" hidden onChange={handleCoverChange} accept="image/*" />
              </div>
            </div>
            <div className="upload-box-main" onClick={() => videoInputRef.current.click()}>
              <div className={`upload-area video-area ${videoPreview ? "has-content" : ""}`}>
                {videoPreview ? <video src={videoPreview} className="preview-video" /> : <div className="placeholder"><PlayCircle size={32} /><span>Video Promo</span></div>}
                <input ref={videoInputRef} type="file" hidden onChange={handleVideoChange} accept="video/*" />
              </div>
            </div>
          </div>
          <div className="gallery-upload-section">
            <p className="section-title">Gallery (Max 5)</p>
            <div className="gallery-flex">
              <div onClick={() => galleryInputRef.current.click()} className="gallery-add-button">
                <Plus size={24} />
                <input ref={galleryInputRef} type="file" multiple hidden onChange={handleGalleryChange} accept="image/*" />
              </div>
              {galleryPreviews.map((url, i) => (
                <div key={i} className="gallery-item">
                  <img src={url} className="gallery-preview" />
                  <button onClick={() => removeGalleryImage(i)} className="remove-button"><X size={10} /></button>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => coverPreview ? setCurrentStep(3) : alert("Weka Picha Kuu!")} className="step-primary-button">ENDELEA →</button>
        </div>
      )}

      {currentStep === 3 && (
        <div className="attributes-step">
          <div className="step-navigation">
            <button onClick={() => setCurrentStep(2)} className="back-button"><ArrowLeft size={20} /></button>
            <h3 className="step-heading">3. Sifa za {filteredStoreSubCats.find(s => s.id === attributes.sub_category_id)?.name}</h3>
          </div>
          <div className="form-container">
            <ProductAttributes 
              attributes={attributes} 
              setAttributes={setAttributes}
              subCategoryId={attributes.sub_category_id}
              leafCategories={allLeafCategories} 
            />
            <div className="form-actions">
              <button 
                onClick={() => {
                  if (!attributes.name) return alert("Tafadhali jaza jina la bidhaa!");
                  if (attributes.is_retail && !attributes.price) {
                    return alert("Umechagua Retail, tafadhali jaza bei ya pisi moja!");
                  }
                  if (attributes.is_wholesale && (!attributes.price_tiers || attributes.price_tiers.length === 0)) {
                    return alert("Umechagua Jumla, tafadhali ongeza angalau range moja ya bei!");
                  }
                  if (attributes.is_wholesale && !attributes.moq) {
                    return alert("Tafadhali jaza Minimum Order Quantity (MOQ) kwa ajili ya mauzo ya jumla!");
                  }
                  if (!attributes.is_retail && !attributes.is_wholesale) {
                    return alert("Tafadhali chagua mfumo wa uuzaji (Retail au Wholesale)!");
                  }
                  if (!coverFile) return alert("Tafadhali weka picha kuu!");

                  const newEntry = { 
                    ...attributes, 
                    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    previewImg: coverPreview, 
                    cover_file: coverFile, 
                    video_file: videoFile, 
                    gallery_files: galleryFiles,

                    name: attributes.name.trim().toLowerCase(),
                    description: attributes.description,
                    price: attributes.price,
                    stock: attributes.stock,
                    brand_id: attributes.brand_id,
                    condition: attributes.condition,
                    
                    category_id: attributes.category_id,
                    sub_category_id: attributes.sub_category_id,
                    leaf_category_id: attributes.leaf_category_id,
                    
                    has_colors: attributes.has_colors || false,
                    enable_sizes: attributes.enable_sizes || false,
                    enable_variations: attributes.enable_variations || false,
                    colors: attributes.colors || [],                           
                    color_images: attributes.color_images || {},               
                    color_image_files: attributes.color_image_files || {},     
                    sizes: attributes.sizes || [],                             
                    size_stock: attributes.size_stock || {},                   
                    specifications: {
                        ...(attributes.specifications || {}),
                        ...(attributes.dynamic_specs || {})
                    },
                    gender: attributes.gender || [],
                    target_audience: attributes.target_audience || [],
                    warranty_months: attributes.warranty_months,
                    weight: attributes.weight,
                    dimensions: attributes.dimensions,
                    marketplace_product_name: attributes.marketplace_product_name || attributes.name,
                    marketplace_base_price: attributes.marketplace_base_price || attributes.price,
                    marketplace_main_image: attributes.marketplace_main_image,
                    marketplace_main_image_file: attributes.marketplace_main_image_file,
                    is_retail: attributes.is_retail || false,
                    is_wholesale: attributes.is_wholesale || false,
                    price_tiers: attributes.price_tiers || [],
                    moq: attributes.moq || 1,
                    total_stock_cost: attributes.total_stock_cost,
                    expected_total_profit: attributes.expected_total_profit,
                    shipping_method: attributes.shipping_method || "fixed",
                    shipping_cost: attributes.shipping_cost,
                    shipping_rate_per_km: attributes.shipping_rate_per_km,
                    shipping_base_fee: attributes.shipping_base_fee,
                    shipping_default_distance: attributes.shipping_default_distance,
                    shipping_dar_cost: attributes.shipping_dar_cost,
                    shipping_outside_dar_cost: attributes.shipping_outside_dar_cost,
                    shipping_remote_cost: attributes.shipping_remote_cost,
                    enable_pickup: attributes.enable_pickup || false,
                    store_address: attributes.store_address,
                  };

                  setAddedProducts(prev => [newEntry, ...prev]);
                  setAttributes({
                    ...initialAttributes,
                    category_id: attributes.category_id,
                    sub_category_id: attributes.sub_category_id,
                    leaf_category_id: null, 
                    brand_id: null,
                    colors: [],
                    total_stock_cost: '', 
                    expected_total_profit: '', 
                    price_tiers: [],
                    moq: '', 
                    is_retail: false,
                    target_audience: [],
                    is_wholesale: false
                  });
                  setCoverFile(null); setCoverPreview(null); 
                  setVideoFile(null); setVideoPreview(null); 
                  setGalleryFiles([]); setGalleryPreviews([]);
                  alert(`✅ ${newEntry.name} imeongezwa kwenye foleni!`);
                }}
                className="add-to-queue-button"
              >
                <PlusCircle size={20} /> HIFADHI NA ONGEZA NYINGINE
              </button>
            </div>
          </div>

          {addedProducts.length > 0 && (
            <div className="queue-section">
              <h4 className="queue-title">📦 Bidhaa Tayari ({addedProducts.length})</h4>
              <div className="queue-list">
                {addedProducts.map((prod) => (
                  <div key={prod.id} className="queue-card">
                    <div className="queue-card-info">
                      <img src={prod.previewImg} className="queue-thumb" />
                      <p className="queue-product-name">{prod.name}</p>
                    </div>
                    <button onClick={() => setAddedProducts(addedProducts.filter(p => p.id !== prod.id))} className="queue-remove-button">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleFinalPublishAll} disabled={loading || !storeId} className="publish-all-button">
                <CheckCircle size={24} /> {loading ? "INAPAKIA..." : "MALIZA NA CHAPISHA ZOTE"}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ProductCreationFlow;