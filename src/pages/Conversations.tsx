import { DashboardLayout } from "@/components/DashboardLayout";
import { Search, Phone, Star, Tag, MoreHorizontal, Send, Paperclip, Smile, Zap, User } from "lucide-react";

const conversations = [
  { name: "Ana García", preview: "Me interesa el paquete premium, ¿tienen...", time: "2 min", unread: 2, status: "Caliente" },
  { name: "Pedro Martínez", preview: "¿Cuánto cuesta el envío a Guadalajara?", time: "15 min", unread: 1, status: "Nuevo" },
  { name: "Laura Sánchez", preview: "Déjame pensarlo y te aviso", time: "1h", unread: 0, status: "Tibio" },
  { name: "Carlos Mendoza", preview: "Sí, me interesa. ¿Cómo pago?", time: "2h", unread: 0, status: "Caliente" },
  { name: "Diana López", preview: "Hola, vi su anuncio en Instagram", time: "3h", unread: 0, status: "Nuevo" },
  { name: "Roberto Díaz", preview: "Perfecto, ya hice la transferencia", time: "5h", unread: 0, status: "Cerrado" },
  { name: "Fernanda Ruiz", preview: "No gracias, ya compré en otro lado", time: "1d", unread: 0, status: "Perdido" },
  { name: "Miguel Torres", preview: "¿Tienen disponible en talla M?", time: "1d", unread: 0, status: "Tibio" },
];

const messages = [
  { from: "lead", text: "Hola, vi su anuncio del paquete premium. ¿Cuánto cuesta?", time: "10:23 AM" },
  { from: "agent", text: "¡Hola Ana! 👋 Gracias por tu interés. El paquete premium tiene un precio de $3,200 MXN e incluye envío gratis.", time: "10:25 AM" },
  { from: "lead", text: "¿Tienen algún descuento por compra de 3 unidades?", time: "10:28 AM" },
  { from: "agent", text: "¡Claro! Para 3 unidades te podemos hacer un 15% de descuento. Quedaría en $8,160 en total (ahorro de $1,440).", time: "10:30 AM" },
  { from: "lead", text: "Me interesa, pero necesito consultarlo con mi socio. ¿Puedo confirmar mañana?", time: "10:35 AM" },
  { from: "agent", text: "Por supuesto, sin problema. Te escribo mañana para confirmar. ¡El descuento se mantiene hasta el viernes! 🙌", time: "10:36 AM" },
];

const suggestions = [
  "Enviar recordatorio del descuento",
  "Preguntar si necesita más información",
  "Ofrecer muestra gratis",
  "Compartir testimonios de clientes",
];

const statusDot: Record<string, string> = {
  "Caliente": "bg-primary",
  "Nuevo": "bg-info",
  "Tibio": "bg-warning",
  "Cerrado": "bg-primary",
  "Perdido": "bg-destructive",
};

export default function Conversations() {
  return (
    <DashboardLayout title="Conversaciones">
      <div className="flex gap-0 h-[calc(100vh-8rem)] animate-fade-in -m-6">
        {/* List */}
        <div className="w-80 border-r bg-card flex flex-col">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input placeholder="Buscar conversaciones..." className="ventrix-input pl-9 text-xs h-8" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((c, i) => (
              <div key={i} className={`flex items-center gap-3 px-4 py-3 border-b cursor-pointer transition-colors ${
                i === 0 ? "bg-accent/50" : "hover:bg-muted/30"
              }`}>
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    {c.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${statusDot[c.status]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0">{c.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{c.preview}</p>
                </div>
                {c.unread > 0 && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground flex-shrink-0">
                    {c.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col bg-background">
          {/* Chat header */}
          <div className="h-14 border-b bg-card flex items-center justify-between px-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">AG</div>
              <div>
                <p className="text-sm font-semibold">Ana García</p>
                <p className="text-[10px] text-muted-foreground">En línea · Lead caliente · Score: 92</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"><Phone className="w-4 h-4 text-muted-foreground" /></button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"><Star className="w-4 h-4 text-muted-foreground" /></button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"><Tag className="w-4 h-4 text-muted-foreground" /></button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "agent" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-md rounded-2xl px-4 py-2.5 text-sm ${
                  m.from === "agent"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border rounded-bl-md"
                }`}>
                  <p>{m.text}</p>
                  <p className={`text-[10px] mt-1 ${m.from === "agent" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          <div className="px-5 pb-2">
            <div className="flex items-center gap-1.5 mb-2">
              <Zap className="w-3 h-3 text-primary" />
              <span className="text-[10px] text-muted-foreground font-medium">Sugerencias IA</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {suggestions.map((s, i) => (
                <button key={i} className="px-3 py-1.5 rounded-full border text-xs hover:bg-accent hover:border-primary/30 transition-colors">{s}</button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-card">
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted"><Paperclip className="w-4 h-4 text-muted-foreground" /></button>
              <input placeholder="Escribe un mensaje..." className="ventrix-input flex-1 text-sm" />
              <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted"><Smile className="w-4 h-4 text-muted-foreground" /></button>
              <button className="ventrix-btn-primary h-8 w-8 flex items-center justify-center p-0"><Send className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Right panel - Lead info */}
        <div className="w-72 border-l bg-card p-5 overflow-y-auto hidden xl:block">
          <div className="text-center mb-5">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 text-xl font-semibold text-primary">AG</div>
            <p className="font-display font-semibold">Ana García</p>
            <p className="text-xs text-muted-foreground">ana@gmail.com</p>
            <p className="text-xs text-muted-foreground">+52 55 1234 5678</p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Información</p>
              <div className="space-y-2">
                {[
                  { label: "Estado", value: "Interesado" },
                  { label: "Score", value: "92" },
                  { label: "Prob. cierre", value: "88%" },
                  { label: "Valor", value: "$3,200" },
                  { label: "Fuente", value: "Instagram Ads" },
                  { label: "Asesor", value: "María R." },
                ].map((f, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{f.label}</span>
                    <span className="font-medium">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Etiquetas</p>
              <div className="flex flex-wrap gap-1">
                {["Premium", "Instagram", "WhatsApp", "Descuento"].map(t => (
                  <span key={t} className="ventrix-badge ventrix-badge-success text-[10px]">{t}</span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Acciones</p>
              <div className="space-y-1.5">
                <button className="ventrix-btn-secondary w-full h-8 text-xs">Programar seguimiento</button>
                <button className="ventrix-btn-secondary w-full h-8 text-xs">Asignar a asesor</button>
                <button className="ventrix-btn-secondary w-full h-8 text-xs">Marcar como cerrado</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
