import { useEffect, useRef } from "react";

// Carrusel continuo: se desplaza solo, se pausa con el mouse encima
// y se puede arrastrar con mouse o dedo (misma mecánica que
// "Conoce nuestras marcas"). El contenido debe renderizarse DUPLICADO
// dentro del track; al llegar a la mitad se reinicia sin saltos.
//
// activo=false deja el track quieto (por ejemplo cuando hay pocos
// productos y caben todos en pantalla).
export default function useCarruselInfinito({
  activo,
  velocidad = 0.6,
  dependencias = [],
}) {
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const arrastrandoRef = useRef(false);
  const pausadoRef = useRef(false);
  const inicioXRef = useRef(0);
  const inicioOffsetRef = useRef(0);
  const seMovioRef = useRef(false);

  function normalizar() {
    const track = trackRef.current;
    if (!track) return;

    const mitad = track.scrollWidth / 2;
    if (mitad <= 0) return;

    while (offsetRef.current <= -mitad) offsetRef.current += mitad;
    while (offsetRef.current > 0) offsetRef.current -= mitad;
  }

  function aplicar() {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
    }
  }

  // Auto-scroll
  useEffect(() => {
    if (!activo) {
      offsetRef.current = 0;
      aplicar();
      return undefined;
    }

    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;

    let rafId;

    function tick() {
      if (!arrastrandoRef.current && !pausadoRef.current && !reduceMotion) {
        offsetRef.current -= velocidad;
        normalizar();
        aplicar();
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activo, velocidad, ...dependencias]);

  function iniciar(x) {
    if (!activo) return;
    arrastrandoRef.current = true;
    seMovioRef.current = false;
    inicioXRef.current = x;
    inicioOffsetRef.current = offsetRef.current;
  }

  function mover(x) {
    if (!arrastrandoRef.current) return;

    const delta = x - inicioXRef.current;
    if (Math.abs(delta) > 4) seMovioRef.current = true;

    offsetRef.current = inicioOffsetRef.current + delta;
    normalizar();
    aplicar();
  }

  function terminar() {
    arrastrandoRef.current = false;
  }

  // El arrastre con mouse sigue aunque el puntero salga del carrusel
  useEffect(() => {
    const onMove = (e) => mover(e.clientX);
    const onUp = () => terminar();

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activo]);

  return {
    trackRef,
    carouselProps: {
      onMouseEnter: () => {
        pausadoRef.current = true;
      },
      onMouseLeave: () => {
        pausadoRef.current = false;
      },
    },
    trackProps: {
      onMouseDown: (e) => iniciar(e.clientX),
      onTouchStart: (e) => iniciar(e.touches[0].clientX),
      onTouchMove: (e) => mover(e.touches[0].clientX),
      onTouchEnd: terminar,
      // Un arrastre no debe abrir el producto ni agregar al carrito
      onClickCapture: (e) => {
        if (seMovioRef.current) {
          e.preventDefault();
          e.stopPropagation();
          seMovioRef.current = false;
        }
      },
      onDragStart: (e) => e.preventDefault(),
    },
  };
}
