import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap, ArrowRight, Bot, RefreshCw, Upload, TrendingUp, BarChart3, Target,
  Lightbulb, MessageSquare, ShoppingCart, Users, Clock, AlertTriangle,
  CheckCircle2, ChevronRight, Star, Shield, Globe
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-card/80 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto h-14 flex items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">Ventrix</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Funciones</a>
            <a href="#how" className="hover:text-foreground transition-colors">Cómo funciona</a>
            <a href="#cases" className="hover:text-foreground transition-colors">Casos de uso</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="ventrix-btn-secondary h-9 px-4 text-sm inline-flex items-center">Iniciar sesión</Link>
            <Link to="/register" className="ventrix-btn-primary h-9 px-4 text-sm inline-flex items-center">Comenzar gratis</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="ventrix-hero-bg pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "radial-gradient(circle at 30% 40%, hsl(160 84% 29% / 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, hsl(210 80% 52% / 0.1) 0%, transparent 50%)"
        }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sidebar-border bg-sidebar-accent text-xs text-sidebar-accent-foreground mb-6">
            <Zap className="w-3 h-3 text-sidebar-primary" /> Inteligencia comercial para WhatsApp
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6" style={{color: "hsl(0 0% 95%)"}}>
            Recupera ventas perdidas.{" "}
            <span className="ventrix-gradient-text">Cierra más.</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{color: "hsl(220 10% 60%)"}}>
            Organiza tus leads, automatiza el seguimiento y convierte conversaciones de WhatsApp en ingresos reales. El sistema operativo comercial que tu negocio necesita.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="ventrix-btn-hero inline-flex items-center justify-center gap-2">
              Comenzar gratis <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#how" className="ventrix-btn-outline-hero inline-flex items-center justify-center gap-2">
              Ver cómo funciona
            </a>
          </motion.div>

          {/* Mock dashboard preview */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-16 rounded-xl overflow-hidden border border-sidebar-border shadow-2xl">
            <div className="bg-sidebar p-1">
              <div className="flex gap-1.5 px-3 py-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{background:"hsl(0 72% 51%)"}} />
                <div className="w-2.5 h-2.5 rounded-full" style={{background:"hsl(38 92% 50%)"}} />
                <div className="w-2.5 h-2.5 rounded-full" style={{background:"hsl(160 84% 39%)"}} />
              </div>
            </div>
            <div className="bg-sidebar-accent p-6 grid grid-cols-4 gap-4">
              {[
                { label: "Leads activos", value: "1,284", change: "+12%" },
                { label: "Ventas recuperadas", value: "$48,320", change: "+23%" },
                { label: "Tasa de cierre", value: "34%", change: "+5%" },
                { label: "Seguimientos hoy", value: "47", change: "8 urgentes" },
              ].map((m, i) => (
                <div key={i} className="rounded-lg p-4 border border-sidebar-border" style={{background:"hsl(220 25% 9%)"}}>
                  <p className="text-[10px] uppercase tracking-wider" style={{color:"hsl(220 10% 50%)"}}>{m.label}</p>
                  <p className="text-xl font-display font-bold mt-1" style={{color:"hsl(0 0% 95%)"}}>{m.value}</p>
                  <p className="text-[10px] mt-1" style={{color:"hsl(160 84% 50%)"}}>{m.change}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="ventrix-section bg-card" id="problem">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">El problema</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">¿Cuántas ventas pierdes cada semana?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Sin un sistema, cada conversación sin responder es dinero que se va. Tu equipo no puede dar seguimiento manual a cientos de leads.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: Clock, title: "Respuestas tardías", desc: "Tus leads reciben respuesta horas después. Para entonces, ya compraron en otro lado." },
              { icon: AlertTriangle, title: "Seguimiento inexistente", desc: "El 70% de tus leads necesitan más de 1 contacto para comprar. Sin seguimiento, se pierden." },
              { icon: MessageSquare, title: "Conversaciones olvidadas", desc: "Decenas de chats abiertos sin responder. Cada uno es una venta potencial abandonada." },
            ].map((item, i) => (
              <div key={i} className="ventrix-card p-6">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-destructive" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="ventrix-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">La solución</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Tu sistema operativo de ventas por WhatsApp</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Ventrix organiza, automatiza y optimiza todo tu proceso comercial para que ninguna venta se pierda.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Users, title: "Organiza leads", desc: "Pipeline visual, estados, prioridad y score automático para cada oportunidad." },
              { icon: Bot, title: "Chatbot cerrador", desc: "IA que vende, responde objeciones y empuja al cierre. No es un bot genérico." },
              { icon: RefreshCw, title: "Recupera ventas", desc: "Detecta leads fríos y conversaciones abandonadas. Reactívalos automáticamente." },
              { icon: TrendingUp, title: "Inteligencia comercial", desc: "Insights de rendimiento, cuellos de botella y oportunidades que no estás viendo." },
              { icon: Target, title: "Probabilidad de cierre", desc: "Score inteligente por lead. Sabe quién va a comprar y quién necesita más trabajo." },
              { icon: Lightbulb, title: "Optimiza tu oferta", desc: "Sugerencias de copy, ángulo y estrategia para convertir más en cada conversación." },
            ].map((item, i) => (
              <div key={i} className="ventrix-card p-6 group hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <item.icon className="w-5 h-5 text-accent-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-display font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="ventrix-section bg-card" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Funcionalidades</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Todo lo que necesitas para vender más</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Bot, title: "Chatbot cerrador", desc: "IA de ventas que cierra" },
              { icon: RefreshCw, title: "Recuperación", desc: "Reactiva leads fríos" },
              { icon: Megaphone, title: "Campañas", desc: "Reactivación masiva" },
              { icon: Upload, title: "Importar CSV", desc: "Tus contactos existentes" },
              { icon: TrendingUp, title: "Revenue Intelligence", desc: "Insights de ingreso" },
              { icon: BarChart3, title: "Reportes", desc: "KPIs y rendimiento" },
              { icon: Target, title: "Deal Probability", desc: "Score de cierre" },
              { icon: Lightbulb, title: "Offer Optimizer", desc: "Mejora tu mensaje" },
            ].map((item, i) => (
              <div key={i} className="ventrix-card p-5 text-center">
                <div className="w-10 h-10 rounded-lg bg-accent mx-auto flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <h3 className="font-display font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="ventrix-section" id="how">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Cómo funciona</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">De leads perdidos a ingresos reales en 5 pasos</h2>
          </div>
          <div className="space-y-6">
            {[
              { step: "01", title: "Conecta tu operación", desc: "Integra tu canal de WhatsApp y conecta tu flujo comercial actual." },
              { step: "02", title: "Organiza leads y conversaciones", desc: "Pipeline automático, clasificación y priorización inteligente." },
              { step: "03", title: "Automatiza el seguimiento", desc: "Secuencias de follow-up, chatbot cerrador y alertas de oportunidad." },
              { step: "04", title: "Recupera oportunidades perdidas", desc: "Detecta leads fríos, reactívalos con campañas y mensajes inteligentes." },
              { step: "05", title: "Aumenta cierres e ingresos", desc: "Inteligencia comercial, optimización de oferta y reportes de rendimiento." },
            ].map((item, i) => (
              <div key={i} className="ventrix-card p-6 flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="font-display font-bold text-primary-foreground">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ideal cases */}
      <section className="ventrix-section bg-card" id="cases">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">¿Para quién es?</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Ideal para negocios que venden por WhatsApp</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: ShoppingCart, title: "E-commerce COD", desc: "Negocios de pago contra entrega que necesitan confirmar pedidos y dar seguimiento." },
              { icon: MessageSquare, title: "Ventas por WhatsApp", desc: "Cualquier negocio que cierra ventas por chat y pierde oportunidades por falta de sistema." },
              { icon: Users, title: "Equipos comerciales", desc: "Equipos pequeños y medianos que necesitan organizar leads y medir rendimiento." },
              { icon: Globe, title: "Negocios LATAM", desc: "Empresas de la región que venden principalmente por canales de mensajería." },
              { icon: TrendingUp, title: "Marcas en crecimiento", desc: "Marcas que reciben muchos leads pero pierden ventas por seguimiento desordenado." },
              { icon: Shield, title: "Operaciones COD", desc: "Operaciones que necesitan confirmar, dar seguimiento y reducir devoluciones." },
            ].map((item, i) => (
              <div key={i} className="ventrix-card p-6">
                <item.icon className="w-6 h-6 text-primary mb-4" />
                <h3 className="font-display font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="ventrix-section">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-warning text-warning" />)}
          </div>
          <blockquote className="font-display text-2xl md:text-3xl font-semibold mb-6 leading-snug">
            "Recuperamos $23,000 en ventas perdidas en el primer mes. Ventrix cambió nuestra operación comercial."
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">CL</div>
            <div className="text-left">
              <p className="text-sm font-semibold">Carlos López</p>
              <p className="text-xs text-muted-foreground">Director Comercial, FashionCOD MX</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="ventrix-hero-bg py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4" style={{color:"hsl(0 0% 95%)"}}>
            Deja de perder ventas. <span className="ventrix-gradient-text">Empieza hoy.</span>
          </h2>
          <p className="text-lg mb-8" style={{color:"hsl(220 10% 55%)"}}>
            Conecta tu operación comercial y empieza a recuperar ingresos en minutos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="ventrix-btn-hero inline-flex items-center justify-center gap-2">
              Crear cuenta gratis <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="ventrix-btn-outline-hero inline-flex items-center justify-center gap-2">
              Agendar demo <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-display font-bold">Ventrix</span>
              </div>
              <p className="text-sm text-muted-foreground">El sistema operativo comercial para ventas por WhatsApp.</p>
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm mb-3">Producto</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="hover:text-foreground cursor-pointer transition-colors">Funcionalidades</p>
                <p className="hover:text-foreground cursor-pointer transition-colors">Precios</p>
                <p className="hover:text-foreground cursor-pointer transition-colors">Integraciones</p>
                <p className="hover:text-foreground cursor-pointer transition-colors">API</p>
              </div>
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm mb-3">Empresa</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="hover:text-foreground cursor-pointer transition-colors">Nosotros</p>
                <p className="hover:text-foreground cursor-pointer transition-colors">Blog</p>
                <p className="hover:text-foreground cursor-pointer transition-colors">Contacto</p>
                <p className="hover:text-foreground cursor-pointer transition-colors">Carreras</p>
              </div>
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm mb-3">Legal</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="hover:text-foreground cursor-pointer transition-colors">Privacidad</p>
                <p className="hover:text-foreground cursor-pointer transition-colors">Términos</p>
                <p className="hover:text-foreground cursor-pointer transition-colors">Cookies</p>
              </div>
            </div>
          </div>
          <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
            <p>© 2026 Ventrix. Todos los derechos reservados.</p>
            <p>Hecho con 💚 para LATAM</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Megaphone(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>;
}
