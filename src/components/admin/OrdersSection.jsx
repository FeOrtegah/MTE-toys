import { useState, useMemo } from "react";

import {
  getOrders,
  cancelOrder,
  markAsShipped,
  hardDeleteOrder,
  confirmPayment,
} from "../../services/orderService";

const ESTADOS_PEDIDO = {
  pendiente: {
    label: "Pendiente",
    className: "badge-pendiente",
  },
  pagado: {
    label: "Pagado",
    className: "badge-pagado",
  },
  enviado: {
    label: "Enviado",
    className: "badge-enviado",
  },
  cancelado: {
    label: "Cancelado",
    className: "badge-cancelado",
  },
};

const FILTROS = [
  { key: "todos", label: "Todos" },
  { key: "pagado", label: "Pagados (por enviar)" },
  { key: "pendiente", label: "Pendientes" },
  { key: "enviado", label: "Enviados" },
  { key: "cancelado", label: "Cancelados" },
];

function formatFechaPedido(fecha) {
  return new Date(fecha).toLocaleString("es-CL");
}

// Formato yyyy-mm-dd que usan los <input type="date">
function toInputDate(date) {
  return date.toISOString().slice(0, 10);
}

function OrdersSection({ orders, setOrders }) {
  const [filtro, setFiltro] = useState("todos");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  function recargarPedidos() {
    getOrders()
      .then(setOrders)
      .catch((err) =>
        alert(
          err.message ||
            "No se pudieron recargar los pedidos"
        )
      );
  }

  async function handleCancelOrder(id) {
    if (!confirm("¿Cancelar este pedido?")) {
      return;
    }

    try {
      await cancelOrder(id);

      setOrders((prev) =>
        prev.map((o) =>
          o._id === id
            ? { ...o, estado: "cancelado" }
            : o
        )
      );
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleMarkAsShipped(id) {
    if (
      !confirm(
        "¿Marcar este pedido como enviado?"
      )
    ) {
      return;
    }

    try {
      await markAsShipped(id);

      setOrders((prev) =>
        prev.map((o) =>
          o._id === id
            ? { ...o, estado: "enviado" }
            : o
        )
      );
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleHardDeleteOrder(id) {
    if (
      !confirm(
        "¿Eliminar este pedido de forma PERMANENTE? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    try {
      await hardDeleteOrder(id);

      setOrders((prev) =>
        prev.filter((o) => o._id !== id)
      );
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleConfirmPayment(id) {
    if (
      !confirm(
        "¿Confirmar que el pago (transferencia) fue recibido?"
      )
    ) {
      return;
    }

    try {
      const actualizado = await confirmPayment(
        id
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === id ? actualizado : o
        )
      );
    } catch (err) {
      alert(err.message);
    }
  }

  function aplicarAtajoFecha(dias) {
    const hasta = new Date();
    const desde = new Date();

    if (dias !== null) {
      desde.setDate(desde.getDate() - dias);
      setFechaDesde(toInputDate(desde));
      setFechaHasta(toInputDate(hasta));
    } else {
      // "Todo el tiempo": limpiar filtro de fecha
      setFechaDesde("");
      setFechaHasta("");
    }
  }

  function limpiarFiltroFecha() {
    setFechaDesde("");
    setFechaHasta("");
  }

  const ordersFiltrados = useMemo(() => {
    let lista = orders;

    if (filtro !== "todos") {
      lista = lista.filter(
        (o) => o.estado === filtro
      );
    }

    if (fechaDesde) {
      const desde = new Date(
        `${fechaDesde}T00:00:00`
      );

      lista = lista.filter(
        (o) => new Date(o.createdAt) >= desde
      );
    }

    if (fechaHasta) {
      const hasta = new Date(
        `${fechaHasta}T23:59:59`
      );

      lista = lista.filter(
        (o) => new Date(o.createdAt) <= hasta
      );
    }

    return lista;
  }, [orders, filtro, fechaDesde, fechaHasta]);

  const pagadosPorEnviar = orders.filter(
    (o) => o.estado === "pagado"
  ).length;

  const hayFiltroFechaActivo = Boolean(
    fechaDesde || fechaHasta
  );

  return (
    <section className="admin-section">
      <h2>Pedidos</h2>

      <p
        style={{
          color: "#777",
          fontSize: 13,
          marginTop: -8,
        }}
      >
        Los pedidos pendientes con más de 30
        minutos se cancelan automáticamente.
      </p>

      <div className="admin-filtros">
        {FILTROS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={
              filtro === f.key
                ? "admin-filtro-btn admin-filtro-activo"
                : "admin-filtro-btn"
            }
            onClick={() => setFiltro(f.key)}
          >
            {f.label}
            {f.key === "pagado" &&
              pagadosPorEnviar > 0 && (
                <span className="admin-filtro-badge">
                  {pagadosPorEnviar}
                </span>
              )}
          </button>
        ))}
      </div>

      <div className="admin-filtro-fechas">
        <div className="admin-filtro-fechas-atajos">
          <button
            type="button"
            className="admin-filtro-btn"
            onClick={() => aplicarAtajoFecha(0)}
          >
            Hoy
          </button>

          <button
            type="button"
            className="admin-filtro-btn"
            onClick={() => aplicarAtajoFecha(7)}
          >
            Últimos 7 días
          </button>

          <button
            type="button"
            className="admin-filtro-btn"
            onClick={() => aplicarAtajoFecha(30)}
          >
            Últimos 30 días
          </button>

          {hayFiltroFechaActivo && (
            <button
              type="button"
              className="admin-filtro-btn"
              onClick={limpiarFiltroFecha}
            >
              Quitar filtro de fecha
            </button>
          )}
        </div>

        <div className="admin-filtro-fechas-manual">
          <label>
            Desde
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) =>
                setFechaDesde(e.target.value)
              }
            />
          </label>

          <label>
            Hasta
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) =>
                setFechaHasta(e.target.value)
              }
            />
          </label>
        </div>
      </div>

      <p
        style={{
          color: "#777",
          fontSize: 13,
        }}
      >
        Mostrando {ordersFiltrados.length} de{" "}
        {orders.length} pedidos
      </p>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Método</th>
              <th>Dirección de envío</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {ordersFiltrados.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: 20,
                    color: "#777",
                  }}
                >
                  No hay pedidos en esta categoría.
                </td>
              </tr>
            ) : (
              ordersFiltrados.map((o) => {
                const estado =
                  ESTADOS_PEDIDO[o.estado] ||
                  ESTADOS_PEDIDO.pendiente;

                const envio = o.cliente?.envio;
                const esRetiroEnSede =
                  o.metodoEnvio ===
                  "Retiro en sede";

                return (
                  <tr key={o._id}>
                    <td>
                      {o.cliente?.nombre}
                      <br />
                      <small
                        style={{ color: "#777" }}
                      >
                        {o.cliente?.email}
                      </small>
                      <br />
                      <small
                        style={{ color: "#777" }}
                      >
                        {o.cliente?.telefono}
                      </small>
                      <br />
                      <small
                        style={{ color: "#777" }}
                      >
                        RUT:{" "}
                        {o.cliente?.rut || "—"}
                      </small>
                      <br />
                      <small
                        style={{
                          color:
                            o.metodoPago ===
                            "transferencia"
                              ? "#b58900"
                              : "#777",
                          fontWeight:
                            o.metodoPago ===
                            "transferencia"
                              ? 600
                              : 400,
                        }}
                      >
                        {o.metodoPago ===
                        "transferencia"
                          ? "💸 Transferencia"
                          : "Webpay"}
                      </small>

                      {o.metodoPago ===
                        "transferencia" && (
                        <>
                          <br />
                          <small
                            style={{
                              color:
                                o.avisoWhatsappEnviado
                                  ? "#1f9d55"
                                  : "#999",
                            }}
                          >
                            {o.avisoWhatsappEnviado
                              ? "✅ Avisó por WhatsApp"
                              : "⏳ Sin avisar"}
                          </small>
                        </>
                      )}
                    </td>

                    <td>
                      {o.items?.map(
                        (item, idx) => (
                          <div key={idx}>
                            {item.cantidad}×{" "}
                            {item.nombre}
                          </div>
                        )
                      )}
                    </td>

                    <td>
                      {esRetiroEnSede ? (
                        <span className="badge-retiro-sede">
                          📍 Retiro en sede
                        </span>
                      ) : (
                        o.metodoEnvio || "—"
                      )}
                    </td>

                    <td>
                      {esRetiroEnSede ? (
                        <small
                          style={{
                            color: "#777",
                          }}
                        >
                          No requiere despacho
                        </small>
                      ) : envio ? (
                        <>
                          {envio.nombreReceptor}
                          <br />
                          {envio.direccion}{" "}
                          {envio.numero}
                          {envio.departamento
                            ? `, ${envio.departamento}`
                            : ""}
                          <br />
                          {envio.comuna},{" "}
                          {envio.region}
                          {envio.indicaciones && (
                            <>
                              <br />
                              <small
                                style={{
                                  color: "#777",
                                }}
                              >
                                {
                                  envio.indicaciones
                                }
                              </small>
                            </>
                          )}
                        </>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td>
                      {formatFechaPedido(
                        o.createdAt
                      )}
                    </td>

                    <td>
                      <span
                        className={
                          estado.className
                        }
                      >
                        {estado.label}
                      </span>
                    </td>

                    <td>
                      ${o.total.toLocaleString(
                        "es-CL"
                      )}
                    </td>

                    <td className="admin-actions">
                      {o.estado === "pendiente" &&
                        o.metodoPago ===
                          "transferencia" && (
                          <button
                            className="btn-guardar"
                            onClick={() =>
                              handleConfirmPayment(
                                o._id
                              )
                            }
                          >
                            Confirmar pago
                          </button>
                        )}

                      {o.estado === "pendiente" && (
                        <button
                          className="btn-eliminar"
                          onClick={() =>
                            handleCancelOrder(
                              o._id
                            )
                          }
                        >
                          Cancelar
                        </button>
                      )}

                      {o.estado === "pagado" && (
                        <button
                          className="btn-guardar"
                          onClick={() =>
                            handleMarkAsShipped(
                              o._id
                            )
                          }
                        >
                          Marcar como enviado
                        </button>
                      )}

                      <button
                        className="btn-borrar"
                        onClick={() =>
                          handleHardDeleteOrder(
                            o._id
                          )
                        }
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={recargarPedidos}
        style={{ marginTop: 10 }}
      >
        Actualizar pedidos
      </button>
    </section>
  );
}

export default OrdersSection;