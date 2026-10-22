import React from 'react';
import { 
  Edit3, CheckCircle, ArrowLeft, Camera, 
  PlayCircle, Plus, X, PlusCircle, Trash2 
} from 'lucide-react';
import api from "../axiosConfig"; // 🔥 Tumia api
import ProductAttributes from '../pages/ProductAttribute';
//import '../ProductCreationFlow.css';
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
    size_prices: {}, // 🔥 ONGEZA HII
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

        // 🔥 Hesabu bei ya chini kutoka size_prices kama kuna variations
let productPrice = parseFloat(p.price) || 0;
if (p.has_colors && p.size_prices) {
  const allPrices = [];
  Object.values(p.size_prices).forEach(colorPrices => {
    Object.values(colorPrices || {}).forEach(price => {
      const num = parseFloat(price);
      if (num > 0) allPrices.push(num);
    });
  });
  if (allPrices.length > 0) {
    productPrice = Math.min(...allPrices);
  }
}
formData.append("price", productPrice);
console.log("💰 [PRICE] Product price sent to backend:", productPrice);


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
        formData.append("size_prices", JSON.stringify(p.size_prices || {}));
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
              // === 🔥 BADILISHA HAPA (KWA KILA VARIATION) ===
// 1. Chukua size_stock na size_prices kwa rangi hii
const specificSizeStock = (p.size_stock && p.size_stock[variant.color_name]) 
            ? p.size_stock[variant.color_name] 
            : {};
const specificSizePrices = (p.size_prices && p.size_prices[variant.color_name]) 
            ? p.size_prices[variant.color_name] 
            : {};

// 2. Tuma size_stock sahihi
varFormData.append("size_stock", JSON.stringify(specificSizeStock));

// 3. Hesabu stock_quantity
const totalStockForColor = Object.values(specificSizeStock).reduce((acc, val) => acc + (Number(val) || 0), 0);
varFormData.append("stock_quantity", totalStockForColor || 0); 

// 4. 🔥 BADILISHA BEI HAPA
// Kama kuna bei maalum kwa ukubwa huu, tumia hiyo. Kama hakuna, tumia bei ya jumla.
let finalPrice = variant.price || 0; // Bei ya default
if (variant.size_value && specificSizePrices[variant.size_value] !== undefined) {
    finalPrice = specificSizePrices[variant.size_value];
} else if (Object.keys(specificSizePrices).length > 0 && !variant.size_value) {
     // Kama haina size specific lakini kuna bei za size, chukua ya kwanza (optional)
     // Kwa sasa, tunaacha tu variant.price
}

