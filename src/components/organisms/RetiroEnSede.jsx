import { useEffect, useState } from "react";
import Icon from "../atoms/Icon.jsx";
import { getInfoRetiro } from "../../services/orderService";
import "../../css/RetiroEnSede.css";

// Aviso para pedidos con "Retiro en sede". La dirección exacta NUNCA se
// muestra en el sitio (el soporte de la plataforma pidió quitarla): solo
// llega en el correo de confirmación. Aquí se le explica al cliente que
// debe buscarla en su correo y qué hacer si no le llega.

const WHATSAPP_NUMERO = "56950550864";

function RetiroEnSede({ pedidoId }) {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (!pedidoId) return;

    let cancelado = false;

    getInfoRetiro(pedidoId)
      .then((data) => {
        if (!cancelado && data?.retiro) setInfo(data);
      })
      .catch(() => {
        // Si falla, simplemente no se muestra el aviso
      });

    return () => {
      cancelado = true;
    };
  }, [pedidoId]);

  if (!info) return null;

  const mensaje = `Hola! Compré con retiro en sede (pedido #${info.numeroPedido}) y no me llegó el correo con la dirección.`;

  const enlaceWhatsapp = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(
    mensaje
  )}`;

  return (
    <div className="retiro-sede-card">
      <h3>
        <Icon name="pin" /> Retiro en sede
      </h3>

      <p className="retiro-sede-direccion">
        Te enviamos la dirección de retiro a tu correo.
      </p>

      <p className="retiro-sede-nota">
        Revisa tu bandeja de entrada y la carpeta de spam. Cuando
        vengas, menciona tu número de pedido{" "}
        <strong>#{info.numeroPedido}</strong> y el nombre de quien
        compró.
      </p>

      <a
        className="retiro-sede-mapa"
        href={enlaceWhatsapp}
        target="_blank"
        rel="noopener noreferrer"
      >
        ¿No te llegó? Escríbenos por WhatsApp
      </a>
    </div>
  );
}

export default RetiroEnSede;
