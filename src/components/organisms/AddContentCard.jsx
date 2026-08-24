import { useState } from "react";
import { createPortal } from "react-dom";
import { uploadImages } from "../../services/uploadService";
import "../../css/EditableCard.css";

// Tarjeta "+" para agregar un nuevo item (marca, regalo, banner)
// desde el admin. Usa el mismo formulario visual que EditableCard.

function AddContentCard({
  camposTexto = "titulo",
  onCreate,
  className = "",
}) {
  const [abierto, setAbierto] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [creando, setCreando] = useState(false);
  const [urlImagen, setUrlImagen] = useState("");

  const [draft, setDraft] = useState({
    imagen: "",
    titulo: "",
    subtitulo: "",
    link: "",
  });

  function abrir() {
    setDraft({
      imagen: "",
      titulo: "",
      subtitulo: "",
      link: "",
    });
    setUrlImagen("");
    setAbierto(true);
  }

  function usarUrlImagen() {
    const url = urlImagen.trim();

    if (!url) {
      return;
    }

    setDraft((prev) => ({
      ...prev,
      imagen: url,
    }));

    setUrlImagen("");
  }

  async function handleImagenChange(e) {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }

    setSubiendo(true);

    try {
      const urls = await uploadImages(files);

      setDraft((prev) => ({
        ...prev,
        imagen: urls[0],
      }));
    } catch (err) {
      alert(err.message);
    } finally {
      setSubiendo(false);
      e.target.value = "";
    }
  }

  async function crear() {
    if (!draft.imagen) {
      alert("Falta la imagen");
      return;
    }

    setCreando(true);

    try {
      await onCreate(draft);
      setAbierto(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setCreando(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={`add-content-card ${className}`}
        onClick={abrir}
      >
        <span>+</span>
        Agregar
      </button>

      {abierto &&
        createPortal(
          <div
            className="editable-card-overlay"
            onClick={() => setAbierto(false)}
          >
            <div
              className="editable-card-form"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <h4>Nuevo</h4>

              {draft.imagen && (
                <div className="editable-card-preview">
                  <img
                    src={draft.imagen}
                    alt=""
                  />
                </div>
              )}

              <label className="editable-card-upload">
                {subiendo
                  ? "Subiendo..."
                  : "Subir imagen"}

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={subiendo}
                  onChange={
                    handleImagenChange
                  }
                />
              </label>

              <div className="editable-card-url-row">
                <input
                  type="text"
                  placeholder="O pega una URL de imagen"
                  value={urlImagen}
                  onChange={(e) =>
                    setUrlImagen(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={usarUrlImagen}
                >
                  Usar
                </button>
              </div>

              {(camposTexto === "titulo" ||
                camposTexto ===
                  "tituloYSubtitulo") && (
                <input
                  type="text"
                  placeholder="Título"
                  value={draft.titulo}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      titulo: e.target.value,
                    })
                  }
                />
              )}

              {camposTexto ===
                "tituloYSubtitulo" && (
                <input
                  type="text"
                  placeholder="Subtítulo"
                  value={draft.subtitulo}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      subtitulo:
                        e.target.value,
                    })
                  }
                />
              )}

              {camposTexto !== "ninguno" && (
                <input
                  type="text"
                  placeholder="Link (ej: /productos?categoria=mattel)"
                  value={draft.link}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      link: e.target.value,
                    })
                  }
                />
              )}

              <div className="editable-card-actions">
                <button
                  type="button"
                  onClick={() =>
                    setAbierto(false)
                  }
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="editable-card-save"
                  disabled={
                    creando || subiendo
                  }
                  onClick={crear}
                >
                  {creando
                    ? "Creando..."
                    : "Crear"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default AddContentCard;