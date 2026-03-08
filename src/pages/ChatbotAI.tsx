import { DashboardLayout } from "@/components/DashboardLayout";
import { Bot, Zap, MessageSquare, Settings, Play, Pause, Plus } from "lucide-react";

const exampleConvo = [
  { from: "lead", text: "Hola, ¿cuánto cuesta?" },
  { from: "bot", text: "¡Hola! 👋 Nuestro producto tiene un precio de $1,200 MXN con envío gratis. ¿Te gustaría conocer más detalles?" },
  { from: "lead", text: "Es un poco caro..." },
  { from: "bot", text: "Entiendo tu preocupación. Muchos de nuestros clientes pensaron lo mismo, pero después de probarlo coinciden en que la calidad justifica la inversión. Además, hoy tenemos un 10% de descuento especial 🎉" },
  { from: "lead", text: "¿Cómo lo pago?" },
  { from: "bot", text: "¡Perfecto! Puedes pagar por transferencia, tarjeta o contra entrega. ¿Cuál prefieres? Te envío los datos al instante 🚀" },
];

const objections = [
  "Es muy caro",
  "Necesito pensarlo",
  "Ya compré en otro lado",
  "No tengo dinero ahora",
  "¿Tienen descuento?",
  "No estoy seguro/a",
];

const triggers = [
  { label: "Primer mensaje del lead", active: true },
  { label: "Sin respuesta en 30 min", active: true },
  { label: "Lead pregunta por precio", active: true },
  { label: "Objeción detectada", active: true },
  { label: "Lead pide descuento", active: false },
  { label: "Conversación abandonada 24h", active: true },
];

export default function ChatbotAI() {
  return (
    <DashboardLayout title="Chatbot IA">
      <div className="space-y-6 animate-fade-in">
        {/* Header card */}
        <div className="ventrix-card p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-lg">Asistente de ventas IA</h2>
              <p className="text-sm text-muted-foreground">Chatbot cerrador enfocado en conversión</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="ventrix-badge ventrix-badge-success flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Activo</span>
            <button className="ventrix-btn-secondary h-9 px-4 text-xs flex items-center gap-1.5"><Pause className="w-3.5 h-3.5" /> Pausar</button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Config */}
          <div className="space-y-5">
            <div className="ventrix-card p-5">
              <h3 className="font-display font-semibold mb-4">Configuración general</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nombre del asistente</label>
                  <input className="ventrix-input text-sm" defaultValue="Vendedor IA Ventrix" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Objetivo comercial</label>
                  <select className="ventrix-input text-sm">
                    <option>Cerrar ventas</option>
                    <option>Calificar leads</option>
                    <option>Agendar llamadas</option>
                    <option>Recuperar abandonados</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tono de comunicación</label>
                  <select className="ventrix-input text-sm">
                    <option>Amigable y profesional</option>
                    <option>Formal</option>
                    <option>Casual</option>
                    <option>Urgente</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Reglas de comportamiento</label>
                  <textarea className="ventrix-input h-24 py-2 resize-none text-sm" defaultValue="- Siempre saludar por nombre&#10;- Responder objeciones con empatía&#10;- Ofrecer descuento solo después de la segunda objeción&#10;- Crear urgencia con disponibilidad limitada&#10;- Nunca presionar agresivamente" />
                </div>
              </div>
            </div>

            <div className="ventrix-card p-5">
              <h3 className="font-display font-semibold mb-4">Objeciones frecuentes</h3>
              <div className="flex flex-wrap gap-2">
                {objections.map((o, i) => (
                  <span key={i} className="ventrix-badge ventrix-badge-warning text-xs">{o}</span>
                ))}
              </div>
              <button className="mt-3 text-xs text-primary font-medium flex items-center gap-1"><Plus className="w-3 h-3" /> Agregar objeción</button>
            </div>

            <div className="ventrix-card p-5">
              <h3 className="font-display font-semibold mb-4">Activadores</h3>
              <div className="space-y-2">
                {triggers.map((t, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="text-sm">{t.label}</span>
                    <div className={`w-9 h-5 rounded-full flex items-center cursor-pointer transition-colors ${t.active ? "bg-primary justify-end" : "bg-muted justify-start"}`}>
                      <div className="w-4 h-4 rounded-full bg-card shadow-sm mx-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-5">
            <div className="ventrix-card overflow-hidden">
              <div className="bg-sidebar p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5" style={{color:"hsl(160 84% 50%)"}} />
                  <span className="font-display font-semibold text-sm" style={{color:"hsl(0 0% 95%)"}}>Vista previa de conversación</span>
                </div>
                <button className="text-xs px-3 py-1 rounded-md" style={{background:"hsl(220 20% 14%)", color:"hsl(220 10% 70%)"}}>
                  <Play className="w-3 h-3 inline mr-1" />Simular
                </button>
              </div>
              <div className="p-4 space-y-3 bg-muted/30 max-h-96 overflow-y-auto">
                {exampleConvo.map((m, i) => (
                  <div key={i} className={`flex ${m.from === "bot" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-xs rounded-2xl px-4 py-2.5 text-sm ${
                      m.from === "bot"
                        ? "bg-card border rounded-bl-md"
                        : "bg-primary text-primary-foreground rounded-br-md"
                    }`}>
                      {m.from === "bot" && <div className="flex items-center gap-1 mb-1"><Zap className="w-3 h-3 text-primary" /><span className="text-[10px] text-primary font-medium">IA</span></div>}
                      <p>{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ventrix-card p-5">
              <h3 className="font-display font-semibold mb-4">Mensajes de ejemplo</h3>
              <div className="space-y-3">
                {[
                  { label: "Saludo inicial", text: "¡Hola {nombre}! 👋 Gracias por contactarnos. ¿En qué puedo ayudarte?" },
                  { label: "Respuesta a precio", text: "Nuestro {producto} tiene un precio de {precio} con envío gratis incluido. ¡Es de las mejores opciones del mercado!" },
                  { label: "Cierre", text: "¡Excelente elección! Para confirmar tu pedido solo necesito tu dirección de envío. ¿Me la compartes?" },
                ].map((m, i) => (
                  <div key={i} className="bg-muted/30 rounded-lg p-3">
                    <p className="text-[10px] font-semibold text-muted-foreground mb-1">{m.label}</p>
                    <p className="text-sm">{m.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="ventrix-card p-5">
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4" /> Configuración avanzada
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Tiempo de espera antes de responder", value: "3-8 segundos" },
                  { label: "Máximo de mensajes por conversación", value: "15" },
                  { label: "Escalar a humano después de", value: "3 objeciones" },
                  { label: "Idioma principal", value: "Español (LATAM)" },
                  { label: "Usar emojis", value: "Sí, moderado" },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="text-xs text-muted-foreground">{c.label}</span>
                    <span className="text-xs font-medium">{c.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
