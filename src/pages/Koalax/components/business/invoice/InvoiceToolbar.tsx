import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";

interface InvoiceToolbarProps {
  onCreateClick: () => void;
  onImportClick: () => void;
}

const InvoiceToolbar = ({ onCreateClick, onImportClick }: InvoiceToolbarProps) => {
  const { t } = useTranslation(["admin"]);

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">{t("admin:business.invoices.title")}</h2>
      <div className="space-x-2">
        <Button onClick={onImportClick} variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Import CSV
        </Button>
        <Button onClick={onCreateClick}>
          <Plus className="w-4 h-4 mr-2" />
          {t("admin:business.invoices.add")}
        </Button>
      </div>
    </div>
  );
};

export default InvoiceToolbar;