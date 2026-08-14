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
  });
}

function AccountHome() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    getMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const ultimasCompras = orders.slice(0, 2);

  return (
    <main className="account-home-page">
      <div className="account-home-box">
        <div className="account-home-top">
          <h1>Hola, {user?.name || user?.nombre || "invitado"}</h1>
        </div>

        <div className="account-home-actions">
          <Link to="/mi-cuenta/compras" className="account-home-action">
            <span className="account-home-icon">📦</span>
            Mis compras
          </Link>

          <Link to="/mi-cuenta/perfil" className="account-home-action">
            <span className="account-home-icon">👤</span>
            Mi perfil
          </Link>

          <Link to="/contacto" className="account-home-action">
            <span className="account-home-icon">❓</span>
            Ayuda
          </Link>
        </div>

        <div className="account-home-orders">
          <div className="account-home-orders-header">
            <h2>Últimas compras ({orders.length})</h2>
            {orders.length > 0 && (
              <Link to="/mi-cuenta/compras" className="account-home-link">
                Revisar todas &gt;
              </Link>
            )}
          </div>

          {loading ? (
            <p className="account-home-status">Cargando tus compras...</p>
          ) : ultimasCompras.length === 0 ? (
            <p className="account-home-status">Todavía no tienes compras.</p>
          ) : (
            <div className="account-home-orders-grid">
              {ultimasCompras.map((order) => {
                const estado = ESTADOS[order.estado] || ESTADOS.pendiente;
                return (
                  <Link
                    to="/mi-cuenta/compras"
                    className="order-mini-card"
                    key={order._id}
                  >
                    <span className={`order-mini-badge ${estado.className}`}>
                      {estado.label}
                    </span>
                    <div className="order-mini-thumb">📦</div>
                    <p>
                      {order.items?.length || 0} producto
                      {order.items?.length === 1 ? "" : "s"} · {formatFecha(order.createdAt)}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default AccountHome;