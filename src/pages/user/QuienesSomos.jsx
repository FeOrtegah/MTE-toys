import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import legosImg from "../../assets/quienes-somos-legos.jpg";
import estantesImg from "../../assets/quienes-somos-estantes.jpg";

const BRANDS_NOW = [
  "Baby Alive", "Barbie", "Disney", "Fisher-Price", "Harry Potter",
  "Hot Wheels", "Marvel", "Matchbox", "My Little Pony", "Nerf",
  "Peppa Pig", "PJ Masks", "Play-Doh", "Polly Pocket", "Star Wars", "Transformers",
];

const BRANDS_SOON = ["Lego", "Playmobil", "Funko Pop!", "Paw Patrol", "Pokémon", "Bluey", "Mario Bros"];

const WHY_US = [
  "Envío a domicilio en todo Chile, con seguimiento de tu pedido.",
  "Pago seguro con Webpay (Transbank), tarjetas de crédito y débito.",
  "Ficha de producto detallada: marca, edad recomendada y personaje, para que sepas exactamente qué le estás regalando.",
  "Ofertas actualizadas seguido, ideales para regalos de última hora o para aprovechar antes de fechas clave.",
];

const BLOCK_COLORS = ["#E94F37", "#FFC93C", "#2E86AB", "#3AA655", "#7B5EA7"];

