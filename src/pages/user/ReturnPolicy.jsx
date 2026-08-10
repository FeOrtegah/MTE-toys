import "../../css/Policy.css";

function ReturnPolicy() {
  return (
    <main className="policy-page">
      <h1>Políticas de Cambio y Garantía</h1>
      <p className="policy-subtitle">Tu tranquilidad es nuestra prioridad en MTE Toys.</p>

      <section className="policy-section">
        <h2>1. Plazo para Cambios</h2>
        <p>Cuentas con un plazo de hasta 10 días corridos a partir de la recepción de tu producto para solicitar un cambio.</p>
      </section>

      <section className="policy-section">
        <h2>2. Condiciones del Producto</h2>
        <p>Para hacer efectivo cualquier cambio, el juguete debe encontrarse sin uso, en su envoltorio o caja original sellada, y con todas sus etiquetas y accesorios completos.</p>
      </section>

      <section className="policy-section">
        <h2>3. ¿Cómo solicitarlo?</h2>
        <p>Ponte en contacto con nosotros a través de nuestro WhatsApp o correo electrónico indicando tu número de pedido y el motivo del cambio.</p>
      </section>
    </main>
  );
}

export default ReturnPolicy;