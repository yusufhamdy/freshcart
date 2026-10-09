import { request } from "./api.js";

// Arrays are sent as repeated keys, e.g. category[in]=a&category[in]=b
export function getProducts(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((item) => query.append(key, item));
    else if (value !== "" && value != null) query.append(key, value);
  });
  return request(`/api/v1/products?${query}`);
}

export const getProduct = (id) => request(`/api/v1/products/${id}`);

// The API returns at most 50 products per request, so every page is merged
export async function getAllProducts(params = {}) {
  const first = await getProducts({ ...params, limit: 50 });
  const pages = first.metadata?.numberOfPages || 1;
  const others = await Promise.all(
    Array.from({ length: pages - 1 }, (_, index) =>
      getProducts({ ...params, limit: 50, page: index + 2 })
    )
  );
  return { ...first, data: [first, ...others].flatMap((response) => response.data) };
}

export const getReviews = (productId) => request(`/api/v1/products/${productId}/reviews`);

export const addReview = (productId, body) =>
  request(`/api/v1/products/${productId}/reviews`, { method: "POST", body });

export const updateReview = (reviewId, body) =>
  request(`/api/v1/reviews/${reviewId}`, { method: "PUT", body });

export const deleteReview = (reviewId) =>
  request(`/api/v1/reviews/${reviewId}`, { method: "DELETE" });
