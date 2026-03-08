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
    handle: "@maria_codshop",
    likes: "1.2 mil",
    message:
      "Con WhatsSalesRecovery dejamos de perder chats en horas pico. Recuperamos ventas todos los días.",
  },
  {
    name: "Diego Palacios",
    role: "Head of Sales",
    company: "ElectroHogar PE",
    city: "Arequipa, Perú",
    avatar: "/avatars/diego.svg",
    handle: "@dan_pedidos",
    likes: "986",
    message:
      "Nuestro equipo duplicó el seguimiento efectivo y subió la tasa de cierre en menos de 30 días.",
  },
  {
    name: "Andrea Ruiz",
    role: "COO",
    company: "Belleza Urbana",
    city: "Bogotá, Colombia",
    avatar: "/avatars/andrea.svg",
    handle: "@vale.store",
    likes: "1.8 mil",
    message:
      "La vista de oportunidades en riesgo nos ayudó a priorizar mejor y vender con menos fricción.",
  },
  {
    name: "Martin Salazar",
    role: "Founder",
    company: "MarketPro MX",
    city: "CDMX, México",
    avatar: "/avatars/martin.svg",
    handle: "@javi_cod",
    likes: "764",
    message:
      "El sistema nos dio una operación más ordenada para LATAM, sin depender de hojas de cálculo.",
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
      "Las secuencias de recuperación se sienten naturales y el equipo responde con mejor contexto.",
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
      "Pasamos de reaccionar tarde a anticiparnos con alertas claras y acciones concretas.",
  },
];

const yesList = [
  "Vendes por WhatsApp y tienes leads sin seguimiento diario.",
  "Tu equipo comercial necesita priorizar mejor y cerrar más rápido.",
  "Quieres una operación simple para Perú y expansión en LATAM.",
  "Buscas recuperar ventas perdidas sin sumar procesos manuales.",
];

const noList = [
  "Solo vendes por canal físico y no usas conversaciones digitales.",
  "No tienes volumen de leads y prefieres un CRM básico sin automatización.",
  "No quieres medir conversión ni tomar decisiones con datos.",
  "Necesitas una solución cerrada para una sola tienda sin crecimiento.",
];

const features = [
  {
    icon: MessageSquare,
    title: "Conversaciones con contexto",
    description: "Cada lead llega con historial, etapa y prioridad para responder con precisión.",
  },
  {
    icon: Bot,
    title: "Automatización comercial",
    description: "Secuencias de seguimiento y recuperación para no dejar oportunidades en visto.",
  },
  {
    icon: LineChart,
    title: "Decisión basada en revenue",
    description: "Visualiza impacto real por campaña, canal y vendedor con foco en conversión.",
  },
  {
    icon: Target,
    title: "Priorización inteligente",
    description: "Detecta prospectos con mayor probabilidad de cierre y acelera acciones.",
  },
];

const steps = [
  {
    step: "01",
    title: "Conecta tu flujo actual",
    description: "Importa leads y organiza conversaciones activas de tu operación comercial.",
  },
  {
    step: "02",
    title: "Activa seguimiento automatizado",
    description: "Define reglas de contacto para evitar que las oportunidades se enfríen.",
  },
  {
    step: "03",
    title: "Escala con enfoque LATAM",
    description: "Opera con visibilidad clara por país, equipo y etapa del pipeline.",
  },
];

const stats = [
  { label: "Leads activos", value: "1,284", delta: "+12%" },
  { label: "Ventas recuperadas", value: "$48,320", delta: "+23%" },
  { label: "Tasa de cierre", value: "34%", delta: "+5%" },
  { label: "Seguimientos hoy", value: "47", delta: "8 urgentes" },
];

