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
  updateCombo,
  deleteCombo,
  hardDeleteCombo,
  activateCombo,
} from "../../services/comboService";

import {
  getOrders,
  cancelOrder,
} from "../../services/orderService";

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

const ESTADOS_PEDIDO = {
  pendiente: {
    label: "Pendiente",
    className: "badge-pendiente",
  },
  pagado: {
    label: "Pagado",
    className: "badge-pagado",
  },
  enviado: {
    label: "Enviado",
    className: "badge-enviado",
  },
  cancelado: {
    label: "Cancelado",
    className: "badge-cancelado",
  },
};

function formatFechaPedido(fecha) {
  return new Date(fecha).toLocaleString("es-CL");
}

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({});

  const [editingComboId, setEditingComboId] =
    useState(null);

  const [comboDraft, setComboDraft] =
    useState({});

  const [productForm, setProductForm] =
    useState(PRODUCTO_VACIO);

  const [comboForm, setComboForm] =
    useState(COMBO_VACIO);

  const [subiendoImagenes, setSubiendoImagenes] =
    useState(false);

  const [creandoProducto, setCreandoProducto] =
    useState(false);

  const [creandoCombo, setCreandoCombo] =
    useState(false);

  const [urlImagen, setUrlImagen] =
    useState("");

  const [urlImagenEdit, setUrlImagenEdit] =
    useState("");

  const [urlImagenCombo, setUrlImagenCombo] =
    useState("");

  const [urlImagenComboEdit, setUrlImagenComboEdit] =
    useState("");

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

  function recargarPedidos() {
    getOrders()
      .then(setOrders)
      .catch((err) =>
        alert(
          err.message ||
            "No se pudieron recargar los pedidos"
        )
      );
  }

  const stats = useMemo(() => {
    return {
      totalJuguetes: products.length,

      stockTotal: products.reduce(
        (acc, p) => acc + (p.stock || 0),
        0
      ),

      enOferta: products.filter(
        (p) => p.enOferta
      ).length,

      sinStock: products.filter(
        (p) => p.stock === 0
      ).length,

      combos: combos.filter(
        (c) => c.activo
      ).length,
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

  // =========================
  // PRODUCTOS
  // =========================

  function startEdit(p) {
    setEditingId(p.id);

    setDraft({
      nombre: p.name || "",
      descripcion: p.description || "",
      precio: p.price ?? "",
      precioOferta: p.precioOferta ?? "",
      enOferta: Boolean(p.enOferta),
      destacado: Boolean(p.destacado),
      categoria: p.category || "",
      stock: p.stock ?? "",
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
      const updatedData = {
        nombre: draft.nombre.trim(),

        descripcion:
          draft.descripcion?.trim() || "",

        precio: Number(draft.precio),

        precioOferta:
          draft.precioOferta === ""
            ? null
            : Number(draft.precioOferta),

        enOferta: Boolean(draft.enOferta),

        destacado: Boolean(draft.destacado),

        categoria:
          draft.categoria?.trim() || "General",

        stock: Number(draft.stock),

        imagenes: draft.imagenes || [],
      };

      const savedProduct =
        await updateProduct(
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

                description:
                  updatedData.descripcion,

                price: updatedData.precio,

                precioOferta:
                  updatedData.precioOferta,

                enOferta:
                  updatedData.enOferta,

                destacado:
                  updatedData.destacado,

                category:
                  updatedData.categoria,

                stock:
                  updatedData.stock,

                images:
                  updatedData.imagenes,

                image:
                  updatedData.imagenes?.[0] ||
                  p.image,
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
          p.id === id
            ? {
                ...p,
                activo: false,
              }
            : p
        )
      );
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleActivate(id) {
    try {
      await activateProduct(id);

      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                activo: true,
              }
            : p
        )
      );
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleHardDelete(
    id,
    nombre
  ) {
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
    } catch (err) {
      alert(err.message);
    }
  }

  // =========================
  // IMÁGENES PRODUCTO NUEVO
  // =========================

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

        imagenes: [
          ...prev.imagenes,
          ...urls,
        ],
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

      imagenes:
        prev.imagenes.filter(
          (img) => img !== url
        ),
    }));
  }

  function addImagenPorUrl() {
    const url = urlImagen.trim();

    if (!url) return;

    if (
      productForm.imagenes.includes(url)
    ) {
      setUrlImagen("");
      return;
    }

    setProductForm((prev) => ({
      ...prev,

      imagenes: [
        ...prev.imagenes,
        url,
      ],
    }));

    setUrlImagen("");
  }

  // =========================
  // IMÁGENES PRODUCTO EDITAR
  // =========================

  function removeImagenEdit(url) {
    setDraft((prev) => ({
      ...prev,

      imagenes:
        prev.imagenes.filter(
          (img) => img !== url
        ),
    }));
  }

  function addImagenPorUrlEdit() {
    const url =
      urlImagenEdit.trim();

    if (!url) return;

    if (
      draft.imagenes.includes(url)
    ) {
      setUrlImagenEdit("");
      return;
    }

    setDraft((prev) => ({
      ...prev,

      imagenes: [
        ...prev.imagenes,
        url,
      ],
    }));

    setUrlImagenEdit("");
  }

  async function handleImagenesChangeEdit(
    e
  ) {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }

    setSubiendoImagenes(true);

    try {
      const urls =
        await uploadImages(files);

      setDraft((prev) => ({
        ...prev,

        imagenes: [
          ...prev.imagenes,
          ...urls,
        ],
      }));
    } catch (err) {
      alert(err.message);
    } finally {
      setSubiendoImagenes(false);
      e.target.value = "";
    }
  }

  // =========================
  // CREAR PRODUCTO
  // =========================

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
      const newProduct =
        await createProduct({
          nombre:
            productForm.nombre,

          descripcion:
            productForm.descripcion,

          precio:
            Number(productForm.precio),

          precioOferta:
            productForm.precioOferta === ""
              ? null
              : Number(
                  productForm.precioOferta
                ),

          enOferta:
            Boolean(
              productForm.enOferta
            ),

          destacado:
            Boolean(
              productForm.destacado
            ),

          categoria:
            productForm.categoria ||
            "General",

          stock:
            Number(
              productForm.stock
            ),

          imagenes:
            productForm.imagenes,
        });

      setProducts((prev) => [
        newProduct,
        ...prev,
      ]);

      setProductForm(
        PRODUCTO_VACIO
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setCreandoProducto(false);
    }
  }

  // =========================
  // COMBOS
  // =========================

  function obtenerImagenesProductos(
    principalId,
    adicionalId
  ) {
    const principal =
      products.find(
        (p) =>
          String(p.id) ===
          String(principalId)
      );

    const adicional =
      products.find(
        (p) =>
          String(p.id) ===
          String(adicionalId)
      );

    const imagenes = [
      ...(principal?.images || []),
      ...(adicional?.images || []),
    ];

    return [
      ...new Set(imagenes),
    ];
  }

  function copiarImagenesCombo() {
    const imagenes =
      obtenerImagenesProductos(
        comboForm.productoPrincipal,
        comboForm.productoAdicional
      );

    if (imagenes.length === 0) {
      alert(
        "Los productos seleccionados no tienen imágenes."
      );
      return;
    }

    setComboForm((prev) => ({
      ...prev,
      imagenes,
    }));
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
      let imagenes =
        comboForm.imagenes;

      if (
        imagenes.length === 0
      ) {
        imagenes =
          obtenerImagenesProductos(
            comboForm.productoPrincipal,
            comboForm.productoAdicional
          );
      }

      const newCombo =
        await createCombo({
          ...comboForm,

          descripcion:
            comboForm.descripcion,

          cantidadAdicional:
            Number(
              comboForm.cantidadAdicional
            ),

          precioCombo:
            Number(
              comboForm.precioCombo
            ),

          precioOferta:
            comboForm.precioOferta === ""
              ? null
              : Number(
                  comboForm.precioOferta
                ),

          enOferta:
            Boolean(
              comboForm.enOferta
            ),

          destacado:
            Boolean(
              comboForm.destacado
            ),

          imagenes,
        });

      setCombos((prev) => [
        newCombo,
        ...prev,
      ]);

      setComboForm(
        COMBO_VACIO
      );

      setUrlImagenCombo("");
    } catch (err) {
      alert(err.message);
    } finally {
      setCreandoCombo(false);
    }
  }

  function startEditCombo(combo) {
    setEditingComboId(combo._id);

    setComboDraft({
      nombre:
        combo.nombre || "",

      descripcion:
        combo.descripcion || "",

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

      precioCombo:
        combo.precioCombo ?? "",

      precioOferta:
        combo.precioOferta ?? "",

      enOferta:
        Boolean(combo.enOferta),

      destacado:
        Boolean(combo.destacado),

      imagenes:
        combo.imagenes || [],

      activo:
        combo.activo !== false,
    });

    setUrlImagenComboEdit("");
  }

  function cancelEditCombo() {
    setEditingComboId(null);
    setComboDraft({});
    setUrlImagenComboEdit("");
  }

  function removeImagenCombo(url) {
    setComboForm((prev) => ({
      ...prev,

      imagenes:
        prev.imagenes.filter(
          (img) => img !== url
        ),
    }));
  }

  function addImagenComboPorUrl() {
    const url =
      urlImagenCombo.trim();

    if (!url) return;

    if (
      comboForm.imagenes.includes(url)
    ) {
      setUrlImagenCombo("");
      return;
    }

    setComboForm((prev) => ({
      ...prev,

      imagenes: [
        ...prev.imagenes,
        url,
      ],
    }));

    setUrlImagenCombo("");
  }

  function removeImagenComboEdit(
    url
  ) {
    setComboDraft((prev) => ({
      ...prev,

      imagenes:
        prev.imagenes.filter(
          (img) => img !== url
        ),
    }));
  }

  function addImagenComboPorUrlEdit() {
    const url =
      urlImagenComboEdit.trim();

    if (!url) return;

    if (
      comboDraft.imagenes.includes(
        url
      )
    ) {
      setUrlImagenComboEdit("");
      return;
    }

    setComboDraft((prev) => ({
      ...prev,

      imagenes: [
        ...prev.imagenes,
        url,
      ],
    }));

    setUrlImagenComboEdit("");
  }

  async function handleImagenesComboChange(
    e
  ) {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }

    setSubiendoImagenes(true);

    try {
      const urls =
        await uploadImages(files);

      setComboForm((prev) => ({
        ...prev,

        imagenes: [
          ...prev.imagenes,
          ...urls,
        ],
      }));
    } catch (err) {
      alert(err.message);
    } finally {
      setSubiendoImagenes(false);
      e.target.value = "";
    }
  }

  async function handleImagenesComboChangeEdit(
    e
  ) {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }

    setSubiendoImagenes(true);

    try {
      const urls =
        await uploadImages(files);

      setComboDraft((prev) => ({
        ...prev,

        imagenes: [
          ...prev.imagenes,
          ...urls,
        ],
      }));
    } catch (err) {
      alert(err.message);
    } finally {
      setSubiendoImagenes(false);
      e.target.value = "";
    }
  }

  function copiarImagenesComboEdit() {
    const imagenes =
      obtenerImagenesProductos(
        comboDraft.productoPrincipal,
        comboDraft.productoAdicional
      );

    setComboDraft((prev) => ({
      ...prev,
      imagenes,
    }));
  }

  async function saveComboEdit(id) {
    try {
      const data = {
        nombre:
          comboDraft.nombre.trim(),

        descripcion:
          comboDraft.descripcion?.trim() ||
          "",

        productoPrincipal:
          comboDraft.productoPrincipal,

        productoAdicional:
          comboDraft.productoAdicional,

        cantidadAdicional:
          Number(
            comboDraft.cantidadAdicional
          ),

        precioCombo:
          Number(
            comboDraft.precioCombo
          ),

        precioOferta:
          comboDraft.precioOferta === ""
            ? null
            : Number(
                comboDraft.precioOferta
              ),

        enOferta:
          Boolean(
            comboDraft.enOferta
          ),

        destacado:
          Boolean(
            comboDraft.destacado
          ),

        imagenes:
          comboDraft.imagenes || [],

        activo:
          Boolean(
            comboDraft.activo
          ),
      };

      const savedCombo =
        await updateCombo(
          id,
          data
        );

      setCombos((prev) =>
        prev.map((combo) =>
          combo._id === id
            ? savedCombo
            : combo
        )
      );

      cancelEditCombo();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteCombo(id) {
    if (
      !confirm(
        "¿Desactivar este combo?"
      )
    ) {
      return;
    }

    try {
      await deleteCombo(id);

      setCombos((prev) =>
        prev.map((combo) =>
          combo._id === id
            ? {
                ...combo,
                activo: false,
              }
            : combo
        )
      );
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleActivateCombo(
    id
  ) {
    try {
      const combo =
        await activateCombo(id);

      setCombos((prev) =>
        prev.map((c) =>
          c._id === id
            ? combo
            : c
        )
      );
    } catch (err) {
      alert(err.message);
    }
  }

  // =========================
  // ELIMINAR COMBO PERMANENTEMENTE
  // =========================

  async function handleHardDeleteCombo(
    id,
    nombre
  ) {
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
        prev.filter(
          (combo) =>
            combo._id !== id
        )
      );
    } catch (err) {
      alert(err.message);
    }
  }

  // =========================
  // PEDIDOS
  // =========================

  async function handleCancelOrder(id) {
    if (
      !confirm(
        "¿Cancelar este pedido?"
      )
    ) {
      return;
    }

    try {
      await cancelOrder(id);

      setOrders((prev) =>
        prev.map((o) =>
          o._id === id
            ? {
                ...o,
                estado: "cancelado",
              }
            : o
        )
      );
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) {
    return (
      <p className="admin-loading">
        Cargando panel...
      </p>
    );
  }

  if (error) {
    return (
      <p className="admin-error">
        {error}
      </p>
    );
  }

  return (
    <main className="admin-dashboard">
      <h1>
        Panel de administración
      </h1>

      {/* ================= STATS ================= */}

      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-value">
            {stats.totalJuguetes}
          </span>

          <span className="stat-label">
            Juguetes distintos
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-value">
            {stats.stockTotal}
          </span>

          <span className="stat-label">
            Unidades en stock
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-value">
            {stats.enOferta}
          </span>

          <span className="stat-label">
            Productos en oferta
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-value">
            {stats.combos}
          </span>

          <span className="stat-label">
            Combos activos
          </span>
        </div>

        <div className="stat-card stat-warning">
          <span className="stat-value">
            {stats.sinStock}
          </span>

          <span className="stat-label">
            Sin stock
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-value">
            {pedidosStats.pendientes}
          </span>

          <span className="stat-label">
            Pedidos pendientes
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-value">
            {pedidosStats.pagados}
          </span>

          <span className="stat-label">
            Pedidos pagados
          </span>
        </div>
      </div>

      {/* ================= PEDIDOS ================= */}

      <section className="admin-section">
        <h2>Pedidos</h2>

        <p
          style={{
            color: "#777",
            fontSize: 13,
            marginTop: -8,
          }}
        >
          Los pedidos pendientes con más de
          30 minutos se cancelan
          automáticamente.
        </p>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign:
                        "center",
                      padding: 20,
                      color: "#777",
                    }}
                  >
                    Todavía no hay
                    pedidos.
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  const estado =
                    ESTADOS_PEDIDO[
                      o.estado
                    ] ||
                    ESTADOS_PEDIDO.pendiente;

                  return (
                    <tr
                      key={o._id}
                    >
                      <td>
                        {
                          o.cliente
                            ?.nombre
                        }

                        <br />

                        <small
                          style={{
                            color:
                              "#777",
                          }}
                        >
                          {
                            o.cliente
                              ?.email
                          }
                        </small>
                      </td>

                      <td>
                        {formatFechaPedido(
                          o.createdAt
                        )}
                      </td>

                      <td>
                        <span
                          className={
                            estado.className
                          }
                        >
                          {
                            estado.label
                          }
                        </span>
                      </td>

                      <td>
                        $
                        {o.total.toLocaleString(
                          "es-CL"
                        )}
                      </td>

                      <td className="admin-actions">
                        {o.estado ===
                          "pendiente" && (
                          <button
                            className="btn-eliminar"
                            onClick={() =>
                              handleCancelOrder(
                                o._id
                              )
                            }
                          >
                            Cancelar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={
            recargarPedidos
          }
          style={{
            marginTop: 10,
          }}
        >
          Actualizar pedidos
        </button>
      </section>

      {/* ================= CREAR PRODUCTO ================= */}

      <section className="admin-section">
        <h2>
          Crear producto nuevo
        </h2>

        <form
          className="product-form"
          onSubmit={
            handleCreateProduct
          }
        >
          <input
            type="text"
            placeholder="Nombre del producto"
            value={
              productForm.nombre
            }
            onChange={(e) =>
              setProductForm({
                ...productForm,
                nombre:
                  e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Categoría"
            value={
              productForm.categoria
            }
            onChange={(e) =>
              setProductForm({
                ...productForm,
                categoria:
                  e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Precio"
            value={
              productForm.precio
            }
            onChange={(e) =>
              setProductForm({
                ...productForm,
                precio:
                  e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Precio oferta"
            value={
              productForm.precioOferta
            }
            onChange={(e) =>
              setProductForm({
                ...productForm,
                precioOferta:
                  e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Stock"
            value={
              productForm.stock
            }
            onChange={(e) =>
              setProductForm({
                ...productForm,
                stock:
                  e.target.value,
              })
            }
          />

          <textarea
            placeholder="Descripción"
            value={
              productForm.descripcion
            }
            onChange={(e) =>
              setProductForm({
                ...productForm,
                descripcion:
                  e.target.value,
              })
            }
          />

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={
                productForm.enOferta
              }
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  enOferta:
                    e.target.checked,
                })
              }
            />

            En oferta
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={
                productForm.destacado
              }
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  destacado:
                    e.target.checked,
                })
              }
            />

            Destacado
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
                disabled={
                  subiendoImagenes
                }
                onChange={
                  handleImagenesChange
                }
              />
            </label>

            <div className="url-imagen-row">
              <input
                type="text"
                placeholder="URL de imagen"
                value={urlImagen}
                onChange={(e) =>
                  setUrlImagen(
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                onClick={
                  addImagenPorUrl
                }
              >
                Agregar
              </button>
            </div>

            <div className="product-form-preview">
              {productForm.imagenes.map(
                (url) => (
                  <div
                    className="preview-thumb"
                    key={url}
                  >
                    <img
                      src={url}
                      alt="preview"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeImagen(
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
          </div>

          <button
            type="submit"
            disabled={
              creandoProducto ||
              subiendoImagenes
            }
          >
            {creandoProducto
              ? "Creando..."
              : "+ Crear producto"}
          </button>
        </form>
      </section>

      {/* ================= PRODUCTOS ================= */}

      <section className="admin-section">
        <h2>
          Productos
        </h2>

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
              {products.map((p) => {
                const isEditing =
                  editingId ===
                  p.id;

                return (
                  <tr
                    key={p.id}
                    className={[
                      p.stock === 0
                        ? "row-sin-stock"
                        : "",

                      !p.activo
                        ? "row-inactivo"
                        : "",
                    ].join(" ")}
                  >
                    <td>
                      {isEditing ? (
                        <div className="edit-imagenes">
                          <div className="edit-imagenes-preview">
                            {draft.imagenes?.map(
                              (url) => (
                                <div
                                  className="preview-thumb-sm"
                                  key={url}
                                >
                                  <img
                                    src={url}
                                    alt="preview"
                                  />

                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeImagenEdit(
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
                                handleImagenesChangeEdit
                              }
                            />
                          </label>

                          <div className="url-imagen-row-sm">
                            <input
                              type="text"
                              placeholder="URL imagen"
                              value={
                                urlImagenEdit
                              }
                              onChange={(
                                e
                              ) =>
                                setUrlImagenEdit(
                                  e.target
                                    .value
                                )
                              }
                            />

                            <button
                              type="button"
                              onClick={
                                addImagenPorUrlEdit
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
                            p.image
                          }
                          alt={
                            p.name
                          }
                        />
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          value={
                            draft.nombre
                          }
                          onChange={(
                            e
                          ) =>
                            setDraft({
                              ...draft,
                              nombre:
                                e
                                  .target
                                  .value,
                            })
                          }
                        />
                      ) : (
                        p.name
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <textarea
                          value={
                            draft.descripcion
                          }
                          onChange={(
                            e
                          ) =>
                            setDraft({
                              ...draft,
                              descripcion:
                                e
                                  .target
                                  .value,
                            })
                          }
                        />
                      ) : (
                        p.description ||
                        "—"
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          value={
                            draft.categoria
                          }
                          onChange={(
                            e
                          ) =>
                            setDraft({
                              ...draft,
                              categoria:
                                e
                                  .target
                                  .value,
                            })
                          }
                        />
                      ) : (
                        p.category
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          value={
                            draft.precio
                          }
                          onChange={(
                            e
                          ) =>
                            setDraft({
                              ...draft,
                              precio:
                                e
                                  .target
                                  .value,
                            })
                          }
                        />
                      ) : (
                        `$${p.price.toLocaleString(
                          "es-CL"
                        )}`
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          placeholder="Sin oferta"
                          value={
                            draft.precioOferta
                          }
                          onChange={(
                            e
                          ) =>
                            setDraft({
                              ...draft,
                              precioOferta:
                                e
                                  .target
                                  .value,
                            })
                          }
                        />
                      ) : p.precioOferta ? (
                        `$${p.precioOferta.toLocaleString(
                          "es-CL"
                        )}`
                      ) : (
                        "—"
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <input
                          type="checkbox"
                          checked={
                            draft.enOferta
                          }
                          onChange={(
                            e
                          ) =>
                            setDraft({
                              ...draft,
                              enOferta:
                                e
                                  .target
                                  .checked,
                            })
                          }
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
                          checked={
                            draft.destacado
                          }
                          onChange={(
                            e
                          ) =>
                            setDraft({
                              ...draft,
                              destacado:
                                e
                                  .target
                                  .checked,
                            })
                          }
                        />
                      ) : p.destacado ? (
                        "⭐"
                      ) : (
                        "—"
                      )}
                    </td>

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

                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          value={
                            draft.stock
                          }
                          onChange={(
                            e
                          ) =>
                            setDraft({
                              ...draft,
                              stock:
                                e
                                  .target
                                  .value,
                            })
                          }
                        />
                      ) : (
                        p.stock
                      )}
                    </td>

                    <td className="admin-actions">
                      {isEditing ? (
                        <>
                          <button
                            className="btn-guardar"
                            onClick={() =>
                              saveEdit(
                                p.id
                              )
                            }
                          >
                            Guardar
                          </button>

                          <button
                            className="btn-cancelar"
                            onClick={
                              cancelEdit
                            }
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn-editar"
                            onClick={() =>
                              startEdit(
                                p
                              )
                            }
                          >
                            Editar
                          </button>

                          {p.activo ? (
                            <button
                              className="btn-eliminar"
                              onClick={() =>
                                handleDelete(
                                  p.id
                                )
                              }
                            >
                              Desactivar
                            </button>
                          ) : (
                            <button
                              className="btn-activar"
                              onClick={() =>
                                handleActivate(
                                  p.id
                                )
                              }
                            >
                              Activar
                            </button>
                          )}

                          <button
                            className="btn-borrar"
                            onClick={() =>
                              handleHardDelete(
                                p.id,
                                p.name
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

      {/* ================= CREAR COMBO ================= */}

      <section className="admin-section">
        <h2>
          Crear combo
        </h2>

        <form
          className="combo-form"
          onSubmit={
            handleCreateCombo
          }
        >
          <input
            type="text"
            placeholder="Nombre del combo"
            value={
              comboForm.nombre
            }
            onChange={(e) =>
              setComboForm({
                ...comboForm,
                nombre:
                  e.target.value,
              })
            }
          />

          <textarea
            placeholder="Descripción del combo"
            value={
              comboForm.descripcion
            }
            onChange={(e) =>
              setComboForm({
                ...comboForm,
                descripcion:
                  e.target.value,
              })
            }
          />

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
              Producto principal...
            </option>

            {products
              .filter(
                (p) => p.activo
              )
              .map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                >
                  {p.name}
                </option>
              ))}
          </select>

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
              Producto adicional...
            </option>

            {products
              .filter(
                (p) => p.activo
              )
              .map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                >
                  {p.name}
                </option>
              ))}
          </select>

          <input
            type="number"
            min="1"
            placeholder="Cantidad adicional"
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

          <input
            type="number"
            placeholder="Precio combo"
            value={
              comboForm.precioCombo
            }
            onChange={(e) =>
              setComboForm({
                ...comboForm,
                precioCombo:
                  e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Precio oferta"
            value={
              comboForm.precioOferta
            }
            onChange={(e) =>
              setComboForm({
                ...comboForm,
                precioOferta:
                  e.target.value,
              })
            }
          />

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={
                comboForm.enOferta
              }
              onChange={(e) =>
                setComboForm({
                  ...comboForm,
                  enOferta:
                    e.target.checked,
                })
              }
            />

            En oferta
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={
                comboForm.destacado
              }
              onChange={(e) =>
                setComboForm({
                  ...comboForm,
                  destacado:
                    e.target.checked,
                })
              }
            />

            Destacado
          </label>

          <button
            type="button"
            onClick={
              copiarImagenesCombo
            }
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
                disabled={
                  subiendoImagenes
                }
                onChange={
                  handleImagenesComboChange
                }
              />
            </label>

            <div className="url-imagen-row">
              <input
                type="text"
                placeholder="URL de imagen"
                value={
                  urlImagenCombo
                }
                onChange={(e) =>
                  setUrlImagenCombo(
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                onClick={
                  addImagenComboPorUrl
                }
              >
                Agregar
              </button>
            </div>

            <div className="product-form-preview">
              {comboForm.imagenes.map(
                (url) => (
                  <div
                    className="preview-thumb"
                    key={url}
                  >
                    <img
                      src={url}
                      alt="combo"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeImagenCombo(
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
          </div>

          <button
            type="submit"
            disabled={
              creandoCombo ||
              subiendoImagenes
            }
          >
            {creandoCombo
              ? "Creando..."
              : "+ Crear combo"}
          </button>
        </form>
      </section>

      {/* ================= COMBOS ================= */}

      <section className="admin-section">
        <h2>
          Combos
        </h2>

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
              {combos.map(
                (combo) => {
                  const isEditing =
                    editingComboId ===
                    combo._id;

                  return (
                    <tr
                      key={
                        combo._id
                      }
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
                              Usar imágenes
                              de productos
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
                                onChange={(
                                  e
                                ) =>
                                  setUrlImagenComboEdit(
                                    e
                                      .target
                                      .value
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
                              combo.productoPrincipal?.imagenes?.[0] ||
                              combo.productoPrincipal?.images?.[0]
                            }
                            alt={
                              combo.nombre
                            }
                          />
                        )}
                      </td>

                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            value={
                              comboDraft.nombre
                            }
                            onChange={(
                              e
                            ) =>
                              setComboDraft({
                                ...comboDraft,
                                nombre:
                                  e
                                    .target
                                    .value,
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
                            onChange={(
                              e
                            ) =>
                              setComboDraft({
                                ...comboDraft,
                                descripcion:
                                  e
                                    .target
                                    .value,
                              })
                            }
                          />
                        ) : (
                          combo.descripcion ||
                          "—"
                        )}
                      </td>

                      <td>
                        {isEditing ? (
                          <select
                            value={
                              comboDraft.productoPrincipal
                            }
                            onChange={(
                              e
                            ) =>
                              setComboDraft({
                                ...comboDraft,
                                productoPrincipal:
                                  e
                                    .target
                                    .value,
                              })
                            }
                          >
                            {products
                              .filter(
                                (p) =>
                                  p.activo
                              )
                              .map(
                                (
                                  p
                                ) => (
                                  <option
                                    key={
                                      p.id
                                    }
                                    value={
                                      p.id
                                    }
                                  >
                                    {
                                      p.name
                                    }
                                  </option>
                                )
                              )}
                          </select>
                        ) : (
                          combo
                            .productoPrincipal
                            ?.name ||
                          combo
                            .productoPrincipal
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
                            onChange={(
                              e
                            ) =>
                              setComboDraft({
                                ...comboDraft,
                                productoAdicional:
                                  e
                                    .target
                                    .value,
                              })
                            }
                          >
                            {products
                              .filter(
                                (p) =>
                                  p.activo
                              )
                              .map(
                                (
                                  p
                                ) => (
                                  <option
                                    key={
                                      p.id
                                    }
                                    value={
                                      p.id
                                    }
                                  >
                                    {
                                      p.name
                                    }
                                  </option>
                                )
                              )}
                          </select>
                        ) : (
                          combo
                            .productoAdicional
                            ?.name ||
                          combo
                            .productoAdicional
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
                            onChange={(
                              e
                            ) =>
                              setComboDraft({
                                ...comboDraft,
                                cantidadAdicional:
                                  e
                                    .target
                                    .value,
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
                            onChange={(
                              e
                            ) =>
                              setComboDraft({
                                ...comboDraft,
                                precioCombo:
                                  e
                                    .target
                                    .value,
                              })
                            }
                          />
                        ) : (
                          `$${Number(
                            combo.precioCombo
                          ).toLocaleString(
                            "es-CL"
                          )}`
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
                            onChange={(
                              e
                            ) =>
                              setComboDraft({
                                ...comboDraft,
                                precioOferta:
                                  e
                                    .target
                                    .value,
                              })
                            }
                          />
                        ) : combo.enOferta &&
                          combo.precioOferta ? (
                          `$${Number(
                            combo.precioOferta
                          ).toLocaleString(
                            "es-CL"
                          )}`
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
                            onChange={(
                              e
                            ) =>
                              setComboDraft({
                                ...comboDraft,
                                enOferta:
                                  e
                                    .target
                                    .checked,
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
                            onChange={(
                              e
                            ) =>
                              setComboDraft({
                                ...comboDraft,
                                destacado:
                                  e
                                    .target
                                    .checked,
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
                                saveComboEdit(
                                  combo._id
                                )
                              }
                            >
                              Guardar
                            </button>

                            <button
                              className="btn-cancelar"
                              onClick={
                                cancelEditCombo
                              }
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn-editar"
                              onClick={() =>
                                startEditCombo(
                                  combo
                                )
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

                            {/* ELIMINACIÓN PERMANENTE */}
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
                }
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;