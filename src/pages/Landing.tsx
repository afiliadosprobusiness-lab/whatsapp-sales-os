import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Handshake,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  Target,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

const kpis = [
  { value: "+27%", label: "ventas recuperadas", detail: "promedio en los primeros 60 dias" },
  { value: "-41%", label: "tiempo de respuesta", detail: "al usar prioridades y tareas automaticas" },
  { value: "+19%", label: "cierre mensual", detail: "por seguimiento consistente en WhatsApp" },
  { value: "3.2x", label: "retorno por equipo", detail: "en operaciones con mas de 2 asesores" },
];

const systemBenefits = [
  {
    icon: Smartphone,
    title: "API oficial de WhatsApp Business",
    description:
      "Envias y gestionas mensajes sobre la API oficial de WhatsApp para mayor estabilidad, seguridad y trazabilidad.",
  },
  {
    icon: Target,
    title: "Prioridad diaria clara para ventas",
    description:
      "Tu equipo ve primero los leads con mayor probabilidad de cierre para no perder oportunidades por demora.",
  },
  {
    icon: Clock3,
    title: "Seguimiento automatico sin hojas de calculo",
    description:
      "Activa recordatorios y playbooks para reducir tareas manuales y responder en el momento correcto.",
  },
  {
    icon: BarChart3,
    title: "Impacto real en ingresos",
    description:
      "Mides cuanto recuperas por canal, asesor y campana para mejorar decisiones cada semana con datos reales.",
  },
];

const outcomes = [
  "En 30 dias reduces conversaciones sin respuesta y ordenas tu operacion comercial.",
  "En 60 dias recuperas ventas que antes se perdian por falta de seguimiento.",
  "En 90 dias escalas el canal WhatsApp con proceso repetible y control de resultados.",
];

const integrations = [
  "Canal oficial de WhatsApp con configuracion centralizada desde Settings.",
  "Bandeja y pipeline en una sola vista para ejecutar sin cambiar de herramienta.",
  "Tareas por lead y alertas de riesgo para no dejar oportunidades abiertas.",
  "Reportes de revenue para medir recuperacion real por equipo y periodo.",
];

