import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Sin esto, React Router mantiene la posición de scroll de
// la página anterior al navegar (es una SPA, no hay recarga
// real). Se nota sobre todo en mobile: entras al detalle de
// un producto y aparecés a mitad de la página en vez de arriba.
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;