import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import {
  getProductReviews,
  createReview,
  deleteReview,
} from "../../services/reviewService";
import "../../css/ReviewSection.css";

function Estrellas({ valor, tamaño = "normal" }) {
  return (
    <span
      className={`review-stars ${
        tamaño === "grande" ? "grande" : ""
      }`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n}>
          {n <= valor ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}

function ReviewSection({ productoId, tipo }) {
  const { user } = useUser();
  const isAdmin = user?.rol === "admin";

  const [reseñas, setReseñas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);

  const [calificacion, setCalificacion] = useState(5);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCargando(true);

    getProductReviews(tipo, productoId)
      .then(setReseñas)
      .catch(() => setReseñas([]))
      .finally(() => setCargando(false));
  }, [tipo, productoId]);

  const yaReseñado = reseñas.some(
    (r) => r.usuario === user?.id || r.usuario?._id === user?.id
  );

  const promedio =
    reseñas.length > 0
      ? reseñas.reduce(
          (acc, r) => acc + r.calificacion,
          0
        ) / reseñas.length
      : 0;

  async function handleEnviar(e) {
    e.preventDefault();
    setError("");

    if (!comentario.trim()) {
      setError("Escribe un comentario");
      return;
    }

    setEnviando(true);

    try {
      const nueva = await createReview({
        producto: productoId,
        tipo,
        calificacion,
        comentario: comentario.trim(),
      });

      setReseñas((prev) => [nueva, ...prev]);
      setComentario("");
      setCalificacion(5);
      setMostrarForm(false);
    } catch (err) {
      setError(
        err.message || "No se pudo enviar la reseña"
      );
    } finally {
      setEnviando(false);
    }
  }

  async function handleEliminar(id) {
    if (!confirm("¿Eliminar esta reseña?")) {
      return;
    }

    try {
      await deleteReview(id);

      setReseñas((prev) =>
        prev.filter((r) => r._id !== id)
      );
    } catch (err) {
      alert(
        err.message || "No se pudo eliminar la reseña"
      );
    }
  }

  return (
    <section className="review-section">
      <h2>Reseñas de clientes</h2>

      <div className="review-summary">
        <Estrellas
          valor={Math.round(promedio)}
          tamaño="grande"
        />

        <span className="review-summary-text">
          {reseñas.length > 0
            ? `${promedio.toFixed(1)} de 5 · ${
                reseñas.length
              } reseña${
                reseñas.length === 1 ? "" : "s"
              }`
            : "Todavía no hay reseñas"}
        </span>

        {user &&
          !yaReseñado &&
          !mostrarForm && (
            <button
              type="button"
              className="review-write-btn"
              onClick={() =>
                setMostrarForm(true)
              }
            >
              Escribir una reseña
            </button>
          )}

        {!user && (
          <span className="review-login-hint">
            Inicia sesión para dejar tu reseña
          </span>
        )}
      </div>

      {mostrarForm && (
        <form
          className="review-form"
          onSubmit={handleEnviar}
        >
          <label>Tu calificación</label>

          <div className="review-form-stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() =>
                  setCalificacion(n)
                }
                className={
                  n <= calificacion
                    ? "activa"
                    : ""
                }
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            placeholder="Cuéntanos qué te pareció el producto..."
            value={comentario}
            onChange={(e) =>
              setComentario(e.target.value)
            }
            maxLength={600}
            rows={4}
          />

          {error && (
            <p className="review-form-error">
              {error}
            </p>
          )}

          <div className="review-form-actions">
            <button
              type="button"
              onClick={() =>
                setMostrarForm(false)
              }
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="review-submit-btn"
              disabled={enviando}
            >
              {enviando
                ? "Enviando..."
                : "Publicar reseña"}
            </button>
          </div>
        </form>
      )}

      {!cargando && reseñas.length === 0 && (
        <p className="review-empty">
          Sé el primero en dejar una reseña de este
          producto.
        </p>
      )}

      <div className="review-list">
        {reseñas.map((r) => (
          <div key={r._id} className="review-item">
            <div className="review-item-header">
              <div>
                <strong>{r.nombre}</strong>
                <Estrellas valor={r.calificacion} />
              </div>

              <div className="review-item-meta">
                <span>
                  {new Date(
                    r.createdAt
                  ).toLocaleDateString("es-CL")}
                </span>

                {isAdmin && (
                  <button
                    type="button"
                    className="review-delete-btn"
                    onClick={() =>
                      handleEliminar(r._id)
                    }
                    aria-label="Eliminar reseña"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>

            <p className="review-item-comment">
              {r.comentario}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ReviewSection;