import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { markWhatsappNotified } from "../../services/orderService";
import "../../css/Policy.css";
import "../../css/BankTransfer.css";

// Datos reales de la cuenta bancaria para transferencias.
const CUENTA = {
  titular: "Comercializadora MTE spa",
  rut: "78.418.503-6",
  banco: "Scotiabank",
  tipoCuenta: "Cuenta Corriente",
  numeroCuenta: "994404806",
  email: "ventas@mtetoys.cl",
};

// Número de WhatsApp Business de la tienda, en formato
// internacional sin "+" ni espacios (requerido por wa.me).
const WHATSAPP_NUMERO = "56950550864";

function construirMensajeWhatsapp(pedido) {
  const numeroPedido = pedido._id
    ? pedido._id.slice(-8).toUpperCase()
    : "";

  const lineasProductos = pedido.items
    .map(
      (item) =>
        `- ${item.nombre} x${item.cantidad} ($${(
          item.precioUnitario * item.cantidad
        ).toLocaleString("es-CL")})`
    )
    .join("\n");

  const mensaje = `Hola! Realicé un pedido en MTE Toys y quiero enviar el comprobante de la transferencia.

Pedido #${numeroPedido}

Productos:
${lineasProductos}

Método de envío: ${pedido.metodoEnvio || "-"}
Total transferido: $${pedido.total.toLocaleString(
    "es-CL"
  )}

(Adjunto la captura de la transferencia a continuación)`;

  return mensaje;
}

function BankTransfer() {
  const location = useLocation();
  const navigate = useNavigate();
  const pedido = location.state?.pedido;
  const [avisoEnviado, setAvisoEnviado] =
    useState(false);

  // Si alguien llega a esta página directamente (sin haber
  // pasado por el checkout), no hay datos de pedido: lo
  // mandamos de vuelta en vez de mostrar una página vacía.
  if (!pedido) {
    return (
      <main className="policy-page">
        <h1>Transferencia bancaria</h1>
        <p>
          No encontramos los datos de tu pedido. Si
          acabas de comprar, vuelve al carrito e
          inténtalo de nuevo.
        </p>

        <Link to="/carrito">Volver al carrito</Link>
      </main>
    );
  }

  const numeroPedido = pedido._id
    .slice(-8)
    .toUpperCase();

  const linkWhatsapp = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(
    construirMensajeWhatsapp(pedido)
  )}`;

  return (
    <main className="policy-page">
      <h1>¡Ya casi! Falta tu transferencia</h1>

      <p className="policy-subtitle">
        Pedido #{numeroPedido} — Total a transferir:{" "}
        <strong>
          $
          {pedido.total.toLocaleString("es-CL")}
        </strong>
      </p>

      <section className="policy-section">
        <h2>1. Transfiere a esta cuenta</h2>

        <div className="transfer-datos">
          <div>
            <span>Titular</span>
            <strong>{CUENTA.titular}</strong>
          </div>

          <div>
            <span>RUT</span>
            <strong>{CUENTA.rut}</strong>
          </div>

          <div>
            <span>Banco</span>
            <strong>{CUENTA.banco}</strong>
          </div>

          <div>
            <span>Tipo de cuenta</span>
            <strong>{CUENTA.tipoCuenta}</strong>
          </div>

          <div>
            <span>Número de cuenta</span>
            <strong>{CUENTA.numeroCuenta}</strong>
          </div>

          <div>
            <span>Email</span>
            <strong>{CUENTA.email}</strong>
          </div>

          <div className="transfer-monto">
            <span>Monto a transferir</span>
            <strong>
              $
              {pedido.total.toLocaleString(
                "es-CL"
              )}
            </strong>
          </div>
        </div>
      </section>

      <section className="policy-section">
        <h2>2. Envíanos el comprobante</h2>

        <p>
          Una vez hecha la transferencia, avísanos por
          WhatsApp y adjunta la captura de pantalla del
          comprobante. Ya te dejamos el mensaje listo
          con los datos de tu pedido, solo tienes que
          agregar la imagen.
        </p>

        <a
          href={linkWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="transfer-whatsapp-btn"
          onClick={() => {
            setAvisoEnviado(true);

            // No se espera (await): no debe demorar ni
            // bloquear la apertura de WhatsApp. Si falla,
            // no pasa nada grave, es solo un registro
            // informativo para el admin.
            markWhatsappNotified(
              pedido._id
            ).catch(() => {});
          }}
        >
          📱 Avisar por WhatsApp
        </a>

        {avisoEnviado && (
          <p className="transfer-aviso-confirmado">
            ✅ Listo, quedó registrado. Ahora solo
            adjunta la captura de tu transferencia en
            el chat que se abrió.
          </p>
        )}
      </section>

      <section className="policy-section">
        <h2>3. Confirmamos tu pedido</h2>

        <p>
          Cuando verifiquemos la transferencia,
          confirmamos tu pedido y te llega un correo de
          confirmación. Desde ahí lo preparamos para el
          despacho.
        </p>
      </section>

      <button
        type="button"
        className="transfer-volver-btn"
        onClick={() => navigate("/")}
      >
        Volver al inicio
      </button>
    </main>
  );
}

export default BankTransfer;