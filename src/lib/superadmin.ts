const SUPERADMIN_SESSION_KEY = "wsr-superadmin-session-v1";

export const SUPERADMIN_EMAIL = "affiliadosprobusiness@gmail.com";
export const SUPERADMIN_PASSWORD = "V2-SuperAdmin!9042";

interface SuperAdminSessionPayload {
  email: string;
  createdAt: string;
}

const isBrowser = () => typeof window !== "undefined";

const normalizeEmail = (value: string) => value.trim().toLowerCase();

export const isSuperAdminCredentials = (email: string, password: string) =>
  normalizeEmail(email) === SUPERADMIN_EMAIL && password === SUPERADMIN_PASSWORD;

export const createSuperAdminSession = () => {
  if (!isBrowser()) {
    return;
  }

  const payload: SuperAdminSessionPayload = {
    email: SUPERADMIN_EMAIL,
    createdAt: new Date().toISOString(),
  };

  window.localStorage.setItem(SUPERADMIN_SESSION_KEY, JSON.stringify(payload));
};

export const clearSuperAdminSession = () => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(SUPERADMIN_SESSION_KEY);
};

export const getSuperAdminSession = (): SuperAdminSessionPayload | null => {
  if (!isBrowser()) {
    return null;
  }

  const rawSession = window.localStorage.getItem(SUPERADMIN_SESSION_KEY);
  if (!rawSession) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawSession) as Partial<SuperAdminSessionPayload>;
    if (normalizeEmail(parsed.email ?? "") !== SUPERADMIN_EMAIL) {
      return null;
    }

    return {
      email: SUPERADMIN_EMAIL,
      createdAt: typeof parsed.createdAt === "string" ? parsed.createdAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
};

export const hasSuperAdminSession = () => getSuperAdminSession() !== null;
