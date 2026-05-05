import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("alibaba_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // ✅ Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("alibaba_cart", JSON.stringify(cartItems));
    console.log("💾 Cart saved to localStorage:", cartItems);
  }, [cartItems]);

  // ✅ Listen for storage changes across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'alibaba_cart') {
        const newCart = e.newValue ? JSON.parse(e.newValue) : [];
        setCartItems(newCart);
        console.log("🔄 Cart updated from another tab:", newCart);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ✅ Listen for custom cartUpdated event (for same tab updates)
  useEffect(() => {
    const handleCartUpdate = (e) => {
      if (e.detail) {
        setCartItems(e.detail);
        console.log("🔄 Cart updated via event:", e.detail);
      }
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const addToCart = (newItem) => {
    console.log("🛒 addToCart called:", newItem);
    
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(item => item.uniqueCartId === newItem.uniqueCartId);
      
      console.log("Existing index:", existingIndex);
      
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + newItem.quantity
        };
        console.log("✅ Updated existing item:", updated[existingIndex]);
        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: updated }));
        return updated;
      } else {
        const newCart = [...prev, newItem];
        console.log("✅ Added new item:", newItem);
        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: newCart }));
        return newCart;
      }
    });
  };

  const updateQuantity = (uniqueCartId, newQuantity) => {
    console.log("🔄 updateQuantity called with:", { uniqueCartId, newQuantity });
    console.log("Current cartItems before update:", cartItems);
    
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
      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: updated }));
      return updated;
    });
  };

  const removeFromCart = (uniqueCartId) => {
    console.log("🗑️ removeFromCart called with:", uniqueCartId);
    console.log("Current cartItems before removal:", cartItems);
    
    if (!uniqueCartId) {
      console.error("❌ removeFromCart: uniqueCartId is missing!");
      return;
    }
    
    setCartItems(prev => {
      const itemToRemove = prev.find(item => item.uniqueCartId === uniqueCartId);
      if (!itemToRemove) {
        console.error("❌ Item not found with uniqueCartId:", uniqueCartId);
        return prev;
      }
      
      const filtered = prev.filter(item => item.uniqueCartId !== uniqueCartId);
      console.log("✅ Removed item:", itemToRemove);
      console.log("Remaining items:", filtered);
      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: filtered }));
      return filtered;
    });
  };

  const clearCart = () => {
    console.log("🗑️ clearCart called");
    setCartItems([]);
    localStorage.removeItem("alibaba_cart");
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: [] }));
  };

  const getCartTotal = () => {
    const total = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    console.log("💰 Cart total:", total);
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