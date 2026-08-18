import { getOrders, cancelOrder } from "../../services/orderService";

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

function formatFechaPedido(fecha) {
  return new Date(fecha).toLocaleString("es-CL");
}

function OrdersSection({ orders, setOrders }) {
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
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: 20,
                    color: "#777",
                  }}
                >
                  Todavía no hay pedidos.
                </td>
              </tr>
            ) : (
              orders.map((o) => {
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
                      {o.estado ===
                        "pendiente" && (
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