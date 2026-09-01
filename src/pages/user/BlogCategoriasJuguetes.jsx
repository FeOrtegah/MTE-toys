import { Link } from "react-router-dom";

const CATEGORIAS = [
  {
    color: "#E94F37",
    titulo: "Juguetes didácticos y educativos",
    texto:
      "Ideales para estimular la imaginación mientras aprenden jugando: juegos didácticos, juguetes Montessori, juegos de encaje y rompecabezas infantiles. También entran aquí los juguetes sensoriales, perfectos para los más pequeños de la casa.",
  },
  {
    color: "#FFC93C",
    titulo: "Juegos de mesa",
    texto:
      "Para compartir en familia o con amigos: juegos de mesa para niños y juegos de mesa familiares como Uno, Jenga, Ludo y Catan. Una buena opción para las tardes sin pantallas.",
  },
  {
    color: "#2E86AB",
    titulo: "Juguetes de rol y simulación",
    texto:
      "Para que los peques imiten a los grandes jugando: cocinitas de juguete, herramientas de juguete, set de doctor de juguete y maquillaje para niñas.",
  },
  {
    color: "#3AA655",
    titulo: "Juguetes de exterior y movilidad",
    texto:
      "Para sacar la energía al aire libre: camiones a control remoto, autos a batería, piscinas de pelotas, camas elásticas y triciclos.",
  },
  {
    color: "#7B5EA7",
    titulo: "Muñecas y peluches",
    texto:
      "Los favoritos de siempre: muñecos articulados, peluches gigantes y casas de muñecas.",
  },
];

export default function BlogCategoriasJuguetes() {
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
        .qs-blog-content {
          max-width: 780px;
          margin: 0 auto;
        }
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
          margin: 0 0 22px;
          color: var(--qs-red);
        }
        .qs-blog-lede {
          font-size: 17px;
          line-height: 1.7;
          margin: 0 0 34px;
        }
        .qs-cat-grid {
          display: grid;
          gap: 18px;
          margin: 0 0 34px;
        }
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
        .qs-blog-p {
          font-size: 16px;
          line-height: 1.7;
          margin: 0 0 18px;
        }
        .qs-blog-back {
          display: inline-block;
          margin-top: 20px;
          font-size: 15px;
          color: var(--qs-red);
          font-weight: 600;
          text-decoration: none;
          border-bottom: 2px solid var(--qs-red);
        }
        .qs-blog-back:hover { opacity: .8; }
        @media (max-width: 640px) {
          .qs-blog-h1 { font-size: 30px; }
          .qs-blog-wrap { padding: 48px 20px 64px; }
        }
      `}</style>

      <div className="qs-blog-content">
        <p className="qs-blog-eyebrow">MTE Toys Blog</p>

        <h1 className="qs-blog-h1">
          Guía de juguetes por categoría: encuentra el
          regalo perfecto
        </h1>

        <p className="qs-blog-lede">
          Elegir un juguete a veces puede sentirse
          abrumador — tantas marcas, tantas edades,
          tantas opciones. Por eso armamos esta guía
          rápida por categoría, para que encuentres
          justo lo que estás buscando sin dar mil
          vueltas.
        </p>

        <div className="qs-cat-grid">
          {CATEGORIAS.map((cat) => (
            <div
              key={cat.titulo}
              className="qs-cat-card"
              style={{ "--cat-color": cat.color }}
            >
              <h2>{cat.titulo}</h2>
              <p>{cat.texto}</p>
            </div>
          ))}
        </div>

        <p className="qs-blog-p">
          ¿Ya sabes qué categoría buscas? Revisa
          nuestro catálogo completo y encuentra el
          regalo perfecto con envío a domicilio a todo
          Chile.
        </p>

        <Link to="/quienes-somos" className="qs-blog-back">
          ← Volver a Quiénes somos
        </Link>
      </div>
    </section>
  );
}