import { request } from "./api.js";

export const login = (credentials) =>
  request("/auth/login", { method: "POST", body: credentials });

// Registro público — lo usan los clientes de la tienda.
export const register = (data) =>
  request("/auth/register", { method: "POST", body: data });

// Crear un admin nuevo — requiere ir logueado como admin (token con auth:true).
export const registerAdmin = (data) =>
  request("/auth/register-admin", { method: "POST", body: data, auth: true });