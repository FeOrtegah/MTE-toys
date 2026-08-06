import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import "../../css/Checkout.css";

function Checkout(){

const {cart,total}=useCart();
const {user}=useUser();
const navigate=useNavigate();

function finishOrder(){
alert("Pedido realizado correctamente");
navigate("/");
}

return(
<main className="checkout-page">

<h1>Finalizar compra</h1>

<div className="checkout-container">

<section className="billing">

<h2>Facturación y envío</h2>

<input placeholder="Cédula de identidad *"/>

<div className="row">
<input placeholder="Nombre *"/>
<input placeholder="Apellidos *"/>
</div>

<input placeholder="Dirección *"/>

<input placeholder="Departamento"/>

<div className="row">
<input placeholder="Ciudad *"/>
<input placeholder="Teléfono *"/>
</div>

<input 
placeholder="Correo electrónico *"
defaultValue={user?.email || ""}
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
>
Realizar pedido
</button>


</section>


</div>

</main>
);

}

export default Checkout;