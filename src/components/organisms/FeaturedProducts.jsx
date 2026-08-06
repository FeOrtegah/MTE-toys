import { useRef } from "react";
import products from "../../data/products";
import ProductCard from "./ProductCard";
import "../../css/FeaturedProducts.css";


function FeaturedProducts(){

const slider = useRef();


function move(direction){

  const amount = 300;

  slider.current.scrollLeft += direction * amount;

}


return (

<section className="featured">

<h2>
Productos destacados
</h2>


<div className="featured-wrapper">


<button
className="arrow"
onClick={()=>move(-1)}
>
❮
</button>



<div
className="featured-products"
ref={slider}
>


{
products.map(product=>(

<div 
className="featured-item"
key={product.id}
>

<ProductCard
product={product}
/>

</div>

))

}


</div>



<button
className="arrow"
onClick={()=>move(1)}
>
❯
</button>


</div>


</section>

);

}


export default FeaturedProducts;