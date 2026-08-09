import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../../services/api";
import ProductCard from "../../components/organisms/ProductCard";
import { useSearch } from "../../context/SearchContext";
import "../../css/Products.css";

function capitalizar(texto) {
  return texto
    .split(" ")
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
}

function Products() {
  const { search } = useSearch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get("categoria") || "Todos");

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => console.error("Error al cargar productos:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const desdeUrl = searchParams.get("categoria");
    if (desdeUrl) setCategory(desdeUrl);
  }, [searchParams]);

  const categories = useMemo(() => {
    const unicas = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return ["Todos", ...unicas];
  }, [products]);

  function handleCategoryClick(cat) {
    setCategory(cat);
    if (cat === "Todos") {
      searchParams.delete("categoria");
    } else {
      searchParams.set("categoria", cat);
    }
    setSearchParams(searchParams);
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "Todos" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  return (
    <main className="products-page">
      <h1>Juguetes</h1>

      <div className="categories">
        {categories.map((cat) => (
          <button
            key={cat}
            className={category === cat ? "active" : ""}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat === "Todos" ? "Todos" : capitalizar(cat)}
          </button>
        ))}
      </div>

      <section className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <p className="no-products">No hay productos en esta categoría todavía.</p>
        )}
      </section>
    </main>
  );
}

export default Products;