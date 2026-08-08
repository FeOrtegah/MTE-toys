import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../css/Navbar.css";
import LogoMTE from "../../assets/LogoMTE.png";
import { useCart } from "../../context/CartContext";
import { useSearch } from "../../context/SearchContext";
import { useUser } from "../../context/UserContext";
import { getProducts } from "../../services/api";

function Navbar(){

const {cart}=useCart();
const {search,setSearch}=useSearch();
const {user,logout}=useUser();

const [allProducts,setAllProducts]=useState([]);

useEffect(()=>{

getProducts()
.then(setAllProducts)
.catch(()=>setAllProducts([]));

},[]);

const filteredProducts =
search.trim()===""
?
[]
:
allProducts
.filter(product=>
product.name.toLowerCase().includes(search.toLowerCase())
)
.slice(0,5);

return(

<>

<nav className="navbar">

<div className="logo">
<Link to="/">
<img src={LogoMTE} alt="MTE Toys"/>
</Link>
</div>

<div className="search">

<input
value={search}
onChange={(e)=>setSearch(e.target.value)}
placeholder="Buscar juguetes..."
/>

<button>
🔍
</button>

{filteredProducts.length>0 && (
<div className="search-results">
{filteredProducts.map(product=>(
<Link
key={product.id}
to={`/producto/${product.id}`}
className="search-item"
onClick={()=>setSearch("")}
>
<img
src={product.image}
alt={product.name}
/>
<span>
{product.name}
</span>
</Link>
))}
</div>
)}

</div>

<div className="actions">

{
user ?
<div className="user-menu">
<span>
👤 {user.name || user.email}
</span>
<button onClick={logout}>
Salir
</button>
</div>
:
<Link to="/login" className="user">
👤
</Link>
}

<Link to="/carrito" className="cart">
🛒
<span className="cart-count">
{cart.length}
</span>
</Link>

</div>

</nav>

<div className="menu">
<Link to="/">Inicio</Link>
<Link to="/productos">Juguetes</Link>
<Link to="/productos">Categorías</Link>
<Link to="/productos">Marcas</Link>
<Link to="/contacto">Contacto</Link>
</div>

</>

);

}

export default Navbar;