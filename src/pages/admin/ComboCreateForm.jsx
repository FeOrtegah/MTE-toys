import { useState } from "react";
import { createCombo } from "../../services/comboService";
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

function ComboCreateForm({ products, onCreated }) {
  const [comboForm, setComboForm] =
    useState(COMBO_VACIO);

  const [subiendoImagenes, setSubiendoImagenes] =
    useState(false);

  const [creandoCombo, setCreandoCombo] =
    useState(false);

  const [urlImagenCombo, setUrlImagenCombo] =
    useState("");

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

    setSubiendoImagenes(true);

    try {
      const urls = await uploadImages(files);

      setComboForm((prev) => ({
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

  async function handleCreateCombo(e) {
    e.preventDefault();

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

      onCreated(newCombo);
      setComboForm(COMBO_VACIO);
      setUrlImagenCombo("");
    } catch (err) {
      alert(err.message);
    } finally {
      setCreandoCombo(false);
    }
  }

  return (
    <section className="admin-section">
      <h2>Crear combo</h2>

      <form
        className="combo-form"
        onSubmit={handleCreateCombo}
      >
        <input
          type="text"
          placeholder="Nombre del combo"
          value={comboForm.nombre}
          onChange={(e) =>
            setComboForm({
              ...comboForm,
              nombre: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Descripción del combo"
          value={comboForm.descripcion}
          onChange={(e) =>
            setComboForm({
              ...comboForm,
              descripcion: e.target.value,
            })
          }
        />

        <select
          value={comboForm.productoPrincipal}
          onChange={(e) =>
            setComboForm({
              ...comboForm,
              productoPrincipal: e.target.value,
            })
          }
        >
          <option value="">
            Producto principal...
          </option>

          {products
            .filter((p) => p.activo)
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
        </select>

        <select
          value={comboForm.productoAdicional}
          onChange={(e) =>
            setComboForm({
              ...comboForm,
              productoAdicional: e.target.value,
            })
          }
        >
          <option value="">
            Producto adicional...
          </option>

          {products
            .filter((p) => p.activo)
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
        </select>

        <input
          type="number"
          min="1"
          placeholder="Cantidad adicional"
          value={comboForm.cantidadAdicional}
          onChange={(e) =>
            setComboForm({
              ...comboForm,
              cantidadAdicional: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Precio combo"
          value={comboForm.precioCombo}
          onChange={(e) =>
            setComboForm({
              ...comboForm,
              precioCombo: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Precio oferta"
          value={comboForm.precioOferta}
          onChange={(e) =>
            setComboForm({
              ...comboForm,
              precioOferta: e.target.value,
            })
          }
        />

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

        <button
          type="button"
          onClick={copiarImagenesCombo}
        >
          Usar imágenes de los productos
        </button>

        <div className="product-form-imagenes">
          <label className="btn-subir-imagen">
            {subiendoImagenes
              ? "Subiendo..."
              : "+ Subir imágenes"}

            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              disabled={subiendoImagenes}
              onChange={handleImagenesComboChange}
            />
          </label>

          <div className="url-imagen-row">
            <input
              type="text"
              placeholder="URL de imagen"
              value={urlImagenCombo}
              onChange={(e) =>
                setUrlImagenCombo(e.target.value)
              }
            />

            <button
              type="button"
              onClick={addImagenComboPorUrl}
            >
              Agregar
            </button>
          </div>

          <div className="product-form-preview">
            {comboForm.imagenes.map((url) => (
              <div
                className="preview-thumb"
                key={url}
              >
                <img src={url} alt="combo" />

                <button
                  type="button"
                  onClick={() =>
                    removeImagenCombo(url)
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={
            creandoCombo || subiendoImagenes
          }
        >
          {creandoCombo
            ? "Creando..."
            : "+ Crear combo"}
        </button>
      </form>
    </section>
  );
}

export default ComboCreateForm;