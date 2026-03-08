import { DashboardLayout } from "@/components/DashboardLayout";
import { Target, TrendingUp, AlertTriangle, ArrowUpRight, Zap, Clock, CheckCircle2 } from "lucide-react";

const leads = [
  { name: "Ana García", score: 92, signals: ["Respondió rápido", "Preguntó precio", "Pidió descuento"], risk: [], action: "Enviar oferta final", tier: "hot" },
  { name: "Pedro Martínez", score: 87, signals: ["Interesado en premium", "Segunda consulta"], risk: ["No confirmó pago"], action: "Follow-up directo", tier: "hot" },
  { name: "Miguel Torres", score: 84, signals: ["Consulta activa", "Preguntó disponibilidad"], risk: [], action: "Responder rápido", tier: "hot" },
  { name: "Carlos Mendoza", score: 65, signals: ["Contacto inicial positivo"], risk: ["2 días sin respuesta", "Objeción de precio"], action: "Reenviar oferta con descuento", tier: "warm" },
  { name: "Laura Sánchez", score: 55, signals: ["Referido"], risk: ["Sin respuesta a follow-up"], action: "Cambiar ángulo de mensaje", tier: "warm" },
  { name: "Diana López", score: 38, signals: ["Consulta inicial"], risk: ["3 días inactiva", "Solo preguntó una vez"], action: "Campaña de reactivación", tier: "cold" },
  { name: "Fernanda Ruiz", score: 15, signals: [], risk: ["7 días sin contacto", "Dijo que compró en otro lado"], action: "Archivar o campaña larga", tier: "cold" },
];

const tierColors = { hot: "text-primary", warm: "text-warning", cold: "text-destructive" };
const tierLabels = { hot: "Caliente", warm: "Tibio", cold: "Frío" };
const tierBadge = { hot: "ventrix-badge-success", warm: "ventrix-badge-warning", cold: "ventrix-badge-danger" };

export default function DealProbability() {
  return (
    <DashboardLayout title="Deal Probability">
      <div className="space-y-6 animate-fade-in">
        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Prob. promedio", value: "68%", icon: Target, color: "text-primary" },
            { label: "Leads calientes", value: "23", icon: TrendingUp, color: "text-primary" },
            { label: "Necesitan seguimiento", value: "15", icon: Clock, color: "text-warning" },
            { label: "En riesgo", value: "8", icon: AlertTriangle, color: "text-destructive" },
          ].map((m, i) => (
            <div key={i} className="ventrix-metric">
              <m.icon className={`w-5 h-5 ${m.color} mb-3`} />
              <p className="text-2xl font-display font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Ranking */}
        <div className="ventrix-card p-5">
          <h3 className="font-display font-semibold mb-5">Ranking de oportunidades</h3>
          <div className="space-y-3">
            {leads.map((l, i) => (
              <div key={i} className="border rounded-xl p-4 hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0">
                    {l.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{l.name}</p>
                      <span className={`ventrix-badge ${tierBadge[l.tier as keyof typeof tierBadge]} text-[10px]`}>
                        {tierLabels[l.tier as keyof typeof tierLabels]}
                      </span>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {l.signals.map((s, j) => (
                        <span key={j} className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-accent-foreground">{s}</span>
                      ))}
                      {l.risk.map((r, j) => (
                        <span key={j} className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive">{r}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${
                          l.score >= 80 ? "bg-primary" : l.score >= 50 ? "bg-warning" : "bg-destructive"
                        }`} style={{width:`${l.score}%`}} />
                      </div>
                      <span className={`text-sm font-display font-bold ${tierColors[l.tier as keyof typeof tierColors]}`}>{l.score}%</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{l.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution */}
        <div className="grid lg:grid-cols-3 gap-4">
          {[
            { tier: "Calientes (>75%)", count: 23, pct: 34, color: "bg-primary", rev: "$67,200" },
            { tier: "Tibios (40-75%)", count: 31, pct: 46, color: "bg-warning", rev: "$42,100" },
            { tier: "Fríos (<40%)", count: 14, pct: 20, color: "bg-destructive", rev: "$8,400" },
          ].map((d, i) => (
            <div key={i} className="ventrix-card p-5 text-center">
              <div className={`w-3 h-3 rounded-full ${d.color} mx-auto mb-3`} />
              <p className="text-xl font-display font-bold">{d.count} leads</p>
              <p className="text-xs text-muted-foreground mb-2">{d.tier}</p>
              <p className="text-sm font-semibold text-primary">{d.rev} potencial</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
