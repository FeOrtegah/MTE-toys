import { useState } from "react";

import {
  createCombo,
  updateCombo,
  deleteCombo,
  hardDeleteCombo,
  activateCombo,
} from "../../services/comboService";

import { uploadImages } from "../../services/uploadService";
import { obtenerImagenesProductos } from "../../utils/comboImages";

const COMBO_VACIO = {
  nombre: "",
  descripcion: "",
  productoPrincipal: "",
  productoAdicional: "",
  cantidadAdicional: 1,
  precioCombo: "",
  precioOferta: "",
  enOferta: false,
  destacado: false,
  imagenes: [],
};

function CombosSection({ combos, setCombos, products }) {
  // ============ CREAR ============

  const [modalCrearAbierto, setModalCrearAbierto] =
    useState(false);

  const [comboForm, setComboForm] =
    useState(COMBO_VACIO);

  const [
    subiendoImagenesCrear,
    setSubiendoImagenesCrear,
  ] = useState(false);

  const [creandoCombo, setCreandoCombo] =
    useState(false);

  const [urlImagenCombo, setUrlImagenCombo] =
    useState("");

  function abrirModalCrear() {
    setComboForm(COMBO_VACIO);
    setUrlImagenCombo("");
    setModalCrearAbierto(true);
  }

  function cerrarModalCrear() {
    setModalCrearAbierto(false);
    setComboForm(COMBO_VACIO);
    setUrlImagenCombo("");
  }

  function copiarImagenesCombo() {
    const imagenes = obtenerImagenesProductos(
      products,
      comboForm.productoPrincipal,
      comboForm.productoAdicional
    );

    if (imagenes.length === 0) {
      alert(
        "Los productos seleccionados no tienen imágenes."
      );
      return;
    }

    setComboForm((prev) => ({ ...prev, imagenes }));
  }

  function removeImagenCombo(url) {
    setComboForm((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter(
        (img) => img !== url
      ),
    }));
  }

  function addImagenComboPorUrl() {
    const url = urlImagenCombo.trim();

    if (!url) return;

    if (comboForm.imagenes.includes(url)) {
      setUrlImagenCombo("");
      return;
    }

    setComboForm((prev) => ({
      ...prev,
      imagenes: [...prev.imagenes, url],
    }));

    setUrlImagenCombo("");
  }

  async function handleImagenesComboChange(e) {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }

    setSubiendoImagenesCrear(true);

    try {
      const urls = await uploadImages(files);

      setComboForm((prev) => ({
        ...prev,
        imagenes: [...prev.imagenes, ...urls],
      }));
    } catch (err) {
      alert(err.message);
    } finally {
      setSubiendoImagenesCrear(false);
      e.target.value = "";
    }
  }

  async function handleCreateCombo() {
    if (
      !comboForm.nombre ||
      !comboForm.productoPrincipal ||
      !comboForm.productoAdicional ||
      !comboForm.precioCombo
    ) {
      alert(
        "Completa todos los campos obligatorios del combo"
      );
      return;
    }

    setCreandoCombo(true);

    try {
      let imagenes = comboForm.imagenes;

      if (imagenes.length === 0) {
        imagenes = obtenerImagenesProductos(
          products,
          comboForm.productoPrincipal,
          comboForm.productoAdicional
        );
      }

      const newCombo = await createCombo({
        ...comboForm,
        descripcion: comboForm.descripcion,

        cantidadAdicional: Number(
          comboForm.cantidadAdicional
        ),

        precioCombo: Number(
          comboForm.precioCombo
        ),

        precioOferta:
          comboForm.precioOferta === ""
            ? null
            : Number(comboForm.precioOferta),

        enOferta: Boolean(comboForm.enOferta),
        destacado: Boolean(comboForm.destacado),
        imagenes,
      });

      setCombos((prev) => [newCombo, ...prev]);
      cerrarModalCrear();
    } catch (err) {
      alert(err.message);
    } finally {
      setCreandoCombo(false);
    }
  }

  // ============ EDITAR ============

  const [editingComboId, setEditingComboId] =
    useState(null);

  const [comboDraft, setComboDraft] = useState({});

  const [
    subiendoImagenesEdit,
    setSubiendoImagenesEdit,
  ] = useState(false);

  const [urlImagenComboEdit, setUrlImagenComboEdit] =
    useState("");

  function startEditCombo(combo) {
    setEditingComboId(combo._id);

    setComboDraft({
      nombre: combo.nombre || "",
      descripcion: combo.descripcion || "",

      productoPrincipal:
        combo.productoPrincipal?._id ||
        combo.productoPrincipal ||
        "",

      productoAdicional:
        combo.productoAdicional?._id ||
        combo.productoAdicional ||
        "",

      cantidadAdicional:
        combo.cantidadAdicional || 1,

      precioCombo: combo.precioCombo ?? "",
      precioOferta: combo.precioOferta ?? "",
      enOferta: Boolean(combo.enOferta),
      destacado: Boolean(combo.destacado),
      imagenes: combo.imagenes || [],
      activo: combo.activo !== false,
    });

    setUrlImagenComboEdit("");
  }

  function cancelEditCombo() {
    setEditingComboId(null);
    setComboDraft({});
    setUrlImagenComboEdit("");
  }

  function removeImagenComboEdit(url) {
    setComboDraft((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter(
        (img) => img !== url
      ),
    }));
  }

  function addImagenComboPorUrlEdit() {
    const url = urlImagenComboEdit.trim();

    if (!url) return;

    if (comboDraft.imagenes.includes(url)) {
      setUrlImagenComboEdit("");
      return;
    }

    setComboDraft((prev) => ({
      ...prev,
      imagenes: [...prev.imagenes, url],
    }));

    setUrlImagenComboEdit("");
  }

  async function handleImagenesComboChangeEdit(e) {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }

    setSubiendoImagenesEdit(true);

    try {
      const urls = await uploadImages(files);

      setComboDraft((prev) => ({
        ...prev,
        imagenes: [...prev.imagenes, ...urls],
      }));
    } catch (err) {
      alert(err.message);
    } finally {
      setSubiendoImagenesEdit(false);
      e.target.value = "";
    }
  }

  function copiarImagenesComboEdit() {
    const imagenes = obtenerImagenesProductos(
      products,
      comboDraft.productoPrincipal,
      comboDraft.productoAdicional
    );

    setComboDraft((prev) => ({ ...prev, imagenes }));
  }

  async function saveComboEdit(id) {
    try {
      const data = {
        nombre: comboDraft.nombre.trim(),
        descripcion:
          comboDraft.descripcion?.trim() || "",
        productoPrincipal:
          comboDraft.productoPrincipal,
        productoAdicional:
          comboDraft.productoAdicional,

        cantidadAdicional: Number(
          comboDraft.cantidadAdicional
        ),

        precioCombo: Number(
          comboDraft.precioCombo
        ),

        precioOferta:
          comboDraft.precioOferta === ""
            ? null
            : Number(comboDraft.precioOferta),

        enOferta: Boolean(comboDraft.enOferta),
        destacado: Boolean(comboDraft.destacado),
        imagenes: comboDraft.imagenes || [],
        activo: Boolean(comboDraft.activo),
      };

      const savedCombo = await updateCombo(id, data);

      setCombos((prev) =>
        prev.map((combo) =>
          combo._id === id ? savedCombo : combo
        )
      );

      cancelEditCombo();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteCombo(id) {
    if (!confirm("¿Desactivar este combo?")) {
      return;
    }

    try {
      await deleteCombo(id);

      setCombos((prev) =>
        prev.map((combo) =>
          combo._id === id
            ? { ...combo, activo: false }
            : combo
        )
      );

      cancelEditCombo();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleActivateCombo(id) {
    try {
      await activateCombo(id);

      setCombos((prev) =>
        prev.map((combo) =>
          String(combo._id) === String(id)
            ? { ...combo, activo: true }
            : combo
        )
      );

      cancelEditCombo();
    } catch (err) {
      console.error("Error activando combo:", err);

      alert(
        err.message || "No se pudo activar el combo"
      );
    }
  }

  async function handleHardDeleteCombo(id, nombre) {
    if (
      !confirm(
        `¿Eliminar "${nombre}" de forma PERMANENTE? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    try {
      await hardDeleteCombo(id);

      setCombos((prev) =>
        prev.filter((combo) => combo._id !== id)
      );

      cancelEditCombo();
    } catch (err) {
      alert(err.message);
    }
  }

  const comboModal = editingComboId
    ? combos.find((c) => c._id === editingComboId)
    : null;

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <h2>Combos</h2>

        <button
          type="button"
          className="btn-anadir"
          onClick={abrirModalCrear}
        >
          + Añadir combo
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Principal</th>
              <th>Adicional</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Oferta</th>
              <th>Destacado</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {combos.map((combo) => (
              <tr
                key={combo._id}
                className={
                  !combo.activo ? "row-inactivo" : ""
                }
              >
                <td>
                  <img
                    className="admin-thumb"
                    src={
                      combo.imagenes?.[0] ||
                      combo.productoPrincipal
                        ?.imagenes?.[0] ||
                      combo.productoPrincipal
                        ?.images?.[0]
                    }
                    alt={combo.nombre}
                  />
                </td>

                <td>{combo.nombre}</td>
                <td>{combo.descripcion || "—"}</td>

                <td>
                  {combo.productoPrincipal?.name ||
                    combo.productoPrincipal
                      ?.nombre ||
                    "—"}
                </td>

                <td>
                  {combo.productoAdicional?.name ||
                    combo.productoAdicional
                      ?.nombre ||
                    "—"}
                </td>

                <td>{combo.cantidadAdicional}</td>

                <td>
                  {`$${Number(
                    combo.precioCombo
                  ).toLocaleString("es-CL")}`}
                </td>

                <td>
                  {combo.enOferta &&
                  combo.precioOferta
                    ? `$${Number(
                        combo.precioOferta
                      ).toLocaleString("es-CL")}`
                    : "—"}
                </td>

                <td>
                  {combo.destacado ? "⭐" : "—"}
                </td>

                <td>
                  {combo.activo ? (
                    <span className="badge-activo">
                      Activo
                    </span>
                  ) : (
                    <span className="badge-inactivo">
                      Inactivo
                    </span>
                  )}
                </td>

                <td className="admin-actions">
                  <button
                    className="btn-editar"
                    onClick={() =>
                      startEditCombo(combo)
                    }
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ============ MODAL CREAR ============ */}

      {modalCrearAbierto && (
        <div
          className="admin-modal-overlay"
          onClick={cerrarModalCrear}
        >
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3>Nuevo combo</h3>

              <button
                className="admin-modal-close"
                onClick={cerrarModalCrear}
                aria-label="Cerrar"
                type="button"
              >
                ×
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-modal-field">
                <label>Nombre</label>

                <input
                  type="text"
                  value={comboForm.nombre}
                  onChange={(e) =>
                    setComboForm({
                      ...comboForm,
                      nombre: e.target.value,
                    })
                  }
                />
              </div>

              <div className="admin-modal-field">
                <label>Descripción</label>

                <textarea
                  value={comboForm.descripcion}
                  onChange={(e) =>
                    setComboForm({
                      ...comboForm,
                      descripcion: e.target.value,
                    })
                  }
                />
              </div>

              <div className="admin-modal-row">
                <div className="admin-modal-field">
                  <label>Producto principal</label>

                  <select
                    value={
                      comboForm.productoPrincipal
                    }
                    onChange={(e) =>
                      setComboForm({
                        ...comboForm,
                        productoPrincipal:
                          e.target.value,
                      })
                    }
                  >
                    <option value="">
                      Seleccionar...
                    </option>

                    {products
                      .filter((p) => p.activo)
                      .map((p) => (
                        <option
                          key={p.id}
                          value={p.id}
                        >
                          {p.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="admin-modal-field">
                  <label>Producto adicional</label>

                  <select
                    value={
                      comboForm.productoAdicional
                    }
                    onChange={(e) =>
                      setComboForm({
                        ...comboForm,
                        productoAdicional:
                          e.target.value,
                      })
                    }
                  >
                    <option value="">
                      Seleccionar...
                    </option>

                    {products
                      .filter((p) => p.activo)
                      .map((p) => (
                        <option
                          key={p.id}
                          value={p.id}
                        >
                          {p.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="admin-modal-row">
                <div className="admin-modal-field">
                  <label>Cantidad adicional</label>

                  <input
                    type="number"
                    min="1"
                    value={
                      comboForm.cantidadAdicional
                    }
                    onChange={(e) =>
                      setComboForm({
                        ...comboForm,
                        cantidadAdicional:
                          e.target.value,
                      })
                    }
                  />
                </div>

                <div className="admin-modal-field">
                  <label>Precio combo</label>

                  <input
                    type="number"
                    value={comboForm.precioCombo}
                    onChange={(e) =>
                      setComboForm({
                        ...comboForm,
                        precioCombo: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="admin-modal-field">
                <label>Precio oferta</label>

                <input
                  type="number"
                  placeholder="Sin oferta"
                  value={comboForm.precioOferta}
                  onChange={(e) =>
                    setComboForm({
                      ...comboForm,
                      precioOferta: e.target.value,
                    })
                  }
                />
              </div>

              <div className="admin-modal-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={comboForm.enOferta}
                    onChange={(e) =>
                      setComboForm({
                        ...comboForm,
                        enOferta: e.target.checked,
                      })
                    }
                  />
                  En oferta
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={comboForm.destacado}
                    onChange={(e) =>
                      setComboForm({
                        ...comboForm,
                        destacado: e.target.checked,
                      })
                    }
                  />
                  Destacado
                </label>
              </div>

              <div className="admin-modal-field">
                <label>Imágenes</label>

                <div className="edit-imagenes">
                  <button
                    type="button"
                    onClick={copiarImagenesCombo}
                  >
                    Usar imágenes de los productos
                  </button>

                  <div className="edit-imagenes-preview">
                    {comboForm.imagenes.map(
                      (url) => (
                        <div
                          className="preview-thumb-sm"
                          key={url}
                        >
                          <img
                            src={url}
                            alt="combo"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeImagenCombo(url)
                            }
                          >
                            ×
                          </button>
                        </div>
                      )
                    )}
                  </div>

                  <label className="btn-subir-imagen-sm">
                    {subiendoImagenesCrear
                      ? "..."
                      : "+ Subir"}

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      disabled={
                        subiendoImagenesCrear
                      }
                      onChange={
                        handleImagenesComboChange
                      }
                    />
                  </label>

                  <div className="url-imagen-row-sm">
                    <input
                      type="text"
                      placeholder="URL imagen"
                      value={urlImagenCombo}
                      onChange={(e) =>
                        setUrlImagenCombo(
                          e.target.value
                        )
                      }
                    />

                    <button
                      type="button"
                      onClick={addImagenComboPorUrl}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <div className="admin-modal-footer-left" />

              <div className="admin-modal-footer-right">
                <button
                  className="btn-cancelar"
                  onClick={cerrarModalCrear}
                >
                  Cancelar
                </button>

                <button
                  className="btn-guardar"
                  disabled={
                    creandoCombo ||
                    subiendoImagenesCrear
                  }
                  onClick={handleCreateCombo}
                >
                  {creandoCombo
                    ? "Creando..."
                    : "Crear combo"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ MODAL EDITAR ============ */}

      {comboModal && (
        <div
          className="admin-modal-overlay"
          onClick={cancelEditCombo}
        >
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3>Editar combo</h3>

              <button
                className="admin-modal-close"
                onClick={cancelEditCombo}
                aria-label="Cerrar"
                type="button"
              >
                ×
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-modal-field">
                <label>Nombre</label>

                <input
                  type="text"
                  value={comboDraft.nombre}
                  onChange={(e) =>
                    setComboDraft({
                      ...comboDraft,
                      nombre: e.target.value,
                    })
                  }
                />
              </div>

              <div className="admin-modal-field">
                <label>Descripción</label>

                <textarea
                  value={comboDraft.descripcion}
                  onChange={(e) =>
                    setComboDraft({
                      ...comboDraft,
                      descripcion: e.target.value,
                    })
                  }
                />
              </div>

              <div className="admin-modal-row">
                <div className="admin-modal-field">
                  <label>Producto principal</label>

                  <select
                    value={
                      comboDraft.productoPrincipal
                    }
                    onChange={(e) =>
                      setComboDraft({
                        ...comboDraft,
                        productoPrincipal:
                          e.target.value,
                      })
                    }
                  >
                    {products
                      .filter((p) => p.activo)
                      .map((p) => (
                        <option
                          key={p.id}
                          value={p.id}
                        >
                          {p.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="admin-modal-field">
                  <label>Producto adicional</label>

                  <select
                    value={
                      comboDraft.productoAdicional
                    }
                    onChange={(e) =>
                      setComboDraft({
                        ...comboDraft,
                        productoAdicional:
                          e.target.value,
                      })
                    }
                  >
                    {products
                      .filter((p) => p.activo)
                      .map((p) => (
                        <option
                          key={p.id}
                          value={p.id}
                        >
                          {p.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="admin-modal-row">
                <div className="admin-modal-field">
                  <label>Cantidad adicional</label>

                  <input
                    type="number"
                    min="1"
                    value={
                      comboDraft.cantidadAdicional
                    }
                    onChange={(e) =>
                      setComboDraft({
                        ...comboDraft,
                        cantidadAdicional:
                          e.target.value,
                      })
                    }
                  />
                </div>

                <div className="admin-modal-field">
                  <label>Precio combo</label>

                  <input
                    type="number"
                    value={comboDraft.precioCombo}
                    onChange={(e) =>
                      setComboDraft({
                        ...comboDraft,
                        precioCombo: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="admin-modal-field">
                <label>Precio oferta</label>

                <input
                  type="number"
                  placeholder="Sin oferta"
                  value={comboDraft.precioOferta}
                  onChange={(e) =>
                    setComboDraft({
                      ...comboDraft,
                      precioOferta: e.target.value,
                    })
                  }
                />
              </div>

              <div className="admin-modal-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={comboDraft.enOferta}
                    onChange={(e) =>
                      setComboDraft({
                        ...comboDraft,
                        enOferta: e.target.checked,
                      })
                    }
                  />
                  En oferta
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={comboDraft.destacado}
                    onChange={(e) =>
                      setComboDraft({
                        ...comboDraft,
                        destacado: e.target.checked,
                      })
                    }
                  />
                  Destacado
                </label>
              </div>

              <div className="admin-modal-field">
                <label>Imágenes</label>

                <div className="edit-imagenes">
                  <button
                    type="button"
                    onClick={
                      copiarImagenesComboEdit
                    }
                  >
                    Usar imágenes de los productos
                  </button>

                  <div className="edit-imagenes-preview">
                    {comboDraft.imagenes?.map(
                      (url) => (
                        <div
                          className="preview-thumb-sm"
                          key={url}
                        >
                          <img
                            src={url}
                            alt="combo"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeImagenComboEdit(
                                url
                              )
                            }
                          >
                            ×
                          </button>
                        </div>
                      )
                    )}
                  </div>

                  <label className="btn-subir-imagen-sm">
                    {subiendoImagenesEdit
                      ? "..."
                      : "+ Subir"}

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      disabled={
                        subiendoImagenesEdit
                      }
                      onChange={
                        handleImagenesComboChangeEdit
                      }
                    />
                  </label>

                  <div className="url-imagen-row-sm">
                    <input
                      type="text"
                      placeholder="URL imagen"
                      value={urlImagenComboEdit}
                      onChange={(e) =>
                        setUrlImagenComboEdit(
                          e.target.value
                        )
                      }
                    />

                    <button
                      type="button"
                      onClick={
                        addImagenComboPorUrlEdit
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <div className="admin-modal-footer-left">
                {comboModal.activo ? (
                  <button
                    className="btn-eliminar"
                    onClick={() =>
                      handleDeleteCombo(
                        comboModal._id
                      )
                    }
                  >
                    Desactivar
                  </button>
                ) : (
                  <button
                    className="btn-activar"
                    onClick={() =>
                      handleActivateCombo(
                        comboModal._id
                      )
                    }
                  >
                    Activar
                  </button>
                )}

                <button
                  className="btn-borrar"
                  onClick={() =>
                    handleHardDeleteCombo(
                      comboModal._id,
                      comboModal.nombre
                    )
                  }
                >
                  Eliminar
                </button>
              </div>

              <div className="admin-modal-footer-right">
                <button
                  className="btn-cancelar"
                  onClick={cancelEditCombo}
                >
                  Cancelar
                </button>

                <button
                  className="btn-guardar"
                  onClick={() =>
                    saveComboEdit(comboModal._id)
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

export default CombosSection;