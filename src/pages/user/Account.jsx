import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { getMe, updateMe } from "../../services/authService";
import "../../css/Account.css";

function Account() {
  const { user, updateUser, logout } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState({
    calle: "",
    numero: "",
    comuna: "",
    region: "",
    indicaciones: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    getMe()
      .then((data) => {
        setEmail(data.email);
        setNombre(data.nombre || "");
        setTelefono(data.telefono || "");
        setDireccion({
          calle: data.direccion?.calle || "",
          numero: data.direccion?.numero || "",
          comuna: data.direccion?.comuna || "",
          region: data.direccion?.region || "",
          indicaciones: data.direccion?.indicaciones || "",
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleDireccionChange(campo, valor) {
    setDireccion((prev) => ({ ...prev, [campo]: valor }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const data = await updateMe({ nombre, telefono, direccion });
      updateUser({ name: data.nombre });
      setSuccess("Datos guardados correctamente");
      setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      setError(err.message || "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  if (loading) return <p className="account-status">Cargando tu cuenta...</p>;

  return (
    <main className="account-page">
      <div className="account-box">
        <div className="account-header">
          <div className="account-avatar">👤</div>
          <div>
            <h1>Mi cuenta</h1>
            <p className="account-email">{email}</p>
          </div>
        </div>

        {error && <p className="account-error">{error}</p>}
        {success && <p className="account-success">{success}</p>}

        <form onSubmit={handleSave} className="account-form">
          <h2>Datos personales</h2>

          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre completo"
          />

          <label>Teléfono</label>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="+56 9 1234 5678"
          />

          <h2>Dirección de envío</h2>

          <div className="account-row">
            <div>
              <label>Calle</label>
              <input
                type="text"
                value={direccion.calle}
                onChange={(e) => handleDireccionChange("calle", e.target.value)}
                placeholder="Nombre de la calle"
              />
            </div>
            <div className="account-col-small">
              <label>N°</label>
              <input
                type="text"
                value={direccion.numero}
                onChange={(e) => handleDireccionChange("numero", e.target.value)}
                placeholder="123"
              />
            </div>
          </div>

          <div className="account-row">
            <div>
              <label>Comuna</label>
              <input
                type="text"
                value={direccion.comuna}
                onChange={(e) => handleDireccionChange("comuna", e.target.value)}
                placeholder="Ej: Ñuñoa"
              />
            </div>
            <div>
              <label>Región</label>
              <input
                type="text"
                value={direccion.region}
                onChange={(e) => handleDireccionChange("region", e.target.value)}
                placeholder="Ej: Metropolitana"
              />
            </div>
          </div>

          <label>Indicaciones adicionales</label>
          <textarea
            value={direccion.indicaciones}
            onChange={(e) => handleDireccionChange("indicaciones", e.target.value)}
            placeholder="Depto, referencia, con quién dejar el pedido, etc."
          />

          <button type="submit" disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>

        <button className="account-logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </main>
  );
}

export default Account;