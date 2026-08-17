import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import { createOrder } from "../../services/api";
import { getMe } from "../../services/authService";
import {
  initWebpayTransaction,
  redirectToWebpay,
} from "../../services/webpayService";
import "../../css/Checkout.css";

// =====================================================
// REGIONES Y COMUNAS DE CHILE
// =====================================================

const COMUNAS_POR_REGION = {
  "Arica y Parinacota": [
    "Arica",
    "Camarones",
    "Putre",
    "General Lagos",
  ],

  Tarapacá: [
    "Iquique",
    "Alto Hospicio",
    "Pozo Almonte",
    "Camiña",
    "Colchane",
    "Huara",
    "Pica",
  ],

  Antofagasta: [
    "Antofagasta",
    "Mejillones",
    "Sierra Gorda",
    "Taltal",
    "Calama",
    "Ollagüe",
    "San Pedro de Atacama",
    "Tocopilla",
    "María Elena",
  ],

  Atacama: [
    "Copiapó",
    "Caldera",
    "Tierra Amarilla",
    "Chañaral",
    "Diego de Almagro",
    "Vallenar",
    "Alto del Carmen",
    "Freirina",
    "Huasco",
  ],

  Coquimbo: [
    "La Serena",
    "Coquimbo",
    "Andacollo",
    "La Higuera",
    "Paiguano",
    "Vicuña",
    "Illapel",
    "Canela",
    "Los Vilos",
    "Salamanca",
    "Ovalle",
    "Combarbalá",
    "Monte Patria",
    "Punitaqui",
    "Río Hurtado",
  ],

  Valparaíso: [
    "Valparaíso",
    "Casablanca",
    "Concón",
    "Juan Fernández",
    "Puchuncaví",
    "Quintero",
    "Viña del Mar",
    "Isla de Pascua",
    "Los Andes",
    "Calle Larga",
    "Rinconada",
    "San Esteban",
    "La Ligua",
    "Cabildo",
    "Papudo",
    "Petorca",
    "Zapallar",
    "Quillota",
    "Calera",
    "Hijuelas",
    "La Cruz",
    "Nogales",
    "San Antonio",
    "Algarrobo",
    "Cartagena",
    "El Quisco",
    "El Tabo",
    "Santo Domingo",
    "San Felipe",
    "Catemu",
    "Llaillay",
    "Panquehue",
    "Putaendo",
    "Santa María",
    "Quilpué",
    "Limache",
    "Olmué",
    "Villa Alemana",
  ],

  "Metropolitana de Santiago": [
    "Santiago",
    "Cerrillos",
    "Cerro Navia",
    "Conchalí",
    "El Bosque",
    "Estación Central",
    "Huechuraba",
    "Independencia",
    "La Cisterna",
    "La Florida",
    "La Granja",
    "La Pintana",
    "La Reina",
    "Las Condes",
    "Lo Barnechea",
    "Lo Espejo",
    "Lo Prado",
    "Macul",
    "Maipú",
    "Ñuñoa",
    "Pedro Aguirre Cerda",
    "Peñalolén",
    "Providencia",
    "Pudahuel",
    "Quilicura",
    "Quinta Normal",
    "Recoleta",
    "Renca",
    "San Joaquín",
    "San Miguel",
    "San Ramón",
    "Vitacura",
    "Puente Alto",
    "Pirque",
    "San José de Maipo",
    "Colina",
    "Lampa",
    "Til Til",
    "San Bernardo",
    "Buin",
    "Calera de Tango",
    "Paine",
    "Melipilla",
    "Alhué",
    "Curacaví",
    "María Pinto",
    "San Pedro",
    "Talagante",
    "El Monte",
    "Isla de Maipo",
    "Padre Hurtado",
    "Peñaflor",
  ],

  "O'Higgins": [
    "Rancagua",
    "Codegua",
    "Coinco",
    "Coltauco",
    "Doñihue",
    "Graneros",
    "Las Cabras",
    "Machalí",
    "Malloa",
    "Mostazal",
    "Olivar",
    "Peumo",
    "Pichidegua",
    "Quinta de Tilcoco",
    "Rengo",
    "Requínoa",
    "San Vicente",
    "Pichilemu",
    "La Estrella",
    "Litueche",
    "Marchihue",
    "Navidad",
    "Paredones",
    "San Fernando",
    "Chépica",
    "Chimbarongo",
    "Lolol",
    "Nancagua",
    "Palmilla",
    "Peralillo",
    "Placilla",
    "Pumanque",
    "Santa Cruz",
  ],

  Maule: [
    "Talca",
    "Constitución",
    "Curepto",
    "Empedrado",
    "Maule",
    "Pelarco",
    "Pencahue",
    "Río Claro",
    "San Clemente",
    "San Rafael",
    "Cauquenes",
    "Chanco",
    "Pelluhue",
    "Curicó",
    "Hualañé",
    "Licantén",
    "Molina",
    "Rauco",
    "Romeral",
    "Sagrada Familia",
    "Teno",
    "Vichuquén",
    "Linares",
    "Colbún",
    "Longaví",
    "Parral",
    "Retiro",
    "San Javier",
    "Villa Alegre",
    "Yerbas Buenas",
  ],

  Ñuble: [
    "Chillán",
    "Bulnes",
    "Chillán Viejo",
    "El Carmen",
    "Pemuco",
    "Pinto",
    "Quillón",
    "San Ignacio",
    "Yungay",
    "Quirihue",
    "Cobquecura",
    "Coelemu",
    "Ninhue",
    "Portezuelo",
    "Ránquil",
    "Treguaco",
    "San Carlos",
    "Coihueco",
    "Ñiquén",
    "San Fabián",
    "San Nicolás",
  ],

  Biobío: [
    "Concepción",
    "Coronel",
    "Chiguayante",
    "Florida",
    "Hualqui",
    "Lota",
    "Penco",
    "San Pedro de la Paz",
    "Santa Juana",
    "Talcahuano",
    "Tomé",
    "Hualpén",
    "Lebu",
    "Arauco",
    "Cañete",
    "Contulmo",
    "Curanilahue",
    "Los Álamos",
    "Tirúa",
    "Los Ángeles",
    "Antuco",
    "Cabrero",
    "Laja",
    "Mulchén",
    "Nacimiento",
    "Negrete",
    "Quilaco",
    "Quilleco",
    "San Rosendo",
    "Santa Bárbara",
    "Tucapel",
    "Yumbel",
    "Alto Biobío",
  ],

  "La Araucanía": [
    "Temuco",
    "Carahue",
    "Cunco",
    "Curarrehue",
    "Freire",
    "Galvarino",
    "Gorbea",
    "Lautaro",
    "Loncoche",
    "Melipeuco",
    "Nueva Imperial",
    "Padre las Casas",
    "Perquenco",
    "Pitrufquén",
    "Pucón",
    "Saavedra",
    "Teodoro Schmidt",
    "Toltén",
    "Vilcún",
    "Villarrica",
    "Cholchol",
    "Angol",
    "Collipulli",
    "Curacautín",
    "Ercilla",
    "Lonquimay",
    "Los Sauces",
    "Lumaco",
    "Purén",
    "Renaico",
    "Traiguén",
    "Victoria",
  ],

  "Los Ríos": [
    "Valdivia",
    "Corral",
    "Lanco",
    "Los Lagos",
    "Máfil",
    "Mariquina",
    "Paillaco",
    "Panguipulli",
    "La Unión",
    "Futrono",
    "Lago Ranco",
    "Río Bueno",
  ],

  "Los Lagos": [
    "Puerto Montt",
    "Calbuco",
    "Cochamó",
    "Fresia",
    "Frutillar",
    "Los Muermos",
    "Llanquihue",
    "Maullín",
    "Puerto Varas",
    "Castro",
    "Ancud",
    "Chonchi",
    "Curaco de Vélez",
    "Dalcahue",
    "Puqueldón",
    "Queilén",
    "Quellón",
    "Quemchi",
    "Quinchao",
    "Osorno",
    "Puerto Octay",
    "Purranque",
    "Puyehue",
    "Río Negro",
    "San Juan de la Costa",
    "San Pablo",
    "Chaitén",
    "Futaleufú",
    "Hualaihué",
    "Palena",
  ],

  Aysén: [
    "Coyhaique",
    "Lago Verde",
    "Aysén",
    "Cisnes",
    "Guaitecas",
    "Cochrane",
    "O'Higgins",
    "Tortel",
    "Chile Chico",
    "Río Ibáñez",
  ],

  "Magallanes y de la Antártica Chilena": [
    "Punta Arenas",
    "Laguna Blanca",
    "Río Verde",
    "San Gregorio",
    "Cabo de Hornos",
    "Antártica",
    "Porvenir",
    "Primavera",
    "Timaukel",
    "Natales",
    "Torres del Paine",
  ],
};

