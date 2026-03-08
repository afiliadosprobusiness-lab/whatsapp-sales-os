import { Task, TaskStatus, TasksApiEnvelope, TasksApiErrorPayload, TasksSummary } from "@/types/tasks";

export class TasksServiceError extends Error {
  code?: string;
  status?: number;

  constructor(payload: { message: string; code?: string; status?: number }) {
    super(payload.message);
    this.name = "TasksServiceError";
    this.code = payload.code;
    this.status = payload.status;
  }
}

export interface TasksService {
  list(): Promise<Task[]>;
  getSummary(): Promise<TasksSummary | null>;
  updateStatus(taskId: string, status: TaskStatus): Promise<Task>;
}

export const tasksQueryKeys = {
  all: ["tasks"] as const,
  lists: () => [...tasksQueryKeys.all, "list"] as const,
  list: () => [...tasksQueryKeys.lists(), "workspace"] as const,
  summaries: () => [...tasksQueryKeys.all, "summary"] as const,
  summary: () => [...tasksQueryKeys.summaries(), "workspace"] as const,
  details: () => [...tasksQueryKeys.all, "detail"] as const,
  detail: (taskId: string) => [...tasksQueryKeys.details(), taskId] as const,
};

const TASKS_ENDPOINTS = {
  list: "/tasks",
  summary: "/tasks/summary",
  byIdStatus: (taskId: string) => `/tasks/${taskId}/status`,
} as const;

const DEFAULT_API_URL = "https://backend-production-80db.up.railway.app";
const API_BASE_URL = (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_URL).replace(
  /\/$/,
  "",
);

const buildUrl = (path: string) => `${API_BASE_URL}${path}`;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isApiEnvelope = <TData>(value: unknown): value is TasksApiEnvelope<TData> =>
  isObject(value) && "data" in value && "error" in value;

const asString = (value: unknown): string | undefined => (typeof value === "string" ? value.trim() : undefined);

const asNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = Number(value.replace(/[^\d.-]/g, ""));
    if (Number.isFinite(normalized)) {
      return normalized;
    }
  }

  return undefined;
};

const normalizeDate = (value: unknown): string | undefined => {
  const raw = asString(value);
  if (!raw) {
    return undefined;
  }

  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? raw : new Date(parsed).toISOString();
};

const STATUS_MAP: Record<string, TaskStatus> = {
  PENDING: "pending",
  DONE: "done",
  COMPLETED: "done",
  CANCELLED: "cancelled",
  CANCELED: "cancelled",
};

const normalizeStatus = (value: unknown): TaskStatus => {
  const normalized = asString(value)?.toUpperCase();
  if (!normalized) {
    return "pending";
  }

  return STATUS_MAP[normalized] ?? "pending";
};

const normalizeLead = (value: unknown) => {
  if (!isObject(value)) {
    const leadName = asString(value);
    return leadName ? { name: leadName } : undefined;
  }

  const name =
    asString(value.name) ??
    asString(value.fullName) ??
    asString(value.leadName) ??
    asString(value.contactName) ??
    "Lead sin nombre";

  return {
    id: asString(value.id) ?? asString(value.leadId),
    name,
    email: asString(value.email),
    phone: asString(value.phone) ?? asString(value.whatsappNumber),
  };
};

const normalizeTask = (value: unknown, index = 0): Task => {
  if (!isObject(value)) {
    throw new TasksServiceError({
      message: "La respuesta de tareas no tiene un formato valido.",
    });
  }

  const title =
    asString(value.title) ??
    asString(value.name) ??
    asString(value.label) ??
    asString(value.task) ??
    `Tarea ${index + 1}`;

  const normalizedLead =
    normalizeLead(value.lead ?? value.leadData ?? value.contact ?? value.leadName) ??
    normalizeLead({
      id: asString(value.leadId),
      name: asString(value.leadName),
      email: asString(value.leadEmail),
      phone: asString(value.leadPhone),
    });

  const leadId = asString(value.leadId) ?? normalizedLead?.id;

  return {
    id: asString(value.id) ?? asString(value.taskId) ?? `task-${index + 1}`,
    workspaceId: asString(value.workspaceId),
    leadId,
    title,
    description: asString(value.description) ?? asString(value.note) ?? null,
    status: normalizeStatus(value.status),
    dueAt: normalizeDate(value.dueAt ?? value.dueDate ?? value.due_on) ?? null,
    createdAt: normalizeDate(value.createdAt),
    updatedAt: normalizeDate(value.updatedAt),
    lead: normalizedLead ? { ...normalizedLead, id: leadId ?? normalizedLead.id } : undefined,
  };
};

