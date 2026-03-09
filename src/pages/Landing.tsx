import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Heart,
  LineChart,
  MapPinned,
  MessageCircle,
  MessageSquare,
  Send,
  ShieldCheck,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.08, duration: 0.45 },
  }),
};

const testimonials = [
  {
    name: "Valeria Mendez",
    role: "Growth Manager",
    company: "Moda Lima Store",
    city: "Lima, Perú",
    avatar: "/avatars/valeria.svg",
    handle: "@vale.moda",
    likes: "1.2 mil",
    message:
      "En dos semanas pasamos de responder tarde a tener un flujo diario claro. Hoy recuperamos ventas sin perseguir chats manualmente.",
  },
  {
    name: "Diego Palacios",
    role: "Head of Sales",
    company: "ElectroHogar PE",
    city: "Arequipa, Perú",
    avatar: "/avatars/diego.svg",
    handle: "@diego.pipeline",
    likes: "986",
    message:
      "Duplicamos seguimientos efectivos y dejamos de improvisar. Cada asesor sabe qué lead atender primero y con qué mensaje.",
  },
  {
    name: "Andrea Ruiz",
    role: "COO",
    company: "Belleza Urbana",
    city: "Bogotá, Colombia",
    avatar: "/avatars/andrea.svg",
    handle: "@andrea.growth",
    likes: "1.8 mil",
    message:
      "La vista de oportunidades en riesgo nos cambió la operación: más foco comercial, menos fugas y mejor cierre por semana.",
  },
  {
    name: "Martin Salazar",
    role: "Founder",
    company: "MarketPro MX",
    city: "CDMX, México",
    avatar: "/avatars/martin.svg",
    handle: "@martin.pro",
    likes: "764",
    message:
      "Logramos estandarizar ventas entre equipos de Perú y México en el mismo tablero, sin depender de hojas de cálculo.",
  },
  {
    name: "Camila Torres",
    role: "Directora Comercial",
    company: "CasaNova Home",
    city: "Trujillo, Perú",
    avatar: "/avatars/camila.svg",
    handle: "@camila.home",
    likes: "1.1 mil",
    message:
      "Las secuencias de recuperación se sienten naturales y la ejecución del equipo mejoró porque cada conversación llega con contexto.",
  },
  {
    name: "José Herrera",
    role: "Revenue Lead",
    company: "Urban Retail CL",
    city: "Santiago, Chile",
    avatar: "/avatars/jose.svg",
    handle: "@jose_revenue",
    likes: "842",
    message:
      "Pasamos de reaccionar a destiempo a operar con alertas accionables. Ahora anticipamos caídas antes de perder la oportunidad.",
  },
];

const yesList = [
  "Tu canal principal de cierre es WhatsApp y hoy pierdes oportunidades por falta de seguimiento.",
  "Tu equipo comercial necesita una prioridad diaria clara, no solo una lista de chats.",
  "Quieres escalar de forma ordenada entre países de LATAM sin cambiar el proceso cada semana.",
  "Buscas más cierres y menos tareas manuales en hojas de cálculo.",
];

const noList = [
  "Tu operación no vende por canales conversacionales y no planea hacerlo.",
  "Tu volumen de leads es muy bajo y no necesitas automatización comercial.",
  "Prefieres trabajar sin métricas ni seguimiento de conversión.",
  "Buscas una herramienta estática para una sola tienda sin proyección de crecimiento.",
];

const features = [
  {
    icon: MessageSquare,
    title: "Inbox comercial unificado",
    description: "Centraliza conversaciones, etapa, valor potencial y contexto del cliente en una sola vista.",
  },
  {
    icon: Bot,
    title: "Playbooks automáticos",
    description: "Activa secuencias de seguimiento y recuperación por reglas claras, sin perder timing comercial.",
  },
  {
    icon: LineChart,
    title: "Analítica accionable de revenue",
    description: "Mide impacto real por campaña, canal y equipo para decidir con datos y no por intuición.",
  },
  {
    icon: Target,
    title: "Score de oportunidad en tiempo real",
    description: "Detecta qué lead tiene más probabilidad de cierre y ejecuta la siguiente acción recomendada.",
  },
];

