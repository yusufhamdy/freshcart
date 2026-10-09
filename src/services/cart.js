import { request } from "./api.js";

export const getCart = () => request("/api/v2/cart");

export const addCartItem = (productId) =>
  request("/api/v2/cart", { method: "POST", body: { productId } });

export const updateCartItem = (productId, count) =>
  request(`/api/v2/cart/${productId}`, { method: "PUT", body: { count } });

export const removeCartItem = (productId) =>
  request(`/api/v2/cart/${productId}`, { method: "DELETE" });

export const clearCart = () => request("/api/v2/cart", { method: "DELETE" });

export const applyCoupon = (couponName) =>
  request("/api/v2/cart/applyCoupon", { method: "PUT", body: { couponName } });
