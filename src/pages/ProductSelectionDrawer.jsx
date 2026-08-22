import React, { useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../ProductSelectionDrawer.css';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

const ProductSelectionDrawer = ({
    isOpen,
    onClose,
    product,
    variations = [],
    selectedItems,
    handleQtyChange,
    formatPrice,
    productImage,
    onConfirm,
    initialColor,
    initialSize,
    currentUnitPrice
}) => {
    const navigate = useNavigate();
    const [previewImage, setPreviewImage] = React.useState(productImage);
    const [currentImgIndex, setCurrentImgIndex] = React.useState(0);
    const [selectedColor, setSelectedColor] = React.useState(null);

    const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/rlgqgsnv/image/upload";

    const safeParseJSON = (data) => {
        if (!data) return null;
        if (typeof data === 'object') return data;
        try {
            return JSON.parse(data);
        } catch (e) {
            return null;
        }
    };

    const getSizeStockFromVariation = (variation) => {
        let sizeStock = safeParseJSON(variation.size_stock);
        if (sizeStock && typeof sizeStock === 'object') return sizeStock;
        let attributes = safeParseJSON(variation.attributes);
        if (attributes && typeof attributes === 'object') {
            if (attributes.size_stock) return attributes.size_stock;
        }
        let specs = safeParseJSON(variation.variant_specifications);
        if (specs && typeof specs === 'object') {
            if (specs.size_stock) return specs.size_stock;
        }
        return {};
    };

    const getSizesFromVariation = (variation) => {
        let sizeStock = getSizeStockFromVariation(variation);
        let sizes = Object.keys(sizeStock);
        if (sizes.length === 0) {
            let attributes = safeParseJSON(variation.attributes);
            if (attributes && Array.isArray(attributes.sizes)) {
                sizes = attributes.sizes;
            }
        }
        const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
        return sizes.sort((a, b) => order.indexOf(a) - order.indexOf(b));
    };

    const getStockForSize = (variation, size) => {
        const sizeStock = getSizeStockFromVariation(variation);
        return sizeStock[size] || 0;
    };

    const colorVariations = React.useMemo(() => {
        const grouped = {};
        variations.forEach(v => {
            if (v.color_name && !grouped[v.color_name]) {
                let fullImageUrl = v.color_image_url;
                if (!fullImageUrl && v.color_image) {
                    fullImageUrl = `${CLOUDINARY_BASE_URL}/${v.color_image}`;
                }
                grouped[v.color_name] = {
                    ...v,
                    color_image: fullImageUrl
                };
            }
        });
        return grouped;
    }, [variations]);

    const allImages = React.useMemo(() => {
        const images = [];
        Object.values(colorVariations).forEach(v => {
            if (v.color_image) {
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

    useEffect(() => {
        if (isOpen && variations.length > 0) {
            const colorToSelect = initialColor || Object.keys(colorVariations)[0];
            if (colorToSelect) {
                handleColorSelect(colorToSelect);
                if (initialSize) {
                    const colorData = colorVariations[colorToSelect];
                    if (colorData) {
                        const stockQty = getStockForSize(colorData, initialSize);
                        const itemKey = `${colorData.id}::${initialSize}`;
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

    const totals = React.useMemo(() => {
        let totalQty = 0;
        let totalPrice = 0;
        Object.entries(selectedItems).forEach(([itemKey, qty]) => {
            if (qty > 0) {
                const parts = itemKey.split('::');
                const realVariantId = parts[0];
                const variant = variations.find(v => String(v.id) === String(realVariantId))
                              || (String(currentColorVar?.id) === String(realVariantId) ? currentColorVar : null);
                let unitPrice = Number(currentUnitPrice) || 0;
                const variantPrice = Number(variant?.price);
                if (variantPrice > 0) {
                    unitPrice = variantPrice;
                }
                totalQty += Number(qty);
                totalPrice += Number(qty) * unitPrice;
            }
        });
        return { totalQty, totalPrice };
    }, [selectedItems, variations, currentColorVar, currentUnitPrice, product?.price]);

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
            const unitPrice = Number(currentUnitPrice) || Number(variant?.price) || Number(product?.price) || 0;
            const finalSize = selectedSize || 'Free Size';
            const uniqueCartId = `${variant.id}_${finalSize}_${selectedColorValue}`.replace(/\s/g, '_');
            let fullImageUrl = variant.color_image;
            if (fullImageUrl && !fullImageUrl.startsWith('http')) {
                fullImageUrl = `${CLOUDINARY_BASE_URL}/${fullImageUrl}`;
            }
            if (!fullImageUrl && product?.cover_image_url) {
                fullImageUrl = product.cover_image_url;
            }
            
            // 🔥 ONGEZA HIZI KODI HAPA (KUHESABU STOCK):
            let stockQty = getStockForSize(variant, finalSize);
            // Kama hakuna size, angalia stock ya variant yenyewe au ya product
             if (!stockQty) stockQty = Number(variant.stock_quantity) || Number(product.stock_quantity) || 0;

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
                price: unitPrice,
                image: fullImageUrl || productImage,
                product_image: fullImageUrl || productImage,
                cover_image_url: fullImageUrl || product?.cover_image_url || productImage,
                variant_id: variant.id,
                store_id: product.store_id,
                stock_quantity: stockQty, 
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
            <div className="drawer-overlay" onClick={onClose}></div>

            {/* ===== DESKTOP LAYOUT (Imefichwa kwenye Mobile kupitia CSS) ===== */}
            <div className="desktop-layout">
                {/* Floating Image - Kushoto */}
                <div className="floating-image-wrapper">
                    <div className="floating-image-inner">
                        <div className="product-image-container">
                            {allImages.length > 0 && (
                                <>
                                    <button className="nav-arrow prev" onClick={handlePrevImage}>❮</button>
                                    <img src={previewImage} alt={product?.name || 'Product'} className="product-image" />
                                    <button className="nav-arrow next" onClick={handleNextImage}>❯</button>
                                    <div className="image-counter">{currentImgIndex + 1} / {allImages.length}</div>
                                </>
                            )}
                            {allImages.length === 0 && (
                                <img src={previewImage || productImage} alt={product?.name || 'Product'} className="product-image" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side Drawer */}
                <div className="right-side-drawer">
                    <div className="drawer-header">
                        <h3>Select variations</h3>
                        <button className="close-btn" onClick={onClose}>✕</button>
                    </div>
                    <div className="drawer-content">
                        <div className="product-info">
                            <h2 className="product-name">{product?.name}</h2>
                            <div className="product-price">TSH {formatPrice(product?.price)}</div>
                        </div>

                        {/* Color Selection */}
                        {Object.keys(colorVariations).length > 0 && (
                            <div className="section">
                                <div className="section-title">Color: {selectedColor || ''}</div>
                                <div className="color-list">
                                    {Object.keys(colorVariations).map(color => (
                                        <div key={color} className={`color-item ${selectedColor === color ? 'selected' : ''}`} onClick={() => handleColorSelect(color)}>
                                            <img src={colorVariations[color].color_image || productImage} alt={color} className="color-image" />
                                            <div className="color-name">{color}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selection */}
                        {hasSizes && currentColorVar && (
                            <div className="section">
                                <div className="section-title">Size</div>
                                <div className="sizes-list">
                                    {sizes.map(size => {
                                        const stockQty = getStockForSize(currentColorVar, size);
                                        const variantId = `${currentColorVar.id}::${size}`;
                                        const qty = getQuantityForSize(size);
                                        const isOutOfStock = stockQty === 0;
                                        const unitPrice = currentColorVar.price || product?.price || 0;
                                        return (
                                            <div key={size} className={`size-item ${qty > 0 ? 'active' : ''}`}>
                                                <div className="size-info">
                                                    <div className="size-name">{size}</div>
                                                    <div className="size-price">TSH {formatPrice(unitPrice)}</div>
                                                    <div className={`stock-info ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
                                                        {isOutOfStock ? 'Out of stock' : `${stockQty} available`}
                                                    </div>
                                                </div>
                                                <div className="quantity-controls">
                                                    <button className="qty-btn" onClick={() => { if (qty > 0) handleQtyChange({ id: variantId, stock_quantity: stockQty }, -1); }} disabled={qty === 0 || isOutOfStock}>−</button>
                                                    <input type="number" className="qty-input" value={qty} onChange={(e) => { const val = e.target.value === '' ? 0 : parseInt(e.target.value); if (!isNaN(val) && val >= 0 && !isOutOfStock) { handleQtyChange({ id: variantId, stock_quantity: stockQty }, val - qty); } }} disabled={isOutOfStock} />
                                                    <button className="qty-btn" onClick={() => { if (!isOutOfStock && qty < stockQty) handleQtyChange({ id: variantId, stock_quantity: stockQty }, 1); }} disabled={isOutOfStock || qty >= stockQty}>+</button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Free size */}
                        {!hasSizes && currentColorVar && (
                            <div className="section">
                                <div className="size-item">
                                    <div className="size-info">
                                        <div className="size-name">Standard Size</div>
                                        <div className="size-price">TSH {formatPrice(currentColorVar.price || product?.price)}</div>
                                    </div>
                                    <div className="quantity-controls">
                                        <button className="qty-btn" onClick={() => handleQtyChange({ id: currentColorVar.id }, -1)} disabled={selectedItems[currentColorVar.id] === 0}>−</button>
                                        <input type="number" className="qty-input" value={selectedItems[currentColorVar.id] || 0} onChange={(e) => { const val = parseInt(e.target.value) || 0; handleQtyChange({ id: currentColorVar.id }, val - (selectedItems[currentColorVar.id] || 0)); }} />
                                        <button className="qty-btn" onClick={() => handleQtyChange({ id: currentColorVar.id }, 1)}>+</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="drawer-footer">
                        <div className="footer-summary">
                            <span className="subtotal-label">Subtotal</span>
                            <span className="subtotal-value">TSH {formatPrice(totals.totalPrice)}</span>
                        </div>
                        <div className="footer-buttons">
                            <button className="btn-order" onClick={handleConfirmOrder} disabled={totals.totalQty === 0}>Order Now</button>
                            <button className="btn-cart" onClick={handleAddToCart} disabled={totals.totalQty === 0}>Add to Cart</button>
                        </div>
                        <button className="btn-chat" onClick={handleWhatsAppConfirm} disabled={totals.totalQty === 0}>
                            <MessageSquare size={18} /> Order via WhatsApp
                        </button>
                    </div>
                </div>
            </div>

            {/* ===== MOBILE LAYOUT (Imefichwa kwenye Desktop kupitia CSS) ===== */}
            <div className="mobile-layout">
                <div className="mobile-bottom-sheet">
                    <div className="bottom-sheet-drag-handle" onClick={onClose}></div>
                    <div className="bottom-sheet-header">
                        <h3>Select Options</h3>
                        <button className="bottom-sheet-close" onClick={onClose}>✕</button>
                    </div>

                    <div className="bottom-sheet-content">
                        <div className="bottom-sheet-product-preview">
                            <div className="bottom-sheet-product-image"><img src={previewImage} alt={product?.name} /></div>
                            <div className="bottom-sheet-product-info">
                                <h4 className="bottom-sheet-product-name">{product?.name}</h4>
                                <div className="bottom-sheet-product-price">TSH {formatPrice(product?.price)}</div>
                            </div>
                        </div>

                        {Object.keys(colorVariations).length > 0 && (
                            <div className="section">
                                <div className="section-title">Color: {selectedColor || ''}</div>
                                <div className="color-list">
                                    {Object.keys(colorVariations).map(color => (
                                        <div key={color} className={`color-item ${selectedColor === color ? 'selected' : ''}`} onClick={() => handleColorSelect(color)}>
                                            <img src={colorVariations[color].color_image || productImage} alt={color} className="color-image" />
                                            <div className="color-name">{color}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {hasSizes && currentColorVar && (
                            <div className="section">
                                <div className="section-title">Size</div>
                                <div className="sizes-list">
                                    {sizes.map(size => {
                                        const stockQty = getStockForSize(currentColorVar, size);
                                        const variantId = `${currentColorVar.id}::${size}`;
                                        const qty = getQuantityForSize(size);
                                        const isOutOfStock = stockQty === 0;
                                        const unitPrice = currentColorVar.price || product?.price || 0;
                                        return (
                                            <div key={size} className={`size-item ${qty > 0 ? 'active' : ''}`}>
                                                <div className="size-info">
                                                    <div className="size-name">{size}</div>
                                                    <div className="size-price">TSH {formatPrice(unitPrice)}</div>
                                                    <div className={`stock-info ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
                                                        {isOutOfStock ? 'Out of stock' : `${stockQty} available`}
                                                    </div>
                                                </div>
                                                <div className="quantity-controls">
                                                    <button className="qty-btn" onClick={() => { if (qty > 0) handleQtyChange({ id: variantId, stock_quantity: stockQty }, -1); }} disabled={qty === 0 || isOutOfStock}>−</button>
                                                    <input type="number" className="qty-input" value={qty} onChange={(e) => { const val = e.target.value === '' ? 0 : parseInt(e.target.value); if (!isNaN(val) && val >= 0 && !isOutOfStock) { handleQtyChange({ id: variantId, stock_quantity: stockQty }, val - qty); } }} disabled={isOutOfStock} />
                                                    <button className="qty-btn" onClick={() => { if (!isOutOfStock && qty < stockQty) handleQtyChange({ id: variantId, stock_quantity: stockQty }, 1); }} disabled={isOutOfStock || qty >= stockQty}>+</button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {!hasSizes && currentColorVar && (
                            <div className="section">
                                <div className="size-item">
                                    <div className="size-info">
                                        <div className="size-name">Standard Size</div>
                                        <div className="size-price">TSH {formatPrice(currentColorVar.price || product?.price)}</div>
                                    </div>
                                    <div className="quantity-controls">
                                        <button className="qty-btn" onClick={() => handleQtyChange({ id: currentColorVar.id }, -1)} disabled={selectedItems[currentColorVar.id] === 0}>−</button>
                                        <input type="number" className="qty-input" value={selectedItems[currentColorVar.id] || 0} onChange={(e) => { const val = parseInt(e.target.value) || 0; handleQtyChange({ id: currentColorVar.id }, val - (selectedItems[currentColorVar.id] || 0)); }} />
                                        <button className="qty-btn" onClick={() => handleQtyChange({ id: currentColorVar.id }, 1)}>+</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bottom-sheet-footer">
                        <div className="bottom-sheet-summary">
                            <span className="bottom-sheet-summary-label">Total</span>
                            <span className="bottom-sheet-summary-value">TSH {formatPrice(totals.totalPrice)}</span>
                        </div>
                        <div className="bottom-sheet-buttons">
                            <button className="bottom-sheet-btn-order" onClick={handleConfirmOrder} disabled={totals.totalQty === 0}>Order Now</button>
                            <button className="bottom-sheet-btn-cart" onClick={handleAddToCart} disabled={totals.totalQty === 0}>Add to Cart</button>
                        </div>
                        <button className="bottom-sheet-btn-chat" onClick={handleWhatsAppConfirm} disabled={totals.totalQty === 0}>
                            <MessageSquare size={16} /> Order via WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};

export default ProductSelectionDrawer;