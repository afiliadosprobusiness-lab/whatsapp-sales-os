import {
  CreateLeadTaskRequest,
  LeadTask,
  LeadTaskStatus,
  LeadTasksApiEnvelope,
  LeadTasksApiErrorPayload,
  UpdateLeadTaskRequest,
} from "@/types/lead-tasks";

export class LeadTasksServiceError extends Error {
  code?: string;
  status?: number;

  constructor(payload: { message: string; code?: string; status?: number }) {
    super(payload.message);
    this.name = "LeadTasksServiceError";
    this.code = payload.code;
    this.status = payload.status;
  }
}

export interface LeadTasksService {
  listByLead(leadId: string): Promise<LeadTask[]>;
  createByLead(leadId: string, payload: CreateLeadTaskRequest): Promise<LeadTask>;
  updateById(taskId: string, payload: UpdateLeadTaskRequest): Promise<LeadTask>;
  updateStatusById(taskId: string, status: LeadTaskStatus): Promise<LeadTask>;
}

export const leadTasksQueryKeys = {
  all: ["lead-tasks"] as const,
  lists: () => [...leadTasksQueryKeys.all, "list"] as const,
  list: (leadId: string) => [...leadTasksQueryKeys.lists(), leadId] as const,
  details: () => [...leadTasksQueryKeys.all, "detail"] as const,
  detail: (taskId: string) => [...leadTasksQueryKeys.details(), taskId] as const,
};

const DEFAULT_API_URL = "https://backend-production-80db.up.railway.app";
const API_BASE_URL = (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_URL).replace(
  /\/$/,
  "",
);

const LEAD_TASK_ENDPOINTS = {
  byLead: (leadId: string) => `/leads/${leadId}/tasks`,
  byId: (taskId: string) => `/tasks/${taskId}`,
  byIdStatus: (taskId: string) => `/tasks/${taskId}/status`,
} as const;

const buildUrl = (path: string) => `${API_BASE_URL}${path}`;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isApiEnvelope = <TData>(value: unknown): value is LeadTasksApiEnvelope<TData> =>
  isObject(value) && "data" in value && "error" in value;

const asString = (value: unknown): string | undefined => (typeof value === "string" ? value.trim() : undefined);

const normalizeDate = (value: unknown): string | undefined => {
  const raw = asString(value);
  if (!raw) {
    return undefined;
  }

  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? raw : new Date(parsed).toISOString();
};

const STATUS_MAP: Record<string, LeadTaskStatus> = {
  PENDING: "pending",
  pending: "pending",
  DONE: "done",
  done: "done",
  CANCELLED: "cancelled",
  cancelled: "cancelled",
};

const normalizeStatus = (value: unknown): LeadTaskStatus => {
  const normalized = asString(value);
  if (!normalized) {
    return "pending";
  }

  return STATUS_MAP[normalized] ?? "pending";
};

const normalizeTask = (value: unknown, index = 0): LeadTask => {
  if (!isObject(value)) {
    throw new LeadTasksServiceError({
      message: "La respuesta de tareas no tiene un formato valido.",
    });
  }

  const title =
    asString(value.title) ??
    asString(value.name) ??
    asString(value.label) ??
    `Tarea ${index + 1}`;

  return {
    id: asString(value.id) ?? `task-${index + 1}`,
    workspaceId: asString(value.workspaceId),
    leadId: asString(value.leadId),
    title,
    description: asString(value.description) ?? null,
    status: normalizeStatus(value.status),
    dueAt: normalizeDate(value.dueAt) ?? null,
    createdAt: normalizeDate(value.createdAt),
    updatedAt: normalizeDate(value.updatedAt),
  };
};

