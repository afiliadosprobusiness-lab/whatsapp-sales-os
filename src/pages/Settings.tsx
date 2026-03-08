import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { toast } from "@/components/ui/sonner";
import workspaceService, {
  type UpdateWorkspaceRequest,
  type Workspace,
  workspaceQueryKeys,
  workspaceServiceErrors,
} from "@/services/workspace.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building, Palette, Users, Zap, Bell, CreditCard, Link2 } from "lucide-react";

const tabs = [
  { label: "Perfil", icon: Building },
  { label: "Usuarios", icon: Users },
  { label: "Automatizaciones", icon: Zap },
  { label: "Notificaciones", icon: Bell },
  { label: "Facturacion", icon: CreditCard },
  { label: "Integraciones", icon: Link2 },
];

const teamMembers = [
  { name: "Maria Rodriguez", email: "maria@tienda.co", role: "Admin", status: "Activo" },
  { name: "Carlos Lopez", email: "carlos@tienda.co", role: "Vendedor", status: "Activo" },
  { name: "Ana Martinez", email: "ana@tienda.co", role: "Vendedor", status: "Activo" },
  { name: "Pedro Gomez", email: "pedro@tienda.co", role: "Viewer", status: "Invitado" },
];

const integrations = [
  { name: "WhatsApp Business API", status: "Conectado", desc: "Canal principal de comunicacion" },
  { name: "Shopify", status: "Disponible", desc: "Sincroniza pedidos y clientes" },
  { name: "WooCommerce", status: "Disponible", desc: "Importa pedidos automaticamente" },
  { name: "Google Sheets", status: "Disponible", desc: "Exporta datos en tiempo real" },
  { name: "Zapier", status: "Proximamente", desc: "Conecta con 5,000+ apps" },
  { name: "Meta Ads", status: "Disponible", desc: "Importa leads de campanas" },
];

const industryOptions = ["E-commerce", "Servicios", "Retail"] as const;
const countryOptions = ["Mexico", "Colombia", "Chile", "Argentina"] as const;
const timezoneOptions = [
  "America/Mexico_City (UTC-6)",
  "America/Bogota (UTC-5)",
  "America/Lima (UTC-5)",
  "America/Santiago (UTC-4)",
] as const;

interface WorkspaceProfileFormState {
  name: string;
  industry: string;
  country: string;
  timezone: string;
  description: string;
}

const EMPTY_PROFILE_FORM: WorkspaceProfileFormState = {
  name: "",
  industry: "",
  country: "",
  timezone: "",
  description: "",
};

const toProfileFormState = (workspace: Workspace): WorkspaceProfileFormState => ({
  name: workspace.name ?? "",
  industry: workspace.industry ?? "",
  country: workspace.country ?? "",
  timezone: workspace.timezone ?? "",
  description: workspace.description ?? "",
});

const withCurrentOption = (value: string, options: readonly string[]) => {
  if (!value.trim()) {
    return options;
  }

  return options.includes(value) ? options : [value, ...options];
};

