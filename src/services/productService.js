import request from "./api.js";

// Rutas públicas
export const getProducts = () => request("/products");
export const getProductById = (id) => request(`/products/${id}`);

// Rutas protegidas (admin)
export const createProduct = (product) =>
  request("/products", { method: "POST", body: product, auth: true });

export const updateProduct = (id, product) =>
  request(`/products/${id}`, { method: "PUT", body: product, auth: true });

export const deleteProduct = (id) =>
  request(`/products/${id}`, { method: "DELETE", auth: true });

export const decreaseStock = (id, cantidad) =>
  request(`/products/${id}/decrease-stock`, {
    method: "PATCH",
    body: { cantidad },
    auth: true,
  });