varFormData.append("price", finalPrice); 
// === 🔥 ISHIA BADILISHA HAPA ===

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
       <section className="w-full max-w-full mx-auto p-2 sm:p-4 box-border font-sans text-gray-800 min-h-screen">  
       
        {/* STEP HEADER */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 bg-gray-50 p-3 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 mb-4 sm:mb-10 overflow-x-auto">
        {[
          { id: 1, label: "Category" },
          { id: 2, label: "Media" },
          { id: 3, label: "Details" }
        ].map((s) => (
          <div
            key={s.id}
            className="flex-1 flex flex-col items-center relative z-10 min-w-[70px] sm:min-w-0"
          >
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                currentStep > s.id
                  ? "bg-green-500 border-green-500 text-white"
                  : currentStep >= s.id
                  ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30"
                  : "bg-white border-gray-100 text-gray-400"
              }`}
            >
              {currentStep > s.id ? "✓" : s.id}
            </div>
            <span
              className={`text-[9px] sm:text-[11px] font-extrabold uppercase mt-2 sm:mt-3 tracking-wide text-center ${
                currentStep >= s.id ? "text-orange-500" : "text-gray-500"
              }`}
            >
              {s.label}
            </span>
            {s.id < 3 && (
              <div
                className={`hidden sm:block absolute top-5 left-1/2 w-full h-0.5 -z-10 ${
                  currentStep > s.id ? "bg-orange-500" : "bg-gray-100"
                }`}
              />
            )}
          </div>
        ))}
      </div>

 {/* STEP 1: CATEGORY */}
      {currentStep === 1 && (
        <div className="w-full">
          <div className="text-center mb-4 sm:mb-8">
            <h3 className="text-lg sm:text-2xl font-black mb-1 sm:mb-2">Select Category</h3>
            <p className="text-gray-500 text-xs sm:text-sm">
              Click one category to continue adding products
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
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
                className={`bg-white p-2 sm:p-4 rounded-2xl sm:rounded-3xl border-2 flex flex-col items-center cursor-pointer transition-all duration-300 shadow-sm hover:-translate-y-1 hover:shadow-md active:scale-[0.98] ${
                  attributes.sub_category_id === sub.id
                    ? "border-orange-500 bg-orange-50"
                    : "border-transparent hover:border-orange-100"
                }`}
              >
                <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2 sm:mb-3 border-2 sm:border-4 border-white shadow-inner">
                  <img
                    src={sub.image_url || speedDashboardImg}
                    alt={sub.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[10px] sm:text-xs font-extrabold uppercase text-gray-800 text-center">
                  {sub.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}


       {/* STEP 2: MEDIA */}
      {currentStep === 2 && (
        <div className="w-full">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
            <button
              onClick={() => setCurrentStep(1)}
              className="bg-gray-50 border-none p-2 rounded-full cursor-pointer hover:bg-gray-100 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </button>
            <h3 className="text-sm sm:text-lg font-bold">
              2. Media for {filteredStoreSubCats.find(s => s.id === attributes.sub_category_id)?.name}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Cover upload */}
            <div onClick={() => coverInputRef.current.click()}>
              <div
                className={`h-40 sm:h-52 border-2 border-dashed rounded-2xl sm:rounded-3xl flex items-center justify-center cursor-pointer bg-gray-50 overflow-hidden relative transition-colors hover:border-orange-500 ${
                  coverPreview ? "border-solid border-gray-200" : "border-gray-100"
                }`}
              >
                {coverPreview ? (
                  <img src={coverPreview} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-500">
                    <Camera size={24} className="mx-auto sm:w-8 sm:h-8" />
                    <span className="block text-[10px] sm:text-xs font-bold mt-1 sm:mt-2">Main Image *</span>
                  </div>
                )}
                <input ref={coverInputRef} type="file" hidden onChange={handleCoverChange} accept="image/*" />
              </div>
            </div>

            {/* Video upload */}
            <div onClick={() => videoInputRef.current.click()}>
              <div
                className={`h-40 sm:h-52 border-2 border-dashed rounded-2xl sm:rounded-3xl flex items-center justify-center cursor-pointer bg-gray-50 overflow-hidden relative transition-colors hover:border-orange-500 ${
                  videoPreview ? "border-solid border-gray-200" : "border-gray-100"
                }`}
              >
                {videoPreview ? (
                  <video src={videoPreview} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-500">
                    <PlayCircle size={24} className="mx-auto sm:w-8 sm:h-8" />
                    <span className="block text-[10px] sm:text-xs font-bold mt-1 sm:mt-2">Promo Video</span>
                  </div>
                )}
                <input ref={videoInputRef} type="file" hidden onChange={handleVideoChange} accept="video/*" />
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="mt-3 sm:mt-6 bg-gray-50 p-3 sm:p-6 rounded-2xl sm:rounded-3xl">
            <p className="text-xs sm:text-sm font-bold mb-2 sm:mb-3">Gallery (Max 5)</p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <div
                onClick={() => galleryInputRef.current.click()}
                className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-dashed border-gray-400 rounded-lg sm:rounded-2xl flex items-center justify-center text-gray-500 cursor-pointer hover:border-orange-500 transition-colors"
              >
                <Plus size={18} className="sm:w-6 sm:h-6" />
                <input ref={galleryInputRef} type="file" multiple hidden onChange={handleGalleryChange} accept="image/*" />
              </div>
              {galleryPreviews.map((url, i) => (
                <div key={i} className="relative w-12 h-12 sm:w-16 sm:h-16">
                  <img src={url} className="w-full h-full rounded-lg sm:rounded-2xl object-cover" />
                  <button
                    onClick={() => removeGalleryImage(i)}
                    className="absolute -top-1 -right-1 bg-white text-red-500 rounded-full p-0.5 shadow border-none cursor-pointer min-w-[18px] min-h-[18px] flex items-center justify-center"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => coverPreview ? setCurrentStep(3) : alert("Weka Picha Kuu!")}
            className="w-full mt-4 sm:mt-8 py-3 sm:py-5 px-4 bg-orange-500 text-white border-none rounded-2xl font-black text-sm sm:text-base cursor-pointer shadow-lg shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.98] transition-all"
          >
            CONTINUE →
          </button>
        </div>
      )}

      
         {/* ===== STEP 3: DETAILS ===== */}
      {currentStep === 3 && (
        <div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
            <button
              onClick={() => setCurrentStep(2)}
              className="min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center bg-gray-50 dark:bg-slate-800 rounded-full cursor-pointer border-none text-gray-800 dark:text-slate-200 [-webkit-tap-highlight-color:transparent] active:scale-95 transition-transform"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </button>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 dark:text-slate-200">
              3. Details for {filteredStoreSubCats.find(s => s.id === attributes.sub_category_id)?.name}
            </h3>
          </div>

          <div className="w-full max-w-full">
            <ProductAttributes
              attributes={attributes}
              setAttributes={setAttributes}
              subCategoryId={attributes.sub_category_id}
              leafCategories={allLeafCategories}
            />
            <div className="mt-4 sm:mt-6">
              <button
                onClick={() => {
                  if (!attributes.name) return alert("Please fill in the product name!");

                  if (attributes.is_retail) {
                    if (attributes.has_colors) {
                      const colorPrices = attributes.size_prices || {};
                      const hasAnyPrice = Object.values(colorPrices).some(prices =>
                        Object.values(prices || {}).some(p => Number(p) > 0)
                      );
                      if (!hasAnyPrice) {
                        return alert("Please add prices for at least one size in SECTION 9!");
                      }
                    } else {
                      if (!attributes.price) {
                        return alert("Please add a retail price!");
                      }
                    }
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
                    size_prices: attributes.size_prices || {},
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
                className="w-full p-3 sm:p-4 bg-orange-50 dark:bg-slate-700 text-orange-500 dark:text-orange-500 border-2 border-dashed border-orange-200 dark:border-slate-600 rounded-2xl sm:rounded-[1.25rem] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer [-webkit-tap-highlight-color:transparent] active:scale-[0.98] transition-transform"
              >
                <PlusCircle size={18} className="sm:w-5 sm:h-5" /> SAVE AND ADD ANOTHER
              </button>
            </div>
          </div>

          {/* ===== QUEUE ===== */}
          {addedProducts.length > 0 && (
            <div className="mt-6 sm:mt-8 md:mt-12 border-t-2 border-dashed border-gray-100 dark:border-slate-700 pt-4 sm:pt-6 md:pt-8 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <h4 className="text-xs sm:text-sm font-black uppercase mb-3 sm:mb-4 text-gray-800 dark:text-slate-200">
                📦 Products Ready ({addedProducts.length})
              </h4>
              <div>
                {addedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-[1.25rem] flex justify-between items-center mb-2 sm:mb-3"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                      <img
                        src={prod.previewImg}
                        className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl object-cover"
                      />
                      <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-slate-200">
                        {prod.name}
                      </p>
                    </div>
                    <button
                      onClick={() => setAddedProducts(addedProducts.filter(p => p.id !== prod.id))}
                      className="min-w-[32px] min-h-[32px] flex items-center justify-center bg-transparent border-none cursor-pointer text-red-500 [-webkit-tap-highlight-color:transparent] active:scale-90 transition-transform"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleFinalPublishAll}
                disabled={loading || !storeId}
                className="w-full mt-4 sm:mt-6 p-3 sm:p-4 md:p-6 bg-green-500 hover:bg-green-600 disabled:opacity-70 disabled:cursor-not-allowed text-white border-none rounded-2xl sm:rounded-[1.5rem] font-black text-sm sm:text-base flex items-center justify-center gap-2 sm:gap-3 cursor-pointer shadow-[0_10px_20px_rgba(34,197,94,0.2)] [-webkit-tap-highlight-color:transparent] active:scale-[0.98] transition-all duration-200"
              >
                <CheckCircle size={20} className="sm:w-6 sm:h-6" />
                {loading ? "LOADING..." : "FINISH AND PUBLISH ALL"}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ProductCreationFlow;