const API_URL = import.meta.env.VITE_API_URL;

/**
 * Wrapper central para todas las llamadas al backend.
 * - Arma la URL completa
 * - Agrega el token JWT si existe (localStorage)
 * - Parsea la respuesta como JSON
 * - Lanza un Error legible si la respuesta no es ok
 */
async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // respuesta sin body (ej. 204)
  }

  if (!res.ok) {
    const message = data?.message || `Error ${res.status} en ${path}`;
    throw new Error(message);
  }

  return data;
}

export default request;