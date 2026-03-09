import { LeadMessage, LeadMessagesApiEnvelope, LeadMessagesApiErrorPayload, SendLeadMessageRequest } from "@/types/lead-messages";

export class LeadMessagesServiceError extends Error {
  code?: string;
  status?: number;

  constructor(payload: { message: string; code?: string; status?: number }) {
    super(payload.message);
    this.name = "LeadMessagesServiceError";
    this.code = payload.code;
    this.status = payload.status;
  }
}

export interface LeadMessagesService {
  listFromLeadActivity(leadId: string): Promise<LeadMessage[]>;
  sendManual(leadId: string, payload: SendLeadMessageRequest): Promise<LeadMessage | null>;
}

export const leadMessagesQueryKeys = {
  all: ["lead-messages"] as const,
  lists: () => [...leadMessagesQueryKeys.all, "list"] as const,
  list: (leadId: string) => [...leadMessagesQueryKeys.lists(), leadId] as const,
};

const MESSAGES_ENDPOINTS = {
  leadActivity: (leadId: string) => `/leads/${leadId}/activity`,
  byLead: (leadId: string) => `/leads/${leadId}/messages`,
} as const;

const DEFAULT_API_URL = "https://backend-production-80db.up.railway.app";
const API_BASE_URL = (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_URL).replace(
  /\/$/,
  "",
);
const REQUEST_TIMEOUT_MS = 12000;

const buildUrl = (path: string) => `${API_BASE_URL}${path}`;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isApiEnvelope = <TData>(value: unknown): value is LeadMessagesApiEnvelope<TData> =>
  isObject(value) && "data" in value && "error" in value;

const asString = (value: unknown): string | undefined => (typeof value === "string" ? value.trim() : undefined);

const asBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") {
      return true;
    }
    if (normalized === "false") {
      return false;
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

const extractMessageDirection = (value: Record<string, unknown>) => {
  const metadata = isObject(value.metadata)
    ? value.metadata
    : isObject(value.payload)
      ? value.payload
      : undefined;

  const booleanFromMe =
    asBoolean(value.fromMe) ??
    asBoolean(value.isFromMe) ??
    asBoolean(value.outbound) ??
    asBoolean(metadata?.fromMe) ??
    asBoolean(metadata?.isFromMe);

  if (typeof booleanFromMe === "boolean") {
    return booleanFromMe ? "outbound" : "inbound";
  }

  const rawDirection =
    asString(value.direction) ??
    asString(value.messageDirection) ??
    asString(value.senderType) ??
    asString(value.authorType) ??
    asString(metadata?.direction) ??
    asString(metadata?.senderType) ??
    asString(metadata?.authorType);

  const normalizedDirection = rawDirection?.toUpperCase().replace(/\s+/g, "_");
  if (!normalizedDirection) {
    const typeHint = asString(value.type)?.toUpperCase() ?? "";
    if (typeHint.includes("INBOUND")) {
      return "inbound";
    }
    if (typeHint.includes("OUTBOUND")) {
      return "outbound";
    }

    return "unknown";
  }

  const inboundHints = ["INBOUND", "RECEIVED", "LEAD", "CUSTOMER", "CONTACT", "CLIENT"];
  if (inboundHints.some((hint) => normalizedDirection.includes(hint))) {
    return "inbound";
  }

  const outboundHints = ["OUTBOUND", "SENT", "AGENT", "BOT", "SYSTEM", "USER", "SELLER", "TEAM"];
  if (outboundHints.some((hint) => normalizedDirection.includes(hint))) {
    return "outbound";
  }

  return "unknown";
};

const normalizeMessage = (value: unknown, index: number): LeadMessage | null => {
  if (!isObject(value)) {
    return null;
  }

  const metadata = isObject(value.metadata)
    ? value.metadata
    : isObject(value.payload)
      ? value.payload
      : undefined;

  const text =
    asString(value.text) ??
    asString(value.body) ??
    asString(value.message) ??
    asString(value.content) ??
    asString(metadata?.text) ??
    asString(metadata?.body) ??
    asString(metadata?.message);

  if (!text) {
    return null;
  }

  const type = asString(value.type) ?? asString(value.kind) ?? asString(metadata?.type) ?? "MESSAGE";
  const normalizedType = type.toUpperCase();
  const channelValue =
    asString(value.channel) ??
    asString(value.channelType) ??
    asString(metadata?.channel) ??
    asString(metadata?.channelType) ??
    asString(value.provider);
  const normalizedChannel = channelValue?.toUpperCase() ?? "";
  const direction = extractMessageDirection(value);

  const looksLikeWhatsApp =
    normalizedChannel.includes("WHATSAPP") ||
    normalizedChannel.includes("YCLOUD") ||
    normalizedType.includes("WHATSAPP") ||
    normalizedType.includes("MESSAGE") ||
    direction !== "unknown";

  if (!looksLikeWhatsApp) {
    return null;
  }

  const authorName =
    asString(value.createdByName) ??
    asString(value.authorName) ??
    asString(value.senderName) ??
    asString(metadata?.authorName);

  return {
    id: asString(value.id) ?? asString(value.messageId) ?? `lead-message-${index + 1}`,
    leadId: asString(value.leadId),
    channel: "WHATSAPP",
    direction,
    text,
    createdAt: normalizeDate(value.createdAt ?? value.timestamp ?? value.date ?? metadata?.timestamp),
    status: asString(value.status) ?? asString(metadata?.status),
    authorName,
    providerMessageId: asString(value.providerMessageId) ?? asString(value.externalMessageId) ?? asString(metadata?.messageId),
    rawType: type,
    metadata,
  };
};

const sortByDateAsc = (messages: LeadMessage[]) =>
  [...messages].sort((left, right) => {
    const leftTime = left.createdAt ? Date.parse(left.createdAt) : Number.NaN;
    const rightTime = right.createdAt ? Date.parse(right.createdAt) : Number.NaN;

    if (Number.isNaN(leftTime) && Number.isNaN(rightTime)) {
      return left.id.localeCompare(right.id);
    }

    if (Number.isNaN(leftTime)) {
      return 1;
    }

    if (Number.isNaN(rightTime)) {
      return -1;
    }

    if (leftTime === rightTime) {
      return left.id.localeCompare(right.id);
    }

    return leftTime - rightTime;
  });

const getDefaultErrorMessage = (status: number) => {
  if (status === 401) {
    return "Debes iniciar sesion para acceder a los mensajes de WhatsApp.";
  }

  if (status === 404) {
    return "El modulo de mensajes de WhatsApp aun no esta disponible en este entorno.";
  }

  if (status === 501 || status === 503 || status === 504) {
    return "El servicio de mensajes de WhatsApp esta temporalmente no disponible por despliegue.";
  }

  if (status >= 500) {
    return "El servicio de mensajes no esta disponible temporalmente.";
  }

  return "No se pudo procesar la solicitud de mensajes de WhatsApp.";
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
    const errorPayload = payload.error as LeadMessagesApiErrorPayload;
    return new LeadMessagesServiceError({
      status,
      code: asString(errorPayload.code),
      message: asString(errorPayload.message) ?? getDefaultErrorMessage(status),
    });
  }

  if (isObject(payload)) {
    return new LeadMessagesServiceError({
      status,
      code: asString(payload.code),
      message: asString(payload.message) ?? getDefaultErrorMessage(status),
    });
  }

  return new LeadMessagesServiceError({
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

  if (Array.isArray(payload.events)) {
    return payload.events;
  }

  return [];
};

const extractItemSource = (payload: unknown) => {
  if (!isObject(payload)) {
    return payload;
  }

  if ("message" in payload) {
    return payload.message;
  }

  if ("item" in payload) {
    return payload.item;
  }

  if ("event" in payload) {
    return payload.event;
  }

  return payload;
};

const normalizeSendPayloadCandidates = (payload: SendLeadMessageRequest) => {
  const text = payload.text.trim();
  if (!text) {
    throw new LeadMessagesServiceError({
      message: "El mensaje no puede estar vacio.",
    });
  }

  const channel = payload.channel?.trim() || "WHATSAPP";
  const metadata = payload.metadata && isObject(payload.metadata) ? payload.metadata : undefined;

  const candidates: Array<Record<string, unknown>> = [
    {
      channel,
      text,
      metadata,
    },
    {
      channel,
      message: text,
      metadata,
    },
    {
      channel,
      body: text,
      metadata,
    },
  ];

  return candidates.map((candidate) => {
    const compactCandidate: Record<string, unknown> = {};
    Object.entries(candidate).forEach(([key, value]) => {
      if (value !== undefined) {
        compactCandidate[key] = value;
      }
    });

    return compactCandidate;
  });
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(buildUrl(path), {
      credentials: "include",
      ...init,
      headers,
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timeoutId);

    const isTimeoutError = error instanceof DOMException && error.name === "AbortError";
    if (isTimeoutError) {
      throw new LeadMessagesServiceError({
        code: "TIMEOUT",
        message: "El backend no respondio a tiempo para mensajes de WhatsApp.",
      });
    }

    throw new LeadMessagesServiceError({
      code: "NETWORK_ERROR",
      message: "No pudimos conectar con el backend para mensajes de WhatsApp.",
    });
  }

  clearTimeout(timeoutId);

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await parseJson(response);

  if (!response.ok) {
    throw toServiceError(payload, response.status);
  }

  return unwrapPayload<T>(payload);
}

const leadMessagesService: LeadMessagesService = {
  async listFromLeadActivity(leadId) {
    const response = await request<unknown>(MESSAGES_ENDPOINTS.leadActivity(leadId), {
      method: "GET",
    });

    const source = extractListSource(response);
    const normalizedMessages = source
      .map((messageLikeItem, index) => normalizeMessage(messageLikeItem, index))
      .filter((message): message is LeadMessage => message !== null);

    return sortByDateAsc(normalizedMessages);
  },
  async sendManual(leadId, payload) {
    const payloadCandidates = normalizeSendPayloadCandidates(payload);
    let latestError: unknown = null;

    for (const candidate of payloadCandidates) {
      try {
        const response = await request<unknown>(MESSAGES_ENDPOINTS.byLead(leadId), {
          method: "POST",
          body: JSON.stringify(candidate),
        });

        const normalizedMessage = normalizeMessage(extractItemSource(response), 0);
        return normalizedMessage;
      } catch (error) {
        latestError = error;

        if (
          !(error instanceof LeadMessagesServiceError) ||
          (error.status !== 400 && error.status !== 422) ||
          candidate === payloadCandidates[payloadCandidates.length - 1]
        ) {
          throw error;
        }
      }
    }

    throw latestError;
  },
};

export const leadMessagesServiceErrors = {
  isUnavailable(error: unknown) {
    if (!(error instanceof LeadMessagesServiceError)) {
      return false;
    }

    return (
      error.status === 404 ||
      error.status === 501 ||
      error.status === 503 ||
      error.status === 504 ||
      error.code === "TIMEOUT" ||
      error.code === "NETWORK_ERROR"
    );
  },
  getMessage(error: unknown, fallback = "No se pudo procesar la solicitud de mensajes de WhatsApp.") {
    if (error instanceof LeadMessagesServiceError) {
      return error.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return fallback;
  },
};

export default leadMessagesService;
