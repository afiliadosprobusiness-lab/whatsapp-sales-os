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
    <header className="sticky top-0 z-30 bg-gradient-to-b from-slate-950/80 to-transparent backdrop-blur-sm">
      <div className="mx-auto w-full max-w-3xl px-4 pb-2 pt-3 sm:px-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <BrandLogo size="sm" className="border-cyan-300/20 bg-slate-950/60 shadow-none" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
            Paso {currentStep} de {totalSteps}
          </p>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800/90">
          <div
            className={cn("h-full rounded-full bg-gradient-to-r from-cyan-200 via-emerald-200 to-sky-200 transition-all duration-500")}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-400">{currentLabel}</p>
      </div>
    </header>
  );
}
