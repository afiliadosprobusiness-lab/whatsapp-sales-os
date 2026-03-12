export type AuthStatus = "idle" | "loading" | "success" | "error" | "unauthorized";

export type AuthRole = "ADMIN" | "SELLER" | "VIEWER";

export type AuthFieldErrors = Record<string, string>;

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: AuthRole;
}

export interface AuthLoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthRegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface AuthRegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
}

export interface AuthErrorPayload {
  message: string;
  code?: string;
  fieldErrors?: AuthFieldErrors;
  status?: number;
}

export interface AuthApiErrorPayload {
  code?: string;
  message?: string;
  details?: unknown;
}

export interface AuthApiEnvelope<TData> {
  data: TData | null;
  error: AuthApiErrorPayload | null;
}

export class AuthServiceError extends Error {
  code?: string;
  status?: number;
  fieldErrors?: AuthFieldErrors;

  constructor(payload: AuthErrorPayload) {
    super(payload.message);
    this.name = "AuthServiceError";
    this.code = payload.code;
    this.status = payload.status;
    this.fieldErrors = payload.fieldErrors;
  }
}
