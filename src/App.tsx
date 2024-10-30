import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/500.css";
import "@fontsource/nunito/600.css";
import "@fontsource/nunito/700.css";

import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./contexts/AuthContext";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/sonner";

import Index from "./pages/Index";
import Electrics from "./pages/Electrics";
import Plumbing from "./pages/Plumbing";
import Ironwork from "./pages/Ironwork";
import Woodwork from "./pages/Woodwork";
import Architecture from "./pages/Architecture";
import Login from "./pages/Login";
import Koalax from "./pages/Koalax";
import Documentation from "./pages/Documentation";
import DropboxCallback from "./pages/Koalax/DropboxCallback";
import { useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/electrics" element={<Electrics />} />
              <Route path="/plumbing" element={<Plumbing />} />
              <Route path="/ironwork" element={<Ironwork />} />
              <Route path="/woodwork" element={<Woodwork />} />
              <Route path="/architecture" element={<Architecture />} />
              <Route path="/docs" element={<Documentation />} />
              
              {/* Protected Routes */}
              <Route path="/koalax-admin" element={
                <ProtectedRoute>
                  <Koalax />
                </ProtectedRoute>
              } />
              <Route path="/koalax-admin/dropbox-callback" element={<DropboxCallback />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <ReactQueryDevtools />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;