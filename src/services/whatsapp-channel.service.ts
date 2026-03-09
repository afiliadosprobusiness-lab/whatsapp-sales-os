import {
  UpsertWhatsAppChannelRequest,
  WhatsAppChannel,
  WhatsAppChannelApiEnvelope,
  WhatsAppChannelApiErrorPayload,
} from "@/types/whatsapp-channel";

export class WhatsAppChannelServiceError extends Error {
  code?: string;
  status?: number;

  constructor(payload: { message: string; code?: string; status?: number }) {
    super(payload.message);
    this.name = "WhatsAppChannelServiceError";
    this.code = payload.code;
    this.status = payload.status;
  }
}

export interface WhatsAppChannelService {
  getCurrent(): Promise<WhatsAppChannel | null>;
  create(payload: UpsertWhatsAppChannelRequest): Promise<WhatsAppChannel>;
  update(channelId: string, payload: UpsertWhatsAppChannelRequest): Promise<WhatsAppChannel>;
}

export const whatsappChannelQueryKeys = {
  all: ["whatsapp-channel"] as const,
  current: () => [...whatsappChannelQueryKeys.all, "current"] as const,
};

const CHANNEL_ENDPOINTS = {
  current: "/channels/whatsapp",
  byId: (channelId: string) => `/channels/whatsapp/${channelId}`,
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

const isApiEnvelope = <TData>(value: unknown): value is WhatsAppChannelApiEnvelope<TData> =>
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

const STATUS_MAP: Record<string, string> = {
  ACTIVE: "ACTIVE",
  CONNECTED: "ACTIVE",
  ENABLED: "ACTIVE",
  READY: "ACTIVE",
  PAUSED: "PAUSED",
  PENDING: "PENDING",
  INACTIVE: "INACTIVE",
  DISABLED: "INACTIVE",
  DISCONNECTED: "DISCONNECTED",
  ERROR: "ERROR",
  FAILED: "ERROR",
};

const normalizeStatus = (value: unknown) => {
  const normalized = asString(value)?.toUpperCase().replace(/\s+/g, "_");
  if (!normalized) {
    return "UNKNOWN";
  }

  return STATUS_MAP[normalized] ?? normalized;
};

const normalizeChannel = (value: unknown): WhatsAppChannel | null => {
  if (!value) {
    return null;
  }

  if (!isObject(value)) {
    throw new WhatsAppChannelServiceError({
      message: "La respuesta del canal de WhatsApp no tiene un formato valido.",
    });
  }

  const id = asString(value.id) ?? asString(value.channelId);
  if (!id) {
    return null;
  }

  const provider =
    asString(value.provider) ??
    asString(value.providerName) ??
    asString(value.adapter) ??
    asString(value.vendor) ??
    "UNKNOWN";

  const metadata = isObject(value.metadata)
    ? value.metadata
    : isObject(value.config)
      ? value.config
      : undefined;

  return {
    id,
    provider: provider.toUpperCase(),
    status: normalizeStatus(value.status ?? value.state),
    displayName:
      asString(value.displayName) ??
      asString(value.name) ??
      asString(value.label) ??
      asString(value.alias) ??
      asString(metadata?.displayName),
    phoneNumber:
      asString(value.phoneNumber) ??
      asString(value.phone) ??
      asString(value.msisdn) ??
      asString(value.whatsappNumber) ??
      asString(metadata?.phoneNumber),
    createdAt: normalizeDate(value.createdAt),
    updatedAt: normalizeDate(value.updatedAt),
    metadata,
  };
};

const getDefaultErrorMessage = (status: number) => {
  if (status === 401) {
    return "Debes iniciar sesion para administrar el canal de WhatsApp.";
  }

  if (status === 404) {
    return "El modulo de canal de WhatsApp aun no esta disponible en este entorno.";
  }

  if (status === 501 || status === 503 || status === 504) {
    return "El canal de WhatsApp esta temporalmente no disponible por despliegue del backend.";
  }

  if (status >= 500) {
    return "El servicio de canal de WhatsApp no esta disponible temporalmente.";
  }

  return "No se pudo procesar la configuracion del canal de WhatsApp.";
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
    const errorPayload = payload.error as WhatsAppChannelApiErrorPayload;
    return new WhatsAppChannelServiceError({
      status,
      code: asString(errorPayload.code),
      message: asString(errorPayload.message) ?? getDefaultErrorMessage(status),
    });
  }

  if (isObject(payload)) {
    return new WhatsAppChannelServiceError({
      status,
      code: asString(payload.code),
      message: asString(payload.message) ?? getDefaultErrorMessage(status),
    });
  }

  return new WhatsAppChannelServiceError({
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

const extractChannelSource = (payload: unknown) => {
  if (!isObject(payload)) {
    return payload;
  }

  if ("channel" in payload) {
    return payload.channel;
  }

  if ("whatsappChannel" in payload) {
    return payload.whatsappChannel;
  }

  if ("integration" in payload) {
    return payload.integration;
  }

  if ("item" in payload) {
    return payload.item;
  }

  return payload;
};

const normalizePayload = (payload: UpsertWhatsAppChannelRequest, fallbackProvider = "YCLOUD") => {
  const body: Record<string, unknown> = {};

  const provider = payload.provider?.trim() || fallbackProvider;
  if (provider) {
    body.provider = provider.toUpperCase();
  }

  const status = payload.status?.trim();
  if (status) {
    body.status = status.toUpperCase();
  }

  const displayName = payload.displayName?.trim();
  if (displayName) {
    body.displayName = displayName;
  }

  const phoneNumber = payload.phoneNumber?.trim();
  if (phoneNumber) {
    body.phoneNumber = phoneNumber;
  }

  if (payload.metadata && isObject(payload.metadata) && Object.keys(payload.metadata).length > 0) {
    body.metadata = payload.metadata;
  }

  return body;
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
      throw new WhatsAppChannelServiceError({
        code: "TIMEOUT",
        message: "El backend no respondio a tiempo al consultar el canal de WhatsApp.",
      });
    }

    throw new WhatsAppChannelServiceError({
      code: "NETWORK_ERROR",
      message: "No pudimos conectar con el backend para el canal de WhatsApp.",
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

const whatsappChannelService: WhatsAppChannelService = {
  async getCurrent() {
    const response = await request<unknown>(CHANNEL_ENDPOINTS.current, {
      method: "GET",
    });

    return normalizeChannel(extractChannelSource(response));
  },
  async create(payload) {
    const response = await request<unknown>(CHANNEL_ENDPOINTS.current, {
      method: "POST",
      body: JSON.stringify(normalizePayload(payload)),
    });

    const normalized = normalizeChannel(extractChannelSource(response));
    if (!normalized) {
      throw new WhatsAppChannelServiceError({
        message: "No recibimos el canal de WhatsApp luego de guardar la configuracion.",
      });
    }

    return normalized;
  },
  async update(channelId, payload) {
    const response = await request<unknown>(CHANNEL_ENDPOINTS.byId(channelId), {
      method: "PATCH",
      body: JSON.stringify(normalizePayload(payload)),
    });

    const normalized = normalizeChannel(extractChannelSource(response));
    if (!normalized) {
      throw new WhatsAppChannelServiceError({
        message: "No recibimos el canal de WhatsApp actualizado.",
      });
    }

    return normalized;
  },
};

export const whatsappChannelServiceErrors = {
  isUnavailable(error: unknown) {
    if (!(error instanceof WhatsAppChannelServiceError)) {
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
  getMessage(error: unknown, fallback = "No se pudo procesar la configuracion del canal de WhatsApp.") {
    if (error instanceof WhatsAppChannelServiceError) {
      return error.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return fallback;
  },
};

export default whatsappChannelService;
