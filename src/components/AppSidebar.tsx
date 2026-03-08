import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, MessageSquare, Bot, RefreshCw,
  Upload, Megaphone, Target, Lightbulb, TrendingUp, BarChart3,
  Settings, Zap
} from "lucide-react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Leads", icon: Users, path: "/leads" },
  { label: "Conversaciones", icon: MessageSquare, path: "/conversations" },
  { label: "Chatbot IA", icon: Bot, path: "/chatbot" },
  { label: "Recuperación", icon: RefreshCw, path: "/recovery" },
  { label: "Campañas", icon: Megaphone, path: "/campaigns" },
  { label: "Importar CSV", icon: Upload, path: "/import" },
];

const advancedItems = [
  { label: "Deal Probability", icon: Target, path: "/deal-probability" },
  { label: "Offer Optimizer", icon: Lightbulb, path: "/offer-optimizer" },
  { label: "Revenue Intelligence", icon: TrendingUp, path: "/revenue-intelligence" },
  { label: "Revenue Reports", icon: BarChart3, path: "/revenue-reports" },
];

const bottomItems = [
  { label: "Configuración", icon: Settings, path: "/settings" },
];

export function AppSidebar() {
  const location = useLocation();

  const renderItem = (item: typeof navItems[0]) => {
    const active = location.pathname === item.path;
    return (
      <Link
        key={item.path}
        to={item.path}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        }`}
      >
        <item.icon className="h-4 w-4 flex-shrink-0" />
        <span>{item.label}</span>
        {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary" />}
      </Link>
    );
  };

  return (
    <aside className="w-60 bg-sidebar flex flex-col border-r border-sidebar-border flex-shrink-0">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-5 border-b border-sidebar-border">
        <div className="w-7 h-7 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Zap className="w-4 h-4 text-sidebar-primary-foreground" />
        </div>
        <span className="font-display font-bold text-base text-sidebar-accent-foreground tracking-tight">Ventrix</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50 px-3 mb-2">Principal</p>
          {navItems.map(renderItem)}
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50 px-3 mb-2">Inteligencia</p>
          {advancedItems.map(renderItem)}
        </div>
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        {bottomItems.map(renderItem)}
        <div className="flex items-center gap-3 px-3 py-2 mt-2">
          <div className="w-7 h-7 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-xs font-semibold text-sidebar-primary">MR</div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-sidebar-accent-foreground truncate">María Rodríguez</p>
            <p className="text-[10px] text-sidebar-foreground truncate">maria@tienda.co</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
