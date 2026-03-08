import { Link } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";

export default function Register() {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left */}
      <div className="hidden lg:flex lg:w-1/2 ventrix-hero-bg relative items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, hsl(160 84% 29% / 0.2) 0%, transparent 50%)"
        }} />
        <div className="relative z-10 max-w-md">
          <BrandLogo className="mb-8" />
          <h2 className="font-display text-3xl font-bold mb-4" style={{color:"hsl(0 0% 95%)"}}>
            Empieza a vender más hoy
          </h2>
          <p className="text-base mb-10" style={{color:"hsl(220 10% 60%)"}}>
            Crea tu cuenta en 30 segundos y comienza a organizar tus ventas por WhatsApp.
          </p>
          <div className="space-y-4">
            {[
              "Sin tarjeta de crédito",
              "Configuración en minutos",
              "Soporte en español",
              "Plan gratuito disponible",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{color:"hsl(160 84% 50%)"}} />
                <span className="text-sm" style={{color:"hsl(220 10% 70%)"}}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <BrandLogo size="sm" className="mb-8 lg:hidden" />

          <h1 className="font-display text-2xl font-bold mb-1">Crear cuenta</h1>
          <p className="text-sm text-muted-foreground mb-8">Comienza a recuperar ventas perdidas hoy</p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nombre completo</label>
              <input type="text" placeholder="María Rodríguez" className="ventrix-input" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
              <input type="email" placeholder="tu@negocio.com" className="ventrix-input" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Contraseña</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} placeholder="Mínimo 8 caracteres" className="ventrix-input pr-10" />
                <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Confirmar contraseña</label>
              <input type="password" placeholder="Repite tu contraseña" className="ventrix-input" />
            </div>

            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <input type="checkbox" className="rounded border-input mt-0.5" />
              <span>Acepto los <a href="#" className="text-primary hover:underline">términos de servicio</a> y la <a href="#" className="text-primary hover:underline">política de privacidad</a></span>
            </label>

            <Link to="/dashboard" className="ventrix-btn-primary w-full flex items-center justify-center">
              Crear cuenta
            </Link>

            <button className="ventrix-btn-secondary w-full flex items-center justify-center gap-2 text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Registrarse con Google
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
