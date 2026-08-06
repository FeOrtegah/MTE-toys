import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../context/UserContext";
import "../../css/Auth.css";

function Login(){

const {login}=useUser();
const navigate=useNavigate();

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");


function handleLogin(e){

e.preventDefault();

if(!email || !password){
alert("Completa todos los campos");
return;
}


login({
name:"Felipe",
email:email
});


navigate("/");

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


<button type="submit">
Ingresar
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