const getDefaultErrorMessage = (status: number) => {
  if (status === 401) {
    return "Debes iniciar sesion para gestionar las tareas del lead.";
  }

  if (status === 404) {
    return "No se encontro la tarea solicitada.";
  }

  if (status >= 500) {
    return "El servicio de tareas no esta disponible temporalmente.";
  }

  return "No se pudo procesar la solicitud de tareas.";
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
    const errorPayload = payload.error as LeadTasksApiErrorPayload;
    return new LeadTasksServiceError({
      status,
      code: asString(errorPayload.code),
      message: asString(errorPayload.message) ?? getDefaultErrorMessage(status),
    });
  }

  if (isObject(payload)) {
    return new LeadTasksServiceError({
      status,
      code: asString(payload.code),
      message: asString(payload.message) ?? getDefaultErrorMessage(status),
    });
  }

  return new LeadTasksServiceError({
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

const normalizeTitle = (value: string) => value.trim();

const normalizeDateTimePayload = (value: string | null | undefined) => {
  if (value === null) {
    return null;
  }

  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) {
    return undefined;
  }

  const parsed = Date.parse(raw);
  if (Number.isNaN(parsed)) {
    throw new LeadTasksServiceError({
      message: "La fecha de vencimiento no tiene un formato valido.",
    });
  }

  return new Date(parsed).toISOString();
};

const normalizeCreatePayload = (payload: CreateLeadTaskRequest) => {
  const title = normalizeTitle(payload.title);
  if (!title) {
    throw new LeadTasksServiceError({
      message: "El titulo de la tarea es obligatorio.",
    });
  }

  const body: Record<string, unknown> = {
    title,
  };

  const normalizedDescription = typeof payload.description === "string" ? payload.description.trim() : payload.description;
  if (normalizedDescription === null) {
    body.description = null;
  } else if (typeof normalizedDescription === "string") {
    if (normalizedDescription) {
      body.description = normalizedDescription;
    }
  }

  const normalizedDueAt = normalizeDateTimePayload(payload.dueAt);
  if (normalizedDueAt !== undefined) {
    body.dueAt = normalizedDueAt;
  }

  return body;
};

const normalizeUpdatePayload = (payload: UpdateLeadTaskRequest) => {
  const body: Record<string, unknown> = {};

  if (typeof payload.title === "string") {
    const normalizedTitle = normalizeTitle(payload.title);
    if (!normalizedTitle) {
      throw new LeadTasksServiceError({
        message: "El titulo de la tarea no puede estar vacio.",
      });
    }
    body.title = normalizedTitle;
  }

  if (payload.description === null) {
    body.description = null;
  } else if (typeof payload.description === "string") {
    const normalizedDescription = payload.description.trim();
    body.description = normalizedDescription || null;
  }

  if (payload.dueAt !== undefined) {
    const normalizedDueAt = normalizeDateTimePayload(payload.dueAt);
    body.dueAt = normalizedDueAt ?? null;
  }

  if (Object.keys(body).length === 0) {
    throw new LeadTasksServiceError({
      message: "Debes cambiar al menos un campo de la tarea.",
    });
  }

  return body;
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

const leadTasksService: LeadTasksService = {
  async listByLead(leadId) {
    const response = await request<unknown>(LEAD_TASK_ENDPOINTS.byLead(leadId), {
      method: "GET",
    });

    return extractListSource(response).map((item, index) => normalizeTask(item, index));
  },
  async createByLead(leadId, payload) {
    const response = await request<unknown>(LEAD_TASK_ENDPOINTS.byLead(leadId), {
      method: "POST",
      body: JSON.stringify(normalizeCreatePayload(payload)),
    });

    return normalizeTask(extractItemSource(response));
  },
  async updateById(taskId, payload) {
    const response = await request<unknown>(LEAD_TASK_ENDPOINTS.byId(taskId), {
      method: "PATCH",
      body: JSON.stringify(normalizeUpdatePayload(payload)),
    });

    return normalizeTask(extractItemSource(response));
  },
  async updateStatusById(taskId, status) {
    const response = await request<unknown>(LEAD_TASK_ENDPOINTS.byIdStatus(taskId), {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    return normalizeTask(extractItemSource(response));
  },
};

export const leadTasksServiceErrors = {
  getMessage(error: unknown, fallback = "No se pudo procesar la solicitud de tareas.") {
    if (error instanceof LeadTasksServiceError) {
      return error.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return fallback;
  },
};

export default leadTasksService;
