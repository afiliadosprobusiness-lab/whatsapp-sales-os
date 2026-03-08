import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { useAuth } from "@/lib/session";
import { authServiceErrors } from "@/services/auth.service";

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const { login, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const redirectTo = useMemo(() => {
    const fromState = (location.state as { from?: string } | null)?.from;
    return typeof fromState === "string" && fromState.startsWith("/") ? fromState : "/dashboard";
  }, [location.state]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);
    clearError();

    if (!email.trim() || !password.trim()) {
      setSubmitError("Completa email y contraseña para iniciar sesión.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password, rememberMe });
      setSubmitSuccess("Sesión iniciada. Redirigiendo...");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setSubmitError(authServiceErrors.getMessage(error, "No pudimos iniciar sesión."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const errorMessage = submitError ?? authError;

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 ventrix-hero-bg relative items-center justify-center p-12">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 50%, hsl(160 84% 29% / 0.2) 0%, transparent 50%)",
          }}
        />
        <div className="relative z-10 max-w-md">
          <BrandLogo className="mb-8" />
          <h2 className="font-display text-3xl font-bold mb-4" style={{ color: "hsl(0 0% 95%)" }}>
            Recupera ventas que creías perdidas
          </h2>
          <p className="text-base mb-10" style={{ color: "hsl(220 10% 60%)" }}>
            Más de 2,400 negocios en LATAM usan WhatsSalesRecovery para organizar sus ventas por WhatsApp y aumentar
            sus cierres.
          </p>
          <div className="space-y-4">
            {[
              "Organización automática de leads",
              "Seguimiento inteligente por WhatsApp",
              "Recuperación de ventas perdidas",
              "Reportes de ingresos en tiempo real",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-sidebar-primary/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-sidebar-primary" />
                </div>
                <span className="text-sm" style={{ color: "hsl(220 10% 70%)" }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <BrandLogo size="sm" className="mb-8 lg:hidden" />

          <h1 className="font-display text-2xl font-bold mb-1">Bienvenido de vuelta</h1>
          <p className="text-sm text-muted-foreground mb-8">Ingresa tus credenciales para acceder a tu cuenta</p>
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="tu@negocio.com"
                className="ventrix-input"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block" htmlFor="login-password">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="ventrix-input pr-10"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input
                  type="checkbox"
                  className="rounded border-input"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                Recordarme
              </label>
              <a href="#" className="text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {errorMessage && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">
                {errorMessage}
              </div>
            )}

            {submitSuccess && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-primary">
                {submitSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="ventrix-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs text-muted-foreground">
                <span className="bg-background px-3">o continúa con</span>
              </div>
            </div>

            <button
              type="button"
              className="ventrix-btn-secondary w-full flex items-center justify-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-8">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Crear cuenta gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
