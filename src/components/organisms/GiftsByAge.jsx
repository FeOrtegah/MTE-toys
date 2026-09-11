import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import {
  getSiteContent,
  createSiteContent,
  updateSiteContent,
  deleteSiteContent,
} from "../../services/siteContentService";
import "../../css/GiftsByAge.css";

// =====================================================
// RANGOS POR DEFECTO (en meses, para tener una sola
// unidad). Se muestran mientras el admin no cargue los
// suyos desde el panel.
// =====================================================

const RANGOS_POR_DEFECTO = [
  { titulo: "0 - 12 meses", edadMinima: 0, edadMaxima: 12 },
  { titulo: "1 - 2 años", edadMinima: 12, edadMaxima: 24 },
  { titulo: "2 - 4 años", edadMinima: 24, edadMaxima: 48 },
  { titulo: "4 - 6 años", edadMinima: 48, edadMaxima: 72 },
  { titulo: "6 - 8 años", edadMinima: 72, edadMaxima: 96 },
  { titulo: "8 - 12 años", edadMinima: 96, edadMaxima: 144 },
  { titulo: "12 - 99 años", edadMinima: 144, edadMaxima: 1188 },
];

// =====================================================
// FIGURAS: se asignan por posición (índice), nunca a
// mano, así nunca se repite la de al lado. Si hay más
// tarjetas que figuras, se empieza a repetir el ciclo
// (no hay forma de evitarlo con figuras finitas), pero
// dos tarjetas vecinas nunca comparten la misma.
// =====================================================

const FIGURAS = [
  { clase: "figura-cuadrado", color: "#E8B84B" },
  { clase: "figura-blob", color: "#C1573F" },
  { clase: "figura-estrella", color: "#CBBE96" },
  { clase: "figura-circulo", color: "#7FA893" },
];

function figuraPorIndice(i) {
  return FIGURAS[i % FIGURAS.length];
}

