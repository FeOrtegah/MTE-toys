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
    const amount = 300;
    slider.current.scrollLeft += direction * amount;
  }

  if (loading) return <p>Cargando productos...</p>;
  if (products.length === 0) return null; // no muestra la sección si aún no hay destacados

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