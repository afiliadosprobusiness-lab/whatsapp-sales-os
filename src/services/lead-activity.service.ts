import {
  CreateLeadActivityRequest,
  LeadActivity,
  LeadActivityApiEnvelope,
  LeadActivityApiErrorPayload,
} from "@/types/lead-activity";

export class LeadActivityServiceError extends Error {
  code?: string;
  status?: number;

  constructor(payload: { message: string; code?: string; status?: number }) {
    super(payload.message);
    this.name = "LeadActivityServiceError";
    this.code = payload.code;
    this.status = payload.status;
  }
}

export interface LeadActivityService {
  list(leadId: string): Promise<LeadActivity[]>;
  create(leadId: string, payload: CreateLeadActivityRequest): Promise<LeadActivity>;
}

export const leadActivityQueryKeys = {
  all: ["lead-activity"] as const,
  lists: () => [...leadActivityQueryKeys.all, "list"] as const,
  list: (leadId: string) => [...leadActivityQueryKeys.lists(), leadId] as const,
};

const DEFAULT_API_URL = "https://backend-production-80db.up.railway.app";
const API_BASE_URL = (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_URL).replace(
  /\/$/,
  "",
);

const ACTIVITY_ENDPOINTS = {
  byLead: (leadId: string) => `/leads/${leadId}/activity`,
} as const;

const buildUrl = (path: string) => `${API_BASE_URL}${path}`;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isApiEnvelope = <TData>(value: unknown): value is LeadActivityApiEnvelope<TData> =>
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

const normalizeActivity = (value: unknown, index: number): LeadActivity => {
  if (!isObject(value)) {
    throw new LeadActivityServiceError({
      message: "La respuesta de actividad no tiene un formato valido.",
    });
  }

  const createdBy = isObject(value.createdBy) ? value.createdBy : null;
  const createdByName =
    asString(value.createdByName) ??
    (createdBy
      ? asString(createdBy.fullName) ??
        asString(createdBy.name) ??
        [asString(createdBy.firstName), asString(createdBy.lastName)].filter(Boolean).join(" ").trim()
      : undefined);

  const text =
    asString(value.text) ??
    asString(value.note) ??
    asString(value.message) ??
    asString(value.description) ??
    asString(value.title) ??
    "Actividad sin descripcion";

  return {
    id: asString(value.id) ?? `activity-${index + 1}`,
    leadId: asString(value.leadId),
    type: asString(value.type) ?? asString(value.kind) ?? "NOTE",
    text,
    createdAt: normalizeDate(value.createdAt ?? value.timestamp ?? value.date),
    createdByName: createdByName || undefined,
  };
};

const getDefaultErrorMessage = (status: number) => {
  if (status === 401) {
    return "Debes iniciar sesion para ver la actividad del lead.";
  }

  if (status === 404) {
    return "No se encontro actividad para el lead seleccionado.";
  }

  if (status >= 500) {
    return "El servicio de actividad no esta disponible temporalmente.";
  }

  return "No se pudo procesar la solicitud de actividad.";
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
    const errorPayload = payload.error as LeadActivityApiErrorPayload;
    return new LeadActivityServiceError({
      status,
      code: asString(errorPayload.code),
      message: asString(errorPayload.message) ?? getDefaultErrorMessage(status),
    });
  }

  if (isObject(payload)) {
    return new LeadActivityServiceError({
      status,
      code: asString(payload.code),
      message: asString(payload.message) ?? getDefaultErrorMessage(status),
    });
  }

  return new LeadActivityServiceError({
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

  if (Array.isArray(payload.activities)) {
    return payload.activities;
  }

  if (Array.isArray(payload.items)) {
    return payload.items;
  }

  if (Array.isArray(payload.results)) {
    return payload.results;
  }

  if (Array.isArray(payload.timeline)) {
    return payload.timeline;
  }

  return [];
};

const extractItemSource = (payload: unknown) => {
  if (!isObject(payload)) {
    return payload;
  }

  if ("activity" in payload) {
    return payload.activity;
  }

  if ("item" in payload) {
    return payload.item;
  }

  if ("event" in payload) {
    return payload.event;
  }

  return payload;
};

const normalizeCreatePayload = (payload: CreateLeadActivityRequest) => {
  const note = payload.note.trim();
  if (!note) {
    throw new LeadActivityServiceError({
      message: "La nota no puede estar vacia.",
    });
  }

  const normalizedType = payload.type?.trim() || "NOTE";

  return [
    { type: normalizedType, note },
    { type: normalizedType, text: note },
    { type: normalizedType, message: note },
  ];
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

const leadActivityService: LeadActivityService = {
  async list(leadId) {
    const response = await request<unknown>(ACTIVITY_ENDPOINTS.byLead(leadId), {
      method: "GET",
    });

    return extractListSource(response).map((activity, index) => normalizeActivity(activity, index));
  },
  async create(leadId, payload) {
    const candidates = normalizeCreatePayload(payload);
    let latestError: unknown = null;

    for (const candidate of candidates) {
      try {
        const response = await request<unknown>(ACTIVITY_ENDPOINTS.byLead(leadId), {
          method: "POST",
          body: JSON.stringify(candidate),
        });

        return normalizeActivity(extractItemSource(response), 0);
      } catch (error) {
        latestError = error;

        if (
          !(error instanceof LeadActivityServiceError) ||
          (error.status !== 400 && error.status !== 422) ||
          candidate === candidates[candidates.length - 1]
        ) {
          throw error;
        }
      }
    }

    throw latestError;
  },
};

export const leadActivityServiceErrors = {
  getMessage(error: unknown, fallback = "No se pudo procesar la solicitud de actividad.") {
    if (error instanceof LeadActivityServiceError) {
      return error.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return fallback;
  },
};

export default leadActivityService;
