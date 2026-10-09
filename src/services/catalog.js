import { request } from "./api.js";

// The API returns at most 50 items per request, so every page is merged
async function getAll(path) {
  const first = await request(`${path}?limit=50`);
  const pages = first.metadata?.numberOfPages || 1;
  const others = await Promise.all(
    Array.from({ length: pages - 1 }, (_, index) => request(`${path}?limit=50&page=${index + 2}`))
  );
  return { data: [first, ...others].flatMap((response) => response.data) };
}

export const getCategories = () => getAll("/api/v1/categories");

export const getBrands = () => getAll("/api/v1/brands");

export const getSubcategories = () => getAll("/api/v1/subcategories");
