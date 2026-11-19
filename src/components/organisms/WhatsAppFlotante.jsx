import { useLocation } from "react-router-dom";
import "../../css/WhatsAppFlotante.css";

// WhatsApp Business de la tienda (formato internacional, sin "+")
const WHATSAPP_NUMERO = "56950550864";
const MENSAJE = "¡Hola MTE Toys! Tengo una consulta 🧸";

function WhatsAppFlotante() {
  const { pathname } = useLocation();

  // En el panel de administración no tiene sentido mostrarlo
  if (pathname.startsWith("/admin")) return null;

  const enlace = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(
    MENSAJE
  )}`;

  return (
    <a
      className="wsp-flotante"
      href={enlace}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatea con nosotros por WhatsApp"
    >
      <span className="wsp-flotante-logo">
        <img src="/logos_externos/whatsapp.png" alt="" />
      </span>

      <span className="wsp-flotante-texto">
        <strong>¿Dudas? ¡Chatea con nosotros!</strong>
        <small>Te respondemos por WhatsApp</small>
      </span>
    </a>
  );
}

export default WhatsAppFlotante;
