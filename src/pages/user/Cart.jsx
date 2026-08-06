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


return(

<main className="cart-page">

<h1>
Carrito
</h1>


{
cart.length===0 ?

<p>
Tu carrito está vacío
</p>


:

<>

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


<div>

<h3>
{item.name}
</h3>


<p>
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


<button
className="delete"
onClick={()=>removeFromCart(item.id)}
>
Eliminar
</button>


</div>


</div>

))

}


<h2>
Total:
${total().toLocaleString("es-CL")}
</h2>


<Link 
to="/checkout"
className="checkout"
>
Finalizar compra
</Link>


</>

}


</main>

);

}

export default Cart;