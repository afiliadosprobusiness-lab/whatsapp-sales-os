import { DashboardLayout } from "@/components/DashboardLayout";
import { BarChart3, Download, Calendar, TrendingUp, DollarSign, Users, Target, ArrowUpRight } from "lucide-react";

const kpis = [
  { label: "Ingresos totales", value: "$124,800", change: "+18%", icon: DollarSign },
  { label: "Ventas recuperadas", value: "$48,320", change: "+34%", icon: TrendingUp },
  { label: "Tasa de conversión", value: "31.4%", change: "+5%", icon: Target },
  { label: "Leads convertidos", value: "156", change: "+22", icon: Users },
];

const monthlyData = [
  { month: "Oct 2025", revenue: "$82,400", recovered: "$28,100", conversion: "24%", closed: 98 },
  { month: "Nov 2025", revenue: "$91,200", recovered: "$34,500", conversion: "27%", closed: 112 },
  { month: "Dic 2025", revenue: "$105,600", recovered: "$38,200", conversion: "29%", closed: 134 },
  { month: "Ene 2026", revenue: "$98,400", recovered: "$36,800", conversion: "28%", closed: 121 },
  { month: "Feb 2026", revenue: "$112,300", recovered: "$42,100", conversion: "30%", closed: 143 },
  { month: "Mar 2026", revenue: "$124,800", recovered: "$48,320", conversion: "31%", closed: 156 },
];

const topCampaigns = [
  { name: "Reactivación Marzo", recovered: "$12,400", leads: 34, rate: "38%" },
  { name: "Oferta Flash Weekend", recovered: "$8,200", leads: 23, rate: "35%" },
  { name: "Follow-up Febrero", recovered: "$16,800", leads: 45, rate: "32%" },
  { name: "Descuento Exclusivo", recovered: "$4,100", leads: 11, rate: "28%" },
];

const segmentPerformance = [
  { name: "E-commerce COD", closed: 52, revenue: "$42,300", pct: 34 },
  { name: "WhatsApp directo", closed: 41, revenue: "$36,400", pct: 29 },
  { name: "Referidos", closed: 28, revenue: "$21,200", pct: 17 },
  { name: "Instagram Ads", closed: 22, revenue: "$18,600", pct: 15 },
  { name: "Facebook Ads", closed: 13, revenue: "$6,300", pct: 5 },
];

export default function RevenueReports() {
  return (
    <DashboardLayout title="Revenue Reports">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="ventrix-btn-secondary h-8 px-3 text-xs flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Mar 2026
            </button>
            {["7d", "30d", "90d", "12m"].map(p => (
              <button key={p} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                p === "30d" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}>{p}</button>
            ))}
          </div>
          <button className="ventrix-btn-secondary h-8 px-3 text-xs flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Exportar reporte
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((m, i) => (
            <div key={i} className="ventrix-metric">
              <div className="flex items-center justify-between mb-3">
                <m.icon className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium text-primary flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />{m.change}
                </span>
              </div>
              <p className="text-2xl font-display font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="ventrix-card p-6">
          <h3 className="font-display font-semibold mb-5">Ingresos por mes</h3>
          <div className="h-52 flex items-end gap-4">
            {monthlyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-medium">{d.revenue}</span>
                <div className="w-full flex flex-col gap-1">
                  <div className="rounded-t-md bg-primary" style={{height: `${parseInt(d.revenue.replace(/[$,]/g, "")) / 1500}px`}} />
                  <div className="rounded-b-md bg-primary/30" style={{height: `${parseInt(d.recovered.replace(/[$,]/g, "")) / 1500}px`}} />
                </div>
                <span className="text-[10px] text-muted-foreground">{d.month.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Monthly table */}
          <div className="ventrix-card p-5">
            <h3 className="font-display font-semibold mb-4">Rendimiento mensual</h3>
            <table className="ventrix-table">
              <thead><tr><th>Mes</th><th>Ingresos</th><th>Recuperados</th><th>Conversión</th><th>Cierres</th></tr></thead>
              <tbody>
                {monthlyData.map((d, i) => (
                  <tr key={i}>
                    <td className="text-xs font-medium">{d.month}</td>
                    <td className="text-sm font-semibold">{d.revenue}</td>
                    <td className="text-xs text-primary font-medium">{d.recovered}</td>
                    <td className="text-xs">{d.conversion}</td>
                    <td className="text-xs">{d.closed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top campaigns */}
          <div className="ventrix-card p-5">
            <h3 className="font-display font-semibold mb-4">Campañas que más recuperaron</h3>
            <div className="space-y-3">
              {topCampaigns.map((c, i) => (
                <div key={i} className="flex items-center gap-4 py-2 border-b last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">#{i+1}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground">{c.leads} leads · {c.rate} conversión</p>
                  </div>
                  <span className="text-sm font-display font-bold text-primary">{c.recovered}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Segment performance */}
        <div className="ventrix-card p-5">
          <h3 className="font-display font-semibold mb-4">Cierres por segmento</h3>
          <div className="space-y-3">
            {segmentPerformance.map((s, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-sm font-medium w-40">{s.name}</span>
                <div className="flex-1 h-6 rounded-full bg-muted overflow-hidden relative">
                  <div className="h-full rounded-full bg-primary flex items-center justify-end pr-2" style={{width:`${s.pct}%`, minWidth: '40px'}}>
                    <span className="text-[10px] font-medium text-primary-foreground">{s.pct}%</span>
                  </div>
                </div>
                <span className="text-sm font-semibold w-24 text-right">{s.revenue}</span>
                <span className="text-xs text-muted-foreground w-20 text-right">{s.closed} cierres</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
