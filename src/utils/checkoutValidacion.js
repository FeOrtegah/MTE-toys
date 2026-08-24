// =====================================================
// VALIDACIÓN Y NORMALIZACIÓN — CHECKOUT
// =====================================================
// Extraído de Checkout.jsx para reducir su tamaño.
// Son funciones puras, sin dependencias de React.

import { REGIONES, COMUNAS_POR_REGION } from "../data/comunasChile.js";

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

export {
  limpiarTexto,
  normalizarEspacios,
  limpiarRut,
  validarRut,
  formatearRut,
  limpiarTelefono,
  validarTelefono,
  normalizarTelefono,
  validarNombre,
  validarEmail,
  validarDireccion,
  validarNumero,
  validarDepartamento,
  validarIndicaciones,
  validarRegion,
  validarComuna,
};