import { request } from "./api.js";

export const getAddresses = () => request("/api/v1/addresses");

export const addAddress = (body) => request("/api/v1/addresses", { method: "POST", body });

export const removeAddress = (id) => request(`/api/v1/addresses/${id}`, { method: "DELETE" });
