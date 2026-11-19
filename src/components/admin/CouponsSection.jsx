import { useEffect, useState } from "react";

import {
  getCupones,
  createCupon,
  createLoteCupones,
  updateCupon,
  deleteCupon,
  getUsosCupon,
} from "../../services/cuponService";

const VACIO = {
  modo: "generico", // generico | lote
  codigo: "",
  prefijo: "",
  cantidad: 20,
  tipo: "porcentaje",
  valor: 10,
  montoMinimo: 0,
  fechaInicio: "",
  fechaFin: "",
  usosMaximos: "",
  descripcion: "",
};

const fecha = (f) => (f ? new Date(f).toISOString().slice(0, 10) : "—");

function estadoCupon(c) {
  if (!c.activo) return ["badge-cancelado", "Desactivado"];

  const ahora = new Date();
  if (c.fechaInicio && ahora < new Date(c.fechaInicio))
    return ["badge-pendiente", "Programado"];

  if (c.fechaFin) {
    const fin = new Date(c.fechaFin);
    fin.setUTCHours(23, 59, 59, 999);
    if (ahora > fin) return ["badge-cancelado", "Vencido"];
  }

  if (c.usosMaximos && c.usosActuales >= c.usosMaximos)
    return ["badge-cancelado", "Agotado"];

  return ["badge-pagado", "Vigente"];
}

