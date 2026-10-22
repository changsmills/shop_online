import React, { useState, useEffect } from "react";
import { 
  Zap, CheckCircle2, Loader2, AlertCircle, Package, Info, Camera, 
  Plus, Trash2, Ruler, Weight, Shield, Tag, Globe, Calendar,
  Wrench, Shirt, Footprints, Smartphone, Home, ShoppingBag, Truck,
  DollarSign, Layers, Grid, Heart, Star, Award, Clock, Settings, 
  Palette
} from "lucide-react";
import axios from 'axios';
//import '../ProductAttributes.css';

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
      size_prices: {}, 
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
    const newColors = attributes.colors.filter(c => c !== colorToRemove);
    const newSizeStock = { ...(attributes.size_stock || {}) };
    const newSizePrices = { ...(attributes.size_prices || {}) };
    const newColorImages = { ...(attributes.color_images || {}) };
    
    delete newSizeStock[colorToRemove];
    delete newSizePrices[colorToRemove];
    delete newColorImages[colorToRemove];
    
    setAttributes({ 
      ...attributes, 
      colors: newColors, 
      size_stock: newSizeStock, 
      size_prices: newSizePrices,
      color_images: newColorImages
    });
};

  useEffect(() => {
    if (!attributes.has_colors) {
      if (productVariations.length !== 0) { setProductVariations([]); setAttributes(prev => ({ ...prev, variations: [] })); }
      return;
    }
    const selectedColors = attributes.colors || [];
    if (selectedColors.length === 0) {
      if (productVariations.length !== 0) { setProductVariations([]); setAttributes(prev => ({ ...prev, variations: [] })); }
      return;
    }
    const newVariations = [];
    selectedColors.forEach(color => {
      // 🔥 CHUKUA UKUBWA KUTOKA size_stock YA RANGI HII
      const colorStock = attributes.size_stock?.[color] || {};
      const colorSizes = Object.keys(colorStock);
      const sizesToUse = colorSizes.length > 0 ? colorSizes : [null];

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
            stock_quantity: colorStock[size] || 0,
            price: (attributes.size_prices?.[color]?.[size]) || attributes.price || 0,
            variant_image_url: "",
            color_image: "",
            image_file: null,
            marketplace_stock: 0,
            marketplace_price: (attributes.size_prices?.[color]?.[size]) || attributes.price || 0,
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
  }, [attributes.has_colors, attributes.colors, attributes.sizes, attributes.price, attributes.specifications, attributes.size_stock, attributes.size_prices]);

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
  <div className="w-full px-3 sm:px-4 md:px-6 lg:px-10 py-4 sm:py-6 md:py-8 bg-white dark:bg-[#0f172a] flex flex-col gap-4 sm:gap-5 md:gap-7 font-sans text-slate-700 dark:text-slate-200 box-border border-b border-slate-100 dark:border-slate-700 animate-[mainFadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)]">

    {/* ========== SECTION 1: BASIC INFORMATION ========== */}
    <div className="flex items-center gap-2.5 mb-1">
      <Info size={20} />
      <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
        Taarifa za Msingi
      </h3>
    </div>

    <div className="mb-2">
      <label className="flex items-center gap-2.5 text-sm sm:text-[15px] font-bold text-slate-800 dark:text-slate-100 mb-3">
        <Package size={18} /> Jina la Bidhaa <span className="text-rose-500">*</span>
      </label>
      <input
        className="w-full bg-slate-50 dark:bg-[#1e293b] border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm sm:text-[15px] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-300 focus:bg-white dark:focus:bg-[#1e293b] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/12 focus:outline-none focus:-translate-y-px box-border"
        value={attributes.name || ""}
        onChange={(e) => setAttributes({ ...attributes, name: e.target.value })}
        placeholder="Mfano: iPhone 15 Pro, Nike Air Max..."
      />
    </div>

    <div className="mb-2">
      <label className="flex items-center gap-2.5 text-sm sm:text-[15px] font-bold text-slate-800 dark:text-slate-100 mb-3">
        <Info size={18} /> Maelezo ya Bidhaa
      </label>
      <textarea
        className="w-full bg-slate-50 dark:bg-[#1e293b] border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm sm:text-[15px] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#1e293b] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/12 focus:outline-none resize-y min-h-[120px] box-border"
        value={attributes.description || ""}
        onChange={(e) => setAttributes({ ...attributes, description: e.target.value })}
        placeholder="Andika maelezo ya kina..."
        rows={4}
      />
    </div>

    {/* ========== SECTION 2: BRAND & CATEGORY ========== */}
    <div className="flex items-center gap-2.5 mt-2">
      <Tag size={20} />
      <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
        Brand na Aina ya Bidhaa
      </h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-7">
      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
          Brand
        </label>
        <select
          className="w-full bg-slate-50 dark:bg-[#1e293b] border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm sm:text-[15px] text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/12 focus:outline-none box-border"
          value={attributes.brand_id || ""}
          onChange={(e) => setAttributes({ ...attributes, brand_id: e.target.value })}
        >
          <option value="">Chagua Brand...</option>
          {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
          Aina Maalum
        </label>
        <select
          className={`w-full bg-slate-50 dark:bg-[#1e293b] border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm sm:text-[15px] text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/12 focus:outline-none box-border ${
            !subCategoryId ? 'opacity-60 cursor-not-allowed' : ''
          }`}
          disabled={!subCategoryId || loading}
          value={attributes.leaf_category_id || ""}
          onChange={handleLeafChange}
        >
          {loading ? (
            <option disabled>Inapakia...</option>
          ) : (
            <>
              <option value="">-- Chagua Aina --</option>
              {leafCategories.map((leaf) => <option key={leaf.id} value={leaf.id}>{leaf.name}</option>)}
            </>
          )}
        </select>
        {!subCategoryId && (
          <span className="flex items-center gap-1.5 text-rose-500 text-xs mt-2 font-medium">
            <AlertCircle size={12} /> Chagua kategoria ya juu kwanza
          </span>
        )}
      </div>
    </div>

    {/* ========== SECTION 3: DYNAMIC SPECS ========== */}
    {selectedLeaf && selectedLeaf.specs && (
      <>
        <div className="flex items-center gap-2.5 mt-2">
          {getCategoryIcon()}
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
            Sifa za {selectedLeaf.name}
          </h3>
        </div>
        <div className="bg-slate-100 dark:bg-[#1e293b] rounded-[20px] p-1 w-full">
          <div className="bg-white dark:bg-[#0f172a] p-4 sm:p-5 md:p-6 rounded-b-2xl grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 md:gap-5">
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
                  <div key={idx} className="flex flex-col gap-2">
                    <label className="font-semibold text-sm text-slate-600 dark:text-slate-300">{label}</label>
                    {hasOptions ? (
                      <select
                        className="w-full bg-slate-50 dark:bg-[#1e293b] border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/12 focus:outline-none box-border"
                        value={attributes.specifications?.[cleanKey] || ""}
                        onChange={(e) => setAttributes({ ...attributes, specifications: { ...attributes.specifications, [cleanKey]: e.target.value } })}
                      >
                        <option value="">-- Chagua --</option>
                        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <input
                        className="w-full bg-slate-50 dark:bg-[#1e293b] border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/12 focus:outline-none box-border"
                        type="text"
                        placeholder={`Weka ${label}...`}
                        value={attributes.specifications?.[cleanKey] || ""}
                        onChange={(e) => setAttributes({ ...attributes, specifications: { ...attributes.specifications, [cleanKey]: e.target.value } })}
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
        <div className="flex items-center gap-2.5 mt-2">
          <Settings size={20} />
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
            Vipengele vya Bidhaa (Chagua Unavyohitaji)
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 p-4 bg-slate-50 dark:bg-[#1e293b] rounded-xl mb-5">

          {/* Size Format */}
          <div className="col-span-full p-3 bg-green-50 dark:bg-[#1a3a2a] rounded-lg border-2 border-emerald-500 mb-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              📏 Mfumo wa Ukubwa / Vipimo
            </label>
            <select
              className="w-full bg-white dark:bg-[#0f172a] border-2 border-emerald-500 font-medium px-3 py-2.5 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none"
              value={attributes.size_format || 'standard'}
              onChange={(e) => {
                const format = e.target.value;
                setAttributes({
                  ...attributes,
                  size_format: format,
                  ...(format === 'length' ? { dimensions: { length: '', width: '', height: '' }, sizes: [], size_stock: {}, size_prices: {} } : {}),
                  ...(format === 'dimensions' ? { price_per_meter: '', price_per_foot: '', sizes: [], size_stock: {}, size_prices: {} } : {}),
                  ...(format === 'free' ? { sizes: [], size_stock: {}, size_prices: {}, dimensions: { length: '', width: '', height: '' }, price_per_meter: '', price_per_foot: '' } : {}),
                });
              }}
            >
              <option value="standard">📏 Kawaida (S, M, L, XL)</option>
              <option value="numeric">🔢 Nambari (36, 37, 38...)</option>
              <option value="free">📦 Hakuna Ukubwa</option>
              <option value="dimensions">📐 Vipimo (Makabati, Meza)</option>
              <option value="length">📏 Urefu (Mazulia, Vitambaa)</option>
            </select>
            <small className="block text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              💡 Chagua mfumo unaofaa kwa aina ya bidhaa yako
            </small>
          </div>

          {/* Toggle: Gender */}
          <button
            type="button"
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all duration-200 min-h-[44px] ${
              attributes.enable_gender
                ? 'border-emerald-500 bg-emerald-50 dark:bg-[#1a3a2a]'
                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0f172a]'
            }`}
            onClick={() => setAttributes({ ...attributes, enable_gender: !attributes.enable_gender, gender: [], target_audience: [] })}
          >
            <Heart size={18} className="text-slate-700 dark:text-slate-200" />
            <span className={`flex-1 text-left text-sm text-slate-700 dark:text-slate-200 ${attributes.enable_gender ? 'font-semibold' : 'font-normal'}`}>
              👥 Jinsia na Umri
            </span>
            {attributes.enable_gender && <CheckCircle2 size={16} className="text-emerald-500" />}
          </button>

          {/* Toggle: Warranty */}
          <button
            type="button"
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all duration-200 min-h-[44px] ${
              attributes.enable_warranty
                ? 'border-emerald-500 bg-emerald-50 dark:bg-[#1a3a2a]'
                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0f172a]'
            }`}
            onClick={() => setAttributes({ ...attributes, enable_warranty: !attributes.enable_warranty, warranty_months: '' })}
          >
            <Shield size={18} className="text-slate-700 dark:text-slate-200" />
            <span className={`flex-1 text-left text-sm text-slate-700 dark:text-slate-200 ${attributes.enable_warranty ? 'font-semibold' : 'font-normal'}`}>
              🛡️ Dhamana (Warranty)
            </span>
            {attributes.enable_warranty && <CheckCircle2 size={16} className="text-emerald-500" />}
          </button>

          {/* Toggle: Weight */}
          <button
            type="button"
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all duration-200 min-h-[44px] ${
              attributes.enable_weight
                ? 'border-emerald-500 bg-emerald-50 dark:bg-[#1a3a2a]'
                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0f172a]'
            }`}
            onClick={() => setAttributes({ ...attributes, enable_weight: !attributes.enable_weight, weight: '' })}
          >
            <Weight size={18} className="text-slate-700 dark:text-slate-200" />
            <span className={`flex-1 text-left text-sm text-slate-700 dark:text-slate-200 ${attributes.enable_weight ? 'font-semibold' : 'font-normal'}`}>
              ⚖️ Uzito (Weight)
            </span>
            {attributes.enable_weight && <CheckCircle2 size={16} className="text-emerald-500" />}
          </button>

          {/* Toggle: Dimensions */}
          <button
            type="button"
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all duration-200 min-h-[44px] ${
              attributes.enable_dimensions
                ? 'border-emerald-500 bg-emerald-50 dark:bg-[#1a3a2a]'
                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0f172a]'
            }`}
            onClick={() => setAttributes({ ...attributes, enable_dimensions: !attributes.enable_dimensions, dimensions: { length: '', width: '', height: '' } })}
          >
            <Ruler size={18} className="text-slate-700 dark:text-slate-200" />
            <span className={`flex-1 text-left text-sm text-slate-700 dark:text-slate-200 ${attributes.enable_dimensions ? 'font-semibold' : 'font-normal'}`}>
              📐 Vipimo (Dimensions)
            </span>
            {attributes.enable_dimensions && <CheckCircle2 size={16} className="text-emerald-500" />}
          </button>

          {/* Toggle: Variations */}
          <button
            type="button"
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all duration-200 min-h-[44px] ${
              attributes.enable_variations
                ? 'border-emerald-500 bg-emerald-50 dark:bg-[#1a3a2a]'
                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0f172a]'
            }`}
            onClick={() => setAttributes({ ...attributes, enable_variations: !attributes.enable_variations, has_colors: !attributes.has_colors, enable_colors: !attributes.enable_colors, colors: [] })}
          >
            <Palette size={18} className="text-slate-700 dark:text-slate-200" />
            <span className={`flex-1 text-left text-sm text-slate-700 dark:text-slate-200 ${attributes.enable_variations ? 'font-semibold' : 'font-normal'}`}>
              🎨 Rangi na Ukubwa (Variations)
            </span>
            {attributes.enable_variations && <CheckCircle2 size={16} className="text-emerald-500" />}
          </button>
        </div>
      </>
    )}

    {/* ========== SECTION 4: PRODUCT CONDITION ========== */}
    {selectedLeaf && selectedLeaf.condition_options && Array.isArray(selectedLeaf.condition_options) && selectedLeaf.condition_options.length > 1 && (
      <>
        <div className="flex items-center gap-2.5 mt-2">
          <Tag size={20} />
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
            Hali ya Bidhaa
          </h3>
        </div>
        <div className="bg-slate-100 dark:bg-[#1e293b] rounded-[20px] p-1 w-full">
          <div className="bg-white dark:bg-[#0f172a] p-4 sm:p-5 md:p-6 rounded-b-2xl grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 md:gap-5">
            <div className="col-span-full bg-slate-50 dark:bg-[#1e293b] p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-slate-600">
              <div className="flex flex-wrap gap-2 md:gap-3 mt-2.5">
                {selectedLeaf.condition_options.map(cond => (
                  <button
                    key={cond}
                    type="button"
                    className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[13px] md:text-sm font-semibold transition-all duration-300 min-h-[44px] ${
                      attributes.condition === cond
                        ? 'bg-blue-500 border-blue-500 text-white shadow-[0_8px_20px_rgba(59,130,246,0.3)] scale-105'
                        : 'bg-white dark:bg-[#0f172a] border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:text-blue-500'
                    }`}
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
        <div className="flex items-center gap-2.5 mt-2">
          <Shield size={20} />
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
            Dhamana (Warranty)
          </h3>
        </div>
        <div className="bg-slate-100 dark:bg-[#1e293b] rounded-[20px] p-1 w-full">
          <div className="bg-white dark:bg-[#0f172a] p-4 sm:p-5 md:p-6 rounded-b-2xl grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 md:gap-5">
            <div className="col-span-full bg-slate-50 dark:bg-[#1e293b] p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-slate-600">
              <select
                className="w-full bg-white dark:bg-[#0f172a] border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
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
        <div className="flex items-center gap-2.5 mt-2">
          <Weight size={20} />
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
            Uzito wa Bidhaa
          </h3>
        </div>
        <div className="bg-slate-100 dark:bg-[#1e293b] rounded-[20px] p-1 w-full">
          <div className="bg-white dark:bg-[#0f172a] p-4 sm:p-5 md:p-6 rounded-b-2xl grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 md:gap-5">
            <div className="col-span-full bg-slate-50 dark:bg-[#1e293b] p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-slate-600">
              <div className="flex gap-2.5">
                <input
                  type="number"
                  step="0.1"
                  className="flex-1 bg-white dark:bg-[#0f172a] border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  placeholder="Uzito"
                  value={attributes.weight || ""}
                  onChange={(e) => setAttributes({ ...attributes, weight: e.target.value })}
                />
                <select
                  className="w-[100px] bg-white dark:bg-[#0f172a] border-2 border-slate-200 dark:border-slate-600 rounded-xl px-3 py-3 text-sm text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value)}
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
        <div className="flex items-center gap-2.5 mt-2">
          <Ruler size={20} />
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
            Vipimo vya Bidhaa
          </h3>
        </div>
        <div className="bg-slate-100 dark:bg-[#1e293b] rounded-[20px] p-1 w-full">
          <div className="bg-white dark:bg-[#0f172a] p-4 sm:p-5 md:p-6 rounded-b-2xl grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 md:gap-5">
            <div className="col-span-full bg-slate-50 dark:bg-[#1e293b] p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-slate-600">
              <div className="flex gap-2.5 flex-wrap">
                <input
                  type="number"
                  step="0.1"
                  className="flex-1 min-w-[120px] bg-white dark:bg-[#0f172a] border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  placeholder="Urefu (cm)"
                  value={attributes.dimensions?.length || ""}
                  onChange={(e) => setAttributes({ ...attributes, dimensions: { ...attributes.dimensions, length: e.target.value } })}
                />
                <input
                  type="number"
                  step="0.1"
                  className="flex-1 min-w-[120px] bg-white dark:bg-[#0f172a] border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  placeholder="Upana (cm)"
                  value={attributes.dimensions?.width || ""}
                  onChange={(e) => setAttributes({ ...attributes, dimensions: { ...attributes.dimensions, width: e.target.value } })}
                />
                <input
                  type="number"
                  step="0.1"
                  className="flex-1 min-w-[120px] bg-white dark:bg-[#0f172a] border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  placeholder="Kimo (cm)"
                  value={attributes.dimensions?.height || ""}
                  onChange={(e) => setAttributes({ ...attributes, dimensions: { ...attributes.dimensions, height: e.target.value } })}
                />
              </div>
              <small className="block text-[11px] text-slate-500 dark:text-slate-400 mt-2">
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
        <div className="flex items-center gap-2.5 mt-2">
          <Heart size={20} />
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
            Lengo la Bidhaa
          </h3>
        </div>
        <div className="bg-slate-100 dark:bg-[#1e293b] rounded-[20px] p-1 w-full">
          <div className="bg-white dark:bg-[#0f172a] p-4 sm:p-5 md:p-6 rounded-b-2xl grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 md:gap-5">
            <div className="col-span-full bg-slate-50 dark:bg-[#1e293b] p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-slate-600">
              <label className="font-semibold text-sm text-slate-600 dark:text-slate-300">Jinsia:</label>
              <div className="flex flex-wrap gap-2 md:gap-3 mt-2.5">
                {["Male", "Female", "Unisex"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[13px] md:text-sm font-semibold transition-all duration-300 min-h-[44px] ${
                      (attributes.gender || []).includes(g)
                        ? 'bg-blue-500 border-blue-500 text-white shadow-[0_8px_20px_rgba(59,130,246,0.3)] scale-105'
                        : 'bg-white dark:bg-[#0f172a] border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:text-blue-500'
                    }`}
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
            <div className="col-span-full bg-slate-50 dark:bg-[#1e293b] p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-slate-600">
              <label className="font-semibold text-sm text-slate-600 dark:text-slate-300">Kikundi cha Umri:</label>
              <div className="flex flex-wrap gap-2 md:gap-3 mt-2.5">
                {["Kids", "Youth", "Adults", "All"].map((a) => (
                  <button
                    key={a}
                    type="button"
                    className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[13px] md:text-sm font-semibold transition-all duration-300 min-h-[44px] ${
                      (attributes.target_audience || []).includes(a)
                        ? 'bg-blue-500 border-blue-500 text-white shadow-[0_8px_20px_rgba(59,130,246,0.3)] scale-105'
                        : 'bg-white dark:bg-[#0f172a] border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:text-blue-500'
                    }`}
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

    {/* ========== SECTION 9: COLORS & SIZES ========== */}
    {selectedLeaf && attributes.enable_variations && (
      <>
        <div className="flex items-center gap-2.5 mt-2">
          <Palette size={20} />
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
            Rangi na Ukubwa (Sizes) - Kila Rangi ina Ukubwa na Stock Zake
          </h3>
        </div>
        <div className="bg-slate-100 dark:bg-[#1e293b] rounded-[20px] p-1 w-full">
          <div className="bg-white dark:bg-[#0f172a] p-4 sm:p-5 md:p-6 rounded-b-2xl grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 md:gap-5">
            <div className="col-span-full bg-slate-50 dark:bg-[#1e293b] p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-slate-600">

              {/* Color Input Wrapper */}
              <div className="bg-slate-50 dark:bg-[#1e293b] p-4 rounded-xl mb-5 border border-slate-200 dark:border-slate-600">
                <label className="font-semibold text-sm text-slate-600 dark:text-slate-300 mb-2 block">
                  🎨 Ongeza Rangi Mpya
                </label>
                <div className="flex flex-wrap gap-2.5 mb-4">
                  <button
                    type="button"
                    className={`flex-1 min-w-[100px] px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all ${
                      !showCustomColor
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-200 dark:bg-[#0f172a] text-slate-600 dark:text-slate-300'
                    }`}
                    onClick={() => { setShowCustomColor(false); setCustomColorName(""); }}
                  >
                    📋 Chagua kutoka list
                  </button>
                  <button
                    type="button"
                    className={`flex-1 min-w-[100px] px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all ${
                      showCustomColor
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-[#0f172a] text-slate-600 dark:text-slate-300'
                    }`}
                    onClick={() => { setShowCustomColor(true); setSelectedColorName(""); }}
                  >
                    ✏️ Andika rangi yangu
                  </button>
                </div>

                <div className="flex flex-col gap-2.5">
                  {!showCustomColor ? (
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2.5">
                      <select
                        className="w-full sm:flex-[2] bg-white dark:bg-[#0f172a] border-2 border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none"
                        value={selectedColorName}
                        onChange={(e) => setSelectedColorName(e.target.value)}
                      >
                        <option value="">-- Chagua jina la rangi --</option>
                        {commonColors.slice(0, 30).map(color => <option key={color} value={color}>{color}</option>)}
                        {commonColors.length > 30 && <option disabled>--- na rangi {commonColors.length - 30} zaidi ---</option>}
                      </select>
                      <input
                        type="color"
                        value={currentColor}
                        onChange={(e) => setCurrentColor(e.target.value)}
                        className="w-[50px] h-[45px] border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer p-0 box-border"
                      />
                      <button
                        type="button"
                        className={`w-full sm:w-auto px-4 py-2.5 rounded-lg text-white font-semibold text-sm transition-all flex items-center justify-center gap-1.5 ${
                          selectedColorName
                            ? 'bg-emerald-500 hover:bg-emerald-600 cursor-pointer'
                            : 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed'
                        }`}
                        onClick={addColorTag}
                        disabled={!selectedColorName}
                      >
                        <Plus size={16} /> Ongeza Rangi
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      <div className="flex flex-col sm:flex-row flex-wrap gap-2.5">
                        <input
                          type="text"
                          placeholder="Andika jina la rangi"
                          value={customColorName}
                          onChange={(e) => {
                            let value = e.target.value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
                            setCustomColorName(value);
                            setSelectedColorName(value);
                          }}
                          className="w-full sm:flex-[2] bg-white dark:bg-[#0f172a] border-2 border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none"
                          autoFocus
                        />
                        <input
                          type="color"
                          value={currentColor}
                          onChange={(e) => setCurrentColor(e.target.value)}
                          className="w-[50px] h-[45px] border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer p-0 box-border"
                        />
                        <button
                          type="button"
                          className={`w-full sm:w-auto px-4 py-2.5 rounded-lg text-white font-semibold text-sm transition-all flex items-center justify-center gap-1.5 ${
                            customColorName.trim()
                              ? 'bg-emerald-500 hover:bg-emerald-600 cursor-pointer'
                              : 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed'
                          }`}
                          onClick={addColorTag}
                          disabled={!customColorName.trim()}
                        >
                          <Plus size={16} /> Ongeza Rangi
                        </button>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap gap-2.5">
                        <span>💡 Mifano:</span>
                        <span>Neon Green</span>
                        <span>Metallic Blue</span>
                        <span>Cream White</span>
                        <span>Matte Black</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 mt-3 p-2 bg-amber-50 dark:bg-[#2d3748] rounded-md">
                  <strong>Kidokezo:</strong> Bonyeza "Andika rangi yangu" kuweka rangi yoyote unayotaka.
                </div>
              </div>

              {/* LIST YA RANGI ZOTE */}
              {attributes.colors?.length > 0 && (
                <div className="flex flex-col gap-7">
                  {attributes.colors.map((color) => {
                    const colorStock = attributes.size_stock?.[color] || {};
                    return (
                      <div
                        key={color}
                        className="border border-slate-200 dark:border-slate-600 rounded-xl p-4 sm:p-5 bg-white dark:bg-[#0f172a] shadow-sm"
                      >
                        {/* Color Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4 pb-2.5 border-b border-slate-200 dark:border-slate-600">
                          <div className="flex items-center gap-2.5 w-full sm:w-auto">
                            <div
                              className="w-10 h-10 rounded-full border-2 border-slate-300 dark:border-slate-500 shadow-sm flex-shrink-0"
                              style={{ backgroundColor: color }}
                            />
                            <div>
                              <span className="font-bold text-base text-slate-800 dark:text-slate-100 block">
                                {color.toUpperCase()}
                              </span>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                {attributes.color_images?.[color] ? "✅ Imepakiwa" : "❌ Hajapakiwa"}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white rounded-md px-3 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                            onClick={() => {
                              const newColors = attributes.colors.filter(c => c !== color);
                              const newSizeStock = { ...(attributes.size_stock || {}) }; delete newSizeStock[color];
                              const newSizePrices = { ...(attributes.size_prices || {}) }; delete newSizePrices[color];
                              const newColorImages = { ...(attributes.color_images || {}) }; delete newColorImages[color];
                              setAttributes({ ...attributes, colors: newColors, size_stock: newSizeStock, size_prices: newSizePrices, color_images: newColorImages });
                            }}
                          >
                            <Trash2 size={14} /> Futa Rangi
                          </button>
                        </div>

                        {/* Size Add Wrapper */}
                        <div className="bg-slate-50 dark:bg-[#1e293b] p-3 rounded-lg mb-4">
                          <label className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-2">
                            📏 Ongeza Ukubwa kwa {color.toUpperCase()}:
                          </label>
                          <div className="flex flex-col sm:flex-row flex-wrap gap-2.5">
                            <select
                              className="w-full sm:flex-1 bg-white dark:bg-[#0f172a] border-2 border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none"
                              value=""
                              onChange={(e) => {
                                if (e.target.value === "CUSTOM") return;
                                const presetSizes = e.target.value.split(",");
                                const newSizeStock = { ...(attributes.size_stock || {}) };
                                if (!newSizeStock[color]) newSizeStock[color] = {};
                                presetSizes.forEach(size => { if (newSizeStock[color][size] === undefined) newSizeStock[color][size] = 0; });
                                setAttributes({ ...attributes, size_stock: newSizeStock });
                                e.target.value = "";
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
                            <div className="flex gap-2 sm:flex-[2] w-full">
                              <input
                                type="text"
                                className="flex-1 min-w-0 bg-white dark:bg-[#0f172a] border-2 border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none"
                                placeholder="Ukubwa wako (mfano: XXL, 42)"
                                value={customSizeInput}
                                onChange={(e) => setCustomSizeInput(e.target.value)}
                              />
                              <button
                                type="button"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-1 flex-shrink-0 transition-colors"
                                onClick={() => {
                                  if (customSizeInput.trim()) {
                                    const newSize = customSizeInput.trim().toUpperCase();
                                    const newSizeStock = { ...(attributes.size_stock || {}) };
                                    if (!newSizeStock[color]) newSizeStock[color] = {};
                                    if (newSizeStock[color][newSize] === undefined) newSizeStock[color][newSize] = 0;
                                    setAttributes({ ...attributes, size_stock: newSizeStock });
                                    setCustomSizeInput("");
                                  }
                                }}
                              >
                                <Plus size={14} /> Ongeza
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Stock Grid */}
                        {Object.keys(colorStock).length > 0 && (
                          <div className="mt-3">
                            <label className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-2">
                              📊 Stock na Bei kwa Kila Ukubwa:
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2 sm:gap-2.5">
                              {Object.entries(colorStock).map(([size, stock]) => (
                                <div
                                  key={size}
                                  className="flex flex-col gap-1.5 p-2.5 bg-slate-50 dark:bg-[#1e293b] rounded-lg border border-slate-200 dark:border-slate-600"
                                >
                                  <span className="font-semibold text-[13px] text-slate-800 dark:text-slate-100 pb-1 border-b border-dashed border-slate-300 dark:border-slate-500">
                                    {size}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="number"
                                      min="0"
                                      className="flex-1 min-w-0 px-1.5 py-1.5 rounded-md border border-slate-300 dark:border-slate-500 text-center text-[13px] bg-white dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 focus:outline-none"
                                      placeholder="Stock"
                                      value={stock}
                                      onChange={(e) => {
                                        const newStock = parseInt(e.target.value) || 0;
                                        const newSizeStock = { ...(attributes.size_stock || {}) };
                                        if (!newSizeStock[color]) newSizeStock[color] = {};
                                        newSizeStock[color][size] = newStock;
                                        setAttributes({ ...attributes, size_stock: newSizeStock });
                                      }}
                                    />
                                    <input
                                      type="number"
                                      min="0"
                                      className="flex-1 min-w-0 px-1.5 py-1.5 rounded-md border border-emerald-300 bg-emerald-50 dark:bg-[#1a3a2a] dark:border-emerald-700 text-center text-[13px] text-slate-800 dark:text-slate-200 focus:outline-none"
                                      placeholder="Bei (TZS)"
                                      value={attributes.size_prices?.[color]?.[size] || ""}
                                      onChange={(e) => {
                                        const newPrice = parseFloat(e.target.value) || 0;
                                        const newSizePrices = { ...(attributes.size_prices || {}) };
                                        if (!newSizePrices[color]) newSizePrices[color] = {};
                                        newSizePrices[color][size] = newPrice;
                                        setAttributes({ ...attributes, size_prices: newSizePrices });
                                      }}
                                    />
                                    <button
                                      type="button"
                                      className="w-6 h-6 rounded bg-red-500 text-white text-xs font-bold flex items-center justify-center hover:bg-red-600 flex-shrink-0"
                                      onClick={() => {
                                        const newSizeStock = { ...(attributes.size_stock || {}) };
                                        const newSizePrices = { ...(attributes.size_prices || {}) };
                                        if (newSizeStock[color]) {
                                          delete newSizeStock[color][size];
                                          if (Object.keys(newSizeStock[color]).length === 0) delete newSizeStock[color];
                                        }
                                        if (newSizePrices[color]) {
                                          delete newSizePrices[color][size];
                                          if (Object.keys(newSizePrices[color]).length === 0) delete newSizePrices[color];
                                        }
                                        setAttributes({ ...attributes, size_stock: newSizeStock, size_prices: newSizePrices });
                                      }}
                                    >
                                      ×
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 px-3 py-2 rounded-lg text-xs flex justify-between bg-green-50 dark:bg-[#1a3a2a] text-slate-800 dark:text-slate-200">
                              <span>📦 Jumla ya {color.toUpperCase()}:</span>
                              <strong>{Object.values(colorStock).reduce((sum, val) => sum + (Number(val) || 0), 0)} pcs</strong>
                            </div>
                          </div>
                        )}

                        {/* Color Image Upload */}
                        <div className="mt-4">
                          <label className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-2">
                            🖼️ Picha ya Rangi {color.toUpperCase()} (Marketplace)
                          </label>
                          <div className="flex flex-wrap gap-3.5 items-center">
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
                              className={`flex flex-col items-center justify-center w-20 h-20 rounded-[10px] cursor-pointer overflow-hidden transition-all border-2 border-dashed ${
                                attributes.color_images?.[color]
                                  ? 'border-emerald-500 bg-green-50 dark:bg-[#1a3a2a] border-solid'
                                  : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-[#1e293b]'
                              }`}
                            >
                              {attributes.color_images?.[color] ? (
                                <img src={attributes.color_images[color]} alt={color} className="w-full h-full object-cover" />
                              ) : (
                                <>
                                  <Camera size={20} className="text-slate-500 dark:text-slate-400" />
                                  <span className="text-[9px] mt-1 text-slate-500 dark:text-slate-400">Weka Picha</span>
                                </>
                              )}
                            </label>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {attributes.color_images?.[color] ? "✅ Picha imepakiwa." : "⚠️ Picha inahitajika kwa rangi hii"}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* GRAND TOTAL */}
              {attributes.colors?.length > 0 && (
                <div className="mt-5 p-4 bg-slate-800 dark:bg-[#0f172a] rounded-[10px] text-white flex flex-wrap justify-between items-center gap-2.5 border border-slate-700">
                  <div>
                    <span className="font-semibold">📊 Jumla Kuu ya Bidhaa:</span>
                    <span className="font-bold text-lg ml-2.5 text-emerald-400">
                      {attributes.colors.reduce((total, color) => {
                        const colorStock = attributes.size_stock?.[color] || {};
                        return total + Object.values(colorStock).reduce((sum, val) => sum + (Number(val) || 0), 0);
                      }, 0)} pcs
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">🎨 Rangi:</span>
                    <span className="font-bold ml-2">{attributes.colors.length}</span>
                  </div>
                </div>
              )}

              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 block">
                <strong>Muundo:</strong> Kila rangi ina ukubwa wake na stock tofauti.<br />
                📌 Unaweza kuongeza rangi nyingi...<br />
                🖼️ Kila rangi ina picha yake moja...<br />
                📊 Jumla ya stock inahesabiwa moja kwa moja.
              </div>
            </div>
          </div>
        </div>
      </>
    )}

    {/* ========== SECTION 10: MARKETPLACE SUMMARY ========== */}
    {selectedLeaf && (
      <>
        <div className="flex flex-wrap items-center gap-2.5 mt-2">
          <ShoppingBag size={20} />
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
            Listing Summary - {selectedLeaf.name}
          </h3>
          <span className="bg-red-500 text-white text-[11px] px-2.5 py-1 rounded-xl ml-2">
            * Auto-generated
          </span>
        </div>

        <div className="border-2 border-red-500 rounded-xl p-4 bg-red-50 dark:bg-[#2d1a1a] mb-5">
          <div className="border border-slate-300 dark:border-slate-600 rounded-[10px] p-4 bg-white dark:bg-[#0f172a]">
            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-4">
              📦 Summary
            </h4>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Marketplace Product Name
              </label>
              <input
                type="text"
                className="w-full bg-slate-50 dark:bg-[#1e293b] border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                value={attributes.marketplace_product_name || attributes.name || ""}
                onChange={(e) => setAttributes({ ...attributes, marketplace_product_name: e.target.value })}
                placeholder="Will use product name if left empty"
              />
            </div>

            {/* Color Images Summary Grid */}
            {attributes.has_colors && attributes.colors?.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                  Color Images (Uploaded)
                </label>
                <div className="flex flex-col gap-4">
                  {attributes.colors.map(color => {
                    const colorImage = attributes.color_images?.[color] || null;
                    const colorStock = attributes.size_stock?.[color] || {};
                    const colorPrices = attributes.size_prices?.[color] || {};
                    const totalStock = Object.values(colorStock).reduce((sum, val) => sum + (Number(val) || 0), 0);
                    return (
                      <div
                        key={color}
                        className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-600 w-full box-border"
                      >
                        <div className="flex items-center gap-3 pb-2.5 border-b border-dashed border-slate-300 dark:border-slate-500 flex-wrap">
                          <div
                            className="w-10 h-10 rounded-full border-2 border-slate-300 dark:border-slate-500 flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                              {color.toUpperCase()}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              Total: {totalStock} pcs | Sizes: {Object.keys(colorStock).length}
                            </div>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {colorImage ? "✅ Image" : "⚠️ Missing"}
                          </div>
                        </div>

                        {Object.keys(colorStock).length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2.5">
                            {Object.entries(colorStock).map(([size, stock]) => {
                              const price = colorPrices[size] || 0;
                              return (
                                <div
                                  key={size}
                                  className="bg-gradient-to-br from-white to-slate-100 dark:from-[#1e293b] dark:to-[#0f172a] border border-slate-200 dark:border-slate-600 rounded-[10px] p-2.5 flex flex-col gap-2"
                                >
                                  <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-300 dark:border-slate-500">
                                    <span className="font-bold text-[13px] text-white bg-gradient-to-br from-blue-500 to-blue-600 px-2.5 py-0.5 rounded-md">
                                      {size}
                                    </span>
                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-xl ${
                                      stock > 0
                                        ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-[#1a3a2a]'
                                        : 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-[#2d1a1a]'
                                    }`}>
                                      {stock > 0 ? `${stock} pcs` : 'Out'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center gap-1.5">
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Price:</span>
                                    <span className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                                      TZS {Number(price).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock Summary Box */}
            <div className="mt-4 p-3 bg-slate-100 dark:bg-[#1e293b] rounded-lg flex flex-wrap justify-between gap-2.5">
              <div>
                <span className="text-xs text-slate-600 dark:text-slate-400">📦 Total Stock:</span>
                <span className="text-xs font-bold ml-2 text-blue-600 dark:text-blue-400">
                  {attributes.colors?.reduce((total, color) => {
                    const colorStock = attributes.size_stock?.[color] || {};
                    return total + Object.values(colorStock).reduce((sum, val) => sum + (Number(val) || 0), 0);
                  }, 0) || 0} pcs
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-600 dark:text-slate-400">🖼️ Colors with images:</span>
                <span className="text-xs font-bold ml-2 text-emerald-600 dark:text-emerald-400">
                  {Object.values(attributes.color_images || {}).filter(img => img).length} / {(attributes.colors || []).length}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-600 dark:text-slate-400">💰 Sizes with prices:</span>
                <span className="text-xs font-bold ml-2 text-emerald-600 dark:text-emerald-400">
                  {Object.values(attributes.size_prices || {}).reduce((total, colorPrices) => {
                    return total + Object.keys(colorPrices || {}).length;
                  }, 0)}
                </span>
              </div>
            </div>

            <small className="block text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              📌 This summary shows all info you entered in SECTION 9. No need to fill in again.
            </small>
          </div>
        </div>
      </>
    )}

    {/* ========== SALES MODE & PRICING ========== */}
    <div className="flex items-center gap-2.5 mt-2">
      <DollarSign size={20} />
      <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
        Mfumo wa Uuzaji na Bei
      </h3>
    </div>

    <div className="bg-blue-50 dark:bg-[#1e3a5f] p-5 sm:p-7 md:p-8 rounded-3xl border-2 border-blue-100 dark:border-blue-700">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-7 mb-5 sm:mb-6">
        {["Retail", "Wholesale"].map((mode) => (
          <label
            key={mode}
            className="flex items-center gap-3 font-bold text-sm sm:text-base text-blue-900 dark:text-slate-100 cursor-pointer"
          >
            <input
              type="checkbox"
              className="w-5 h-5 accent-blue-600"
              checked={mode === "Retail" ? attributes.is_retail : attributes.is_wholesale}
              onChange={(e) => setAttributes({
                ...attributes,
                [mode === "Retail" ? "is_retail" : "is_wholesale"]: e.target.checked
              })}
            />
            {mode === "Retail" ? "🏪 Rejareja (Retail)" : "📦 Jumla (Wholesale)"}
          </label>
        ))}
      </div>

      {attributes.is_wholesale && (
        <div className="bg-white dark:bg-[#0f172a] p-4 sm:p-5 md:p-6 rounded-2xl mt-5 w-full box-border border border-slate-200 dark:border-slate-600 shadow-inner">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            Viwango vya Bei kwa Jumla
          </label>
          {attributes.price_tiers?.map((tier, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.5fr_auto] gap-2.5 md:gap-4 items-center mb-3 md:mb-4 animate-[slideIn_0.3s_ease-out]"
            >
              <input
                type="number"
                placeholder="Kuanzia (pcs)"
                value={tier.from_qty}
                onChange={(e) => handleTierChange(index, "from_qty", e.target.value)}
                className="w-full px-3 py-2.5 md:px-4 md:py-3 border-2 border-slate-100 dark:border-slate-600 rounded-lg text-sm bg-slate-50 dark:bg-[#1e293b] text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Mpaka (pcs)"
                value={tier.to_qty}
                onChange={(e) => handleTierChange(index, "to_qty", e.target.value)}
                className="w-full px-3 py-2.5 md:px-4 md:py-3 border-2 border-slate-100 dark:border-slate-600 rounded-lg text-sm bg-slate-50 dark:bg-[#1e293b] text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Bei (TZS)"
                value={tier.unit_price}
                onChange={(e) => handleTierChange(index, "unit_price", e.target.value)}
                className="w-full px-3 py-2.5 md:px-4 md:py-3 border-2 border-slate-100 dark:border-slate-600 rounded-lg text-sm bg-slate-50 dark:bg-[#1e293b] text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removePriceTier(index)}
                className="w-full md:w-9 h-10 md:h-9 rounded-lg bg-red-50 dark:bg-[#2d1a1a] text-red-500 dark:text-red-400 border-none cursor-pointer flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addPriceTier}
            className="w-full py-3 bg-slate-50 dark:bg-[#1e293b] text-blue-600 dark:text-blue-400 border-2 border-dashed border-blue-500 rounded-xl font-bold cursor-pointer hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Ongeza Kiwango kingine
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2.5 mt-5 pt-5 border-t border-dashed border-slate-200 dark:border-slate-600">
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          Kiwango cha chini cha Agizo (MOQ)
        </label>
        <input
          type="number"
          className="w-full max-w-[300px] px-3 py-2.5 md:px-4 md:py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-[#0f172a] text-slate-800 dark:text-slate-100 focus:outline-none"
          placeholder="Idadi ya chini inayoruhusiwa kwa agizo moja"
          value={attributes.moq || ""}
          onChange={(e) => setAttributes({ ...attributes, moq: e.target.value })}
        />
        <small className="text-[11px] text-slate-500 dark:text-slate-400">
          Acha wazi kama hakuna kiwango cha chini
        </small>
      </div>
    </div>

    {/* ========== PRICE & STOCK ========== */}
    <div className="flex items-center gap-2.5 mt-2">
      <ShoppingBag size={20} />
      <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
        Price & Stock
      </h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-7">
      {attributes.is_retail && (
        <div>
          <label className="flex items-center gap-2.5 text-sm sm:text-[15px] font-bold text-slate-800 dark:text-slate-100 mb-3">
            {attributes.has_colors ? "Starting Price (TZS)" : "Retail Price (TZS)"}
            {!attributes.has_colors && <span className="text-rose-500">*</span>}
          </label>
          <input
            type="number"
            className="w-full bg-slate-50 dark:bg-[#1e293b] border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/12 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed box-border"
            placeholder={attributes.has_colors ? "Auto-filled from lowest size price" : "e.g. 25000"}
            value={attributes.price || ""}
            onChange={(e) => setAttributes({ ...attributes, price: e.target.value })}
            disabled={attributes.has_colors && Object.keys(attributes.size_prices || {}).length > 0}
          />
          <small className="block text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {attributes.has_colors
              ? "📌 This price is not used. Each size uses its own price in SECTION 9."
              : "Retail selling price per item"}
          </small>
        </div>
      )}
      <div>
        <label className="flex items-center gap-2.5 text-sm sm:text-[15px] font-bold text-slate-800 dark:text-slate-100 mb-3">
          Total Stock <span className="text-rose-500">*</span>
        </label>
        <input
          type="number"
          className="w-full bg-slate-50 dark:bg-[#1e293b] border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/12 focus:outline-none box-border"
          placeholder="Number of items available"
          value={attributes.stock || ""}
          onChange={(e) => setAttributes({ ...attributes, stock: e.target.value })}
          min="0"
        />
        {productVariations.length > 0 && (
          <small className="block text-emerald-500 text-xs mt-1">
            ✅ Stock is auto-calculated from variations ({productVariations.reduce((acc, v) => acc + (Number(v.stock_quantity) || 0), 0)})
          </small>
        )}
      </div>
    </div>

    {/* ========== LOW STOCK WARNING ========== */}
    {selectedLeaf && selectedLeaf.min_stock_warning && (
      <div className="bg-orange-50 dark:bg-[#2d1a1a] text-orange-700 dark:text-red-400 p-4 md:p-5 rounded-2xl flex items-start gap-3 border border-orange-100 dark:border-red-700 mt-4 font-semibold text-xs md:text-sm">
        <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
        <div>
          <strong>⚠️ Onyo la Stock</strong>
          <p className="m-0 mt-1">
            Bidhaa hii ina kiwango cha chini cha onyo cha stock: {selectedLeaf.min_stock_warning} (Utapata arifa stock inapofikia kiwango hiki)
          </p>
        </div>
      </div>
    )}

    {/* ========== DEBUG INFO ========== */}
    {process.env.NODE_ENV === 'development' && (
      <div className="bg-gray-100 dark:bg-[#1e293b] p-2.5 rounded-lg text-xs mt-5">
        <details>
          <summary className="cursor-pointer font-bold text-slate-800 dark:text-slate-200">
            🔧 Debug Information
          </summary>
          <div className="mt-2 space-y-1 text-slate-600 dark:text-slate-400">
            <p className="m-0"><strong>Selected Leaf:</strong> {selectedLeaf?.name || "None"}</p>
            <p className="m-0"><strong>require_gender:</strong> {selectedLeaf?.require_gender ? "Yes" : "No"}</p>
            <p className="m-0"><strong>require_size:</strong> {selectedLeaf?.require_size ? "Yes" : "No"}</p>
            <p className="m-0"><strong>size_format:</strong> {selectedLeaf?.size_format || "Not set"}</p>
            <p className="m-0"><strong>color_required:</strong> {selectedLeaf?.color_required !== false ? "Yes" : "No"}</p>
            <p className="m-0"><strong>Colors count:</strong> {attributes.colors?.length || 0}</p>
            <p className="m-0"><strong>Sizes count:</strong> {attributes.sizes?.length || 0}</p>
            <p className="m-0"><strong>Variations count:</strong> {attributes.variations?.length || 0}</p>
            <p className="m-0"><strong>Total Stock:</strong> {attributes.stock || 0}</p>
          </div>
        </details>
      </div>
    )}
  </div>
);

  }
export default React.memo(ProductAttributes);