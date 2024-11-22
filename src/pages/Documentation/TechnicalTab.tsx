import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Code2, Database, Layout, Server } from "lucide-react";

const TechnicalTab = () => {
  const { t } = useTranslation(["docs"]);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">{t("docs:technical.title")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Server className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">{t("docs:technical.stack.title")}</h3>
          </div>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-2">
              <Layout className="h-4 w-4 text-primary" />
              {t("docs:technical.stack.frontend")}
            </li>
            <li className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              {t("docs:technical.stack.query")}
            </li>
            <li className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              {t("docs:technical.stack.storage")}
            </li>
          </ul>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">{t("docs:technical.features.title")}</h3>
          </div>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              {t("docs:technical.features.responsive")}
            </li>
            <li className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              {t("docs:technical.features.offline")}
            </li>
            <li className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              {t("docs:technical.features.realtime")}
            </li>
            <li className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              {t("docs:technical.features.secure")}
            </li>
            <li className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              {t("docs:technical.features.i18n")}
            </li>
          </ul>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">{t("docs:technical.database.title")}</h3>
          </div>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              {t("docs:technical.database.fauna")}
            </li>
            <li className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              {t("docs:technical.database.queries")}
            </li>
            <li className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              {t("docs:technical.database.caching")}
            </li>
            <li className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              {t("docs:technical.database.sync")}
            </li>
          </ul>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Server className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">{t("docs:technical.pwa.title")}</h3>
          </div>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              {t("docs:technical.pwa.offline")}
            </li>
            <li className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              {t("docs:technical.pwa.notifications")}
            </li>
            <li className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              {t("docs:technical.pwa.workers")}
            </li>
            <li className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              {t("docs:technical.pwa.storage")}
            </li>
            <li className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              {t("docs:technical.pwa.updates")}
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default TechnicalTab;