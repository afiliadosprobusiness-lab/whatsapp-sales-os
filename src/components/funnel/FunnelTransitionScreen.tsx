import { LoaderCircle } from "lucide-react";

interface FunnelTransitionScreenProps {
  title: string;
  subtitle: string;
  progress: number;
}

export function FunnelTransitionScreen({ title, subtitle, progress }: FunnelTransitionScreenProps) {
  return (
    <section className="rounded-[1.85rem] bg-slate-950/45 p-7 text-center shadow-[0_24px_62px_rgba(8,47,73,0.28)] ring-1 ring-cyan-100/10 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-400/10 ring-1 ring-cyan-300/25">
        <LoaderCircle className="h-6 w-6 animate-spin text-cyan-200" />
      </div>
      <h2 className="mt-4 font-display text-2xl font-bold text-white">{title}</h2>
      <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
      <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-200 to-cyan-200 transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-cyan-100/90">{Math.round(progress)}% listo</p>
    </section>
  );
}