// Admin: cupones de descuento. Dos tipos:
//  - Código genérico (ej: NAVIDAD10): lo conoce todo el mundo,
//    pero cada persona solo puede usarlo UNA vez (el servidor
//    revisa RUT, correo, teléfono y direcciones).
//  - Lote de códigos únicos: cada código sirve una sola vez.
function CouponsSection() {
  const [cupones, setCupones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(VACIO);
  const [guardando, setGuardando] = useState(false);
  const [loteGenerado, setLoteGenerado] = useState(null);
  const [usos, setUsos] = useState(null); // { cupon, lista }
  const [filtro, setFiltro] = useState("");

  function cargar() {
    setLoading(true);
    getCupones()
      .then(setCupones)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(cargar, []);

  const set = (campo) => (e) =>
    setForm({ ...form, [campo]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setGuardando(true);
    setLoteGenerado(null);

    const base = {
      tipo: form.tipo,
      valor: Number(form.valor),
      montoMinimo: Number(form.montoMinimo) || 0,
      fechaInicio: form.fechaInicio || null,
      fechaFin: form.fechaFin || null,
      descripcion: form.descripcion,
    };

    try {
      if (form.modo === "lote") {
        const r = await createLoteCupones({
          ...base,
          cantidad: Number(form.cantidad),
          prefijo: form.prefijo,
        });
        setLoteGenerado(r);
      } else {
        await createCupon({
          ...base,
          codigo: form.codigo,
          usosMaximos: form.usosMaximos === "" ? null : Number(form.usosMaximos),
        });
      }

      setForm({ ...VACIO, modo: form.modo });
      cargar();
    } catch (err) {
      alert(err.message);
    } finally {
      setGuardando(false);
    }
  }

  async function toggleActivo(c) {
    try {
      const actualizado = await updateCupon(c._id, { activo: !c.activo });
      setCupones((prev) => prev.map((x) => (x._id === c._id ? actualizado : x)));
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(c) {
    if (!confirm(`¿Eliminar el cupón ${c.codigo}?`)) return;

    try {
      await deleteCupon(c._id);
      setCupones((prev) => prev.filter((x) => x._id !== c._id));
    } catch (err) {
      alert(err.message);
    }
  }

  async function verUsos(c) {
    try {
      const lista = await getUsosCupon(c._id);
      setUsos({ cupon: c, lista });
    } catch (err) {
      alert(err.message);
    }
  }

  function copiarLote() {
    navigator.clipboard
      ?.writeText(loteGenerado.codigos.join("\n"))
      .then(() => alert("Códigos copiados"))
      .catch(() => alert("No se pudo copiar, selecciónalos manualmente"));
  }

  function descargarLote() {
    const blob = new Blob(["codigo\n" + loteGenerado.codigos.join("\n")], {
      type: "text/csv",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `cupones-${loteGenerado.campania}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  if (loading) return <p>Cargando cupones...</p>;
  if (error) return <p className="admin-error">{error}</p>;

  const visibles = cupones.filter((c) => {
    const q = filtro.trim().toUpperCase();
    return !q || c.codigo.includes(q) || c.campania.includes(q);
  });

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <h2>Cupones de descuento</h2>
      </div>

      <p>
        Cada persona solo puede usar un cupón una vez por campaña, aunque
        compre sin cuenta (se controla por RUT, correo, teléfono y dirección).
        Para repartir, lo más seguro es un <strong>lote de códigos únicos</strong>:
        un código por persona.
      </p>

      <form onSubmit={handleSubmit} className="combo-form">
        <label>
          Tipo de código{" "}
          <select value={form.modo} onChange={set("modo")}>
            <option value="generico">Genérico (ej: NAVIDAD10)</option>
            <option value="lote">Lote de códigos únicos</option>
          </select>
        </label>

        {form.modo === "generico" ? (
          <>
            <input
              type="text"
              placeholder="Código (ej: NAVIDAD10)"
              value={form.codigo}
              onChange={set("codigo")}
              maxLength={30}
              required
            />
            <input
              type="number"
              min="1"
              placeholder="Usos totales (vacío = sin límite)"
              value={form.usosMaximos}
              onChange={set("usosMaximos")}
            />
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Prefijo (ej: MTE)"
              value={form.prefijo}
              onChange={set("prefijo")}
              maxLength={10}
            />
            <input
              type="number"
              min="1"
              max="500"
              placeholder="Cantidad (máx. 500)"
              value={form.cantidad}
              onChange={set("cantidad")}
              required
            />
          </>
        )}

        <label>
          Descuento{" "}
          <select value={form.tipo} onChange={set("tipo")}>
            <option value="porcentaje">Porcentaje (%)</option>
            <option value="monto">Monto fijo ($)</option>
          </select>
        </label>

        <input
          type="number"
          min="1"
          max={form.tipo === "porcentaje" ? 90 : undefined}
          placeholder={form.tipo === "porcentaje" ? "% (1-90)" : "Monto en $"}
          value={form.valor}
          onChange={set("valor")}
          required
        />

        <input
          type="number"
          min="0"
          placeholder="Compra mínima $ (opcional)"
          value={form.montoMinimo}
          onChange={set("montoMinimo")}
        />

        <label>
          Desde <input type="date" value={form.fechaInicio} onChange={set("fechaInicio")} />
        </label>

        <label>
          Hasta <input type="date" value={form.fechaFin} onChange={set("fechaFin")} />
        </label>

        <input
          type="text"
          placeholder="Descripción interna (opcional)"
          value={form.descripcion}
          onChange={set("descripcion")}
          maxLength={120}
        />

        <button type="submit" disabled={guardando}>
          {guardando
            ? "Guardando..."
            : form.modo === "lote"
            ? "Generar lote"
            : "Crear cupón"}
        </button>
      </form>

      {loteGenerado && (
        <div className="admin-section" style={{ marginTop: 12 }}>
          <h3>
            Lote {loteGenerado.campania}: {loteGenerado.cantidad} códigos
          </h3>
          <p>Guárdalos ahora; también quedan en la tabla de abajo.</p>
          <textarea
            readOnly
            rows={8}
            style={{ width: "100%", fontFamily: "monospace" }}
            value={loteGenerado.codigos.join("\n")}
          />
          <button type="button" onClick={copiarLote}>Copiar</button>{" "}
          <button type="button" onClick={descargarLote}>Descargar CSV</button>
        </div>
      )}

      <input
        type="search"
        placeholder="Buscar por código o campaña"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={{ margin: "12px 0", padding: 8, width: "100%", maxWidth: 320 }}
      />

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Campaña</th>
              <th>Descuento</th>
              <th>Usos</th>
              <th>Vigencia</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((c) => {
              const [clase, texto] = estadoCupon(c);
              return (
                <tr key={c._id}>
                  <td><strong>{c.codigo}</strong></td>
                  <td>{c.campania}</td>
                  <td>
                    {c.tipo === "porcentaje"
                      ? `${c.valor}%`
                      : `$${c.valor.toLocaleString("es-CL")}`}
                    {c.montoMinimo > 0 &&
                      ` (mín. $${c.montoMinimo.toLocaleString("es-CL")})`}
                  </td>
                  <td>
                    {c.usosActuales}/{c.usosMaximos ?? "∞"}
                  </td>
                  <td>{fecha(c.fechaInicio)} → {fecha(c.fechaFin)}</td>
                  <td><span className={clase}>{texto}</span></td>
                  <td className="admin-actions">
                    <button className="btn-editar" onClick={() => verUsos(c)}>
                      Usos
                    </button>
                    <button className="btn-editar" onClick={() => toggleActivo(c)}>
                      {c.activo ? "Desactivar" : "Activar"}
                    </button>
                    <button className="btn-eliminar" onClick={() => handleDelete(c)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}

            {visibles.length === 0 && (
              <tr>
                <td colSpan={7}>No hay cupones.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {usos && (
        <div className="admin-section" style={{ marginTop: 16 }}>
          <h3>Usos de {usos.cupon.codigo}</h3>
          {usos.lista.length === 0 ? (
            <p>Nadie lo ha usado todavía.</p>
          ) : (
            <ul>
              {usos.lista.map((u) => (
                <li key={u._id}>
                  {new Date(u.createdAt).toLocaleString("es-CL")} — {u.email} — -$
                  {u.descuento.toLocaleString("es-CL")} ({u.estado}) — pedido {u.pedido}
                </li>
              ))}
            </ul>
          )}
          <button type="button" onClick={() => setUsos(null)}>Cerrar</button>
        </div>
      )}
    </section>
  );
}

export default CouponsSection;
