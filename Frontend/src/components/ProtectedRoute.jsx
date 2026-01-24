import { Navigate } from "react-router-dom";
import { useAuth } from "../components/ContextApi.jsx";

function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return children;
}


export default ProtectedRoute;
