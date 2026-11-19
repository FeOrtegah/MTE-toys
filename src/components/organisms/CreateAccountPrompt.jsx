import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { leerDatosInvitado } from "../../services/guestCheckoutData";
import "../../css/CreateAccountPrompt.css";

// Al final de la compra, si la persona compró sin cuenta, le
// ofrece crearla con los datos que ya escribió en el checkout.
function CreateAccountPrompt() {
  const { user } = useUser();

  if (user) return null;

  const datos = leerDatosInvitado();

  if (!datos?.email) return null;

  return (
    <div className="create-account-prompt">
      <h2>¿Desea crear una cuenta?</h2>

      <p>
        Ya tenemos tus datos de esta compra. Solo falta que elijas
        una contraseña y podrás seguir tus pedidos y comprar más
        rápido la próxima vez.
      </p>

      <Link to="/registro" className="create-account-btn">
        Crear mi cuenta
      </Link>
    </div>
  );
}

export default CreateAccountPrompt;
