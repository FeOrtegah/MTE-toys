import { useState, useEffect, useMemo } from "react";
import {
  getAllProductsAdmin,
  updateProduct,
  deleteProduct,
} from "../../services/productService";
import {
  getAllCombosAdmin,
  createCombo,
  deleteCombo,
} from "../../services/comboService";
import "../../css/AdminDashboard.css";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({});

  const [comboForm, setComboForm] = useState({
    nombre: "",
    productoPrincipal: "",
    productoAdicional: "",
    cantidadAdicional: 1,
    precioCombo: "",
  });

  function cargarDatos() {
    setLoading(true);
    Promise.all([getAllProductsAdmin(), getAllCombosAdmin()])
      .then(([p, c]) => {
        setProducts(p);
        setCombos(c);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  const stats = useMemo(() => {
    return {
      totalJuguetes: products.length,
      stockTotal: products.reduce((acc, p) => acc + (p.stock || 0), 0),
      enOferta: products.filter((p) => p.enOferta).length,
      sinStock: products.filter((p) => p.stock === 0).length,
    };
  }, [products]);

  function startEdit(p) {
    setEditingId(p.id);
    setDraft({
      precio: p.price,
      precioOferta: p.precioOferta ?? "",
      enOferta: p.enOferta,
      stock: p.stock,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft({});
  }

  async function saveEdit(id) {
    try {
      await updateProduct(id, {
        precio: Number(draft.precio),
        precioOferta: draft.precioOferta === "" ? null : Number(draft.precioOferta),
        enOferta: Boolean(draft.enOferta),
        stock: Number(draft.stock),
      });
      cancelEdit();
      cargarDatos();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("¿Desactivar este producto? Ya no se mostrará en la tienda.")) return;
    try {
      await deleteProduct(id);
      cargarDatos();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleCreateCombo(e) {
    e.preventDefault();
    if (!comboForm.nombre || !comboForm.productoPrincipal || !comboForm.productoAdicional || !comboForm.precioCombo) {
      alert("Completa todos los campos del combo");
      return;
    }
    try {
      await createCombo({
        ...comboForm,
        cantidadAdicional: Number(comboForm.cantidadAdicional),
        precioCombo: Number(comboForm.precioCombo),
      });
      setComboForm({
        nombre: "",
        productoPrincipal: "",
        productoAdicional: "",
        cantidadAdicional: 1,
        precioCombo: "",
      });
      cargarDatos();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteCombo(id) {
    if (!confirm("¿Eliminar este combo?")) return;
    try {
      await deleteCombo(id);
      cargarDatos();
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p className="admin-loading">Cargando panel...</p>;
  if (error) return <p className="admin-error">{error}</p>;

  return (
    <main className="admin-dashboard">
      <h1>Panel de administración</h1>

      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-value">{stats.totalJuguetes}</span>
          <span className="stat-label">Juguetes distintos</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.stockTotal}</span>
          <span className="stat-label">Unidades en stock</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.enOferta}</span>
          <span className="stat-label">En oferta</span>
        </div>
        <div className="stat-card stat-warning">
          <span className="stat-value">{stats.sinStock}</span>
          <span className="stat-label">Sin stock</span>
        </div>
      </div>

      <section className="admin-section">
        <h2>Productos</h2>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Precio oferta</th>
                <th>¿En oferta?</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const isEditing = editingId === p.id;
                return (
                  <tr key={p.id} className={p.stock === 0 ? "row-sin-stock" : ""}>
                    <td>
                      <img className="admin-thumb" src={p.image} alt={p.name} />
                    </td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          value={draft.precio}
                          onChange={(e) => setDraft({ ...draft, precio: e.target.value })}
                        />
                      ) : (
                        `$${p.price.toLocaleString("es-CL")}`
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          placeholder="sin oferta"
                          value={draft.precioOferta}
                          onChange={(e) => setDraft({ ...draft, precioOferta: e.target.value })}
                        />
                      ) : p.precioOferta ? (
                        `$${p.precioOferta.toLocaleString("es-CL")}`
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="checkbox"
                          checked={draft.enOferta}
                          onChange={(e) => setDraft({ ...draft, enOferta: e.target.checked })}
                        />
                      ) : p.enOferta ? (
                        "✅"
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          value={draft.stock}
                          onChange={(e) => setDraft({ ...draft, stock: e.target.value })}
                        />
                      ) : (
                        p.stock
                      )}
                    </td>
                    <td className="admin-actions">
                      {isEditing ? (
                        <>
                          <button className="btn-guardar" onClick={() => saveEdit(p.id)}>Guardar</button>
                          <button className="btn-cancelar" onClick={cancelEdit}>Cancelar</button>
                        </>
                      ) : (
                        <>
                          <button className="btn-editar" onClick={() => startEdit(p)}>Editar</button>
                          <button className="btn-eliminar" onClick={() => handleDelete(p.id)}>Desactivar</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-section">
        <h2>Combos (juguete + dardos extra)</h2>

        <form className="combo-form" onSubmit={handleCreateCombo}>
          <input
            type="text"
            placeholder="Nombre del combo"
            value={comboForm.nombre}
            onChange={(e) => setComboForm({ ...comboForm, nombre: e.target.value })}
          />

          <select
            value={comboForm.productoPrincipal}
            onChange={(e) => setComboForm({ ...comboForm, productoPrincipal: e.target.value })}
          >
            <option value="">Juguete principal...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            value={comboForm.productoAdicional}
            onChange={(e) => setComboForm({ ...comboForm, productoAdicional: e.target.value })}
          >
            <option value="">Producto adicional (ej: dardos)...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            placeholder="Cantidad adicional"
            value={comboForm.cantidadAdicional}
            onChange={(e) => setComboForm({ ...comboForm, cantidadAdicional: e.target.value })}
          />

          <input
            type="number"
            placeholder="Precio del combo"
            value={comboForm.precioCombo}
            onChange={(e) => setComboForm({ ...comboForm, precioCombo: e.target.value })}
          />

          <button type="submit">+ Crear combo</button>
        </form>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Combo</th>
                <th>Principal</th>
                <th>Adicional</th>
                <th>Cantidad</th>
                <th>Precio combo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {combos.map((c) => (
                <tr key={c._id}>
                  <td>{c.nombre}</td>
                  <td>{c.productoPrincipal?.nombre || "—"}</td>
                  <td>{c.productoAdicional?.nombre || "—"}</td>
                  <td>{c.cantidadAdicional}</td>
                  <td>${c.precioCombo.toLocaleString("es-CL")}</td>
                  <td>
                    <button className="btn-eliminar" onClick={() => handleDeleteCombo(c._id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;