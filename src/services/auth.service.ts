import {
  AuthApiEnvelope,
  AuthFieldErrors,
  AuthLoginRequest,
  AuthRegisterPayload,
  AuthRegisterRequest,
  AuthResponse,
  AuthRole,
  AuthServiceError,
  AuthUser,
} from "@/types/auth";

export interface AuthService {
  register(payload: AuthRegisterRequest): Promise<AuthResponse>;
  login(payload: AuthLoginRequest): Promise<AuthResponse>;
  logout(): Promise<void>;
  me(): Promise<AuthResponse>;
}

const AUTH_ENDPOINTS = {
  register: "/auth/register",
  login: "/auth/login",
  logout: "/auth/logout",
  me: "/auth/me",
} as const;

const DEFAULT_API_URL = "https://backend-production-80db.up.railway.app";
const API_BASE_URL = (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_URL).replace(
  /\/$/,
  "",
);

const VALID_ROLES: AuthRole[] = ["ADMIN", "SELLER", "VIEWER"];

const buildUrl = (path: string) => `${API_BASE_URL}${path}`;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isApiEnvelope = <TData>(value: unknown): value is AuthApiEnvelope<TData> =>
  isObject(value) && "data" in value && "error" in value;

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof AuthServiceError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

const buildAuthError = (error: unknown, fallback: string) => {
  if (error instanceof AuthServiceError) {
    return error;
  }

  if (error instanceof Error) {
    return new AuthServiceError({ message: error.message });
  }

  return new AuthServiceError({ message: fallback });
};

const normalizeFieldErrors = (details: unknown): AuthFieldErrors | undefined => {
  if (!isObject(details)) {
    return undefined;
  }

  const fieldErrorsCandidate =
    "fieldErrors" in details && isObject(details.fieldErrors) ? details.fieldErrors : details;

  if (!isObject(fieldErrorsCandidate)) {
    return undefined;
  }

  const normalized: AuthFieldErrors = {};

  for (const [key, value] of Object.entries(fieldErrorsCandidate)) {
    if (typeof value === "string" && value.trim().length > 0) {
      normalized[key] = value;
      continue;
    }

    if (Array.isArray(value)) {
      const firstMessage = value.find((item) => typeof item === "string" && item.trim().length > 0);
      if (typeof firstMessage === "string") {
        normalized[key] = firstMessage;
      }
    }
  }

  return Object.keys(normalized).length > 0 ? normalized : undefined;
};

async function parseJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

const getDefaultErrorMessage = (status: number) => {
  if (status === 401) {
    return "Authentication required.";
  }

  if (status >= 500) {
    return "Authentication service is temporarily unavailable.";
  }

  return "Authentication request failed.";
};

const toServiceError = (payload: unknown, status: number) => {
  if (isApiEnvelope(payload) && isObject(payload.error)) {
    const details = "details" in payload.error ? payload.error.details : undefined;
    return new AuthServiceError({
      status,
      code: typeof payload.error.code === "string" ? payload.error.code : undefined,
      message:
        typeof payload.error.message === "string" && payload.error.message.trim().length > 0
          ? payload.error.message
          : getDefaultErrorMessage(status),
      fieldErrors: normalizeFieldErrors(details),
    });
  }

  if (isObject(payload)) {
    const message =
      typeof payload.message === "string" && payload.message.trim().length > 0
        ? payload.message
        : getDefaultErrorMessage(status);
    const code = typeof payload.code === "string" ? payload.code : undefined;
    return new AuthServiceError({
      status,
      code,
      message,
      fieldErrors: normalizeFieldErrors(payload.details),
    });
  }

  return new AuthServiceError({
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

const asString = (value: unknown): string | undefined => (typeof value === "string" ? value.trim() : undefined);

const normalizeRole = (value: unknown): AuthRole => {
  if (typeof value === "string") {
    const candidate = value.toUpperCase();
    if (VALID_ROLES.includes(candidate as AuthRole)) {
      return candidate as AuthRole;
    }
  }

  return "ADMIN";
};

const normalizeUser = (value: unknown): AuthUser => {
  if (!isObject(value)) {
    throw new AuthServiceError({
      message: "Invalid authentication payload: user is missing.",
    });
  }

  const fullNameCandidate =
    asString(value.fullName) ??
    asString(value.name) ??
    [asString(value.firstName), asString(value.lastName)].filter(Boolean).join(" ").trim();

  const email = asString(value.email);

  if (!email) {
    throw new AuthServiceError({
      message: "Invalid authentication payload: email is missing.",
    });
  }

  return {
    id: asString(value.id) ?? asString(value.userId) ?? email,
    fullName: fullNameCandidate && fullNameCandidate.length > 0 ? fullNameCandidate : email,
    email,
    role: normalizeRole(value.role),
  };
};

const toAuthResponse = (payload: unknown): AuthResponse => {
  const userSource =
    isObject(payload) && "user" in payload
      ? payload.user
      : isObject(payload) && "account" in payload
        ? payload.account
        : payload;

  return { user: normalizeUser(userSource) };
};

const toRegisterPayload = (payload: AuthRegisterRequest): AuthRegisterPayload => ({
  name: payload.fullName.trim(),
  email: payload.email.trim().toLowerCase(),
  password: payload.password,
});

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

const authService: AuthService = {
  async register(payload) {
    const response = await request<unknown>(AUTH_ENDPOINTS.register, {
      method: "POST",
      body: JSON.stringify(toRegisterPayload(payload)),
    });

    return toAuthResponse(response);
  },
  async login(payload) {
    const response = await request<unknown>(AUTH_ENDPOINTS.login, {
      method: "POST",
      body: JSON.stringify({
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
      }),
    });

    return toAuthResponse(response);
  },
  async logout() {
    await request<void>(AUTH_ENDPOINTS.logout, {
      method: "POST",
    });
  },
  async me() {
    const response = await request<unknown>(AUTH_ENDPOINTS.me, {
      method: "GET",
    });

    return toAuthResponse(response);
  },
};

export const authServiceErrors = {
  getMessage(error: unknown, fallback = "Authentication request failed.") {
    return getErrorMessage(error, fallback);
  },
  normalize(error: unknown, fallback = "Authentication request failed.") {
    return buildAuthError(error, fallback);
  },
};

export default authService;
