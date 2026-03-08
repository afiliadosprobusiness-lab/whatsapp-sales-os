import { DashboardLayout } from "@/components/DashboardLayout";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, ArrowRight, MapPin } from "lucide-react";

const previewData = [
  { nombre: "Ana García", telefono: "+52 55 1234 5678", email: "ana@gmail.com", origen: "Instagram", estado: "válido" },
  { nombre: "Pedro M.", telefono: "+52 33 9876 5432", email: "pedro@hot.com", origen: "Facebook", estado: "válido" },
  { nombre: "Laura S.", telefono: "sin formato", email: "laura@emp.co", origen: "Referido", estado: "advertencia" },
  { nombre: "", telefono: "+57 310 456 7890", email: "carlos@gm.com", origen: "WhatsApp", estado: "error" },
  { nombre: "Diana López", telefono: "+52 55 8765 4321", email: "diana@tienda.mx", origen: "Web", estado: "válido" },
];

const fieldMappings = [
  { csv: "nombre_completo", system: "Nombre", matched: true },
  { csv: "telefono_wa", system: "Teléfono", matched: true },
  { csv: "correo", system: "Email", matched: true },
  { csv: "fuente", system: "Origen", matched: true },
  { csv: "fecha_registro", system: "Fecha de registro", matched: false },
  { csv: "notas", system: "Notas", matched: false },
];

export default function ImportCSV() {
  return (
    <DashboardLayout title="Importar CSV">
      <div className="space-y-6 animate-fade-in max-w-5xl">
        {/* Steps */}
        <div className="flex items-center gap-2">
          {["Subir archivo", "Mapear campos", "Validar", "Importar"].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                i < 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>{i + 1}</div>
              <span className={`text-xs font-medium ${i < 2 ? "text-foreground" : "text-muted-foreground"}`}>{step}</span>
              {i < 3 && <ArrowRight className="w-3 h-3 text-muted-foreground mx-1" />}
            </div>
          ))}
        </div>

        {/* Upload area */}
        <div className="ventrix-card border-dashed border-2 p-12 text-center">
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display font-semibold mb-1">Arrastra tu archivo CSV aquí</h3>
          <p className="text-sm text-muted-foreground mb-4">o haz clic para seleccionar un archivo</p>
          <button className="ventrix-btn-primary h-9 px-5 text-sm">Seleccionar archivo</button>
          <p className="text-[10px] text-muted-foreground mt-3">Formatos aceptados: .csv, .xlsx · Máximo 50,000 contactos</p>
        </div>

        {/* File detected */}
        <div className="ventrix-card p-4 flex items-center gap-4">
          <FileSpreadsheet className="w-8 h-8 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium">leads_marzo_2026.csv</p>
            <p className="text-xs text-muted-foreground">2,847 contactos · 6 columnas · 1.2 MB</p>
          </div>
          <span className="ventrix-badge ventrix-badge-success">Archivo válido</span>
        </div>

        {/* Field mapping */}
        <div className="ventrix-card p-5">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Mapeo de campos
          </h3>
          <div className="space-y-2">
            {fieldMappings.map((f, i) => (
              <div key={i} className="flex items-center gap-4 py-2 border-b last:border-0">
                <span className="text-xs font-mono bg-muted px-2 py-1 rounded w-36">{f.csv}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <select className="ventrix-input h-8 text-xs w-44">
                  <option>{f.system}</option>
                </select>
                {f.matched
                  ? <CheckCircle2 className="w-4 h-4 text-primary" />
                  : <AlertCircle className="w-4 h-4 text-warning" />
                }
              </div>
            ))}
          </div>
        </div>

        {/* Preview table */}
        <div className="ventrix-card p-5">
          <h3 className="font-display font-semibold mb-4">Vista previa de datos</h3>
          <table className="ventrix-table">
            <thead><tr><th>Nombre</th><th>Teléfono</th><th>Email</th><th>Origen</th><th>Validación</th></tr></thead>
            <tbody>
              {previewData.map((d, i) => (
                <tr key={i}>
                  <td className={`text-sm ${!d.nombre ? "text-destructive italic" : ""}`}>{d.nombre || "Falta nombre"}</td>
                  <td className={`text-xs ${d.estado === "advertencia" ? "text-warning" : ""}`}>{d.telefono}</td>
                  <td className="text-xs">{d.email}</td>
                  <td><span className="ventrix-badge ventrix-badge-info text-[10px]">{d.origen}</span></td>
                  <td>{d.estado === "válido"
                    ? <CheckCircle2 className="w-4 h-4 text-primary" />
                    : d.estado === "advertencia"
                    ? <AlertCircle className="w-4 h-4 text-warning" />
                    : <AlertCircle className="w-4 h-4 text-destructive" />
                  }</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-primary" /> 2,694 válidos</span>
              <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3 text-warning" /> 98 con advertencias</span>
              <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3 text-destructive" /> 55 con errores</span>
            </div>
            <button className="ventrix-btn-primary h-9 px-5 text-sm">Confirmar importación</button>
          </div>
        </div>

        {/* Post-import */}
        <div className="ventrix-card p-5">
          <h3 className="font-display font-semibold mb-3">¿Qué quieres hacer después?</h3>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { title: "Lanzar campaña de recuperación", desc: "Enviar secuencia de reactivación a los contactos importados" },
              { title: "Segmentar contactos", desc: "Clasificar por origen, interés o fecha para priorizar" },
              { title: "Asignar a asesores", desc: "Distribuir leads entre tu equipo comercial" },
            ].map((a, i) => (
              <button key={i} className="text-left border rounded-xl p-4 hover:border-primary/30 transition-colors">
                <p className="text-sm font-medium mb-1">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
