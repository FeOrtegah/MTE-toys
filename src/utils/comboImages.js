// Devuelve las imágenes combinadas (sin duplicados) de dos productos,
// usado para pre-cargar imágenes de un combo a partir de sus productos.
export function obtenerImagenesProductos(
  products,
  principalId,
  adicionalId
) {
  const principal = products.find(
    (p) => String(p.id) === String(principalId)
  );

  const adicional = products.find(
    (p) => String(p.id) === String(adicionalId)
  );

  const imagenes = [
    ...(principal?.images || []),
    ...(adicional?.images || []),
  ];

  return [...new Set(imagenes)];
}