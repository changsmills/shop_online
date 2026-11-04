// src/components/ProductInfo.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../axiosConfig';
import ProductSelectionDrawer from '../pages/ProductSelectionDrawer';
import { MessageSquare, Star, ChevronRight, ShoppingCart, Zap, ThumbsUp, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useQuery } from '@tanstack/react-query';

// Function ya kuchukua Media na Variations
const fetchProductMediaAndVariations = async ({ queryKey }) => {
  const [_, productId] = queryKey;
  if (!productId) return { mediaData: [], varData: [] };

  const [mediaRes, varRes] = await Promise.all([
    api.get(`/product-media/?product_id=${productId}`),
    api.get(`/product-variations/`, { params: { product_id: productId } })
  ]);

  const mediaData = mediaRes.data.results || mediaRes.data || [];
  let varData = varRes.data.results || varRes.data || [];

  varData = varData.filter(v => String(v.product) === String(productId));

  return { mediaData, varData };
};

const ProductInfo = ({ product, storeProducts = [], onRate, isMobile = false }) => {
  const [productVariations, setProductVariations] = useState([]);
  
  const [selectedVariationObj, setSelectedVariationObj] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  
  const [hover, setHover] = useState(0);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [drawerAction, setDrawerAction] = useState('order');
  const [selectedItems, setSelectedItems] = useState({});
  const [purchaseQty, setPurchaseQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const [activeColor, setActiveColor] = useState(null);
  const [activeSize, setActiveSize] = useState(null);
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);

  // ==========================================
  // STATES ZA REVIEWS (Maoni)
  // ==========================================
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  
  // Mock Reviews (Badilisha hizi baadaye kwa data kutoka API)
  const mockReviews = [
    {
      id: 1,
      name: "Juma M.",
      rating: 5,
      date: "2 siku zilizopita",
      comment: "Bidhaa ni nzuri sana na inafanya kazi vizuri. Ilifika haraka na packaging ilikuwa nzuri. Nawashauri wengine kununua.",
      verified: true,
      helpful: 12
    },
    {
      id: 2,
      name: "Asha K.",
      rating: 4,
      date: "Wiki iliyopita",
      comment: "Ni nzuri lakini nilidhani ni kubwa kidogo kuliko nilivyodhani. Lakini kwa bei hii ni thamani ya pesa.",
      verified: false,
      helpful: 4
    }
  ];

  const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/rlgqgsnv/image/upload";

  const moq = product?.moq || 1;
  const productImage = product?.cover_image || "https://via.placeholder.com/150";

  // ==========================================
  // 3. QUERY YA KUPATA MEDIA NA VARIATIONS
  // ==========================================
  const { data: mediaAndVariations } = useQuery({
    queryKey: ['productMediaVariations', product?.id],
    queryFn: fetchProductMediaAndVariations,
    enabled: !!product?.id,
    staleTime: 1000 * 60 * 5,
  });

  const productMedia = mediaAndVariations?.mediaData || [];

  useEffect(() => {
    if (mediaAndVariations?.varData) {
      const varData = mediaAndVariations.varData;
      setProductVariations(varData);

      if (varData.length > 0) {
        const defaultVar = varData.find(v => v.stock_quantity > 0) || varData[0];
        setSelectedColor(defaultVar.color_name);

        const firstSize = defaultVar.size_value || "";
        setSelectedSize(firstSize);

        setSelectedVariationObj({
          ...defaultVar,
          size_value: firstSize || null,
          stock_quantity: (defaultVar.size_stock && defaultVar.size_stock[firstSize] !== undefined)
            ? defaultVar.size_stock[firstSize]
            : (defaultVar.stock_quantity || 0)
        });
      } else {
        setSelectedColor("");
        setSelectedSize("");
        setSelectedVariationObj(null);
      }
    }
  }, [mediaAndVariations]);

  useEffect(() => {
    setProductVariations([]);
    setSelectedColor("");
    setSelectedSize("");
    setSelectedVariationObj(null);
    setActiveColor(null);
    setActiveSize(null);
  }, [product?.id]);


  const parseJsonData = (data, fallback) => {
    if (!data) return fallback;
    if (typeof data === 'string') {
      try { return JSON.parse(data); } catch (e) { return fallback; }
    }
    return data;
  };

  const wholesaleTiers = useMemo(() => parseJsonData(product?.price_tiers || product?.wholesale_tiers, []), [product]);
  const audience = useMemo(() => parseJsonData(product?.target_audience, []), [product]);

  const variationsByColor = useMemo(() => {
    const grouped = {};
    productVariations.forEach(v => {
      if (String(v.product) !== String(product?.id)) return;

      const colorName = v.color_name;
      
      let fullImageUrl = v.color_image_url;
      if (!fullImageUrl && v.color_image) {
        fullImageUrl = `${CLOUDINARY_BASE_URL}/${v.color_image}`;
      }

      if (!grouped[colorName]) {
        grouped[colorName] = {
          variation: v,
          color_image: fullImageUrl || v.color_image,
          size_stock: v.size_stock || {},
          price: v.price,
          stock_quantity: v.stock_quantity,
          sizesMap: {}
        };
      }

      const sizeKey = v.size_value;
      if (sizeKey) {
        const stockForSize = (v.size_stock && v.size_stock[sizeKey] !== undefined)
          ? v.size_stock[sizeKey]
          : (v.stock_quantity || 0);

        grouped[colorName].sizesMap[sizeKey] = {
          price: Number(v.price) || 0,
          stock: stockForSize,
          variationId: v.id,
        };
      }
    });
    return grouped;
  }, [productVariations, product?.id]);

  const openDrawer = (color, size) => {
    setActiveColor(color);
    setActiveSize(size);
    setIsSelectionOpen(true);
  };

  const availableSizesForColor = useMemo(() => {
    if (!selectedColor) return [];
    const colorData = variationsByColor[selectedColor];
    if (!colorData) return [];
    const sizes = Object.keys(colorData.sizesMap || {});
    return sizes.sort((a, b) => {
      const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [selectedColor, variationsByColor]);

  const getPriceForSize = (color, size) => {
    const colorData = variationsByColor[color];
    if (!colorData?.sizesMap?.[size]) return Number(product?.price) || 0;
    return colorData.sizesMap[size].price;
  };

  const getStockForSize = (color, size) => {
    const colorData = variationsByColor[color];
    if (!colorData?.sizesMap?.[size]) return 0;
    return colorData.sizesMap[size].stock;
  };

  const getCurrentVariation = (color, size) => {
    const found = productVariations.find(v => 
      String(v.product) === String(product?.id) &&
      v.color_name === color && 
      (size ? String(v.size_value) === String(size) : true)
    );
    if (!found) return null;
    
    const specificStock = (found.size_stock && found.size_stock[size] !== undefined)
      ? found.size_stock[size]
      : (found.stock_quantity || 0);
    
    return {
      ...found,
      size_value: size || found.size_value,
      stock_quantity: specificStock,
      id: found.id 
    };
  };

  const currentStock = useMemo(() => {
    if (selectedSize && selectedColor) {
      return getStockForSize(selectedColor, selectedSize);
    }
    return selectedVariationObj?.stock_quantity || product?.stock_quantity || 0;
  }, [selectedVariationObj, product, selectedColor, selectedSize]);

  const currentPrice = useMemo(() => {
    if (selectedColor && selectedSize) {
      const priceFromMap = getPriceForSize(selectedColor, selectedSize);
      if (priceFromMap > 0) return priceFromMap;
    }
    const variationPrice = parseFloat(selectedVariationObj?.price);
    if (variationPrice > 0) return variationPrice;
    return parseFloat(product?.price) || 0;
  }, [selectedColor, selectedSize, variationsByColor, selectedVariationObj, product]);

  const currentSpecs = useMemo(() => {
    if (selectedVariationObj && selectedVariationObj.attributes) {
      let attrs = selectedVariationObj.attributes;
      if (typeof attrs === 'string') {
        try { attrs = JSON.parse(attrs); } catch (e) { return {}; }
      }
      const { color, size, sizes, size_stock, ...restSpecs } = attrs;
      const filtered = {};
      Object.entries(restSpecs).forEach(([key, value]) => {
        if (value && value !== "" && value !== null && value !== undefined) {
          filtered[key] = value;
        }
      });
      return filtered;
    }
    return {};
  }, [selectedVariationObj]);

  const totalQuantity = useMemo(() => {
    const qtyFromDrawer = Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0);
    return qtyFromDrawer > 0 ? qtyFromDrawer : purchaseQty;
  }, [selectedItems, purchaseQty]);

  const currentUnitPrice = useMemo(() => {
    if (product?.is_wholesale && wholesaleTiers.length > 0) {
      const sortedTiers = [...wholesaleTiers].sort((a, b) => (b.from_qty || b.min_qty || 0) - (a.from_qty || a.min_qty || 0));
      const applicableTier = sortedTiers.find(tier => totalQuantity >= (tier.from_qty || tier.min_qty || 0));
      if (applicableTier) {
        return (applicableTier.unit_price || applicableTier.price || 0);
      }
    }
    return currentPrice;
  }, [totalQuantity, product, wholesaleTiers, currentPrice]);

  const totalBill = useMemo(() => currentUnitPrice * totalQuantity, [currentUnitPrice, totalQuantity]);
  const formatPrice = (price) => (price ? Number(price).toLocaleString() : "0");

  const selectVariationAndOpenDrawer = (variation, action = 'order') => {
    if (!variation) return;

    setSelectedVariationObj(variation);
    setSelectedColor(variation.color_name);
    setSelectedSize(variation.size_value || "");
    setDrawerAction(action);
    
    let itemKey = variation.size_value ? `${variation.id}::${variation.size_value}` : variation.id;
    setSelectedItems({ [itemKey]: 1 });
    setPurchaseQty(1);
    setIsSelectionOpen(true);

    toast.success(`${variation.color_name}${variation.size_value ? ` - ${variation.size_value}` : ''} imechaguliwa`);
  };

  const handleColorSelect = async (color) => {
    const colorData = variationsByColor[color];
    if (colorData) {
      const sizes = Object.keys(colorData.sizesMap || {});
      const firstSize = sizes.length > 0 ? sizes[0] : "";
      
      setActiveColor(color);
      setActiveSize(firstSize);
      setSelectedColor(color);
      setSelectedSize(firstSize);
      
      const variation = getCurrentVariation(color, firstSize || null);
      await selectVariationAndOpenDrawer(variation, 'order');
    }
  };

  const handleSizeSelect = async (size) => {
    if (selectedColor) {
      const stockQty = getStockForSize(selectedColor, size);
      if (stockQty === 0) {
        toast.error(`Ukubwa ${size} haupo stokini`);
        return;
      }
      
      setActiveColor(selectedColor);
      setActiveSize(size);
      
      const variation = getCurrentVariation(selectedColor, size);
      if (variation) {
        await selectVariationAndOpenDrawer(variation, 'order');
      }
    }
  };

  const handleOpenDrawer = (action) => {
    if (!selectedColor) {
      toast.error("Tafadhali chagua rangi kwanza!");
      return;
    }
    
    if (availableSizesForColor.length > 0 && !selectedSize) {
      toast.error("Tafadhali chagua ukubwa kwanza!");
      return;
    }
    
    let targetVariation = selectedVariationObj;
    if (!targetVariation) {
      const variation = getCurrentVariation(selectedColor, selectedSize);
      if (variation) {
        targetVariation = variation;
        setSelectedVariationObj(variation);
      } else {
        toast.error("Tafadhali chagua rangi na ukubwa kwanza!");
        return;
      }
    }
    
    setDrawerAction(action);
    
    const itemKey = selectedSize 
      ? `${targetVariation.id}::${selectedSize}` 
      : targetVariation.id;
      
    setSelectedItems({ [itemKey]: 1 });
    setIsSelectionOpen(true);
  };

  const handleQtyChange = (variant, delta = 1) => {
    const targetId = variant?.id;
    const stockQty = variant?.stock_quantity || currentStock;
    
    if (stockQty > 0) {
      setSelectedItems(prev => {
        const currentQty = prev[targetId] || 0;
        let newQty = currentQty + delta;
        
        if (newQty < 0) newQty = 0;
        
        if (newQty > stockQty) {
          toast.error(`Zipo ${stockQty} tu zimebaki`);
          return prev;
        }
        return { ...prev, [targetId]: newQty };
      });
      
      setPurchaseQty(prev => {
        let newQty = prev + delta;
        if (newQty < 0) newQty = 0;
        if (newQty > stockQty) return prev;
        return newQty;
      });
    } else {
      toast.error("Samahani, bidhaa hii imeisha stoo.");
    }
  };

  const handleDrawerConfirm = async () => {
    if (loading) return; 
    setLoading(true);

    const finalQty = Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0);
    
    if (finalQty === 0) {
      toast.error("Tafadhali chagua angalau bidhaa moja");
      setLoading(false);
      return;
    }

    if (drawerAction === 'order') {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.dismiss();
        toast.error("Tafadhali ingia kwanza!");
        setLoading(false);
        navigate("/dashboard/login");
        return;
      }
    }

    const itemsToProcess = [];
    Object.entries(selectedItems).forEach(([itemKey, qty]) => {
      if (qty <= 0) return;
      
      let variantIdFromKey = itemKey.split('::')[0];
      let selectedSizeFromKey = itemKey.includes('::') ? itemKey.split('::')[1] : null;
      
      let variant = productVariations.find(v => String(v.id) === String(variantIdFromKey));
      if (!variant) return;

      let fullImageUrl = variant.color_image_url;
      if (!fullImageUrl && variant.color_image) {
          fullImageUrl = `${CLOUDINARY_BASE_URL}/${variant.color_image}`;
      }

      itemsToProcess.push({
        id: product.id,
        variant_id: variant.id,
        name: product.name,
        selected_color: variant.color_name || 'Standard',
        selected_size: selectedSizeFromKey || 'Free Size',
        quantity: qty,
        price: Number(variant.price) || Number(product?.price) || 0, 
        cover_image_url: fullImageUrl || product?.cover_image_url || product?.cover_image,
        image: fullImageUrl || product?.cover_image_url || product?.cover_image,
        store_id: product.store_id
      });
    });

    if (itemsToProcess.length === 0) {
      toast.error("Hakuna bidhaa zilizochaguliwa");
      setLoading(false);
      return;
    }

    setIsSelectionOpen(false);
    setSelectedItems({});
    setPurchaseQty(1);
    setLoading(false);

    if (drawerAction === 'cart') {
      itemsToProcess.forEach(item => addToCart(item));
      toast.success("Imeongezwa kwenye kikapu!");
      navigate('/cart');
    } else {
      navigate('/checkout', { state: { orderItems: itemsToProcess } });
    }
  };

  const handleWhatsAppOrder = async () => {
    setDrawerAction('whatsapp');

    if (selectedColor && selectedVariationObj) {
      const itemKey = selectedSize 
        ? `${selectedVariationObj.id}::${selectedSize}` 
        : selectedVariationObj.id;

      setSelectedItems({ [itemKey]: 1 });
      setActiveColor(selectedColor);
      setActiveSize(selectedSize);
    } else {
      setSelectedItems({});
    }

    setIsSelectionOpen(true);
  };

  const handleChatWithSeller = () => {
    if (!product?.stores?.owner_id) {
      toast.error("Samahani, muuzaji huyu hajapatikana.");
      return; 
    }

    navigate('/dashboard/messages', {
      state: {
        sellerId: product.stores.owner_id,
        sellerName: product.stores.store_name || "Mmuuzaji",
        productContext: product.name || "Bidhaa",
      },
    });
  };

  const handleAddToCartLocal = async () => {
    await handleOpenDrawer('cart');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (reviewRating === 0) {
      toast.error("Tafadhali chagua nyota (rating) kwanza!");
      return;
    }
    if (reviewComment.trim().length < 5) {
      toast.error("Tafadhali andika maoni yako kwa urefu wa kutosha.");
      return;
    }
    
    setSubmittingReview(true);
    
    setTimeout(() => {
      toast.success("Asante! Maoni yako yamepokelewa na yatasubiri approval.");
      setReviewRating(0);
      setReviewComment("");
      setShowReviewForm(false);
      setSubmittingReview(false);
    }, 1000);
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #334155; }
      `}</style>

      {/* 
        🔥 HAPA: Container Kuu. Tumeongeza md:h-[calc(100vh-120px)] na md:overflow-hidden 
        ili kuzuia page nzima iscroll, na badala yake content ndio iscroll.
      */}
      <div className="bg-white dark:bg-black flex flex-col w-full md:sticky md:top-[100px] text-gray-900 dark:text-white md:h-[calc(100vh-120px)] md:rounded-xl md:overflow-hidden font-sans">
        
        <ProductSelectionDrawer
          isOpen={isSelectionOpen}
          initialColor={activeColor}
          initialSize={activeSize}
          onClose={() => { setIsSelectionOpen(false); setSelectedItems({}); }}
          product={product}
          variations={productVariations}
          productMedia={productMedia}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          selectedVariation={selectedVariationObj}
          handleQtyChange={handleQtyChange}
          purchaseQty={purchaseQty}
          setPurchaseQty={setPurchaseQty}
          totalQuantity={Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0)}
          currentUnitPrice={currentUnitPrice}
          formatPrice={formatPrice}
          productImage={productImage}
          actionType={drawerAction}
          onConfirm={handleDrawerConfirm}
          addToCart={addToCart}
          handleAddToCart={handleAddToCartLocal}
          isLoading={loading}
        />

        {/* Mobile Bottom Nav (Haibadiliki) */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black flex justify-around items-center px-3 pt-2 pb-5 border-t border-gray-200 dark:border-[#1f1f1f] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.6)] z-[1000] gap-2">
            <button onClick={handleWhatsAppOrder} disabled={!selectedVariationObj || loading} className="flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-[11px] font-semibold cursor-pointer bg-[#25D366] text-white active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
              <MessageSquare size={20} />
              <span>WhatsApp</span>
            </button>
            <button onClick={() => handleOpenDrawer('order')} disabled={!selectedVariationObj || currentStock === 0 || loading} className="flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-[11px] font-semibold cursor-pointer bg-[#ff4e00] dark:bg-[#ff6a00] text-white active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
              <Zap size={20} />
              <span>Order Now</span>
            </button>
            <button onClick={() => handleOpenDrawer('cart')} disabled={!selectedVariationObj || currentStock === 0 || loading} className="flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-[11px] font-semibold cursor-pointer bg-white dark:bg-[#0a0a0a] text-[#ff4e00] dark:text-[#ff6a00] border border-[#ff4e00] dark:border-[#ff6a00] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
              <ShoppingCart size={20} />
              <span>Cart</span>
            </button>
            <button onClick={handleChatWithSeller} className="flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-[11px] font-semibold cursor-pointer bg-[#f3f4f6] dark:bg-[#0a0a0a] text-[#374151] dark:text-white border border-transparent dark:border-[#1f1f1f] active:scale-95">
              <MessageSquare size={20} />
              <span>Chat</span>
            </button>
          </div>
        )}

        {/* 
          🔥 HAPA: Content Area. Tumeongeza overflow-y-auto na flex-1 
          ili ichukue nafasi yote iliyobaki juu ya buttons za Desktop na iscroll.
        */}
        <div className="flex flex-col gap-3 p-3 w-full box-border overflow-y-auto flex-1 custom-scrollbar">
          
          {/* ===== RATING SUMMARY (Juu - Inakaa Pale Pale Ikiscroll) ===== */}
           <div className="bg-white dark:bg-[#0a0a0a] rounded-xl p-3 md:p-4 shadow-sm border border-[#f0f0f0] dark:border-[#1f1f1f] flex flex-col h-auto mb-2">
              <h1 className="text-[15px] md:text-[20px] max-lg:text-[18px] max-md:text-[16px] font-bold mb-1.5 md:mb-2 leading-[1.3] text-[#1a1a1a] dark:text-white capitalize">
              {product?.name ? product.name.charAt(0).toUpperCase() + product.name.slice(1) : ""}
            </h1>
            
            <div className="flex items-center gap-2 mb-2.5 md:mb-[15px] flex-wrap">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={18} fill={(hover || product.average_rating) >= star ? "#ffc107" : "none"} color="#ffc107" 
                    className="cursor-pointer md:w-[20px] md:h-[20px]" onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} onClick={() => onRate && onRate(star)} />
                ))}
              </div>
              <span className="text-[14px] font-bold text-gray-800 dark:text-white">
                {product.average_rating ? Number(product.average_rating).toFixed(1) : "0.0"}
              </span>
              <span className="text-[13px] text-gray-500 dark:text-gray-400 underline cursor-pointer" onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}>
                ({product.total_reviews || 0} reviews)
              </span>
            </div>
          </div>

          {/* ... (Variations, Stoo, Specs, Bei, Audience zipo hapa kama kawaida) ... */}
          <div className="bg-white dark:bg-[#0a0a0a] rounded-[10px] md:rounded-xl p-3 md:p-4 shadow-sm border border-[#f0f0f0] dark:border-[#1f1f1f] flex flex-col h-auto">
            {Object.keys(variationsByColor).length > 0 && (
              <div className="mb-5">
                <span className="text-[14px] text-[#333] dark:text-white block mb-3 font-semibold">Rangi zinazopatikana:</span>
                <div className="flex gap-2 md:gap-3 flex-wrap">
                  {Object.keys(variationsByColor).map((color) => {
                    const colorData = variationsByColor[color];
                    const totalStock = Object.values(colorData.sizesMap || {}).reduce(
                      (sum, s) => sum + (Number(s.stock) || 0), 0
                    );
                    return (
                      <div key={color} onClick={() => handleColorSelect(color)} className="cursor-pointer flex flex-col items-center gap-1.5">
                        <div className={`w-[40px] h-[40px] md:w-[55px] md:h-[55px] rounded-[10px] md:rounded-xl border overflow-hidden bg-white dark:bg-[#0a0a0a] flex items-center justify-center transition-all duration-200 ${selectedColor === color ? 'border-2 border-[#ff4e00] dark:border-[#ff6a00] shadow-[0_0_0_2px_rgba(255,78,0,0.2)] dark:shadow-[0_0_0_2px_rgba(255,106,0,0.4)]' : 'border-[#ddd] dark:border-[#1f1f1f]'}`}>
                          {colorData.color_image ? <img src={colorData.color_image} alt={color} className="w-full h-full object-cover" /> :
                            <div style={{ width: '100%', height: '100%', backgroundColor: color.toLowerCase() }} />}
                        </div>
                        <span className={`text-[9px] md:text-[11px] ${selectedColor === color ? 'text-[#ff4e00] dark:text-[#ff6a00] font-bold' : 'text-[#666] dark:text-[#b0b0b0]'}`}>{color}</span>
                        <span className="text-[10px] text-[#888] dark:text-[#6b6b6b]">{totalStock} left</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {availableSizesForColor.length > 0 && (
              <div className="mb-5">
                <span className="text-[14px] text-[#333] dark:text-white block mb-3 font-semibold">Ukubwa (Bonyeza kuchagua):</span>
                <div className="flex gap-2 md:gap-2.5 flex-wrap">
                  {availableSizesForColor.map((size) => {
                    const sizeStock = getStockForSize(selectedColor, size);
                    const isOutOfStock = sizeStock === 0;
                    return (
                      <button key={size} onClick={() => !isOutOfStock && handleSizeSelect(size)} disabled={isOutOfStock}
                        className={`px-3 py-1.5 md:px-5 md:py-2.5 rounded-[10px] border text-[11px] md:text-[14px] transition-all duration-200 cursor-pointer 
                          ${selectedSize === size ? 'border-2 border-[#ff4e00] dark:border-[#ff6a00] bg-[#fff4f0] dark:bg-[#1f1000] text-[#ff4e00] dark:text-[#ff6a00] font-bold' : 'border-[#ddd] dark:border-[#1f1f1f] bg-white dark:bg-[#0a0a0a] text-[#333] dark:text-white'} 
                          ${isOutOfStock ? 'opacity-50 dark:opacity-40 cursor-not-allowed text-[#666] dark:text-[#6b6b6b]' : ''}`}>
                        {size}{isOutOfStock && <span className="text-[10px] ml-1">(Imeisha)</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mb-3 md:mb-[15px] py-2 md:py-2.5 border-t border-b border-[#eee] dark:border-[#1f1f1f] flex items-center flex-wrap">
              <span className="text-[12px] md:text-[13px] text-[#666] dark:text-[#b0b0b0]">Hali ya Stoo:</span>
              <span className={`ml-2 font-bold ${currentStock > 0 ? 'text-[#10b981] dark:text-[#22c55e]' : 'text-[#ef4444]'}`}>
                {currentStock > 0 ? `✅ ${currentStock} Zimebaki` : '❌ Imeisha'}
              </span>
            </div>

            {Object.keys(currentSpecs).length > 0 && (
              <div className="mt-[15px] border border-[#f0f0f0] dark:border-[#1f1f1f] rounded-lg overflow-hidden">
                <div className="p-2.5 px-3 bg-[#fafafa] dark:bg-[#0a0a0a] border-b border-[#f0f0f0] dark:border-[#1f1f1f] text-[13px] font-semibold text-[#333] dark:text-white">📋 Specifications</div>
                <table className="w-full border-collapse text-[11px] md:text-[12px]">
                  <tbody>
                    {Object.entries(currentSpecs).map(([key, value], index) => (
                      <tr key={key} className={index % 2 === 0 ? 'bg-white dark:bg-[#0a0a0a]' : 'bg-[#fafafa] dark:bg-[#0f0f0f]'}>
                        <td className="p-2 px-2.5 md:p-2.5 md:px-3 border-b border-[#f0f0f0] dark:border-[#1f1f1f] text-[#666] dark:text-[#b0b0b0] w-[45%] font-medium">{key}</td>
                        <td className="p-2 px-2.5 md:p-2.5 md:px-3 border-b border-[#f0f0f0] dark:border-[#1f1f1f] text-[#333] dark:text-white font-medium">{typeof value === 'object' ? JSON.stringify(value) : value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-3 md:mt-[15px] p-2.5 md:p-3 bg-[#f9fafb] dark:bg-[#0a0a0a] dark:border dark:border-[#1f1f1f] rounded-lg">
              <span className="text-[12px] md:text-[13px] text-[#666] dark:text-[#b0b0b0]">Bei:</span>
              <span className="text-[18px] md:text-[24px] max-lg:text-[22px] max-md:text-[20px] font-extrabold text-[#ff4e00] dark:text-[#ff6a00] ml-2">TSH {formatPrice(currentUnitPrice)}</span>
              {product?.is_wholesale && moq > 1 && (
                <div className="text-[11px] text-[#666] dark:text-[#b0b0b0] mt-1">📦 Minimum Order: {moq} pieces</div>
              )}
            </div>
          </div>

          {audience && audience.length > 0 && (
            <div className="bg-white dark:bg-[#0a0a0a] rounded-[10px] md:rounded-xl p-3 md:p-4 shadow-sm border border-[#f0f0f0] dark:border-[#1f1f1f] flex flex-col h-auto">
              <span className="text-[14px] text-[#333] dark:text-white block mb-3 font-semibold">👥 Inafaa kwa:</span>
              <div className="flex flex-wrap gap-1.5">
                {audience.map((a, i) => (
                  <span key={i} className="bg-[#f3f4f6] dark:bg-[#0a0a0a] dark:border dark:border-[#1f1f1f] px-2.5 py-[3px] md:px-3 md:py-1 rounded-[20px] text-[11px] md:text-[12px] text-[#4b5563] dark:text-white">{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* ===== REVIEWS SECTION ===== */}
          <div id="reviews-section" className="bg-white dark:bg-[#0a0a0a] rounded-[10px] md:rounded-xl p-4 md:p-6 shadow-sm border border-[#f0f0f0] dark:border-[#1f1f1f] mt-2 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[16px] md:text-[18px] font-bold text-gray-900 dark:text-white m-0">
                Customer Reviews
              </h2>
              <button 
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-[#ff4e00] text-[12px] md:text-[14px] font-semibold hover:underline"
              >
                {showReviewForm ? "Cancel" : "Write a Review"}
              </button>
            </div>

            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="bg-gray-50 dark:bg-[#111] p-4 rounded-xl mb-6 border border-gray-100 dark:border-gray-800">
                <h3 className="text-[14px] font-semibold mb-3">Rate this product</h3>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={24} 
                      fill={(reviewHover || reviewRating) >= star ? "#ffc107" : "none"} 
                      color="#ffc107"
                      className="cursor-pointer transition-colors"
                      onMouseEnter={() => setReviewHover(star)}
                      onMouseLeave={() => setReviewHover(0)}
                      onClick={() => setReviewRating(star)}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    {reviewRating > 0 ? `${reviewRating} Star${reviewRating > 1 ? 's' : ''}` : "Select rating"}
                  </span>
                </div>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-[13px] outline-none focus:border-[#ff4e00] transition-colors resize-none"
                  rows="3"
                ></textarea>
                <button 
                  type="submit" 
                  disabled={submittingReview}
                  className="mt-3 bg-[#ff4e00] text-white px-6 py-2 rounded-lg font-semibold text-[13px] hover:bg-[#e04400] disabled:opacity-70 transition-colors"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}

            <div className="flex flex-col md:flex-row gap-6 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
              <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-[#111] p-4 rounded-xl min-w-[120px]">
                <span className="text-[32px] font-black text-gray-900 dark:text-white">
                  {product.average_rating ? Number(product.average_rating).toFixed(1) : "0.0"}
                </span>
                <div className="flex text-[#ffc107] mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={14} fill={(product.average_rating || 0) >= star ? "#ffc107" : "none"} color="#ffc107" />
                  ))}
                </div>
                <span className="text-[11px] text-gray-500">Based on {product.total_reviews || 0} reviews</span>
              </div>

              <div className="flex-1 flex flex-col justify-center gap-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2 text-[12px]">
                    <span className="w-3 text-gray-500">{star}</span>
                    <Star size={12} fill="#ffc107" color="#ffc107" />
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-[#ffc107] rounded-full" style={{ width: star === 5 ? '70%' : star === 4 ? '20%' : '5%' }}></div>
                    </div>
                    <span className="w-8 text-right text-gray-500">{star === 5 ? '70%' : star === 4 ? '20%' : '5%'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {mockReviews.map((review) => (
                <div key={review.id} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ff4e00]/10 text-[#ff4e00] flex items-center justify-center font-bold text-lg shrink-0">
                    {review.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-[13px] md:text-[14px] text-gray-900 dark:text-white">{review.name}</span>
                      {review.verified && (
                        <span className="flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">
                          <CheckCircle size={10} /> Verified Purchase
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400">{review.date}</span>
                    </div>
                    <div className="flex text-[#ffc107] mb-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={12} fill={review.rating >= star ? "#ffc107" : "none"} color="#ffc107" />
                      ))}
                    </div>
                    <p className="text-[12px] md:text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed m-0">
                      {review.comment}
                    </p>
                    <div className="flex gap-3 mt-2 text-[11px] text-gray-400">
                      <button className="flex items-center gap-1 hover:text-[#ff4e00] transition-colors">
                        <ThumbsUp size={12} /> Helpful ({review.helpful})
                      </button>
                      <button className="hover:text-[#ff4e00] transition-colors">Report</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-[13px] font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Load More Reviews
            </button>
          </div>
        </div>

        {/* 
          🔥 HAPA: Desktop Buttons. Tumeyatoa nje ya div ya content (inayoscroll).
          Sasa yatakaa chini kabisa ya container, bila kuscroll.
        */}
        <div className="hidden md:block p-[15px] bg-white dark:bg-[#0a0a0a] border-t border-[#f0f0f0] dark:border-[#1f1f1f] shrink-0 z-50">
          <button onClick={handleWhatsAppOrder} disabled={!selectedVariationObj || loading} className="bg-[#25D366] text-white flex items-center justify-center gap-2.5 font-semibold p-3.5 rounded-[10px] border-none w-full mb-3 cursor-pointer transition-all hover:bg-[#1da851] disabled:opacity-60 disabled:cursor-not-allowed">
            <MessageSquare size={18} /> Order via WhatsApp
          </button>
          <div className="flex gap-2.5 w-full">
            <button onClick={() => handleOpenDrawer('order')} disabled={!selectedVariationObj || currentStock === 0 || loading} className="bg-[#ff4e00] dark:bg-[#ff6a00] text-white border-none p-3 rounded-[10px] font-bold flex-[2] flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:bg-[#e04400] dark:hover:bg-[#e55a00] disabled:opacity-60 disabled:cursor-not-allowed max-sm:text-[12px]">
              <Zap size={16} /> Order Now
            </button>
            <button onClick={() => handleOpenDrawer('cart')} disabled={!selectedVariationObj || currentStock === 0 || loading} className="bg-white dark:bg-[#0a0a0a] text-[#ff4e00] dark:text-[#ff6a00] border border-[#ff4e00] dark:border-[#ff6a00] p-3 rounded-[10px] font-bold flex-[2] flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:bg-[#fff4f0] dark:hover:bg-[#1f1000] disabled:opacity-60 disabled:cursor-not-allowed max-sm:text-[12px]">
              <ShoppingCart size={16} /> Add to Cart
            </button>
            <button onClick={handleChatWithSeller} className="w-[50px] flex justify-center items-center border border-[#e5e7eb] dark:border-[#1f1f1f] rounded-[10px] bg-[#f9fafb] dark:bg-[#0a0a0a] cursor-pointer transition-all hover:bg-[#f3f4f6] dark:hover:bg-[#1f1f1f]">
              <MessageSquare size={18} color="currentColor" className="text-[#374151] dark:text-white" />
            </button>
          </div>
        </div>

      </div>
    </>
  );
};

export default ProductInfo;