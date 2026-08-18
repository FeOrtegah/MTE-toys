import { request } from "./api.js";

// Inicia la transacción en Transbank para un pedido ya creado (estado "pendiente")
// accessToken: entregado una sola vez por el backend al crear el pedido,
// obligatorio para evitar que alguien inicie el pago de un pedido ajeno.
export const initWebpayTransaction = (orderId, accessToken) =>
  request("/webpay/init", {
    method: "POST",
    body: { orderId, accessToken },
  });

// Redirige al navegador al formulario de pago de Webpay.
// Webpay Plus exige que la llegada sea un POST con el campo token_ws,
// por eso se arma un <form> y se envía, no se puede hacer con fetch/redirect normal.
export function redirectToWebpay(url, token) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = url;

  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "token_ws";
  input.value = token;

  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
}