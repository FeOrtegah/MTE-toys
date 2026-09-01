import { request } from "./api.js";

export const getMyAddresses = () =>
  request("/addresses", { auth: true });

export const createAddress = (data) =>
  request("/addresses", {
    method: "POST",
    body: data,
    auth: true,
  });

export const updateAddress = (id, data) =>
  request(`/addresses/${id}`, {
    method: "PUT",
    body: data,
    auth: true,
  });

export const deleteAddress = (id) =>
  request(`/addresses/${id}`, {
    method: "DELETE",
    auth: true,
  });