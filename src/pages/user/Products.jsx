import { useState, useEffect } from "react";
import { getProducts } from "../../services/api";
import ProductCard from "../../components/organisms/ProductCard";
import { useSearch } from "../../context/SearchContext";
import "../../css/Products.css";


function Products(){

const {search}=useSearch();

const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [category,setCategory]=useState("Todos");

useEffect(() => {
  getProducts()
    .then(setProducts)
    .catch((err) => console.error("Error al cargar productos:", err))
    .finally(() => setLoading(false));
}, []);


const categories=[
"Todos",
"Peluches",
"Vehículos",
"Figuras"
];



const filteredProducts = products.filter(product=>{


const matchesSearch =
product.name
.toLowerCase()
.includes(search.toLowerCase());



const matchesCategory =
category==="Todos" ||
product.category===category;



return matchesSearch && matchesCategory;


});



if (loading) {
  return <p>Cargando productos...</p>;
}


return (

<main className="products-page">


<h1>
Juguetes
</h1>



<div className="categories">


{
categories.map(cat=>(

<button

key={cat}

onClick={()=>setCategory(cat)}

>

{cat}

</button>

))

}


</div>




<section className="products-grid">


{

filteredProducts.map(product=>(

<ProductCard

key={product.id}

product={product}

/>

))

}


</section>


</main>

);

}


export default Products;