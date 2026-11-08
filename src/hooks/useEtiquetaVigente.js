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

// El admin puede crear/editar/eliminar etiquetas desde el
// panel sin recargar la página; esto limpia la caché para
// que el siguiente componente que las necesite (ej: el
// select del formulario de productos) pida la lista fresca.
export function invalidarCacheEtiquetas() {
  etiquetasPromise = null;
}

// Dado el id de la etiqueta asignada a un producto desde el
// admin, devuelve esa etiqueta solo si además está vigente
// hoy (dentro de su rango de fechas y activa). Si el
// producto no tiene etiqueta asignada, o la asignada ya no
// está vigente, devuelve null.
export function useEtiquetaDeProducto(etiquetaId) {
  const [etiqueta, setEtiqueta] = useState(null);

  useEffect(() => {
    if (!etiquetaId) {
      setEtiqueta(null);
      return;
    }

    let cancelado = false;

    cargarEtiquetas()
      .then((etiquetas) => {
        if (cancelado) return;

        const asignada = etiquetas.find(
          (e) => e._id === etiquetaId
        );

        if (!asignada) {
          setEtiqueta(null);
          return;
        }

        const vigente = obtenerEtiquetaVigente([
          asignada,
        ]);

        setEtiqueta(vigente);
      })
      .catch((err) => {
        console.error("Error al cargar etiquetas:", err);
      });

    return () => {
      cancelado = true;
    };
  }, [etiquetaId]);

  return etiqueta;
}

// Lista completa de etiquetas creadas (para selects de
// admin, por ejemplo). Usa la misma caché que el hook
// anterior.
export function useEtiquetas() {
  const [etiquetas, setEtiquetas] = useState([]);

  useEffect(() => {
    let cancelado = false;

    cargarEtiquetas()
      .then((lista) => {
        if (!cancelado) setEtiquetas(lista);
      })
      .catch((err) => {
        console.error("Error al cargar etiquetas:", err);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  return etiquetas;
}
