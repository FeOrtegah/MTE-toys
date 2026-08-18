import { useState } from "react";

import {
  updateCombo,
  deleteCombo,
  hardDeleteCombo,
  activateCombo,
} from "../../services/comboService";

import { uploadImages } from "../../services/uploadService";
import { obtenerImagenesProductos } from "../../utils/comboImages";

function CombosSection({ combos, setCombos, products }) {
  const [editingComboId, setEditingComboId] =
    useState(null);

  const [comboDraft, setComboDraft] = useState({});

  const [subiendoImagenes, setSubiendoImagenes] =
    useState(false);

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

    setSubiendoImagenes(true);

    try {
      const urls = await uploadImages(files);

      setComboDraft((prev) => ({
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
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <section className="admin-section">
      <h2>Combos</h2>

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
            {combos.map((combo) => {
              const isEditing =
                editingComboId === combo._id;

              return (
                <tr
                  key={combo._id}
                  className={
                    !combo.activo
                      ? "row-inactivo"
                      : ""
                  }
                >
                  <td>
                    {isEditing ? (
                      <div className="edit-imagenes">
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

                        <button
                          type="button"
                          onClick={
                            copiarImagenesComboEdit
                          }
                        >
                          Usar imágenes de productos
                        </button>

                        <label className="btn-subir-imagen-sm">
                          {subiendoImagenes
                            ? "..."
                            : "+ Subir"}

                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            hidden
                            disabled={
                              subiendoImagenes
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
                            value={
                              urlImagenComboEdit
                            }
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
                    ) : (
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
                    )}
                  </td>

                  <td>
                    {isEditing ? (
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
                    ) : (
                      combo.nombre
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <textarea
                        value={
                          comboDraft.descripcion
                        }
                        onChange={(e) =>
                          setComboDraft({
                            ...comboDraft,
                            descripcion:
                              e.target.value,
                          })
                        }
                      />
                    ) : (
                      combo.descripcion || "—"
                    )}
                  </td>

                  <td>
                    {isEditing ? (
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
                    ) : (
                      combo.productoPrincipal
                        ?.name ||
                      combo.productoPrincipal
                        ?.nombre ||
                      "—"
                    )}
                  </td>

                  <td>
                    {isEditing ? (
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
                    ) : (
                      combo.productoAdicional
                        ?.name ||
                      combo.productoAdicional
                        ?.nombre ||
                      "—"
                    )}
                  </td>

                  <td>
                    {isEditing ? (
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
                    ) : (
                      combo.cantidadAdicional
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={
                          comboDraft.precioCombo
                        }
                        onChange={(e) =>
                          setComboDraft({
                            ...comboDraft,
                            precioCombo:
                              e.target.value,
                          })
                        }
                      />
                    ) : (
                      `$${Number(
                        combo.precioCombo
                      ).toLocaleString("es-CL")}`
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        placeholder="Sin oferta"
                        value={
                          comboDraft.precioOferta
                        }
                        onChange={(e) =>
                          setComboDraft({
                            ...comboDraft,
                            precioOferta:
                              e.target.value,
                          })
                        }
                      />
                    ) : combo.enOferta &&
                      combo.precioOferta ? (
                      `$${Number(
                        combo.precioOferta
                      ).toLocaleString("es-CL")}`
                    ) : (
                      "—"
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        type="checkbox"
                        checked={
                          comboDraft.enOferta
                        }
                        onChange={(e) =>
                          setComboDraft({
                            ...comboDraft,
                            enOferta:
                              e.target.checked,
                          })
                        }
                      />
                    ) : combo.enOferta ? (
                      "✅"
                    ) : (
                      "—"
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        type="checkbox"
                        checked={
                          comboDraft.destacado
                        }
                        onChange={(e) =>
                          setComboDraft({
                            ...comboDraft,
                            destacado:
                              e.target.checked,
                          })
                        }
                      />
                    ) : combo.destacado ? (
                      "⭐"
                    ) : (
                      "—"
                    )}
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
                    {isEditing ? (
                      <>
                        <button
                          className="btn-guardar"
                          onClick={() =>
                            saveComboEdit(combo._id)
                          }
                        >
                          Guardar
                        </button>

                        <button
                          className="btn-cancelar"
                          onClick={cancelEditCombo}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn-editar"
                          onClick={() =>
                            startEditCombo(combo)
                          }
                        >
                          Editar
                        </button>

                        {combo.activo ? (
                          <button
                            className="btn-eliminar"
                            onClick={() =>
                              handleDeleteCombo(
                                combo._id
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
                                combo._id
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
                              combo._id,
                              combo.nombre
                            )
                          }
                        >
                          Eliminar
                        </button>
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
  );
}

export default CombosSection;