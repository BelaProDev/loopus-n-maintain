import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { 
  Settings, 
  Users, 
  FileText, 
  Mail, 
  Database,
  Shield,
  Store,
  MessageSquare
} from "lucide-react";

const AdminTab = () => {
  const { t } = useTranslation(["docs"]);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">{t("docs:features.admin.title")}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Authentication & Authorization
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li>Secure admin authentication</li>
            <li>Role-based access control</li>
            <li>Session management</li>
            <li>Security audit logs</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            Business Management
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li>Client management</li>
            <li>Provider management</li>
            <li>Invoice generation & tracking</li>
            <li>Business analytics</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Data Management
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li>FaunaDB integration</li>
            <li>Redux state management</li>
            <li>Data backup & recovery</li>
            <li>Cache management</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Document Management
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li>Dropbox integration</li>
            <li>File organization</li>
            <li>Document search</li>
            <li>Version control</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Communication Tools
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li>Email management</li>
            <li>Contact forms</li>
            <li>Notification system</li>
            <li>Automated responses</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Site Configuration
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li>WhatsApp integration</li>
            <li>Logo management</li>
            <li>Navigation settings</li>
            <li>Internationalization</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default AdminTab;