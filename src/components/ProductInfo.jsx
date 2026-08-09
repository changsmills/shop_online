// src/components/ProductInfo.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../axiosConfig';
import ProductSelectionDrawer from '../pages/ProductSelectionDrawer';
import { MessageSquare, Star, ChevronRight, ShoppingCart, Zap } from 'lucide-react';
import '../ProductInfo.css';
import { useCart } from '../context/CartContext';

const ProductInfo = ({ product, storeProducts = [], onRate, isMobile = false }) => {
  const [productMedia, setProductMedia] = useState([]);
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

  // 🔥 BADILISHA HAPA NA JINA LAKO HALISI LA CLOUDINARY
const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/rlgqgsnv/image/upload";

  const moq = product?.moq || 1;
  const productImage = product?.cover_image || "https://via.placeholder.com/150";

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
      // 🔥 KINGA YA MWISHO: Hakikisha variation hii ni ya bidhaa hii tu!
      if (String(v.product) !== String(product?.id)) return; 

      const colorName = v.color_name;
      if (!grouped[colorName]) {
        let fullImageUrl = v.color_image_url;
        if (!fullImageUrl && v.color_image) {
            fullImageUrl = `${CLOUDINARY_BASE_URL}/${v.color_image}`;
        }

        grouped[colorName] = {
          variation: v,
          color_image: fullImageUrl || v.color_image, 
          size_stock: v.size_stock || {},
          price: v.price,
          stock_quantity: v.stock_quantity
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
    const sizeStock = colorData.size_stock || {};
    const sizes = Object.keys(sizeStock);
    return sizes.sort((a, b) => {
      const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
      return (order.indexOf(a) - order.indexOf(b));
    });
  }, [selectedColor, variationsByColor]);

  const getStockForSize = (color, size) => {
    const colorData = variationsByColor[color];
    if (!colorData) return 0;
    const sizeStock = colorData.size_stock || {};
    return sizeStock[size] || 0;
  };

  const getCurrentVariation = (color, size) => {
    const found = productVariations.find(v => 
      String(v.product) === String(product?.id) && // 🔥 KINGA YA MWISHO!
      v.color_name === color && 
      (size ? (v.size_stock && v.size_stock[size] !== undefined) : true)
    );
    if (!found) return null;
    return {
      ...found,
      size_value: size || null,
      stock_quantity: size ? (found.size_stock?.[size] || 0) : found.stock_quantity,
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
    // 🔥 SULUHISHO: Thibitisha kama variation ina bei halali (kubwa kuliko 0)
    const variationPrice = parseFloat(selectedVariationObj?.price);
    if (variationPrice > 0) {
      return variationPrice;
    }
    // Kama variation haina bei, tumia bei ya bidhaa kuu
    return parseFloat(product?.price) || 0;
  }, [selectedVariationObj, product]);

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
      const sizes = Object.keys(colorData.size_stock || {});
      const firstSize = sizes.length > 0 ? sizes[0] : "";
      
      setActiveColor(color);
      setActiveSize(firstSize);
      
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
  
  // 🔥 MUHIMU SANA: Hakikisha hizi zipo!
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

  useEffect(() => {
    const fetchProductData = async () => {
      if (!product?.id) return;

      // 🔥 KINGA YA 1: Safisha kabisa data za zamani kabla ya kupakia mpya!
      setProductVariations([]);
      setSelectedColor("");
      setSelectedSize("");
      setSelectedVariationObj(null);
      setActiveColor(null);
      setActiveSize(null);

      try {
        const mediaRes = await api.get(`/product-media/?product_id=${product.id}`);
        const mediaData = mediaRes.data.results || mediaRes.data;

        const varRes = await api.get(`/product-variations/`, {
            params: { product_id: product.id } 
        });
        const varData = varRes.data.results || varRes.data;
        
        if (mediaData) setProductMedia(mediaData);
        
        if (varData && varData.length > 0) {
          // 🔥 KINGA YA 2: Chuja tena upande wa Frontend kwa usalama
          const filteredData = varData.filter(v => String(v.product) === String(product.id));
          setProductVariations(filteredData);
          
          const defaultVar = filteredData.find(v => v.stock_quantity > 0) || filteredData[0];
          setSelectedColor(defaultVar.color_name);
          
          const sizes = Object.keys(defaultVar.size_stock || {});
          const firstSize = sizes.length > 0 ? sizes[0] : "";
          
          setSelectedSize(firstSize);

          setSelectedVariationObj({
            ...defaultVar,
            size_value: firstSize || null,
            stock_quantity: firstSize ? (defaultVar.size_stock?.[firstSize] || 0) : defaultVar.stock_quantity
          });
        }
      } catch (error) {
        console.error("Error fetching product media/variations:", error);
        toast.error("Imeshindwa kupata data za bidhaa.");
      }
    };
    fetchProductData();
  }, [product?.id]);

  return (
    <div className="info-main-container">
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

      {isMobile && (
        <div className="mobile-bottom-order-nav">
          <button onClick={handleWhatsAppOrder} disabled={!selectedVariationObj || loading} className="mobile-whatsapp-btn">
            <MessageSquare size={20} />
            <span>WhatsApp</span>
          </button>
          <button onClick={() => handleOpenDrawer('order')} disabled={!selectedVariationObj || currentStock === 0 || loading} className="mobile-order-now-btn">
            <Zap size={20} />
            <span>Order Now</span>
          </button>
          <button onClick={() => handleOpenDrawer('cart')} disabled={!selectedVariationObj || currentStock === 0 || loading} className="mobile-add-to-cart-btn">
            <ShoppingCart size={20} />
            <span>Cart</span>
          </button>
          <button onClick={handleChatWithSeller} className="mobile-chat-btn">
            <MessageSquare size={20} />
            <span>Chat</span>
          </button>
        </div>
      )}

      <div className="info-content-wrapper">
        
        <div className="info-card">
          <h1 className="product-title-main">{product?.name}</h1>
          <div className="rating-section">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={18} fill={(hover || product.average_rating) >= star ? "#ffc107" : "none"} color="#ffc107" 
                className="star-icon" onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} onClick={() => onRate && onRate(star)} />
            ))}
            <span className="rating-count">({product.total_reviews || 0} reviews)</span>
          </div>
        </div>

        <div className="info-card">
          {Object.keys(variationsByColor).length > 0 && (
            <div className="attribute-group">
              <span className="attribute-label">Rangi zinazopatikana:</span>
              <div className="color-options">
                {Object.keys(variationsByColor).map((color) => {
                  const colorData = variationsByColor[color];
                  const totalStock = colorData.stock_quantity || 0;
                  return (
                    <div key={color} onClick={() => handleColorSelect(color)} className={`color-item ${selectedColor === color ? 'active' : ''}`}>
                      <div className={`color-square ${selectedColor === color ? 'active' : ''}`}>
                        {colorData.color_image ? <img src={colorData.color_image} alt={color} /> :
                          <div style={{ width: '100%', height: '100%', backgroundColor: color.toLowerCase() }} />}
                      </div>
                      <span className="color-name">{color}</span>
                      <span className="color-stock">{totalStock} left</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {availableSizesForColor.length > 0 && (
            <div className="attribute-group">
              <span className="attribute-label">Ukubwa (Bonyeza kuchagua):</span>
              <div className="size-options">
                {availableSizesForColor.map((size) => {
                  const sizeStock = getStockForSize(selectedColor, size);
                  const isOutOfStock = sizeStock === 0;
                  return (
                    <button key={size} onClick={() => !isOutOfStock && handleSizeSelect(size)} disabled={isOutOfStock}
                      className={`size-btn ${selectedSize === size ? 'active' : ''} ${isOutOfStock ? 'out-of-stock' : ''}`}>
                      {size}{isOutOfStock && <span className="out-of-stock-label">(Imeisha)</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="stock-status-row">
            <span className="stock-label">Hali ya Stoo:</span>
            <span className={`stock-badge ${currentStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {currentStock > 0 ? `✅ ${currentStock} Zimebaki` : '❌ Imeisha'}
            </span>
          </div>

          {Object.keys(currentSpecs).length > 0 && (
            <div className="specs-container">
              <div className="specs-header">📋 Specifications</div>
              <table>
                <tbody>
                  {Object.entries(currentSpecs).map(([key, value], index) => (
                    <tr key={key} className={index % 2 === 0 ? 'even' : 'odd'}>
                      <td className="spec-key">{key}</td>
                      <td className="spec-value">{typeof value === 'object' ? JSON.stringify(value) : value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="price-section">
            <span>Bei:</span>
            <span className="price-amount">TSH {formatPrice(currentUnitPrice)}</span>
            {product?.is_wholesale && moq > 1 && (<div className="moq-info">📦 Minimum Order: {moq} pieces</div>)}
          </div>
        </div>

        {audience && audience.length > 0 && (
          <div className="info-card">
            <span className="attribute-label">👥 Inafaa kwa:</span>
            <div className="audience-tags">
              {audience.map((a, i) => (<span key={i}>{a}</span>))}
            </div>
          </div>
        )}

        <div className="footer-buttons-group">
          <button onClick={handleWhatsAppOrder} disabled={!selectedVariationObj || loading} className="btn-whatsapp-full">
            <MessageSquare size={18} /> Order via WhatsApp
          </button>
          <div className="action-row">
            <button onClick={() => handleOpenDrawer('order')} disabled={!selectedVariationObj || currentStock === 0 || loading} className="btn-orange-full">
              <Zap size={16} /> Order Now
            </button>
            <button onClick={() => handleOpenDrawer('cart')} disabled={!selectedVariationObj || currentStock === 0 || loading} className="btn-white-outline">
              <ShoppingCart size={16} /> Add to Cart
            </button>
            <button onClick={handleChatWithSeller} className="btn-chat-icon">
              <MessageSquare size={18} color="#374151" />
            </button>
          </div>
        </div>

        {isMobile && <div className="mobile-spacer" />}
      </div>
    </div>
  );
};

export default ProductInfo;