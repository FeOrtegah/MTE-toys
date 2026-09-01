import webpayPlusLogo from "../../assets/webpay-logo-plus.jpg";
import scotiabankLogo from "../../assets/scotiabank_logo.png";

export default function PaymentMethods() {
  return (
    <section className="qs-wrap qs-blog-wrap">
      <style>{`
        .qs-blog-wrap {
          --qs-bg: #FFF4DC;
          --qs-ink: #2B2140;
          --qs-ink-soft: #5B5270;
          --qs-red: #E94F37;
          --qs-yellow: #FFC93C;
          --qs-blue: #2E86AB;
          --qs-green: #3AA655;
          --qs-purple: #7B5EA7;
          display: block;
          background: var(--qs-bg);
          color: var(--qs-ink);
          font-family: 'Quicksand', 'Trebuchet MS', sans-serif;
          padding: 72px 24px 88px;
          box-sizing: border-box;
        }
        .qs-blog-wrap * { box-sizing: border-box; }
        .qs-blog-content { max-width: 780px; margin: 0 auto; }
        .qs-blog-eyebrow {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: .04em;
          text-transform: uppercase;
          color: var(--qs-purple);
          margin: 0 0 10px;
        }
        .qs-blog-h1 {
          font-family: 'Baloo 2', 'Trebuchet MS', sans-serif;
          font-weight: 700;
          font-size: 38px;
          line-height: 1.15;
          margin: 0 0 14px;
          color: var(--qs-red);
        }
        .qs-blog-lede {
          font-size: 17px;
          line-height: 1.7;
          margin: 0 0 34px;
          color: var(--qs-ink-soft);
        }
        .qs-pay-grid { display: grid; gap: 18px; }
        .qs-pay-card {
          background: #fff;
          border-radius: 16px;
          padding: 26px 24px;
          box-shadow: 0 4px 14px rgba(0,0,0,.06);
          border-left: 6px solid var(--cat-color);
          text-align: center;
        }
        .qs-pay-card h2 {
          font-family: 'Baloo 2', 'Trebuchet MS', sans-serif;
          font-weight: 600;
          font-size: 21px;
          margin: 0 0 16px;
          color: var(--cat-color);
        }
        .qs-pay-card img {
          display: block;
          max-width: 220px;
          height: auto;
          margin: 0 auto 18px;
        }
        .qs-pay-card p {
          margin: 0;
          font-size: 15px;
          line-height: 1.7;
          color: var(--qs-ink-soft);
          text-align: left;
        }
        @media (max-width: 640px) {
          .qs-blog-h1 { font-size: 30px; }
          .qs-blog-wrap { padding: 48px 20px 64px; }
        }
      `}</style>

      <div className="qs-blog-content">
        <p className="qs-blog-eyebrow">MTE Toys</p>

        <h1 className="qs-blog-h1">Medios de Pago</h1>

        <p className="qs-blog-lede">
          Todas las formas en que puedes pagar tu
          compra en MTE Toys, de forma 100% segura.
        </p>

        <div className="qs-pay-grid">
          <div
            className="qs-pay-card"
            style={{ "--cat-color": "#E94F37" }}
          >
            <h2>Webpay Plus</h2>

            <img
              src={webpayPlusLogo}
              alt="Webpay Plus - Transbank"
            />

            <p>
              Paga con tarjetas de crédito (con
              opción de cuotas), Redcompra (débito) y
              prepago, con toda la seguridad de
              Transbank y el respaldo de tu banco
              emisor. La transacción se autentica
              directamente con tu banco, integrada al
              paso final del carro de compras — nunca
              ingresas los datos de tu tarjeta en
              nuestro sitio.
            </p>
          </div>

          <div
            className="qs-pay-card"
            style={{ "--cat-color": "#2E86AB" }}
          >
            <h2>Transferencia bancaria</h2>

            <img
              src={scotiabankLogo}
              alt="Scotiabank"
            />

            <p>
              Para transferencias bancarias,
              contáctanos directamente y te enviaremos
              los datos de nuestra cuenta Scotiabank
              para coordinar tu compra.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}