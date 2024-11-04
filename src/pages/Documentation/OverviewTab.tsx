import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const OverviewTab = () => {
  const { t } = useTranslation(["docs"]);
  
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{t("docs:overview.title")}</h2>
      <p className="text-gray-700 leading-relaxed">
        {t("docs:overview.description")}
      </p>
    </Card>
  );
};

export default OverviewTab;