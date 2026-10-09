import { request } from "./api.js";

export const getWishlist = () => request("/api/v1/wishlist");

export const addToWishlist = (productId) =>
  request("/api/v1/wishlist", { method: "POST", body: { productId } });

export const removeFromWishlist = (productId) =>
  request(`/api/v1/wishlist/${productId}`, { method: "DELETE" });
