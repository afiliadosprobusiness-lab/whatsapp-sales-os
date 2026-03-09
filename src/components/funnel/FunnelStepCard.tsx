import type { PropsWithChildren, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FunnelStepCardProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  visual?: ReactNode;
  className?: string;
}

export function FunnelStepCard({ title, subtitle, visual, className, children }: FunnelStepCardProps) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-slate-700/70 bg-gradient-to-b from-slate-900/90 to-slate-950/85 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.55)] sm:p-7",
        className,
      )}
    >
      <div className="space-y-3">
        <h1 className="text-balance font-display text-2xl font-bold leading-tight text-white sm:text-3xl">{title}</h1>
        {subtitle ? <p className="text-sm leading-relaxed text-slate-300 sm:text-base">{subtitle}</p> : null}
      </div>

      {visual ? <div className="mt-6">{visual}</div> : null}

      <div className="mt-6">{children}</div>
    </section>
  );
}
