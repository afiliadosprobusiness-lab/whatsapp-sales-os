import { BrandLogo } from "@/components/BrandLogo";
import { cn } from "@/lib/utils";

interface FunnelProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  currentLabel: string;
}

export function FunnelProgressHeader({ currentStep, totalSteps, currentLabel }: FunnelProgressHeaderProps) {
  const progress = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <header className="sticky top-0 z-30 border-b border-cyan-400/15 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-3xl px-4 pb-4 pt-3 sm:px-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <BrandLogo size="sm" className="border-cyan-400/35 bg-slate-900/95" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/90">
            Paso {currentStep} de {totalSteps}
          </p>
        </div>
        <div className="rounded-full border border-slate-700/80 bg-slate-900/85 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={cn(
                "h-full rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 transition-all duration-500",
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-300">{currentLabel}</p>
      </div>
    </header>
  );
}