export default function Landing() {
  return (
    <div className="wsr-landing-bg relative min-h-screen overflow-x-hidden text-slate-100">
      <div className="wsr-orb wsr-orb-primary pointer-events-none" />
      <div className="wsr-orb wsr-orb-secondary pointer-events-none" />
      <div className="wsr-orb wsr-orb-tertiary pointer-events-none" />
      <div className="wsr-grid-overlay pointer-events-none absolute inset-0 opacity-45" />

      <nav className="fixed inset-x-0 top-4 z-50 px-4 md:px-6">
        <div className="wsr-nav-shell mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center">
            <BrandLogo size="sm" />
          </Link>
          <div className="hidden items-center gap-8 text-sm text-slate-300 lg:flex">
            <a href="#resultados" className="transition-colors hover:text-emerald-300">
              Resultados
            </a>
            <a href="#sistema" className="transition-colors hover:text-emerald-300">
              Sistema
            </a>
            <a href="#whatsapp" className="transition-colors hover:text-emerald-300">
              API oficial
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-lg border border-slate-600/70 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-emerald-400/60 hover:text-emerald-200 sm:inline-flex"
            >
              Iniciar sesion
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-emerald-300 to-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition-all duration-300 hover:shadow-[0_0_28px_rgba(45,212,191,0.4)]"
            >
              Empezar prueba
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <section className="px-6 pb-16 pt-32 md:pb-20 md:pt-40">
          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                Ventas por WhatsApp con control real
              </p>

              <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-white md:text-6xl">
                Convierte mas chats en ventas medibles
                <span className="mt-2 block bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                  usando la API oficial de WhatsApp
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
                WhatsSalesRecovery te da una operacion comercial simple: prioridades diarias, seguimiento automatico y
                reportes de ingresos para que tu equipo cierre mas sin improvisar.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-300 to-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(20,184,166,0.32)]"
                >
                  Crear cuenta gratis
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/quiz"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-600/70 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/60 hover:text-cyan-200"
                >
                  Ver quiz interactivo
                </Link>
              </div>

              <div className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                {kpis.slice(0, 2).map((item) => (
                  <p
                    key={item.label}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2 shadow-[inset_0_1px_0_rgba(148,163,184,0.16)]"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    {item.value} {item.label}
                  </p>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[28px] bg-gradient-to-r from-emerald-400/25 via-cyan-400/20 to-blue-500/20 blur-3xl" />
              <div className="wsr-hero-panel relative overflow-hidden rounded-[24px] border border-slate-600/70 bg-slate-950/90">
                <img
                  src="/ui-reference/hero-premium-01.png"
                  alt="Vista de plataforma SaaS con metricas y flujo de trabajo"
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-emerald-300/35 bg-slate-950/85 p-3 backdrop-blur">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-emerald-200">Ingreso recuperado</p>
                    <p className="mt-1 text-xl font-semibold text-white">$48,320</p>
                    <p className="text-xs text-emerald-300">+23% en 30 dias</p>
                  </div>
                  <div className="rounded-xl border border-cyan-300/35 bg-slate-950/85 p-3 backdrop-blur">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-cyan-200">Tiempo de respuesta</p>
                    <p className="mt-1 text-xl font-semibold text-white">-41%</p>
                    <p className="text-xs text-cyan-300">seguimiento automatico activo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="resultados" className="px-6 pb-20">
          <div className="mx-auto max-w-7xl">
            <div className="wsr-section-shell rounded-3xl p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Resultados esperados</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-white md:text-5xl">
                Beneficio claro, medido en numeros
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
                No vendemos promesas vagas. Vas a ver cambios concretos en conversion, velocidad de respuesta e ingreso
                recuperado.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {kpis.map((item) => (
                  <article
                    key={item.label}
                    className="rounded-2xl border border-slate-700/80 bg-slate-950/75 p-5 shadow-[inset_0_1px_0_rgba(148,163,184,0.14)]"
                  >
                    <p className="text-3xl font-semibold text-white">{item.value}</p>
                    <p className="mt-1 text-sm font-medium text-cyan-200">{item.label}</p>
                    <p className="mt-2 text-xs text-slate-400">{item.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="sistema" className="px-6 pb-20">
          <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-950/85">
              <img
                src="/ui-reference/dashboard-density-01.png"
                alt="Panel de control con indicadores y seguimiento comercial"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </article>

            <article className="wsr-section-shell rounded-3xl p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Como funciona</p>
              <h3 className="mt-3 font-display text-3xl font-bold text-white">Sistema simple para ejecutar mejor</h3>
              <div className="mt-6 space-y-4">
                {outcomes.map((item) => (
                  <p key={item} className="inline-flex items-start gap-3 text-sm leading-relaxed text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300" />
                    {item}
                  </p>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-cyan-300/30 bg-cyan-500/10 p-4">
                <p className="text-sm text-cyan-100">
                  Equipo promedio en LATAM: pasa de reaccionar chats a operar un proceso diario con prioridad, SLA y
                  seguimiento activo.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section id="whatsapp" className="px-6 pb-20">
          <div className="mx-auto grid w-full max-w-7xl gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <article className="grid gap-4 sm:grid-cols-2">
              {systemBenefits.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-slate-700/80 bg-slate-900/75 p-6 shadow-[inset_0_1px_0_rgba(148,163,184,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/45"
                >
                  <item.icon className="h-6 w-6 text-emerald-300" />
                  <h4 className="mt-4 font-display text-xl font-semibold text-white">{item.title}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.description}</p>
                </div>
              ))}
            </article>

            <article className="wsr-section-shell rounded-3xl p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Integraciones y control</p>
              <h3 className="mt-3 font-display text-3xl font-bold text-white">Todo conectado en una sola operacion</h3>
              <div className="mt-6 space-y-3">
                {integrations.map((item) => (
                  <p key={item} className="inline-flex items-start gap-3 text-sm text-slate-200">
                    <Handshake className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-300" />
                    {item}
                  </p>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-4">
                <p className="text-sm text-emerald-100">
                  Tu marca se comunica por la API oficial de WhatsApp y cada interaccion queda registrada para decision
                  comercial, seguimiento y auditoria.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="wsr-cta-shell mx-auto max-w-7xl overflow-hidden rounded-3xl p-8 md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">Crecimiento con datos</p>
                <h3 className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">
                  Haz que WhatsApp deje de ser caotico y empiece a producir resultados
                </h3>
                <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">
                  Empieza hoy y mide en 30 dias cuanto ingreso recuperas, cuanto tiempo ahorras y cuanto mejora tu tasa
                  de cierre.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-300 to-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(45,212,191,0.3)]"
                  >
                    Empezar ahora
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-500/70 bg-slate-950/65 px-6 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-emerald-300/60 hover:text-emerald-200"
                  >
                    Ya tengo cuenta
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-600/70 bg-slate-950/70 p-3">
                <img
                  src="/ui-reference/pricing-clean-01.png"
                  alt="Vista de estructura comercial con planes y propuesta de valor"
                  className="w-full rounded-xl"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-700/80 bg-slate-950/85 px-6 py-8 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>(c) 2026 WhatsSalesRecovery. Todos los derechos reservados.</p>
          <p className="inline-flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-cyan-300" />
            Operacion comercial con API oficial de WhatsApp.
          </p>
        </div>
      </footer>
    </div>
  );
}
