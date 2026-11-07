import { request } from "./api.js";

// Pública: obtener el contenido de una sección
export const getSiteContent = (seccion) =>
  request(`/site-content/${seccion}`);

// Valor por defecto si el admin nunca configuró el
// umbral de envío gratis (o mientras carga).
export const DEFAULT_UMBRAL_ENVIO_GRATIS = 49990;

// Pública: monto desde el cual el envío es gratis.
// Se guarda como un único documento SiteContent de
// seccion "shippingConfig", editable desde el admin.
export const getUmbralEnvioGratis = async () => {
  try {
    const items = await getSiteContent("shippingConfig");
    const valor = items?.[0]?.umbralEnvioGratis;

    return typeof valor === "number" && valor > 0
      ? valor
      : DEFAULT_UMBRAL_ENVIO_GRATIS;
  } catch (err) {
    console.error(
      "Error al obtener el umbral de envío gratis:",
      err
    );
    return DEFAULT_UMBRAL_ENVIO_GRATIS;
  }
};

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