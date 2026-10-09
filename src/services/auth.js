import { request } from "./api.js";

export const signUp = (body) =>
  request("/api/v1/auth/signup", { method: "POST", body });

export const signIn = (body) =>
  request("/api/v1/auth/signin", { method: "POST", body });

export const verifyToken = () => request("/api/v1/auth/verifyToken");

export const forgotPassword = (email) =>
  request("/api/v1/auth/forgotPasswords", { method: "POST", body: { email } });

export const verifyResetCode = (resetCode) =>
  request("/api/v1/auth/verifyResetCode", { method: "POST", body: { resetCode } });

export const resetPassword = (email, newPassword) =>
  request("/api/v1/auth/resetPassword", {
    method: "PUT",
    body: { email, newPassword },
  });
