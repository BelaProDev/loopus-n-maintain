import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Electrics from "./pages/Electrics";
import Plumbing from "./pages/Plumbing";
import Ironwork from "./pages/Ironwork";
import Woodwork from "./pages/Woodwork";
import Architecture from "./pages/Architecture";
import Login from "./pages/Login";
import Koalax from "./pages/Koalax";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/electrics" element={<Electrics />} />
                <Route path="/plumbing" element={<Plumbing />} />
                <Route path="/ironwork" element={<Ironwork />} />
                <Route path="/woodwork" element={<Woodwork />} />
                <Route path="/architecture" element={<Architecture />} />
                <Route path="/koalax" element={<Koalax />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
    <ReactQueryDevtools />
  </QueryClientProvider>
);

export default App;