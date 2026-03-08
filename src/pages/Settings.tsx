import { DashboardLayout } from "@/components/DashboardLayout";
import { User, Building, Palette, Users, Shield, Zap, Bell, CreditCard, Link2, Settings as SettingsIcon } from "lucide-react";

const tabs = [
  { label: "Perfil", icon: Building },
  { label: "Usuarios", icon: Users },
  { label: "Automatizaciones", icon: Zap },
  { label: "Notificaciones", icon: Bell },
  { label: "Facturación", icon: CreditCard },
  { label: "Integraciones", icon: Link2 },
];

const teamMembers = [
  { name: "María Rodríguez", email: "maria@tienda.co", role: "Admin", status: "Activo" },
  { name: "Carlos López", email: "carlos@tienda.co", role: "Vendedor", status: "Activo" },
  { name: "Ana Martínez", email: "ana@tienda.co", role: "Vendedor", status: "Activo" },
  { name: "Pedro Gómez", email: "pedro@tienda.co", role: "Viewer", status: "Invitado" },
];

const integrations = [
  { name: "WhatsApp Business API", status: "Conectado", desc: "Canal principal de comunicación" },
  { name: "Shopify", status: "Disponible", desc: "Sincroniza pedidos y clientes" },
  { name: "WooCommerce", status: "Disponible", desc: "Importa pedidos automáticamente" },
  { name: "Google Sheets", status: "Disponible", desc: "Exporta datos en tiempo real" },
  { name: "Zapier", status: "Próximamente", desc: "Conecta con 5,000+ apps" },
  { name: "Meta Ads", status: "Disponible", desc: "Importa leads de campañas" },
];

export default function Settings() {
  return (
    <DashboardLayout title="Configuración">
      <div className="flex gap-6 animate-fade-in">
        {/* Sidebar tabs */}
        <div className="w-48 flex-shrink-0 space-y-1">
          {tabs.map((t, i) => (
            <button key={i} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              i === 0 ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-muted"
            }`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6 max-w-3xl">
          {/* Business profile */}
          <div className="ventrix-card p-6">
            <h3 className="font-display font-semibold mb-5">Perfil del negocio</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nombre del negocio</label>
                <input className="ventrix-input text-sm" defaultValue="Mi Tienda Online" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Industria</label>
                <select className="ventrix-input text-sm">
                  <option>E-commerce</option><option>Servicios</option><option>Retail</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">País</label>
                <select className="ventrix-input text-sm">
                  <option>México</option><option>Colombia</option><option>Chile</option><option>Argentina</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Zona horaria</label>
                <select className="ventrix-input text-sm">
                  <option>América/México City (UTC-6)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Descripción</label>
                <textarea className="ventrix-input h-20 py-2 resize-none text-sm" defaultValue="Tienda en línea de productos premium con envío a todo México. Ventas principalmente por WhatsApp." />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="ventrix-btn-primary h-9 px-5 text-sm">Guardar cambios</button>
            </div>
          </div>

          {/* Branding */}
          <div className="ventrix-card p-6">
            <h3 className="font-display font-semibold mb-5 flex items-center gap-2"><Palette className="w-4 h-4" /> Branding</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Logo</label>
                <div className="border-dashed border-2 rounded-lg p-6 text-center">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Building className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Arrastra o haz clic para subir</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Color principal</label>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary border" />
                    <input className="ventrix-input text-sm flex-1" defaultValue="#0d7a4f" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nombre visible</label>
                  <input className="ventrix-input text-sm" defaultValue="Mi Tienda Online" />
                </div>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="ventrix-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold flex items-center gap-2"><Users className="w-4 h-4" /> Equipo</h3>
              <button className="ventrix-btn-primary h-8 px-3 text-xs">Invitar usuario</button>
            </div>
            <table className="ventrix-table">
              <thead><tr><th>Usuario</th><th>Rol</th><th>Estado</th><th></th></tr></thead>
              <tbody>
                {teamMembers.map((m, i) => (
                  <tr key={i}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                          {m.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{m.name}</p>
                          <p className="text-[10px] text-muted-foreground">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`ventrix-badge ${m.role === "Admin" ? "ventrix-badge-success" : "ventrix-badge-info"} text-[10px]`}>{m.role}</span>
                    </td>
                    <td className="text-xs text-muted-foreground">{m.status}</td>
                    <td><button className="text-xs text-muted-foreground hover:text-foreground">Editar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Automations */}
          <div className="ventrix-card p-6">
            <h3 className="font-display font-semibold mb-5 flex items-center gap-2"><Zap className="w-4 h-4" /> Automatizaciones</h3>
            <div className="space-y-3">
              {[
                { label: "Follow-up automático después de 24h sin respuesta", active: true },
                { label: "Notificar cuando un lead caliente no tiene seguimiento", active: true },
                { label: "Asignar nuevos leads al asesor con menos carga", active: false },
                { label: "Enviar resumen diario de actividad comercial", active: true },
                { label: "Detectar y marcar conversaciones abandonadas", active: true },
                { label: "Escalar leads de alto valor automáticamente", active: false },
              ].map((a, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm">{a.label}</span>
                  <div className={`w-9 h-5 rounded-full flex items-center cursor-pointer transition-colors ${a.active ? "bg-primary justify-end" : "bg-muted justify-start"}`}>
                    <div className="w-4 h-4 rounded-full bg-card shadow-sm mx-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="ventrix-card p-6">
            <h3 className="font-display font-semibold mb-5 flex items-center gap-2"><Bell className="w-4 h-4" /> Notificaciones</h3>
            <div className="space-y-3">
              {[
                { label: "Nuevo lead recibido", email: true, push: true },
                { label: "Lead recuperado", email: true, push: true },
                { label: "Conversación abandonada", email: false, push: true },
                { label: "Reporte semanal", email: true, push: false },
                { label: "Campaña completada", email: true, push: true },
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm">{n.label}</span>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <input type="checkbox" defaultChecked={n.email} className="rounded" /> Email
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <input type="checkbox" defaultChecked={n.push} className="rounded" /> Push
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Billing */}
          <div className="ventrix-card p-6">
            <h3 className="font-display font-semibold mb-5 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Facturación</h3>
            <div className="bg-accent rounded-xl p-5 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Plan Pro</p>
                  <p className="text-xs text-muted-foreground">Hasta 5,000 leads · 3 usuarios · Todos los módulos</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-display font-bold">$99 <span className="text-sm font-normal text-muted-foreground">USD/mes</span></p>
                  <p className="text-xs text-muted-foreground">Próxima factura: 1 Abr 2026</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="ventrix-btn-primary h-9 px-4 text-xs">Cambiar plan</button>
              <button className="ventrix-btn-secondary h-9 px-4 text-xs">Historial de pagos</button>
              <button className="ventrix-btn-secondary h-9 px-4 text-xs">Descargar facturas</button>
            </div>
          </div>

          {/* Integrations */}
          <div className="ventrix-card p-6">
            <h3 className="font-display font-semibold mb-5 flex items-center gap-2"><Link2 className="w-4 h-4" /> Integraciones</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {integrations.map((int, i) => (
                <div key={i} className="border rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Link2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{int.name}</p>
                    <p className="text-[10px] text-muted-foreground">{int.desc}</p>
                  </div>
                  <span className={`ventrix-badge text-[10px] ${
                    int.status === "Conectado" ? "ventrix-badge-success" :
                    int.status === "Disponible" ? "ventrix-badge-info" : "ventrix-badge-warning"
                  }`}>{int.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
