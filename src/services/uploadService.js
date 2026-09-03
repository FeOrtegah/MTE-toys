const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function uploadImages(files) {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append("imagenes", file));

  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // sin body
  }

  if (!res.ok) {
    throw new Error(data?.message || "Error al subir imágenes");
  }

  return data.urls;
}