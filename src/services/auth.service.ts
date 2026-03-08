import {
  AuthLoginRequest,
  AuthRegisterRequest,
  AuthResponse,
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

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const USE_MOCK_AUTH = import.meta.env.VITE_AUTH_MOCK !== "false";

const buildUrl = (path: string) => `${API_BASE_URL}${path}`;

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

async function parseJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildUrl(path), {
    credentials: "include",
    ...init,
    headers,
  });

  if (!response.ok) {
    const payload = await parseJson(response);
    const message =
      (payload &&
        typeof payload === "object" &&
        "message" in payload &&
        typeof payload.message === "string" &&
        payload.message) ||
      "No se pudo completar la solicitud de autenticación.";

    throw new AuthServiceError({
      message,
      status: response.status,
      code: payload && typeof payload === "object" && "code" in payload ? String(payload.code) : undefined,
      fieldErrors:
        payload &&
        typeof payload === "object" &&
        "fieldErrors" in payload &&
        payload.fieldErrors &&
        typeof payload.fieldErrors === "object"
          ? (payload.fieldErrors as Record<string, string>)
          : undefined,
    });
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

const apiAuthService: AuthService = {
  register(payload) {
    return request<AuthResponse>(AUTH_ENDPOINTS.register, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  login(payload) {
    return request<AuthResponse>(AUTH_ENDPOINTS.login, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  logout() {
    return request<void>(AUTH_ENDPOINTS.logout, {
      method: "POST",
    });
  },
  me() {
    return request<AuthResponse>(AUTH_ENDPOINTS.me, {
      method: "GET",
    });
  },
};

type MockUser = AuthUser & { password: string };

const demoUser: MockUser = {
  id: "usr_demo_1",
  fullName: "María Rodríguez",
  email: "demo@whatssalesrecovery.com",
  password: "Demo123456!",
  role: "ADMIN",
};

const mockUsers: MockUser[] = [demoUser];
let mockSessionUserId: string | null = null;

const toAuthUser = ({ password, ...user }: MockUser): AuthUser => user;

const wait = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));
const createMockUserId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? `usr_${crypto.randomUUID()}`
    : `usr_${Math.random().toString(36).slice(2, 10)}`;

const mockAuthService: AuthService = {
  async register(payload) {
    await wait();

    if (!payload.acceptTerms) {
      throw new AuthServiceError({
        message: "Debes aceptar los términos para crear tu cuenta.",
        fieldErrors: { acceptTerms: "required" },
        status: 400,
      });
    }

    if (payload.password !== payload.confirmPassword) {
      throw new AuthServiceError({
        message: "Las contraseñas no coinciden.",
        fieldErrors: { confirmPassword: "mismatch" },
        status: 400,
      });
    }

    const existingUser = mockUsers.find(
      (user) => user.email.toLowerCase() === payload.email.trim().toLowerCase(),
    );

    if (existingUser) {
      throw new AuthServiceError({
        message: "Este email ya está registrado.",
        fieldErrors: { email: "already_exists" },
        status: 409,
      });
    }

    const createdUser: MockUser = {
      id: createMockUserId(),
      fullName: payload.fullName.trim(),
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      role: "ADMIN",
    };

    mockUsers.push(createdUser);
    mockSessionUserId = createdUser.id;

    return { user: toAuthUser(createdUser) };
  },
  async login(payload) {
    await wait();

    const email = payload.email.trim().toLowerCase();
    const foundUser = mockUsers.find((user) => user.email === email);

    if (!foundUser || foundUser.password !== payload.password) {
      throw new AuthServiceError({
        message: "Credenciales inválidas. Revisa email y contraseña.",
        status: 401,
      });
    }

    mockSessionUserId = foundUser.id;

    return { user: toAuthUser(foundUser) };
  },
  async logout() {
    await wait(250);
    mockSessionUserId = null;
  },
  async me() {
    await wait(350);

    if (!mockSessionUserId) {
      throw new AuthServiceError({
        message: "No hay sesión activa.",
        status: 401,
      });
    }

    const sessionUser = mockUsers.find((user) => user.id === mockSessionUserId);

    if (!sessionUser) {
      mockSessionUserId = null;
      throw new AuthServiceError({
        message: "La sesión no es válida.",
        status: 401,
      });
    }

    return { user: toAuthUser(sessionUser) };
  },
};

const authService: AuthService = USE_MOCK_AUTH ? mockAuthService : apiAuthService;

export const authServiceErrors = {
  getMessage(error: unknown, fallback = "No se pudo procesar la autenticación.") {
    return getErrorMessage(error, fallback);
  },
  normalize(error: unknown, fallback = "No se pudo procesar la autenticación.") {
    return buildAuthError(error, fallback);
  },
};

export default authService;