const REGIONES = Object.keys(COMUNAS_POR_REGION);

// =====================================================
// COMUNAS DE ENVÍO
// =====================================================

const COMUNAS_VERDES = [
  "Quilicura",
  "Huechuraba",
  "Conchalí",
  "Independencia",
  "Renca",
  "Cerro Navia",
  "Quinta Normal",
  "Pudahuel",
  "Lo Prado",
  "Santiago",
  "Estación Central",
  "Cerrillos",
  "Maipú",
  "Pedro Aguirre Cerda",
  "San Miguel",
  "Lo Espejo",
  "La Cisterna",
];

const COMUNAS_AZULES = [
  "Lo Barnechea",
  "Vitacura",
  "Las Condes",
  "Recoleta",
  "Providencia",
  "La Reina",
  "Ñuñoa",
  "Macul",
  "Peñalolén",
  "San Joaquín",
  "La Granja",
  "San Ramón",
  "El Bosque",
  "La Pintana",
  "La Florida",
  "San Bernardo",
  "Puente Alto",
];

const COSTO_LOGISTICA_360 = 3490;

// =====================================================
// FUNCIONES DE NORMALIZACIÓN
// =====================================================

const limpiarTexto = (valor) => {
  return String(valor || "").trim();
};

const normalizarEspacios = (valor) => {
  return limpiarTexto(valor).replace(/\s+/g, " ");
};

// =====================================================
// RUT
// =====================================================

const limpiarRut = (rut) => {
  return String(rut || "")
    .replace(/\./g, "")
    .replace(/-/g, "")
    .replace(/\s/g, "")
    .toUpperCase();
};

const validarRut = (rut) => {
  const limpio = limpiarRut(rut);

  if (!/^\d{7,8}[0-9K]$/.test(limpio)) {
    return false;
  }

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);

  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;
    multiplicador++;

    if (multiplicador > 7) {
      multiplicador = 2;
    }
  }

  const resto = suma % 11;
  const resultado = 11 - resto;

  let dvEsperado;

  if (resultado === 11) {
    dvEsperado = "0";
  } else if (resultado === 10) {
    dvEsperado = "K";
  } else {
    dvEsperado = String(resultado);
  }

  return dv === dvEsperado;
};

const formatearRut = (rut) => {
  const limpio = limpiarRut(rut);

  if (!limpio) {
    return "";
  }

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);

  let cuerpoFormateado = "";

  for (let i = cuerpo.length - 1, contador = 0; i >= 0; i--, contador++) {
    cuerpoFormateado = cuerpo[i] + cuerpoFormateado;

    if (contador % 3 === 2 && i !== 0) {
      cuerpoFormateado = "." + cuerpoFormateado;
    }
  }

  return `${cuerpoFormateado}-${dv}`;
};

// =====================================================
// TELÉFONO
// =====================================================

const limpiarTelefono = (telefono) => {
  return String(telefono || "").replace(/[\s()-]/g, "");
};

const validarTelefono = (telefono) => {
  const limpio = limpiarTelefono(telefono);
  return /^(?:\+?56)?9\d{8}$/.test(limpio);
};

const normalizarTelefono = (telefono) => {
  const limpio = limpiarTelefono(telefono);

  if (limpio.startsWith("+56")) {
    return limpio;
  }

  if (limpio.startsWith("56")) {
    return `+${limpio}`;
  }

  if (/^9\d{8}$/.test(limpio)) {
    return `+56${limpio}`;
  }

  return limpio;
};

// =====================================================
// VALIDACIONES
// =====================================================

const validarNombre = (valor, campo) => {
  const texto = normalizarEspacios(valor);

  if (!texto) {
    return `${campo} es obligatorio`;
  }

  if (texto.length < 2) {
    return `${campo} debe tener al menos 2 caracteres`;
  }

  if (texto.length > 100) {
    return `${campo} es demasiado largo`;
  }

  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]+$/.test(texto)) {
    return `${campo} solo puede contener letras`;
  }

  if (/^(.)\1+$/.test(texto.replace(/\s/g, "").toLowerCase())) {
    return `${campo} no es válido`;
  }

  return "";
};

const validarEmail = (email) => {
  const texto = limpiarTexto(email).toLowerCase();

  if (!texto) {
    return "El correo electrónico es obligatorio";
  }

  if (texto.length > 150) {
    return "El correo electrónico es demasiado largo";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(texto)) {
    return "Ingresa un correo electrónico válido";
  }

  return "";
};

const validarDireccion = (direccion) => {
  const texto = normalizarEspacios(direccion);

  if (!texto) {
    return "La dirección es obligatoria";
  }

  if (texto.length < 3) {
    return "La dirección es demasiado corta";
  }

  if (texto.length > 150) {
    return "La dirección es demasiado larga";
  }

  if (/^\d+$/.test(texto)) {
    return "Ingresa el nombre de la calle o avenida";
  }

  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9 .#\/'-]+$/.test(texto)) {
    return "La dirección contiene caracteres no válidos";
  }

  return "";
};

