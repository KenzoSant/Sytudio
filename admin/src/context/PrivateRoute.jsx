import { Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

export default function PrivateRoute({ children }) {
  const { admin, loadingAuth } = useAdmin();

  if (loadingAuth) return null; 

  return admin ? children : <Navigate to="/login" />;
}
