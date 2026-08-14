import { useCart } from "../../context/CartContext";
import "../../css/Cart.css";
import { Link } from "react-router-dom";


function Cart(){

const {
cart,
increase,
decrease,
removeFromCart,
total
}=useCart();


const totalUnidades = cart.reduce((sum,item)=>sum+item.quantity,0);


return(

<main className="cart-page">

<div className="cart-container">

<section className="cart-list">

<h1>
Carro ({totalUnidades} producto{totalUnidades===1?"":"s"})
</h1>


{
cart.length===0 ?

<p className="cart-empty">
Tu carrito está vacío
</p>


:

<div className="cart-card">

{
cart.map(item=>(

<div
className="cart-item"
key={item.id}
>

<img
src={item.image}
alt={item.name}
/>


<div className="cart-item-info">

<h3>
{item.name}
</h3>


<p className="cart-item-price">
${item.price.toLocaleString("es-CL")}
</p>


<div className="quantity">

<button onClick={()=>decrease(item.id)}>
-
</button>


<span>
{item.quantity}
</span>


<button onClick={()=>increase(item.id)}>
+
</button>

</div>

</div>


<button
className="delete"
onClick={()=>removeFromCart(item.id)}
title="Eliminar"
>
✕
</button>


</div>

))

}

</div>

}

</section>


{
cart.length>0 &&

<aside className="cart-summary">

<h2>
Resumen de la compra
</h2>


<div className="summary-row">
<span>Productos ({totalUnidades})</span>
<span>${total().toLocaleString("es-CL")}</span>
</div>


<div className="summary-row summary-total">
<span>Total:</span>
<span>${total().toLocaleString("es-CL")}</span>
</div>


<Link
to="/checkout"
className="checkout"
>
Continuar compra
</Link>


</aside>

}


</div>


</main>

);

}

export default Cart;