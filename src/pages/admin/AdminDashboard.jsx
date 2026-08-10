import { useState, useEffect, useMemo } from "react";
import {
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  hardDeleteProduct,
  activateProduct,
} from "../../services/productService";
import {
  getAllCombosAdmin,
  createCombo,
  deleteCombo,
} from "../../services/comboService";
import { uploadImages } from "../../services/uploadService";
import "../../css/AdminDashboard.css";

const PRODUCTO_VACIO = {
  nombre: "",
  descripcion: "",
  precio: "",
  precioOferta: "",
  enOferta: false,
  destacado: false,
  categoria: "",
  stock: "",
  imagenes: [],
};

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({});

  const [productForm, setProductForm] = useState(PRODUCTO_VACIO);
  const [subiendoImagenes, setSubiendoImagenes] = useState(false);
  const [creandoProducto, setCreandoProducto] = useState(false);
  const [urlImagen, setUrlImagen] = useState("");
  const [urlImagenEdit, setUrlImagenEdit] = useState("");

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
      destacado: p.destacado,
      stock: p.stock,
      imagenes: p.images || [],
    });
    setUrlImagenEdit("");
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft({});
    setUrlImagenEdit("");
  }

  async function saveEdit(id) {
    try {
      await updateProduct(id, {
        precio: Number(draft.precio),
        precioOferta: draft.precioOferta === "" ? null : Number(draft.precioOferta),
        enOferta: Boolean(draft.enOferta),
        destacado: Boolean(draft.destacado),
        stock: Number(draft.stock),
        imagenes: draft.imagenes,
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

  async function handleActivate(id) {
    try {
      await activateProduct(id);
      cargarDatos();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleHardDelete(id, nombre) {
    if (
      !confirm(
        `¿Eliminar "${nombre}" de forma PERMANENTE? Esta acción no se puede deshacer.`
      )
    )
      return;
    try {
      await hardDeleteProduct(id);
      cargarDatos();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleImagenesChange(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setSubiendoImagenes(true);
    try {
      const urls = await uploadImages(files);
      setProductForm((prev) => ({ ...prev, imagenes: [...prev.imagenes, ...urls] }));
    } catch (err) {
      alert(err.message);
    } finally {
      setSubiendoImagenes(false);
      e.target.value = "";
    }
  }

  function removeImagen(url) {
    setProductForm((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((img) => img !== url),
    }));
  }

  function addImagenPorUrl() {
    const url = urlImagen.trim();
    if (!url) return;
    if (productForm.imagenes.includes(url)) {
      setUrlImagen("");
      return;
    }
    setProductForm((prev) => ({ ...prev, imagenes: [...prev.imagenes, url] }));
    setUrlImagen("");
  }

  function removeImagenEdit(url) {
    setDraft((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((img) => img !== url),
    }));
  }

  function addImagenPorUrlEdit() {
    const url = urlImagenEdit.trim();
    if (!url) return;
    if (draft.imagenes.includes(url)) {
      setUrlImagenEdit("");
      return;
    }
    setDraft((prev) => ({ ...prev, imagenes: [...prev.imagenes, url] }));
    setUrlImagenEdit("");
  }

  async function handleImagenesChangeEdit(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setSubiendoImagenes(true);
    try {
      const urls = await uploadImages(files);
      setDraft((prev) => ({ ...prev, imagenes: [...prev.imagenes, ...urls] }));
    } catch (err) {
      alert(err.message);
    } finally {
      setSubiendoImagenes(false);
      e.target.value = "";
    }
  }

  async function handleCreateProduct(e) {
    e.preventDefault();
    if (!productForm.nombre || !productForm.precio || productForm.stock === "") {
      alert("Completa al menos nombre, precio y stock");
      return;
    }

    setCreandoProducto(true);
    try {
      await createProduct({
        nombre: productForm.nombre,
        descripcion: productForm.descripcion,
        precio: Number(productForm.precio),
        precioOferta: productForm.precioOferta === "" ? null : Number(productForm.precioOferta),
        enOferta: Boolean(productForm.enOferta),
        destacado: Boolean(productForm.destacado),
        categoria: productForm.categoria || "General",
        stock: Number(productForm.stock),
        imagenes: productForm.imagenes,
      });
      setProductForm(PRODUCTO_VACIO);
      cargarDatos();
    } catch (err) {
      alert(err.message);
    } finally {
      setCreandoProducto(false);
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
        <h2>Crear producto nuevo</h2>

        <form className="product-form" onSubmit={handleCreateProduct}>
          <input
            type="text"
            placeholder="Nombre del producto"
            value={productForm.nombre}
            onChange={(e) => setProductForm({ ...productForm, nombre: e.target.value })}
          />

          <input
            type="text"
            placeholder="Categoría"
            value={productForm.categoria}
            onChange={(e) => setProductForm({ ...productForm, categoria: e.target.value })}
          />

          <input
            type="number"
            placeholder="Precio"
            value={productForm.precio}
            onChange={(e) => setProductForm({ ...productForm, precio: e.target.value })}
          />

          <input
            type="number"
            placeholder="Precio oferta (opcional)"
            value={productForm.precioOferta}
            onChange={(e) => setProductForm({ ...productForm, precioOferta: e.target.value })}
          />

          <input
            type="number"
            placeholder="Stock"
            value={productForm.stock}
            onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
          />

          <textarea
            placeholder="Descripción"
            value={productForm.descripcion}
            onChange={(e) => setProductForm({ ...productForm, descripcion: e.target.value })}
          />

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={productForm.enOferta}
              onChange={(e) => setProductForm({ ...productForm, enOferta: e.target.checked })}
            />
            En oferta
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={productForm.destacado}
              onChange={(e) => setProductForm({ ...productForm, destacado: e.target.checked })}
            />
            Destacado
          </label>

          <div className="product-form-imagenes">
            <label className="btn-subir-imagen">
              {subiendoImagenes ? "Subiendo..." : "+ Subir imágenes"}
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                disabled={subiendoImagenes}
                onChange={handleImagenesChange}
              />
            </label>

            <div className="url-imagen-row">
              <input
                type="text"
                placeholder="O pega el link de una imagen (Cloudinary u otro)"
                value={urlImagen}
                onChange={(e) => setUrlImagen(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addImagenPorUrl();
                  }
                }}
              />
              <button type="button" onClick={addImagenPorUrl}>Agregar</button>
            </div>

            <div className="product-form-preview">
              {productForm.imagenes.map((url) => (
                <div className="preview-thumb" key={url}>
                  <img src={url} alt="preview" />
                  <button type="button" onClick={() => removeImagen(url)}>×</button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={creandoProducto || subiendoImagenes}>
            {creandoProducto ? "Creando..." : "+ Crear producto"}
          </button>
        </form>
      </section>

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
                <th>¿Destacado?</th>
                <th>Estado</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const isEditing = editingId === p.id;
                return (
                  <tr
                    key={p.id}
                    className={[
                      p.stock === 0 ? "row-sin-stock" : "",
                      !p.activo ? "row-inactivo" : "",
                    ].join(" ")}
                  >
                    <td>
                      {isEditing ? (
                        <div className="edit-imagenes">
                          <div className="edit-imagenes-preview">
                            {draft.imagenes.map((url) => (
                              <div className="preview-thumb-sm" key={url}>
                                <img src={url} alt="preview" />
                                <button type="button" onClick={() => removeImagenEdit(url)}>×</button>
                              </div>
                            ))}
                          </div>
                          <label className="btn-subir-imagen-sm">
                            {subiendoImagenes ? "..." : "+ Subir"}
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              hidden
                              disabled={subiendoImagenes}
                              onChange={handleImagenesChangeEdit}
                            />
                          </label>
                          <div className="url-imagen-row-sm">
                            <input
                              type="text"
                              placeholder="Link Cloudinary"
                              value={urlImagenEdit}
                              onChange={(e) => setUrlImagenEdit(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addImagenPorUrlEdit();
                                }
                              }}
                            />
                            <button type="button" onClick={addImagenPorUrlEdit}>+</button>
                          </div>
                        </div>
                      ) : (
                        <img className="admin-thumb" src={p.image} alt={p.name} />
                      )}
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
                          type="checkbox"
                          checked={draft.destacado}
                          onChange={(e) => setDraft({ ...draft, destacado: e.target.checked })}
                        />
                      ) : p.destacado ? (
                        "⭐"
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      {p.activo ? (
                        <span className="badge-activo">Activo</span>
                      ) : (
                        <span className="badge-inactivo">Inactivo</span>
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
                          {p.activo ? (
                            <button className="btn-eliminar" onClick={() => handleDelete(p.id)}>Desactivar</button>
                          ) : (
                            <button className="btn-activar" onClick={() => handleActivate(p.id)}>Activar</button>
                          )}
                          <button className="btn-borrar" onClick={() => handleHardDelete(p.id, p.name)}>Eliminar</button>
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