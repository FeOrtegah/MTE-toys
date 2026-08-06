import { Link } from "react-router-dom";
import "../../css/Navbar.css";
import LogoMTE from "../../assets/LogoMTE.png";
import { useCart } from "../../context/CartContext";
import { useSearch } from "../../context/SearchContext";
import { useUser } from "../../context/UserContext";

function Navbar(){

const {cart}=useCart();
const {search,setSearch}=useSearch();
const {user,logout}=useUser();


return(
<header>

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

</div>


<div className="actions">


{
user ? (

<div className="user-menu">

<span>
👤 {user.name}
</span>

<button onClick={logout}>
Salir
</button>

</div>

)

:

(

<Link 
to="/login"
className="user"
>
👤
</Link>

)

}



<Link 
to="/carrito"
className="cart"
>

🛒

<span className="cart-count">
{cart.length}
</span>

</Link>


</div>


</nav>



<div className="menu">

<Link to="/">
Inicio
</Link>

<Link to="/productos">
Juguetes
</Link>

<Link to="/productos">
Categorías
</Link>

<Link to="/productos">
Marcas
</Link>

<Link to="/contacto">
Contacto
</Link>

</div>


</header>
);

}

export default Navbar;