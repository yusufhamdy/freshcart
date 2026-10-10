import { request } from "./api.js";

export const updateMe = (body) => request("/api/v1/users/updateMe/", { method: "PUT", body });

export const changePassword = (body) =>
  request("/api/v1/users/changeMyPassword", { method: "PUT", body });

// The JWT only carries id, name and role, so the stored email and phone are
// read from here. There is no /users/me route: "me" is parsed as an id.
export const getUser = (id) => request(`/api/v1/users/${id}`);
