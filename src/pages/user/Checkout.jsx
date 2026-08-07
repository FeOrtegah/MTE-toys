import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../services/api";
import "../../css/Checkout.css";

function Checkout(){

const {cart,total,clearCart}=useCart();
const {user}=useUser();
const navigate=useNavigate();

const [form, setForm] = useState({
  nombre: "",
  apellidos: "",
  email: user?.email || "",
  telefono: "",
  direccion: "",
});

const [enviando, setEnviando] = useState(false);
const [error, setError] = useState("");

function handleChange(e){
  setForm({ ...form, [e.target.name]: e.target.value });
}

async function finishOrder(){

  if(!form.nombre || !form.email || !form.telefono || !form.direccion){
    setError("Completa todos los campos obligatorios (*)");
    return;
  }

  if(cart.length === 0){
    setError("Tu carrito está vacío");
    return;
  }

  setError("");
  setEnviando(true);

  try {
    const orderData = {
      cliente: {
        nombre: `${form.nombre} ${form.apellidos}`.trim(),
        email: form.email,
        telefono: form.telefono,
        direccion: form.direccion,
      },
      items: cart.map(item => ({
        producto: item.id,
        cantidad: item.quantity,
      })),
    };

    await createOrder(orderData);

    clearCart();
    alert("Pedido realizado correctamente. Nos contactaremos contigo para coordinar el pago.");
    navigate("/");

  } catch (err) {
    setError(err.message || "Ocurrió un error al procesar tu pedido");
  } finally {
    setEnviando(false);
  }
}

return(
<main className="checkout-page">

<h1>Finalizar compra</h1>

{error && <p style={{color: "red"}}>{error}</p>}

<div className="checkout-container">

<section className="billing">

<h2>Facturación y envío</h2>

<input placeholder="Cédula de identidad *"/>

<div className="row">
<input
  name="nombre"
  placeholder="Nombre *"
  value={form.nombre}
  onChange={handleChange}
/>
<input
  name="apellidos"
  placeholder="Apellidos"
  value={form.apellidos}
  onChange={handleChange}
/>
</div>

<input
  name="direccion"
  placeholder="Dirección *"
  value={form.direccion}
  onChange={handleChange}
/>

<input placeholder="Departamento"/>

<div className="row">
<input placeholder="Ciudad *"/>
<input
  name="telefono"
  placeholder="Teléfono *"
  value={form.telefono}
  onChange={handleChange}
/>
</div>

<input
  name="email"
  placeholder="Correo electrónico *"
  value={form.email}
  onChange={handleChange}
/>

<input placeholder="Razón social (opcional)"/>


<label className="account">
<input type="checkbox"/>
 ¿Crear una cuenta?
</label>


<h2>
Información adicional
</h2>

<textarea
placeholder="Notas sobre tu pedido, por ejemplo, notas especiales para la entrega."
/>


</section>



<section className="order">

<h2>Tu orden</h2>

<div className="order-header">
<span>Producto</span>
<span>Subtotal</span>
</div>


{
cart.map(item=>(

<div className="order-item" key={item.id}>

<span>
{item.name} × {item.quantity}
</span>

<span>
${(item.price*item.quantity).toLocaleString("es-CL")}
</span>

</div>

))
}


<div className="line"></div>


<div className="total">
<span>Subtotal</span>
<span>${total().toLocaleString("es-CL")}</span>
</div>


<div className="total">
<span>Envío</span>
<span>Envío gratis</span>
</div>


<div className="total final">
<span>Total</span>
<span>${total().toLocaleString("es-CL")}</span>
</div>


<button
onClick={finishOrder}
disabled={enviando}
>
{enviando ? "Procesando..." : "Realizar pedido"}
</button>


</section>


</div>

</main>
);

}

export default Checkout;