import { DashboardLayout } from "@/components/DashboardLayout";
import { RefreshCw, TrendingUp, AlertTriangle, CheckCircle2, Clock, Send, Users, Zap } from "lucide-react";

const metrics = [
  { label: "Leads fríos detectados", value: "143", icon: AlertTriangle, color: "text-warning" },
  { label: "Conversaciones abandonadas", value: "67", icon: Clock, color: "text-destructive" },
  { label: "Recuperados este mes", value: "34", icon: CheckCircle2, color: "text-primary" },
  { label: "Ingresos recuperados", value: "$18,420", icon: TrendingUp, color: "text-primary" },
];

const coldLeads = [
  { name: "Fernanda Ruiz", lastContact: "7 días", reason: "Sin respuesta a oferta", segment: "E-commerce", reactivable: true },
  { name: "José Hernández", lastContact: "5 días", reason: "Pidió tiempo para pensar", segment: "COD", reactivable: true },
  { name: "Mariana Vega", lastContact: "10 días", reason: "Conversación abandonada", segment: "WhatsApp", reactivable: true },
  { name: "Andrés Luna", lastContact: "3 días", reason: "Objeción de precio", segment: "E-commerce", reactivable: true },
  { name: "Sofía Castillo", lastContact: "14 días", reason: "No contestó follow-up", segment: "COD", reactivable: false },
  { name: "Diego Morales", lastContact: "6 días", reason: "Preguntó y desapareció", segment: "WhatsApp", reactivable: true },
];

const sequences = [
  { name: "Reactivación suave", messages: 3, interval: "1 día", active: true, recovered: 12 },
  { name: "Oferta especial", messages: 2, interval: "2 días", active: true, recovered: 8 },
  { name: "Último intento", messages: 1, interval: "5 días", active: false, recovered: 3 },
  { name: "Descuento urgente", messages: 2, interval: "1 día", active: true, recovered: 11 },
];

const recoveryMessages = [
  { label: "Recordatorio amigable", text: "¡Hola {nombre}! 👋 Vi que hablamos hace unos días sobre {producto}. ¿Sigues interesado/a? Tengo una sorpresa para ti..." },
  { label: "Oferta especial", text: "¡{nombre}! Solo por hoy tenemos un 15% de descuento en {producto}. Es una oferta exclusiva para ti 🎁" },
  { label: "Último intento", text: "Hola {nombre}, quería verificar si aún necesitas {producto}. Si cambias de opinión, aquí estamos. ¡Que tengas excelente día! 😊" },
];

export default function Recovery() {
  return (
    <DashboardLayout title="Recuperación de ventas">
      <div className="space-y-6 animate-fade-in">
        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <div key={i} className="ventrix-metric">
              <m.icon className={`w-5 h-5 ${m.color} mb-3`} />
              <p className="text-2xl font-display font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cold leads */}
          <div className="lg:col-span-2 ventrix-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold">Leads fríos y oportunidades perdidas</h3>
              <button className="ventrix-btn-primary h-8 px-3 text-xs flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> Reactivar seleccionados</button>
            </div>
            <table className="ventrix-table">
              <thead><tr><th>Lead</th><th>Sin contacto</th><th>Razón</th><th>Segmento</th><th>Estado</th></tr></thead>
              <tbody>
                {coldLeads.map((l, i) => (
                  <tr key={i}>
                    <td className="font-medium text-sm">{l.name}</td>
                    <td className="text-xs text-muted-foreground">{l.lastContact}</td>
                    <td className="text-xs">{l.reason}</td>
                    <td><span className="ventrix-badge ventrix-badge-info text-[10px]">{l.segment}</span></td>
                    <td>{l.reactivable
                      ? <span className="ventrix-badge ventrix-badge-success text-[10px]">Reactivable</span>
                      : <span className="ventrix-badge ventrix-badge-danger text-[10px]">Difícil</span>
                    }</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Stats */}
          <div className="space-y-5">
            <div className="ventrix-card p-5">
              <h3 className="font-display font-semibold mb-4">Métricas de reactivación</h3>
              <div className="space-y-4">
                {[
                  { label: "Recuperados", value: "34", pct: 24, color: "bg-primary" },
                  { label: "Respondieron", value: "52", pct: 36, color: "bg-info" },
                  { label: "No respondieron", value: "67", pct: 47, color: "bg-muted-foreground" },
                  { label: "Reabiertos", value: "18", pct: 13, color: "bg-warning" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className="font-medium">{s.value}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-muted">
                      <div className={`h-full rounded-full ${s.color}`} style={{width:`${s.pct}%`}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ventrix-card p-5">
              <h3 className="font-display font-semibold mb-3">Campañas activas</h3>
              <div className="space-y-2">
                {[
                  { name: "Reactivación Marzo", leads: 45, recovered: 12 },
                  { name: "Oferta Flash", leads: 23, recovered: 8 },
                ].map((c, i) => (
                  <div key={i} className="bg-muted/30 rounded-lg p-3">
                    <p className="text-sm font-medium">{c.name}</p>
                    <div className="flex gap-4 mt-1">
                      <span className="text-[10px] text-muted-foreground">{c.leads} leads</span>
                      <span className="text-[10px] text-primary font-medium">{c.recovered} recuperados</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sequences */}
        <div className="ventrix-card p-5">
          <h3 className="font-display font-semibold mb-4">Secuencias de seguimiento</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sequences.map((s, i) => (
              <div key={i} className="border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className={`ventrix-badge ${s.active ? "ventrix-badge-success" : "ventrix-badge-danger"} text-[10px]`}>
                    {s.active ? "Activa" : "Pausada"}
                  </span>
                  <Send className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <p className="font-medium text-sm mb-2">{s.name}</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>{s.messages} mensajes · cada {s.interval}</p>
                  <p className="text-primary font-medium">{s.recovered} recuperados</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recovery messages */}
        <div className="ventrix-card p-5">
          <h3 className="font-display font-semibold mb-4">Mensajes de recuperación</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {recoveryMessages.map((m, i) => (
              <div key={i} className="bg-muted/30 rounded-lg p-4">
                <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">{m.label}</p>
                <p className="text-sm leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
