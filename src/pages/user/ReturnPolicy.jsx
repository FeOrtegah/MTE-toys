const SECCIONES = [
  {
    color: "#E94F37",
    titulo: "1. Plazo para Cambios",
    texto:
      "Cuentas con un plazo de hasta 10 días corridos a partir de la recepción de tu producto para solicitar un cambio.",
  },
  {
    color: "#FFC93C",
    titulo: "2. Condiciones del Producto",
    texto:
      "Para hacer efectivo cualquier cambio, el juguete debe encontrarse sin uso, en su envoltorio o caja original sellada, y con todas sus etiquetas y accesorios completos.",
  },
  {
    color: "#3AA655",
    titulo: "3. ¿Cómo solicitarlo?",
    texto:
      "Ponte en contacto con nosotros a través de nuestro WhatsApp o correo electrónico indicando tu número de pedido y el motivo del cambio.",
  },
];

export default function ReturnPolicy() {
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
        .qs-cat-grid { display: grid; gap: 18px; }
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
        @media (max-width: 640px) {
          .qs-blog-h1 { font-size: 30px; }
          .qs-blog-wrap { padding: 48px 20px 64px; }
        }
      `}</style>

      <div className="qs-blog-content">
        <p className="qs-blog-eyebrow">MTE Toys</p>

        <h1 className="qs-blog-h1">
          Políticas de Cambio y Garantía
        </h1>

        <p className="qs-blog-lede">
          Tu tranquilidad es nuestra prioridad en MTE
          Toys.
        </p>

        <div className="qs-cat-grid">
          {SECCIONES.map((sec) => (
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