const getDefaultErrorMessage = (status: number) => {
  if (status === 401) {
    return "Debes iniciar sesion para acceder a tasks.";
  }

  if (status === 404) {
    return "No se encontro la ruta solicitada de tasks.";
  }

  if (status >= 500) {
    return "El servicio de tasks no esta disponible temporalmente.";
  }

  return "No se pudo procesar la solicitud de tasks.";
};

async function parseJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

const toServiceError = (payload: unknown, status: number) => {
  if (isApiEnvelope(payload) && isObject(payload.error)) {
    const errorPayload = payload.error as TasksApiErrorPayload;
    return new TasksServiceError({
      status,
      code: asString(errorPayload.code),
      message: asString(errorPayload.message) ?? getDefaultErrorMessage(status),
    });
  }

  if (isObject(payload)) {
    return new TasksServiceError({
      status,
      code: asString(payload.code),
      message: asString(payload.message) ?? getDefaultErrorMessage(status),
    });
  }

  return new TasksServiceError({
    status,
    message: getDefaultErrorMessage(status),
  });
};

const unwrapPayload = <T>(payload: unknown): T => {
  if (isApiEnvelope<T>(payload)) {
    return payload.data as T;
  }

  return payload as T;
};

const extractListSource = (payload: unknown) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isObject(payload)) {
    return [];
  }

  if (Array.isArray(payload.tasks)) {
    return payload.tasks;
  }

  if (Array.isArray(payload.items)) {
    return payload.items;
  }

  if (Array.isArray(payload.results)) {
    return payload.results;
  }

  return [];
};

const extractItemSource = (payload: unknown) => {
  if (!isObject(payload)) {
    return payload;
  }

  if ("task" in payload) {
    return payload.task;
  }

  if ("item" in payload) {
    return payload.item;
  }

  return payload;
};

const extractSummarySource = (payload: unknown) => {
  if (!isObject(payload)) {
    return payload;
  }

  if ("summary" in payload) {
    return payload.summary;
  }

  if ("item" in payload) {
    return payload.item;
  }

  return payload;
};

const pickNumber = (...values: unknown[]) => {
  for (const value of values) {
    const parsed = asNumber(value);
    if (typeof parsed === "number") {
      return parsed;
    }
  }

  return 0;
};

const normalizeSummary = (payload: unknown): TasksSummary | null => {
  if (!isObject(payload)) {
    return null;
  }

  const pending = pickNumber(payload.pending, payload.pendingCount, payload.open, payload.openCount);
  const today = pickNumber(payload.today, payload.todayCount, payload.dueToday, payload.dueTodayCount);
  const overdue = pickNumber(payload.overdue, payload.overdueCount, payload.late, payload.lateCount);
  const done = pickNumber(payload.done, payload.doneCount, payload.completed, payload.completedCount);
  const total = pickNumber(payload.total, payload.totalCount, pending + today + overdue + done);

  return {
    pending,
    today,
    overdue,
    done,
    total,
  };
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildUrl(path), {
    credentials: "include",
    ...init,
    headers,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await parseJson(response);

  if (!response.ok) {
    throw toServiceError(payload, response.status);
  }

  return unwrapPayload<T>(payload);
}

const tasksService: TasksService = {
  async list() {
    const response = await request<unknown>(TASKS_ENDPOINTS.list, {
      method: "GET",
    });

    const source = extractListSource(response);
    return source.map((item, index) => normalizeTask(item, index));
  },
  async getSummary() {
    try {
      const response = await request<unknown>(TASKS_ENDPOINTS.summary, {
        method: "GET",
      });

      return normalizeSummary(extractSummarySource(response));
    } catch (error) {
      if (error instanceof TasksServiceError && error.status === 404) {
        return null;
      }

      throw error;
    }
  },
  async updateStatus(taskId, status) {
    const response = await request<unknown>(TASKS_ENDPOINTS.byIdStatus(taskId), {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    return normalizeTask(extractItemSource(response));
  },
};

export const tasksServiceErrors = {
  getMessage(error: unknown, fallback = "No se pudo procesar la solicitud de tasks.") {
    if (error instanceof TasksServiceError) {
      return error.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return fallback;
  },
};

export default tasksService;
