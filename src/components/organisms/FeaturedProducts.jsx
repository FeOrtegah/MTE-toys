import { useState, useEffect, useRef } from "react";

import { getCatalogItems } from "../../services/api";
import useCarruselInfinito from "../../hooks/useCarruselInfinito";

import ProductCard from "./ProductCard";

import "../../css/FeaturedProducts.css";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Solo se mueve si los productos no caben en pantalla
  const [desborda, setDesborda] = useState(false);
  const carouselRef = useRef(null);

  const { trackRef, carouselProps, trackProps } = useCarruselInfinito({
    activo: desborda,
    dependencias: [products],
  });

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

  // ¿Caben todos los productos en el ancho disponible?
  useEffect(() => {
    function medir() {
      const carousel = carouselRef.current;
      const track = trackRef.current;
      if (!carousel || !track || products.length === 0) return;

      const item = track.querySelector(".featured-item");
      if (!item) return;

      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const anchoSet = products.length * (item.offsetWidth + gap) - gap;

      setDesborda(anchoSet > carousel.clientWidth);
    }

    medir();
    window.addEventListener("resize", medir);

    return () => window.removeEventListener("resize", medir);
  }, [products, trackRef]);

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  if (products.length === 0) {
    return null;
  }

  const renderItem = (product, key) => (
    <div className="featured-item" key={key}>
      <ProductCard product={product} />
    </div>
  );

  return (
    <section className="featured" id="productos-destacados">
      <h2>Productos destacados</h2>

      {/* Mismo comportamiento que "Conoce nuestras marcas": cinta
          continua que se desplaza sola, se pausa con el mouse encima
          y se arrastra con el mouse o el dedo. La lista se duplica
          para que el giro no tenga saltos. */}
      <div
        className={
          desborda
            ? "featured-carousel"
            : "featured-carousel featured-carousel-quieto"
        }
        ref={carouselRef}
        {...carouselProps}
      >
        <div
          className="featured-track"
          ref={trackRef}
          {...trackProps}
        >
          {products.map((p) =>
            renderItem(p, `${p.type}-${p.id}`)
          )}

          {desborda &&
            products.map((p) =>
              renderItem(p, `dup-${p.type}-${p.id}`)
            )}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
