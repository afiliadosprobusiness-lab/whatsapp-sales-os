import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Lock, PlayCircle, Volume2 } from "lucide-react";
import type { FunnelVideoConfig } from "@/types/funnel";

interface FunnelVideoStepProps {
  config: FunnelVideoConfig;
  videoProgress: number;
  ctaUnlocked: boolean;
  onProgressChange: (value: number) => void;
  onUnlock: () => void;
  onContinue: () => void;
}

export function FunnelVideoStep({
  config,
  videoProgress,
  ctaUnlocked,
  onProgressChange,
  onUnlock,
  onContinue,
}: FunnelVideoStepProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [started, setStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fallbackSeconds, setFallbackSeconds] = useState(0);

  useEffect(() => {
    if (!isPlaying || ctaUnlocked) {
      return;
    }

    const timer = window.setInterval(() => {
      setFallbackSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isPlaying, ctaUnlocked]);

  useEffect(() => {
    const fallbackPercent = (fallbackSeconds / config.fallbackRevealSeconds) * 100;
    const mergedProgress = Math.min(100, Math.max(videoProgress, fallbackPercent));

    if (mergedProgress > videoProgress) {
      onProgressChange(mergedProgress);
    }

    if (!ctaUnlocked && fallbackSeconds >= config.fallbackRevealSeconds) {
      onUnlock();
    }
  }, [
    ctaUnlocked,
    config.fallbackRevealSeconds,
    fallbackSeconds,
    onProgressChange,
    onUnlock,
    videoProgress,
  ]);

  const lockedPercent = useMemo(
    () => Math.max(0, config.ctaRevealPercent - Math.round(videoProgress)),
    [config.ctaRevealPercent, videoProgress],
  );

  const handleStartPlayback = async () => {
    const element = videoRef.current;
    setStarted(true);

    if (!element) {
      return;
    }

    try {
      await element.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const handleVideoProgress = () => {
    const element = videoRef.current;
    if (!element || !Number.isFinite(element.duration) || element.duration <= 0) {
      return;
    }

    const watchedPercent = (element.currentTime / element.duration) * 100;
    if (watchedPercent > videoProgress) {
      onProgressChange(Math.min(100, watchedPercent));
    }

    if (!ctaUnlocked && watchedPercent >= config.ctaRevealPercent) {
      onUnlock();
    }
  };

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950/90 shadow-[0_20px_55px_rgba(2,6,23,0.55)]">
        <div className="relative aspect-video">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            controls
            preload="metadata"
            playsInline
            poster={config.posterUrl}
            onTimeUpdate={handleVideoProgress}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setIsPlaying(false);
              onProgressChange(100);
              if (!ctaUnlocked) {
                onUnlock();
              }
            }}
          >
            <source src={config.srcUrl} type="video/mp4" />
          </video>

          {!started ? (
            <button
              type="button"
              onClick={handleStartPlayback}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950/72 px-6 text-center transition-colors hover:bg-slate-950/64"
            >
              <PlayCircle className="h-14 w-14 text-cyan-200" />
              <p className="text-base font-semibold text-white">Haz clic para escuchar la explicación completa</p>
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-cyan-200/85">
                <Volume2 className="h-4 w-4" />
                Activa el audio para captar el método completo
              </p>
            </button>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700/70 bg-slate-900/80 p-4">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
          <span>Progreso del video</span>
          <span>{Math.round(videoProgress)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300 transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, videoProgress))}%` }}
          />
        </div>
      </div>

      {ctaUnlocked ? (
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-300 to-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(45,212,191,0.35)]"
        >
          <CheckCircle2 className="h-4 w-4" />
          Continuar con mi plan
        </button>
      ) : (
        <div className="rounded-xl border border-slate-700/80 bg-slate-950/75 px-4 py-3 text-sm text-slate-300">
          <p className="inline-flex items-center gap-2 text-amber-200">
            <Lock className="h-4 w-4" />
            El acceso al siguiente paso se habilita al avanzar en el video.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Desbloqueo automático al llegar al {config.ctaRevealPercent}% o tras {config.fallbackRevealSeconds}s de
            reproducción continua. Falta aprox. {lockedPercent}%.
          </p>
        </div>
      )}
    </div>
  );
}
