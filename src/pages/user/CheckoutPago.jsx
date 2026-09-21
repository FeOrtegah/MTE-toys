import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import { createOrder } from "../../services/api";
import {
  initWebpayTransaction,
  redirectToWebpay,
} from "../../services/webpayService";
import { createAddress } from "../../services/addressService.js";
import "../../css/Checkout.css";
import OrderSummary from "../../components/organisms/OrderSummary.jsx";
import ShippingOptions from "../../components/organisms/ShippingOptions.jsx";
import {
  COMUNAS_VERDES,
  COMUNAS_AZULES,
  COSTO_LOGISTICA_360,
  NOMBRES_METODO_ENVIO,
  METODOS_POR_ZONA,
} from "../../data/comunasChile.js";

// =====================================================
// PÁGINA 2 DEL CHECKOUT: ENVÍO Y PAGO
// =====================================================
// Recibe los datos ya validados de la página 1 (cliente,
// facturación, dirección de envío) por navegación de
// React Router. Si alguien llega acá directo (sin pasar
// por la página 1), lo mandamos de vuelta.

function CheckoutPago() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const { user } = useUser();

  const datosCheckout = location.state?.datosCheckout;

  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  const [metodoEnvio, setMetodoEnvio] = useState("");
  const [metodoPago, setMetodoPago] = useState("webpay");

  const totalProductos = datosCheckout?.totalProductos || 0;

  // Si TODOS los productos del carrito tienen envío
  // gratis marcado desde el admin, se elimina por
  // completo la selección de método de envío.
  const todosConEnvioGratis =
    cart.length > 0 &&
    cart.every((item) => item.envioGratis);

  const zonaEnvio = useMemo(() => {
    const comuna = datosCheckout?.envio?.comuna;

    if (!comuna) {
      return null;
    }

    if (COMUNAS_VERDES.includes(comuna)) {
      return "verde";
    }

    if (COMUNAS_AZULES.includes(comuna)) {
      return "azul";
    }

    return "fuera";
  }, [datosCheckout]);

  const envioGratisSoloLogistica =
    (zonaEnvio === "verde" || zonaEnvio === "azul") &&
    totalProductos >= 49990;

  const costoEnvio = useMemo(() => {
    if (todosConEnvioGratis) {
      return 0;
    }

    const envioGratisPorMonto =
      totalProductos >= 49990 &&
      (zonaEnvio === "verde" || zonaEnvio === "azul");

    if (metodoEnvio === "logistica360") {
      return envioGratisPorMonto ? 0 : COSTO_LOGISTICA_360;
    }

    return 0;
  }, [
    metodoEnvio,
    totalProductos,
    zonaEnvio,
    todosConEnvioGratis,
  ]);

  const totalFinal = totalProductos + costoEnvio;

  useEffect(() => {
    if (todosConEnvioGratis) {
      if (metodoEnvio !== "envio_gratis") {
        setMetodoEnvio("envio_gratis");
      }
      return;
    }

    if (envioGratisSoloLogistica) {
      if (metodoEnvio !== "logistica360") {
        setMetodoEnvio("logistica360");
      }
      return;
    }

    const disponibles = METODOS_POR_ZONA[zonaEnvio] || [];

    if (!disponibles.includes(metodoEnvio)) {
      setMetodoEnvio("");
    }
  }, [
    zonaEnvio,
    metodoEnvio,
    envioGratisSoloLogistica,
    todosConEnvioGratis,
  ]);

  function handleMetodoEnvio(metodo) {
    if (todosConEnvioGratis) {
      return;
    }

    if (envioGratisSoloLogistica) {
      return;
    }

    const disponibles = METODOS_POR_ZONA[zonaEnvio] || [];

    if (!disponibles.includes(metodo)) {
      return;
    }

    setMetodoEnvio(metodo);
  }

  if (!datosCheckout) {
    return (
      <main className="checkout-page">
        <h1>Faltan datos de tu pedido</h1>

        <p>
          Vuelve al paso anterior para completar tus
          datos de envío.
        </p>

        <button
          type="button"
          onClick={() => navigate("/checkout")}
        >
          Volver
        </button>
      </main>
    );
  }

  async function finishOrder() {
    setErrorGeneral("");

    if (cart.length === 0) {
      setErrorGeneral("Tu carrito está vacío");
      return;
    }

    if (!zonaEnvio) {
      setErrorGeneral(
        "No pudimos calcular tu zona de envío, vuelve al paso anterior."
      );
      return;
    }

    const disponibles = todosConEnvioGratis
      ? ["envio_gratis"]
      : envioGratisSoloLogistica
      ? ["logistica360"]
      : METODOS_POR_ZONA[zonaEnvio] || [];

    if (!disponibles.includes(metodoEnvio)) {
      setErrorGeneral("Selecciona un método de envío");
      return;
    }

    setEnviando(true);

    try {
      const orderData = {
        cliente: {
          nombre: datosCheckout.nombre,
          email: datosCheckout.email,
          rut: datosCheckout.rut,
          telefono: datosCheckout.telefono,
          facturacion: datosCheckout.facturacion,
          envio: datosCheckout.envio,
        },

        items: cart.map((item) => ({
          producto: item.id,
          cantidad: item.quantity,
        })),

        metodoEnvio: NOMBRES_METODO_ENVIO[metodoEnvio] || null,
        metodoPago,
        costoEnvio,
        totalProductos,
        total: totalFinal,
      };

      const pedido = await createOrder(orderData);

      if (
        user &&
        datosCheckout.guardarNuevaDireccion &&
        datosCheckout.nombreNuevaDireccion
      ) {
        try {
          await createAddress({
            nombre: datosCheckout.nombreNuevaDireccion,
            nombreReceptor:
              datosCheckout.envio.nombreReceptor,
            rut: datosCheckout.rut,
            telefono: datosCheckout.envio.telefono,
            direccion: datosCheckout.envio.direccion,
            numero: datosCheckout.envio.numero,
            departamento:
              datosCheckout.envio.departamento,
            region: datosCheckout.envio.region,
            comuna: datosCheckout.envio.comuna,
            indicaciones:
              datosCheckout.envio.indicaciones,
          });
        } catch (err) {
          console.error(
            "No se pudo guardar la dirección:",
            err
          );
        }
      }

      if (metodoPago === "transferencia") {
        navigate("/pago-transferencia", {
          state: { pedido },
        });

        return;
      }

      const { url, token } = await initWebpayTransaction(
        pedido._id,
        pedido.accessToken
      );

      redirectToWebpay(url, token);
    } catch (err) {
      console.error("Error en checkout:", err);

      setErrorGeneral(
        err.message ||
          "Ocurrió un error al procesar tu pedido"
      );

      setEnviando(false);
    }
  }

  return (
    <main className="checkout-page">
      <h1>Envío y pago</h1>

      {errorGeneral && (
        <div className="checkout-error">
          {errorGeneral}
        </div>
      )}

      <div className="checkout-container">
        <section className="billing">
          <ShippingOptions
            zonaEnvio={zonaEnvio}
            envioGratisSoloLogistica={
              envioGratisSoloLogistica
            }
            todosConEnvioGratis={todosConEnvioGratis}
            metodoEnvio={metodoEnvio}
            handleMetodoEnvio={handleMetodoEnvio}
            errores={{}}
          />
        </section>

        <OrderSummary
          cart={cart}
          totalProductos={totalProductos}
          metodoEnvio={metodoEnvio}
          metodoPago={metodoPago}
          setMetodoPago={setMetodoPago}
          costoEnvio={costoEnvio}
          totalFinal={totalFinal}
          enviando={enviando}
          onFinishOrder={finishOrder}
        />
      </div>
    </main>
  );
}

export default CheckoutPago;