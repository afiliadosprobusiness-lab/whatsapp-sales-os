export interface WorkspaceBranding {
  primaryColor?: string;
  logoUrl?: string;
  visibleName?: string;
}

export interface Workspace {
  id: string;
  name: string;
  industry?: string;
  country?: string;
  timezone?: string;
  description?: string;
  branding?: WorkspaceBranding;
}

export interface UpdateWorkspaceRequest {
  name: string;
  industry?: string;
  country?: string;
  timezone?: string;
  description?: string;
}

interface WorkspaceApiErrorPayload {
  code?: string;
  message?: string;
  details?: unknown;
}

interface WorkspaceApiEnvelope<TData> {
  data: TData | null;
  error: WorkspaceApiErrorPayload | null;
}

export class WorkspaceServiceError extends Error {
  code?: string;
  status?: number;

  constructor(payload: { message: string; code?: string; status?: number }) {
    super(payload.message);
    this.name = "WorkspaceServiceError";
    this.code = payload.code;
    this.status = payload.status;
  }
}

export interface WorkspaceService {
  me(): Promise<Workspace>;
  updateMe(payload: UpdateWorkspaceRequest): Promise<Workspace>;
}

export const workspaceQueryKeys = {
  all: ["workspace"] as const,
  me: () => [...workspaceQueryKeys.all, "me"] as const,
};

const WORKSPACE_ENDPOINTS = {
  me: "/workspace/me",
} as const;

const DEFAULT_API_URL = "https://backend-production-80db.up.railway.app";
const API_BASE_URL = (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_URL).replace(
  /\/$/,
  "",
);

const buildUrl = (path: string) => `${API_BASE_URL}${path}`;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isApiEnvelope = <TData>(value: unknown): value is WorkspaceApiEnvelope<TData> =>
  isObject(value) && "data" in value && "error" in value;

const asString = (value: unknown): string | undefined => (typeof value === "string" ? value.trim() : undefined);

const getDefaultErrorMessage = (status: number) => {
  if (status === 401) {
    return "Debes iniciar sesion para acceder al workspace.";
  }

  if (status === 404) {
    return "No se encontro el workspace actual.";
  }

  if (status >= 500) {
    return "El servicio de workspace no esta disponible temporalmente.";
  }

  return "No se pudo procesar la solicitud del workspace.";
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
    return new WorkspaceServiceError({
      status,
      code: asString(payload.error.code),
      message: asString(payload.error.message) ?? getDefaultErrorMessage(status),
    });
  }

  if (isObject(payload)) {
    return new WorkspaceServiceError({
      status,
      code: asString(payload.code),
      message: asString(payload.message) ?? getDefaultErrorMessage(status),
    });
  }

  return new WorkspaceServiceError({
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

const normalizeWorkspace = (value: unknown): Workspace => {
  if (!isObject(value)) {
    throw new WorkspaceServiceError({
      message: "La respuesta del workspace no tiene un formato valido.",
    });
  }

  const name = asString(value.name) ?? asString(value.visibleName) ?? asString(value.displayName);
  if (!name) {
    throw new WorkspaceServiceError({
      message: "La respuesta del workspace no incluye un nombre.",
    });
  }

  const branding = isObject(value.branding)
    ? {
        primaryColor: asString(value.branding.primaryColor),
        logoUrl: asString(value.branding.logoUrl),
        visibleName: asString(value.branding.visibleName),
      }
    : undefined;

  return {
    id: asString(value.id) ?? asString(value.workspaceId) ?? name.toLowerCase().replace(/\s+/g, "-"),
    name,
    industry: asString(value.industry),
    country: asString(value.country),
    timezone: asString(value.timezone),
    description: asString(value.description),
    branding,
  };
};

const extractWorkspaceSource = (payload: unknown) => {
  if (!isObject(payload)) {
    return payload;
  }

  if ("workspace" in payload) {
    return payload.workspace;
  }

  if ("currentWorkspace" in payload) {
    return payload.currentWorkspace;
  }

  return payload;
};

const normalizeUpdatePayload = (payload: UpdateWorkspaceRequest) => {
  const normalizedName = payload.name.trim();
  if (normalizedName.length === 0) {
    throw new WorkspaceServiceError({
      message: "El nombre del negocio es obligatorio.",
    });
  }

  return {
    name: normalizedName,
    industry: payload.industry?.trim() ?? "",
    country: payload.country?.trim() ?? "",
    timezone: payload.timezone?.trim() ?? "",
    description: payload.description?.trim() ?? "",
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

const workspaceService: WorkspaceService = {
  async me() {
    const response = await request<unknown>(WORKSPACE_ENDPOINTS.me, {
      method: "GET",
    });

    return normalizeWorkspace(extractWorkspaceSource(response));
  },
  async updateMe(payload) {
    const response = await request<unknown>(WORKSPACE_ENDPOINTS.me, {
      method: "PATCH",
      body: JSON.stringify(normalizeUpdatePayload(payload)),
    });

    return normalizeWorkspace(extractWorkspaceSource(response));
  },
};

export const workspaceServiceErrors = {
  getMessage(error: unknown, fallback = "No se pudo procesar la solicitud del workspace.") {
    if (error instanceof WorkspaceServiceError) {
      return error.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return fallback;
  },
};

export default workspaceService;