export default function Landing() {
  const [marqueeDirection, setMarqueeDirection] = useState<"left" | "right">("left");
  const marqueeItems = [...testimonials, ...testimonials];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#030712] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.24),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(56,189,248,0.2),transparent_30%),radial-gradient(circle_at_60%_80%,rgba(14,116,144,0.2),transparent_40%)]" />

      <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-800/70 bg-slate-950/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/favicon.svg"
              alt="Logo de WhatsSalesRecovery"
              className="h-8 w-8 rounded-lg object-cover ring-1 ring-emerald-300/40"
              loading="eager"
            />
            <span className="font-display text-base font-semibold tracking-tight">WhatsSalesRecovery</span>
          </Link>
          <div className="hidden items-center gap-8 text-sm text-slate-300 lg:flex">
            <a href="#hero" className="transition-colors hover:text-emerald-300">
              Inicio
            </a>
            <a href="#testimonios" className="transition-colors hover:text-emerald-300">
              Testimonios
            </a>
            <a href="#fit" className="transition-colors hover:text-emerald-300">
              Esto es para ti
            </a>
            <a href="#features" className="transition-colors hover:text-emerald-300">
              Plataforma
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-emerald-400/60 hover:text-emerald-200 sm:inline-flex"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
            >
              Empezar ahora
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <section id="hero" className="px-6 pb-12 pt-28 md:pb-16 md:pt-36">
          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={0}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200"
              >
                <MapPinned className="h-3.5 w-3.5" />
                Diseñado para Perú y LATAM
              </motion.div>

              <motion.h1
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={1}
                className="font-display text-4xl font-bold leading-tight text-white md:text-6xl"
              >
                WhatsSalesRecovery
                <span className="mt-2 block bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                  recupera ventas en tiempo real
                </span>
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={2}
                className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg"
              >
                Convierte conversaciones en cierres con una experiencia comercial moderna: seguimiento inteligente,
                automatización y visibilidad completa del pipeline en un solo lugar.
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
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-emerald-300"
                >
                  Crear cuenta gratis
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#testimonios"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-cyan-300/60 hover:text-cyan-200"
                >
                  Ver casos reales
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
                <p className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/45 px-3 py-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  Operación comercial ordenada para equipos en crecimiento.
                </p>
                <p className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/45 px-3 py-2">
                  <Clock3 className="h-4 w-4 text-cyan-300" />
                  Menos tiempo respondiendo tarde, más tiempo cerrando ventas.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-[28px] bg-gradient-to-r from-emerald-400/20 via-cyan-400/15 to-blue-500/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-[24px] border border-slate-700/70 bg-slate-950/80 shadow-2xl shadow-cyan-950/40">
                <div className="border-b border-slate-800 bg-slate-900/80 p-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                </div>
                <div className="grid gap-4 p-5 sm:grid-cols-2">
                  <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/90">Ingreso recuperado</p>
                    <p className="mt-2 text-3xl font-semibold text-white">$48,320</p>
                    <p className="mt-2 text-sm text-emerald-300">+23% vs último periodo</p>
                    <div className="mt-4 space-y-2">
                      <div className="h-2 rounded-full bg-slate-800">
                        <div className="h-2 w-[78%] rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300" />
                      </div>
                      <div className="h-2 rounded-full bg-slate-800">
                        <div className="h-2 w-[62%] rounded-full bg-gradient-to-r from-cyan-300 to-blue-300" />
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-emerald-200/90">Mensajes priorizados</p>
                    <div className="mt-3 space-y-3">
                      <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-sm text-slate-300">
                        Lead de Lima solicita stock y envío rápido.
                      </div>
                      <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-sm text-slate-300">
                        Cliente de CDMX listo para cerrar con descuento por volumen.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 border-t border-slate-800 p-5 sm:grid-cols-4">
                  {stats.map((item) => (
                    <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">{item.label}</p>
                      <p className="mt-1 text-lg font-semibold text-white">{item.value}</p>
                      <p className="text-xs text-emerald-300">{item.delta}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="testimonios" className="wsr-testimonial-grid px-6 pb-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 rounded-3xl border border-cyan-400/20 bg-slate-900/35 p-6 backdrop-blur-sm">
              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Testimonios</p>
                  <h2 className="mt-2 font-display text-3xl font-bold text-white md:text-5xl">
                    Historias reales de tiendas que venden más
                  </h2>
                  <p className="mt-2 text-sm text-slate-300">Desliza o usa las flechas para navegar</p>
                </div>
                <div className="hidden items-center gap-2 md:flex">
                  <button
                    type="button"
                    onClick={() => setMarqueeDirection("right")}
                    className="rounded-xl border border-slate-700 bg-slate-950/70 p-2.5 text-slate-200 transition-colors hover:border-cyan-300/70 hover:text-cyan-200"
                    aria-label="Mover testimonios a la derecha"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMarqueeDirection("left")}
                    className="rounded-xl border border-slate-700 bg-slate-950/70 p-2.5 text-slate-200 transition-colors hover:border-cyan-300/70 hover:text-cyan-200"
                    aria-label="Mover testimonios a la izquierda"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="md:hidden overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max snap-x snap-mandatory gap-4 pr-3">
                {testimonials.map((item) => (
                  <article
                    key={`mobile-${item.name}`}
                    className="w-[300px] shrink-0 snap-center rounded-[24px] border border-slate-700/80 bg-slate-900/80 p-2 shadow-lg shadow-cyan-950/25"
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

            <div className="hidden md:block wsr-marquee-mask overflow-hidden py-2">
              <div className={`wsr-marquee-track ${marqueeDirection === "right" ? "wsr-marquee-reverse" : ""}`}>
                {marqueeItems.map((item, index) => (
                  <article
                    key={`${item.name}-${index}`}
                    className="group min-w-[330px] max-w-[330px] rounded-[24px] border border-slate-700/80 bg-slate-900/80 p-2 shadow-xl shadow-cyan-950/20 transition-transform hover:-translate-y-1"
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
        </section>

        <section id="fit" className="px-6 pb-16">
          <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-emerald-400/25 bg-emerald-500/5 p-6 md:p-8">
              <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                Esto es para ti: SÍ
              </p>
              <h3 className="font-display text-2xl font-bold text-white">Si buscas escalar con orden comercial</h3>
              <div className="mt-6 space-y-3">
                {yesList.map((item) => (
                  <p key={item} className="inline-flex items-start gap-2 text-sm leading-relaxed text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300" />
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-rose-400/20 bg-rose-500/5 p-6 md:p-8">
              <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-300">
                <XCircle className="h-4 w-4" />
                Esto es para ti: NO
              </p>
              <h3 className="font-display text-2xl font-bold text-white">Si no necesitas automatización comercial</h3>
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

        <section id="features" className="px-6 pb-16">
          <div className="mx-auto grid w-full max-w-7xl gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Plataforma</p>
              <h3 className="mt-3 font-display text-3xl font-bold text-white">Un sistema moderno para convertir más</h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                WhatsSalesRecovery combina control operativo y experiencia visual premium para equipos de ventas en LATAM.
              </p>
              <div className="mt-8 space-y-4">
                {steps.map((item) => (
                  <div key={item.step} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-300">Paso {item.step}</p>
                    <h4 className="mt-1 text-base font-semibold text-white">{item.title}</h4>
                    <p className="mt-2 text-sm text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                  <feature.icon className="h-6 w-6 text-emerald-300" />
                  <h4 className="mt-4 font-display text-xl font-semibold text-white">{feature.title}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{feature.description}</p>
                </div>
              ))}
              <div className="rounded-3xl border border-cyan-400/25 bg-cyan-500/10 p-6 sm:col-span-2">
                <TrendingUp className="h-6 w-6 text-cyan-300" />
                <h4 className="mt-4 font-display text-2xl font-semibold text-white">Listo para crecimiento regional</h4>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-200">
                  Desde Lima hasta CDMX: define procesos replicables, mide conversión por equipo y construye una operación comercial consistente.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-20">
          <div className="mx-auto max-w-7xl rounded-3xl border border-emerald-400/25 bg-gradient-to-r from-emerald-500/15 via-cyan-500/10 to-blue-500/15 p-8 md:p-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">Comienza hoy</p>
                <h3 className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">
                  Convierte conversaciones en ventas con WhatsSalesRecovery
                </h3>
                <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">
                  Activa tu cuenta, integra tu flujo y empieza a recuperar ingresos en menos tiempo.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-300 px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-200"
                >
                  Crear cuenta gratis
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-emerald-300/60 hover:text-emerald-200"
                >
                  Ingresar
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 px-6 py-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>(c) 2026 WhatsSalesRecovery. Todos los derechos reservados.</p>
          <p>SaaS comercial para equipos de Perú y LATAM.</p>
        </div>
      </footer>
    </div>
  );
}
