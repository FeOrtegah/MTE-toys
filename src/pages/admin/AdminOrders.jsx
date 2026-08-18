import { useEffect, useState } from "react";
import { getOrders, cancelOrder } from "../../services/orderService";

const ESTADOS = {
  pendiente: { label: "Pendiente", className: "estado-pendiente" },
  pagado: { label: "Pagado", className: "estado-pagado" },
  enviado: { label: "Enviado", className: "estado-enviado" },
  cancelado: { label: "Cancelado", className: "estado-cancelado" },
};

function formatFecha(fecha) {
  return new Date(fecha).toLocaleString("es-CL");
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function cargarPedidos() {
    setLoading(true);
    getOrders()
      .then(setOrders)
      .catch((err) => setError(err.message || "No se pudieron cargar los pedidos"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    cargarPedidos();
  }, []);

  async function handleCancelar(id) {
    if (!confirm("¿Cancelar este pedido?")) return;
    try {
      await cancelOrder(id);
      cargarPedidos();
    } catch (err) {
      alert(err.message || "No se pudo cancelar el pedido");
    }
  }

  if (loading) return <p style={{ padding: 30 }}>Cargando pedidos...</p>;
  if (error) return <p style={{ padding: 30, color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: 30 }}>
      <h1>Pedidos</h1>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #ddd" }}>
            <th style={{ padding: 10 }}>Cliente</th>
            <th style={{ padding: 10 }}>Fecha</th>
            <th style={{ padding: 10 }}>Estado</th>
            <th style={{ padding: 10 }}>Total</th>
            <th style={{ padding: 10 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const estado = ESTADOS[order.estado] || ESTADOS.pendiente;
            return (
              <tr key={order._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 10 }}>
                  {order.cliente?.nombre}
                  <br />
                  <small style={{ color: "#777" }}>{order.cliente?.email}</small>
                </td>
                <td style={{ padding: 10 }}>{formatFecha(order.createdAt)}</td>
                <td style={{ padding: 10 }}>
                  <span className={`order-mini-badge ${estado.className}`}>{estado.label}</span>
                </td>
                <td style={{ padding: 10 }}>${order.total.toLocaleString("es-CL")}</td>
                <td style={{ padding: 10 }}>
                  {order.estado === "pendiente" && (
                    <button onClick={() => handleCancelar(order._id)}>Cancelar</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrders;