import { request } from "./api.js";

// Público (checkout, también para invitados): calcula el
// descuento sin gastar el cupón. El canje real ocurre en el
// servidor al crear el pedido.
export const validarCupon = ({ codigo, subtotal, cliente }) =>
  request("/cupones/validar", {
    method: "POST",
    body: { codigo, subtotal, cliente },
  });

// Admin
export const getCupones = () => request("/cupones", { auth: true });

export const createCupon = (data) =>
  request("/cupones", { method: "POST", body: data, auth: true });

export const createLoteCupones = (data) =>
  request("/cupones/lote", { method: "POST", body: data, auth: true });

export const updateCupon = (id, data) =>
  request(`/cupones/${id}`, { method: "PATCH", body: data, auth: true });

export const deleteCupon = (id) =>
  request(`/cupones/${id}`, { method: "DELETE", auth: true });

export const getUsosCupon = (id) =>
  request(`/cupones/${id}/usos`, { auth: true });