export default function QuienesSomos() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
    <section ref={sectionRef} className={`qs-wrap${inView ? " qs-inview" : ""}`}>
      <style>{`
        .qs-wrap {
          --qs-bg: #FFF4DC;
          --qs-ink: #2B2140;
          --qs-ink-soft: #5B5270;
          --qs-red: #E94F37;
          --qs-yellow: #FFC93C;
          --qs-blue: #2E86AB;
          --qs-green: #3AA655;
          --qs-purple: #7B5EA7;
          display: grid;
          grid-template-columns: minmax(190px, 310px) minmax(0, 680px) minmax(190px, 310px);
          justify-content: center;
          align-items: stretch;
          column-gap: 0;
          background: var(--qs-bg);
          color: var(--qs-ink);
          font-family: 'Quicksand', 'Trebuchet MS', sans-serif;
          padding: 72px 24px 88px;
          box-sizing: border-box;
        }
        .qs-wrap * { box-sizing: border-box; }
        .qs-side { position: relative; padding-top: 24px; align-self: stretch; }
        .qs-photo {
          width: 100%;
          height: 100%;
          min-height: 480px;
          object-fit: cover;
          display: block;
        }
        .qs-side-left .qs-photo {
          object-position: 55% 32%;
          border-radius: 24px 0 0 24px;
          mask-image: linear-gradient(to right, black 0%, black 62%, transparent 96%);
          -webkit-mask-image: linear-gradient(to right, black 0%, black 62%, transparent 96%);
        }
        .qs-side-right .qs-photo {
          object-position: 32% 40%;
          border-radius: 0 24px 24px 0;
          mask-image: linear-gradient(to left, black 0%, black 62%, transparent 96%);
          -webkit-mask-image: linear-gradient(to left, black 0%, black 62%, transparent 96%);
        }
        .qs-content { min-width: 0; }
        .qs-eyebrow-none { margin: 0; }
        .qs-h2 {
          font-family: 'Baloo 2', 'Trebuchet MS', sans-serif;
          font-weight: 700;
          font-size: 40px;
          line-height: 1.1;
          margin: 0 0 18px;
          color: var(--qs-red);
        }
        .qs-lede { font-size: 17px; line-height: 1.7; margin: 0 0 34px; max-width: 62ch; }
        .qs-h3 {
          font-family: 'Baloo 2', 'Trebuchet MS', sans-serif;
          font-weight: 600;
          font-size: 24px;
          margin: 0 0 12px;
          color: var(--qs-blue);
        }
        .qs-block-text { font-size: 16px; line-height: 1.7; margin: 0 0 34px; max-width: 62ch; }
        .qs-chip-row { display: flex; flex-wrap: wrap; gap: 10px; margin: 0 0 14px; padding: 0; list-style: none; }
        .qs-chip {
          font-size: 14px;
          font-weight: 600;
          padding: 7px 16px;
          border-radius: 999px;
          color: #fff;
        }
        .qs-chip-soon {
          background: transparent;
          border: 2px dashed var(--qs-purple);
          color: var(--qs-purple);
        }
        .qs-soon-label { font-size: 14px; color: var(--qs-ink-soft); margin: 22px 0 10px; }
        .qs-insta {
          display: inline-block;
          margin: 6px 0 36px;
          font-size: 15px;
          color: var(--qs-red);
          font-weight: 600;
          text-decoration: none;
          border-bottom: 2px solid var(--qs-red);
        }
        .qs-insta:hover { opacity: .8; }
        .qs-why-list { list-style: none; margin: 0 0 30px; padding: 0; display: grid; gap: 16px; }
        .qs-why-list li { display: flex; gap: 14px; align-items: flex-start; font-size: 16px; line-height: 1.6; }
        .qs-stud {
          flex: none;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: var(--qs-yellow);
          margin-top: 3px;
          box-shadow: inset 0 -3px 0 rgba(0,0,0,.12);
        }
        .qs-close { font-size: 16px; line-height: 1.7; margin: 0 0 10px; max-width: 62ch; }
        .qs-tagline {
          font-family: 'Baloo 2', 'Trebuchet MS', sans-serif;
          font-weight: 600;
          font-size: 19px;
          color: var(--qs-green);
          margin: 0;
        }
        .qs-side { opacity: 0; transition: opacity 1s ease; }
        .qs-wrap.qs-inview .qs-side-left { opacity: 1; transition-delay: .1s; }
        .qs-wrap.qs-inview .qs-side-right { opacity: 1; transition-delay: .25s; }
        @media (prefers-reduced-motion: reduce) {
          .qs-side { transition: none; opacity: 1; }
        }
        @media (min-width: 1100px) {
          .qs-content { padding: 0 32px; }
        }
        @media (max-width: 1099px) {
          .qs-wrap { grid-template-columns: 1fr; }
          .qs-side { display: none; }
        }
        @media (max-width: 640px) {
          .qs-h2 { font-size: 32px; }
          .qs-wrap { padding: 48px 20px 64px; }
        }
      `}</style>

      <div className="qs-side qs-side-left" aria-hidden="true">
        <img className="qs-photo" src={legosImg} alt="" />
      </div>

      <div className="qs-content">
        <h2 className="qs-h2">Quiénes somos</h2>
        <p className="qs-lede">
          En MTE Toys somos una juguetería online chilena creada para que encontrar el regalo
          perfecto sea fácil, rápido y seguro. Nacimos con una idea simple: ser esa tienda de
          juguetes cerca de mí que todos buscan, pero sin salir de casa, con envío a domicilio
          a todo Chile y pago 100% seguro a través de Webpay.
        </p>

        <h3 className="qs-h3">Nuestra misión</h3>
        <p className="qs-block-text">
          Queremos que comprar el regalo ideal sea simple y entretenido. Por eso cuidamos cada
          detalle: fichas de producto claras con la marca, la edad recomendada y el personaje,
          fotos reales, stock actualizado y despacho rápido a domicilio.
        </p>

        <h3 className="qs-h3">Nuestras marcas</h3>
        <p className="qs-block-text" style={{ marginBottom: 18 }}>
          Trabajamos directamente con las marcas y franquicias clásicas que todo niño y
          coleccionista reconoce.
        </p>
        <ul className="qs-chip-row">
          {BRANDS_NOW.map((brand, i) => (
            <li key={brand} className="qs-chip" style={{ background: BLOCK_COLORS[i % BLOCK_COLORS.length] }}>
              {brand}
            </li>
          ))}
        </ul>
        <p className="qs-soon-label">Próximamente en MTE Toys</p>
        <ul className="qs-chip-row">
          {BRANDS_SOON.map((brand) => (
            <li key={brand} className="qs-chip qs-chip-soon">{brand}</li>
          ))}
        </ul>
        <a className="qs-insta" href="https://www.instagram.com/mte.toys.cl" target="_blank" rel="noreferrer">
          Síguenos en Instagram @mte.toys.cl para enterarte primero
        </a>

        <h3 className="qs-h3">¿Por qué comprar en MTE Toys?</h3>
        <ul className="qs-why-list">
          {WHY_US.map((item) => (
            <li key={item}><span className="qs-stud" />{item}</li>
          ))}
        </ul>

        <p className="qs-close">
          Muchas familias llegan buscando algo puntual, como un auto Hot Wheels específico o
          una muñeca Barbie para regalar. Pero en MTE Toys encuentran mucho más: un catálogo
          completo pensado para que la próxima vez que busques una juguetería cerca de mí, nos
          encuentres primero, sin salir de tu casa.
        </p>
        <p className="qs-tagline">MTE Toys: la juguetería online que llega hasta la puerta de tu casa.</p>
      </div>

      <div className="qs-side qs-side-right" aria-hidden="true">
        <img className="qs-photo" src={estantesImg} alt="" />
      </div>
    </section>

    <section className="qs-blog-links">
      <style>{`
        .qs-blog-links {
          background: #FFF4DC;
          padding: 0 24px 72px;
          text-align: center;
        }
        .qs-blog-links h3 {
          font-family: 'Baloo 2', 'Trebuchet MS', sans-serif;
          font-weight: 700;
          font-size: 26px;
          color: #2B2140;
          margin: 0 0 24px;
        }
        .qs-blog-cards {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
          max-width: 900px;
          margin: 0 auto;
        }
        .qs-blog-card {
          flex: 1 1 320px;
          max-width: 400px;
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          text-align: left;
          text-decoration: none;
          color: #2B2140;
          box-shadow: 0 4px 14px rgba(0,0,0,.06);
          transition: transform .2s ease;
        }
        .qs-blog-card:hover {
          transform: translateY(-4px);
        }
        .qs-blog-card span {
          display: block;
          font-family: 'Baloo 2', 'Trebuchet MS', sans-serif;
          font-weight: 600;
          font-size: 19px;
          color: #E94F37;
          margin-bottom: 8px;
        }
        .qs-blog-card p {
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          color: #5B5270;
        }
      `}</style>

      <h3>Más ideas para regalar</h3>

      <div className="qs-blog-cards">
        <Link
          to="/blog/regalar-sin-fecha"
          className="qs-blog-card"
        >
          <span>
            Regalonear no tiene que esperar una
            fecha especial
          </span>
          <p>
            Un juguete también puede ser esa
            sorpresa de un martes cualquiera.
            Descubre ideas para regalar sin
            motivo.
          </p>
        </Link>

        <Link
          to="/blog/categorias-juguetes"
          className="qs-blog-card"
        >
          <span>
            Guía de juguetes por categoría
          </span>
          <p>
            Educativos, de mesa, de rol, de
            exterior, muñecas y peluches — encuentra
            justo lo que buscas.
          </p>
        </Link>
      </div>
    </section>
    </>
  );
}