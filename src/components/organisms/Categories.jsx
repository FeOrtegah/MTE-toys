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

function Categories() {
  const { user } = useUser();
  const isAdmin = user?.rol === "admin";

  const [marcas, setMarcas] = useState(
    MARCAS_POR_DEFECTO
  );

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

  return (
    <section
      className="categories-section"
      id="compra-por-marca"
    >
      <h2>Conoce nuestras marcas</h2>

      <div className="categories-carousel">
        {marcas.map((marca, index) => (
          <EditableCard
            key={marca._id || index}
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
            >
              <div className="category-icon">
                <img
                  src={marca.imagen}
                  alt={`Productos ${marca.titulo}`}
                />
              </div>

              <h3>{marca.titulo}</h3>
            </Link>
          </EditableCard>
        ))}

        {isAdmin && (
          <AddContentCard
            camposTexto="titulo"
            className="category-card"
            onCreate={handleCreate}
          />
        )}
      </div>
    </section>
  );
}

export default Categories;