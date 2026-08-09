import React, { useMemo, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import '../ProductSelectionDrawer.css';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductSelectionDrawer = ({
    isOpen,
    onClose,
    product,
    variations = [],
    selectedItems,
    handleQtyChange,
    formatPrice,
    productImage,
    actionType,
    addToCart,
    onConfirm,
    initialColor, 
    initialSize,
    currentUnitPrice // ✅ ONGEZA HAPA!

}) => {
    const navigate = useNavigate();
    const [previewImage, setPreviewImage] = useState(productImage);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState(null);
    const [isMobile, setIsMobile] = useState(false);


           // Iwe hii:
     const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/rlgqgsnv/image/upload";
    // Detect mobile screen
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

       const getSizeStockFromVariation = (variation) => {
        // 1. Jaribu kusoma size_stock kwa usalama
        let sizeStock = safeParseJSON(variation.size_stock);
        if (sizeStock && typeof sizeStock === 'object') return sizeStock;
        
        // 2. Kama haipo, tafuta kwenye attributes
        let attributes = safeParseJSON(variation.attributes);
        if (attributes && typeof attributes === 'object') {
            if (attributes.size_stock) return attributes.size_stock;
        }
        
        // 3. Tafuta kwenye variant_specifications
        let specs = safeParseJSON(variation.variant_specifications);
        if (specs && typeof specs === 'object') {
            if (specs.size_stock) return specs.size_stock;
        }
        
        return {}; // Kama hakuna chochote, rudisha tupu
    };

        const getSizesFromVariation = (variation) => {
        let sizeStock = getSizeStockFromVariation(variation);
        let sizes = Object.keys(sizeStock); // Pata ukubwa kutoka kwenye size_stock

        // 🔥 Kama size_stock ni tupu, tafuta 'sizes' array kwenye attributes!
        if (sizes.length === 0) {
            let attributes = safeParseJSON(variation.attributes);
            if (attributes && Array.isArray(attributes.sizes)) {
                sizes = attributes.sizes;
            }
        }

        const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
        return sizes.sort((a, b) => order.indexOf(a) - order.indexOf(b));
    };


        // 🔥 Helper: Inabadilisha JSON string kuwa Object kwa usalama
    const safeParseJSON = (data) => {
        if (!data) return null;
        if (typeof data === 'object') return data; // Ikiwa tayari ni object
        try {
            return JSON.parse(data); // Badilisha string kuwa object
        } catch (e) {
            return null;
        }
    };

    const getStockForSize = (variation, size) => {
        const sizeStock = getSizeStockFromVariation(variation);
        return sizeStock[size] || 0;
    };

        // 🔥 1. Badilisha colorVariations ili kutengeneza URL kamili (Sasa inasoma color_image_url kwanza!)
    const colorVariations = useMemo(() => {
        const grouped = {};
        variations.forEach(v => {
            if (v.color_name && !grouped[v.color_name]) {
                // 🔥 MUHIMU: Angalia kama color_image_url ipo kutoka Backend!
                let fullImageUrl = v.color_image_url;
                
                // Kama haipo, jenga URL kwa kutumia public_id na Cloudinary URL
                if (!fullImageUrl && v.color_image) {
                    fullImageUrl = `${CLOUDINARY_BASE_URL}/${v.color_image}`;
                }
                
                grouped[v.color_name] = {
                    ...v,
                    color_image: fullImageUrl // Sasa hii ni URL kamili
                };
            }
        });
        return grouped;
    }, [variations]);

    // 🔥 2. Badilisha allImages ili kukusanya URLs kamili kwa ajili ya slider
    const allImages = useMemo(() => {
        const images = [];
        Object.values(colorVariations).forEach(v => {
            if (v.color_image) {
                // Hakikisha hatuna picha mara mbili (duplicates)
                const isDuplicate = images.some(img => img.url === v.color_image);
                if (!isDuplicate) {
                    images.push({ url: v.color_image, color: v.color_name });
                }
            }
        });
        return images;
    }, [colorVariations]);

    const updateImageAndColor = (index) => {
        const selectedData = allImages[index];
        if (selectedData) {
            setPreviewImage(selectedData.url);
            setCurrentImgIndex(index);
            const colorId = Object.keys(colorVariations).find(
                key => colorVariations[key].color_name === selectedData.color
            );
            if (colorId) setSelectedColor(colorId);
        }
    };

    const handleNextImage = () => {
        if (allImages.length === 0) return;
        const nextIndex = currentImgIndex === allImages.length - 1 ? 0 : currentImgIndex + 1;
        updateImageAndColor(nextIndex);
    };

    const handlePrevImage = () => {
        if (allImages.length === 0) return;
        const prevIndex = currentImgIndex === 0 ? allImages.length - 1 : currentImgIndex - 1;
        updateImageAndColor(prevIndex);
    };

    const handleColorSelect = (colorId) => {
        setSelectedColor(colorId);
        const colorData = colorVariations[colorId];
        if (colorData?.color_image) {
            setPreviewImage(colorData.color_image);
            const newIndex = allImages.findIndex(img => img.url === colorData.color_image);
            if (newIndex !== -1) setCurrentImgIndex(newIndex);
        }
    };

    const currentColorVar = selectedColor ? colorVariations[selectedColor] : null;
    const sizes = currentColorVar ? getSizesFromVariation(currentColorVar) : [];
    const hasSizes = sizes.length > 0;

    // ✅ Hii itahakikisha rangi na saizi uliyobonyeza kule nje inachaguliwa hapa ndani
    useEffect(() => {
        if (isOpen && variations.length > 0) {
            // 1. Kama kuna initialColor, itumie hiyo, la sivyo chukua ya kwanza
            const colorToSelect = initialColor || Object.keys(colorVariations)[0];
            
            if (colorToSelect) {
                handleColorSelect(colorToSelect);
                
                // 2. Kama kuna initialSize, ongeza quantity ya 1 moja kwa moja
                if (initialSize) {
                    const colorData = colorVariations[colorToSelect];
                    if (colorData) {
                        const stockQty = getStockForSize(colorData, initialSize);
                        const itemKey = `${colorData.id}::${initialSize}`;
                        
                        // Ongeza 1 kama haijachaguliwa bado
                        if (!selectedItems[itemKey] || selectedItems[itemKey] === 0) {
                            handleQtyChange({ id: itemKey, stock_quantity: stockQty }, 1);
                        }
                    }
                }
            }
        }
    }, [isOpen, initialColor, initialSize, variations]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

       const totals = useMemo(() => {
        let totalQty = 0;
        let totalPrice = 0;
        Object.entries(selectedItems).forEach(([itemKey, qty]) => {
            if (qty > 0) {
                const parts = itemKey.split('::');
                const realVariantId = parts[0];
                const variant = variations.find(v => String(v.id) === String(realVariantId)) 
                              || (String(currentColorVar?.id) === String(realVariantId) ? currentColorVar : null);
                
                // 🔥 MUHIMU: Tumia currentUnitPrice kutoka Parent (ProductInfo) kama bei ya msingi!
                let unitPrice = Number(currentUnitPrice) || 0; 
                
                // Kama variant ina bei halisi kubwa kuliko 0, itumie hiyo
                const variantPrice = Number(variant?.price);
                if (variantPrice > 0) {
                    unitPrice = variantPrice;
                }

                totalQty += Number(qty);
                totalPrice += Number(qty) * unitPrice;
            }
        });
        return { totalQty, totalPrice };
    }, [selectedItems, variations, currentColorVar, currentUnitPrice, product?.price]); // 🔥 Ongeza currentUnitPrice kwenye dependencies!

    const getQuantityForSize = (size) => {
        if (!currentColorVar) return 0;
        const itemKey = `${currentColorVar.id}::${size}`;
        return selectedItems[itemKey] || 0;
    };

    const handleConfirmOrder = () => {
        const itemsToOrder = [];
        Object.entries(selectedItems).forEach(([itemKey, qty]) => {
            if (qty <= 0) return;
            const parts = itemKey.split('::');
            const searchId = parts[0];
            const selectedSize = parts[1] || null;
            let variant = variations.find(v => String(v.id) === String(searchId));
            if (!variant) {
                toast.error(`Bidhaa haikutambuliwa. Jaribu tena.`);
                return;
            }
            const selectedColorValue = variant.color_name || selectedColor || 'Standard';
            const unitPrice = Number(variant?.price ?? product?.price ?? 0);
            const finalSize = selectedSize || 'Free Size';
            
            // 🔥 Tumia URL kamili kwa product_image
            let fullImageUrl = variant.color_image;
            if (fullImageUrl && !fullImageUrl.startsWith('http')) {
                fullImageUrl = `${CLOUDINARY_BASE_URL}/${fullImageUrl}`;
            }

            itemsToOrder.push({
                product_id: product.id,
                product_name: product.name,
                sku: variant?.sku || product.sku || '',
                category_name: product.category_name || '',
                selected_color: selectedColorValue,
                selected_size: finalSize,
                qty_ordered: Number(qty),
                price: unitPrice,
                product_image: fullImageUrl || productImage,
                discount_amount: 0,
                variant_id: variant.id
            });
        });
        if (itemsToOrder.length > 0) {
            const finalTotalQty = itemsToOrder.reduce((acc, item) => acc + item.qty_ordered, 0);
            const finalGrandTotal = itemsToOrder.reduce((acc, item) => acc + (item.qty_ordered * item.price), 0);
            const finalPayload = {
                order_data: {
                    order_number: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    grand_total: finalGrandTotal,
                    total_items: finalTotalQty,
                    status: 'received',
                    store_id: product.store_id || null
                },
                items: itemsToOrder
            };
            onConfirm(finalPayload);
        } else {
            toast.error("Hakuna bidhaa zilizochaguliwa.");
        }
    };

    const handleWhatsAppConfirm = () => {
        const finalQty = Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0);
        if (finalQty === 0) {
            toast.error("Tafadhali chagua angalau bidhaa moja");
            return;
        }
        
        const itemsToProcess = [];
        Object.entries(selectedItems).forEach(([itemKey, qty]) => {
            if (qty <= 0) return;
            const parts = itemKey.split('::');
            const searchId = parts[0];
            const selectedSize = parts[1] || null;
            let variant = variations.find(v => String(v.id) === String(searchId));
            if (!variant) return;
            
            const selectedColorValue = variant.color_name || selectedColor || 'Standard';
            const unitPrice = Number(variant?.price ?? product?.price ?? 0);
            const finalSize = selectedSize || 'Free Size';
            
            // 🔥 Tumia URL kamili kwa image
            let fullImageUrl = variant.color_image;
            if (fullImageUrl && !fullImageUrl.startsWith('http')) {
                fullImageUrl = `${CLOUDINARY_BASE_URL}/${fullImageUrl}`;
            }

            itemsToProcess.push({
                id: product.id,
                productId: product.id,
                variant_id: variant.id,
                name: product.name,
                product_name: product.name,
                selected_color: selectedColorValue,
                selected_size: finalSize,
                quantity: qty,
                price: unitPrice,
                image: fullImageUrl || productImage,
                store_id: product.store_id,
                store_phone: product.stores?.whatsapp_number,
                sku: variant.sku || product.sku || ''
            });
        });
        
        if (itemsToProcess.length === 0) {
            toast.error("Hakuna bidhaa zilizochaguliwa");
            return;
        }
        
        onClose();
        navigate('/checkout', { state: { orderItems: itemsToProcess } });
    };

    const handleAddToCart = () => {
    const itemsToCart = [];
    Object.entries(selectedItems).forEach(([itemKey, qty]) => {
        if (qty <= 0) return;
        const parts = itemKey.split('::');
        const searchId = parts[0];
        const selectedSize = parts[1] || null;
        let variant = variations.find(v => String(v.id) === String(searchId));
        if (!variant) {
            toast.error(`Bidhaa haikutambuliwa.`);
            return;
        }
        const selectedColorValue = variant.color_name || selectedColor || 'Standard';
        
        // 🔥 MUHIMU: Tumia currentUnitPrice kama bei (iliyopitishwa kutoka ProductInfo)!
        const unitPrice = Number(currentUnitPrice) || Number(variant?.price) || Number(product?.price) || 0;
        
        const finalSize = selectedSize || 'Free Size';
        const uniqueCartId = `${variant.id}_${finalSize}_${selectedColorValue}`.replace(/\s/g, '_');

        // 🔥 MUHIMU: Tumia URL kamili kwa image
        let fullImageUrl = variant.color_image;
        if (fullImageUrl && !fullImageUrl.startsWith('http')) {
            fullImageUrl = `${CLOUDINARY_BASE_URL}/${fullImageUrl}`;
        }
        // 🔥 Angalia pia cover_image_url kutoka product
        if (!fullImageUrl && product?.cover_image_url) {
            fullImageUrl = product.cover_image_url;
        }

        itemsToCart.push({
            id: product.id,
            productId: product.id,
            product_id: product.id,
            name: product.name,
            product_name: product.name,
            sku: variant?.sku || product.sku || '',
            category_name: product.category_name || '',
            selected_color: selectedColorValue,
            selected_size: finalSize,
            quantity: Number(qty),
            price: unitPrice, // 🔥 Hapa ndio bei sahihi!
            image: fullImageUrl || productImage, // 🔥 Hapa ndio picha sahihi!
            product_image: fullImageUrl || productImage,
            cover_image_url: fullImageUrl || product?.cover_image_url || productImage, // 🔥 Muhimu!
            variant_id: variant.id,
            store_id: product.store_id,
            uniqueCartId: uniqueCartId,
            added_at: new Date().toISOString()
        });
    });
    if (itemsToCart.length > 0) {
        const existingCart = JSON.parse(localStorage.getItem('alibaba_cart') || '[]');
        itemsToCart.forEach(newItem => {
            const existingIndex = existingCart.findIndex(item => item.uniqueCartId === newItem.uniqueCartId);
            if (existingIndex !== -1) {
                existingCart[existingIndex].quantity += newItem.quantity;
            } else {
                existingCart.push(newItem);
            }
        });
        localStorage.setItem('alibaba_cart', JSON.stringify(existingCart));
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: existingCart }));
        toast.success(`Bidhaa ${itemsToCart.length} zimeongezwa kwenye kikapu!`, { duration: 2000 });
        onClose();
        navigate('/cart');
    } else {
        toast.error("Hakuna bidhaa zilizochaguliwa.");
    }
};

    if (!isOpen || !product) return null;

    return ReactDOM.createPortal(
        <>
            {/* Overlay */}
            <div 
                className="drawer-overlay" 
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 999,
                    animation: 'fadeIn 0.2s ease'
                }}
            ></div>

            {/* ========== DESKTOP: RIGHT SIDE DRAWER + FLOATING IMAGE ========== */}
            {!isMobile && (
                <>
                    {/* FLOATING IMAGE - Upande wa kushoto */}
                    <div style={{
                        position: 'fixed',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        marginLeft: '-300px',
                        zIndex: 1000,
                        display: 'block'
                    }}>
                        <div style={{
                            position: 'relative',
                            background: 'transparent',
                            padding: '20px'
                        }}>
                            <div style={{
                                position: 'relative',
                                width: '500px',
                                height: '500px'
                            }}>
                                {allImages.length > 0 && (
                                    <>
                                        <button 
                                            onClick={handlePrevImage}
                                            style={{
                                                position: 'absolute',
                                                left: '-50px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '40px',
                                                height: '40px',
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                zIndex: 10,
                                                fontSize: '20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            ❮
                                        </button>
                                        
                                        <img 
                                            src={previewImage} 
                                            alt={product?.name || 'Product'}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '16px',
                                                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                                            }}
                                        />
                                        
                                        <button 
                                            onClick={handleNextImage}
                                            style={{
                                                position: 'absolute',
                                                right: '-50px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '40px',
                                                height: '40px',
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                zIndex: 10,
                                                fontSize: '20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            ❯
                                        </button>
                                        
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '10px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            background: 'rgba(0,0,0,0.6)',
                                            color: 'white',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px'
                                        }}>
                                            {currentImgIndex + 1} / {allImages.length}
                                        </div>
                                    </>
                                )}
                                {allImages.length === 0 && (
                                    <img 
                                        src={previewImage || productImage} 
                                        alt={product?.name || 'Product'}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '16px',
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* DESKTOP RIGHT DRAWER */}
                    <div className="right-side-drawer" style={{
                        position: 'fixed',
                        right: 0,
                        top: 0,
                        height: '100vh',
                        width: '600px',
                        maxWidth: '90vw',
                        backgroundColor: '#fff',
                        boxShadow: '-5px 0 25px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        display: 'flex',
                        flexDirection: 'column',
                        animation: 'slideInRight 0.3s ease-out',
                        overflow: 'hidden'
                    }}>
                        {/* Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '20px 24px',
                            borderBottom: '1px solid #f0f0f0'
                        }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Select variations</h3>
                            <button onClick={onClose} style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>✕</button>
                        </div>

                        {/* Scrollable Content */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
                            <div style={{ marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>{product?.name}</h2>
                                <div style={{ fontSize: '24px', fontWeight: 700, color: '#ff4e00' }}>TSH {formatPrice(product?.price)}</div>
                            </div>

                            {/* Color Selection */}
                            {Object.keys(colorVariations).length > 0 && (
                                <div style={{ marginBottom: '24px' }}>
                                    <div style={{ fontWeight: 600, marginBottom: '12px' }}>Color: {selectedColor || ''}</div>
                                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                        {Object.keys(colorVariations).map(color => (
                                            <div key={color} onClick={() => handleColorSelect(color)} style={{
                                                cursor: 'pointer',
                                                textAlign: 'center',
                                                border: selectedColor === color ? '2px solid #ff4e00' : '1px solid #e0e0e0',
                                                borderRadius: '8px',
                                                padding: '8px',
                                                backgroundColor: selectedColor === color ? '#fff4f0' : '#fff'
                                            }}>
                                                {/* 🔥 SASA PICHA INAONESHA KWA SABABU YA URL KAMILI */}
                                                <img src={colorVariations[color].color_image || productImage} alt={color}
                                                    style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                                                <div style={{ fontSize: '11px', marginTop: '4px' }}>{color}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size Selection */}
                            {hasSizes && currentColorVar && (
                                <div style={{ marginBottom: '24px' }}>
                                    <div style={{ fontWeight: 600, marginBottom: '12px' }}>Size</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {sizes.map(size => {
                                            const stockQty = getStockForSize(currentColorVar, size);
                                            const variantId = `${currentColorVar.id}::${size}`;
                                            const qty = getQuantityForSize(size);
                                            const isOutOfStock = stockQty === 0;
                                            const unitPrice = currentColorVar.price || product?.price || 0;
                                            return (
                                                <div key={size} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '12px',
                                                    backgroundColor: '#fafafa',
                                                    borderRadius: '8px',
                                                    border: qty > 0 ? '1px solid #ff4e00' : '1px solid #eee'
                                                }}>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{size}</div>
                                                        <div style={{ fontSize: '12px', color: '#666' }}>TSH {formatPrice(unitPrice)}</div>
                                                        <small style={{ color: isOutOfStock ? '#ff4444' : '#4caf50' }}>
                                                            {isOutOfStock ? 'Out of stock' : `${stockQty} available`}
                                                        </small>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <button onClick={() => { if (qty > 0) handleQtyChange({ id: variantId, stock_quantity: stockQty }, -1); }}
                                                            disabled={qty === 0 || isOutOfStock}
                                                            style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: '#fff', fontWeight: 'bold' }}>-</button>
                                                        <input type="number" value={qty} onChange={(e) => {
                                                            const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                                                            if (!isNaN(val) && val >= 0 && !isOutOfStock) {
                                                                handleQtyChange({ id: variantId, stock_quantity: stockQty }, val - qty);
                                                            }
                                                        }} style={{ width: '55px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '6px', padding: '8px' }} disabled={isOutOfStock} />
                                                        <button onClick={() => { if (!isOutOfStock && qty < stockQty) handleQtyChange({ id: variantId, stock_quantity: stockQty }, 1); }}
                                                            disabled={isOutOfStock || qty >= stockQty}
                                                            style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: '#fff', fontWeight: 'bold' }}>+</button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Free size */}
                            {!hasSizes && currentColorVar && (
                                <div style={{ marginBottom: '24px' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '12px',
                                        backgroundColor: '#fafafa',
                                        borderRadius: '8px'
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>Standard Size</div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>TSH {formatPrice(currentColorVar.price || product?.price)}</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <button onClick={() => handleQtyChange({ id: currentColorVar.id }, -1)} disabled={selectedItems[currentColorVar.id] === 0}>-</button>
                                            <input type="number" value={selectedItems[currentColorVar.id] || 0} onChange={(e) => {
                                                const val = parseInt(e.target.value) || 0;
                                                handleQtyChange({ id: currentColorVar.id }, val - (selectedItems[currentColorVar.id] || 0));
                                            }} style={{ width: '55px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '6px', padding: '8px' }} />
                                            <button onClick={() => handleQtyChange({ id: currentColorVar.id }, 1)}>+</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{
                            borderTop: '1px solid #eee',
                            padding: '20px 24px',
                            backgroundColor: '#fff'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <span>Subtotal</span>
                                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4e00' }}>TSH {formatPrice(totals.totalPrice)}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={handleConfirmOrder} disabled={totals.totalQty === 0}
                                    style={{ flex: 1, backgroundColor: '#ff4e00', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold' }}>
                                    Order Now
                                </button>
                                <button onClick={handleAddToCart} disabled={totals.totalQty === 0}
                                    style={{ flex: 1, backgroundColor: '#fff', color: '#ff4e00', border: '2px solid #ff4e00', padding: '14px', borderRadius: '8px', fontWeight: 'bold' }}>
                                    Add to Cart
                                </button>
                            </div>
                            {/* ORDER VIA WHATSAPP BUTTON */}
                            <button 
                                onClick={handleWhatsAppConfirm} 
                                disabled={totals.totalQty === 0}
                                style={{ 
                                    width: '100%', 
                                    marginTop: '12px',
                                    backgroundColor: '#25D366', 
                                    color: 'white', 
                                    border: 'none', 
                                    padding: '12px', 
                                    borderRadius: '8px', 
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    cursor: totals.totalQty === 0 ? 'not-allowed' : 'pointer',
                                    opacity: totals.totalQty === 0 ? 0.6 : 1
                                }}
                            >
                                <MessageSquare size={18} /> Order via WhatsApp
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* ========== MOBILE: BOTTOM SHEET ========== */}
            {isMobile && (
                <div className="mobile-bottom-sheet" style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#fff',
                    borderRadius: '20px 20px 0 0',
                    zIndex: 1000,
                    animation: 'slideUp 0.3s ease-out',
                    maxHeight: '85vh',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    {/* Drag handle */}
                    <div style={{
                        width: '40px',
                        height: '4px',
                        backgroundColor: '#ddd',
                        borderRadius: '2px',
                        margin: '12px auto',
                        cursor: 'pointer'
                    }} onClick={onClose}></div>

                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0 20px 12px',
                        borderBottom: '1px solid #f0f0f0'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Select Options</h3>
                        <button onClick={onClose} style={{
                                background: '#f5f5f5',
                               border: 'none',
                               fontSize: '16px',
                                   fontWeight: 500,
                                    cursor: 'pointer',
                                 minWidth: '50px',
                                height: '32px',
                                     borderRadius: '16px',
                                 display: 'flex',
                               alignItems: 'center',
                               justifyContent: 'center',
                                 color: '#333',
                                   transition: 'background 0.2s'
                                     }}>✕</button>
                                 </div>

                    {/* Scrollable Content */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
                        {/* Product Preview */}
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', background: '#f5f5f5' }}>
                                <img src={previewImage} alt={product?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{product?.name}</h4>
                                <div style={{ fontSize: '18px', fontWeight: 700, color: '#ff4e00' }}>TSH {formatPrice(product?.price)}</div>
                            </div>
                        </div>

                        {/* Color Selection */}
                        {Object.keys(colorVariations).length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ fontWeight: 600, marginBottom: '12px', fontSize: '14px' }}>Color: {selectedColor || ''}</div>
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                    {Object.keys(colorVariations).map(color => (
                                        <div key={color} onClick={() => handleColorSelect(color)} style={{
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            border: selectedColor === color ? '2px solid #ff4e00' : '1px solid #e0e0e0',
                                            borderRadius: '8px',
                                            padding: '6px',
                                            backgroundColor: selectedColor === color ? '#fff4f0' : '#fff'
                                        }}>
                                            {/* 🔥 SASA PICHA INAONESHA KWA SABABU YA URL KAMILI */}
                                            <img src={colorVariations[color].color_image || productImage} alt={color}
                                                style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }} />
                                            <div style={{ fontSize: '10px', marginTop: '4px' }}>{color}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selection */}
                        {hasSizes && currentColorVar && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ fontWeight: 600, marginBottom: '12px', fontSize: '14px' }}>Size</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {sizes.map(size => {
                                        const stockQty = getStockForSize(currentColorVar, size);
                                        const variantId = `${currentColorVar.id}::${size}`;
                                        const qty = getQuantityForSize(size);
                                        const isOutOfStock = stockQty === 0;
                                        const unitPrice = currentColorVar.price || product?.price || 0;
                                        return (
                                            <div key={size} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '12px',
                                                backgroundColor: '#fafafa',
                                                borderRadius: '8px',
                                                border: qty > 0 ? '1px solid #ff4e00' : '1px solid #eee'
                                            }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{size}</div>
                                                    <div style={{ fontSize: '11px', color: '#666' }}>TSH {formatPrice(unitPrice)}</div>
                                                    <small style={{ color: isOutOfStock ? '#ff4444' : '#4caf50' }}>
                                                        {isOutOfStock ? 'Out of stock' : `${stockQty} available`}
                                                    </small>
                                                </div>
                                                
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <button
                                                        onClick={() => { if (qty > 0) handleQtyChange({ id: variantId, stock_quantity: stockQty }, -1); }}
                                                        disabled={qty === 0 || isOutOfStock}
                                                        style={{
                                                            width: '36px', height: '36px',
                                                            borderRadius: '8px', border: '1px solid #ddd',
                                                            backgroundColor: '#fff',
                                                            color: qty > 0 && !isOutOfStock ? '#333' : '#ccc',
                                                            cursor: qty > 0 && !isOutOfStock ? 'pointer' : 'not-allowed',
                                                            fontWeight: 'bold', fontSize: '16px',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            transition: 'background 0.2s'
                                                        }}
                                                    >−</button>
                                                    <input
                                                        type="number"
                                                        value={qty}
                                                        onChange={(e) => {
                                                            const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                                                            if (!isNaN(val) && val >= 0 && !isOutOfStock) {
                                                                handleQtyChange({ id: variantId, stock_quantity: stockQty }, val - qty);
                                                            }
                                                        }}
                                                        disabled={isOutOfStock}
                                                        style={{
                                                            width: '50px', height: '36px',
                                                            textAlign: 'center', border: '1px solid #ccc',
                                                            borderRadius: '8px', padding: '0 4px', fontSize: '15px',
                                                            backgroundColor: '#fff', outline: 'none'
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => { if (!isOutOfStock && qty < stockQty) handleQtyChange({ id: variantId, stock_quantity: stockQty }, 1); }}
                                                        disabled={isOutOfStock || qty >= stockQty}
                                                        style={{
                                                            width: '36px', height: '36px',
                                                            borderRadius: '8px', border: '1px solid #ddd',
                                                            backgroundColor: '#fff',
                                                            color: !isOutOfStock && qty < stockQty ? '#333' : '#ccc',
                                                            cursor: !isOutOfStock && qty < stockQty ? 'pointer' : 'not-allowed',
                                                            fontWeight: 'bold', fontSize: '16px',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            transition: 'background 0.2s'
                                                        }}
                                                    >+</button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Free size */}
                        {!hasSizes && currentColorVar && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '12px',
                                    backgroundColor: '#fafafa',
                                    borderRadius: '8px'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>Standard Size</div>
                                        <div style={{ fontSize: '11px', color: '#666' }}>TSH {formatPrice(currentColorVar.price || product?.price)}</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <button onClick={() => handleQtyChange({ id: currentColorVar.id }, -1)} disabled={selectedItems[currentColorVar.id] === 0}>-</button>
                                        <input type="number" value={selectedItems[currentColorVar.id] || 0} onChange={(e) => {
                                            const val = parseInt(e.target.value) || 0;
                                            handleQtyChange({ id: currentColorVar.id }, val - (selectedItems[currentColorVar.id] || 0));
                                        }} style={{ width: '45px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '6px', padding: '6px' }} />
                                        <button onClick={() => handleQtyChange({ id: currentColorVar.id }, 1)}>+</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div style={{
                        borderTop: '1px solid #eee',
                        padding: '16px 20px',
                        backgroundColor: '#fff',
                        paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span>Total</span>
                            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff4e00' }}>TSH {formatPrice(totals.totalPrice)}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={handleConfirmOrder} disabled={totals.totalQty === 0}
                                style={{ flex: 1, backgroundColor: '#ff4e00', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>
                                Order Now
                            </button>
                            <button onClick={handleAddToCart} disabled={totals.totalQty === 0}
                                style={{ flex: 1, backgroundColor: '#fff', color: '#ff4e00', border: '2px solid #ff4e00', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>
                                Add to Cart
                            </button>
                        </div>
                        {/* ORDER VIA WHATSAPP BUTTON */}
                        <button 
                            onClick={handleWhatsAppConfirm} 
                            disabled={totals.totalQty === 0}
                            style={{ 
                                width: '100%', 
                                marginTop: '10px',
                                backgroundColor: '#25D366', 
                                color: 'white', 
                                border: 'none', 
                                padding: '10px', 
                                borderRadius: '8px', 
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                cursor: totals.totalQty === 0 ? 'not-allowed' : 'pointer',
                                opacity: totals.totalQty === 0 ? 0.6 : 1,
                                fontSize: '14px'
                            }}
                        >
                            <MessageSquare size={16} /> Order via WhatsApp
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </>,
        document.body
    );
};

export default ProductSelectionDrawer;