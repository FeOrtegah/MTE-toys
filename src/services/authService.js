import { request } from "./api.js";

export const login = (credentials) =>
  request("/auth/login", { method: "POST", body: credentials });

export const register = (data) =>
  request("/auth/register", { method: "POST", body: data });

export const registerAdmin = (data) =>
  request("/auth/register-admin", { method: "POST", body: data, auth: true });

export const getMe = () => request("/auth/me", { auth: true });

export const updateMe = (data) =>
  request("/auth/me", { method: "PUT", body: data, auth: true });