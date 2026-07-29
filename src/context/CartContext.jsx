import { createContext, useContext, useState, useEffect, useRef } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Tumia useRef kuhifadhi cartItems kwa haraka, kuepuka asynchronous delay
  const cartRef = useRef([]);
  
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("alibaba_cart");
    const initialData = savedCart ? JSON.parse(savedCart) : [];
    cartRef.current = initialData; // Set ref immediately
    return initialData;
  });

  // Update localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("alibaba_cart", JSON.stringify(cartItems));
    cartRef.current = cartItems; // Keep ref in sync
    console.log("💾 Cart saved to localStorage:", cartItems);
  }, [cartItems]);

  // Listen for storage changes across tabs (to keep them in sync)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'alibaba_cart' && e.newValue !== null) {
        const newCart = e.newValue ? JSON.parse(e.newValue) : [];
        // Tumia strict equality ili kuepuka upotoshaji usiohitajika
        if (JSON.stringify(newCart) !== JSON.stringify(cartRef.current)) {
          cartRef.current = newCart;
          setCartItems(newCart);
          console.log("🔄 Cart updated from another tab:", newCart);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToCart = (newItem) => {
    console.log("🛒 addToCart called:", newItem);
    
    // Let's generate a reliable unique ID for the cart item
    // It combines product_id, variant_id, selected_color, selected_size
    const uniqueId = `${newItem.id}-${newItem.variant_id || 'novar'}-${newItem.selected_color || 'nocolor'}-${newItem.selected_size || 'nosize'}`;
    const itemWithUniqueId = { ...newItem, uniqueCartId: uniqueId };
    
    setCartItems((prev) => {
      // Generate a reliable unique ID for the cart item (same as above)
      const existingIndex = prev.findIndex(item => item.uniqueCartId === uniqueId);
      
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + newItem.quantity
        };
        console.log("✅ Updated existing item:", updated[existingIndex]);
        return updated;
      } else {
        const newCart = [...prev, itemWithUniqueId];
        console.log("✅ Added new item:", itemWithUniqueId);
        return newCart;
      }
    });
  };

  const updateQuantity = (uniqueCartId, newQuantity) => {
    console.log("🔄 updateQuantity called with:", { uniqueCartId, newQuantity });
    
    if (!uniqueCartId) {
      console.error("❌ updateQuantity: uniqueCartId is missing!");
      return;
    }
    
    setCartItems((prev) => {
      const itemExists = prev.some(item => item.uniqueCartId === uniqueCartId);
      if (!itemExists) {
        console.error("❌ Item not found with uniqueCartId:", uniqueCartId);
        return prev;
      }
      
      const updated = prev.map((item) =>
        item.uniqueCartId === uniqueCartId 
          ? { ...item, quantity: Math.max(1, newQuantity) } 
          : item
      );
      console.log("✅ Quantity updated:", updated.find(item => item.uniqueCartId === uniqueCartId));
      return updated;
    });
  };

  const removeFromCart = (uniqueCartId) => {
    console.log("🗑️ removeFromCart called with:", uniqueCartId);
    
    if (!uniqueCartId) {
      console.error("❌ removeFromCart: uniqueCartId is missing!");
      return;
    }
    
    setCartItems(prev => {
      const newCart = prev.filter(item => item.uniqueCartId !== uniqueCartId);
      if (newCart.length === prev.length) {
        console.warn("⚠️ Item not found with uniqueCartId:", uniqueCartId);
      } else {
        console.log(`✅ Removed item (${prev.length - newCart.length} item removed)`);
      }
      return newCart;
    });
  };

  const clearCart = () => {
    console.log("🗑️ clearCart called");
    setCartItems([]);
    cartRef.current = [];
    localStorage.removeItem("alibaba_cart");
  };

  const getCartTotal = () => {
    const total = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    return total;
  };

  const getCartCount = () => {
    const count = cartItems.reduce((count, item) => count + item.quantity, 0);
    return count;
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    console.error("❌ useCart must be used within a CartProvider");
  }
  return context;
};