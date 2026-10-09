import { request } from "./api.js";

export const updateMe = (body) => request("/api/v1/users/updateMe/", { method: "PUT", body });

export const changePassword = (body) =>
  request("/api/v1/users/changeMyPassword", { method: "PUT", body });
