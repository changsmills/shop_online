import React from 'react';
import { 
  Edit3, CheckCircle, ArrowLeft, Camera, 
  PlayCircle, Plus, X, PlusCircle, Trash2 
} from 'lucide-react';
import { supabase } from "../supabaseClient"; 
import ProductAttributes from '../pages/ProductAttribute';
import '../ProductCreationFlow.css';
import speedDashboardImg from "../images/SpeedDashboard.svg";

const ProductCreationFlow = ({ 
  storeId,      
  myStoreSubCats,   
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false); 

 const initialAttributes = {
    name: '', 
    price: '', 
    stock: '', 
    description: '', 
    category_id: '', 
    brand_id: '', 
    specifications: [],
    total_stock_cost: '',        // Iweke tupu '' au 0
    expected_total_profit: '',   // Iweke tupu '' au 0
    is_retail: false,
    is_wholesale: false,
    price_tiers: [],
    target_audience: [], // Hapa itahifadhi mfano: ['Watoto', 'Vijana']
    available_sizes: [], // Hakikisha huu mstari upo hapa pia
    moq: '' // Ongeza hii hapa              // Hii itakaa array ya vitu kama [{from_qty:.., unit_price:..}]
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

  const selectedCategory = myStoreSubCats?.find(cat => cat.id === attributes.category_id);

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

const handleFinalPublishAll = async () => {
  console.log("🚀 Starting publish process...");
  console.log("Added products:", addedProducts.length);
  
  if (addedProducts.length === 0) return alert("Hakuna bidhaa ya kurusha!");
  
  // VALIDATION KAMILI KABLA YA KUANZA
  for (const p of addedProducts) {
    console.log(`\n📦 Validating product: ${p.name}`);
    
    if (!p.name) return alert(`Bidhaa "${p.name || 'Unknown'}" haina jina!`);
    if (!p.price && p.is_retail) return alert(`Bidhaa "${p.name}" inahitaji bei kwa Retail!`);
    if (p.is_wholesale && (!p.price_tiers || p.price_tiers.length === 0)) {
      return alert(`Bidhaa "${p.name}" imechagua Wholesale lakini haina price tiers!`);
    }
    
    // KAMA BIDHAA INA RANGI (has_colors = true)
    if (p.has_colors && p.colors && p.colors.length > 0) {
      for (const color of p.colors) {
        const colorStock = p.size_stock?.[color] || {};
        const totalStockForColor = Object.values(colorStock).reduce((sum, val) => sum + (Number(val) || 0), 0);
        console.log(`  - Color: ${color}, Total Stock: ${totalStockForColor}`);
        
        // Angalia picha kwa rangi hii (lazima iwepo)
        if (!p.color_images?.[color] && !p.color_image_files?.[color]) {
          return alert(`Rangi ${color.toUpperCase()} kwenye bidhaa "${p.name}" haina picha! Tafadhali weka picha kwa rangi hii.`);
        }
      }
    }
    
    // KAMA BIDHAA HINA RANGI LAKINI INA SIZES
    if (!p.has_colors && p.enable_sizes && p.sizes?.length > 0) {
      for (const size of p.sizes) {
        const stock = p.size_stock?.[size] || 0;
        console.log(`  - Size: ${size}, Stock: ${stock}`);
      }
    }
  }

  setLoading(true);
  
  try {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;
    if (!user) throw new Error("Session imeisha. Tafadhali login tena.");

    const { data: stData } = await supabase.from('stores_engine')
      .select('category_id')
      .eq('id', storeId)
      .single();

    const storeParentCategoryId = stData?.category_id;
    if (!storeParentCategoryId) throw new Error("Imeshindwa kupata kategoria kuu.");

    let successCount = 0;
    const errors = [];

    for (const p of addedProducts) {
      try {
        console.log(`\n📝 Processing product: ${p.name}`);
        const productPath = `${p.category_id}/${storeId}`;

        // 1. Upload Cover Image
        let finalCoverUrl = null;
        if (p.cover_file) {
          finalCoverUrl = await uploadFile(p.cover_file, productPath, "product-images");
          console.log(`  ✓ Cover image uploaded`);
        }

        // 2. Upload Gallery
        const finalGalleryUrls = [];
        if (p.gallery_files && p.gallery_files.length > 0) {
          for (const item of p.gallery_files) {
            const url = await uploadFile(item, productPath, "product-images");
            if (url) finalGalleryUrls.push(url);
          }
          console.log(`  ✓ Gallery images: ${finalGalleryUrls.length}`);
        }

        // 3. Upload Video
        let finalVideoUrl = null;
        if (p.video_file) {
          finalVideoUrl = await uploadFile(p.video_file, productPath, "product-videos");
          console.log(`  ✓ Video uploaded`);
        }

        // 4. PREPARE GENERAL SPECIFICATIONS
        const generalSpecifications = {};
        
        if (p.brand_id) generalSpecifications.brand_id = p.brand_id;
        if (p.gender && p.gender.length > 0) generalSpecifications.gender = p.gender;
        if (p.target_audience && p.target_audience.length > 0) generalSpecifications.target_audience = p.target_audience;
        if (p.description) generalSpecifications.description = p.description;
        if (p.specifications) Object.assign(generalSpecifications, p.specifications);
        
        console.log("  📋 General specifications:", generalSpecifications);

        // 5. Calculate total stock based on product type
        let totalStock = 0;
        
        if (p.has_colors && p.colors?.length > 0) {
          for (const color of p.colors) {
            const colorStock = p.size_stock?.[color] || {};
            totalStock += Object.values(colorStock).reduce((sum, val) => sum + (Number(val) || 0), 0);
          }
        } else if (p.enable_sizes && p.sizes?.length > 0) {
          totalStock = Object.values(p.size_stock || {}).reduce((acc, val) => acc + (Number(val) || 0), 0);
        } else {
          totalStock = parseInt(p.marketplace_stock) || parseInt(p.product_stock) || parseInt(p.stock) || 0;
        }
        
        console.log(`  📊 Total stock calculated: ${totalStock}`);

        // 6. Insert into products_engines
        const productData = {
          user_id: user.id,
          store_id: storeId,
          name: p.name,
          sku: p.barcode || `${p.name.substring(0,3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
          price: parseFloat(p.marketplace_base_price) || parseFloat(p.price) || 0,
          original_price: parseFloat(p.compare_at_price) || 0,
          cover_image: finalCoverUrl || (finalGalleryUrls.length > 0 ? finalGalleryUrls[0] : null),
          category_id: p.category_id,
          leaf_category_id: p.leaf_category_id || null,
          parent_category_id: storeParentCategoryId,
          brand_id: p.brand_id || null,
          stock_quantity: totalStock,
          description: p.description || "",
          specifications: generalSpecifications,
          colors: p.colors || [],
          total_stock_cost: parseFloat(p.total_stock_cost) || 0,
          expected_total_profit: parseFloat(p.expected_total_profit) || 0,
          price_tiers: p.is_wholesale ? p.price_tiers : null,
          moq: parseInt(p.moq) || 1,
          is_wholesale: p.is_wholesale || false,
          is_retail: p.is_retail || false,
          available_sizes: p.sizes || [], 
          size_stock: p.size_stock || {},
          target_audience: p.target_audience || [],
          shipping_method: p.shipping_method || "fixed",
          shipping_cost: parseFloat(p.shipping_cost) || 0,
          shipping_rate_per_km: parseFloat(p.shipping_rate_per_km) || 0,
          shipping_base_fee: parseFloat(p.shipping_base_fee) || 0,
          shipping_default_distance: parseFloat(p.shipping_default_distance) || 0,
          shipping_dar_cost: parseFloat(p.shipping_dar_cost) || 0,
          shipping_outside_dar_cost: parseFloat(p.shipping_outside_dar_cost) || 0,
          shipping_remote_cost: parseFloat(p.shipping_remote_cost) || 0,
          enable_pickup: p.enable_pickup || false,
          store_address: p.store_address || "",
          has_colors: p.has_colors || false,
          enable_sizes: p.enable_sizes || false,
          is_approved: false,
          created_at: new Date().toISOString()
        };

        console.log("  Product data prepared:", {
          name: productData.name,
          has_colors: productData.has_colors,
          enable_sizes: productData.enable_sizes,
          sizes: productData.available_sizes,
          size_stock: productData.size_stock,
          totalStock: productData.stock_quantity
        });

        const { data: engineData, error: engineError } = await supabase
          .from('products_engines')
          .insert([productData])
          .select('id')
          .single();

        if (engineError) throw engineError;
        console.log(`  ✅ Product inserted with ID: ${engineData.id}`);

        // 7. Insert Media Gallery
        const mediaPayload = [];
        if (finalVideoUrl) {
          mediaPayload.push({ 
            product_id: engineData.id, 
            media_type: 'video', 
            media_url: finalVideoUrl, 
            display_order: 0 
          });
        }

        const uniqueGalleryUrls = finalGalleryUrls.filter(url => url !== finalCoverUrl);
        uniqueGalleryUrls.forEach((url, i) => {
          mediaPayload.push({ 
            product_id: engineData.id, 
            media_type: 'image', 
            media_url: url, 
            display_order: i + 1 
          });
        });

        if (mediaPayload.length > 0) {
          const { error: mediaError } = await supabase.from('product_media').insert(mediaPayload);
          if (mediaError) console.error("  ⚠️ Media error:", mediaError.message);
          else console.log(`  ✓ Media inserted: ${mediaPayload.length} items`);
        }

        // ============================================================
        // 8. INSERT VARIATIONS (Kwa bidhaa zenye rangi)
        // 🔥 MUUNDO MPYA: Kila rangi iwe ROW MOJA TU, size_stock iwe JSONB
        // ============================================================
        if (p.has_colors && p.colors && p.colors.length > 0) {
          const variationsToInsert = [];
          
          for (const color of p.colors) {
            const colorStock = p.size_stock?.[color] || {};
            const colorImage = p.color_images?.[color] || null;
            const colorImageFile = p.color_image_files?.[color] || null;
            
            let finalColorImageUrl = colorImage;
            
            // Upload color image if it's a File object
            if (colorImageFile instanceof File) {
              const colorPath = `colors/${engineData.id}`;
              finalColorImageUrl = await uploadFile(colorImageFile, colorPath, "product-variants");
              console.log(`    ✓ Color ${color} image uploaded`);
            }
            
            // 🔥 MUHIMU: Kila rangi iwe ROW MOJA TU (sio kwa kila size)
            const variationSku = `${engineData.id.slice(0,8)}-${color.replace('#', '')}`;
            
            // Calculate total stock from all sizes
            const totalStockForColor = Object.values(colorStock).reduce((sum, val) => sum + (Number(val) || 0), 0);
            
            // Leaf category specifications
            let leafSpecifications = { ...(p.specifications || {}) };
            leafSpecifications.color = color;
            leafSpecifications.sizes = Object.keys(colorStock);
            leafSpecifications.size_stock = colorStock;
            
            // Remove empty values
            Object.keys(leafSpecifications).forEach(key => {
              if (!leafSpecifications[key] || 
                  (Array.isArray(leafSpecifications[key]) && leafSpecifications[key].length === 0)) {
                delete leafSpecifications[key];
              }
            });
            
            // 🔥 ROW MOJA TU kwa rangi hii
            variationsToInsert.push({
              product_id: engineData.id,
              color_name: color,
              size_value: null,  // NULL kwa sababu sizes ziko kwenye size_stock
              stock_quantity: totalStockForColor,
              price: parseFloat(p.marketplace_base_price) || parseFloat(p.price) || 0,
              color_image: finalColorImageUrl,
              sku: variationSku,
              attributes: leafSpecifications,
              size_stock: colorStock,  // 🔥 Column mpya - sizes zote kwa JSONB
              variant_specifications: {
                color: color,
                color_name: color,
                size_value: null,
                sku: variationSku,
                size_stock: colorStock
              },
              variant_images_array: finalColorImageUrl ? [finalColorImageUrl] : []
            });
          }
          
          if (variationsToInsert.length > 0) {
            // Kwanza futa variations za zamani kwa product hii (kuepuka duplicate key error)
            const { error: deleteError } = await supabase
              .from('product_variations')
              .delete()
              .eq('product_id', engineData.id);
            
            if (deleteError) {
              console.error("  ⚠️ Delete error:", deleteError.message);
            } else {
              console.log(`  ✓ Deleted old variations for product ${engineData.id}`);
            }
            
            // Kisha ingiza mpya
            const { error: varError } = await supabase
              .from('product_variations')
              .insert(variationsToInsert);
              
            if (varError) throw new Error(`Failed to insert variations: ${varError.message}`);
            console.log(`  ✅ Variations inserted: ${variationsToInsert.length} colors (each with size_stock in JSONB)`);
          }
        } 
        // ============================================================
        // 9. Kwa bidhaa zisizo na rangi (size stock already saved in products_engines)
        // ============================================================
        else if (p.enable_sizes && p.sizes?.length > 0) {
          // Kwa bidhaa zisizo na rangi, hakuna haja ya kuingiza kwenye product_variations
          // size_stock tayari imehifadhiwa kwenye products_engines.size_stock
          console.log("  ℹ️ No color variations needed (size-only product) - size_stock saved in products_engines");
        }
        else {
          console.log("  ℹ️ No variations needed (single product)");
        }

        successCount++;
        setAddedProducts(prev => prev.filter(item => item.id !== p.id));
        
      } catch (productError) {
        console.error(`❌ Error kwenye bidhaa "${p.name}":`, productError.message);
        errors.push({ name: p.name, error: productError.message });
      }
    }

    if (successCount > 0) {
      alert(`✅ Hongera! Bidhaa ${successCount} zimerushwa sokoni.`);
      if (errors.length > 0) {
        console.warn("Products with errors:", errors);
        alert(`⚠️ Bidhaa ${errors.length} zimeshindwa. Angalia console kwa maelezo.`);
      }
      if (onComplete) onComplete();
      setCurrentStep(1);
      // Reset all states
      setAttributes(initialAttributes);
      setCoverFile(null); setCoverPreview(null);
      setVideoFile(null); setVideoPreview(null);
      setGalleryFiles([]); setGalleryPreviews([]);
    } else if (errors.length > 0) {
      alert(`❌ Imeshindwa: ${errors[0].error}`);
    }

  } catch (err) {
    console.error("Fatal error:", err);
    alert("Hitilafu: " + err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <section className="product-creation-flow">
      {/* --- HEADER YA STEPS --- */}
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

      {/* --- STEP 1: CATEGORY SELECTION --- */}
      {currentStep === 1 && (
        <div className="category-selection-step">
          <div className="step-title-area">
            <h3 className="main-title">Chagua Kategoria</h3>
            <p className="sub-title">Gusa kategoria moja ili kuendelea kuweka bidhaa</p>
          </div>
          <div className="category-grid">
            {myStoreSubCats?.map((sub) => (
              <div 
                key={sub.id}
                onClick={() => {
                  setAttributes({ ...attributes, category_id: sub.id });
                  setCurrentStep(2);
                }}
                className={`category-card ${attributes.category_id === sub.id ? "selected" : ""}`}
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

      {/* --- STEP 2: MEDIA --- */}
      {currentStep === 2 && (
        <div className="media-upload-step">
          <div className="step-navigation">
            <button onClick={() => setCurrentStep(1)} className="back-button"><ArrowLeft size={20} /></button>
            <h3 className="step-heading">2. Media ya {selectedCategory?.name}</h3>
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

      {/* --- STEP 3: ATTRIBUTES & PUBLISH --- */}
      {currentStep === 3 && (
        <div className="attributes-step">
          <div className="step-navigation">
            <button onClick={() => setCurrentStep(2)} className="back-button"><ArrowLeft size={20} /></button>
            <h3 className="step-heading">3. Sifa za {selectedCategory?.name}</h3>
          </div>
          <div className="form-container">
            <ProductAttributes 
              attributes={attributes} 
              setAttributes={setAttributes}
              subCategoryId={attributes.category_id} 
            />
            <div className="form-actions">
              <button 
                onClick={() => {
                  // 1. VALIDATION ILIYOBOREKA
    if (!attributes.name) return alert("Tafadhali jaza jina la bidhaa!");

    // Kama ni Retail, lazima bei ya pisi moja iwepo
    if (attributes.is_retail && !attributes.price) {
      return alert("Umechagua Retail, tafadhali jaza bei ya pisi moja!");
    }

    // Kama ni Wholesale pekee, hakikisha ameweka angalau tier moja
    if (attributes.is_wholesale && (!attributes.price_tiers || attributes.price_tiers.length === 0)) {
      return alert("Umechagua Jumla, tafadhali ongeza angalau range moja ya bei!");
    }
    
// Ndani ya validation kabla ya ku-entry
if (attributes.is_wholesale && !attributes.moq) {
  return alert("Tafadhali jaza Minimum Order Quantity (MOQ) kwa ajili ya mauzo ya jumla!");
}

    // Kama hajachagua mfumo wowote wa uuzaji
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

    // ========== MUUNDO MPYA (SAHIHI) ==========
    
    // Basic info
    name: attributes.name.trim().toLowerCase(),
    description: attributes.description,
    price: attributes.price,
    stock: attributes.stock,
    brand_id: attributes.brand_id,
    leaf_category_id: attributes.leaf_category_id,
    condition: attributes.condition,
    
    // Flags
    has_colors: attributes.has_colors || false,
    enable_sizes: attributes.enable_sizes || false,
    enable_variations: attributes.enable_variations || false,
    
    // Colors and their images (kwa bidhaa zenye rangi)
    colors: attributes.colors || [],                           // Array ya rangi: ["#2563eb", "#ef4444"]
    color_images: attributes.color_images || {},               // { "#2563eb": "url", "#ef4444": "url" }
    color_image_files: attributes.color_image_files || {},     // { "#2563eb": File, "#ef4444": File }
    
    // Sizes and stock (MUUNDO MPYA)
    sizes: attributes.sizes || [],                             // Array ya ukubwa: ["XS", "S", "M", "L", "XL"]
    size_stock: attributes.size_stock || {},                   // MUHIMU: { "#2563eb": { "XL": 10, "L": 5 } } au { "XL": 10, "L": 5 }
    
    // Specifications
    specifications: {
        ...(attributes.specifications || {}),
        ...(attributes.dynamic_specs || {})
    },
    
    // Gender & Age
    gender: attributes.gender || [],
    target_audience: attributes.target_audience || [],
    
    // Warranty, Weight, Dimensions
    warranty_months: attributes.warranty_months,
    weight: attributes.weight,
    dimensions: attributes.dimensions,
    
    // Marketplace
    marketplace_product_name: attributes.marketplace_product_name || attributes.name,
    marketplace_base_price: attributes.marketplace_base_price || attributes.price,
    marketplace_main_image: attributes.marketplace_main_image,
    marketplace_main_image_file: attributes.marketplace_main_image_file,
    
    // Sales mode
    is_retail: attributes.is_retail || false,
    is_wholesale: attributes.is_wholesale || false,
    price_tiers: attributes.price_tiers || [],
    moq: attributes.moq || 1,
    
    // Cost & Profit
    total_stock_cost: attributes.total_stock_cost,
    expected_total_profit: attributes.expected_total_profit,
    
    // Shipping
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
    
    // OLD - Remove these if not needed
    // variations: attributes.variations || [],  // 🔥 ONDOA - HATUTUMII TENA!
    // available_sizes: attributes.available_sizes || [], // 🔥 Tumia 'sizes' badala yake
};

setAddedProducts(prev => [newEntry, ...prev]);
                  setAttributes({
                    ...initialAttributes,
                    category_id: attributes.category_id,
                    leaf_category_id: null,
                    brand_id: null,
                    colors: [],
  total_stock_cost: '', 
  expected_total_profit: '', 
  price_tiers: [],
  moq: '', 
  is_retail: false,
  target_audience: [], // Safisha hapa
  is_wholesale: false
                  });
                  setCoverFile(null); setCoverPreview(null); 
                  setVideoFile(null); setVideoPreview(null); 
                  setGalleryFiles([]); setGalleryPreviews([]);
                  setCurrentColor("#ebedf1");
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
              <button onClick={handleFinalPublishAll} disabled={loading} className="publish-all-button">
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