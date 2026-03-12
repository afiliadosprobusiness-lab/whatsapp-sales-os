import { Navigate, Outlet, useLocation } from "react-router-dom";
import { hasSuperAdminSession } from "@/lib/superadmin";

export function RequireSuperAdmin() {
  const location = useLocation();

  if (!hasSuperAdminSession()) {
    const redirectTo = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/login" state={{ from: redirectTo }} replace />;
  }

  return <Outlet />;
}
