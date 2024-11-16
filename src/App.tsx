import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/500.css";
import "@fontsource/nunito/600.css";
import "@fontsource/nunito/700.css";

import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from "./contexts/AuthContext";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/sonner";
import "./i18n";

import Index from "./pages/Index";
import Electrics from "./pages/Electrics";
import Plumbing from "./pages/Plumbing";
import Ironwork from "./pages/Ironwork";
import Woodwork from "./pages/Woodwork";
import Architecture from "./pages/Architecture";
import Login from "./pages/Login";
import Koalax from "./pages/Koalax";
import Documentation from "./pages/Documentation";
import EmailManagement from "./pages/Koalax/components/email/EmailManagement";
import SiteSettings from "./pages/Koalax/SiteSettings";
import BusinessManagement from "./pages/Koalax/components/BusinessManagement";
import MessageManagement from "./pages/Koalax/components/messages/MessageManagement";
import DropboxExplorer from "./pages/DropboxExplorer";
import DropboxCallback from "./pages/DropboxExplorer/components/DropboxCallback";

// Import new tool pages
import Documents from "./pages/tools/Documents";
import Diagrams from "./pages/tools/Diagrams";
import Analytics from "./pages/tools/Analytics";
import Audio from "./pages/tools/Audio";
import Invoicing from "./pages/tools/Invoicing";

const queryClient = new QueryClient();

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <div className="flex flex-col min-h-screen">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                
                {/* Service Routes */}
                <Route path="/electrics" element={<Electrics />} />
                <Route path="/plumbing" element={<Plumbing />} />
                <Route path="/ironwork" element={<Ironwork />} />
                <Route path="/woodwork" element={<Woodwork />} />
                <Route path="/architecture" element={<Architecture />} />
                
                {/* Tool Routes */}
                <Route path="/documents" element={<Documents />} />
                <Route path="/diagrams" element={<Diagrams />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/audio" element={<Audio />} />
                <Route path="/invoicing" element={<Invoicing />} />
                
                {/* Admin Routes */}
                <Route path="/docs" element={<Documentation />} />
                <Route path="/dropbox-explorer" element={<DropboxExplorer />} />
                <Route path="/dropbox-explorer/callback" element={<DropboxCallback />} />
                <Route path="/koalax" element={<Koalax />}>
                  <Route index element={<EmailManagement />} />
                  <Route path="emails" element={<EmailManagement />} />
                  <Route path="settings" element={<SiteSettings />} />
                  <Route path="business" element={<BusinessManagement />} />
                  <Route path="messages" element={<MessageManagement />} />
                </Route>
              </Routes>
            </div>
            <ReactQueryDevtools />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;