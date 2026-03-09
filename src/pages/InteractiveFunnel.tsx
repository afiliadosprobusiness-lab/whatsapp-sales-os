import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CircleDollarSign, ShieldCheck, Star, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FunnelProgressHeader } from "@/components/funnel/FunnelProgressHeader";
import { FunnelStepCard } from "@/components/funnel/FunnelStepCard";
import { FunnelTransitionScreen } from "@/components/funnel/FunnelTransitionScreen";
import { FunnelVideoStep } from "@/components/funnel/FunnelVideoStep";
import { funnelContent, funnelSteps } from "@/data/funnel-content";
import type { FunnelQuestion, FunnelQuestionOption } from "@/types/funnel";

const FUNNEL_STORAGE_KEY = "wsr-interactive-funnel-v1";
const QUALIFICATION_DELAY_MS = 1450;
const QUESTION_ADVANCE_DELAY_MS = 160;
const FINAL_LOADING_MS = 2800;

interface StoredFunnelState {
  stepIndex: number;
  questionIndex: number;
  answers: Record<string, string>;
  videoProgress: number;
  videoUnlocked: boolean;
}

const stepAnimation = {
  initial: { opacity: 0, y: 18, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -12, scale: 0.985 },
};

const primaryCtaClass =
  "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-200 via-cyan-200 to-sky-200 px-6 py-4 text-base font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(125,211,252,0.35)]";

