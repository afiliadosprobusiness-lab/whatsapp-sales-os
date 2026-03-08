import { Search, Bell, ChevronDown, Plus } from "lucide-react";

export function DashboardTopbar({ title }: { title: string }) {
  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="font-display font-semibold text-lg">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar leads, conversaciones..."
            className="ventrix-input h-8 w-64 pl-9 text-xs"
          />
        </div>

        {/* Workspace */}
        <button className="ventrix-btn-secondary h-8 px-3 text-xs flex items-center gap-1.5">
          Mi Tienda Online
          <ChevronDown className="h-3 w-3" />
        </button>

        {/* New action */}
        <button className="ventrix-btn-primary h-8 px-3 text-xs flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Nuevo Lead
        </button>

        {/* Notifications */}
        <button className="relative h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
          MR
        </div>
      </div>
    </header>
  );
}
