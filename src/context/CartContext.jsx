import { createContext, useState, useContext } from "react";

// create context
export const CartContext = createContext();

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage on initialization with safe parsing
    const savedCart = localStorage.getItem('cart');
    
    // Handle cases where localStorage contains corrupted data
    if (!savedCart || savedCart === 'undefined' || savedCart === 'null') {
      // Clear corrupted data and return empty array
      if (savedCart && (savedCart === 'undefined' || savedCart === 'null')) {
        localStorage.removeItem('cart');
      }
      return [];
    }
    
    try {
      const parsed = JSON.parse(savedCart);
      // Ensure it's an array
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      // If parsing fails, clear the corrupted data
      console.warn('Failed to parse cart data from localStorage:', error);
      localStorage.removeItem('cart');
      return [];
    }
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save cart to localStorage whenever cartItems change
  const updateCartStorage = (items) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const addToCart = (product) => {
    updateCartStorage((prevItems) => {
      const itemExists = prevItems.find(
        (item) => item.id === product.id
      );

      if (itemExists) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    updateCartStorage((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    updateCartStorage((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    updateCartStorage([]);
  };

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  // Computed values
  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartItems = () => {
    return cartItems;
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  const getCartItem = (productId) => {
    return cartItems.find(item => item.id === productId);
  };

  const value = {
    // Cart items and state
    cartItems,
    isCartOpen,
    
    // Cart operations
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    
    // Computed values
    getTotalItems,
    getTotalPrice,
    getCartItems,
    isInCart,
    getCartItem,
    
    // Legacy compatibility
    items: cartItems, // For backward compatibility
    totalItems: getTotalItems(),
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
