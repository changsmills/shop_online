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

    if (addedProducts.length === 0) return alert("No products to publish!");
  setLoading(true);

  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Session expired.");
    if (!storeId) throw new Error("Store ID missing!");

    console.log("🔍 [DEBUG] Fetching store data for parent category...");
    const storeRes = await api.get(`/stores/${storeId}/`, { headers: { Authorization: `Bearer ${token}` } });
    const parentCategoryId = formatUUID(storeRes.data.category);
    console.log("🔍 [DEBUG] Parent Category ID:", parentCategoryId);

    let successCount = 0;
    const errors = [];

    for (const p of addedProducts) {
      console.log(`\n📦 [PRODUCT] Processing: "${p.name}"`);
      console.log("  - p.sub_category_id:", p.sub_category_id);
      console.log("  - p.category_id:", p.category_id);
      console.log("  - p.leaf_category_id:", p.leaf_category_id);
      console.log("  - p.has_colors:", p.has_colors);
      console.log("  - p.colors:", p.colors);
      console.log("  - p.sizes:", p.sizes);
      console.log("  - p.size_stock:", p.size_stock);
      console.log("  - p.color_images:", p.color_images);
      console.log("  - p.color_image_files:", p.color_image_files);
      console.log("  - p.variations length:", p.variations?.length || 0);

      const subCatObj = myStoreSubCats.find(sub => sub.id === p.sub_category_id);
      let realCategoryId = subCatObj?.category || p.category_id;
      console.log("  - Real Category ID (from subcat):", realCategoryId);

      try {
        const formData = new FormData();
        // === Taarifa za msingi ===
        formData.append("store_id", storeId);
        formData.append("name", p.name);
        formData.append("price", parseFloat(p.price) || 0);
        formData.append("original_price", parseFloat(p.compare_at_price) || 0);

        // === Kategoria ===
        // 🔥 1. Tuma Subcategory (kwa field ya 'sub_category')
if (p.sub_category_id) {
    const formattedSubCatId = formatUUID(p.sub_category_id);
    if (formattedSubCatId) {
        formData.append("sub_category", formattedSubCatId);  // ✅ Sasa ni 'sub_category'!
    } else {
        console.warn("⚠️ Sub-category ID is missing or invalid!");
    }
}

// 🔥 2. Tuma Parent Category (hii ni sahihi kwa 'parent_category')
if (parentCategoryId) {
    formData.append("parent_category", parentCategoryId);
}
        
        const formattedLeafId = formatUUID(p.leaf_category_id);
        if (formattedLeafId) formData.append("leaf_category", formattedLeafId);
        else console.warn("⚠️ Leaf category ID is missing or invalid!");

        if (p.brand_id) formData.append("brand_id", p.brand_id);

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

        // === JSON fields ===
        formData.append("specifications", JSON.stringify(p.specifications || {}));
        formData.append("price_tiers", JSON.stringify(p.price_tiers || []));
        formData.append("colors", JSON.stringify(p.colors || []));
        formData.append("available_sizes", JSON.stringify(p.sizes || []));
        formData.append("size_stock", JSON.stringify(p.size_stock || {}));
        formData.append("target_audience", JSON.stringify(p.target_audience || []));
        formData.append("dimensions", JSON.stringify(p.dimensions || {}));
        formData.append("gender", JSON.stringify(p.gender || []));

        const colorImagesData = {};
        if (p.color_images) {
          Object.keys(p.color_images).forEach(color => {
            colorImagesData[color] = p.color_images[color];
          });
        }
        formData.append("color_images", JSON.stringify(colorImagesData));

        // === Marketplace fields ===
        formData.append("marketplace_price", parseFloat(p.marketplace_base_price) || 0);
        formData.append("marketplace_stock", parseInt(p.stock) || 0);
        if (p.marketplace_main_image_file) {
          formData.append("marketplace_image", p.marketplace_main_image_file);
        } else if (p.cover_file) {
          formData.append("marketplace_image", p.cover_file);
        }
        formData.append("variant_specifications", JSON.stringify(p.variant_specifications || {}));
        formData.append("variant_images_array", JSON.stringify(p.variant_images_array || []));
        formData.append("sku", p.sku || `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`);

        // === Media files ===
        if (p.cover_file) formData.append("cover_image", p.cover_file);
        else console.warn("⚠️ cover_file is missing!");
        if (p.video_file) formData.append("video_file", p.video_file);
        if (Array.isArray(p.gallery_files) && p.gallery_files.length > 0) {
          p.gallery_files.forEach(file => {
            if (file instanceof File) formData.append("gallery_images", file);
          });
        }

        console.log("📤 Sending product to /products/ with formData...");
        const response = await api.post('/products/', formData, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.status === 201) {
          const newProductId = response.data.id;
          console.log(`✅ Product created with ID: ${newProductId}`);

          if (p.variations && p.variations.length > 0) {
            console.log(`📤 Processing ${p.variations.length} variations...`);
            for (let i = 0; i < p.variations.length; i++) {
              const variant = p.variations[i];
              console.log(`\n  🟡 Variation ${i+1}:`);
              console.log("    - color_name:", variant.color_name);
              console.log("    - size_value:", variant.size_value);
              console.log("    - stock_quantity:", variant.stock_quantity);
              console.log("    - price:", variant.price);
              console.log("    - attributes:", variant.attributes);
              console.log("    - color_image_file present?", !!variant.color_image_file);
              console.log("    - p.color_image_files for this color:", p.color_image_files?.[variant.color_name]);

              const varFormData = new FormData();
              varFormData.append("product", newProductId);
              
              // 🔥 MUHIMU: Hapa ndio tunakagua kama data ipo!
              if (!variant.color_name && !variant.color_name?.trim()) {
                console.warn("⚠️ color_name is missing or empty, using 'N/A'");
                varFormData.append("color_name", "N/A");
              } else {
                varFormData.append("color_name", variant.color_name);
              }

              if (!variant.size_value && !variant.size_value?.trim()) {
                console.warn("⚠️ size_value is missing or empty, using 'N/A'");
                varFormData.append("size_value", "N/A");
              } else {
                varFormData.append("size_value", variant.size_value);
              }

              // === 🔥 BADILISHA HAPA (KWA KILA VARIATION) ===

                  // 1. Chukua tu size_stock inayolingana na rangi ya variation hii (p.size_stock[variant.color_name])
              const specificSizeStock = (p.size_stock && p.size_stock[variant.color_name]) 
                          ? p.size_stock[variant.color_name] 
                          : {};

                    // 2. Tuma size_stock sahihi kwa variation hii!
                  varFormData.append("size_stock", JSON.stringify(specificSizeStock));

                 // 3. Hesabu stock_quantity kwa rangi hii kwa kuunganisha sizes zake (Badala ya kutuma variant.stock_quantity)
                   const totalStockForColor = Object.values(specificSizeStock).reduce((acc, val) => acc + (Number(val) || 0), 0);
                       varFormData.append("stock_quantity", totalStockForColor || 0); // 📦 Hii ndiyo stock halisi kwa rangi hii!

                       // 4. Endelea na bei (hii haibadiliki)
                        varFormData.append("price", variant.price || 0);

                            // === 🔥 ISHIA BADILISHA HAPA ===
              
              if (variant.attributes) {
                varFormData.append("attributes", JSON.stringify(variant.attributes));
              } else {
                console.warn("⚠️ variant.attributes is missing, sending {}");
                varFormData.append("attributes", JSON.stringify({}));
              }

              let fileToSend = variant.color_image_file;
              if (!fileToSend && p.color_image_files && p.color_image_files[variant.color_name]) {
                fileToSend = p.color_image_files[variant.color_name];
              }
              if (fileToSend) {
                varFormData.append("color_image_file", fileToSend);
                console.log("    ✅ color_image_file attached");
              } else {
                console.warn("    ⚠️ No color_image_file for this variation");
              }

              // Marketplace fields
              varFormData.append("marketplace_price", parseFloat(variant.marketplace_price) || 0);
              varFormData.append("marketplace_stock", parseInt(variant.marketplace_stock) || 0);
              varFormData.append("variant_specifications", JSON.stringify(variant.variant_specifications || variant.attributes || {}));
              if (variant.variant_images_array && variant.variant_images_array.length > 0) {
                varFormData.append("variant_images_array", JSON.stringify(variant.variant_images_array));
              } else {
                varFormData.append("variant_images_array", JSON.stringify([]));
              }

              try {
                console.log(`    📤 Sending variation to /product-variations/...`);
                await api.post('/product-variations/', varFormData, {
                  headers: { "Authorization": `Bearer ${token}` }
                });
                console.log(`    ✅ Variation ${i+1} saved successfully!`);
              } catch (varErr) {
                console.error(`    ❌ Variation ${i+1} failed:`, varErr.response?.data || varErr.message);
                // Kama unaweza, fanya hii iwe sehemu ya errors kwa usindikaji wa mwisho
                errors.push({
                  name: `${p.name} - Variation ${i+1}`,
                  error: JSON.stringify(varErr.response?.data || varErr.message)
                });
              }
            }
          }

          successCount++;
          setAddedProducts(prev => prev.filter(item => item.id !== p.id));
        }
      } catch (productError) {
        console.error(`❌ Product "${p.name}" failed:`, productError.response?.data || productError.message);
        errors.push({ name: p.name, error: JSON.stringify(productError.response?.data || productError.message) });
      }
    }

    if (successCount > 0) {

    let message = `✅ ${successCount} products saved!`;
      if (errors.length > 0) {
        message += `\n\n⚠️ But ${errors.length} failed.`;
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
      alert(`❌ Imeshindwa kabisa!\n\n${errors.map(e => `- ${e.name}:\n${e.error}`).join('\n\n')}`);
    }
  } catch (err) {
    console.error("🔥 [FATAL ERROR]:", err);
    alert("Hitilafu ya mfumo: " + err.message);
  } finally {
    setLoading(false);
  }
};
  
  return (
    <section className="product-creation-flow">
      <div className="flow-steps-header">

        {[
          { id: 1, label: "Category" },
          { id: 2, label: "Media" },
          { id: 3, label: "Details" }
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
            <h3 className="main-title">Select Category</h3>
            <p className="sub-title">Click one category to continue adding products</p>
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
            <h3 className="step-heading">2. Media for {filteredStoreSubCats.find(s => s.id === attributes.sub_category_id)?.name}</h3>          </div>
          <div className="main-media-grid">
            <div className="upload-box-main" onClick={() => coverInputRef.current.click()}>
              <div className={`upload-area cover-area ${coverPreview ? "has-content" : ""}`}>
                {coverPreview ? <img src={coverPreview} className="preview-image" /> : <div className="placeholder"><Camera size={32} /><span>Main Image *</span></div>}
                <input ref={coverInputRef} type="file" hidden onChange={handleCoverChange} accept="image/*" />
              </div>
            </div>
            <div className="upload-box-main" onClick={() => videoInputRef.current.click()}>
              <div className={`upload-area video-area ${videoPreview ? "has-content" : ""}`}>
                {videoPreview ? <video src={videoPreview} className="preview-video" /> : <div className="placeholder"><PlayCircle size={32} /><span>Promo Video</span></div>}
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
          <button onClick={() => coverPreview ? setCurrentStep(3) : alert("Weka Picha Kuu!")} className="step-primary-button">CONTINUE →</button>
        </div>
      )}

      {currentStep === 3 && (
        <div className="attributes-step">
          <div className="step-navigation">
            <button onClick={() => setCurrentStep(2)} className="back-button"><ArrowLeft size={20} /></button>
            <h3 className="step-heading">3. Details for {filteredStoreSubCats.find(s => s.id === attributes.sub_category_id)?.name}</h3>          </div>
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

                  if (!attributes.name) return alert("Please fill in the product name!");
                  if (attributes.is_retail && !attributes.price) {
                    return alert("You selected Retail, please add a unit price!");
                  }
                  if (attributes.is_wholesale && (!attributes.price_tiers || attributes.price_tiers.length === 0)) {
                    return alert("You selected Wholesale, please add at least one price range!");
                  }
                  if (attributes.is_wholesale && !attributes.moq) {
                    return alert("Please fill in the Minimum Order Quantity (MOQ) for wholesale!");
                  }
                  if (!attributes.is_retail && !attributes.is_wholesale) {
                    return alert("Please select a selling mode (Retail or Wholesale)!");
                  }
                  if (!coverFile) return alert("Please add the main image!");

                  const newEntry = { 
                    ...attributes, 
                    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    previewImg: coverPreview, 
                    cover_file: coverFile, 
                    video_file: videoFile, 
                    gallery_files: [...galleryFiles],
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
                  alert(`✅ ${newEntry.name} added to the queue!`);
                  }}
                className="add-to-queue-button"
              >
              <PlusCircle size={20} /> SAVE AND ADD ANOTHER
              </button>
            </div>
          </div>

          {addedProducts.length > 0 && (
            <div className="queue-section">
              <h4 className="queue-title">📦 Products Ready ({addedProducts.length})</h4>
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
                <CheckCircle size={24} /> {loading ? "LOADING..." : "FINISH AND PUBLISH ALL"}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ProductCreationFlow;