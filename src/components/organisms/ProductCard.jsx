import "../../css/ProductCard.css";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const { addToCart, cart } = useCart();

  const price =
    product.price !== undefined &&
    product.price !== null
      ? Number(product.price).toLocaleString("es-CL")
      : "0";

  const hasStock =
    product.stock !== undefined &&
    product.stock !== null &&
    Number(product.stock) > 0;

  /*
   * Buscamos solamente este producto.
   *
   * Los productos normales utilizan:
   * type: "producto"
   *
   * Esto evita confundirlo con un combo que eventualmente
   * pueda tener el mismo ID.
   */
  const itemInCart = cart.find(
    (item) =>
      item.id === product.id &&
      (item.type === "producto" ||
        !item.type)
  );

  const quantityInCart = itemInCart
    ? Number(itemInCart.quantity) || 0
    : 0;

  const stock = Number(product.stock) || 0;

  /*
   * Cuánto stock queda realmente disponible
   * considerando lo que ya está en el carrito.
   */
  const remainingStock =
    Math.max(0, stock - quantityInCart);

  const maxStockReached =
    hasStock &&
    remainingStock <= 0;

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
        aria-label={`Agregar ${product.name} a favoritos`}
      >
        <img
          src="/detalles/corazon.png"
          alt=""
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

      {product.oldPrice !== undefined &&
        product.oldPrice !== null &&
        Number(product.oldPrice) > 0 && (
          <p className="old-price">
            $
            {Number(product.oldPrice).toLocaleString(
              "es-CL"
            )}
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
            ? `Máximo disponible: ${stock}`
            : `Stock disponible: ${remainingStock}`}
        </p>
      )}

      {!hasStock && (
        <p
          style={{
            fontSize: "13px",
            color: "#666",
            margin: "5px 0",
          }}
        >
          Sin unidades disponibles
        </p>
      )}

      <button
        type="button"
        className={`add ${
          !canAdd ? "disabled-btn" : ""
        }`}
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