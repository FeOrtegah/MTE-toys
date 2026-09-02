import {
  useState,
  useEffect,
  useMemo,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import {
  getCatalogItems,
} from "../../services/api";

import ProductCard from "../../components/organisms/ProductCard";

import {
  useSearch,
} from "../../context/SearchContext";

import "../../css/Products.css";

function capitalizar(texto) {
  if (!texto) return "";

  return texto
    .split(" ")
    .map(
      (palabra) =>
        palabra.charAt(0).toUpperCase() +
        palabra.slice(1)
    )
    .join(" ");
}

function Products() {
  const { search } =
    useSearch();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const getMinFromUrl = () =>
    searchParams.get("min") ||
    searchParams.get("minPrice") ||
    "";

  const getMaxFromUrl = () =>
    searchParams.get("max") ||
    searchParams.get("maxPrice") ||
    "";

  const getCatFromUrl = () =>
    searchParams.get("categoria") ||
    searchParams.get("category") ||
    "Todos";

  const getOfertaFromUrl = () =>
    searchParams.get("oferta") === "1";

  const [
    category,
    setCategory,
  ] = useState(
    getCatFromUrl()
  );

  const [
    soloOferta,
    setSoloOferta,
  ] = useState(
    getOfertaFromUrl()
  );

  const [
    minPrice,
    setMinPrice,
  ] = useState(
    getMinFromUrl()
  );

  const [
    maxPrice,
    setMaxPrice,
  ] = useState(
    getMaxFromUrl()
  );

  const [
    filtersOpen,
    setFiltersOpen,
  ] = useState(false);

  // =====================================================
  // CARGAR CATÁLOGO
  // =====================================================

  useEffect(() => {
    setLoading(true);

    getCatalogItems()
      .then(setProducts)
      .catch((err) => {
        console.error(
          "Error al cargar catálogo:",
          err
        );

        setProducts([]);
      })
      .finally(() =>
        setLoading(false)
      );
  }, []);

  // =====================================================
  // SINCRONIZAR URL
  // =====================================================

  useEffect(() => {
    setCategory(
      getCatFromUrl()
    );

    setMinPrice(
      getMinFromUrl()
    );

    setMaxPrice(
      getMaxFromUrl()
    );

    setSoloOferta(
      getOfertaFromUrl()
    );
  }, [searchParams]);

  // =====================================================
  // CATEGORÍAS
  // =====================================================

  const categories =
    useMemo(() => {
      const unicas = [
        ...new Set(
          products
            .map(
              (p) => p.category
            )
            .filter(Boolean)
        ),
      ];

      return [
        "Todos",
        ...unicas,
      ];
    }, [products]);

  // =====================================================
  // URL
  // =====================================================

  function actualizarURL(
    nuevaCat,
    nuevoMin,
    nuevoMax,
    nuevaOferta
  ) {
    const params =
      new URLSearchParams();

    if (
      nuevaCat &&
      nuevaCat !== "Todos"
    ) {
      params.set(
        "categoria",
        nuevaCat
      );
    }

    if (
      nuevoMin !== "" &&
      nuevoMin !== null
    ) {
      params.set(
        "min",
        nuevoMin
      );
    }

    if (
      nuevoMax !== "" &&
      nuevoMax !== null
    ) {
      params.set(
        "max",
        nuevoMax
      );
    }

    if (nuevaOferta) {
      params.set("oferta", "1");
    }

    setSearchParams(
      params,
      {
        replace: true,
      }
    );
  }

  // =====================================================
  // FILTROS
  // =====================================================

  function handleCategoryClick(
    cat
  ) {
    setCategory(cat);

    actualizarURL(
      cat,
      minPrice,
      maxPrice,
      soloOferta
    );
  }

  function handleMinChange(e) {
    const val =
      e.target.value;

    setMinPrice(val);

    actualizarURL(
      category,
      val,
      maxPrice,
      soloOferta
    );
  }

  function handleMaxChange(e) {
    const val =
      e.target.value;

    setMaxPrice(val);

    actualizarURL(
      category,
      minPrice,
      val,
      soloOferta
    );
  }

  function handleOfertaToggle() {
    const nuevoValor = !soloOferta;

    setSoloOferta(nuevoValor);

    actualizarURL(
      category,
      minPrice,
      maxPrice,
      nuevoValor
    );
  }

  function limpiarFiltros() {
    setCategory("Todos");
    setMinPrice("");
    setMaxPrice("");
    setSoloOferta(false);

    setSearchParams({});
  }

  // =====================================================
  // FILTRAR
  // =====================================================

  const filteredProducts =
    products.filter(
      (product) => {
        const textoBusqueda =
          (
            search || ""
          ).toLowerCase();

        const nombre =
          (
            product.name ||
            ""
          ).toLowerCase();

        const descripcion =
          (
            product.description ||
            ""
          ).toLowerCase();

        const matchesSearch =
          !textoBusqueda ||
          nombre.includes(
            textoBusqueda
          ) ||
          descripcion.includes(
            textoBusqueda
          );

        const matchesCategory =
          category === "Todos" ||
          product.category ===
            category;

        const matchesOferta =
          !soloOferta ||
          Boolean(product.offer);

        const numPrice =
          Number(
            product.price
          );

        const numMin =
          minPrice !== ""
            ? Number(minPrice)
            : null;

        const numMax =
          maxPrice !== ""
            ? Number(maxPrice)
            : null;

        const matchesMin =
          numMin === null ||
          (
            !Number.isNaN(
              numPrice
            ) &&
            numPrice >=
              numMin
          );

        const matchesMax =
          numMax === null ||
          (
            !Number.isNaN(
              numPrice
            ) &&
            numPrice <=
              numMax
          );

        return (
          matchesSearch &&
          matchesCategory &&
          matchesOferta &&
          matchesMin &&
          matchesMax
        );
      }
    );

  if (loading) {
    return (
      <p>
        Cargando productos...
      </p>
    );
  }

  return (
    <main className="products-page">

      <h1>
        Juguetes
      </h1>

      <button
        className={`filter-toggle ${
          filtersOpen
            ? "open"
            : ""
        }`}
        onClick={() =>
          setFiltersOpen(
            (prev) => !prev
          )
        }
      >
        {filtersOpen
          ? "✕ Cerrar filtros"
          : "☰ Filtros"}
      </button>

      {filtersOpen && (
        <div
          className="filter-backdrop"
          onClick={() =>
            setFiltersOpen(false)
          }
        />
      )}

      <div className="products-layout">

        <aside
          className={`products-filters ${
            filtersOpen
              ? "open"
              : ""
          }`}
        >

          <div className="filter-panel-header">

            <span className="filter-handle" />

            <div className="filter-panel-title">

              <h2>
                Filtros
              </h2>

              <button
                className="filter-close"
                onClick={() =>
                  setFiltersOpen(false)
                }
              >
                ✕
              </button>

            </div>

          </div>

          <div className="filter-block">

            <h3>
              Categoría
            </h3>

            <ul className="filter-category-list">

              {categories.map(
                (cat) => (
                  <li key={cat}>

                    <button
                      className={
                        category === cat
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        handleCategoryClick(
                          cat
                        )
                      }
                    >
                      {cat ===
                      "Todos"
                        ? "Todos"
                        : capitalizar(
                            cat
                          )}
                    </button>

                  </li>
                )
              )}

            </ul>

          </div>

          <div className="filter-block">

            <label className="filter-oferta-toggle">
              <input
                type="checkbox"
                checked={soloOferta}
                onChange={
                  handleOfertaToggle
                }
              />
              🏷️ Solo productos en oferta
            </label>

          </div>

          <div className="filter-block">

            <h3>
              Precio
            </h3>

            <div className="filter-price-inputs">

              <input
                type="number"
                placeholder="Mín"
                value={minPrice}
                onChange={
                  handleMinChange
                }
                min="0"
              />

              <span>
                —
              </span>

              <input
                type="number"
                placeholder="Máx"
                value={maxPrice}
                onChange={
                  handleMaxChange
                }
                min="0"
              />

            </div>

          </div>

          <div className="filter-actions">
            <button
              className="filter-clear"
              onClick={
                limpiarFiltros
              }
            >
              Limpiar filtros
            </button>

            <button
              className="filter-apply"
              onClick={() =>
                setFiltersOpen(false)
              }
            >
              🔍 Buscar
            </button>
          </div>

        </aside>

        <section className="products-grid">

          {filteredProducts.length >
          0 ? (
            filteredProducts.map(
              (product) => (
                <ProductCard
                  key={`${product.type}-${product.id}`}
                  product={product}
                />
              )
            )
          ) : (
            <p className="no-products">
              No hay productos que
              coincidan con los
              filtros.
            </p>
          )}

        </section>

      </div>

    </main>
  );
}

export default Products;