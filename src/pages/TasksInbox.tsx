import { DashboardLayout } from "@/components/DashboardLayout";
import { toast } from "@/components/ui/sonner";
import tasksService, { TasksServiceError, tasksQueryKeys, tasksServiceErrors } from "@/services/tasks.service";
import type { Task, TasksInboxFilter } from "@/types/tasks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock, Loader2, RefreshCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const filterOptions: Array<{ key: TasksInboxFilter; label: string }> = [
  { key: "pending", label: "Pending" },
  { key: "today", label: "Today" },
  { key: "overdue", label: "Overdue" },
  { key: "done", label: "Done" },
];

const statusLabelMap: Record<Task["status"], string> = {
  pending: "Pendiente",
  done: "Hecha",
  cancelled: "Cancelada",
};

const statusBadgeMap: Record<Task["status"], string> = {
  pending: "ventrix-badge-warning",
  done: "ventrix-badge-success",
  cancelled: "ventrix-badge-danger",
};

const parseDate = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return null;
  }

  return new Date(parsed);
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const isOverdue = (task: Task, now: Date) => {
  if (task.status !== "pending") {
    return false;
  }

  const dueAt = parseDate(task.dueAt);
  return Boolean(dueAt && dueAt.getTime() < now.getTime());
};

const isDueToday = (task: Task, now: Date) => {
  if (task.status !== "pending") {
    return false;
  }

  const dueAt = parseDate(task.dueAt);
  return Boolean(dueAt && isSameDay(dueAt, now));
};

const matchesFilter = (task: Task, filter: TasksInboxFilter, now: Date) => {
  if (filter === "done") {
    return task.status === "done";
  }

  if (filter === "today") {
    return isDueToday(task, now);
  }

  if (filter === "overdue") {
    return isOverdue(task, now);
  }

  return task.status === "pending";
};

const sortTasks = (tasks: Task[]) =>
  [...tasks].sort((a, b) => {
    const weight = (task: Task) => {
      if (task.status === "pending") {
        return 0;
      }
      if (task.status === "done") {
        return 1;
      }
      return 2;
    };

    const byStatus = weight(a) - weight(b);
    if (byStatus !== 0) {
      return byStatus;
    }

    const dueA = parseDate(a.dueAt)?.getTime();
    const dueB = parseDate(b.dueAt)?.getTime();

    if (typeof dueA === "number" && typeof dueB === "number" && dueA !== dueB) {
      return dueA - dueB;
    }
    if (typeof dueA === "number" && typeof dueB !== "number") {
      return -1;
    }
    if (typeof dueA !== "number" && typeof dueB === "number") {
      return 1;
    }

    const createdA = parseDate(a.createdAt)?.getTime() ?? 0;
    const createdB = parseDate(b.createdAt)?.getTime() ?? 0;
    return createdB - createdA;
  });

const toDueLabel = (value?: string | null) => {
  const parsed = parseDate(value);
  if (!parsed) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
};

const toDueTone = (task: Task, now: Date) => {
  if (isOverdue(task, now)) {
    return "text-destructive";
  }

  if (isDueToday(task, now)) {
    return "text-warning";
  }

  return "text-muted-foreground";
};

export default function TasksInbox() {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState<TasksInboxFilter>("pending");
  const [statusEndpointUnavailable, setStatusEndpointUnavailable] = useState(false);

  const tasksQuery = useQuery({
    queryKey: tasksQueryKeys.list(),
    queryFn: () => tasksService.list(),
    retry: false,
  });

  const summaryQuery = useQuery({
    queryKey: tasksQueryKeys.summary(),
    queryFn: () => tasksService.getSummary(),
    retry: false,
  });

  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ taskId }: { taskId: string }) => tasksService.updateStatus(taskId, "done"),
    onSuccess: () => {
      toast.success("Tarea marcada como hecha.");
      void queryClient.invalidateQueries({ queryKey: tasksQueryKeys.list() });
      void queryClient.invalidateQueries({ queryKey: tasksQueryKeys.summary() });
    },
    onError: (error) => {
      if (error instanceof TasksServiceError && error.status === 404) {
        setStatusEndpointUnavailable(true);
      }
      toast.error(tasksServiceErrors.getMessage(error, "No pudimos actualizar el estado de la tarea."));
    },
  });

  const tasks = tasksQuery.data ?? [];
  const now = new Date();
  const visibleTasks = useMemo(() => {
    const referenceNow = new Date();
    return sortTasks(tasks.filter((task) => matchesFilter(task, activeFilter, referenceNow)));
  }, [activeFilter, tasks]);

  const listState = tasksQuery.isLoading
    ? "loading"
    : tasksQuery.isError
      ? "error"
      : visibleTasks.length === 0
        ? "empty"
        : "success";

  const summary = summaryQuery.data;
  const summaryErrorMessage = summaryQuery.isError
    ? tasksServiceErrors.getMessage(summaryQuery.error, "No pudimos cargar el resumen de tasks.")
    : null;

  return (
    <DashboardLayout title="Tasks Inbox">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold">Follow-ups globales</h2>
            <p className="text-sm text-muted-foreground">Gestiona tareas del workspace desde un solo lugar.</p>
          </div>
          <button
            type="button"
            className="ventrix-btn-secondary h-9 px-3 text-sm inline-flex items-center gap-2"
            onClick={() => {
              void tasksQuery.refetch();
              void summaryQuery.refetch();
            }}
            disabled={tasksQuery.isFetching}
          >
            <RefreshCcw className="h-4 w-4" />
            {tasksQuery.isFetching ? "Actualizando..." : "Refrescar"}
          </button>
        </div>

        {summary ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="ventrix-metric">
              <p className="text-2xl font-display font-bold">{summary.pending}</p>
              <p className="text-xs text-muted-foreground">Pendientes</p>
            </div>
            <div className="ventrix-metric">
              <p className="text-2xl font-display font-bold">{summary.today}</p>
              <p className="text-xs text-muted-foreground">Vencen hoy</p>
            </div>
            <div className="ventrix-metric">
              <p className="text-2xl font-display font-bold">{summary.overdue}</p>
              <p className="text-xs text-muted-foreground">Atrasadas</p>
            </div>
            <div className="ventrix-metric">
              <p className="text-2xl font-display font-bold">{summary.done}</p>
              <p className="text-xs text-muted-foreground">Hechas</p>
            </div>
          </div>
        ) : null}

        {summaryErrorMessage ? (
          <div className="rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning">
            {summaryErrorMessage}
          </div>
        ) : null}

        <div className="ventrix-card p-5">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {filterOptions.map((filter) => (
              <button
                key={filter.key}
                type="button"
                className={`h-8 rounded-md px-3 text-xs font-medium transition-colors ${
                  activeFilter === filter.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                onClick={() => setActiveFilter(filter.key)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {listState === "loading" ? (
            <div className="rounded-lg bg-muted/40 p-5 text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Cargando tareas...
            </div>
          ) : null}

          {listState === "error" ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm" role="alert">
              <p className="font-medium text-destructive">No pudimos cargar el inbox de tareas.</p>
              <p className="mt-1 text-muted-foreground">
                {tasksServiceErrors.getMessage(tasksQuery.error, "Ocurrio un error inesperado al cargar tasks.")}
              </p>
              <button
                type="button"
                className="mt-3 ventrix-btn-secondary h-8 px-3 text-xs"
                onClick={() => {
                  void tasksQuery.refetch();
                }}
              >
                Reintentar
              </button>
            </div>
          ) : null}

          {listState === "empty" ? (
            <div className="rounded-lg bg-muted/40 p-5 text-sm text-muted-foreground">No hay tareas para este filtro.</div>
          ) : null}

          {listState === "success" ? (
            <div className="overflow-x-auto">
              <table className="ventrix-table">
                <thead>
                  <tr>
                    <th>Tarea</th>
                    <th>Lead</th>
                    <th>Vencimiento</th>
                    <th>Estado</th>
                    <th className="text-right">Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleTasks.map((task) => {
                    const leadId = task.leadId ?? task.lead?.id;
                    const leadName = task.lead?.name ?? (leadId ? `Lead ${leadId}` : "Lead");
                    const canMarkDone = task.status === "pending" && !statusEndpointUnavailable;

                    return (
                      <tr key={task.id}>
                        <td>
                          <div>
                            <p className="text-sm font-medium">{task.title}</p>
                            {task.description ? (
                              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
                            ) : null}
                          </div>
                        </td>
                        <td>
                          {leadId ? (
                            <Link to={`/leads?leadId=${encodeURIComponent(leadId)}`} className="text-sm text-primary hover:underline">
                              {leadName}
                            </Link>
                          ) : (
                            <span className="text-sm text-muted-foreground">{leadName}</span>
                          )}
                        </td>
                        <td>
                          <div className={`text-xs inline-flex items-center gap-1 ${toDueTone(task, now)}`}>
                            <Clock className="h-3.5 w-3.5" />
                            {toDueLabel(task.dueAt)}
                          </div>
                        </td>
                        <td>
                          <span className={`ventrix-badge ${statusBadgeMap[task.status]} text-[10px]`}>
                            {statusLabelMap[task.status]}
                          </span>
                        </td>
                        <td>
                          <div className="flex justify-end">
                            {canMarkDone ? (
                              <button
                                type="button"
                                className="ventrix-btn-secondary h-7 px-2 text-[11px] inline-flex items-center gap-1"
                                onClick={() => updateTaskStatusMutation.mutate({ taskId: task.id })}
                                disabled={updateTaskStatusMutation.isPending}
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Hecha
                              </button>
                            ) : (
                              <span className="text-[11px] text-muted-foreground">-</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </DashboardLayout>
  );
}
