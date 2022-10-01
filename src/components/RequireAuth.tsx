import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../contexts/Auth";

export const RequireAuth = () => {
  const authStore = useAuth();
  const location = useLocation();

  if (!authStore?.currentSession) {
    return <Navigate to={{ pathname: "/" }} state={{ location }} replace />;
  }

  return <Outlet />;
};
