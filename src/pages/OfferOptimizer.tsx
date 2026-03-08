import { DashboardLayout } from "@/components/DashboardLayout";
import { Lightbulb, ArrowRight, CheckCircle2, AlertCircle, TrendingUp, Zap, Copy } from "lucide-react";

const optimizations = [
  {
    title: "Mensaje de apertura",
    current: "Hola, te escribo para ofrecerte nuestro producto premium.",
    suggested: "¡Hola {nombre}! 👋 Vi que te interesó nuestro producto premium. Tengo algo especial para ti — ¿puedo contarte? Solo toma 1 minuto.",
    improvements: ["Personalización con nombre", "Gancho de curiosidad", "Compromiso bajo (1 minuto)", "Tono amigable"],
    score: { before: 45, after: 82 }
  },
  {
    title: "Respuesta a objeción de precio",
    current: "El precio es $1,200 y no tenemos descuento.",
    suggested: "Entiendo que $1,200 puede parecer una inversión importante. Pero piénsalo así: si este producto te ahorra 3 horas por semana, en un mes ya se pagó solo. Además, hoy puedo ofrecerte envío gratis 🚚",
    improvements: ["Reframe de inversión", "Beneficio cuantificado", "Concesión alternativa", "Emoji de acción"],
    score: { before: 30, after: 75 }
  },
  {
    title: "Mensaje de follow-up",
    current: "Hola, ¿ya te decidiste?",
    suggested: "¡Hola {nombre}! 😊 Solo quería contarte que el producto que viste tiene stock limitado. Ya se han vendido 15 unidades esta semana. ¿Te lo aparto antes de que se agote?",
    improvements: ["Escasez real", "Prueba social", "CTA claro", "Sin presión agresiva"],
    score: { before: 35, after: 78 }
  },
];

const analysisMetrics = [
  { label: "Claridad del mensaje", score: 72, tip: "Usa frases más cortas y directas" },
  { label: "Sentido de urgencia", score: 45, tip: "Agrega limitación de tiempo o disponibilidad" },
  { label: "Valor percibido", score: 58, tip: "Menciona beneficios específicos, no solo características" },
  { label: "Llamada a la acción", score: 40, tip: "Termina cada mensaje con una pregunta o acción clara" },
  { label: "Personalización", score: 65, tip: "Usa el nombre y contexto del lead" },
  { label: "Manejo de objeciones", score: 52, tip: "Prepara respuestas empáticas para las 5 objeciones más comunes" },
];

export default function OfferOptimizer() {
  return (
    <DashboardLayout title="Offer Optimizer">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="ventrix-card p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-warning" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-lg">Optimizador de oferta</h2>
              <p className="text-sm text-muted-foreground">Mejora tus mensajes de venta con sugerencias inteligentes</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-display font-bold text-primary">+37%</p>
            <p className="text-xs text-muted-foreground">mejora promedio en conversión</p>
          </div>
        </div>

        {/* Analysis */}
        <div className="ventrix-card p-5">
          <h3 className="font-display font-semibold mb-4">Análisis de tu comunicación actual</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysisMetrics.map((m, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{m.label}</span>
                  <span className={`text-sm font-display font-bold ${
                    m.score >= 70 ? "text-primary" : m.score >= 50 ? "text-warning" : "text-destructive"
                  }`}>{m.score}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted mb-2">
                  <div className={`h-full rounded-full ${
                    m.score >= 70 ? "bg-primary" : m.score >= 50 ? "bg-warning" : "bg-destructive"
                  }`} style={{width:`${m.score}%`}} />
                </div>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Lightbulb className="w-2.5 h-2.5" /> {m.tip}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Optimizations */}
        {optimizations.map((opt, i) => (
          <div key={i} className="ventrix-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-display font-semibold">{opt.title}</h3>
              <div className="ml-auto flex items-center gap-2 text-xs">
                <span className="text-destructive font-medium">{opt.score.before}%</span>
                <ArrowRight className="w-3 h-3" />
                <span className="text-primary font-bold">{opt.score.after}%</span>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="bg-destructive/5 border border-destructive/10 rounded-lg p-4">
                <p className="text-[10px] uppercase tracking-wider text-destructive font-semibold mb-2">Actual</p>
                <p className="text-sm leading-relaxed">{opt.current}</p>
              </div>
              <div className="bg-accent border border-primary/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] uppercase tracking-wider text-primary font-semibold">Sugerido</p>
                  <button className="text-[10px] text-muted-foreground flex items-center gap-1 hover:text-foreground"><Copy className="w-3 h-3" /> Copiar</button>
                </div>
                <p className="text-sm leading-relaxed">{opt.suggested}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {opt.improvements.map((imp, j) => (
                <span key={j} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-accent text-accent-foreground">
                  <CheckCircle2 className="w-2.5 h-2.5" /> {imp}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* Tips */}
        <div className="ventrix-card p-5">
          <h3 className="font-display font-semibold mb-4">Tips de optimización</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              "Usa preguntas abiertas en vez de cerradas para mantener la conversación",
              "Menciona el nombre del lead en los primeros 3 mensajes",
              "No ofrezcas descuento al primer contacto — guárdalo para la segunda objeción",
              "Cierra cada mensaje con una pregunta o CTA claro",
              "Usa emojis con moderación: 1-2 por mensaje es ideal",
              "Responde en menos de 5 minutos para maximizar conversión",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <Lightbulb className="w-3.5 h-3.5 text-warning mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
