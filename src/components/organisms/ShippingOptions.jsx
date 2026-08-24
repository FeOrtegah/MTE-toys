import { COSTO_LOGISTICA_360 } from "../../data/comunasChile.js";

// Bloque de radios de método de envío (Logística 360,
// Bluexpress, Starken, Chilexpress, Retiro en local),
// extraído de Checkout.jsx. Depende fuertemente del
// estado del formulario, así que recibe todo por props.

function ShippingOptions({
  zonaEnvio,
  envioGratisSoloLogistica,
  metodoEnvio,
  handleMetodoEnvio,
  errores,
}) {
  if (!zonaEnvio) {
    return null;
  }

  return (
            <div className="shipping-options">

              <h2>Opciones de envío</h2>

              {envioGratisSoloLogistica && (
                <p className="shipping-free-msg">
                  🎉 ¡Tu compra supera los
                  $49.990! El envío por
                  Logística 360 es{" "}
                  <strong>gratis</strong>.
                </p>
              )}

              {zonaEnvio === "verde" &&
                !envioGratisSoloLogistica && (
                  <p>
                    Tu comuna pertenece a las
                    <strong>
                      {" "}
                      comunas verdes
                    </strong>
                    . Puedes elegir entre
                    Logística 360, Bluexpress,
                    Starken o retiro en local.
                  </p>
                )}

              {zonaEnvio === "azul" &&
                !envioGratisSoloLogistica && (
                  <p>
                    Tu comuna pertenece a las
                    <strong> comunas azules</strong>.
                    Puedes elegir entre Bluexpress,
                    Starken (ambos por pagar) o
                    retiro en local.
                  </p>
                )}

              {zonaEnvio === "fuera" && (
                <p>
                  Hacemos despacho a
                  <strong> todo Chile</strong> a
                  través de Bluexpress, Starken o
                  Chilexpress, todos por pagar. También
                  puedes retirar en local.
                </p>
              )}

              <div className="shipping-methods">

                {/* LOGÍSTICA 360 */}

                {zonaEnvio === "verde" ||
                envioGratisSoloLogistica ? (
                  <label
                    className={`shipping-method ${
                      metodoEnvio ===
                      "logistica360"
                        ? "selected"
                        : ""
                    }`}
                  >

                    <input
                      type="radio"
                      name="metodoEnvio"
                      value="logistica360"
                      checked={
                        metodoEnvio ===
                        "logistica360"
                      }
                      onChange={() =>
                        handleMetodoEnvio(
                          "logistica360"
                        )
                      }
                    />

                    <span>
                      <strong>
                        Logística 360
                      </strong>

                      <small>
                        Envíos en 24 horas ·{" "}
                        {envioGratisSoloLogistica
                          ? "Gratis"
                          : `$${COSTO_LOGISTICA_360.toLocaleString(
                              "es-CL"
                            )}`}
                      </small>
                    </span>

                  </label>
                ) : null}

                {/* BLUEXPRESS */}

                {(zonaEnvio === "verde" ||
                  zonaEnvio === "azul" ||
                  zonaEnvio === "fuera") &&
                  !envioGratisSoloLogistica && (
                  <label
                    className={`shipping-method ${
                      metodoEnvio ===
                      "bluexpress"
                        ? "selected"
                        : ""
                    }`}
                  >

                    <input
                      type="radio"
                      name="metodoEnvio"
                      value="bluexpress"
                      checked={
                        metodoEnvio ===
                        "bluexpress"
                      }
                      onChange={() =>
                        handleMetodoEnvio(
                          "bluexpress"
                        )
                      }
                    />

                    <span>

                      <strong>
                        Bluexpress
                      </strong>

                      <small>
                        Por pagar
                      </small>

                    </span>

                  </label>
                )}

                {/* STARKEN */}

                {(zonaEnvio === "verde" ||
                  zonaEnvio === "azul" ||
                  zonaEnvio === "fuera") &&
                  !envioGratisSoloLogistica && (
                  <label
                    className={`shipping-method ${
                      metodoEnvio === "starken"
                        ? "selected"
                        : ""
                    }`}
                  >

                    <input
                      type="radio"
                      name="metodoEnvio"
                      value="starken"
                      checked={
                        metodoEnvio === "starken"
                      }
                      onChange={() =>
                        handleMetodoEnvio(
                          "starken"
                        )
                      }
                    />

                    <span>

                      <strong>
                        Starken
                      </strong>

                      <small>
                        Por pagar
                      </small>

                    </span>

                  </label>
                )}

                {/* CHILEXPRESS (COMUNAS FUERA DE SANTIAGO) - POR PAGAR */}

                {zonaEnvio === "fuera" && (
                  <label
                    className={`shipping-method ${
                      metodoEnvio ===
                      "chilexpress"
                        ? "selected"
                        : ""
                    }`}
                  >

                    <input
                      type="radio"
                      name="metodoEnvio"
                      value="chilexpress"
                      checked={
                        metodoEnvio ===
                        "chilexpress"
                      }
                      onChange={() =>
                        handleMetodoEnvio(
                          "chilexpress"
                        )
                      }
                    />

                    <span>

                      <strong>
                        Chilexpress
                      </strong>

                      <small>
                        Por pagar
                      </small>

                    </span>

                  </label>
                )}

                {/* RETIRO EN LOCAL */}

                {(zonaEnvio === "verde" ||
                  zonaEnvio === "azul" ||
                  zonaEnvio === "fuera") &&
                  !envioGratisSoloLogistica && (
                  <label
                    className={`shipping-method ${
                      metodoEnvio ===
                      "retiro_local"
                        ? "selected"
                        : ""
                    }`}
                  >

                    <input
                      type="radio"
                      name="metodoEnvio"
                      value="retiro_local"
                      checked={
                        metodoEnvio ===
                        "retiro_local"
                      }
                      onChange={() =>
                        handleMetodoEnvio(
                          "retiro_local"
                        )
                      }
                    />

                    <span>

                      <strong>
                        Retiro en local
                      </strong>

                      <small>
                        Gratis
                      </small>

                    </span>

                  </label>
                )}

              </div>

              {errores.metodoEnvio && (
                <small className="field-error">
                  {errores.metodoEnvio}
                </small>
              )}

            </div>
  );
}

export default ShippingOptions;