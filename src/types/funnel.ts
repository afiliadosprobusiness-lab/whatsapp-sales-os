export type FunnelStepId =
  | "hero"
  | "question"
  | "reinforcement"
  | "video"
  | "authority"
  | "program"
  | "bonuses"
  | "objections"
  | "socialProof"
  | "transition"
  | "finalOffer";

export interface FunnelStepMeta {
  id: FunnelStepId;
  label: string;
}

export interface FunnelQuestionOption {
  id: string;
  label: string;
  description: string;
  scoreWeight: number;
}

export interface FunnelQuestion {
  id: string;
  prompt: string;
  helper?: string;
  options: FunnelQuestionOption[];
}

export interface FunnelVideoConfig {
  title: string;
  subtitle: string;
  srcUrl: string;
  posterUrl: string;
  ctaRevealPercent: number;
  fallbackRevealSeconds: number;
}

export interface AuthorityBlock {
  title: string;
  subtitle: string;
  bullets: string[];
}

export interface ProgramModule {
  title: string;
  description: string;
  result: string;
}

export interface BonusItem {
  name: string;
  description: string;
  value: string;
}

export interface ObjectionItem {
  title: string;
  detail: string;
}

export interface SocialProofItem {
  name: string;
  role: string;
  result: string;
  quote: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FinalOfferContent {
  title: string;
  subtitle: string;
  oldPrice: string;
  currentPrice: string;
  urgency: string;
  includes: string[];
  guarantee: string;
}

export interface FunnelContent {
  checkoutUrl: string;
  hero: {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    resultHighlight?: string;
    supportLine?: string;
    ctaLabel: string;
    mockupTitle?: string;
    mockupSubtitle?: string;
    supportPoints?: string[];
  };
  questionStep: {
    title: string;
    subtitle?: string;
    helper?: string;
    questions: FunnelQuestion[];
  };
  reinforcement: {
    title: string;
    paragraph: string;
    ctaLabel: string;
  };
  video: FunnelVideoConfig;
  authority: AuthorityBlock;
  program: {
    title: string;
    subtitle: string;
    modules: ProgramModule[];
  };
  bonuses: {
    title: string;
    subtitle: string;
    items: BonusItem[];
  };
  objections: {
    title: string;
    subtitle: string;
    items: ObjectionItem[];
  };
  socialProof: {
    title: string;
    subtitle: string;
    testimonials: SocialProofItem[];
  };
  loading: {
    title: string;
    subtitle: string;
  };
  finalOffer: FinalOfferContent;
  faq: FaqItem[];
}
