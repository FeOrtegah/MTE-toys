import { useState, useEffect, useMemo } from "react";

import {
  getAllProductsAdmin,
} from "../../services/productService";

import {
  getAllCombosAdmin,
} from "../../services/comboService";

import { getOrders } from "../../services/orderService";

import StatsCards from "../../components/admin/StatsCards";
import AdminTabs from "../../components/admin/AdminTabs";
import OrdersSection from "../../components/admin/OrdersSection";
import ProductCreateForm from "../../components/admin/ProductCreateForm";
import ProductsSection from "../../components/admin/ProductsSection";
import CombosSection from "../../components/admin/CombosSection";

import "../../css/AdminDashboard.css";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] =
    useState("pedidos");

  function cargarDatosIniciales() {
    setLoading(true);

    Promise.all([
      getAllProductsAdmin(),
      getAllCombosAdmin(),
      getOrders(),
    ])
      .then(([p, c, o]) => {
        setProducts(p);
        setCombos(c);
        setOrders(o);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const stats = useMemo(() => {
    return {
      totalJuguetes: products.length,

      stockTotal: products.reduce(
        (acc, p) => acc + (p.stock || 0),
        0
      ),

      enOferta: products.filter((p) => p.enOferta)
        .length,

      sinStock: products.filter(
        (p) => p.stock === 0
      ).length,

      combos: combos.filter((c) => c.activo).length,
    };
  }, [products, combos]);

  const pedidosStats = useMemo(() => {
    return {
      pendientes: orders.filter(
        (o) => o.estado === "pendiente"
      ).length,

      pagados: orders.filter(
        (o) => o.estado === "pagado"
      ).length,
    };
  }, [orders]);

  if (loading) {
    return (
      <p className="admin-loading">
        Cargando panel...
      </p>
    );
  }

  if (error) {
    return <p className="admin-error">{error}</p>;
  }

  return (
    <main className="admin-dashboard">
      <h1>Panel de administración</h1>

      <StatsCards
        stats={stats}
        pedidosStats={pedidosStats}
      />

      <AdminTabs
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "pedidos" && (
        <OrdersSection
          orders={orders}
          setOrders={setOrders}
        />
      )}

      {activeTab === "crear-producto" && (
        <ProductCreateForm
          onCreated={(newProduct) => {
            setProducts((prev) => [
              newProduct,
              ...prev,
            ]);
            setActiveTab("productos");
          }}
        />
      )}

      {activeTab === "productos" && (
        <ProductsSection
          products={products}
          setProducts={setProducts}
        />
      )}

      {activeTab === "combos" && (
        <CombosSection
          combos={combos}
          setCombos={setCombos}
          products={products}
        />
      )}
    </main>
  );
}

export default AdminDashboard;