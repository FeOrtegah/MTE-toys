import { Link } from "react-router-dom";

export default function BlogRegalarSinFecha() {
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
          max-width: 720px;
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
        .qs-blog-h2 {
          font-family: 'Baloo 2', 'Trebuchet MS', sans-serif;
          font-weight: 600;
          font-size: 24px;
          margin: 34px 0 12px;
          color: var(--qs-blue);
        }
        .qs-blog-p {
          font-size: 16px;
          line-height: 1.7;
          margin: 0 0 18px;
        }
        .qs-blog-list {
          list-style: none;
          margin: 0 0 30px;
          padding: 0;
          display: grid;
          gap: 16px;
        }
        .qs-blog-list li {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          font-size: 16px;
          line-height: 1.6;
        }
        .qs-blog-stud {
          flex: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--qs-yellow);
          margin-top: 3px;
          box-shadow: inset 0 -3px 0 rgba(0,0,0,.12);
        }
        .qs-blog-closing {
          font-family: 'Baloo 2', 'Trebuchet MS', sans-serif;
          font-weight: 600;
          font-size: 19px;
          color: var(--qs-green);
          margin: 20px 0 0;
        }
        .qs-blog-back {
          display: inline-block;
          margin-top: 40px;
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
          Regalonear no tiene que esperar una fecha
          especial
        </h1>

        <p className="qs-blog-lede">
          Cuando pensamos en regalar un juguete, lo
          primero que se nos viene a la mente son la
          Navidad, un cumpleaños o el Día del Niño. Y
          sí, esos son momentos especiales para buscar{" "}
          <strong>regalos para cumpleaños infantil</strong>{" "}
          o los <strong>regalos Día del Niño</strong>{" "}
          más esperados. Pero, ¿por qué esperar una
          fecha en el calendario para regalonear a los
          más chicos de la casa?
        </p>

        <h2 className="qs-blog-h2">
          Un juguete puede ser cualquier día
        </h2>

        <p className="qs-blog-p">
          Un juguete no es solo un regalo de Navidad o
          de cumpleaños: también puede ser esa sorpresa
          de un martes cualquiera, el premio por un
          logro en el colegio, o simplemente una forma
          de decir "te quiero" sin motivo especial.
        </p>

        <p className="qs-blog-p">
          En MTE Toys nos encanta que las familias
          vengan por las fechas importantes, pero
          también que vuelvan solo porque sí — a darse
          el gusto de sorprender a los más chicos
          cualquier día del año.
        </p>

        <h2 className="qs-blog-h2">
          Ideas para regalar sin motivo
        </h2>

        <ul className="qs-blog-list">
          <li>
            <span className="qs-blog-stud" />
            Un pequeño premio después de una buena
            nota o un logro en el colegio.
          </li>
          <li>
            <span className="qs-blog-stud" />
            Una sorpresa de "porque sí", para alegrar
            una tarde cualquiera.
          </li>
          <li>
            <span className="qs-blog-stud" />
            Un juguete nuevo para sumar a una
            colección que ya tienen (Hot Wheels,
            Barbie, Marvel, y más).
          </li>
          <li>
            <span className="qs-blog-stud" />
            Algo simple y económico de nuestros{" "}
            <strong>juguetes en oferta</strong>, ideal
            para regalar seguido sin gastar de más.
          </li>
        </ul>

        <p className="qs-blog-p">
          En MTE Toys encuentras opciones para
          cualquier ocasión — con o sin fecha especial
          — y{" "}
          <strong>
            envío a domicilio a todo Chile
          </strong>
          .
        </p>

        <p className="qs-blog-closing">
          MTE Toys: la juguetería online que llega
          hasta la puerta de tu casa.
        </p>

        <Link to="/quienes-somos" className="qs-blog-back">
          ← Volver a Quiénes somos
        </Link>
      </div>
    </section>
  );
}