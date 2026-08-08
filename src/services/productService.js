import { request } from "./api.js";

/**
 * El backend guarda los productos en español (nombre, precio, imagen,
 * categoria, stock) y con _id de Mongo. Los componentes del frontend
 * (ProductCard, Products, etc.) ya están escritos esperando
 * {id, name, price, image, category}. Esta función traduce uno a otro
 * para no tener que tocar todos los componentes existentes.
 */
function adaptProduct(p) {
  return {
    id: p._id,
    name: p.nombre,
    price: p.precio,
    image: p.imagen,
    category: p.categoria,
    stock: p.stock,
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

// Rutas protegidas (admin) — reciben/devuelven el formato del backend tal cual,
// porque se usarán en un panel de admin aparte, no en las vistas de cliente.
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