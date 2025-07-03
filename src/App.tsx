import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Enhanced from "./pages/Enhanced";
import NotFound from "./pages/NotFound";
import CustomCounterDemo from "./pages/CustomCounterDemo";
import CustomCounterConfig from "./pages/CustomCounterConfig";
import { CustomDemoConfigProvider } from "@/context/CustomDemoConfigContext";

const queryClient = new QueryClient();

const App = () => (
  <CustomDemoConfigProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/enhanced" element={<Enhanced />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/custom-demo" element={<CustomCounterDemo />} />
            <Route path="/custom-config" element={<CustomCounterConfig />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </CustomDemoConfigProvider>
);

export default App;
