import "../../css/Icon.css";

// Iconos propios de MTE Toys: mismo trazo de línea redondeada (1.8, grilla
// de 24 px) pero con relleno de color, parecido al de los emojis que
// reemplazan (oso café, regalo rojo con cinta amarilla, camión naranja...).
//
// Clases de cada forma (los colores salen de la paleta de cada icono):
//   f = relleno principal   b = relleno secundario   a = puntito sólido
//   c = relleno de acento (con borde)   w = relleno "blanco" (ruedas)
//   n = sin borde           k1/k2/k3 = trazos de otro color
//
// Con la prop `mono` (o si el icono no tiene paleta, como las flechas)
// se dibuja de una sola línea con el color del texto. Se usa sobre fondos
// de color como botones verdes, la barra negra o el pie de página.

const DIBUJOS = {
  bear: (
    <>
      <circle className="f" cx="6.3" cy="6.6" r="2.6" />
      <circle className="f" cx="17.7" cy="6.6" r="2.6" />
      <circle className="b n" cx="6.3" cy="6.6" r="1.1" />
      <circle className="b n" cx="17.7" cy="6.6" r="1.1" />
      <circle className="f" cx="12" cy="13.2" r="7.2" />
      <ellipse className="b" cx="12" cy="15.6" rx="2.7" ry="2.1" />
      <path d="M11.1 14.6h1.8" />
      <circle className="a" cx="9.2" cy="11.2" r=".7" />
      <circle className="a" cx="14.8" cy="11.2" r=".7" />
    </>
  ),
  gift: (
    <>
      <path className="f" d="M4 11h16v8.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5V11Z" />
      <path className="b" d="M3 7.2h18V11H3z" />
      <path className="k1" d="M12 7.2V21" />
      <path className="c" d="M12 7.2C9.6 7.4 7 6.6 7 5a1.9 1.9 0 0 1 3.3-1.2C11.3 4.8 12 6.2 12 7.2Z" />
      <path className="c" d="M12 7.2c2.4.2 5-.6 5-2.2a1.9 1.9 0 0 0-3.3-1.2C12.7 4.8 12 6.2 12 7.2Z" />
    </>
  ),
  package: (
    <>
      <path className="f" d="M21 8.2 12 3 3 8.2v7.6L12 21l9-5.2V8.2Z" />
      <path className="b" d="M3.3 8.4 12 13.5l8.7-5.1V8.2L12 3 3 8.2l.3.2Z" />
      <path d="M3.3 8.4 12 13.5l8.7-5.1" />
      <path d="M12 13.5V21" />
      <path className="k1" d="m7.5 5.6 9 5.2" />
    </>
  ),
  truck: (
    <>
      <path className="f" d="M2.5 6.5h11v10h-11z" />
      <path className="b" d="M13.5 9.5h4l3 3.4v3.6h-7z" />
      <circle className="w" cx="7" cy="17.6" r="2" />
      <circle className="w" cx="17" cy="17.6" r="2" />
    </>
  ),
  tag: (
    <>
      <path className="f" d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4l-8.7-8.7Z" />
      <circle className="a" cx="7.5" cy="7.5" r="1.3" />
    </>
  ),
  ticket: (
    <>
      <path className="f" d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" />
      <path className="k1" d="M14 6.5v11" strokeDasharray="2 2.2" />
    </>
  ),
  cart: (
    <>
      <path className="f n" d="M6.2 6.8h14l-2 8.2H7.7Z" />
      <path d="M2.8 4h2.6l2.3 11h10.5l2-8.2H6.2" />
      <circle className="c" cx="9.6" cy="19.4" r="1.4" />
      <circle className="c" cx="17" cy="19.4" r="1.4" />
    </>
  ),
  star: (
    <path className="f" d="m12 3.2 2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 17.1 6.6 20l1.1-6.1L3.2 9.6l6.1-.8L12 3.2Z" />
  ),
  sparkle: (
    <path className="f" d="M12 3c.8 5 2.5 7 9 9-6.5 2-8.2 4-9 9-.8-5-2.5-7-9-9 6.5-2 8.2-4 9-9Z" />
  ),
  party: (
    <>
      <path className="f" d="M4 20 8.6 8.2l7.2 7.2L4 20Z" />
      <path className="b n" d="M6.4 14l1.9-4.8 2.4 2.4Z" />
      <path className="k1" d="M11.2 5.6 12 3" />
      <path className="k2" d="M15.4 8.6 18 6.6" />
      <path className="k3" d="M16.6 12.4 20 12" />
      <path className="k2" d="M13 3.2h.01M20 16h.01" strokeWidth="2.6" />
      <path className="k1" d="M19.5 9h.01" strokeWidth="2.6" />
    </>
  ),
  banknote: (
    <>
      <rect className="f" x="2.5" y="6" width="19" height="12" rx="2" />
      <circle className="b" cx="12" cy="12" r="2.8" />
      <path d="M6 12h.01M18 12h.01" />
    </>
  ),
  transfer: (
    <>
      <path d="m7 4-4 4 4 4M3 8h14" />
      <path className="k1" d="m17 20 4-4-4-4M21 16H7" />
    </>
  ),

  pin: (
    <>
      <path className="f" d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21Z" />
      <circle className="b" cx="12" cy="9.5" r="2.5" />
    </>
  ),
  phone: (
    <path className="f" d="M5 4h3.8l1.9 4.8-2.4 1.5a11 11 0 0 0 5.4 5.4l1.5-2.4 4.8 1.9V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  ),
  mail: (
    <>
      <rect className="f" x="3" y="5" width="18" height="14" rx="2" />
      <path className="k1" d="m3.6 7.2 8.4 6 8.4-6" />
    </>
  ),
  smartphone: (
    <>
      <rect className="f" x="7" y="2.5" width="10" height="19" rx="2.5" />
      <rect className="b n" x="8.6" y="5" width="6.8" height="11.5" rx=".8" />
      <path d="M11 18.8h2" />
    </>
  ),

  user: (
    <>
      <path className="f n" d="M4.5 20.5a7.5 7.5 0 0 1 15 0Z" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
      <circle className="b" cx="12" cy="8" r="4" />
    </>
  ),
  gear: (
    <>
      <path className="f" d="m12 2.6 1.5 2.4 2.8-.5.9 2.7 2.6 1.1-.9 2.7.9 2.7-2.6 1.1-.9 2.7-2.8-.5L12 21.4 10.5 19l-2.8.5-.9-2.7-2.6-1.1.9-2.7-.9-2.7 2.6-1.1.9-2.7 2.8.5L12 2.6Z" />
      <circle className="b" cx="12" cy="12" r="3" />
    </>
  ),
  lock: (
    <>
      <path className="k1" d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
      <rect className="f" x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M12 15v2" />
    </>
  ),

  search: (
    <>
      <circle className="f" cx="11" cy="11" r="6.5" />
      <path className="k1" d="m16 16 4.5 4.5" />
    </>
  ),
  pencil: (
    <>
      <path className="f" d="m4 20 1-4L16.4 4.6a2.1 2.1 0 0 1 3 3L8 19l-4 1Z" />
      <path d="m14.5 6.5 3 3" />
      <path className="b" d="m4 20 1-4 3 3-4 1Z" />
    </>
  ),
  trash: (
    <>
      <path className="f n" d="M6 7h12l-1 12.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19.5L6 7Z" />
      <path d="M4 7h16M10 11v6M14 11v6" />
      <path d="m6 7 1 12.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5L18 7M9 7V4.5h6V7" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  sliders: (
    <>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle className="c" cx="15" cy="7" r="2" />
      <circle className="c" cx="9" cy="17" r="2" />
    </>
  ),
  return: (
    <>
      <path d="m9 14-5-5 5-5" />
      <path d="M4 9h10a6 6 0 0 1 0 12h-3" />
    </>
  ),

  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  "check-circle": (
    <>
      <circle className="f" cx="12" cy="12" r="9" />
      <path d="m8 12.5 3 3 5-6" />
    </>
  ),
  "x-circle": (
    <>
      <circle className="f" cx="12" cy="12" r="9" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </>
  ),
  warning: (
    <>
      <path className="f" d="M12 3.6 21.4 20H2.6L12 3.6Z" />
      <path className="k1" d="M12 10v4.4" />
      <path className="k1" d="M12 17.4h.01" strokeWidth="2.3" />
    </>
  ),
  help: (
    <>
      <circle className="f" cx="12" cy="12" r="9" />
      <path d="M9.6 9.4a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1.1.9-1.1 1.7" />
      <path d="M12 16.8h.01" strokeWidth="2.3" />
    </>
  ),
  hourglass: (
    <>
      <path className="f n" d="M8 3h8v3.5c0 1.6-1.5 2.9-4 5.5-2.5-2.6-4-3.9-4-5.5Z" />
      <path className="b n" d="M12 12c2.5 2.6 4 3.9 4 5.5V21H8v-3.5c0-1.6 1.5-2.9 4-5.5Z" />
      <path d="M7 3h10M7 21h10" />
      <path d="M8 3v3.5c0 1.6 1.5 2.9 4 5.5-2.5 2.6-4 3.9-4 5.5V21M16 3v3.5c0 1.6-1.5 2.9-4 5.5 2.5 2.6 4 3.9 4 5.5V21" />
    </>
  ),
  "arrow-left": <path d="M19 12H5M11 6l-6 6 6 6" />,
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  "chevron-left": <path d="m15 5-7 7 7 7" />,
  "chevron-right": <path d="m9 5 7 7-7 7" />,
};

// Colores por icono: s = trazo, f/b/a/c/w = rellenos, k1..k3 = trazos de acento
const PALETAS = {
  bear: { s: "#6b3f1d", f: "#d79a5b", b: "#f6dcb7", a: "#3b2412" },
  gift: { s: "#a8281f", f: "#ff6b57", b: "#ff8f7e", c: "#ffc400", k1: "#ffc400" },
  package: { s: "#8a5a2b", f: "#d9a45f", b: "#ecc890", k1: "#fff3d6" },
  truck: { s: "#9a3f00", f: "#ff8a3d", b: "#ffd166", w: "#e5e7eb" },
  tag: { s: "#a86b00", f: "#ffc94d", a: "#ffffff" },
  ticket: { s: "#b45309", f: "#ffb35c", k1: "#b45309" },
  cart: { s: "#374151", f: "#bfe3ff", c: "#ffc400" },
  star: { s: "#d99a00", f: "#ffc400", filled: true },
  sparkle: { s: "#e0a000", f: "#ffd84d", filled: true },
  party: { s: "#c26d00", f: "#ffb703", b: "#ffd88a", k1: "#ef4444", k2: "#3b82f6", k3: "#22a447" },
  banknote: { s: "#2e7d32", f: "#8fd694", b: "#d7f2d9" },
  transfer: { s: "#2563eb", k1: "#f97316" },
  pin: { s: "#b91c1c", f: "#ef4444", b: "#ffffff" },
  phone: { s: "#1d4ed8", f: "#93c5fd" },
  mail: { s: "#2563eb", f: "#eff6ff", k1: "#2563eb" },
  smartphone: { s: "#334155", f: "#cbd5e1", b: "#93c5fd" },
  user: { s: "#1e40af", f: "#60a5fa", b: "#fcd5b0" },
  gear: { s: "#475569", f: "#cbd5e1", b: "#ffffff" },
  lock: { s: "#92600a", f: "#fbbf24", k1: "#64748b" },
  search: { s: "#2b6cb0", f: "#dbeafe", k1: "#8a5a2b" },
  pencil: { s: "#b45309", f: "#ffc400", b: "#fcd5b0" },
  trash: { s: "#6b7280", f: "#e5e7eb" },
  plus: { s: "#43b96d" },
  close: { s: "#ef4444" },
  sliders: { s: "#475569", c: "#ffc400" },
  return: { s: "#f97316" },
  check: { s: "#22a447" },
  "check-circle": { s: "#1e9e4a", f: "#c6f0d4" },
  "x-circle": { s: "#dc2626", f: "#fecaca" },
  warning: { s: "#b45309", f: "#ffd84d", k1: "#7c2d12" },
  help: { s: "#2563eb", f: "#bfdbfe" },
  hourglass: { s: "#a16207", f: "#fde68a", b: "#f5b83d" },
};

export const ICONOS = Object.keys(DIBUJOS);

function variables(name, mono, filled) {
  const p = PALETAS[name];
  const conColor = p && !mono && (!p.filled || filled);

  if (conColor) {
    const s = p.s;
    return {
      "--s": s,
      "--f": p.f || "none",
      "--b": p.b || "none",
      "--a": p.a || s,
      "--c": p.c || "none",
      "--w": p.w || "#fff",
      "--k1": p.k1 || s,
      "--k2": p.k2 || s,
      "--k3": p.k3 || s,
    };
  }

  return {
    "--s": "currentColor",
    "--f": filled ? "currentColor" : "none",
    "--b": "none",
    "--a": "currentColor",
    "--c": "none",
    "--w": "var(--icon-fondo, #fff)",
    "--k1": "currentColor",
    "--k2": "currentColor",
    "--k3": "currentColor",
  };
}

function Icon({
  name,
  size = "1.1em",
  filled = false,
  mono = false,
  className = "",
  title,
  style,
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
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      style={{ ...variables(name, mono, filled), ...style }}
      {...resto}
    >
      {title && <title>{title}</title>}
      {dibujo}
    </svg>
  );
}

export default Icon;
