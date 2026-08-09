import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";


import Navbar from "./components/organisms/Navbar";
import Contact from "./components/organisms/Contact";
import Home from "./pages/user/Home";
import Products from "./pages/user/Products";
import Brands from "./pages/user/Brands";
import Cart from "./pages/user/Cart";
import ContactPage from "./pages/user/Contact";
import ProductDetail from "./pages/user/ProductDetail";
import Footer from "./components/organisms/Footer";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Checkout from "./pages/user/Checkout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";



function App(){

const [showNavbar, setShowNavbar] = useState(true);
const [showContact, setShowContact] = useState(true);

useEffect(() => {

let lastScrollY = window.scrollY;
let timer;

const handleScroll = () => {

const currentScrollY = window.scrollY;

if (currentScrollY <= 100) {

setShowContact(true);
setShowNavbar(true);

clearTimeout(timer);

} else {

setShowContact(false);

if (currentScrollY > lastScrollY) {

setShowNavbar(false);

clearTimeout(timer);

timer = setTimeout(() => {

setShowNavbar(true);

}, 3000);

} else {

setShowNavbar(true);

clearTimeout(timer);

}

}

lastScrollY = currentScrollY;

};

window.addEventListener("scroll", handleScroll);

return () => {
window.removeEventListener("scroll", handleScroll);
clearTimeout(timer);
};

}, []);

return(
<div className="app">

<header className={`site-header ${showNavbar ? "navbar-show" : "navbar-hide"} ${showContact ? "with-contact" : "without-contact"}`}>
<Contact/>
<Navbar/>
</header>

<main className="content">

<Routes>
<Route path="/login" element={<Login/>}/>
<Route path="/registro" element={<Register/>}/>
<Route path="/" element={<Home/>}/>
<Route path="/productos" element={<Products/>}/>
<Route path="/marcas" element={<Brands/>}/>
<Route path="/producto/:id" element={<ProductDetail/>}/>
<Route path="/carrito" element={<Cart/>}/>
<Route path="/contacto" element={<ContactPage/>}/>
<Route path="/checkout" element={<Checkout/>}/>
<Route
path="/admin"
element={
<ProtectedAdminRoute>
<AdminDashboard/>
</ProtectedAdminRoute>
}
/>
</Routes>

</main>

<Footer/>

</div>
);

}

export default App;