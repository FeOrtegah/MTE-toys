import { request } from "./api.js";
// Pública: el cliente crea su pedido al comprar
export const createOrder = (order) =>
  request("/orders", { method: "POST", body: order });

// Protegida (cliente): pedidos del usuario logueado
export const getMyOrders = () => request("/orders/mine", { auth: true });

// Protegidas (admin)
export const getOrders = () => request("/orders", { auth: true });
export const getOrderById = (id) => request(`/orders/${id}`, { auth: true });

export const confirmPayment = (id) =>
  request(`/orders/${id}/confirm-payment`, { method: "PATCH", auth: true });

export const cancelOrder = (id) =>
  request(`/orders/${id}/cancel`, { method: "PATCH", auth: true });

export const markAsPreparing = (id) =>
  request(`/orders/${id}/marcar-preparando`, {
    method: "PATCH",
    auth: true,
  });

export const markAsShipped = (id) =>
  request(`/orders/${id}/marcar-enviado`, {
    method: "PATCH",
    auth: true,
  });

export const hardDeleteOrder = (id) =>
  request(`/orders/${id}`, {
    method: "DELETE",
    auth: true,
  });

// Pública: la llama el cliente al hacer clic en el
// botón de WhatsApp en la página de transferencia
export const markWhatsappNotified = (id) =>
  request(`/orders/${id}/aviso-whatsapp`, {
    method: "PATCH",
  });