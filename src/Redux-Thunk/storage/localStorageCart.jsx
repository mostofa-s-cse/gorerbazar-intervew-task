// localStorageCart.js
export const getCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const updateCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};
