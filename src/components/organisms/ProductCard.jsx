import "../../css/ProductCard.css";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const price = product.price ? product.price.toLocaleString("es-CL") : "0";
  const hasStock = product.stock !== undefined && product.stock !== null && product.stock > 0;

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

      <button
        type="button"
        className={`add ${!hasStock ? "disabled-btn" : ""}`}
        onClick={() => {
          if (hasStock) {
            addToCart(product);
          }
        }}
        disabled={!hasStock}
      >
        {hasStock ? "🛒 Agregar" : "Sin stock"}
      </button>
    </article>
  );
}

export default ProductCard;