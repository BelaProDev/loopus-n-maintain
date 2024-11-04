import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Settings } from "lucide-react";

const AdminTab = () => {
  const { t } = useTranslation(["docs"]);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">{t("docs:admin.title")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Business Tools</h3>
          <ul className="space-y-3 text-gray-700">
            {["management", "tracking", "invoice", "rating"].map((tool) => (
              <li key={tool} className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                {t(`docs:admin.business.${tool}`)}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default AdminTab;