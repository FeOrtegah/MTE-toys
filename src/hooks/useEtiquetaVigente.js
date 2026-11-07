import { useEffect, useState } from "react";
import {
  getEtiquetas,
  obtenerEtiquetaVigente,
} from "../services/etiquetaService";

// Las etiquetas se comparten entre todas las cards de la
// página (muchas montadas a la vez), así que se cachea
// una sola promesa en vez de hacer un fetch por card.
let etiquetasPromise = null;

function cargarEtiquetas() {
  if (!etiquetasPromise) {
    etiquetasPromise = getEtiquetas().catch((err) => {
      etiquetasPromise = null;
      throw err;
    });
  }

  return etiquetasPromise;
}

// Devuelve la etiqueta estacional/promocional vigente
// hoy (Ciber, Navidad, Black Week, etc.) o null si no hay
// ninguna activa en este momento.
export function useEtiquetaVigente() {
  const [etiqueta, setEtiqueta] = useState(null);

  useEffect(() => {
    let cancelado = false;

    cargarEtiquetas()
      .then((etiquetas) => {
        if (cancelado) return;
        setEtiqueta(obtenerEtiquetaVigente(etiquetas));
      })
      .catch((err) => {
        console.error("Error al cargar etiquetas:", err);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  return etiqueta;
}
