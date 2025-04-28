let cart = [];

export const getCart = () => cart;

export const addToCart = (product) => {
  cart.push(product);
};

export const removeFromCart = (productId) => {
  cart = cart.filter(item => item.id !== productId);
};

export const clearCart = () => {
  cart = [];
};

export const getCartTotal = () => {
  return cart.reduce((total, item) => total + item.price, 0);
};