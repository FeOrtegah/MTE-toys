import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import { createOrder } from "../../services/api";
import {
  initWebpayTransaction,
  redirectToWebpay,
} from "../../services/webpayService";
import "../../css/Checkout.css";

// =====================================================
// REGIONES Y COMUNAS DE CHILE
// =====================================================

const COMUNAS_POR_REGION = {
  "Arica y Parinacota": ["Arica", "Camarones", "General Lagos", "Putre"],
  "Tarapacá": ["Alto Hospicio", "Camiña", "Colchane", "Huara", "Iquique", "Pica", "Pozo Almonte"],
  "Antofagasta": ["Antofagasta", "Calama", "María Elena", "Mejillones", "Ollagüe", "San Pedro de Atacama", "Sierra Gorda", "Taltal", "Tocopilla"],
  "Atacama": ["Alto del Carmen", "Caldera", "Chañaral", "Copiapó", "Diego de Almagro", "Freirina", "Huasco", "Tierra Amarilla", "Vallenar"],
  "Coquimbo": ["Andacollo", "Canela", "Combarbalá", "Coquimbo", "Illapel", "La Higuera", "La Serena", "Los Vilos", "Monte Patria", "Ovaile", "Paihuano", "Punitaqui", "Río Hurtado", "Salamanca", "Vicuña"],
  "Valparaíso": ["Algarrobo", "Cabildo", "Calera", "Calle Larga", "Cartagena", "Casablanca", "Catemu", "Concón", "El Quisco", "El Tabo", "Hijuelas", "Isla de Pascua", "Juan Fernández", "La Cruz", "La Ligua", "Limache", "Llaillay", "Los Andes", "Nogales", "Olmué", "Panquehue", "Papudo", "Petorca", "Puchuncaví", "Putaendo", "Quillota", "Quilpué", "Quintero", "Rinconada", "San Antonio", "San Esteban", "San Felipe", "Santa María", "Santo Domingo", "Valparaíso", "Villa Alemana", "Viña del Mar"],
  "Metropolitana de Santiago": ["Alhué", "Buin", "Calera de Tango", "Cerrillos", "Cerro Navia", "Colina", "Conchalí", "Curacaví", "El Bosque", "El Monte", "Estación Central", "Huechuraba", "Independencia", "Isla de Maipo", "La Cisterna", "La Florida", "La Granja", "Lampa", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "María Pinto", "Melipilla", "Ñuñoa", "Padre Hurtado", "Paine", "Pedro Aguirre Cerda", "Peñaflor", "Peñalolén", "Pirque", "Providencia", "Pudahuel", "Puente Alto", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Bernardo", "San Joaquín", "San José de Maipo", "San Miguel", "San Pedro", "San Ramón", "Santiago", "Talagante", "Tiltil", "Vitacura"],
  "O'Higgins": ["Codegua", "Coínco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rancagua", "Rengo", "Requínoa", "San Vicente", "La Estrella", "Litueche", "Marchigüe", "Navidad", "Paredones", "Pichilemu", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "San Fernando", "Santa Cruz"],
  "Maule": ["Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Colbún", "Linares", "Longaví", "Parral", "San Javier", "Villa Alegre", "Yerbas Buenas", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Talca"],
  "Ñuble": ["Bulnes", "Chillán", "Chillán Viejo", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay", "Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Quirihue", "Ranquil", "Trehuaco", "Coihueco", "San Carlos", "San Fabián", "San Nicolás"],
  "Biobío": ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"],
  "La Araucanía": ["Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Temuco", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"],
  "Los Ríos": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"],
  "Los Lagos": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"],
  "Aysén": ["Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"],
  "Magallanes y de la Antártica Chilena": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"],
};

const REGIONES = Object.keys(COMUNAS_POR_REGION);

// =====================================================
// FUNCIONES DE NORMALIZACIÓN Y VALIDACIÓN
// =====================================================

const limpiarTexto = (valor) => String(valor || "").trim();
const normalizarEspacios = (valor) => limpiarTexto(valor).replace(/\s+/g, " ");

const limpiarRut = (rut) => {
  return String(rut || "")
    .replace(/\./g, "")
    .replace(/-/g, "")
    .replace(/\s/g, "")
    .toUpperCase();
};

const validarRut = (rut) => {
  const limpio = limpiarRut(rut);
  if (!/^\d{7,8}[0-9K]$/.test(limpio)) return false;

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);

  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador > 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const resultado = 11 - resto;

  let dvEsperado = "0";
  if (resultado === 10) dvEsperado = "K";
  else if (resultado !== 11) dvEsperado = String(resultado);

  return dv === dvEsperado;
};

const formatearRut = (rut) => {
  const limpio = limpiarRut(rut);
  if (!limpio) return "";

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

const limpiarTelefono = (telefono) => String(telefono || "").replace(/[\s()-]/g, "");

const validarTelefono = (telefono) => {
  const limpio = limpiarTelefono(telefono);
  return /^(?:\+?56)?9\d{8}$/.test(limpio);
};

const normalizarTelefono = (telefono) => {
  const limpio = limpiarTelefono(telefono);
  if (limpio.startsWith("+56")) return limpio;
  if (limpio.startsWith("56")) return `+${limpio}`;
  if (/^9\d{8}$/.test(limpio)) return `+56${limpio}`;
  return limpio;
};

const validarNombre = (valor, campo) => {
  const texto = normalizarEspacios(valor);
  if (!texto) return `${campo} es obligatorio`;
  if (texto.length < 2) return `${campo} debe tener al menos 2 caracteres`;
  if (texto.length > 100) return `${campo} es demasiado largo`;
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]+$/.test(texto)) return `${campo} solo puede contener letras`;
  if (/^(.)\1+$/.test(texto.replace(/\s/g, "").toLowerCase())) return `${campo} no es válido`;
  return "";
};

const validarEmail = (email) => {
  const texto = limpiarTexto(email).toLowerCase();
  if (!texto) return "El correo electrónico es obligatorio";
  if (texto.length > 150) return "El correo electrónico es demasiado largo";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(texto)) return "Ingresa un correo electrónico válido";
  return "";
};

const validarDireccion = (direccion) => {
  const texto = normalizarEspacios(direccion);
  if (!texto) return "La dirección es obligatoria";
  if (texto.length < 3) return "La dirección es demasiado corta";
  if (texto.length > 150) return "La dirección es demasiado larga";
  if (/^\d+$/.test(texto)) return "Ingresa el nombre de la calle o avenida";
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9 .#\/'-]+$/.test(texto)) return "La dirección contiene caracteres no válidos";
  return "";
};

const validarNumero = (numero) => {
  const texto = limpiarTexto(numero);
  if (!texto) return "El número es obligatorio";
  if (!/^\d{1,6}[A-Za-z]?$/.test(texto)) return "Número no válido";
  return "";
};

const validarDepartamento = (departamento) => {
  const texto = limpiarTexto(departamento);
  if (!texto) return "";
  if (texto.length > 20) return "Demasiado largo";
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9 .#\/'-]+$/.test(texto)) return "Caracteres no válidos";
  return "";
};

const validarIndicaciones = (indicaciones) => {
  const texto = limpiarTexto(indicaciones);
  if (texto.length > 250) return "Máximo 250 caracteres";
  return "";
};

const validarRegion = (region) => {
  if (!region) return "Selecciona una región";
  if (!REGIONES.includes(region)) return "Región no válida";
  return "";
};

const validarComuna = (region, comuna) => {
  if (!comuna) return "Selecciona una comuna";
  if (!region || !REGIONES.includes(region)) return "Selecciona región primero";
  const comunasValidas = COMUNAS_POR_REGION[region] || [];
  if (!comunasValidas.includes(comuna)) return "Comuna no corresponde a la región";
  return "";
};

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

function Checkout() {
  const { cart, total } = useCart();
  const { user } = useUser();

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
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState("");

  useEffect(() => {
    if (user?.email && !form.email) {
      setForm((prev) => ({ ...prev, email: user.email }));
    }
  }, [user, form.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let nuevoValor = value;

    if (name === "nombre" || name === "apellidos") {
      nuevoValor = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]/g, "");
    }
    if (name === "rut") {
      nuevoValor = formatearRut(value);
    }
    if (name === "telefono") {
      nuevoValor = value.replace(/[^0-9+ ]/g, "");
    }

    setForm((prev) => {
      const nuevoForm = { ...prev, [name]: nuevoValor };
      if (mismosDatos && (name === "nombre" || name === "apellidos" || name === "telefono")) {
        nuevoForm.envio = {
          ...nuevoForm.envio,
          nombreReceptor: `${nuevoForm.nombre} ${nuevoForm.apellidos}`.trim(),
          telefono: nuevoForm.telefono,
        };
      }
      return nuevoForm;
    });

    setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFacturacionChange = (e) => {
    const { name, value } = e.target;
    let nuevoValor = value;

    if (name === "nombre") {
      nuevoValor = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]/g, "");
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
        ...(name === "region" ? { comuna: "" } : {}),
      };

      const nuevoForm = {
        ...prev,
        facturacion: nuevaFacturacion,
      };

      if (mismosDatos) {
        nuevoForm.envio = {
          ...nuevoForm.envio,
          direccion: nuevaFacturacion.direccion,
          numero: nuevaFacturacion.numero,
          departamento: nuevaFacturacion.departamento,
          region: nuevaFacturacion.region,
          comuna: nuevaFacturacion.comuna,
        };
      }

      return nuevoForm;
    });

    setErrores((prev) => ({
      ...prev,
      [`facturacion.${name}`]: "",
      ...(name === "region" ? { "facturacion.comuna": "" } : {}),
    }));
  };

  const handleEnvioChange = (e) => {
    const { name, value } = e.target;
    let nuevoValor = value;

    if (name === "nombreReceptor") {
      nuevoValor = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]/g, "");
    }
    if (name === "telefono") {
      nuevoValor = value.replace(/[^0-9+ ]/g, "");
    }
    if (name === "numero") {
      nuevoValor = value.replace(/[^0-9A-Za-z]/g, "");
    }

    setForm((prev) => ({
      ...prev,
      envio: {
        ...prev.envio,
        [name]: nuevoValor,
        ...(name === "region" ? { comuna: "" } : {}),
      },
    }));

    setErrores((prev) => ({
      ...prev,
      [`envio.${name}`]: "",
      ...(name === "region" ? { "envio.comuna": "" } : {}),
    }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Cliente
    const errorNombre = validarNombre(form.nombre, "El nombre");
    if (errorNombre) nuevosErrores.nombre = errorNombre;

    const errorApellidos = validarNombre(form.apellidos, "Los apellidos");
    if (errorApellidos) nuevosErrores.apellidos = errorApellidos;

    if (!validarRut(form.rut)) nuevosErrores.rut = "El RUT no es válido";

    const errorEmail = validarEmail(form.email);
    if (errorEmail) nuevosErrores.email = errorEmail;

    if (!validarTelefono(form.telefono)) nuevosErrores.telefono = "Ingresa un celular chileno válido";

    // Facturación
    const f = form.facturacion;
    const errorNombreFact = validarNombre(f.nombre, "El nombre de facturación");
    if (errorNombreFact) nuevosErrores["facturacion.nombre"] = errorNombreFact;

    if (!validarRut(f.rut)) nuevosErrores["facturacion.rut"] = "El RUT de facturación no es válido";

    const errorDirFact = validarDireccion(f.direccion);
    if (errorDirFact) nuevosErrores["facturacion.direccion"] = errorDirFact;

    const errorNumFact = validarNumero(f.numero);
    if (errorNumFact) nuevosErrores["facturacion.numero"] = errorNumFact;

    const errorDeptoFact = validarDepartamento(f.departamento);
    if (errorDeptoFact) nuevosErrores["facturacion.departamento"] = errorDeptoFact;

    const errorRegFact = validarRegion(f.region);
    if (errorRegFact) nuevosErrores["facturacion.region"] = errorRegFact;

    const errorComFact = validarComuna(f.region, f.comuna);
    if (errorComFact) nuevosErrores["facturacion.comuna"] = errorComFact;

    // Envío
    const e = mismosDatos
      ? {
          nombreReceptor: `${form.nombre} ${form.apellidos}`.trim(),
          telefono: form.telefono,
          direccion: f.direccion,
          numero: f.numero,
          departamento: f.departamento,
          region: f.region,
          comuna: f.comuna,
          indicaciones: form.envio.indicaciones,
        }
      : form.envio;

    const errorNomRec = validarNombre(e.nombreReceptor, "El nombre del receptor");
    if (errorNomRec) nuevosErrores["envio.nombreReceptor"] = errorNomRec;

    if (!validarTelefono(e.telefono)) nuevosErrores["envio.telefono"] = "Ingresa un celular chileno válido";

    const errorDirEnv = validarDireccion(e.direccion);
    if (errorDirEnv) nuevosErrores["envio.direccion"] = errorDirEnv;

    const errorNumEnv = validarNumero(e.numero);
    if (errorNumEnv) nuevosErrores["envio.numero"] = errorNumEnv;

    const errorDeptoEnv = validarDepartamento(e.departamento);
    if (errorDeptoEnv) nuevosErrores["envio.departamento"] = errorDeptoEnv;

    const errorRegEnv = validarRegion(e.region);
    if (errorRegEnv) nuevosErrores["envio.region"] = errorRegEnv;

    const errorComEnv = validarComuna(e.region, e.comuna);
    if (errorComEnv) nuevosErrores["envio.comuna"] = errorComEnv;

    const errorInd = validarIndicaciones(e.indicaciones);
    if (errorInd) nuevosErrores["envio.indicaciones"] = errorInd;

    setErrores(nuevosErrores);

    return {
      valido: Object.keys(nuevosErrores).length === 0,
      datosEnvio: e,
    };
  };

  const validarCampo = (campo) => {
    const nuevosErrores = { ...errores };
    let error = "";

    if (campo === "nombre") error = validarNombre(form.nombre, "El nombre");
    if (campo === "apellidos") error = validarNombre(form.apellidos, "Los apellidos");
    if (campo === "rut") error = validarRut(form.rut) ? "" : "El RUT no es válido";
    if (campo === "email") error = validarEmail(form.email);
    if (campo === "telefono") error = validarTelefono(form.telefono) ? "" : "Ingresa un celular chileno válido";

    if (campo.startsWith("facturacion.")) {
      const subcampo = campo.split(".")[1];
      const val = form.facturacion[subcampo];

      if (subcampo === "nombre") error = validarNombre(val, "El nombre de facturación");
      if (subcampo === "rut") error = validarRut(val) ? "" : "El RUT de facturación no es válido";
      if (subcampo === "direccion") error = validarDireccion(val);
      if (subcampo === "numero") error = validarNumero(val);
      if (subcampo === "departamento") error = validarDepartamento(val);
      if (subcampo === "region") error = validarRegion(val);
      if (subcampo === "comuna") error = validarComuna(form.facturacion.region, val);
    }

    if (campo.startsWith("envio.")) {
      const subcampo = campo.split(".")[1];
      const val = form.envio[subcampo];

      if (subcampo === "nombreReceptor") error = validarNombre(val, "El nombre del receptor");
      if (subcampo === "telefono") error = validarTelefono(val) ? "" : "Ingresa un celular chileno válido";
      if (subcampo === "direccion") error = validarDireccion(val);
      if (subcampo === "numero") error = validarNumero(val);
      if (subcampo === "departamento") error = validarDepartamento(val);
      if (subcampo === "region") error = validarRegion(val);
      if (subcampo === "comuna") error = validarComuna(form.envio.region, val);
      if (subcampo === "indicaciones") error = validarIndicaciones(val);
    }

    nuevosErrores[campo] = error;
    setErrores(nuevosErrores);
  };

  const handleMismosDatos = (e) => {
    const checked = e.target.checked;
    setMismosDatos(checked);

    if (checked) {
      setForm((prev) => ({
        ...prev,
        envio: {
          nombreReceptor: `${prev.nombre} ${prev.apellidos}`.trim(),
          telefono: prev.telefono,
          direccion: prev.facturacion.direccion,
          numero: prev.facturacion.numero,
          departamento: prev.facturacion.departamento,
          region: prev.facturacion.region,
          comuna: prev.facturacion.comuna,
          indicaciones: "",
        },
      }));
    }
  };

  const finishOrder = async () => {
    setErrorGeneral("");

    if (cart.length === 0) {
      setErrorGeneral("Tu carrito está vacío");
      return;
    }

    const resultado = validarFormulario();

    if (!resultado.valido) {
      setErrorGeneral("Revisa los campos marcados en rojo antes de continuar.");
      setTimeout(() => {
        const primerError = document.querySelector(".field-error");
        if (primerError) {
          primerError.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 50);
      return;
    }

    setEnviando(true);

    try {
      const datosEnvio = resultado.datosEnvio;

      const orderData = {
        cliente: {
          nombre: `${normalizarEspacios(form.nombre)} ${normalizarEspacios(form.apellidos)}`.trim(),
          email: limpiarTexto(form.email).toLowerCase(),
          rut: limpiarRut(form.rut),
          telefono: normalizarTelefono(form.telefono),
          facturacion: {
            nombre: normalizarEspacios(form.facturacion.nombre),
            rut: limpiarRut(form.facturacion.rut),
            direccion: normalizarEspacios(form.facturacion.direccion),
            numero: limpiarTexto(form.facturacion.numero),
            departamento: limpiarTexto(form.facturacion.departamento),
            region: limpiarTexto(form.facturacion.region),
            comuna: limpiarTexto(form.facturacion.comuna),
          },
          envio: {
            nombreReceptor: normalizarEspacios(datosEnvio.nombreReceptor),
            telefono: normalizarTelefono(datosEnvio.telefono),
            direccion: normalizarEspacios(datosEnvio.direccion),
            numero: limpiarTexto(datosEnvio.numero),
            departamento: limpiarTexto(datosEnvio.departamento),
            region: limpiarTexto(datosEnvio.region),
            comuna: limpiarTexto(datosEnvio.comuna),
            indicaciones: normalizarEspacios(datosEnvio.indicaciones),
          },
        },
        items: cart.map((item) => ({
          producto: item.id || item._id,
          cantidad: item.quantity,
        })),
      };

      const pedido = await createOrder(orderData);
      const { url, token } = await initWebpayTransaction(pedido._id);

      redirectToWebpay(url, token);
    } catch (err) {
      console.error("Error en checkout:", err);
      setErrorGeneral(err.message || "Ocurrió un error al procesar tu pedido");
      setEnviando(false);
    }
  };

  const ErrorCampo = ({ nombre }) => {
    if (!errores[nombre]) return null;
    return <span className="field-error">{errores[nombre]}</span>;
  };

  return (
    <main className="checkout-page">
      <h1>Finalizar compra</h1>

      {errorGeneral && <div className="checkout-error">{errorGeneral}</div>}

      <div className="checkout-container">
        {/* =================================================
            COLUMNA IZQUIERDA: FORMULARIO (billing)
        ================================================= */}
        <section className="billing">
          {/* CLIENTE */}
          <h2>Datos del cliente</h2>

          <div className="row">
            <div className="field-container">
              <input
                name="nombre"
                placeholder="Nombre *"
                value={form.nombre}
                onChange={handleChange}
                onBlur={() => validarCampo("nombre")}
                className={errores.nombre ? "input-error" : ""}
                maxLength={100}
              />
              <ErrorCampo nombre="nombre" />
            </div>

            <div className="field-container">
              <input
                name="apellidos"
                placeholder="Apellidos *"
                value={form.apellidos}
                onChange={handleChange}
                onBlur={() => validarCampo("apellidos")}
                className={errores.apellidos ? "input-error" : ""}
                maxLength={100}
              />
              <ErrorCampo nombre="apellidos" />
            </div>
          </div>

          <div className="row">
            <div className="field-container">
              <input
                name="rut"
                placeholder="RUT * Ej: 12.345.678-5"
                value={form.rut}
                onChange={handleChange}
                onBlur={() => validarCampo("rut")}
                className={errores.rut ? "input-error" : ""}
                maxLength={12}
              />
              <ErrorCampo nombre="rut" />
            </div>

            <div className="field-container">
              <input
                name="telefono"
                placeholder="Celular * Ej: +56 9 1234 5678"
                value={form.telefono}
                onChange={handleChange}
                onBlur={() => validarCampo("telefono")}
                className={errores.telefono ? "input-error" : ""}
                maxLength={16}
              />
              <ErrorCampo nombre="telefono" />
            </div>
          </div>

          <div className="field-container">
            <input
              name="email"
              type="email"
              placeholder="Correo electrónico *"
              value={form.email}
              onChange={handleChange}
              onBlur={() => validarCampo("email")}
              className={errores.email ? "input-error" : ""}
              maxLength={150}
            />
            <ErrorCampo nombre="email" />
          </div>

          {/* FACTURACIÓN */}
          <div className="line"></div>
          <h2>Información de facturación</h2>

          <div className="field-container">
            <input
              name="nombre"
              placeholder="Nombre de facturación *"
              value={form.facturacion.nombre}
              onChange={handleFacturacionChange}
              onBlur={() => validarCampo("facturacion.nombre")}
              className={errores["facturacion.nombre"] ? "input-error" : ""}
              maxLength={100}
            />
            <ErrorCampo nombre="facturacion.nombre" />
          </div>

          <div className="row">
            <div className="field-container">
              <input
                name="rut"
                placeholder="RUT de facturación *"
                value={form.facturacion.rut}
                onChange={handleFacturacionChange}
                onBlur={() => validarCampo("facturacion.rut")}
                className={errores["facturacion.rut"] ? "input-error" : ""}
                maxLength={12}
              />
              <ErrorCampo nombre="facturacion.rut" />
            </div>

            <div className="field-container">
              <input
                name="numero"
                placeholder="Número *"
                value={form.facturacion.numero}
                onChange={handleFacturacionChange}
                onBlur={() => validarCampo("facturacion.numero")}
                className={errores["facturacion.numero"] ? "input-error" : ""}
                maxLength={7}
              />
              <ErrorCampo nombre="facturacion.numero" />
            </div>
          </div>

          <div className="row">
            <div className="field-container">
              <input
                name="direccion"
                placeholder="Dirección / calle *"
                value={form.facturacion.direccion}
                onChange={handleFacturacionChange}
                onBlur={() => validarCampo("facturacion.direccion")}
                className={errores["facturacion.direccion"] ? "input-error" : ""}
                maxLength={150}
              />
              <ErrorCampo nombre="facturacion.direccion" />
            </div>

            <div className="field-container">
              <input
                name="departamento"
                placeholder="Dpto / Block (opcional)"
                value={form.facturacion.departamento}
                onChange={handleFacturacionChange}
                onBlur={() => validarCampo("facturacion.departamento")}
                className={errores["facturacion.departamento"] ? "input-error" : ""}
                maxLength={20}
              />
              <ErrorCampo nombre="facturacion.departamento" />
            </div>
          </div>

          <div className="row">
            <div className="field-container">
              <select
                name="region"
                value={form.facturacion.region}
                onChange={handleFacturacionChange}
                onBlur={() => validarCampo("facturacion.region")}
                className={errores["facturacion.region"] ? "input-error" : ""}
              >
                <option value="">Selecciona una región *</option>
                {REGIONES.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
              <ErrorCampo nombre="facturacion.region" />
            </div>

            <div className="field-container">
              <select
                name="comuna"
                value={form.facturacion.comuna}
                onChange={handleFacturacionChange}
                onBlur={() => validarCampo("facturacion.comuna")}
                className={errores["facturacion.comuna"] ? "input-error" : ""}
                disabled={!form.facturacion.region}
              >
                <option value="">
                  {form.facturacion.region ? "Selecciona comuna *" : "Selecciona región primero"}
                </option>
                {(COMUNAS_POR_REGION[form.facturacion.region] || []).map((com) => (
                  <option key={com} value={com}>
                    {com}
                  </option>
                ))}
              </select>
              <ErrorCampo nombre="facturacion.comuna" />
            </div>
          </div>

          {/* OPCIÓN MISMOS DATOS */}
          <div className="account">
            <input
              type="checkbox"
              id="mismosDatos"
              checked={mismosDatos}
              onChange={handleMismosDatos}
            />
            <label htmlFor="mismosDatos">Usar los mismos datos para el envío</label>
          </div>

          {/* ENVÍO */}
          {!mismosDatos && (
            <div className="envio-section">
              <div className="line"></div>
              <h2>Información de envío</h2>

              <div className="row">
                <div className="field-container">
                  <input
                    name="nombreReceptor"
                    placeholder="Nombre del receptor *"
                    value={form.envio.nombreReceptor}
                    onChange={handleEnvioChange}
                    onBlur={() => validarCampo("envio.nombreReceptor")}
                    className={errores["envio.nombreReceptor"] ? "input-error" : ""}
                    maxLength={100}
                  />
                  <ErrorCampo nombre="envio.nombreReceptor" />
                </div>

                <div className="field-container">
                  <input
                    name="telefono"
                    placeholder="Teléfono receptor *"
                    value={form.envio.telefono}
                    onChange={handleEnvioChange}
                    onBlur={() => validarCampo("envio.telefono")}
                    className={errores["envio.telefono"] ? "input-error" : ""}
                    maxLength={16}
                  />
                  <ErrorCampo nombre="envio.telefono" />
                </div>
              </div>

              <div className="row">
                <div className="field-container">
                  <input
                    name="direccion"
                    placeholder="Dirección *"
                    value={form.envio.direccion}
                    onChange={handleEnvioChange}
                    onBlur={() => validarCampo("envio.direccion")}
                    className={errores["envio.direccion"] ? "input-error" : ""}
                    maxLength={150}
                  />
                  <ErrorCampo nombre="envio.direccion" />
                </div>

                <div className="field-container">
                  <input
                    name="numero"
                    placeholder="Número *"
                    value={form.envio.numero}
                    onChange={handleEnvioChange}
                    onBlur={() => validarCampo("envio.numero")}
                    className={errores["envio.numero"] ? "input-error" : ""}
                    maxLength={7}
                  />
                  <ErrorCampo nombre="envio.numero" />
                </div>
              </div>

              <div className="row">
                <div className="field-container">
                  <input
                    name="departamento"
                    placeholder="Dpto / Block (opcional)"
                    value={form.envio.departamento}
                    onChange={handleEnvioChange}
                    onBlur={() => validarCampo("envio.departamento")}
                    className={errores["envio.departamento"] ? "input-error" : ""}
                    maxLength={20}
                  />
                  <ErrorCampo nombre="envio.departamento" />
                </div>

                <div className="field-container">
                  <select
                    name="region"
                    value={form.envio.region}
                    onChange={handleEnvioChange}
                    onBlur={() => validarCampo("envio.region")}
                    className={errores["envio.region"] ? "input-error" : ""}
                  >
                    <option value="">Selecciona una región *</option>
                    {REGIONES.map((reg) => (
                      <option key={reg} value={reg}>
                        {reg}
                      </option>
                    ))}
                  </select>
                  <ErrorCampo nombre="envio.region" />
                </div>
              </div>

              <div className="row">
                <div className="field-container">
                  <select
                    name="comuna"
                    value={form.envio.comuna}
                    onChange={handleEnvioChange}
                    onBlur={() => validarCampo("envio.comuna")}
                    className={errores["envio.comuna"] ? "input-error" : ""}
                    disabled={!form.envio.region}
                  >
                    <option value="">
                      {form.envio.region ? "Selecciona comuna *" : "Selecciona región primero"}
                    </option>
                    {(COMUNAS_POR_REGION[form.envio.region] || []).map((com) => (
                      <option key={com} value={com}>
                        {com}
                      </option>
                    ))}
                  </select>
                  <ErrorCampo nombre="envio.comuna" />
                </div>
              </div>

              <div className="field-container">
                <textarea
                  name="indicaciones"
                  placeholder="Indicaciones adicionales de entrega (opcional)"
                  value={form.envio.indicaciones}
                  onChange={handleEnvioChange}
                  onBlur={() => validarCampo("envio.indicaciones")}
                  className={errores["envio.indicaciones"] ? "input-error" : ""}
                  maxLength={250}
                />
                <ErrorCampo nombre="envio.indicaciones" />
              </div>
            </div>
          )}
        </section>

        {/* =================================================
            COLUMNA DERECHA: RESUMEN DE COMPRA (order)
        ================================================= */}
        <section className="order">
          <h2>Tu pedido</h2>

          <div className="order-header">
            <strong>Producto</strong>
            <strong>Subtotal</strong>
          </div>

          <div className="line"></div>

          {cart.map((item) => (
            <div key={item.id || item._id} className="order-item">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toLocaleString("es-CL")}</span>
            </div>
          ))}

          <div className="line"></div>

          <div className="total">
            <span>Subtotal</span>
            <span>${total.toLocaleString("es-CL")}</span>
          </div>

          <div className="total final">
            <span>Total</span>
            <span>${total.toLocaleString("es-CL")}</span>
          </div>

          <button
            type="button"
            onClick={finishOrder}
            disabled={enviando}
          >
            {enviando ? "Procesando..." : "Realizar el pedido"}
          </button>
        </section>
      </div>
    </main>
  );
}

export default Checkout;