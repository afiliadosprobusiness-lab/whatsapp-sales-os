import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { DashboardTopbar } from "./DashboardTopbar";

export function DashboardLayout({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar title={title} />
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