const steps = [
  {
    step: "01",
    title: "Consolida tu operación",
    description: "Importa leads y conecta conversaciones para partir de una base limpia y accionable.",
  },
  {
    step: "02",
    title: "Orquesta seguimiento por prioridad",
    description: "Define reglas, tareas y alertas para que cada oportunidad reciba el siguiente paso correcto.",
  },
  {
    step: "03",
    title: "Escala con control ejecutivo",
    description: "Monitorea performance por país, equipo y etapa para crecer con previsibilidad en LATAM.",
  },
];

const stats = [
  { label: "Conversaciones activas", value: "1,284", delta: "+12%" },
  { label: "Ingreso recuperado", value: "$48,320", delta: "+23%" },
  { label: "Cierre efectivo", value: "34%", delta: "+5 pts" },
  { label: "Tareas críticas hoy", value: "47", delta: "8 urgentes" },
];

export default function Landing() {
  const [marqueeDirection, setMarqueeDirection] = useState<"left" | "right">("left");
  const marqueeItems = [...testimonials, ...testimonials];

  return (
    <div className="wsr-landing-bg relative min-h-screen overflow-x-hidden text-slate-100">
      <div className="wsr-orb wsr-orb-primary pointer-events-none" />
      <div className="wsr-orb wsr-orb-secondary pointer-events-none" />
      <div className="wsr-orb wsr-orb-tertiary pointer-events-none" />
      <div className="wsr-grid-overlay pointer-events-none absolute inset-0 opacity-45" />

      <nav className="fixed inset-x-0 top-4 z-50 px-4 md:px-6">
        <div className="wsr-nav-shell mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/landing" className="flex items-center">
            <BrandLogo size="sm" />
          </Link>
          <div className="hidden items-center gap-8 text-sm text-slate-300 lg:flex">
            <a href="#hero" className="transition-colors hover:text-emerald-300">
              Inicio
            </a>
            <a href="#testimonios" className="transition-colors hover:text-emerald-300">
              Casos reales
            </a>
            <a href="#fit" className="transition-colors hover:text-emerald-300">
              Encaje
            </a>
            <a href="#features" className="transition-colors hover:text-emerald-300">
              Producto
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-lg border border-slate-600/70 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-emerald-400/60 hover:text-emerald-200 sm:inline-flex"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-emerald-300 to-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition-all duration-300 hover:shadow-[0_0_28px_rgba(45,212,191,0.4)]"
            >
              Empezar ahora
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <section id="hero" className="px-6 pb-14 pt-32 md:pb-20 md:pt-40">
          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="relative">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={0}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200 shadow-[0_0_22px_rgba(16,185,129,0.2)]"
              >
                <MapPinned className="h-3.5 w-3.5" />
                Sistema comercial para Perú y LATAM
              </motion.div>

              <motion.h1
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={1}
                className="font-display text-4xl font-bold leading-tight text-white md:text-6xl lg:text-[4.1rem]"
              >
                WhatsSalesRecovery
                <span className="mt-2 block bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                  de conversaciones a ingresos predecibles
                </span>
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={2}
                className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg md:pr-6"
              >
                Centraliza chats, prioriza oportunidades y activa seguimiento automático para que tu equipo cierre más
                ventas con menos fricción operativa.
              </motion.p>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={3}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-300 to-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(20,184,166,0.32)]"
                >
                  Probar gratis ahora
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#testimonios"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600/70 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/60 hover:text-cyan-200"
                >
                  Ver cómo funciona
                  <ChevronRight className="h-4 w-4" />
                </a>
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={4}
                className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-2"
              >
                <p className="inline-flex items-center gap-2 rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2 shadow-[inset_0_1px_0_rgba(148,163,184,0.16)]">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  Pipeline, tareas y conversaciones en una sola operación.
                </p>
                <p className="inline-flex items-center gap-2 rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2 shadow-[inset_0_1px_0_rgba(148,163,184,0.16)]">
                  <Clock3 className="h-4 w-4 text-cyan-300" />
                  Menos improvisación comercial, más cierres por día.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="relative"
            >
              <div className="absolute -inset-6 rounded-[28px] bg-gradient-to-r from-emerald-400/25 via-cyan-400/20 to-blue-500/20 blur-3xl" />
              <div className="wsr-hero-panel relative overflow-hidden rounded-[24px] border border-slate-600/70 bg-slate-950/85 shadow-2xl shadow-cyan-950/45">
                <div className="border-b border-slate-800 bg-slate-900/80 p-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                </div>
                <div className="grid gap-4 p-5 sm:grid-cols-2">
                  <div className="rounded-2xl border border-cyan-300/30 bg-cyan-500/10 p-4 shadow-[inset_0_1px_0_rgba(125,211,252,0.25)]">
                    <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/90">Ingreso recuperado (30 días)</p>
                    <p className="mt-2 text-3xl font-semibold text-white">$48,320</p>
                    <p className="mt-2 text-sm text-emerald-300">+23% vs mes anterior</p>
                    <div className="mt-4 space-y-2">
                      <div className="h-2 rounded-full bg-slate-800">
                        <div className="h-2 w-[78%] rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300" />
                      </div>
                      <div className="h-2 rounded-full bg-slate-800">
                        <div className="h-2 w-[62%] rounded-full bg-gradient-to-r from-cyan-300 to-blue-300" />
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-4 shadow-[inset_0_1px_0_rgba(110,231,183,0.25)]">
                    <p className="text-xs uppercase tracking-[0.16em] text-emerald-200/90">Mensajes priorizados</p>
                    <div className="mt-3 space-y-3">
                      <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-sm text-slate-300">
                        Lead de Lima con alta intención: cotización enviada y seguimiento en 30 min.
                      </div>
                      <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-sm text-slate-300">
                        Cliente de CDMX en etapa final: oferta optimizada para cierre por volumen.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 border-t border-slate-800 p-5 sm:grid-cols-4">
                  {stats.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-slate-700/80 bg-slate-900/75 p-3 shadow-[inset_0_1px_0_rgba(148,163,184,0.13)]"
                    >
                      <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">{item.label}</p>
                      <p className="mt-1 text-lg font-semibold text-white">{item.value}</p>
                      <p className="text-xs text-emerald-300">{item.delta}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pointer-events-none absolute -left-6 top-8 hidden rounded-xl border border-cyan-300/30 bg-slate-950/90 px-3 py-2 text-xs text-cyan-200 shadow-xl shadow-cyan-950/40 md:block">
                Cierre efectivo: 34%
              </div>
              <div className="pointer-events-none absolute -right-6 bottom-10 hidden rounded-xl border border-emerald-300/35 bg-slate-950/90 px-3 py-2 text-xs text-emerald-200 shadow-xl shadow-emerald-950/40 md:block">
                8 tareas urgentes hoy
              </div>
            </motion.div>
          </div>
        </section>

        <section id="testimonios" className="px-6 pb-20">
          <div className="mx-auto max-w-7xl">
            <div className="wsr-section-shell mb-8 rounded-3xl p-6">
              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Testimonios</p>
                  <h2 className="mt-2 font-display text-3xl font-bold text-white md:text-5xl">
                    Resultados medibles en equipos reales
                  </h2>
                  <p className="mt-2 text-sm text-slate-300">Historias de Perú, Colombia, México y Chile</p>
                </div>
                <div className="hidden items-center gap-2 md:flex">
                  <button
                    type="button"
                    onClick={() => setMarqueeDirection("right")}
                    className="rounded-xl border border-slate-600/80 bg-slate-950/70 p-2.5 text-slate-200 transition-colors hover:border-cyan-300/70 hover:text-cyan-200"
                    aria-label="Mover testimonios a la derecha"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMarqueeDirection("left")}
                    className="rounded-xl border border-slate-600/80 bg-slate-950/70 p-2.5 text-slate-200 transition-colors hover:border-cyan-300/70 hover:text-cyan-200"
                    aria-label="Mover testimonios a la izquierda"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="wsr-testimonial-grid md:hidden overflow-x-auto rounded-3xl p-4 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max snap-x snap-mandatory gap-4 pr-3">
                {testimonials.map((item) => (
                  <article
                    key={`mobile-${item.name}`}
                    className="w-[300px] shrink-0 snap-center rounded-[24px] border border-slate-600/80 bg-slate-900/85 p-2 shadow-lg shadow-cyan-950/25"
                  >
                    <img
                      src={item.avatar}
                      alt={`Foto ficticia de ${item.name}`}
                      className="h-48 w-full rounded-[18px] object-cover"
                      loading="lazy"
                    />
                    <div className="mt-2 rounded-[18px] border border-slate-800 bg-slate-950/80 p-4">
                      <div className="mb-3 flex items-center gap-3">
                        <img
                          src={item.avatar}
                          alt={`Avatar de ${item.name}`}
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-cyan-300/40"
                          loading="lazy"
                        />
                        <div>
                          <p className="text-sm font-semibold text-white">{item.name}</p>
                          <p className="text-xs text-cyan-300">
                            {item.role} · {item.company}
                          </p>
                          <p className="text-xs text-slate-400">{item.handle}</p>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-300">{item.message}</p>
                      <div className="mt-4 flex items-center justify-between text-slate-400">
                        <p className="inline-flex items-center gap-1.5 text-xs text-rose-300">
                          <Heart className="h-3.5 w-3.5" />
                          {item.likes}
                        </p>
                        <div className="inline-flex items-center gap-2">
                          <MessageCircle className="h-3.5 w-3.5" />
                          <Send className="h-3.5 w-3.5" />
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-cyan-300">{item.city}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="wsr-testimonial-grid hidden rounded-3xl p-4 md:block">
              <div className="wsr-marquee-mask overflow-hidden py-2">
                <div className={`wsr-marquee-track ${marqueeDirection === "right" ? "wsr-marquee-reverse" : ""}`}>
                  {marqueeItems.map((item, index) => (
                    <article
                      key={`${item.name}-${index}`}
                      className="group min-w-[330px] max-w-[330px] rounded-[24px] border border-slate-600/80 bg-slate-900/85 p-2 shadow-xl shadow-cyan-950/20 transition-transform hover:-translate-y-1"
                    >
                    <img
                      src={item.avatar}
                      alt={`Foto ficticia de ${item.name}`}
                      className="h-56 w-full rounded-[18px] object-cover"
                      loading="lazy"
                    />
                    <div className="mt-2 rounded-[18px] border border-slate-800 bg-slate-950/80 p-4">
                      <div className="mb-3 flex items-center gap-3">
                        <img
                          src={item.avatar}
                          alt={`Avatar de ${item.name}`}
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-cyan-300/40"
                          loading="lazy"
                        />
                        <div>
                          <p className="text-sm font-semibold text-white">{item.name}</p>
                          <p className="text-xs text-cyan-300">
                            {item.role} · {item.company}
                          </p>
                          <p className="text-xs text-slate-400">{item.handle}</p>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-300">{item.message}</p>
                      <div className="mt-4 flex items-center justify-between text-slate-400">
                        <p className="inline-flex items-center gap-1.5 text-xs text-rose-300">
                          <Heart className="h-3.5 w-3.5" />
                          {item.likes}
                        </p>
                        <div className="inline-flex items-center gap-2">
                          <MessageCircle className="h-3.5 w-3.5" />
                          <Send className="h-3.5 w-3.5" />
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-cyan-300">{item.city}</p>
                    </div>
                  </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="fit" className="px-6 pb-20">
          <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-2">
            <div className="wsr-fit-positive rounded-3xl border p-6 md:p-8">
              <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                Esto es para ti: SÍ
              </p>
              <h3 className="font-display text-2xl font-bold text-white">Si ya vendes por chat y quieres escalar con control</h3>
              <div className="mt-6 space-y-3">
                {yesList.map((item) => (
                  <p key={item} className="inline-flex items-start gap-2 text-sm leading-relaxed text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300" />
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="wsr-fit-negative rounded-3xl border p-6 md:p-8">
              <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-300">
                <XCircle className="h-4 w-4" />
                Esto es para ti: NO
              </p>
              <h3 className="font-display text-2xl font-bold text-white">Si tu operación aún no necesita automatización comercial</h3>
              <div className="mt-6 space-y-3">
                {noList.map((item) => (
                  <p key={item} className="inline-flex items-start gap-2 text-sm leading-relaxed text-slate-200">
                    <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-300" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="px-6 pb-20">
          <div className="mx-auto grid w-full max-w-7xl gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="wsr-section-shell rounded-3xl p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Plataforma</p>
              <h3 className="mt-3 font-display text-3xl font-bold text-white">Un stack comercial completo para WhatsApp</h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Diseñado como un sistema modular: conversación, seguimiento, priorización y analítica en un flujo continuo.
              </p>
              <div className="mt-8 space-y-4">
                {steps.map((item) => (
                  <div
                    key={item.step}
                    className="rounded-2xl border border-slate-700/80 bg-slate-950/70 p-4 shadow-[inset_0_1px_0_rgba(148,163,184,0.14)]"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-300">Paso {item.step}</p>
                    <h4 className="mt-1 text-base font-semibold text-white">{item.title}</h4>
                    <p className="mt-2 text-sm text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-slate-700/80 bg-slate-900/75 p-6 shadow-[inset_0_1px_0_rgba(148,163,184,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/45"
                >
                  <feature.icon className="h-6 w-6 text-emerald-300" />
                  <h4 className="mt-4 font-display text-xl font-semibold text-white">{feature.title}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{feature.description}</p>
                </div>
              ))}
              <div className="rounded-3xl border border-cyan-300/30 bg-gradient-to-r from-cyan-500/12 via-blue-500/10 to-emerald-500/12 p-6 shadow-[inset_0_1px_0_rgba(125,211,252,0.25)] sm:col-span-2">
                <TrendingUp className="h-6 w-6 text-cyan-300" />
                <h4 className="mt-4 font-display text-2xl font-semibold text-white">Diseñado para operar equipos regionales</h4>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-200">
                  Desde Lima hasta CDMX: define un playbook único, mide rendimiento por equipo y escala sin perder calidad de ejecución.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="wsr-cta-shell mx-auto max-w-7xl rounded-3xl p-8 md:p-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">Comienza hoy</p>
                <h3 className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">
                  Haz que cada conversación tenga un próximo paso
                </h3>
                <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">
                  Crea tu cuenta, carga tus leads y activa playbooks comerciales en minutos.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-300 to-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(45,212,191,0.3)]"
                >
                  Empezar prueba gratis
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-500/70 bg-slate-950/65 px-6 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-emerald-300/60 hover:text-emerald-200"
                >
                  Ingresar
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-700/80 bg-slate-950/85 px-6 py-8 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>(c) 2026 WhatsSalesRecovery. Todos los derechos reservados.</p>
          <p>SaaS comercial para equipos de Perú y LATAM.</p>
        </div>
      </footer>
    </div>
  );
}
