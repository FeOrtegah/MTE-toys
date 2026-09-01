import { useEffect, useMemo, useState } from "react";
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
import "../../css/GiftsByPrice.css";

const REGALOS_POR_DEFECTO = [
  {
    titulo: "Regalos entre $1 y $10.000",
    imagen: "/regalos/regalo10.png",
    link: "/productos?min=1&max=10000",
  },
  {
    titulo: "Regalos entre $10.000 y $20.000",
    imagen: "/regalos/regalo20.png",
    link: "/productos?min=10000&max=20000",
  },
  {
    titulo: "Regalos entre $20.000 y $30.000",
    imagen: "/regalos/regalo30.png",
    link: "/productos?min=20000&max=30000",
  },
  {
    titulo: "Regalos Premium (más de $30.000)",
    imagen: "/regalos/regalo40.png",
    link: "/productos?min=30000",
  },
];

// Saca el "min" del link (?min=X&max=Y) para poder ordenar
// las tarjetas siempre de menor a mayor precio, sin importar
// el orden en que se hayan creado o editado en el admin.
function extraerMinPrecio(link) {
  try {
    const url = new URL(
      link,
      window.location.origin
    );

    const min = url.searchParams.get("min");

    return min ? Number(min) : Infinity;
  } catch {
    return Infinity;
  }
}

function GiftsByPrice() {
  const { user } = useUser();
  const isAdmin = user?.rol === "admin";

  const [regalos, setRegalos] = useState(
    REGALOS_POR_DEFECTO
  );

  const regalosOrdenados = useMemo(() => {
    return [...regalos].sort(
      (a, b) =>
        extraerMinPrecio(a.link) -
        extraerMinPrecio(b.link)
    );
  }, [regalos]);

  useEffect(() => {
    getSiteContent("giftCard")
      .then((items) => {
        if (items && items.length > 0) {
          setRegalos(items);
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

      setRegalos((prev) =>
        prev.map((r) =>
          r._id === item._id ? actualizado : r
        )
      );
    } else {
      const nuevo = await createSiteContent({
        ...draft,
        seccion: "giftCard",
      });

      setRegalos((prev) => [
        ...prev.filter((r) => r !== item),
        nuevo,
      ]);
    }
  }

  async function handleDelete(item) {
    if (item._id) {
      await deleteSiteContent(item._id);

      setRegalos((prev) =>
        prev.filter((r) => r._id !== item._id)
      );
    }
  }

  async function handleCreate(draft) {
    const nuevo = await createSiteContent({
      ...draft,
      seccion: "giftCard",
    });

    setRegalos((prev) => [...prev, nuevo]);
  }

  return (
    <section
      id="regalos-por-precio"
      className="gifts-section"
    >
      <h2 className="gifts-title">
        Regalos por Precio
      </h2>

      <div className="gifts-container">
        {regalosOrdenados.map((gift, index) => (
          <EditableCard
            key={gift._id || index}
            isAdmin={isAdmin}
            imagen={gift.imagen}
            titulo={gift.titulo}
            link={gift.link}
            camposTexto="titulo"
            onSave={(draft) =>
              handleSave(gift, draft)
            }
            onDelete={
              gift._id
                ? () => handleDelete(gift)
                : undefined
            }
          >
            <Link
              to={gift.link || "/productos"}
              className="gift-card"
            >
              <div className="gift-image-wrapper">
                <img
                  src={gift.imagen}
                  alt={gift.titulo}
                />
              </div>
              <div className="gift-content">
                <h3>{gift.titulo}</h3>
              </div>
            </Link>
          </EditableCard>
        ))}

        {isAdmin && (
          <AddContentCard
            camposTexto="titulo"
            className="gift-card"
            onCreate={handleCreate}
          />
        )}
      </div>
    </section>
  );
}

export default GiftsByPrice;