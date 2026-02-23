import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function RequireSetup({ children }: { children: React.ReactNode }) {
  const done = localStorage.getItem("onboarding_complete") === "true";
  const hasKeys = !!localStorage.getItem("notion_api_key") && !!localStorage.getItem("notion_database_id");
  if (!done || !hasKeys) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function RedirectIfSetup({ children }: { children: React.ReactNode }) {
  const done = localStorage.getItem("onboarding_complete") === "true";
  const hasKeys = !!localStorage.getItem("notion_api_key") && !!localStorage.getItem("notion_database_id");
  if (done && hasKeys) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RedirectIfSetup><Onboarding /></RedirectIfSetup>} />
          <Route path="/dashboard" element={<RequireSetup><Index /></RequireSetup>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
