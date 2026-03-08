
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import leadsService, { leadsQueryKeys, leadsServiceErrors } from "@/services/leads.service";
import type {
  CreateLeadRequest,
  GetLeadsParams,
  Lead,
  LeadPriority,
  LeadStatus,
  LeadsViewState,
  UpdateLeadRequest,
} from "@/types/leads";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Filter, Loader2, Mail, MessageSquare, MoreHorizontal, Phone, Plus, Search, X } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

const statusLabelMap: Record<LeadStatus, string> = {
  NEW: "Nuevo",
  CONTACTED: "Contactado",
  INTERESTED: "Interesado",
  FOLLOW_UP: "Seguimiento",
  CLOSED: "Cerrado",
  LOST: "Perdido",
};

const statusBadgeMap: Record<LeadStatus, string> = {
  NEW: "ventrix-badge-info",
  CONTACTED: "ventrix-badge-success",
  INTERESTED: "ventrix-badge-warning",
  FOLLOW_UP: "ventrix-badge-info",
  CLOSED: "ventrix-badge-success",
  LOST: "ventrix-badge-danger",
};

const statusDotMap: Record<LeadStatus, string> = {
  NEW: "bg-info",
  CONTACTED: "bg-primary",
  INTERESTED: "bg-warning",
  FOLLOW_UP: "bg-accent-foreground",
  CLOSED: "bg-primary",
  LOST: "bg-destructive",
};

const priorityLabelMap: Record<LeadPriority, string> = {
  HIGH: "Alta",
  MEDIUM: "Media",
  LOW: "Baja",
};

const priorityColorMap: Record<LeadPriority, string> = {
  HIGH: "text-destructive",
  MEDIUM: "text-warning",
  LOW: "text-muted-foreground",
};

const pipelineOrder: LeadStatus[] = ["NEW", "CONTACTED", "INTERESTED", "FOLLOW_UP", "CLOSED", "LOST"];
const statusOptions: LeadStatus[] = ["NEW", "CONTACTED", "INTERESTED", "FOLLOW_UP", "CLOSED", "LOST"];
const priorityOptions: LeadPriority[] = ["HIGH", "MEDIUM", "LOW"];

const quickFilters = [
  { key: "ALL", label: "Todos" },
  { key: "NEW", label: "Nuevos" },
  { key: "HOT", label: "Calientes" },
  { key: "UNASSIGNED", label: "Sin asignar" },
] as const;

type QuickFilter = (typeof quickFilters)[number]["key"];

interface LeadFormState {
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  priority: LeadPriority;
  estimatedValue: string;
  source: string;
  notes: string;
}

const EMPTY_LEAD_FORM: LeadFormState = {
  name: "",
  email: "",
  phone: "",
  status: "NEW",
  priority: "MEDIUM",
  estimatedValue: "",
  source: "",
  notes: "",
};

const toLeadFormState = (lead: Lead): LeadFormState => ({
  name: lead.name,
  email: lead.email ?? "",
  phone: lead.phone ?? "",
  status: lead.status,
  priority: lead.priority,
  estimatedValue: lead.estimatedValueCents ? String((lead.estimatedValueCents / 100).toFixed(2)) : "",
  source: lead.source ?? "",
  notes: lead.notes ?? "",
});

const toCurrency = (value?: number) => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "-";
  }

  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value / 100);
};

const toRelativeTime = (value?: string) => {
  if (!value) {
    return "Sin contacto";
  }

  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return value;
  }

  const diffMinutes = Math.floor((Date.now() - parsed) / 60000);
  if (diffMinutes <= 1) {
    return "Ahora";
  }
  if (diffMinutes < 60) {
    return `Hace ${diffMinutes} min`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `Hace ${diffHours} h`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `Hace ${diffDays} d`;
};

const getLeadInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? "")
    .join("");

const parseMoneyInputToCents = (value: string) => {
  const normalized = Number(value.replace(",", ".").replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(normalized) || normalized <= 0) {
    return undefined;
  }

  return Math.round(normalized * 100);
};

const matchQuickFilter = (lead: Lead, filter: QuickFilter) => {
  if (filter === "ALL") {
    return true;
  }

  if (filter === "NEW") {
    return lead.status === "NEW";
  }

  if (filter === "HOT") {
    return lead.score >= 80 || lead.closeProbability >= 70;
  }

  if (filter === "UNASSIGNED") {
    return !lead.owner?.id && !lead.owner?.fullName;
  }

  return true;
};

