import "../../css/ProductCard.css";

import {
  useCart,
} from "../../context/CartContext";

import {
  Link,
} from "react-router-dom";

function ProductCard({
  product,
}) {
  const {
    addToCart,
    addComboToCart,
    cart,
  } = useCart();

  const isCombo =
    product.type ===
    "combo";

  const price =
    Number(product.price || 0)
      .toLocaleString(
        "es-CL"
      );

  const hasStock =
    product.stock !==
      undefined &&
    product.stock !== null &&
    Number(product.stock) >
      0;

  const itemInCart =
    cart.find(
      (item) =>
        item.id ===
          product.id &&
        item.type ===
          (isCombo
            ? "combo"
            : "producto")
    );

  const quantityInCart =
    itemInCart
      ? itemInCart.quantity
      : 0;

  const maxStockReached =
    hasStock &&
    quantityInCart >=
      product.stock;

  const canAdd =
    hasStock &&
    !maxStockReached;

  function handleAdd() {
    if (!canAdd) return;

    if (isCombo) {
      addComboToCart(
        product
      );
    } else {
      addToCart(product);
    }
  }

  return (
    <article
      className={`product-card ${
        isCombo
          ? "combo-card"
          : ""
      }`}
    >

      {product.offer && (
        <span className="offer">
          Oferta
        </span>
      )}

      {isCombo && (
        <span className="offer combo-badge">
          Combo
        </span>
      )}

      <button
        type="button"
        className="favorite"
      >
        <img
          src="/detalles/corazon.png"
          alt="Favorito"
        />
      </button>

      <Link
        to={`/producto/${product.id}?tipo=${
          isCombo
            ? "combo"
            : "producto"
        }`}
        className="product-image"
      >
        <img
          src={product.image}
          alt={product.name}
        />
      </Link>

      <h3>
        {product.name}
      </h3>

      <div className="stars">
        ⭐⭐⭐⭐⭐
      </div>

      {product.oldPrice && (
        <p className="old-price">
          $
          {Number(
            product.oldPrice
          ).toLocaleString(
            "es-CL"
          )}
        </p>
      )}

      <p className="price">
        ${price}
      </p>

      {isCombo &&
        product.cantidadAdicional && (
          <p
            style={{
              fontSize: "13px",
              color: "#666",
              margin:
                "5px 0",
            }}
          >
            Incluye{" "}
            {product.cantidadAdicional}{" "}
            unidad
            {product.cantidadAdicional >
            1
              ? "es"
              : ""}
            {" "}adicional
            {product.cantidadAdicional >
            1
              ? "es"
              : ""}
          </p>
        )}

      {hasStock && (
        <p
          style={{
            fontSize:
              "13px",
            color:
              "#666",
            margin:
              "5px 0",
          }}
        >
          {maxStockReached
            ? `Máximo disponible: ${product.stock}`
            : `Stock: ${product.stock}`}
        </p>
      )}

      <button
        type="button"
        className={`add ${
          !canAdd
            ? "disabled-btn"
            : ""
        }`}
        onClick={
          handleAdd
        }
        disabled={!canAdd}
      >
        {!hasStock
          ? "Sin stock"
          : maxStockReached
          ? "Stock máximo"
          : isCombo
          ? "🛒 Agregar combo"
          : "🛒 Agregar"}
      </button>

    </article>
  );
}

export default ProductCard;