import mapaZonasEnvio from "../../assets/mapa-zonas-envio.jpeg";

const SECCIONES = [
  {
    color: "#E94F37",
    titulo: "1. Tiempos de Despacho",
    texto:
      "Los pedidos se procesan y preparan para su envío en un plazo de 24 a 48 horas hábiles. Los tiempos de entrega varían según la región y comuna de destino.",
  },
  {
    color: "#FFC93C",
    titulo: "2. Costos de Envío",
    texto:
      "El valor del despacho se calcula automáticamente en el checkout al ingresar tu dirección exacta según las tarifas vigentes del courier. Las compras sobre $49.990 tienen envío gratis.",
  },
  {
    color: "#3AA655",
    titulo: "4. Envíos fuera de Santiago",
    texto:
      "Para el resto de Chile hacemos despacho a través de Bluexpress, Starken o Chilexpress, todos pagados directamente al recibir el pedido.",
  },
  {
    color: "#7B5EA7",
    titulo: "5. Retiro en Sede",
    texto:
      "Si tu dirección está dentro de Santiago, también puedes retirar tu pedido directamente en nuestra sede, sin costo de envío: Heraldo Latorre 974, Pudahuel.",
  },
  {
    color: "#2E86AB",
    titulo: "6. Seguimiento",
    texto:
      "Una vez que tu pedido sea despachado, recibirás la información necesaria para realizar el seguimiento del paquete hasta la puerta de tu casa.",
  },
];

export default function ShippingPolicy() {
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
        .qs-cat-grid { display: grid; gap: 18px; margin: 0 0 28px; }
        .qs-cat-card {
          background: #fff;
          border-radius: 16px;
          padding: 22px 24px;
          box-shadow: 0 4px 14px rgba(0,0,0,.06);
          border-left: 6px solid var(--cat-color);
        }
        .qs-cat-card h2 {
          font-family: 'Baloo 2', 'Trebuchet MS', sans-serif;
          font-weight: 600;
          font-size: 21px;
          margin: 0 0 8px;
          color: var(--cat-color);
        }
        .qs-cat-card p {
          margin: 0;
          font-size: 15px;
          line-height: 1.7;
          color: var(--qs-ink-soft);
        }
        .qs-map-card {
          background: #fff;
          border-radius: 16px;
          padding: 22px 24px;
          box-shadow: 0 4px 14px rgba(0,0,0,.06);
          border-left: 6px solid var(--qs-blue);
          margin: 0 0 28px;
        }
        .qs-map-card h2 {
          font-family: 'Baloo 2', 'Trebuchet MS', sans-serif;
          font-weight: 600;
          font-size: 21px;
          margin: 0 0 8px;
          color: var(--qs-blue);
        }
        .qs-map-card p {
          margin: 0 0 14px;
          font-size: 15px;
          line-height: 1.7;
          color: var(--qs-ink-soft);
        }
        .qs-map-card img {
          display: block;
          max-width: 100%;
          height: auto;
          margin: 0 auto;
          border-radius: 12px;
        }
        @media (max-width: 640px) {
          .qs-blog-h1 { font-size: 30px; }
          .qs-blog-wrap { padding: 48px 20px 64px; }
        }
      `}</style>

      <div className="qs-blog-content">
        <p className="qs-blog-eyebrow">MTE Toys</p>

        <h1 className="qs-blog-h1">
          Políticas de Envío
        </h1>

        <p className="qs-blog-lede">
          Información importante sobre nuestros
          despachos a todo Chile.
        </p>

        <div className="qs-cat-grid">
          <div
            className="qs-cat-card"
            style={{ "--cat-color": SECCIONES[0].color }}
          >
            <h2>{SECCIONES[0].titulo}</h2>
            <p>{SECCIONES[0].texto}</p>
          </div>

          <div
            className="qs-cat-card"
            style={{ "--cat-color": SECCIONES[1].color }}
          >
            <h2>{SECCIONES[1].titulo}</h2>
            <p>{SECCIONES[1].texto}</p>
          </div>
        </div>

        <div className="qs-map-card">
          <h2>3. Zonas de Cobertura en Santiago</h2>
          <p>
            Dentro del Gran Santiago (comunas verdes y
            azules) trabajamos con Bluexpress y
            Starken, ambos pagados directamente al
            recibir el pedido. Las comunas verdes
            además tienen disponible Logística 360,
            con envíos en 24 horas:
          </p>
          <img
            src={mapaZonasEnvio}
            alt="Mapa de zonas de cobertura en Santiago: comunas verdes y azules"
          />
        </div>

        <div className="qs-cat-grid">
          {SECCIONES.slice(2).map((sec) => (
            <div
              key={sec.titulo}
              className="qs-cat-card"
              style={{ "--cat-color": sec.color }}
            >
              <h2>{sec.titulo}</h2>
              <p>{sec.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}