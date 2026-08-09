import { request } from "./api.js";

function adaptProduct(p) {
  return {
    id: p._id,
    name: p.nombre,
    price: p.precio,
    precioOferta: p.precioOferta ?? null,
    enOferta: p.enOferta ?? false,
    image: p.imagenes?.[0] || "",
    images: p.imagenes || [],
    category: p.categoria,
    stock: p.stock,
    activo: p.activo,
    descripcion: p.descripcion,
  };
}

// Rutas públicas
export const getProducts = async () => {
  const productos = await request("/products");
  return productos.map(adaptProduct);
};

export const getProductById = async (id) => {
  const producto = await request(`/products/${id}`);
  return adaptProduct(producto);
};

// Admin
export const getAllProductsAdmin = async () => {
  const productos = await request("/products/admin/all", { auth: true });
  return productos.map(adaptProduct);
};

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