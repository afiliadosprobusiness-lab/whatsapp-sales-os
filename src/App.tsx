import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RequireAuth } from "@/guards/RequireAuth";
import { RequireGuest } from "@/guards/RequireGuest";
import { RequireSuperAdmin } from "@/guards/RequireSuperAdmin";
import { AuthProvider } from "@/lib/session";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import InteractiveFunnel from "./pages/InteractiveFunnel";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Conversations from "./pages/Conversations";
import ChatbotAI from "./pages/ChatbotAI";
import Recovery from "./pages/Recovery";
import ImportCSV from "./pages/ImportCSV";
import Campaigns from "./pages/Campaigns";
import DealProbability from "./pages/DealProbability";
import OfferOptimizer from "./pages/OfferOptimizer";
import RevenueIntelligence from "./pages/RevenueIntelligence";
import RevenueReports from "./pages/RevenueReports";
import Settings from "./pages/Settings";
import TasksInbox from "./pages/TasksInbox";
import SuperAdmin from "./pages/SuperAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/quiz" element={<InteractiveFunnel />} />

            <Route element={<RequireGuest />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<RequireSuperAdmin />}>
              <Route path="/superadmin" element={<SuperAdmin />} />
            </Route>

            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/tasks" element={<TasksInbox />} />
              <Route path="/conversations" element={<Conversations />} />
              <Route path="/chatbot" element={<ChatbotAI />} />
              <Route path="/recovery" element={<Recovery />} />
              <Route path="/import" element={<ImportCSV />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/deal-probability" element={<DealProbability />} />
              <Route path="/offer-optimizer" element={<OfferOptimizer />} />
              <Route path="/revenue-intelligence" element={<RevenueIntelligence />} />
              <Route path="/revenue-reports" element={<RevenueReports />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
