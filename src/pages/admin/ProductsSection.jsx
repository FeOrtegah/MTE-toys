import { useState } from "react";

import {
  updateProduct,
  deleteProduct,
  hardDeleteProduct,
  activateProduct,
} from "../../services/productService";

import { uploadImages } from "../../services/uploadService";

function ProductsSection({ products, setProducts }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({});

  const [subiendoImagenes, setSubiendoImagenes] =
    useState(false);

  const [urlImagenEdit, setUrlImagenEdit] =
    useState("");

  function startEdit(p) {
    setEditingId(p.id);

    setDraft({
      nombre: p.name || "",
      descripcion:
        p.description || p.descripcion || "",
      precio: p.price ?? "",
      precioOferta: p.precioOferta ?? "",
      enOferta: Boolean(p.enOferta),
      destacado: Boolean(p.destacado),
      categoria: p.category || p.categoria || "",
      stock: p.stock ?? "",
      imagenes: p.images || p.imagenes || [],
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
      const updatedData = {
        nombre: draft.nombre.trim(),
        descripcion: draft.descripcion?.trim() || "",
        precio: Number(draft.precio),

        precioOferta:
          draft.precioOferta === ""
            ? null
            : Number(draft.precioOferta),

        enOferta: Boolean(draft.enOferta),
        destacado: Boolean(draft.destacado),
        categoria: draft.categoria?.trim() || "General",
        stock: Number(draft.stock),
        imagenes: draft.imagenes || [],
      };

      const savedProduct = await updateProduct(
        id,
        updatedData
      );

      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                ...savedProduct,
                name: updatedData.nombre,
                description: updatedData.descripcion,
                price: updatedData.precio,
                precioOferta: updatedData.precioOferta,
                enOferta: updatedData.enOferta,
                destacado: updatedData.destacado,
                category: updatedData.categoria,
                stock: updatedData.stock,
                images: updatedData.imagenes,
                image:
                  updatedData.imagenes?.[0] || p.image,
              }
            : p
        )
      );

      cancelEdit();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    if (
      !confirm(
        "¿Desactivar este producto? Ya no se mostrará en la tienda."
      )
    ) {
      return;
    }

    try {
      await deleteProduct(id);

      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, activo: false } : p
        )
      );

      cancelEdit();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleActivate(id) {
    try {
      await activateProduct(id);

      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, activo: true } : p
        )
      );

      cancelEdit();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleHardDelete(id, nombre) {
    if (
      !confirm(
        `¿Eliminar "${nombre}" de forma PERMANENTE? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    try {
      await hardDeleteProduct(id);

      setProducts((prev) =>
        prev.filter((p) => p.id !== id)
      );

      cancelEdit();
    } catch (err) {
      alert(err.message);
    }
  }

  function removeImagenEdit(url) {
    setDraft((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter(
        (img) => img !== url
      ),
    }));
  }

  function addImagenPorUrlEdit() {
    const url = urlImagenEdit.trim();

    if (!url) return;

    if (draft.imagenes.includes(url)) {
      setUrlImagenEdit("");
      return;
    }

    setDraft((prev) => ({
      ...prev,
      imagenes: [...prev.imagenes, url],
    }));

    setUrlImagenEdit("");
  }

  async function handleImagenesChangeEdit(e) {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }

    setSubiendoImagenes(true);

    try {
      const urls = await uploadImages(files);

      setDraft((prev) => ({
        ...prev,
        imagenes: [...prev.imagenes, ...urls],
      }));
    } catch (err) {
      alert(err.message);
    } finally {
      setSubiendoImagenes(false);
      e.target.value = "";
    }
  }

  const productoModal = editingId
    ? products.find((pr) => pr.id === editingId)
    : null;

  return (
    <section className="admin-section">
      <h2>Productos</h2>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Precio oferta</th>
              <th>Oferta</th>
              <th>Destacado</th>
              <th>Estado</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className={[
                  p.stock === 0 ? "row-sin-stock" : "",
                  !p.activo ? "row-inactivo" : "",
                ].join(" ")}
              >
                <td>
                  <img
                    className="admin-thumb"
                    src={p.image}
                    alt={p.name}
                  />
                </td>

                <td>{p.name}</td>
                <td>{p.description || "—"}</td>
                <td>{p.category}</td>

                <td>
                  {`$${p.price.toLocaleString(
                    "es-CL"
                  )}`}
                </td>

                <td>
                  {p.precioOferta
                    ? `$${p.precioOferta.toLocaleString(
                        "es-CL"
                      )}`
                    : "—"}
                </td>

                <td>{p.enOferta ? "✅" : "—"}</td>
                <td>{p.destacado ? "⭐" : "—"}</td>

                <td>
                  {p.activo ? (
                    <span className="badge-activo">
                      Activo
                    </span>
                  ) : (
                    <span className="badge-inactivo">
                      Inactivo
                    </span>
                  )}
                </td>

                <td>{p.stock}</td>

                <td className="admin-actions">
                  <button
                    className="btn-editar"
                    onClick={() => startEdit(p)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {productoModal && (
        <div
          className="admin-modal-overlay"
          onClick={cancelEdit}
        >
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3>Editar producto</h3>

              <button
                className="admin-modal-close"
                onClick={cancelEdit}
                aria-label="Cerrar"
                type="button"
              >
                ×
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-modal-field">
                <label>Imágenes</label>

                <div className="edit-imagenes">
                  <div className="edit-imagenes-preview">
                    {draft.imagenes?.map((url) => (
                      <div
                        className="preview-thumb-sm"
                        key={url}
                      >
                        <img src={url} alt="preview" />

                        <button
                          type="button"
                          onClick={() =>
                            removeImagenEdit(url)
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <label className="btn-subir-imagen-sm">
                    {subiendoImagenes
                      ? "..."
                      : "+ Subir"}

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      disabled={subiendoImagenes}
                      onChange={
                        handleImagenesChangeEdit
                      }
                    />
                  </label>

                  <div className="url-imagen-row-sm">
                    <input
                      type="text"
                      placeholder="URL imagen"
                      value={urlImagenEdit}
                      onChange={(e) =>
                        setUrlImagenEdit(
                          e.target.value
                        )
                      }
                    />

                    <button
                      type="button"
                      onClick={addImagenPorUrlEdit}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="admin-modal-field">
                <label>Nombre</label>

                <input
                  type="text"
                  value={draft.nombre}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      nombre: e.target.value,
                    })
                  }
                />
              </div>

              <div className="admin-modal-field">
                <label>Descripción</label>

                <textarea
                  value={draft.descripcion}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      descripcion: e.target.value,
                    })
                  }
                />
              </div>

              <div className="admin-modal-row">
                <div className="admin-modal-field">
                  <label>Categoría</label>

                  <input
                    type="text"
                    value={draft.categoria}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        categoria: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="admin-modal-field">
                  <label>Stock</label>

                  <input
                    type="number"
                    value={draft.stock}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        stock: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="admin-modal-row">
                <div className="admin-modal-field">
                  <label>Precio</label>

                  <input
                    type="number"
                    value={draft.precio}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        precio: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="admin-modal-field">
                  <label>Precio oferta</label>

                  <input
                    type="number"
                    placeholder="Sin oferta"
                    value={draft.precioOferta}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        precioOferta: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="admin-modal-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={draft.enOferta}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        enOferta: e.target.checked,
                      })
                    }
                  />
                  En oferta
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={draft.destacado}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        destacado: e.target.checked,
                      })
                    }
                  />
                  Destacado
                </label>
              </div>
            </div>

            <div className="admin-modal-footer">
              <div className="admin-modal-footer-left">
                {productoModal.activo ? (
                  <button
                    className="btn-eliminar"
                    onClick={() =>
                      handleDelete(productoModal.id)
                    }
                  >
                    Desactivar
                  </button>
                ) : (
                  <button
                    className="btn-activar"
                    onClick={() =>
                      handleActivate(productoModal.id)
                    }
                  >
                    Activar
                  </button>
                )}

                <button
                  className="btn-borrar"
                  onClick={() =>
                    handleHardDelete(
                      productoModal.id,
                      productoModal.name
                    )
                  }
                >
                  Eliminar
                </button>
              </div>

              <div className="admin-modal-footer-right">
                <button
                  className="btn-cancelar"
                  onClick={cancelEdit}
                >
                  Cancelar
                </button>

                <button
                  className="btn-guardar"
                  onClick={() =>
                    saveEdit(productoModal.id)
                  }
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProductsSection;