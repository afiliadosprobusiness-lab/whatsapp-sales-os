import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/session";
import { hasSuperAdminSession } from "@/lib/superadmin";

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Cargando sesión...</p>
      </div>
    </div>
  );
}

export function RequireGuest() {
  const { isAuthenticated, status } = useAuth();

  if (hasSuperAdminSession()) {
    return <Navigate to="/superadmin" replace />;
  }

  if (status === "idle" || status === "loading") {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
