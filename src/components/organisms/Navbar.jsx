import {
  Link,
} from "react-router-dom";

import {
  useState,
  useEffect,
} from "react";

import "../../css/Navbar.css";

import LogoMTE from "../../assets/LogoMTE.png";

import {
  useCart,
} from "../../context/CartContext";

import {
  useSearch,
} from "../../context/SearchContext";

import {
  useUser,
} from "../../context/UserContext";

import {
  getCatalogItems,
} from "../../services/api";

function Navbar() {
  const { cart } =
    useCart();

  const {
    search,
    setSearch,
  } = useSearch();

  const {
    user,
  } = useUser();

  const [
    allProducts,
    setAllProducts,
  ] = useState([]);

  useEffect(() => {
    getCatalogItems()
      .then(setAllProducts)
      .catch((error) => {
        console.error(
          "Error cargando catálogo para búsqueda:",
          error
        );

        setAllProducts([]);
      });
  }, []);

  const textoBusqueda =
    search.trim().toLowerCase();

  const filteredProducts =
    textoBusqueda === ""
      ? []
      : allProducts
          .filter(
            (product) => {
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

              return (
                nombre.includes(
                  textoBusqueda
                ) ||
                descripcion.includes(
                  textoBusqueda
                )
              );
            }
          )
          .slice(0, 5);

  return (
    <>
      <nav className="navbar">

        <div className="logo">
          <Link to="/">
            <img
              src={LogoMTE}
              alt="MTE Toys"
            />
          </Link>
        </div>

        <div className="search">

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Buscar juguetes..."
          />

          <button type="button">
            🔍
          </button>

          {filteredProducts.length >
            0 && (
            <div className="search-results">

              {filteredProducts.map(
                (product) => {
                  const isCombo =
                    product.type ===
                    "combo";

                  return (
                    <Link
                      key={`${product.type}-${product.id}`}
                      to={`/producto/${product.id}?tipo=${
                        isCombo
                          ? "combo"
                          : "producto"
                      }`}
                      className="search-item"
                      onClick={() =>
                        setSearch("")
                      }
                    >

                      <img
                        src={
                          product.image
                        }
                        alt={
                          product.name
                        }
                      />

                      <span>
                        {product.name}
                      </span>

                    </Link>
                  );
                }
              )}

            </div>
          )}

        </div>

        <div className="actions">

          {user?.rol ===
            "admin" && (
            <Link
              to="/admin"
              className="admin-link"
            >
              ⚙️ Admin
            </Link>
          )}

          {user ? (
            <Link
              to="/mi-cuenta"
              className="user"
            >
              👤
            </Link>
          ) : (
            <Link
              to="/login"
              className="user"
            >
              👤
            </Link>
          )}

          <Link
            to="/carrito"
            className="cart"
          >
            🛒

            <span className="cart-count">
              {cart.reduce(
                (
                  total,
                  item
                ) =>
                  total +
                  Number(
                    item.quantity ||
                      0
                  ),
                0
              )}
            </span>
          </Link>

        </div>

      </nav>

      <div className="menu">
        <Link to="/">
          Inicio
        </Link>

        <Link to="/productos">
          Juguetes
        </Link>

        <Link to="/marcas">
          Marcas
        </Link>

        <Link to="/contacto">
          Contacto
        </Link>
      </div>
    </>
  );
}

export default Navbar;