const validarNumero = (numero) => {
  const texto = limpiarTexto(numero);

  if (!texto) {
    return "El número de dirección es obligatorio";
  }

  if (!/^\d{1,6}[A-Za-z]?$/.test(texto)) {
    return "Ingresa un número de dirección válido";
  }

  return "";
};

const validarDepartamento = (departamento) => {
  const texto = limpiarTexto(departamento);

  if (!texto) {
    return "";
  }

  if (texto.length > 20) {
    return "El departamento es demasiado largo";
  }

  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9 .#\/'-]+$/.test(texto)) {
    return "El departamento contiene caracteres no válidos";
  }

  return "";
};

const validarIndicaciones = (indicaciones) => {
  const texto = limpiarTexto(indicaciones);

  if (texto.length > 250) {
    return "Las indicaciones no pueden superar los 250 caracteres";
  }

  return "";
};

const validarRegion = (region) => {
  if (!region) {
    return "Selecciona una región";
  }

  if (!REGIONES.includes(region)) {
    return "Selecciona una región válida";
  }

  return "";
};

const validarComuna = (comuna, region) => {
  const texto = normalizarEspacios(comuna);

  if (!region || !REGIONES.includes(region)) {
    return "Selecciona primero una región";
  }

  if (!texto) {
    return "La comuna es obligatoria";
  }

  const comunasValidas = COMUNAS_POR_REGION[region] || [];

  if (!comunasValidas.includes(texto)) {
    return "Selecciona una comuna válida para la región elegida";
  }

  return "";
};

// =====================================================
// COMPONENTE
// =====================================================

