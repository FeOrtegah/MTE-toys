import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { getProducts } from "../../services/api";
import {
  getSiteContent,
  createSiteContent,
  updateSiteContent,
} from "../../services/siteContentService";
import EditableCard from "../../components/organisms/EditableCard";
import "../../css/Brands.css";

function capitalizar(texto) {
  return texto
    .split(" ")
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
}

function Brands() {
  const navigate = useNavigate();
  const { user } = useUser();
  const isAdmin = user?.rol === "admin";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Imágenes personalizadas por marca, guardadas por el
  // admin (misma sección "brand" que usa el carrusel del
  // home, así que editar una marca en cualquiera de los
  // dos lugares actualiza la misma imagen).
  const [overrides, setOverrides] = useState([]);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getSiteContent("brand")
      .then((items) => setOverrides(items || []))
      .catch(() => {
        // Si falla, simplemente no hay imágenes personalizadas
      });
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

  function encontrarOverride(nombreMarca) {
    return overrides.find(
      (o) =>
        o.titulo?.trim().toLowerCase() ===
        nombreMarca.trim().toLowerCase()
    );
  }

  async function handleSaveImagen(brand, draft) {
    const existente = encontrarOverride(brand.name);

    const datos = {
      imagen: draft.imagen,
      titulo: brand.name,
      link: `/productos?categoria=${encodeURIComponent(
        brand.name
      )}`,
    };

    if (existente) {
      const actualizado = await updateSiteContent(
        existente._id,
        datos
      );

      setOverrides((prev) =>
        prev.map((o) =>
          o._id === existente._id ? actualizado : o
        )
      );
    } else {
      const nuevo = await createSiteContent({
        ...datos,
        seccion: "brand",
      });

      setOverrides((prev) => [...prev, nuevo]);
    }
  }

  if (loading) return <p className="brands-status">Cargando marcas...</p>;

  return (
    <main className="brands-page">
      <h1>Nuestras marcas</h1>
      <p className="brands-subtitle">Descubre juguetes de tus marcas favoritas</p>

      <div className="brands-grid">
        {brands.map((brand) => {
          const override = encontrarOverride(
            brand.name
          );

          const imagenActual =
            override?.imagen || brand.image;

          return (
            <EditableCard
              key={brand.name}
              isAdmin={isAdmin}
              imagen={imagenActual}
              camposTexto="ninguno"
              onSave={(draft) =>
                handleSaveImagen(brand, draft)
              }
            >
              <button
                className="brand-card"
                onClick={() =>
                  goToBrand(brand.name)
                }
              >
                <div className="brand-image">
                  <img
                    src={imagenActual}
                    alt={brand.name}
                  />
                </div>
                <h3>{capitalizar(brand.name)}</h3>
                <span>
                  {brand.count}{" "}
                  {brand.count === 1
                    ? "producto"
                    : "productos"}
                </span>
              </button>
            </EditableCard>
          );
        })}
      </div>

      {brands.length === 0 && <p className="no-brands">No hay marcas disponibles todavía.</p>}
    </main>
  );
}

export default Brands;