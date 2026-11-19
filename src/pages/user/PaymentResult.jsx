import Icon from "../../components/atoms/Icon.jsx";
import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CreateAccountPrompt from "../../components/organisms/CreateAccountPrompt";
import RetiroEnSede from "../../components/organisms/RetiroEnSede";
import "../../css/PaymentResult.css";

const CONTENIDO = {
  exito: {
    icono: "check-circle",
    color: "#28a745",
    titulo: "¡Pago realizado con éxito!",
    mensaje: "Tu pedido fue confirmado. Te enviaremos un correo con los detalles de tu compra.",
  },
  rechazado: {
    icono: "x-circle",
    color: "#d93025",
    titulo: "El pago fue rechazado",
    mensaje: "Transbank rechazó la transacción. Puedes intentarlo nuevamente o usar otro medio de pago.",
  },
  cancelado: {
    icono: "warning",
    color: "#e8a200",
    titulo: "Pago cancelado",
    mensaje: "Cancelaste el pago en Webpay. Tu carrito sigue guardado, puedes intentarlo de nuevo cuando quieras.",
  },
  error: {
    icono: "warning",
    color: "#e8a200",
    titulo: "Ocurrió un problema",
    mensaje: "No pudimos confirmar el estado de tu pago. Si el dinero fue descontado de tu cuenta, contáctanos.",
  },
};

function PaymentResult() {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();

  const estado = searchParams.get("estado") || "error";
  const pedido = searchParams.get("pedido");
  const info = CONTENIDO[estado] || CONTENIDO.error;

  useEffect(() => {
    if (estado === "exito") {
      clearCart();
    }
  }, [estado]);

  return (
    <main className="payment-result-page">
      <div className="payment-result-box">
        <div className="payment-result-icon" style={{ color: info.color }}>
          <Icon name={info.icono} size="1em" mono />
        </div>
        <h1>{info.titulo}</h1>
        <p>{info.mensaje}</p>

        {pedido && estado === "exito" && (
          <p className="payment-result-order">N° de pedido: {pedido}</p>
        )}

        {pedido && estado === "exito" && (
          <RetiroEnSede pedidoId={pedido} />
        )}

        {estado === "exito" && <CreateAccountPrompt />}

        <div className="payment-result-actions">
          {estado === "exito" ? (
            <>
              <Link to="/mi-cuenta/compras" className="payment-result-btn primary">
                Ver mis compras
              </Link>
              <Link to="/productos" className="payment-result-btn">
                Seguir comprando
              </Link>
            </>
          ) : (
            <>
              <Link to="/carrito" className="payment-result-btn primary">
                Volver al carrito
              </Link>
              <Link to="/" className="payment-result-btn">
                Ir al inicio
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default PaymentResult;