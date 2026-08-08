import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { register as registerRequest, login as loginRequest } from "../../services/authService";
import "../../css/Auth.css";


function Register(){

const {login}=useUser();
const navigate=useNavigate();

const [name,setName]=useState("");
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const [error,setError]=useState("");
const [loading,setLoading]=useState(false);


async function handleRegister(e){

e.preventDefault();

if(!name || !email || !password){
setError("Completa todos los campos");
return;
}

setError("");
setLoading(true);

try{

// Crea la cuenta en el backend (rol "cliente" por defecto)
await registerRequest({email, password});

// El registro no devuelve token, así que iniciamos sesión
// automáticamente para que quede logueado de una vez.
const data = await loginRequest({email, password});

localStorage.setItem("token", data.token);

login({
name,
email: data.email,
rol: data.rol
});

navigate("/");

}catch(err){

setError(err.message || "No se pudo crear la cuenta");

}finally{

setLoading(false);

}

}


return(

<main className="auth">

<form
className="auth-box"
onSubmit={handleRegister}
>

<h1>
Crear cuenta
</h1>

{error && <p className="auth-error">{error}</p>}

<input
placeholder="Nombre"
value={name}
onChange={(e)=>setName(e.target.value)}
/>


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


<button disabled={loading}>
{loading ? "Creando cuenta..." : "Registrarme"}
</button>


<p>
¿Ya tienes cuenta?

<Link to="/login">
Ingresar
</Link>

</p>


</form>

</main>

);

}


export default Register;