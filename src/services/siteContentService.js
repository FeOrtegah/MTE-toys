import { request } from "./api.js";

// Pública: obtener el contenido de una sección
export const getSiteContent = (seccion) =>
  request(`/site-content/${seccion}`);

// Admin: crear
export const createSiteContent = (data) =>
  request("/site-content", {
    method: "POST",
    body: data,
    auth: true,
  });

// Admin: actualizar
export const updateSiteContent = (id, data) =>
  request(`/site-content/${id}`, {
    method: "PUT",
    body: data,
    auth: true,
  });

// Admin: eliminar
export const deleteSiteContent = (id) =>
  request(`/site-content/${id}`, {
    method: "DELETE",
    auth: true,
  });