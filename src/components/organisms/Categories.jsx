import "../../css/Categories.css";
import { Link } from "react-router-dom";


function Categories(){

const categories = [

{
name:"Peluches",
icon:"🧸",
filter:"Peluches"
},

{
name:"Vehículos",
icon:"🚗",
filter:"Vehículos"
},

{
name:"Dinosaurios",
icon:"🦖",
filter:"Figuras"
},

{
name:"Construcción",
icon:"🧱",
filter:"Construcción"
}

];


return (

<section className="categories-section">


<h2>
Compra por categoría
</h2>


<div className="categories-container">


{
categories.map(category=>(


<Link
key={category.name}
to="/productos"
className="category-card"
>


<div className="category-icon">

{category.icon}

</div>


<h3>
{category.name}
</h3>


</Link>


))

}


</div>


</section>

);

}


export default Categories;