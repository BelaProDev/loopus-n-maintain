import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Code2 } from "lucide-react";

const TechnicalTab = () => {
  const { t } = useTranslation(["docs"]);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Technical Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">PWA Features</h3>
          <ul className="space-y-3 text-gray-700">
            {["offline", "notifications", "workers", "storage", "updates"].map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                {t(`docs:technical.pwa.${feature}`)}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default TechnicalTab;