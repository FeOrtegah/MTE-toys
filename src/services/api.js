const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function request(
  path,
  { method = "GET", body, auth = false } = {}
) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = localStorage.getItem("token");

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  // Métodos que pueden llevar cuerpo (PATCH, POST, PUT, DELETE):
  // si no se pasó "body" explícito, mandamos "{}" en vez de nada.
  // Algunos proxies/servidores (ej. LiteSpeed en cPanel) rechazan
  // peticiones con Content-Type: application/json pero sin cuerpo real.
  const metodosConCuerpo = ["POST", "PUT", "PATCH", "DELETE"];

  const necesitaCuerpo =
    metodosConCuerpo.includes(method.toUpperCase());

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body
      ? JSON.stringify(body)
      : necesitaCuerpo
      ? "{}"
      : undefined,
  });

  let data = null;

  try {
    data = await res.json();
  } catch {
    // Respuesta sin body
  }

  if (!res.ok) {
    const message =
      data?.message ||
      `Error ${res.status} en ${path}`;

    throw new Error(message);
  }

  return data;
}

// =====================================================
// NORMALIZAR PRODUCTO
// =====================================================

export function mapProduct(p) {
  if (!p) return null;

  const enOferta =
    Boolean(p.enOferta) &&
    p.precioOferta != null;

  return {
    id: p._id || p.id,

    name: p.nombre || p.name || "",

    price: enOferta
      ? Number(p.precioOferta)
      : Number(p.precio || p.price || 0),

    oldPrice: enOferta
      ? Number(p.precio)
      : undefined,

    offer: enOferta,

    destacado: Boolean(p.destacado),

    image:
      p.imagenes?.[0] ||
      p.image ||
      "",

    images:
      p.imagenes ||
      p.images ||
      [],

    category:
      p.categoria ||
      p.category ||
      "General",

    stock:
      p.stock !== undefined
        ? Number(p.stock)
        : 0,

    description:
      p.descripcion ||
      p.description ||
      "",

    activo:
      p.activo !== undefined
        ? p.activo
        : true,

    type: "producto",
  };
}

// =====================================================
// NORMALIZAR COMBO
// =====================================================

export function mapCombo(combo) {
  if (!combo) return null;

  const principal =
    combo.productoPrincipal || {};

  const adicional =
    combo.productoAdicional || {};

  const enOferta =
    Boolean(combo.enOferta) &&
    combo.precioOferta != null;

  /*
   * Las imágenes del combo salen de las imágenes
   * que ya existen en los productos.
   *
   * Primero usamos imágenes propias del combo,
   * si existen.
   *
   * Si no existen, usamos:
   * 1. imagen principal
   * 2. imagen adicional
   */

  const imagenesCombo =
    combo.imagenes?.length
      ? combo.imagenes
      : [
          ...(principal.imagenes || []),
          ...(adicional.imagenes || []),
        ].filter(Boolean);

  /*
   * Calculamos stock disponible del combo.
   *
   * Ejemplo:
   * Nerf = 10 unidades
   * Dardos = 50 unidades
   * cantidadAdicional = 20
   *
   * Solo se pueden vender 2 combos.
   */

  const stockPrincipal =
    Number(
      principal.stock ??
        combo.stock ??
        0
    );

  const stockAdicional =
    Number(
      adicional.stock ??
        combo.stockAdicional ??
        0
    );

  const cantidadAdicional =
    Math.max(
      1,
      Number(
        combo.cantidadAdicional || 1
      )
    );

  let stockCombo;

  if (
    combo.stock !== undefined &&
    combo.stock !== null
  ) {
    stockCombo = Number(combo.stock);
  } else if (
    adicional.stock !== undefined &&
    adicional.stock !== null
  ) {
    stockCombo = Math.min(
      stockPrincipal,
      Math.floor(
        stockAdicional /
          cantidadAdicional
      )
    );
  } else {
    stockCombo = stockPrincipal;
  }

  return {
    id: combo._id || combo.id,

    name:
      combo.nombre ||
      "Combo",

    price: enOferta
      ? Number(combo.precioOferta)
      : Number(
          combo.precioCombo ??
            combo.precio ??
            0
        ),

    oldPrice: enOferta
      ? Number(combo.precioCombo)
      : undefined,

    offer: enOferta,

    destacado:
      Boolean(combo.destacado),

    image:
      imagenesCombo[0] || "",

    images:
      imagenesCombo,

    category:
      combo.categoria ||
      "Combos",

    stock: stockCombo,

    description:
      combo.descripcion ||
      "",

    activo:
      combo.activo !== undefined
        ? combo.activo
        : true,

    type: "combo",

    /*
     * Información original del combo.
     */
    productoPrincipal:
      combo.productoPrincipal,

    productoAdicional:
      combo.productoAdicional,

    cantidadAdicional,

    precioCombo:
      Number(
        combo.precioCombo || 0
      ),

    precioOferta:
      combo.precioOferta != null
        ? Number(combo.precioOferta)
        : null,

    enOferta:
      Boolean(combo.enOferta),

    categoria:
      combo.categoria || "Combos",
  };
}

// =====================================================
// PRODUCTOS
// =====================================================

export async function getProducts() {
  const data = await request(
    "/products"
  );

  return Array.isArray(data)
    ? data
        .map(mapProduct)
        .filter(Boolean)
    : [];
}

export async function getProductById(id) {
  const data = await request(
    `/products/${id}`
  );

  return mapProduct(data);
}

// =====================================================
// COMBOS
// =====================================================

export async function getCombos() {
  const data = await request(
    "/combos"
  );

  return Array.isArray(data)
    ? data
        .map(mapCombo)
        .filter(Boolean)
        .filter(
          (combo) =>
            combo.activo !== false
        )
    : [];
}

// =====================================================
// COMBO POR ID
// =====================================================

export async function getComboById(id) {
  const combos =
    await getCombos();

  return (
    combos.find(
      (combo) =>
        String(combo.id) ===
        String(id)
    ) || null
  );
}

// =====================================================
// CATÁLOGO COMPLETO
// PRODUCTOS + COMBOS
// =====================================================

export async function getCatalogItems() {
  const [
    products,
    combos,
  ] = await Promise.all([
    getProducts(),
    getCombos(),
  ]);

  return [
    ...products,
    ...combos,
  ].filter(
    (item) =>
      item.activo !== false
  );
}

// =====================================================
// PEDIDOS
// =====================================================

export async function createOrder(
  orderData
) {
  const data = await request(
    "/orders",
    {
      method: "POST",
      body: orderData,
    }
  );

  return data;
}