import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../../services/api";
import ProductCard from "../../components/organisms/ProductCard";
import { useSearch } from "../../context/SearchContext";
import "../../css/Products.css";

function capitalizar(texto) {
  if (!texto) return "";
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

  const getMinFromUrl = () => searchParams.get("min") || searchParams.get("minPrice") || "";
  const getMaxFromUrl = () => searchParams.get("max") || searchParams.get("maxPrice") || "";
  const getCatFromUrl = () => searchParams.get("categoria") || searchParams.get("category") || "Todos";

  const [category, setCategory] = useState(getCatFromUrl());
  const [minPrice, setMinPrice] = useState(getMinFromUrl());
  const [maxPrice, setMaxPrice] = useState(getMaxFromUrl());

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => console.error("Error al cargar productos:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCategory(getCatFromUrl());
    setMinPrice(getMinFromUrl());
    setMaxPrice(getMaxFromUrl());
  }, [searchParams]);

  const categories = useMemo(() => {
    const unicas = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return ["Todos", ...unicas];
  }, [products]);

  function actualizarURL(nuevaCat, nuevoMin, nuevoMax) {
    const params = new URLSearchParams();

    if (nuevaCat && nuevaCat !== "Todos") params.set("categoria", nuevaCat);
    if (nuevoMin !== "" && nuevoMin !== null) params.set("min", nuevoMin);
    if (nuevoMax !== "" && nuevoMax !== null) params.set("max", nuevoMax);

    setSearchParams(params, { replace: true });
  }

  function handleCategoryClick(cat) {
    setCategory(cat);
    actualizarURL(cat, minPrice, maxPrice);
  }

  function handleMinChange(e) {
    const val = e.target.value;
    setMinPrice(val);
    actualizarURL(category, val, maxPrice);
  }

  function handleMaxChange(e) {
    const val = e.target.value;
    setMaxPrice(val);
    actualizarURL(category, minPrice, val);
  }

  function limpiarFiltros() {
    setCategory("Todos");
    setMinPrice("");
    setMaxPrice("");
    setSearchParams({});
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      ? product.name.toLowerCase().includes((search || "").toLowerCase())
      : true;

    const matchesCategory = category === "Todos" || product.category === category;

    const numPrice = Number(product.price);
    const numMin = minPrice !== "" ? Number(minPrice) : null;
    const numMax = maxPrice !== "" ? Number(maxPrice) : null;

    const matchesMin = numMin === null || (!isNaN(numPrice) && numPrice >= numMin);
    const matchesMax = numMax === null || (!isNaN(numPrice) && numPrice <= numMax);

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
                onChange={handleMinChange}
                min="0"
              />
              <span>—</span>
              <input
                type="number"
                placeholder="Máx"
                value={maxPrice}
                onChange={handleMaxChange}
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
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="no-products">No hay productos que coincidan con los filtros.</p>
          )}
        </section>
      </div>
    </main>
  );
}

export default Products;