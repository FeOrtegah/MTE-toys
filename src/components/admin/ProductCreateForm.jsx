import { useState } from "react";
import { createProduct } from "../../services/productService";
import { uploadImages } from "../../services/uploadService";

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
  envioGratis: false,
  dimensiones: {
    largo: "",
    ancho: "",
    alto: "",
    peso: "",
  },
  edadMinima: "",
  edadMaxima: "",
};

function ProductCreateForm({ onCreated }) {
  const [productForm, setProductForm] =
    useState(PRODUCTO_VACIO);

  const [subiendoImagenes, setSubiendoImagenes] =
    useState(false);

  const [creandoProducto, setCreandoProducto] =
    useState(false);

  const [urlImagen, setUrlImagen] = useState("");

  async function handleImagenesChange(e) {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }

    setSubiendoImagenes(true);

    try {
      const urls = await uploadImages(files);

      setProductForm((prev) => ({
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

  function removeImagen(url) {
    setProductForm((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter(
        (img) => img !== url
      ),
    }));
  }

  function addImagenPorUrl() {
    const texto = urlImagen.trim();

    if (!texto) return;

    // Permite pegar varias URLs:
    // - una por línea
    // - separadas por coma
    // - separadas por espacios
    const urls = texto
      .split(/[\n,\s]+/)
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (urls.length === 0) {
      return;
    }

    setProductForm((prev) => {
      const imagenesActuales = prev.imagenes || [];

      const nuevasImagenes = urls.filter(
        (url) => !imagenesActuales.includes(url)
      );

      return {
        ...prev,
        imagenes: [
          ...imagenesActuales,
          ...nuevasImagenes,
        ],
      };
    });

    setUrlImagen("");
  }

  async function handleCreateProduct(e) {
    e.preventDefault();

    if (
      !productForm.nombre ||
      !productForm.precio ||
      productForm.stock === ""
    ) {
      alert(
        "Completa al menos nombre, precio y stock"
      );
      return;
    }

    setCreandoProducto(true);

    try {
      const newProduct = await createProduct({
        nombre: productForm.nombre,
        descripcion: productForm.descripcion,
        precio: Number(productForm.precio),

        precioOferta:
          productForm.precioOferta === ""
            ? null
            : Number(productForm.precioOferta),

        enOferta: Boolean(productForm.enOferta),
        destacado: Boolean(productForm.destacado),
        envioGratis: Boolean(productForm.envioGratis),

        categoria:
          productForm.categoria || "General",

        stock: Number(productForm.stock),
        imagenes: productForm.imagenes,

        dimensiones: {
          largo:
            productForm.dimensiones.largo === ""
              ? null
              : Number(productForm.dimensiones.largo),

          ancho:
            productForm.dimensiones.ancho === ""
              ? null
              : Number(productForm.dimensiones.ancho),

          alto:
            productForm.dimensiones.alto === ""
              ? null
              : Number(productForm.dimensiones.alto),

          peso:
            productForm.dimensiones.peso === ""
              ? null
              : Number(productForm.dimensiones.peso),
        },

        edadMinima:
          productForm.edadMinima === ""
            ? null
            : Number(productForm.edadMinima),

        edadMaxima:
          productForm.edadMaxima === ""
            ? null
            : Number(productForm.edadMaxima),
      });

      onCreated(newProduct);
      setProductForm(PRODUCTO_VACIO);
    } catch (err) {
      alert(err.message);
    } finally {
      setCreandoProducto(false);
    }
  }

  return (
    <section className="admin-section">
      <h2>Crear producto nuevo</h2>

      <form
        className="product-form"
        onSubmit={handleCreateProduct}
      >
        <input
          type="text"
          placeholder="Nombre del producto"
          value={productForm.nombre}
          onChange={(e) =>
            setProductForm({
              ...productForm,
              nombre: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Categoría"
          value={productForm.categoria}
          onChange={(e) =>
            setProductForm({
              ...productForm,
              categoria: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Precio"
          value={productForm.precio}
          onChange={(e) =>
            setProductForm({
              ...productForm,
              precio: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Precio oferta"
          value={productForm.precioOferta}
          onChange={(e) =>
            setProductForm({
              ...productForm,
              precioOferta: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Stock"
          value={productForm.stock}
          onChange={(e) =>
            setProductForm({
              ...productForm,
              stock: e.target.value,
            })
          }
        />

        <label className="product-form-dim-label">
          Dimensiones del embalaje original
          (opcional)
        </label>

        <p className="admin-field-hint">
          ⚠️ Estas medidas corresponden a la caja
          del producto y se toman como referencia
          para calcular el envío.
        </p>

        <div className="product-form-row">
          <input
            type="number"
            placeholder="Largo (cm)"
            value={productForm.dimensiones.largo}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                dimensiones: {
                  ...productForm.dimensiones,
                  largo: e.target.value,
                },
              })
            }
          />

          <input
            type="number"
            placeholder="Ancho (cm)"
            value={productForm.dimensiones.ancho}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                dimensiones: {
                  ...productForm.dimensiones,
                  ancho: e.target.value,
                },
              })
            }
          />

          <input
            type="number"
            placeholder="Alto (cm)"
            value={productForm.dimensiones.alto}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                dimensiones: {
                  ...productForm.dimensiones,
                  alto: e.target.value,
                },
              })
            }
          />

          <input
            type="number"
            placeholder="Peso (kg)"
            value={productForm.dimensiones.peso}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                dimensiones: {
                  ...productForm.dimensiones,
                  peso: e.target.value,
                },
              })
            }
          />
        </div>

        <label className="product-form-dim-label">
          Rango de edad recomendado (opcional, en
          meses)
        </label>

        <p className="admin-field-hint">
          ⚠️ Ej: 0 a 12 = "0-12 meses", 12 a 24 =
          "1-2 años", 144 a 1188 = "12-99 años". Se
          usa para el filtro "Regalos por edad" del
          inicio.
        </p>

        <div
          className="product-form-row"
          style={{
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          <input
            type="number"
            placeholder="Edad mínima (meses)"
            value={productForm.edadMinima}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                edadMinima: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Edad máxima (meses)"
            value={productForm.edadMaxima}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                edadMaxima: e.target.value,
              })
            }
          />
        </div>

        <textarea
          placeholder="Descripción"
          value={productForm.descripcion}
          onChange={(e) =>
            setProductForm({
              ...productForm,
              descripcion: e.target.value,
            })
          }
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={productForm.enOferta}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                enOferta: e.target.checked,
              })
            }
          />
          En oferta
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={productForm.destacado}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                destacado: e.target.checked,
              })
            }
          />
          Destacado
        </label>

        {/* NUEVO: ENVÍO GRATIS */}
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={productForm.envioGratis}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                envioGratis: e.target.checked,
              })
            }
          />
          Envío gratis (el cliente no paga
          despacho con este producto)
        </label>

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
              onChange={handleImagenesChange}
            />
          </label>

          <div className="url-imagen-row url-cloudinary">
            <textarea
              placeholder={`Pega una o varias URLs de Cloudinary aquí.
                Puedes poner una URL por línea o separarlas por comas.`}
              value={urlImagen}
              onChange={(e) =>
                setUrlImagen(e.target.value)
              }
              rows={4}
            />

            <button
              type="button"
              onClick={addImagenPorUrl}
            >
              Agregar imágenes
            </button>
          </div>

          <div className="product-form-preview">
            {productForm.imagenes.map((url) => (
              <div
                className="preview-thumb"
                key={url}
              >
                <img src={url} alt="preview" />

                <button
                  type="button"
                  onClick={() =>
                    removeImagen(url)
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
            creandoProducto || subiendoImagenes
          }
        >
          {creandoProducto
            ? "Creando..."
            : "+ Crear producto"}
        </button>
      </form>
    </section>
  );
}

export default ProductCreateForm;