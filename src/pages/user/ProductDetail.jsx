import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProductById } from "../../services/api";
import { useCart } from "../../context/CartContext";
import "../../css/ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    getProductById(id)
      .then((p) => {
        setProduct(p);
        setActiveImage(0);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="detail-status">Cargando producto...</p>;
  if (!product) return <h2 className="detail-status">Producto no encontrado</h2>;

  const images = product.images?.length ? product.images : [product.image];
  const sinStock = product.stock === 0;
  const pocoStock = product.stock > 0 && product.stock <= 5;

  function handleAddToCart() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <main className="product-detail">
      <div className="detail-image">
        <img src={images[activeImage]} alt={product.name} />

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
          {product.offer && product.oldPrice && (
            <span className="detail-old-price">${product.oldPrice.toLocaleString("es-CL")}</span>
          )}
          <span className="detail-price">${product.price.toLocaleString("es-CL")}</span>
          {product.offer && <span className="detail-offer-badge">Oferta</span>}
        </div>

        <div className={`detail-stock ${sinStock ? "sin-stock" : pocoStock ? "poco-stock" : "en-stock"}`}>
          {sinStock
            ? "Sin stock"
            : pocoStock
            ? `¡Últimas ${product.stock} unidades!`
            : `En stock (${product.stock} disponibles)`}
        </div>

        <p className="detail-description">
          {product.description || "Producto de excelente calidad. Ideal para regalar y disfrutar."}
        </p>

        <button className="detail-add-btn" onClick={handleAddToCart} disabled={sinStock}>
          {sinStock ? "No disponible" : added ? "✔ Agregado" : "🛒 Agregar al carrito"}
        </button>
      </div>
    </main>
  );
}

export default ProductDetail;