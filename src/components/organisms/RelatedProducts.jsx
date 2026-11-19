import { useState, useEffect } from "react";

import { getCatalogItems } from "../../services/api";

import ProductsCarousel from "./ProductsCarousel";

function RelatedProducts({
  categoria,
  excluirId,
  excluirTipo,
}) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!categoria) return;

    getCatalogItems()
      .then((data) => {
        const relacionados = data.filter(
          (p) =>
            p.category === categoria &&
            !(
              String(p.id) === String(excluirId) &&
              p.type === excluirTipo
            )
        );

        setProducts(relacionados);
      })
      .catch(() => setProducts([]));
  }, [categoria, excluirId, excluirTipo]);

  return (
    <ProductsCarousel
      id="productos-relacionados"
      title="Productos relacionados"
      products={products}
    />
  );
}

export default RelatedProducts;
