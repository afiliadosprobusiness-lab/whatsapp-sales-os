import { DashboardLayout } from "@/components/DashboardLayout";
import { Search, Filter, ChevronDown, MoreHorizontal, Phone, Mail, MessageSquare, X } from "lucide-react";
import { useState } from "react";

const leads = [
  { name: "Ana García", email: "ana@gmail.com", phone: "+52 55 1234 5678", status: "Interesado", priority: "Alta", score: 92, prob: 88, lastContact: "Hace 2h", assigned: "María R.", value: "$3,200" },
  { name: "Pedro Martínez", email: "pedro@hotmail.com", phone: "+52 33 9876 5432", status: "Contactado", priority: "Alta", score: 87, prob: 75, lastContact: "Hace 5h", assigned: "Carlos L.", value: "$2,800" },
  { name: "Laura Sánchez", email: "laura@empresa.co", phone: "+57 310 456 7890", status: "Nuevo", priority: "Media", score: 78, prob: 62, lastContact: "Hace 1d", assigned: "Sin asignar", value: "$1,500" },
  { name: "Carlos Mendoza", email: "carlos.m@gmail.com", phone: "+52 81 2345 6789", status: "Seguimiento", priority: "Media", score: 65, prob: 55, lastContact: "Hace 2d", assigned: "María R.", value: "$4,100" },
  { name: "Diana López", email: "diana@tienda.mx", phone: "+52 55 8765 4321", status: "Nuevo", priority: "Baja", score: 45, prob: 30, lastContact: "Hace 3d", assigned: "Sin asignar", value: "$900" },
  { name: "Roberto Díaz", email: "roberto@negocio.com", phone: "+52 33 1122 3344", status: "Cerrado", priority: "Alta", score: 95, prob: 100, lastContact: "Hoy", assigned: "Carlos L.", value: "$5,600" },
  { name: "Fernanda Ruiz", email: "fer.ruiz@outlook.com", phone: "+57 300 111 2233", status: "Perdido", priority: "Media", score: 32, prob: 10, lastContact: "Hace 7d", assigned: "María R.", value: "$2,100" },
  { name: "Miguel Torres", email: "miguel@startup.io", phone: "+52 55 9988 7766", status: "Interesado", priority: "Alta", score: 84, prob: 72, lastContact: "Hace 4h", assigned: "Carlos L.", value: "$3,800" },
];

const pipelineStages = [
  { name: "Nuevo", count: 12, color: "bg-info" },
  { name: "Contactado", count: 8, color: "bg-primary" },
  { name: "Interesado", count: 15, color: "bg-warning" },
  { name: "Seguimiento", count: 6, color: "bg-accent-foreground" },
  { name: "Cerrado", count: 23, color: "bg-primary" },
  { name: "Perdido", count: 4, color: "bg-destructive" },
];

const statusColors: Record<string, string> = {
  "Nuevo": "ventrix-badge-info",
  "Contactado": "ventrix-badge-success",
  "Interesado": "ventrix-badge-warning",
  "Seguimiento": "ventrix-badge-info",
  "Cerrado": "ventrix-badge-success",
  "Perdido": "ventrix-badge-danger",
};

export default function Leads() {
  const [selectedLead, setSelectedLead] = useState<typeof leads[0] | null>(null);

  return (
    <DashboardLayout title="Leads">
      <div className="space-y-6 animate-fade-in">
        {/* Pipeline */}
        <div className="grid grid-cols-6 gap-3">
          {pipelineStages.map((s, i) => (
            <div key={i} className="ventrix-card p-4 text-center cursor-pointer hover:border-primary/30 transition-colors">
              <div className={`w-2 h-2 rounded-full ${s.color} mx-auto mb-2`} />
              <p className="text-lg font-display font-bold">{s.count}</p>
              <p className="text-[10px] text-muted-foreground">{s.name}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input placeholder="Buscar leads..." className="ventrix-input pl-9 text-sm" />
          </div>
          <button className="ventrix-btn-secondary h-9 px-3 text-xs flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Filtros <ChevronDown className="w-3 h-3" />
          </button>
          {["Todos", "Nuevos", "Calientes", "Sin asignar"].map(f => (
            <button key={f} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              f === "Todos" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}>{f}</button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Table */}
          <div className="flex-1 ventrix-card overflow-hidden">
            <table className="ventrix-table">
              <thead>
                <tr>
                  <th>Lead</th><th>Estado</th><th>Prioridad</th><th>Score</th><th>Prob. cierre</th><th>Último contacto</th><th>Asesor</th><th>Valor</th><th></th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l, i) => (
                  <tr key={i} className="cursor-pointer" onClick={() => setSelectedLead(l)}>
                    <td>
                      <div>
                        <p className="font-medium text-sm">{l.name}</p>
                        <p className="text-[10px] text-muted-foreground">{l.email}</p>
                      </div>
                    </td>
                    <td><span className={`ventrix-badge ${statusColors[l.status]}`}>{l.status}</span></td>
                    <td><span className={`text-xs font-medium ${
                      l.priority === "Alta" ? "text-destructive" : l.priority === "Media" ? "text-warning" : "text-muted-foreground"
                    }`}>{l.priority}</span></td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <div className="w-8 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{width:`${l.score}%`}} />
                        </div>
                        <span className="text-xs">{l.score}</span>
                      </div>
                    </td>
                    <td><span className="text-xs font-medium">{l.prob}%</span></td>
                    <td><span className="text-xs text-muted-foreground">{l.lastContact}</span></td>
                    <td><span className="text-xs">{l.assigned}</span></td>
                    <td><span className="text-sm font-semibold">{l.value}</span></td>
                    <td><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detail panel */}
          {selectedLead && (
            <div className="w-80 ventrix-card p-5 flex-shrink-0 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold">Detalle del lead</h3>
                <button onClick={() => setSelectedLead(null)}><X className="w-4 h-4 text-muted-foreground" /></button>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 text-lg font-semibold text-primary">
                  {selectedLead.name.split(" ").map(n => n[0]).join("")}
                </div>
                <p className="font-display font-semibold">{selectedLead.name}</p>
                <p className="text-xs text-muted-foreground">{selectedLead.email}</p>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 ventrix-btn-secondary h-8 text-xs flex items-center justify-center gap-1"><Phone className="w-3 h-3" />Llamar</button>
                <button className="flex-1 ventrix-btn-secondary h-8 text-xs flex items-center justify-center gap-1"><Mail className="w-3 h-3" />Email</button>
                <button className="flex-1 ventrix-btn-primary h-8 text-xs flex items-center justify-center gap-1"><MessageSquare className="w-3 h-3" />Chat</button>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  { label: "Estado", value: selectedLead.status },
                  { label: "Prioridad", value: selectedLead.priority },
                  { label: "Score", value: String(selectedLead.score) },
                  { label: "Prob. cierre", value: `${selectedLead.prob}%` },
                  { label: "Valor estimado", value: selectedLead.value },
                  { label: "Asesor", value: selectedLead.assigned },
                  { label: "Último contacto", value: selectedLead.lastContact },
                ].map((f, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-xs text-muted-foreground">{f.label}</span>
                    <span className="text-xs font-medium">{f.value}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-medium mb-2">Timeline</p>
                <div className="space-y-2">
                  {[
                    { text: "Primer contacto por WhatsApp", time: "Hace 3 días" },
                    { text: "Respuesta recibida — interesado", time: "Hace 2 días" },
                    { text: "Follow-up enviado", time: "Hace 1 día" },
                    { text: "Esperando respuesta", time: "Ahora" },
                  ].map((t, i) => (
                    <div key={i} className="flex gap-2 text-xs">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-primary mt-1" />
                        {i < 3 && <div className="w-px flex-1 bg-border mt-1" />}
                      </div>
                      <div className="pb-2">
                        <p>{t.text}</p>
                        <p className="text-muted-foreground">{t.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium mb-2">Notas</p>
                <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
                  Cliente interesado en plan premium. Preguntó por descuento por volumen. Dar seguimiento el viernes.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
