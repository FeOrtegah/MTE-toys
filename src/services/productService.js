import { request } from "./api.js";

// ========================================
// ADAPTADOR DE PRODUCTOS
// ========================================

function adaptProduct(p) {
  return {
    // ID
    id: p._id ?? p.id,

    // Datos principales
    name: p.nombre ?? p.name ?? "",
    description: p.descripcion ?? p.description ?? "",

    // Precio
    price: p.precio ?? p.price ?? 0,
    precioOferta: p.precioOferta ?? null,

    // Estados
    enOferta: p.enOferta ?? false,
    destacado: p.destacado ?? false,
    activo: p.activo ?? true,

    // Categoría
    category: p.categoria ?? p.category ?? "",

    // Stock
    stock: p.stock ?? 0,

    // Imágenes
    image:
      p.imagen ||
      p.image ||
      p.imagenes?.[0] ||
      p.images?.[0] ||
      "",

    images:
      p.imagenes ||
      p.images ||
      [],
  };
}

// ========================================
// PRODUCTOS - TIENDA
// ========================================

export const getProducts = async () => {
  const productos = await request("/products");

  return productos.map(adaptProduct);
};

// ========================================
// PRODUCTO POR ID
// ========================================

export const getProductById = async (id) => {
  const producto = await request(
    `/products/${id}`
  );

  return adaptProduct(producto);
};

// ========================================
// TODOS LOS PRODUCTOS - ADMIN
// ========================================

export const getAllProductsAdmin = async () => {
  const productos = await request(
    "/products/admin/all",
    {
      auth: true,
    }
  );

  return productos.map(adaptProduct);
};

// ========================================
// CREAR PRODUCTO
// ========================================

export const createProduct = async (product) => {
  const nuevoProducto = await request(
    "/products",
    {
      method: "POST",
      body: product,
      auth: true,
    }
  );

  return adaptProduct(nuevoProducto);
};

// ========================================
// ACTUALIZAR PRODUCTO
// ========================================

export const updateProduct = async (
  id,
  product
) => {
  const productoActualizado =
    await request(
      `/products/${id}`,
      {
        method: "PUT",
        body: product,
        auth: true,
      }
    );

  return adaptProduct(
    productoActualizado
  );
};

// ========================================
// DESACTIVAR PRODUCTO
// ========================================

export const deleteProduct = (id) =>
  request(
    `/products/${id}`,
    {
      method: "DELETE",
      auth: true,
    }
  );

// ========================================
// ELIMINAR PERMANENTEMENTE
// ========================================

export const hardDeleteProduct = (id) =>
  request(
    `/products/${id}/permanent`,
    {
      method: "DELETE",
      auth: true,
    }
  );

// ========================================
// ACTIVAR PRODUCTO
// ========================================

export const activateProduct = (id) =>
  request(
    `/products/${id}`,
    {
      method: "PUT",
      body: {
        activo: true,
      },
      auth: true,
    }
  );

// ========================================
// DISMINUIR STOCK
// ========================================

export const decreaseStock = (
  id,
  cantidad
) =>
  request(
    `/products/${id}/decrease-stock`,
    {
      method: "PATCH",
      body: {
        cantidad,
      },
      auth: true,
    }
  );