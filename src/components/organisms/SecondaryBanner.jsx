import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import {
  getSiteContent,
  createSiteContent,
  updateSiteContent,
  deleteSiteContent,
} from "../../services/siteContentService";
import EditableCard from "./EditableCard";
import AddContentCard from "./AddContentCard";
import "../../css/Banner.css";

const BANNERS_POR_DEFECTO = [
  {
    titulo: "Regalos para cada ocasión",
    subtitulo: "Descubre nuestra selección especial",
    imagen: "/banners/banner3.jpg",
    link: "",
  },
  {
    titulo: "Ofertas de temporada",
    subtitulo: "Aprovecha antes de que se acaben",
    imagen: "/banners/banner4.jpg",
    link: "",
  },
  {
    titulo: "Envíos a todo Chile",
    subtitulo: "Rápido y seguro hasta tu puerta",
    imagen: "/banners/banner5.jpg",
    link: "",
  },
  {
    titulo: "Los favoritos de siempre",
    subtitulo: "Juguetes que nunca pasan de moda",
    imagen: "/banners/banner1.jpg",
    link: "",
  },
];

function SecondaryBanner() {
  const { user } = useUser();
  const isAdmin = user?.rol === "admin";

  const [banners, setBanners] = useState(
    BANNERS_POR_DEFECTO
  );

  const [current, setCurrent] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    getSiteContent("secondaryBanner")
      .then((items) => {
        if (items && items.length > 0) {
          setBanners(items);
        }
      })
      .catch(() => {
        // Si falla, se queda con el contenido por defecto
      });
  }, []);

  useEffect(() => {
    if (pausado) {
      return;
    }

    const interval = setInterval(() => {
      setCurrent(
        (prev) => (prev + 1) % banners.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [banners.length, pausado]);

  function next() {
    setCurrent(
      (current + 1) % banners.length
    );
  }

  function previous() {
    setCurrent(
      (current - 1 + banners.length) %
        banners.length
    );
  }

  async function handleSave(banner, draft) {
    if (banner._id) {
      const actualizado = await updateSiteContent(
        banner._id,
        draft
      );

      setBanners((prev) =>
        prev.map((b) =>
          b._id === banner._id ? actualizado : b
        )
      );
    } else {
      const nuevo = await createSiteContent({
        ...draft,
        seccion: "secondaryBanner",
      });

      setBanners((prev) => [
        ...prev.filter((b) => b !== banner),
        nuevo,
      ]);
    }
  }

  async function handleDelete(banner) {
    if (banner._id) {
      await deleteSiteContent(banner._id);

      setBanners((prev) =>
        prev.filter((b) => b._id !== banner._id)
      );

      setCurrent(0);
    }
  }

  async function handleCreate(draft) {
    const nuevo = await createSiteContent({
      ...draft,
      seccion: "secondaryBanner",
    });

    setBanners((prev) => [...prev, nuevo]);
  }

  return (
    <section className="banner-slider">
      <div
        className="banner-track"
        style={{
          transform: `translateX(-${
            current * 100
          }%)`,
        }}
      >
        {banners.map((banner, index) => (
          <div
            className="banner-slide"
            key={banner._id || index}
          >
            <EditableCard
              isAdmin={isAdmin}
              imagen={banner.imagen}
              titulo={banner.titulo}
              subtitulo={banner.subtitulo}
              link={banner.link}
              camposTexto="tituloYSubtitulo"
              onSave={(draft) =>
                handleSave(banner, draft)
              }
              onDelete={
                banner._id
                  ? () => handleDelete(banner)
                  : undefined
              }
              onEditingChange={setPausado}
            >
              <img
                src={banner.imagen}
                alt={banner.titulo}
              />

              <div className="banner-text">
                <h1>{banner.titulo}</h1>
                <p>{banner.subtitulo}</p>

                <Link
                  to={
                    banner.link || "/productos"
                  }
                >
                  Ver productos
                </Link>
              </div>
            </EditableCard>
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button
            className="banner-btn left"
            onClick={previous}
          >
            ❮
          </button>

          <button
            className="banner-btn right"
            onClick={next}
          >
            ❯
          </button>

          <div className="dots">
            {banners.map((_, index) => (
              <span
                key={index}
                className={
                  index === current ? "active" : ""
                }
                onClick={() => setCurrent(index)}
              ></span>
            ))}
          </div>
        </>
      )}

      {isAdmin && (
        <div className="banner-add">
          <AddContentCard
            camposTexto="tituloYSubtitulo"
            onCreate={handleCreate}
          />
        </div>
      )}
    </section>
  );
}

export default SecondaryBanner;