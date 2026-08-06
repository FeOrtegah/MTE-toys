import { Routes, Route } from "react-router-dom";

import Navbar from "./components/organisms/Navbar";
import Contact from "./components/organisms/Contact";
import Home from "./pages/user/Home";
import Products from "./pages/user/Products";
import Cart from "./pages/user/Cart";
import ContactPage from "./pages/user/Contact";
import ProductDetail from "./pages/user/ProductDetail";
import Footer from "./components/organisms/Footer";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Checkout from "./pages/user/Checkout";


function App(){

return(
<div className="app">

<Contact/>
<Navbar/>

<main className="content">

<Routes>
<Route path="/login" element={<Login/>}/>
<Route path="/registro" element={<Register/>}/>
<Route path="/" element={<Home/>}/>
<Route path="/productos" element={<Products/>}/>
<Route path="/producto/:id" element={<ProductDetail/>}/>
<Route path="/carrito" element={<Cart/>}/>
<Route path="/contacto" element={<ContactPage/>}/>
<Route path="/checkout" element={<Checkout/>}/>
</Routes>

</main>

<Footer/>

</div>
);

}

export default App;