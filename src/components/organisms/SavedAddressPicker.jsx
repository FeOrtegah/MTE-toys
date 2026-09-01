// Selector "Usar dirección guardada" / "Nuevo destino de envío",
// mismo patrón visual que el selector de método de pago.
// Solo se muestra si el usuario está logueado y tiene al
// menos una dirección guardada. Máximo 3 guardadas.

const MAXIMO_DIRECCIONES = 3;

function SavedAddressPicker({
  direcciones,
  modo,
  setModo,
  direccionSeleccionadaId,
  onSelect,
  onDelete,
}) {
  const seleccionada = direcciones.find(
    (d) => d._id === direccionSeleccionadaId
  );

  const limiteAlcanzado =
    direcciones.length >= MAXIMO_DIRECCIONES;

  return (
    <div className="shipping-options">
      <h2>¿A dónde enviamos tu pedido?</h2>

      <div className="shipping-methods">
        <label
          className={`shipping-method ${
            modo === "guardada" ? "selected" : ""
          }`}
        >
          <input
            type="radio"
            name="modoDireccion"
            checked={modo === "guardada"}
            onChange={() => setModo("guardada")}
          />

          <span>
            <strong>Usar dirección guardada</strong>
            <small>
              Elige una de tus direcciones
            </small>
          </span>
        </label>

        <label
          className={`shipping-method ${
            modo === "nueva" ? "selected" : ""
          }`}
        >
          <input
            type="radio"
            name="modoDireccion"
            checked={modo === "nueva"}
            onChange={() => setModo("nueva")}
          />

          <span>
            <strong>Nuevo destino de envío</strong>
            <small>
              Ingresa una dirección nueva
            </small>
          </span>
        </label>
      </div>

      {modo === "guardada" && (
        <div className="saved-address-list">
          {direcciones.map((d) => (
            <div
              key={d._id}
              className={`saved-address-item ${
                direccionSeleccionadaId === d._id
                  ? "selected"
                  : ""
              }`}
            >
              <label className="saved-address-radio">
                <input
                  type="radio"
                  name="direccionGuardada"
                  checked={
                    direccionSeleccionadaId ===
                    d._id
                  }
                  onChange={() => onSelect(d)}
                />

                <strong>{d.nombre}</strong>
              </label>

              <button
                type="button"
                className="saved-address-delete"
                onClick={() => onDelete(d)}
                aria-label={`Eliminar ${d.nombre}`}
              >
                🗑️
              </button>
            </div>
          ))}

          {seleccionada && (
            <p className="saved-address-preview">
              📍 {seleccionada.direccion}{" "}
              {seleccionada.numero}
              {seleccionada.departamento
                ? `, ${seleccionada.departamento}`
                : ""}
              <br />
              {seleccionada.comuna},{" "}
              {seleccionada.region}
            </p>
          )}

          {limiteAlcanzado && (
            <p className="saved-address-limit">
              Ya tienes {MAXIMO_DIRECCIONES}{" "}
              direcciones guardadas (el
              máximo). Elimina una con 🗑️ si
              quieres guardar una distinta.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default SavedAddressPicker;