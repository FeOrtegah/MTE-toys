import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../services/api";
import "../../css/Brands.css";

function capitalizar(texto) {
  return texto
    .split(" ")
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
}

function Brands() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const brands = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      if (!p.category) return;
      if (!map[p.category]) {
        map[p.category] = { name: p.category, image: p.image, count: 0 };
      }
      map[p.category].count += 1;
    });
    return Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  function goToBrand(name) {
    navigate(`/productos?categoria=${encodeURIComponent(name)}`);
  }

  if (loading) return <p className="brands-status">Cargando marcas...</p>;

  return (
    <main className="brands-page">
      <h1>Nuestras marcas</h1>
      <p className="brands-subtitle">Descubre juguetes de tus marcas favoritas</p>

      <div className="brands-grid">
        {brands.map((brand) => (
          <button key={brand.name} className="brand-card" onClick={() => goToBrand(brand.name)}>
            <div className="brand-image">
              <img src={brand.image} alt={brand.name} />
            </div>
            <h3>{capitalizar(brand.name)}</h3>
            <span>{brand.count} {brand.count === 1 ? "producto" : "productos"}</span>
          </button>
        ))}
      </div>

      {brands.length === 0 && <p className="no-brands">No hay marcas disponibles todavía.</p>}
    </main>
  );
}

export default Brands;