import { useCart } from "../../context/CartContext";
import "../../css/Cart.css";
import { Link } from "react-router-dom";

function Cart() {
  const {
    cart,
    increase,
    decrease,
    removeFromCart,
    total,
  } = useCart();

  const totalUnidades = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <main className="cart-page">
      <div className="cart-container">

        <section className="cart-list">

          <h1>
            Carro ({totalUnidades} producto
            {totalUnidades === 1 ? "" : "s"})
          </h1>

          {cart.length === 0 ? (
            <p className="cart-empty">
              Tu carrito está vacío
            </p>
          ) : (
            <div className="cart-card">

              {cart.map((item) => {

                const hasStock =
                  item.stock !== undefined &&
                  item.stock !== null;

                const maxStockReached =
                  hasStock &&
                  item.quantity >= item.stock;

                return (
                  <div
                    className="cart-item"
                    key={item.id}
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <div className="cart-item-info">

                      <h3>
                        {item.name}
                      </h3>

                      <p className="cart-item-price">
                        ${item.price.toLocaleString("es-CL")}
                      </p>

                      <div className="quantity">

                        <button
                          type="button"
                          onClick={() =>
                            decrease(item.id)
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>

                        <span>
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            increase(item.id)
                          }
                          disabled={maxStockReached}
                          title={
                            maxStockReached
                              ? `Stock máximo disponible: ${item.stock}`
                              : "Aumentar cantidad"
                          }
                        >
                          +
                        </button>

                      </div>

                      {hasStock && (
                        <p
                          style={{
                            fontSize: "13px",
                            marginTop: "6px",
                            color: maxStockReached
                              ? "#c62828"
                              : "#666",
                          }}
                        >
                          {maxStockReached
                            ? `Stock máximo disponible: ${item.stock}`
                            : `Stock disponible: ${item.stock}`}
                        </p>
                      )}

                    </div>

                    <button
                      type="button"
                      className="delete"
                      onClick={() =>
                        removeFromCart(item.id)
                      }
                      title="Eliminar"
                    >
                      ✕
                    </button>

                  </div>
                );
              })}

            </div>
          )}

        </section>

        {cart.length > 0 && (
          <aside className="cart-summary">

            <h2>
              Resumen de la compra
            </h2>

            <div className="summary-row">
              <span>
                Productos ({totalUnidades})
              </span>

              <span>
                ${total().toLocaleString("es-CL")}
              </span>
            </div>

            <div className="summary-row summary-total">
              <span>
                Total:
              </span>

              <span>
                ${total().toLocaleString("es-CL")}
              </span>
            </div>

            <Link
              to="/checkout"
              className="checkout"
            >
              Continuar compra
            </Link>

          </aside>
        )}

      </div>
    </main>
  );
}

export default Cart;