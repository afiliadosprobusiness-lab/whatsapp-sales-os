import type { FunnelContent, FunnelStepMeta } from "@/types/funnel";

const checkoutFallbackUrl = "https://checkout.whatssalesrecovery.com/oferta-principal";

export const funnelSteps: FunnelStepMeta[] = [
  { id: "hero", label: "Inicio" },
  { id: "question", label: "Filtro" },
  { id: "reinforcement", label: "Validacion" },
  { id: "video", label: "Metodo" },
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
    eyebrow: "Diagnostico guiado de 2 minutos",
    title: "Recupera ventas perdidas por WhatsApp",
    resultHighlight: "+US$3,000/mes en ventas recuperadas",
    supportLine: "Mas seguimiento. Mas cierres. Menos caos.",
    ctaLabel: "Continuar",
    mockupTitle: "Pipeline comercial en orden",
    mockupSubtitle: "Prioriza conversaciones con mayor probabilidad de cierre.",
  },
  questionStep: {
    title: "Validemos si tu negocio califica",
    subtitle: "Queremos entender tu operacion real para mostrarte el siguiente tramo correcto.",
    helper: "Responde rapido para ajustar mejor tu ruta recomendada.",
    questions: [
      {
        id: "wa_sales_channel",
        prompt: "Tu negocio ya usa WhatsApp para vender?",
        options: [
          {
            id: "wa_primary",
            label: "Si, es nuestro canal principal",
            description: "Gran parte de las oportunidades y cierres entran por WhatsApp.",
            scoreWeight: 40,
          },
          {
            id: "wa_underused",
            label: "Si, pero no lo aprovechamos bien",
            description: "Hay volumen, pero falta un proceso de conversion mas consistente.",
            scoreWeight: 35,
          },
          {
            id: "wa_sometimes",
            label: "Lo usamos a veces",
            description: "Solo se usa en ciertos casos y sin una operacion estable.",
            scoreWeight: 20,
          },
          {
            id: "wa_not_really",
            label: "No realmente",
            description: "Aun no es un canal central para el equipo comercial.",
            scoreWeight: 5,
          },
        ],
      },
      {
        id: "prospect_outcome",
        prompt: "Que pasa normalmente con los prospectos que te escriben?",
        options: [
          {
            id: "prospects_cool_down",
            label: "Algunos compran, pero muchos se enfrian",
            description: "Hay interes inicial, pero se pierde por falta de continuidad.",
            scoreWeight: 40,
          },
          {
            id: "late_response",
            label: "Respondemos tarde",
            description: "La demora afecta conversion y calidad percibida.",
            scoreWeight: 35,
          },
          {
            id: "followups_lost",
            label: "Se nos pierden seguimientos",
            description: "No hay una siguiente accion clara por oportunidad.",
            scoreWeight: 38,
          },
          {
            id: "no_process",
            label: "No tenemos un proceso claro",
            description: "El cierre depende del esfuerzo individual de cada asesor.",
            scoreWeight: 30,
          },
        ],
      },
      {
        id: "monthly_lost_ops",
        prompt: "Cuantas oportunidades puedes perder al mes por falta de seguimiento?",
        options: [
          {
            id: "lost_5_10",
            label: "5 a 10",
            description: "Ya representa una fuga comercial relevante.",
            scoreWeight: 24,
          },
          {
            id: "lost_10_30",
            label: "10 a 30",
            description: "Hay ingreso recuperable de forma consistente cada mes.",
            scoreWeight: 35,
          },
          {
            id: "lost_30_plus",
            label: "30+",
            description: "El potencial de recuperacion es alto y urgente.",
            scoreWeight: 45,
          },
          {
            id: "lost_unknown",
            label: "No lo se, pero se que pasa",
            description: "Falta visibilidad del pipeline y trazabilidad de seguimiento.",
            scoreWeight: 28,
          },
        ],
      },
      {
        id: "recovery_owner",
        prompt: "Hoy tienes una persona o sistema dedicado a recuperar esas ventas?",
        options: [
          {
            id: "owner_not_working",
            label: "Si, pero no funciona bien",
            description: "Hay intentos de recuperacion, pero sin proceso repetible.",
            scoreWeight: 32,
          },
          {
            id: "owner_manual",
            label: "No, todo es manual",
            description: "Se ejecuta por intuicion y disponibilidad diaria.",
            scoreWeight: 38,
          },
          {
            id: "owner_needed",
            label: "No, y lo necesitamos",
            description: "Existe urgencia de implementar un sistema comercial.",
            scoreWeight: 42,
          },
          {
            id: "owner_partial",
            label: "Parcialmente",
            description: "Hay piezas sueltas, pero falta estandarizar la operacion.",
            scoreWeight: 30,
          },
        ],
      },
      {
        id: "priority_outcome",
        prompt: "Que te interesa mas resolver primero?",
        options: [
          {
            id: "priority_recover_sales",
            label: "Recuperar ventas perdidas",
            description: "Impacto directo en caja y conversion mensual.",
            scoreWeight: 45,
          },
          {
            id: "priority_reply_fast",
            label: "Responder mas rapido",
            description: "Reducir tiempos muertos en conversaciones activas.",
            scoreWeight: 32,
          },
          {
            id: "priority_followup_process",
            label: "Hacer seguimiento sin olvidar leads",
            description: "Asegurar que cada oportunidad tenga una siguiente accion.",
            scoreWeight: 40,
          },
          {
            id: "priority_order_process",
            label: "Ordenar el proceso comercial",
            description: "Construir una base operativa para escalar resultados.",
            scoreWeight: 36,
          },
        ],
      },
    ],
  },
  reinforcement: {
    title: "Buen fit. Hay oportunidades claras de recuperacion en tu operacion.",
    paragraph:
      "Con seguimiento priorizado y ejecucion comercial diaria puedes recuperar ventas que hoy se enfrian por demora o falta de proceso.",
    ctaLabel: "Quiero ver el metodo",
  },
  video: {
    title: "Mira esta explicacion corta antes de ver tu oferta",
    subtitle:
      "En este video veras como pasar de conversaciones dispersas a un sistema comercial predecible.",
    srcUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    posterUrl: "https://images.unsplash.com/photo-1557682260-96773eb01377?auto=format&fit=crop&w=1200&q=80",
    ctaRevealPercent: 78,
    fallbackRevealSeconds: 30,
  },
  authority: {
    title: "Quien esta detras de este sistema",
    subtitle:
      "Somos un equipo especializado en operaciones comerciales conversacionales para negocios que venden por WhatsApp en LATAM.",
    bullets: [
      "Mas de 150 implementaciones entre retail, ecommerce y servicios.",
      "Metodologia enfocada en ejecucion comercial diaria, no teoria.",
      "Playbooks aplicados por equipos de Peru, Colombia, Mexico y Chile.",
      "Soporte practico para acelerar primeros resultados.",
    ],
  },
  program: {
    title: "Que obtendras dentro del programa",
    subtitle: "Un sistema completo para ordenar tu operacion y empujar cierres desde la primera semana.",
    modules: [
      {
        title: "Modulo 1: Diagnostico comercial y estructura base",
        description: "Mapeamos tu embudo actual, etapas reales y puntos de fuga de ingresos.",
        result: "Plan de ejecucion semanal claro.",
      },
      {
        title: "Modulo 2: Seguimiento inteligente y priorizacion diaria",
        description: "Implementamos reglas para que cada lead tenga siguiente accion y responsable.",
        result: "Menos oportunidades olvidadas y mas ritmo comercial.",
      },
      {
        title: "Modulo 3: Mensajeria de cierre y recuperacion",
        description: "Plantillas y secuencias para responder objeciones y recuperar conversaciones frias.",
        result: "Mejor tasa de respuesta y mas ventas recuperadas.",
      },
    ],
  },
  bonuses: {
    title: "Bonos incluidos por tiempo limitado",
    subtitle: "Recibes recursos listos para ejecutar desde el dia 1.",
    items: [
      {
        name: "Bono 1: Biblioteca de scripts de venta por etapa",
        description: "Mensajes listos para apertura, seguimiento, objeciones y cierre.",
        value: "Valor referencial: $197",
      },
      {
        name: "Bono 2: Plantilla de tablero comercial semanal",
        description: "Panel simple para medir avance por asesor y por etapa.",
        value: "Valor referencial: $147",
      },
      {
        name: "Bono 3: Guia de reactivacion de leads dormidos",
        description: "Secuencias de recuperacion para oportunidades sin respuesta.",
        value: "Valor referencial: $127",
      },
    ],
  },
  objections: {
    title: "Si dudas si esto es para ti, revisa esto",
    subtitle: "El sistema fue disenado para implementacion rapida en equipos reales.",
    items: [
      {
        title: "No necesitas herramientas caras",
        detail: "Puedes comenzar con tu stack actual y escalar gradualmente.",
      },
      {
        title: "No necesitas ser experto en automatizacion",
        detail: "Te damos estructura accionable y plantillas listas para operar.",
      },
      {
        title: "Funciona con equipos pequenos",
        detail: "Aplica para founders comerciales y equipos de ventas en crecimiento.",
      },
      {
        title: "Puedes avanzar rapido",
        detail: "En pocos dias tendras claridad de prioridades y proceso repetible.",
      },
    ],
  },
  socialProof: {
    title: "Casos reales con resultados claros",
    subtitle: "Operaciones que mejoraron cierre y recuperacion al aplicar este enfoque.",
    testimonials: [
      {
        name: "Valeria Mendez",
        role: "Growth Manager · Moda Lima Store",
        result: "+31% en ventas recuperadas en 45 dias",
        quote: "Pasamos de conversaciones sin control a un flujo diario con prioridades claras y cierre mas consistente.",
      },
      {
        name: "Diego Palacios",
        role: "Head of Sales · ElectroHogar PE",
        result: "2.1x mas seguimientos efectivos",
        quote: "Ahora cada asesor sabe que lead atender primero y que mensaje usar para destrabar la venta.",
      },
      {
        name: "Andrea Ruiz",
        role: "COO · Belleza Urbana",
        result: "+24% tasa de cierre en campanas de WhatsApp",
        quote: "La diferencia fue tener proceso: menos improvisacion y mas control del pipeline.",
      },
    ],
  },
  loading: {
    title: "Estamos preparando tu ruta recomendada",
    subtitle: "Ajustando plan, recursos y acceso prioritario segun tus respuestas...",
  },
  finalOffer: {
    title: "Tu acceso esta listo: activa hoy tu implementacion guiada",
    subtitle: "Obten el sistema completo + bonos + acompanamiento para empezar a ejecutar esta semana.",
    oldPrice: "$997",
    currentPrice: "$297",
    urgency: "Esta condicion especial expira al finalizar esta sesion.",
    includes: [
      "Acceso al metodo completo paso a paso.",
      "Playbooks de seguimiento y recuperacion por WhatsApp.",
      "Bonos de scripts, tablero semanal y guia de reactivacion.",
      "Soporte inicial para acelerar tu implementacion.",
    ],
    guarantee: "Garantia de 7 dias: si no es para ti, puedes solicitar devolucion dentro del plazo.",
  },
  faq: [
    {
      question: "Cuando recibo acceso al programa?",
      answer: "El acceso se habilita inmediatamente despues del checkout y podras iniciar el mismo dia.",
    },
    {
      question: "Funciona si todavia no tengo un equipo grande?",
      answer: "Si. El sistema esta pensado para founders, equipos pequenos y operaciones en crecimiento.",
    },
    {
      question: "Necesito herramientas adicionales desde el inicio?",
      answer: "No. Puedes implementar la base con recursos simples y luego escalar segun tu volumen.",
    },
    {
      question: "Esto reemplaza mi CRM actual?",
      answer: "No necesariamente. Puedes usarlo como capa de ejecucion comercial sobre tu operacion actual.",
    },
  ],
};
