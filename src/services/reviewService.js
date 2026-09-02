import { request } from "./api.js";

export const getProductReviews = (tipo, producto) =>
  request(`/reviews/${tipo}/${producto}`);

export const createReview = (data) =>
  request("/reviews", {
    method: "POST",
    body: data,
    auth: true,
  });

export const deleteReview = (id) =>
  request(`/reviews/${id}`, {
    method: "DELETE",
    auth: true,
  });