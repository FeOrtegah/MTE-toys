import Icon from "../atoms/Icon.jsx";
import visaLogo from "../../assets/Visa-Logo.png";
import mastercardLogo from "../../assets/mastercard-logo.png";
import mapaZonasEnvio from "../../assets/mapa-zonas-envio.jpeg";
import {
  COSTO_LOGISTICA_360,
  DIRECCION_SEDE,
  NOMBRES_METODO_ENVIO,
} from "../../data/comunasChile.js";

// Resumen del pedido: lista de productos, subtotal, envío,
// total y botón de pago. Recibe todo lo que necesita como
// props, no tiene estado propio.

function OrderSummary({
  cart,
  totalProductos,
  metodoEnvio,
  metodoPago,
  setMetodoPago,
  costoEnvio,
  totalFinal,
  enviando,
  onFinishOrder,
  umbralEnvioGratis,
  cupon,
  codigoCupon,
  setCodigoCupon,
  errorCupon,
  validandoCupon,
  onAplicarCupon,
  onQuitarCupon,
}) {
  const umbralTexto = (
    umbralEnvioGratis ?? 49990
  ).toLocaleString("es-CL");

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

      {/* CUPÓN */}

      {cupon ? (
        <div className="total order-coupon-applied">
          <span>
            Cupón {cupon.codigo}{" "}
            <button
              type="button"
              className="order-coupon-remove"
              onClick={onQuitarCupon}
            >
              Quitar
            </button>
          </span>

          <span>
            -${cupon.descuento.toLocaleString("es-CL")}
          </span>
        </div>
      ) : (
        <div className="order-coupon">
          <div className="order-coupon-row">
            <input
              type="text"
              placeholder="Código de descuento"
              value={codigoCupon}
              onChange={(e) =>
                setCodigoCupon(e.target.value.toUpperCase())
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAplicarCupon();
                }
              }}
              maxLength={30}
            />

            <button
              type="button"
              onClick={onAplicarCupon}
              disabled={validandoCupon}
            >
              {validandoCupon ? "..." : "Aplicar"}
            </button>
          </div>

          {errorCupon && (
            <p className="order-coupon-error">{errorCupon}</p>
          )}
        </div>
      )}

      {/* ENVÍO */}

      {metodoEnvio && (
        <div className="total">
          <span>Envío</span>

          <span>
            {metodoEnvio === "retiro_local"
              ? "Gratis"
              : metodoEnvio === "logistica360"
              ? costoEnvio === 0
                ? `Gratis (envío gratis desde $${umbralTexto})`
                : `$${COSTO_LOGISTICA_360.toLocaleString(
                    "es-CL"
                  )}`
              : `${NOMBRES_METODO_ENVIO[metodoEnvio]} por pagar`}
          </span>
        </div>
      )}

      {metodoEnvio === "retiro_local" && (
        <p className="order-pickup-address">
          <Icon name="pin" /> {DIRECCION_SEDE}
        </p>
      )}

      <div className="line"></div>

      {/* TOTAL FINAL */}

      <div className="total final">
        <span>Total</span>

        <span>
          ${totalFinal.toLocaleString("es-CL")}
        </span>
      </div>

      {/* MÉTODO DE PAGO */}

      <div className="order-payment-method">
        <label
          className={
            metodoPago === "webpay"
              ? "order-payment-option selected"
              : "order-payment-option"
          }
        >
          <input
            type="radio"
            name="metodoPago"
            value="webpay"
            checked={metodoPago === "webpay"}
            onChange={() =>
              setMetodoPago("webpay")
            }
          />
          Webpay (tarjetas)
        </label>

        <label
          className={
            metodoPago === "transferencia"
              ? "order-payment-option selected"
              : "order-payment-option"
          }
        >
          <input
            type="radio"
            name="metodoPago"
            value="transferencia"
            checked={
              metodoPago === "transferencia"
            }
            onChange={() =>
              setMetodoPago("transferencia")
            }
          />
          Transferencia bancaria
        </label>
      </div>

      <button
        type="button"
        onClick={onFinishOrder}
        disabled={enviando || cart.length === 0}
      >
        {enviando
          ? "Procesando..."
          : metodoPago === "transferencia"
          ? "Ver datos para transferir"
          : "Pagar con Webpay"}
      </button>

      {metodoPago === "webpay" && (
        <div className="checkout-card-logos">
          <img src={visaLogo} alt="Visa" />
          <img src={mastercardLogo} alt="Mastercard" />
        </div>
      )}

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