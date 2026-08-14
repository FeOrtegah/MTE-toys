import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import { createOrder } from "../../services/api";
import {
  initWebpayTransaction,
  redirectToWebpay,
} from "../../services/webpayService";
import "../../css/Checkout.css";

function Checkout() {
  const { cart, total } = useCart();
  const { user } = useUser();

  const [form, setForm] = useState({
    nombre: "",
    email: user?.email || "",
    rut: "",
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

  const [usarMismosDatos, setUsarMismosDatos] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // CAMBIAR DATOS PRINCIPALES
  // =====================================================

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // =====================================================
  // CAMBIAR FACTURACIÓN
  // =====================================================

  function handleFacturacionChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      facturacion: {
        ...prev.facturacion,
        [name]: value,
      },
    }));
  }

  // =====================================================
  // CAMBIAR ENVÍO
  // =====================================================

  function handleEnvioChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      envio: {
        ...prev.envio,
        [name]: value,
      },
    }));
  }

  // =====================================================
  // COPIAR FACTURACIÓN A ENVÍO
  // =====================================================

  function handleMismosDatos(e) {
    const checked = e.target.checked;

    setUsarMismosDatos(checked);

    if (checked) {
      setForm((prev) => ({
        ...prev,
        envio: {
          nombreReceptor: prev.facturacion.nombre,
          telefono: prev.telefono,
          direccion: prev.facturacion.direccion,
          numero: prev.facturacion.numero,
          departamento: prev.facturacion.departamento,
          region: prev.facturacion.region,
          comuna: prev.facturacion.comuna,
          indicaciones: prev.envio.indicaciones,
        },
      }));
    }
  }

  // =====================================================
  // VALIDACIÓN FRONTEND
  // =====================================================

  function validarFormulario() {
    if (cart.length === 0) {
      return "Tu carrito está vacío";
    }

    if (!form.nombre.trim()) {
      return "Ingresa tu nombre";
    }

    if (!form.email.trim()) {
      return "Ingresa tu correo electrónico";
    }

    if (!form.rut.trim()) {
      return "Ingresa tu RUT";
    }

    if (!form.telefono.trim()) {
      return "Ingresa tu teléfono";
    }

    // -------------------------------
    // FACTURACIÓN
    // -------------------------------

    if (!form.facturacion.nombre.trim()) {
      return "Ingresa el nombre de facturación";
    }

    if (!form.facturacion.rut.trim()) {
      return "Ingresa el RUT de facturación";
    }

    if (!form.facturacion.direccion.trim()) {
      return "Ingresa la dirección de facturación";
    }

    if (!form.facturacion.numero.trim()) {
      return "Ingresa el número de la dirección de facturación";
    }

    if (!form.facturacion.region.trim()) {
      return "Ingresa la región de facturación";
    }

    if (!form.facturacion.comuna.trim()) {
      return "Ingresa la comuna de facturación";
    }

    // -------------------------------
    // ENVÍO
    // -------------------------------

    if (!form.envio.nombreReceptor.trim()) {
      return "Ingresa el nombre del receptor";
    }

    if (!form.envio.telefono.trim()) {
      return "Ingresa el teléfono de envío";
    }

    if (!form.envio.direccion.trim()) {
      return "Ingresa la dirección de envío";
    }

    if (!form.envio.numero.trim()) {
      return "Ingresa el número de la dirección de envío";
    }

    if (!form.envio.region.trim()) {
      return "Ingresa la región de envío";
    }

    if (!form.envio.comuna.trim()) {
      return "Ingresa la comuna de envío";
    }

    return null;
  }

  // =====================================================
  // CREAR PEDIDO
  // =====================================================

  async function finishOrder() {
    const errorValidacion = validarFormulario();

    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setError("");
    setEnviando(true);

    try {
      // =================================================
      // DATOS QUE RECIBE EXACTAMENTE EL BACKEND
      // =================================================

      const orderData = {
        cliente: {
          nombre: form.nombre.trim(),
          email: form.email.trim().toLowerCase(),
          rut: form.rut.trim(),
          telefono: form.telefono.trim(),

          facturacion: {
            nombre: form.facturacion.nombre.trim(),
            rut: form.facturacion.rut.trim(),
            direccion: form.facturacion.direccion.trim(),
            numero: form.facturacion.numero.trim(),
            departamento: form.facturacion.departamento.trim(),
            region: form.facturacion.region.trim(),
            comuna: form.facturacion.comuna.trim(),
          },

          envio: {
            nombreReceptor: form.envio.nombreReceptor.trim(),
            telefono: form.envio.telefono.trim(),
            direccion: form.envio.direccion.trim(),
            numero: form.envio.numero.trim(),
            departamento: form.envio.departamento.trim(),
            region: form.envio.region.trim(),
            comuna: form.envio.comuna.trim(),
            indicaciones: form.envio.indicaciones.trim(),
          },
        },

        items: cart.map((item) => ({
          producto: item.id,
          cantidad: item.quantity,
        })),
      };

      console.log("Datos enviados al backend:", orderData);

      // =================================================
      // CREAR PEDIDO
      // =================================================

      const pedido = await createOrder(orderData);

      // =================================================
      // INICIAR WEBPAY
      // =================================================

      const { url, token } =
        await initWebpayTransaction(pedido._id);

      // =================================================
      // REDIRIGIR A WEBPAY
      // =================================================

      redirectToWebpay(url, token);
    } catch (err) {
      console.error("Error en checkout:", err);

      setError(
        err?.message ||
          "Ocurrió un error al procesar tu pedido"
      );

      setEnviando(false);
    }
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="checkout-page">

      <h1>Finalizar compra</h1>

      {error && (
        <p className="checkout-error">
          {error}
        </p>
      )}

      <div className="checkout-container">

        {/* =================================================
            FACTURACIÓN Y ENVÍO
        ================================================= */}

        <section className="billing">

          <h2>Datos del cliente</h2>

          <div className="row">

            <input
              name="nombre"
              type="text"
              placeholder="Nombre *"
              value={form.nombre}
              onChange={handleChange}
            />

            <input
              name="rut"
              type="text"
              placeholder="RUT *"
              value={form.rut}
              onChange={handleChange}
            />

          </div>

          <div className="row">

            <input
              name="email"
              type="email"
              placeholder="Correo electrónico *"
              value={form.email}
              onChange={handleChange}
            />

            <input
              name="telefono"
              type="tel"
              placeholder="Teléfono *"
              value={form.telefono}
              onChange={handleChange}
            />

          </div>


          {/* =================================================
              FACTURACIÓN
          ================================================= */}

          <h2>Información de facturación</h2>

          <input
            name="nombre"
            type="text"
            placeholder="Nombre o razón social *"
            value={form.facturacion.nombre}
            onChange={handleFacturacionChange}
          />

          <div className="row">

            <input
              name="rut"
              type="text"
              placeholder="RUT de facturación *"
              value={form.facturacion.rut}
              onChange={handleFacturacionChange}
            />

            <input
              name="departamento"
              type="text"
              placeholder="Departamento / casa / oficina"
              value={form.facturacion.departamento}
              onChange={handleFacturacionChange}
            />

          </div>

          <div className="row">

            <input
              name="direccion"
              type="text"
              placeholder="Dirección *"
              value={form.facturacion.direccion}
              onChange={handleFacturacionChange}
            />

            <input
              name="numero"
              type="text"
              placeholder="Número *"
              value={form.facturacion.numero}
              onChange={handleFacturacionChange}
            />

          </div>

          <div className="row">

            <input
              name="region"
              type="text"
              placeholder="Región *"
              value={form.facturacion.region}
              onChange={handleFacturacionChange}
            />

            <input
              name="comuna"
              type="text"
              placeholder="Comuna *"
              value={form.facturacion.comuna}
              onChange={handleFacturacionChange}
            />

          </div>


          {/* =================================================
              ENVÍO
          ================================================= */}

          <h2>Información de envío</h2>

          <label className="account">

            <input
              type="checkbox"
              checked={usarMismosDatos}
              onChange={handleMismosDatos}
            />

            Usar los mismos datos para el envío

          </label>


          <input
            name="nombreReceptor"
            type="text"
            placeholder="Nombre del receptor *"
            value={form.envio.nombreReceptor}
            onChange={handleEnvioChange}
          />

          <div className="row">

            <input
              name="telefono"
              type="tel"
              placeholder="Teléfono de envío *"
              value={form.envio.telefono}
              onChange={handleEnvioChange}
            />

            <input
              name="departamento"
              type="text"
              placeholder="Departamento / casa / oficina"
              value={form.envio.departamento}
              onChange={handleEnvioChange}
            />

          </div>

          <div className="row">

            <input
              name="direccion"
              type="text"
              placeholder="Dirección de envío *"
              value={form.envio.direccion}
              onChange={handleEnvioChange}
            />

            <input
              name="numero"
              type="text"
              placeholder="Número *"
              value={form.envio.numero}
              onChange={handleEnvioChange}
            />

          </div>

          <div className="row">

            <input
              name="region"
              type="text"
              placeholder="Región *"
              value={form.envio.region}
              onChange={handleEnvioChange}
            />

            <input
              name="comuna"
              type="text"
              placeholder="Comuna *"
              value={form.envio.comuna}
              onChange={handleEnvioChange}
            />

          </div>


          <textarea
            name="indicaciones"
            placeholder="Indicaciones para la entrega (opcional)"
            value={form.envio.indicaciones}
            onChange={handleEnvioChange}
          />

        </section>


        {/* =================================================
            ORDEN
        ================================================= */}

        <section className="order">

          <h2>Tu orden</h2>

          <div className="order-header">
            <span>Producto</span>
            <span>Subtotal</span>
          </div>


          {cart.map((item) => (

            <div
              className="order-item"
              key={item.id}
            >

              <span>
                {item.name} × {item.quantity}
              </span>

              <span>
                $
                {(
                  item.price * item.quantity
                ).toLocaleString("es-CL")}
              </span>

            </div>

          ))}


          <div className="line"></div>


          <div className="total">

            <span>Subtotal</span>

            <span>
              $
              {total().toLocaleString("es-CL")}
            </span>

          </div>


          <div className="total">

            <span>Envío</span>

            <span>
              Envío gratis
            </span>

          </div>


          <div className="total final">

            <span>Total</span>

            <span>
              $
              {total().toLocaleString("es-CL")}
            </span>

          </div>


          <button
            type="button"
            onClick={finishOrder}
            disabled={enviando}
          >

            {enviando
              ? "Procesando..."
              : "Realizar pedido"}

          </button>

        </section>

      </div>

    </main>
  );
}

export default Checkout;