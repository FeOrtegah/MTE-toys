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

  useEffect(() => {
    getProductById(id)
      .then((p) => {
        setProduct(p);
        setActiveImage(0);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Cargando producto...</p>;
  if (!product) return <h2>Producto no encontrado</h2>;

  const images = product.images?.length ? product.images : [product.image];

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
        <h1>{product.name}</h1>
        <p className="detail-category">{product.category}</p>
        <h2>${product.price.toLocaleString("es-CL")}</h2>
        <p>{product.description || "Producto de excelente calidad. Ideal para regalar y disfrutar."}</p>
        <button onClick={() => addToCart(product)}>🛒 Agregar al carrito</button>
      </div>
    </main>
  );
}

export default ProductDetail;