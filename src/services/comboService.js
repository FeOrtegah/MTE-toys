import { request } from "./api.js";

export const getCombos = () =>
  request("/combos");

export const getAllCombosAdmin = () =>
  request("/combos/admin/all", {
    auth: true,
  });

export const createCombo = (data) =>
  request("/combos", {
    method: "POST",
    body: data,
    auth: true,
  });

export const updateCombo = (id, data) =>
  request(`/combos/${id}`, {
    method: "PUT",
    body: data,
    auth: true,
  });

export const deleteCombo = (id) =>
  request(`/combos/${id}`, {
    method: "DELETE",
    auth: true,
  });

export const activateCombo = (id) =>
  request(`/combos/${id}/activar`, {
    method: "PATCH",
    auth: true,
  });