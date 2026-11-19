import "../../css/Icon.css";

// Iconos propios de MTE Toys: todos dibujados con el mismo trazo
// (línea redondeada de 1.8, cuadrícula de 24 px) y toman el color
// del texto que los rodea (currentColor). Cada uno reemplaza a un
// emoji manteniendo su temática (oso, camión, regalo, etc.).

const DIBUJOS = {
  // ---------- tienda ----------
  bear: (
    <>
      <circle cx="6.3" cy="6.6" r="2.6" />
      <circle cx="17.7" cy="6.6" r="2.6" />
      <circle cx="12" cy="13.2" r="7.2" />
      <ellipse cx="12" cy="15.6" rx="2.7" ry="2.1" />
      <path d="M11.1 14.6h1.8" />
      <circle cx="9.2" cy="11.2" r=".7" fill="currentColor" stroke="none" />
      <circle cx="14.8" cy="11.2" r=".7" fill="currentColor" stroke="none" />
    </>
  ),
  gift: (
    <>
      <path d="M4 11h16v8.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5V11Z" />
      <path d="M3 7.2h18V11H3z" />
      <path d="M12 7.2V21" />
      <path d="M12 7.2C9.6 7.4 7 6.6 7 5a1.9 1.9 0 0 1 3.3-1.2C11.3 4.8 12 6.2 12 7.2Z" />
      <path d="M12 7.2c2.4.2 5-.6 5-2.2a1.9 1.9 0 0 0-3.3-1.2C12.7 4.8 12 6.2 12 7.2Z" />
    </>
  ),
  package: (
    <>
      <path d="M21 8.2 12 3 3 8.2v7.6L12 21l9-5.2V8.2Z" />
      <path d="M3.3 8.4 12 13.5l8.7-5.1" />
      <path d="M12 13.5V21" />
      <path d="m7.5 5.6 9 5.2" />
    </>
  ),
  truck: (
    <>
      <path d="M2.5 6.5h11v10h-11z" />
      <path d="M13.5 9.5h4l3 3.4v3.6h-7" />
      <circle cx="7" cy="17.6" r="2" fill="var(--icon-fondo, #fff)" />
      <circle cx="17" cy="17.6" r="2" fill="var(--icon-fondo, #fff)" />
    </>
  ),
  tag: (
    <>
      <path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4l-8.7-8.7Z" />
      <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  ticket: (
    <>
      <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" />
      <path d="M14 6.5v11" strokeDasharray="2 2.2" />
    </>
  ),
  cart: (
    <>
      <path d="M2.8 4h2.6l2.3 11h10.5l2-8.2H6.2" />
      <circle cx="9.6" cy="19.4" r="1.4" />
      <circle cx="17" cy="19.4" r="1.4" />
    </>
  ),
  star: (
    <path d="m12 3.2 2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 17.1 6.6 20l1.1-6.1L3.2 9.6l6.1-.8L12 3.2Z" />
  ),
  sparkle: (
    <path d="M12 3c.8 5 2.5 7 9 9-6.5 2-8.2 4-9 9-.8-5-2.5-7-9-9 6.5-2 8.2-4 9-9Z" />
  ),
  party: (
    <>
      <path d="M4 20 8.6 8.2l7.2 7.2L4 20Z" />
      <path d="M11.2 5.6 12 3M15.4 8.6 18 6.6M16.6 12.4 20 12M13 3.2h.01M19.5 9h.01M20 16h.01" />
    </>
  ),
  banknote: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.8" />
      <path d="M6 12h.01M18 12h.01" />
    </>
  ),
  transfer: (
    <>
      <path d="m7 4-4 4 4 4M3 8h14" />
      <path d="m17 20 4-4-4-4M21 16H7" />
    </>
  ),

  // ---------- lugar y contacto ----------
  pin: (
    <>
      <path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  phone: (
    <path d="M5 4h3.8l1.9 4.8-2.4 1.5a11 11 0 0 0 5.4 5.4l1.5-2.4 4.8 1.9V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.6 7.2 8.4 6 8.4-6" />
    </>
  ),
  smartphone: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </>
  ),

  // ---------- personas y ajustes ----------
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="m12 2.6 1.5 2.4 2.8-.5.9 2.7 2.6 1.1-.9 2.7.9 2.7-2.6 1.1-.9 2.7-2.8-.5L12 21.4 10.5 19l-2.8.5-.9-2.7-2.6-1.1.9-2.7-.9-2.7 2.6-1.1.9-2.7 2.8.5L12 2.6Z" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
      <path d="M12 15v2" />
    </>
  ),

  // ---------- acciones ----------
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  pencil: (
    <>
      <path d="m4 20 1-4L16.4 4.6a2.1 2.1 0 0 1 3 3L8 19l-4 1Z" />
      <path d="m14.5 6.5 3 3" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M10 11v6M14 11v6" />
      <path d="m6 7 1 12.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5L18 7M9 7V4.5h6V7" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  sliders: (
    <>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="17" r="2" />
    </>
  ),
  return: (
    <>
      <path d="m9 14-5-5 5-5" />
      <path d="M4 9h10a6 6 0 0 1 0 12h-3" />
    </>
  ),

  // ---------- estados y flechas ----------
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  "check-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 3 3 5-6" />
    </>
  ),
  "x-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </>
  ),
  warning: (
    <>
      <path d="M12 3.6 21.4 20H2.6L12 3.6Z" />
      <path d="M12 10v4.4" />
      <path d="M12 17.4h.01" strokeWidth="2.3" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.4a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1.1.9-1.1 1.7" />
      <path d="M12 16.8h.01" strokeWidth="2.3" />
    </>
  ),
  hourglass: (
    <>
      <path d="M7 3h10M7 21h10" />
      <path d="M8 3v3.5c0 1.6 1.5 2.9 4 5.5-2.5 2.6-4 3.9-4 5.5V21M16 3v3.5c0 1.6-1.5 2.9-4 5.5 2.5 2.6 4 3.9 4 5.5V21" />
    </>
  ),
  "arrow-left": <path d="M19 12H5M11 6l-6 6 6 6" />,
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  "chevron-left": <path d="m15 5-7 7 7 7" />,
  "chevron-right": <path d="m9 5 7 7-7 7" />,
};

export const ICONOS = Object.keys(DIBUJOS);

function Icon({
  name,
  size = "1.1em",
  filled = false,
  className = "",
  title,
  ...resto
}) {
  const dibujo = DIBUJOS[name];

  if (!dibujo) return null;

  return (
    <svg
      className={`icon icon-${name} ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...resto}
    >
      {title && <title>{title}</title>}
      {dibujo}
    </svg>
  );
}

export default Icon;
