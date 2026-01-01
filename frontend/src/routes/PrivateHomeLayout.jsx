import { Navigate, Outlet, useLocation } from "react-router-dom";
import FloatingNavbar from "../components/layout/FloatingNavbar";
import useAuth from "../hooks/useAuth";

function PrivateHomeLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated && location.pathname !== "/") {
    return <Navigate to="/" replace />;
  }

  if (!isAuthenticated) {
    return <Outlet />;
  }

  // Case: Authenticated
  return (
    <div className="flex">
      <FloatingNavbar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default PrivateHomeLayout;
