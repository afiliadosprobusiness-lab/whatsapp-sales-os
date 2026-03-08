import {
  CreateLeadRequest,
  GetLeadsParams,
  Lead,
  LeadDetail,
  LeadPriority,
  LeadStatus,
  LeadsApiEnvelope,
  UpdateLeadRequest,
} from "@/types/leads";

interface LeadsApiErrorPayload {
  code?: string;
  message?: string;
  details?: unknown;
}

export class LeadsServiceError extends Error {
  code?: string;
  status?: number;

  constructor(payload: { message: string; code?: string; status?: number }) {
    super(payload.message);
    this.name = "LeadsServiceError";
    this.code = payload.code;
    this.status = payload.status;
  }
}

export interface LeadsService {
  list(params?: GetLeadsParams): Promise<Lead[]>;
  getById(leadId: string): Promise<LeadDetail>;
  create(payload: CreateLeadRequest): Promise<Lead>;
  update(leadId: string, payload: UpdateLeadRequest): Promise<Lead>;
  updateStatus(leadId: string, status: LeadStatus): Promise<Lead>;
}

export const leadsQueryKeys = {
  all: ["leads"] as const,
  lists: () => [...leadsQueryKeys.all, "list"] as const,
  list: (params: GetLeadsParams = {}) => [...leadsQueryKeys.lists(), params] as const,
  details: () => [...leadsQueryKeys.all, "detail"] as const,
  detail: (leadId: string) => [...leadsQueryKeys.details(), leadId] as const,
};

const LEADS_ENDPOINTS = {
  list: "/leads",
  byId: (leadId: string) => `/leads/${leadId}`,
  updateStatus: (leadId: string) => `/leads/${leadId}/status`,
} as const;

const DEFAULT_API_URL = "https://backend-production-80db.up.railway.app";
const API_BASE_URL = (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_URL).replace(
  /\/$/,
  "",
);

const buildUrl = (path: string) => `${API_BASE_URL}${path}`;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isApiEnvelope = <TData>(value: unknown): value is LeadsApiEnvelope<TData> =>
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

const STATUS_MAP: Record<string, LeadStatus> = {
  NEW: "NEW",
  NUEVO: "NEW",
  CONTACTED: "CONTACTED",
  CONTACTADO: "CONTACTED",
  INTERESTED: "INTERESTED",
  INTERESADO: "INTERESTED",
  FOLLOW_UP: "FOLLOW_UP",
  FOLLOWUP: "FOLLOW_UP",
  SEGUIMIENTO: "FOLLOW_UP",
  CLOSED: "CLOSED",
  CERRADO: "CLOSED",
  LOST: "LOST",
  PERDIDO: "LOST",
};

const PRIORITY_MAP: Record<string, LeadPriority> = {
  HIGH: "HIGH",
  ALTA: "HIGH",
  MEDIUM: "MEDIUM",
  MEDIA: "MEDIUM",
  LOW: "LOW",
  BAJA: "LOW",
};

const normalizeStatus = (value: unknown): LeadStatus => {
  const normalized = asString(value)?.toUpperCase().replace(/\s+/g, "_");
  if (!normalized) {
    return "NEW";
  }

  return STATUS_MAP[normalized] ?? "NEW";
};

const normalizePriority = (value: unknown): LeadPriority => {
  const normalized = asString(value)?.toUpperCase();
  if (!normalized) {
    return "MEDIUM";
  }

  return PRIORITY_MAP[normalized] ?? "MEDIUM";
};

const normalizeDate = (value: unknown): string | undefined => {
  const raw = asString(value);
  if (!raw) {
    return undefined;
  }

  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? raw : new Date(parsed).toISOString();
};

const normalizeOwner = (value: unknown) => {
  if (!isObject(value)) {
    const ownerName = asString(value);
    return ownerName ? { fullName: ownerName } : undefined;
  }

  const fullName =
    asString(value.fullName) ??
    asString(value.name) ??
    [asString(value.firstName), asString(value.lastName)].filter(Boolean).join(" ").trim();

  return {
    id: asString(value.id) ?? asString(value.userId),
    fullName: fullName || undefined,
    email: asString(value.email),
  };
};

