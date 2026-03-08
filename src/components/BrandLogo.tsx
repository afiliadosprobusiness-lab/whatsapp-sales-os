import { cn } from "@/lib/utils";

type BrandLogoSize = "sm" | "md";

interface BrandLogoProps {
  className?: string;
  size?: BrandLogoSize;
}

export function BrandLogo({ className, size = "md" }: BrandLogoProps) {
  const iconSize = size === "sm" ? "h-6 w-6" : "h-7 w-7";
  const glyphSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const textSize = size === "sm" ? "text-sm" : "text-base";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-cyan-500/35 bg-[#021129] px-1.5 py-1 shadow-[0_8px_24px_rgba(0,12,30,0.35)]",
        className,
      )}
    >
      <span
        className={cn(
          "grid place-items-center rounded-md border border-cyan-500/45 bg-[#031a3b]",
          iconSize,
        )}
      >
        <img src="/favicon.svg" alt="Logo de WhatsSalesRecovery" className={glyphSize} loading="eager" />
      </span>
      <span className={cn("font-display font-semibold leading-none tracking-tight text-slate-100", textSize)}>
        WhatsSalesRecovery
      </span>
    </div>
  );
}
