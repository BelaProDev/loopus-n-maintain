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
import DropboxExplorer from "./pages/DropboxExplorer";
import DropboxCallback from "./pages/DropboxExplorer/components/DropboxCallback";

// Import tool pages
import Documents from "./pages/tools/Documents";
import Diagrams from "./pages/tools/Diagrams";
import Analytics from "./pages/tools/Analytics";
import Audio from "./pages/tools/Audio";
import Invoicing from "./pages/tools/Invoicing";
import Chat from "./pages/tools/Chat";
import PhotoGallery from "./pages/tools/PhotoGallery";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
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
                      <Route path="/electrics" element={
                        <AsyncComponent>
                          <Electrics />
                        </AsyncComponent>
                      } />
                      <Route path="/plumbing" element={
                        <AsyncComponent>
                          <Plumbing />
                        </AsyncComponent>
                      } />
                      <Route path="/ironwork" element={
                        <AsyncComponent>
                          <Ironwork />
                        </AsyncComponent>
                      } />
                      <Route path="/woodwork" element={
                        <AsyncComponent>
                          <Woodwork />
                        </AsyncComponent>
                      } />
                      <Route path="/architecture" element={
                        <AsyncComponent>
                          <Architecture />
                        </AsyncComponent>
                      } />
                      
                      {/* Tool Routes */}
                      <Route path="/documents" element={
                        <AsyncComponent>
                          <Documents />
                        </AsyncComponent>
                      } />
                      <Route path="/diagrams" element={
                        <AsyncComponent>
                          <Diagrams />
                        </AsyncComponent>
                      } />
                      <Route path="/analytics" element={
                        <AsyncComponent>
                          <Analytics />
                        </AsyncComponent>
                      } />
                      <Route path="/audio" element={
                        <AsyncComponent>
                          <Audio />
                        </AsyncComponent>
                      } />
                      <Route path="/invoicing" element={
                        <AsyncComponent>
                          <Invoicing />
                        </AsyncComponent>
                      } />
                      <Route path="/chat" element={
                        <AsyncComponent>
                          <Chat />
                        </AsyncComponent>
                      } />
                      <Route path="/photo-gallery" element={
                        <AsyncComponent>
                          <PhotoGallery />
                        </AsyncComponent>
                      } />
                      
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
              </DropboxProvider>
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
