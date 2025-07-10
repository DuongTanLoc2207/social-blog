import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/useAuth";

const PrivateRoute = () => {
  const { currentUser } = useAuth();

  return currentUser ? <Outlet/> : <Navigate to="/login" replace/>
};

export default PrivateRoute;
