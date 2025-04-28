import React, { createContext, useContext, useState } from 'react';
import {
  getCart as staticGetCart,
  addToCart as staticAddToCart,
  removeFromCart as staticRemoveFromCart,
  clearCart as staticClearCart,
  getCartTotal as staticGetCartTotal
} from '../services/ecommerceService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  useEffect(() => {
    try {
      const loadedCart = staticGetCart();
      setCart(loadedCart);
    } catch (e) {
      console.warn('Failed to hydrate cart:', e);
    }
  }, []);


  const addToCart = (item) => {
    staticAddToCart(item);
    setCart([...staticGetCart()]);
  };

  const removeFromCart = (id) => {
    staticRemoveFromCart(id);
    setCart([...staticGetCart()]);
  };

  const clearCart = () => {
    staticClearCart();
    setCart([]);
  };

  const getTotal = () => staticGetCartTotal();

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);