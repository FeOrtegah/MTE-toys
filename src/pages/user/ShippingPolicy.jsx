import "../../css/Policy.css";
import mapaZonasEnvio from "../../assets/mapa-zonas-envio.jpeg";

function ShippingPolicy() {
  return (
    <main className="policy-page">
      <h1>Políticas de Envío</h1>
      <p className="policy-subtitle">Información importante sobre nuestros despachos a todo Chile.</p>

      <section className="policy-section">
        <h2>1. Tiempos de Despacho</h2>
        <p>Los pedidos se procesan y preparan para su envío en un plazo de 24 a 48 horas hábiles. Los tiempos de entrega varían según la región y comuna de destino.</p>
      </section>

      <section className="policy-section">
        <h2>2. Costos de Envío</h2>
        <p>El valor del despacho se calcula automáticamente en el checkout al ingresar tu dirección exacta según las tarifas vigentes del courier.</p>
      </section>

      <section className="policy-section">
        <h2>3. Zonas de Cobertura en Santiago</h2>
        <p>
          Dentro del Gran Santiago trabajamos con distintos couriers según la
          comuna de destino:
        </p>

        <img
          src={mapaZonasEnvio}
          alt="Mapa de zonas de cobertura en Santiago: Logística 360 (verde) y Bluexpress (celeste)"
          className="policy-image"
        />

        <p>
          Fuera de estas zonas, el despacho se realiza a través de
          Chilexpress, pagado directamente al recibir el pedido.
        </p>
      </section>

      <section className="policy-section">
        <h2>4. Seguimiento</h2>
        <p>Una vez que tu pedido sea despachado, recibirás la información necesaria para realizar el seguimiento del paquete hasta la puerta de tu casa.</p>
      </section>
    </main>
  );
}

export default ShippingPolicy;