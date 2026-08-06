import "../../css/ProductCard.css";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

function ProductCard({product}){

const {addToCart}=useCart();

const price=product.price.toLocaleString("es-CL");

return(
<article className="product-card">

{product.offer && (
<span className="offer">
Oferta
</span>
)}

<button className="favorite">
<img 
src="/detalles/corazon.png"
alt="Favorito"
/>
</button>


<Link 
to={`/producto/${product.id}`}
className="product-image"
>
<img
src={product.image}
alt={product.name}
/>
</Link>


<h3>
{product.name}
</h3>


<div className="stars">
⭐⭐⭐⭐⭐
</div>


{
product.oldPrice && 
<p className="old-price">
${product.oldPrice.toLocaleString("es-CL")}
</p>
}


<p className="price">
${price}
</p>


<button
className="add"
onClick={()=>addToCart(product)}
>
🛒 Agregar
</button>


</article>
);

}

export default ProductCard;