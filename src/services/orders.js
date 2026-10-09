import { request } from "./api.js";

export const createCashOrder = (cartId, shippingAddress) =>
  request(`/api/v2/orders/${cartId}`, { method: "POST", body: { shippingAddress } });

// The API sends the user back to <origin>/allorders after paying
export const createCheckoutSession = (cartId, shippingAddress) =>
  request(
    `/api/v1/orders/checkout-session/${cartId}?url=${encodeURIComponent(window.location.origin)}`,
    { method: "POST", body: { shippingAddress } }
  );

export const getUserOrders = (userId) => request(`/api/v1/orders/user/${userId}`);
