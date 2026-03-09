import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FunnelProgressHeader } from "@/components/funnel/FunnelProgressHeader";
import { FunnelStepCard } from "@/components/funnel/FunnelStepCard";
import { FunnelTransitionScreen } from "@/components/funnel/FunnelTransitionScreen";
import { FunnelVideoStep } from "@/components/funnel/FunnelVideoStep";
import { funnelContent, funnelSteps } from "@/data/funnel-content";
import type { FunnelQuestionOption } from "@/types/funnel";

const FUNNEL_STORAGE_KEY = "wsr-interactive-funnel-v1";
const QUALIFICATION_DELAY_MS = 1450;
const FINAL_LOADING_MS = 2800;

interface StoredFunnelState {
  stepIndex: number;
  answers: Record<string, string>;
  videoProgress: number;
  videoUnlocked: boolean;
}

const stepAnimation = {
  initial: { opacity: 0, y: 18, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -12, scale: 0.985 },
};

export default function InteractiveFunnel() {
  const qualificationTimeoutRef = useRef<number | null>(null);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoUnlocked, setVideoUnlocked] = useState(false);
  const [isQualifying, setIsQualifying] = useState(false);
  const [qualificationProgress, setQualificationProgress] = useState(12);
  const [planProgress, setPlanProgress] = useState(8);

  const totalSteps = funnelSteps.length;
  const currentStep = funnelSteps[currentStepIndex];

  const selectedQuestionOption = useMemo(
    () => funnelContent.question.options.find((option) => option.id === answers[funnelContent.question.id]),
    [answers],
  );

  const qualificationScore = useMemo(() => {
    return Object.entries(answers).reduce((sum, [questionId, optionId]) => {
      if (questionId !== funnelContent.question.id) {
        return sum;
      }
      const option = funnelContent.question.options.find((item) => item.id === optionId);
      return sum + (option?.scoreWeight ?? 0);
    }, 0);
  }, [answers]);

  useEffect(() => {
    const rawState = sessionStorage.getItem(FUNNEL_STORAGE_KEY);
    if (!rawState) {
      return;
    }

    try {
      const parsed = JSON.parse(rawState) as StoredFunnelState;
      if (typeof parsed.stepIndex === "number" && parsed.stepIndex >= 0 && parsed.stepIndex < totalSteps) {
        setCurrentStepIndex(parsed.stepIndex);
      }
      if (parsed.answers && typeof parsed.answers === "object") {
        setAnswers(parsed.answers);
      }
      if (typeof parsed.videoProgress === "number") {
        setVideoProgress(Math.min(100, Math.max(0, parsed.videoProgress)));
      }
      if (typeof parsed.videoUnlocked === "boolean") {
        setVideoUnlocked(parsed.videoUnlocked);
      }
    } catch {
      sessionStorage.removeItem(FUNNEL_STORAGE_KEY);
    }
  }, [totalSteps]);

  useEffect(() => {
    const state: StoredFunnelState = {
      stepIndex: currentStepIndex,
      answers,
      videoProgress,
      videoUnlocked,
    };
    sessionStorage.setItem(FUNNEL_STORAGE_KEY, JSON.stringify(state));
  }, [answers, currentStepIndex, videoProgress, videoUnlocked]);

  useEffect(() => {
    if (!isQualifying) {
      return;
    }

    const interval = window.setInterval(() => {
      setQualificationProgress((current) => Math.min(92, current + 7));
    }, 120);

    return () => window.clearInterval(interval);
  }, [isQualifying]);

  useEffect(() => {
    if (currentStep.id !== "transition") {
      return;
    }

    setPlanProgress(8);
    const start = Date.now();
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const nextProgress = Math.min(100, (elapsed / FINAL_LOADING_MS) * 100);
      setPlanProgress(nextProgress);
    }, 60);

    const timeout = window.setTimeout(() => {
      setPlanProgress(100);
      setCurrentStepIndex((current) => Math.min(current + 1, totalSteps - 1));
    }, FINAL_LOADING_MS + 120);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [currentStep.id, totalSteps]);

  useEffect(() => {
    return () => {
      if (qualificationTimeoutRef.current) {
        window.clearTimeout(qualificationTimeoutRef.current);
      }
    };
  }, []);

  const goNextStep = () => {
    setCurrentStepIndex((current) => Math.min(current + 1, totalSteps - 1));
  };

  const handleQuestionAnswer = (option: FunnelQuestionOption) => {
    setAnswers((current) => ({
      ...current,
      [funnelContent.question.id]: option.id,
    }));

    setQualificationProgress(12);
    setIsQualifying(true);

    if (qualificationTimeoutRef.current) {
      window.clearTimeout(qualificationTimeoutRef.current);
    }

    qualificationTimeoutRef.current = window.setTimeout(() => {
      setQualificationProgress(100);
      setIsQualifying(false);
      goNextStep();
    }, QUALIFICATION_DELAY_MS);
  };

  const resetFunnel = () => {
    setCurrentStepIndex(0);
    setAnswers({});
    setVideoProgress(0);
    setVideoUnlocked(false);
    setIsQualifying(false);
    setQualificationProgress(12);
    setPlanProgress(8);
    sessionStorage.removeItem(FUNNEL_STORAGE_KEY);
  };

  const renderStep = () => {
    if (isQualifying && currentStep.id === "question") {
      return (
        <FunnelTransitionScreen
          title="Analizando tu situación comercial..."
          subtitle="Estamos ajustando la siguiente etapa para que sea 100% relevante para tu caso."
          progress={qualificationProgress}
        />
      );
    }

    switch (currentStep.id) {
      case "hero":
        return (
          <FunnelStepCard
            title={funnelContent.hero.title}
            subtitle={funnelContent.hero.subtitle}
            visual={
              <div className="grid gap-3 rounded-2xl border border-cyan-300/30 bg-cyan-400/10 p-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-700/80 bg-slate-900/80 p-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-cyan-200">Ingreso recuperable</p>
                  <p className="mt-1 text-2xl font-bold text-white">$12k+</p>
                  <p className="text-xs text-emerald-200">potencial mensual en operaciones similares</p>
                </div>
                <div className="rounded-xl border border-slate-700/80 bg-slate-900/80 p-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-cyan-200">Tiempo de puesta en marcha</p>
                  <p className="mt-1 text-2xl font-bold text-white">7 días</p>
                  <p className="text-xs text-emerald-200">para tener una base operativa ejecutable</p>
                </div>
                <div className="rounded-xl border border-slate-700/80 bg-slate-900/80 p-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-cyan-200">Orientado a cierre</p>
                  <p className="mt-1 text-2xl font-bold text-white">+Control</p>
                  <p className="text-xs text-emerald-200">menos improvisación, más seguimiento efectivo</p>
                </div>
              </div>
            }
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
              <Sparkles className="h-3.5 w-3.5" />
              {funnelContent.hero.eyebrow}
            </p>

            <div className="mt-4 space-y-2">
              {funnelContent.hero.supportPoints.map((point) => (
                <p key={point} className="inline-flex items-start gap-2 text-sm text-slate-200">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  {point}
                </p>
              ))}
            </div>

            <button
              type="button"
              onClick={goNextStep}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-300 to-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(45,212,191,0.35)]"
            >
              {funnelContent.hero.ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </button>
          </FunnelStepCard>
        );

      case "question":
        return (
          <FunnelStepCard title={funnelContent.question.prompt} subtitle={funnelContent.question.helper}>
            <div className="space-y-3">
              {funnelContent.question.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleQuestionAnswer(option)}
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/80 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-300/55 hover:bg-slate-900"
                >
                  <p className="text-base font-semibold text-white">{option.label}</p>
                  <p className="mt-1 text-sm text-slate-300">{option.description}</p>
                </button>
              ))}
            </div>
          </FunnelStepCard>
        );

      case "reinforcement":
        return (
          <FunnelStepCard title={funnelContent.reinforcement.title} subtitle={funnelContent.reinforcement.paragraph}>
            <div className="rounded-2xl border border-cyan-300/25 bg-cyan-400/10 p-4 text-sm text-cyan-100">
              <p className="inline-flex items-center gap-2 font-semibold">
                <TrendingUp className="h-4 w-4" />
                Diagnóstico actual: {selectedQuestionOption?.label ?? "Sin respuesta"}
              </p>
              <p className="mt-2 text-cyan-100/90">
                Puntaje de calificación inicial: {qualificationScore}/100. Esto se usará para personalizar versiones
                futuras del funnel sin romper el flujo actual.
              </p>
            </div>

            <button
              type="button"
              onClick={goNextStep}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-300 to-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(45,212,191,0.35)]"
            >
              {funnelContent.reinforcement.ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </button>
          </FunnelStepCard>
        );

      case "video":
        return (
          <FunnelStepCard title={funnelContent.video.title} subtitle={funnelContent.video.subtitle}>
            <FunnelVideoStep
              config={funnelContent.video}
              videoProgress={videoProgress}
              ctaUnlocked={videoUnlocked}
              onProgressChange={(value) => setVideoProgress((current) => Math.max(current, value))}
              onUnlock={() => setVideoUnlocked(true)}
              onContinue={goNextStep}
            />
          </FunnelStepCard>
        );

      case "authority":
        return (
          <FunnelStepCard title={funnelContent.authority.title} subtitle={funnelContent.authority.subtitle}>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/80 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-400/15 font-display text-lg font-bold text-cyan-100">
                  WR
                </div>
                <div>
                  <p className="font-semibold text-white">Equipo WhatsSalesRecovery</p>
                  <p className="text-xs text-slate-300">Especialistas en conversión comercial por WhatsApp</p>
                </div>
              </div>
              <div className="space-y-2">
                {funnelContent.authority.bullets.map((bullet) => (
                  <p key={bullet} className="inline-flex items-start gap-2 text-sm text-slate-200">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    {bullet}
                  </p>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={goNextStep}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-300 to-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(45,212,191,0.35)]"
            >
              Continuar
              <ArrowRight className="h-4 w-4" />
            </button>
          </FunnelStepCard>
        );

      case "program":
        return (
          <FunnelStepCard title={funnelContent.program.title} subtitle={funnelContent.program.subtitle}>
            <div className="space-y-3">
              {funnelContent.program.modules.map((module) => (
                <article
                  key={module.title}
                  className="rounded-2xl border border-slate-700/70 bg-slate-900/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                >
                  <h3 className="text-base font-semibold text-white">{module.title}</h3>
                  <p className="mt-1 text-sm text-slate-300">{module.description}</p>
                  <p className="mt-3 rounded-lg border border-cyan-300/25 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-100">
                    Resultado esperado: {module.result}
                  </p>
                </article>
              ))}
            </div>

            <button
              type="button"
              onClick={goNextStep}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-300 to-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(45,212,191,0.35)]"
            >
              Quiero los bonos
              <ArrowRight className="h-4 w-4" />
            </button>
          </FunnelStepCard>
        );

      case "bonuses":
        return (
          <FunnelStepCard title={funnelContent.bonuses.title} subtitle={funnelContent.bonuses.subtitle}>
            <div className="space-y-3">
              {funnelContent.bonuses.items.map((bonus) => (
                <article key={bonus.name} className="rounded-2xl border border-slate-700/70 bg-slate-900/80 p-4">
                  <p className="text-base font-semibold text-white">{bonus.name}</p>
                  <p className="mt-1 text-sm text-slate-300">{bonus.description}</p>
                  <p className="mt-3 inline-flex rounded-full border border-emerald-300/35 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                    {bonus.value}
                  </p>
                </article>
              ))}
            </div>

            <button
              type="button"
              onClick={goNextStep}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-300 to-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(45,212,191,0.35)]"
            >
              Seguir con mi acceso
              <ArrowRight className="h-4 w-4" />
            </button>
          </FunnelStepCard>
        );

      case "objections":
        return (
          <FunnelStepCard title={funnelContent.objections.title} subtitle={funnelContent.objections.subtitle}>
            <div className="space-y-3">
              {funnelContent.objections.items.map((item) => (
                <article key={item.title} className="rounded-2xl border border-slate-700/70 bg-slate-900/80 p-4">
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-300">{item.detail}</p>
                </article>
              ))}
            </div>

            <button
              type="button"
              onClick={goNextStep}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-300 to-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(45,212,191,0.35)]"
            >
              Ver casos reales
              <ArrowRight className="h-4 w-4" />
            </button>
          </FunnelStepCard>
        );

      case "socialProof":
        return (
          <FunnelStepCard title={funnelContent.socialProof.title} subtitle={funnelContent.socialProof.subtitle}>
            <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max gap-3 pr-2">
                {funnelContent.socialProof.testimonials.map((testimonial) => (
                  <article
                    key={testimonial.name}
                    className="w-[280px] rounded-2xl border border-slate-700/80 bg-slate-900/82 p-4 shadow-[0_14px_32px_rgba(2,6,23,0.45)]"
                  >
                    <p className="text-sm text-slate-200">"{testimonial.quote}"</p>
                    <p className="mt-4 text-base font-semibold text-white">{testimonial.name}</p>
                    <p className="text-xs text-slate-300">{testimonial.role}</p>
                    <p className="mt-3 inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
                      {testimonial.result}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={goNextStep}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-300 to-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(45,212,191,0.35)]"
            >
              Ver oferta final
              <ArrowRight className="h-4 w-4" />
            </button>
          </FunnelStepCard>
        );

      case "transition":
        return (
          <FunnelTransitionScreen
            title={funnelContent.loading.title}
            subtitle={funnelContent.loading.subtitle}
            progress={planProgress}
          />
        );

      case "finalOffer":
        return (
          <FunnelStepCard title={funnelContent.finalOffer.title} subtitle={funnelContent.finalOffer.subtitle}>
            <div className="rounded-2xl border border-emerald-300/25 bg-emerald-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-emerald-100">Inversión hoy</p>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-2xl text-slate-400 line-through">{funnelContent.finalOffer.oldPrice}</span>
                <span className="font-display text-4xl font-bold text-white">{funnelContent.finalOffer.currentPrice}</span>
              </div>
              <p className="mt-2 text-sm text-emerald-100">{funnelContent.finalOffer.urgency}</p>
            </div>

            <div className="mt-4 space-y-2">
              {funnelContent.finalOffer.includes.map((item) => (
                <p key={item} className="inline-flex items-start gap-2 text-sm text-slate-200">
                  <CircleDollarSign className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  {item}
                </p>
              ))}
            </div>

            <p className="mt-4 rounded-xl border border-cyan-300/25 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-100">
              {funnelContent.finalOffer.guarantee}
            </p>

            <a
              href={funnelContent.checkoutUrl}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-300 to-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(45,212,191,0.35)]"
            >
              <Star className="h-4 w-4" />
              Ir al checkout seguro
            </a>

            <div className="mt-6 rounded-2xl border border-slate-700/75 bg-slate-900/82 px-4">
              <p className="pt-4 text-sm font-semibold text-white">Preguntas frecuentes</p>
              <Accordion type="single" collapsible>
                {funnelContent.faq.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`faq-${index}`} className="border-slate-700/70">
                    <AccordionTrigger className="text-left text-sm text-slate-100 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-slate-300">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="mt-4 flex flex-col gap-2 text-center text-xs text-slate-400">
              <button type="button" onClick={resetFunnel} className="underline underline-offset-4 hover:text-slate-200">
                Reiniciar evaluación
              </button>
              <Link to="/landing" className="underline underline-offset-4 hover:text-slate-200">
                Ver landing clásica
              </Link>
            </div>
          </FunnelStepCard>
        );

      default:
        return null;
    }
  };

  return (
    <div className="funnel-root-bg relative min-h-screen overflow-x-hidden text-slate-100">
      <div className="funnel-grid-overlay pointer-events-none absolute inset-0 opacity-45" />
      <div className="funnel-orb funnel-orb-primary pointer-events-none" />
      <div className="funnel-orb funnel-orb-secondary pointer-events-none" />
      <div className="funnel-orb funnel-orb-tertiary pointer-events-none" />

      <FunnelProgressHeader
        currentStep={currentStepIndex + 1}
        totalSteps={totalSteps}
        currentLabel={currentStep.label}
      />

      <main className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={isQualifying ? "qualifying" : currentStep.id}
            variants={stepAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
