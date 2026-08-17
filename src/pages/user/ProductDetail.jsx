import {
  useParams,
  useNavigate,
  Link,
} from "react-router-dom";

import {
  useState,
  useEffect,
} from "react";

import {
  getProductById,
} from "../../services/api";

import {
  useCart,
} from "../../context/CartContext";

import "../../css/ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    addToCart,
    cart,
  } = useCart();

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
      .catch(() => {
        setProduct(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  /*
   * Buscamos el producto en el carrito.
   *
   * Este cálculo se hace incluso mientras
   * el producto está cargando, para que todos
   * los hooks se ejecuten siempre en el mismo orden.
   */
  const itemInCart = product
    ? cart.find(
        (item) =>
          item.id === product.id &&
          (item.type === "producto" || !item.type)
      )
    : null;

  const quantityInCart = itemInCart
    ? Number(itemInCart.quantity) || 0
    : 0;

  const stock = product
    ? Number(product.stock) || 0
    : 0;

  const remainingStock = Math.max(
    0,
    stock - quantityInCart
  );

  /*
   * Ajustamos la cantidad seleccionada cuando
   * cambia el stock disponible.
   *
   * IMPORTANTE:
   * Este hook está ANTES de los return.
   */
  useEffect(() => {
    if (!product) {
      return;
    }

    if (remainingStock <= 0) {
      setQuantity(1);
      return;
    }

    setQuantity((currentQuantity) =>
      Math.min(
        currentQuantity,
        remainingStock
      )
    );
  }, [product, remainingStock]);

  /*
   * También limpiamos el estado "Agregado"
   * cuando cambiamos de producto.
   */
  useEffect(() => {
    setAdded(false);
  }, [id]);

  /*
   * A partir de aquí sí podemos hacer
   * returns condicionales porque TODOS
   * los hooks ya fueron ejecutados.
   */
  if (loading) {
    return (
      <p className="detail-status">
        Cargando producto...
      </p>
    );
  }

  if (!product) {
    return (
      <h2 className="detail-status">
        Producto no encontrado
      </h2>
    );
  }

  const images =
    product.images?.length
      ? product.images
      : [product.image];

  const hasStock = stock > 0;
  const canAdd = remainingStock > 0;

  const lowStock =
    canAdd && remainingStock <= 5;

  function handleQuantity(delta) {
    setQuantity((currentQuantity) =>
      Math.min(
        remainingStock,
        Math.max(
          1,
          currentQuantity + delta
        )
      )
    );
  }

  function handleAddToCart() {
    if (!canAdd || quantity <= 0) {
      return;
    }

    /*
     * Agregamos la cantidad seleccionada.
     *
     * El primer addToCart muestra el modal.
     * Los siguientes no vuelven a abrirlo.
     */
    for (
      let i = 0;
      i < quantity;
      i++
    ) {
      addToCart(product, {
        showModal: i === 0,
      });
    }

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  }

  return (
    <main className="product-detail-page">

      <nav className="breadcrumb">

        <Link to="/">
          Inicio
        </Link>

        <span>/</span>

        <Link to="/productos">
          Juguetes
        </Link>

        <span>/</span>

        <button
          type="button"
          onClick={() =>
            navigate(
              `/productos?categoria=${encodeURIComponent(
                product.category
              )}`
            )
          }
        >
          {product.category}
        </button>

        <span>/</span>

        <span className="current">
          {product.name}
        </span>

      </nav>

      <div className="product-detail">

        <div className="detail-gallery">

          <div className="detail-image">

            <img
              src={images[activeImage]}
              alt={product.name}
            />

          </div>

          {images.length > 1 && (
            <div className="detail-thumbnails">

              {images.map((img, index) => (
                <img
                  key={`${img}-${index}`}
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  className={
                    index === activeImage
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveImage(index)
                  }
                />
              ))}

            </div>
          )}

        </div>

        <div className="detail-info">

          <span className="detail-category">
            {product.category}
          </span>

          <h1>
            {product.name}
          </h1>

          <div className="detail-price-row">

            <h2 className="detail-price">
              $
              {Number(
                product.price || 0
              ).toLocaleString("es-CL")}
            </h2>

            {canAdd ? (
              <span
                className={`stock-badge ${
                  lowStock
                    ? "low"
                    : "ok"
                }`}
              >
                {lowStock
                  ? `¡Últimas ${remainingStock} unidades!`
                  : "En stock"}
              </span>
            ) : (
              <span className="stock-badge out">
                Sin stock
              </span>
            )}

          </div>

          <p className="detail-description">
            {product.description ||
              "Producto de excelente calidad. Ideal para regalar y disfrutar."}
          </p>

          {canAdd && (
            <div className="quantity-selector">

              <span>
                Cantidad
              </span>

              <div className="quantity-controls">

                <button
                  type="button"
                  onClick={() =>
                    handleQuantity(-1)
                  }
                  disabled={quantity <= 1}
                >
                  −
                </button>

                <span>
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    handleQuantity(1)
                  }
                  disabled={
                    quantity >= remainingStock
                  }
                >
                  +
                </button>

              </div>

            </div>
          )}

          <button
            type="button"
            className={`add-to-cart-btn ${
              added ? "added" : ""
            }`}
            onClick={handleAddToCart}
            disabled={!canAdd}
          >
            {!hasStock || !canAdd
              ? "No disponible"
              : added
              ? "✓ Agregado"
              : "🛒 Agregar al carrito"}
          </button>

          <ul className="detail-benefits">

            <li>
              🚚 Envío rápido a todo Chile
            </li>

            <li>
              🔒 Compra 100% segura
            </li>

            <li>
              ↩️ Cambios dentro de 10 días
            </li>

          </ul>

        </div>

      </div>

    </main>
  );
}

export default ProductDetail;