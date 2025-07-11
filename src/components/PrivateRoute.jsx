import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/useAuth";

const PrivateRoute = () => {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Đang tải...</div>; 
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;