import { request } from "./api.js";

// Pública: todas las etiquetas (el frontend calcula
// cuál está vigente hoy)
export const getEtiquetas = () => request("/etiquetas");

// Admin: crear
export const createEtiqueta = (data) =>
  request("/etiquetas", {
    method: "POST",
    body: data,
    auth: true,
  });

// Admin: actualizar
export const updateEtiqueta = (id, data) =>
  request(`/etiquetas/${id}`, {
    method: "PUT",
    body: data,
    auth: true,
  });

// Admin: eliminar
export const deleteEtiqueta = (id) =>
  request(`/etiquetas/${id}`, {
    method: "DELETE",
    auth: true,
  });

// El selector de fecha del admin guarda solo "YYYY-MM-DD",
// que JS interpreta como medianoche UTC. En Chile (UTC-3)
// esa medianoche cae 3 horas ANTES de la medianoche local,
// así que una etiqueta "hasta mañana" parecía vencer 3
// horas antes de tiempo en la noche. Para evitarlo, el día
// de término se extiende hasta el final de ese día en UTC
// (24 h de margen), cubriendo cualquier huso horario en
// Chile sin acortar la vigencia real que quiso el admin.
function finDeDiaUTC(fecha) {
  const d = new Date(fecha);

  return new Date(
    Date.UTC(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate(),
      23,
      59,
      59,
      999
    )
  );
}

// Dada la lista completa de etiquetas, devuelve la que
// está vigente hoy (activa=true y dentro del rango de
// fechas). Si hay varias vigentes, se usa la más reciente
// (por fechaInicio).
export function obtenerEtiquetaVigente(etiquetas) {
  if (!Array.isArray(etiquetas) || etiquetas.length === 0) {
    return null;
  }

  const ahora = new Date();

  const vigentes = etiquetas.filter((e) => {
    if (!e.activa) return false;

    const inicio = new Date(e.fechaInicio);
    const fin = finDeDiaUTC(e.fechaFin);

    return ahora >= inicio && ahora <= fin;
  });

  if (vigentes.length === 0) return null;

  return vigentes.sort(
    (a, b) =>
      new Date(b.fechaInicio) - new Date(a.fechaInicio)
  )[0];
}
