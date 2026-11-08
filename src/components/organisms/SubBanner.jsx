import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import subbannersPorDefecto from "../../data/subbanners";
import {
  getSiteContent,
  createSiteContent,
  updateSiteContent,
  deleteSiteContent,
} from "../../services/siteContentService";
import EditableCard from "./EditableCard";
import AddContentCard from "./AddContentCard";
import "../../css/SubBanner.css";

// Adapta el formato viejo de subbanners.js (title/image/link)
// al formato del contenido editable (titulo/imagen/link). El
// texto de estos banners (ej: "NUEVOS LANZAMIENTOS",
// "¡ENVÍO GRATIS!") viene dibujado dentro de la imagen, así
// que no se edita como texto: el admin sube una imagen nueva
// cuando quiera cambiar el mensaje.
const SUBBANNERS_POR_DEFECTO = subbannersPorDefecto.map(
  (b) => ({
    titulo: b.title,
    imagen: b.image,
    link: b.link || "",
  })
);

function SubBanner() {
  const { user } = useUser();
  const isAdmin = user?.rol === "admin";

  const [subbanners, setSubbanners] = useState(
    SUBBANNERS_POR_DEFECTO
  );

  useEffect(() => {
    getSiteContent("subBanner")
      .then((items) => {
        if (items && items.length > 0) {
          setSubbanners(items);
        }
      })
      .catch(() => {
        // Si falla, se queda con el contenido por defecto
      });
  }, []);

  async function handleSave(subbanner, draft) {
    if (subbanner._id) {
      const actualizado = await updateSiteContent(
        subbanner._id,
        draft
      );

      setSubbanners((prev) =>
        prev.map((s) =>
          s._id === subbanner._id ? actualizado : s
        )
      );
    } else {
      const nuevo = await createSiteContent({
        ...draft,
        seccion: "subBanner",
      });

      setSubbanners((prev) => [
        ...prev.filter((s) => s !== subbanner),
        nuevo,
      ]);
    }
  }

  async function handleDelete(subbanner) {
    if (subbanner._id) {
      await deleteSiteContent(subbanner._id);

      setSubbanners((prev) =>
        prev.filter((s) => s._id !== subbanner._id)
      );
    }
  }

  async function handleCreate(draft) {
    const nuevo = await createSiteContent({
      ...draft,
      seccion: "subBanner",
    });

    setSubbanners((prev) => [...prev, nuevo]);
  }

  return (
    <section
      id="seccion-subbanners"
      className="subbanner-container"
    >
      {subbanners.map((subbanner, index) => (
        <EditableCard
          key={subbanner._id || index}
          isAdmin={isAdmin}
          imagen={subbanner.imagen}
          titulo={subbanner.titulo}
          link={subbanner.link}
          camposTexto="soloImagenYLink"
          onSave={(draft) =>
            handleSave(subbanner, draft)
          }
          onDelete={
            subbanner._id
              ? () => handleDelete(subbanner)
              : undefined
          }
        >
          <Link
            to={subbanner.link || "/productos"}
            className="subbanner-card"
          >
            <img
              src={subbanner.imagen}
              alt={subbanner.titulo || "Banner"}
            />
          </Link>
        </EditableCard>
      ))}

      {isAdmin && (
        <AddContentCard
          camposTexto="soloImagenYLink"
          className="subbanner-card"
          onCreate={handleCreate}
        />
      )}
    </section>
  );
}

export default SubBanner;
