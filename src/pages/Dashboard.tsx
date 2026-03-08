import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Users, MessageSquare, TrendingUp, RefreshCw, Target, Clock,
  ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle2, Zap, BarChart3
} from "lucide-react";

const metrics = [
  { label: "Leads nuevos", value: "284", change: "+18%", up: true, icon: Users },
  { label: "Conversaciones activas", value: "127", change: "+7%", up: true, icon: MessageSquare },
  { label: "Oportunidades abandonadas", value: "43", change: "-12%", up: false, icon: AlertTriangle },
  { label: "Seguimientos pendientes", value: "31", change: "8 urgentes", up: true, icon: Clock },
  { label: "Leads recuperados", value: "67", change: "+34%", up: true, icon: RefreshCw },
  { label: "Campañas activas", value: "5", change: "2 nuevas", up: true, icon: Target },
  { label: "Tasa de respuesta", value: "72%", change: "+4%", up: true, icon: TrendingUp },
  { label: "Ingresos recuperados", value: "$48,320", change: "+23%", up: true, icon: BarChart3 },
];

const recentActivity = [
  { type: "lead", text: "Nuevo lead: Ana García — consulta sobre producto premium", time: "Hace 3 min" },
  { type: "recovery", text: "Lead recuperado: Roberto Díaz — reactivado después de 5 días", time: "Hace 12 min" },
  { type: "sale", text: "Venta cerrada: Claudia Ruiz — $1,200 MXN", time: "Hace 25 min" },
  { type: "followup", text: "Seguimiento enviado: campaña 'Reactivación Marzo' — 34 leads", time: "Hace 1 hora" },
  { type: "alert", text: "Alerta: 8 conversaciones sin respuesta por más de 24h", time: "Hace 2 horas" },
  { type: "lead", text: "Nuevo lead: Marco Herrera — interesado en plan empresarial", time: "Hace 3 horas" },
];

const topLeads = [
  { name: "Ana García", score: 92, status: "Caliente", value: "$3,200" },
  { name: "Pedro Martínez", score: 87, status: "Caliente", value: "$2,800" },
  { name: "Laura Sánchez", score: 78, status: "Tibio", value: "$1,500" },
  { name: "Carlos Mendoza", score: 65, status: "Tibio", value: "$4,100" },
  { name: "Diana López", score: 45, status: "Frío", value: "$900" },
];

const insights = [
  { icon: Zap, title: "Oportunidad detectada", desc: "12 leads que consultaron esta semana no recibieron follow-up. Potencial: $8,400.", type: "warning" },
  { icon: TrendingUp, title: "Tendencia positiva", desc: "Tu tasa de cierre subió 5% esta semana. Las campañas de recuperación están funcionando.", type: "success" },
  { icon: Target, title: "Segmento caliente", desc: "Los leads de e-commerce COD tienen 42% más probabilidad de cierre. Prioriza este segmento.", type: "info" },
];

export default function Dashboard() {
  return (
    <DashboardLayout title="Overview">
      <div className="space-y-6 animate-fade-in">
        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <div key={i} className="ventrix-metric">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                  <m.icon className="w-4 h-4 text-accent-foreground" />
                </div>
                <span className={`text-xs font-medium flex items-center gap-0.5 ${
                  m.up ? "text-primary" : "text-destructive"
                }`}>
                  {m.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {m.change}
                </span>
              </div>
              <p className="text-2xl font-display font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chart area */}
          <div className="lg:col-span-2 ventrix-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold">Rendimiento comercial</h3>
              <div className="flex gap-1">
                {["7d", "30d", "90d"].map(p => (
                  <button key={p} className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    p === "30d" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}>{p}</button>
                ))}
              </div>
            </div>
            {/* Mock chart */}
            <div className="h-56 flex items-end gap-2">
              {[35, 48, 42, 58, 52, 68, 62, 75, 70, 82, 78, 88, 72, 90, 85, 92, 88, 95, 80, 98, 92, 85, 100, 95, 88, 92, 98, 105, 100, 108].map((v, i) => (
                <div key={i} className="flex-1 rounded-t-sm transition-all hover:opacity-80" style={{
                  height: `${(v / 110) * 100}%`,
                  background: v > 80 ? "hsl(160 84% 29%)" : "hsl(160 84% 29% / 0.3)",
                }} />
              ))}
            </div>
            <div className="flex justify-between mt-3 text-[10px] text-muted-foreground">
              <span>1 Mar</span><span>15 Mar</span><span>30 Mar</span>
            </div>
          </div>

          {/* Insights */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold">Insights inteligentes</h3>
            {insights.map((ins, i) => (
              <div key={i} className={`ventrix-card p-4 border-l-2 ${
                ins.type === "warning" ? "border-l-warning" : ins.type === "success" ? "border-l-primary" : "border-l-info"
              }`}>
                <div className="flex items-start gap-3">
                  <ins.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    ins.type === "warning" ? "text-warning" : ins.type === "success" ? "text-primary" : "text-info"
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{ins.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{ins.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top leads */}
          <div className="ventrix-card p-6">
            <h3 className="font-display font-semibold mb-4">Leads más calientes</h3>
            <table className="ventrix-table">
              <thead>
                <tr>
                  <th>Lead</th><th>Score</th><th>Estado</th><th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {topLeads.map((l, i) => (
                  <tr key={i}>
                    <td className="font-medium">{l.name}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{width:`${l.score}%`}} />
                        </div>
                        <span className="text-xs">{l.score}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`ventrix-badge ${
                        l.status === "Caliente" ? "ventrix-badge-success" :
                        l.status === "Tibio" ? "ventrix-badge-warning" : "ventrix-badge-info"
                      }`}>{l.status}</span>
                    </td>
                    <td className="font-medium">{l.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent activity */}
          <div className="ventrix-card p-6">
            <h3 className="font-display font-semibold mb-4">Actividad reciente</h3>
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    a.type === "sale" ? "bg-primary" :
                    a.type === "recovery" ? "bg-info" :
                    a.type === "alert" ? "bg-warning" : "bg-muted-foreground"
                  }`} />
                  <div className="min-w-0">
                    <p className="text-sm">{a.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prob de cierre + alertas */}
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="ventrix-card p-5">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">Probabilidad promedio de cierre</p>
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="hsl(150 10% 90%)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="hsl(160 84% 29%)" strokeWidth="3"
                    strokeDasharray="68 32" strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-display font-bold text-xl">68%</span>
              </div>
              <p className="text-xs text-primary font-medium">+5% vs semana anterior</p>
            </div>
          </div>
          <div className="ventrix-card p-5">
            <p className="text-xs text-muted-foreground mb-3">Alertas comerciales</p>
            <div className="space-y-2">
              {[
                { text: "8 leads sin respuesta >24h", urgent: true },
                { text: "3 leads de alto valor sin seguimiento", urgent: true },
                { text: "Campaña 'Marzo' finaliza mañana", urgent: false },
              ].map((a, i) => (
                <div key={i} className={`flex items-center gap-2 text-xs p-2 rounded-lg ${
                  a.urgent ? "bg-destructive/5 text-destructive" : "bg-warning/5 text-warning"
                }`}>
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  {a.text}
                </div>
              ))}
            </div>
          </div>
          <div className="ventrix-card p-5">
            <p className="text-xs text-muted-foreground mb-3">Resumen del día</p>
            <div className="space-y-3">
              {[
                { label: "Leads contactados", value: "34/47" },
                { label: "Respuestas recibidas", value: "22" },
                { label: "Cierres del día", value: "6" },
                { label: "Ingresos hoy", value: "$4,200" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <span className="text-sm font-semibold">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
