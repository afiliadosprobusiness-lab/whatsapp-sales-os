import type { PropsWithChildren, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FunnelStepCardProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  visual?: ReactNode;
  className?: string;
  centered?: boolean;
}

export function FunnelStepCard({ title, subtitle, visual, className, centered = false, children }: FunnelStepCardProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[1.85rem] bg-gradient-to-b from-slate-950/62 via-slate-950/45 to-slate-950/35 p-5 shadow-[0_28px_64px_rgba(2,6,23,0.45)] ring-1 ring-white/5 backdrop-blur-md sm:p-7",
        className,
      )}
    >
      <div className={cn("space-y-3", centered && "text-center")}>
        <h1 className="text-balance font-display text-2xl font-bold leading-tight text-white sm:text-3xl">{title}</h1>
        {subtitle ? (
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">{subtitle}</p>
        ) : null}
      </div>

      {visual ? <div className="mt-6">{visual}</div> : null}

      <div className="mt-6">{children}</div>
    </section>
  );
}
