import React, { useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
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
                        const specificVariation = variations.find(v => 
                            String(v.color_name) === String(colorData.color_name) && 
                            String(v.size_value) === String(initialSize)
                        );
                        const variantId = specificVariation?.id || colorData.id;
                        const itemKey = `${variantId}::${initialSize}`;
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
        const specificVariation = variations.find(v => 
            String(v.color_name) === String(currentColorVar.color_name) && 
            String(v.size_value) === String(size)
        );
        const variantId = specificVariation?.id || currentColorVar.id;
        const itemKey = `${variantId}::${size}`;
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
            
            let stockQty = getStockForSize(variant, finalSize);
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
            {/* Animations & Custom Scrollbar Styles */}
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
                input[type="number"] { -moz-appearance: textfield; }
                input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
            `}</style>

            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] animate-[fadeIn_0.2s_ease] dark:bg-black/85 dark:backdrop-blur-md" 
                onClick={onClose}
            ></div>

            {/* ===== DESKTOP LAYOUT ===== */}
            <div className="hidden md:block">
                {/* Floating Image - Kushoto */}
                <div className="fixed left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 -ml-[300px] min-[1367px]:-ml-[380px] min-[1601px]:-ml-[450px] z-[10000]">
                    <div className="relative p-5 bg-transparent">
                        <div className="relative w-[450px] h-[450px] min-[1367px]:w-[600px] min-[1367px]:h-[600px] min-[1601px]:w-[620px] min-[1601px]:h-[620px] overflow-visible">
                            {allImages.length > 0 && (
                                <>
                                    <button className="absolute top-1/2 -translate-y-1/2 w-[50px] h-[50px] rounded-full bg-white dark:bg-gray-700 flex items-center justify-center cursor-pointer shadow-lg text-[22px] text-gray-800 dark:text-gray-200 z-20 transition-all hover:scale-110 hover:shadow-xl -left-[65px] min-[1367px]:-left-[50px] min-[1601px]:-left-[55px]" onClick={handlePrevImage}>❮</button>
                                    <img src={previewImage} alt={product?.name || 'Product'} className="w-full h-full object-cover rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)]" />
                                    <button className="absolute top-1/2 -translate-y-1/2 w-[50px] h-[50px] rounded-full bg-white dark:bg-gray-700 flex items-center justify-center cursor-pointer shadow-lg text-[22px] text-gray-800 dark:text-gray-200 z-20 transition-all hover:scale-110 hover:shadow-xl -right-[65px] min-[1367px]:-right-[50px] min-[1601px]:-right-[55px]" onClick={handleNextImage}>❯</button>
                                    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-black/60 dark:bg-gray-800/90 text-white dark:text-gray-200 px-3 py-1 rounded-full text-xs">{currentImgIndex + 1} / {allImages.length}</div>
                                </>
                            )}
                            {allImages.length === 0 && (
                                <img src={previewImage || productImage} alt={product?.name || 'Product'} className="w-full h-full object-cover rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)]" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side Drawer */}
                <div className="fixed right-0 top-0 h-screen w-[600px] max-w-[90vw] bg-white dark:bg-gray-800 shadow-[-5px_0_25px_rgba(0,0,0,0.15)] dark:shadow-[-5px_0_25px_rgba(0,0,0,0.6)] z-[10000] flex flex-col overflow-hidden animate-[slideInRight_0.3s_ease-out] text-gray-800 dark:text-gray-200">
                    <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 dark:border-gray-600 shrink-0 bg-white dark:bg-gray-800">
                        <h3 className="m-0 text-lg font-semibold text-gray-900 dark:text-gray-200">Select variations</h3>
                        <button className="w-9 h-9 rounded-full bg-transparent border-none cursor-pointer text-2xl flex items-center justify-center text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={onClose}>✕</button>
                    </div>
                    <div className="p-5 px-6 flex-1 overflow-y-auto min-h-0 bg-white dark:bg-gray-800 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-[#ff4e00] [&::-webkit-scrollbar-thumb]:rounded-full">
                        <div className="mb-6 text-gray-900 dark:text-gray-200">
                            <h2 className="text-xl font-bold mb-2">{product?.name}</h2>
                            <div className="text-2xl font-bold text-[#ff4e00]">TSH {formatPrice(product?.price)}</div>
                        </div>

                        {/* Color Selection */}
                        {Object.keys(colorVariations).length > 0 && (
                            <div className="mb-6">
                                <div className="font-semibold mb-3 text-sm text-gray-900 dark:text-gray-200">Color: {selectedColor || ''}</div>
                                <div className="flex gap-3 flex-wrap">
                                    {Object.keys(colorVariations).map(color => (
                                        <div key={color} className={`cursor-pointer text-center transition-all rounded-lg p-1 border ${selectedColor === color ? 'border-[#ff4e00] shadow-[0_0_0_2px_#ff4e00] bg-orange-50 dark:bg-gray-800' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'}`} onClick={() => handleColorSelect(color)}>
                                            <img src={colorVariations[color].color_image || productImage} alt={color} className="w-[50px] h-[50px] rounded-lg object-cover" />
                                            <div className="text-[11px] mt-1 text-gray-500 dark:text-gray-400">{color}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selection */}
                        {hasSizes && currentColorVar && (
                            <div className="mb-6">
                                <div className="font-semibold mb-3 text-sm text-gray-900 dark:text-gray-200">Size</div>
                                <div className="flex flex-col gap-3">
                                    {sizes.map(size => {
                                        const stockQty = getStockForSize(currentColorVar, size);
                                        const qty = getQuantityForSize(size);
                                        const isOutOfStock = stockQty === 0;
                                        const specificVariation = variations.find(v => 
                                            String(v.color_name) === String(currentColorVar.color_name) && 
                                            String(v.size_value) === String(size)
                                        );
                                        const variantId = specificVariation ? `${specificVariation.id}::${size}` : `${currentColorVar.id}::${size}`;
                                        const unitPrice = Number(specificVariation?.price) || Number(currentColorVar.price) || Number(product?.price) || 0;

                                        return (
                                            <div key={size} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${qty > 0 ? 'border-[#ff4e00] bg-orange-50 dark:bg-gray-700' : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'}`}>
                                                <div className="flex-1 flex items-center gap-2 flex-wrap">
                                                    <div className="font-bold text-base text-gray-900 dark:text-gray-200">{size}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">TSH {formatPrice(unitPrice)}</div>
                                                    <div className={`text-[11px] mt-0.5 ${isOutOfStock ? 'text-red-500' : 'text-green-500 dark:text-[#4ade80]'}`}>
                                                        {isOutOfStock ? 'Out of stock' : `${stockQty} available`}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2.5">
                                                    <button className="w-8 h-8 rounded-md border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-600 font-bold text-lg flex items-center justify-center text-gray-800 dark:text-gray-200 transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed enabled:hover:bg-gray-50 dark:enabled:hover:bg-gray-500 enabled:hover:border-[#ff4e00]" onClick={() => { if (qty > 0) handleQtyChange({ id: variantId, stock_quantity: stockQty }, -1); }} disabled={qty === 0 || isOutOfStock}>−</button>
                                                    <input type="number" className="w-[55px] text-center border border-gray-300 dark:border-gray-500 rounded-md p-2 text-sm outline-none bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-200 focus:border-[#ff4e00]" value={qty} onChange={(e) => { const val = e.target.value === '' ? 0 : parseInt(e.target.value); if (!isNaN(val) && val >= 0 && !isOutOfStock) { handleQtyChange({ id: variantId, stock_quantity: stockQty }, val - qty); } }} disabled={isOutOfStock} />
                                                    <button className="w-8 h-8 rounded-md border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-600 font-bold text-lg flex items-center justify-center text-gray-800 dark:text-gray-200 transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed enabled:hover:bg-gray-50 dark:enabled:hover:bg-gray-500 enabled:hover:border-[#ff4e00]" onClick={() => { if (!isOutOfStock && qty < stockQty) handleQtyChange({ id: variantId, stock_quantity: stockQty }, 1); }} disabled={isOutOfStock || qty >= stockQty}>+</button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Free size */}
                        {!hasSizes && currentColorVar && (
                            <div className="mb-6">
                                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                                    <div className="flex-1">
                                        <div className="font-bold text-base text-gray-900 dark:text-gray-200">Standard Size</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">TSH {formatPrice(currentColorVar.price || product?.price)}</div>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <button className="w-8 h-8 rounded-md border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-600 font-bold text-lg flex items-center justify-center text-gray-800 dark:text-gray-200 transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed enabled:hover:bg-gray-50 dark:enabled:hover:bg-gray-500 enabled:hover:border-[#ff4e00]" onClick={() => handleQtyChange({ id: currentColorVar.id }, -1)} disabled={selectedItems[currentColorVar.id] === 0}>−</button>
                                        <input type="number" className="w-[55px] text-center border border-gray-300 dark:border-gray-500 rounded-md p-2 text-sm outline-none bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-200 focus:border-[#ff4e00]" value={selectedItems[currentColorVar.id] || 0} onChange={(e) => { const val = parseInt(e.target.value) || 0; handleQtyChange({ id: currentColorVar.id }, val - (selectedItems[currentColorVar.id] || 0)); }} />
                                        <button className="w-8 h-8 rounded-md border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-600 font-bold text-lg flex items-center justify-center text-gray-800 dark:text-gray-200 transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed enabled:hover:bg-gray-50 dark:enabled:hover:bg-gray-500 enabled:hover:border-[#ff4e00]" onClick={() => handleQtyChange({ id: currentColorVar.id }, 1)}>+</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-100 dark:border-gray-600 p-5 px-6 bg-white dark:bg-gray-800 shrink-0">
                        <div className="flex justify-between mb-4">
                            <span className="text-gray-500 dark:text-gray-400 text-[15px]">Subtotal</span>
                            <span className="text-2xl font-bold text-[#ff4e00]">TSH {formatPrice(totals.totalPrice)}</span>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex-1 py-3.5 rounded-lg font-bold text-white bg-[#ff4e00] border-none cursor-pointer text-[15px] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60 hover:bg-[#e64600]" onClick={handleConfirmOrder} disabled={totals.totalQty === 0}>Order Now</button>
                            <button className="flex-1 py-3.5 rounded-lg font-bold text-[#ff4e00] bg-white dark:bg-gray-700 border-2 border-[#ff4e00] cursor-pointer text-[15px] transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:border-gray-300 dark:disabled:border-gray-600 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-orange-50 dark:hover:bg-gray-600" onClick={handleAddToCart} disabled={totals.totalQty === 0}>Add to Cart</button>
                        </div>
                        <button className="w-full mt-3 bg-[#25D366] text-white border-none py-3 rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer text-[15px] transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#20b858]" onClick={handleWhatsAppConfirm} disabled={totals.totalQty === 0}>
                            <MessageSquare size={18} /> Order via WhatsApp
                        </button>
                    </div>
                </div>
            </div>

            {/* ===== MOBILE LAYOUT ===== */}
            <div className="md:hidden fixed inset-0 z-[9999] flex flex-col justify-end pointer-events-none">
                {/* 
                  🔥 HAPA NDIO PALIPOBADILIKA: 
                  Tumeweka h-[85dvh] (Dynamic Viewport Height) ili ichukue 85% ya screen 
                  na kuzuia address bar isumbue kwenye simu. 
                */}
                <div className="pointer-events-auto fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-[20px] z-[10000] animate-[slideUp_0.3s_ease-out] h-[85dvh] flex flex-col overflow-hidden shadow-[0_-5px_25px_rgba(0,0,0,0.15)] dark:shadow-[0_-5px_25px_rgba(0,0,0,0.6)] text-gray-800 dark:text-gray-200">
                    <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto my-3 cursor-pointer" onClick={onClose}></div>
                    <div className="flex justify-between items-center px-4 sm:px-5 pb-2.5 sm:pb-3 border-b border-gray-100 dark:border-gray-600 shrink-0 bg-white dark:bg-gray-800">
                        <h3 className="m-0 text-lg font-semibold text-gray-900 dark:text-gray-200">Select Options</h3>
                        <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 border-none text-lg cursor-pointer flex items-center justify-center text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" onClick={onClose}>✕</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 px-4 sm:px-5 min-h-0 bg-white dark:bg-gray-800 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-[#ff4e00] [&::-webkit-scrollbar-thumb]:rounded-full">
                        <div className="flex gap-4 mb-5">
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
                                <img src={previewImage} alt={product?.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">{product?.name}</h4>
                                <div className="text-lg font-bold text-[#ff4e00]">TSH {formatPrice(product?.price)}</div>
                            </div>
                        </div>

                        {Object.keys(colorVariations).length > 0 && (
                            <div className="mb-6">
                                <div className="font-semibold mb-3 text-sm text-gray-900 dark:text-gray-200">Color: {selectedColor || ''}</div>
                                <div className="flex gap-2 sm:gap-3 flex-wrap">
                                    {Object.keys(colorVariations).map(color => (
                                        <div key={color} className={`cursor-pointer text-center transition-all rounded-lg p-1 border ${selectedColor === color ? 'border-[#ff4e00] shadow-[0_0_0_2px_#ff4e00] bg-orange-50 dark:bg-gray-800' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'}`} onClick={() => handleColorSelect(color)}>
                                            <img src={colorVariations[color].color_image || productImage} alt={color} className="w-10 h-10 sm:w-[45px] sm:h-[45px] rounded-lg object-cover" />
                                            <div className="text-[11px] mt-1 text-gray-500 dark:text-gray-400">{color}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {hasSizes && currentColorVar && (
                            <div className="mb-6">
                                <div className="font-semibold mb-3 text-sm text-gray-900 dark:text-gray-200">Size</div>
                                <div className="flex flex-col gap-2">
                                    {sizes.map(size => {
                                        const stockQty = getStockForSize(currentColorVar, size);
                                        const qty = getQuantityForSize(size);
                                        const isOutOfStock = stockQty === 0;
                                        const specificVariation = variations.find(v => 
                                            String(v.color_name) === String(currentColorVar.color_name) && 
                                            String(v.size_value) === String(size)
                                        );
                                        const variantId = specificVariation ? `${specificVariation.id}::${size}` : `${currentColorVar.id}::${size}`;
                                        const unitPrice = Number(specificVariation?.price) || Number(currentColorVar.price) || Number(product?.price) || 0;
                                        
                                        return (
                                            <div key={size} className={`flex flex-wrap items-center justify-between p-2 sm:p-3 rounded-lg border transition-all gap-2 ${qty > 0 ? 'border-[#ff4e00] bg-orange-50 dark:bg-gray-700' : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'}`}>
                                                <div className="flex-1 flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-[50%]">
                                                    <div className="font-bold text-xs sm:text-base text-gray-900 dark:text-gray-200">{size}</div>
                                                    <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{`TSH ${formatPrice(unitPrice)}`}</div>
                                                    <div className={`text-[9px] sm:text-[11px] ${isOutOfStock ? 'text-red-500' : 'text-green-500 dark:text-[#4ade80]'}`}>
                                                        {isOutOfStock ? 'Out of stock' : `${stockQty} available`}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5 sm:gap-2.5 ml-auto">
                                                    <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-md border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-600 font-bold text-base sm:text-lg flex items-center justify-center text-gray-800 dark:text-gray-200 transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed enabled:hover:bg-gray-50 dark:enabled:hover:bg-gray-500 enabled:hover:border-[#ff4e00]" onClick={() => { if (qty > 0) handleQtyChange({ id: variantId, stock_quantity: stockQty }, -1); }} disabled={qty === 0 || isOutOfStock}>−</button>
                                                    <input type="number" className="w-[40px] sm:w-[55px] text-center border border-gray-300 dark:border-gray-500 rounded-md p-1 sm:p-2 text-xs sm:text-sm outline-none bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-200 focus:border-[#ff4e00]" value={qty} onChange={(e) => { const val = e.target.value === '' ? 0 : parseInt(e.target.value); if (!isNaN(val) && val >= 0 && !isOutOfStock) { handleQtyChange({ id: variantId, stock_quantity: stockQty }, val - qty); } }} disabled={isOutOfStock} />
                                                    <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-md border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-600 font-bold text-base sm:text-lg flex items-center justify-center text-gray-800 dark:text-gray-200 transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed enabled:hover:bg-gray-50 dark:enabled:hover:bg-gray-500 enabled:hover:border-[#ff4e00]" onClick={() => { if (!isOutOfStock && qty < stockQty) handleQtyChange({ id: variantId, stock_quantity: stockQty }, 1); }} disabled={isOutOfStock || qty >= stockQty}>+</button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {!hasSizes && currentColorVar && (
                            <div className="mb-6">
                                <div className="flex flex-wrap items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 gap-2">
                                    <div className="flex-1 min-w-[50%]">
                                        <div className="font-bold text-xs sm:text-base text-gray-900 dark:text-gray-200">Standard Size</div>
                                        <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{`TSH ${formatPrice(currentColorVar.price || product?.price)}`}</div>
                                    </div>
                                    <div className="flex items-center gap-1.5 sm:gap-2.5 ml-auto">
                                        <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-md border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-600 font-bold text-base sm:text-lg flex items-center justify-center text-gray-800 dark:text-gray-200 transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed enabled:hover:bg-gray-50 dark:enabled:hover:bg-gray-500 enabled:hover:border-[#ff4e00]" onClick={() => handleQtyChange({ id: currentColorVar.id }, -1)} disabled={selectedItems[currentColorVar.id] === 0}>−</button>
                                        <input type="number" className="w-[40px] sm:w-[55px] text-center border border-gray-300 dark:border-gray-500 rounded-md p-1 sm:p-2 text-xs sm:text-sm outline-none bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-200 focus:border-[#ff4e00]" value={selectedItems[currentColorVar.id] || 0} onChange={(e) => { const val = parseInt(e.target.value) || 0; handleQtyChange({ id: currentColorVar.id }, val - (selectedItems[currentColorVar.id] || 0)); }} />
                                        <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-md border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-600 font-bold text-base sm:text-lg flex items-center justify-center text-gray-800 dark:text-gray-200 transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed enabled:hover:bg-gray-50 dark:enabled:hover:bg-gray-500 enabled:hover:border-[#ff4e00]" onClick={() => handleQtyChange({ id: currentColorVar.id }, 1)}>+</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-600 p-4 sm:p-5 bg-white dark:bg-gray-800 pb-[calc(16px+env(safe-area-inset-bottom,0px))] shrink-0">
                        <div className="flex justify-between mb-3">
                            <span className="text-gray-500 dark:text-gray-400 text-sm">Total</span>
                            <span className="text-lg font-bold text-[#ff4e00]">TSH {formatPrice(totals.totalPrice)}</span>
                        </div>
                        <div className="flex flex-row gap-2">
                            <button className="flex-1 min-h-[44px] bg-[#ff4e00] text-white border-none py-2.5 px-2 rounded-lg font-bold cursor-pointer text-[13px] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60 hover:bg-[#e64600]" onClick={handleConfirmOrder} disabled={totals.totalQty === 0}>Order Now</button>
                            <button className="flex-1 min-h-[44px] bg-white dark:bg-gray-700 text-[#ff4e00] border-2 border-[#ff4e00] py-2.5 px-2 rounded-lg font-bold cursor-pointer text-[13px] transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:border-gray-300 dark:disabled:border-gray-600 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-orange-50 dark:hover:bg-gray-600" onClick={handleAddToCart} disabled={totals.totalQty === 0}>Add to Cart</button>
                        </div>
                        <button className="w-full mt-2.5 bg-[#25D366] text-white border-none p-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#20b858]" onClick={handleWhatsAppConfirm} disabled={totals.totalQty === 0}>
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