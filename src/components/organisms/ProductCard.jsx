import "../../css/ProductCard.css";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const { addToCart, cart } = useCart();

  const price = product.price
    ? product.price.toLocaleString("es-CL")
    : "0";

  const hasStock =
    product.stock !== undefined &&
    product.stock !== null &&
    product.stock > 0;

  const itemInCart = cart.find(
    (item) => item.id === product.id
  );

  const quantityInCart = itemInCart
    ? itemInCart.quantity
    : 0;

  const maxStockReached =
    hasStock &&
    quantityInCart >= product.stock;

  const canAdd =
    hasStock &&
    !maxStockReached;

  return (
    <article className="product-card">

      {product.offer && (
        <span className="offer">
          Oferta
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
        to={`/producto/${product.id}`}
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
          ${product.oldPrice.toLocaleString("es-CL")}
        </p>
      )}

      <p className="price">
        ${price}
      </p>

      {hasStock && (
        <p
          style={{
            fontSize: "13px",
            color: "#666",
            margin: "5px 0",
          }}
        >
          {maxStockReached
            ? `Máximo disponible: ${product.stock}`
            : `Stock: ${product.stock}`}
        </p>
      )}

      <button
        type="button"
        className={`add ${!canAdd ? "disabled-btn" : ""}`}
        onClick={() => {
          if (canAdd) {
            addToCart(product);
          }
        }}
        disabled={!canAdd}
      >
        {!hasStock
          ? "Sin stock"
          : maxStockReached
          ? "Stock máximo"
          : "🛒 Agregar"}
      </button>

    </article>
  );
}

export default ProductCard;