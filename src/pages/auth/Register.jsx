import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { register as registerRequest, login as loginRequest, updateMe } from "../../services/authService";
import { createAddress } from "../../services/addressService";
import { leerDatosInvitado, borrarDatosInvitado } from "../../services/guestCheckoutData";
import "../../css/Auth.css";


function Register(){

const {login}=useUser();
const navigate=useNavigate();

// Si viene de una compra como invitado, se rellena con esos datos
const [datosCompra]=useState(()=>leerDatosInvitado());

const [name,setName]=useState(datosCompra?.nombre || "");
const [email,setEmail]=useState(datosCompra?.email || "");
const [password,setPassword]=useState("");
const [error,setError]=useState("");
const [loading,setLoading]=useState(false);


async function handleRegister(e){

e.preventDefault();

if(!name || !email || !password){
setError("Completa todos los campos");
return;
}

if(password.length < 8){
setError("La contraseña debe tener al menos 8 caracteres");
return;
}

setError("");
setLoading(true);

try{

// Crea la cuenta en el backend (rol "cliente" por defecto)
await registerRequest({email, password, nombre:name});

// El registro no devuelve sesión, así que iniciamos sesión
// automáticamente para que quede logueado de una vez.
const data = await loginRequest({email, password});

login({
id: data.id,
name,
email: data.email,
rol: data.rol
});

// Con los datos de la compra se completa el perfil y se guarda la
// dirección (si falla algo de esto, la cuenta igual quedó creada).
if(datosCompra){
// El checkout guarda el RUT sin guion (123456785); el perfil lo pide con guion
const r=String(datosCompra.rut||"").replace(/[^0-9kK]/g,"").toUpperCase();
const rutConGuion=r.length>=2 ? `${r.slice(0,-1)}-${r.slice(-1)}` : "";

try{
await updateMe({
nombre:name,
telefono:datosCompra.telefono,
rut:rutConGuion
});
}catch{ /* el perfil se puede completar después */ }

try{
const d=datosCompra.direccion || {};
if(d.direccion && d.numero && d.region && d.comuna){
await createAddress({
nombre:"Mi dirección",
nombreReceptor:d.nombreReceptor || name,
rut:rutConGuion,
telefono:d.telefono || datosCompra.telefono,
direccion:d.direccion,
numero:d.numero,
departamento:d.departamento,
region:d.region,
comuna:d.comuna,
indicaciones:d.indicaciones
});
}
}catch{ /* la dirección se puede guardar después */ }

borrarDatosInvitado();
}

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

{datosCompra && (
<p>
Rellenamos tus datos con los de tu compra. Solo elige una
contraseña (mínimo 8 caracteres).
</p>
)}

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
placeholder="Contraseña (mínimo 8 caracteres)"
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