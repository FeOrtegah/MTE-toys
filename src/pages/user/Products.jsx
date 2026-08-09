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
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

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

  function limpiarFiltros() {
    handleCategoryClick("Todos");
    setMinPrice("");
    setMaxPrice("");
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "Todos" || product.category === category;
    const matchesMin = minPrice === "" || product.price >= Number(minPrice);
    const matchesMax = maxPrice === "" || product.price <= Number(maxPrice);
    return matchesSearch && matchesCategory && matchesMin && matchesMax;
  });

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  return (
    <main className="products-page">
      <h1>Juguetes</h1>

      <div className="products-layout">
        <aside className="products-filters">
          <div className="filter-block">
            <h3>Categoría</h3>
            <ul className="filter-category-list">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    className={category === cat ? "active" : ""}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat === "Todos" ? "Todos" : capitalizar(cat)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-block">
            <h3>Precio</h3>
            <div className="filter-price-inputs">
              <input
                type="number"
                placeholder="Mín"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
              />
              <span>—</span>
              <input
                type="number"
                placeholder="Máx"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
              />
            </div>
          </div>

          <button className="filter-clear" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </aside>

        <section className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <p className="no-products">No hay productos que coincidan con los filtros.</p>
          )}
        </section>
      </div>
    </main>
  );
}

export default Products;