import { request } from "./api.js";

// =========================
// TIENDA
// =========================

export const getCombos = () =>
  request("/combos");

// =========================
// ADMIN
// =========================

export const getAllCombosAdmin = () =>
  request("/combos/admin/all", {
    auth: true,
  });

// =========================
// CREAR
// =========================

export const createCombo = (data) =>
  request("/combos", {
    method: "POST",
    body: data,
    auth: true,
  });

// =========================
// EDITAR
// =========================

export const updateCombo = (id, data) =>
  request(`/combos/${id}`, {
    method: "PUT",
    body: data,
    auth: true,
  });

// =========================
// DESACTIVAR
// =========================

export const deleteCombo = (id) =>
  request(`/combos/${id}`, {
    method: "DELETE",
    auth: true,
  });

// =========================
// ACTIVAR
// =========================

export const activateCombo = (id) =>
  request(`/combos/${id}/activar`, {
    method: "PATCH",
    auth: true,
  });

// =========================
// ELIMINAR PERMANENTEMENTE
// =========================

export const hardDeleteCombo = (id) =>
  request(`/combos/${id}/permanente`, {
    method: "DELETE",
    auth: true,
  });