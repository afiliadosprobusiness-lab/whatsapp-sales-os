import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/session";

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Validando sesión...</p>
      </div>
    </div>
  );
}

export function RequireAuth() {
  const { isAuthenticated, status } = useAuth();
  const location = useLocation();

  if (status === "idle" || status === "loading") {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    const redirectTo = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/login" state={{ from: redirectTo }} replace />;
  }

  return <Outlet />;
}
