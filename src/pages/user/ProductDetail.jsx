import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProductById } from "../../services/api";
import { useCart } from "../../context/CartContext";
import "../../css/ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then((p) => {
        setProduct(p);
        setActiveImage(0);
        setQuantity(1);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="detail-status">Cargando producto...</p>;
  if (!product) return <h2 className="detail-status">Producto no encontrado</h2>;

  const images = product.images?.length ? product.images : [product.image];
  const hasStock = product.stock > 0;
  const lowStock = hasStock && product.stock <= 5;

  function handleQuantity(delta) {
    setQuantity((q) => Math.min(product.stock, Math.max(1, q + delta)));
  }

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <main className="product-detail-page">
      <nav className="breadcrumb">
        <Link to="/">Inicio</Link>
        <span>/</span>
        <Link to="/productos">Juguetes</Link>
        <span>/</span>
        <button onClick={() => navigate(`/productos?categoria=${encodeURIComponent(product.category)}`)}>
          {product.category}
        </button>
        <span>/</span>
        <span className="current">{product.name}</span>
      </nav>

      <div className="product-detail">
        <div className="detail-gallery">
          <div className="detail-image">
            <img src={images[activeImage]} alt={product.name} />
          </div>
          {images.length > 1 && (
            <div className="detail-thumbnails">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  className={i === activeImage ? "active" : ""}
                  onClick={() => setActiveImage(i)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          <span className="detail-category">{product.category}</span>
          <h1>{product.name}</h1>

          <div className="detail-price-row">
            <h2 className="detail-price">${product.price.toLocaleString("es-CL")}</h2>
            {hasStock ? (
              <span className={`stock-badge ${lowStock ? "low" : "ok"}`}>
                {lowStock ? `¡Últimas ${product.stock} unidades!` : "En stock"}
              </span>
            ) : (
              <span className="stock-badge out">Sin stock</span>
            )}
          </div>

          <p className="detail-description">
            {product.description || "Producto de excelente calidad. Ideal para regalar y disfrutar."}
          </p>

          {hasStock && (
            <div className="quantity-selector">
              <span>Cantidad</span>
              <div className="quantity-controls">
                <button onClick={() => handleQuantity(-1)} disabled={quantity <= 1}>−</button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantity(1)} disabled={quantity >= product.stock}>+</button>
              </div>
            </div>
          )}

          <button
            className={`add-to-cart-btn ${added ? "added" : ""}`}
            onClick={handleAddToCart}
            disabled={!hasStock}
          >
            {!hasStock ? "No disponible" : added ? "✓ Agregado" : "🛒 Agregar al carrito"}
          </button>

          <ul className="detail-benefits">
            <li>🚚 Envío rápido a todo Chile</li>
            <li>🔒 Compra 100% segura</li>
            <li>↩️ Cambios dentro de 10 días</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

export default ProductDetail;