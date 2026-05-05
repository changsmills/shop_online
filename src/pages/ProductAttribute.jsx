import React, { useState, useEffect } from "react";
import { 
  Zap, CheckCircle2, Loader2, AlertCircle, Package, Info, Camera, 
  Plus, Trash2, Ruler, Weight, Shield, Tag, Globe, Calendar,
  Wrench, Shirt, Footprints, Smartphone, Home, ShoppingBag, Truck,
  DollarSign, Layers, Grid, Heart, Star, Award, Clock, Settings, 
  Palette
} from "lucide-react";

import { supabase } from "../supabaseClient";
import '../ProductAttributes.css';

function ProductAttributes({ attributes, setAttributes, subCategoryId }) {

  const [productVariations, setProductVariations] = useState([]);
  const [currentColor, setCurrentColor] = useState("#2563eb");
  const [leafCategories, setLeafCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLeaf, setSelectedLeaf] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Custom size input
  const [customSizeInput, setCustomSizeInput] = useState("");
  const [useCustomSizes, setUseCustomSizes] = useState(false);

  const [selectedColorName, setSelectedColorName] = useState("");
  const [customColorName, setCustomColorName] = useState("");
  const [showCustomColor, setShowCustomColor] = useState(false);
  
  // Weight unit
  const [weightUnit, setWeightUnit] = useState("kg");

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 1. Fetch Brands
  useEffect(() => {
    const fetchBrands = async () => {
      const { data } = await supabase.from('brands').select('id, name').order('name');
      if (data) setBrands(data);
    };
    fetchBrands();
  }, []);

  // 2. Fetch Leaf Categories
  useEffect(() => {
    const fetchFilteredLeafs = async () => {
      if (!subCategoryId) {
        setLeafCategories([]);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('leaf_categories')
        .select('*')
        .eq('sub_category_id', subCategoryId)
        .order('name', { ascending: true });

      if (error) {
        console.error("Supabase Error:", error.message);
      } else if (data) {
        setLeafCategories(data);
      }
      setLoading(false);
    };

    fetchFilteredLeafs();
  }, [subCategoryId]);

const handleLeafChange = (e) => {
  const leafId = e.target.value;
  const leaf = leafCategories.find(l => l.id === leafId);
  setSelectedLeaf(leaf);
  
  setUseCustomSizes(false);
  setCustomSizeInput("");

  setAttributes({ 
    ...attributes, 
    leaf_category_id: leafId, 
    specifications: {},
    color_images: {},
    color_image_files: {},
    has_colors: false,
    enable_colors: false,
    enable_sizes: false,
    enable_gender: false,
    enable_warranty: false,
    enable_weight: false,
    enable_dimensions: false,
    enable_variations: false,
    size_stock: {},
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
    colors: [],
    sizes: [],
    gender: [],
    target_audience: [],
    warranty_months: '',
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    marketplace_listings: [],
    condition: leaf?.condition_options?.[0] || 'new',
    custom_fields_values: {}
  });
};

  const getSizeOptions = () => {
    if (!selectedLeaf) return [];
    switch(selectedLeaf.size_format) {
      case 'S-M-L-XL':
        return ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
      case 'NUMERIC-36-45':
        return Array.from({length: 10}, (_, i) => (36 + i).toString());
      case 'NUMERIC-40-50':
        return Array.from({length: 11}, (_, i) => (40 + i).toString());
      case 'KIDS':
        return ["2T", "3T", "4T", "5T", "6", "7", "8", "9", "10", "11", "12"];
      case 'SHOE-UK':
        return ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"];
      case 'FREE':
        return ["Free Size"];
      case 'STANDARD':
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
  if (selectedLeaf?.color_required === false) {
    alert("Kategoria hii hairuhusu rangi");
    return;
  }
  
  let colorToAdd = selectedColorName;
  
  if (showCustomColor && customColorName.trim()) {
    colorToAdd = customColorName.trim();
    colorToAdd = colorToAdd.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  }
  
  if (!colorToAdd) {
    alert("Tafadhali chagua au andika jina la rangi");
    return;
  }
  
  const currentColors = attributes.colors || [];
  if (!currentColors.includes(colorToAdd)) {
    setAttributes(prev => ({ 
      ...prev, 
      colors: [...prev.colors || [], colorToAdd]
    }));
    
    setSelectedColorName("");
    setCustomColorName("");
    setShowCustomColor(false);
    
    alert(`✅ Rangi "${colorToAdd}" imeongezwa!`);
  } else {
    alert(`❌ Rangi "${colorToAdd}" tayari imeshaongezwa!`);
  }
};

  const removeColorTag = (colorToRemove) => {
    setAttributes({
      ...attributes,
      colors: attributes.colors.filter(c => c !== colorToRemove)
    });
  };

// ========== USEFFECT 1: GENERATE VARIATIONS ==========
useEffect(() => {
  if (!attributes.has_colors) {
    if (productVariations.length !== 0) {
      setProductVariations([]);
      setAttributes(prev => ({ ...prev, variations: [] }));
    }
    return;
  }
  
  const selectedColors = attributes.colors || [];
  const selectedSizes = attributes.sizes || [];

  if (selectedColors.length === 0) {
    if (productVariations.length !== 0) {
      setProductVariations([]);
      setAttributes(prev => ({ ...prev, variations: [] }));
    }
    return;
  }

  const sizesToUse = selectedSizes.length > 0 ? selectedSizes : [null];
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
    if (JSON.stringify(attributes.variations) !== newStr) {
      setAttributes(prev => ({ ...prev, variations: newVariations }));
    }
  }
  
}, [attributes.has_colors, attributes.colors, attributes.sizes, attributes.price, attributes.specifications]);

// ========== USEFFECT 2: UPDATE SIZE STOCK ==========
useEffect(() => {
  if (attributes.has_colors) return;
  if (!attributes.enable_sizes || attributes.sizes.length === 0) return;
  
  const totalStock = Object.values(attributes.size_stock || {}).reduce((acc, val) => acc + (Number(val) || 0), 0);
  if (totalStock !== Number(attributes.stock)) {
    setAttributes(prev => ({ ...prev, stock: totalStock }));
  }
  
}, [attributes.has_colors, attributes.enable_sizes, attributes.sizes, attributes.size_stock]);

// ========== USEFFECT 3: UPDATE TOTAL STOCK ==========
useEffect(() => {
  if (!attributes.has_colors) return;
  
  if (productVariations.length > 0) {
    const total = productVariations.reduce((acc, curr) => acc + (Number(curr.stock_quantity) || 0), 0);
    if (total !== Number(attributes.stock)) {
      setAttributes(prev => ({ ...prev, stock: total }));
    }
  }
}, [productVariations, attributes.has_colors]);

  useEffect(() => {
    if (productVariations.length > 0) {
      const total = productVariations.reduce((acc, curr) => acc + (Number(curr.stock_quantity) || 0), 0);
      if (total !== Number(attributes.stock)) {
        setAttributes(prev => ({ ...prev, stock: total }));
      }
    }
  }, [productVariations, setAttributes, attributes.stock]);

const capitalizeWords = (str) => {
  if (!str) return str;
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

const commonColors = [
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
];

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
    <div className={`product-attributes-container ${isMobile ? 'mobile-view' : 'desktop-view'}`}>
      
      {/* ========== SECTION 1: BASIC INFORMATION ========== */}
      <div className="form-section-header">
        <Info size={isMobile ? 18 : 20} />
        <h3 style={{ fontSize: isMobile ? '16px' : '18px' }}>Taarifa za Msingi</h3>
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
          rows={isMobile ? 3 : 4}
        />
      </div>

      {/* ========== SECTION 2: BRAND & CATEGORY ========== */}
      <div className="form-section-header">
        <Tag size={isMobile ? 18 : 20} />
        <h3 style={{ fontSize: isMobile ? '16px' : '18px' }}>Brand na Aina ya Bidhaa</h3>
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

      {/* ========== SECTION 3: DYNAMIC SPECS ========== */}
      {selectedLeaf && selectedLeaf.specs && selectedLeaf.specs.length > 0 && (
        <>
          <div className="form-section-header">
            {getCategoryIcon()}
            <h3 style={{ fontSize: isMobile ? '16px' : '18px' }}>Sifa za {selectedLeaf.name}</h3>
          </div>
          <div className="dynamic-specs-container">
            <div className={`specs-grid ${isMobile ? 'mobile-specs' : ''}`}>
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
      )}

      {/* ========== SECTION: CUSTOMIZATION CONTROLS ========== */}
      {selectedLeaf && (
        <>
          <div className="form-section-header">
            <Settings size={isMobile ? 18 : 20} />
            <h3 style={{ fontSize: isMobile ? '16px' : '18px' }}>Vipengele vya Bidhaa</h3>
          </div>
          
          <div className="customization-controls" style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "12px",
            padding: isMobile ? "12px" : "15px",
            backgroundColor: "#f8fafc",
            borderRadius: "12px",
            marginBottom: "20px"
          }}>
        
            {/* Gender Toggle */}
            <button type="button" onClick={() => {
              if (!attributes.enable_gender) {
                setAttributes({ ...attributes, enable_gender: true, gender: [], target_audience: [] });
              } else {
                setAttributes({ ...attributes, enable_gender: false, gender: [], target_audience: [] });
              }
            }} style={{
              display: "flex", alignItems: "center", gap: "10px", padding: "10px 15px",
              borderRadius: "8px", border: `2px solid ${attributes.enable_gender ? "#10b981" : "#cbd5e1"}`,
              backgroundColor: attributes.enable_gender ? "#d1fae5" : "white", cursor: "pointer"
            }}>
              <Heart size={18} color={attributes.enable_gender ? "#10b981" : "#64748b"} />
              <span style={{ flex: 1, textAlign: "left", fontWeight: attributes.enable_gender ? "600" : "400" }}>👥 Jinsia na Umri</span>
              {attributes.enable_gender && <CheckCircle2 size={16} color="#10b981" />}
            </button>

            {/* Warranty Toggle */}
            <button type="button" onClick={() => {
              if (!attributes.enable_warranty) {
                setAttributes({ ...attributes, enable_warranty: true, warranty_months: '' });
              } else {
                setAttributes({ ...attributes, enable_warranty: false, warranty_months: '' });
              }
            }} style={{
              display: "flex", alignItems: "center", gap: "10px", padding: "10px 15px",
              borderRadius: "8px", border: `2px solid ${attributes.enable_warranty ? "#10b981" : "#cbd5e1"}`,
              backgroundColor: attributes.enable_warranty ? "#d1fae5" : "white", cursor: "pointer"
            }}>
              <Shield size={18} color={attributes.enable_warranty ? "#10b981" : "#64748b"} />
              <span style={{ flex: 1, textAlign: "left", fontWeight: attributes.enable_warranty ? "600" : "400" }}>🛡️ Dhamana (Warranty)</span>
              {attributes.enable_warranty && <CheckCircle2 size={16} color="#10b981" />}
            </button>

            {/* Weight Toggle */}
            <button type="button" onClick={() => {
              if (!attributes.enable_weight) {
                setAttributes({ ...attributes, enable_weight: true, weight: '' });
              } else {
                setAttributes({ ...attributes, enable_weight: false, weight: '' });
              }
            }} style={{
              display: "flex", alignItems: "center", gap: "10px", padding: "10px 15px",
              borderRadius: "8px", border: `2px solid ${attributes.enable_weight ? "#10b981" : "#cbd5e1"}`,
              backgroundColor: attributes.enable_weight ? "#d1fae5" : "white", cursor: "pointer"
            }}>
              <Weight size={18} color={attributes.enable_weight ? "#10b981" : "#64748b"} />
              <span style={{ flex: 1, textAlign: "left", fontWeight: attributes.enable_weight ? "600" : "400" }}>⚖️ Uzito (Weight)</span>
              {attributes.enable_weight && <CheckCircle2 size={16} color="#10b981" />}
            </button>

            {/* Dimensions Toggle */}
            <button type="button" onClick={() => {
              if (!attributes.enable_dimensions) {
                setAttributes({ ...attributes, enable_dimensions: true, dimensions: { length: '', width: '', height: '' } });
              } else {
                setAttributes({ ...attributes, enable_dimensions: false, dimensions: { length: '', width: '', height: '' } });
              }
            }} style={{
              display: "flex", alignItems: "center", gap: "10px", padding: "10px 15px",
              borderRadius: "8px", border: `2px solid ${attributes.enable_dimensions ? "#10b981" : "#cbd5e1"}`,
              backgroundColor: attributes.enable_dimensions ? "#d1fae5" : "white", cursor: "pointer"
            }}>
              <Ruler size={18} color={attributes.enable_dimensions ? "#10b981" : "#64748b"} />
              <span style={{ flex: 1, textAlign: "left", fontWeight: attributes.enable_dimensions ? "600" : "400" }}>📐 Vipimo (Dimensions)</span>
              {attributes.enable_dimensions && <CheckCircle2 size={16} color="#10b981" />}
            </button>

            {/* Variations Toggle */}
            <button type="button" onClick={() => {
              if (!attributes.enable_variations) {
                setAttributes({ ...attributes, enable_variations: true, has_colors: true, enable_colors: true, colors: [] });
              } else {
                setAttributes({ ...attributes, enable_variations: false, has_colors: false, enable_colors: false, colors: [], sizes: [] });
              }
            }} style={{
              display: "flex", alignItems: "center", gap: "10px", padding: "10px 15px",
              borderRadius: "8px", border: `2px solid ${attributes.enable_variations ? "#10b981" : "#cbd5e1"}`,
              backgroundColor: attributes.enable_variations ? "#d1fae5" : "white", cursor: "pointer"
            }}>
              <Palette size={18} color={attributes.enable_variations ? "#10b981" : "#64748b"} />
              <span style={{ flex: 1, textAlign: "left", fontWeight: attributes.enable_variations ? "600" : "400" }}>🎨 Rangi na Ukubwa</span>
              {attributes.enable_variations && <CheckCircle2 size={16} color="#10b981" />}
            </button>
          </div>
        </>
      )}

      {/* ========== SECTION 4: SALES MODE & PRICING ========== */}
      <div className="form-section-header">
        <DollarSign size={isMobile ? 18 : 20} />
        <h3 style={{ fontSize: isMobile ? '16px' : '18px' }}>Mfumo wa Uuzaji na Bei</h3>
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
                <input type="number" placeholder="Kuanzia (pcs)" value={tier.from_qty} onChange={(e) => handleTierChange(index, "from_qty", e.target.value)} />
                <input type="number" placeholder="Mpaka (pcs)" value={tier.to_qty} onChange={(e) => handleTierChange(index, "to_qty", e.target.value)} />
                <input type="number" placeholder="Bei (TZS)" value={tier.unit_price} onChange={(e) => handleTierChange(index, "unit_price", e.target.value)} />
                <button type="button" onClick={() => removePriceTier(index)} style={{
                  background: "#ef4444", color: "white", border: "none", borderRadius: "6px",
                  width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                }}><Trash2 size={16} /></button>
              </div>
            ))}
            <button type="button" onClick={addPriceTier} style={{
              marginTop: "10px", padding: "8px 16px", backgroundColor: "#10b981",
              color: "white", border: "none", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px"
            }}><Plus size={16} /> Ongeza Kiwango kingine</button>
          </div>
        )}

        <div className="minimum-order-quantity" style={{ marginTop: "15px" }}>
          <label className="field-label-small">Kiwango cha chini cha Agizo (MOQ)</label>
          <input type="number" className="text-input" placeholder="Idadi ya chini inayoruhusiwa kwa agizo moja"
            value={attributes.moq || ""} onChange={(e) => setAttributes({ ...attributes, moq: e.target.value })} />
          <small style={{ color: "#6b7280", fontSize: "12px", marginTop: "4px", display: "block" }}>Acha wazi kama hakuna kiwango cha chini</small>
        </div>
      </div>

      {/* ========== SECTION 5: PRICE & STOCK ========== */}
      <div className="form-section-header">
        <ShoppingBag size={isMobile ? 18 : 20} />
        <h3 style={{ fontSize: isMobile ? '16px' : '18px' }}>Bei na Stock</h3>
      </div>
      
      <div className="form-grid-two">
        {attributes.is_retail && (
          <div className="form-group">
            <label className="field-label-main">Bei ya Rejareja (TZS) <span className="required-star">*</span></label>
            <input type="number" className="text-input" placeholder="Mfano: 25000"
              value={attributes.price || ""} onChange={(e) => setAttributes({ ...attributes, price: e.target.value })} />
          </div>
        )}

        <div className="form-group">
          <label className="field-label-main">Jumla ya Stock <span className="required-star">*</span></label>
          <input type="number" className="text-input" placeholder="Idadi ya bidhaa zilizopo"
            value={attributes.stock || ""} onChange={(e) => setAttributes({ ...attributes, stock: e.target.value })} min="0" />
          {productVariations.length > 0 && (
            <small style={{ color: "#10b981", fontSize: "12px", marginTop: "4px", display: "block" }}>
              ✅ Stock inahesabiwa moja kwa moja ({productVariations.reduce((acc, v) => acc + (Number(v.stock_quantity) || 0), 0)})
            </small>
          )}
        </div>
      </div>

      {/* Debug info - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f3f4f6", borderRadius: "8px", fontSize: "12px" }}>
          <details>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>🔧 Debug Information</summary>
            <div style={{ marginTop: "10px" }}>
              <p><strong>Selected Leaf:</strong> {selectedLeaf?.name || "None"}</p>
              <p><strong>Colors count:</strong> {attributes.colors?.length || 0}</p>
              <p><strong>Sizes count:</strong> {attributes.sizes?.length || 0}</p>
              <p><strong>Total Stock:</strong> {attributes.stock || 0}</p>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
export default React.memo(ProductAttributes);