export default function InteractiveFunnel() {
  const qualificationTimeoutRef = useRef<number | null>(null);
  const questionAdvanceTimeoutRef = useRef<number | null>(null);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoUnlocked, setVideoUnlocked] = useState(false);
  const [isQualifying, setIsQualifying] = useState(false);
  const [qualificationProgress, setQualificationProgress] = useState(12);
  const [planProgress, setPlanProgress] = useState(8);

  const totalSteps = funnelSteps.length;
  const currentStep = funnelSteps[currentStepIndex];
  const questions = funnelContent.questionStep.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const currentQuestionAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  const qualificationScore = useMemo(() => {
    return questions.reduce((sum, question) => {
      const selectedOptionId = answers[question.id];
      const selectedOption = question.options.find((option) => option.id === selectedOptionId);
      return sum + (selectedOption?.scoreWeight ?? 0);
    }, 0);
  }, [answers, questions]);

  const maxQualificationScore = useMemo(
    () => questions.reduce((sum, question) => sum + Math.max(...question.options.map((option) => option.scoreWeight)), 0),
    [questions],
  );

  const qualificationPercent = maxQualificationScore > 0 ? Math.round((qualificationScore / maxQualificationScore) * 100) : 0;
  const answeredCount = useMemo(() => questions.filter((question) => Boolean(answers[question.id])).length, [answers, questions]);

  const diagnosisSummary = useMemo(() => {
    const answeredQuestions = questions.filter((question) => answers[question.id]);
    const lastQuestion = answeredQuestions[answeredQuestions.length - 1];
    if (!lastQuestion) {
      return "Sin respuestas todavia";
    }

    const selectedOption = lastQuestion.options.find((option) => option.id === answers[lastQuestion.id]);
    return selectedOption?.label ?? "Sin diagnostico";
  }, [answers, questions]);

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
      if (typeof parsed.questionIndex === "number") {
        setCurrentQuestionIndex(Math.min(Math.max(parsed.questionIndex, 0), Math.max(questions.length - 1, 0)));
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
  }, [questions.length, totalSteps]);

  useEffect(() => {
    const state: StoredFunnelState = {
      stepIndex: currentStepIndex,
      questionIndex: currentQuestionIndex,
      answers,
      videoProgress,
      videoUnlocked,
    };
    sessionStorage.setItem(FUNNEL_STORAGE_KEY, JSON.stringify(state));
  }, [answers, currentQuestionIndex, currentStepIndex, videoProgress, videoUnlocked]);

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
      if (questionAdvanceTimeoutRef.current) {
        window.clearTimeout(questionAdvanceTimeoutRef.current);
      }
    };
  }, []);

  const goNextStep = () => {
    setCurrentStepIndex((current) => Math.min(current + 1, totalSteps - 1));
  };

  const renderPrimaryButton = (label: string, onClick: () => void) => (
    <button type="button" onClick={onClick} className={primaryCtaClass}>
      {label}
      <ArrowRight className="h-4 w-4" />
    </button>
  );

  const startQualificationTransition = () => {
    setQualificationProgress(12);
    setIsQualifying(true);

    if (qualificationTimeoutRef.current) {
      window.clearTimeout(qualificationTimeoutRef.current);
    }

    qualificationTimeoutRef.current = window.setTimeout(() => {
      setQualificationProgress(100);
      setIsQualifying(false);
      setCurrentQuestionIndex(0);
      goNextStep();
    }, QUALIFICATION_DELAY_MS);
  };

  const handleQuestionAnswer = (question: FunnelQuestion, option: FunnelQuestionOption) => {
    setAnswers((current) => ({
      ...current,
      [question.id]: option.id,
    }));

    if (currentQuestionIndex < questions.length - 1) {
      if (questionAdvanceTimeoutRef.current) {
        window.clearTimeout(questionAdvanceTimeoutRef.current);
      }

      questionAdvanceTimeoutRef.current = window.setTimeout(() => {
        setCurrentQuestionIndex((current) => Math.min(current + 1, questions.length - 1));
      }, QUESTION_ADVANCE_DELAY_MS);
      return;
    }

    startQualificationTransition();
  };

  const resetFunnel = () => {
    setCurrentStepIndex(0);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setVideoProgress(0);
    setVideoUnlocked(false);
    setIsQualifying(false);
    setQualificationProgress(12);
    setPlanProgress(8);
    sessionStorage.removeItem(FUNNEL_STORAGE_KEY);
  };

  const renderHero = () => {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-190px)] w-full max-w-xl flex-col justify-between gap-8 px-1 pb-4 pt-2 text-center sm:min-h-[calc(100vh-210px)] sm:pt-5">
        <div>
          {funnelContent.hero.eyebrow ? (
            <p className="inline-flex rounded-full bg-white/5 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100 ring-1 ring-white/10">
              {funnelContent.hero.eyebrow}
            </p>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="relative mx-auto w-full max-w-[300px]">
            <div className="pointer-events-none absolute -inset-8 rounded-[2.6rem] bg-gradient-to-b from-cyan-300/20 via-sky-200/8 to-transparent blur-2xl" />
            <div className="relative rounded-[2.1rem] bg-slate-950/70 p-3 shadow-[0_22px_58px_rgba(2,6,23,0.55)] ring-1 ring-white/12">
              <div className="space-y-4 rounded-[1.65rem] bg-gradient-to-b from-slate-800/90 to-slate-900/90 p-4 text-left ring-1 ring-white/8">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-slate-300">
                  <span>WhatsSalesRecovery</span>
                  <span>Live</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="rounded-xl bg-white/8 px-3 py-2 text-slate-100">
                    Lead nuevo: quiere precio + envio hoy
                  </div>
                  <div className="rounded-xl bg-cyan-200/18 px-3 py-2 text-cyan-50">
                    Seguimiento enviado con oferta y cierre en 20 min
                  </div>
                  <div className="rounded-xl bg-white/8 px-3 py-2 text-slate-100">
                    Venta recuperada: US$180
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-balance font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl">
              {funnelContent.hero.title}
            </h1>
            {funnelContent.hero.resultHighlight ? (
              <p className="text-xl font-semibold text-cyan-100 sm:text-2xl">{funnelContent.hero.resultHighlight}</p>
            ) : null}
            {funnelContent.hero.supportLine ? (
              <p className="mx-auto max-w-sm text-sm text-slate-300 sm:text-base">{funnelContent.hero.supportLine}</p>
            ) : null}
          </div>
        </div>

        {renderPrimaryButton(funnelContent.hero.ctaLabel, goNextStep)}
      </section>
    );
  };

  const renderQuestionStep = () => {
    if (!currentQuestion) {
      return null;
    }

    return (
      <FunnelStepCard
        title={currentQuestion.prompt}
        subtitle={currentQuestion.helper ?? funnelContent.questionStep.helper}
        className="bg-slate-950/40 shadow-[0_24px_60px_rgba(2,6,23,0.35)]"
      >
        <div className="mb-4 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300">
          <span>
            Pregunta {currentQuestionIndex + 1}/{questions.length}
          </span>
          <span>{answeredCount} respondidas</span>
        </div>

        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = currentQuestionAnswer === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleQuestionAnswer(currentQuestion, option)}
                className={`group w-full rounded-2xl px-5 py-4 text-left transition-all duration-200 ${
                  isSelected
                    ? "bg-cyan-300/18 ring-1 ring-cyan-200/60"
                    : "bg-white/[0.04] ring-1 ring-white/10 hover:-translate-y-0.5 hover:bg-white/[0.08] hover:ring-cyan-100/35"
                }`}
              >
                <p className="text-base font-semibold text-white">{option.label}</p>
                <p className="mt-1 text-sm text-slate-300">{option.description}</p>
              </button>
            );
          })}
        </div>
      </FunnelStepCard>
    );
  };

  const renderStep = () => {
    if (isQualifying && currentStep.id === "question") {
      return (
        <FunnelTransitionScreen
          title="Analizando tu operacion comercial..."
          subtitle="Estamos ajustando la siguiente etapa para que sea 100% relevante para tu caso."
          progress={qualificationProgress}
        />
      );
    }

    switch (currentStep.id) {
      case "hero":
        return renderHero();

      case "question":
        return renderQuestionStep();

      case "reinforcement":
        return (
          <FunnelStepCard title={funnelContent.reinforcement.title} subtitle={funnelContent.reinforcement.paragraph} centered>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/[0.04] px-4 py-3 ring-1 ring-white/10">
                <p className="text-[11px] uppercase tracking-[0.12em] text-slate-300">Fit estimado</p>
                <p className="mt-1 text-2xl font-bold text-white">{qualificationPercent}%</p>
              </div>
              <div className="rounded-2xl bg-white/[0.04] px-4 py-3 ring-1 ring-white/10">
                <p className="text-[11px] uppercase tracking-[0.12em] text-slate-300">Respuestas</p>
                <p className="mt-1 text-2xl font-bold text-white">{answeredCount}/5</p>
              </div>
              <div className="rounded-2xl bg-cyan-200/12 px-4 py-3 ring-1 ring-cyan-200/25">
                <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-cyan-100">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Diagnostico
                </p>
                <p className="mt-1 text-sm font-medium text-white">{diagnosisSummary}</p>
              </div>
            </div>
            {renderPrimaryButton(funnelContent.reinforcement.ctaLabel, goNextStep)}
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
            <div className="space-y-3">
              {funnelContent.authority.bullets.map((bullet) => (
                <p key={bullet} className="inline-flex items-start gap-2 text-sm text-slate-200">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200" />
                  {bullet}
                </p>
              ))}
            </div>
            {renderPrimaryButton("Continuar", goNextStep)}
          </FunnelStepCard>
        );

      case "program":
        return (
          <FunnelStepCard title={funnelContent.program.title} subtitle={funnelContent.program.subtitle}>
            <div className="space-y-4">
              {funnelContent.program.modules.map((module) => (
                <article key={module.title} className="relative pl-5">
                  <span className="absolute left-0 top-1 h-[calc(100%-0.25rem)] w-[2px] rounded-full bg-gradient-to-b from-cyan-200 to-emerald-200" />
                  <h3 className="text-base font-semibold text-white">{module.title}</h3>
                  <p className="mt-1 text-sm text-slate-300">{module.description}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.1em] text-cyan-100">Resultado: {module.result}</p>
                </article>
              ))}
            </div>
            {renderPrimaryButton("Quiero los bonos", goNextStep)}
          </FunnelStepCard>
        );

      case "bonuses":
        return (
          <FunnelStepCard title={funnelContent.bonuses.title} subtitle={funnelContent.bonuses.subtitle}>
            <div className="space-y-3">
              {funnelContent.bonuses.items.map((bonus) => (
                <article key={bonus.name} className="rounded-2xl bg-white/[0.04] px-4 py-4 ring-1 ring-white/10">
                  <p className="text-base font-semibold text-white">{bonus.name}</p>
                  <p className="mt-1 text-sm text-slate-300">{bonus.description}</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.1em] text-emerald-200">{bonus.value}</p>
                </article>
              ))}
            </div>
            {renderPrimaryButton("Seguir con mi acceso", goNextStep)}
          </FunnelStepCard>
        );

      case "objections":
        return (
          <FunnelStepCard title={funnelContent.objections.title} subtitle={funnelContent.objections.subtitle}>
            <div className="space-y-4">
              {funnelContent.objections.items.map((item) => (
                <article key={item.title} className="pb-4 border-b border-white/10 last:border-b-0 last:pb-0">
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-300">{item.detail}</p>
                </article>
              ))}
            </div>
            {renderPrimaryButton("Ver casos reales", goNextStep)}
          </FunnelStepCard>
        );

      case "socialProof":
        return (
          <FunnelStepCard title={funnelContent.socialProof.title} subtitle={funnelContent.socialProof.subtitle}>
            <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max gap-3 pr-2">
                {funnelContent.socialProof.testimonials.map((testimonial) => (
                  <article key={testimonial.name} className="w-[290px] rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/12">
                    <p className="text-sm text-slate-200">"{testimonial.quote}"</p>
                    <p className="mt-4 text-base font-semibold text-white">{testimonial.name}</p>
                    <p className="text-xs text-slate-300">{testimonial.role}</p>
                    <p className="mt-3 text-xs font-medium uppercase tracking-[0.1em] text-cyan-100">
                      {testimonial.result}
                    </p>
                  </article>
                ))}
              </div>
            </div>
            {renderPrimaryButton("Ver oferta final", goNextStep)}
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
            <div className="rounded-2xl bg-emerald-200/10 p-4 ring-1 ring-emerald-200/30">
              <p className="text-xs uppercase tracking-[0.14em] text-emerald-100">Inversion hoy</p>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-2xl text-slate-400 line-through">{funnelContent.finalOffer.oldPrice}</span>
                <span className="font-display text-4xl font-bold text-white">{funnelContent.finalOffer.currentPrice}</span>
              </div>
              <p className="mt-2 text-sm text-emerald-100">{funnelContent.finalOffer.urgency}</p>
            </div>

            <div className="mt-4 space-y-2">
              {funnelContent.finalOffer.includes.map((item) => (
                <p key={item} className="inline-flex items-start gap-2 text-sm text-slate-200">
                  <CircleDollarSign className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200" />
                  {item}
                </p>
              ))}
            </div>

            <p className="mt-4 rounded-xl bg-cyan-200/12 px-3 py-2 text-xs text-cyan-100 ring-1 ring-cyan-200/25">
              {funnelContent.finalOffer.guarantee}
            </p>

            <a
              href={funnelContent.checkoutUrl}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-200 via-cyan-200 to-sky-200 px-6 py-4 text-base font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(125,211,252,0.35)]"
            >
              <Star className="h-4 w-4" />
              Ir al checkout seguro
            </a>

            <div className="mt-6 rounded-2xl bg-slate-950/40 px-4 ring-1 ring-white/10">
              <p className="pt-4 text-sm font-semibold text-white">Preguntas frecuentes</p>
              <Accordion type="single" collapsible>
                {funnelContent.faq.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`faq-${index}`} className="border-white/10">
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
                Reiniciar evaluacion
              </button>
              <Link to="/landing" className="underline underline-offset-4 hover:text-slate-200">
                Ver landing clasica
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
      <div className="funnel-grid-overlay pointer-events-none absolute inset-0" />
      <div className="funnel-orb funnel-orb-primary pointer-events-none" />
      <div className="funnel-orb funnel-orb-secondary pointer-events-none" />
      <div className="funnel-orb funnel-orb-tertiary pointer-events-none" />

      <FunnelProgressHeader currentStep={currentStepIndex + 1} totalSteps={totalSteps} currentLabel={currentStep.label} />

      <main className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={isQualifying ? "qualifying" : `${currentStep.id}-${currentQuestionIndex}`}
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
