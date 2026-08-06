import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../context/UserContext";
import "../../css/Auth.css";


function Register(){

const {login}=useUser();
const navigate=useNavigate();

const [name,setName]=useState("");
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");


function handleRegister(e){

e.preventDefault();


if(!name || !email || !password){
alert("Completa todos los campos");
return;
}


const newUser={
name,
email
};


login(newUser);

navigate("/");


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


<button>
Registrarme
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