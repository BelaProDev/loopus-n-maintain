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
import ErrorBoundary from "./lib/monitoring/ErrorBoundary";
import AsyncComponent from "./components/AsyncComponent";
import { useEffect } from "react";
import "./i18n";
import { DropboxProvider } from "./contexts/DropboxContext";
import { ThemeProvider } from "./components/ThemeProvider";

// Import pages
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
import MessageList from "./pages/Koalax/components/messages/MessageList";
import WhatsAppSettings from "./pages/Koalax/components/WhatsAppSettings";
import LogoSettings from "./pages/Koalax/components/LogoSettings";
import DropboxExplorer from "./pages/DropboxExplorer";
import DropboxCallback from "./pages/DropboxExplorer/components/DropboxCallback";

// Import tool pages
import Documents from "./pages/tools/Documents";
import Diagrams from "./pages/tools/Diagrams";
import Analytics from "./pages/tools/Analytics";
import Audio from "./pages/tools/Audio";
import Chat from "./pages/tools/Chat";
import PhotoGallery from "./pages/tools/PhotoGallery";
import Invoicing from "./pages/tools/Invoicing";

// Import business components
import ClientList from "./pages/Koalax/components/business/ClientList";
import ProviderList from "./pages/Koalax/components/business/ProviderList";
import InvoiceList from "./pages/Koalax/components/business/InvoiceList";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 3,
      refetchOnWindowFocus: true,
    },
  },
});

const App = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('ServiceWorker registration successful');
        }).catch(err => {
          console.error('ServiceWorker registration failed:', err);
        });
      });
    }
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <ThemeProvider>
            <AuthProvider>
              <DropboxProvider>
                <TooltipProvider>
                  <Toaster />
                  <div className="flex flex-col min-h-screen">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/login" element={<Login />} />
                      
                      {/* Service Routes */}
                      <Route path="/electrics" element={<AsyncComponent><Electrics /></AsyncComponent>} />
                      <Route path="/plumbing" element={<AsyncComponent><Plumbing /></AsyncComponent>} />
                      <Route path="/ironwork" element={<AsyncComponent><Ironwork /></AsyncComponent>} />
                      <Route path="/woodwork" element={<AsyncComponent><Woodwork /></AsyncComponent>} />
                      <Route path="/architecture" element={<AsyncComponent><Architecture /></AsyncComponent>} />
                      
                      {/* Tool Routes */}
                      <Route path="/tools">
                        <Route path="documents" element={<AsyncComponent><Documents /></AsyncComponent>} />
                        <Route path="diagrams" element={<AsyncComponent><Diagrams /></AsyncComponent>} />
                        <Route path="analytics" element={<AsyncComponent><Analytics /></AsyncComponent>} />
                        <Route path="audio" element={<AsyncComponent><Audio /></AsyncComponent>} />
                        <Route path="chat" element={<AsyncComponent><Chat /></AsyncComponent>} />
                        <Route path="photo-gallery" element={<AsyncComponent><PhotoGallery /></AsyncComponent>} />
                        <Route path="invoicing" element={<AsyncComponent><Invoicing /></AsyncComponent>} />
                      </Route>
                      
                      {/* Admin Routes */}
                      <Route path="/admin" element={<Koalax />}>
                        <Route index element={<EmailManagement />} />
                        <Route path="emails" element={<EmailManagement />} />
                        <Route path="settings" element={<SiteSettings />}>
                          <Route index element={<WhatsAppSettings />} />
                          <Route path="whatsapp" element={<WhatsAppSettings />} />
                          <Route path="logo" element={<LogoSettings />} />
                        </Route>
                        <Route path="business" element={<BusinessManagement />}>
                          <Route index element={<ClientList />} />
                          <Route path="clients" element={<ClientList />} />
                          <Route path="providers" element={<ProviderList />} />
                          <Route path="invoices" element={<InvoiceList />} />
                        </Route>
                        <Route path="messages" element={<MessageManagement />}>
                          <Route index element={<MessageList service="electrics" />} />
                          <Route path="electrics" element={<MessageList service="electrics" />} />
                          <Route path="plumbing" element={<MessageList service="plumbing" />} />
                          <Route path="ironwork" element={<MessageList service="ironwork" />} />
                          <Route path="woodwork" element={<MessageList service="woodwork" />} />
                          <Route path="architecture" element={<MessageList service="architecture" />} />
                        </Route>
                      </Route>

                      <Route path="/docs" element={<Documentation />} />
                      <Route path="/dropbox-explorer" element={<DropboxExplorer />} />
                      <Route path="/dropbox-explorer/callback" element={<DropboxCallback />} />
                    </Routes>
                  </div>
                  <ReactQueryDevtools />
                </TooltipProvider>
              </DropboxProvider>
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;