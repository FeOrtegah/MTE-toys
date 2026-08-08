import { request } from "./api.js";
// Pública: el cliente crea su pedido al comprar
export const createOrder = (order) =>
  request("/orders", { method: "POST", body: order });

// Protegidas (admin)
export const getOrders = () => request("/orders", { auth: true });
export const getOrderById = (id) => request(`/orders/${id}`, { auth: true });

export const confirmPayment = (id) =>
  request(`/orders/${id}/confirm-payment`, { method: "PATCH", auth: true });

export const cancelOrder = (id) =>
  request(`/orders/${id}/cancel`, { method: "PATCH", auth: true });