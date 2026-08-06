import { Link } from "react-router-dom";
import "../../css/Footer.css";
import LogoMTE from "../../assets/LogoMTE.png";

function Footer(){

return(
<footer className="footer">

<div className="footer-section">
<img src={LogoMTE} alt="MTE Toys"/>
<p>
Los mejores juguetes para niños y familias.
</p>
</div>

<div className="footer-section">
<h3>Tienda</h3>
<Link to="/">Inicio</Link>
<Link to="/productos">Juguetes</Link>
<Link to="/carrito">Carrito</Link>
</div>

<div className="footer-section">
<h3>Contacto</h3>
<p>📞 +56971065829</p>
<p>📧 contacto@mte.cl</p>
<p>📍 Santiago, Chile</p>
</div>

<div className="footer-section">
<h3>Síguenos</h3>

<div className="social">
<a 
href= "https://www.instagram.com/mte.toys.cl?igsh=bzk0cjZ5aTVzZ20="
target="_blank" 
rel="noopener noreferrer"
>
<img 
src="/logos_externos/instagram.png"
alt="Instagram"

/></a>
<a 
href= "https://wa.me/message/Y4UICHE5IKVID1"
target="_blank" 
rel="noopener noreferrer"
>

<img 
src="/logos_externos/whatsapp.png"
alt="WhatsApp"
/>
</a>
</div>

</div>

</footer>
);

}

export default Footer;
