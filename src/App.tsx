import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AdminGuard from "./components/admin/AdminGuard";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import FaqsManager from "./pages/admin/FaqsManager";
import PromosManager from "./pages/admin/PromosManager";
import AiInfoManager from "./pages/admin/AiInfoManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminGuard><AdminLayout><Dashboard /></AdminLayout></AdminGuard>} />
          <Route path="/admin/faqs" element={<AdminGuard><AdminLayout><FaqsManager /></AdminLayout></AdminGuard>} />
          <Route path="/admin/promos" element={<AdminGuard><AdminLayout><PromosManager /></AdminLayout></AdminGuard>} />
          <Route path="/admin/ai-info" element={<AdminGuard><AdminLayout><AiInfoManager /></AdminLayout></AdminGuard>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
