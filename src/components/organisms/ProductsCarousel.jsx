import { useState, useEffect, useRef } from "react";

import useCarruselInfinito from "../../hooks/useCarruselInfinito";

import ProductCard from "./ProductCard";

import "../../css/FeaturedProducts.css";

// Carrusel continuo de productos (destacados, relacionados...):
// se desplaza solo, se pausa con el mouse encima y se arrastra con
// el mouse o el dedo. Si los productos caben en pantalla, quedan
// centrados y quietos.
function ProductsCarousel({ title, products, id }) {
  const [desborda, setDesborda] = useState(false);
  const carouselRef = useRef(null);

  const { trackRef, carouselProps, trackProps } = useCarruselInfinito({
    activo: desborda,
    dependencias: [products],
  });

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

  if (products.length === 0) return null;

  const renderItem = (product, key) => (
    <div className="featured-item" key={key}>
      <ProductCard product={product} />
    </div>
  );

  return (
    <section className="featured" id={id}>
      <h2>{title}</h2>

      <div
        className={
          desborda
            ? "featured-carousel"
            : "featured-carousel featured-carousel-quieto"
        }
        ref={carouselRef}
        {...carouselProps}
      >
        <div className="featured-track" ref={trackRef} {...trackProps}>
          {products.map((p) => renderItem(p, `${p.type}-${p.id}`))}

          {desborda &&
            products.map((p) => renderItem(p, `dup-${p.type}-${p.id}`))}
        </div>
      </div>
    </section>
  );
}

export default ProductsCarousel;
