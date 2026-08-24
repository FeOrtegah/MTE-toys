import visaLogo from "../../assets/Visa-Logo.png";
import mastercardLogo from "../../assets/mastercard-logo.png";
import mapaZonasEnvio from "../../assets/mapa-zonas-envio.jpeg";
import {
  COSTO_LOGISTICA_360,
  NOMBRES_METODO_ENVIO,
} from "../../data/comunasChile.js";

// Resumen del pedido: lista de productos, subtotal, envío,
// total y botón de pago. Recibe todo lo que necesita como
// props, no tiene estado propio.

function OrderSummary({
  cart,
  totalProductos,
  metodoEnvio,
  costoEnvio,
  totalFinal,
  enviando,
  onFinishOrder,
}) {
  return (
    <aside className="order">
      <h2>Resumen del pedido</h2>

      <div className="order-header">
        <span>Productos</span>

        <span>
          {cart.reduce(
            (acc, item) => acc + item.quantity,
            0
          )}
        </span>
      </div>

      {cart.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        cart.map((item) => (
          <div
            key={item.id}
            className="order-item"
          >
            <span>
              {item.name} x{item.quantity}
            </span>

            <span>
              $
              {(
                item.price * item.quantity
              ).toLocaleString("es-CL")}
            </span>
          </div>
        ))
      )}

      <div className="line"></div>

      {/* SUBTOTAL */}

      <div className="total">
        <span>Subtotal</span>

        <span>
          $
          {totalProductos.toLocaleString(
            "es-CL"
          )}
        </span>
      </div>

      {/* ENVÍO */}

      {metodoEnvio && (
        <div className="total">
          <span>Envío</span>

          <span>
            {metodoEnvio === "retiro_local"
              ? "Gratis"
              : metodoEnvio === "logistica360"
              ? costoEnvio === 0
                ? "Gratis (envío gratis desde $49.990)"
                : `$${COSTO_LOGISTICA_360.toLocaleString(
                    "es-CL"
                  )}`
              : `${NOMBRES_METODO_ENVIO[metodoEnvio]} por pagar`}
          </span>
        </div>
      )}

      <div className="line"></div>

      {/* TOTAL FINAL */}

      <div className="total final">
        <span>Total</span>

        <span>
          ${totalFinal.toLocaleString("es-CL")}
        </span>
      </div>

      <button
        type="button"
        onClick={onFinishOrder}
        disabled={enviando || cart.length === 0}
      >
        {enviando
          ? "Procesando..."
          : "Pagar con Webpay"}
      </button>

      <div className="checkout-card-logos">
        <img src={visaLogo} alt="Visa" />
        <img src={mastercardLogo} alt="Mastercard" />
      </div>

      <div className="checkout-zonas-envio">
        <p>Zonas de despacho en Santiago</p>

        <img
          src={mapaZonasEnvio}
          alt="Mapa de zonas de despacho en Santiago"
        />
      </div>
    </aside>
  );
}

export default OrderSummary;