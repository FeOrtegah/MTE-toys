import { request } from "./api.js";

export const login = (credentials) =>
  request("/auth/login", { method: "POST", body: credentials });

export const registerAdmin = (data) =>
  request("/auth/register", { method: "POST", body: data });