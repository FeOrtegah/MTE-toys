import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { login as loginRequest } from "../../services/authService";
import "../../css/Auth.css";

function Login(){

const {login}=useUser();
const navigate=useNavigate();

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const [error,setError]=useState("");
const [loading,setLoading]=useState(false);


async function handleLogin(e){

e.preventDefault();

if(!email || !password){
setError("Completa todos los campos");
return;
}

setError("");
setLoading(true);

try{

const data = await loginRequest({email, password});

localStorage.setItem("token", data.token);

login({
email: data.email,
rol: data.rol
});

navigate("/");

}catch(err){

setError(err.message || "No se pudo iniciar sesión");

}finally{

setLoading(false);

}

}


return(
<main className="auth">

<form 
className="auth-box"
onSubmit={handleLogin}
>

<h1>
Iniciar sesión
</h1>

{error && <p className="auth-error">{error}</p>}

<input
type="email"
placeholder="Correo"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>


<input
type="password"
placeholder="Contraseña"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>


<button type="submit" disabled={loading}>
{loading ? "Ingresando..." : "Ingresar"}
</button>


<p>
¿No tienes cuenta?

<Link to="/registro">
Crear cuenta
</Link>

</p>


</form>

</main>
);

}

export default Login;