import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { clearSuperAdminSession, getSuperAdminSession, SUPERADMIN_EMAIL } from "@/lib/superadmin";
import { toast } from "@/components/ui/sonner";
import { Lock, LogOut, ShieldCheck, Trash2, UserPlus, Users } from "lucide-react";

type UserRole = "ADMIN" | "SELLER" | "VIEWER";
type UserPlan = "STARTER" | "PRO" | "BUSINESS";
type UserStatus = "ACTIVE" | "INVITED" | "PAUSED";

interface ManagedUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  plan: UserPlan;
  status: UserStatus;
  locked?: boolean;
}

const PLAN_OPTIONS: UserPlan[] = ["STARTER", "PRO", "BUSINESS"];

const PLAN_LABEL: Record<UserPlan, string> = {
  STARTER: "Starter",
  PRO: "Pro",
  BUSINESS: "Business",
};

const ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: "Admin",
  SELLER: "Seller",
  VIEWER: "Viewer",
};

const STATUS_LABEL: Record<UserStatus, string> = {
  ACTIVE: "Activo",
  INVITED: "Invitado",
  PAUSED: "Pausado",
};

const STATUS_BADGE: Record<UserStatus, string> = {
  ACTIVE: "ventrix-badge-success",
  INVITED: "ventrix-badge-info",
  PAUSED: "ventrix-badge-warning",
};

const initialUsers: ManagedUser[] = [
  {
    id: "user-superadmin",
    fullName: "Super Admin",
    email: SUPERADMIN_EMAIL,
    role: "ADMIN",
    plan: "BUSINESS",
    status: "ACTIVE",
    locked: true,
  },
  {
    id: "user-1",
    fullName: "Maria Rodriguez",
    email: "maria@tienda.co",
    role: "ADMIN",
    plan: "PRO",
    status: "ACTIVE",
  },
  {
    id: "user-2",
    fullName: "Carlos Lopez",
    email: "carlos@tienda.co",
    role: "SELLER",
    plan: "STARTER",
    status: "ACTIVE",
  },
  {
    id: "user-3",
    fullName: "Ana Martinez",
    email: "ana@tienda.co",
    role: "VIEWER",
    plan: "STARTER",
    status: "INVITED",
  },
];

