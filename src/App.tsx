
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
import Settings from "./pages/Settings";
import PriceSuggestions from "./pages/PriceSuggestions";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

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
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/devices" element={
                <ProtectedRoute>
                  <Devices />
                </ProtectedRoute>
              } />
              
              <Route path="/devices/add" element={
                <ProtectedRoute>
                  <DeviceAddPage />
                </ProtectedRoute>
              } />
              
              <Route path="/devices/:id" element={
                <ProtectedRoute>
                  <DeviceAddPage />
                </ProtectedRoute>
              } />
              
              <Route path="/sales" element={
                <ProtectedRoute>
                  <Sales />
                </ProtectedRoute>
              } />
              
              <Route path="/expenses" element={
                <ProtectedRoute>
                  <Expenses />
                </ProtectedRoute>
              } />
              
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } />
              
              <Route path="/customers" element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              } />
              
              <Route path="/suppliers" element={
                <ProtectedRoute>
                  <Suppliers />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              
              <Route path="/price-suggestions" element={
                <ProtectedRoute>
                  <PriceSuggestions />
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
