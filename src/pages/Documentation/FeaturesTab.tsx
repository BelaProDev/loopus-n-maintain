import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { 
  Globe, 
  Shield, 
  Mail, 
  Building2, 
  FolderOpen,
  Wrench,
  FileText,
  Database,
  Music,
  MessageSquare,
  Image,
  Receipt,
  Settings
} from "lucide-react";

const FeaturesTab = () => {
  const { t } = useTranslation(["docs"]);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">{t("docs:features.title")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Core Platform
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>Role-based authentication with admin and user levels</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>Advanced email management system</span>
            </li>
            <li className="flex items-start gap-2">
              <Building2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>Complete business management suite</span>
            </li>
            <li className="flex items-start gap-2">
              <Database className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>FaunaDB integration with optimized queries</span>
            </li>
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            Maintenance Services
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Electrical Systems Management
            </li>
            <li className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Plumbing Services
            </li>
            <li className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Professional Ironwork
            </li>
            <li className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Expert Woodworking
            </li>
            <li className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Architectural Consulting
            </li>
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Digital Tools
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              Advanced Document Management with Dropbox Integration
            </li>
            <li className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Interactive System Diagrams
            </li>
            <li className="flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              Professional Audio Processing Studio
            </li>
            <li className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Real-time Chat System
            </li>
            <li className="flex items-center gap-2">
              <Image className="h-5 w-5 text-primary" />
              Photo Gallery Management
            </li>
            <li className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Complete Invoice Management
            </li>
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Admin Features
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Comprehensive Site Settings
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Email System Management
            </li>
            <li className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Business Operations Control
            </li>
            <li className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Message Center Management
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default FeaturesTab;