const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Wrapper genérico para llamadas a rutas que no tienen su propia función
 * arriba (auth, products/orders protegidos, etc.). Usado por
 * productService.js, orderService.js y authService.js.
 */
export async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // respuesta sin body (ej. 204)
  }

  if (!res.ok) {
    const message = data?.message || `Error ${res.status} en ${path}`;
    throw new Error(message);
  }

  return data;
}

// Traduce los campos del backend (español) a los que usa el frontend (inglés),
// y resuelve el precio a mostrar según si está en oferta o no.
function mapProduct(p) {
  const enOferta = Boolean(p.enOferta) && p.precioOferta != null;

  return {
    id: p._id,
    name: p.nombre,
    price: enOferta ? p.precioOferta : p.precio,
    oldPrice: enOferta ? p.precio : undefined,
    offer: enOferta,
    image: p.imagenes?.[0] || "",
    images: p.imagenes || [],
    category: p.categoria,
    stock: p.stock,
    description: p.descripcion,
  };
}

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error("Error al obtener productos");
  const data = await res.json();
  return data.map(mapProduct);
}

export async function getProductById(id) {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error("Producto no encontrado");
  const data = await res.json();
  return mapProduct(data);
}

export async function createOrder(orderData) {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al crear el pedido");
  }

  return res.json();
}