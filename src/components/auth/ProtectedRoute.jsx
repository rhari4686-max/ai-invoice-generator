import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuthenticated = true; // later connect to auth
  const loading = false;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
