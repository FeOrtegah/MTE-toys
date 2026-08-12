import { useRef, useState, useEffect } from "react";
import { getProducts } from "../../services/api";
import ProductCard from "./ProductCard";
import "../../css/FeaturedProducts.css";

function FeaturedProducts() {
  const slider = useRef();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data.filter((p) => p.destacado)))
      .catch((err) => console.error("Error al cargar productos:", err))
      .finally(() => setLoading(false));
  }, []);

  function move(direction) {
    const container = slider.current;
    if (!container) return;

    const firstItem = container.querySelector(".featured-item");
    if (!firstItem) return;

    const gap = parseFloat(getComputedStyle(container).columnGap || getComputedStyle(container).gap || 0);
    const step = firstItem.getBoundingClientRect().width + gap;

    container.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  if (loading) return <p>Cargando productos...</p>;
  if (products.length === 0) return null;

  return (
    <section className="featured">
      <h2>Productos destacados</h2>

      <div className="featured-wrapper">
        <button className="arrow" onClick={() => move(-1)}>❮</button>

        <div className="featured-products" ref={slider}>
          {products.map((product) => (
            <div className="featured-item" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <button className="arrow" onClick={() => move(1)}>❯</button>
      </div>
    </section>
  );
}

export default FeaturedProducts;