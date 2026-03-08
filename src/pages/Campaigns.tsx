import { DashboardLayout } from "@/components/DashboardLayout";
import { Plus, Send, Users, BarChart3, Clock, CheckCircle2, Pause, Play } from "lucide-react";

const campaigns = [
  { name: "Reactivación Marzo", type: "Recuperación", audience: "Leads fríos >5 días", status: "Activa", sent: 234, responded: 89, recovered: 34, revenue: "$12,400", date: "1 Mar 2026" },
  { name: "Oferta Flash Weekend", type: "Oferta especial", audience: "Leads interesados", status: "Activa", sent: 156, responded: 67, recovered: 23, revenue: "$8,200", date: "5 Mar 2026" },
  { name: "Follow-up Febrero", type: "Seguimiento", audience: "Sin respuesta 3d", status: "Completada", sent: 312, responded: 134, recovered: 45, revenue: "$16,800", date: "15 Feb 2026" },
  { name: "Descuento Exclusivo", type: "Descuento", audience: "Objeción de precio", status: "Pausada", sent: 89, responded: 28, recovered: 11, revenue: "$4,100", date: "20 Feb 2026" },
  { name: "Cierre de Mes", type: "Urgencia", audience: "Pipeline caliente", status: "Borrador", sent: 0, responded: 0, recovered: 0, revenue: "$0", date: "—" },
];

const statusStyles: Record<string, string> = {
  "Activa": "ventrix-badge-success",
  "Completada": "ventrix-badge-info",
  "Pausada": "ventrix-badge-warning",
  "Borrador": "ventrix-badge-danger",
};

export default function Campaigns() {
  return (
    <DashboardLayout title="Campañas">
      <div className="space-y-6 animate-fade-in">
        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Campañas activas", value: "2", icon: Play },
            { label: "Mensajes enviados", value: "791", icon: Send },
            { label: "Leads alcanzados", value: "523", icon: Users },
            { label: "Ingresos recuperados", value: "$41,500", icon: BarChart3 },
          ].map((m, i) => (
            <div key={i} className="ventrix-metric">
              <m.icon className="w-5 h-5 text-primary mb-3" />
              <p className="text-2xl font-display font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold">Todas las campañas</h3>
          <button className="ventrix-btn-primary h-9 px-4 text-xs flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Nueva campaña</button>
        </div>

        {/* Table */}
        <div className="ventrix-card overflow-hidden">
          <table className="ventrix-table">
            <thead>
              <tr><th>Campaña</th><th>Tipo</th><th>Audiencia</th><th>Estado</th><th>Enviados</th><th>Respondieron</th><th>Recuperados</th><th>Ingresos</th><th>Fecha</th></tr>
            </thead>
            <tbody>
              {campaigns.map((c, i) => (
                <tr key={i} className="cursor-pointer">
                  <td className="font-medium text-sm">{c.name}</td>
                  <td><span className="ventrix-badge ventrix-badge-info text-[10px]">{c.type}</span></td>
                  <td className="text-xs text-muted-foreground">{c.audience}</td>
                  <td><span className={`ventrix-badge ${statusStyles[c.status]} text-[10px]`}>{c.status}</span></td>
                  <td className="text-xs">{c.sent}</td>
                  <td className="text-xs">{c.responded}</td>
                  <td className="text-xs font-medium text-primary">{c.recovered}</td>
                  <td className="text-sm font-semibold">{c.revenue}</td>
                  <td className="text-xs text-muted-foreground">{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Campaign editor mock */}
        <div className="ventrix-card p-6">
          <h3 className="font-display font-semibold mb-5">Editor de campaña — Cierre de Mes</h3>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nombre</label>
                <input className="ventrix-input text-sm" defaultValue="Cierre de Mes" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tipo de campaña</label>
                <select className="ventrix-input text-sm">
                  <option>Urgencia</option><option>Recuperación</option><option>Oferta especial</option><option>Seguimiento</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Audiencia</label>
                <select className="ventrix-input text-sm">
                  <option>Pipeline caliente (score &gt; 70)</option>
                  <option>Leads fríos (&gt;5 días)</option>
                  <option>Sin respuesta (&gt;3 días)</option>
                  <option>Todos los leads activos</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Programación</label>
                <input type="date" className="ventrix-input text-sm" defaultValue="2026-03-10" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Mensaje</label>
              <textarea className="ventrix-input h-40 py-3 resize-none text-sm" defaultValue={"¡Hola {nombre}! 🔥\n\nEs el último día del mes y tenemos una oferta especial solo para ti.\n\n{producto} con 20% de descuento, solo hasta hoy a las 11:59 PM.\n\n¿Te lo aparto? 🚀"} />
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-muted-foreground">Variables: {"{nombre}"}, {"{producto}"}, {"{precio}"}</span>
                <button className="ventrix-btn-primary h-8 px-4 text-xs">Guardar y lanzar</button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="ventrix-card p-5">
          <h3 className="font-display font-semibold mb-4">Resultados — Reactivación Marzo</h3>
          <div className="grid grid-cols-5 gap-4 text-center">
            {[
              { label: "Enviados", value: "234" },
              { label: "Entregados", value: "228 (97%)" },
              { label: "Leídos", value: "189 (83%)" },
              { label: "Respondieron", value: "89 (39%)" },
              { label: "Recuperados", value: "34 (15%)" },
            ].map((r, i) => (
              <div key={i}>
                <p className="text-xl font-display font-bold">{r.value}</p>
                <p className="text-[10px] text-muted-foreground">{r.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 h-2 rounded-full bg-muted flex overflow-hidden">
            <div className="bg-primary" style={{width:"97%"}} />
          </div>
          <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
            <span>■ Entregados 97%</span><span>■ Leídos 83%</span><span>■ Respondieron 39%</span><span>■ Recuperados 15%</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
