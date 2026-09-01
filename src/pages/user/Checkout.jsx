import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import { getMe } from "../../services/authService";
import "../../css/Checkout.css";
import SavedAddressPicker from "../../components/organisms/SavedAddressPicker.jsx";
import {
  getMyAddresses,
  createAddress,
  deleteAddress,
} from "../../services/addressService.js";

import {
  COMUNAS_POR_REGION,
  REGIONES,
} from "../../data/comunasChile.js";

import {
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
} from "../../utils/checkoutValidacion.js";


// =====================================================
// COMPONENTE
// =====================================================

function Checkout() {
  const navigate = useNavigate();
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
  // DIRECCIONES GUARDADAS
  // ===================================================

  const [
    direccionesGuardadas,
    setDireccionesGuardadas,
  ] = useState([]);

  const [modoDireccion, setModoDireccion] =
    useState("nueva");

  const [
    direccionSeleccionadaId,
    setDireccionSeleccionadaId,
  ] = useState(null);

  const [
    guardarNuevaDireccion,
    setGuardarNuevaDireccion,
  ] = useState(false);

  const [
    nombreNuevaDireccion,
    setNombreNuevaDireccion,
  ] = useState("");

  useEffect(() => {
    if (!user) return;

    getMyAddresses()
      .then((data) => {
        setDireccionesGuardadas(data);

        if (data.length > 0) {
          setModoDireccion("guardada");
        }
      })
      .catch(() => {
        // Si falla, el checkout sigue funcionando
        // normal con el formulario manual.
      });
  }, [user]);

  // Salvaguarda: si en algún momento quedan 0 direcciones
  // guardadas pero el modo sigue en "guardada", no habría
  // nada que mostrar (ni el picker ni el formulario). Se
  // vuelve a "nueva" automáticamente.
  useEffect(() => {
    if (
      modoDireccion === "guardada" &&
      direccionesGuardadas.length === 0
    ) {
      setModoDireccion("nueva");
    }
  }, [modoDireccion, direccionesGuardadas]);

  function seleccionarDireccionGuardada(
    direccion
  ) {
    setDireccionSeleccionadaId(
      direccion._id
    );

    setMismosDatos(false);

    setForm((prev) => ({
      ...prev,
      rut: direccion.rut
        ? formatearRut(direccion.rut)
        : prev.rut,
      facturacion: {
        nombre: direccion.nombreReceptor,
        rut: direccion.rut
          ? formatearRut(direccion.rut)
          : prev.facturacion.rut,
        direccion: direccion.direccion,
        numero: direccion.numero,
        departamento:
          direccion.departamento || "",
        region: direccion.region,
        comuna: direccion.comuna,
      },
      envio: {
        nombreReceptor:
          direccion.nombreReceptor,
        telefono: direccion.telefono,
        direccion: direccion.direccion,
        numero: direccion.numero,
        departamento:
          direccion.departamento || "",
        region: direccion.region,
        comuna: direccion.comuna,
        indicaciones:
          direccion.indicaciones || "",
      },
    }));
  }

  async function eliminarDireccionGuardada(
    direccion
  ) {
    if (
      !confirm(
        `¿Eliminar la dirección "${direccion.nombre}"?`
      )
    ) {
      return;
    }

    try {
      await deleteAddress(direccion._id);

      setDireccionesGuardadas((prev) => {
        const restantes = prev.filter(
          (d) => d._id !== direccion._id
        );

        // Si esa era la última dirección guardada,
        // no queda nada que mostrar en modo "guardada":
        // se vuelve a modo "nueva" para que aparezca
        // el formulario completo de nuevo.
        if (restantes.length === 0) {
          setModoDireccion("nueva");
        }

        return restantes;
      });

      if (
        direccionSeleccionadaId ===
        direccion._id
      ) {
        setDireccionSeleccionadaId(null);
      }
    } catch (err) {
      alert(
        err.message ||
          "No se pudo eliminar la dirección"
      );
    }
  }

  // Los datos de envío "reales" para este pedido: si
  // "mismosDatos" está marcado, son una copia de la
  // facturación; si no, son los campos de envío propios.
  function obtenerDatosEnvioActuales() {
    if (mismosDatos) {
      return {
        nombreReceptor:
          `${form.nombre} ${form.apellidos}`.trim(),
        telefono: form.telefono,
        direccion: form.facturacion.direccion,
        numero: form.facturacion.numero,
        departamento:
          form.facturacion.departamento,
        region: form.facturacion.region,
        comuna: form.facturacion.comuna,
        indicaciones:
          form.envio.indicaciones,
      };
    }

    return form.envio;
  }

  // ===================================================
  // ESTADOS
  // ===================================================

  const [errores, setErrores] = useState({});
  const [continuando, setContinuando] = useState(false);
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
  // AUTOCOMPLETAR FACTURACIÓN CON LA PRIMERA DIRECCIÓN GUARDADA
  // ===================================================

  const facturacionAutocompletada = useRef(false);

  useEffect(() => {
    if (
      !user ||
      facturacionAutocompletada.current ||
      direccionesGuardadas.length === 0
    ) {
      return;
    }

    const direccion = direccionesGuardadas[0];

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
            direccion.nombreReceptor || "",
          rut: direccion.rut
            ? formatearRut(direccion.rut)
            : prev.facturacion.rut,
          direccion:
            direccion.direccion || "",
          numero: direccion.numero || "",
          departamento:
            direccion.departamento || "",
          region: direccion.region || "",
          comuna: direccion.comuna || "",
        },
      };
    });
  }, [user, direccionesGuardadas]);

  // ===================================================
  // AUTOCOMPLETAR DATOS DEL CLIENTE DESDE EL PERFIL
  // ===================================================
  // Siempre que haya sesión iniciada, se rellenan solos
  // (el cliente igual los puede editar para este pedido).

  const clienteAutocompletado = useRef(false);

  useEffect(() => {
    if (!user || clienteAutocompletado.current) {
      return;
    }

    getMe()
      .then((perfil) => {
        clienteAutocompletado.current = true;

        setForm((prev) => {
          if (
            prev.nombre ||
            prev.apellidos ||
            prev.rut ||
            prev.telefono
          ) {
            return prev;
          }

          const nombreCompleto = (
            perfil?.nombre || ""
          ).trim();

          const espacio =
            nombreCompleto.indexOf(" ");

          const nombre =
            espacio === -1
              ? nombreCompleto
              : nombreCompleto.slice(
                  0,
                  espacio
                );

          const apellidos =
            espacio === -1
              ? ""
              : nombreCompleto.slice(
                  espacio + 1
                );

          return {
            ...prev,
            nombre,
            apellidos,
            rut: formatearRut(
              perfil?.rut || ""
            ),
            telefono: perfil?.telefono || "",
          };
        });
      })
      .catch(() => {
        // Si falla, el cliente completa los datos a mano
      });
  }, [user]);

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

  const continuarAlPago = () => {
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

    setContinuando(true);

    const datosEnvio = resultado.datosEnvio;

    const datosCheckout = {
      nombre: `${normalizarEspacios(
        form.nombre
      )} ${normalizarEspacios(
        form.apellidos
      )}`.trim(),

      email: limpiarTexto(
        form.email
      ).toLowerCase(),

      rut: limpiarRut(form.rut),

      telefono: normalizarTelefono(
        form.telefono
      ),

      facturacion: {
        nombre: normalizarEspacios(
          form.facturacion.nombre
        ),
        rut: limpiarRut(
          form.facturacion.rut
        ),
        direccion: normalizarEspacios(
          form.facturacion.direccion
        ),
        numero: limpiarTexto(
          form.facturacion.numero
        ),
        departamento: limpiarTexto(
          form.facturacion.departamento
        ),
        region: limpiarTexto(
          form.facturacion.region
        ),
        comuna: normalizarEspacios(
          form.facturacion.comuna
        ),
      },

      envio: {
        nombreReceptor: normalizarEspacios(
          datosEnvio.nombreReceptor
        ),
        telefono: normalizarTelefono(
          datosEnvio.telefono
        ),
        direccion: normalizarEspacios(
          datosEnvio.direccion
        ),
        numero: limpiarTexto(
          datosEnvio.numero
        ),
        departamento: limpiarTexto(
          datosEnvio.departamento
        ),
        region: limpiarTexto(
          datosEnvio.region
        ),
        comuna: normalizarEspacios(
          datosEnvio.comuna
        ),
        indicaciones: normalizarEspacios(
          datosEnvio.indicaciones
        ),
      },

      totalProductos,

      guardarNuevaDireccion:
        modoDireccion === "nueva" &&
        guardarNuevaDireccion &&
        Boolean(nombreNuevaDireccion.trim()),

      nombreNuevaDireccion:
        nombreNuevaDireccion.trim(),
    };

    navigate("/checkout/pago", {
      state: { datosCheckout },
    });
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

      <h1>¿A dónde enviamos tu pedido?</h1>

      {errorGeneral && (
        <div className="checkout-error">
          {errorGeneral}
        </div>
      )}

      <div className="checkout-container checkout-container-single">

        {/* =================================================
            FORMULARIO
        ================================================= */}

        <section className="billing">

          {user &&
            direccionesGuardadas.length > 0 && (
              <SavedAddressPicker
                direcciones={
                  direccionesGuardadas
                }
                modo={modoDireccion}
                setModo={setModoDireccion}
                direccionSeleccionadaId={
                  direccionSeleccionadaId
                }
                onSelect={
                  seleccionarDireccionGuardada
                }
                onDelete={
                  eliminarDireccionGuardada
                }
              />
            )}

          {modoDireccion === "nueva" && (
            <>

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
                Número de domicilio *
              </label>

              <input
                id="fact-numero"
                name="numero"
                placeholder="Número de domicilio *"
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
                    Número de domicilio *
                  </label>

                  <input
                    id="env-numero"
                    name="numero"
                    placeholder="Número de domicilio *"
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

            </>
          )}

          {modoDireccion === "guardada" &&
            direccionSeleccionadaId && (
              <p className="checkout-address-summary">
                ✅ Usaremos tus datos guardados
                para este pedido.
              </p>
            )}

          <button
            type="button"
            className="checkout-continue-btn"
            onClick={continuarAlPago}
            disabled={
              continuando ||
              cart.length === 0 ||
              (modoDireccion === "guardada" &&
                !direccionSeleccionadaId)
            }
          >
            {continuando
              ? "Cargando..."
              : "Continuar"}
          </button>

        </section>

      </div>

    </main>
  );
}

export default Checkout;