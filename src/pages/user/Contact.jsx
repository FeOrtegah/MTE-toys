import "../../css/ContactPage.css";


function Contact(){

return(

<main className="contact-page">

<h1>
Contacto
</h1>


<p>
¿Tienes dudas? Escríbenos.
</p>


<form>

<input 
placeholder="Nombre"
/>


<input
placeholder="Correo"
/>


<textarea
placeholder="Mensaje"
/>


<button>
Enviar
</button>


</form>


</main>

);

}


export default Contact;