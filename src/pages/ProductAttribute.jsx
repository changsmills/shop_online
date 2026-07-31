import React, { useState, useEffect } from "react";
import { 
  Zap, CheckCircle2, Loader2, AlertCircle, Package, Info, Camera, 
  Plus, Trash2, Ruler, Weight, Shield, Tag, Globe, Calendar,
  Wrench, Shirt, Footprints, Smartphone, Home, ShoppingBag, Truck,
  DollarSign, Layers, Grid, Heart, Star, Award, Clock, Settings, 
  Palette  // 🔥 Ongeza hii!
} from "lucide-react";

import axios from 'axios';

//import { supabase } from "../supabaseClient";
import '../ProductAttributes.css';

function ProductAttributes({ attributes, setAttributes, subCategoryId, leafCategories = [] }) {

  const [productVariations, setProductVariations] = useState([]);
  const [currentColor, setCurrentColor] = useState("#2563eb");
  // Badala ya state, tumia props moja kwa moja:
// const leafCategories = props.leafCategories || []; // Huu ni mstari sahihi
// 🔥 Weka hii chini ya useState zako (Mstari wa 17 badala ya lile linalosababisha tatizo)

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLeaf, setSelectedLeaf] = useState(null);
  
  // Custom size input
  const [customSizeInput, setCustomSizeInput] = useState("");
  const [useCustomSizes, setUseCustomSizes] = useState(false);

  const [selectedColorName, setSelectedColorName] = useState(""); // 👈 NEW: Jina la rangi iliyochaguliwa
  const [customColorName, setCustomColorName] = useState(""); // 👈 NEW: Kwa kuandika rangi mpya
  const [showCustomColor, setShowCustomColor] = useState(false); // 👈 NEW: Kuonyesha input ya custom
  const [isMobile, setIsMobile] = useState(false);

  
  // Weight unit
  const [weightUnit, setWeightUnit] = useState("kg");

  const API_BASE_URL = "http://127.0.0.1:8000/api";


  // Ongeza useEffect
useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth <= 768);
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);

  // 1. Fetch Brands kutoka Django
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const { data } = await axios.get(`${API_BASE_URL}/brands/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // DRF inarudisha 'results' au direct array
        setBrands(data.results || data || []);
      } catch (error) {
        console.warn("⚠️ Brands endpoint haipo (404). Endelea bila brands.");
        setBrands([]);
      }
    };
    fetchBrands();
  }, []);

  // 🔥 TOA MAELEZO (COMMENT) AU Futa kabisa useEffect hili!
// Hii request imeshafanywa na ProductCreationFlow. 
// Data tayari zinapita kupitia props 'leafCategories'.

/*
  useEffect(() => {
    const fetchFilteredLeafs = async () => {
      if (!subCategoryId) {
        setLeafCategories([]);
        return;
      }

      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const { data } = await axios.get(`${API_BASE_URL}/leaf-categories/`, {
          params: { sub_category_id: subCategoryId },
          headers: { Authorization: `Bearer ${token}` }
        });
        setLeafCategories(data.results || data || []);
      } catch (error) {
        console.error("Error fetching leaf categories:", error);
        setLeafCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredLeafs();
  }, [subCategoryId]);
*/

const handleLeafChange = (e) => {
  const leafId = e.target.value;
  const leaf = leafCategories.find(l => l.id === leafId);
  
  // 🔥 FIX: Hakikisha condition_options ni array
  let conditionOptions = [];
  if (leaf && leaf.condition_options) {
    if (Array.isArray(leaf.condition_options)) {
      conditionOptions = leaf.condition_options;
    } else if (typeof leaf.condition_options === 'string') {
      try {
        const parsed = JSON.parse(leaf.condition_options);
        conditionOptions = Array.isArray(parsed) ? parsed : [leaf.condition_options];
      } catch(e) {
        conditionOptions = [leaf.condition_options];
      }
    } else {
      conditionOptions = [leaf.condition_options];
    }
  }
  
  setSelectedLeaf(leaf);
  setUseCustomSizes(false);
  setCustomSizeInput("");

  console.log("Category Selected:", leaf?.name);
  console.log("require_gender:", leaf?.require_gender);
  console.log("require_size:", leaf?.require_size);
  console.log("size_format:", leaf?.size_format);
  console.log("color_required:", leaf?.color_required);
  console.log("warranty_required:", leaf?.warranty_required);
  console.log("condition_options:", conditionOptions);

  setAttributes({ 
    ...attributes, 
    leaf_category_id: leafId, 
    specifications: {},

    // Color images storage (moja kwa rangi)
    color_images: {},
    color_image_files: {},
    
    // ========== ENABLE FLAGS (FALSE kwa default) ==========
    has_colors: false,
    enable_colors: false,
    enable_sizes: false,
    enable_gender: false,
    enable_warranty: false,
    enable_weight: false,
    enable_dimensions: false,
    enable_variations: false,
    size_stock: {},

    // ========== 🔥 MPYA: SIZE FORMAT ==========
    size_format: leaf?.size_format || 'standard',  // 🔥 MUHIMU!

    // Shipping defaults
    shipping_method: "fixed",
    shipping_cost: "",
    shipping_rate_per_km: "",
    shipping_base_fee: "",
    shipping_default_distance: "",
    shipping_dar_cost: "",
    shipping_outside_dar_cost: "",
    shipping_remote_cost: "",
    enable_pickup: false,
    store_address: "",
    
    // ========== EMPTY ARRAYS/VALUES ==========
    colors: [],
    sizes: [],
    gender: [],
    target_audience: [],
    warranty_months: '',
    weight: '',
    weight_unit: 'kg',  // 🔥 Ongeza hii
    dimensions: { length: '', width: '', height: '' },
    marketplace_listings: [],
    condition: conditionOptions.length > 0 ? conditionOptions[0] : 'new',
    custom_fields_values: {},

    // ========== 🔥 MPYA KWA MAZULIA ==========
    price_per_meter: '',   // 🔥 MUHIMU!
    price_per_foot: '',    // 🔥 MUHIMU!
  });
};

// Boresha size options kwa viatu na simu
const getSizeOptions = () => {
  if (!selectedLeaf) return [];
  
  switch(selectedLeaf.size_format) {
    case 'S-M-L-XL':
      return ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
    case 'NUMERIC-36-45':
      return Array.from({length: 10}, (_, i) => (36 + i).toString());
    case 'SHOE-UK':
      return ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"];
    case 'SHOE-EU':
      return ["EU 36", "EU 37", "EU 38", "EU 39", "EU 40", "EU 41", "EU 42", "EU 43", "EU 44", "EU 45"];
    case 'SHOE-US':
      return ["US 5", "US 6", "US 7", "US 8", "US 9", "US 10", "US 11", "US 12"];
    case 'KIDS':
      return ["2T", "3T", "4T", "5T", "6", "7", "8", "9", "10", "11", "12"];
    case 'FREE':
      return ["Free Size"];
    default:
      return [];
  }
};

  const togglePresetSize = (size) => {
    const sizes = attributes.sizes || [];
    if (sizes.includes(size)) {
      setAttributes({ ...attributes, sizes: sizes.filter(s => s !== size) });
    } else {
      setAttributes({ ...attributes, sizes: [...sizes, size] });
    }
  };

  const addCustomSize = () => {
    if (!customSizeInput.trim()) return;
    const sizes = attributes.sizes || [];
    if (!sizes.includes(customSizeInput.trim())) {
      setAttributes({ ...attributes, sizes: [...sizes, customSizeInput.trim()] });
    }
    setCustomSizeInput("");
  };

  const removeSize = (size) => {
    setAttributes({
      ...attributes,
      sizes: (attributes.sizes || []).filter(s => s !== size)
    });
  };
const addColorTag = () => {
  // 1. CHECK KAMA KATEGORIA INARUHUSU RANGI
  if (selectedLeaf?.color_required === false) {
    alert("⚠️ Kategoria hii hairuhusu rangi");
    return;
  }
  
  // 2. PATA RANGI KUTOKA SELEKTA AU CUSTOM INPUT
  let colorToAdd = selectedColorName;
  
  if (showCustomColor && customColorName.trim()) {
    colorToAdd = customColorName.trim();
    // Capitalize each word (Title Case)
    colorToAdd = colorToAdd.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  }
  
  // 3. HAKIKISHA RANGI HAIPO TAYARI
  if (!colorToAdd) {
    alert("⚠️ Tafadhali chagua au andika jina la rangi");
    return;
  }
  
  // 4. ANGALIA IKIWA TAYARI IPO KATIKA LIST
  const currentColors = attributes.colors || [];
  if (currentColors.includes(colorToAdd)) {
    alert(`❌ Rangi "${colorToAdd}" tayari imeshaongezwa!`);
    return;
  }
  
  // 5. ONGEZA RANGI MPYA
  setAttributes(prev => ({ 
    ...prev, 
    colors: [...prev.colors || [], colorToAdd]
  }));
  
  // 6. ONGEZA KWA DROPDOWN LIST (KWA MATUMIZI YA BAUDAE)
  if (!commonColors.includes(colorToAdd)) {
    setCommonColors(prev => [...prev, colorToAdd]);
  }
  
  // 7. RESET FORM
  setSelectedColorName("");
  setCustomColorName("");
  setShowCustomColor(false);
  
  // 8. ONYESHA UJUMBE WA MAFANIKIO
  alert(`✅ Rangi "${colorToAdd}" imeongezwa mafanikio!`);
  
  // 9. (OPTIONAL) AUTO-SCROLL KWENYE RANGI MPYA ILIYOONGEWA
  setTimeout(() => {
    const newColorElement = document.getElementById(`color-${colorToAdd.replace(/\s/g, '-')}`);
    if (newColorElement) {
      newColorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
};
  const removeColorTag = (colorToRemove) => {
    setAttributes({
      ...attributes,
      colors: attributes.colors.filter(c => c !== colorToRemove)
    });
  };

  {/*
// Generate variations - VERSION ILIYOREKEBISHWA KAMILI
useEffect(() => {
  // KAMA BIDHAA HINA RANGI, USIFANYE VARIATIONS!
  if (!attributes.has_colors) {
    if (productVariations.length !== 0) {
      setProductVariations([]);
      setAttributes(prev => ({ ...prev, variations: [] }));
    }
    return;
  }
  
  const selectedColors = attributes.colors || [];
  const selectedSizes = attributes.sizes || [];

  // IKIWA HAKUNA RANGI, SAFISHA VARIATIONS
  if (selectedColors.length === 0) {
    if (productVariations.length !== 0) {
      setProductVariations([]);
      setAttributes(prev => ({ ...prev, variations: [] }));
    }
    return;
  }

  // IKIWA HAKUNA SIZES, TUMIA NULL (STANDARD)
  const sizesToUse = selectedSizes.length > 0 ? selectedSizes : [null];

  const newVariations = [];

  selectedColors.forEach(color => {
    sizesToUse.forEach(size => {
      const existing = (attributes.variations || []).find(
        v => v.color_name === color && v.size_value === size
      );

      const dynamicSpecsForVariation = {};
      
      // Copy leaf category specifications
      if (attributes.specifications && Object.keys(attributes.specifications).length > 0) {
        Object.assign(dynamicSpecsForVariation, attributes.specifications);
      }
      
      // Add color and size to specs
      dynamicSpecsForVariation.color = color;
      if (size) {
        dynamicSpecsForVariation.size = size;
      }
      
      if (existing) {
        // Keep existing data (preserve stock, price, images, marketplace data)
        newVariations.push({
          ...existing,
          attributes: dynamicSpecsForVariation
        });
      } else {
        newVariations.push({
          color_name: color,
          size_value: size || null,
          stock_quantity: 0,
          price: attributes.price || 0,
          variant_image_url: "",
          color_image: "",
          image_file: null,
          marketplace_stock: 0,
          marketplace_price: attributes.price || 0,
          marketplace_image: null,
          attributes: dynamicSpecsForVariation
        });
      }
    });
  });

  // 🔥 COMPARE DEEP - Avoid unnecessary updates
  const currentStr = JSON.stringify(productVariations);
  const newStr = JSON.stringify(newVariations);
  
  if (currentStr !== newStr) {
    console.log(`📊 Updating variations: ${productVariations.length} -> ${newVariations.length}`);
    setProductVariations(newVariations);
    // Only update attributes.variations if different
    if (JSON.stringify(attributes.variations) !== newStr) {
      setAttributes(prev => ({ ...prev, variations: newVariations }));
    }
  }
  
}, [attributes.has_colors, attributes.colors, attributes.sizes, attributes.price, attributes.specifications]); */}
// 🔥 MUHIMU: Ongeza attributes.has_colors kwenye dependency!


// ============================================================
// 🔥 USEFFECT 1: GENERATE VARIATIONS (KWA RANGI NA UKUBWA)
// ============================================================
useEffect(() => {
  console.log("🔄 [VARIATIONS] Generating variations...");
  console.log("  - has_colors:", attributes.has_colors);
  console.log("  - colors:", attributes.colors);
  console.log("  - sizes:", attributes.sizes);
  console.log("  - current variations count:", productVariations.length);

  // KAMA BIDHAA HINA RANGI, USIFANYE VARIATIONS!
  if (!attributes.has_colors) {
    console.log("  ⚠️ Bidhaa haina rangi, clearing variations...");
    if (productVariations.length !== 0) {
      setProductVariations([]);
      setAttributes(prev => ({ ...prev, variations: [] }));
    }
    return;
  }
  
  const selectedColors = attributes.colors || [];
  const selectedSizes = attributes.sizes || [];

  // IKIWA HAKUNA RANGI, SAFISHA VARIATIONS
  if (selectedColors.length === 0) {
    console.log("  ⚠️ Hakuna rangi zilizochaguliwa, clearing variations...");
    if (productVariations.length !== 0) {
      setProductVariations([]);
      setAttributes(prev => ({ ...prev, variations: [] }));
    }
    return;
  }

  // IKIWA HAKUNA SIZES, TUMIA NULL (STANDARD)
  const sizesToUse = selectedSizes.length > 0 ? selectedSizes : [null];
  console.log(`  📏 Sizes to use:`, sizesToUse);

  const newVariations = [];

  selectedColors.forEach(color => {
    sizesToUse.forEach(size => {
      const existing = (attributes.variations || []).find(
        v => v.color_name === color && v.size_value === size
      );

      const dynamicSpecsForVariation = {};
      
      if (attributes.specifications && Object.keys(attributes.specifications).length > 0) {
        Object.assign(dynamicSpecsForVariation, attributes.specifications);
      }
      
      dynamicSpecsForVariation.color = color;
      if (size) {
        dynamicSpecsForVariation.size = size;
      }
      
      if (existing) {
        // Keep existing data (preserve stock, price, images, marketplace data)
        newVariations.push({
          ...existing,
          attributes: dynamicSpecsForVariation
        });
      } else {
        newVariations.push({
          color_name: color,
          size_value: size || null,
          stock_quantity: 0,
          price: attributes.price || 0,
          variant_image_url: "",
          color_image: "",
          image_file: null,
          marketplace_stock: 0,
          marketplace_price: attributes.price || 0,
          marketplace_image: null,
          attributes: dynamicSpecsForVariation
        });
      }
    });
  });

  const currentStr = JSON.stringify(productVariations);
  const newStr = JSON.stringify(newVariations);
  
  if (currentStr !== newStr) {
    console.log(`📊 Updating variations: ${productVariations.length} -> ${newVariations.length}`);
    setProductVariations(newVariations);
    
    // ✅ ONGEZA HII - Weka variations kwenye attributes
    setAttributes(prev => ({ 
      ...prev, 
      variations: newVariations,
      has_colors: newVariations.length > 0 ? true : prev.has_colors
    }));
    
    console.log(`✅ Variations saved to attributes: ${newVariations.length}`);
  } else {
    console.log(`  ℹ️ Variations unchanged: ${productVariations.length}`);
  }
  
}, [attributes.has_colors, attributes.colors, attributes.sizes, attributes.price, attributes.specifications]);
// 🔥 MUHIMU: attributes.sizes imeongezwa kwenye dependency!

// ============================================================
// 🔥 USEFFECT 2: UPDATE SIZE STOCK (KWA BIDHAA ZISIZO NA RANGI)
// ============================================================
useEffect(() => {
  // KAMA BIDHAA INA RANGI, USIFANYE CHOMBOCHOTE HAPA
  if (attributes.has_colors) return;
  
  // IKIWA SIZES ZIPO, HAKUNA HAJA YA KUUPDATE STOCK
  if (!attributes.enable_sizes || attributes.sizes.length === 0) return;
  
  // Update total stock from size_stock
  const totalStock = Object.values(attributes.size_stock || {}).reduce((acc, val) => acc + (Number(val) || 0), 0);
  if (totalStock !== Number(attributes.stock)) {
    console.log(`📊 [STOCK] Updating total stock to: ${totalStock}`);
    setAttributes(prev => ({ ...prev, stock: totalStock }));
  }
  
}, [attributes.has_colors, attributes.enable_sizes, attributes.sizes, attributes.size_stock]);

// ============================================================
// 🔥 USEFFECT 3: UPDATE TOTAL STOCK KWA BIDHAA ZENYE RANGI
// ============================================================
useEffect(() => {
  if (!attributes.has_colors) return;
  
  if (productVariations.length > 0) {
    const total = productVariations.reduce((acc, curr) => acc + (Number(curr.stock_quantity) || 0), 0);
    if (total !== Number(attributes.stock)) {
      console.log(`📊 [COLOR STOCK] Updating total stock to: ${total}`);
      setAttributes(prev => ({ ...prev, stock: total }));
    }
  }
}, [productVariations, attributes.has_colors]);

// ============================================================
// 🔥 USEFFECT 4: UPDATE TOTAL STOCK (GENERAL)
// ============================================================
useEffect(() => {
  if (productVariations.length > 0) {
    const total = productVariations.reduce((acc, curr) => acc + (Number(curr.stock_quantity) || 0), 0);
    if (total !== Number(attributes.stock)) {
      console.log(`📊 [GENERAL STOCK] Updating total stock to: ${total}`);
      setAttributes(prev => ({ ...prev, stock: total }));
    }
  }
}, [productVariations, setAttributes, attributes.stock]);


  // Helper function - Weka hii kwenye component yako (karibu na states)
const capitalizeFirstLetter = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
// Helper function - Weka karibu na states zingine
const capitalizeWords = (str) => {
  if (!str) return str;
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

// Badilisha commonColors kutoka constant array kuwa state
const [commonColors, setCommonColors] = useState([
  "Red", "Blue", "Green", "Yellow", "Purple", 
  "Black", "White", "Gray", "Orange", "Pink", 
  "Brown", "Cyan", "Magenta", "Olive", "Maroon", 
  "Navy", "Teal", "Silver", "Gold", "Khaki",
  "Lavender", "Coral", "Turquoise", "Beige", "Crimson",
  "Indigo", "Violet", "Lime", "Salmon", "Plum",
  "Peach", "Mint", "Rose", "Amber", "Ivory",
  "Charcoal", "Tan", "Rust", "Burgundy", "Forest Green",
  "Sky Blue", "Royal Blue", "Navy Blue", "Baby Blue", "Midnight Blue",
  "Olive Green", "Emerald", "Moss Green", "Neon Green", "Sea Green",
  "Golden", "Brass", "Copper", "Bronze", "Mustard",
  "Lilac", "Mauve", "Fuchsia", "Hot Pink", "Dark Red",
  "Wine", "Chocolate", "Coffee", "Cream", "Off White"
]);


// Function ya kuongeza rangi mpya kwenye commonColors list
const addNewColorToDropdown = (newColor) => {
  if (newColor && !commonColors.includes(newColor)) {
    setCommonColors(prev => [...prev, newColor]);
  }
};

  // Helper function to get icon
  const getCategoryIcon = () => {
    if (!selectedLeaf) return <Package size={18} />;
    switch(selectedLeaf.icon_name) {
      case 'shirt': return <Shirt size={18} />;
      case 'shoe': return <Footprints size={18} />;
      case 'smartphone': return <Smartphone size={18} />;
      case 'home': return <Home size={18} />;
      case 'plug': return <Zap size={18} />;
      case 'wrench': return <Wrench size={18} />;
      case 'shopping-bag': return <ShoppingBag size={18} />;
      default: return <Package size={18} />;
    }
  };
  // Price tiers functions - Ongeza hizi kwenye component yako
const addPriceTier = () => {
  const currentTiers = attributes.price_tiers || [];
  setAttributes({
    ...attributes,
    price_tiers: [...currentTiers, { from_qty: '', to_qty: '', unit_price: '' }]
  });
};

const removePriceTier = (index) => {
  const updatedTiers = (attributes.price_tiers || []).filter((_, i) => i !== index);
  setAttributes({ ...attributes, price_tiers: updatedTiers });
};

const handleTierChange = (index, field, value) => {
  const updatedTiers = [...(attributes.price_tiers || [])];
  updatedTiers[index][field] = value;
  setAttributes({ ...attributes, price_tiers: updatedTiers });
};

  return (
    <div className="product-attributes-container">
      {/* ========== SECTION 1: BASIC INFORMATION ========== */}
      <div className="form-section-header">
        <Info size={20} />
        <h3>Taarifa za Msingi</h3>
      </div>
      
      <div className="form-group">
        <label className="field-label">
          <Package size={18} /> Jina la Bidhaa <span className="required-star">*</span>
        </label>
        <input
          className="text-input"
          value={attributes.name || ""}
          onChange={(e) => setAttributes({ ...attributes, name: e.target.value })}
          placeholder="Mfano: iPhone 15 Pro, Nike Air Max, Samsung TV 55 inch"
        />
      </div>

      <div className="form-group">
        <label className="field-label">
          <Info size={18} /> Maelezo ya Bidhaa
        </label>
        <textarea
          className="text-input textarea-input"
          value={attributes.description || ""}
          onChange={(e) => setAttributes({ ...attributes, description: e.target.value })}
          placeholder="Andika maelezo ya kina kuhusu bidhaa..."
          rows={4}
        />
      </div>

      {/* ========== SECTION 2: BRAND & CATEGORY ========== */}
      <div className="form-section-header">
        <Tag size={20} />
        <h3>Brand na Aina ya Bidhaa</h3>
      </div>
      
      <div className="form-grid-two">
        <div className="form-group">
          <label className="field-label-small">Brand</label>
          <select
            className="select-input"
            value={attributes.brand_id || ""}
            onChange={(e) => setAttributes({ ...attributes, brand_id: e.target.value })}
          >
            <option value="">Chagua Brand...</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="field-label-small">Aina Maalum</label>
          <select
            className={`select-input ${!subCategoryId ? 'disabled' : ''}`}
            disabled={!subCategoryId || loading}
            value={attributes.leaf_category_id || ""}
            onChange={handleLeafChange}
          >
            {loading ? (
  <option disabled>Inapakia...</option>
) : (
  <>
    <option value="">-- Chagua Aina --</option>
    {leafCategories.map((leaf) => (
      <option key={leaf.id} value={leaf.id}>{leaf.name}</option>
    ))}
  </>
)}
          </select>
          {!subCategoryId && (
            <span className="error-hint">
              <AlertCircle size={12} /> Chagua kategoria ya juu kwanza
            </span>
          )}
        </div>
      </div>

      {/* ========== SECTION 3: DYNAMIC SPECS FROM LEAF CATEGORY ========== */}
     {/*} {selectedLeaf && selectedLeaf.specs && selectedLeaf.specs.length > 0 && (
        <>
          <div className="form-section-header">
            {getCategoryIcon()}
            <h3>Sifa za {selectedLeaf.name}</h3>
          </div>
          <div className="dynamic-specs-container">
            <div className="specs-grid">
              {selectedLeaf.specs.map((specName, idx) => {
                const cleanKey = specName.split("(")[0].trim();
                const hasOptions = specName.includes("(") && specName.includes(")");
                let label = specName;
                let options = [];

                if (hasOptions) {
                  label = specName.split("(")[0].trim();
                  const rawOptions = specName.match(/\(([^)]+)\)/)[1];
                  options = rawOptions.split("/").map((opt) => opt.trim());
                }

                // Skip size specs if handled separately
                if (label.toLowerCase().includes("size") || label.toLowerCase().includes("ukubwa")) {
                  return null;
                }

                return (
                  <div key={idx} className="spec-item">
                    <label className="spec-label">{label}</label>
                    {hasOptions ? (
                      <select
                        className="select-input"
                        value={attributes.specifications?.[cleanKey] || ""}
                        onChange={(e) => setAttributes({
                          ...attributes,
                          specifications: { ...attributes.specifications, [cleanKey]: e.target.value }
                        })}
                      >
                        <option value="">-- Chagua --</option>
                        {options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className="text-input"
                        type="text"
                        placeholder={`Weka ${label}...`}
                        value={attributes.specifications?.[cleanKey] || ""}
                        onChange={(e) => setAttributes({
                          ...attributes,
                          specifications: { ...attributes.specifications, [cleanKey]: e.target.value }
                        })}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )} *}



        {/* ========== SECTION 3: DYNAMIC SPECS FROM LEAF CATEGORY ========== */}
{selectedLeaf && selectedLeaf.specs && (
  <>
    <div className="form-section-header">
      {getCategoryIcon()}
      <h3>Sifa za {selectedLeaf.name}</h3>
    </div>
    <div className="dynamic-specs-container">
      <div className="specs-grid">
        {(() => {
          // 1. Hakikisha specs ni Array. Kama ni string, i-convert.
          let specsArray = [];
          try {
            specsArray = typeof selectedLeaf.specs === 'string' 
              ? JSON.parse(selectedLeaf.specs) 
              : selectedLeaf.specs;
          } catch (e) {
            console.error("Specs format is invalid", e);
          }

          // 2. Kama bado siyo array baada ya parse, usionyeshe chochote
          if (!Array.isArray(specsArray)) return null;

          return specsArray.map((specName, idx) => {
            const cleanKey = specName.split("(")[0].trim();
            const hasOptions = specName.includes("(") && specName.includes(")");
            let label = specName;
            let options = [];

            if (hasOptions) {
              label = specName.split("(")[0].trim();
              const rawOptions = specName.match(/\(([^)]+)\)/)[1];
              options = rawOptions.split("/").map((opt) => opt.trim());
            }

            // Skip size specs kama zinashughulikiwa kwingine
            if (label.toLowerCase().includes("size") || label.toLowerCase().includes("ukubwa")) {
              return null;
            }

            return (
              <div key={idx} className="spec-item">
                <label className="spec-label">{label}</label>
                {hasOptions ? (
                  <select
                    className="select-input"
                    value={attributes.specifications?.[cleanKey] || ""}
                    onChange={(e) => setAttributes({
                      ...attributes,
                      specifications: { ...attributes.specifications, [cleanKey]: e.target.value }
                    })}
                  >
                    <option value="">-- Chagua --</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="text-input"
                    type="text"
                    placeholder={`Weka ${label}...`}
                    value={attributes.specifications?.[cleanKey] || ""}
                    onChange={(e) => setAttributes({
                      ...attributes,
                      specifications: { ...attributes.specifications, [cleanKey]: e.target.value }
                    })}
                  />
                )}
              </div>
            );
          });
        })()}
      </div>
    </div>
  </>
)}


{/* ========== SECTION: CUSTOMIZATION CONTROLS ========== */}
{selectedLeaf && (
  <>
    <div className="form-section-header">
      <Settings size={20} />
      <h3>Vipengele vya Bidhaa (Chagua Unavyohitaji)</h3>
    </div>
    
    <div className="customization-controls" style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "12px",
      padding: "15px",
      backgroundColor: "#f8fafc",
      borderRadius: "12px",
      marginBottom: "20px"
    }}>
      
      {/* ========== 🔥 MPYA: SIZE FORMAT SELECTOR ========== */}
      <div style={{
        gridColumn: "1 / -1",  // Inachukua upana wote
        padding: "12px 15px",
        backgroundColor: "#f0fdf4",
        borderRadius: "10px",
        border: "2px solid #10b981",
        marginBottom: "5px"
      }}>
        <label className="field-label-small" style={{ 
          marginBottom: "8px", 
          display: "block", 
          fontWeight: "600",
          color: "#065f46"
        }}>
          📏 Mfumo wa Ukubwa / Vipimo
        </label>
        <select
          className="select-input"
          value={attributes.size_format || 'standard'}
          onChange={(e) => {
            const format = e.target.value;
            setAttributes({ 
              ...attributes, 
              size_format: format,
              // Reset fields when format changes
              ...(format === 'length' ? { 
                dimensions: { length: '', width: '', height: '' },
                sizes: [],
                size_stock: {}
              } : {}),
              ...(format === 'dimensions' ? { 
                price_per_meter: '', 
                price_per_foot: '',
                sizes: [],
                size_stock: {}
              } : {}),
              ...(format === 'free' ? {
                sizes: [],
                size_stock: {},
                dimensions: { length: '', width: '', height: '' },
                price_per_meter: '',
                price_per_foot: ''
              } : {}),
            });
          }}
          style={{
            backgroundColor: "white",
            border: "2px solid #10b981",
            fontWeight: "500",
            padding: "10px",
            borderRadius: "8px",
            width: "100%"
          }}
        >
          <option value="standard">📏 Kawaida (S, M, L, XL)</option>
          <option value="numeric">🔢 Nambari (36, 37, 38...)</option>
          <option value="free">📦 Hakuna Ukubwa</option>
          <option value="dimensions">📐 Vipimo (Makabati, Meza)</option>
          <option value="length">📏 Urefu (Mazulia, Vitambaa)</option>
        </select>
        <small style={{ 
          color: "#6b7280", 
          fontSize: "11px", 
          marginTop: "4px", 
          display: "block" 
        }}>
          💡 Chagua mfumo unaofaa kwa aina ya bidhaa yako
        </small>
      </div>

      {/* Gender Toggle */}
      <button
        type="button"
        onClick={() => {
          if (!attributes.enable_gender) {
            setAttributes({ ...attributes, enable_gender: true, gender: [], target_audience: [] });
          } else {
            setAttributes({ ...attributes, enable_gender: false, gender: [], target_audience: [] });
          }
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 15px",
          borderRadius: "8px",
          border: `2px solid ${attributes.enable_gender ? "#10b981" : "#cbd5e1"}`,
          backgroundColor: attributes.enable_gender ? "#d1fae5" : "white",
          cursor: "pointer"
        }}
      >
        <Heart size={18} color={attributes.enable_gender ? "#10b981" : "#64748b"} />
        <span style={{ flex: 1, textAlign: "left", fontWeight: attributes.enable_gender ? "600" : "400" }}>
          👥 Jinsia na Umri
        </span>
        {attributes.enable_gender && <CheckCircle2 size={16} color="#10b981" />}
      </button>

      {/* Warranty Toggle */}
      <button
        type="button"
        onClick={() => {
          if (!attributes.enable_warranty) {
            setAttributes({ ...attributes, enable_warranty: true, warranty_months: '' });
          } else {
            setAttributes({ ...attributes, enable_warranty: false, warranty_months: '' });
          }
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 15px",
          borderRadius: "8px",
          border: `2px solid ${attributes.enable_warranty ? "#10b981" : "#cbd5e1"}`,
          backgroundColor: attributes.enable_warranty ? "#d1fae5" : "white",
          cursor: "pointer"
        }}
      >
        <Shield size={18} color={attributes.enable_warranty ? "#10b981" : "#64748b"} />
        <span style={{ flex: 1, textAlign: "left", fontWeight: attributes.enable_warranty ? "600" : "400" }}>
          🛡️ Dhamana (Warranty)
        </span>
        {attributes.enable_warranty && <CheckCircle2 size={16} color="#10b981" />}
      </button>

      {/* Weight Toggle */}
      <button
        type="button"
        onClick={() => {
          if (!attributes.enable_weight) {
            setAttributes({ ...attributes, enable_weight: true, weight: '' });
          } else {
            setAttributes({ ...attributes, enable_weight: false, weight: '' });
          }
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 15px",
          borderRadius: "8px",
          border: `2px solid ${attributes.enable_weight ? "#10b981" : "#cbd5e1"}`,
          backgroundColor: attributes.enable_weight ? "#d1fae5" : "white",
          cursor: "pointer"
        }}
      >
        <Weight size={18} color={attributes.enable_weight ? "#10b981" : "#64748b"} />
        <span style={{ flex: 1, textAlign: "left", fontWeight: attributes.enable_weight ? "600" : "400" }}>
          ⚖️ Uzito (Weight)
        </span>
        {attributes.enable_weight && <CheckCircle2 size={16} color="#10b981" />}
      </button>

      {/* Dimensions Toggle */}
      <button
        type="button"
        onClick={() => {
          if (!attributes.enable_dimensions) {
            setAttributes({ ...attributes, enable_dimensions: true, dimensions: { length: '', width: '', height: '' } });
          } else {
            setAttributes({ ...attributes, enable_dimensions: false, dimensions: { length: '', width: '', height: '' } });
          }
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 15px",
          borderRadius: "8px",
          border: `2px solid ${attributes.enable_dimensions ? "#10b981" : "#cbd5e1"}`,
          backgroundColor: attributes.enable_dimensions ? "#d1fae5" : "white",
          cursor: "pointer"
        }}
      >
        <Ruler size={18} color={attributes.enable_dimensions ? "#10b981" : "#64748b"} />
        <span style={{ flex: 1, textAlign: "left", fontWeight: attributes.enable_dimensions ? "600" : "400" }}>
          📐 Vipimo (Dimensions)
        </span>
        {attributes.enable_dimensions && <CheckCircle2 size={16} color="#10b981" />}
      </button>

      {/* BUTTON MOJA YA RANGI NA VARIATIONS */}
      <button
        type="button"
        onClick={() => {
          if (!attributes.enable_variations) {
            setAttributes({ 
              ...attributes, 
              enable_variations: true,
              has_colors: true,
              enable_colors: true,
              colors: []
            });
          } else {
            setAttributes({ 
              ...attributes, 
              enable_variations: false,
              has_colors: false,
              enable_colors: false,
              colors: [],
              sizes: []
            });
          }
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 15px",
          borderRadius: "8px",
          border: `2px solid ${attributes.enable_variations ? "#10b981" : "#cbd5e1"}`,
          backgroundColor: attributes.enable_variations ? "#d1fae5" : "white",
          cursor: "pointer"
        }}
      >
        <Palette size={18} color={attributes.enable_variations ? "#10b981" : "#64748b"} />
        <span style={{ flex: 1, textAlign: "left", fontWeight: attributes.enable_variations ? "600" : "400" }}>
          🎨 Rangi na Ukubwa (Variations)
        </span>
        {attributes.enable_variations && <CheckCircle2 size={16} color="#10b981" />}
      </button>

    </div>
  </>
)}

{/* ========== SECTION 4: PRODUCT CONDITION ========== */}
{selectedLeaf && selectedLeaf.condition_options && 
 Array.isArray(selectedLeaf.condition_options) && 
 selectedLeaf.condition_options.length > 1 && (
  <>
    <div className="form-section-header">
      <Tag size={20} />
      <h3>Hali ya Bidhaa</h3>
    </div>
    <div className="dynamic-specs-container">
      <div className="specs-grid" style={{ padding: "15px" }}>
        <div className="spec-full-width">
          <div className="spec-buttons-group">
            {selectedLeaf.condition_options.map(cond => (
              <button
                key={cond}
                type="button"
                className={`spec-pill-button ${attributes.condition === cond ? "selected" : ""}`}
                onClick={() => setAttributes({ ...attributes, condition: cond })}
              >
                {cond === 'new' && '🆕 Mpya'}
                {cond === 'used' && '📦 Iliyotumika'}
                {cond === 'refurbished' && '🔧 Refurbished'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </>
)}

      {/* ========== SECTION 5: WARRANTY ========== */}
      {selectedLeaf && attributes.enable_warranty && (
        <>
          <div className="form-section-header">
            <Shield size={20} />
            <h3>Dhamana (Warranty)</h3>
          </div>
          <div className="dynamic-specs-container">
            <div className="specs-grid" style={{ padding: "15px" }}>
              <div className="spec-full-width">
                <select
                  className="select-input"
                  value={attributes.warranty_months || ""}
                  onChange={(e) => setAttributes({ ...attributes, warranty_months: e.target.value })}
                >
                  <option value="">Hakuna Dhamana</option>
                  <option value="3">Miezi 3</option>
                  <option value="6">Miezi 6</option>
                  <option value="12">Mwaka 1</option>
                  <option value="24">Miaka 2</option>
                  <option value="36">Miaka 3</option>
                  <option value="60">Miaka 5</option>
                </select>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========== SECTION 6: WEIGHT ========== */}
      {selectedLeaf && attributes.enable_weight && (
        <>
          <div className="form-section-header">
            <Weight size={20} />
            <h3>Uzito wa Bidhaa</h3>
          </div>
          <div className="dynamic-specs-container">
            <div className="specs-grid" style={{ padding: "15px" }}>
              <div className="spec-full-width">
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="number"
                    step="0.1"
                    className="text-input"
                    placeholder="Uzito"
                    value={attributes.weight || ""}
                    onChange={(e) => setAttributes({ ...attributes, weight: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  <select 
                    className="select-input"
                    value={weightUnit}
                    onChange={(e) => setWeightUnit(e.target.value)}
                    style={{ width: "100px" }}
                  >
                    <option value="kg">Kilogramu (kg)</option>
                    <option value="g">Gramu (g)</option>
                    <option value="lb">Pound (lb)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========== SECTION 7: DIMENSIONS ========== */}
      {selectedLeaf && attributes.enable_dimensions && (
        <>
          <div className="form-section-header">
            <Ruler size={20} />
            <h3>Vipimo vya Bidhaa</h3>
          </div>
          <div className="dynamic-specs-container">
            <div className="specs-grid" style={{ padding: "15px" }}>
              <div className="spec-full-width">
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="number"
                    step="0.1"
                    className="text-input"
                    placeholder="Urefu (cm)"
                    value={attributes.dimensions?.length || ""}
                    onChange={(e) => setAttributes({ 
                      ...attributes, 
                      dimensions: { ...attributes.dimensions, length: e.target.value }
                    })}
                  />
                  <input
                    type="number"
                    step="0.1"
                    className="text-input"
                    placeholder="Upana (cm)"
                    value={attributes.dimensions?.width || ""}
                    onChange={(e) => setAttributes({ 
                      ...attributes, 
                      dimensions: { ...attributes.dimensions, width: e.target.value }
                    })}
                  />
                  <input
                    type="number"
                    step="0.1"
                    className="text-input"
                    placeholder="Kimo (cm)"
                    value={attributes.dimensions?.height || ""}
                    onChange={(e) => setAttributes({ 
                      ...attributes, 
                      dimensions: { ...attributes.dimensions, height: e.target.value }
                    })}
                  />
                </div>
                <small style={{ color: "#6b7280", fontSize: "12px", marginTop: "8px", display: "block" }}>
                  {selectedLeaf.measurement_unit === 'metric' ? 'Sentimita (cm)' : 'Inchi (in)'}
                </small>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========== SECTION 8: GENDER & AGE ========== */}
      {selectedLeaf && attributes.enable_gender && (
        <>
          <div className="form-section-header">
            <Heart size={20} />
            <h3>Lengo la Bidhaa</h3>
          </div>
          <div className="dynamic-specs-container">
            <div className="specs-grid" style={{ padding: "15px" }}>
              <div className="spec-full-width">
                <label className="spec-label">Jinsia:</label>
                <div className="spec-buttons-group">
                  {["Male", "Female", "Unisex"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      className={`spec-pill-button ${(attributes.gender || []).includes(g) ? "selected" : ""}`}
                      onClick={() => {
                        const current = attributes.gender || [];
                        const next = current.includes(g) ? current.filter((i) => i !== g) : [...current, g];
                        setAttributes({ ...attributes, gender: next });
                      }}
                    >
                      {g === 'Male' && '👨 Wanaume'}
                      {g === 'Female' && '👩 Wanawake'}
                      {g === 'Unisex' && '👥 Wote'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="spec-full-width" style={{ marginTop: "15px" }}>
                <label className="spec-label">Kikundi cha Umri:</label>
                <div className="spec-buttons-group">
                  {["Kids", "Youth", "Adults", "All"].map((a) => (
                    <button
                      key={a}
                      type="button"
                      className={`spec-pill-button ${(attributes.target_audience || []).includes(a) ? "selected" : ""}`}
                      onClick={() => {
                        const current = attributes.target_audience || [];
                        const next = current.includes(a) ? current.filter((i) => i !== a) : [...current, a];
                        setAttributes({ ...attributes, target_audience: next });
                      }}
                    >
                      {a === 'Kids' && '🧒 Watoto'}
                      {a === 'Youth' && '🧑 Vijana'}
                      {a === 'Adults' && '👨‍🦱 Watu Wazima'}
                      {a === 'All' && '👨‍👩‍👧‍👦 Wote'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
{/* ========== SECTION 9: SIZE SELECTION WITH STOCK (KWA KILA RANGI) ========== */}
{selectedLeaf && attributes.enable_variations && (
  <>
    <div className="form-section-header">
      <Palette size={20} />
      <h3>Rangi na Ukubwa (Sizes) - Kila Rangi ina Ukubwa na Stock Zake</h3>
    </div>
    <div className="dynamic-specs-container">
      <div className="specs-grid" style={{ padding: "15px" }}>
        <div className="spec-full-width">
          
{/* ========== SEHEMU YA KUONGEZA RANGI ========== */}
<div style={{
  backgroundColor: "#f8fafc",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "20px",
  border: "1px solid #e2e8f0"
}}>
  <label className="spec-label" style={{ marginBottom: "8px", display: "block", fontWeight: "600" }}>
    🎨 Ongeza Rangi Mpya
  </label>
  
  {/* BUTTON MBILI: Chagua kutoka list AU Andika mwenyewe */}
  <div style={{ display: "flex", gap: "10px", marginBottom: "15px", flexWrap: "wrap" }}>
    <button
      type="button"
      onClick={() => {
        setShowCustomColor(false);
        setCustomColorName("");
      }}
      style={{
        flex: 1,
        padding: "10px",
        backgroundColor: !showCustomColor ? "#3b82f6" : "#e2e8f0",
        color: !showCustomColor ? "white" : "#475569",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "500"
      }}
    >
      📋 Chagua kutoka list
    </button>
    <button
      type="button"
      onClick={() => {
        setShowCustomColor(true);
        setSelectedColorName("");
      }}
      style={{
        flex: 1,
        padding: "10px",
        backgroundColor: showCustomColor ? "#10b981" : "#e2e8f0",
        color: showCustomColor ? "white" : "#475569",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "500"
      }}
    >
      ✏️ Andika rangi yangu
    </button>
  </div>
  
  {/* KAMA HAKUJA CHAGUA "ANDIKA MWENYEWE" - ONYESHA DROPDOWN */}
  {!showCustomColor && (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
      <select
        value={selectedColorName}
        onChange={(e) => setSelectedColorName(e.target.value)}
        style={{
          flex: 2,
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #cbd5e1",
          fontSize: "14px",
          backgroundColor: "white"
        }}
      >
        <option value="">-- Chagua jina la rangi --</option>
        {commonColors.slice(0, 30).map(color => (
          <option key={color} value={color}>{color}</option>
        ))}
        {commonColors.length > 30 && (
          <option disabled>--- na rangi {commonColors.length - 30} zaidi ---</option>
        )}
      </select>
      
      <input 
        type="color" 
        value={currentColor} 
        onChange={(e) => setCurrentColor(e.target.value)}
        style={{ width: "50px", height: "45px", border: "1px solid #ccc", borderRadius: "8px", cursor: "pointer" }}
      />
      
      <button
        type="button"
        onClick={addColorTag}
        disabled={!selectedColorName}
        style={{
          padding: "10px 25px",
          backgroundColor: selectedColorName ? "#10b981" : "#cbd5e1",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: selectedColorName ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          fontWeight: "600"
        }}
      >
        <Plus size={16} /> Ongeza Rangi
      </button>
    </div>
  )}
  
  {/* KAMA AMECHAGUA "ANDIKA MWENYEWE" - ONYESHA INPUT */}
  {showCustomColor && (
    <div>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", marginBottom: "10px" }}>
        <input 
          type="text"
          placeholder="Andika jina la rangi (mfano: Turquoise, Neon Green)"
          value={customColorName}
          onChange={(e) => {
            let value = e.target.value;
            value = value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
            setCustomColorName(value);
            setSelectedColorName(value);
          }}
          style={{
            flex: 2,
            padding: "10px",
            borderRadius: "8px",
            border: "2px solid #3b82f6",
            fontSize: "14px"
          }}
          autoFocus
        />
        
        <input 
          type="color" 
          value={currentColor} 
          onChange={(e) => setCurrentColor(e.target.value)}
          style={{ width: "50px", height: "45px", border: "1px solid #ccc", borderRadius: "8px", cursor: "pointer" }}
        />
        
        <button
          type="button"
          onClick={addColorTag}
          disabled={!customColorName.trim()}
          style={{
            padding: "10px 25px",
            backgroundColor: customColorName.trim() ? "#10b981" : "#cbd5e1",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: customColorName.trim() ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontWeight: "600"
          }}
        >
          <Plus size={16} /> Ongeza Rangi
        </button>
      </div>
      
      <div style={{ fontSize: "11px", color: "#64748b", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <span>💡 Mifano: </span>
        <span>Neon Green</span>
        <span>Metallic Blue</span>
        <span>Cream White</span>
        <span>Matte Black</span>
      </div>
    </div>
  )}
  
  <div style={{ fontSize: "12px", color: "#64748b", marginTop: "12px", padding: "8px", backgroundColor: "#fef3c7", borderRadius: "6px" }}>
    💡 <strong>Kidokezo:</strong> Bonyeza "Andika rangi yangu" kuweka rangi yoyote unayotaka.
  </div>
</div>
          {/* ========== LIST YA RANGI ZOTE NA SIZE STOCK ZAKE ========== */}
          {attributes.colors?.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
              {attributes.colors.map((color, colorIndex) => {
                // Get stock for this specific color
                const colorStock = attributes.size_stock?.[color] || {};
                
                return (
                  <div key={color} style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "20px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                  }}>
                    {/* Header ya Rangi */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "15px",
                      paddingBottom: "10px",
                      borderBottom: "1px solid #e2e8f0",
                      flexWrap: "wrap",
                      gap: "10px"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          backgroundColor: color,
                          border: "2px solid #cbd5e1",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                        }} />
                        <div>
                          <span style={{ fontWeight: "700", fontSize: "16px" }}>
                            {color.toUpperCase()}
                          </span>
                          <div style={{ fontSize: "11px", color: "#64748b" }}>
                            Picha: {attributes.color_images?.[color] ? "✅ Imepakiwa" : "❌ Hajapakiwa"}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          // Remove this color completely
                          const newColors = attributes.colors.filter(c => c !== color);
                          const newSizeStock = { ...(attributes.size_stock || {}) };
                          delete newSizeStock[color];
                          const newColorImages = { ...(attributes.color_images || {}) };
                          delete newColorImages[color];
                          
                          setAttributes({ 
                            ...attributes, 
                            colors: newColors, 
                            size_stock: newSizeStock,
                            color_images: newColorImages
                          });
                        }}
                        style={{
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "5px 12px",
                          cursor: "pointer",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px"
                        }}
                      >
                        <Trash2 size={14} /> Futa Rangi
                      </button>
                    </div>
                    
                    {/* ========== SEHEMU YA KUONGEZA UKUBWA KWA RANGI HII ========== */}
                    <div style={{
                      backgroundColor: "#f8fafc",
                      padding: "12px",
                      borderRadius: "8px",
                      marginBottom: "15px"
                    }}>
                      <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                        📏 Ongeza Ukubwa kwa {color.toUpperCase()}:
                      </label>
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value === "CUSTOM") return;
                            const presetSizes = e.target.value.split(",");
                            const newSizeStock = { ...(attributes.size_stock || {}) };
                            if (!newSizeStock[color]) newSizeStock[color] = {};
                            
                            presetSizes.forEach(size => {
                              if (newSizeStock[color][size] === undefined) {
                                newSizeStock[color][size] = 0;
                              }
                            });
                            
                            setAttributes({ 
                              ...attributes, 
                              size_stock: newSizeStock 
                            });
                            e.target.value = "";
                          }}
                          style={{
                            flex: 1,
                            padding: "8px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            backgroundColor: "white"
                          }}
                        >
                          <option value="">-- Chagua template ya ukubwa --</option>
                          <option value="XS,S,M,L,XL,XXL,XXXL">👕 Nguo (XS, S, M, L, XL, XXL, XXXL)</option>
                          <option value="36,37,38,39,40,41,42,43,44,45">👟 Viatu (36 - 45)</option>
                          <option value="40,41,42,43,44,45,46,47,48,49,50">👟 Viatu (40 - 50)</option>
                          <option value="2T,3T,4T,5T,6,7,8,9,10,11,12">🧒 Watoto (2T - 12)</option>
                          <option value="UK3,UK4,UK5,UK6,UK7,UK8,UK9,UK10,UK11">🇬🇧 Viatu UK</option>
                          <option value="Free Size">📏 Free Size</option>
                          <option value="CUSTOM">✏️ SIZE YANGU MWENYEWE</option>
                        </select>
                        
                        <div style={{ display: "flex", gap: "5px", flex: 2 }}>
                          <input 
                            type="text"
                            className="text-input"
                            placeholder="Ukubwa wako (mfano: XXL, 42)"
                            value={customSizeInput}
                            onChange={(e) => setCustomSizeInput(e.target.value)}
                            style={{ flex: 1 }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (customSizeInput.trim()) {
                                const newSize = customSizeInput.trim().toUpperCase();
                                const newSizeStock = { ...(attributes.size_stock || {}) };
                                if (!newSizeStock[color]) newSizeStock[color] = {};
                                if (newSizeStock[color][newSize] === undefined) {
                                  newSizeStock[color][newSize] = 0;
                                }
                                setAttributes({ ...attributes, size_stock: newSizeStock });
                                setCustomSizeInput("");
                              }
                            }}
                            style={{
                              padding: "8px 15px",
                              backgroundColor: "#10b981",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer"
                            }}
                          >
                            <Plus size={14} /> Ongeza
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* ========== JEDWALI LA UKUBWA NA STOCK KWA RANGI HII ========== */}
                    {Object.keys(colorStock).length > 0 && (
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                          📊 Stock kwa Kila Ukubwa:
                        </label>
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                          gap: "10px"
                        }}>
                          {Object.entries(colorStock).map(([size, stock]) => (
                            <div key={size} style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "8px 12px",
                              backgroundColor: "#f8fafc",
                              borderRadius: "8px",
                              border: "1px solid #e2e8f0"
                            }}>
                              <span style={{ fontWeight: "500", fontSize: "13px" }}>{size}</span>
                              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                <input 
                                  type="number"
                                  min="0"
                                  style={{
                                    width: "70px",
                                    padding: "6px",
                                    borderRadius: "6px",
                                    border: "1px solid #cbd5e1",
                                    textAlign: "center",
                                    fontSize: "13px"
                                  }}
                                  placeholder="Stock"
                                  value={stock}
                                  onChange={(e) => {
                                    const newStock = parseInt(e.target.value) || 0;
                                    const newSizeStock = { ...(attributes.size_stock || {}) };
                                    if (!newSizeStock[color]) newSizeStock[color] = {};
                                    newSizeStock[color][size] = newStock;
                                    setAttributes({ ...attributes, size_stock: newSizeStock });
                                    
                                    // Auto-calculate total stock
                                    const totalStock = Object.values(newSizeStock).reduce((sum, colorStock) => {
                                      return sum + Object.values(colorStock).reduce((s, val) => s + (Number(val) || 0), 0);
                                    }, 0);
                                    setAttributes(prev => ({ ...prev, stock: totalStock }));
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newSizeStock = { ...(attributes.size_stock || {}) };
                                    if (newSizeStock[color]) {
                                      delete newSizeStock[color][size];
                                      if (Object.keys(newSizeStock[color]).length === 0) {
                                        delete newSizeStock[color];
                                      }
                                    }
                                    setAttributes({ ...attributes, size_stock: newSizeStock });
                                  }}
                                  style={{
                                    background: "#ef4444",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    width: "22px",
                                    height: "22px",
                                    cursor: "pointer",
                                    fontSize: "12px"
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Jumla ya stock kwa rangi hii */}
                        <div style={{
                          marginTop: "12px",
                          padding: "8px 12px",
                          backgroundColor: "#f0fdf4",
                          borderRadius: "8px",
                          fontSize: "12px",
                          display: "flex",
                          justifyContent: "space-between"
                        }}>
                          <span>📦 Jumla ya {color.toUpperCase()}:</span>
                          <strong>
                            {Object.values(colorStock).reduce((sum, val) => sum + (Number(val) || 0), 0)} pcs
                          </strong>
                        </div>
                      </div>
                    )}
                    
                    {/* Picha ya rangi kwa Marketplace */}
                    <div style={{ marginTop: "15px" }}>
                      <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                        🖼️ Picha ya Rangi {color.toUpperCase()} (Marketplace)
                      </label>
                      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <input 
                          id={`color-img-${color}`}
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const imageUrl = URL.createObjectURL(file);
                              setAttributes(prev => ({
                                ...prev,
                                color_images: { ...(prev.color_images || {}), [color]: imageUrl },
                                color_image_files: { ...(prev.color_image_files || {}), [color]: file }
                              }));
                            }
                          }}
                        />
                        <label 
                          htmlFor={`color-img-${color}`}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "80px",
                            height: "80px",
                            border: attributes.color_images?.[color] ? "2px solid #10b981" : "2px dashed #cbd5e1",
                            borderRadius: "10px",
                            backgroundColor: attributes.color_images?.[color] ? "#f0fdf4" : "#f8fafc",
                            cursor: "pointer",
                            overflow: "hidden"
                          }}
                        >
                          {attributes.color_images?.[color] ? (
                            <img src={attributes.color_images[color]} alt={color} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <>
                              <Camera size={20} color="#64748b" />
                              <span style={{ fontSize: "9px", marginTop: "4px" }}>Weka Picha</span>
                            </>
                          )}
                        </label>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>
                          {attributes.color_images?.[color] 
                            ? "✅ Picha imepakiwa. Itaonyeshwa kwenye marketplace." 
                            : "⚠️ Picha inahitajika kwa rangi hii"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Jumla Kuu ya Stock */}
          {attributes.colors?.length > 0 && (
            <div style={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "#1e293b",
              borderRadius: "10px",
              color: "white"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <span style={{ fontWeight: "600" }}>📊 Jumla Kuu ya Bidhaa:</span>
                  <span style={{ fontWeight: "bold", fontSize: "18px", marginLeft: "10px", color: "#10b981" }}>
                    {attributes.colors.reduce((total, color) => {
                      const colorStock = attributes.size_stock?.[color] || {};
                      return total + Object.values(colorStock).reduce((sum, val) => sum + (Number(val) || 0), 0);
                    }, 0)} pcs
                  </span>
                </div>
                <div>
                  <span style={{ fontWeight: "600" }}>🎨 Rangi:</span>
                  <span style={{ marginLeft: "5px" }}>{attributes.colors.length}</span>
                </div>
              </div>
            </div>
          )}
          
          <small style={{ color: "#6b7280", fontSize: "11px", marginTop: "12px", display: "block" }}>
            💡 <strong>Muundo:</strong> Kila rangi ina ukubwa wake na stock tofauti.
            <br />
            📌 Unaweza kuongeza rangi nyingi, na kwa kila rangi unaweza kuongeza ukubwa tofauti.
            <br />
            🖼️ Kila rangi ina picha yake moja inayoonyeshwa kwenye marketplace.
            <br />
            📊 Jumla ya stock inahesabiwa moja kwa moja.
          </small>
        </div>
      </div>
    </div>
  </>
)}
      
{/* ========== SECTION: MARKETPLACE LISTING (MAUZO SOKONI) ========== */}
{selectedLeaf && (
  <>
    <div className="form-section-header">
      <ShoppingBag size={20} />
      <h3>Mauzo Sokoni (Marketplace Listing) - {selectedLeaf.name}</h3>
      <span className="variation-count-badge" style={{ backgroundColor: "#ef4444", color: "white" }}>
        * Lazima kujaza
      </span>
    </div>

    <div className="marketplace-container" style={{
      border: "2px solid #ef4444",
      borderRadius: "12px",
      padding: "15px",
      backgroundColor: "#fef2f2",
      marginBottom: "20px"
    }}>
      <div style={{
        backgroundColor: "#fee2e2",
        padding: "10px",
        borderRadius: "8px",
        marginBottom: "15px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: "#991b1b"
      }}>
        <AlertCircle size={18} />
        <span style={{ fontSize: "13px", fontWeight: "500" }}>
          ⚠️ Taarifa za Marketplace ni lazima zijazwe kwa bidhaa hii!
        </span>
      </div>

      <div style={{
        border: "1px solid #cbd5e1",
        borderRadius: "10px",
        padding: "15px",
        backgroundColor: "white"
      }}>
        <h4 style={{ fontWeight: "600", color: "#2563eb", marginBottom: "15px" }}>
          📦 Listing ya {selectedLeaf.name}
        </h4>

        {/* Jina la bidhaa */}
        <div className="form-group" style={{ marginBottom: "12px" }}>
          <label className="field-label-small" style={{ color: "#ef4444" }}>
            Jina la Bidhaa Sokoni <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            type="text"
            className="text-input"
            placeholder="Mfano: Nike Air Max 2024"
            value={attributes.marketplace_product_name || ""}
            onChange={(e) => setAttributes({ ...attributes, marketplace_product_name: e.target.value })}
          />
        </div>

        {/* Bei ya bidhaa (Default) */}
        <div className="form-group" style={{ marginBottom: "12px" }}>
          <label className="field-label-small" style={{ color: "#ef4444" }}>
            Bei ya Msingi (TZS) <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            type="number"
            className="text-input"
            placeholder="Bei ya kuuza sokoni"
            value={attributes.marketplace_base_price || attributes.price || ""}
            onChange={(e) => setAttributes({ ...attributes, marketplace_base_price: e.target.value })}
          />
          <small style={{ fontSize: "11px", color: "#6b7280" }}>
            Bei ya kuuza kwa bidhaa hii
          </small>
        </div>

        {/* ============================================================ */}
        {/* CASE 1: BIDHAA INA RANGI (has_colors = true) - Picha kwa kila rangi */}
        {/* ============================================================ */}
        {attributes.has_colors && attributes.colors?.length > 0 && (
          <div className="form-group" style={{ marginBottom: "12px" }}>
            <label className="field-label-small" style={{ color: "#ef4444" }}>
              Picha za Rangi <span style={{ color: "#ef4444" }}>*</span>
            </label>
            
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              marginTop: "8px"
            }}>
              {attributes.colors.map(color => {
                const colorImage = attributes.color_images?.[color] || null;
                const colorStock = attributes.size_stock?.[color] || {};
                const totalStock = Object.values(colorStock).reduce((sum, val) => sum + (Number(val) || 0), 0);
                
                return (
                  <div key={color} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    padding: "12px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    flexWrap: "wrap"
                  }}>
                    <div style={{ width: "80px", textAlign: "center" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: color, border: "2px solid #cbd5e1", margin: "0 auto 5px auto" }} />
                      <div style={{ fontSize: "12px", fontWeight: "600" }}>{color.toUpperCase()}</div>
                      <div style={{ fontSize: "10px", color: "#64748b" }}>Stock: {totalStock} pcs</div>
                    </div>
                    
                    <div>
                      <input 
                        id={`marketplace-color-${color}`}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const imageUrl = URL.createObjectURL(file);
                            setAttributes(prev => ({
                              ...prev,
                              color_images: { ...(prev.color_images || {}), [color]: imageUrl },
                              color_image_files: { ...(prev.color_image_files || {}), [color]: file }
                            }));
                          }
                        }}
                      />
                      <label 
                        htmlFor={`marketplace-color-${color}`}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "80px",
                          height: "80px",
                          border: colorImage ? "2px solid #10b981" : "2px dashed #cbd5e1",
                          borderRadius: "10px",
                          backgroundColor: colorImage ? "#f0fdf4" : "#f8fafc",
                          cursor: "pointer",
                          overflow: "hidden"
                        }}
                      >
                        {colorImage ? (
                          <img src={colorImage} alt={color} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <>
                            <Camera size={20} color="#64748b" />
                            <span style={{ fontSize: "9px", marginTop: "4px" }}>Weka Picha</span>
                          </>
                        )}
                      </label>
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "12px", color: "#475569" }}>
                        {colorImage ? (
                          <span style={{ color: "#10b981", display: "flex", alignItems: "center", gap: "5px" }}>
                            <CheckCircle2 size={14} /> Picha imepakiwa
                          </span>
                        ) : (
                          <span style={{ color: "#ef4444" }}>⚠️ Picha inahitajika kwa rangi hii</span>
                        )}
                      </div>
                      {Object.keys(colorStock).length > 0 && (
                        <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "5px" }}>
                          Ukubwa: {Object.keys(colorStock).join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <small style={{ fontSize: "11px", color: "#6b7280", marginTop: "12px", display: "block" }}>
              📌 Picha moja kwa kila rangi. Ukubwa na stock zimewekwa kwenye jedwali la ukubwa hapo juu.
            </small>
          </div>
        )}

        {/* ============================================================ */}
        {/* CASE 2: BIDHAA HINA RANGI (has_colors = false) - Picha MOJA tu */}
        {/* CASE 2a: Ina size + CASE 2b: Haina size - ZOTE Picha MOJA */}
        {/* ============================================================ */}
        {!attributes.has_colors && (
          <div className="form-group" style={{ marginBottom: "12px" }}>
            <label className="field-label-small" style={{ color: "#ef4444" }}>
              Picha ya Bidhaa <span style={{ color: "#ef4444" }}>*</span>
            </label>
            
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              padding: "12px",
              backgroundColor: "#f8fafc",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              flexWrap: "wrap"
            }}>
              <input 
                id="marketplace-main-image"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setAttributes({ 
                      ...attributes, 
                      marketplace_main_image: URL.createObjectURL(file),
                      marketplace_main_image_file: file
                    });
                  }
                }}
              />
              
              <label 
                htmlFor="marketplace-main-image"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100px",
                  height: "100px",
                  border: attributes.marketplace_main_image ? "2px solid #10b981" : "2px dashed #cbd5e1",
                  borderRadius: "10px",
                  backgroundColor: attributes.marketplace_main_image ? "#f0fdf4" : "#f8fafc",
                  cursor: "pointer",
                  overflow: "hidden"
                }}
              >
                {attributes.marketplace_main_image ? (
                  <img src={attributes.marketplace_main_image} alt="Product" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <>
                    <Camera size={24} color="#64748b" />
                    <span style={{ fontSize: "10px", marginTop: "4px" }}>Weka Picha</span>
                  </>
                )}
              </label>
              
              <div>
                <div style={{ fontWeight: "500", fontSize: "14px" }}>Picha ya Bidhaa</div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>
                  {attributes.marketplace_main_image ? "Picha imepakiwa" : "Bonyeza kuweka picha ya bidhaa"}
                </div>
                {attributes.enable_sizes && attributes.sizes?.length > 0 && (
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "5px" }}>
                    📏 Ukubwa unaopatikana: {attributes.sizes.join(", ")}
                  </div>
                )}
                {!attributes.enable_sizes && (
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "5px" }}>
                    ✅ Bidhaa haina ukubwa tofauti (Standard size)
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* Jumla ya Stock (Inahesabiwa moja kwa moja) */}
        {/* ============================================================ */}
        <div style={{
          marginTop: "15px",
          padding: "12px",
          backgroundColor: "#f1f5f9",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px"
        }}>
          <div>
            <span style={{ fontSize: "12px", color: "#475569" }}>📦 Jumla ya Stock:</span>
            <span style={{ fontWeight: "bold", marginLeft: "8px", color: "#2563eb" }}>
              {attributes.has_colors && attributes.colors?.length > 0
                ? attributes.colors.reduce((total, color) => {
                    const colorStock = attributes.size_stock?.[color] || {};
                    return total + Object.values(colorStock).reduce((sum, val) => sum + (Number(val) || 0), 0);
                  }, 0)
                : attributes.enable_sizes
                  ? Object.values(attributes.size_stock || {}).reduce((acc, val) => acc + (Number(val) || 0), 0)
                  : attributes.stock || 0
              } pcs
            </span>
          </div>
          {attributes.has_colors && (
            <div>
              <span style={{ fontSize: "12px", color: "#475569" }}>🖼️ Rangi zilizo na picha:</span>
              <span style={{ fontWeight: "bold", marginLeft: "8px", color: "#10b981" }}>
                {Object.values(attributes.color_images || {}).filter(img => img).length} / {(attributes.colors || []).length}
              </span>
            </div>
          )}
        </div>

        <small style={{ color: "#6b7280", fontSize: "11px", marginTop: "12px", display: "block" }}>
          {attributes.has_colors 
            ? "📌 Kila rangi ina picha yake. Mteja atachagua kwanza RANGI, kisha UKUBWA."
            : attributes.enable_sizes
              ? "📌 Picha moja inayowakilisha bidhaa. Mteja atachagua UKUBWA anao hitaji."
              : "📌 Picha moja inayowakilisha bidhaa yako."}
        </small>
      </div>
    </div>
  </>
)}
            {/* ========== SECTION 12: SALES MODE & PRICING ========== */}
      <div className="form-section-header">
        <DollarSign size={20} />
        <h3>Mfumo wa Uuzaji na Bei</h3>
      </div>
      
      <div className="sales-mode-card">
        <div className="sales-mode-options">
          {["Retail", "Wholesale"].map((mode) => (
            <label key={mode} className="checkbox-label">
              <input
                type="checkbox"
                checked={mode === "Retail" ? attributes.is_retail : attributes.is_wholesale}
                onChange={(e) => setAttributes({ ...attributes, [mode === "Retail" ? "is_retail" : "is_wholesale"]: e.target.checked })}
              />
              {mode === "Retail" ? "🏪 Rejareja (Retail)" : "📦 Jumla (Wholesale)"}
            </label>
          ))}
        </div>

{attributes.is_wholesale && (
  <div className="tiered-pricing-container">
    <label className="field-label-small">Viwango vya Bei kwa Jumla</label>
    {attributes.price_tiers?.map((tier, index) => (
      <div key={index} className="tier-row-grid">
        <input 
          type="number" 
          placeholder="Kuanzia (pcs)" 
          value={tier.from_qty} 
          onChange={(e) => handleTierChange(index, "from_qty", e.target.value)} 
        />
        <input 
          type="number" 
          placeholder="Mpaka (pcs)" 
          value={tier.to_qty} 
          onChange={(e) => handleTierChange(index, "to_qty", e.target.value)} 
        />
        <input 
          type="number" 
          placeholder="Bei (TZS)" 
          value={tier.unit_price} 
          onChange={(e) => handleTierChange(index, "unit_price", e.target.value)} 
        />
        <button 
          type="button" 
          onClick={() => removePriceTier(index)}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "6px",
            width: "32px",
            height: "32px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Trash2 size={16} />
        </button>
      </div>
    ))}
    <button 
      type="button" 
      onClick={addPriceTier}
      style={{
        marginTop: "10px",
        padding: "8px 16px",
        backgroundColor: "#10b981",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}
    >
      <Plus size={16} /> Ongeza Kiwango kingine
    </button>
  </div>
)}

        <div className="minimum-order-quantity" style={{ marginTop: "15px" }}>
          <label className="field-label-small">Kiwango cha chini cha Agizo (MOQ)</label>
          <input 
            type="number" 
            className="text-input"
            placeholder="Idadi ya chini inayoruhusiwa kwa agizo moja"
            value={attributes.moq || ""} 
            onChange={(e) => setAttributes({ ...attributes, moq: e.target.value })} 
          />
          <small style={{ color: "#6b7280", fontSize: "12px", marginTop: "4px", display: "block" }}>
            Acha wazi kama hakuna kiwango cha chini
          </small>
        </div>
      </div>

      {/* ========== SECTION 13: PRICE & STOCK ========== */}
      <div className="form-section-header">
        <ShoppingBag size={20} />
        <h3>Bei na Stock</h3>
      </div>
      
      <div className="form-grid-two">
        {attributes.is_retail && (
          <div className="form-group">
            <label className="field-label-main">
              Bei ya Rejareja (TZS) <span className="required-star">*</span>
            </label>
            <input 
              type="number" 
              className="text-input"
              placeholder="Mfano: 25000"
              value={attributes.price || ""} 
              onChange={(e) => setAttributes({ ...attributes, price: e.target.value })} 
            />
            <small style={{ color: "#6b7280", fontSize: "12px" }}>
              Bei ya kuuza kwa rejareja kwa kila bidhaa
            </small>
          </div>
        )}

        <div className="form-group">
          <label className="field-label-main">
            Jumla ya Stock <span className="required-star">*</span>
          </label>
          <input 
            type="number" 
            className="text-input"
            placeholder="Idadi ya bidhaa zilizopo"
            value={attributes.stock || ""} 
            onChange={(e) => setAttributes({ ...attributes, stock: e.target.value })} 
            min="0"
          />
          {productVariations.length > 0 && (
            <small style={{ color: "#10b981", fontSize: "12px", marginTop: "4px", display: "block" }}>
              ✅ Stock inahesabiwa moja kwa moja kutoka variations ({productVariations.reduce((acc, v) => acc + (Number(v.stock_quantity) || 0), 0)})
            </small>
          )}
        </div>
      </div>

      {/* ========== SECTION 14: COST & PROFIT ========== */}
      <div className="form-section-header">
        <Award size={20} />
        <h3>Gharama na Faida</h3>
      </div>
      
      <div className="form-grid-two">
        <div className="form-group">
          <label className="field-label-main">
            Gharama ya Jumla ya Stock (TZS)
          </label>
          <input 
            type="number" 
            className="text-input"
            placeholder="Gharama uliyotumia kununua stock zote"
            value={attributes.total_stock_cost || ""} 
            onChange={(e) => setAttributes({ ...attributes, total_stock_cost: e.target.value })} 
          />
          <small style={{ color: "#6b7280", fontSize: "12px" }}>
            Gharama uliyolipa kwa ajili ya stock zote
          </small>
        </div>

        <div className="form-group">
          <label className="field-label-main">
            Faida Inayotarajiwa (TZS)
          </label>
          <input 
            type="number" 
            className="text-input"
            placeholder="Faida unayotarajia kupata"
            value={attributes.expected_total_profit || ""} 
            onChange={(e) => setAttributes({ ...attributes, expected_total_profit: e.target.value })} 
          />
          <small style={{ color: "#6b7280", fontSize: "12px" }}>
            Mapato - Gharama = Faida
          </small>
        </div>
      </div>

    {/* ========== SECTION 15: SHIPPING INFORMATION ========== */}
<div className="form-section-header">
  <Truck size={20} />
  <h3>Taarifa za Usafirishaji</h3>
</div>

<div className="shipping-container" style={{
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "15px",
  backgroundColor: "#f8fafc",
  marginBottom: "20px"
}}>
  
  {/* Chagua Mfumo wa Usafirishaji */}
  <div className="form-group" style={{ marginBottom: "15px" }}>
    <label className="field-label-small">Mfumo wa Usafirishaji</label>
    <select
      className="select-input"
      value={attributes.shipping_method || "fixed"}
      onChange={(e) => setAttributes({ ...attributes, shipping_method: e.target.value })}
      style={{ marginBottom: "10px" }}
    >
      <option value="fixed">💰 Gharama Imara (Fixed)</option>
      <option value="distance">📏 Kwa Umbali (Distance Based)</option>
      <option value="zone">📍 Kwa Kanda (Zone Based)</option>
      <option value="free">🎉 Usafirishaji Bure (Free Shipping)</option>
    </select>
  </div>

  {/* CASE 1: FIXED SHIPPING (Gharama Imara) */}
  {attributes.shipping_method === "fixed" && (
    <div className="form-group">
      <label className="field-label-small">Gharama ya Usafirishaji (TZS)</label>
      <input 
        type="number" 
        className="text-input"
        placeholder="Mfano: 5000"
        value={attributes.shipping_cost || ""} 
        onChange={(e) => setAttributes({ ...attributes, shipping_cost: e.target.value })} 
      />
      <small style={{ color: "#6b7280", fontSize: "11px", marginTop: "4px", display: "block" }}>
        Gharama moja kwa maeneo yote (kawaida Dar es Salaam)
      </small>
    </div>
  )}

  {/* CASE 2: DISTANCE BASED (Kwa Umbali) */}
  {attributes.shipping_method === "distance" && (
    <div className="distance-shipping" style={{
      backgroundColor: "#ffffff",
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #e2e8f0"
    }}>
      <div className="form-group" style={{ marginBottom: "12px" }}>
        <label className="field-label-small">Gharama kwa Kilomita (TZS/km)</label>
        <input 
          type="number" 
          className="text-input"
          placeholder="Mfano: 500 kwa km"
          value={attributes.shipping_rate_per_km || ""} 
          onChange={(e) => setAttributes({ ...attributes, shipping_rate_per_km: e.target.value })} 
        />
      </div>
      
      <div className="form-group" style={{ marginBottom: "12px" }}>
        <label className="field-label-small">Gharama ya Msingi (Base Fee)</label>
        <input 
          type="number" 
          className="text-input"
          placeholder="Mfano: 2000"
          value={attributes.shipping_base_fee || ""} 
          onChange={(e) => setAttributes({ ...attributes, shipping_base_fee: e.target.value })} 
        />
        <small style={{ color: "#6b7280", fontSize: "11px", marginTop: "4px", display: "block" }}>
          Gharama ya kuanzia (kwa km 0)
        </small>
      </div>

      <div className="form-group">
        <label className="field-label-small">Umbali wa Kawaida (km)</label>
        <input 
          type="number" 
          className="text-input"
          placeholder="Mfano: 10"
          value={attributes.shipping_default_distance || ""} 
          onChange={(e) => setAttributes({ ...attributes, shipping_default_distance: e.target.value })} 
        />
        <small style={{ color: "#6b7280", fontSize: "11px", marginTop: "4px", display: "block" }}>
          Umbali wa kawaida kutoka duka lako (kwa mahesabu)
        </small>
      </div>

      <div style={{
        backgroundColor: "#e0e7ff",
        padding: "10px",
        borderRadius: "8px",
        marginTop: "10px"
      }}>
        <p style={{ fontSize: "13px", margin: 0 }}>
          📐 <strong>Mfumo:</strong> Gharama = Gharama Msingi + (Umbali × Gharama kwa km)
        </p>
        <p style={{ fontSize: "12px", color: "#475569", marginTop: "5px" }}>
          Mfano: Ikiwa gharama msingi 2,000 TZS na 500 TZS/km, umbali wa 10km = 2,000 + (10 × 500) = 7,000 TZS
        </p>
      </div>
    </div>
  )}

  {/* CASE 3: ZONE BASED (Kwa Kanda) */}
  {attributes.shipping_method === "zone" && (
    <div className="zone-shipping">
      <label className="field-label-small">Viwango kwa Kanda</label>
      
      {/* Dar es Salaam Zones */}
      <div style={{
        backgroundColor: "#ffffff",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        marginBottom: "12px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <span style={{ fontWeight: "600", fontSize: "14px" }}>📍 Dar es Salaam</span>
          <span style={{ fontSize: "11px", color: "#64748b" }}>(Kanda 1)</span>
        </div>
        <div className="form-group">
          <input 
            type="number" 
            className="text-input"
            placeholder="Gharama ya usafirishaji Dar"
            value={attributes.shipping_dar_cost || ""} 
            onChange={(e) => setAttributes({ ...attributes, shipping_dar_cost: e.target.value })} 
            style={{ marginBottom: "5px" }}
          />
          <small style={{ color: "#6b7280", fontSize: "11px" }}>
            Kinondoni, Ilala, Ubungo, Temeke, Kigamboni
          </small>
        </div>
      </div>

      {/* Outside Dar es Salaam */}
      <div style={{
        backgroundColor: "#ffffff",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        marginBottom: "12px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <span style={{ fontWeight: "600", fontSize: "14px" }}>🚚 Nje ya Dar es Salaam</span>
          <span style={{ fontSize: "11px", color: "#64748b" }}>(Kanda 2)</span>
        </div>
        <div className="form-group">
          <input 
            type="number" 
            className="text-input"
            placeholder="Gharama ya usafirishaji nje ya Dar"
            value={attributes.shipping_outside_dar_cost || ""} 
            onChange={(e) => setAttributes({ ...attributes, shipping_outside_dar_cost: e.target.value })} 
            style={{ marginBottom: "5px" }}
          />
          <small style={{ color: "#6b7280", fontSize: "11px" }}>
            Pwani, Morogoro, Tanga, na mikoa mingine
          </small>
        </div>
      </div>

      {/* Other Regions */}
      <div style={{
        backgroundColor: "#ffffff",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <span style={{ fontWeight: "600", fontSize: "14px" }}>🏔️ Mikoa ya Mbali</span>
          <span style={{ fontSize: "11px", color: "#64748b" }}>(Kanda 3)</span>
        </div>
        <div className="form-group">
          <input 
            type="number" 
            className="text-input"
            placeholder="Gharama ya usafirishaji mikoa ya mbali"
            value={attributes.shipping_remote_cost || ""} 
            onChange={(e) => setAttributes({ ...attributes, shipping_remote_cost: e.target.value })} 
            style={{ marginBottom: "5px" }}
          />
          <small style={{ color: "#6b7280", fontSize: "11px" }}>
            Mwanza, Arusha, Mbeya, Dodoma, n.k.
          </small>
        </div>
      </div>
    </div>
  )}

  {/* CASE 4: FREE SHIPPING */}
  {attributes.shipping_method === "free" && (
    <div className="free-shipping" style={{
      backgroundColor: "#d1fae5",
      padding: "15px",
      borderRadius: "8px",
      textAlign: "center"
    }}>
      <p style={{ margin: 0, fontWeight: "500", color: "#065f46" }}>
        🎉 Usafirishaji Bure kwa maeneo yote!
      </p>
      <small style={{ color: "#047481", fontSize: "11px" }}>
        Gharama za usafirishaji zinalipwa na muuzaji
      </small>
    </div>
  )}

  {/* Extra: Pickup Option */}
  <div className="form-group" style={{ marginTop: "15px" }}>
    <label className="checkbox-label" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <input
        type="checkbox"
        checked={attributes.enable_pickup || false}
        onChange={(e) => setAttributes({ ...attributes, enable_pickup: e.target.checked })}
      />
      <span>✅ Washa chaguo la "Kuchukua Mwenyewe" (Pickup)</span>
    </label>
    {attributes.enable_pickup && (
      <div style={{
        backgroundColor: "#fef3c7",
        padding: "10px",
        borderRadius: "8px",
        marginTop: "8px",
        fontSize: "13px"
      }}>
        <p style={{ margin: 0 }}>
          📍 Mteja atajulishwa anwani ya duka lako ili kuchukua bidhaa mwenyewe.
          <br />
          <strong>Anwani ya Duka:</strong> 
          <input 
            type="text" 
            className="text-input"
            placeholder="Weka anwani ya duka lako"
            value={attributes.store_address || ""} 
            onChange={(e) => setAttributes({ ...attributes, store_address: e.target.value })} 
            style={{ marginTop: "5px" }}
          />
        </p>
      </div>
    )}
  </div>

  <small style={{ color: "#6b7280", fontSize: "11px", marginTop: "8px", display: "block" }}>
    💡 <strong>Kidokezo:</strong> Chagua mfumo unaofaa kwa biashara yako. Kwa Dar es Salaam, tumia "Gharama Imara" au "Kwa Kanda".
  </small>
</div>

      {/* Warning for low stock */}
      {selectedLeaf && selectedLeaf.min_stock_warning && (
        <div className="alert-box-warning" style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "10px", padding: "12px", backgroundColor: "#fef3c7", borderRadius: "8px" }}>
          <AlertCircle size={20} color="#d97706" />
          <div>
            <strong style={{ color: "#92400e" }}>⚠️ Onyo la Stock</strong>
            <p style={{ margin: "0", fontSize: "13px", color: "#78350f" }}>
              Bidhaa hii ina kiwango cha chini cha onyo cha stock: {selectedLeaf.min_stock_warning} 
              (Utapata arifa stock inapofikia kiwango hiki)
            </p>
          </div>

        </div>
      )}


      {/* Debug info - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f3f4f6", borderRadius: "8px", fontSize: "12px" }}>
          <details>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>🔧 Debug Information</summary>
            <div style={{ marginTop: "10px" }}>
              <p><strong>Selected Leaf:</strong> {selectedLeaf?.name || "None"}</p>
              <p><strong>require_gender:</strong> {selectedLeaf?.require_gender ? "Yes" : "No"}</p>
              <p><strong>require_size:</strong> {selectedLeaf?.require_size ? "Yes" : "No"}</p>
              <p><strong>size_format:</strong> {selectedLeaf?.size_format || "Not set"}</p>
              <p><strong>color_required:</strong> {selectedLeaf?.color_required !== false ? "Yes" : "No"}</p>
              <p><strong>Colors count:</strong> {attributes.colors?.length || 0}</p>
              <p><strong>Sizes count:</strong> {attributes.sizes?.length || 0}</p>
              <p><strong>Variations count:</strong> {attributes.variations?.length || 0}</p>
              <p><strong>Total Stock:</strong> {attributes.stock || 0}</p>
            </div>
          </details>
        </div>
      )}
    </div>

  );
}
export default React.memo(ProductAttributes);