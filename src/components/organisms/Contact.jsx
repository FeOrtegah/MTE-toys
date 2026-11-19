import Icon from "../atoms/Icon.jsx";
import "../../css/Contact.css";

function Contact() {
  return (
    <div className="contact">
        <div className="phone">

<img 
src="/logos_externos/whatsapp.png"
alt="WhatsApp"
/>

<span>
+56 979541850
</span>

</div>
      <span><Icon name="truck" /> Envíos rápidos</span>
      <span><Icon name="gift" /> Ofertas especiales</span>
    </div>
  );
}

export default Contact;