const toCreatePayload = (form: LeadFormState): CreateLeadRequest => ({
  name: form.name,
  email: form.email,
  phone: form.phone,
  status: form.status,
  priority: form.priority,
  estimatedValueCents: parseMoneyInputToCents(form.estimatedValue),
  source: form.source,
  notes: form.notes,
});

const toUpdatePayload = (form: LeadFormState): UpdateLeadRequest => ({
  name: form.name,
  email: form.email,
  phone: form.phone,
  status: form.status,
  priority: form.priority,
  estimatedValueCents: parseMoneyInputToCents(form.estimatedValue),
  source: form.source,
  notes: form.notes,
});

export default function Leads() {
  const queryClient = useQueryClient();
  const [isListEnabled, setIsListEnabled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("ALL");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [statusDraft, setStatusDraft] = useState<LeadStatus>("NEW");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState<LeadFormState>(EMPTY_LEAD_FORM);
  const [editForm, setEditForm] = useState<LeadFormState>(EMPTY_LEAD_FORM);

  useEffect(() => {
    setIsListEnabled(true);
  }, []);

  const normalizedSearchTerm = searchTerm.trim();

  const listParams = useMemo<GetLeadsParams>(
    () => ({
      status: quickFilter === "NEW" ? "NEW" : undefined,
      query: normalizedSearchTerm || undefined,
    }),
    [quickFilter, normalizedSearchTerm],
  );

  const leadsQuery = useQuery({
    queryKey: leadsQueryKeys.list(listParams),
    queryFn: () => leadsService.list(listParams),
    enabled: isListEnabled,
    retry: false,
  });
  const selectedLeadQuery = useQuery({
    queryKey: selectedLeadId ? leadsQueryKeys.detail(selectedLeadId) : leadsQueryKeys.detail("idle"),
    queryFn: () => leadsService.getById(selectedLeadId as string),
    enabled: Boolean(selectedLeadId),
    retry: false,
  });

  const createLeadMutation = useMutation({
    mutationFn: (payload: CreateLeadRequest) => leadsService.create(payload),
    onSuccess: (createdLead) => {
      toast.success("Lead creado correctamente.");
      setCreateForm(EMPTY_LEAD_FORM);
      setIsCreateDialogOpen(false);
      setSelectedLeadId(createdLead.id);
      void queryClient.invalidateQueries({ queryKey: leadsQueryKeys.lists() });
    },
    onError: (error) => {
      toast.error(leadsServiceErrors.getMessage(error, "No pudimos crear el lead."));
    },
  });

  const updateLeadCache = (updatedLead: Lead) => {
    queryClient.setQueriesData(
      {
        queryKey: leadsQueryKeys.lists(),
      },
      (current) => {
        if (!Array.isArray(current)) {
          return current;
        }

        return (current as Lead[]).map((lead) => (lead.id === updatedLead.id ? { ...lead, ...updatedLead } : lead));
      },
    );

    queryClient.setQueryData(leadsQueryKeys.detail(updatedLead.id), (current: Lead | undefined) => {
      if (!current) {
        return current;
      }

      return { ...current, ...updatedLead };
    });
  };

  const updateLeadMutation = useMutation({
    mutationFn: ({ leadId, payload }: { leadId: string; payload: UpdateLeadRequest }) => leadsService.update(leadId, payload),
    onSuccess: (updatedLead) => {
      updateLeadCache(updatedLead);
      setStatusDraft(updatedLead.status);
      setIsEditDialogOpen(false);
      toast.success("Lead actualizado correctamente.");
      void queryClient.invalidateQueries({ queryKey: leadsQueryKeys.detail(updatedLead.id) });
    },
    onError: (error) => {
      toast.error(leadsServiceErrors.getMessage(error, "No pudimos actualizar el lead."));
    },
  });

  const updateLeadStatusMutation = useMutation({
    mutationFn: ({ leadId, status }: { leadId: string; status: LeadStatus }) => leadsService.updateStatus(leadId, status),
    onSuccess: (updatedLead) => {
      updateLeadCache(updatedLead);
      setStatusDraft(updatedLead.status);
      toast.success("Estado actualizado.");
      void queryClient.invalidateQueries({ queryKey: leadsQueryKeys.detail(updatedLead.id) });
    },
    onError: (error) => {
      toast.error(leadsServiceErrors.getMessage(error, "No pudimos cambiar el estado del lead."));
    },
  });

  const allLeads = leadsQuery.data ?? [];
  const selectedLeadSummary = selectedLeadId ? allLeads.find((lead) => lead.id === selectedLeadId) ?? null : null;
  const selectedLead = selectedLeadQuery.data ?? selectedLeadSummary;

  useEffect(() => {
    if (!selectedLead) {
      return;
    }

    setStatusDraft(selectedLead.status);
  }, [selectedLead?.id, selectedLead?.status]);

  const visibleLeads = useMemo(() => {
    const search = normalizedSearchTerm.toLowerCase();

    return allLeads.filter((lead) => {
      if (!matchQuickFilter(lead, quickFilter)) {
        return false;
      }

      if (!search) {
        return true;
      }

      const searchable = [lead.name, lead.email, lead.phone, lead.owner?.fullName, lead.source]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(search);
    });
  }, [allLeads, quickFilter, normalizedSearchTerm]);

  const pipelineStages = useMemo(
    () =>
      pipelineOrder.map((status) => ({
        status,
        name: statusLabelMap[status],
        count: allLeads.filter((lead) => lead.status === status).length,
        color: statusDotMap[status],
      })),
    [allLeads],
  );

  const listState: LeadsViewState = !isListEnabled
    ? "idle"
    : leadsQuery.isLoading
      ? "loading"
      : leadsQuery.isError
        ? "error"
        : visibleLeads.length === 0
          ? "empty"
          : "success";

  const detailState: LeadsViewState = !selectedLeadId
    ? "idle"
    : selectedLeadQuery.isLoading && !selectedLead
      ? "loading"
      : selectedLeadQuery.isError
        ? "error"
        : selectedLead
          ? "success"
          : "empty";

  const handleCreateFieldChange =
    (field: keyof LeadFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const nextValue = event.target.value;
      setCreateForm((prev) => ({ ...prev, [field]: nextValue }));
    };

  const handleEditFieldChange =
    (field: keyof LeadFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const nextValue = event.target.value;
      setEditForm((prev) => ({ ...prev, [field]: nextValue }));
    };

  const handleCreateLead = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createLeadMutation.mutate(toCreatePayload(createForm));
  };

  const handleOpenEditDialog = () => {
    if (!selectedLead) {
      return;
    }

    setEditForm(toLeadFormState(selectedLead));
    setIsEditDialogOpen(true);
  };

  const handleUpdateLead = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedLeadId) {
      return;
    }

    updateLeadMutation.mutate({
      leadId: selectedLeadId,
      payload: toUpdatePayload(editForm),
    });
  };

  const handleStatusUpdate = () => {
    if (!selectedLeadId || !selectedLead || selectedLead.status === statusDraft) {
      return;
    }

    updateLeadStatusMutation.mutate({
      leadId: selectedLeadId,
      status: statusDraft,
    });
  };

  return (
    <DashboardLayout title="Leads">
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-6 gap-3">
          {pipelineStages.map((stage) => (
            <div key={stage.status} className="ventrix-card p-4 text-center cursor-pointer hover:border-primary/30 transition-colors">
              <div className={`w-2 h-2 rounded-full ${stage.color} mx-auto mb-2`} />
              <p className="text-lg font-display font-bold">{stage.count}</p>
              <p className="text-[10px] text-muted-foreground">{stage.name}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar leads..."
              className="ventrix-input pl-9 text-sm"
            />
          </div>

          <button type="button" className="ventrix-btn-secondary h-9 px-3 text-xs flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Filtros <ChevronDown className="w-3 h-3" />
          </button>

          <button
            type="button"
            className="ventrix-btn-primary h-9 px-3 text-xs flex items-center gap-1.5"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="w-3.5 h-3.5" />
            Nuevo lead
          </button>

          {quickFilters.map((filter) => (
            <button
              type="button"
              key={filter.key}
              onClick={() => setQuickFilter(filter.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                quickFilter === filter.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          <div className="flex-1 ventrix-card overflow-hidden">
            {listState === "idle" ? (
              <div className="p-8 text-center">
                <p className="text-sm font-medium">Preparando modulo de leads...</p>
              </div>
            ) : null}

            {listState === "loading" ? (
              <div className="p-8 flex items-center justify-center gap-2 text-sm text-muted-foreground" aria-live="polite">
                <Loader2 className="w-4 h-4 animate-spin" />
                Cargando leads...
              </div>
            ) : null}

            {listState === "error" ? (
              <div className="p-6" role="alert">
                <p className="text-sm font-medium text-destructive">No pudimos cargar los leads.</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {leadsServiceErrors.getMessage(leadsQuery.error, "Ocurrio un error inesperado.")}
                </p>
                <button
                  type="button"
                  className="mt-3 ventrix-btn-secondary h-8 px-3 text-xs"
                  onClick={() => {
                    void leadsQuery.refetch();
                  }}
                >
                  Reintentar
                </button>
              </div>
            ) : null}

            {listState === "empty" ? (
              <div className="p-8 text-center">
                <p className="text-sm font-medium">No hay leads para mostrar.</p>
                <p className="text-xs text-muted-foreground mt-1">Crea tu primer lead o ajusta los filtros actuales.</p>
              </div>
            ) : null}

            {listState === "success" ? (
              <table className="ventrix-table">
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Estado</th>
                    <th>Prioridad</th>
                    <th>Score</th>
                    <th>Prob. cierre</th>
                    <th>Ultimo contacto</th>
                    <th>Asesor</th>
                    <th>Valor</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {visibleLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className={`cursor-pointer ${selectedLeadId === lead.id ? "bg-muted/60" : ""}`}
                      onClick={() => setSelectedLeadId(lead.id)}
                    >
                      <td>
                        <div>
                          <p className="font-medium text-sm">{lead.name}</p>
                          <p className="text-[10px] text-muted-foreground">{lead.email ?? "Sin email"}</p>
                        </div>
                      </td>
                      <td>
                        <span className={`ventrix-badge ${statusBadgeMap[lead.status]}`}>{statusLabelMap[lead.status]}</span>
                      </td>
                      <td>
                        <span className={`text-xs font-medium ${priorityColorMap[lead.priority]}`}>
                          {priorityLabelMap[lead.priority]}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <div className="w-8 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, Math.max(0, lead.score))}%` }} />
                          </div>
                          <span className="text-xs">{lead.score}</span>
                        </div>
                      </td>
                      <td>
                        <span className="text-xs font-medium">{lead.closeProbability}%</span>
                      </td>
                      <td>
                        <span className="text-xs text-muted-foreground">{toRelativeTime(lead.lastContactAt)}</span>
                      </td>
                      <td>
                        <span className="text-xs">{lead.owner?.fullName ?? "Sin asignar"}</span>
                      </td>
                      <td>
                        <span className="text-sm font-semibold">{toCurrency(lead.estimatedValueCents)}</span>
                      </td>
                      <td>
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </div>

          {selectedLeadId ? (
            <div className="w-80 ventrix-card p-5 flex-shrink-0 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold">Detalle del lead</h3>
                <button type="button" onClick={() => setSelectedLeadId(null)}>
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {detailState === "loading" ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-12 rounded-lg bg-muted" />
                  <div className="h-10 rounded-lg bg-muted" />
                  <div className="h-20 rounded-lg bg-muted" />
                </div>
              ) : null}

              {detailState === "error" ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4" role="alert">
                  <p className="text-sm font-medium text-destructive">No pudimos cargar el detalle del lead.</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {leadsServiceErrors.getMessage(selectedLeadQuery.error, "Ocurrio un error inesperado.")}
                  </p>
                  <button
                    type="button"
                    className="mt-3 ventrix-btn-secondary h-8 px-3 text-xs"
                    onClick={() => {
                      void selectedLeadQuery.refetch();
                    }}
                  >
                    Reintentar
                  </button>
                </div>
              ) : null}

              {detailState === "success" && selectedLead ? (
                <>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 text-lg font-semibold text-primary">
                      {getLeadInitials(selectedLead.name)}
                    </div>
                    <p className="font-display font-semibold">{selectedLead.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedLead.email ?? "Sin email"}</p>
                  </div>

                  <div className="flex gap-2">
                    <a
                      className="flex-1 ventrix-btn-secondary h-8 text-xs flex items-center justify-center gap-1"
                      href={selectedLead.phone ? `tel:${selectedLead.phone}` : undefined}
                    >
                      <Phone className="w-3 h-3" />
                      Llamar
                    </a>
                    <a
                      className="flex-1 ventrix-btn-secondary h-8 text-xs flex items-center justify-center gap-1"
                      href={selectedLead.email ? `mailto:${selectedLead.email}` : undefined}
                    >
                      <Mail className="w-3 h-3" />
                      Email
                    </a>
                    <button type="button" className="flex-1 ventrix-btn-primary h-8 text-xs flex items-center justify-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      Chat
                    </button>
                  </div>

                  <div className="rounded-lg border p-3 space-y-2">
                    <p className="text-xs font-medium">Cambiar estado</p>
                    <div className="flex items-center gap-2">
                      <select
                        className="ventrix-input h-8 text-xs"
                        value={statusDraft}
                        onChange={(event) => setStatusDraft(event.target.value as LeadStatus)}
                        disabled={updateLeadStatusMutation.isPending}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {statusLabelMap[status]}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="ventrix-btn-secondary h-8 px-3 text-xs"
                        onClick={handleStatusUpdate}
                        disabled={updateLeadStatusMutation.isPending || selectedLead.status === statusDraft}
                      >
                        {updateLeadStatusMutation.isPending ? "Guardando..." : "Aplicar"}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    {[
                      { label: "Estado", value: statusLabelMap[selectedLead.status] },
                      { label: "Prioridad", value: priorityLabelMap[selectedLead.priority] },
                      { label: "Score", value: String(selectedLead.score) },
                      { label: "Prob. cierre", value: `${selectedLead.closeProbability}%` },
                      { label: "Valor estimado", value: toCurrency(selectedLead.estimatedValueCents) },
                      { label: "Asesor", value: selectedLead.owner?.fullName ?? "Sin asignar" },
                      { label: "Ultimo contacto", value: toRelativeTime(selectedLead.lastContactAt) },
                    ].map((field) => (
                      <div key={field.label} className="flex justify-between">
                        <span className="text-xs text-muted-foreground">{field.label}</span>
                        <span className="text-xs font-medium">{field.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <button type="button" onClick={handleOpenEditDialog} className="w-full ventrix-btn-secondary h-8 text-xs">
                      Editar lead
                    </button>
                    {selectedLeadQuery.isFetching ? <p className="text-[10px] text-muted-foreground text-center">Actualizando detalle...</p> : null}
                  </div>

                  <div>
                    <p className="text-xs font-medium mb-2">Timeline</p>
                    <div className="space-y-2">
                      {selectedLead.timeline.length === 0 ? (
                        <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">Sin actividad registrada.</div>
                      ) : (
                        selectedLead.timeline.map((timelineItem, index) => (
                          <div key={timelineItem.id} className="flex gap-2 text-xs">
                            <div className="flex flex-col items-center">
                              <div className="w-2 h-2 rounded-full bg-primary mt-1" />
                              {index < selectedLead.timeline.length - 1 ? <div className="w-px flex-1 bg-border mt-1" /> : null}
                            </div>
                            <div className="pb-2">
                              <p>{timelineItem.text}</p>
                              <p className="text-muted-foreground">{toRelativeTime(timelineItem.timestamp)}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium mb-2">Notas</p>
                    <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
                      {selectedLead.notes?.trim() ? selectedLead.notes : "Sin notas registradas."}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear lead</DialogTitle>
            <DialogDescription>Registra un lead dentro del workspace actual.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateLead} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nombre *</label>
                <input
                  className="ventrix-input text-sm"
                  value={createForm.name}
                  onChange={handleCreateFieldChange("name")}
                  required
                  disabled={createLeadMutation.isPending}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
                <input
                  className="ventrix-input text-sm"
                  type="email"
                  value={createForm.email}
                  onChange={handleCreateFieldChange("email")}
                  disabled={createLeadMutation.isPending}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Telefono</label>
                <input
                  className="ventrix-input text-sm"
                  value={createForm.phone}
                  onChange={handleCreateFieldChange("phone")}
                  disabled={createLeadMutation.isPending}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Estado</label>
                <select
                  className="ventrix-input text-sm"
                  value={createForm.status}
                  onChange={handleCreateFieldChange("status")}
                  disabled={createLeadMutation.isPending}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {statusLabelMap[status]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Prioridad</label>
                <select
                  className="ventrix-input text-sm"
                  value={createForm.priority}
                  onChange={handleCreateFieldChange("priority")}
                  disabled={createLeadMutation.isPending}
                >
                  {priorityOptions.map((priority) => (
                    <option key={priority} value={priority}>
                      {priorityLabelMap[priority]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Valor estimado (USD)</label>
                <input
                  className="ventrix-input text-sm"
                  type="number"
                  min="0"
                  step="0.01"
                  value={createForm.estimatedValue}
                  onChange={handleCreateFieldChange("estimatedValue")}
                  disabled={createLeadMutation.isPending}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Fuente</label>
                <input
                  className="ventrix-input text-sm"
                  value={createForm.source}
                  onChange={handleCreateFieldChange("source")}
                  disabled={createLeadMutation.isPending}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Notas</label>
                <textarea
                  className="ventrix-input min-h-20 text-sm py-2"
                  value={createForm.notes}
                  onChange={handleCreateFieldChange("notes")}
                  disabled={createLeadMutation.isPending}
                />
              </div>
            </div>
            <DialogFooter>
              <button
                type="button"
                className="ventrix-btn-secondary h-9 px-4 text-sm"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={createLeadMutation.isPending}
              >
                Cancelar
              </button>
              <button type="submit" className="ventrix-btn-primary h-9 px-4 text-sm" disabled={createLeadMutation.isPending}>
                {createLeadMutation.isPending ? "Creando..." : "Crear lead"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar lead</DialogTitle>
            <DialogDescription>Actualiza los datos principales del lead seleccionado.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateLead} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nombre *</label>
                <input
                  className="ventrix-input text-sm"
                  value={editForm.name}
                  onChange={handleEditFieldChange("name")}
                  required
                  disabled={updateLeadMutation.isPending}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
                <input
                  className="ventrix-input text-sm"
                  type="email"
                  value={editForm.email}
                  onChange={handleEditFieldChange("email")}
                  disabled={updateLeadMutation.isPending}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Telefono</label>
                <input
                  className="ventrix-input text-sm"
                  value={editForm.phone}
                  onChange={handleEditFieldChange("phone")}
                  disabled={updateLeadMutation.isPending}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Estado</label>
                <select
                  className="ventrix-input text-sm"
                  value={editForm.status}
                  onChange={handleEditFieldChange("status")}
                  disabled={updateLeadMutation.isPending}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {statusLabelMap[status]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Prioridad</label>
                <select
                  className="ventrix-input text-sm"
                  value={editForm.priority}
                  onChange={handleEditFieldChange("priority")}
                  disabled={updateLeadMutation.isPending}
                >
                  {priorityOptions.map((priority) => (
                    <option key={priority} value={priority}>
                      {priorityLabelMap[priority]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Valor estimado (USD)</label>
                <input
                  className="ventrix-input text-sm"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editForm.estimatedValue}
                  onChange={handleEditFieldChange("estimatedValue")}
                  disabled={updateLeadMutation.isPending}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Fuente</label>
                <input
                  className="ventrix-input text-sm"
                  value={editForm.source}
                  onChange={handleEditFieldChange("source")}
                  disabled={updateLeadMutation.isPending}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Notas</label>
                <textarea
                  className="ventrix-input min-h-20 text-sm py-2"
                  value={editForm.notes}
                  onChange={handleEditFieldChange("notes")}
                  disabled={updateLeadMutation.isPending}
                />
              </div>
            </div>
            <DialogFooter>
              <button
                type="button"
                className="ventrix-btn-secondary h-9 px-4 text-sm"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={updateLeadMutation.isPending}
              >
                Cancelar
              </button>
              <button type="submit" className="ventrix-btn-primary h-9 px-4 text-sm" disabled={updateLeadMutation.isPending}>
                {updateLeadMutation.isPending ? "Guardando..." : "Guardar cambios"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
