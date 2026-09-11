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
// 10 FIGURAS DISPONIBLES PARA ELEGIR
// =====================================================

const FIGURAS = [
  { clase: "figura-cuadrado", color: "#E8B84B", nombre: "Cuadrado" },
  { clase: "figura-blob", color: "#C1573F", nombre: "Blob" },
  { clase: "figura-circulo", color: "#7FA893", nombre: "Círculo" },
  { clase: "figura-hexagono", color: "#5B87A6", nombre: "Hexágono" },
  { clase: "figura-pentagono", color: "#8B6BA8", nombre: "Pentágono" },
  { clase: "figura-rombo", color: "#D98A8A", nombre: "Rombo" },
  { clase: "figura-octagono", color: "#A97C50", nombre: "Octágono" },
  { clase: "figura-blob2", color: "#4FA6A0", nombre: "Blob 2" },
  { clase: "figura-nube", color: "#E0A64E", nombre: "Nube" },
  { clase: "figura-gota", color: "#6B9BD1", nombre: "Gota" },
];

// Cuando no se eligió una figura a mano, se asigna una
// según la posición, así nunca se repite con la vecina.
function figuraPorIndice(i) {
  return FIGURAS[i % FIGURAS.length];
}

function figuraDe(rango, index) {
  if (rango.forma) {
    const encontrada = FIGURAS.find(
      (f) => f.clase === rango.forma
    );

    if (encontrada) return encontrada;
  }

  return figuraPorIndice(index);
}

// Identificador estable para saber qué tarjeta se está
// editando, incluso las que todavía no existen en la
// base de datos (los rangos por defecto no tienen _id).
function keyDe(rango, index) {
  return rango._id || `default-${index}`;
}

function SelectorFiguras({ seleccion, onSelect }) {
  return (
    <div className="gifts-age-selector-figuras">
      {FIGURAS.map((f) => (
        <button
          key={f.clase}
          type="button"
          title={f.nombre}
          className={`gifts-age-swatch ${f.clase} ${
            seleccion === f.clase ? "activa" : ""
          }`}
          style={{ backgroundColor: f.color }}
          onClick={() => onSelect(f.clase)}
        />
      ))}
    </div>
  );
}

function GiftsByAge() {
  const { user } = useUser();
  const isAdmin = user?.rol === "admin";

  const [rangos, setRangos] = useState(
    RANGOS_POR_DEFECTO
  );

  const [editandoKey, setEditandoKey] =
    useState(null);
  const [draft, setDraft] = useState(null);
  const [creando, setCreando] = useState(false);
  const [nuevoDraft, setNuevoDraft] = useState({
    titulo: "",
    edadMinima: "",
    edadMaxima: "",
    forma: "",
  });

  useEffect(() => {
    getSiteContent("ageGiftCard")
      .then(async (items) => {
        if (items && items.length > 0) {
          setRangos(items);
          return;
        }

        // Todavía no hay nada guardado: se crean los
        // rangos por defecto de verdad en la base de
        // datos (así cada uno queda con su propio _id
        // y se puede editar/eliminar como cualquier
        // otro, en vez de perderse al refrescar).
        try {
          const creados = await Promise.all(
            RANGOS_POR_DEFECTO.map((r) =>
              createSiteContent({
                ...r,
                seccion: "ageGiftCard",
              })
            )
          );

          setRangos(creados);
        } catch {
          // Si falla la creación, se queda con los
          // rangos por defecto solo en memoria.
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

  function empezarEdicion(rango, index) {
    setEditandoKey(keyDe(rango, index));
    setDraft({
      titulo: rango.titulo,
      edadMinima: rango.edadMinima ?? "",
      edadMaxima: rango.edadMaxima ?? "",
      forma: rango.forma || "",
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
      forma: draft.forma || "",
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

    setEditandoKey(null);
    setDraft(null);
  }

  async function eliminar(rango) {
    if (!rango._id) {
      // Es un rango por defecto (nunca se guardó en la
      // base de datos): solo se saca de la lista local.
      setRangos((prev) =>
        prev.filter((r) => r !== rango)
      );
      return;
    }

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
      forma: nuevoDraft.forma || "",
    });

    setRangos((prev) => [...prev, nuevo]);
    setNuevoDraft({
      titulo: "",
      edadMinima: "",
      edadMaxima: "",
      forma: "",
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
          const figura = figuraDe(rango, index);
          const key = keyDe(rango, index);
          const enEdicion = editandoKey === key;

          if (enEdicion) {
            return (
              <div
                key={key}
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

                <label className="gifts-age-selector-label">
                  Elige una figura:
                </label>

                <SelectorFiguras
                  seleccion={draft.forma}
                  onSelect={(clase) =>
                    setDraft({
                      ...draft,
                      forma: clase,
                    })
                  }
                />

                <div className="gifts-age-edit-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setEditandoKey(null);
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
            <div key={key} className="gifts-age-item">
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
                      empezarEdicion(rango, index)
                    }
                  >
                    ✏️
                  </button>

                  <button
                    type="button"
                    onClick={() => eliminar(rango)}
                  >
                    🗑️
                  </button>
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

            <label className="gifts-age-selector-label">
              Elige una figura:
            </label>

            <SelectorFiguras
              seleccion={nuevoDraft.forma}
              onSelect={(clase) =>
                setNuevoDraft({
                  ...nuevoDraft,
                  forma: clase,
                })
              }
            />

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