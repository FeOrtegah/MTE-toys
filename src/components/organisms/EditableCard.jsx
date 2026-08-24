import { useState } from "react";
import { createPortal } from "react-dom";
import { uploadImages } from "../../services/uploadService";
import "../../css/EditableCard.css";

// =====================================================
// EDITABLE CARD
// =====================================================
// Envuelve cualquier tarjeta de imagen (banner, marca,
// regalo por precio). Si el usuario logueado es admin,
// muestra un botón de lápiz que abre un pequeño formulario
// para cambiar imagen/título/subtítulo/link directamente
// sobre la página.
//
// Props:
//   isAdmin       - si se muestran los controles de edición
//   imagen        - URL actual de la imagen
//   titulo        - texto principal (opcional según sección)
//   subtitulo     - texto secundario (opcional)
//   camposTexto   - qué campos de texto mostrar en el form:
//                   "titulo" | "tituloYSubtitulo" | "ninguno"
//   onSave(data)  - se llama al guardar con {imagen,titulo,subtitulo,link}
//   onDelete()    - se llama al eliminar (opcional, si no se pasa no hay botón eliminar)
//   children      - el contenido visual normal de la tarjeta

function EditableCard({
  isAdmin,
  imagen,
  titulo = "",
  subtitulo = "",
  link = "",
  camposTexto = "titulo",
  onSave,
  onDelete,
  onEditingChange,
  children,
}) {
  const [editando, setEditando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [urlImagen, setUrlImagen] = useState("");

  const [draft, setDraft] = useState({
    imagen,
    titulo,
    subtitulo,
    link,
  });

  function cerrarEdicion() {
    setEditando(false);
    setUrlImagen("");
    onEditingChange?.(false);
  }

  function abrirEdicion() {
    setDraft({ imagen, titulo, subtitulo, link });
    setUrlImagen("");
    setEditando(true);
    onEditingChange?.(true);
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

  async function guardar() {
    if (!draft.imagen) {
      alert("Falta la imagen");
      return;
    }

    setGuardando(true);

    try {
      await onSave(draft);
      cerrarEdicion();
    } catch (err) {
      alert(err.message);
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar() {
    if (!confirm("¿Eliminar este elemento?")) {
      return;
    }

    try {
      await onDelete();
      cerrarEdicion();
    } catch (err) {
      alert(err.message);
    }
  }

  if (!isAdmin) {
    return children;
  }

  return (
    <div className="editable-card-wrapper">
      {children}

      <button
        type="button"
        className="editable-card-pencil"
        onClick={abrirEdicion}
        aria-label="Editar"
      >
        ✏️
      </button>

      {editando &&
        createPortal(
          <div
            className="editable-card-overlay"
            onClick={cerrarEdicion}
          >
            <div
              className="editable-card-form"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <h4>Editar</h4>

              <div className="editable-card-preview">
                <img src={draft.imagen} alt="" />
              </div>

              <label className="editable-card-upload">
                {subiendo
                  ? "Subiendo..."
                  : "Cambiar imagen"}

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
                  onClick={cerrarEdicion}
                >
                  Cancelar
                </button>

                {onDelete && (
                  <button
                    type="button"
                    className="editable-card-delete"
                    onClick={eliminar}
                  >
                    Eliminar
                  </button>
                )}

                <button
                  type="button"
                  className="editable-card-save"
                  disabled={
                    guardando || subiendo
                  }
                  onClick={guardar}
                >
                  {guardando
                    ? "Guardando..."
                    : "Guardar"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default EditableCard;