
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import DeviceAddPage from "./pages/DeviceAddPage";
import Reports from "./pages/Reports";
import Customers from "./pages/Customers";
import Suppliers from "./pages/Suppliers";
import Sales from "./pages/Sales";
import Expenses from "./pages/Expenses";
import Settings from "./pages/Settings"; // Nova página de configurações
import NotFound from "./pages/NotFound";

function App() {
  // Create a client for React Query with consistent configuration
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1
      }
    }
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/devices/add" element={<DeviceAddPage />} />
            <Route path="/devices/:id" element={<DeviceAddPage />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/settings" element={<Settings />} /> {/* Nova rota de configurações */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
