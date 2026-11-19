// Guarda, solo durante esta sesión del navegador, los datos que un
// invitado escribió en el checkout, para ofrecerle crear una cuenta
// con todo ya rellenado al terminar la compra (también sobrevive al
// ir y volver de Webpay). Se borra al crear la cuenta.

const CLAVE = "mte_datos_compra_invitado";

export function guardarDatosInvitado(datosCheckout) {
  try {
    const e = datosCheckout.envio || {};

    sessionStorage.setItem(
      CLAVE,
      JSON.stringify({
        nombre: datosCheckout.nombre || "",
        email: datosCheckout.email || "",
        rut: datosCheckout.rut || "",
        telefono: datosCheckout.telefono || "",
        direccion: {
          direccion: e.direccion || "",
          numero: e.numero || "",
          departamento: e.departamento || "",
          region: e.region || "",
          comuna: e.comuna || "",
          indicaciones: e.indicaciones || "",
          nombreReceptor: e.nombreReceptor || "",
          telefono: e.telefono || "",
        },
      })
    );
  } catch {
    // Sin almacenamiento disponible: simplemente no se ofrece el atajo
  }
}

export function leerDatosInvitado() {
  try {
    const raw = sessionStorage.getItem(CLAVE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function borrarDatosInvitado() {
  try {
    sessionStorage.removeItem(CLAVE);
  } catch {
    // nada
  }
}