export default function SuperAdmin() {
  const navigate = useNavigate();
  const session = useMemo(() => getSuperAdminSession(), []);

  const [users, setUsers] = useState<ManagedUser[]>(initialUsers);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("SELLER");
  const [plan, setPlan] = useState<UserPlan>("STARTER");

  const handleLogout = () => {
    clearSuperAdminSession();
    navigate("/login", { replace: true });
  };

  const handleCreateUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail) {
      toast.error("Nombre y email son obligatorios.");
      return;
    }

    const emailAlreadyExists = users.some((user) => user.email.toLowerCase() === normalizedEmail);
    if (emailAlreadyExists) {
      toast.error("Ese email ya existe.");
      return;
    }

    const nextUser: ManagedUser = {
      id: `user-${Date.now()}`,
      fullName: normalizedName,
      email: normalizedEmail,
      role,
      plan,
      status: "INVITED",
    };

    setUsers((prev) => [nextUser, ...prev]);
    setFullName("");
    setEmail("");
    setRole("SELLER");
    setPlan("STARTER");
    toast.success("Usuario creado.");
  };

  const handlePlanChange = (userId: string, nextPlan: UserPlan) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== userId) {
          return user;
        }

        if (user.locked) {
          return user;
        }

        return {
          ...user,
          plan: nextPlan,
        };
      }),
    );

    toast.success(`Plan actualizado a ${PLAN_LABEL[nextPlan]}.`);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => {
      const userToDelete = prev.find((user) => user.id === userId);
      if (!userToDelete) {
        return prev;
      }

      if (userToDelete.locked || userToDelete.email.toLowerCase() === SUPERADMIN_EMAIL) {
        toast.error("El superadmin no puede ser borrado por ningun metodo.");
        return prev;
      }

      const nextUsers = prev.filter((user) => user.id !== userId);
      toast.success("Usuario eliminado.");
      return nextUsers;
    });
  };

  const activeUsers = users.filter((user) => user.status === "ACTIVE").length;

  return (
    <div className="wsr-landing-bg relative min-h-screen overflow-x-hidden text-slate-100">
      <div className="wsr-orb wsr-orb-primary pointer-events-none" />
      <div className="wsr-orb wsr-orb-secondary pointer-events-none" />
      <div className="wsr-grid-overlay pointer-events-none absolute inset-0 opacity-35" />

      <header className="relative z-10 border-b border-slate-700/70 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-300/35 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-200">
              <ShieldCheck className="h-3 w-3" />
              Superadmin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <p className="hidden text-xs text-slate-300 md:block">{session?.email ?? SUPERADMIN_EMAIL}</p>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600/70 bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:border-rose-300/70 hover:text-rose-200"
            >
              <LogOut className="h-3.5 w-3.5" />
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <section className="wsr-section-shell rounded-3xl p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Gestion exclusiva</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-white md:text-4xl">Panel de usuarios</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Este panel solo gestiona usuarios: crear, cambiar plan en un clic y eliminar cuentas.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-slate-700/80 bg-slate-950/75 px-4 py-3">
                <p className="text-xs text-slate-400">Usuarios totales</p>
                <p className="mt-1 text-2xl font-semibold text-white">{users.length}</p>
              </div>
              <div className="rounded-xl border border-slate-700/80 bg-slate-950/75 px-4 py-3">
                <p className="text-xs text-slate-400">Usuarios activos</p>
                <p className="mt-1 text-2xl font-semibold text-white">{activeUsers}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-5 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-cyan-300" />
            <h2 className="font-display text-xl font-semibold text-white">Crear usuario</h2>
          </div>

          <form className="grid gap-3 md:grid-cols-5" onSubmit={handleCreateUser}>
            <input
              className="ventrix-input h-10 text-sm md:col-span-2"
              placeholder="Nombre completo"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
            <input
              className="ventrix-input h-10 text-sm md:col-span-2"
              placeholder="correo@empresa.com"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <select className="ventrix-input h-10 text-sm" value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
              <option value="ADMIN">Admin</option>
              <option value="SELLER">Seller</option>
              <option value="VIEWER">Viewer</option>
            </select>
            <select className="ventrix-input h-10 text-sm" value={plan} onChange={(event) => setPlan(event.target.value as UserPlan)}>
              <option value="STARTER">Starter</option>
              <option value="PRO">Pro</option>
              <option value="BUSINESS">Business</option>
            </select>
            <button type="submit" className="ventrix-btn-primary h-10 px-4 text-sm md:col-span-2">
              Crear usuario
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-5 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-cyan-300" />
            <h2 className="font-display text-xl font-semibold text-white">Usuarios administrados</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="ventrix-table min-w-[880px]">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Plan (1 clic)</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-semibold">
                          {user.fullName
                            .split(" ")
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((part) => part[0]?.toUpperCase() ?? "")
                            .join("") || "US"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-100 inline-flex items-center gap-1.5">
                            {user.fullName}
                            {user.locked ? <Lock className="h-3.5 w-3.5 text-emerald-300" /> : null}
                          </p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="ventrix-badge ventrix-badge-info text-[10px]">{ROLE_LABEL[user.role]}</span>
                    </td>
                    <td>
                      <span className={`ventrix-badge text-[10px] ${STATUS_BADGE[user.status]}`}>{STATUS_LABEL[user.status]}</span>
                    </td>
                    <td>
                      <div className="flex gap-1.5">
                        {PLAN_OPTIONS.map((planOption) => {
                          const isActive = user.plan === planOption;
                          return (
                            <button
                              key={planOption}
                              type="button"
                              disabled={Boolean(user.locked)}
                              onClick={() => handlePlanChange(user.id, planOption)}
                              className={`h-7 rounded-md border px-2 text-[10px] font-semibold transition-colors ${
                                isActive
                                  ? "border-cyan-300/70 bg-cyan-500/15 text-cyan-100"
                                  : "border-slate-600/70 bg-slate-900/70 text-slate-300 hover:border-cyan-300/50"
                              } disabled:opacity-45 disabled:cursor-not-allowed`}
                            >
                              {PLAN_LABEL[planOption]}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        disabled={Boolean(user.locked)}
                        onClick={() => handleDeleteUser(user.id)}
                        className="inline-flex items-center gap-1 rounded-md border border-rose-300/35 bg-rose-500/10 px-2.5 py-1 text-[10px] font-semibold text-rose-200 hover:bg-rose-500/20 disabled:opacity-45 disabled:cursor-not-allowed"
                        title={user.locked ? "El superadmin esta bloqueado" : "Eliminar usuario"}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
