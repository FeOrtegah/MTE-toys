import { useEffect, useState } from "react";

import {
  getEtiquetas,
  createEtiqueta,
  updateEtiqueta,
  deleteEtiqueta,
} from "../../services/etiquetaService";
import { invalidarCacheEtiquetas } from "../../hooks/useEtiquetaVigente";

const VACIO = {
  texto: "",
  color: "#E94F37",
  colorTexto: "#FFFFFF",
  fechaInicio: "",
  fechaFin: "",
  activa: true,
};

function hoyEnRango(e) {
  const ahora = new Date();
  return (
    e.activa &&
    ahora >= new Date(e.fechaInicio) &&
    ahora <= new Date(e.fechaFin)
  );
}

function toInputDate(fecha) {
  if (!fecha) return "";
  return new Date(fecha).toISOString().slice(0, 10);
}

// Admin: crear/editar/eliminar los cintillos
// estacionales (Ciber, Navidad, Black Week, etc.), cada
// uno con su propio rango de fechas y color de fondo.
function LabelsSection() {
  const [etiquetas, setEtiquetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);

  function cargar() {
    setLoading(true);
    getEtiquetas()
      .then(setEtiquetas)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(cargar, []);

  function startEdit(e) {
    setEditandoId(e._id);
    setForm({
      texto: e.texto,
      color: e.color,
      colorTexto: e.colorTexto || "#FFFFFF",
      fechaInicio: toInputDate(e.fechaInicio),
      fechaFin: toInputDate(e.fechaFin),
      activa: e.activa,
    });
  }

  function cancelEdit() {
    setEditandoId(null);
    setForm(VACIO);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.texto.trim() || !form.fechaInicio || !form.fechaFin) {
      alert("Completa el texto y el rango de fechas");
      return;
    }

    setGuardando(true);

    try {
      if (editandoId) {
        const actualizada = await updateEtiqueta(
          editandoId,
          form
        );
        setEtiquetas((prev) =>
          prev.map((e) =>
            e._id === editandoId ? actualizada : e
          )
        );
      } else {
        const creada = await createEtiqueta(form);
        setEtiquetas((prev) => [...prev, creada]);
      }

      invalidarCacheEtiquetas();
      cancelEdit();
    } catch (err) {
      alert(err.message);
    } finally {
      setGuardando(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar esta etiqueta?")) return;

    try {
      await deleteEtiqueta(id);
      setEtiquetas((prev) =>
        prev.filter((e) => e._id !== id)
      );
      invalidarCacheEtiquetas();
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p>Cargando etiquetas...</p>;
  if (error) return <p className="admin-error">{error}</p>;

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <h2>Etiquetas estacionales y promocionales</h2>
      </div>

      <p>
        Cintillos programados por fecha (Ciber, Navidad,
        Black Week, etc.). El que esté vigente hoy se
        muestra automáticamente en las fichas de producto.
      </p>

      <form
        onSubmit={handleSubmit}
        className="combo-form"
      >
        <input
          type="text"
          placeholder="Texto (ej: Black Week)"
          value={form.texto}
          onChange={(e) =>
            setForm({ ...form, texto: e.target.value })
          }
          required
        />

        <label>
          Fondo:{" "}
          <input
            type="color"
            value={form.color}
            onChange={(e) =>
              setForm({ ...form, color: e.target.value })
            }
          />
        </label>

        <label>
          Texto:{" "}
          <input
            type="color"
            value={form.colorTexto}
            onChange={(e) =>
              setForm({
                ...form,
                colorTexto: e.target.value,
              })
            }
          />
        </label>

        <label>
          Desde{" "}
          <input
            type="date"
            value={form.fechaInicio}
            onChange={(e) =>
              setForm({
                ...form,
                fechaInicio: e.target.value,
              })
            }
            required
          />
        </label>

        <label>
          Hasta{" "}
          <input
            type="date"
            value={form.fechaFin}
            onChange={(e) =>
              setForm({ ...form, fechaFin: e.target.value })
            }
            required
          />
        </label>

        <label>
          <input
            type="checkbox"
            checked={form.activa}
            onChange={(e) =>
              setForm({ ...form, activa: e.target.checked })
            }
          />{" "}
          Activa
        </label>

        <button type="submit" disabled={guardando}>
          {editandoId ? "Guardar cambios" : "Crear etiqueta"}
        </button>

        {editandoId && (
          <button type="button" onClick={cancelEdit}>
            Cancelar
          </button>
        )}
      </form>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Vista previa</th>
              <th>Desde</th>
              <th>Hasta</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {etiquetas.map((e) => (
              <tr key={e._id}>
                <td>
                  <span
                    style={{
                      display: "inline-block",
                      background: e.color,
                      color: e.colorTexto,
                      padding: "4px 12px",
                      borderRadius: 999,
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {e.texto}
                  </span>
                </td>
                <td>{toInputDate(e.fechaInicio)}</td>
                <td>{toInputDate(e.fechaFin)}</td>
                <td>
                  {hoyEnRango(e) ? (
                    <span className="badge-pagado">
                      Vigente hoy
                    </span>
                  ) : e.activa ? (
                    <span className="badge-pendiente">
                      Programada
                    </span>
                  ) : (
                    <span className="badge-cancelado">
                      Desactivada
                    </span>
                  )}
                </td>
                <td className="admin-actions">
                  <button
                    className="btn-editar"
                    onClick={() => startEdit(e)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-eliminar"
                    onClick={() => handleDelete(e._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {etiquetas.length === 0 && (
              <tr>
                <td colSpan={5}>
                  No hay etiquetas creadas todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default LabelsSection;