const normalizeEstimatedValue = (value: Record<string, unknown>) => {
  const centsCandidate = asNumber(value.estimatedValueCents) ?? asNumber(value.valueCents);
  if (typeof centsCandidate === "number") {
    return Math.round(centsCandidate);
  }

  const amountCandidate = asNumber(value.estimatedValue) ?? asNumber(value.value);
  if (typeof amountCandidate === "number") {
    return Math.round(amountCandidate * 100);
  }

  return undefined;
};

const normalizeLead = (value: unknown): Lead => {
  if (!isObject(value)) {
    throw new LeadsServiceError({
      message: "La respuesta de leads no tiene un formato valido.",
    });
  }

  const name =
    asString(value.name) ??
    asString(value.fullName) ??
    asString(value.leadName) ??
    asString(value.email) ??
    "Lead sin nombre";
  const email = asString(value.email);

  return {
    id: asString(value.id) ?? asString(value.leadId) ?? `${name}-${email ?? "lead"}`.toLowerCase(),
    name,
    email,
    phone: asString(value.phone) ?? asString(value.whatsappNumber),
    status: normalizeStatus(value.status),
    priority: normalizePriority(value.priority),
    score: asNumber(value.score) ?? asNumber(value.leadScore) ?? 0,
    closeProbability: asNumber(value.closeProbability) ?? asNumber(value.probability) ?? asNumber(value.prob) ?? 0,
    estimatedValueCents: normalizeEstimatedValue(value),
    source: asString(value.source),
    owner:
      normalizeOwner(value.owner ?? value.assignedTo ?? value.assignee ?? value.ownerUser) ??
      normalizeOwner(value.ownerName),
    lastContactAt: normalizeDate(value.lastContactAt ?? value.lastMessageAt ?? value.updatedAt),
    notes: asString(value.notes) ?? asString(value.note) ?? asString(value.description),
  };
};

