import "../../css/ProductCard.css";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const price = product.price.toLocaleString("es-CL");
  const hasStock = product.stock > 0;

  return (
    <article className="product-card">
      {product.offer && (
        <span className="offer">
          Oferta
        </span>
      )}

      <button className="favorite">
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

      {
        product.oldPrice && 
        <p className="old-price">
          ${product.oldPrice.toLocaleString("es-CL")}
        </p>
      }

      <p className="price">
        ${price}
      </p>

      {!hasStock && (
        <span className="out-of-stock-label" style={{ color: "red", fontSize: "0.85rem", display: "block", marginBottom: "8px" }}>
          Sin stock
        </span>
      )}

      <button
        className={`add ${!hasStock ? "disabled" : ""}`}
        onClick={() => addToCart(product)}
        disabled={!hasStock}
      >
        {hasStock ? "🛒 Agregar" : "No disponible"}
      </button>
    </article>
  );
}

export default ProductCard;