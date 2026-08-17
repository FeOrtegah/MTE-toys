import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/organisms/Navbar";
import Contact from "./components/organisms/Contact";
import Footer from "./components/organisms/Footer";
import AddedToCartModal from "./components/organisms/AddedToCartModal";

import Home from "./pages/user/Home";
import Products from "./pages/user/Products";
import Brands from "./pages/user/Brands";
import ShippingPolicy from "./pages/user/ShippingPolicy";
import ReturnPolicy from "./pages/user/ReturnPolicy";
import Cart from "./pages/user/Cart";
import ContactPage from "./pages/user/Contact";
import ProductDetail from "./pages/user/ProductDetail";
import Checkout from "./pages/user/Checkout";
import PaymentResult from "./pages/user/PaymentResult";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminOrders from "./pages/admin/AdminOrders";

import Account from "./pages/user/Account";
import AccountHome from "./pages/user/AccountHome";
import MyOrders from "./pages/user/MyOrders";

function App() {
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

  return (
    <div className="app">

      <header
        className={`site-header ${
          showNavbar ? "navbar-show" : "navbar-hide"
        } ${
          showContact ? "with-contact" : "without-contact"
        }`}
      >
        <Contact />
        <Navbar />
      </header>

      <main className="content">
        <Routes>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/registro"
            element={<Register />}
          />

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/productos"
            element={<Products />}
          />

          <Route
            path="/marcas"
            element={<Brands />}
          />

          <Route
            path="/politicas-envio"
            element={<ShippingPolicy />}
          />

          <Route
            path="/politicas-cambio"
            element={<ReturnPolicy />}
          />

          <Route
            path="/producto/:id"
            element={<ProductDetail />}
          />

          <Route
            path="/carrito"
            element={<Cart />}
          />

          <Route
            path="/contacto"
            element={<ContactPage />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/pago-resultado"
            element={<PaymentResult />}
          />

          <Route
            path="/mi-cuenta"
            element={<AccountHome />}
          />

          <Route
            path="/mi-cuenta/perfil"
            element={<Account />}
          />

          <Route
            path="/mi-cuenta/compras"
            element={<MyOrders />}
          />

          <Route
            path="/admin/pedidos"
            element={
              <ProtectedAdminRoute>
                <AdminOrders />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

        </Routes>
      </main>

      <Footer />

      <AddedToCartModal />

    </div>
  );
}

export default App;