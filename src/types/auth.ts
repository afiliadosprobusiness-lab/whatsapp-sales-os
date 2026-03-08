export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "SELLER" | "VIEWER";
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

export interface AuthResponse {
  user: AuthUser;
}

export interface AuthErrorPayload {
  message: string;
  code?: string;
  fieldErrors?: Record<string, string>;
  status?: number;
}

export class AuthServiceError extends Error {
  code?: string;
  status?: number;
  fieldErrors?: Record<string, string>;

  constructor(payload: AuthErrorPayload) {
    super(payload.message);
    this.name = "AuthServiceError";
    this.code = payload.code;
    this.status = payload.status;
    this.fieldErrors = payload.fieldErrors;
  }
}

