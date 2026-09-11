import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../../context/UserContext";
import { login as loginRequest } from "../../services/authService";
import "../../css/Login.css";

// =====================================================
// PRIORIDAD DE ESTADOS (de mayor a menor):
// success > error > password visible > password activo
// > email activo > seguir el mouse > espera
// =====================================================

function calcularEstado({
  loginResult,
  showPassword,
  focusField,
}) {
  if (loginResult === "success") return "success";
  if (loginResult === "error") return "error";
  if (showPassword) return "away";
  if (focusField === "password") return "peeking";
  if (focusField === "email") return "watching";
  return "idle";
}

function Login() {
  const { login } = useUser();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [focusField, setFocusField] =
    useState(null);
  const [loginResult, setLoginResult] =
    useState(null);
  const [pupilOffset, setPupilOffset] = useState({
    x: 0,
    y: 0,
  });

  const ilustracionRef = useRef(null);

  const estadoReal = calcularEstado({
    loginResult,
    showPassword,
    focusField,
  });

  // ===================================================
  // "PARPADEO" AL CAMBIAR DE ESTADO
  // ===================================================

  const [estadoMostrado, setEstadoMostrado] =
    useState(estadoReal);
  const [parpadeando, setParpadeando] =
    useState(false);

  useEffect(() => {
    if (estadoReal === estadoMostrado) return;

    setParpadeando(true);

    const t = setTimeout(() => {
      setEstadoMostrado(estadoReal);
      setParpadeando(false);
    }, 90);

    return () => clearTimeout(t);
  }, [estadoReal, estadoMostrado]);

  const estado = estadoMostrado;

  useEffect(() => {
    if (estadoReal !== "idle") return;

    const intervalo = setInterval(() => {
      setParpadeando(true);
      setTimeout(
        () => setParpadeando(false),
        140
      );
    }, 2800 + Math.random() * 1800);

    return () => clearInterval(intervalo);
  }, [estadoReal]);

  // ===================================================
  // SEGUIR EL MOUSE CON LA MIRADA
  // ===================================================

  useEffect(() => {
    function handleMouseMove(e) {
      const el = ilustracionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centroX = rect.left + rect.width / 2;
      const centroY = rect.top + 40;

      const dx = e.clientX - centroX;
      const dy = e.clientY - centroY;
      const distancia = Math.sqrt(dx * dx + dy * dy);
      const maxDesplazamiento = 3;

      const factor =
        distancia === 0
          ? 0
          : maxDesplazamiento /
            Math.max(distancia, 150);

      setPupilOffset({
        x: Math.max(
          -maxDesplazamiento,
          Math.min(maxDesplazamiento, dx * factor)
        ),
        y: Math.max(
          -maxDesplazamiento,
          Math.min(maxDesplazamiento, dy * factor)
        ),
      });
    }

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    return () =>
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
  }, []);

  useEffect(() => {
    if (loginResult !== "error") return;

    const timeout = setTimeout(() => {
      setLoginResult(null);
    }, 2800);

    return () => clearTimeout(timeout);
  }, [loginResult]);

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      setError("Completa todos los campos");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await loginRequest({
        email,
        password,
      });

      setLoginResult("success");

      setTimeout(() => {
        login({
          id: data.id,
          email: data.email,
          rol: data.rol,
          name: data.nombre,
        });

        navigate("/");
      }, 1100);
    } catch (err) {
      setError(
        err.message ||
          "No se pudo iniciar sesión"
      );

      setLoginResult("error");
      setLoading(false);
    }
  }

  const pupStyle = {
    transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
  };

  function formaOjo(scrunchEnAway) {
    if (parpadeando) return "eye--closed";
    if (estado === "away")
      return scrunchEnAway ? "eye--scrunch" : "eye--away";
    if (estado === "success") return "eye--happy";
    if (estado === "error") return "eye--worried";
    if (estado === "peeking") return "eye--squint";
    if (estado === "watching") return "eye--wide";

    return "eye--dot";
  }

  function formaBoca(perfil) {
    if (estado === "success")
      return "mouth--happy";
    if (estado === "error")
      return "mouth--worried";
    if (estado === "peeking")
      return "wavy";
    if (estado === "away") return "mouth--flat";
    if (estado === "watching") return "mouth--o";

    return perfil ? "mouth--flat" : "mouth--smile";
  }

  function Boca({ perfil, ancho }) {
    const clase = formaBoca(perfil);

    if (clase === "wavy") {
      return (
        <svg
          className="mouth-wavy-svg"
          width={ancho || 18}
          height="6"
          viewBox="0 0 18 6"
        >
          <path
            d="M1 3 Q4 0.5 7 3 T13 3 T17 3"
            fill="none"
            stroke="#201c1c"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    }

    return (
      <span
        className={`mouth ${clase}`}
        style={ancho ? { width: ancho } : undefined}
      />
    );
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <div
          className={`login-illustration estado-${estado}`}
          ref={ilustracionRef}
        >
          <div className="mascots">
            {/* ROJO */}
            <div className="m-body m-red">
              <div className="m-sway">
                <div className="m-face">
                  <div className="eyebrows-row">
                    <span className="eyebrow eyebrow--left" />
                    <span className="eyebrow eyebrow--right" />
                  </div>
                  <div className="eyes-row">
                    <span
                      className={`eye ${formaOjo(
                        true
                      )}`}
                    >
                      <span className="pupil" />
                    </span>
                    <span
                      className={`eye ${formaOjo(
                        true
                      )}`}
                    >
                      <span className="pupil" />
                    </span>
                  </div>

                  <Boca perfil={false} />
                </div>
              </div>
            </div>

            {/* VERDE */}
            <div className="m-body m-green">
              <div className="m-sway">
                <div className="m-face">
                  <div className="eyebrows-row">
                    <span className="eyebrow eyebrow--left" />
                    <span className="eyebrow eyebrow--right" />
                  </div>
                  <div className="eyes-row">
                    <span
                      className={`eye ${formaOjo(
                        false
                      )}`}
                    >
                      <span
                        className="pupil"
                        style={pupStyle}
                      />
                    </span>
                    <span
                      className={`eye ${formaOjo(
                        false
                      )}`}
                    >
                      <span
                        className="pupil"
                        style={pupStyle}
                      />
                    </span>
                  </div>

                  <Boca perfil={false} />
                </div>
              </div>
            </div>

            {/* MORADO */}
            <div className="m-body m-black">
              <div className="m-sway">
                <div className="m-face">
                  <div className="eyebrows-row">
                    <span className="eyebrow eyebrow--left" />
                    <span className="eyebrow eyebrow--right" />
                  </div>
                  <div className="eyes-row">
                    <span
                      className={`eye ${formaOjo(
                        false
                      )}`}
                    >
                      <span
                        className="pupil"
                        style={pupStyle}
                      />
                    </span>
                    <span
                      className={`eye ${formaOjo(
                        false
                      )}`}
                    >
                      <span
                        className="pupil"
                        style={pupStyle}
                      />
                    </span>
                  </div>

                  <Boca perfil={true} ancho={10} />
                </div>
              </div>
            </div>

            {/* AMARILLO */}
            <div className="m-body m-yellow">
              <div className="m-sway">
                <div className="m-face">
                  <div className="eyebrows-row">
                    <span className="eyebrow eyebrow--left" />
                    <span className="eyebrow eyebrow--right" />
                  </div>
                  <div className="eyes-row">
                    <span
                      className={`eye ${formaOjo(
                        false
                      )}`}
                    >
                      <span
                        className="pupil"
                        style={pupStyle}
                      />
                    </span>
                  </div>

                  <Boca perfil={true} ancho={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-form-panel">
          <p className="login-plus">✦</p>

          <h1>¡Bienvenido de nuevo!</h1>

          <p className="login-subtitle">
            Ingresa tus datos para continuar
          </p>

          {error && (
            <p className="login-error">{error}</p>
          )}

          <form onSubmit={handleLogin}>
            <div className="login-field">
              <label htmlFor="login-email">
                Correo electrónico
              </label>

              <input
                id="login-email"
                type="email"
                placeholder="tucorreo@ejemplo.com"
                value={email}
                onFocus={() =>
                  setFocusField("email")
                }
                onBlur={() => setFocusField(null)}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div className="login-field">
              <label htmlFor="login-password">
                Contraseña
              </label>

              <div className="login-password-wrap">
                <input
                  id="login-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Tu contraseña"
                  value={password}
                  onFocus={() =>
                    setFocusField("password")
                  }
                  onBlur={() =>
                    setFocusField(null)
                  }
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#666"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.3 20.3 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a20.3 20.3 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#666"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading
                ? "Ingresando..."
                : "Iniciar sesión"}
            </button>
          </form>

          <p className="login-signup-link">
            ¿No tienes cuenta?{" "}
            <Link to="/registro">Regístrate</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;