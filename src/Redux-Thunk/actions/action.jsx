// actions.js
import { addItem, removeItem } from "./cartSlice";
import { getCart, updateCart } from "./localStorageCart";

export const addItemToCart = (item) => (dispatch, getState) => {
  // Add item to Redux store
  dispatch(addItem(item));

  // Update cart in localStorage
  const cart = getCart();
  cart.push(item);
  updateCart(cart);
};

export const removeItemFromCart = (itemId) => (dispatch, getState) => {
  // Remove item from Redux store
  dispatch(removeItem(itemId));

  // Update cart in localStorage
  const cart = getCart().filter((item) => item.id !== itemId);
  updateCart(cart);
};
