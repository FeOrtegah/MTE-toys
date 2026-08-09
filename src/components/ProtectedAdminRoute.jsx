import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

function ProtectedAdminRoute({ children }) {
  const { user } = useUser();

  if (!user || user.rol !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;