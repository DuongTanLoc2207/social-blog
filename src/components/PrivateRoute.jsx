import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/useAuth";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";

const override = css`
  display: block;
  margin: 0 auto;
`;

const PrivateRoute = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader color="#3498db" css={override} size={50} />
      </div>
    );
  }
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;