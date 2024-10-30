import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import PrivateRoute from "@/components/PrivateRoute";
import ContentEditor from "@/pages/Koalax/ContentEditor";
import SiteSettings from "@/pages/Koalax/SiteSettings";
import EmailManager from "@/pages/Koalax/EmailManager";
import BusinessManager from "@/pages/Koalax/BusinessManager";
import DropboxCallback from "@/pages/Koalax/DropboxCallback";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dropbox/callback" element={<DropboxCallback />} />
            <Route path="/" element={<PrivateRoute />}>
              <Route index element={<Dashboard />} />
              <Route path="content" element={<ContentEditor />} />
              <Route path="settings" element={<SiteSettings />} />
              <Route path="emails" element={<EmailManager />} />
              <Route path="business/*" element={<BusinessManager />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
