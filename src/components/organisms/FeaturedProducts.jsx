import { useState, useEffect } from "react";

import { getCatalogItems } from "../../services/api";

import ProductsCarousel from "./ProductsCarousel";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCatalogItems()
      .then((data) => {
        const destacados = data
          .filter((p) => p.destacado === true && p.activo !== false)
          .sort((a, b) =>
            (a.name || "").localeCompare(b.name || "", "es")
          );

        setProducts(destacados);
      })
      .catch((err) =>
        console.error("Error al cargar destacados:", err)
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  return (
    <ProductsCarousel
      id="productos-destacados"
      title="Productos destacados"
      products={products}
    />
  );
}

export default FeaturedProducts;