function Checkout() {
  const { cart, total: totalFromCart } = useCart();

  const totalProductos =
    typeof totalFromCart === "function"
      ? totalFromCart()
      : Number(totalFromCart) || 0;

  const { user } = useUser();

  // ===================================================
  // FORMULARIO
  // ===================================================

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    rut: "",
    email: user?.email || "",
    telefono: "",

    facturacion: {
      nombre: "",
      rut: "",
      direccion: "",
      numero: "",
      departamento: "",
      region: "",
      comuna: "",
    },

    envio: {
      nombreReceptor: "",
      telefono: "",
      direccion: "",
      numero: "",
      departamento: "",
      region: "",
      comuna: "",
      indicaciones: "",
    },
  });

  const [mismosDatos, setMismosDatos] = useState(true);

  // ===================================================
  // ENVÍO
  // ===================================================

  const [metodoEnvio, setMetodoEnvio] = useState("");

  const comunaEnvio = normalizarEspacios(
    mismosDatos
      ? form.facturacion.comuna
      : form.envio.comuna
  );

  const zonaEnvio = useMemo(() => {
    if (!comunaEnvio) {
      return null;
    }

    if (COMUNAS_VERDES.includes(comunaEnvio)) {
      return "verde";
    }

    if (COMUNAS_AZULES.includes(comunaEnvio)) {
      return "azul";
    }

    return "fuera";
  }, [comunaEnvio]);

  const costoEnvio = useMemo(() => {
    if (metodoEnvio === "logistica360") {
      return COSTO_LOGISTICA_360;
    }

    // Chilexpress y Bluexpress ahora son por pagar ($0 en línea)
    return 0;
  }, [metodoEnvio]);

  const totalFinal = totalProductos + costoEnvio;

  // ===================================================
  // ESTADOS
  // ===================================================

  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState("");

  // ===================================================
  // EMAIL
  // ===================================================

  useEffect(() => {
    if (user?.email && !form.email) {
      setForm((prev) => ({
        ...prev,
        email: user.email,
      }));
    }
  }, [user, form.email]);

  // ===================================================
  // AUTOCOMPLETAR FACTURACIÓN CON DATOS DEL PERFIL
  // ===================================================

  const facturacionAutocompletada = useRef(false);

  useEffect(() => {
    if (!user || facturacionAutocompletada.current) {
      return;
    }

    let cancelado = false;

    (async () => {
      try {
        const perfil = await getMe();

        if (cancelado) {
          return;
        }

        const direcciones = perfil?.direcciones || [];

        const direccion =
          direcciones.find((dir) => dir.predeterminada) ||
          direcciones[0];

        if (!direccion) {
          return;
        }

        facturacionAutocompletada.current = true;

        setForm((prev) => {
          const facturacionVacia =
            !prev.facturacion.nombre &&
            !prev.facturacion.rut &&
            !prev.facturacion.direccion &&
            !prev.facturacion.comuna;

          if (!facturacionVacia) {
            return prev;
          }

          return {
            ...prev,
            facturacion: {
              nombre:
                direccion.nombreReceptor ||
                perfil?.nombre ||
                "",
              rut: formatearRut(direccion.rut || ""),
              direccion: direccion.calle || "",
              numero: direccion.numero || "",
              departamento: direccion.departamento || "",
              region: direccion.region || "",
              comuna: direccion.comuna || "",
            },
          };
        });
      } catch (err) {
        console.error(
          "No se pudo autocompletar la facturación:",
          err
        );
      }
    })();

    return () => {
      cancelado = true;
    };
  }, [user]);

  // ===================================================
  // REINICIAR MÉTODO DE ENVÍO
  // ===================================================

  useEffect(() => {
    if (zonaEnvio === "verde") {
      if (
        metodoEnvio !== "logistica360" &&
        metodoEnvio !== "bluexpress"
      ) {
        setMetodoEnvio("");
      }
    } else if (zonaEnvio === "azul") {
      if (metodoEnvio !== "bluexpress") {
        setMetodoEnvio("bluexpress");
      }
    } else if (zonaEnvio === "fuera") {
      if (metodoEnvio !== "chilexpress") {
        setMetodoEnvio("chilexpress");
      }
    } else {
      setMetodoEnvio("");
    }
  }, [zonaEnvio, metodoEnvio]);

  // ===================================================
  // CAMBIO DE MÉTODO DE ENVÍO
  // ===================================================

  const handleMetodoEnvio = (metodo) => {
    if (metodo === "logistica360" && zonaEnvio !== "verde") {
      return;
    }

    if (metodo === "bluexpress" && !["verde", "azul"].includes(zonaEnvio)) {
      return;
    }

    if (metodo === "chilexpress" && zonaEnvio !== "fuera") {
      return;
    }

    setMetodoEnvio(metodo);
  };

  // ===================================================
  // CAMBIO CLIENTE
  // ===================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    let nuevoValor = value;

    if (name === "nombre" || name === "apellidos") {
      nuevoValor = value.replace(
        /[^A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]/g,
        ""
      );
    }

    if (name === "rut") {
      nuevoValor = formatearRut(value);
    }

    if (name === "telefono") {
      nuevoValor = value.replace(/[^0-9+ ]/g, "");
    }

    setForm((prev) => ({
      ...prev,
      [name]: nuevoValor,
    }));

    setErrores((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ===================================================
  // CAMBIO FACTURACIÓN
  // ===================================================

  const handleFacturacionChange = (e) => {
    const { name, value } = e.target;

    let nuevoValor = value;

    if (name === "nombre") {
      nuevoValor = value.replace(
        /[^A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]/g,
        ""
      );
    }

    if (name === "rut") {
      nuevoValor = formatearRut(value);
    }

    if (name === "numero") {
      nuevoValor = value.replace(/[^0-9A-Za-z]/g, "");
    }

    setForm((prev) => {
      const nuevaFacturacion = {
        ...prev.facturacion,
        [name]: nuevoValor,
      };

      if (name === "region") {
        nuevaFacturacion.comuna = "";
      }

      return {
        ...prev,
        facturacion: nuevaFacturacion,
      };
    });

    setErrores((prev) => ({
      ...prev,
      [`facturacion.${name}`]: "",
      ...(name === "region"
        ? { "facturacion.comuna": "" }
        : {}),
    }));

    if (name === "comuna" && mismosDatos) {
      setMetodoEnvio("");
    }

    if (name === "region" && mismosDatos) {
      setMetodoEnvio("");
    }
  };

  // ===================================================
  // CAMBIO ENVÍO
  // ===================================================

  const handleEnvioChange = (e) => {
    const { name, value } = e.target;

    let nuevoValor = value;

    if (name === "nombreReceptor") {
      nuevoValor = value.replace(
        /[^A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]/g,
        ""
      );
    }

    if (name === "telefono") {
      nuevoValor = value.replace(/[^0-9+ ]/g, "");
    }

    if (name === "numero") {
      nuevoValor = value.replace(/[^0-9A-Za-z]/g, "");
    }

    setForm((prev) => {
      const nuevoEnvio = {
        ...prev.envio,
        [name]: nuevoValor,
      };

      if (name === "region") {
        nuevoEnvio.comuna = "";
      }

      return {
        ...prev,
        envio: nuevoEnvio,
      };
    });

    setErrores((prev) => ({
      ...prev,
      [`envio.${name}`]: "",
      ...(name === "region"
        ? { "envio.comuna": "" }
        : {}),
    }));

    if (name === "comuna" || name === "region") {
      setMetodoEnvio("");
    }
  };

  // ===================================================
  // VALIDAR TODO
  // ===================================================

  const validarFormulario = () => {
    const nuevosErrores = {};

    // CLIENTE

    const errorNombre = validarNombre(
      form.nombre,
      "El nombre"
    );

    if (errorNombre) {
      nuevosErrores.nombre = errorNombre;
    }

    const errorApellidos = validarNombre(
      form.apellidos,
      "Los apellidos"
    );

    if (errorApellidos) {
      nuevosErrores.apellidos = errorApellidos;
    }

    if (!validarRut(form.rut)) {
      nuevosErrores.rut = "El RUT no es válido";
    }

    const errorEmail = validarEmail(form.email);

    if (errorEmail) {
      nuevosErrores.email = errorEmail;
    }

    if (!validarTelefono(form.telefono)) {
      nuevosErrores.telefono =
        "Ingresa un celular chileno válido";
    }

    // FACTURACIÓN

    const f = form.facturacion;

    const errorNombreFacturacion = validarNombre(
      f.nombre,
      "El nombre de facturación"
    );

    if (errorNombreFacturacion) {
      nuevosErrores["facturacion.nombre"] =
        errorNombreFacturacion;
    }

    if (!validarRut(f.rut)) {
      nuevosErrores["facturacion.rut"] =
        "El RUT de facturación no es válido";
    }

    const errorDireccionFacturacion = validarDireccion(
      f.direccion
    );

    if (errorDireccionFacturacion) {
      nuevosErrores["facturacion.direccion"] =
        errorDireccionFacturacion;
    }

    const errorNumeroFacturacion = validarNumero(
      f.numero
    );

    if (errorNumeroFacturacion) {
      nuevosErrores["facturacion.numero"] =
        errorNumeroFacturacion;
    }

    const errorDepartamentoFacturacion =
      validarDepartamento(f.departamento);

    if (errorDepartamentoFacturacion) {
      nuevosErrores["facturacion.departamento"] =
        errorDepartamentoFacturacion;
    }

    const errorRegionFacturacion = validarRegion(
      f.region
    );

    if (errorRegionFacturacion) {
      nuevosErrores["facturacion.region"] =
        errorRegionFacturacion;
    }

    const errorComunaFacturacion = validarComuna(
      f.comuna,
      f.region
    );

    if (errorComunaFacturacion) {
      nuevosErrores["facturacion.comuna"] =
        errorComunaFacturacion;
    }

    // ENVÍO

    const e = mismosDatos
      ? {
          nombreReceptor:
            `${form.nombre} ${form.apellidos}`.trim(),
          telefono: form.telefono,
          direccion: f.direccion,
          numero: f.numero,
          departamento: f.departamento,
          region: f.region,
          comuna: f.comuna,
          indicaciones: form.envio.indicaciones,
        }
      : form.envio;

    const errorNombreReceptor = validarNombre(
      e.nombreReceptor,
      "El nombre del receptor"
    );

    if (errorNombreReceptor) {
      nuevosErrores["envio.nombreReceptor"] =
        errorNombreReceptor;
    }

    if (!validarTelefono(e.telefono)) {
      nuevosErrores["envio.telefono"] =
        "Ingresa un celular chileno válido";
    }

    const errorDireccionEnvio = validarDireccion(
      e.direccion
    );

    if (errorDireccionEnvio) {
      nuevosErrores["envio.direccion"] =
        errorDireccionEnvio;
    }

    const errorNumeroEnvio = validarNumero(e.numero);

    if (errorNumeroEnvio) {
      nuevosErrores["envio.numero"] =
        errorNumeroEnvio;
    }

    const errorDepartamentoEnvio =
      validarDepartamento(e.departamento);

    if (errorDepartamentoEnvio) {
      nuevosErrores["envio.departamento"] =
        errorDepartamentoEnvio;
    }

    const errorRegionEnvio = validarRegion(e.region);

    if (errorRegionEnvio) {
      nuevosErrores["envio.region"] =
        errorRegionEnvio;
    }

    const errorComunaEnvio = validarComuna(
      e.comuna,
      e.region
    );

    if (errorComunaEnvio) {
      nuevosErrores["envio.comuna"] =
        errorComunaEnvio;
    }

    const errorIndicaciones = validarIndicaciones(
      e.indicaciones
    );

    if (errorIndicaciones) {
      nuevosErrores["envio.indicaciones"] =
        errorIndicaciones;
    }

    // VALIDACIÓN DEL MÉTODO DE ENVÍO

    if (["verde", "azul", "fuera"].includes(zonaEnvio)) {
      if (!metodoEnvio) {
        nuevosErrores.metodoEnvio =
          "Selecciona un método de envío";
      }
    }

    if (!zonaEnvio) {
      nuevosErrores.metodoEnvio =
        "Ingresa una comuna válida para calcular el envío";
    }

    if (zonaEnvio === "verde") {
      if (
        metodoEnvio !== "logistica360" &&
        metodoEnvio !== "bluexpress"
      ) {
        nuevosErrores.metodoEnvio =
          "Selecciona un método de envío válido";
      }
    }

    if (zonaEnvio === "azul") {
      if (metodoEnvio !== "bluexpress") {
        nuevosErrores.metodoEnvio =
          "Para esta comuna el envío disponible es Bluexpress";
      }
    }

    if (zonaEnvio === "fuera") {
      if (metodoEnvio !== "chilexpress") {
        nuevosErrores.metodoEnvio =
          "Para esta comuna el envío disponible es Chilexpress";
      }
    }

    setErrores(nuevosErrores);

    return {
      valido: Object.keys(nuevosErrores).length === 0,
      datosEnvio: e,
    };
  };

  // ===================================================
  // BLUR
  // ===================================================

  const validarCampo = (campo) => {
    const nuevosErrores = { ...errores };

    let error = "";

    if (campo === "nombre") {
      error = validarNombre(form.nombre, "El nombre");
    }

    if (campo === "apellidos") {
      error = validarNombre(
        form.apellidos,
        "Los apellidos"
      );
    }

    if (campo === "rut") {
      error = validarRut(form.rut)
        ? ""
        : "El RUT no es válido";
    }

    if (campo === "email") {
      error = validarEmail(form.email);
    }

    if (campo === "telefono") {
      error = validarTelefono(form.telefono)
        ? ""
        : "Ingresa un celular chileno válido";
    }

    if (campo.startsWith("facturacion.")) {
      const nombreCampo = campo.split(".")[1];
      const valor = form.facturacion[nombreCampo];

      if (nombreCampo === "nombre") {
        error = validarNombre(
          valor,
          "El nombre de facturación"
        );
      }

      if (nombreCampo === "rut") {
        error = validarRut(valor)
          ? ""
          : "El RUT de facturación no es válido";
      }

      if (nombreCampo === "direccion") {
        error = validarDireccion(valor);
      }

      if (nombreCampo === "numero") {
        error = validarNumero(valor);
      }

      if (nombreCampo === "departamento") {
        error = validarDepartamento(valor);
      }

      if (nombreCampo === "region") {
        error = validarRegion(valor);
      }

      if (nombreCampo === "comuna") {
        error = validarComuna(
          valor,
          form.facturacion.region
        );
      }
    }

    if (campo.startsWith("envio.")) {
      const nombreCampo = campo.split(".")[1];
      const valor = form.envio[nombreCampo];

      if (nombreCampo === "nombreReceptor") {
        error = validarNombre(
          valor,
          "El nombre del receptor"
        );
      }

      if (nombreCampo === "telefono") {
        error = validarTelefono(valor)
          ? ""
          : "Ingresa un celular chileno válido";
      }

      if (nombreCampo === "direccion") {
        error = validarDireccion(valor);
      }

      if (nombreCampo === "numero") {
        error = validarNumero(valor);
      }

      if (nombreCampo === "departamento") {
        error = validarDepartamento(valor);
      }

      if (nombreCampo === "region") {
        error = validarRegion(valor);
      }

      if (nombreCampo === "comuna") {
        error = validarComuna(
          valor,
          form.envio.region
        );
      }

      if (nombreCampo === "indicaciones") {
        error = validarIndicaciones(valor);
      }
    }

    nuevosErrores[campo] = error;

    setErrores(nuevosErrores);
  };

  // ===================================================
  // MISMO DATOS
  // ===================================================

  const handleMismosDatos = (e) => {
    const checked = e.target.checked;

    setMismosDatos(checked);

    setMetodoEnvio("");

    if (checked) {
      setForm((prev) => ({
        ...prev,

        envio: {
          nombreReceptor:
            `${prev.nombre} ${prev.apellidos}`.trim(),

          telefono: prev.telefono,

          direccion:
            prev.facturacion.direccion,

          numero:
            prev.facturacion.numero,

          departamento:
            prev.facturacion.departamento,

          region:
            prev.facturacion.region,

          comuna:
            prev.facturacion.comuna,

          indicaciones:
            prev.envio.indicaciones,
        },
      }));

      setErrores((prev) => {
        const limpio = { ...prev };

        Object.keys(limpio)
          .filter((k) => k.startsWith("envio."))
          .forEach((k) => delete limpio[k]);

        return limpio;
      });
    }
  };

  // ===================================================
  // CREAR PEDIDO
  // ===================================================

  const finishOrder = async () => {
    setErrorGeneral("");

    if (cart.length === 0) {
      setErrorGeneral("Tu carrito está vacío");
      return;
    }

    const resultado = validarFormulario();

    if (!resultado.valido) {
      setErrorGeneral(
        "Revisa los campos marcados en rojo antes de continuar."
      );

      setTimeout(() => {
        const primerError =
          document.querySelector(".field-error");

        if (primerError) {
          primerError.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 50);

      return;
    }

    setEnviando(true);

    try {
      const datosEnvio = resultado.datosEnvio;

      const orderData = {
        cliente: {
          nombre:
            `${normalizarEspacios(form.nombre)} ${normalizarEspacios(
              form.apellidos
            )}`.trim(),

          email:
            limpiarTexto(form.email).toLowerCase(),

          rut:
            limpiarRut(form.rut),

          telefono:
            normalizarTelefono(form.telefono),

          facturacion: {
            nombre:
              normalizarEspacios(
                form.facturacion.nombre
              ),

            rut:
              limpiarRut(
                form.facturacion.rut
              ),

            direccion:
              normalizarEspacios(
                form.facturacion.direccion
              ),

            numero:
              limpiarTexto(
                form.facturacion.numero
              ),

            departamento:
              limpiarTexto(
                form.facturacion.departamento
              ),

            region:
              limpiarTexto(
                form.facturacion.region
              ),

            comuna:
              normalizarEspacios(
                form.facturacion.comuna
              ),
          },

          envio: {
            nombreReceptor:
              normalizarEspacios(
                datosEnvio.nombreReceptor
              ),

            telefono:
              normalizarTelefono(
                datosEnvio.telefono
              ),

            direccion:
              normalizarEspacios(
                datosEnvio.direccion
              ),

            numero:
              limpiarTexto(
                datosEnvio.numero
              ),

            departamento:
              limpiarTexto(
                datosEnvio.departamento
              ),

            region:
              limpiarTexto(
                datosEnvio.region
              ),

            comuna:
              normalizarEspacios(
                datosEnvio.comuna
              ),

            indicaciones:
              normalizarEspacios(
                datosEnvio.indicaciones
              ),
          },
        },

        items: cart.map((item) => ({
          producto: item.id,
          cantidad: item.quantity,
        })),

        // =================================================
        // INFORMACIÓN DEL ENVÍO
        // =================================================

        metodoEnvio:
          metodoEnvio === "logistica360"
            ? "Logística 360"
            : metodoEnvio === "bluexpress"
            ? "Bluexpress"
            : metodoEnvio === "chilexpress"
            ? "Chilexpress"
            : null,

        costoEnvio,

        totalProductos,

        total: totalFinal,
      };

      console.log("Pedido enviado:", orderData);

      // =================================================
      // CREAR PEDIDO
      // =================================================

      const pedido = await createOrder(orderData);

      // =================================================
      // WEBPAY
      // =================================================

      const { url, token } =
        await initWebpayTransaction(
          pedido._id
        );

      redirectToWebpay(url, token);
    } catch (err) {
      console.error(
        "Error en checkout:",
        err
      );

      setErrorGeneral(
        err.message ||
          "Ocurrió un error al procesar tu pedido"
      );

      setEnviando(false);
    }
  };

  // ===================================================
  // ERROR CAMPO
  // ===================================================

  const ErrorCampo = ({ nombre }) => {
    if (!errores[nombre]) {
      return null;
    }

    return (
      <small className="field-error">
        {errores[nombre]}
      </small>
    );
  };

  // ===================================================
  // COMUNAS
  // ===================================================

  const comunasFacturacion =
    form.facturacion.region
      ? COMUNAS_POR_REGION[
          form.facturacion.region
        ] || []
      : [];

  const comunasEnvio =
    form.envio.region
      ? COMUNAS_POR_REGION[
          form.envio.region
        ] || []
      : [];

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <main className="checkout-page">

      <h1>Finalizar compra</h1>

      {errorGeneral && (
        <div className="checkout-error">
          {errorGeneral}
        </div>
      )}

      <div className="checkout-container">

        {/* =================================================
            FORMULARIO
        ================================================= */}

        <section className="billing">

          {/* CLIENTE */}

          <h2>Datos del cliente</h2>

          <div className="row">

            <div className="field-container">

              <label htmlFor="nombre">
                Nombre *
              </label>

              <input
                id="nombre"
                name="nombre"
                placeholder="Nombre *"
                value={form.nombre}
                onChange={handleChange}
                onBlur={() =>
                  validarCampo("nombre")
                }
                className={
                  errores.nombre
                    ? "input-error"
                    : ""
                }
                maxLength={100}
              />

              <ErrorCampo nombre="nombre" />

            </div>

            <div className="field-container">

              <label htmlFor="apellidos">
                Apellidos *
              </label>

              <input
                id="apellidos"
                name="apellidos"
                placeholder="Apellidos *"
                value={form.apellidos}
                onChange={handleChange}
                onBlur={() =>
                  validarCampo("apellidos")
                }
                className={
                  errores.apellidos
                    ? "input-error"
                    : ""
                }
                maxLength={100}
              />

              <ErrorCampo nombre="apellidos" />

            </div>

          </div>

          <div className="row">

            <div className="field-container">

              <label htmlFor="rut">
                RUT *
              </label>

              <input
                id="rut"
                name="rut"
                placeholder="Ej: 12.345.678-5"
                value={form.rut}
                onChange={handleChange}
                onBlur={() =>
                  validarCampo("rut")
                }
                className={
                  errores.rut
                    ? "input-error"
                    : ""
                }
                maxLength={12}
              />

              <ErrorCampo nombre="rut" />

            </div>

            <div className="field-container">

              <label htmlFor="telefono">
                Celular *
              </label>

              <input
                id="telefono"
                name="telefono"
                placeholder="Ej: +56 9 1234 5678"
                value={form.telefono}
                onChange={handleChange}
                onBlur={() =>
                  validarCampo("telefono")
                }
                className={
                  errores.telefono
                    ? "input-error"
                    : ""
                }
                maxLength={16}
              />

              <ErrorCampo nombre="telefono" />

            </div>

          </div>

          <div className="field-container">

            <label htmlFor="email">
              Correo electrónico *
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Correo electrónico *"
              value={form.email}
              onChange={handleChange}
              onBlur={() =>
                validarCampo("email")
              }
              className={
                errores.email
                  ? "input-error"
                  : ""
              }
              maxLength={150}
            />

            <ErrorCampo nombre="email" />

          </div>

          {/* =================================================
              FACTURACIÓN
          ================================================= */}

          <h2>
            Información de facturación
          </h2>

          <div className="field-container">

            <label htmlFor="fact-nombre">
              Nombre de facturación *
            </label>

            <input
              id="fact-nombre"
              name="nombre"
              placeholder="Nombre de facturación *"
              value={
                form.facturacion.nombre
              }
              onChange={
                handleFacturacionChange
              }
              onBlur={() =>
                validarCampo(
                  "facturacion.nombre"
                )
              }
              className={
                errores[
                  "facturacion.nombre"
                ]
                  ? "input-error"
                  : ""
              }
              maxLength={100}
            />

            <ErrorCampo nombre="facturacion.nombre" />

          </div>

          <div className="row">

            <div className="field-container">

              <label htmlFor="fact-rut">
                RUT de facturación *
              </label>

              <input
                id="fact-rut"
                name="rut"
                placeholder="RUT de facturación *"
                value={
                  form.facturacion.rut
                }
                onChange={
                  handleFacturacionChange
                }
                onBlur={() =>
                  validarCampo(
                    "facturacion.rut"
                  )
                }
                className={
                  errores[
                    "facturacion.rut"
                  ]
                    ? "input-error"
                    : ""
                }
                maxLength={12}
              />

              <ErrorCampo nombre="facturacion.rut" />

            </div>

            <div className="field-container">

              <label htmlFor="fact-numero">
                Número *
              </label>

              <input
                id="fact-numero"
                name="numero"
                placeholder="Número *"
                value={
                  form.facturacion.numero
                }
                onChange={
                  handleFacturacionChange
                }
                onBlur={() =>
                  validarCampo(
                    "facturacion.numero"
                  )
                }
                className={
                  errores[
                    "facturacion.numero"
                  ]
                    ? "input-error"
                    : ""
                }
                maxLength={7}
              />

              <ErrorCampo nombre="facturacion.numero" />

            </div>

          </div>

          <div className="field-container">

            <label htmlFor="fact-direccion">
              Dirección / calle *
            </label>

            <input
              id="fact-direccion"
              name="direccion"
              placeholder="Dirección / calle *"
              value={
                form.facturacion.direccion
              }
              onChange={
                handleFacturacionChange
              }
              onBlur={() =>
                validarCampo(
                  "facturacion.direccion"
                )
              }
              className={
                errores[
                  "facturacion.direccion"
                ]
                  ? "input-error"
                  : ""
              }
              maxLength={150}
            />

            <ErrorCampo nombre="facturacion.direccion" />

          </div>

          <div className="field-container">

            <label htmlFor="fact-depto">
              Departamento / oficina (opcional)
            </label>

            <input
              id="fact-depto"
              name="departamento"
              placeholder="Depto / oficina (opcional)"
              value={
                form.facturacion
                  .departamento
              }
              onChange={
                handleFacturacionChange
              }
              onBlur={() =>
                validarCampo(
                  "facturacion.departamento"
                )
              }
              className={
                errores[
                  "facturacion.departamento"
                ]
                  ? "input-error"
                  : ""
              }
              maxLength={20}
            />

            <ErrorCampo nombre="facturacion.departamento" />

          </div>

          <div className="row">

            <div className="field-container">

              <label htmlFor="fact-region">
                Región *
              </label>

              <select
                id="fact-region"
                name="region"
                value={
                  form.facturacion.region
                }
                onChange={
                  handleFacturacionChange
                }
                onBlur={() =>
                  validarCampo(
                    "facturacion.region"
                  )
                }
                className={
                  errores[
                    "facturacion.region"
                  ]
                    ? "input-error"
                    : ""
                }
              >

                <option value="">
                  Selecciona una región
                </option>

                {REGIONES.map(
                  (region) => (
                    <option
                      key={region}
                      value={region}
                    >
                      {region}
                    </option>
                  )
                )}

              </select>

              <ErrorCampo nombre="facturacion.region" />

            </div>

            <div className="field-container">

              <label htmlFor="fact-comuna">
                Comuna *
              </label>

              <select
                id="fact-comuna"
                name="comuna"
                value={
                  form.facturacion.comuna
                }
                onChange={
                  handleFacturacionChange
                }
                onBlur={() =>
                  validarCampo(
                    "facturacion.comuna"
                  )
                }
                disabled={
                  !form.facturacion.region
                }
                className={
                  errores[
                    "facturacion.comuna"
                  ]
                    ? "input-error"
                    : ""
                }
              >

                <option value="">
                  {form.facturacion.region
                    ? "Selecciona una comuna"
                    : "Primero elige una región"}
                </option>

                {comunasFacturacion.map(
                  (comuna) => (
                    <option
                      key={comuna}
                      value={comuna}
                    >
                      {comuna}
                    </option>
                  )
                )}

              </select>

              <ErrorCampo nombre="facturacion.comuna" />

            </div>

          </div>

          {/* =================================================
              ENVÍO
          ================================================= */}

          <h2>Datos de envío</h2>

          <label className="account">

            <input
              type="checkbox"
              checked={mismosDatos}
              onChange={
                handleMismosDatos
              }
            />

            Enviar a la misma dirección de facturación

          </label>

          {!mismosDatos && (
            <>

              <div className="field-container">

                <label htmlFor="env-nombreReceptor">
                  Nombre de quien recibe *
                </label>

                <input
                  id="env-nombreReceptor"
                  name="nombreReceptor"
                  placeholder="Nombre de quien recibe *"
                  value={
                    form.envio
                      .nombreReceptor
                  }
                  onChange={
                    handleEnvioChange
                  }
                  onBlur={() =>
                    validarCampo(
                      "envio.nombreReceptor"
                    )
                  }
                  className={
                    errores[
                      "envio.nombreReceptor"
                    ]
                      ? "input-error"
                      : ""
                  }
                  maxLength={100}
                />

                <ErrorCampo nombre="envio.nombreReceptor" />

              </div>

              <div className="field-container">

                <label htmlFor="env-telefono">
                  Celular de contacto *
                </label>

                <input
                  id="env-telefono"
                  name="telefono"
                  placeholder="Ej: +56 9 1234 5678"
                  value={
                    form.envio.telefono
                  }
                  onChange={
                    handleEnvioChange
                  }
                  onBlur={() =>
                    validarCampo(
                      "envio.telefono"
                    )
                  }
                  className={
                    errores[
                      "envio.telefono"
                    ]
                      ? "input-error"
                      : ""
                  }
                  maxLength={16}
                />

                <ErrorCampo nombre="envio.telefono" />

              </div>

              <div className="field-container">

                <label htmlFor="env-direccion">
                  Dirección / calle *
                </label>

                <input
                  id="env-direccion"
                  name="direccion"
                  placeholder="Dirección / calle *"
                  value={
                    form.envio.direccion
                  }
                  onChange={
                    handleEnvioChange
                  }
                  onBlur={() =>
                    validarCampo(
                      "envio.direccion"
                    )
                  }
                  className={
                    errores[
                      "envio.direccion"
                    ]
                      ? "input-error"
                      : ""
                  }
                  maxLength={150}
                />

                <ErrorCampo nombre="envio.direccion" />

              </div>

              <div className="row">

                <div className="field-container">

                  <label htmlFor="env-numero">
                    Número *
                  </label>

                  <input
                    id="env-numero"
                    name="numero"
                    placeholder="Número *"
                    value={
                      form.envio.numero
                    }
                    onChange={
                      handleEnvioChange
                    }
                    onBlur={() =>
                      validarCampo(
                        "envio.numero"
                      )
                    }
                    className={
                      errores[
                        "envio.numero"
                      ]
                        ? "input-error"
                        : ""
                    }
                    maxLength={7}
                  />

                  <ErrorCampo nombre="envio.numero" />

                </div>

                <div className="field-container">

                  <label htmlFor="env-depto">
                    Departamento (opcional)
                  </label>

                  <input
                    id="env-depto"
                    name="departamento"
                    placeholder="Depto / oficina (opcional)"
                    value={
                      form.envio
                        .departamento
                    }
                    onChange={
                      handleEnvioChange
                    }
                    onBlur={() =>
                      validarCampo(
                        "envio.departamento"
                      )
                    }
                    className={
                      errores[
                        "envio.departamento"
                      ]
                        ? "input-error"
                        : ""
                    }
                    maxLength={20}
                  />

                  <ErrorCampo nombre="envio.departamento" />

                </div>

              </div>

              <div className="row">

                <div className="field-container">

                  <label htmlFor="env-region">
                    Región *
                  </label>

                  <select
                    id="env-region"
                    name="region"
                    value={
                      form.envio.region
                    }
                    onChange={
                      handleEnvioChange
                    }
                    onBlur={() =>
                      validarCampo(
                        "envio.region"
                      )
                    }
                    className={
                      errores[
                        "envio.region"
                      ]
                        ? "input-error"
                        : ""
                    }
                  >

                    <option value="">
                      Selecciona una región
                    </option>

                    {REGIONES.map(
                      (region) => (
                        <option
                          key={region}
                          value={region}
                        >
                          {region}
                        </option>
                      )
                    )}

                  </select>

                  <ErrorCampo nombre="envio.region" />

                </div>

                <div className="field-container">

                  <label htmlFor="env-comuna">
                    Comuna *
                  </label>

                  <select
                    id="env-comuna"
                    name="comuna"
                    value={
                      form.envio.comuna
                    }
                    onChange={
                      handleEnvioChange
                    }
                    onBlur={() =>
                      validarCampo(
                        "envio.comuna"
                      )
                    }
                    disabled={
                      !form.envio.region
                    }
                    className={
                      errores[
                        "envio.comuna"
                      ]
                        ? "input-error"
                        : ""
                    }
                  >

                    <option value="">
                      {form.envio.region
                        ? "Selecciona una comuna"
                        : "Primero elige una región"}
                    </option>

                    {comunasEnvio.map(
                      (comuna) => (
                        <option
                          key={comuna}
                          value={comuna}
                        >
                          {comuna}
                        </option>
                      )
                    )}

                  </select>

                  <ErrorCampo nombre="envio.comuna" />

                </div>

              </div>

            </>
          )}

          <div className="field-container">

            <label htmlFor="env-indicaciones">
              Indicaciones para la entrega (opcional)
            </label>

            <textarea
              id="env-indicaciones"
              name="indicaciones"
              placeholder="Ej: Dejar en conserjería, tocar timbre 2 veces..."
              value={
                form.envio.indicaciones
              }
              onChange={
                handleEnvioChange
              }
              onBlur={() =>
                validarCampo(
                  "envio.indicaciones"
                )
              }
              className={
                errores[
                  "envio.indicaciones"
                ]
                  ? "input-error"
                  : ""
              }
              maxLength={250}
              rows={3}
            />

            <ErrorCampo nombre="envio.indicaciones" />

          </div>

          {/* =================================================
              OPCIONES DE ENVÍO
          ================================================= */}

          {zonaEnvio && (
            <div className="shipping-options">

              <h2>Opciones de envío</h2>

              {zonaEnvio === "verde" && (
                <p>
                  Tu comuna pertenece a las
                  <strong> comunas verdes</strong>.
                  Puedes elegir entre Logística 360
                  o Bluexpress.
                </p>
              )}

              {zonaEnvio === "azul" && (
                <p>
                  Tu comuna pertenece a las
                  <strong> comunas azules</strong>.
                  El envío disponible es Bluexpress
                  por pagar.
                </p>
              )}

              {zonaEnvio === "fuera" && (
                <p>
                  Hacemos despacho a
                  <strong> todo Chile</strong> a
                  través de Chilexpress por pagar.
                </p>
              )}

              <div className="shipping-methods">

                {/* LOGÍSTICA 360 */}

                {zonaEnvio === "verde" && (
                  <label
                    className={`shipping-method ${
                      metodoEnvio ===
                      "logistica360"
                        ? "selected"
                        : ""
                    }`}
                  >

                    <input
                      type="radio"
                      name="metodoEnvio"
                      value="logistica360"
                      checked={
                        metodoEnvio ===
                        "logistica360"
                      }
                      onChange={() =>
                        handleMetodoEnvio(
                          "logistica360"
                        )
                      }
                    />

                    <span>
                      <strong>
                        Logística 360
                      </strong>

                      <small>
                        $3.490
                      </small>
                    </span>

                  </label>
                )}

                {/* BLUEXPRESS */}

                {(zonaEnvio === "verde" ||
                  zonaEnvio === "azul") && (
                  <label
                    className={`shipping-method ${
                      metodoEnvio ===
                      "bluexpress"
                        ? "selected"
                        : ""
                    }`}
                  >

                    <input
                      type="radio"
                      name="metodoEnvio"
                      value="bluexpress"
                      checked={
                        metodoEnvio ===
                        "bluexpress"
                      }
                      onChange={() =>
                        handleMetodoEnvio(
                          "bluexpress"
                        )
                      }
                    />

                    <span>

                      <strong>
                        Bluexpress
                      </strong>

                      <small>
                        Por pagar
                      </small>

                    </span>

                  </label>
                )}

                {/* CHILEXPRESS (COMUNAS FUERA DE SANTIAGO) - POR PAGAR */}

                {zonaEnvio === "fuera" && (
                  <label
                    className={`shipping-method ${
                      metodoEnvio ===
                      "chilexpress"
                        ? "selected"
                        : ""
                    }`}
                  >

                    <input
                      type="radio"
                      name="metodoEnvio"
                      value="chilexpress"
                      checked={
                        metodoEnvio ===
                        "chilexpress"
                      }
                      onChange={() =>
                        handleMetodoEnvio(
                          "chilexpress"
                        )
                      }
                    />

                    <span>

                      <strong>
                        Chilexpress
                      </strong>

                      <small>
                        Por pagar
                      </small>

                    </span>

                  </label>
                )}

              </div>

              {errores.metodoEnvio && (
                <small className="field-error">
                  {errores.metodoEnvio}
                </small>
              )}

            </div>
          )}

        </section>

        {/* =================================================
            RESUMEN
        ================================================= */}

        <aside className="order">

          <h2>
            Resumen del pedido
          </h2>

          <div className="order-header">

            <span>
              Productos
            </span>

            <span>
              {cart.reduce(
                (acc, item) =>
                  acc + item.quantity,
                0
              )}
            </span>

          </div>

          {cart.length === 0 ? (
            <p>
              Tu carrito está vacío
            </p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="order-item"
              >

                <span>
                  {item.name} x
                  {item.quantity}
                </span>

                <span>
                  $
                  {(
                    item.price *
                    item.quantity
                  ).toLocaleString(
                    "es-CL"
                  )}
                </span>

              </div>
            ))
          )}

          <div className="line"></div>

          {/* SUBTOTAL */}

          <div className="total">

            <span>
              Subtotal
            </span>

            <span>
              $
              {totalProductos.toLocaleString(
                "es-CL"
              )}
            </span>

          </div>

          {/* ENVÍO */}

          {metodoEnvio && (
            <div className="total">

              <span>
                Envío
              </span>

              <span>

                {metodoEnvio ===
                "logistica360"
                  ? `$${COSTO_LOGISTICA_360.toLocaleString(
                      "es-CL"
                    )}`
                  : metodoEnvio ===
                    "chilexpress"
                  ? "Chilexpress por pagar"
                  : "Bluexpress por pagar"}

              </span>

            </div>
          )}

          <div className="line"></div>

          {/* TOTAL FINAL */}

          <div className="total final">

            <span>
              Total
            </span>

            <span>
              $
              {totalFinal.toLocaleString(
                "es-CL"
              )}
            </span>

          </div>

          <button
            type="button"
            onClick={finishOrder}
            disabled={
              enviando ||
              cart.length === 0
            }
          >
            {enviando
              ? "Procesando..."
              : "Pagar con Webpay"}
          </button>

        </aside>

      </div>

    </main>
  );
}

export default Checkout;