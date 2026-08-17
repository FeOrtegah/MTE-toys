// =====================================================
// CONFIGURACIÓN DE ENVÍOS MTE TOYS
// =====================================================

export const COMUNAS_VERDES = [
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

export const COMUNAS_AZULES = [
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

export const COSTO_LOGISTICA_360 = 3490;

export const METODOS_ENVIO = {
  LOGISTICA_360: "logistica360",
  BLUEXPRESS: "bluexpress",
};

// =====================================================
// OBTENER ZONA
// =====================================================

export const obtenerZonaComuna = (comuna) => {
  if (COMUNAS_VERDES.includes(comuna)) {
    return "verde";
  }

  if (COMUNAS_AZULES.includes(comuna)) {
    return "azul";
  }

  return null;
};

// =====================================================
// OBTENER OPCIONES DISPONIBLES
// =====================================================

export const obtenerMetodosEnvio = (comuna) => {
  const zona = obtenerZonaComuna(comuna);

  // Comunas verdes
  if (zona === "verde") {
    return [
      {
        id: METODOS_ENVIO.LOGISTICA_360,
        nombre: "Logística 360",
        precio: COSTO_LOGISTICA_360,
        descripcion: "$3.490",
      },
      {
        id: METODOS_ENVIO.BLUEXPRESS,
        nombre: "Bluexpress",
        precio: 0,
        descripcion: "Por pagar",
      },
    ];
  }

  // Comunas azules
  if (zona === "azul") {
    return [
      {
        id: METODOS_ENVIO.BLUEXPRESS,
        nombre: "Bluexpress",
        precio: 0,
        descripcion: "Por pagar",
      },
    ];
  }

  return [];
};

// =====================================================
// OBTENER COSTO
// =====================================================

export const obtenerCostoEnvio = (comuna, metodo) => {
  const metodos = obtenerMetodosEnvio(comuna);

  const seleccionado = metodos.find(
    (item) => item.id === metodo
  );

  return seleccionado?.precio || 0;
};

// =====================================================
// VALIDAR MÉTODO
// =====================================================

export const validarMetodoEnvio = (
  comuna,
  metodo
) => {
  const metodos = obtenerMetodosEnvio(comuna);

  return metodos.some(
    (item) => item.id === metodo
  );
};