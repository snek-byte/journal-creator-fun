
import { ToastProvider, ToastViewport, Toast } from "@/components/ui/toast";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Write from "./pages/Write";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import MemeGenerator from "./pages/MemeGenerator";

const App = () => {
  // Create the query client inside the component to ensure proper React context
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<Write />} />
              <Route path="/index" element={<Navigate to="/" replace />} />
              <Route path="/write" element={<Write />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/meme" element={<MemeGenerator />} />
              <Route path="/journal" element={<Write />} /> {/* Explicit journal route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastViewport />
            <Toaster />
          </ToastProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
