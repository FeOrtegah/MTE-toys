import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { getMyOrders } from "../../services/orderService";
import "../../css/AccountHome.css";

const ESTADOS = {
  pendiente: { label: "Pendiente", className: "estado-pendiente" },
  pagado: { label: "Pagado", className: "estado-pagado" },
  enviado: { label: "Enviado", className: "estado-enviado" },
  cancelado: { label: "Cancelado", className: "estado-cancelado" },
};

function formatFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function MyOrders() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    getMyOrders()
      .then(setOrders)
      .catch((err) => setError(err.message || "No se pudieron cargar tus compras"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="account-home-page">
      <div className="account-home-box">
        <div className="my-orders-header">
          <Link to="/mi-cuenta" className="account-home-back">
            &lt; Volver a mi cuenta
          </Link>
          <h1>Mis compras</h1>
        </div>

        {loading ? (
          <p className="account-home-status">Cargando tus compras...</p>
        ) : error ? (
          <p className="account-error">{error}</p>
        ) : orders.length === 0 ? (
          <p className="account-home-status">Todavía no tienes compras.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const estado = ESTADOS[order.estado] || ESTADOS.pendiente;
              return (
                <div className="order-card" key={order._id}>
                  <div className="order-card-top">
                    <span className={`order-mini-badge ${estado.className}`}>
                      {estado.label}
                    </span>
                    <span className="order-card-date">{formatFecha(order.createdAt)}</span>
                  </div>

                  <div className="order-card-items">
                    {order.items?.map((item, i) => (
                      <div className="order-card-item" key={i}>
                        <span className="order-mini-thumb">📦</span>
                        <span className="order-card-item-name">
                          {item.nombre} × {item.cantidad}
                        </span>
                        <span className="order-card-item-price">
                          ${(item.precioUnitario * item.cantidad).toLocaleString("es-CL")}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="order-card-footer">
                    <span>Total</span>
                    <span className="order-card-total">
                      ${order.total.toLocaleString("es-CL")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyOrders;