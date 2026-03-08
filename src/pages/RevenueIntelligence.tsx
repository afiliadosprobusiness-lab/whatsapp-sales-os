import { DashboardLayout } from "@/components/DashboardLayout";
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, Zap, Users, Target, BarChart3, ArrowUpRight } from "lucide-react";

const kpis = [
  { label: "Ingresos estimados", value: "$124,800", change: "+18%", up: true, icon: DollarSign },
  { label: "Ingresos recuperados", value: "$48,320", change: "+34%", up: true, icon: TrendingUp },
  { label: "Pérdidas potenciales", value: "$23,100", change: "-8%", up: false, icon: TrendingDown },
  { label: "Oportunidades activas", value: "68", change: "+12", up: true, icon: Target },
];

const insights = [
  { type: "opportunity", title: "Segmento e-commerce COD tiene 42% más conversión", desc: "Los leads de este segmento cierran más rápido y con tickets más altos. Considera priorizar campañas para este público.", impact: "+$12,400" },
  { type: "bottleneck", title: "23% de leads se pierden entre 'Contactado' e 'Interesado'", desc: "El follow-up entre estos estados toma en promedio 3.2 días. Reducir a 1 día podría aumentar conversión en 15%.", impact: "+$8,200" },
  { type: "pattern", title: "Leads que responden antes de 2h tienen 3x más probabilidad de compra", desc: "Tu tiempo promedio de respuesta es 4.5 horas. Las respuestas rápidas podrían generar $18,000 adicionales al mes.", impact: "+$18,000" },
  { type: "opportunity", title: "Los viernes entre 2-6 PM tienen la mejor tasa de cierre", desc: "Concentrar seguimientos y cierres en este horario podría mejorar tu tasa de conversión en un 20%.", impact: "+$6,800" },
];

const segments = [
  { name: "E-commerce COD", leads: 89, conversion: "38%", revenue: "$42,300", potential: "$15,200", trend: "up" },
  { name: "WhatsApp directo", leads: 124, conversion: "28%", revenue: "$36,400", potential: "$22,100", trend: "up" },
  { name: "Instagram Ads", leads: 67, conversion: "22%", revenue: "$18,600", potential: "$12,800", trend: "stable" },
  { name: "Referidos", leads: 34, conversion: "45%", revenue: "$21,200", potential: "$8,400", trend: "up" },
  { name: "Facebook Ads", leads: 45, conversion: "18%", revenue: "$6,300", potential: "$14,500", trend: "down" },
];

export default function RevenueIntelligence() {
  return (
    <DashboardLayout title="Revenue Intelligence">
      <div className="space-y-6 animate-fade-in">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((m, i) => (
            <div key={i} className="ventrix-metric">
              <div className="flex items-center justify-between mb-3">
                <m.icon className="w-5 h-5 text-primary" />
                <span className={`text-xs font-medium flex items-center gap-0.5 ${m.up ? "text-primary" : "text-destructive"}`}>
                  {m.up ? <ArrowUpRight className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {m.change}
                </span>
              </div>
              <p className="text-2xl font-display font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Revenue chart */}
        <div className="ventrix-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-semibold">Flujo de ingresos</h3>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Ingresos</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning" /> Recuperados</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive/40" /> Pérdidas</span>
            </div>
          </div>
          <div className="h-48 flex items-end gap-3">
            {[
              { rev: 65, rec: 20, loss: 15 },
              { rev: 72, rec: 25, loss: 12 },
              { rev: 68, rec: 22, loss: 18 },
              { rev: 80, rec: 30, loss: 10 },
              { rev: 75, rec: 28, loss: 14 },
              { rev: 85, rec: 35, loss: 8 },
              { rev: 90, rec: 38, loss: 6 },
              { rev: 82, rec: 32, loss: 12 },
              { rev: 88, rec: 36, loss: 9 },
              { rev: 95, rec: 40, loss: 5 },
              { rev: 92, rec: 38, loss: 7 },
              { rev: 100, rec: 42, loss: 4 },
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col gap-0.5">
                <div className="rounded-t bg-primary" style={{height:`${d.rev}%`}} />
                <div className="rounded bg-warning" style={{height:`${d.rec}%`}} />
                <div className="rounded-b bg-destructive/30" style={{height:`${d.loss}%`}} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
            <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Ago</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dic</span>
          </div>
        </div>

        {/* Insights */}
        <div className="ventrix-card p-5">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Insights automáticos</h3>
          <div className="space-y-3">
            {insights.map((ins, i) => (
              <div key={i} className={`border rounded-xl p-4 border-l-2 ${
                ins.type === "opportunity" ? "border-l-primary" : ins.type === "bottleneck" ? "border-l-warning" : "border-l-info"
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">{ins.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{ins.desc}</p>
                  </div>
                  <span className="text-sm font-display font-bold text-primary flex-shrink-0">{ins.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Segments */}
        <div className="ventrix-card p-5">
          <h3 className="font-display font-semibold mb-4">Rendimiento por segmento</h3>
          <table className="ventrix-table">
            <thead><tr><th>Segmento</th><th>Leads</th><th>Conversión</th><th>Ingresos</th><th>Potencial sin capturar</th><th>Tendencia</th></tr></thead>
            <tbody>
              {segments.map((s, i) => (
                <tr key={i}>
                  <td className="font-medium text-sm">{s.name}</td>
                  <td className="text-xs">{s.leads}</td>
                  <td className="text-xs font-medium">{s.conversion}</td>
                  <td className="text-sm font-semibold">{s.revenue}</td>
                  <td className="text-sm font-medium text-warning">{s.potential}</td>
                  <td>
                    {s.trend === "up" ? <TrendingUp className="w-4 h-4 text-primary" /> :
                     s.trend === "down" ? <TrendingDown className="w-4 h-4 text-destructive" /> :
                     <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Executive summary */}
        <div className="ventrix-card p-5 border-l-4 border-l-primary">
          <h3 className="font-display font-semibold mb-2">Resumen ejecutivo</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Este mes tu negocio tiene un potencial de ingresos de <span className="font-semibold text-foreground">$124,800</span>, de los cuales ya recuperaste <span className="font-semibold text-primary">$48,320</span> (+34% vs mes anterior). Las principales oportunidades están en el segmento <span className="font-semibold text-foreground">E-commerce COD</span> y en mejorar los tiempos de respuesta. Hay <span className="font-semibold text-warning">$23,100</span> en pérdidas potenciales que podrías reducir optimizando el follow-up entre las etapas "Contactado" e "Interesado".
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
