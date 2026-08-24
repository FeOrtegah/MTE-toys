import "../../css/Policy.css";
import webpayPlusLogo from "../../assets/webpay-logo-plus.jpg";
import scotiabankLogo from "../../assets/scotiabank_logo.png";

function PaymentMethods() {
  return (
    <main className="policy-page">
      <h1>Medios de Pago</h1>
      <p className="policy-subtitle">
        Todas las formas en que puedes pagar tu compra en MTE Toys, de forma
        100% segura.
      </p>

      <section className="policy-section">
        <h2>Webpay Plus</h2>

        <img
          src={webpayPlusLogo}
          alt="Webpay Plus - Transbank"
          className="policy-image"
          style={{ maxWidth: 260 }}
        />

        <p>
          Paga con tarjetas de crédito (con opción de cuotas), Redcompra
          (débito) y prepago, con toda la seguridad de Transbank y el
          respaldo de tu banco emisor. La transacción se autentica
          directamente con tu banco, integrada al paso final del carro de
          compras — nunca ingresas los datos de tu tarjeta en nuestro
          sitio.
        </p>
      </section>

      <section className="policy-section">
        <h2>Transferencia bancaria</h2>

        <img
          src={scotiabankLogo}
          alt="Scotiabank"
          className="policy-image"
          style={{ maxWidth: 220 }}
        />

        <p>
          Para transferencias bancarias, contáctanos directamente y te
          enviaremos los datos de nuestra cuenta Scotiabank para coordinar
          tu compra.
        </p>
      </section>
    </main>
  );
}

export default PaymentMethods;