import type { FunnelContent, FunnelStepMeta } from "@/types/funnel";

const checkoutFallbackUrl = "https://checkout.whatssalesrecovery.com/oferta-principal";

export const funnelSteps: FunnelStepMeta[] = [
  { id: "hero", label: "Inicio" },
  { id: "question", label: "Diagnóstico" },
  { id: "reinforcement", label: "Validación" },
  { id: "video", label: "Método" },
  { id: "authority", label: "Autoridad" },
  { id: "program", label: "Programa" },
  { id: "bonuses", label: "Bonos" },
  { id: "objections", label: "Objeciones" },
  { id: "socialProof", label: "Prueba social" },
  { id: "transition", label: "Preparando plan" },
  { id: "finalOffer", label: "Oferta final" },
];

export const funnelContent: FunnelContent = {
  checkoutUrl: import.meta.env.VITE_FUNNEL_CHECKOUT_URL ?? checkoutFallbackUrl,
  hero: {
    eyebrow: "Evaluación guiada de 2 minutos",
    title: "Descubre cómo recuperar ventas perdidas y cerrar más en WhatsApp sin perseguir chats todo el día",
    subtitle:
      "Este funnel te guía paso a paso para validar si tu negocio califica para el sistema comercial que ya están usando equipos de Perú y LATAM para vender con más control.",
    ctaLabel: "Continuar",
    supportPoints: [
      "Estrategia diseñada para operaciones reales de ecommerce y servicios.",
      "Sin herramientas complejas ni curva técnica larga.",
      "Enfocado en ingresos recuperados, no en métricas vacías.",
    ],
  },
  question: {
    id: "main_bottleneck",
    prompt: "¿Qué está frenando hoy tus cierres en WhatsApp?",
    helper: "Selecciona la opción que más se parece a tu situación actual.",
    options: [
      {
        id: "slow_follow_up",
        label: "Seguimiento lento o inconsistente",
        description: "Se enfrían leads porque nadie les da continuidad con prioridad clara.",
        scoreWeight: 30,
      },
      {
        id: "no_pipeline_visibility",
        label: "No tengo visibilidad del pipeline",
        description: "No sé qué oportunidades están por cerrarse y cuáles se van a perder.",
        scoreWeight: 25,
      },
      {
        id: "manual_operations",
        label: "Demasiado trabajo manual",
        description: "El equipo vive entre chats, notas sueltas y hojas de cálculo.",
        scoreWeight: 35,
      },
      {
        id: "weak_close_rate",
        label: "Muchos interesados, pocos cierres",
        description: "Hay volumen de conversaciones, pero falta un sistema para convertir mejor.",
        scoreWeight: 40,
      },
    ],
  },
  reinforcement: {
    title: "Perfecto. Tu caso sí tiene alto potencial de mejora en poco tiempo.",
    paragraph:
      "Con un flujo correcto de priorización, seguimiento y mensajes estratégicos, la mayoría de operaciones similares logra recuperar oportunidades que hoy se pierden por timing o falta de estructura.",
    ctaLabel: "Quiero ver el método",
  },
  video: {
    title: "Mira esta explicación corta antes de ver tu oferta",
    subtitle:
      "En este video verás el marco completo para pasar de conversaciones dispersas a un sistema comercial predecible.",
    srcUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    posterUrl: "https://images.unsplash.com/photo-1557682260-96773eb01377?auto=format&fit=crop&w=1200&q=80",
    ctaRevealPercent: 78,
    fallbackRevealSeconds: 30,
  },
  authority: {
    title: "Quién está detrás de este sistema",
    subtitle:
      "Somos un equipo especializado en operaciones comerciales conversacionales para negocios que venden por WhatsApp en LATAM.",
    bullets: [
      "Más de 150 implementaciones entre retail, ecommerce y servicios.",
      "Metodología enfocada en ejecución comercial diaria, no teoría.",
      "Playbooks aplicados por equipos de Perú, Colombia, México y Chile.",
      "Soporte con enfoque práctico para acelerar primeros resultados.",
    ],
  },
  program: {
    title: "Qué obtendrás dentro del programa",
    subtitle: "Un sistema completo para ordenar tu operación y empujar cierres desde la primera semana.",
    modules: [
      {
        title: "Módulo 1: Diagnóstico comercial y estructura base",
        description: "Mapeamos tu embudo actual, etapas reales y puntos de fuga de ingresos.",
        result: "Saldrás con un plan de ejecución semanal claro.",
      },
      {
        title: "Módulo 2: Seguimiento inteligente y priorización diaria",
        description: "Implementamos reglas para que cada lead tenga siguiente acción y responsable.",
        result: "Menos oportunidades olvidadas y más ritmo comercial.",
      },
      {
        title: "Módulo 3: Mensajería de cierre y recuperación",
        description: "Plantillas y secuencias para responder objeciones y recuperar conversaciones frías.",
        result: "Mejor tasa de respuesta y más ventas recuperadas.",
      },
    ],
  },
  bonuses: {
    title: "Bonos incluidos por tiempo limitado",
    subtitle: "Recibes recursos listos para ejecutar desde el día 1.",
    items: [
      {
        name: "Bono 1: Biblioteca de scripts de venta por etapa",
        description: "Mensajes listos para apertura, seguimiento, objeciones y cierre.",
        value: "Valor referencial: $197",
      },
      {
        name: "Bono 2: Plantilla de tablero comercial semanal",
        description: "Dashboard simple para medir avance por asesor y por etapa.",
        value: "Valor referencial: $147",
      },
      {
        name: "Bono 3: Guía de reactivación de leads dormidos",
        description: "Secuencias de recuperación para oportunidades sin respuesta.",
        value: "Valor referencial: $127",
      },
    ],
  },
  objections: {
    title: "Si estás pensando que esto puede ser difícil, lee esto",
    subtitle: "El sistema fue diseñado para implementación rápida en equipos reales.",
    items: [
      {
        title: "No necesitas herramientas caras",
        detail: "Puedes comenzar con tu stack actual y escalar gradualmente sin fricción técnica.",
      },
      {
        title: "No necesitas ser experto en automatización",
        detail: "Te damos estructura accionable y plantillas listas para operar desde cero.",
      },
      {
        title: "No importa si tu equipo es pequeño",
        detail: "El método funciona tanto para founders comerciales como para equipos de ventas en crecimiento.",
      },
      {
        title: "Sí puedes avanzar rápido",
        detail: "En pocos días tendrás claridad de prioridades y un proceso de seguimiento repetible.",
      },
    ],
  },
  socialProof: {
    title: "Casos reales con resultados claros",
    subtitle: "Operaciones que mejoraron cierre y recuperación al aplicar este enfoque.",
    testimonials: [
      {
        name: "Valeria Mendez",
        role: "Growth Manager · Moda Lima Store",
        result: "+31% en ventas recuperadas en 45 días",
        quote: "Pasamos de conversaciones sin control a un flujo diario con prioridades claras y cierre más consistente.",
      },
      {
        name: "Diego Palacios",
        role: "Head of Sales · ElectroHogar PE",
        result: "2.1x más seguimientos efectivos",
        quote: "Ahora cada asesor sabe qué lead atender primero y qué mensaje usar para destrabar la venta.",
      },
      {
        name: "Andrea Ruiz",
        role: "COO · Belleza Urbana",
        result: "+24% tasa de cierre en campañas de WhatsApp",
        quote: "La diferencia fue tener proceso: menos improvisación y más control del pipeline.",
      },
    ],
  },
  loading: {
    title: "Estamos preparando tu ruta recomendada",
    subtitle: "Ajustando plan, recursos y acceso prioritario según tus respuestas...",
  },
  finalOffer: {
    title: "Tu acceso está listo: activa hoy tu implementación guiada",
    subtitle: "Obtén el sistema completo + bonos + acompañamiento para empezar a ejecutar esta semana.",
    oldPrice: "$997",
    currentPrice: "$297",
    urgency: "Esta condición especial expira al finalizar esta sesión.",
    includes: [
      "Acceso al método completo paso a paso.",
      "Playbooks de seguimiento y recuperación por WhatsApp.",
      "Bonos de scripts, tablero semanal y guía de reactivación.",
      "Soporte inicial para acelerar tu implementación.",
    ],
    guarantee: "Garantía de 7 días: si no es para ti, puedes solicitar devolución dentro del plazo.",
  },
  faq: [
    {
      question: "¿Cuándo recibo acceso al programa?",
      answer: "El acceso se habilita inmediatamente después del checkout y podrás iniciar el mismo día.",
    },
    {
      question: "¿Funciona si todavía no tengo un equipo grande?",
      answer: "Sí. El sistema está pensado para founders, equipos pequeños y operaciones en fase de crecimiento.",
    },
    {
      question: "¿Necesito herramientas adicionales desde el inicio?",
      answer: "No. Puedes implementar la base con recursos simples y luego escalar según tu volumen.",
    },
    {
      question: "¿Esto reemplaza mi CRM actual?",
      answer: "No necesariamente. Puedes usarlo como capa de ejecución comercial sobre tu operación actual.",
    },
  ],
};
