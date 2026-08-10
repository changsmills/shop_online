import React, { useState, useEffect } from "react";
import { 
  Zap, CheckCircle2, Loader2, AlertCircle, Package, Info, Camera, 
  Plus, Trash2, Ruler, Weight, Shield, Tag, Globe, Calendar,
  Wrench, Shirt, Footprints, Smartphone, Home, ShoppingBag, Truck,
  DollarSign, Layers, Grid, Heart, Star, Award, Clock, Settings, 
  Palette
} from "lucide-react";
import axios from 'axios';
import '../ProductAttributes.css';

function ProductAttributes({ attributes, setAttributes, subCategoryId, leafCategories = [] }) {
  const [productVariations, setProductVariations] = useState([]);
  const [currentColor, setCurrentColor] = useState("#2563eb");
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLeaf, setSelectedLeaf] = useState(null);
  const [customSizeInput, setCustomSizeInput] = useState("");
  const [useCustomSizes, setUseCustomSizes] = useState(false);
  const [selectedColorName, setSelectedColorName] = useState("");
  const [customColorName, setCustomColorName] = useState("");
  const [showCustomColor, setShowCustomColor] = useState(false);
  const [weightUnit, setWeightUnit] = useState("kg");
  const [commonColors, setCommonColors] = useState([
    "Red", "Blue", "Green", "Yellow", "Purple", "Black", "White", "Gray", 
    "Orange", "Pink", "Brown", "Cyan", "Magenta", "Olive", "Maroon", 
    "Navy", "Teal", "Silver", "Gold", "Khaki", "Lavender", "Coral", 
    "Turquoise", "Beige", "Crimson", "Indigo", "Violet", "Lime", "Salmon", 
    "Plum", "Peach", "Mint", "Rose", "Amber", "Ivory", "Charcoal", "Tan", 
    "Rust", "Burgundy", "Forest Green", "Sky Blue", "Royal Blue", "Navy Blue", 
    "Baby Blue", "Midnight Blue", "Olive Green", "Emerald", "Moss Green", 
    "Neon Green", "Sea Green", "Golden", "Brass", "Copper", "Bronze", 
    "Mustard", "Lilac", "Mauve", "Fuchsia", "Hot Pink", "Dark Red", 
    "Wine", "Chocolate", "Coffee", "Cream", "Off White"
  ]);

  const API_BASE_URL = "http://127.0.0.1:8000/api";

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const { data } = await axios.get(`${API_BASE_URL}/brands/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBrands(data.results || data || []);
      } catch (error) {
        console.warn("⚠️ Brands endpoint haipo.");
        setBrands([]);
      }
    };
    fetchBrands();
  }, []);

  const handleLeafChange = (e) => {
    const leafId = e.target.value;
    const leaf = leafCategories.find(l => l.id === leafId);
    let conditionOptions = [];
    if (leaf && leaf.condition_options) {
      if (Array.isArray(leaf.condition_options)) conditionOptions = leaf.condition_options;
      else if (typeof leaf.condition_options === 'string') {
        try {
          const parsed = JSON.parse(leaf.condition_options);
          conditionOptions = Array.isArray(parsed) ? parsed : [leaf.condition_options];
        } catch(e) { conditionOptions = [leaf.condition_options]; }
      } else {
        conditionOptions = [leaf.condition_options];
      }
    }
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
      size_format: leaf?.size_format || 'standard',
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
      weight_unit: 'kg',
      dimensions: { length: '', width: '', height: '' },
      marketplace_listings: [],
      condition: conditionOptions.length > 0 ? conditionOptions[0] : 'new',
      custom_fields_values: {},
      price_per_meter: '',
      price_per_foot: '',
    });
  };

  const togglePresetSize = (size) => {
    const sizes = attributes.sizes || [];
    if (sizes.includes(size)) setAttributes({ ...attributes, sizes: sizes.filter(s => s !== size) });
    else setAttributes({ ...attributes, sizes: [...sizes, size] });
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
    setAttributes({ ...attributes, sizes: (attributes.sizes || []).filter(s => s !== size) });
  };

  const addColorTag = () => {
    if (selectedLeaf?.color_required === false) { alert("⚠️ Kategoria hii hairuhusu rangi"); return; }
    let colorToAdd = selectedColorName;
    if (showCustomColor && customColorName.trim()) {
      colorToAdd = customColorName.trim().toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    }
    if (!colorToAdd) { alert("⚠️ Tafadhali chagua au andika jina la rangi"); return; }
    const currentColors = attributes.colors || [];
    if (currentColors.includes(colorToAdd)) { alert(`❌ Rangi "${colorToAdd}" tayari imeshaongezwa!`); return; }
    setAttributes(prev => ({ ...prev, colors: [...prev.colors || [], colorToAdd] }));
    if (!commonColors.includes(colorToAdd)) setCommonColors(prev => [...prev, colorToAdd]);
    setSelectedColorName("");
    setCustomColorName("");
    setShowCustomColor(false);
    alert(`✅ Rangi "${colorToAdd}" imeongezwa mafanikio!`);
  };

  const removeColorTag = (colorToRemove) => {
    setAttributes({ ...attributes, colors: attributes.colors.filter(c => c !== colorToRemove) });
  };

  useEffect(() => {
    if (!attributes.has_colors) {
      if (productVariations.length !== 0) { setProductVariations([]); setAttributes(prev => ({ ...prev, variations: [] })); }
      return;
    }
    const selectedColors = attributes.colors || [];
    const selectedSizes = attributes.sizes || [];
    if (selectedColors.length === 0) {
      if (productVariations.length !== 0) { setProductVariations([]); setAttributes(prev => ({ ...prev, variations: [] })); }
      return;
    }
    const sizesToUse = selectedSizes.length > 0 ? selectedSizes : [null];
    const newVariations = [];
    selectedColors.forEach(color => {
      sizesToUse.forEach(size => {
        const existing = (attributes.variations || []).find(v => v.color_name === color && v.size_value === size);
        const dynamicSpecsForVariation = { ...(attributes.specifications || {}) };
        dynamicSpecsForVariation.color = color;
        if (size) dynamicSpecsForVariation.size = size;
        if (existing) {
          newVariations.push({ ...existing, attributes: dynamicSpecsForVariation });
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
      setProductVariations(newVariations);
      setAttributes(prev => ({ ...prev, variations: newVariations, has_colors: newVariations.length > 0 ? true : prev.has_colors }));
    }
  }, [attributes.has_colors, attributes.colors, attributes.sizes, attributes.price, attributes.specifications]);

  useEffect(() => {
    if (attributes.has_colors) return;
    if (!attributes.enable_sizes || attributes.sizes.length === 0) return;
    const totalStock = Object.values(attributes.size_stock || {}).reduce((acc, val) => acc + (Number(val) || 0), 0);
    if (totalStock !== Number(attributes.stock)) setAttributes(prev => ({ ...prev, stock: totalStock }));
  }, [attributes.has_colors, attributes.enable_sizes, attributes.sizes, attributes.size_stock]);

  useEffect(() => {
    if (!attributes.has_colors) return;
    if (productVariations.length > 0) {
      const total = productVariations.reduce((acc, curr) => acc + (Number(curr.stock_quantity) || 0), 0);
      if (total !== Number(attributes.stock)) setAttributes(prev => ({ ...prev, stock: total }));
    }
  }, [productVariations, attributes.has_colors]);

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
    setAttributes({ ...attributes, price_tiers: [...currentTiers, { from_qty: '', to_qty: '', unit_price: '' }] });
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
      {/* SECTION 1: BASIC INFORMATION */}
      <div className="form-section-header">
        <Info size={20} />
        <h3>Taarifa za Msingi</h3>
      </div>
      <div className="form-group">
        <label className="field-label">
          <Package size={18} /> Jina la Bidhaa <span className="required-star">*</span>
        </label>
        <input className="text-input" value={attributes.name || ""} onChange={(e) => setAttributes({ ...attributes, name: e.target.value })} placeholder="Mfano: iPhone 15 Pro, Nike Air Max..." />
      </div>
      <div className="form-group">
        <label className="field-label"><Info size={18} /> Maelezo ya Bidhaa</label>
        <textarea className="text-input textarea-input" value={attributes.description || ""} onChange={(e) => setAttributes({ ...attributes, description: e.target.value })} placeholder="Andika maelezo ya kina..." rows={4} />
      </div>

      {/* SECTION 2: BRAND & CATEGORY */}
      <div className="form-section-header">
        <Tag size={20} />
        <h3>Brand na Aina ya Bidhaa</h3>
      </div>
      <div className="form-grid-two">
        <div className="form-group">
          <label className="field-label-small">Brand</label>
          <select className="select-input" value={attributes.brand_id || ""} onChange={(e) => setAttributes({ ...attributes, brand_id: e.target.value })}>
            <option value="">Chagua Brand...</option>
            {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="field-label-small">Aina Maalum</label>
          <select className={`select-input ${!subCategoryId ? 'disabled' : ''}`} disabled={!subCategoryId || loading} value={attributes.leaf_category_id || ""} onChange={handleLeafChange}>
            {loading ? <option disabled>Inapakia...</option> : (
              <>
                <option value="">-- Chagua Aina --</option>
                {leafCategories.map((leaf) => <option key={leaf.id} value={leaf.id}>{leaf.name}</option>)}
              </>
            )}
          </select>
          {!subCategoryId && <span className="error-hint"><AlertCircle size={12} /> Chagua kategoria ya juu kwanza</span>}
        </div>
      </div>

      {/* SECTION 3: DYNAMIC SPECS */}
      {selectedLeaf && selectedLeaf.specs && (
        <>
          <div className="form-section-header">
            {getCategoryIcon()}
            <h3>Sifa za {selectedLeaf.name}</h3>
          </div>
          <div className="dynamic-specs-container">
            <div className="specs-grid">
              {(() => {
                let specsArray = [];
                try { specsArray = typeof selectedLeaf.specs === 'string' ? JSON.parse(selectedLeaf.specs) : selectedLeaf.specs; } catch (e) {}
                if (!Array.isArray(specsArray)) return null;
                return specsArray.map((specName, idx) => {
                  const cleanKey = specName.split("(")[0].trim();
                  const hasOptions = specName.includes("(") && specName.includes(")");
                  let label = specName; let options = [];
                  if (hasOptions) {
                    label = specName.split("(")[0].trim();
                    const rawOptions = specName.match(/\(([^)]+)\)/)[1];
                    options = rawOptions.split("/").map((opt) => opt.trim());
                  }
                  if (label.toLowerCase().includes("size") || label.toLowerCase().includes("ukubwa")) return null;
                  return (
                    <div key={idx} className="spec-item">
                      <label className="spec-label">{label}</label>
                      {hasOptions ? (
                        <select className="select-input" value={attributes.specifications?.[cleanKey] || ""} onChange={(e) => setAttributes({ ...attributes, specifications: { ...attributes.specifications, [cleanKey]: e.target.value } })}>
                          <option value="">-- Chagua --</option>
                          {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : (
                        <input className="text-input" type="text" placeholder={`Weka ${label}...`} value={attributes.specifications?.[cleanKey] || ""} onChange={(e) => setAttributes({ ...attributes, specifications: { ...attributes.specifications, [cleanKey]: e.target.value } })} />
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </>
      )}

      {/* SECTION: CUSTOMIZATION CONTROLS */}
      {selectedLeaf && (
        <>
          <div className="form-section-header">
            <Settings size={20} />
            <h3>Vipengele vya Bidhaa (Chagua Unavyohitaji)</h3>
          </div>
          <div className="customization-controls">
            {/* Size Format */}
            <div className="size-format-selector-wrapper">
              <label className="field-label-small">📏 Mfumo wa Ukubwa / Vipimo</label>
              <select className="select-input size-format-select" value={attributes.size_format || 'standard'} onChange={(e) => {
                const format = e.target.value;
                setAttributes({ 
                  ...attributes, 
                  size_format: format,
                  ...(format === 'length' ? { dimensions: { length: '', width: '', height: '' }, sizes: [], size_stock: {} } : {}),
                  ...(format === 'dimensions' ? { price_per_meter: '', price_per_foot: '', sizes: [], size_stock: {} } : {}),
                  ...(format === 'free' ? { sizes: [], size_stock: {}, dimensions: { length: '', width: '', height: '' }, price_per_meter: '', price_per_foot: '' } : {}),
                });
              }}>
                <option value="standard">📏 Kawaida (S, M, L, XL)</option>
                <option value="numeric">🔢 Nambari (36, 37, 38...)</option>
                <option value="free">📦 Hakuna Ukubwa</option>
                <option value="dimensions">📐 Vipimo (Makabati, Meza)</option>
                <option value="length">📏 Urefu (Mazulia, Vitambaa)</option>
              </select>
              <small className="helper-text">💡 Chagua mfumo unaofaa kwa aina ya bidhaa yako</small>
            </div>

            {/* Toggle Buttons */}
            <button type="button" className={`custom-toggle-btn ${attributes.enable_gender ? 'active' : ''}`} onClick={() => setAttributes({ ...attributes, enable_gender: !attributes.enable_gender, gender: [], target_audience: [] })}>
              <Heart size={18} /> <span className="toggle-text">👥 Jinsia na Umri</span>
              {attributes.enable_gender && <CheckCircle2 size={16} />}
            </button>
            <button type="button" className={`custom-toggle-btn ${attributes.enable_warranty ? 'active' : ''}`} onClick={() => setAttributes({ ...attributes, enable_warranty: !attributes.enable_warranty, warranty_months: '' })}>
              <Shield size={18} /> <span className="toggle-text">🛡️ Dhamana (Warranty)</span>
              {attributes.enable_warranty && <CheckCircle2 size={16} />}
            </button>
            <button type="button" className={`custom-toggle-btn ${attributes.enable_weight ? 'active' : ''}`} onClick={() => setAttributes({ ...attributes, enable_weight: !attributes.enable_weight, weight: '' })}>
              <Weight size={18} /> <span className="toggle-text">⚖️ Uzito (Weight)</span>
              {attributes.enable_weight && <CheckCircle2 size={16} />}
            </button>
            <button type="button" className={`custom-toggle-btn ${attributes.enable_dimensions ? 'active' : ''}`} onClick={() => setAttributes({ ...attributes, enable_dimensions: !attributes.enable_dimensions, dimensions: { length: '', width: '', height: '' } })}>
              <Ruler size={18} /> <span className="toggle-text">📐 Vipimo (Dimensions)</span>
              {attributes.enable_dimensions && <CheckCircle2 size={16} />}
            </button>
            <button type="button" className={`custom-toggle-btn ${attributes.enable_variations ? 'active' : ''}`} onClick={() => setAttributes({ ...attributes, enable_variations: !attributes.enable_variations, has_colors: !attributes.has_colors, enable_colors: !attributes.enable_colors, colors: [] })}>
              <Palette size={18} /> <span className="toggle-text">🎨 Rangi na Ukubwa (Variations)</span>
              {attributes.enable_variations && <CheckCircle2 size={16} />}
            </button>
          </div>
        </>
      )}

      {/* SECTION 4: PRODUCT CONDITION */}
      {selectedLeaf && selectedLeaf.condition_options && Array.isArray(selectedLeaf.condition_options) && selectedLeaf.condition_options.length > 1 && (
        <>
          <div className="form-section-header"><Tag size={20} /><h3>Hali ya Bidhaa</h3></div>
          <div className="dynamic-specs-container">
            <div className="specs-grid">
              <div className="spec-full-width">
                <div className="spec-buttons-group">
                  {selectedLeaf.condition_options.map(cond => (
                    <button key={cond} type="button" className={`spec-pill-button ${attributes.condition === cond ? "selected" : ""}`} onClick={() => setAttributes({ ...attributes, condition: cond })}>
                      {cond === 'new' && '🆕 Mpya'}{cond === 'used' && '📦 Iliyotumika'}{cond === 'refurbished' && '🔧 Refurbished'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* SECTION 5 - 8: WARRANTY, WEIGHT, DIMENSIONS, GENDER */}
      {selectedLeaf && attributes.enable_warranty && (
        <><div className="form-section-header"><Shield size={20} /><h3>Dhamana (Warranty)</h3></div>
        <div className="dynamic-specs-container"><div className="specs-grid"><div className="spec-full-width"><select className="select-input" value={attributes.warranty_months || ""} onChange={(e) => setAttributes({ ...attributes, warranty_months: e.target.value })}>
          <option value="">Hakuna Dhamana</option><option value="3">Miezi 3</option><option value="6">Miezi 6</option><option value="12">Mwaka 1</option><option value="24">Miaka 2</option><option value="36">Miaka 3</option><option value="60">Miaka 5</option>
        </select></div></div></div></>
      )}
      {selectedLeaf && attributes.enable_weight && (
        <><div className="form-section-header"><Weight size={20} /><h3>Uzito wa Bidhaa</h3></div>
        <div className="dynamic-specs-container"><div className="specs-grid"><div className="spec-full-width"><div className="flex-row gap-10"><input type="number" step="0.1" className="text-input" placeholder="Uzito" value={attributes.weight || ""} onChange={(e) => setAttributes({ ...attributes, weight: e.target.value })} /> <select className="select-input width-100" value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)}><option value="kg">Kilogramu (kg)</option><option value="g">Gramu (g)</option><option value="lb">Pound (lb)</option></select></div></div></div></div></>
      )}
      {selectedLeaf && attributes.enable_dimensions && (
        <><div className="form-section-header"><Ruler size={20} /><h3>Vipimo vya Bidhaa</h3></div>
        <div className="dynamic-specs-container"><div className="specs-grid"><div className="spec-full-width"><div className="flex-row gap-10 flex-wrap"><input type="number" step="0.1" className="text-input" placeholder="Urefu (cm)" value={attributes.dimensions?.length || ""} onChange={(e) => setAttributes({ ...attributes, dimensions: { ...attributes.dimensions, length: e.target.value } })} /><input type="number" step="0.1" className="text-input" placeholder="Upana (cm)" value={attributes.dimensions?.width || ""} onChange={(e) => setAttributes({ ...attributes, dimensions: { ...attributes.dimensions, width: e.target.value } })} /><input type="number" step="0.1" className="text-input" placeholder="Kimo (cm)" value={attributes.dimensions?.height || ""} onChange={(e) => setAttributes({ ...attributes, dimensions: { ...attributes.dimensions, height: e.target.value } })} /></div><small className="helper-text">{selectedLeaf.measurement_unit === 'metric' ? 'Sentimita (cm)' : 'Inchi (in)'}</small></div></div></div></>
      )}
      {selectedLeaf && attributes.enable_gender && (
        <><div className="form-section-header"><Heart size={20} /><h3>Lengo la Bidhaa</h3></div>
        <div className="dynamic-specs-container"><div className="specs-grid"><div className="spec-full-width"><label className="spec-label">Jinsia:</label><div className="spec-buttons-group">{["Male", "Female", "Unisex"].map((g) => <button key={g} type="button" className={`spec-pill-button ${(attributes.gender || []).includes(g) ? "selected" : ""}`} onClick={() => { const current = attributes.gender || []; const next = current.includes(g) ? current.filter((i) => i !== g) : [...current, g]; setAttributes({ ...attributes, gender: next }); }}>{g === 'Male' && '👨 Wanaume'}{g === 'Female' && '👩 Wanawake'}{g === 'Unisex' && '👥 Wote'}</button>)}</div></div><div className="spec-full-width"><label className="spec-label">Kikundi cha Umri:</label><div className="spec-buttons-group">{["Kids", "Youth", "Adults", "All"].map((a) => <button key={a} type="button" className={`spec-pill-button ${(attributes.target_audience || []).includes(a) ? "selected" : ""}`} onClick={() => { const current = attributes.target_audience || []; const next = current.includes(a) ? current.filter((i) => i !== a) : [...current, a]; setAttributes({ ...attributes, target_audience: next }); }}>{a === 'Kids' && '🧒 Watoto'}{a === 'Youth' && '🧑 Vijana'}{a === 'Adults' && '👨‍🦱 Watu Wazima'}{a === 'All' && '👨‍👩‍👧‍👦 Wote'}</button>)}</div></div></div></div></>
      )}

      {/* SECTION 9: RANGI NA UKUBWA */}
      {selectedLeaf && attributes.enable_variations && (
        <>
          <div className="form-section-header"><Palette size={20} /><h3>Rangi na Ukubwa (Sizes) - Kila Rangi ina Ukubwa na Stock Zake</h3></div>
          <div className="dynamic-specs-container"><div className="specs-grid"><div className="spec-full-width">
            
            <div className="color-input-wrapper">
              <label className="spec-label">🎨 Ongeza Rangi Mpya</label>
              <div className="color-mode-buttons">
                <button type="button" className={`color-mode-btn ${!showCustomColor ? 'active' : ''}`} onClick={() => { setShowCustomColor(false); setCustomColorName(""); }}>📋 Chagua kutoka list</button>
                <button type="button" className={`color-mode-btn ${showCustomColor ? 'active' : ''}`} onClick={() => { setShowCustomColor(true); setSelectedColorName(""); }}>✏️ Andika rangi yangu</button>
              </div>
              <div className="color-input-row">
                {!showCustomColor ? (
                  <div className="flex-row gap-10 flex-wrap">
                    <select className="select-input flex-2" value={selectedColorName} onChange={(e) => setSelectedColorName(e.target.value)}>
                      <option value="">-- Chagua jina la rangi --</option>
                      {commonColors.slice(0, 30).map(color => <option key={color} value={color}>{color}</option>)}
                      {commonColors.length > 30 && <option disabled>--- na rangi {commonColors.length - 30} zaidi ---</option>}
                    </select>
                    <input type="color" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} className="color-picker-box" />
                    <button type="button" className={`btn-add-color ${selectedColorName ? 'active' : ''}`} onClick={addColorTag} disabled={!selectedColorName}><Plus size={16} /> Ongeza Rangi</button>
                  </div>
                ) : (
                  <div className="flex-col gap-10">
                    <div className="flex-row gap-10 flex-wrap">
                      <input type="text" placeholder="Andika jina la rangi" value={customColorName} onChange={(e) => { let value = e.target.value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()); setCustomColorName(value); setSelectedColorName(value); }} className="text-input flex-2" autoFocus />
                      <input type="color" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} className="color-picker-box" />
                      <button type="button" className={`btn-add-color ${customColorName.trim() ? 'active' : ''}`} onClick={addColorTag} disabled={!customColorName.trim()}><Plus size={16} /> Ongeza Rangi</button>
                    </div>
                    <div className="color-examples"><span>💡 Mifano: </span><span>Neon Green</span><span>Metallic Blue</span><span>Cream White</span><span>Matte Black</span></div>
                  </div>
                )}
              </div>
              <div className="color-helper-box"><strong>Kidokezo:</strong> Bonyeza "Andika rangi yangu" kuweka rangi yoyote unayotaka.</div>
            </div>

            {/* LIST YA RANGI ZOTE */}
            {attributes.colors?.length > 0 && (
              <div className="colors-list-wrapper">
                {attributes.colors.map((color, colorIndex) => {
                  const colorStock = attributes.size_stock?.[color] || {};
                  return (
                    <div key={color} className="color-card">
                      <div className="color-header">
                        <div className="color-header-left">
                          <div className="color-swatch" style={{ backgroundColor: color }} />
                          <div><span className="color-title">{color.toUpperCase()}</span><div className="color-status">{attributes.color_images?.[color] ? "✅ Imepakiwa" : "❌ Hajapakiwa"}</div></div>
                        </div>
                        <button type="button" className="btn-delete-color" onClick={() => {
                          const newColors = attributes.colors.filter(c => c !== color);
                          const newSizeStock = { ...(attributes.size_stock || {}) }; delete newSizeStock[color];
                          const newColorImages = { ...(attributes.color_images || {}) }; delete newColorImages[color];
                          setAttributes({ ...attributes, colors: newColors, size_stock: newSizeStock, color_images: newColorImages });
                        }}><Trash2 size={14} /> Futa Rangi</button>
                      </div>

                      <div className="size-add-wrapper">
                        <label>📏 Ongeza Ukubwa kwa {color.toUpperCase()}:</label>
                        <div className="flex-row gap-10 flex-wrap">
                          <select className="select-input flex-1" value="" onChange={(e) => {
                            if (e.target.value === "CUSTOM") return;
                            const presetSizes = e.target.value.split(",");
                            const newSizeStock = { ...(attributes.size_stock || {}) };
                            if (!newSizeStock[color]) newSizeStock[color] = {};
                            presetSizes.forEach(size => { if (newSizeStock[color][size] === undefined) newSizeStock[color][size] = 0; });
                            setAttributes({ ...attributes, size_stock: newSizeStock });
                            e.target.value = "";
                          }}>
                            <option value="">-- Chagua template ya ukubwa --</option>
                            <option value="XS,S,M,L,XL,XXL,XXXL">👕 Nguo (XS, S, M, L, XL, XXL, XXXL)</option>
                            <option value="36,37,38,39,40,41,42,43,44,45">👟 Viatu (36 - 45)</option>
                            <option value="40,41,42,43,44,45,46,47,48,49,50">👟 Viatu (40 - 50)</option>
                            <option value="2T,3T,4T,5T,6,7,8,9,10,11,12">🧒 Watoto (2T - 12)</option>
                            <option value="UK3,UK4,UK5,UK6,UK7,UK8,UK9,UK10,UK11">🇬🇧 Viatu UK</option>
                            <option value="Free Size">📏 Free Size</option>
                            <option value="CUSTOM">✏️ SIZE YANGU MWENYEWE</option>
                          </select>
                          <div className="flex-row gap-5 flex-2">
                            <input type="text" className="text-input flex-1" placeholder="Ukubwa wako (mfano: XXL, 42)" value={customSizeInput} onChange={(e) => setCustomSizeInput(e.target.value)} />
                            <button type="button" className="btn-primary flex-shrink-0" onClick={() => {
                              if (customSizeInput.trim()) {
                                const newSize = customSizeInput.trim().toUpperCase();
                                const newSizeStock = { ...(attributes.size_stock || {}) };
                                if (!newSizeStock[color]) newSizeStock[color] = {};
                                if (newSizeStock[color][newSize] === undefined) newSizeStock[color][newSize] = 0;
                                setAttributes({ ...attributes, size_stock: newSizeStock });
                                setCustomSizeInput("");
                              }
                            }}><Plus size={14} /> Ongeza</button>
                          </div>
                        </div>
                      </div>

                      {/* JEDWALI LA STOCK KWA RANGI HII */}
                      {Object.keys(colorStock).length > 0 && (
                        <div className="stock-grid-wrapper">
                          <label>📊 Stock kwa Kila Ukubwa:</label>
                          <div className="stock-grid">
                            {Object.entries(colorStock).map(([size, stock]) => (
                              <div key={size} className="stock-item">
                                <span className="stock-size">{size}</span>
                                <div className="stock-controls">
                                  <input type="number" min="0" className="stock-input" placeholder="Stock" value={stock} onChange={(e) => {
                                    const newStock = parseInt(e.target.value) || 0;
                                    const newSizeStock = { ...(attributes.size_stock || {}) };
                                    if (!newSizeStock[color]) newSizeStock[color] = {};
                                    newSizeStock[color][size] = newStock;
                                    setAttributes({ ...attributes, size_stock: newSizeStock });
                                  }} />
                                  <button type="button" className="btn-remove-stock" onClick={() => {
                                    const newSizeStock = { ...(attributes.size_stock || {}) };
                                    if (newSizeStock[color]) { delete newSizeStock[color][size]; if (Object.keys(newSizeStock[color]).length === 0) delete newSizeStock[color]; }
                                    setAttributes({ ...attributes, size_stock: newSizeStock });
                                  }}>×</button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="stock-total color-total">
                            <span>📦 Jumla ya {color.toUpperCase()}:</span>
                            <strong>{Object.values(colorStock).reduce((sum, val) => sum + (Number(val) || 0), 0)} pcs</strong>
                          </div>
                        </div>
                      )}

                      {/* PICHA YA RANGI */}
                      <div className="color-image-upload">
                        <label>🖼️ Picha ya Rangi {color.toUpperCase()} (Marketplace)</label>
                        <div className="flex-row gap-15 flex-wrap">
                          <input id={`color-img-${color}`} type="file" accept="image/*" hidden onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const imageUrl = URL.createObjectURL(file);
                              setAttributes(prev => ({ ...prev, color_images: { ...(prev.color_images || {}), [color]: imageUrl }, color_image_files: { ...(prev.color_image_files || {}), [color]: file } }));
                            }
                          }} />
                          <label htmlFor={`color-img-${color}`} className={`image-upload-box ${attributes.color_images?.[color] ? 'uploaded' : ''}`}>
                            {attributes.color_images?.[color] ? <img src={attributes.color_images[color]} alt={color} /> : <><Camera size={20} /><span>Weka Picha</span></>}
                          </label>
                          <div className="image-status-text">{attributes.color_images?.[color] ? "✅ Picha imepakiwa." : "⚠️ Picha inahitajika kwa rangi hii"}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* JUMLA KUU YA STOCK */}
            {attributes.colors?.length > 0 && (
              <div className="grand-total-stock">
                <div><span>📊 Jumla Kuu ya Bidhaa:</span><span className="grand-total-number">{attributes.colors.reduce((total, color) => { const colorStock = attributes.size_stock?.[color] || {}; return total + Object.values(colorStock).reduce((sum, val) => sum + (Number(val) || 0), 0); }, 0)} pcs</span></div>
                <div><span>🎨 Rangi:</span><span>{attributes.colors.length}</span></div>
              </div>
            )}
            <div className="helper-text-block"><strong>Muundo:</strong> Kila rangi ina ukubwa wake na stock tofauti.<br />📌 Unaweza kuongeza rangi nyingi...<br />🖼️ Kila rangi ina picha yake moja...<br />📊 Jumla ya stock inahesabiwa moja kwa moja.</div>
          </div></div></div></>
      )}

      {/* SECTION 10: MARKETPLACE LISTING */}
      {selectedLeaf && (
        <>
          <div className="form-section-header"><ShoppingBag size={20} /><h3>Mauzo Sokoni (Marketplace Listing) - {selectedLeaf.name}</h3><span className="required-badge">* Lazima kujaza</span></div>
          <div className="marketplace-container">
            <div className="marketplace-warning"><AlertCircle size={18} /><span>⚠️ Taarifa za Marketplace ni lazima zijazwe kwa bidhaa hii!</span></div>
            <div className="marketplace-card">
              <h4>📦 Listing ya {selectedLeaf.name}</h4>
              <div className="form-group"><label className="field-label-small required">Jina la Bidhaa Sokoni <span className="required-star">*</span></label><input type="text" className="text-input" placeholder="Mfano: Nike Air Max 2024" value={attributes.marketplace_product_name || ""} onChange={(e) => setAttributes({ ...attributes, marketplace_product_name: e.target.value })} /></div>
              <div className="form-group"><label className="field-label-small required">Bei ya Msingi (TZS) <span className="required-star">*</span></label><input type="number" className="text-input" placeholder="Bei ya kuuza sokoni" value={attributes.marketplace_base_price || attributes.price || ""} onChange={(e) => setAttributes({ ...attributes, marketplace_base_price: e.target.value })} /><small>Bei ya kuuza kwa bidhaa hii</small></div>
              
              {attributes.has_colors && attributes.colors?.length > 0 && (
                <div className="form-group"><label className="field-label-small required">Picha za Rangi <span className="required-star">*</span></label>
                  <div className="color-image-grid">
                    {attributes.colors.map(color => {
                      const colorImage = attributes.color_images?.[color] || null;
                      const colorStock = attributes.size_stock?.[color] || {};
                      const totalStock = Object.values(colorStock).reduce((sum, val) => sum + (Number(val) || 0), 0);
                      return (
                        <div key={color} className="color-image-grid-item">
                          <div className="flex-col items-center"><div className="small-color-swatch" style={{ backgroundColor: color }} /><div className="color-grid-text">{color.toUpperCase()}</div><div className="stock-mini-text">Stock: {totalStock} pcs</div></div>
                          <div><input id={`marketplace-color-${color}`} type="file" accept="image/*" hidden onChange={(e) => { const file = e.target.files[0]; if (file) { const imageUrl = URL.createObjectURL(file); setAttributes(prev => ({ ...prev, color_images: { ...(prev.color_images || {}), [color]: imageUrl }, color_image_files: { ...(prev.color_image_files || {}), [color]: file } })); } }} /><label htmlFor={`marketplace-color-${color}`} className={`image-upload-box small-upload ${colorImage ? 'uploaded' : ''}`}>{colorImage ? <img src={colorImage} alt={color} /> : <><Camera size={16} /><span>Weka</span></>}</label></div>
                          <div className="image-status-text">{colorImage ? "✅ Picha imepakiwa" : "⚠️ Inahitajika"}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {!attributes.has_colors && (
                <div className="form-group"><label className="field-label-small required">Picha ya Bidhaa <span className="required-star">*</span></label>
                  <div className="main-image-upload-wrapper">
                    <input id="marketplace-main-image" type="file" accept="image/*" hidden onChange={(e) => { const file = e.target.files[0]; if (file) setAttributes({ ...attributes, marketplace_main_image: URL.createObjectURL(file), marketplace_main_image_file: file }); }} />
                    <label htmlFor="marketplace-main-image" className={`image-upload-box main-image-box ${attributes.marketplace_main_image ? 'uploaded' : ''}`}>
                      {attributes.marketplace_main_image ? <img src={attributes.marketplace_main_image} alt="Product" /> : <><Camera size={24} /><span>Weka Picha</span></>}
                    </label>
                    <div className="main-image-info"><div className="img-info-title">Picha ya Bidhaa</div><div className="img-info-sub">{attributes.marketplace_main_image ? "Picha imepakiwa" : "Bonyeza kuweka picha ya bidhaa"}</div>{attributes.enable_sizes && attributes.sizes?.length > 0 && <div className="img-info-sizes">📏 Ukubwa: {attributes.sizes.join(", ")}</div>}{!attributes.enable_sizes && <div className="img-info-sizes">✅ Bidhaa haina ukubwa tofauti (Standard size)</div>}</div>
                  </div>
                </div>
              )}

              <div className="stock-summary-box">
                <div><span>📦 Jumla ya Stock:</span><span className="highlight-blue">{attributes.has_colors && attributes.colors?.length > 0 ? attributes.colors.reduce((total, color) => { const colorStock = attributes.size_stock?.[color] || {}; return total + Object.values(colorStock).reduce((sum, val) => sum + (Number(val) || 0), 0); }, 0) : attributes.enable_sizes ? Object.values(attributes.size_stock || {}).reduce((acc, val) => acc + (Number(val) || 0), 0) : attributes.stock || 0} pcs</span></div>
                {attributes.has_colors && <div><span>🖼️ Rangi zilizo na picha:</span><span className="highlight-green">{Object.values(attributes.color_images || {}).filter(img => img).length} / {(attributes.colors || []).length}</span></div>}
              </div>
              <small className="helper-text">{attributes.has_colors ? "📌 Kila rangi ina picha yake. Mteja atachagua kwanza RANGI, kisha UKUBWA." : attributes.enable_sizes ? "📌 Picha moja inayowakilisha bidhaa. Mteja atachagua UKUBWA anao hitaji." : "📌 Picha moja inayowakilisha bidhaa yako."}</small>
            </div>
          </div>
        </>
      )}

      {/* SALES MODE & PRICING */}
      <div className="form-section-header"><DollarSign size={20} /><h3>Mfumo wa Uuzaji na Bei</h3></div>
      <div className="sales-mode-card">
        <div className="sales-mode-options">
          {["Retail", "Wholesale"].map((mode) => (
            <label key={mode} className="checkbox-label"><input type="checkbox" checked={mode === "Retail" ? attributes.is_retail : attributes.is_wholesale} onChange={(e) => setAttributes({ ...attributes, [mode === "Retail" ? "is_retail" : "is_wholesale"]: e.target.checked })} />{mode === "Retail" ? "🏪 Rejareja (Retail)" : "📦 Jumla (Wholesale)"}</label>
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
                <button type="button" className="remove-tier-btn" onClick={() => removePriceTier(index)}><Trash2 size={16} /></button>
              </div>
            ))}
            <button type="button" className="add-tier-btn" onClick={addPriceTier}><Plus size={16} /> Ongeza Kiwango kingine</button>
          </div>
        )}
        <div className="minimum-order-quantity">
          <label className="field-label-small">Kiwango cha chini cha Agizo (MOQ)</label>
          <input type="number" className="text-input" placeholder="Idadi ya chini inayoruhusiwa kwa agizo moja" value={attributes.moq || ""} onChange={(e) => setAttributes({ ...attributes, moq: e.target.value })} />
          <small>Acha wazi kama hakuna kiwango cha chini</small>
        </div>
      </div>

      {/* PRICE & STOCK */}
      <div className="form-section-header"><ShoppingBag size={20} /><h3>Bei na Stock</h3></div>
      <div className="form-grid-two">
        {attributes.is_retail && (
          <div className="form-group"><label className="field-label-main">Bei ya Rejareja (TZS) <span className="required-star">*</span></label><input type="number" className="text-input" placeholder="Mfano: 25000" value={attributes.price || ""} onChange={(e) => setAttributes({ ...attributes, price: e.target.value })} /><small>Bei ya kuuza kwa rejareja kwa kila bidhaa</small></div>
        )}
        <div className="form-group"><label className="field-label-main">Jumla ya Stock <span className="required-star">*</span></label><input type="number" className="text-input" placeholder="Idadi ya bidhaa zilizopo" value={attributes.stock || ""} onChange={(e) => setAttributes({ ...attributes, stock: e.target.value })} min="0" />{productVariations.length > 0 && <small className="success-text">✅ Stock inahesabiwa moja kwa moja kutoka variations ({productVariations.reduce((acc, v) => acc + (Number(v.stock_quantity) || 0), 0)})</small>}</div>
      </div>

      {/* COST & PROFIT */}
      <div className="form-section-header"><Award size={20} /><h3>Gharama na Faida</h3></div>
      <div className="form-grid-two footer-section">
        <div className="form-group"><label className="field-label-main">Gharama ya Jumla ya Stock (TZS)</label><input type="number" className="text-input" placeholder="Gharama uliyotumia kununua stock zote" value={attributes.total_stock_cost || ""} onChange={(e) => setAttributes({ ...attributes, total_stock_cost: e.target.value })} /><small>Gharama uliyolipa kwa ajili ya stock zote</small></div>
        <div className="form-group"><label className="field-label-main">Faida Inayotarajiwa (TZS)</label><input type="number" className="text-input" placeholder="Faida unayotarajia kupata" value={attributes.expected_total_profit || ""} onChange={(e) => setAttributes({ ...attributes, expected_total_profit: e.target.value })} /><small>Mapato - Gharama = Faida</small></div>
      </div>

      {/* SHIPPING INFORMATION */}
      <div className="form-section-header"><Truck size={20} /><h3>Taarifa za Usafirishaji</h3></div>
      <div className="shipping-container">
        <div className="form-group"><label className="field-label-small">Mfumo wa Usafirishaji</label><select className="select-input" value={attributes.shipping_method || "fixed"} onChange={(e) => setAttributes({ ...attributes, shipping_method: e.target.value })}><option value="fixed">💰 Gharama Imara (Fixed)</option><option value="distance">📏 Kwa Umbali (Distance Based)</option><option value="zone">📍 Kwa Kanda (Zone Based)</option><option value="free">🎉 Usafirishaji Bure (Free Shipping)</option></select></div>
        {attributes.shipping_method === "fixed" && <div className="form-group"><label className="field-label-small">Gharama ya Usafirishaji (TZS)</label><input type="number" className="text-input" placeholder="Mfano: 5000" value={attributes.shipping_cost || ""} onChange={(e) => setAttributes({ ...attributes, shipping_cost: e.target.value })} /><small>Gharama moja kwa maeneo yote (kawaida Dar es Salaam)</small></div>}
        {attributes.shipping_method === "distance" && (
          <div className="distance-shipping"><div className="form-group"><label className="field-label-small">Gharama kwa Kilomita (TZS/km)</label><input type="number" className="text-input" placeholder="Mfano: 500 kwa km" value={attributes.shipping_rate_per_km || ""} onChange={(e) => setAttributes({ ...attributes, shipping_rate_per_km: e.target.value })} /></div><div className="form-group"><label className="field-label-small">Gharama ya Msingi (Base Fee)</label><input type="number" className="text-input" placeholder="Mfano: 2000" value={attributes.shipping_base_fee || ""} onChange={(e) => setAttributes({ ...attributes, shipping_base_fee: e.target.value })} /><small>Gharama ya kuanzia (kwa km 0)</small></div><div className="form-group"><label className="field-label-small">Umbali wa Kawaida (km)</label><input type="number" className="text-input" placeholder="Mfano: 10" value={attributes.shipping_default_distance || ""} onChange={(e) => setAttributes({ ...attributes, shipping_default_distance: e.target.value })} /><small>Umbali wa kawaida kutoka duka lako</small></div><div className="shipping-formula-box"><p><strong>Mfumo:</strong> Gharama = Gharama Msingi + (Umbali × Gharama kwa km)</p><p>Mfano: 2,000 + (10 × 500) = 7,000 TZS</p></div></div>
        )}
        {attributes.shipping_method === "zone" && (
          <div className="zone-shipping"><label className="field-label-small">Viwango kwa Kanda</label>
            <div className="zone-box"><div className="flex-row gap-8"><span>📍 Dar es Salaam</span><span>(Kanda 1)</span></div><input type="number" className="text-input" placeholder="Gharama ya usafirishaji Dar" value={attributes.shipping_dar_cost || ""} onChange={(e) => setAttributes({ ...attributes, shipping_dar_cost: e.target.value })} /><small>Kinondoni, Ilala, Ubungo, Temeke, Kigamboni</small></div>
            <div className="zone-box"><div className="flex-row gap-8"><span>🚚 Nje ya Dar es Salaam</span><span>(Kanda 2)</span></div><input type="number" className="text-input" placeholder="Gharama ya usafirishaji nje ya Dar" value={attributes.shipping_outside_dar_cost || ""} onChange={(e) => setAttributes({ ...attributes, shipping_outside_dar_cost: e.target.value })} /><small>Pwani, Morogoro, Tanga, na mikoa mingine</small></div>
            <div className="zone-box"><div className="flex-row gap-8"><span>🏔️ Mikoa ya Mbali</span><span>(Kanda 3)</span></div><input type="number" className="text-input" placeholder="Gharama ya usafirishaji mikoa ya mbali" value={attributes.shipping_remote_cost || ""} onChange={(e) => setAttributes({ ...attributes, shipping_remote_cost: e.target.value })} /><small>Mwanza, Arusha, Mbeya, Dodoma, n.k.</small></div>
          </div>
        )}
        {attributes.shipping_method === "free" && <div className="free-shipping-box"><p>🎉 Usafirishaji Bure kwa maeneo yote!</p><small>Gharama za usafirishaji zinalipwa na muuzaji</small></div>}
        <div className="form-group mt-15"><label className="checkbox-label"><input type="checkbox" checked={attributes.enable_pickup || false} onChange={(e) => setAttributes({ ...attributes, enable_pickup: e.target.checked })} /><span>✅ Washa chaguo la "Kuchukua Mwenyewe" (Pickup)</span></label>{attributes.enable_pickup && <div className="pickup-address-box"><p>📍 Mteja atajulishwa anwani ya duka lako.<br /><strong>Anwani ya Duka:</strong> <input type="text" className="text-input" placeholder="Weka anwani ya duka lako" value={attributes.store_address || ""} onChange={(e) => setAttributes({ ...attributes, store_address: e.target.value })} /></p></div>}</div>
        <small className="helper-text">💡 Chagua mfumo unaofaa kwa biashara yako. Kwa Dar es Salaam, tumia "Gharama Imara" au "Kwa Kanda".</small>
      </div>

      {/* Warning for low stock */}
      {selectedLeaf && selectedLeaf.min_stock_warning && (
        <div className="alert-box-warning"><AlertCircle size={20} /><div><strong>⚠️ Onyo la Stock</strong><p>Bidhaa hii ina kiwango cha chini cha onyo cha stock: {selectedLeaf.min_stock_warning} (Utapata arifa stock inapofikia kiwango hiki)</p></div></div>
      )}

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-box"><details><summary>🔧 Debug Information</summary>
          <div><p><strong>Selected Leaf:</strong> {selectedLeaf?.name || "None"}</p><p><strong>require_gender:</strong> {selectedLeaf?.require_gender ? "Yes" : "No"}</p><p><strong>require_size:</strong> {selectedLeaf?.require_size ? "Yes" : "No"}</p><p><strong>size_format:</strong> {selectedLeaf?.size_format || "Not set"}</p><p><strong>color_required:</strong> {selectedLeaf?.color_required !== false ? "Yes" : "No"}</p><p><strong>Colors count:</strong> {attributes.colors?.length || 0}</p><p><strong>Sizes count:</strong> {attributes.sizes?.length || 0}</p><p><strong>Variations count:</strong> {attributes.variations?.length || 0}</p><p><strong>Total Stock:</strong> {attributes.stock || 0}</p></div>
        </details></div>
      )}
    </div>
  );
}
export default React.memo(ProductAttributes);