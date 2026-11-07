import { useEffect, useState } from "react";

import {
  getSiteContent,
  createSiteContent,
  updateSiteContent,
  DEFAULT_UMBRAL_ENVIO_GRATIS,
} from "../../services/siteContentService";

// Panel de admin para editar el umbral de envío gratis
// sin tener que tocar código. Se guarda como un único
// documento SiteContent de seccion "shippingConfig".
function ShippingConfigSection() {
  const [docId, setDocId] = useState(null);
  const [valor, setValor] = useState(
    DEFAULT_UMBRAL_ENVIO_GRATIS
  );

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    getSiteContent("shippingConfig")
      .then((items) => {
        const item = items?.[0];

        if (item) {
          setDocId(item._id);
          setValor(
            item.umbralEnvioGratis ??
              DEFAULT_UMBRAL_ENVIO_GRATIS
          );
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  async function handleGuardar(e) {
    e.preventDefault();
    setGuardando(true);
    setMensaje("");

    try {
      const umbralEnvioGratis = Number(valor);

      if (docId) {
        await updateSiteContent(docId, {
          umbralEnvioGratis,
        });
      } else {
        const creado = await createSiteContent({
          seccion: "shippingConfig",
          umbralEnvioGratis,
        });
        setDocId(creado._id);
      }

      setMensaje("Guardado ✅");
    } catch (err) {
      setMensaje(
        `Error al guardar: ${err.message}`
      );
    } finally {
      setGuardando(false);
      setTimeout(() => setMensaje(""), 3000);
    }
  }

  if (loading) {
    return <p>Cargando configuración de envío...</p>;
  }

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <h2>Envío gratis</h2>
      </div>

      <p>
        Monto mínimo de compra (CLP) desde el cual el
        envío pasa a ser gratis en las comunas verdes y
        azules. Este valor se usa automáticamente en el
        checkout, en el resumen del pedido y en la
        página de política de envíos.
      </p>

      <form
        onSubmit={handleGuardar}
        className="product-form"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <label htmlFor="umbral-envio-gratis">
            Umbral de envío gratis ($)
          </label>

          <input
            id="umbral-envio-gratis"
            type="number"
            min="0"
            step="1"
            value={valor}
            onChange={(e) =>
              setValor(e.target.value)
            }
            required
          />
        </div>

        <button type="submit" disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar"}
        </button>

        {mensaje && <span>{mensaje}</span>}
      </form>
    </section>
  );
}

export default ShippingConfigSection;