export default function Settings() {
  const queryClient = useQueryClient();
  const [profileForm, setProfileForm] = useState<WorkspaceProfileFormState>(EMPTY_PROFILE_FORM);

  const workspaceQuery = useQuery({
    queryKey: workspaceQueryKeys.me(),
    queryFn: () => workspaceService.me(),
    retry: false,
  });

  const saveWorkspaceMutation = useMutation({
    mutationFn: (payload: UpdateWorkspaceRequest) => workspaceService.updateMe(payload),
    onSuccess: (updatedWorkspace) => {
      queryClient.setQueryData(workspaceQueryKeys.me(), updatedWorkspace);
      toast.success("Cambios guardados correctamente.");
    },
    onError: (error) => {
      toast.error(workspaceServiceErrors.getMessage(error, "No pudimos guardar los cambios del negocio."));
    },
  });

  useEffect(() => {
    if (!workspaceQuery.data) {
      return;
    }

    setProfileForm(toProfileFormState(workspaceQuery.data));
  }, [workspaceQuery.data]);

  const industrySelectOptions = useMemo(
    () => withCurrentOption(profileForm.industry, industryOptions),
    [profileForm.industry],
  );

  const countrySelectOptions = useMemo(
    () => withCurrentOption(profileForm.country, countryOptions),
    [profileForm.country],
  );

  const timezoneSelectOptions = useMemo(
    () => withCurrentOption(profileForm.timezone, timezoneOptions),
    [profileForm.timezone],
  );

  const handleProfileFieldChange =
    (field: keyof WorkspaceProfileFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const nextValue = event.target.value;
      setProfileForm((prev) => ({ ...prev, [field]: nextValue }));
    };

  const handleSubmitWorkspaceProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!workspaceQuery.data) {
      return;
    }

    const normalizedName = profileForm.name.trim();
    if (normalizedName.length === 0) {
      toast.error("El nombre del negocio es obligatorio.");
      return;
    }

    saveWorkspaceMutation.mutate({
      name: normalizedName,
      industry: profileForm.industry,
      country: profileForm.country,
      timezone: profileForm.timezone,
      description: profileForm.description,
    });
  };

  const isWorkspaceLoading = workspaceQuery.isLoading;
  const isWorkspaceError = workspaceQuery.isError;
  const workspace = workspaceQuery.data;

  return (
    <DashboardLayout title="Configuracion">
      <div className="flex gap-6 animate-fade-in">
        {/* Sidebar tabs */}
        <div className="w-48 flex-shrink-0 space-y-1">
          {tabs.map((t, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                i === 0 ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6 max-w-3xl">
          {/* Business profile */}
          <div className="ventrix-card p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="font-display font-semibold">Perfil del negocio</h3>
              {workspaceQuery.isFetching && !isWorkspaceLoading ? (
                <span className="text-xs text-muted-foreground">Actualizando...</span>
              ) : null}
            </div>

            {isWorkspaceLoading ? (
              <div className="space-y-3 animate-pulse" aria-live="polite">
                <div className="h-9 rounded-md bg-muted" />
                <div className="h-9 rounded-md bg-muted" />
                <div className="h-9 rounded-md bg-muted" />
                <div className="h-20 rounded-md bg-muted" />
                <div className="flex justify-end">
                  <div className="h-9 w-36 rounded-md bg-muted" />
                </div>
              </div>
            ) : null}

            {isWorkspaceError ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4" role="alert">
                <p className="text-sm font-medium text-destructive">No pudimos cargar la configuracion del negocio.</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {workspaceServiceErrors.getMessage(workspaceQuery.error, "Ocurrio un error inesperado.")}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    void workspaceQuery.refetch();
                  }}
                  className="mt-3 ventrix-btn-secondary h-8 px-3 text-xs"
                >
                  Reintentar
                </button>
              </div>
            ) : null}

            {!isWorkspaceLoading && !isWorkspaceError && !workspace ? (
              <div className="rounded-xl border border-border p-4">
                <p className="text-sm font-medium">No hay un workspace activo para esta sesion.</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Verifica tu sesion actual y vuelve a cargar para continuar.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    void workspaceQuery.refetch();
                  }}
                  className="mt-3 ventrix-btn-secondary h-8 px-3 text-xs"
                >
                  Volver a intentar
                </button>
              </div>
            ) : null}

            {!isWorkspaceLoading && !isWorkspaceError && workspace ? (
              <form onSubmit={handleSubmitWorkspaceProfile} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nombre del negocio</label>
                    <input
                      className="ventrix-input text-sm"
                      value={profileForm.name}
                      onChange={handleProfileFieldChange("name")}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Industria</label>
                    <select
                      className="ventrix-input text-sm"
                      value={profileForm.industry}
                      onChange={handleProfileFieldChange("industry")}
                    >
                      <option value="">Seleccionar industria</option>
                      {industrySelectOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Pais</label>
                    <select
                      className="ventrix-input text-sm"
                      value={profileForm.country}
                      onChange={handleProfileFieldChange("country")}
                    >
                      <option value="">Seleccionar pais</option>
                      {countrySelectOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Zona horaria</label>
                    <select
                      className="ventrix-input text-sm"
                      value={profileForm.timezone}
                      onChange={handleProfileFieldChange("timezone")}
                    >
                      <option value="">Seleccionar zona horaria</option>
                      {timezoneSelectOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Descripcion</label>
                    <textarea
                      className="ventrix-input h-20 py-2 resize-none text-sm"
                      value={profileForm.description}
                      onChange={handleProfileFieldChange("description")}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="ventrix-btn-primary h-9 px-5 text-sm"
                    disabled={saveWorkspaceMutation.isPending}
                  >
                    {saveWorkspaceMutation.isPending ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </form>
            ) : null}
          </div>

          {/* Branding */}
          <div className="ventrix-card p-6">
            <h3 className="font-display font-semibold mb-5 flex items-center gap-2">
              <Palette className="w-4 h-4" /> Branding
            </h3>
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
              <h3 className="font-display font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" /> Equipo
              </h3>
              <button className="ventrix-btn-primary h-8 px-3 text-xs">Invitar usuario</button>
            </div>
            <table className="ventrix-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member, index) => (
                  <tr key={index}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                          {member.name
                            .split(" ")
                            .filter(Boolean)
                            .map((namePart) => namePart[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-[10px] text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`ventrix-badge ${member.role === "Admin" ? "ventrix-badge-success" : "ventrix-badge-info"} text-[10px]`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="text-xs text-muted-foreground">{member.status}</td>
                    <td>
                      <button className="text-xs text-muted-foreground hover:text-foreground">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Automations */}
          <div className="ventrix-card p-6">
            <h3 className="font-display font-semibold mb-5 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Automatizaciones
            </h3>
            <div className="space-y-3">
              {[
                { label: "Follow-up automatico despues de 24h sin respuesta", active: true },
                { label: "Notificar cuando un lead caliente no tiene seguimiento", active: true },
                { label: "Asignar nuevos leads al asesor con menos carga", active: false },
                { label: "Enviar resumen diario de actividad comercial", active: true },
                { label: "Detectar y marcar conversaciones abandonadas", active: true },
                { label: "Escalar leads de alto valor automaticamente", active: false },
              ].map((automation, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm">{automation.label}</span>
                  <div
                    className={`w-9 h-5 rounded-full flex items-center cursor-pointer transition-colors ${automation.active ? "bg-primary justify-end" : "bg-muted justify-start"}`}
                  >
                    <div className="w-4 h-4 rounded-full bg-card shadow-sm mx-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="ventrix-card p-6">
            <h3 className="font-display font-semibold mb-5 flex items-center gap-2">
              <Bell className="w-4 h-4" /> Notificaciones
            </h3>
            <div className="space-y-3">
              {[
                { label: "Nuevo lead recibido", email: true, push: true },
                { label: "Lead recuperado", email: true, push: true },
                { label: "Conversacion abandonada", email: false, push: true },
                { label: "Reporte semanal", email: true, push: false },
                { label: "Campana completada", email: true, push: true },
              ].map((notification, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm">{notification.label}</span>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <input type="checkbox" defaultChecked={notification.email} className="rounded" /> Email
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <input type="checkbox" defaultChecked={notification.push} className="rounded" /> Push
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Billing */}
          <div className="ventrix-card p-6">
            <h3 className="font-display font-semibold mb-5 flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Facturacion
            </h3>
            <div className="bg-accent rounded-xl p-5 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Plan Pro</p>
                  <p className="text-xs text-muted-foreground">Hasta 5,000 leads · 3 usuarios · Todos los modulos</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-display font-bold">
                    $99 <span className="text-sm font-normal text-muted-foreground">USD/mes</span>
                  </p>
                  <p className="text-xs text-muted-foreground">Proxima factura: 1 Abr 2026</p>
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
            <h3 className="font-display font-semibold mb-5 flex items-center gap-2">
              <Link2 className="w-4 h-4" /> Integraciones
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {integrations.map((integration, index) => (
                <div key={index} className="border rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Link2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{integration.name}</p>
                    <p className="text-[10px] text-muted-foreground">{integration.desc}</p>
                  </div>
                  <span
                    className={`ventrix-badge text-[10px] ${
                      integration.status === "Conectado"
                        ? "ventrix-badge-success"
                        : integration.status === "Disponible"
                          ? "ventrix-badge-info"
                          : "ventrix-badge-warning"
                    }`}
                  >
                    {integration.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