const normalizeTimeline = (timelineSource: unknown) => {
  if (!Array.isArray(timelineSource)) {
    return [];
  }

  return timelineSource
    .map((item, index) => {
      if (!isObject(item)) {
        return null;
      }

      const text =
        asString(item.text) ??
        asString(item.message) ??
        asString(item.description) ??
        asString(item.title) ??
        "Actualizacion del lead";

      return {
        id: asString(item.id) ?? `timeline-${index + 1}`,
        text,
        timestamp: normalizeDate(item.timestamp ?? item.createdAt ?? item.date),
        type: asString(item.type) ?? asString(item.kind),
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
};

const normalizeLeadDetail = (value: unknown): LeadDetail => {
  const lead = normalizeLead(value);
  const timelineSource = isObject(value)
    ? value.timeline ?? value.events ?? value.history ?? value.activities ?? []
    : [];

  return {
    ...lead,
    timeline: normalizeTimeline(timelineSource),
  };
};

const getDefaultErrorMessage = (status: number) => {
  if (status === 401) {
    return "Debes iniciar sesion para acceder a los leads.";
  }

  if (status === 404) {
    return "No se encontro el lead solicitado.";
  }

  if (status >= 500) {
    return "El servicio de leads no esta disponible temporalmente.";
  }

  return "No se pudo procesar la solicitud de leads.";
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
    const errorPayload = payload.error as LeadsApiErrorPayload;
    return new LeadsServiceError({
      status,
      code: asString(errorPayload.code),
      message: asString(errorPayload.message) ?? getDefaultErrorMessage(status),
    });
  }

  if (isObject(payload)) {
    return new LeadsServiceError({
      status,
      code: asString(payload.code),
      message: asString(payload.message) ?? getDefaultErrorMessage(status),
    });
  }

  return new LeadsServiceError({
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

const extractLeadListSource = (payload: unknown) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isObject(payload)) {
    return [];
  }

  if (Array.isArray(payload.leads)) {
    return payload.leads;
  }

  if (Array.isArray(payload.items)) {
    return payload.items;
  }

  if (Array.isArray(payload.results)) {
    return payload.results;
  }

  return [];
};

const extractLeadDetailSource = (payload: unknown) => {
  if (!isObject(payload)) {
    return payload;
  }

  if ("lead" in payload) {
    return payload.lead;
  }

  if ("item" in payload) {
    return payload.item;
  }

  return payload;
};

const normalizeCreatePayload = (payload: CreateLeadRequest) => {
  const normalizedName = payload.name.trim();
  if (!normalizedName) {
    throw new LeadsServiceError({
      message: "El nombre del lead es obligatorio.",
    });
  }

  const body: Record<string, unknown> = {
    name: normalizedName,
  };

  const normalizedEmail = payload.email?.trim().toLowerCase();
  const normalizedPhone = payload.phone?.trim();
  const normalizedSource = payload.source?.trim();
  const normalizedNotes = payload.notes?.trim();

  if (normalizedEmail) {
    body.email = normalizedEmail;
  }
  if (normalizedPhone) {
    body.phone = normalizedPhone;
  }
  if (payload.status) {
    body.status = payload.status;
  }
  if (payload.priority) {
    body.priority = payload.priority;
  }
  if (typeof payload.estimatedValueCents === "number" && Number.isFinite(payload.estimatedValueCents)) {
    body.estimatedValueCents = Math.round(payload.estimatedValueCents);
  }
  if (normalizedSource) {
    body.source = normalizedSource;
  }
  if (normalizedNotes) {
    body.notes = normalizedNotes;
  }

  return body;
};

const normalizeUpdatePayload = (payload: UpdateLeadRequest) => {
  const body: Record<string, unknown> = {};

  if (typeof payload.name === "string") {
    body.name = payload.name.trim();
  }
  if (typeof payload.email === "string") {
    body.email = payload.email.trim().toLowerCase();
  }
  if (typeof payload.phone === "string") {
    body.phone = payload.phone.trim();
  }
  if (payload.status) {
    body.status = payload.status;
  }
  if (payload.priority) {
    body.priority = payload.priority;
  }
  if (typeof payload.estimatedValueCents === "number" && Number.isFinite(payload.estimatedValueCents)) {
    body.estimatedValueCents = Math.round(payload.estimatedValueCents);
  }
  if (typeof payload.source === "string") {
    body.source = payload.source.trim();
  }
  if (typeof payload.notes === "string") {
    body.notes = payload.notes.trim();
  }

  return body;
};

const buildListPath = (params?: GetLeadsParams) => {
  if (!params) {
    return LEADS_ENDPOINTS.list;
  }

  const searchParams = new URLSearchParams();
  if (params.status) {
    searchParams.set("status", params.status);
  }
  if (params.priority) {
    searchParams.set("priority", params.priority);
  }
  if (params.owner) {
    searchParams.set("owner", params.owner);
  }
  if (params.query) {
    searchParams.set("query", params.query);
  }
  if (params.source) {
    searchParams.set("source", params.source);
  }

  const queryString = searchParams.toString();
  return queryString ? `${LEADS_ENDPOINTS.list}?${queryString}` : LEADS_ENDPOINTS.list;
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

const leadsService: LeadsService = {
  async list(params) {
    const response = await request<unknown>(buildListPath(params), {
      method: "GET",
    });

    const source = extractLeadListSource(response);
    return source.map(normalizeLead);
  },
  async getById(leadId) {
    const response = await request<unknown>(LEADS_ENDPOINTS.byId(leadId), {
      method: "GET",
    });

    return normalizeLeadDetail(extractLeadDetailSource(response));
  },
  async create(payload) {
    const response = await request<unknown>(LEADS_ENDPOINTS.list, {
      method: "POST",
      body: JSON.stringify(normalizeCreatePayload(payload)),
    });

    return normalizeLead(extractLeadDetailSource(response));
  },
  async update(leadId, payload) {
    const response = await request<unknown>(LEADS_ENDPOINTS.byId(leadId), {
      method: "PATCH",
      body: JSON.stringify(normalizeUpdatePayload(payload)),
    });

    return normalizeLead(extractLeadDetailSource(response));
  },
  async updateStatus(leadId, status) {
    const response = await request<unknown>(LEADS_ENDPOINTS.updateStatus(leadId), {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    return normalizeLead(extractLeadDetailSource(response));
  },
};

export const leadsServiceErrors = {
  getMessage(error: unknown, fallback = "No se pudo procesar la solicitud de leads.") {
    if (error instanceof LeadsServiceError) {
      return error.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return fallback;
  },
};

export default leadsService;
