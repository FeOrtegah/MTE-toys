import { useState } from "react";

import {
  getOrders,
  cancelOrder,
  markAsShipped,
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

function OrdersSection({ orders, setOrders }) {
  const [filtro, setFiltro] = useState("todos");

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

  const ordersFiltrados =
    filtro === "todos"
      ? orders
      : orders.filter((o) => o.estado === filtro);

  const pagadosPorEnviar = orders.filter(
    (o) => o.estado === "pagado"
  ).length;

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

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cliente</th>
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
                  colSpan="5"
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