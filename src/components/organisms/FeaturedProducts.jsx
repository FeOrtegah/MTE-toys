import {
  useRef,
  useState,
  useEffect,
} from "react";

import {
  getCatalogItems,
} from "../../services/api";

import ProductCard from "./ProductCard";

import "../../css/FeaturedProducts.css";

function FeaturedProducts() {
  const slider =
    useRef();

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    canScrollLeft,
    setCanScrollLeft,
  ] = useState(false);

  const [
    canScrollRight,
    setCanScrollRight,
  ] = useState(false);

  useEffect(() => {
    getCatalogItems()
      .then((data) => {
        setProducts(
          data.filter(
            (p) =>
              p.destacado ===
                true &&
              p.activo !== false
          )
        );
      })
      .catch((err) =>
        console.error(
          "Error al cargar destacados:",
          err
        )
      )
      .finally(() =>
        setLoading(false)
      );
  }, []);

  function updateScrollState() {
    const container =
      slider.current;

    if (!container) return;

    const maxScroll =
      container.scrollWidth -
      container.clientWidth;

    setCanScrollLeft(
      container.scrollLeft >
        2
    );

    setCanScrollRight(
      container.scrollLeft <
        maxScroll - 2
    );
  }

  useEffect(() => {
    const container =
      slider.current;

    if (!container) return;

    updateScrollState();

    container.addEventListener(
      "scroll",
      updateScrollState
    );

    window.addEventListener(
      "resize",
      updateScrollState
    );

    return () => {
      container.removeEventListener(
        "scroll",
        updateScrollState
      );

      window.removeEventListener(
        "resize",
        updateScrollState
      );
    };
  }, [products]);

  function move(direction) {
    const container =
      slider.current;

    if (!container) return;

    const firstItem =
      container.querySelector(
        ".featured-item"
      );

    if (!firstItem) return;

    const gap =
      parseFloat(
        getComputedStyle(
          container
        ).columnGap ||
          getComputedStyle(
            container
          ).gap ||
          0
      );

    const step =
      firstItem.getBoundingClientRect()
        .width + gap;

    container.scrollBy({
      left:
        direction * step,
      behavior:
        "smooth",
    });
  }

  if (loading) {
    return (
      <p>
        Cargando productos...
      </p>
    );
  }

  if (
    products.length ===
    0
  ) {
    return null;
  }

  return (
    <section className="featured">

      <h2>
        Productos destacados
      </h2>

      <div className="featured-wrapper">

        <button
          className="arrow"
          onClick={() =>
            move(-1)
          }
          disabled={
            !canScrollLeft
          }
        >
          ❮
        </button>

        <div
          className="featured-products"
          ref={slider}
        >
          {products.map(
            (product) => (
              <div
                className="featured-item"
                key={`${product.type}-${product.id}`}
              >
                <ProductCard
                  product={
                    product
                  }
                />
              </div>
            )
          )}
        </div>

        <button
          className="arrow"
          onClick={() =>
            move(1)
          }
          disabled={
            !canScrollRight
          }
        >
          ❯
        </button>

      </div>

    </section>
  );
}

export default FeaturedProducts;