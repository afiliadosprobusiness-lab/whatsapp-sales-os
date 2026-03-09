import { LoaderCircle } from "lucide-react";

interface FunnelTransitionScreenProps {
  title: string;
  subtitle: string;
  progress: number;
}

export function FunnelTransitionScreen({ title, subtitle, progress }: FunnelTransitionScreenProps) {
  return (
    <section className="rounded-3xl border border-cyan-300/25 bg-gradient-to-br from-slate-900/95 via-slate-900/92 to-cyan-950/35 p-7 text-center shadow-[0_24px_70px_rgba(8,47,73,0.35)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-400/10">
        <LoaderCircle className="h-6 w-6 animate-spin text-cyan-200" />
      </div>
      <h2 className="mt-4 font-display text-2xl font-bold text-white">{title}</h2>
      <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
      <div className="mt-6 rounded-full border border-slate-700/70 bg-slate-950/80 p-1">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300 transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      </div>
      <p className="mt-2 text-xs text-cyan-100/90">{Math.round(progress)}% listo</p>
    </section>
  );
}
