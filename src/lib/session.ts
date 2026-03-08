import { ReactNode, createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import authService, { authServiceErrors } from "@/services/auth.service";
import { AuthLoginRequest, AuthRegisterRequest, AuthStatus, AuthUser } from "@/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  error: string | null;
  login: (payload: AuthLoginRequest) => Promise<AuthUser>;
  register: (payload: AuthRegisterRequest) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const getAuthMessage = (error: unknown, fallback: string) => authServiceErrors.getMessage(error, fallback);

const getStatusFromError = (error: unknown): AuthStatus => {
  const normalized = authServiceErrors.normalize(error);
  return normalized.status === 401 ? "unauthorized" : "error";
};

export function getUserInitials(user: Pick<AuthUser, "fullName" | "email"> | null): string {
  if (!user) {
    return "??";
  }

  const cleanName = user.fullName.trim();
  if (cleanName.length === 0) {
    return user.email.slice(0, 2).toUpperCase();
  }

  const parts = cleanName.split(" ").filter(Boolean);
  const initials = parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || user.email.slice(0, 2).toUpperCase();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshSession = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      const response = await authService.me();
      setUser(response.user);
      setStatus("success");
    } catch (authError) {
      setUser(null);

      const nextStatus = getStatusFromError(authError);
      setStatus(nextStatus);

      if (nextStatus === "error") {
        setError(getAuthMessage(authError, "No se pudo validar tu sesion."));
      }
    }
  }, []);

  const login = useCallback(async (payload: AuthLoginRequest) => {
    setStatus("loading");
    setError(null);

    try {
      const response = await authService.login(payload);
      setUser(response.user);
      setStatus("success");
      return response.user;
    } catch (authError) {
      setUser(null);
      const nextStatus = getStatusFromError(authError);
      setStatus(nextStatus);
      setError(getAuthMessage(authError, "No pudimos iniciar sesion."));
      throw authError;
    }
  }, []);

  const register = useCallback(async (payload: AuthRegisterRequest) => {
    setStatus("loading");
    setError(null);

    try {
      const response = await authService.register(payload);
      setUser(response.user);
      setStatus("success");
      return response.user;
    } catch (authError) {
      setUser(null);
      const nextStatus = getStatusFromError(authError);
      setStatus(nextStatus);
      setError(getAuthMessage(authError, "No pudimos crear tu cuenta."));
      throw authError;
    }
  }, []);

  const logout = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      await authService.logout();
    } catch (authError) {
      const normalized = authServiceErrors.normalize(authError);
      if (normalized.status !== 401) {
        setError(getAuthMessage(authError, "No pudimos cerrar tu sesion."));
        throw authError;
      }
    } finally {
      setUser(null);
      setStatus("unauthorized");
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === "success" && !!user,
      error,
      login,
      register,
      logout,
      refreshSession,
      clearError,
    }),
    [clearError, error, login, logout, refreshSession, register, status, user],
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider.");
  }

  return context;
}
