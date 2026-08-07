import { useState, useEffect } from "react";
import { getProducts } from "../../services/productService";
import ProductCard from "../../components/organisms/ProductCard";
import { useSearch } from "../../context/SearchContext";
import "../../css/Products.css";


function Products(){


const {search}=useSearch();


const [category,setCategory]=useState("Todos");
const [products,setProducts]=useState([]);
const [loading,setLoading]=useState(true);
const [error,setError]=useState(null);


useEffect(()=>{

getProducts()
.then(data=>setProducts(data))
.catch(err=>setError(err.message))
.finally(()=>setLoading(false));

},[]);



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



if(loading){
return <main className="products-page"><p>Cargando productos...</p></main>;
}


if(error){
return <main className="products-page"><p>Error al cargar productos: {error}</p></main>;
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