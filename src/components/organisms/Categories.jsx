import { useEffect, useRef, useState } from "react";
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
import "../../css/Categories.css";

// Contenido por defecto (se usa mientras no haya nada
// guardado en el admin, así la sección nunca sale vacía)
const MARCAS_POR_DEFECTO = [
  {
    imagen: "/categoria_logo/clogo1.webp",
    titulo: "Mattel",
    link: "/productos?categoria=mattel",
  },
  {
    imagen: "/categoria_logo/clogo2.png",
    titulo: "Marvel",
    link: "/productos?categoria=marvel",
  },
  {
    imagen: "/categoria_logo/clogo3.png",
    titulo: "Disney",
    link: "/productos?categoria=disney",
  },
  {
    imagen: "/categoria_logo/clogo4.png",
    titulo: "Barbie",
    link: "/productos?categoria=barbie",
  },
];

// Velocidad del auto-desplazamiento, en píxeles por cuadro.
const VELOCIDAD = 0.6;

function Categories() {
  const { user } = useUser();
  const isAdmin = user?.rol === "admin";

  const [marcas, setMarcas] = useState(
    MARCAS_POR_DEFECTO
  );

  // ===================================================
  // CARRUSEL: auto-scroll + arrastre manual (mouse/dedo)
  // ===================================================
  // Se controla con JS (transform) en vez de animación CSS,
  // para poder pausar y retomar desde cualquier posición
  // cuando el usuario arrastra.

  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const arrastrandoRef = useRef(false);
  const pausadoPorHoverRef = useRef(false);
  const inicioXRef = useRef(0);
  const inicioOffsetRef = useRef(0);
  const seMovioRef = useRef(false);

  function normalizarOffset() {
    const track = trackRef.current;
    if (!track) return;

    const mitad = track.scrollWidth / 2;
    if (mitad <= 0) return;

    while (offsetRef.current <= -mitad) {
      offsetRef.current += mitad;
    }

    while (offsetRef.current > 0) {
      offsetRef.current -= mitad;
    }
  }

  function aplicarTransform() {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
    }
  }

  useEffect(() => {
    let rafId;

    function tick() {
      if (
        !arrastrandoRef.current &&
        !pausadoPorHoverRef.current
      ) {
        offsetRef.current -= VELOCIDAD;
        normalizarOffset();
        aplicarTransform();
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [marcas]);

  function iniciarArrastre(clientX) {
    arrastrandoRef.current = true;
    seMovioRef.current = false;
    inicioXRef.current = clientX;
    inicioOffsetRef.current = offsetRef.current;
  }

  function moverArrastre(clientX) {
    if (!arrastrandoRef.current) return;

    const delta = clientX - inicioXRef.current;

    if (Math.abs(delta) > 4) {
      seMovioRef.current = true;
    }

    offsetRef.current =
      inicioOffsetRef.current + delta;

    normalizarOffset();
    aplicarTransform();
  }

  function terminarArrastre() {
    arrastrandoRef.current = false;
  }

  // Mouse: el arrastre puede seguir aunque el puntero
  // salga del carrusel, por eso se escucha en document.
  function handleMouseDown(e) {
    iniciarArrastre(e.clientX);
  }

  useEffect(() => {
    function handleMouseMove(e) {
      moverArrastre(e.clientX);
    }

    function handleMouseUp() {
      terminarArrastre();
    }

    document.addEventListener(
      "mousemove",
      handleMouseMove
    );
    document.addEventListener(
      "mouseup",
      handleMouseUp
    );

    return () => {
      document.removeEventListener(
        "mousemove",
        handleMouseMove
      );
      document.removeEventListener(
        "mouseup",
        handleMouseUp
      );
    };
  }, []);

  // Táctil: directo sobre el carrusel.
  function handleTouchStart(e) {
    iniciarArrastre(e.touches[0].clientX);
  }

  function handleTouchMove(e) {
    moverArrastre(e.touches[0].clientX);
  }

  function handleTouchEnd() {
    terminarArrastre();
  }

  // Evita que un simple "click" al final de un arrastre
  // termine abriendo el link de la marca sin querer.
  function handleClickCapture(e) {
    if (seMovioRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  useEffect(() => {
    getSiteContent("brand")
      .then((items) => {
        if (items && items.length > 0) {
          setMarcas(items);
        }
      })
      .catch(() => {
        // Si falla, se queda con el contenido por defecto
      });
  }, []);

  async function handleSave(item, draft) {
    if (item._id) {
      const actualizado = await updateSiteContent(
        item._id,
        draft
      );

      setMarcas((prev) =>
        prev.map((m) =>
          m._id === item._id ? actualizado : m
        )
      );
    } else {
      const nuevo = await createSiteContent({
        ...draft,
        seccion: "brand",
      });

      setMarcas((prev) => [
        ...prev.filter((m) => m !== item),
        nuevo,
      ]);
    }
  }

  async function handleDelete(item) {
    if (item._id) {
      await deleteSiteContent(item._id);

      setMarcas((prev) =>
        prev.filter((m) => m._id !== item._id)
      );
    }
  }

  async function handleCreate(draft) {
    const nuevo = await createSiteContent({
      ...draft,
      seccion: "brand",
    });

    setMarcas((prev) => [...prev, nuevo]);
  }

  function renderMarca(marca, key) {
    return (
      <EditableCard
        key={key}
        isAdmin={isAdmin}
        imagen={marca.imagen}
        titulo={marca.titulo}
        link={marca.link}
        camposTexto="titulo"
        onSave={(draft) =>
          handleSave(marca, draft)
        }
        onDelete={
          marca._id
            ? () => handleDelete(marca)
            : undefined
        }
      >
        <Link
          to={marca.link || "/productos"}
          className="category-card"
          onClickCapture={handleClickCapture}
          draggable={false}
        >
          <div className="category-icon">
            <img
              src={marca.imagen}
              alt={`Productos ${marca.titulo}`}
              draggable={false}
            />
          </div>

          <h3>{marca.titulo}</h3>
        </Link>
      </EditableCard>
    );
  }

  return (
    <section
      className="categories-section"
      id="compra-por-marca"
    >
      <h2>Conoce nuestras marcas</h2>

      {/* La cinta se arma duplicando la lista de marcas
          para que el desplazamiento se vea continuo: al
          llegar a la mitad del ancho total, se reinicia
          sin que se note el salto. Se puede arrastrar con
          el mouse o el dedo en cualquier momento. */}
      <div
        className="categories-carousel"
        onMouseEnter={() => {
          pausadoPorHoverRef.current = true;
        }}
        onMouseLeave={() => {
          pausadoPorHoverRef.current = false;
        }}
      >
        <div
          className="categories-track"
          ref={trackRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {marcas.map((marca, index) =>
            renderMarca(
              marca,
              marca._id || `a-${index}`
            )
          )}

          {marcas.map((marca, index) =>
            renderMarca(
              marca,
              `dup-${marca._id || index}`
            )
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="categories-add-row">
          <AddContentCard
            camposTexto="titulo"
            className="category-card"
            onCreate={handleCreate}
          />
        </div>
      )}
    </section>
  );
}

export default Categories;