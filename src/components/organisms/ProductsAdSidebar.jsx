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
import "../../css/ProductsAdSidebar.css";

// Barra lateral de imágenes verticales (tipo aviso/banner)
// junto al listado de productos. Vacía por defecto: solo
// aparece si el admin agrega alguna desde el lápiz.

function ProductsAdSidebar() {
  const { user } = useUser();
  const isAdmin = user?.rol === "admin";

  const [anuncios, setAnuncios] = useState([]);

  useEffect(() => {
    getSiteContent("productAd")
      .then((items) => {
        if (items) {
          setAnuncios(items);
        }
      })
      .catch(() => {
        // Sin anuncios, la barra queda vacía
      });
  }, []);

  async function handleSave(item, draft) {
    if (item._id) {
      const actualizado = await updateSiteContent(
        item._id,
        draft
      );

      setAnuncios((prev) =>
        prev.map((a) =>
          a._id === item._id ? actualizado : a
        )
      );
    } else {
      const nuevo = await createSiteContent({
        ...draft,
        seccion: "productAd",
      });

      setAnuncios((prev) => [
        ...prev.filter((a) => a !== item),
        nuevo,
      ]);
    }
  }

  async function handleDelete(item) {
    if (item._id) {
      await deleteSiteContent(item._id);

      setAnuncios((prev) =>
        prev.filter((a) => a._id !== item._id)
      );
    }
  }

  async function handleCreate(draft) {
    const nuevo = await createSiteContent({
      ...draft,
      seccion: "productAd",
    });

    setAnuncios((prev) => [...prev, nuevo]);
  }

  return (
    <aside className="products-ad-sidebar">
      {anuncios.map((anuncio, index) => (
        <EditableCard
          key={anuncio._id || index}
          isAdmin={isAdmin}
          imagen={anuncio.imagen}
          titulo={anuncio.titulo}
          link={anuncio.link}
          camposTexto="titulo"
          onSave={(draft) =>
            handleSave(anuncio, draft)
          }
          onDelete={() => handleDelete(anuncio)}
        >
          {anuncio.link ? (
            <Link
              to={anuncio.link}
              className="products-ad-item"
            >
              <img
                src={anuncio.imagen}
                alt={
                  anuncio.titulo || "Publicidad"
                }
              />
            </Link>
          ) : (
            <div className="products-ad-item">
              <img
                src={anuncio.imagen}
                alt={
                  anuncio.titulo || "Publicidad"
                }
              />
            </div>
          )}
        </EditableCard>
      ))}

      {isAdmin && (
        <AddContentCard
          camposTexto="titulo"
          className="products-ad-add"
          onCreate={handleCreate}
        />
      )}
    </aside>
  );
}

export default ProductsAdSidebar;