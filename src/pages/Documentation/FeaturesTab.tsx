import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Globe, Shield, Mail, Building2, FolderOpen, Wrench } from "lucide-react";

const FeaturesTab = () => {
  const { t } = useTranslation(["docs"]);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">{t("docs:features.title")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Core Platform</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <Globe className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>{t("docs:features.corePlatform.multilanguage")}</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>{t("docs:features.corePlatform.auth")}</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>{t("docs:features.corePlatform.email")}</span>
            </li>
            <li className="flex items-start gap-2">
              <Building2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>{t("docs:features.corePlatform.business")}</span>
            </li>
            <li className="flex items-start gap-2">
              <FolderOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>{t("docs:features.corePlatform.documents")}</span>
            </li>
          </ul>
        </Card>
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Maintenance Services</h3>
          <ul className="space-y-3 text-gray-700">
            {["electrical", "plumbing", "ironwork", "woodworking", "architecture"].map((service) => (
              <li key={service} className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                {t(`docs:features.services.${service}`)}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default FeaturesTab;