function GiftsByAge() {
  const { user } = useUser();
  const isAdmin = user?.rol === "admin";

  const [rangos, setRangos] = useState(
    RANGOS_POR_DEFECTO
  );

  const [editandoId, setEditandoId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [creando, setCreando] = useState(false);
  const [nuevoDraft, setNuevoDraft] = useState({
    titulo: "",
    edadMinima: "",
    edadMaxima: "",
  });

  useEffect(() => {
    getSiteContent("ageGiftCard")
      .then((items) => {
        if (items && items.length > 0) {
          setRangos(items);
        }
      })
      .catch(() => {
        // Si falla, se queda con los rangos por defecto
      });
  }, []);

  function linkDe(rango) {
    const params = new URLSearchParams();

    if (rango.edadMinima != null) {
      params.set("edadMin", rango.edadMinima);
    }

    if (rango.edadMaxima != null) {
      params.set("edadMax", rango.edadMaxima);
    }

    return `/productos?${params.toString()}`;
  }

  function empezarEdicion(rango) {
    setEditandoId(rango._id);
    setDraft({
      titulo: rango.titulo,
      edadMinima: rango.edadMinima ?? "",
      edadMaxima: rango.edadMaxima ?? "",
    });
  }

  async function guardarEdicion(rango) {
    const payload = {
      titulo: draft.titulo.trim(),
      edadMinima:
        draft.edadMinima === ""
          ? null
          : Number(draft.edadMinima),
      edadMaxima:
        draft.edadMaxima === ""
          ? null
          : Number(draft.edadMaxima),
    };

    if (rango._id) {
      const actualizado = await updateSiteContent(
        rango._id,
        payload
      );

      setRangos((prev) =>
        prev.map((r) =>
          r._id === rango._id ? actualizado : r
        )
      );
    } else {
      const nuevo = await createSiteContent({
        ...payload,
        seccion: "ageGiftCard",
      });

      setRangos((prev) => [
        ...prev.filter((r) => r !== rango),
        nuevo,
      ]);
    }

    setEditandoId(null);
    setDraft(null);
  }

  async function eliminar(rango) {
    if (!rango._id) return;

    if (
      !confirm(
        `¿Eliminar el rango "${rango.titulo}"?`
      )
    ) {
      return;
    }

    await deleteSiteContent(rango._id);

    setRangos((prev) =>
      prev.filter((r) => r._id !== rango._id)
    );
  }

  async function crearNuevo() {
    if (!nuevoDraft.titulo.trim()) return;

    const nuevo = await createSiteContent({
      seccion: "ageGiftCard",
      titulo: nuevoDraft.titulo.trim(),
      edadMinima:
        nuevoDraft.edadMinima === ""
          ? null
          : Number(nuevoDraft.edadMinima),
      edadMaxima:
        nuevoDraft.edadMaxima === ""
          ? null
          : Number(nuevoDraft.edadMaxima),
    });

    setRangos((prev) => [...prev, nuevo]);
    setNuevoDraft({
      titulo: "",
      edadMinima: "",
      edadMaxima: "",
    });
    setCreando(false);
  }

  return (
    <section className="gifts-age-section">
      <h2 className="gifts-age-title">
        Regalos por Edad
      </h2>

      <div className="gifts-age-container">
        {rangos.map((rango, index) => {
          const figura = figuraPorIndice(index);
          const enEdicion =
            editandoId === (rango._id || rango);

          if (enEdicion) {
            return (
              <div
                key={rango._id || index}
                className="gifts-age-edit-box"
              >
                <input
                  type="text"
                  placeholder="Título (ej: 2 - 4 años)"
                  value={draft.titulo}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      titulo: e.target.value,
                    })
                  }
                />

                <div className="gifts-age-edit-row">
                  <input
                    type="number"
                    placeholder="Edad mín. (meses)"
                    value={draft.edadMinima}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        edadMinima:
                          e.target.value,
                      })
                    }
                  />

                  <input
                    type="number"
                    placeholder="Edad máx. (meses)"
                    value={draft.edadMaxima}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        edadMaxima:
                          e.target.value,
                      })
                    }
                  />
                </div>

                <div className="gifts-age-edit-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setEditandoId(null);
                      setDraft(null);
                    }}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    className="guardar"
                    onClick={() =>
                      guardarEdicion(rango)
                    }
                  >
                    Guardar
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={rango._id || index}
              className="gifts-age-item"
            >
              <Link
                to={linkDe(rango)}
                className={`gifts-age-shape ${figura.clase}`}
                style={{
                  backgroundColor: figura.color,
                }}
              >
                <span>{rango.titulo}</span>
              </Link>

              {isAdmin && (
                <div className="gifts-age-admin-actions">
                  <button
                    type="button"
                    onClick={() =>
                      empezarEdicion(rango)
                    }
                  >
                    ✏️
                  </button>

                  {rango._id && (
                    <button
                      type="button"
                      onClick={() =>
                        eliminar(rango)
                      }
                    >
                      🗑️
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {isAdmin && !creando && (
          <button
            type="button"
            className="gifts-age-add-btn"
            onClick={() => setCreando(true)}
          >
            + Agregar rango
          </button>
        )}

        {isAdmin && creando && (
          <div className="gifts-age-edit-box">
            <input
              type="text"
              placeholder="Título (ej: 2 - 4 años)"
              value={nuevoDraft.titulo}
              onChange={(e) =>
                setNuevoDraft({
                  ...nuevoDraft,
                  titulo: e.target.value,
                })
              }
            />

            <div className="gifts-age-edit-row">
              <input
                type="number"
                placeholder="Edad mín. (meses)"
                value={nuevoDraft.edadMinima}
                onChange={(e) =>
                  setNuevoDraft({
                    ...nuevoDraft,
                    edadMinima: e.target.value,
                  })
                }
              />

              <input
                type="number"
                placeholder="Edad máx. (meses)"
                value={nuevoDraft.edadMaxima}
                onChange={(e) =>
                  setNuevoDraft({
                    ...nuevoDraft,
                    edadMaxima: e.target.value,
                  })
                }
              />
            </div>

            <div className="gifts-age-edit-actions">
              <button
                type="button"
                onClick={() => setCreando(false)}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="guardar"
                onClick={crearNuevo}
              >
                Crear
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default GiftsByAge;